import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

app.use(cors());

app.use(express.json({
  limit: "100kb"
}));

app.use("/api", routes);

app.use((_req, res) => {

  res.status(404).json({
    error: "Route not found."
  });

});

app.use((error, _req, res, _next) => {

  console.error(error);

  res.status(500).json({
    error: "Internal server error."
  });

});

export default app;