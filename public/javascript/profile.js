// DOMContentLoaded 이벤트 리스너를  등록하여 페이지 로드 후 초기화를 수행하는 함수를 호출
document.addEventListener('DOMContentLoaded', () => {
  // console.log('hi')

  //   페이지 로드 후 실행하고자 하는 함수를 호출
  userInfo();
});

// 유저 정보 조회 li태그
const user = document.getElementById('userInfo');
// 유저 예약내역 li 태그
const reservations = document.getElementById('userReserv');
// 유저 리뷰내역 li 태그
const review = document.getElementById('userReview');

const userInfo = async () => {
  // 페이지 로드 후 실행하고자 하는 초기화 작업을 수행
  // console.log('페이지가 열리자마자 실행되는 함수입니다.');
  const user_id = 6;
  const response = await fetch(`/profile/${user_id}`);
  const userInfoData = await response.json();
  const { userInfo, Reservations, Reviews } = userInfoData;

  // 유저 정보 화면에 보여주는 로직
  user.innerHTML = `<li> user_id : ${userInfo.user_id}<li>
                      <li>👫Nickname : ${userInfo.nickname}</li>
                      <li>💌Email : ${userInfo.email}</li>
                      `;
  //
  Reservations.forEach((res) => {
    reservations.innerHTML += `
                                <li> Petsitter_id : ${res.Petsitter_id}<li>        
                                <li> Start_date : ${res.start_date}</li>        
                                <li> End_date : ${res.end_date}</li> 
                                `;
  });

  Reviews.forEach((review) => {
    reviews.innerHTML += `
                            <li> Petsitter_id : ${review.Petsitter_id}<li>        
                            <li> content : ${review.content}</li>        
                            <li> rating : ${review.rating}</li>              
                            `;
  });
};

// 회원 탈퇴하기
const withDrawalBtn = document.getElementById('outBtn');

const withDrawalFunc = async () => {
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  try {
    // 해당 URI로 DELETE요청을 보냄.
    const user_id = 26;
    const res = await fetch(`/users/${user_id}`, {
      method: 'DELETE',
      // 바디에 있는 값을 JSON형태로 전송하겠다.
      body: JSON.stringify({ password, confirm }),
      // 전달해서 로직으로 수행하고,
    });
    // JSON 형태로 결과값을 받는다.
    await res.json().then((result) => {
      const errorMessage = result.errorMessage;
      if (errorMessage) {
        alert(result.errorMessage);
      } else {
        alert(result.message);
        window.location.href = '/';
      }
    });
  } catch (err) {
    console.log(err);
  }
};
withDrawalBtn.addEventListener('click', withDrawalFunc);
