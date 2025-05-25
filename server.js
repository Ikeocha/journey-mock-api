import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const SECRET = "mysecretkey";

app.use(cors());
app.use(bodyParser.json());

// Mock user data
const users = [
  { id: 1, username: "user1", password: "password123" }
];

// Sample journey data
const journeys = [
  {
    id: "fastest",
    origin: "A",
    destination: "C",
    departure: "+1 day 5 hour",
    journey: [{ route: ["A", "C"], exchanges: 1, price: 2, duration: 2 }]
  },
  {
    id: "exchange",
    origin: "A",
    destination: "C",
    journey: [{ route: ["A", "C"], exchanges: 1, price: 1000, duration: 8 }]
  },
  {
    id: "cheapest",
    origin: "A",
    destination: "C",
    departure: "+1 day 5 hour",
    journey: [{ route: ["A", "C"], exchanges: 1, price: 2, duration: 2 }]
  }
];

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username: user.username }, SECRET, {
    expiresIn: "1h"
  });
  res.json({ token });
});

// Paginated journeys
app.get("/journeys", authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  const start = (page - 1) * pageSize;
  const paginated = journeys.slice(start, start + pageSize);

  res.json(paginated);
});

// Sorted journeys
app.get("/journeys/exchanges", authenticateToken, (req, res) => {
  const sorted = [...journeys].sort(
    (a, b) => a.journey[0].exchanges - b.journey[0].exchanges
  );
  res.json(sorted);
});

app.get("/journeys/cheapest", authenticateToken, (req, res) => {
  const sorted = [...journeys].sort(
    (a, b) => a.journey[0].price - b.journey[0].price
  );
  res.json(sorted);
});

app.get("/journeys/most-expensive", authenticateToken, (req, res) => {
  const sorted = [...journeys].sort(
    (a, b) => b.journey[0].price - a.journey[0].price
  );
  res.json(sorted);
});

app.get("/journeys/fastest", authenticateToken, (req, res) => {
  const sorted = [...journeys].sort(
    (a, b) => a.journey[0].duration - b.journey[0].duration
  );
  res.json(sorted);
});

app.get("/journeys/slowest", authenticateToken, (req, res) => {
  const sorted = [...journeys].sort(
    (a, b) => b.journey[0].duration - a.journey[0].duration
  );
  res.json(sorted);
});

// Journey details
app.get("/journeys/:id", authenticateToken, (req, res) => {
  const journey = journeys.find((j) => j.id === req.params.id);
  if (!journey) return res.status(404).json({ message: "Journey not found" });
  res.json(journey);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
