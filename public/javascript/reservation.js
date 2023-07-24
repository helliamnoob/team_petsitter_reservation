async function getReservation() {
  try {
    // '/reservation' 경로로 GET 요청을 보냅니다.
    const response = await fetch('/reservations');
    // 서버로부터 받은 JSON 데이터를 파싱하여 JavaScript 객체로 변환합니다.
    const reservation = await response.json();
    // reservation 목록을 표시하는 함수를 호출합니다.
    displayReservation(reservation);
  } catch (error) {
    // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
    console.error(error);
  }
}

// reservation 목록을 화면에 표시하는 함수
function displayReservation(reservation) {
  // petsitterList라는 ID를 가진 HTML 요소를 선택합니다.
  const reservationList = document.getElementById('reservation');
  // 이전에 표시된 내용을 초기화합니다.
  reservationList.innerHTML = '';

  if (reservation.length === 0) {
    // 검색 결과가 없을 경우 "No petsitters found." 메시지를 표시합니다.
    reservationList.innerHTML = '<p>No reservation found.</p>';
    return;
  }

  reservation.map((reservation) => {
    const name = reservation.Petsitter['name'];
    const start_date = reservation['start_date'];
    const start = start_date.substr(0,10);
    const end_date = reservation['end_date'];
    const end = end_date.substr(0,10)
    const id = reservation['reservation_id'];
    const temp_html = `<div class="reservlist">
            <p class="desc"> 이름: ${name} / start: ${start} ~ end: ${end}</p>
            <button type="button" onclick=window.location.href='/reservation/id=:${id}'>수정하기</button>
            <button type="button" onclick=reservDelete(${id})>삭제하기</button>
          </div>`;
    reservationList.insertAdjacentHTML('beforeend', temp_html); 
    console.log(reservation);
  });
}

async function reservDelete(id){
  try {
    const res = await fetch(`/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({reservation_id: id}),
    });

    await res.json().then((result) => {
      const errorMessage = result.errorMessage;
      if (errorMessage) {
        alert(result.errorMessage);
      } else {
        alert(result.message);
        window.location.reload();
      }
    })
    if (res.ok) {
      window.location.href = '/reservation'; // 회원가입 완료시 로그인 페이지로 이동.
    }
  }
  catch (err) {
  console.error(err);
  alert('예약삭제에 실패했습니다. 다시 시도해주세요.');
}
}

// 페이지가 로드되면 모든 펫시터 목록을 가져와서 표시합니다.
getReservation();
