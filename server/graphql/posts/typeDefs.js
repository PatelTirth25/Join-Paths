export default `#graphql
    type Post{
        id: ID!
        content: String!
        userid: String!
        createdat: String!
        comments: [Comment]!
        likes: [Like]!
        totalLikes: Int!
        totalComments: Int!
    }
    type Comment{
        id: ID!
        comment: String!
        userId: ID!
        createdat: String!
        postId: ID!
    }
    input CommentInput {
        comment: String!
        postId: ID!
    }
    type Like {
        id: ID!
        userId: ID!
        postId: ID!
    }
    type Query {
        getPosts(userid: ID!): [Post]!
        getPost(id: ID!): Post!
    }
    type Mutation {
        addPost(content: String!): Post!
        addComment(data: CommentInput!): Comment!
        likePost(postId: ID!): Like!
        deletePost(postId: ID!): Int!
        deleteComment(commentId: ID!): Int!
    }
`
