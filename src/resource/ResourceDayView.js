
fcViews.resourceDay = ResourceDayView;

function ResourceDayView(calendar) {
  ResourceView.call(this, calendar); // call the super-constructor
}
  
ResourceDayView.prototype = createObject(ResourceView.prototype); // define the super-class
console.log(ResourceDayView.prototype)
$.extend(ResourceDayView.prototype, {

  name: 'resourceDay',


  incrementDate: function(date, delta) {
    var out = date.clone().stripTime().add(delta, 'days');
    out = this.skipHiddenDays(out, delta < 0 ? -1 : 1);
    return out;
  },


  render: function(date) {
    var cols = this.calendar.getResources().length;

    this.start = this.intervalStart = date.clone().stripTime();
    this.end = this.intervalEnd = this.start.clone().add(1, 'days');

    this.title = this.calendar.formatDate(this.start, this.opt('titleFormat'));

    ResourceView.prototype.render.call(this, cols); // call the super-method
  },

  headCellHtml: function(row, col, date) {
    var calendar = this.calendar;
    var resources = calendar.getResources();
    var name
  
    if(resources[col]) {
      name = resources[col].name;
    }
    else {
      name = "Unknown";
    }
  
    return '' +
      '<th class="fc-day-header ' + this.widgetHeaderClass + ' fc-' + dayIDs[date.day()] + '">' +
        htmlEscape(name) +
      '</th>';
  },

});