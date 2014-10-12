/* Slot Finder
A modual for finding free slots which meet the search critiea Linked into header and Ui is part of the header
requests free slots from an API rather than searching internally within the calendar 
----------------------------------------------------------------------------------------------------------------------*/
function SlotFinder(header, calendar, headerEl, options) {
  var t = this;
  var el = headerEl.find(".fc-findSlot-button");
  var clickCount = 0
  var retryCount = 0
  var popoverEl
  var timezone = options.timezone
  var nextDate = calendar.getDate()

  //request variables
  var ajaxInFLight = false
  var url = options.availability_url
  var quick = false
  var defaultSlotDuration = moment.duration(options.slotDuration || "00:15:00").asMinutes() 
  // asumumes resourceParam is in default rails/restfull like convention eg. This would translate user_id to users
  var resourceParam = options.resourceParam && options.resourceParam.split("_")[0] + "s"
  var offset = 0
  var startDate
  var endDate
  
  // Exports
  t.setupSlotFinder = setupSlotFinder;
  t.toggleSlotFinder = toggleSlotFinder;
  t.closeBtnClick = closeBtnClick;
  t.resetBtnClick = resetBtnClick;
  t.findBtnClick = findBtnClick;


  function setupSlotFinder(){
    var popover = el.popover({placement: "bottom", title: "Find Slot", html: true, content: popoverContent(), container: ".fc-toolbar", trigger: "manual"});
    popoverEl = popover.data("bs.popover").tip()
    return t
  }

  function popoverContent() {
    var el = $("<div></div>");
    var buttons = ["find", "reset", "close"]
    el.append(resourceOptions());
    el.append(durationOptions());
    $.each(buttons, function(i, button){
      var btn = $("<div class='btn btn-mini'> " + button + "</div>")
      btn.click(function(){
        t[button + "BtnClick"]()
      })
      el.append(btn);
    })
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
    quick = true
    fetchFreeSlots()
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
    if (ajaxInFLight == true) {return null}
    params = buildParams()
    ajaxInFLight = true
    $.getJSON(url, params).then(function(response){showResults(response)}
    )
  }

  function buildParams() {
    var parms 
    params = {
      duration: getDuration(),
      offset: offset
    }
    startDate ? params["start_date"] = startDate : params["start_date"] = calendar.getDate().format("YYYY/MM/DD")
    endDate ? params["end_date"] = endDate : null
    quick ? params["limit"] = 1 : params["limit"] = 20
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
    if(!response){
      noResults()
    }
    else if (response.length == 1){
      gotToTimeSlot(response[0])
      listResults(response)
      offset += 1
    }
    else{
      listResults(response)
      offset += 1
    }
    ajaxInFLight = false
  }

  function noResults() {
    console.log("no results")
    resetParms()
    if (retryCount <= 5){
      setDateParams()
      fetchFreeSlots()
      retryCount++
    }
  }

  function gotToTimeSlot(slot) {
    var start = calendar.moment(moment.tz(slot.start_time, timezone))
    var end = calendar.moment(moment.tz(slot.finish_time, timezone))
    calendar.gotoDay(slot.start_time)
    var view = calendar.getView()
    view.timeGrid.highlightTimeSlot(start, end)
  }

  function listResults(slots) {
    console.log("list")
  }

  function resetParms() {
    offset = 0
    startDate = null
    endDate = null
  }

  function findBtnClick() {
    fetchFreeSlots()
  }

  function resetBtnClick() {
    nextDate = calendar.getDate()
    resetParms()
  }

  function closeBtnClick() {
    el.popover('hide');
  }

  function setDateParams() {
    startDate = nextDate.add(1, "day")
    endDate = startDate.clone().add(1, "week")
    nextDate = endDate
    endDate = endDate.format("YYYY/MM/DD")
    startDate = startDate.format("YYYY/MM/DD")
  }

}