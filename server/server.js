import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import extractRoute from './routes/extract.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/api/extract', extractRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
