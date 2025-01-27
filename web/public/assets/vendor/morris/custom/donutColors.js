// Morris Donut
Morris.Donut({
	element: "donutColors",
	data: [
		{ value: 30, label: "foo" },
		{ value: 15, label: "bar" },
		{ value: 10, label: "baz" },
		{ value: 5, label: "A really really long label" },
	],
	backgroundColor: "#181819",
	labelColor: "#ba1654",
	colors: ["#ba1654", "#c12d65", "#c84576", "#cf5c87", "#d67398"],
	resize: true,
	hideHover: "auto",
	gridLineColor: "#dfd6ff",
	formatter: function (x) {
		return x + "%";
	},
});
