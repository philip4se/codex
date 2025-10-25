// Main Game Logic

let gameState;
let currentBattle = null;

// Initialize game
function initGame() {
    gameState = new GameState();

    // Try to load saved game
    const loaded = gameState.load();
    if (loaded) {
        console.log('Game loaded from save');
        if (gameState.selectedRace) {
            hideRaceSelection();
        }
    } else {
        console.log('New game started');
    }

    updateUI();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.page);
        });
    });

    // Formation selector if exists
    const formationSelect = document.getElementById('formation-select');
    if (formationSelect) {
        formationSelect.addEventListener('change', (e) => {
            gameState.formation = e.target.value;
            gameState.save();
        });
    }
}

// Race selection
function selectRace(race) {
    if (gameState.selectedRace) {
        if (!confirm('종족을 변경하시겠습니까? 모든 진행 상황이 초기화됩니다.')) {
            return;
        }
        gameState = new GameState();
    }

    gameState.selectRace(race);
    gameState.save();

    hideRaceSelection();
    updateUI();
    showNotification(`${RACES[race].name} 종족을 선택했습니다!`, 'success');
}

function hideRaceSelection() {
    document.getElementById('race-selection').style.display = 'none';
    document.getElementById('game-stats').style.display = 'grid';
    document.getElementById('quick-actions').style.display = 'flex';
}

// Navigation
function navigateTo(page) {
    if (!gameState.selectedRace && page !== 'home') {
        showNotification('먼저 종족을 선택해주세요!', 'error');
        return;
    }

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

    // Load page content
    switch (page) {
        case 'campaign':
            renderCampaignStages();
            break;
        case 'invasion':
            renderInvasionOpponents();
            break;
        case 'raid':
            renderRaidBosses();
            break;
        case 'units':
            renderUnits();
            break;
        case 'items':
            renderItems();
            break;
        case 'home':
            updateHomeStats();
            break;
    }
}

// Update UI
function updateUI() {
    document.getElementById('gold').textContent = Math.floor(gameState.gold).toLocaleString();
    document.getElementById('gem').textContent = Math.floor(gameState.gem).toLocaleString();
    document.getElementById('power').textContent = Math.floor(gameState.getTotalPower());
    document.getElementById('current-race').textContent = gameState.selectedRace
        ? RACES[gameState.selectedRace].name
        : '미선택';
}

function updateHomeStats() {
    document.getElementById('total-power').textContent = Math.floor(gameState.getTotalPower());
    document.getElementById('wins').textContent = gameState.wins;
    document.getElementById('losses').textContent = gameState.losses;
    document.getElementById('player-level').textContent = gameState.level;
}

// Campaign
function renderCampaignStages() {
    const container = document.getElementById('stage-list');
    container.innerHTML = '';

    CAMPAIGN_STAGES.forEach(stage => {
        const isUnlocked = gameState.unlockedStages.includes(stage.id);

        const card = document.createElement('div');
        card.className = `stage-card ${!isUnlocked ? 'locked' : ''}`;

        const difficultyClass = stage.difficulty;

        card.innerHTML = `
            <div class="stage-number">스테이지 ${stage.id}</div>
            <h3>${stage.name}</h3>
            <span class="stage-difficulty ${difficultyClass}">${stage.difficulty.toUpperCase()}</span>
            <p>적 종족: ${RACES[stage.enemyRace].icon} ${RACES[stage.enemyRace].name}</p>
            <p>거점 수: ${stage.outposts}</p>
            <div class="stage-reward">
                <p>보상: 💰${stage.reward.gold} 💎${stage.reward.gem} ⭐${stage.reward.exp}</p>
            </div>
        `;

        if (isUnlocked) {
            card.onclick = () => startCampaignBattle(stage);
        } else {
            card.title = '이전 스테이지를 클리어하세요';
        }

        container.appendChild(card);
    });
}

function startCampaignBattle(stage) {
    navigateTo('battle');
    currentBattle = new Battle(stage, gameState.selectedRace);
    currentBattle.start();
    setupBattleUI();
}

// Battle UI
function setupBattleUI() {
    const magicButtons = document.getElementById('magic-buttons');
    magicButtons.innerHTML = '';

    const spells = SPELLS[gameState.selectedRace];

    spells.forEach(spell => {
        const btn = document.createElement('button');
        btn.className = 'magic-btn';
        btn.innerHTML = `${spell.icon} ${spell.name} (${spell.cost})`;
        btn.title = spell.description;
        btn.onclick = () => castSpell(spell.id);
        btn.dataset.spellId = spell.id;

        magicButtons.appendChild(btn);
    });
}

function castSpell(spellId) {
    if (!currentBattle) return;

    const success = currentBattle.castSpell(spellId);

    if (success) {
        showNotification('마법을 시전했습니다!', 'success');
    } else {
        showNotification('마나가 부족하거나 재사용 대기 중입니다!', 'error');
    }
}

function togglePause() {
    if (!currentBattle) return;

    currentBattle.pause();
    const btn = document.getElementById('pause-btn');

    if (currentBattle.isPaused) {
        btn.textContent = '▶️ 재개';
    } else {
        btn.textContent = '⏸️ 일시정지';
    }
}

function changeSpeed() {
    if (!currentBattle) return;

    const speeds = [1, 2, 3];
    const currentIndex = speeds.indexOf(currentBattle.speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];

    currentBattle.setSpeed(nextSpeed);

    const btn = document.getElementById('speed-btn');
    btn.textContent = `⏩ 속도: x${nextSpeed}`;
}

function retreatBattle() {
    if (!currentBattle) return;

    if (confirm('전투에서 후퇴하시겠습니까?')) {
        currentBattle.stop();
        endBattle('retreat');
    }
}

function endBattle(result) {
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const content = document.getElementById('result-content');

    let resultHtml = '';

    if (result === 'victory' || currentBattle.result === 'victory') {
        title.textContent = '🎉 승리!';
        title.style.color = '#4CAF50';

        const stage = currentBattle.stage;
        const reward = stage.reward;

        gameState.addGold(reward.gold);
        gameState.addGem(reward.gem);
        const leveledUp = gameState.addExp(reward.exp);
        gameState.wins++;

        // Unlock next stage
        if (stage.id < CAMPAIGN_STAGES.length) {
            gameState.unlockStage(stage.id + 1);
        }

        // Random item drop
        if (Math.random() < 0.3) {
            const itemType = Object.keys(ITEM_TYPES)[Math.floor(Math.random() * Object.keys(ITEM_TYPES).length)];
            const rarity = Math.random() < 0.1 ? 3 : (Math.random() < 0.3 ? 2 : 1);
            const item = new Item(itemType, rarity, gameState.level);
            gameState.addItem(item);

            resultHtml += `<p>🎁 아이템 획득: ${item.name}</p>`;
        }

        resultHtml = `
            <div class="result-stats">
                <p>💰 골드: +${reward.gold}</p>
                <p>💎 보석: +${reward.gem}</p>
                <p>⭐ 경험치: +${reward.exp}</p>
                ${leveledUp ? '<p class="level-up">🎊 레벨 업!</p>' : ''}
            </div>
            ${resultHtml}
        `;
    } else if (result === 'defeat' || currentBattle.result === 'defeat') {
        title.textContent = '💀 패배...';
        title.style.color = '#f44336';

        gameState.losses++;

        resultHtml = `
            <p>다시 도전하세요!</p>
        `;
    } else {
        title.textContent = '후퇴';
        title.style.color = '#FFC107';

        resultHtml = `
            <p>전투에서 후퇴했습니다.</p>
        `;
    }

    content.innerHTML = resultHtml;
    modal.classList.add('active');

    gameState.save();
    updateUI();
    currentBattle = null;
}

function closeResultModal() {
    document.getElementById('result-modal').classList.remove('active');
    navigateTo('campaign');
}

// Invasion
function renderInvasionOpponents() {
    const container = document.getElementById('invasion-list');
    container.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const opponent = generateOpponent(gameState.level);

        const card = document.createElement('div');
        card.className = 'opponent-card';

        card.innerHTML = `
            <div class="opponent-info">
                <h4>${RACES[opponent.race].icon} ${opponent.name}</h4>
                <p>레벨: ${opponent.level} | 전투력: ${opponent.power}</p>
            </div>
            <button class="challenge-btn" onclick="startInvasionBattle('${JSON.stringify(opponent).replace(/'/g, "\\'")}')">
                도전
            </button>
        `;

        container.appendChild(card);
    }
}

function startInvasionBattle(opponentJson) {
    const opponent = JSON.parse(opponentJson);

    const stage = {
        id: 'invasion',
        name: `침공: ${opponent.name}`,
        difficulty: 'normal',
        enemyRace: opponent.race,
        enemyLevel: opponent.level,
        outposts: 4,
        reward: {
            gold: opponent.level * 50,
            exp: opponent.level * 25,
            gem: Math.floor(opponent.level / 2)
        }
    };

    startCampaignBattle(stage);
}

// Survival
function startSurvival() {
    const stage = {
        id: 'survival',
        name: '서바이벌',
        difficulty: 'hard',
        enemyRace: Object.keys(RACES)[Math.floor(Math.random() * Object.keys(RACES).length)],
        enemyLevel: gameState.level,
        outposts: 5,
        reward: {
            gold: 300,
            exp: 200,
            gem: 20
        }
    };

    startCampaignBattle(stage);
}

// Raid
function renderRaidBosses() {
    const container = document.getElementById('raid-bosses');
    container.innerHTML = '';

    RAID_BOSSES.forEach(boss => {
        const card = document.createElement('div');
        card.className = 'boss-card';

        card.innerHTML = `
            <div class="boss-icon">${boss.icon}</div>
            <h3>${boss.name}</h3>
            <p class="boss-hp">HP: ${boss.hp}</p>
            <p>레벨: ${boss.level}</p>
            <p>공격력: ${boss.attack}</p>
            <button class="challenge-btn" onclick="startRaidBattle('${boss.id}')">
                도전
            </button>
        `;

        if (gameState.level < boss.level - 5) {
            card.style.opacity = '0.5';
            card.querySelector('.challenge-btn').disabled = true;
            card.querySelector('.challenge-btn').textContent = '레벨 부족';
        }

        container.appendChild(card);
    });
}

function startRaidBattle(bossId) {
    const boss = RAID_BOSSES.find(b => b.id === bossId);

    const stage = {
        id: 'raid_' + bossId,
        name: `레이드: ${boss.name}`,
        difficulty: 'hard',
        enemyRace: Object.keys(RACES)[Math.floor(Math.random() * Object.keys(RACES).length)],
        enemyLevel: boss.level,
        outposts: 3,
        reward: boss.reward
    };

    startCampaignBattle(stage);
}

// Units
function renderUnits() {
    const container = document.getElementById('unit-types');
    container.innerHTML = '';

    if (!gameState.selectedRace) {
        container.innerHTML = '<p style="color: #fff;">종족을 먼저 선택하세요</p>';
        return;
    }

    const unitTypes = UNIT_TYPES[gameState.selectedRace];

    unitTypes.forEach(unitType => {
        const card = document.createElement('div');
        card.className = 'unit-card';

        card.innerHTML = `
            <div class="unit-icon">${unitType.icon}</div>
            <h4>${unitType.name}</h4>
            <p>${unitType.description}</p>
            <div class="unit-stats">
                <div>HP: ${unitType.hp}</div>
                <div>공격: ${unitType.attack}</div>
                <div>방어: ${unitType.defense}</div>
                <div>속도: ${unitType.speed}</div>
                <div>사거리: ${unitType.range}</div>
            </div>
            <p style="margin-top: 10px; color: #ffd700;">비용: ${unitType.cost} 골드</p>
        `;

        container.appendChild(card);
    });
}

// Items
function renderItems() {
    const inventory = document.getElementById('item-inventory');
    inventory.innerHTML = '';

    if (gameState.items.length === 0) {
        inventory.innerHTML = '<p style="color: #fff; grid-column: 1/-1; text-align: center;">보유한 아이템이 없습니다</p>';
        return;
    }

    gameState.items.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.style.borderColor = RARITIES[item.rarity].color;
        slot.innerHTML = ITEM_TYPES[item.type].icon;
        slot.title = `${item.name}\n보너스: +${item.bonus}`;

        inventory.appendChild(slot);
    });
}

function synthesizeItems() {
    if (gameState.items.length < 2) {
        showNotification('합성할 아이템이 부족합니다!', 'error');
        return;
    }

    // Simple synthesis: combine two random items
    const item1 = gameState.items[0];
    const item2 = gameState.items[1];

    const newRarity = Math.min(5, Math.max(item1.rarity, item2.rarity) + (Math.random() < 0.3 ? 1 : 0));
    const newLevel = Math.max(item1.level, item2.level);

    const newItem = new Item(item1.type, newRarity, newLevel);

    gameState.removeItem(item1.id);
    gameState.removeItem(item2.id);
    gameState.addItem(newItem);

    gameState.save();
    renderItems();

    showNotification(`합성 성공! ${newItem.name}을(를) 획득했습니다!`, 'success');
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s, slideOut 0.3s 2.7s;
        font-weight: bold;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Auto-save
setInterval(() => {
    if (gameState) {
        gameState.save();
    }
}, 30000);

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// Check battle result
setInterval(() => {
    if (currentBattle && currentBattle.result) {
        endBattle(currentBattle.result);
    }
}, 1000);
