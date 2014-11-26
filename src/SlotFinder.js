/* Slot Finder
A modual for finding free slots which meet the search critiea Linked into header and Ui is part of the header
requests free slots from an API rather than searching internally within the calendar
----------------------------------------------------------------------------------------------------------------------*/
function SlotFinder(header, calendar, el, options) {
  var t = this;
  var retryCount = 0;
  var popoverEl;
  var timezone = options.timezone;
  var nextDate = calendar.getDate();
  var resultsTable;

  //request variables
  var startDate = calendar.getDate();
  var endDate = calendar.getDate().add(1, "month")

  var ajaxInFLight = false;
  var url = options.availability_url;
  var defaultSlotDuration = moment.duration(options.slotDuration || "00:15:00").asMinutes();
  // asumumes resourceParam is in default rails/restfull like convention eg. This would translate user_id to users
  var resourceParam = options.resourceParam && options.resourceParam.split("_")[0] + "s";
  var offset = 0;
  var resultsPerRequest = 15;

  // Exports
  t.setupSlotFinder = setupSlotFinder;
  t.toggleSlotFinder = toggleSlotFinder;


  function setupSlotFinder() {
    var popover = el.popover({
      placement: "bottom",
      title: "Find Slot",
      html: true,
      content: popoverContent(),
      container: ".fc-toolbar",
      trigger: "manual"
    });
    popoverEl = popover.data("bs.popover").tip();
    popover.on("shown.bs.popover", function() {  bindSelectionChanges(popoverEl) })
    return t;
  }

  function popoverContent() {
    var el = $("<div></div>");
    var tableContainer = $("<div class='fc-freeslot-results-container'></div>");
    resultsTable = $("<table class='fc-freeslot-results table table-striped'></table>");
    tableContainer.append(resultsTable);
    el.append(resourceOptions());
    el.append(durationOptions());
    el.append("<div class='search-date'></div>");
    el.append(tableContainer);
    return el;
  }

  function resourceOptions() {
    var resources = calendar.getResources() || [];
    var el = "<select name='resource_id'>";
    el += "<option value='0'>Anyone</option>";
    for(var i=0; i < resources.length; i++){
      el += "<option value='" + resources[i].id +"'>" + resources[i].name + "</option>";
    }
    el += "</select> for ";
    return el;
  }

  function durationOptions() {
    var selected
    var el = "<select name='duration'>";
    for(var i = defaultSlotDuration; i <= 120 ; i+= 5) {
      el += "<option value='" + i +"'>" + i + "</option>";
    }
    el += "</select> minutes";
    el += "<br/>";
    return el;
  }

  function toggleSlotFinder() {
    el.popover('toggle');
    reset()
  }

  function fetchFreeSlots() {
    var params;
    if (ajaxInFLight === true) {return null;}
    params = buildParams();
    ajaxInFLight = true;
    resultsTable.html("<tr><td>Searching...</td></tr>");
    $.getJSON(url, params)
      .done(function(response) {
        showResults(response);
      })
      .fail(function(response) {
        ajaxInFLight = false;
        resultsTable.html("<tr><td>Error please try <a href='#'>again</a></td></tr>");
        resultsTable.find("a").click(function(e) { findClick(e) })
      });
  }

  function buildParams() {
    var params;
    params = {
      duration: getDuration(),
      offset: offset
    };
    params.start_date = startDate.format("YYYY/MM/DD");
    params.end_date = endDate.format("YYYY/MM/DD");
    params.limit = resultsPerRequest;
    params[resourceParam] = getActiveResources();
    return params;
  }

  function getDuration() {
    return parseInt(popoverEl.find("[name='duration']").val(), 10) || defaultSlotDuration;
  }

  function getActiveResources() {
    var formValue = popoverEl.find("[name='resource_id']").val();
    if (formValue && formValue != "0"){
      return [formValue];
    }
    else{
      var resources = calendar.getResources() || [];
      var resourceArray =  $.map(resources, function(res) {
        return parseInt(res.id, 10);
      });
      return resourceArray;
    }
  }

  function showResults(response) {
    if (!response){
      noResults();
    }
    else {
      retryCount = 0;
      listResults(response);
      offset += resultsPerRequest;
    }
    ajaxInFLight = false;
  }

  function noResults() {
    ajaxInFLight = false;
    resetParms();
    if (retryCount <= 5){
      setDateParams();
      fetchFreeSlots();
      retryCount++;
    }
  }

  function gotToTimeSlot(slot) {
    var start = calendar.moment(moment.tz(slot.start_time, timezone));
    var end = calendar.moment(moment.tz(slot.finish_time, timezone));
    calendar.gotoDay(slot.start_time);
    var view = calendar.getView();
    view.timeGrid.highlightTimeSlot(start, end);
  }

  function listResults(slots) {
    resultsTable.html("");
    $.each(slots, function(i, slot) {
      var tr = $("<tr><td>" + moment.tz(slot.start_time, timezone).format("HH:mm - dddd Do MMM YYYY") + " (" + slot.gap_size + ")</td></tr>");
      tr.data("slot", slot);
      tr.click(function(e) {
        resultsTable.find(".selected").removeClass("selected");
        var el = $(e.currentTarget);
        var slot = $(e.currentTarget).data("slot");
        el.addClass("selected");
        gotToTimeSlot(slot);
      });
      resultsTable.append(tr);
    });
    var tr = $("<tr><td><a href='#'>Find More</a></td></tr>");
    tr.click(function(e) {findClick(e)} )
    resultsTable.append(tr);
  }

  function resetParms() {
    offset = 0;
    startDate = calendar.getDate().isAfter(moment()) ? calendar.getDate() : moment();
    endDate = startDate.clone().add(1, "month");
  }

  function findClick(e) {
    e.preventDefault()
    fetchFreeSlots();
  }

  function reset() {
    nextDate = calendar.getDate();
    retryCount = 0;
    resetTable()
    resetParms();
    setStartDateText()
  }

  function resetTable() {
    var findSlotTr = $("<tr><td><a href='#'>Find Slots</a></td></tr>")
    resultsTable.html(findSlotTr)
    findSlotTr.click(function(e) { findClick(e) })
  }

  function setStartDateText() {
    var text = "Searching " + startDate.format("Do MMM YYYY") + " onwards"
    popoverEl.find(".search-date").html(text)
  }

  function setDateParams() {
    startDate = nextDate.clone();
    endDate = startDate.clone().add(1, "month");
    nextDate = endDate;
    setStartDateText()
  }

  function bindSelectionChanges(el) {
    el.find("select").on("change", function(){
      reset()
      fetchFreeSlots()
    })
  }

}