import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send({ message: 'Server is running.' });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}/`);
});
