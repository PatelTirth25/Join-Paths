"use client"
import { gql, useMutation } from '@apollo/client'

const mut = gql`
  mutation($data: String!) {
    addPost(content: $data) {
        id
        content
        userid
        comments {
        createdat
        comment
        id
        postId
      }
        likes{
        id
        postId
      }
        createdat
        totalLikes
        totalComments
    }
  }
`;

export default function CreatePost() {
  const [addPost] = useMutation(mut)

  async function handleSubmit() {
    const cont = document.getElementById('description').value
    if (cont != '') {
      try {
        const { data } = await addPost({
          variables: {
            data: cont
          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    document.getElementById('description').value = ''

  }
  return (
    <div className="max-w-md p-6 bg-black mx-auto my-20 text-center border border-gray-200 rounded-lg shadow dark:border-gray-700">
      <div>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create New Post</h5>
      </div>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        <textarea
          type="text"
          rows="10"
          id="description"
          placeholder="Comment here (1000 characters max)"
          className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </p>
      <button onClick={() => handleSubmit()} className=" inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Create
        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
      </button>
    </div>
  )
}
