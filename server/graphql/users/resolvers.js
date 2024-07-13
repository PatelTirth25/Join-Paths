import jwt from 'jsonwebtoken'
import checkAuth from '../../utils/checkAuth.js'
import dotenv from 'dotenv'
dotenv.config()

export default {
    User: {
        async totalFollowing(parent, _, context) {
            const id = parent.id
            const res = await context.db(`SELECT * FROM users WHERE id = $1`, [id])
            return res[0].following
        },
        async totalFollowers(parent, _, context) {
            const id = parent.id
            const res = await context.db(`SELECT * FROM users WHERE id = $1`, [id])
            return res[0].followers
        },
        async following(parent, _, context) {
            const id = parent.id
            const followId = await context.db(`SELECT * FROM follow WHERE userid = $1`, [id])
            const output = []
            for (let i = 0; i < followId.length; i++) {
                let res = await context.db(`SELECT * FROM users WHERE id = $1`, [followId[i].followid])
                output.push({
                    id: res[0].id,
                    name: res[0].name,
                })
            }
            return output
        },
        async followers(parent, _, context) {
            const id = parent.id
            const followId = await context.db(`SELECT * FROM follow WHERE followid = $1`, [id])
            const output = []
            for (let i = 0; i < followId.length; i++) {
                let res = await context.db(`SELECT * FROM users WHERE id = $1`, [followId[i].userid])
                output.push({
                    id: res[0].id,
                    name: res[0].name,
                })
            }
            return output
        }
    },

    fetchUser: {
        async totalFollowing(parent, _, context) {
            const id = parent.id
            const res = await context.db(`SELECT * FROM users WHERE id = $1`, [id])
            return res[0].following
        },
        async totalFollowers(parent, _, context) {
            const id = parent.id
            const res = await context.db(`SELECT * FROM users WHERE id = $1`, [id])
            return res[0].followers
        },
        async following(parent, _, context) {
            const id = parent.id
            const followId = await context.db(`SELECT * FROM follow WHERE userid = $1`, [id])
            const output = []
            for (let i = 0; i < followId.length; i++) {
                let res = await context.db(`SELECT * FROM users WHERE id = $1`, [followId[i].followid])
                output.push({
                    id: res[0].id,
                    name: res[0].name,
                })
            }
            return output
        },
        async followers(parent, _, context) {
            const id = parent.id
            const followId = await context.db(`SELECT * FROM follow WHERE followid = $1`, [id])
            const output = []
            for (let i = 0; i < followId.length; i++) {
                let res = await context.db(`SELECT * FROM users WHERE id = $1`, [followId[i].userid])
                output.push({
                    id: res[0].id,
                    name: res[0].name,
                })
            }
            return output
        }
    },
    Query: {
        getUser: async (_, { id }, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (id.trim() == '') {
                throw new Error('Please provide id')
            }
            try {
                const output = await context.db(`SELECT * FROM users WHERE id = $1`, [id])
                const res = output[0]
                return {
                    id: res.id,
                    name: res.name,
                    image: res.image,
                    createdat: res.createdat.toString(),
                    description: res.description
                }
            } catch (err) {
                throw new Error(err)
            }
        },
        getUsers: async (_, __, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            try {
                const output = await context.db(`SELECT * FROM users`, [])
                const res = []
                for (let i = 0; i < output.length; i++) {
                    res.push({
                        id: output[i].id,
                        name: output[i].name,
                        image: output[i].image,
                        createdat: output[i].createdat.toString(),
                        description: output[i].description
                    })
                }
                return res
            } catch (err) {
                throw new Error(err)
            }
        },

        async login(_, { data }, context) {
            try {
                const { name, email } = data
                if (email.trim() == '' || name.trim() == '') {
                    throw new Error('Please provide proper credentials')
                }
                const findOne = await context.db(`SELECT * FROM users WHERE email = $1`, [email])
                if (findOne.length > 0) {

                    const token = jwt.sign({ id: findOne[0].id, name: findOne[0].name, email: findOne[0].email }, process.env.JWT_SECRET)
                    return {
                        id: findOne[0].id,
                        name: findOne[0].name,
                        email: findOne[0].email,
                        createdat: findOne[0].createdat.toString(),
                        token: token,
                        image: findOne[0].image,
                        description: findOne[0].description
                    }
                }
                else {
                    await context.db(`INSERT INTO users (name, email, createdat) VALUES ($1, $2, $3)`, [name, email, new Date()])
                    const output = await context.db(`SELECT * FROM users WHERE name = $1 AND email = $2`, [name, email])
                    const res = output[0]
                    const createdAT = res.createdat.toString()
                    if (res.id >= 0) {
                        const token = jwt.sign({ id: res.id, name: res.name, email: res.email }, process.env.JWT_SECRET)
                        return {
                            id: res.id,
                            name: res.name,
                            email: res.email,
                            createdat: createdAT,
                            token: token,
                            image: res.image,
                        };
                    }
                    else {
                        throw new Error("Error in creating User");
                    }
                }
            } catch (error) {
                throw new Error(error)
            }

        },
    },
    Mutation: {
        follow: async (_, { id }, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (id.trim() == '') {
                throw new Error('Please provide id')
            }
            if (id == auth.user.id) {
                throw new Error('You cannot follow yourself')
            }
            try {
                const findOne = await context.db(`SELECT * FROM follow WHERE userid = $1 AND followid = $2`, [auth.user.id, id])
                if (findOne.length > 0) {
                    await context.db(`DELETE FROM follow WHERE userid = $1 AND followid = $2`, [auth.user.id, id])
                    await context.db(`UPDATE users SET followers = followers - 1 WHERE id = $1`, [id])
                    await context.db(`UPDATE users SET following = following - 1 WHERE id = $1`, [auth.user.id])
                    const currentUser = await context.db(`SELECT * FROM users WHERE id = $1`, [auth.user.id])
                    return parseInt(currentUser[0].following)
                }
                await context.db(`INSERT INTO follow (userid, followid) VALUES ($1, $2)`, [auth.user.id, id])
                await context.db(`UPDATE users SET followers = followers + 1 WHERE id = $1`, [id])
                await context.db(`UPDATE users SET following = following + 1 WHERE id = $1`, [auth.user.id])
                const currentUser = await context.db(`SELECT * FROM users WHERE id = $1`, [auth.user.id])
                return parseInt(currentUser[0].following)
            } catch (err) {
                throw new Error(err)
            }
        },
        updateProfile: async (_, { data }, context) => {
            const auth = await checkAuth(context.req)
            if (!auth.success) {
                throw new Error(auth.error)
            }
            if (data.name == '' && data.image == '' && data.description == '') {
                throw new Error('Please provide proper credentials')
            }
            try {
                if (data.name != '') {
                    await context.db(`UPDATE users SET name = $1 WHERE id = $2`, [data.name, auth.user.id])
                }
                if (data.description != '') {
                    await context.db(`UPDATE users SET description = $1 WHERE id = $2`, [data.description, auth.user.id])
                }
                if (data.image != '') {
                    await context.db(`UPDATE users SET image = $1 WHERE id = $2`, [data.image, auth.user.id])
                }
                const res = await context.db(`SELECT * FROM users WHERE id = $1`, [auth.user.id])
                return {
                    name: res[0].name,
                    image: res[0].image,
                    description: res[0].description
                }
            } catch (err) {
                throw new Error(err)
            }
        }
    }
}
