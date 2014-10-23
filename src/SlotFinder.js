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
  var popOverButtons = [];
  var buttons = ["find", "reset"];

  //request variables
  var startDate;
  var endDate;
  var ajaxInFLight = false;
  var url = options.availability_url;
  var nextFreeSlotURL = options.next_free_slot_url;
  var defaultSlotDuration = moment.duration(options.slotDuration || "00:15:00").asMinutes(); 
  // asumumes resourceParam is in default rails/restfull like convention eg. This would translate user_id to users
  var resourceParam = options.resourceParam && options.resourceParam.split("_")[0] + "s";
  var offset = 0;
  var nextSlotOffset = 0;
  var resultsPerRequest = 15;
  
  // Exports
  t.setupSlotFinder = setupSlotFinder;
  t.toggleSlotFinder = toggleSlotFinder;
  t.quickSlotFind = quickSlotFind;
  t.resetNextSlotOffset = resetNextSlotOffset;

  t.resetBtnClick = resetBtnClick;
  t.findBtnClick = findBtnClick;


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
    return t;
  }

  function popoverContent() {
    var el = $("<div></div>");
    var tableContainer = $("<div class='fc-freeslot-results-container'></div>");
    resultsTable = $("<table class='fc-freeslot-results table table-striped'><tr><td>No results</td></tr></table>");
    tableContainer.append(resultsTable);
    el.append(resourceOptions());
    el.append(durationOptions());
    $.each(buttons, function(i, button) {
      var btn = $("<div class='btn btn-mini'> " + capitaliseFirstLetter(button) + "</div>");
      popOverButtons.push(btn);
      el.append(btn);
    });
    setButtonEvents();
    el.append(tableContainer);
    return el;
  }

  function setButtonEvents() {
    $.each(buttons, function(i, button) {
      var btn = popOverButtons[i];
      btn.click(function() {
        t[button + "BtnClick"]();
      });
    });
  }

  function resourceOptions() {
    var resources = calendar.getResources() || [];
    var el = "Calendar - <select name='resource_id'>";
    el += "<option value='0'>All</option>";
    for(i=0; i < resources.length; i++){
      el += "<option value='" + resources[i].id +"'>" + resources[i].name + "</option>";
    }
    el += "</select>";
    el += "<br/>";
    return el;
  }

  function durationOptions() {
    var el = "Interval - <select name='duration'>";
    el += "<option value='0'>-</option>";
    for(i=15; i < 120 ; i+= 15) {
      el += "<option value='" + i +"'>" + i + "</option>";
    }
    el += "</select>";
    el += "<br/>";
    return el;
  }

  function quickSlotFind() {
    el.popover('hide');
    if (ajaxInFLight == true) {return null;}
    ajaxInFLight = true;
    params = {
      start_date: calendar.getDate().format("YYYY/MM/DD"),
      offset: nextSlotOffset
    };
    params[resourceParam] = getActiveResources();
    $.getJSON(nextFreeSlotURL, params)
      .done(function(response) {
        ajaxInFLight = false;
        if (response.length == 1) {
          gotToTimeSlot(response[0]);
          nextSlotOffset += 1;
        }
      })
      .fail(function(response) {
        ajaxInFLight = false;
      });
  }

  function toggleSlotFinder() {
    el.popover('toggle');
    resetParms();
    setButtonEvents();
  }

  function fetchFreeSlots() {
    if (ajaxInFLight == true) {return null;}
    params = buildParams();
    ajaxInFLight = true;
    resultsTable.html("<tr><td>Searching...</td></tr>");
    $.getJSON(url, params)
      .done(function(response) {
        showResults(response);
      })
      .fail(function(response) {
        ajaxInFLight = false;
        resultsTable.html("<tr><td>Error please try again</td></tr>");
      });
  }

  function buildParams() {
    var parms; 
    params = {
      duration: getDuration(),
      offset: offset
    };
    startDate ? params.start_date = startDate : params.start_date = calendar.getDate().format("YYYY/MM/DD");
    endDate ? params.end_date = endDate : params.end_date = calendar.getDate().add(1, "month").format("YYYY/MM/DD");
    params.limit = resultsPerRequest;
    params[resourceParam] = getActiveResources();
    return params;
  }

  function getDuration() {
    return parseInt(popoverEl.find("[name='duration']").val()) || defaultSlotDuration;
  }

  function getActiveResources() {
    var formValue = popoverEl.find("[name='resource_id']").val();
    if (formValue && formValue != "0"){
      return [formValue];
    }
    else{
      var resources = calendar.getResources() || [];
      resourceArray =  $.map(resources, function(res) {
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
      var tr = $("<tr><td>" + moment.tz(slot.start_time, timezone).format("HH:mm - dddd Do MMM YYYY") + "</td></tr>");
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
  }

  function resetParms() {
    offset = 0;
    nextSlotOffset = 0;
    startDate = null;
    endDate = null;
  }

  function resetNextSlotOffset() {
    nextSlotOffset = 0;
  }

  function findBtnClick() {
    fetchFreeSlots();
  }

  function resetBtnClick() {
    nextDate = calendar.getDate();
    retryCount = 0;
    resetParms();
  }

  function setDateParams() {
    startDate = nextDate.clone();
    endDate = startDate.clone().add(1, "month");
    nextDate = endDate;
    endDate = endDate.format("YYYY/MM/DD");
    startDate = startDate.format("YYYY/MM/DD");
  }

}