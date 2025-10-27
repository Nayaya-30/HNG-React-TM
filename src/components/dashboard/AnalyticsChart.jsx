import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';

const AnalyticsChart = ({ tickets }) => {
	const chartRef = useRef();
	const [isLoading, setIsLoading] = useState(true);
	const showLoading = useLoadingDelay(isLoading);

	useEffect(() => {
		if (!tickets || tickets.length === 0) {
			// nothing to render, ensure loading is off
			setIsLoading(false);
			return;
		}
		setIsLoading(true);

		// Clear previous chart
		d3.select(chartRef.current).select('svg').remove();

		// Set dimensions and margins
		const margin = { top: 20, right: 30, bottom: 40, left: 50 };
		const width = 800 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		// Create SVG with responsive container
		const svg = d3
			.select(chartRef.current)
			.append('svg')
			.attr(
				'viewBox',
				`0 0 ${width + margin.left + margin.right} ${
					height + margin.top + margin.bottom
				}`
			)
			.attr('class', 'w-full h-auto dark:text-white')
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Process data - group tickets by date and status
			const ticketsByDate = d3.rollup(
				tickets,
				(v) => ({
					total: v.length,
					open: v.filter((t) => t.status === 'open').length,
					inProgress: v.filter((t) => t.status === 'in_progress').length,
					completed: v.filter((t) => t.status === 'closed').length,
				}),
				(d) => d3.timeDay(new Date(d.createdAt))
			);

		const data = Array.from(ticketsByDate, ([date, counts]) => ({
			date,
			...counts,
		})).sort((a, b) => a.date - b.date);

		// For a bar chart we use a band scale for x and linear for y
		const xScale = d3
			.scaleBand()
			.domain(data.map((d) => d3.timeFormat('%m/%d')(d.date)))
			.range([0, width])
			.padding(0.2);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.total) || 1])
			.nice()
			.range([height, 0]);

		// Add gradient definitions
		const defs = svg.append('defs');

		const gradient = defs
			.append('linearGradient')
			.attr('id', 'area-gradient')
			.attr('gradientUnits', 'userSpaceOnUse')
			.attr('x1', 0)
			.attr('y1', height)
			.attr('x2', 0)
			.attr('y2', 0);

		gradient
			.append('stop')
			.attr('offset', '0%')
			.attr('class', 'dark:stop-gray-800 stop-blue-100');

		gradient
			.append('stop')
			.attr('offset', '100%')
			.attr('class', 'dark:stop-blue-900/20 stop-blue-500/20');

		// Create axes
		const xAxis = d3.axisBottom(xScale);

		const yAxis = d3.axisLeft(yScale).ticks(5);

		// Add axes to SVG
		svg.append('g')
			.attr('transform', `translate(0,${height})`)
			.attr('class', 'text-gray-600 dark:text-gray-300')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'text-gray-600 dark:text-gray-300')
			.call(yAxis);

		// Add axis labels
		svg.append('text')
			.attr(
				'transform',
				`translate(${width / 2},${height + margin.bottom - 5})`
			)
			.style('text-anchor', 'middle')
			.attr('class', 'text-gray-700 dark:text-gray-300')
			.text('Date');

		svg.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0 - margin.left)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.attr('class', 'text-gray-700 dark:text-gray-300')
			.text('Number of Tickets');

		// Create line generator
		const line = d3
			.line()
			.x((d) => xScale(d.date))
			.y((d) => yScale(d.total))
			.curve(d3.curveMonotoneX);

		// Add animated line
		const path = svg
			.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', '#3b82f6')
			.attr('stroke-width', 2)
			.attr('d', line);

		// Animate the line
		const length = path.node().getTotalLength();
		path.attr('stroke-dasharray', length)
			.attr('stroke-dashoffset', length)
			.transition()
			.duration(1000)
			.attr('stroke-dashoffset', 0);

		// Create bars for bar chart
		svg.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar fill-blue-500 dark:fill-blue-400')
			.attr('x', (d) => xScale(d3.timeFormat('%m/%d')(d.date)))
			.attr('y', (d) => yScale(d.total))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => height - yScale(d.total))
			.on('mouseover', function (event, d) {
				d3.select(this).transition().duration(150).attr('opacity', 0.8);
				// tooltip
				d3.select(chartRef.current)
					.selectAll('.chart-tooltip')
					.remove();
				const tt = d3
					.select(chartRef.current)
					.append('div')
					.attr(
						'class',
						'chart-tooltip absolute bg-white dark:bg-gray-800 p-2 rounded shadow-lg text-sm z-50 pointer-events-none'
					)
					.style('left', event.pageX + 10 + 'px')
					.style('top', event.pageY - 10 + 'px');
				tt.html(`
						<div class="font-semibold">${d3.timeFormat('%B %d, %Y')(d.date)}</div>
						<div>Total: <strong>${d.total}</strong></div>
						<div class="text-green-500">Completed: ${d.completed}</div>
						<div class="text-yellow-500">In Progress: ${d.inProgress}</div>
						<div class="text-blue-500">Open: ${d.open}</div>
					`);
			})
			.on('mouseout', function () {
				d3.select(this).transition().duration(150).attr('opacity', 1);
				d3.select(chartRef.current)
					.selectAll('.chart-tooltip')
					.remove();
			});

		// Add title
		svg.append('text')
			.attr('x', width / 2)
			.attr('y', 0 - margin.top / 2)
			.attr('text-anchor', 'middle')
			.attr('class', 'text-xl font-bold text-gray-800 dark:text-white')
			.text('Tickets Created Over Time');

		// finished rendering
		setIsLoading(false);
	}, [tickets]);

	return (
		<div className='mt-8 bg-white p-6 rounded-2xl shadow-lg dark:bg-gray-800 relative'>
			<h3 className='text-xl font-bold text-gray-800 mb-4 dark:text-white'>
				Analytics
			</h3>
			{showLoading && (
				<div className='absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg z-10'>
					<div className='flex flex-col items-center gap-3'>
						<div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
						<p className='text-gray-600 dark:text-gray-300'>
							Loading chart data...
						</p>
					</div>
				</div>
			)}
			<div
				ref={chartRef}
				className='w-full overflow-x-auto min-h-[400px]'>
				{tickets && tickets.length > 0 ? (
					<div className='w-full h-full'></div>
				) : (
					<p className='text-gray-500 dark:text-gray-400 text-center py-8'>
						No data available for analytics. Create some tickets to
						see the chart.
					</p>
				)}
			</div>
		</div>
	);
};

export default AnalyticsChart;

