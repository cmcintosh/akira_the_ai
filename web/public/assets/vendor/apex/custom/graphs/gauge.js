var options = {
	series: [75],
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
					color: undefined,
					offsetY: 0,
				},
				value: {
					offsetY: 20,
					fontSize: "21px",
					color: undefined,
					formatter: function (val) {
						return val + "%";
					},
				},
			},
		},
	},
	colors: ["#9196a2", "#ba1654", "#EEEEEE", "#CCCCCC", "#ba1654", "#222222"],
	stroke: {
		dashArray: 4,
	},
	labels: ["Sales Ratio"],
};

var chart = new ApexCharts(document.querySelector("#gauge"), options);
chart.render();
