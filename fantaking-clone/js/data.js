// Game Data and Configuration

// Player name pools by nationality
const playerNamePools = {
    korean: [
        '손흥민', '이강인', '김민재', '황희찬', '이재성',
        '황인범', '백승호', '정우영', '조현우', '김승규',
        '이기제', '권창훈', '나상호', '정승현', '김진수',
        '윤종규', '김영권', '송범근', '박지성', '차범근'
    ],
    foreign: [
        'Messi', 'Ronaldo', 'Neymar', 'Mbappé', 'Haaland',
        'De Bruyne', 'Salah', 'Benzema', 'Lewandowski', 'Kane',
        'Vinicius', 'Modrić', 'Kimmich', 'Van Dijk', 'Alisson',
        'Courtois', 'Neuer', 'Son', 'Grealish', 'Foden',
        'Rodri', 'Casemiro', 'Bellingham', 'Pedri', 'Gavi',
        'Valverde', 'Müller', 'Gnabry', 'Sané', 'Kvaratskhelia'
    ]
};

// Position configurations
const positions = {
    GK: { name: '골키퍼', abbr: 'GK' },
    CB: { name: '중앙 수비수', abbr: 'CB' },
    LB: { name: '좌측 수비수', abbr: 'LB' },
    RB: { name: '우측 수비수', abbr: 'RB' },
    CDM: { name: '수비형 미드필더', abbr: 'CDM' },
    CM: { name: '중앙 미드필더', abbr: 'CM' },
    CAM: { name: '공격형 미드필더', abbr: 'CAM' },
    LM: { name: '좌측 미드필더', abbr: 'LM' },
    RM: { name: '우측 미드필더', abbr: 'RM' },
    LW: { name: '좌측 윙어', abbr: 'LW' },
    RW: { name: '우측 윙어', abbr: 'RW' },
    ST: { name: '스트라이커', abbr: 'ST' },
    CF: { name: '중앙 공격수', abbr: 'CF' }
};

// Formation configurations
const formations = {
    '4-4-2': [
        { pos: 'GK', x: 50, y: 95 },
        { pos: 'LB', x: 15, y: 75 },
        { pos: 'CB', x: 35, y: 75 },
        { pos: 'CB', x: 65, y: 75 },
        { pos: 'RB', x: 85, y: 75 },
        { pos: 'LM', x: 15, y: 45 },
        { pos: 'CM', x: 35, y: 50 },
        { pos: 'CM', x: 65, y: 50 },
        { pos: 'RM', x: 85, y: 45 },
        { pos: 'ST', x: 35, y: 15 },
        { pos: 'ST', x: 65, y: 15 }
    ],
    '4-3-3': [
        { pos: 'GK', x: 50, y: 95 },
        { pos: 'LB', x: 15, y: 75 },
        { pos: 'CB', x: 35, y: 75 },
        { pos: 'CB', x: 65, y: 75 },
        { pos: 'RB', x: 85, y: 75 },
        { pos: 'CM', x: 25, y: 50 },
        { pos: 'CM', x: 50, y: 50 },
        { pos: 'CM', x: 75, y: 50 },
        { pos: 'LW', x: 15, y: 15 },
        { pos: 'ST', x: 50, y: 10 },
        { pos: 'RW', x: 85, y: 15 }
    ],
    '3-5-2': [
        { pos: 'GK', x: 50, y: 95 },
        { pos: 'CB', x: 25, y: 75 },
        { pos: 'CB', x: 50, y: 75 },
        { pos: 'CB', x: 75, y: 75 },
        { pos: 'LM', x: 10, y: 50 },
        { pos: 'CM', x: 30, y: 50 },
        { pos: 'CM', x: 50, y: 50 },
        { pos: 'CM', x: 70, y: 50 },
        { pos: 'RM', x: 90, y: 50 },
        { pos: 'ST', x: 35, y: 15 },
        { pos: 'ST', x: 65, y: 15 }
    ],
    '4-2-3-1': [
        { pos: 'GK', x: 50, y: 95 },
        { pos: 'LB', x: 15, y: 75 },
        { pos: 'CB', x: 35, y: 75 },
        { pos: 'CB', x: 65, y: 75 },
        { pos: 'RB', x: 85, y: 75 },
        { pos: 'CDM', x: 35, y: 55 },
        { pos: 'CDM', x: 65, y: 55 },
        { pos: 'LM', x: 15, y: 35 },
        { pos: 'CAM', x: 50, y: 35 },
        { pos: 'RM', x: 85, y: 35 },
        { pos: 'ST', x: 50, y: 10 }
    ],
    '3-4-3': [
        { pos: 'GK', x: 50, y: 95 },
        { pos: 'CB', x: 25, y: 75 },
        { pos: 'CB', x: 50, y: 75 },
        { pos: 'CB', x: 75, y: 75 },
        { pos: 'LM', x: 15, y: 50 },
        { pos: 'CM', x: 40, y: 50 },
        { pos: 'CM', x: 60, y: 50 },
        { pos: 'RM', x: 85, y: 50 },
        { pos: 'LW', x: 20, y: 15 },
        { pos: 'ST', x: 50, y: 10 },
        { pos: 'RW', x: 80, y: 15 }
    ]
};

// Rarity definitions
const rarities = {
    1: { name: '일반', stars: '⭐', color: '#757F9A' },
    2: { name: '레어', stars: '⭐⭐', color: '#4facfe' },
    3: { name: '에픽', stars: '⭐⭐⭐', color: '#a044ff' },
    4: { name: '전설', stars: '⭐⭐⭐⭐', color: '#f093fb' }
};

// Stat ranges by rarity
const statRanges = {
    1: { min: 50, max: 65 },  // Normal
    2: { min: 65, max: 78 },  // Rare
    3: { min: 78, max: 88 },  // Epic
    4: { min: 88, max: 99 }   // Legendary
};

// Player class
class Player {
    constructor(id, name, position, rarity, level = 1) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.rarity = rarity;
        this.level = level;
        this.stats = this.generateStats();
        this.overall = this.calculateOverall();
    }

    generateStats() {
        const range = statRanges[this.rarity];
        const baseStats = {
            pace: this.randomStat(range),
            shooting: this.randomStat(range),
            passing: this.randomStat(range),
            dribbling: this.randomStat(range),
            defense: this.randomStat(range),
            physical: this.randomStat(range)
        };

        // Adjust stats based on position
        if (this.position === 'GK') {
            baseStats.diving = this.randomStat(range);
            baseStats.handling = this.randomStat(range);
            baseStats.reflexes = this.randomStat(range);
        }

        return baseStats;
    }

    randomStat(range) {
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    calculateOverall() {
        const stats = this.stats;
        if (this.position === 'GK') {
            return Math.floor((stats.diving + stats.handling + stats.reflexes + stats.physical) / 4);
        }

        let weights = { pace: 1, shooting: 1, passing: 1, dribbling: 1, defense: 1, physical: 1 };

        // Position-based weights
        if (['ST', 'CF'].includes(this.position)) {
            weights = { pace: 1.2, shooting: 1.5, passing: 0.8, dribbling: 1.2, defense: 0.3, physical: 1 };
        } else if (['CB'].includes(this.position)) {
            weights = { pace: 0.8, shooting: 0.3, passing: 0.8, dribbling: 0.5, defense: 1.5, physical: 1.3 };
        } else if (['CM', 'CDM', 'CAM'].includes(this.position)) {
            weights = { pace: 1, shooting: 1, passing: 1.5, dribbling: 1.2, defense: 1, physical: 1 };
        } else if (['LW', 'RW', 'LM', 'RM'].includes(this.position)) {
            weights = { pace: 1.5, shooting: 1.2, passing: 1, dribbling: 1.3, defense: 0.5, physical: 0.8 };
        } else if (['LB', 'RB'].includes(this.position)) {
            weights = { pace: 1.2, shooting: 0.5, passing: 1, dribbling: 0.8, defense: 1.3, physical: 1.2 };
        }

        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        const weightedSum = Object.keys(weights).reduce((sum, stat) => {
            return sum + (stats[stat] || 0) * weights[stat];
        }, 0);

        const overall = Math.floor(weightedSum / totalWeight);

        // Level bonus
        return overall + (this.level - 1) * 2;
    }

    upgrade() {
        this.level++;
        // Slightly improve stats on upgrade
        Object.keys(this.stats).forEach(stat => {
            if (Math.random() > 0.5) {
                this.stats[stat] = Math.min(99, this.stats[stat] + 1);
            }
        });
        this.overall = this.calculateOverall();
    }

    getUpgradeCost() {
        return Math.floor(1000 * Math.pow(1.5, this.level - 1));
    }
}

// Game state
class GameState {
    constructor() {
        this.gold = 10000;
        this.diamond = 100;
        this.players = [];
        this.squad = new Array(11).fill(null);
        this.formation = '4-4-2';
        this.leaguePoints = 0;
        this.matchHistory = [];
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.nextPlayerId = 1;

        // Initialize with starter players
        this.initializeStarterPlayers();
    }

    initializeStarterPlayers() {
        // Give some starter players
        const starterPositions = ['GK', 'CB', 'CB', 'CM', 'ST'];
        starterPositions.forEach(pos => {
            this.players.push(this.generateRandomPlayer(1, pos));
        });
    }

    generateRandomPlayer(rarity, position = null) {
        const availablePositions = position ? [position] : Object.keys(positions);
        const selectedPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];

        const namePool = Math.random() > 0.5 ? playerNamePools.korean : playerNamePools.foreign;
        const name = namePool[Math.floor(Math.random() * namePool.length)];

        const player = new Player(this.nextPlayerId++, name, selectedPosition, rarity);
        return player;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(p => p.id !== playerId);
    }

    getPlayer(playerId) {
        return this.players.find(p => p.id === playerId);
    }

    setSquadPlayer(index, playerId) {
        this.squad[index] = playerId;
    }

    getSquadPlayer(index) {
        const playerId = this.squad[index];
        return playerId ? this.getPlayer(playerId) : null;
    }

    getTeamPower() {
        let totalPower = 0;
        this.squad.forEach(playerId => {
            if (playerId) {
                const player = this.getPlayer(playerId);
                if (player) totalPower += player.overall;
            }
        });
        return totalPower;
    }

    addGold(amount) {
        this.gold += amount;
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    addDiamond(amount) {
        this.diamond += amount;
    }

    spendDiamond(amount) {
        if (this.diamond >= amount) {
            this.diamond -= amount;
            return true;
        }
        return false;
    }

    addMatchResult(result) {
        this.matchHistory.unshift(result);
        if (this.matchHistory.length > 10) {
            this.matchHistory.pop();
        }

        if (result.result === 'win') {
            this.wins++;
            this.leaguePoints += 3;
        } else if (result.result === 'draw') {
            this.draws++;
            this.leaguePoints += 1;
        } else {
            this.losses++;
        }
    }

    getWinRate() {
        const totalMatches = this.wins + this.losses + this.draws;
        if (totalMatches === 0) return 0;
        return Math.floor((this.wins / totalMatches) * 100);
    }

    save() {
        const saveData = {
            gold: this.gold,
            diamond: this.diamond,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                position: p.position,
                rarity: p.rarity,
                level: p.level,
                stats: p.stats
            })),
            squad: this.squad,
            formation: this.formation,
            leaguePoints: this.leaguePoints,
            matchHistory: this.matchHistory,
            wins: this.wins,
            losses: this.losses,
            draws: this.draws,
            nextPlayerId: this.nextPlayerId
        };
        localStorage.setItem('fantakingGameSave', JSON.stringify(saveData));
    }

    load() {
        const saveData = localStorage.getItem('fantakingGameSave');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.gold = data.gold;
                this.diamond = data.diamond;
                this.squad = data.squad;
                this.formation = data.formation;
                this.leaguePoints = data.leaguePoints;
                this.matchHistory = data.matchHistory || [];
                this.wins = data.wins || 0;
                this.losses = data.losses || 0;
                this.draws = data.draws || 0;
                this.nextPlayerId = data.nextPlayerId;

                // Restore players
                this.players = data.players.map(p => {
                    const player = new Player(p.id, p.name, p.position, p.rarity, p.level);
                    player.stats = p.stats;
                    player.overall = player.calculateOverall();
                    return player;
                });

                return true;
            } catch (e) {
                console.error('Failed to load save data:', e);
                return false;
            }
        }
        return false;
    }
}

// Gacha system
class GachaSystem {
    static drawCard(type) {
        let rarity;
        const roll = Math.random() * 100;

        if (type === 'normal') {
            if (roll < 60) rarity = 1;      // 60% normal
            else if (roll < 90) rarity = 2; // 30% rare
            else rarity = 3;                 // 10% epic
        } else { // premium
            if (roll < 50) rarity = 2;      // 50% rare
            else if (roll < 85) rarity = 3; // 35% epic
            else rarity = 4;                 // 15% legendary
        }

        return rarity;
    }

    static draw(game, type, count) {
        const results = [];
        const costPerDraw = type === 'normal' ? 1000 : 10;
        const currency = type === 'normal' ? 'gold' : 'diamond';
        const totalCost = count === 10 ? costPerDraw * count * 0.9 : costPerDraw * count;

        let canAfford = false;
        if (currency === 'gold') {
            canAfford = game.spendGold(totalCost);
        } else {
            canAfford = game.spendDiamond(totalCost);
        }

        if (!canAfford) {
            return { success: false, message: '재화가 부족합니다!' };
        }

        for (let i = 0; i < count; i++) {
            const rarity = this.drawCard(type);
            const player = game.generateRandomPlayer(rarity);
            game.addPlayer(player);
            results.push(player);
        }

        game.save();
        return { success: true, players: results };
    }
}

// Match simulation
class MatchSimulator {
    static simulate(playerTeam, opponentTeam) {
        const playerPower = playerTeam.power;
        const opponentPower = opponentTeam.power;

        // Base probabilities
        const powerDiff = playerPower - opponentPower;
        const winProbability = 50 + (powerDiff / 10);

        const roll = Math.random() * 100;

        let result;
        if (roll < winProbability) {
            result = 'win';
        } else if (roll < winProbability + 20) {
            result = 'draw';
        } else {
            result = 'loss';
        }

        // Generate scores
        let playerScore, opponentScore;
        if (result === 'win') {
            playerScore = Math.floor(Math.random() * 3) + 2; // 2-4
            opponentScore = Math.floor(Math.random() * playerScore);
        } else if (result === 'draw') {
            playerScore = Math.floor(Math.random() * 3) + 1; // 1-3
            opponentScore = playerScore;
        } else {
            opponentScore = Math.floor(Math.random() * 3) + 2; // 2-4
            playerScore = Math.floor(Math.random() * opponentScore);
        }

        // Generate match stats
        const stats = {
            possession: Math.floor(45 + (powerDiff / 5) + Math.random() * 10),
            shots: Math.floor(8 + (powerDiff / 10) + Math.random() * 8),
            shotsOnTarget: Math.floor(4 + (powerDiff / 15) + Math.random() * 4),
            corners: Math.floor(4 + Math.random() * 6),
            fouls: Math.floor(8 + Math.random() * 8)
        };

        stats.possession = Math.max(30, Math.min(70, stats.possession));

        // Rewards
        const rewards = {
            gold: 0,
            diamond: 0,
            exp: 0
        };

        if (result === 'win') {
            rewards.gold = Math.floor(500 + Math.random() * 500);
            rewards.exp = 100;
            if (Math.random() < 0.1) rewards.diamond = 5;
        } else if (result === 'draw') {
            rewards.gold = Math.floor(200 + Math.random() * 300);
            rewards.exp = 50;
        } else {
            rewards.gold = Math.floor(100 + Math.random() * 200);
            rewards.exp = 25;
        }

        return {
            result,
            playerScore,
            opponentScore,
            playerStats: stats,
            opponentStats: {
                possession: 100 - stats.possession,
                shots: Math.floor(8 + Math.random() * 8),
                shotsOnTarget: Math.floor(4 + Math.random() * 4),
                corners: Math.floor(4 + Math.random() * 6),
                fouls: Math.floor(8 + Math.random() * 8)
            },
            rewards,
            opponent: opponentTeam.name
        };
    }
}
