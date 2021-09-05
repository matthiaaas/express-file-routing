import express from 'express';
import createRouter from '../../lib/esm';
const app = express();

    app.use(express.json())
    createRouter(app);

app.listen(3000);