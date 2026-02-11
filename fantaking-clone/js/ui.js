// UI Update and Animation

// Battle UI Update
window.updateBattleUI = function(battle) {
    const state = battle.getState();

    // Update HP bars
    updateHPBar('player-base', state.playerBase);
    updateHPBar('enemy-base', state.enemyBase);

    // Update HP percentages
    document.getElementById('player-hp').textContent = Math.floor((state.playerBase.hp / state.playerBase.maxHp) * 100);
    document.getElementById('enemy-hp').textContent = Math.floor((state.enemyBase.hp / state.enemyBase.maxHp) * 100);

    // Update outposts
    renderOutposts(state.outposts);

    // Update units
    renderUnits(state.playerUnits, state.enemyUnits);

    // Update spell cooldowns
    updateSpellCooldowns(state.spellCooldowns);

    // Update mana display (if element exists)
    updateResourceDisplay(state);
};

function updateHPBar(baseId, baseData) {
    const base = document.getElementById(baseId);
    if (!base) return;

    const hpBar = base.querySelector('.hp-fill');
    if (hpBar) {
        const percentage = (baseData.hp / baseData.maxHp) * 100;
        hpBar.style.width = percentage + '%';

        // Color changes based on HP
        if (percentage > 60) {
            hpBar.style.background = 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)';
        } else if (percentage > 30) {
            hpBar.style.background = 'linear-gradient(90deg, #FFC107 0%, #FFB300 100%)';
        } else {
            hpBar.style.background = 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)';
        }
    }
}

function renderOutposts(outposts) {
    const container = document.getElementById('outposts-container');
    if (!container) return;

    // Clear existing outposts
    container.innerHTML = '';

    outposts.forEach(outpost => {
        let existingOutpost = container.querySelector(`[data-outpost-id="${outpost.id}"]`);

        if (!existingOutpost) {
            existingOutpost = document.createElement('div');
            existingOutpost.className = 'outpost neutral';
            existingOutpost.dataset.outpostId = outpost.id;
            existingOutpost.style.left = outpost.x + '%';
            existingOutpost.style.top = outpost.y + '%';
            existingOutpost.style.transform = 'translate(-50%, -50%)';

            existingOutpost.innerHTML = `
                <div class="outpost-icon">🏛️</div>
                <div class="outpost-layer">L${outpost.layer}</div>
            `;

            container.appendChild(existingOutpost);
        }

        // Update outpost state
        existingOutpost.className = `outpost ${outpost.owner}`;
        const layerDiv = existingOutpost.querySelector('.outpost-layer');
        if (layerDiv) {
            layerDiv.textContent = `L${outpost.layer}`;
        }

        // Add click handler for player to capture
        if (outpost.owner === 'neutral' || outpost.owner === 'enemy') {
            existingOutpost.onclick = () => {
                if (currentBattle) {
                    currentBattle.captureOutpost(outpost, 'player');
                    showNotification('거점 공격!', 'info');
                }
            };
        }
    });
}

function renderUnits(playerUnits, enemyUnits) {
    const container = document.getElementById('units-container');
    if (!container) return;

    // Clear existing units
    container.innerHTML = '';

    // Render player units
    playerUnits.forEach(unit => {
        const unitEl = createUnitElement(unit, 'player');
        container.appendChild(unitEl);
    });

    // Render enemy units
    enemyUnits.forEach(unit => {
        const unitEl = createUnitElement(unit, 'enemy');
        container.appendChild(unitEl);
    });
}

function createUnitElement(unit, side) {
    const unitEl = document.createElement('div');
    unitEl.className = `unit ${side}`;
    unitEl.style.left = unit.x + '%';
    unitEl.style.top = unit.y + '%';
    unitEl.style.transform = 'translate(-50%, -50%)';
    unitEl.innerHTML = unit.icon;
    unitEl.title = `${unit.name}\nHP: ${Math.floor(unit.hp)}/${unit.maxHp}`;

    // HP indicator
    const hpPercent = (unit.hp / unit.maxHp);
    if (hpPercent < 1) {
        unitEl.style.boxShadow = `0 0 10px ${hpPercent > 0.5 ? '#4CAF50' : hpPercent > 0.2 ? '#FFC107' : '#f44336'}`;
    }

    return unitEl;
}

function updateSpellCooldowns(cooldowns) {
    Object.keys(cooldowns).forEach(spellId => {
        const btn = document.querySelector(`[data-spell-id="${spellId}"]`);
        if (btn) {
            btn.disabled = true;

            // Add or update cooldown indicator
            let cooldownDiv = btn.querySelector('.cooldown');
            if (!cooldownDiv) {
                cooldownDiv = document.createElement('div');
                cooldownDiv.className = 'cooldown';
                btn.appendChild(cooldownDiv);
            }

            cooldownDiv.textContent = Math.ceil(cooldowns[spellId]);
        }
    });

    // Re-enable spells not on cooldown
    document.querySelectorAll('.magic-btn').forEach(btn => {
        const spellId = btn.dataset.spellId;
        if (!cooldowns[spellId]) {
            btn.disabled = false;
            const cooldownDiv = btn.querySelector('.cooldown');
            if (cooldownDiv) {
                cooldownDiv.remove();
            }
        }
    });
}

function updateResourceDisplay(state) {
    // You can add a resource panel if needed
    // For now, we'll just log it
    if (window.DEBUG) {
        console.log('Mana:', state.playerMana, '/', state.maxMana);
        console.log('Gold:', state.playerGold);
    }
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .level-up {
        font-size: 24px;
        color: #ffd700;
        text-align: center;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    /* Tooltip styles */
    .tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 10000;
        white-space: nowrap;
    }

    /* Loading animation */
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Battle effect animations */
    @keyframes explosion {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }

    .explosion-effect {
        position: absolute;
        width: 30px;
        height: 30px;
        background: radial-gradient(circle, #ff6b6b, transparent);
        border-radius: 50%;
        animation: explosion 0.5s ease-out;
        pointer-events: none;
    }

    /* Damage numbers */
    @keyframes damageFloat {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px);
            opacity: 0;
        }
    }

    .damage-number {
        position: absolute;
        color: #f44336;
        font-weight: bold;
        font-size: 18px;
        animation: damageFloat 1s ease-out;
        pointer-events: none;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }

    .heal-number {
        color: #4CAF50;
    }

    /* Glow effect for active units */
    .unit.active {
        animation: unitGlow 1s ease-in-out infinite;
    }

    @keyframes unitGlow {
        0%, 100% {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
        }
    }
`;
document.head.appendChild(style);

// Utility functions
function createExplosion(x, y) {
    const battleMap = document.getElementById('battle-map');
    if (!battleMap) return;

    const explosion = document.createElement('div');
    explosion.className = 'explosion-effect';
    explosion.style.left = x + '%';
    explosion.style.top = y + '%';

    battleMap.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 500);
}

function showDamageNumber(x, y, damage, isHeal = false) {
    const battleMap = document.getElementById('battle-map');
    if (!battleMap) return;

    const damageNum = document.createElement('div');
    damageNum.className = `damage-number ${isHeal ? 'heal-number' : ''}`;
    damageNum.textContent = isHeal ? `+${damage}` : `-${damage}`;
    damageNum.style.left = x + '%';
    damageNum.style.top = y + '%';

    battleMap.appendChild(damageNum);

    setTimeout(() => {
        damageNum.remove();
    }, 1000);
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

    element.addEventListener('mouseleave', () => {
        tooltip.remove();
    }, { once: true });
}

// Add tooltips to units
document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('unit')) {
        const title = e.target.title;
        if (title) {
            showTooltip(e.target, title);
        }
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance monitoring (optional)
let fps = 0;
let lastFrameTime = Date.now();
let frameCount = 0;

function updateFPS() {
    frameCount++;
    const now = Date.now();

    if (now - lastFrameTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;

        if (window.DEBUG) {
            console.log('FPS:', fps);
        }
    }

    requestAnimationFrame(updateFPS);
}

if (window.DEBUG) {
    updateFPS();
}

// Sound effects (optional, can be expanded)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;

function playSound(frequency, duration, type = 'sine') {
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Export sound functions
window.sounds = {
    click: () => playSound(800, 0.1),
    cast: () => playSound(600, 0.2),
    hit: () => playSound(200, 0.1, 'square'),
    victory: () => {
        playSound(523, 0.15);
        setTimeout(() => playSound(659, 0.15), 150);
        setTimeout(() => playSound(784, 0.3), 300);
    },
    defeat: () => playSound(200, 0.5, 'sawtooth')
};

// Add click sounds to buttons
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && window.sounds) {
        window.sounds.click();
    }
});

console.log('UI system loaded');
