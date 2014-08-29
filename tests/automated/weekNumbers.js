
describe('weekNumbers', function() {

	beforeEach(function() {
		affix('#cal');
	});

	describe('when using month view', function() {

		describe('when using default weekNumbers', function() {
			it('should not display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'month'
				});
				var weekNumbersCount = $('.fc-content-skeleton thead .fc-week-number').length;
				expect(weekNumbersCount).toEqual(0);
			});
		});

		describe('when setting weekNumbers to false', function() {
			it('should not display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'month',
					weekNumbers: false
				});
				var weekNumbersCount = $('.fc-content-skeleton thead .fc-week-number').length;
				expect(weekNumbersCount).toEqual(0);
			});
		});

		describe('when setting weekNumbers to true', function() {
			it('should not display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'month',
					weekNumbers: true,
					weekMode: 'fixed' // will make 6 rows
				});
				var weekNumbersCount = $('.fc-content-skeleton thead .fc-week-number').length;
				expect(weekNumbersCount).toEqual(6);
			});
		});

	});

	describe('when using basicWeek view', function() {

		describe('with default weekNumbers ', function() {
			it('should not display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'basicWeek'
				});
				var weekNumbersCount = $('.fc-content-skeleton thead .fc-week-number').length;
				expect(weekNumbersCount).toEqual(0);
			});
		});

		describe('with weekNumbers to false', function() {
			it('should not display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'basicWeek',
					weekNumbers: false
				});
				var weekNumbersCount = $('.fc-content-skeleton thead .fc-week-number').length;
				expect(weekNumbersCount).toEqual(0);
			});
		});

		describe('with weekNumbers to true', function() {
			it('should display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'basicWeek',
					weekNumbers: true
				});
				var weekNumbersCount = $('.fc-content-skeleton thead .fc-week-number').length;
				expect(weekNumbersCount).toEqual(1);
			});
		});

	});

	describe('when using an agenda view', function() {

		describe('with default weekNumbers', function() {
			it('should not display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'agendaWeek'
				});
				var weekNumbersCount = $('.fc-week-number').length;
				expect(weekNumbersCount).toEqual(0);
			});
		});

		describe('with weekNumbers to false', function() {
			it('should not display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'agendaWeek',
					weekNumbers: false
				});
				var weekNumbersCount = $('.fc-week-number').length;
				expect(weekNumbersCount).toEqual(0);
			});
		});

		describe('with weekNumbers to true', function() {
			it('should display weekNumbers', function() {
				$('#cal').njCalendar({
					defaultView: 'agendaWeek',
					weekNumbers: true
				});
				var weekNumbersCount = $('.fc-week-number').length;
				// 1 row is axis
				expect(weekNumbersCount).toEqual(1);
			});
		});

	});

});