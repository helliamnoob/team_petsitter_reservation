let url = location.href;
let idx = url.indexOf('=');
let id;
if (idx >= 0) {
   idx = idx + 2;
   id = url.substring(idx, url.length);
}
console.log(id);

document.addEventListener('DOMContentLoaded', async function () {
    let calendarEl = document.getElementById('calendar');
  
    let calendar = new FullCalendar.Calendar(calendarEl, {
      selectable: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      dateClick: async function (info) {
        alert('selected ' + info.date);
        const response = await fetch(`/petsitters/${id}/reservations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ start_date: info.date, end_date: info.date }),
        });
        await response.json().then((result) => {
          const errorMessage = result.errorMessage;
          if (errorMessage) {
            alert(result.errorMessage);
          } else {
            alert(result.message);
          }
          window.location.href='/reservation'
        });
      },
    });
    calendar.render();
  });