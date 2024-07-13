const express = require("express");
const cors = require("cors"); // Import modul cors
const connection = require("./connection");

const app = express();
const port = 3000;

// Gunakan modul cors untuk mengizinkan akses dari semua domain
app.use(cors());

// Endpoint untuk membaca data mpu6050 dari database
app.get("/data/mpu", (req, res) => {
  const query = "SELECT * FROM sensor_data ORDER BY timestamp DESC";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error reading data from database");
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk membaca data response dari database
app.get("/data/response", (req, res) => {
  const query = "SELECT * FROM response_data ORDER BY timestamp DESC";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error reading data from database");
      return;
    }
    res.json(results);
  });
});



// Endpoint untuk membaca data response dari database
app.get("/data/response/line", (req, res) => {
  const query = `
    SELECT 
      sumResponse, 
      sumLatency, 
      SECOND(timestamp) AS timestamp 
    FROM response_data 
    ORDER BY timestamp DESC 
    LIMIT 10
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error reading data from database");
      return;
    }
    res.json(results);
  });
});


// Menutup koneksi ketika server berhenti
process.on("SIGINT", () => {
  connection.end((err) => {
    if (err) {
      console.error("Error closing connection:", err);
    } else {
      console.log("Connection closed");
    }
    process.exit();
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
