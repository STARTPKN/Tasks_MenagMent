import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Chart = ({ data }) => {
  const chartData = [
    {
      name: "สูง",
      total: data?.high || 0,
    },
    {
      name: "ปานกลาง",
      total: data?.medium || 0,
    },
    {
      name: "ปกติ",
      total: data?.normal || 0,
    },
    {
      name: "ต่ำ",
      total: data?.low || 0,
    },
  ];

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart width={150} height={40} data={chartData}>
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray='3 3' />
        <Bar dataKey='total' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  );
};
