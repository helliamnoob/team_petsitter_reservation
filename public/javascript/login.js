const loginForm = document.querySelector('.login-form');

// 이벤트 리스너를 통해 폼 제출 이벤트가 발생할 경우
loginForm.addEventListener('submit', async (e) => {
  // 페이지 리로드 방지
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const login = { email, password };

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login),
    });

    await res.json().then((result) => {
      const errorMessage = result.errorMessage;
      if (errorMessage) {
        alert(result.errorMessage);
      } else {
        alert(result.message);
      }
    });

    if (res.ok) {
      window.location.href = '/'; // 로그인 되면 메인 페이지로 이동.
    }
  } catch (err) {
    console.error(err);
    alert('로그인에 실패했습니다. 다시 시도해주세요.');
  }
});

// 회원가입 버튼 클릭 시 회원가입 페이지로 이동
document.getElementById('signupBtn').addEventListener('click', signup);

function signup() {
  window.location.href = '/signup';
}
