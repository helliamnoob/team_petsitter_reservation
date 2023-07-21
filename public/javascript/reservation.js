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

  // 검색 결과를 리스트 형태로 표시하기 위해 ul 요소를 생성합니다.
  const ul = document.createElement('ul');
  // 각 펫시터 정보를 리스트 아이템으로 생성하여 ul 요소에 추가합니다.
  reservation.map((reservation) => {
    const name = reservation['name'];
    const career = reservation['career'];
    const id = reservation['petsitter_id'];
    const temp_html = `<div class="pslist">
            <p class="desc"> 이름: ${name} / career: ${career}</p><button type="button" onclick=window.location.href='/petsitters/id=:${id}'>예약하기</button>
          </div>`;
    petsitterListDiv.insertAdjacentHTML('beforeend', temp_html);
  });
  // 생성한 ul 요소를 화면에 표시하기 위해 petsitterListDiv에 추가합니다.
  reservationList.appendChild(ul);
}

// 페이지가 로드되면 모든 펫시터 목록을 가져와서 표시합니다.
getReservation();
