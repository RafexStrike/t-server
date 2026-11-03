import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/routes/auth-routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running!"
  });
});

export default app;
