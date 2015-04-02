
Calendar.defaults = {

	titleRangeSeparator: ' \u2014 ', // emphasized dash
	monthYearFormat: 'MMMM YYYY', // required for en. other languages rely on datepicker computable option

	defaultTimedEventDuration: '02:00:00',
	defaultAllDayEventDuration: { days: 1 },
	forceEventDuration: false,
	nextDayThreshold: '09:00:00', // 9am

	// display
	defaultView: 'month',
	aspectRatio: 1.35,
	header: {
		left: 'title',
		center: '',
		right: 'today prev,next'
	},
	weekends: true,
	weekNumbers: false,
	allDaySlot: false,

	weekNumberTitle: 'W',
	weekNumberCalculation: 'local',

	//editable: false,

	// event ajax
	lazyFetching: true,
	startParam: 'start',
	endParam: 'end',
	timezoneParam: 'timezone',

	timezone: false,

	//allDayDefault: undefined,

	// time formats
	titleFormat: {
		month: 'MMMM YYYY', // like "September 1986". each language will override this
		week: 'll', // like "Sep 4 1986"
		day: 'LL' // like "September 4 1986"
	},
	columnFormat: {
		month: 'ddd', // like "Sat"
		week: 'dddd',
		day: 'dddd' // like "Saturday"
	},
	timeFormat: { // for event elements
		'default': 'h:mm'
	},

	displayEventEnd: {
		month: false,
		basicWeek: false,
		'default': true
	},


	// locale
	defaultButtonText: {
		today: 'Today',
		addThreeMonths: '+3',
		addSixMonths: '+6',
	},
	isRTL: false,
	buttonText: {
		prev: "prev",
		next: "next",
		prevYear: "prev year",
		nextYear: "next year",
		year: 'year', // TODO: locale files need to specify this
		today: 'today',
		month: 'month',
		week: 'week',
		day: 'day',
		addThreeMonths: '+3',
		addSixMonths: '+6'
	},

	buttonIcons: {
		prev: 'left-single-arrow',
		next: 'right-single-arrow',
		prevYear: 'left-double-arrow',
		nextYear: 'right-double-arrow'
	},

	fontAwsomeIcons: {
		openMenu: 'icon-reorder',
		month: 'icon-th',
		week: 'icon-ellipsis-vertical,icon-ellipsis-vertical,icon-ellipsis-vertical',
		day: 'icon-th-list',
		next: 'icon-angle-right',
		prev: 'icon-angle-left',
		findSlot: 'icon-search'
	},

	buttonTitles: {
		menu: 'Menu',
		today: 'Go to Today',
		month: 'Month',
		week: 'Week',
		day: 'Day',
		findSlot: 'Find Available Slot',
		next: 'Next',
		prev: 'Previous',
		addThreeMonths: 'Go forward three months',
		addSixMonths: 'Go forward six months'
	},

	// jquery-ui theming
	theme: false,
	themeButtonIcons: {
		prev: 'circle-triangle-w',
		next: 'circle-triangle-e',
		prevYear: 'seek-prev',
		nextYear: 'seek-next'
	},

	//eventResizableFromStart: false,
	dragOpacity: .75,
	dragRevertDuration: 500,
	dragScroll: true,

	selectable: true,
	unselectAuto: true,

	dropAccept: '*',

	eventLimit: false,
	eventLimitText: 'more',
	eventLimitClick: 'popover',
	dayPopoverFormat: 'LL',

	handleWindowResize: true,
	windowResizeDelay: 200 // milliseconds before an updateSize happens
	
};


Calendar.englishDefaults = { // used by lang.js
	dayPopoverFormat: 'dddd, MMMM D'
};


Calendar.rtlDefaults = { // right-to-left defaults
	header: { // TODO: smarter solution (first/center/last ?)
		left: 'next,prev today',
		center: '',
		right: 'title'
	},
	buttonIcons: {
		prev: 'right-single-arrow',
		next: 'left-single-arrow',
		prevYear: 'right-double-arrow',
		nextYear: 'left-double-arrow'
	},
	themeButtonIcons: {
		prev: 'circle-triangle-e',
		next: 'circle-triangle-w',
		nextYear: 'seek-prev',
		prevYear: 'seek-next',
		menu: 'icon-reorder'
	}
};
