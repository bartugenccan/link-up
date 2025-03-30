require("dotenv").config();
const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
