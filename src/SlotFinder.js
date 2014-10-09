/* Slot Finder
A modual for finding free slots which meet the search critiea Linked into header and Ui is part of the header
requests free slots from an API rather than searching internally within the calendar 
----------------------------------------------------------------------------------------------------------------------*/
function SlotFinder(header, calendar, headerEl, options) {
  var t = this;
  var el = headerEl.find(".fc-findSlot-button");
  var clickCount = 0
  
  // Exports
  t.setupSlotFinder = setupSlotFinder;
  t.toggleSlotFinder = toggleSlotFinder;


  function setupSlotFinder(){
    el.popover({placement: "bottom", title: "Find Slot", html: true, content: popoverContent(), container: ".fc-toolbar", trigger: "manual"});
    return t
  }

  function popoverContent() {
    var el = $("<div></div>");
    el.append(resourceOptions());
    el.append(intervalOptions());
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

  function intervalOptions() {
    var el = "Interval - <select name='interval'>";
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
    console.log("fetching")
  }



}