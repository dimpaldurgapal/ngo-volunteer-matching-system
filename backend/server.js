require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
const db = require("./db");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= FRONTEND =================
// Frontend folder is outside backend folder
const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

// ================= EMAIL TRANSPORT =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email connection
transporter.verify((err) => {
  if (err) {
    console.log("❌ Email server error:", err.message);
  } else {
    console.log("✅ Email server ready");
  }
});

// ================= HOME =================
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ================= SIGNUP =================
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (result.length > 0) {
        return res.status(409).json({
          message: "User already exists"
        });
      }

      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, password],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: "Signup failed"
            });
          }

          return res.json({
            message: "Signup successful ✅"
          });
        }
      );
    }
  );
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: "Invalid credentials"
        });
      }

      return res.json({
        message: "Login successful 🔐",
        user: result[0]
      });
    }
  );
});

// ================= NGOS =================
app.get("/ngos", (req, res) => {
  db.query(
    "SELECT * FROM ngos",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      res.json(result);
    }
  );
});

// ================= VOLUNTEER =================
app.post("/volunteer", async (req, res) => {
  const { name, skill, ngo_id, email } = req.body;

  if (!name || !skill || !ngo_id || !email) {
    return res.status(400).json({
      message: "Missing fields"
    });
  }

  db.query(
    "INSERT INTO volunteers (name, skill, ngo_id) VALUES (?, ?, ?)",
    [name, skill, ngo_id],
    async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      res.json({
        message: "Volunteer registered 🎉"
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "🤝 Welcome to NayePankh",
          html: `
            <h2>Welcome ${name} 💚</h2>
            <p>Thank you for joining <b>NayePankh</b>.</p>
            <p>You are making a real impact 🌍</p>
          `
        });

        console.log("Volunteer email sent");
      } catch (e) {
        console.log("Email error:", e.message);
      }
    }
  );
});

// ================= DONATION =================
app.post("/donate", (req, res) => {
  const { email, ngo_id, amount } = req.body;

  if (!email || !ngo_id || !amount || amount <= 0) {
    return res.status(400).json({
      message: "Invalid donation data"
    });
  }

  db.query(
    "INSERT INTO donations (email, ngo_id, amount) VALUES (?, ?, ?)",
    [email, ngo_id, amount],
    async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      res.json({
        message: "Donation successful ❤️"
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "❤️ Thank You for Supporting NayePankh",
          html: `
            <h2>Thank You 🌍</h2>
            <p>Your donation of <b>₹${amount}</b> is received.</p>
            <p>You are changing lives ✨</p>
          `
        });

        console.log("Donation email sent");
      } catch (e) {
        console.log("Email error:", e.message);
      }
    }
  );
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});