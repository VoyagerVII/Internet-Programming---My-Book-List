const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); 

dotenv.config();

const app = express();
const port = process.env.PORT;

const publicPath = path.join(__dirname, 'dist');
app.use(express.static(publicPath));




// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/dist/index.html'));
// });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});