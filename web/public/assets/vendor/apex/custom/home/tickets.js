var options = {
	chart: {
		width: 340,
		type: "pie",
	},
	labels: ["Open", "Progress", "Closed"],
	series: [20, 45, 65],
	legend: {
		position: "bottom",
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 0,
	},
	colors: ["#333333", "#ba1654", "#666666", "#CCCCCC", "#ba1654", "#222222"],
};
var chart = new ApexCharts(document.querySelector("#tickets"), options);
chart.render();
