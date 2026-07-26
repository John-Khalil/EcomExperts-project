import express from "express";
import products from "./products.json" with { type: "json" };
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 3001;

app.get("/products", (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});