const express = require("express");
const bodyParser = require("body-parser");
const predictRoutes = require("./src/routes/predictRoute");

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/predict", predictRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
