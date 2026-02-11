// Game Data and Configuration

// Race Definitions
const RACES = {
    human: {
        name: '인간',
        icon: '⚔️',
        description: '강력한 공격력과 높은 체력을 가진 종족',
        bonuses: {
            attack: 1.2,
            health: 1.3,
            speed: 1.0
        }
    },
    elf: {
        name: '엘프',
        icon: '🏹',
        description: '빠른 이동속도와 높은 민첩성을 가진 종족',
        bonuses: {
            attack: 1.0,
            health: 0.9,
            speed: 1.5,
            critChance: 0.25
        }
    },
    undead: {
        name: '언데드',
        icon: '💀',
        description: '강력한 마법과 특수 능력을 가진 종족',
        bonuses: {
            attack: 1.1,
            health: 1.0,
            speed: 0.9,
            magicPower: 1.4
        }
    }
};

// Unit Types
const UNIT_TYPES = {
    human: [
        {
            id: 'warrior',
            name: '전사',
            icon: '🗡️',
            cost: 50,
            hp: 100,
            attack: 15,
            defense: 10,
            speed: 5,
            range: 1,
            description: '기본 근접 전투 유닛'
        },
        {
            id: 'knight',
            name: '기사',
            icon: '🛡️',
            cost: 100,
            hp: 150,
            attack: 20,
            defense: 20,
            speed: 4,
            range: 1,
            description: '강력한 방어력을 가진 중장갑 유닛'
        },
        {
            id: 'archer',
            name: '궁수',
            icon: '🏹',
            cost: 75,
            hp: 60,
            attack: 18,
            defense: 5,
            speed: 6,
            range: 3,
            description: '원거리 공격 유닛'
        },
        {
            id: 'paladin',
            name: '팔라딘',
            icon: '⚜️',
            cost: 150,
            hp: 180,
            attack: 25,
            defense: 25,
            speed: 5,
            range: 1,
            description: '신성한 힘을 가진 최상급 유닛'
        }
    ],
    elf: [
        {
            id: 'ranger',
            name: '레인저',
            icon: '🏹',
            cost: 60,
            hp: 70,
            attack: 16,
            defense: 6,
            speed: 8,
            range: 3,
            description: '빠르고 정확한 원거리 유닛'
        },
        {
            id: 'scout',
            name: '정찰병',
            icon: '👁️',
            cost: 40,
            hp: 50,
            attack: 12,
            defense: 4,
            speed: 10,
            range: 2,
            description: '매우 빠른 이동속도'
        },
        {
            id: 'druid',
            name: '드루이드',
            icon: '🌿',
            cost: 120,
            hp: 80,
            attack: 14,
            defense: 8,
            speed: 6,
            range: 2,
            description: '자연 마법을 사용하는 유닛'
        },
        {
            id: 'windwalker',
            name: '바람술사',
            icon: '🌪️',
            cost: 140,
            hp: 90,
            attack: 22,
            defense: 10,
            speed: 9,
            range: 2,
            description: '바람의 힘을 다루는 엘프 최강 유닛'
        }
    ],
    undead: [
        {
            id: 'skeleton',
            name: '스켈레톤',
            icon: '☠️',
            cost: 45,
            hp: 60,
            attack: 12,
            defense: 5,
            speed: 5,
            range: 1,
            description: '기본 언데드 전사'
        },
        {
            id: 'necromancer',
            name: '네크로맨서',
            icon: '🧙',
            cost: 130,
            hp: 70,
            attack: 20,
            defense: 7,
            speed: 4,
            range: 3,
            description: '죽은 자를 소환하는 마법사'
        },
        {
            id: 'vampire',
            name: '뱀파이어',
            icon: '🧛',
            cost: 110,
            hp: 100,
            attack: 24,
            defense: 12,
            speed: 7,
            range: 1,
            description: '흡혈로 체력을 회복하는 유닛'
        },
        {
            id: 'lich',
            name: '리치',
            icon: '👻',
            cost: 160,
            hp: 120,
            attack: 28,
            defense: 15,
            speed: 5,
            range: 3,
            description: '강력한 암흑 마법을 사용하는 최상급 언데드'
        }
    ]
};

// Magic Spells
const SPELLS = {
    human: [
        {
            id: 'heal',
            name: '치유',
            icon: '💚',
            cost: 30,
            cooldown: 15,
            description: '아군 유닛의 체력 회복',
            effect: { type: 'heal', value: 50 }
        },
        {
            id: 'berserk',
            name: '광폭화',
            icon: '💢',
            cost: 40,
            cooldown: 20,
            description: '아군의 공격력 증가',
            effect: { type: 'buff_attack', value: 1.5, duration: 10 }
        },
        {
            id: 'shield',
            name: '보호막',
            icon: '🛡️',
            cost: 35,
            cooldown: 18,
            description: '아군의 방어력 증가',
            effect: { type: 'buff_defense', value: 2.0, duration: 12 }
        }
    ],
    elf: [
        {
            id: 'arrow_rain',
            name: '화살 폭격',
            icon: '🌧️',
            cost: 50,
            cooldown: 25,
            description: '범위 공격 마법',
            effect: { type: 'area_damage', value: 40, radius: 100 }
        },
        {
            id: 'swift',
            name: '질주',
            icon: '💨',
            cost: 30,
            cooldown: 15,
            description: '이동속도 대폭 증가',
            effect: { type: 'buff_speed', value: 2.0, duration: 8 }
        },
        {
            id: 'nature_blessing',
            name: '자연의 축복',
            icon: '🍀',
            cost: 45,
            cooldown: 20,
            description: '모든 능력치 소폭 증가',
            effect: { type: 'buff_all', value: 1.3, duration: 15 }
        }
    ],
    undead: [
        {
            id: 'dark_bolt',
            name: '암흑 화살',
            icon: '⚡',
            cost: 40,
            cooldown: 12,
            description: '강력한 단일 공격',
            effect: { type: 'damage', value: 80 }
        },
        {
            id: 'plague',
            name: '역병',
            icon: '☠️',
            cost: 60,
            cooldown: 30,
            description: '적 전체에 지속 피해',
            effect: { type: 'dot', value: 5, duration: 10 }
        },
        {
            id: 'summon',
            name: '소환',
            icon: '👻',
            cost: 50,
            cooldown: 22,
            description: '스켈레톤 소환',
            effect: { type: 'summon', unitId: 'skeleton', count: 3 }
        },
        {
            id: 'life_drain',
            name: '생명력 흡수',
            icon: '🩸',
            cost: 45,
            cooldown: 18,
            description: '적의 체력을 흡수',
            effect: { type: 'drain', value: 60 }
        }
    ]
};

// Campaign Stages
const CAMPAIGN_STAGES = [
    {
        id: 1,
        name: '첫 번째 전투',
        difficulty: 'easy',
        enemyRace: 'human',
        enemyLevel: 1,
        outposts: 3,
        reward: { gold: 100, exp: 50, gem: 5 },
        unlocked: true
    },
    {
        id: 2,
        name: '숲의 수호자',
        difficulty: 'easy',
        enemyRace: 'elf',
        enemyLevel: 2,
        outposts: 4,
        reward: { gold: 150, exp: 75, gem: 5 },
        unlocked: false
    },
    {
        id: 3,
        name: '어둠의 습격',
        difficulty: 'normal',
        enemyRace: 'undead',
        enemyLevel: 3,
        outposts: 4,
        reward: { gold: 200, exp: 100, gem: 10 },
        unlocked: false
    },
    {
        id: 4,
        name: '요새 공략',
        difficulty: 'normal',
        enemyRace: 'human',
        enemyLevel: 4,
        outposts: 5,
        reward: { gold: 300, exp: 150, gem: 10 },
        unlocked: false
    },
    {
        id: 5,
        name: '엘프 왕국',
        difficulty: 'hard',
        enemyRace: 'elf',
        enemyLevel: 5,
        outposts: 5,
        reward: { gold: 400, exp: 200, gem: 15 },
        unlocked: false
    },
    {
        id: 6,
        name: '언데드 성채',
        difficulty: 'hard',
        enemyRace: 'undead',
        enemyLevel: 6,
        outposts: 6,
        reward: { gold: 500, exp: 300, gem: 20 },
        unlocked: false
    }
];

// Item Types
const ITEM_TYPES = {
    weapon: {
        name: '무기',
        icon: '⚔️',
        statBonus: 'attack'
    },
    armor: {
        name: '방어구',
        icon: '🛡️',
        statBonus: 'defense'
    },
    accessory: {
        name: '장신구',
        icon: '💍',
        statBonus: 'all'
    },
    consumable: {
        name: '소비 아이템',
        icon: '🧪',
        statBonus: 'temp'
    }
};

// Rarity Levels
const RARITIES = {
    1: { name: '일반', color: '#999', multiplier: 1.0 },
    2: { name: '고급', color: '#4ecdc4', multiplier: 1.5 },
    3: { name: '희귀', color: '#a044ff', multiplier: 2.0 },
    4: { name: '영웅', color: '#ffd700', multiplier: 3.0 },
    5: { name: '전설', color: '#ff6b6b', multiplier: 5.0 }
};

// Item class
class Item {
    constructor(type, rarity, level = 1) {
        this.id = Date.now() + Math.random();
        this.type = type;
        this.rarity = rarity;
        this.level = level;
        this.name = this.generateName();
        this.bonus = this.calculateBonus();
    }

    generateName() {
        const prefixes = ['낡은', '평범한', '날카로운', '견고한', '빛나는', '신비한', '전설의'];
        const prefix = prefixes[Math.min(this.rarity, prefixes.length - 1)];
        return `${prefix} ${ITEM_TYPES[this.type].name}`;
    }

    calculateBonus() {
        const base = 10 * this.level;
        return Math.floor(base * RARITIES[this.rarity].multiplier);
    }
}

// Game State class
class GameState {
    constructor() {
        this.selectedRace = null;
        this.gold = 5000;
        this.gem = 50;
        this.level = 1;
        this.exp = 0;
        this.wins = 0;
        this.losses = 0;
        this.units = [];
        this.items = [];
        this.unlockedStages = [1];
        this.survivalRecord = 0;
        this.currentBattle = null;
    }

    selectRace(race) {
        this.selectedRace = race;
        // Give starting units
        const startingUnitTypes = UNIT_TYPES[race].slice(0, 2);
        startingUnitTypes.forEach(unitType => {
            for (let i = 0; i < 3; i++) {
                this.units.push({ ...unitType, id: Date.now() + Math.random() });
            }
        });
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

    addGem(amount) {
        this.gem += amount;
    }

    spendGem(amount) {
        if (this.gem >= amount) {
            this.gem -= amount;
            return true;
        }
        return false;
    }

    addExp(amount) {
        this.exp += amount;
        // Level up check
        const requiredExp = this.level * 100;
        if (this.exp >= requiredExp) {
            this.level++;
            this.exp -= requiredExp;
            return true; // Leveled up
        }
        return false;
    }

    unlockStage(stageId) {
        if (!this.unlockedStages.includes(stageId)) {
            this.unlockedStages.push(stageId);
        }
    }

    getTotalPower() {
        return this.units.reduce((sum, unit) => {
            return sum + (unit.attack + unit.defense + unit.hp / 10);
        }, 0);
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    save() {
        const saveData = {
            selectedRace: this.selectedRace,
            gold: this.gold,
            gem: this.gem,
            level: this.level,
            exp: this.exp,
            wins: this.wins,
            losses: this.losses,
            units: this.units,
            items: this.items,
            unlockedStages: this.unlockedStages,
            survivalRecord: this.survivalRecord
        };
        localStorage.setItem('fantakingSave', JSON.stringify(saveData));
    }

    load() {
        const saveData = localStorage.getItem('fantakingSave');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                Object.assign(this, data);
                return true;
            } catch (e) {
                console.error('Failed to load save:', e);
                return false;
            }
        }
        return false;
    }
}

// Generate random opponents
function generateOpponent(playerLevel) {
    const races = Object.keys(RACES);
    const race = races[Math.floor(Math.random() * races.length)];
    const level = playerLevel + Math.floor(Math.random() * 3) - 1;
    const power = level * 100 + Math.floor(Math.random() * 100);

    const names = [
        '어둠의 군주', '붉은 기사', '얼음 마법사', '불의 전사',
        '그림자 암살자', '빛의 수호자', '폭풍의 왕', '대지의 거인',
        '달빛 궁수', '천둥 술사', '독사의 여왕', '강철 수호자'
    ];

    return {
        name: names[Math.floor(Math.random() * names.length)],
        race: race,
        level: level,
        power: power
    };
}

// Boss data
const RAID_BOSSES = [
    {
        id: 'dragon',
        name: '고대 드래곤',
        icon: '🐉',
        hp: 5000,
        attack: 50,
        level: 10,
        reward: { gold: 1000, gem: 50, itemChance: 0.8 }
    },
    {
        id: 'demon',
        name: '악마 군주',
        icon: '😈',
        hp: 8000,
        attack: 60,
        level: 15,
        reward: { gold: 1500, gem: 75, itemChance: 0.9 }
    },
    {
        id: 'titan',
        name: '고대 타이탄',
        icon: '🗿',
        hp: 12000,
        attack: 70,
        level: 20,
        reward: { gold: 2000, gem: 100, itemChance: 1.0 }
    }
];
