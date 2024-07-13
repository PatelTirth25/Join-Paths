"use client"
import Image from "next/image"
import user from '../../../public/user.png'
import Link from "next/link"
import { gql, useQuery, useMutation } from "@apollo/client"
import jwt from 'jsonwebtoken'
import { useState } from "react"

const query = gql`
  query($data: ID!) {
    getUser(id: $data) {
     image
     description
     id
     name
     totalFollowing
     totalFollowers
     createdat
    }
  }
`;

const update = gql`
mutation($data: UpdateInput!) {
  updateProfile(data: $data) {
    image
    name
  }
}
`

export default function Profile() {

  const tok = localStorage.getItem('auth-token')
  const token = JSON.parse(tok)
  let Tokendata = jwt.decode(token)
  const id = Tokendata.id
  const userData = useQuery(query, {
    variables: {
      data: id
    }
  })
  const name = userData.data?.getUser?.name || ''
  const email = userData.data?.getUser?.email || ''
  const followers = userData.data?.getUser?.totalFollowers
  const following = userData.data?.getUser?.totalFollowing
  const joinedAt = userData.data?.getUser?.createdat
  const descri = userData.data?.getUser?.description
  const img = userData.data?.getUser?.image || user
  const [Name, setName] = useState('')
  const [ImgUrl, setImgUrl] = useState('')
  const [desc, setDesc] = useState('')

  const [updateProfile] = useMutation(update);

  const handleSubmit = async (e) => {
    try {

      if (desc == '' && ImgUrl == '' && Name == '') {
        throw new Error("Nothing to update!")
      }
      else {
        try {
          const { data } = await updateProfile({
            variables: {
              data: {
                name: Name,
                image: ImgUrl,
                description: desc
              },
            },
          });


          setImgUrl('');
          setName('');

        } catch (err) {
          console.error(err);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="grid grid-cols-2 ">
      <main className=" min-h-screen py-10">
        <h1 className="text-center font-semibold text-3xl text-white mb-10 underline underline-offset-8 ">Your Profile</h1>
        <div className="flex flex-col items-center md:flex-row md:justify-center gap-20 mx-5 md:mx-32">
          <div className="flex flex-col items-center text-white">
            <Image
              src={img}
              className="rounded-[50%] border-4 border-gray-700 shadow-lg"
              width={200}
              height={200}
              alt="User Image"
            />
            <ul className="mt-5 text-lg space-y-2 text-center">
              <li className="font-bold text-2xl">{name}</li>
              <li className="text-gray-300 text-lg">{email}</li>
              <li className="text-gray-400 text-base">Joined: {new Date(joinedAt).toLocaleDateString()}</li>
            </ul>
          </div>
          <div className="text-white text-xl space-y-5">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-5 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
              <Link href="/profile/followers">
                <h2 className="font-semibold mb-3 border-b border-gray-600 pb-2">Followers</h2>
                <p>{followers}</p>
              </Link>
            </div>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-5 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
              <Link href="/profile/following">
                <h2 className="font-semibold mb-3 border-b border-gray-600 pb-2">Following</h2>
                <p>{following}</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-xl text-gray-300 mx-5 md:mx-32 my-5 text-center">{descri}</div>
      </main >
      <main className=" min-h-screen flex justify-center py-10">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="rounded-lg shadow-lg w-full max-w-md"
        >
          <h1 className="text-center font-semibold text-3xl text-white mb-10 underline underline-offset-8 ">Update Profile</h1>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-300 mb-2">Profile Image Url</label>
            <input
              type="url"
              id="image"
              placeholder="Enter your image url"
              onChange={(e) => setImgUrl(e.target.value)}
              className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-300 mb-2">Description</label>
            <textarea
              type="text"
              rows="10"
              id="description"
              placeholder="Change Description (1000 characters max)"
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Update
          </button>
        </form>
      </main>
    </div >

  );
}
