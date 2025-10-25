// UI Helper Functions and Utilities

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s, slideOutRight 0.3s ${duration - 300}ms;
        font-weight: bold;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .fade-in {
        animation: fadeIn 0.3s;
    }

    .slide-up {
        animation: slideUp 0.3s;
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .pulse {
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    .shake {
        animation: shake 0.5s;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }

    /* Loading overlay */
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        flex-direction: column;
        color: white;
    }

    .loading-overlay .loading-text {
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
    }

    /* Confirmation dialog */
    .confirm-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        min-width: 300px;
        text-align: center;
    }

    .confirm-dialog h3 {
        margin-bottom: 15px;
        color: #1e3c72;
    }

    .confirm-dialog .buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    .confirm-dialog button {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
    }

    .confirm-dialog .btn-confirm {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .confirm-dialog .btn-cancel {
        background: #e0e0e0;
        color: #333;
    }

    .confirm-dialog button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Number counter animation */
    .number-pop {
        display: inline-block;
        animation: numberPop 0.5s;
    }

    @keyframes numberPop {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
            color: #4CAF50;
        }
        100% {
            transform: scale(1);
        }
    }

    /* Card flip animation for gacha */
    .card-flip {
        animation: cardFlip 0.6s;
    }

    @keyframes cardFlip {
        0% {
            transform: rotateY(0deg);
        }
        50% {
            transform: rotateY(90deg);
        }
        100% {
            transform: rotateY(0deg);
        }
    }

    /* Sparkle effect for legendary cards */
    .sparkle {
        position: relative;
        overflow: hidden;
    }

    .sparkle::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
        );
        animation: sparkleMove 2s infinite;
    }

    @keyframes sparkleMove {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Loading overlay
function showLoading(text = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">${text}</div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Confirmation dialog
function showConfirm(message, onConfirm, onCancel) {
    const backdrop = document.createElement('div');
    backdrop.className = 'loading-overlay';
    backdrop.style.background = 'rgba(0, 0, 0, 0.5)';

    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog slide-up';
    dialog.innerHTML = `
        <h3>확인</h3>
        <p>${message}</p>
        <div class="buttons">
            <button class="btn-cancel">취소</button>
            <button class="btn-confirm">확인</button>
        </div>
    `;

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    dialog.querySelector('.btn-cancel').onclick = () => {
        backdrop.remove();
        if (onCancel) onCancel();
    };

    dialog.querySelector('.btn-confirm').onclick = () => {
        backdrop.remove();
        if (onConfirm) onConfirm();
    };

    backdrop.onclick = (e) => {
        if (e.target === backdrop) {
            backdrop.remove();
            if (onCancel) onCancel();
        }
    };
}

// Number animation
function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Add sparkle effect to legendary cards
function addSparkleEffect(element) {
    element.classList.add('sparkle');
}

// Particle effect for rewards
function createParticleEffect(x, y, color = '#FFD700') {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
        `;

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let px = x, py = y;
        let opacity = 1;

        const animate = () => {
            px += vx;
            py += vy;
            opacity -= 0.02;

            particle.style.left = px + 'px';
            particle.style.top = py + 'px';
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Get rarity color
function getRarityColor(rarity) {
    const colors = {
        1: '#757F9A',
        2: '#4facfe',
        3: '#a044ff',
        4: '#f093fb'
    };
    return colors[rarity] || '#666';
}

// Add sound effects (simple beep using Web Audio API)
function playSound(frequency = 440, duration = 100, type = 'sine') {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        // Silently fail if audio context is not available
    }
}

// Sound effects
const sounds = {
    click: () => playSound(800, 50),
    success: () => {
        playSound(523, 100);
        setTimeout(() => playSound(659, 100), 100);
        setTimeout(() => playSound(784, 150), 200);
    },
    error: () => playSound(200, 200, 'sawtooth'),
    coin: () => {
        playSound(988, 50);
        setTimeout(() => playSound(1047, 100), 50);
    },
    cardDraw: () => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => playSound(440 + i * 100, 100), i * 100);
        }
    }
};

// Smooth scroll to element
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('클립보드에 복사되었습니다!', 'success');
    }).catch(() => {
        showToast('복사에 실패했습니다', 'error');
    });
}

// Get relative time (e.g., "2 hours ago")
function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export utility functions to global scope
window.uiUtils = {
    showToast,
    showLoading,
    hideLoading,
    showConfirm,
    animateNumber,
    addSparkleEffect,
    createParticleEffect,
    formatNumber,
    getRarityColor,
    sounds,
    smoothScrollTo,
    copyToClipboard,
    getRelativeTime,
    debounce,
    throttle
};

console.log('UI utilities loaded');
