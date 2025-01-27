var options = {
	chart: {
		height: 270,
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: "50%",
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		show: true,
		width: 2,
		colors: ["transparent"],
	},
	series: [
		{
			name: "Session Duration",
			data: [45, 52, 38, 24, 33, 26, 21],
		},
		{
			name: "Page Views",
			data: [35, 41, 62, 42, 13, 18, 29],
		},
		{
			name: "Total Visits",
			data: [87, 57, 74, 99, 75, 38, 62, 47],
		},
	],
	legend: {
		show: true,
	},
	xaxis: {
		categories: [
			"Sun",
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
		],
		axisBorder: {
			show: false,
		},
		yaxis: {
			show: false,
		},
		tooltip: {
			enabled: true,
		},
		labels: {
			show: true,
		},
	},
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
			bottom: 20,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + " million";
			},
		},
	},
	colors: [
		"#36363a",
		"#ba1654",
		"#4b4b4e",
		"#113aae",
		"#275cf3",
		"#0049b3",
		"#cce1ff",
		"#1a77ff",
		"#99c3ff",
		"#ba1654",
		"#80b4ff",
		"#005ee6",
	],
};
var chart = new ApexCharts(
	document.querySelector("#visits-conversions"),
	options
);
chart.render();
