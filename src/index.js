const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client')

// Resolvers
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Post = require('./resolvers/Post')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')
const Comment = require('./resolvers/Comment')
const Like = require('./resolvers/Like')

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Vote,
    Comment,
    Like
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
            ...request,
            prisma
        }
    }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))