const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Request = require("./models/request");
const Donor = require("./models/Donor");
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://NeerajV_2022:bloodconnect123@cluster0.jq2higo.mongodb.net/bloodconnect")
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((error) => {
    console.log("MongoDB Connection Error:", error);
});

app.get("/", (req, res) => {
    res.send("Blood Connect Server Running");
});

app.post("/api/request", async (req, res) => {
  try {

    const request = new Request(req.body);
    const savedRequest = await request.save();

    const donors = await Donor.find({
      bloodGroup: req.body.bloodGroup,
      city: req.body.city,
      available: true
    });

    res.status(201).json({
      request: savedRequest,
      matchingDonors: donors
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/donor/search", async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    const donors = await Donor.find({
      bloodGroup: bloodGroup,
      city: city,
      available: true
    });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Register Donor
app.post("/api/donor/register", async (req, res) => {
  try {

    const donor = new Donor(req.body);

    const savedDonor = await donor.save();

    res.status(201).json(savedDonor);

  } catch (error) {

    console.error("Donor Registration Error:", error);

    res.status(500).json({ message: error.message });

  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});