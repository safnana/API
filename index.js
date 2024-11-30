const express = require("express");
const bodyParser = require("body-parser");
const predictRoutes = require("./src/routes/predictRoute");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/predict", predictRoutes);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
