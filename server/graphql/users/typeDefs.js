export default `#graphql

    type User{
        id: ID!
        name: String!
        email: String!
        createdat: String!
        token: String!
        image: String
        description: String
        following: [Follow]!
        followers: [Follow]!
        totalFollowers: Int!
        totalFollowing: Int!
    }
    type Follow{
        id: ID!
        name: String!
    }
    input UserInput {
        name: String!
        email: String!
    }
    type fetchUser{
        id: ID!
        name: String!
        image: String
        description: String
        createdat: String!
        following: [Follow]!
        followers: [Follow]!
        totalFollowing: Int!
        totalFollowers: Int!
    }
    type UpdateReturn{
        name: String
        image: String
        description: String
    }
    input UpdateInput {
        name: String
        image: String
        description: String
    }
    type Query {
        login(data:UserInput!): User!,
        getUser(id: ID!): fetchUser!,
        getUsers: [fetchUser]!
    }
    type Mutation {
        follow(id: ID!): Int!,
        updateProfile(data: UpdateInput!): UpdateReturn!
    }
    
`
