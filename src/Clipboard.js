
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
  //t.renderClipboardEvents = renderClipboardEvents;

  //locals
  var clipBoardElement
  var clipBoardEvents = options.clipboardEvents

  bindCollectionEvents()

  function bindCollectionEvents() {
    clipBoardEvents.bind('reset', renderClipboardEvents)
  }

  function render(el) {
    clipBoardElement = '<div id="external-events" class="dropdown ui-droppable">'
    clipBoardElement += '<a class="dropdown-toggle" role="button" data-toggle="dropdown" data-target="#" href="#">'
    clipBoardElement += '<i class="icon icon-paper-clip"></i>'
    clipBoardElement += '<b class="caret"></b>'
    clipBoardElement += '</a>'
    clipBoardElement += '<ul id="clip_board" class="dropdown-menu" role="menu" aria-labelledby="dLabel"></ul>'
    clipBoardElement += '<div id="clipboard_notification" class="notification" style="display: block;"></div>'
    clipBoardElement += '</div>'
    clipBoardElement = $(clipBoardElement)
    el.find(".fc-right").prepend(clipBoardElement)
  }

  function destroy() {

  }

  function eventDropped(event) {

  }

  function removeEvent(event) {

  }

  function renderClipboardEvents() {
    var clipboardItems = clipBoardElement.find("ul")
    clipBoardEvents.each( function(event){
      var item = renderClipboardEvent(event)
      clipboardItems.append(item)
    })
    updateNotificationCount()
  }

  function renderClipboardEvent(event) {
    return $("<li>Event<li>")
  }

  function updateNotificationCount() {
    var badgeEl = clipBoardElement.find(".notification")
    badgeEl.text(clipBoardEvents.length)
  }

}