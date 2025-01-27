var options = {
	chart: {
		height: 350,
		width: "100%",
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: "20%",
			borderRadius: 4,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		show: true,
		width: 0,
		colors: ["#ba1654", "#EEEEEE", "#CCCCCC", "#ba1654", "#111111"],
	},
	series: [
		{
			name: "Order",
			data: [2000, 4000, 8000, 12000, 9000, 5000, 3000],
		},
	],
	legend: {
		show: false,
	},
	xaxis: {
		categories: ["1M", "2M", "5M", "10M", "20M", "50M", "100M"],
	},
	yaxis: {
		show: false,
	},
	fill: {
		colors: ["#ba1654", "#EEEEEE", "#CCCCCC", "#ba1654", "#111111"],
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return +val;
			},
		},
	},
	grid: {
		show: false,
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
	},
	colors: ["#ffffff"],
};
var chart = new ApexCharts(document.querySelector("#value"), options);
chart.render();
