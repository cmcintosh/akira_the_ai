var options = {
	chart: {
		height: 300,
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 0,
	},
	series: [
		{
			name: "Income",
			data: [10, 20, 30, 40, 50, 30, 20],
		},
		{
			name: "Expenses",
			data: [8, 16, 24, 32, 42, 26, 12],
		},
	],
	grid: {
		borderColor: "#414144",
		strokeDashArray: 5,
		xaxis: {
			lines: {
				show: true,
			},
		},
		yaxis: {
			lines: {
				show: false,
			},
		},
		padding: {
			top: 0,
			right: 0,
			bottom: 10,
			left: 0,
		},
	},
	xaxis: {
		categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	},
	yaxis: {
		labels: {
			show: false,
		},
	},
	colors: ["#ba1654", "#4b4b4e"],
	markers: {
		size: 0,
		opacity: 0.3,
		colors: ["#ba1654", "#4b4b4e"],
		strokeColor: "#ffffff",
		strokeWidth: 2,
		hover: {
			size: 7,
		},
	},
};

var chart = new ApexCharts(document.querySelector("#income"), options);

chart.render();
