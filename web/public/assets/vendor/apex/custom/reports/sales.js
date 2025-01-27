var options = {
	series: [
		{
			name: "",
			data: [200, 330, 548, 740, 880, 1100, 1380],
		},
	],
	chart: {
		type: "bar",
		height: 300,
		toolbar: {
			show: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	plotOptions: {
		bar: {
			borderRadius: 0,
			horizontal: true,
			distributed: true,
			barHeight: "80%",
			isFunnel: true,
		},
	},
	colors: ["#724757", "#ba1654", "#4b4b4e", "#333333", "#ba1654", "#111111"],
	dataLabels: {
		enabled: true,
		formatter: function (val, opt) {
			return opt.w.globals.labels[opt.dataPointIndex];
		},
		dropShadow: {
			enabled: true,
		},
	},
	xaxis: {
		categories: [
			"Meat",
			"Dairy",
			"Grains",
			"Gadgets",
			"Electronics",
			"Processed Foods",
			"Fruits & Vegetables",
		],
	},
	legend: {
		show: false,
	},
};

var chart = new ApexCharts(document.querySelector("#sales"), options);
chart.render();
