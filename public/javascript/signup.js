const signupForm = document.querySelector('.signup-form');

// 이벤트 리스너를 통해 폼 제출 이벤트가 발생할 경우
signupForm.addEventListener('submit', async (e) => {
  // 페이지 리로드 방지
  e.preventDefault();

  const email = document.getElementById('email').value;
  const nickname = document.getElementById('nickname').value;
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  const signupInfo = { email, nickname, password, confirm };

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupInfo),
    });

    await res.json().then((result) => {
      const errorMessage = result.errorMessage;
      if (errorMessage) {
        alert(result.errorMessage);
      } else {
        alert(result.message);
        window.location.reload();
      }
    });

    if (res.ok) {
      window.location.href = '/login'; // 회원가입 완료시 로그인 페이지로 이동.
    }
  } catch (err) {
    console.error(err);
    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
});

// 취소 버튼 클릭 시 메인 페이지로 이동.
document.getElementById('cancel').addEventListener('click', cancel);

function cancel() {
  window.location.href = '/';
}

// 로그인하러가기 버튼 클릭 시 로그인 페이지로 이동
function login(url) {
  window.location.href = url;
}
