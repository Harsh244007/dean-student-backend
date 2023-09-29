require('dotenv').config();
const bodyParser = require('body-parser');
const express = require("express")
const cors = require("cors");
const connection = require("./database/db");
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');


const app = express();
const port = 3000;


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

connection();

app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
