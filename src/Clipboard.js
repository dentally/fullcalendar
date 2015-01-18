
/* Calendar Clipboard
----------------------------------------------------------------------------------------------------------------------*/

function ClipBoard(calendar, options) {
  var t = this;

  // exports
  t.render = render;
  t.destroy = destroy;
  t.eventDropped = eventDropped;
  t.getClipBoardElement = getClipBoardElement;
  t.closeDropDown = closeDropDown;
  //t.renderClipboardEvents = renderClipboardEvents;

  //locals
  var clipBoardElement;
  var clipBoardEvents = options.clipboardEvents;

  bindCollectionEvents();

  function bindCollectionEvents() {
    clipBoardEvents.bind('reset', renderClipboardEvents);
    clipBoardEvents.bind('remove', renderClipboardEvents);
    clipBoardEvents.bind('add', renderClipboardEvents);
  }

  function render(el) {
    clipBoardElement = '<div class="dropdown">';
    clipBoardElement += '<a class="dropdown-toggle" role="button" data-toggle="dropdown" data-target="#" href="#">';
    clipBoardElement += '<i class="fa-icon icon-paper-clip"></i>';
    clipBoardElement += '<i class="fa-icon icon-caret-down"></i>';
    clipBoardElement += '</a>';
    clipBoardElement += '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"></ul>';
    clipBoardElement += '<div class="notification" style="display: block;"></div>';
    clipBoardElement += '</div>';
    clipBoardElement = $(clipBoardElement);
    el.find('.fc-right').prepend(clipBoardElement);
  }

  function getClipBoardElement() {
    return clipBoardElement;
  }

  function destroy() {  }

  function eventDropped(event) {
    calendar.trigger('moveEventToClipboard', this, clipBoardEvents, event, calendar.getView());
  }

  function eventDrag(ev) {
    var cbEvent = ev.data.cbEvent;
    var view = calendar.getView();
    var dropStartTime;
    var dropFinishTime;
    var dropCol;

    if (view.name === 'month') { return null;}
    var mouseFollower = new MouseFollower($(this), {
      parentEl: view.calendar.getElement(),
      opacity: view.opt('dragOpacity'),
      revertDuration: view.opt('dragRevertDuration'),
      zIndex: 10, // one above the .fc-view
      width: '300px'
    });
    var dragListener = new DragListener(view.coordMap, {
      listenStart: function(ev) {
        mouseFollower.start(ev);
      },
      cellOver: function(cell, date) {
        dropStartTime = cell.date.clone();
        dropFinishTime = date.clone().add(cbEvent.clipboard_duration, 'minutes');
        var seg = null;
        dropCol = cell.col;
        view.renderDrag(dropStartTime, dropFinishTime, seg, dropCol);
        mouseFollower.show();
      },
      cellOut: function() {
        dropStartTime = null;
        dropFinishTime = null;
        dropCol = null;
        view.destroyDrag();
      },
      listenStop: function() {
        view.destroyDrag();
        mouseFollower.stop();
        var newResource = calendar.getResources()[dropCol];
        if (dropStartTime){
          calendar.trigger('clipBoardEventDropped', this, dropStartTime, dropFinishTime, newResource, cbEvent, clipBoardEvents);
          t.closeDropDown();
        }
      }
    });
    dragListener.mousedown(ev);
  }

  function renderClipboardEvents() {
    var clipboardItems = clipBoardElement.find('ul');
    clipboardItems.html('');
    clipBoardEvents.each(function(cbEvent) {
      var item = renderClipboardEvent(cbEvent);
      item.on('mousedown', 'a', { cbEvent: cbEvent.toJSON() }, eventDrag);
      item.on('click', '.remove-event', function(ev) {
        ev.stopImmediatePropagation();
        var event = {};
        event.model = cbEvent;
        calendar.trigger('deleteEvent', this, event);
      });
      item.on('click', '.find-availability', function(ev) {
        ev.stopImmediatePropagation();
        var options = {
          resource_id: cbEvent.get("practitioner_id"),
          duration: cbEvent.get("clipboard_duration")
        };
        $(".fc-findSlot-button").trigger("openSearch", options);
      });
      clipboardItems.append(item);
    });
    updateNotificationCount();
  }

  function renderClipboardEvent(cbEvent) {
    // Must return an li element
    return calendar.trigger('renderClipboardEvent', this, cbEvent) || $("<li><a href='#' class='clipboard-event'>Event</a></li>");
  }

  function updateNotificationCount() {
    var badgeEl = clipBoardElement.find('.notification');
    if (clipBoardEvents.length === 0) {
      badgeEl.hide();
    } else {
      badgeEl.show().text(clipBoardEvents.length);
    };
  }

  function closeDropDown() {
    clipBoardElement.find('.dropdown-toggle').dropdown('toggle');
  }

};