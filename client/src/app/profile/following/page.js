"use client"
import { useMutation, useQuery, gql } from "@apollo/client"
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
     totalFollowing
     following {
       name
       id
     }
     followers {
        name
        id
      }
    }
  }
`;

export default function Following() {
  const router = useRouter()
  const [following, setFollowing] = useState(null)
  const tok = localStorage.getItem('auth-token')
  const token = JSON.parse(tok)
  let Tokendata = jwt.decode(token)
  const id = Tokendata.id
  const { data } = useQuery(query, {
    variables: {
      data: id
    }
  })

  useEffect(() => {
    if (data?.getUser?.following) {
      setFollowing(data?.getUser?.following)
    }
  }, [data])

  const checkFollowing = (id) => {
    const findOne = data?.getUser?.followers.find(item => item.id == id)
    if (findOne) {
      return true
    }
    else {
      return false
    }
  }

  const [follow] = useMutation(updateFollow)

  const handleFollowing = async (id) => {
    const { data } = await follow({ variables: { data: id } })

    const filteredData = following.filter(item => item.id != id)
    setFollowing(filteredData)
  }

  if (following == null) {
    return <div>Loading...</div>
  }


  const handleUser = (id) => {
    router.push('/user/' + id)
  }

  return (
    <div className="grid grid-cols-3 gap-8 mx-32">
      {following.length == 0 ? <p>No following</p> :
        following.map(item => {
          return (
            <div key={item.id} className="max-w-sm w-[90%] h-[100%] lg:max-w-full lg:flex bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 flex w-full justify-between leading-normal">
                <h5 onClick={() => handleUser(item.id)} className="hover:cursor-pointer mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.name}</h5>
                <button onClick={() => handleFollowing(item.id)} id={item.id} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" >{checkFollowing(item.id) ? "Un Follow" : "Follow"}</button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
