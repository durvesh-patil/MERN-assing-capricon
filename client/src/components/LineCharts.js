import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

const LineCharts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // console.log(data[0]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div>
      <h1
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        Fuel Consumption
      </h1>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 " />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            label={{
              value: "Timestamp",
              position: "insideBottom",
              offset: -69,
            }}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
          />
          <YAxis
            dataKey={"fuel_level"}
            label={{
              value: "Fuel Level",
              angle: -90,
              position: "insideLeft",
            }}
            tickCount={6}
            type="number"
            domain={[0, 250]}
            tickFormatter={(value) => parseInt(value)}
            allowDataOverflow
          />

          <Tooltip
            //show time in format HH:MM:SS
            labelFormatter={formatTimestamp}
            formatter={(value) => parseInt(value)}
          />
          <Line
            type="monotone"
            dataKey="fuel_level"
            stroke="#ff7300"
            dot={false}
          />
          <Line type="monotone" dataKey="speed" stroke="#82ca9d" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineCharts;
