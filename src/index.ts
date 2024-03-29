import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import healthRoute from './routes/health';
import dockerRoute from './routes/docker';
import wordpressRoute from './routes/wordpress';
import { SERVER_PORT } from './config/config';

const app = express();

app.use(
  cors({
    credentials: true
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(healthRoute);
app.use(dockerRoute);
app.use(wordpressRoute);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port: http://localhost:${SERVER_PORT}/`);
});
