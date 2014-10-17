/* Current Time Line
Displays a line for the agenda views marking the current time, moves with he passage of time
----------------------------------------------------------------------------------------------------------------------*/
function CurrentTimeLine(curCalView, options) {
  var t = this;

  var minHour = curCalView.timeGrid.minTime.hours()
  var minMinutes = curCalView.timeGrid.minTime.minutes()
  var maxHour = curCalView.timeGrid.maxTime.hours()
  var maxMinutes = curCalView.timeGrid.maxTime.minutes()
  var parentDiv = curCalView.el.parent();
  var timezone = curCalView.opt("timezone")
  
  var startTime = moment.tz(curCalView.start.set("hour", minHour ).set("minutes", minMinutes), timezone)
  var finishTime = startTime.clone().set("hour", maxHour ).set("minutes", maxMinutes)
  var duration =  (finishTime - startTime)/1000

  var timeline = $("<hr class='timeline'>")


  t.start = start
  t.stop = stop

  function start () {
    var timeLineRequired = isTimeLineRequired()
    if (timeLineRequired) {
      t.timelineInterval = setInterval(function(){setTimeline()}, 1500)
    }
    parentDiv.append(timeline);
    return t
  }

  function stop() {
    clearInterval(t.timelineInterval)
    timeline.remove() 
  }

  function isTimeLineRequired(){
    var currentTime = moment.tz(moment(), timezone)
    return (currentTime > startTime  && currentTime < finishTime)
  }

  function setTimeline() {
   var currentTime = moment.tz(moment(), timezone)
   var currentTimeDuration = (currentTime - startTime)/1000
   var timeLineRequired = isTimeLineRequired()

   if (timeLineRequired) {
     timeline.show();
   } else {
     timeline.hide();
   }

  var percentOfDay = currentTimeDuration / duration;
  var topLoc = Math.floor(parentDiv.height() * percentOfDay);

  timeline.css({"top": topLoc + "px", width: calcWidth(), left: calcLeft()  });

  }

  function calcWidth () {
    if (curCalView.name == "agendaWeek") { //week view, don't want the timeline to go the whole way across
      var dayCol = $(".fc-today:visible");
      if(dayCol.position() != null)
      {
        return dayCol.width() + 1;
      }
    } else {
      return parentDiv.width() - 66 //for margin + borders. in future pull this varible from view
    }
  }

  function calcLeft() {
    if (curCalView.name == "agendaWeek") {
      var dayCol = $(".fc-today:visible");
      if(dayCol.position() != null)
      {
        return dayCol.position().left + 1;
      }
    } else {
      return 33 //for margin + borders. in future pull this varible from view
    }
  }
}