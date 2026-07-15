import express, { type Request, type Response } from "express";

const app = express();
const prot = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World ");
});

app.listen(prot, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
