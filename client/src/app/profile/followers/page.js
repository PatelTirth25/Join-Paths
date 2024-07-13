"use client"
import { useQuery, useMutation, gql } from "@apollo/client"
import jwt from 'jsonwebtoken'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const updateFollow = gql`
  mutation($data: ID!) {
    follow(id: $data) 
  }
`

const query = gql`
  query($data: ID!) {
    getUser(id: $data) {
     totalFollowers
      totalFollowing
     followers {
       name
       id
     }
      following {
       name
       id
     }
    }
  }
`;

export default function Followers() {
  const router = useRouter()
  const [followers, setFollowers] = useState(null)
  const tok = localStorage.getItem('auth-token')
  const token = JSON.parse(tok)
  let Tokendata = jwt.decode(token)
  const id = Tokendata.id
  const { data } = useQuery(query, {
    variables: {
      data: id
    }
  })

  const [follow] = useMutation(updateFollow)


  function checkFollowing(id) {
    const findOne = data?.getUser?.following.find(item => item.id == id)
    if (findOne) {
      return true
    }
    else {
      return false
    }
  }

  useEffect(() => {
    if (data?.getUser?.followers) {
      setFollowers(data?.getUser?.followers)
    }
  }, [data])

  const handleFollow = async (id) => {
    await follow({ variables: { data: id } })

    const d = document.getElementById(id).innerHTML
    if (d == 'Follow') {
      document.getElementById(id).innerHTML = 'Un Follow'
    }
    else {
      document.getElementById(id).innerHTML = 'Follow'
    }
  }

  const handleUser = (id) => {
    router.push('/user/' + id)
  }

  if (followers == null) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-3 gap-8 mx-32">
      {followers.length == 0 ? <p>No followers</p> :
        followers.map(item => {
          return (
            <div key={item.id} className="max-w-sm w-[90%] h-[100%] lg:max-w-full lg:flex bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 flex w-full justify-between leading-normal">
                <h5 onClick={() => handleUser(item.id)} className="hover:cursor-pointer mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.name}</h5>
                <button onClick={() => handleFollow(item.id)} id={item.id} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >{checkFollowing(item.id) ? "Un Follow" : "Follow"}</button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
