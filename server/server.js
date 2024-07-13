import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import resolvers from "./graphql/resolvers.js"
import typeDefs from "./graphql/typeDefs.js"
import database from "./utils/pg.js"

const app = express()
app.use(cors())
app.use(bodyParser.json())

const server = new ApolloServer({
    typeDefs,
    resolvers
})

await server.start()

app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
        return {
            req,
            db: database
        }
    }
}))
app.listen(8080, () => {
    console.log("Running on port: 8080")
})
