var options = {
	chart: {
		height: 255,
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: "60%",
			borderRadius: 8,
			distributed: true,
			dataLabels: {
				position: "top",
			},
		},
	},
	series: [
		{
			name: "Income",
			data: [20, 30, 40, 50, 60, 70],
		},
	],
	legend: {
		show: false,
	},
	xaxis: {
		categories: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
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
			rotate: -45,
			rotateAlways: true,
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
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + " million";
			},
		},
	},
	colors: ["#9196a2", "#ba1654", "#EEEEEE", "#CCCCCC", "#ba1654", "#222222"],
};
var chart = new ApexCharts(document.querySelector("#income2"), options);
chart.render();
