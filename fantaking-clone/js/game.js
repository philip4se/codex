// Main Game Logic

// Initialize game state
let gameState;

// Initialize game
function initGame() {
    gameState = new GameState();

    // Try to load saved game
    const loaded = gameState.load();
    if (loaded) {
        console.log('Game loaded from save');
    } else {
        console.log('New game started');
    }

    // Initial UI update
    updateUI();
    updateHomeStats();
    renderPlayerInventory();
    renderFormation();
}

// Update UI elements
function updateUI() {
    document.getElementById('gold').textContent = gameState.gold.toLocaleString();
    document.getElementById('diamond').textContent = gameState.diamond.toLocaleString();
}

// Update home page stats
function updateHomeStats() {
    document.getElementById('team-power').textContent = gameState.getTeamPower();
    document.getElementById('player-count').textContent = gameState.players.length;
    document.getElementById('league-rank').textContent = calculateLeagueRank();
    document.getElementById('win-rate').textContent = gameState.getWinRate() + '%';
}

function calculateLeagueRank() {
    const points = gameState.leaguePoints;
    if (points === 0) return '-';
    // Simple ranking system
    const rank = Math.max(1, 100 - Math.floor(points / 10));
    return rank;
}

// Navigation
function navigateTo(page) {
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === page) {
            btn.classList.add('active');
        }
    });

    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page + '-page').classList.add('active');

    // Update content for specific pages
    if (page === 'squad') {
        renderFormation();
        renderPlayerInventory();
    } else if (page === 'upgrade') {
        renderUpgradePlayerList();
    } else if (page === 'league') {
        renderLeaguePage();
    } else if (page === 'home') {
        updateHomeStats();
    }
}

// Render player inventory
function renderPlayerInventory() {
    const container = document.getElementById('player-inventory');
    container.innerHTML = '';

    // Sort players by overall rating
    const sortedPlayers = [...gameState.players].sort((a, b) => b.overall - a.overall);

    sortedPlayers.forEach(player => {
        const card = createPlayerCard(player);
        card.onclick = () => selectPlayerForSquad(player.id);
        container.appendChild(card);
    });

    if (gameState.players.length === 0) {
        container.innerHTML = '<p class="placeholder">보유한 선수가 없습니다. 카드를 뽑아보세요!</p>';
    }
}

// Create player card element
function createPlayerCard(player, compact = false) {
    const card = document.createElement('div');
    card.className = `player-card rarity-${player.rarity}`;
    card.dataset.playerId = player.id;

    const rarityInfo = rarities[player.rarity];

    if (compact) {
        card.innerHTML = `
            <div class="player-overall">${player.overall}</div>
            <div class="card-header">
                <span class="player-name">${player.name}</span>
            </div>
            <div class="player-position">${player.position}</div>
            <div class="player-rarity">${rarityInfo.stars}</div>
        `;
    } else {
        const stats = player.stats;
        const statKeys = player.position === 'GK'
            ? ['diving', 'handling', 'reflexes', 'physical']
            : ['pace', 'shooting', 'passing', 'dribbling', 'defense', 'physical'];

        const statsHTML = statKeys
            .filter(key => stats[key] !== undefined)
            .map(key => {
                const label = key.charAt(0).toUpperCase() + key.slice(1, 3);
                return `<div class="stat-item">${label}: ${stats[key]}</div>`;
            })
            .join('');

        card.innerHTML = `
            <div class="player-overall">${player.overall}</div>
            <div class="card-header">
                <div>
                    <div class="player-name">${player.name}</div>
                    <div class="player-rarity">${rarityInfo.stars} ${rarityInfo.name}</div>
                </div>
            </div>
            <div class="player-position">${player.position}</div>
            <div class="player-stats">
                ${statsHTML}
            </div>
            <div style="text-align: center; margin-top: 10px; font-size: 12px;">
                Lv. ${player.level}
            </div>
        `;
    }

    return card;
}

// Formation management
function renderFormation() {
    const field = document.getElementById('football-field');
    field.innerHTML = '';

    const currentFormation = formations[gameState.formation];

    currentFormation.forEach((posData, index) => {
        const slot = document.createElement('div');
        slot.className = 'position-slot';
        slot.style.left = posData.x + '%';
        slot.style.top = posData.y + '%';
        slot.style.transform = 'translate(-50%, -50%)';
        slot.dataset.index = index;
        slot.dataset.position = posData.pos;

        const player = gameState.getSquadPlayer(index);

        if (player) {
            const miniCard = createPlayerCard(player, true);
            miniCard.onclick = () => removeFromSquad(index);
            slot.appendChild(miniCard);
        } else {
            slot.innerHTML = `<div class="pos-label">${posData.pos}</div>`;
            slot.onclick = () => openSquadSelection(index);
        }

        field.appendChild(slot);
    });

    // Update formation selector
    document.getElementById('formation-select').value = gameState.formation;
}

document.getElementById('formation-select')?.addEventListener('change', (e) => {
    gameState.formation = e.target.value;
    renderFormation();
    gameState.save();
});

let selectedSquadSlot = null;

function openSquadSelection(index) {
    selectedSquadSlot = index;
    const posData = formations[gameState.formation][index];
    const requiredPos = posData.pos;

    // Highlight compatible players
    document.querySelectorAll('#player-inventory .player-card').forEach(card => {
        const playerId = parseInt(card.dataset.playerId);
        const player = gameState.getPlayer(playerId);

        if (player && isPositionCompatible(player.position, requiredPos)) {
            card.style.border = '3px solid #4CAF50';
        } else {
            card.style.opacity = '0.5';
        }
    });

    alert(`${requiredPos} 포지션에 배치할 선수를 선택하세요`);
}

function isPositionCompatible(playerPos, slotPos) {
    if (playerPos === slotPos) return true;

    // Position compatibility rules
    const compatibility = {
        'CB': ['CB'],
        'LB': ['LB', 'LM'],
        'RB': ['RB', 'RM'],
        'CDM': ['CDM', 'CM'],
        'CM': ['CM', 'CDM', 'CAM'],
        'CAM': ['CAM', 'CM', 'CF'],
        'LM': ['LM', 'LB', 'LW'],
        'RM': ['RM', 'RB', 'RW'],
        'LW': ['LW', 'LM', 'ST'],
        'RW': ['RW', 'RM', 'ST'],
        'ST': ['ST', 'CF'],
        'CF': ['CF', 'ST', 'CAM'],
        'GK': ['GK']
    };

    return compatibility[slotPos]?.includes(playerPos) || false;
}

function selectPlayerForSquad(playerId) {
    if (selectedSquadSlot === null) return;

    const player = gameState.getPlayer(playerId);
    const posData = formations[gameState.formation][selectedSquadSlot];

    if (!isPositionCompatible(player.position, posData.pos)) {
        alert(`이 선수는 ${posData.pos} 포지션에 배치할 수 없습니다.`);
        return;
    }

    // Check if player is already in squad
    const existingIndex = gameState.squad.indexOf(playerId);
    if (existingIndex !== -1) {
        gameState.squad[existingIndex] = null;
    }

    gameState.setSquadPlayer(selectedSquadSlot, playerId);
    selectedSquadSlot = null;

    // Reset highlights
    document.querySelectorAll('#player-inventory .player-card').forEach(card => {
        card.style.border = '';
        card.style.opacity = '';
    });

    renderFormation();
    updateHomeStats();
    gameState.save();
}

function removeFromSquad(index) {
    if (confirm('이 선수를 스쿼드에서 제외하시겠습니까?')) {
        gameState.setSquadPlayer(index, null);
        renderFormation();
        updateHomeStats();
        gameState.save();
    }
}

// Gacha system
function drawCard(type, count) {
    const result = GachaSystem.draw(gameState, type, count);

    if (!result.success) {
        alert(result.message);
        return;
    }

    // Display results
    const resultContainer = document.getElementById('gacha-result');
    resultContainer.innerHTML = '<h3>뽑기 결과</h3><div class="result-cards"></div>';

    const cardsContainer = resultContainer.querySelector('.result-cards');
    result.players.forEach(player => {
        const card = createPlayerCard(player);
        cardsContainer.appendChild(card);
    });

    updateUI();
    renderPlayerInventory();
}

// Upgrade system
function renderUpgradePlayerList() {
    const container = document.getElementById('upgrade-player-list');
    container.innerHTML = '';

    const sortedPlayers = [...gameState.players].sort((a, b) => b.overall - a.overall);

    sortedPlayers.forEach(player => {
        const card = createPlayerCard(player);
        card.onclick = () => showUpgradePanel(player.id);
        container.appendChild(card);
    });
}

function showUpgradePanel(playerId) {
    const player = gameState.getPlayer(playerId);
    const panel = document.getElementById('upgrade-panel');

    const cost = player.getUpgradeCost();

    panel.innerHTML = `
        <div class="upgrade-details">
            <h3>선수 강화</h3>
            ${createPlayerCard(player).outerHTML}
            <div class="current-level">
                레벨: ${player.level} → ${player.level + 1}
            </div>
            <div class="upgrade-cost">
                <h4>강화 비용</h4>
                <p>💰 ${cost.toLocaleString()} 골드</p>
            </div>
            <button class="upgrade-btn" onclick="upgradePlayer(${playerId})" ${gameState.gold < cost ? 'disabled' : ''}>
                강화하기
            </button>
        </div>
    `;
}

function upgradePlayer(playerId) {
    const player = gameState.getPlayer(playerId);
    const cost = player.getUpgradeCost();

    if (!gameState.spendGold(cost)) {
        alert('골드가 부족합니다!');
        return;
    }

    player.upgrade();
    gameState.save();

    alert(`${player.name}이(가) 레벨 ${player.level}(으)로 강화되었습니다!`);

    updateUI();
    showUpgradePanel(playerId);
    renderFormation();
    updateHomeStats();
}

// League system
function renderLeaguePage() {
    document.getElementById('current-rank').textContent = calculateLeagueRank();
    document.getElementById('league-points').textContent = gameState.leaguePoints;

    renderOpponents();
    renderMatchHistory();
}

function renderOpponents() {
    const container = document.getElementById('opponent-list');
    container.innerHTML = '';

    const playerPower = gameState.getTeamPower();

    // Generate 5 opponents
    for (let i = 0; i < 5; i++) {
        const opponent = generateOpponent(playerPower);
        const card = document.createElement('div');
        card.className = 'opponent-card';

        card.innerHTML = `
            <div class="opponent-info">
                <h4>${opponent.name}</h4>
                <p>팀 파워: ${opponent.power}</p>
            </div>
            <button class="challenge-btn" onclick='startMatch(${JSON.stringify(opponent)})'>
                도전하기
            </button>
        `;

        container.appendChild(card);
    }
}

function generateOpponent(playerPower) {
    const variation = Math.floor(Math.random() * 100) - 50;
    const opponentPower = Math.max(100, playerPower + variation);

    const teamNames = [
        'FC 드래곤즈', '유나이티드 FC', '레전드 팀',
        '스타 일레븐', '골든 이글스', '블루 윙즈',
        '레드 데블스', '화이트 샤크스', '블랙 팬서스',
        '실버 호크스'
    ];

    const name = teamNames[Math.floor(Math.random() * teamNames.length)];

    return { name, power: opponentPower };
}

function startMatch(opponent) {
    if (gameState.getTeamPower() === 0) {
        alert('먼저 스쿼드를 구성해주세요!');
        return;
    }

    const playerTeam = {
        name: '내 팀',
        power: gameState.getTeamPower()
    };

    const result = MatchSimulator.simulate(playerTeam, opponent);

    // Add to history
    gameState.addMatchResult(result);

    // Add rewards
    gameState.addGold(result.rewards.gold);
    if (result.rewards.diamond > 0) {
        gameState.addDiamond(result.rewards.diamond);
    }

    gameState.save();

    // Show result modal
    showMatchResult(result);
    updateUI();
    updateHomeStats();
}

function showMatchResult(result) {
    const modal = document.getElementById('match-modal');
    const content = document.getElementById('match-result-content');

    let resultTitle = '';
    let resultClass = '';

    if (result.result === 'win') {
        resultTitle = '🎉 승리!';
        resultClass = 'win';
    } else if (result.result === 'draw') {
        resultTitle = '🤝 무승부';
        resultClass = 'draw';
    } else {
        resultTitle = '😢 패배';
        resultClass = 'loss';
    }

    content.innerHTML = `
        <div class="match-result ${resultClass}">
            <h2>${resultTitle}</h2>
            <div class="score-display">
                ${result.playerScore} : ${result.opponentScore}
            </div>
            <p>vs ${result.opponent}</p>

            <div class="match-stats">
                <h3>경기 통계</h3>
                <div class="stat-row">
                    <span>${result.playerStats.possession}%</span>
                    <span>점유율</span>
                    <span>${result.opponentStats.possession}%</span>
                </div>
                <div class="stat-row">
                    <span>${result.playerStats.shots}</span>
                    <span>슈팅</span>
                    <span>${result.opponentStats.shots}</span>
                </div>
                <div class="stat-row">
                    <span>${result.playerStats.shotsOnTarget}</span>
                    <span>유효 슈팅</span>
                    <span>${result.opponentStats.shotsOnTarget}</span>
                </div>
                <div class="stat-row">
                    <span>${result.playerStats.corners}</span>
                    <span>코너킥</span>
                    <span>${result.opponentStats.corners}</span>
                </div>
            </div>

            <div class="rewards">
                <h3>보상</h3>
                <p>💰 골드: +${result.rewards.gold.toLocaleString()}</p>
                ${result.rewards.diamond > 0 ? `<p>💎 다이아: +${result.rewards.diamond}</p>` : ''}
                <p>⭐ 경험치: +${result.rewards.exp}</p>
            </div>

            <button class="action-btn" onclick="closeModal()">확인</button>
        </div>
    `;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('match-modal').classList.remove('active');
    renderLeaguePage();
}

function renderMatchHistory() {
    const container = document.getElementById('recent-matches');

    if (gameState.matchHistory.length === 0) {
        container.innerHTML = '<p class="placeholder">아직 경기 기록이 없습니다</p>';
        return;
    }

    container.innerHTML = '';

    gameState.matchHistory.forEach(match => {
        const record = document.createElement('div');
        record.className = `match-record ${match.result}`;

        let resultText = '';
        if (match.result === 'win') resultText = '승';
        else if (match.result === 'draw') resultText = '무';
        else resultText = '패';

        record.innerHTML = `
            <div>
                <strong>${resultText}</strong> vs ${match.opponent}
            </div>
            <div>
                ${match.playerScore} : ${match.opponentScore}
            </div>
            <div>
                💰 +${match.rewards.gold}
            </div>
        `;

        container.appendChild(record);
    });
}

// Event listeners
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        navigateTo(btn.dataset.page);
    });
});

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// Auto-save periodically
setInterval(() => {
    gameState.save();
}, 30000); // Save every 30 seconds
