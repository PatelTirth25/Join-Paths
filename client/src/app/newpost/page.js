"use client";
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import jwt from 'jsonwebtoken';
import { useRouter } from "next/navigation";

const userDataQuery = gql`
  query($id: ID!) {
    getUser(id: $id) {
      following {
        id
      }
    }
  }
`;

const query = gql`
  query($id: ID!) {
    getPosts(userid: $id) {
      id
      content
      createdat
      userid
      totalLikes
      totalComments
      comments {
        id
        comment
        createdat
      }
      likes {
        id
      }
    }
  }
`;

export default function NewPost() {
  const router = useRouter();
  const tok = localStorage.getItem('auth-token');
  const token = JSON.parse(tok);
  const TokenData = jwt.decode(token);

  const [allpost, setAllpost] = useState([]);


  const { data: userData, loading: userLoading, error: userError, refetch: refetchUserDate } = useQuery(userDataQuery);

  useEffect(() => {
    const loadData = async (id) => {
      try {
        const { data } = await refetchUserDate({ id });
      } catch (error) {
        console.error("Error loading post data: ", error);
      }
    };
    if (TokenData?.id) {
      loadData(TokenData.id);
    }
  }, [])

  const { refetch: refetchPostDate } = useQuery(query);

  useEffect(() => {
    async function loadData(id) {
      try {
        const { data } = await refetchPostDate({ id });
        const postData = data?.getPosts;

        if (postData) {
          setAllpost((prevPosts) => [...prevPosts, ...postData]);
        }
      } catch (error) {
        console.error("Error loading post data: ", error);
      }
    }

    if (userData?.getUser?.following) {
      userData.getUser.following.forEach((item) => loadData(item.id));
    }
  }, [userData]);

  if (userLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;

  const handlePost = (id) => {
    router.push(`/post/${id}`)
  }

  return (
    <div className=" container mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
      {allpost.map(item => {
        return (
          <div key={item.id} onClick={() => handlePost(item.id)}>
            <div className="hover:cursor-pointer max-w-sm w-[90%] h-[100%] hover:bg-black hover:border-white hover:border lg:max-w-full lg:flex bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 flex flex-col justify-between leading-normal">
                <div className="mb-8">
                  <div className="text-white font-bold text-xl mb-2">{item.content}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-gray-400 leading-none">Posted on {new Date(item.createdat).toLocaleDateString()}</p>
                    <p className="text-gray-400">Comments: {item.totalComments}</p>
                    <p className="text-gray-400">Likes: {item.totalLikes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
