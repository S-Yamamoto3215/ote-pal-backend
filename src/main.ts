import "reflect-metadata";
import app from "./infrastructure/http/express";

const PORT = process.env.PORT || 3000;

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
