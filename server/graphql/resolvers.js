import userResolvers from './users/resolvers.js'
import postResolvers from './posts/resolvers.js'

export default {
    fetchUser: {
        ...userResolvers.fetchUser
    },
    User: {
        ...userResolvers.User
    },
    Post: {
        ...postResolvers.Post
    },
    Query: {
        ...userResolvers.Query,
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation
    }
}
