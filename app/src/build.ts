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

// Build web app
function doGet(e: any) {

  // Get events
  const calendar: Calendar[] = getCalendar();

  // Available functions
  const onClickForCreateEvent = (date: Date, type: string) => `google.script.run.createEvent(${JSON.stringify(
    {
      date: date.toString(),
      type: type
    }
  )})`;

  // Create events slots
  const timeSlot = (date: Date, events: Calendar['events'], time: 9 | 12 | 17) => {

    // Set time
    const slot = date
    date.setHours(time);

    // Show existing events
    if (events.length > 0) {
      return events
        .map(event => `<p class="p-2 rounded text-white bg-green-500">${event.title}</p>`)
        .join('')
    } else {
      // OR show a button to create a new one
      return `<button class="p-2 rounded text-white bg-yellow-500" onClick='${onClickForCreateEvent(slot, 'New')}'>Add event</button>`
    }
  }

  // Create a card for each day
  const days = calendar.map(day => `
  <div class="p-2 flex flex-col justify-center space-y-2 border rounded-sm">
    <p class="font-bold">${day.date.getDate() + '/' + day.date.getMonth()}</p>
    <p>Morning</p>
    ${timeSlot(day.date, day.events.filter(event => event.startTime < 12), 9)}
    <p>Afternoon</p>
    ${timeSlot(day.date, day.events.filter(event => event.startTime > 12 && event.startTime < 17), 12)}
    <p>Evening</p>
    ${timeSlot(day.date, day.events.filter(event => event.startTime > 17), 17)}
</div>
  `);

  // Turn code into HTML
  const elements = `
    <div class="w-full max-w-screen p-4 flex flex-row space-x-4 overflow-x-scroll">
      ${days.join('')}
    </div>
  `;
  const html: string = `
  < !DOCTYPE html >
    <html>
    <head>
    <base target="_top" >
      </head>
      < body >
      <script src="https://cdn.tailwindcss.com" > </script>
        < div class="w-full max-w-screen h-full p-2 flex flex-row space-x-2" >
          ${elements}
        </div>
  < /body>
  < /html>
    `

  const evaluation = HtmlService.createHtmlOutput(html);
  Logger.log(evaluation.getContent())
  return evaluation;

}


