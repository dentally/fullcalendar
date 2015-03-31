/* Working hours
Blocks off time which is shown on the calendar but out of working hours
Did look into tailoring slotBgCellHtml and adding an out of hour class
but had to look rows and columns = huge performance hit. 
----------------------------------------------------------------------------------------------------------------------*/
function WorkingHours(curCalView, workingHours) {
  var t = this;
  var startTimes = workingHours.startTimes;
  var finishTimes = workingHours.finishTimes;

  var minHour = curCalView.timeGrid.minTime.hours();
  var minMinutes = curCalView.timeGrid.minTime.minutes();
  var maxHour = curCalView.timeGrid.maxTime.hours();
  var maxMinutes = curCalView.timeGrid.maxTime.minutes();


  t.overlayNonWorkingHours = overlayNonWorkingHours;

  function overlayNonWorkingHours() {
    var days;
    if (!areTimesValid()){return null;}
    days = curCalView.end.diff(curCalView.start, "days");
    for (var day = 0; day < days; day++){
      var currentDay = curCalView.start.clone().add(day, "days");
      overlayTimeBeforeStart(currentDay);
      overlayTimeAfterEnd(currentDay);
    }
  }

  function overlayTimeBeforeStart(currentDay) {
    var openingTime, startOfBlock, endOfBlock;
    openingTime = startTimes[currentDay.day()].split(":");
    startOfBlock = fc.moment(currentDay).set("hour", minHour).set("minutes", minMinutes);
    endOfBlock = startOfBlock.clone().set("hour", openingTime[0]).set("minutes", openingTime[1]);
    curCalView.timeGrid.highlightNonWorkingPeriod(startOfBlock, endOfBlock);
  }

  function overlayTimeAfterEnd(currentDay) {
    var closingTime, startOfBlock, endOfBlock;
    closingTime = finishTimes[currentDay.day()].split(":");
    endOfBlock = fc.moment(currentDay).set("hour", maxHour).set("minutes", maxMinutes);
    startOfBlock = endOfBlock.clone().set("hour", closingTime[0]).set("minutes", closingTime[1]);
    curCalView.timeGrid.highlightNonWorkingPeriod(startOfBlock, endOfBlock);
  }

 //validating input

 function areTimesValid() {
  return containsTimes() && containsTimesForAllDays();
 }

 function containsTimes() {
  return startTimes && finishTimes;
 }
 
 function containsTimesForAllDays() {
  return startTimes.length === 7 && finishTimes.length === 7;
 }


}