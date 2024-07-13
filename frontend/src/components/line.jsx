import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";

const MyResponsiveLine = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:3000/data/response/line";
        const response = await axios.get(url);

        const formattedData = [
          {
            id: "Latency",
            color: "hsl(6, 70%, 50%)",
            data: response.data.map((item) => ({
              x: item.timestamp,
              y: item.sumLatency,
            })),
          },
          {
            id: "Time Response",
            color: "hsl(223, 70%, 50%)",
            data: response.data.map((item) => ({
              x: item.timestamp,
              y: item.sumResponse,
            })),
          },
        ];

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch data for the first time

    const intervalId = setInterval(fetchData, 1000); // Fetch data every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "linear" }}
      xFormat=">-.2f"
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: ">-.2f",
        tickValues: "every 1",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Timestamp (seconds)",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Value",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="y"
      pointLabelYOffset={-12}
      enableSlices="x"
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default MyResponsiveLine;
