
var defaults = {

	lang: 'en',

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
		week: generateWeekColumnFormat,
		day: 'dddd' // like "Saturday"
	},
	timeFormat: { // for event elements
		'default': generateShortTimeFormat
	},

	displayEventEnd: {
		month: false,
		basicWeek: false,
		'default': true
	},

	// locale
	isRTL: false,
	defaultButtonText: {
		today: 'Today',
		addOneWeeks: '+w',
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
		addOneWeeks: 'Go forward one week',
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
	windowResizeDelay: 200 // milliseconds before a rerender happens

};


function generateShortTimeFormat(options, langData) {
	return langData.longDateFormat('LT')
		.replace(':mm', '(:mm)')
		.replace(/(\Wmm)$/, '($1)') // like above, but for foreign langs
		.replace(/\s*a$/i, 't'); // convert to AM/PM/am/pm to lowercase one-letter. remove any spaces beforehand
}


function generateWeekColumnFormat(options, langData) {
	var format = langData.longDateFormat('L'); // for the format like "MM/DD/YYYY"
	format = format.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, ''); // strip the year off the edge, as well as other misc non-whitespace chars
	if (options.isRTL) {
		format += ' ddd'; // for RTL, add day-of-week to end
	}
	else {
		format = 'ddd ' + format; // for LTR, add day-of-week to beginning
	}
	return format;
}


var langOptionHash = {
	en: {
		columnFormat: {
			week: 'ddd M/D' // override for english. different from the generated default, which is MM/DD
		},
		dayPopoverFormat: 'dddd, MMMM D'
	}
};


// right-to-left defaults
var rtlDefaults = {
	header: {
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
