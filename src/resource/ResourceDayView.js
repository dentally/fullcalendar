
fcViews.resourceDay = ResourceDayView;

function ResourceDayView(element, calendar) { // TODO: make a DayView mixin
	var t = this;
	
	
	// exports
	t.incrementDate = incrementDate;
	t.render = render;
	
	
	// imports
	ResourceView.call(t, element, calendar, 'resourceDay');
	var getResources = calendar.getResources;


	function incrementDate(date, delta) {
		var out = date.clone().stripTime().add('days', delta);
		out = t.skipHiddenDays(out, delta < 0 ? -1 : 1);
		return out;
	}


	function render(date) {

		t.start = t.intervalStart = date.clone().stripTime();
		t.end = t.intervalEnd = t.start.clone().add('days', 1);

		t.title = calendar.formatDate(t.start, t.opt('titleFormat'));

		var rows = getResources.length;
		var cols = Math.round((t.start - t.end) / 1000 / 60 / t.opt('slotMinutes'));
		t.renderResourceView(rows, 1, false);
	}
	

}