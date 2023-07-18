async function getPetsitters() {
    try {
        const response = await fetch('/petsitters');
        const petsitters = await response.json();
        displayPetsitters(petsitters);
    } catch (error) {
        console.error(error);
    }
}

async function searchPetsitters() {
    const categoryInput = document.getElementById('category').value;
    const keywordInput = document.getElementById('keyword').value;
    if (!keywordInput) return;

    try {
        const response = await fetch(`/petsitters/search?category=${categoryInput}&keyword=${keywordInput}`);
        const petsitters = await response.json();
        displayPetsitters(petsitters);
    } catch (error) {
        console.error(error);
    }
}

function displayPetsitters(petsitters) {
    const petsitterListDiv = document.getElementById('petsitterList');
    petsitterListDiv.innerHTML = '';

    if (petsitters.length === 0) {
        petsitterListDiv.innerHTML = '<p>No petsitters found.</p>';
        return;
    }

    const ul = document.createElement('ul');
    petsitters.forEach(petsitter => {
        const li = document.createElement('li');
        li.textContent = `${petsitter.name} - Carrer: ${petsitter.carrer}`;
        ul.appendChild(li);
    });
    petsitterListDiv.appendChild(ul);
}

document.getElementById('searchBtn').addEventListener('click', searchPetsitters);

// 페이지가 로드되면 모든 펫시터 목록을 가져와서 표시합니다.
getPetsitters();