import checkAuth from "../../utils/checkAuth.js"

export default {
    Post: {
        comments: async (parent, _, context) => {
            const id = parent.id
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (id == '') {
                throw new Error('Please provide id')
            }
            try {
                const res = await context.db(`SELECT * FROM comments WHERE postid = $1`, [id])
                const output = []
                for (let i = 0; i < res.length; i++) {
                    output.push({
                        id: res[i].id,
                        comment: res[i].comment,
                        userId: res[i].userid,
                        createdat: res[i].createdat.toString(),
                        postId: res[i].postid
                    })
                }
                return output
            } catch (err) {
                throw new Error(err)
            }
        },
        likes: async (parent, _, context) => {
            const id = parent.id
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (id == '') {
                throw new Error('Please provide id')
            }
            try {
                const res = await context.db(`SELECT * FROM likes WHERE postid = $1`, [id])
                const output = []
                for (let i = 0; i < res.length; i++) {
                    output.push({
                        id: res[i].id,
                        userId: res[i].userid,
                        postId: res[i].postid
                    })
                }
                return output
            } catch (err) {
                throw new Error(err)
            }
        },
        totalComments: async (parent, _, context) => {
            const id = parent.id
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (id == '') {
                throw new Error('Please provide id')
            }
            try {
                const res = await context.db(`SELECT * FROM comments WHERE postid = $1`, [id])
                return res.length
            } catch (err) {
                throw new Error(err)
            }
        }
    },
    Query: {
        getPosts: async (_, { userid }, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (userid.trim() == '') {
                throw new Error('Please provide userid')
            }
            try {
                const res = await context.db(`SELECT * FROM posts WHERE userid = $1`, [userid])
                const output = []
                for (let i = 0; i < res.length; i++) {
                    output.push({
                        id: res[i].id,
                        userid: res[i].userid,
                        content: res[i].content,
                        createdat: res[i].createdat.toString(),
                        totalLikes: res[i].likes
                    })
                }
                return output
            } catch (err) {
                throw new Error(err)
            }
        },
        getPost: async (_, { id }, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }

            if (id.trim() == '') {
                throw new Error('Please provide id')
            }
            try {
                const res = await context.db(`SELECT * FROM posts WHERE id = $1`, [id])
                return {
                    id: res[0].id,
                    userid: res[0].userid,
                    content: res[0].content,
                    createdat: res[0].createdat.toString(),
                    totalLikes: res[0].likes
                }
            } catch (err) {
                console.log(err)
                throw new Error(err)
            }
        }
    },
    Mutation: {
        addPost: async (_, { content }, context) => {
            console.log("content: ", content)
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            const userid = auth.user.id
            if (content.trim() == '') {
                throw new Error('Please provide proper credentials')
            }
            try {
                await context.db(`INSERT INTO posts (userid, content,createdat) VALUES ($1, $2, $3)`, [userid, content, new Date()])
                const res = await context.db(`SELECT * FROM posts WHERE userid = $1 AND content = $2`, [userid, content])
                return {
                    id: res[0].id,
                    userid: res[0].userid,
                    content: res[0].content,
                    createdat: res[0].createdat.toString(),
                    totalLikes: res[0].likes
                }
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
        },
        addComment: async (_, { data }, context) => {
            const { comment, postId } = data
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }

            const user = auth.user.id

            if (comment.trim() == '' || postId.trim() == '') {
                throw new Error('Please provide proper credentials')
            }
            try {
                await context.db(`INSERT INTO comments (comment, userid, createdat, postid) VALUES ($1, $2, $3, $4)`, [comment, user, new Date(), postId])
                const res = await context.db(`SELECT * FROM comments WHERE comment = $1 AND userid = $2 AND postid = $3`, [comment, user, postId])
                return {
                    id: res[0].id,
                    comment: res[0].comment,
                    userId: res[0].userid,
                    createdat: res[0].createdat.toString(),
                    postId: res[0].postid
                }
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }

        },
        likePost: async (_, { postId }, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (postId.trim() == '') {
                throw new Error('Please provide proper credentials')
            }
            try {
                const findOne = await context.db(`SELECT * FROM likes WHERE postid = $1 AND userid = $2`, [postId, auth.user.id])
                if (findOne.length > 0) {
                    await context.db(`DELETE FROM likes WHERE postid = $1 AND userid = $2`, [postId, auth.user.id])
                    await context.db(`UPDATE posts SET likes = likes - 1 WHERE id = $1`, [postId])
                    return {
                        id: findOne[0].id,
                        postId: findOne[0].postid,
                        userId: auth.user.id,
                    }
                }
                await context.db(`INSERT INTO likes (postid, userid) VALUES ($1, $2)`, [postId, auth.user.id])
                await context.db(`UPDATE posts SET likes = likes + 1 WHERE id = $1`, [postId])
                const res = await context.db(`SELECT * FROM likes WHERE postid = $1 AND userid = $2`, [postId, auth.user.id])
                return {
                    id: res[0].id,
                    postId: res[0].postid,
                    userId: auth.user.id,
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        deletePost: async (_, { postId }, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (postId.trim() == '') {
                throw new Error('Please provide proper credentials')
            }
            try {
                const find = await context.db(`SELECT * FROM posts WHERE id = $1`, [postId])
                if (find.length == 0) {
                    throw new Error('Post not found')
                }
                if (find[0].userid != auth.user.id) {
                    throw new Error('Unauthorized')
                }
                await context.db(`DELETE FROM comments WHERE postid = $1`, [postId])
                await context.db(`DELETE FROM likes WHERE postid = $1`, [postId])
                await context.db(`DELETE FROM posts WHERE id = $1`, [postId])
                return parseInt(postId)

            } catch (error) {
                throw new Error(error)
            }
        },
        deleteComment: async (_, { commentId }, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (commentId.trim() == '') {
                throw new Error('Please provide proper credentials')
            }
            try {
                const find = await context.db(`SELECT * FROM comments WHERE id = $1`, [commentId])
                if (find.length == 0) {
                    throw new Error('Comment not found')
                }
                if (find[0].userid != auth.user.id) {
                    throw new Error('Unauthorized')
                }
                await context.db(`DELETE FROM comments WHERE id = $1`, [commentId])
                return parseInt(commentId)

            } catch (error) {
                throw new Error(error)
            }
        }
    }
}

