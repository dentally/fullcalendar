/* Working hours
Blocks off time which is shown on the calendar but out of working hours
Did look into tailoring slotBgCellHtml and adding an out of hour class
but had to look rows and columns = huge performance hit. 
----------------------------------------------------------------------------------------------------------------------*/
function WorkingHours(curCalView, workingHours) {
  var t = this;
  var startTimes = workingHours.startTimes
  var finishTimes = workingHours.finishTimes

  var minHour = curCalView.timeGrid.minTime.hours()
  var minMinutes = curCalView.timeGrid.minTime.minutes()
  var maxHour = curCalView.timeGrid.maxTime.hours()
  var maxMinutes = curCalView.timeGrid.maxTime.minutes()
  var timezone = curCalView.opt("timezone")


  t.overlayNonWorkingHours = overlayNonWorkingHours

  function overlayNonWorkingHours () {
    if (!areTimesValid()){return null}
    days = curCalView.end.diff(curCalView.start, "days")
    for (day = 0; day < days; day++){
      var currentDay = curCalView.start.clone().add(day, "days")
      overlayTimeBeforeStart(currentDay)
      overlayTimeAfterEnd(currentDay)
    }
  }

  function overlayTimeBeforeStart(currentDay) {
    startOfBlock = fc.moment(currentDay).set("hour", minHour ).set("minutes", minMinutes)
    endOfBlock = startOfBlock.clone().set('hour', startTimes[currentDay.day()] );
    curCalView.timeGrid.highlightNonWorkingPeriod(startOfBlock, endOfBlock)
  }

  function overlayTimeAfterEnd(currentDay) {
    endOfBlock = fc.moment(currentDay).set("hour", maxHour ).set("minutes", maxMinutes)
    startOfBlock = startOfBlock.clone().set('hour', finishTimes[currentDay.day()] );
    curCalView.timeGrid.highlightNonWorkingPeriod(startOfBlock, endOfBlock)
  }

 //validating input

 function areTimesValid () {
  return containtsTimes() && containsTimesForAllDays()
 }

 function containtsTimes() {
  return startTimes && finishTimes
 }
 
 function containsTimesForAllDays () {
  return startTimes.length === 7 && finishTimes.length === 7
 }


}