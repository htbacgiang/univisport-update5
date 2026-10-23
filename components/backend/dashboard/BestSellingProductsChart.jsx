"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BestSellingProductsChart() {
  const [data, setData] = useState({
    labels: [],
    datasets: [{
      label: "Số lượng bán",
      data: [],
      backgroundColor: [
        "rgba(0, 0, 255, 0.7)",
        "rgba(255, 0, 221, 0.7)",
        "rgba(2, 139, 71, 0.7)",
        "rgba(255, 140, 0, 0.7)",
        "rgba(153, 102, 255, 0.7)",
      ],
      borderColor: [
        "rgba(0, 0, 255, 0.3)",
        "rgba(255, 0, 221, 0.3)",
        "rgba(2, 139, 71, 0.3)",
        "rgba(255, 140, 0, 0.3)",
        "rgba(153, 102, 255, 0.3)",
      ],
      borderWidth: 1,
    }],
  });

  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  const fetchBestSellingProducts = async () => {
    try {
      const res = await axios.get("/api/orders/bestsellers");
      const bestSellers = res.data;

      setData(prevData => ({
        ...prevData,
        labels: bestSellers.map(item => item.title),
        datasets: [{
          ...prevData.datasets[0],
          data: bestSellers.map(item => item.quantity),
        }],
      }));
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    }
  };

  return (
    <div className="dark:bg-slate-700 bg-slate-50 p-8 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        Top Sản Phẩm Bán Chạy
      </h2>
      <div className="p-4">
        <Pie data={data} />
      </div>
    </div>
  );
}
