
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
  var resourceList = options.resourceList;
  var resourcesEl = null;


  function render() {
    if (!menuShown){
      var menuContent = renderMenu();
      menuContent.find(".fc-resource-list").html(renderResourseList());
      menuContent.find(".close").click(function() { destroy(); });
      menuContainer.html(menuContent);
      setupDatePicker(menuContent);
      menuShown = true;
    }
  }
  
  
  function destroy() {
    resourcesEl.find("input").unbind();
    menuContainer.find(".close").unbind();
    menuContainer.html("");
    menuShown = false;
    resourcesEl = null;
  }
  
  function renderMenu() {
    var html;
    html = "<div class='fc-menu-content'>";
    html += "<span class='close'>X</span>";
    html += "<div class='fc-date-picker'></div>";
    html += "<span>Calendars</span>";
    if (resourceList) {
      html += "<div class='fc-resource-list'></div>";
    }
    html += "</div>";
    return $(html);
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
    resourcesEl = resourcesEl || $("<table></table>");
    resourceList.each(function(res, index) {
      var resourceEl = renderResourse(res);
      resourceEl.find("input").on("change", { resource: res.toJSON() }, resourceClick);
      resourcesEl.append(resourceEl);
    });
    return resourcesEl;
  }

  function renderResourse(res) {
    var el;
    el = "<tr><td>" + res.get('name') + "</td>";
    el += "<td><input ";
    if (res.get('show')) {el += 'checked'; }
    el += " type='checkbox'/>";
    el += "</td></tr>";
    return $(el);
  }

  function resourceClick(ev) {
    var resource = ev.data.resource;
    calendar.trigger("resourceToggled", calendar, this, resource.id);
    return true;
  }

}