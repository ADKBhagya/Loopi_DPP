import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// LOGIN ROUTE
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;

  if (email === "test@test.com" && password === "12345678") {
    return res.json({
      token: "fake-jwt-token",
      user: { email, role },
    });
  }

  return res.status(401).json({
    message: "Invalid credentials",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});