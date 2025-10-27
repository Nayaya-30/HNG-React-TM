import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useLoadingDelay } from "../../hooks/useLoadingDelay";

const AnalyticsChart = ({ tickets }) => {
  const chartRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const showLoading = useLoadingDelay(isLoading);

  useEffect(() => {
    if (!tickets || tickets.length === 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    d3.select(chartRef.current).select("svg").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("class", "w-full h-auto dark:text-white")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group tickets per date and count per status
    const ticketsByDate = d3.rollup(
      tickets,
      (v) => ({
        open: v.filter((t) => t.status === "open").length,
        inProgress: v.filter((t) => t.status === "in_progress").length,
        closed: v.filter((t) => t.status === "closed").length,
      }),
      (d) => d3.timeDay(new Date(d.createdAt))
    );

    const data = Array.from(ticketsByDate, ([date, counts]) => ({
      date,
      ...counts,
    })).sort((a, b) => a.date - b.date);

    const statuses = ["open", "inProgress", "closed"];
    const colorScale = d3
      .scaleOrdinal()
      .domain(statuses)
      .range(["#3b82f6", "#facc15", "#22c55e"]);

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d3.timeFormat("%m/%d")(d.date)))
      .range([0, width])
      .paddingInner(0.2);

    const x1 = d3
      .scaleBand()
      .domain(statuses)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => Math.max(d.open, d.inProgress, d.closed)) || 1,
      ])
      .nice()
      .range([height, 0]);

    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y).ticks(5);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "text-gray-600 dark:text-gray-300")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "text-gray-600 dark:text-gray-300")
      .call(yAxis);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("class", "text-xl font-bold text-gray-800 dark:text-white")
      .text("Tickets by Status Over Time");

    // Draw grouped bars
    const groups = svg
      .selectAll(".date-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "date-group")
      .attr("transform", (d) => `translate(${x0(d3.timeFormat("%m/%d")(d.date))},0)`);

    groups
      .selectAll("rect")
      .data((d) =>
        statuses.map((key) => ({
          key,
          value: d[key],
          date: d.date,
        }))
      )
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => colorScale(d.key))
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(150).attr("opacity", 0.8);
        d3.select(chartRef.current).selectAll(".chart-tooltip").remove();
        const tt = d3
          .select(chartRef.current)
          .append("div")
          .attr(
            "class",
            "chart-tooltip absolute bg-white dark:bg-gray-800 p-2 rounded shadow-lg text-sm z-50 pointer-events-none"
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
        tt.html(`
          <div class="font-semibold">${d3.timeFormat("%B %d, %Y")(d.date)}</div>
          <div class="capitalize">${d.key}: <strong>${d.value}</strong></div>
        `);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(150).attr("opacity", 1);
        d3.select(chartRef.current).selectAll(".chart-tooltip").remove();
      });

    // Legend
    const legend = svg
      .selectAll(".legend")
      .data(statuses)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(${i * 120},${height + 35})`);

    legend
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => colorScale(d));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("class", "text-sm text-gray-700 dark:text-gray-300 capitalize")
      .text((d) => d.replace("inProgress", "in progress"));

    setIsLoading(false);
  }, [tickets]);

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg dark:bg-gray-800 relative">
      <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">
        Analytics
      </h3>
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading chart data...
            </p>
          </div>
        </div>
      )}
      <div ref={chartRef} className="w-full overflow-x-auto min-h-[400px]">
        {tickets && tickets.length > 0 ? (
          <div className="w-full h-full"></div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No data available for analytics. Create some tickets to see the
            chart.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;