var options = {
	chart: {
		height: 320,
		type: "area",
		toolbar: {
			show: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		curve: "smooth",
		width: 3,
	},
	plotOptions: {
		bar: {
			columnWidth: "15%",
		},
	},
	series: [
		{
			name: "Visitors",
			type: "bar",
			data: [10, 40, 32, 40, 20, 35, 66, 40, 56, 43, 56, 79],
		},
		{
			name: "Subscribers",
			type: "area",
			data: [2, 8, 25, 7, 20, 20, 51, 35, 42, 20, 33, 67],
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
		categories: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
	},
	yaxis: {
		labels: {
			show: false,
		},
	},

	colors: ["#ba1654", "#46484d", "#66a4ff"],
	markers: {
		size: 0,
		opacity: 0.3,
		colors: ["#ba1654", "#46484d", "#66a4ff"],
		strokeColor: "#ffffff",
		strokeWidth: 2,
		hover: {
			size: 7,
		},
	},
};

var chart = new ApexCharts(document.querySelector("#subscribersData"), options);

chart.render();
