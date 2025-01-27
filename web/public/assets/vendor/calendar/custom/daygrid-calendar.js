document.addEventListener("DOMContentLoaded", function () {
	var calendarEl = document.getElementById("dayGrid");
	var calendar = new FullCalendar.Calendar(calendarEl, {
		headerToolbar: {
			left: "prevYear,prev,next,nextYear today",
			center: "title",
			right: "dayGridMonth,dayGridWeek,dayGridDay",
		},
		initialDate: "2023-10-12",
		navLinks: true, // can click day/week names to navigate views
		editable: true,
		dayMaxEvents: true, // allow "more" link when too many events
		events: [
			{
				title: "All Day Event",
				start: "2023-10-01",
				color: "#ba1654",
			},
			{
				title: "Long Event",
				start: "2023-10-07",
				end: "2023-10-10",
				color: "#a7144c",
			},
			{
				groupId: 999,
				title: "Birthday",
				start: "2023-10-09T16:00:00",
				color: "#c12d65",
			},
			{
				groupId: 999,
				title: "Birthday",
				start: "2023-10-16T16:00:00",
				color: "#c84576",
			},
			{
				title: "Conference",
				start: "2023-10-11",
				end: "2023-10-13",
				color: "#d67398",
			},
			{
				title: "Meeting",
				start: "2023-10-14T10:30:00",
				end: "2023-10-14T12:30:00",
				color: "#dd8baa",
			},
			{
				title: "Lunch",
				start: "2023-10-16T12:00:00",
				color: "#e3a2bb",
			},
			{
				title: "Meeting",
				start: "2023-10-18T14:30:00",
				color: "#eab9cc",
			},
			{
				title: "Interview",
				start: "2023-10-21T17:30:00",
				color: "#f1d0dd",
			},
			{
				title: "Meeting",
				start: "2023-10-22T20:00:00",
				color: "#c12d65",
			},
			{
				title: "Birthday",
				start: "2023-10-13T07:00:00",
				color: "#951243",
			},
			{
				title: "Click for Google",
				url: "http://www.bootstrap.gallery/",
				start: "2023-10-28",
				color: "#d67398",
			},
			{
				title: "Interview",
				start: "2023-10-20",
				color: "#cf5c87",
			},
			{
				title: "Product Launch",
				start: "2023-10-29",
				color: "#dd8baa",
			},
			{
				title: "Leave",
				start: "2023-10-25",
				color: "#c84576",
			},
		],
	});

	calendar.render();
});
