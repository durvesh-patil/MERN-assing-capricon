const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

app.use(cors());
app.use(express.json());

//For frontend to get the data for creating the chart
app.get("/api/data", (req, res) => {
  const filePath = path.join(__dirname, "response.json");
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send({ error: "Error reading the file" });
      }
      let jsonData = JSON.parse(data);

      // Filter data where fuel_level is less than or equal to 250 as given in the assingment image
      jsonData = jsonData.filter((item) => item.fuel_level <= 250);

      res.status(200).json(jsonData);
    });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

////////TASK 2////////
app.get("/api/fuel", (req, res) => {
  const filePath = path.join(__dirname, "response.json");
  try {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send({ error: "Error reading the file" });
      }

      let jsonData = JSON.parse(data);

      let fuelFillEvents = [];
      let totalFuelConsumed = 0;
      let previousFuelLevel = jsonData[0].fuel_level;
      let previousTimestamp = jsonData[0].timestamp;
      let previousLocation = jsonData[0].location;

      // Loop through the data to find fuel fill events and total fuel consumed
      //eg: fuel level of previous data is 100 and current data is 150, then fuel filled is 50
      //using this logic to find fuel fill events
      for (let i = 1; i < jsonData.length; i++) {
        const currentFuelLevel = jsonData[i].fuel_level;
        const currentTimestamp = jsonData[i].timestamp;
        const currentLocation = jsonData[i].location;

        //  fuel fill event
        if (currentFuelLevel > previousFuelLevel) {
          const fuelFilled = currentFuelLevel - previousFuelLevel;
          fuelFillEvents.push({
            start_time: previousTimestamp,
            end_time: currentTimestamp,
            fuel_filled: fuelFilled,
            location: currentLocation, // location at the time of fuel fill
          });
        }

        if (currentFuelLevel < previousFuelLevel) {
          totalFuelConsumed += previousFuelLevel - currentFuelLevel;
        }

        // Update previous values for the next iteration
        previousFuelLevel = currentFuelLevel;
        previousTimestamp = currentTimestamp;
        previousLocation = currentLocation;
      }

      res.status(200).json({
        fuel_fill_events: fuelFillEvents,
        total_fuel_consumed: totalFuelConsumed,
      });
    });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
