const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/forms", require("./routes/forms"));

app.get("/", (req, res) => {
  res.json({ message: "Form Builder Backend API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
