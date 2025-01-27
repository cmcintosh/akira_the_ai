var options = {
	chart: {
		width: 300,
		type: "donut",
	},
	labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
	series: [20, 35, 45, 65, 40],
	legend: {
		position: "bottom",
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 0,
	},
	colors: ["#a7144c", "#ba1654", "#c12d65", "#c84576", "#cf5c87", "#d67398"],
};
var chart = new ApexCharts(document.querySelector("#donut"), options);
chart.render();
