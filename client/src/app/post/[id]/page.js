"use client"
import { useMutation, useQuery, gql } from "@apollo/client"
import { useEffect, useState } from "react";
import jwt from 'jsonwebtoken'
import Image from "next/image";
import hollowHeart from '../../../../public/hollowHeart.png'
import redHeart from '../../../../public/redHeart.png'

const likePostQuery = gql`
    mutation($data: ID!) {
        likePost(postId: $data){
            id
        } 
    }
`

const addCommentQuery = gql`
    mutation($data: CommentInput!) {
        addComment(data: $data) {
            id
            comment
            createdat
            postId
            userId
        }
    }
`

const deleteCommentQuery = gql`
    mutation($data: ID!) {
        deleteComment(commentId: $data) 
    } 
`

const user = gql`
    query($id: ID!) {
        getUser(id: $id) {
            name
        }
    }
`
const query = gql`
    query($id: ID!) {
        getPost(id: $id) {
            content
            createdat
            userid
            totalLikes
            totalComments
            comments{
                id
                comment
                createdat
                userId
            }
            likes {
                id
                userId
            }
        }
    }
`
export default function Post({ params }) {
    const tok = localStorage.getItem('auth-token');
    const token = JSON.parse(tok);
    const TokenData = jwt.decode(token);

    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [userName, setUserName] = useState('')
    const [postLike, setPostLike] = useState(null)
    const [commentUserName, setCommentUserName] = useState({})
    const [likeUserName, setLikUserName] = useState({})


    const [addComment] = useMutation(addCommentQuery)
    const [deleteComment] = useMutation(deleteCommentQuery)
    const [likePost] = useMutation(likePostQuery)
    const { refetch: refetchUser } = useQuery(user);
    const { data, refetch: refetchPostData } = useQuery(query, {
        variables: {
            id: params.id,
        },
    });


    let post = data?.getPost;

    const loadLikeUserName = async (post) => {
        post.likes.forEach(async element => {
            const { data } = await refetchUser({ id: element.userId });
            const gotYou = data?.getUser?.name
            likeUserName[`${element.userId}`] = gotYou
        })
    }


    const loadCommentUserName = async (post) => {
        post.comments.forEach(async element => {
            const { data } = await refetchUser({ id: element.userId });
            const gotYou = data?.getUser?.name
            commentUserName[`${element.userId}`] = gotYou
        })
    }


    useEffect(() => {
        const loadUsername = async (id) => {
            try {
                const { data } = await refetchUser({ id });
                setUserName(data.getUser.name);
            } catch (error) {
                console.error('Error loading username: ', error);
            }
        };

        if (post?.userid) {
            loadUsername(post.userid);
            loadCommentUserName(post);
            loadLikeUserName(post)
        }
    }, [post]);


    const handleDeleteComment = async (id) => {
        const answer = confirm("Are you sure you want to delete this comment?");
        if (!answer) {
            return;
        }
        try {
            await deleteComment({ variables: { data: id } })
            const newData = await refetchPostData({ id: params.id })
            post = newData.data.getPost

        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        const comment = document.getElementById('comment').value
        if (comment != '') {
            try {
                const { data } = await addComment({
                    variables: {
                        data: {
                            comment: comment,
                            postId: params.id
                        }
                    }
                })

                const newData = await refetchPostData({ id: params.id })
                post = newData.data.getPost
            } catch (error) {
                console.log(error)
            }
        }
        document.getElementById('comment').value = ''
    }

    const checkUserComments = (user) => {
        if (user == TokenData.id) {
            return true
        }
        else {
            return false
        }
    }

    const handlePostLike = async (e, id) => {
        e.stopPropagation()
        await likePost({ variables: { data: id } })
        const newData = await refetchPostData({ id: params.id })
        post = newData.data.getPost
        if (postLike) {
            setPostLike(false)
        }
        else {
            setPostLike(true)
        }
    }

    const loadLike = async () => {
        post?.likes.forEach(element => {
            if (element.userId == TokenData.id) {
                setPostLike(true)
            }
        });
    }

    useEffect(() => {
        loadLike()
    }, [post?.likes, data])

    if (!data) {
        return <div>Post not found!</div>
    }


    return (
        <div className="flex justify-around">
            <div className="max-w-3xl w-[50%] my-20 mx-auto bg-gray-900 text-white rounded-lg shadow-md p-6">
                <h1 className="text-gray-400 mb-6 text-2xl">{post.content}</h1>
                <div className="mb-4">
                    <span className="font-semibold">Posted by:</span> {userName}
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Posted on:</span> {new Date(post.createdat).toLocaleDateString()}
                </div>

                <div className="mb-4">
                    <button
                        onClick={() => setShowLikes(!showLikes)}
                        className="text-xl font-semibold bg-gray-800 p-2 rounded-md w-full flex justify-between text-left"
                    >
                        Likes <span onClick={(e) => { handlePostLike(e, params.id) }}>{postLike ? <Image src={redHeart} alt="like" width={20} height={20} /> : <Image src={hollowHeart} alt="like" width={20} height={20} />} </span> <span className="text-gray-400">{post.totalLikes}</span>
                    </button>
                    {showLikes && (
                        <div className="mt-2">
                            {post.likes.map((like, index) => (
                                <p key={index} className="text-gray-300">
                                    {likeUserName[`${like.userId}`]}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="text-xl flex justify-between font-semibold bg-gray-800 p-2 rounded-md w-full text-left"
                    >
                        Comments <span className="text-gray-400">{post.totalComments}</span>
                    </button>
                    {showComments && (
                        <div className="mt-2">
                            {post.comments.map((comment) => {
                                if (checkUserComments(comment.userId)) {

                                    return <div key={comment.id} className="flex justify-between mt-2 p-2 border-b border-white ">
                                        <div>
                                            <p className="text-gray-300">
                                                <span className="font-semibold">{commentUserName[`${comment.userId}`]}:</span> {comment.comment}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(comment.createdat).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="hover:text-red-400 text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                }
                                else {

                                    return <div key={comment.id} className="mt-2 p-2 border-b border-white ">
                                        <p className="text-gray-300">
                                            <span className="font-semibold">{commentUserName[`${comment.userId}`]}:</span> {comment.comment}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(comment.createdat).toLocaleDateString()}
                                        </p>
                                    </div>

                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className="max-w-lg w-[50%] p-6 bg-black mx-auto my-20 text-center border border-gray-200 rounded-lg shadow dark:border-gray-700">
                <div>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Add Comment</h5>
                </div>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <textarea
                        type="text"
                        rows="10"
                        id="comment"
                        placeholder="Enter your comment(300 characters max)"
                        className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </p>
                <button onClick={() => handleSubmit()} className=" inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Comment
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
