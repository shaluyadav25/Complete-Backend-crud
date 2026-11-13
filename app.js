import cors from "cors";
import express from "express";
import authRoute from "./routes/auth.routes.js";
import productRoute from "./routes/product.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN?.split(',').map((o) => o.trim()) ?? true,
  }),
);

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  if (err.name === "MulterError")
    return res.status(err.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
      message: err.code === "LIMIT_FILE_SIZE" ? "photo must be 5 MB or smaller" : err.message,
    });
  if (err.name === "ValidationError")
    return res.status(400).json({ message: err.message });
  if (err.name === "CastError")
    return res.status(400).json({ message: `invalid ${err.path}` });
  if (err.code === 11000)
    return res.status(409).json({ message: "already exists" });
  if (err.status) return res.status(err.status).json({ message: err.message });

  console.log(err);
  res.status(500).json({ message: "server error" });
});

export default app;