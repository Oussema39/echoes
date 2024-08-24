import express, { Application } from "express";
import routes from "./routes/index";
import { validateEmail } from "./helpers/validators";
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

console.log(validateEmail("qsdqsdqs"));

export default app;
