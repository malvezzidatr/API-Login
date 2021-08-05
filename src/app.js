import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

class App {
    constructor() {
        this.server = express();
        dotenv.config()
        mongoose.connect(`mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PSSW}@${process.env.DB_NAME}.fmjsv.mongodb.net/database?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.server.use(cors());
        this.server.use(express.json());
    }
    routes() {
        this.server.use(routes);
    }
}

export default new App().server;