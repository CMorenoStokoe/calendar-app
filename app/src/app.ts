// Define types
interface Calendar {
  date: Date,
  events: {
    title: string,
    date: Date,
    startTime: number,
    endTime: number
  }[]
}

// Helper functions
const getDaysInRange = (startDate: Date, stopDate: Date): Date[] => {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

// * Get calendar events
const getCalendar = (dateRange: number = 21): Calendar[] => {

  // Get dates range
  const startDate = new Date(); // Today
  const endDate = new Date(); // Dates in x weeks time (3 weeks by default)
  endDate.setDate(startDate.getDate() + dateRange);

  // Get all events in this range
  const events = CalendarApp
    .getDefaultCalendar()
    .getEvents(startDate, endDate);

  // Construct a calendar object the front-end can call so we can treat them as "dumb"
  const calendar = getDaysInRange(startDate, endDate)
    .map(date => ({
      date: date,
      events: events
        .filter(event => date.getDate() === event.getStartTime().getDate())
        .map(event => ({
          title: event.getTitle(),
          date: date,
          startTime: event.getStartTime().getHours(),
          endTime: event.getEndTime().getHours()
        }))
    }));

  // Return list of events
  Logger.log(calendar[0])
  return calendar
}

// * Create calendar event
function createEvent(response: string) {
  Logger.log(response)

  // Extract payload
  const { date, type }: { date: Date, type: string } = JSON.parse(response)

  // Calculate end date
  const endDate = Date(date);
  endDate.setHours(endDate.getHours() + 3); // Default is a 3 hour long event

  // Create event
  CalendarApp.getDefaultCalendar().createEvent(
    type,
    date,
    endDate
  );
}

