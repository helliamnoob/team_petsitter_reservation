let url = location.href;
let idx = url.indexOf('=');
let id;
if (idx >= 0) {
  idx = idx + 2;
  id = url.substring(idx, url.length);
}
let status = url.indexOf('petsitters');
let post = false;
if (status >= 0) {
  post = true;
}
console.log(post);

if (post === true) {
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

        const check = info.date;
        const today = new Date();
        if (check < today) {
          alert('과거는 예약할 수 없습니다.');
        } else {
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
            window.location.href = '/reservation';
          });
        }
      },
    });
    calendar.render();
  });
}else if(post === false)
{
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
            const response = await fetch(`/reservations/${id}`, {
              method: 'PUT',
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
}