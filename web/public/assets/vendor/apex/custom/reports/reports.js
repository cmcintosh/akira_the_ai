// Graph 1
var options1 = {
	series: [80],
	chart: {
		height: 280,
		type: "radialBar",
		offsetY: -10,
	},
	plotOptions: {
		radialBar: {
			startAngle: -135,
      endAngle: 135,
			dataLabels: {
				name: {
					fontSize: "16px",
					color: "#ffffff",
					offsetY: 0,
				},
				value: {
					offsetY: 20,
					fontSize: "22px",
					color: "#ffffff",
					formatter: function (val) {
						return val + "%";
					},
				},
			},
		},
	},
	colors: ["#ba1654", "#ccc", "#CCCCCC", "#ba1654", "#222222"],
	stroke: {
		dashArray: 2,
	},
	labels: ["Expenses"],
};
var chart1 = new ApexCharts(document.querySelector("#reports"), options1);
chart1.render();