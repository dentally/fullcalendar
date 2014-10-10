/* Slot Finder
A modual for finding free slots which meet the search critiea Linked into header and Ui is part of the header
requests free slots from an API rather than searching internally within the calendar 
----------------------------------------------------------------------------------------------------------------------*/
function SlotFinder(header, calendar, headerEl, options) {
  var t = this;
  var el = headerEl.find(".fc-findSlot-button");
  var clickCount = 0
  var popoverEl

  //request variables
  var url = options.availability_url
  var quick = false
  var defaultSlotDuration = moment.duration(options.slotDuration || "00:15:00").asMinutes() 
  // asumumes resourceParam is in default rails/restfull like convention eg. This would translate user_id to users
  var resourceParam = options.resourceParam && options.resourceParam.split("_")[0] + "s"
  
  // Exports
  t.setupSlotFinder = setupSlotFinder;
  t.toggleSlotFinder = toggleSlotFinder;


  function setupSlotFinder(){
    var popover = el.popover({placement: "bottom", title: "Find Slot", html: true, content: popoverContent(), container: ".fc-toolbar", trigger: "manual"});
    popoverEl = popover.data("bs.popover").tip()
    return t
  }

  function popoverContent() {
    var el = $("<div></div>");
    el.append(resourceOptions());
    el.append(durationOptions());
    el.append("<div class='btn btn-mini'> Find</div>");
    return el;
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
    for(i=15; i < 120 ; i+= 15){
      el += "<option value='" + i +"'>" + i + "</option>";
    }
    el += "</select>";
    el += "<br/>";
    return el;
  }

  function quickSlotFind() {
    el.popover('hide');
    fetchFreeSlots()
    quick = true
  }

  function toggleSlotFinder() {
    clickCount += 1
    setTimeout(function(){determineClickAction()}, 250);
  }

  function determineClickAction() {
    if (clickCount == 1){
      quickSlotFind()
    }
    else if (clickCount > 1) {
      el.popover('show');
    }
    clickCount = 0
  }

  function fetchFreeSlots() {
    params = buildParams()
    $.getJSON(url, params).then(function(response){showResults(response)}
    )
  }

  function buildParams() {
    var parms 
    params = {
      duration: getDuration(),
      start_date: calendar.getDate().format("YYYY/MM/DD"),
      quick: quick
    }
    params[resourceParam] = getActiveResources()
    return params
  }

  function getDuration () {
    return parseInt(popoverEl.find("[name='duration']").val()) || defaultSlotDuration
  }

  function getActiveResources () {
    var formValue = popoverEl.find("[name='resource_id']").val()
    if (formValue && formValue != "0"){
      return [formValue]
    }
    else{
      var resources = calendar.getResources() || []
      resourceArray =  $.map(resources, function(res){
        return parseInt(res.id, 10)
      })
      return resourceArray
    }
  }

  function showResults(response) {
    if(response.length == 0){
      noResults()
    }
    else if (response.length == 1){
      gotToTimeSlot(response[0])
      listResults(response)
    }
    else{
      listResults(response)
    }
  }

  function noResults() {
    console.log("no results")

  }

  function gotToTimeSlot(slot) {
    var start = calendar.moment(slot.start_time)
    var end = calendar.moment(slot.finish_time)
    calendar.gotoDay(slot.start_time)
    var view = calendar.getView()
    view.timeGrid.highlightTimeSlot(start, end)
  }

  function listResults(slots) {
    console.log("list")
  }

}