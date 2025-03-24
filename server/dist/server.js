import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'node:path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authenticateToken } from './utils/auth.js';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;
const app = express();
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 })); // Enables file uploads in GraphQL
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startApolloServer = async () => {
    await server.start();
    await db();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    // Important for MERN Setup: When our application runs from production, it functions slightly differently than in development
    // In development, we run two servers concurrently that work together
    // In production, our Node server runs and delivers our client-side bundle from the dist/ folder
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../../client/dist')));
        console.log("test");
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        });
    }
    // Important for MERN Setup: Any client-side requests that begin with '/graphql' will be handled by our Apollo Server
    app.use('/graphql', expressMiddleware(server, {
        context: authenticateToken
    }));
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
startApolloServer();
