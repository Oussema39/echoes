import app from "./server";
import "./config/database";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Process running on port ${PORT}`);
});
