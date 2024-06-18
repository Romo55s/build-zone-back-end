import app from "./app";
const port = Number(process.env.PORT) || 10000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});