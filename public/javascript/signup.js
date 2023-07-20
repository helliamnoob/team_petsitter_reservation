const signupForm = document.querySelector('.signup-form');

// 이벤트 리스너를 통해 폼 제출 이벤트가 발생할 경우
signupForm.addEventListener('submit', async (e) => {
  // 페이지 리로드 방지
  e.preventDefault();

  //   const formData = new FormData(this);
  //   const email = formData.get('email');
  //   const nickname = formData.get('nickname');
  //   const password = formData.get('password');
  //   const confirm = formData.get('confirm');

  const emailInput = document.getElementById('email');
  const nicknameInput = document.getElementById('nickname');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm');

  const email = emailInput.value;
  const nickname = nicknameInput.value;
  const password = passwordInput.value;
  const confirm = confirmInput.value;

  //   const email = 'test1@gmail.com';
  //   const nickname = 'papa';
  //   const password = 'qwer1234';
  //   const confirm = 'qwer1234';

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
