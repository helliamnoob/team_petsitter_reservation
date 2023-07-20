// petsitters를 가져와서 화면에 표시하는 함수
async function getPetsitters() {
    try {
        // '/petsitters' 경로로 GET 요청을 보냅니다.
        const response = await fetch('/petsitters');
        // 서버로부터 받은 JSON 데이터를 파싱하여 JavaScript 객체로 변환합니다.
        const petsitters = await response.json();
        // petsitters 목록을 표시하는 함수를 호출합니다.
        displayPetsitters(petsitters);
    } catch (error) {
        // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
        console.error(error);
    }
}

// 검색어를 이용해 petsitters를 검색하는 함수
async function searchPetsitters() {
    // 검색 카테고리와 검색어 입력값을 가져옵니다.
    const categoryInput = document.getElementById('category').value;
    const keywordInput = document.getElementById('keyword').value;
    // 검색어가 비어있으면 함수를 종료하고 검색을 수행하지 않습니다.
    if (!keywordInput) return;

    try {
        // 검색어를 서버에 전달하고 검색 결과를 받아옵니다.
        const response = await fetch(`/petsitters/search?category=${categoryInput}&keyword=${keywordInput}`);
        // 서버로부터 받은 JSON 데이터를 파싱하여 JavaScript 객체로 변환합니다.
        const petsitters = await response.json();
        // 검색 결과를 표시하는 함수를 호출합니다.
        displayPetsitters(petsitters);
    } catch (error) {
        // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
        console.error(error);
    }
}

// petsitters 목록을 화면에 표시하는 함수
function displayPetsitters(petsitters) {
    // petsitterList라는 ID를 가진 HTML 요소를 선택합니다.
    const petsitterListDiv = document.getElementById('petsitterList');
    // 이전에 표시된 내용을 초기화합니다.
    petsitterListDiv.innerHTML = '';

    if (petsitters.length === 0) {
        // 검색 결과가 없을 경우 "No petsitters found." 메시지를 표시합니다.
        petsitterListDiv.innerHTML = '<p>No petsitters found.</p>';
        return;
    }

    // 검색 결과를 리스트 형태로 표시하기 위해 ul 요소를 생성합니다.
    const ul = document.createElement('ul');
    // 각 펫시터 정보를 리스트 아이템으로 생성하여 ul 요소에 추가합니다.
    petsitters.forEach(petsitter => {
        const li = document.createElement('li');
        // 각 펫시터의 이름과 경력 정보를 리스트 아이템에 텍스트로 추가합니다.
        li.textContent = `${petsitter.name} - Career: ${petsitter.career}`;
        ul.appendChild(li);
    });
    // 생성한 ul 요소를 화면에 표시하기 위해 petsitterListDiv에 추가합니다.
    petsitterListDiv.appendChild(ul);
}

// 검색 버튼을 클릭하면 검색어로 petsitters를 검색하는 함수를 실행합니다.
document.getElementById('searchBtn').addEventListener('click', searchPetsitters);

// 로그인 버튼을 클릭하면 로그인 페이지로 이동하는 함수
function redirectToLoginPage() {
    // 로그인 페이지로 이동합니다.
    window.location.href = '/html/login.html';
}

// 로그인 버튼에 클릭 이벤트 리스너를 추가합니다.
document.getElementById('loginBtn').addEventListener('click', redirectToLoginPage);

// 페이지가 로드되면 모든 펫시터 목록을 가져와서 표시합니다.
getPetsitters();
