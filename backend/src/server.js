import dotenv from "dotenv";
import app from "./app.js";


dotenv.config();


const port = Number(process.env.PORT || 5000);


app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});