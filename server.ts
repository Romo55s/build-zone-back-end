import app from "./app";
const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});