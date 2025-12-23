/* --- GLOBAL STATE & UNLOCK SYSTEM --- */
let candies = parseInt(localStorage.getItem('candies')) || 0;
let gamesCompleted = JSON.parse(localStorage.getItem('gamesCompleted')) || { ws: false, wordle: false, diff: false };
let wsSolutions = []; // Для хранения координат слов

document.addEventListener('DOMContentLoaded', () => {
    updateCandyDisplay();
    checkUnlock();
});

/* --- NAVIGATION SYSTEM --- */
function openGame(gameName) {
    document.getElementById('games-menu').classList.remove('active');
    document.getElementById('games-play-area').classList.add('active');
    
    document.querySelectorAll('.game-view').forEach(el => el.classList.remove('active'));
    document.getElementById(`game-${gameName}`).classList.add('active');

    if (gameName === 'wordsearch') initWordSearch();
    if (gameName === 'wordle') initWordle();
    if (gameName === 'diffs') initDiffGame();
}

function backToMenu() {
    document.getElementById('games-play-area').classList.remove('active');
    document.getElementById('games-menu').classList.add('active');
}

/* --- CANDY LOGIC --- */
function updateCandyDisplay() {
    document.getElementById('candy-count').innerText = candies;
    const needed = 3 - candies;
    const neededEl = document.getElementById('candies-needed');
    if(neededEl) neededEl.innerText = needed > 0 ? needed : 0;
}

function addCandy(gameId) {
    if (!gamesCompleted[gameId]) {
        candies++;
        gamesCompleted[gameId] = true;
        localStorage.setItem('candies', candies);
        localStorage.setItem('gamesCompleted', JSON.stringify(gamesCompleted));
        updateCandyDisplay();
        checkUnlock();
        alert("🎉 Ты получила конфетку!");
    }
}

function checkUnlock() {
    const greeting = document.getElementById('greeting');
    if (candies >= 3) {
        greeting.classList.add('unlocked');
    } else {
        greeting.classList.remove('unlocked');
    }
}

function resetProgress() {
    if(confirm('Сбросить все конфеты и прогресс игр?')) {
        localStorage.clear();
        location.reload();
    }
}

/* --- GAME 1: WORD SEARCH --- */
const wsWords = ['2026', 'ОГНЕННАЯ', 'ЛОШАДЬ'];
const wsGridSize = 10;
let wsGridArr = [];
let wsHints = 2;
let isSelecting = false;
let startCell = null;
let selectedCells = [];

function initWordSearch() {
    const gridEl = document.getElementById('ws-grid');
    gridEl.innerHTML = '';
    wsGridArr = Array(wsGridSize).fill(null).map(() => Array(wsGridSize).fill(''));
    wsSolutions = []; // Сброс решений

    // 1. Place words
    wsWords.forEach(word => placeWordInGrid(word));
    
    // 2. Fill random
    const chars = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ";
    for(let y=0; y<wsGridSize; y++) {
        for(let x=0; x<wsGridSize; x++) {
            if(!wsGridArr[y][x]) wsGridArr[y][x] = chars[Math.floor(Math.random() * chars.length)];
            
            const cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.innerText = wsGridArr[y][x];
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            cell.addEventListener('mousedown', handleStart);
            cell.addEventListener('mouseenter', handleMove);
            cell.addEventListener('mouseup', handleEnd);
            cell.addEventListener('touchstart', handleStart, {passive: false});
            cell.addEventListener('touchmove', handleTouchMove, {passive: false});
            cell.addEventListener('touchend', handleEnd);

            gridEl.appendChild(cell);
        }
    }
    document.addEventListener('mouseup', () => { if(isSelecting) handleEnd(); });
}

function placeWordInGrid(word) {
    let placed = false;
    let attempts = 0;
    while(!placed && attempts < 100) {
        const dir = Math.random() > 0.5 ? 'h' : 'v';
        const startX = Math.floor(Math.random() * (wsGridSize - (dir === 'h' ? word.length : 0)));
        const startY = Math.floor(Math.random() * (wsGridSize - (dir === 'v' ? word.length : 0)));
        let fits = true;
        
        for(let i=0; i<word.length; i++) {
            const char = wsGridArr[dir==='v'?startY+i:startY][dir==='h'?startX+i:startX];
            if(char && char !== word[i]) fits = false;
        }
        
        if(fits) {
            let coords = [];
            for(let i=0; i<word.length; i++) {
                let y = dir==='v'?startY+i:startY;
                let x = dir==='h'?startX+i:startX;
                wsGridArr[y][x] = word[i];
                coords.push({x, y});
            }
            wsSolutions.push({word: word, coords: coords, found: false});
            placed = true;
        }
        attempts++;
    }
}

function handleStart(e) {
    if(gamesCompleted.ws) return;
    if(e.type === 'touchstart') e.preventDefault();
    isSelecting = true;
    startCell = e.target.closest('.ws-cell');
    highlightRange(startCell, startCell);
}

function handleMove(e) {
    if(!isSelecting || !startCell) return;
    const currentCell = e.target.closest('.ws-cell');
    if(currentCell) highlightRange(startCell, currentCell);
}

function handleTouchMove(e) {
    if(!isSelecting || !startCell) return;
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if(target && target.classList.contains('ws-cell')) {
        highlightRange(startCell, target);
    }
}

function handleEnd() {
    if(!isSelecting) return;
    isSelecting = false;
    checkSelectedWord();
    document.querySelectorAll('.ws-cell.selecting').forEach(c => c.classList.remove('selecting'));
    startCell = null;
    selectedCells = [];
}

function highlightRange(start, end) {
    document.querySelectorAll('.ws-cell.selecting').forEach(c => c.classList.remove('selecting'));
    selectedCells = [];

    const x1 = parseInt(start.dataset.x);
    const y1 = parseInt(start.dataset.y);
    const x2 = parseInt(end.dataset.x);
    const y2 = parseInt(end.dataset.y);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    if (steps === 0) {
        start.classList.add('selecting');
        selectedCells.push(start);
        return;
    }

    const xInc = dx / steps;
    const yInc = dy / steps;

    if (Math.abs(xInc) !== 1 && xInc !== 0) return;
    if (Math.abs(yInc) !== 1 && yInc !== 0) return;

    for (let i = 0; i <= steps; i++) {
        const x = x1 + (xInc * i);
        const y = y1 + (yInc * i);
        const cell = document.querySelector(`.ws-cell[data-x="${x}"][data-y="${y}"]`);
        if(cell) {
            cell.classList.add('selecting');
            selectedCells.push(cell);
        }
    }
}

function checkSelectedWord() {
    const word = selectedCells.map(c => c.innerText).join('');
    const reversed = word.split('').reverse().join('');
    
    // Проверка, является ли слово искомым
    const foundObj = wsSolutions.find(s => (s.word === word || s.word === reversed) && !s.found);

    if (foundObj) {
        foundObj.found = true;
        selectedCells.forEach(c => c.classList.add('found'));
        checkAllWordsFound();
    }
}

function checkAllWordsFound() {
    if(wsSolutions.every(s => s.found) && !gamesCompleted.ws) {
        addCandy('ws');
    }
}

/* --- GAME 2: WORDLE --- */
const wordleWords = ["БОКАЛ", "МОРОЗ", "САЛАТ", "САНТА", "САЛЮТ", "ОЛЕНИ", "КАМИН", "СВЕЧА", "САНКИ", "СОСНА"];
let currentWord = "";
let currentRow = 0;
let currentTile = 0;
const rows = 6;

function initWordle() {
    const board = document.getElementById('wordle-board');
    board.innerHTML = '';
    currentWord = wordleWords[Math.floor(Math.random() * wordleWords.length)];
    currentRow = 0; 
    currentTile = 0;
    
    for(let i=0; i<rows*5; i++) {
        let tile = document.createElement('div');
        tile.id = `w-${Math.floor(i/5)}-${i%5}`;
        tile.classList.add('w-cell');
        board.appendChild(tile);
    }
    createKeyboard();
}

function createKeyboard() {
    const kb = document.getElementById('wordle-keyboard');
    kb.innerHTML = '';
    const alphabet = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
    
    alphabet.forEach(key => {
        let btn = document.createElement('button');
        btn.innerText = key;
        btn.classList.add('key-btn');
        btn.onclick = () => handleKey(key);
        kb.appendChild(btn);
    });

    let delBtn = document.createElement('button');
    delBtn.innerText = "⌫";
    delBtn.classList.add('key-btn', 'wide');
    delBtn.onclick = () => handleKey("BACKSPACE");
    kb.appendChild(delBtn);

    let enterBtn = document.createElement('button');
    enterBtn.innerText = "ENTER";
    enterBtn.classList.add('key-btn', 'wide');
    enterBtn.onclick = () => handleKey("ENTER");
    kb.appendChild(enterBtn);
}

function handleKey(key) {
    if(gamesCompleted.wordle) return;
    
    if(key === "BACKSPACE") {
        if(currentTile > 0) {
            currentTile--;
            let tile = document.getElementById(`w-${currentRow}-${currentTile}`);
            tile.innerText = "";
            tile.style.borderColor = "rgba(255,255,255,0.3)";
        }
        return;
    }
    
    if(key === "ENTER") {
        if(currentTile === 5) checkWordle();
        return;
    }
    
    if(currentTile < 5 && currentRow < 6) {
        let tile = document.getElementById(`w-${currentRow}-${currentTile}`);
        tile.innerText = key;
        tile.style.borderColor = "#fff";
        currentTile++;
    }
}

function checkWordle() {
    let guess = "";
    for(let i=0; i<5; i++) {
        guess += document.getElementById(`w-${currentRow}-${i}`).innerText;
    }
    
    let correct = 0;
    for(let i=0; i<5; i++) {
        let tile = document.getElementById(`w-${currentRow}-${i}`);
        let letter = guess[i];
        
        if (letter === currentWord[i]) {
            tile.classList.add('w-green');
            correct++;
        } else if (currentWord.includes(letter)) {
            tile.classList.add('w-yellow');
        } else {
            tile.classList.add('w-grey');
        }
    }
    
    if(correct === 5) {
        addCandy('wordle');
    } else {
        currentRow++;
        currentTile = 0;
        if(currentRow >= 6) alert(`Игра окончена! Слово было: ${currentWord}`);
    }
}

/* --- GAME 3: DIFFS (CUSTOM COORDS) --- */
let diffFound = 0;
let diffHints = 2;

const diffLocations = [
    { top: 10, left: 86 }, 
    { top: 57, left: 72 },
    { top: 72, left: 68, width: 60, height: 80 }, 
    { top: 18, left: 72 },
    { top: 21, left: 52 }
];

function initDiffGame() {
    const overlay = document.getElementById('diff-overlay');
    overlay.innerHTML = '';
    diffFound = 0;
    document.getElementById('diff-found').innerText = '0';
    
    // Очистка состояния найденных
    diffLocations.forEach(d => delete d.isFound);
    
    diffLocations.forEach((loc, index) => {
        let zone = document.createElement('div');
        zone.classList.add('diff-zone');
        zone.id = `diff-zone-${index}`;
        
        zone.style.top = loc.top + '%';
        zone.style.left = loc.left + '%';
        let w = loc.width ? loc.width + 'px' : '40px';
        let h = loc.height ? loc.height + 'px' : '40px';
        zone.style.width = w;
        zone.style.height = h;
        
        zone.onclick = (e) => {
            if(loc.isFound) return;
            loc.isFound = true;
            
            // Удаляем подсказку если она была здесь
            let existingHint = document.getElementById(`hint-${index}`);
            if(existingHint) existingHint.remove();

            let marker = document.createElement('div');
            marker.className = 'diff-marker';
            marker.style.top = loc.top + '%';
            marker.style.left = loc.left + '%';
            overlay.appendChild(marker);
            
            diffFound++;
            document.getElementById('diff-found').innerText = diffFound;
            if(diffFound === 5) addCandy('diff');
        };
        overlay.appendChild(zone);
    });
}

/* --- HINT SYSTEM REWORKED --- */
function useHint(game) {
    if(game === 'ws') {
        if (wsHints > 0) {
            // Найти ненайденное слово
            const notFound = wsSolutions.find(s => !s.found);
            if(notFound) {
                wsHints--;
                document.getElementById('ws-hints').innerText = wsHints;
                
                // Подсветить ячейки
                notFound.coords.forEach(c => {
                    const cell = document.querySelector(`.ws-cell[data-x="${c.x}"][data-y="${c.y}"]`);
                    if(cell) {
                        cell.classList.add('hint-highlight');
                        setTimeout(() => cell.classList.remove('hint-highlight'), 2000);
                    }
                });
            } else {
                alert("Все слова найдены!");
            }
        } else {
            alert("Подсказки закончились!");
        }
    }

// ... внутри функции useHint(game) ...

    if(game === 'diff') {
        if (diffHints > 0) {
            // Найти ненайденное отличие
            const notFoundIdx = diffLocations.findIndex(l => !l.isFound);
            
            if(notFoundIdx !== -1) {
                diffHints--;
                document.getElementById('diff-hints').innerText = diffHints;
                
                const loc = diffLocations[notFoundIdx];
                const overlay = document.getElementById('diff-overlay');
                
                // Создаем визуальный круг подсказки
                let hintEl = document.createElement('div');
                hintEl.id = `hint-${notFoundIdx}`;
                hintEl.classList.add('hint-active');
                
                // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
                // Используем ЧИСТЫЕ координаты. Центрирование теперь делает CSS (transform).
                hintEl.style.top = loc.top + '%'; 
                hintEl.style.left = loc.left + '%';
                
                // Размеры подсказки чуть больше стандартного маркера
                hintEl.style.width = (loc.width || 60) + 'px';
                hintEl.style.height = (loc.height || 60) + 'px';
                
                overlay.appendChild(hintEl);
                
                // Убираем подсказку через 3 секунды
                setTimeout(() => {
                    if(hintEl && hintEl.parentNode) hintEl.remove();
                }, 3000);
                
            } else {
                alert("Все отличия найдены!");
            }
        } else {
            alert("Подсказки закончились!");
        }
    }
}