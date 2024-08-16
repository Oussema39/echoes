import app from "./server";
import { connectDb } from "@/config/database";
const PORT = process.env.PORT || 3000;

connectDb();

app.listen(PORT, () => {
  console.log(`Process running on port ${PORT}`);
});
