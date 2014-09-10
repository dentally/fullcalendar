
/* Top toolbar area with buttons and title
----------------------------------------------------------------------------------------------------------------------*/
// TODO: rename all header-related things to "toolbar"

function ClipBoard(calendar, options) {
  var t = this;

  // exports
  t.render = render;
  t.destroy = destroy;
  t.eventDropped = eventDropped;
  t.removeEvent = removeEvent;
  t.getClipBoardElement = getClipBoardElement;
  //t.renderClipboardEvents = renderClipboardEvents;

  //locals
  var clipBoardElement
  var clipBoardEvents = options.clipboardEvents

  bindCollectionEvents()

  function bindCollectionEvents() {
    clipBoardEvents.bind('reset', renderClipboardEvents)
  }

  function render(el) {
    clipBoardElement = '<div class="dropdown">'
    clipBoardElement += '<a class="dropdown-toggle" role="button" data-toggle="dropdown" data-target="#" href="#">'
    clipBoardElement += '<i class="fa-icon icon-paper-clip"></i>'
    clipBoardElement += '<i class="fa-icon icon-caret-down"></i>'
    clipBoardElement += '</a>'
    clipBoardElement += '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"></ul>'
    clipBoardElement += '<div class="notification" style="display: block;"></div>'
    clipBoardElement += '</div>'
    clipBoardElement = $(clipBoardElement)
    el.find(".fc-right").prepend(clipBoardElement)
  }

  function getClipBoardElement() {
    return clipBoardElement
  }

  function destroy() {

  }

  function eventDropped(event) {
    calendar.trigger("moveEventToClipboard", clipBoardEvents, event)
  }

  function removeEvent(event) {

  }

  function eventDrag(ev) {
    var cbEvent = ev.data.cbEvent
    var view = calendar.getView()
    var grid = view.dayGrid || view.timeGrid
    var dropDate
    var dropCol
    var mouseFollower = new MouseFollower($(this), {
      parentEl: view.calendar.getElement(),
      opacity: view.opt('dragOpacity'),
      revertDuration: view.opt('dragRevertDuration'),
      zIndex: 10 // one above the .fc-view
    });
    var dragListener = new DragListener(view.coordMap, {
      listenStart: function(ev) {
        mouseFollower.start(ev);
      },
      cellOver: function(cell, date) {
        var newStart = date.clone()
        var newEnd = date.clone().add(cbEvent.clipboard_duration, 'minutes')
        var seg = null
        dropDate = date;
        dropCol = cell.col
        var mockEvent = view.renderDrag(newStart, newEnd, seg, dropCol)
        mouseFollower.show();
      },
      cellOut: function() {
        dropDate = null;
        dropCol = null;
        view.destroyDrag();
      },
      listenStop: function() {
        view.destroyDrag();
        mouseFollower.stop();
        var newResource = calendar.getResources()[dropCol]
        calendar.trigger("clipBoardEventDropped", dropDate, newResource, cbEvent)
      }
    });
    dragListener.mousedown(ev);
  }

  function renderClipboardEvents() {
    var clipboardItems = clipBoardElement.find("ul")
    clipBoardEvents.each( function(cbEvent){
      var item = renderClipboardEvent(cbEvent)
      item.on("mousedown", {cbEvent: cbEvent.toJSON()}, eventDrag)
      clipboardItems.append(item)
    })
    updateNotificationCount()
  }

  function renderClipboardEvent(cbEvent) {
    return $("<li><a href='#' class='clipboard-event'>Event</a></li>")
  }

  function updateNotificationCount() {
    var badgeEl = clipBoardElement.find(".notification")
    badgeEl.text(clipBoardEvents.length)
  }

}