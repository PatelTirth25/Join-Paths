"use client"
import { useMutation, gql, useQuery } from "@apollo/client"
import Image from "next/image"
import jwt from 'jsonwebtoken'
import userImg from '../../../../public/user.png'

const updateFollow = gql`
  mutation($data: ID!) {
    follow(id: $data) 
  }
`

const query = gql`
    query($id: ID!) {
        getUser(id: $id) {
            name
            image
            description
            totalFollowers
            totalFollowing
            followers{
                name
                id
            }
            createdat
        }
    }
`

export default function Page({ params }) {

    const { data } = useQuery(query, {
        variables: {
            id: params.id
        }
    })

    const tok = localStorage.getItem('auth-token')
    const token = JSON.parse(tok)
    let Tokendata = jwt.decode(token)

    const [follow] = useMutation(updateFollow)

    if (Tokendata.id == params.id) {
        return <div> You cannot look yourself.</div>
    }


    function checkFollowing() {
        const findOne = data?.getUser?.followers.find(item => item.id == Tokendata.id)
        if (findOne) {
            return true
        }
        else {
            return false
        }
    }

    const handleFollow = async () => {
        await follow({ variables: { data: params.id } })

        const d = document.getElementById('FollowButton').innerHTML
        if (d == 'Follow') {
            document.getElementById('FollowButton').innerHTML = 'Un Follow'
        }
        else {
            document.getElementById('FollowButton').innerHTML = 'Follow'
        }
    }


    if (data?.getUser) {
        const user = data.getUser
        console.log(user)

        return (
            <div className="flex items-center flex-col">
                <div className=" md:max-w-2xl lg:max-w-4xl mx-auto border-b border-white text-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 flex justify-around gap-20 md:p-8 lg:p-12">
                        <div className="flex items-center justify-center md:justify-start">
                            <div className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 relative">
                                <Image
                                    className="rounded-[30%]"
                                    src={user.image || userImg}
                                    alt={user.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                        <div className="text-center md:text-left mt-4">
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">{user.name}</h2>
                            <p className="text-gray-400 md:text-lg lg:text-xl">{user.description}</p>
                            <div className="mt-4 md:mt-6">
                                <span className="font-semibold">Followers:</span> {user.totalFollowers}
                            </div>
                            <div className="mt-1 md:mt-2">
                                <span className="font-semibold">Following:</span> {user.totalFollowing}
                            </div>
                            <div className="mt-1 md:mt-2">
                                <span className="font-semibold">Joined:</span> {new Date(user.createdat).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button id="FollowButton" className="my-10 py-3 hover:bg-gray-300 px-20 bg-white text-black rounded-lg" onClick={() => handleFollow()}>{checkFollowing() ? 'Un Follow' : 'Follow'}</button>
                </div>
            </div>
        )
    }
    else {
        return <div>No user found!</div>
    }

}
