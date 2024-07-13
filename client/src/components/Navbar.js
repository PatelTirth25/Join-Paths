"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { gql, useQuery } from "@apollo/client"
import { useState } from "react"
import jwt from 'jsonwebtoken'


const query = gql`
  query{
    getUsers{
      id
      name
    }
  }
`



export default function Navbar() {

  const tok = localStorage.getItem('auth-token')
  const token = JSON.parse(tok)
  let Tokendata = jwt.decode(token)

  const { data } = useQuery(query)
  const { data: session } = useSession()
  const name = session?.user?.name || ''
  const [searchResult, setSearchResult] = useState([])

  function removeToken() {
    localStorage.removeItem("auth-token");
  }

  const handleCloseAll = () => {
    document.getElementById("search").value = "";
    setSearchResult([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const findUsers = data.getUsers.filter(item => item.name.toLowerCase().includes(e.target.search.value.toLowerCase()))
    const newfindUsers = findUsers.filter(item => item.id != Tokendata.id)

    setSearchResult(newfindUsers)
  }

  return (
    <nav className="flex justify-between items-center text-white p-5 rounded-lg mx-32 my-5">
      <div>
        <span className="text-lg font-semibold">Welcome, </span>
        <Link href="/profile" className="text-gray-400 hover:underline hover:underline-offset-4 text-xl">{name}</Link>
      </div>
      <div>
        <ul className="flex gap-10">
          <li>
            <Link href="/newpost" className="text-lg  hover:underline hover:underline-offset-4 text-gray-400 hover:text-gray-300">For You</Link>
          </li>
          <li>
            <Link href="/mypost" className="text-lg text-gray-400 hover:text-gray-300 hover:underline hover:underline-offset-4 ">By You</Link>
          </li>
          <li>
            <Link href="/createpost" className="text-lg text-gray-400 hover:text-gray-300 hover:underline hover:underline-offset-4 ">Create Post</Link>
          </li>
        </ul>
      </div>
      <div className="flex gap-14 justify-around">
        <form onSubmit={(e) => handleSubmit(e)} className=" relative">
          <div className="relative">
            <input type="search" id="search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-black focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 focus:outline-none font-medium rounded-lg text-sm px-4 py-1 ">Go</button>
          </div>
          <div className="text-xl flex flex-col text-gray-200 w-full bg-gray-950 my-3 rounded-2xl text-center  absolute z-10 ">
            {searchResult.length > 0 && searchResult.map((item) => {
              return (
                <Link onClick={handleCloseAll} href={`/user/${item.id}`} key={item.id} className="hover:underline py-3 hover:underline-offset-4">{item.name}</Link>
              )
            })

            }
            {searchResult.length > 0 &&
              <div className="text-red-700 cursor-pointer hover:text-red-300 py-3" onClick={() => handleCloseAll()}>Close All</div>
            }
          </div>
        </form>
        {session ? (
          <button
            onClick={() => {
              removeToken();
              signOut();
            }}
            className="hover:text-red-300 text-white py-2 px-4 rounded-xl"
          >
            <Link href="/login">LogOut</Link>
          </button>
        ) : (
          <button className=" hover:text-green-300 text-white py-2 px-4 rounded">
            <Link href="/login">LogIn</Link>
          </button>
        )}
      </div>
    </nav>
  )
}
