// 회원가입
const signup = async (signupInfo) => {
  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupInfo),
    });

    const data = await res.json();
    alert(data.msg);

    if (res.ok) {
      // 로그인 페이지로 이동
      window.location.href = '/login';
    }
  } catch (err) {
    console.error(err);
  }
};
