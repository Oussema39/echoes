import app from "./server";
import ConnectDB from "./config/database";
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await ConnectDB();
  app.listen(PORT, () => {
    console.log(`Process running on port ${PORT}`);
  });
};

startServer();
