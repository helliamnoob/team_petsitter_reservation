// petsitters를 가져와서 화면에 표시하는 함수
async function getPetsitters() {
    try {
        // '/petsitters' 경로로 GET 요청을 보냅니다.
        const response = await fetch('/petsitters');
        // 서버로부터 받은 JSON 데이터를 파싱합니다.
        const petsitters = await response.json();
        // petsitters 목록을 표시하는 함수를 호출합니다.
        displayPetsitters(petsitters);
    } catch (error) {
        console.error(error);
    }
}

// 검색어를 이용해 petsitters를 검색하는 함수
async function searchPetsitters() {
    // 검색 카테고리와 검색어 입력값을 가져옵니다.
    const categoryInput = document.getElementById('category').value;
    const keywordInput = document.getElementById('keyword').value;
    // 검색어가 비어있으면 함수를 종료합니다.
    if (!keywordInput) return;

    try {
        // 검색어를 서버에 전달하고 검색 결과를 받아옵니다.
        const response = await fetch(`/petsitters/search?category=${categoryInput}&keyword=${keywordInput}`);
        const petsitters = await response.json();
        // 검색 결과를 표시하는 함수를 호출합니다.
        displayPetsitters(petsitters);
    } catch (error) {
        console.error(error);
    }
}

// petsitters 목록을 화면에 표시하는 함수
function displayPetsitters(petsitters) {
    const petsitterListDiv = document.getElementById('petsitterList');
    petsitterListDiv.innerHTML = '';

    if (petsitters.length === 0) {
        // 검색 결과가 없을 경우 "No petsitters found." 메시지를 표시합니다.
        petsitterListDiv.innerHTML = '<p>No petsitters found.</p>';
        return;
    }

    // 검색 결과를 리스트 형태로 표시합니다.
    const ul = document.createElement('ul');
    petsitters.forEach(petsitter => {
        const li = document.createElement('li');
        // 각 펫시터의 이름과 경력 정보를 리스트 아이템으로 생성합니다.
        li.textContent = `${petsitter.name} - Carrer: ${petsitter.carrer}`;
        ul.appendChild(li);
    });
    petsitterListDiv.appendChild(ul);
}

// 검색 버튼을 클릭하면 검색어로 petsitters를 검색하는 함수를 실행합니다.
document.getElementById('searchBtn').addEventListener('click', searchPetsitters);

getPetsitters();