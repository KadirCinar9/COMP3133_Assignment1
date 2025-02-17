const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

require('dotenv').config();
connectDB();

const app = express();
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    cache: "bounded"  // ✅ Fix Apollo security warning
});

server.start().then(() => {
    server.applyMiddleware({ app });

    // ✅ Use Render's PORT environment variable, default to 4000 for local testing
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/graphql`));
});
