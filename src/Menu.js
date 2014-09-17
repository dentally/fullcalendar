
/* Side bar menu
----------------------------------------------------------------------------------------------------------------------*/

function Menu(calendar, options, menuContainer) {
  var t = this;

  t.updateDatePicker = updateDatePicker;
  t.render = render;
  t.destroy = destroy;
  
  // locals
  var menuShown = false;
  var datePicker;


  function render() {
    if (!menuShown){
      var menuContent = $(renderMenu());
      menuContent.find(".close").click(function(){ destroy() });
      menuContainer.append(menuContent);
      setupDatePicker(menuContent);
      menuShown = true;
    }
  }
  
  
  function destroy() {
    menuContainer.find(".close").unbind();
    menuContainer.html("");
    menuShown = false;
  }
  
  function renderMenu() {
    var html;
    html = "<div class='fc-menu-content'>";
    html += "<span class='close'>X</span>";
    html += "<div class='fc-date-picker'></div>";
    html += "<span>Calendars</span>";
    if (options.resourceList) {
      html += "<div class='fc-resource-list'>" + renderResourseList() + "</div>";
    }
    html += "</div>";
    return html;
  }

  function setupDatePicker(menuElement) {
    var datePickerEl = $(menuElement.find('.fc-date-picker'));
    datePicker = datePickerEl.datepicker({
      dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
      showOtherMonths: true,
      onSelect: setDate,
      dateFormat: "yy-mm-dd",
      selectOtherMonths: true,
      defaultDate: calendar.getDate().format("YY-MM-DD")
    });
  }

  function setDate(date) {
    calendar.gotoDate(date);
  }

  function updateDatePicker(date) {
    if (menuShown){
      datePicker.datepicker("setDate", date.format("YY-MM-DD"));
    }
  }

  function renderResourseList() {
    var resources = "<ul>";
    $.each(options.resourceList, function(index, res){
      resources += "<li>" + res.name;
      resources += "<input ";
      res.shown ? resources += 'checked': null ;
      resources += " type='checkbox'/>";
      resources += "</li>";;
    })
    resources += "</ul>";
    return resources;
  }

}