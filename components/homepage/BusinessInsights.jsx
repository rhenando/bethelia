"use client";

import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as echarts from "echarts";

const BusinessInsights = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption({
      animation: false,
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { data: ["Orders", "Revenue"] },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Orders",
          type: "bar",
          data: [320, 332, 301, 334, 390, 330],
          color: "#4f46e5",
        },
        {
          name: "Revenue",
          type: "line",
          data: [820, 932, 901, 934, 1290, 1330],
          color: "#10b981",
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>
              Orders and revenue for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={chartRef} className='h-[300px] w-full' />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BusinessInsights;
