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
} else if (post === false) {
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
          window.location.href = '/reservation'
        });
      },
    });
    calendar.render();
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  // 기존의 캘린더 렌더링 관련 코드는 여기에 그대로 복사합니다.

  // 리뷰 작성 폼의 이벤트 핸들러
  const submitReviewBtn = document.getElementById('submitReviewBtn');
  submitReviewBtn.addEventListener('click', async function () {
    const reviewContent = document.getElementById('reviewContent').value;
    const reviewRating = parseInt(document.getElementById('reviewRating').value);

    // 필요한 유효성 검사를 수행합니다. (리뷰 내용과 평점이 모두 입력되었는지 확인)

    const response = await fetch(`/petsitters/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: reviewContent, rating: reviewRating }),
    });

    const result = await response.json();
    const errorMessage = result.errorMessage;
    if (errorMessage) {
      alert(errorMessage);
    } else {
      alert(result.message);
      // 리뷰를 작성한 후, 페이지를 새로고침하여 리뷰 목록을 업데이트합니다.
      window.location.reload();
    }
  });

  // 리뷰 조회, 수정, 삭제 기능 관련 이벤트 핸들러
  async function fetchReviews() {
    const response = await fetch(`/petsitters/${id}/reviews`);
    const data = await response.json();
    return data.reviews;
  }

  async function displayReviews() {
    const reviews = await fetchReviews();
    const reviewsList = document.getElementById('reviews');
    reviewsList.innerHTML = '';

    reviews.forEach((review) => {
      const reviewItem = document.createElement('li');
      reviewItem.innerHTML = `
        <p>${review.content}</p>
        <p>평점: ${review.rating}</p>
        <button class="editReviewBtn" data-review-id="${review.id}">수정</button>
        <button class="deleteReviewBtn" data-review-id="${review.id}">삭제</button>
      `;

      // 리뷰 수정 버튼 클릭 이벤트 핸들러
      const editReviewBtn = reviewItem.querySelector('.editReviewBtn');
      editReviewBtn.addEventListener('click', async function () {
        // 수정할 리뷰 정보를 가져옵니다.
        // 리뷰 수정을 위한 폼을 생성하고, 필요한 데이터를 기본값으로 채워 넣습니다.
        // 사용자가 수정을 완료하면 PUT 요청을 보내서 리뷰를 수정합니다.
      });

      // 리뷰 삭제 버튼 클릭 이벤트 핸들러
      const deleteReviewBtn = reviewItem.querySelector('.deleteReviewBtn');
      deleteReviewBtn.addEventListener('click', async function () {
        const reviewId = this.dataset.reviewId;
        console.log(reviewId)
        const confirmDelete = confirm('리뷰를 삭제하시겠습니까?');
        if (confirmDelete) {
          const response = await fetch(`/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const result = await response.json();
          const errorMessage = result.errorMessage;
          if (errorMessage) {
            alert(errorMessage);
          } else {
            alert(result.message);
            // 리뷰를 삭제한 후, 페이지를 새로고침하여 리뷰 목록을 업데이트합니다.
            window.location.reload();
          }
        }
      });

      reviewsList.appendChild(reviewItem);
    });
  }

  // 페이지 로드 시 리뷰 목록을 표시합니다.
  displayReviews();
}); 