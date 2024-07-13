"use client"
import { useMutation, useQuery, gql } from "@apollo/client"
import jwt from 'jsonwebtoken'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const deletePostQuery = gql`
  mutation($data: ID!) {
    deletePost(postId: $data) 
  } 
`

const query = gql`
  query($data: ID!) {
    getPosts(userid: $data) {
      id
      content
      userid
      comments {
        createdat
        comment
        id
        postId
      }
      likes {
        id
        postId
      }
      createdat
      totalLikes
      totalComments
    }
  }
`

export default function Post() {
  const router = useRouter();
  const [post, setPost] = useState(null);

  const tok = localStorage.getItem('auth-token');
  const token = tok ? JSON.parse(tok) : null;
  const Tokendata = token ? jwt.decode(token) : null;
  const id = Tokendata ? Tokendata.id : null;


  const [deletePost] = useMutation(deletePostQuery);
  const { refetch: refetchUserDate } = useQuery(query)
  const { data } = useQuery(query, {
    variables: { data: id },
    skip: !id,
  });

  useEffect(() => {
    if (data?.getPosts) {
      setPost(data.getPosts);
    }
  }, [data]);

  const handlePost = (id) => {
    router.push(`/post/${id}`)
  }

  const handleDelete = async (id) => {
    const answer = confirm("Are you sure you want to delete this post?");
    if (!answer) {
      return;
    }

    try {
      await deletePost({ variables: { data: id } })
      const newData = await refetchUserDate({ data: Tokendata.id })
      if (newData?.data?.getPosts)
        setPost(newData.data.getPosts)
    } catch (error) {
      console.log(error)
    }

  }

  if (!post) {
    return <div>Loading...</div>
  }
  return (
    <div className=" container mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
      {post.map(item => {
        return (
          <div key={item.id} onClick={() => handlePost(item.id)}>
            <div className="hover:cursor-pointer max-w-sm w-[90%] h-[100%] hover:bg-black hover:border-white hover:border lg:max-w-full lg:flex bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="w-full p-4 flex flex-col justify-between leading-normal">
                <div className="mb-8">
                  <div className="text-white font-bold text-xl mb-2">{item.content}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-gray-400 leading-none">Posted on {new Date(item.createdat).toLocaleDateString()}</p>
                    <p className="text-gray-400">Comments: {item.totalComments}</p>
                    <p className="text-gray-400">Likes: {item.totalLikes}</p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

}
