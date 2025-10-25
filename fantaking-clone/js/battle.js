// Battle System

class Battle {
    constructor(stage, playerRace) {
        this.stage = stage;
        this.playerRace = playerRace;
        this.enemyRace = stage.enemyRace;

        // Battle state
        this.isRunning = false;
        this.isPaused = false;
        this.speed = 1;

        // Bases
        this.playerBase = { hp: 1000, maxHp: 1000, x: 5, y: 50 };
        this.enemyBase = { hp: 1000, maxHp: 1000, x: 95, y: 50 };

        // Outposts
        this.outposts = [];
        this.generateOutposts(stage.outposts);

        // Units
        this.playerUnits = [];
        this.enemyUnits = [];

        // Magic
        this.playerMana = 100;
        this.maxMana = 100;
        this.manaRegen = 1; // per second
        this.spellCooldowns = {};

        // Resources
        this.playerGold = 100;
        this.goldPerSecond = 2;

        // Battle timer
        this.battleTime = 0;
        this.lastUpdate = Date.now();

        // Victory conditions
        this.result = null;
    }

    generateOutposts(count) {
        const mapWidth = 90;
        const mapHeight = 100;
        const margin = 15;

        for (let i = 0; i < count; i++) {
            const x = margin + Math.random() * (mapWidth - margin * 2);
            const y = 20 + Math.random() * 60;

            this.outposts.push({
                id: i,
                x: x,
                y: y,
                owner: 'neutral',
                layer: 0, // 0: outer wall, 1: inner wall, 2: core
                maxLayers: 3,
                hp: 100,
                maxHp: 100,
                productionRate: 2, // units per 10 seconds
                productionTimer: 0
            });
        }
    }

    start() {
        this.isRunning = true;
        this.lastUpdate = Date.now();
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    pause() {
        this.isPaused = !this.isPaused;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    gameLoop() {
        if (!this.isRunning) return;

        if (!this.isPaused) {
            const now = Date.now();
            const deltaTime = (now - this.lastUpdate) / 1000 * this.speed;
            this.lastUpdate = now;

            this.update(deltaTime);
            this.checkVictoryConditions();
        }

        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        this.battleTime += deltaTime;

        // Resource generation
        this.playerGold += this.goldPerSecond * deltaTime;
        this.playerMana = Math.min(this.maxMana, this.playerMana + this.manaRegen * deltaTime);

        // Update spell cooldowns
        Object.keys(this.spellCooldowns).forEach(spellId => {
            this.spellCooldowns[spellId] -= deltaTime;
            if (this.spellCooldowns[spellId] <= 0) {
                delete this.spellCooldowns[spellId];
            }
        });

        // Update outposts
        this.outposts.forEach(outpost => {
            if (outpost.owner !== 'neutral' && outpost.layer >= outpost.maxLayers) {
                outpost.productionTimer += deltaTime;

                // Produce units
                if (outpost.productionTimer >= 10 / outpost.productionRate) {
                    outpost.productionTimer = 0;
                    this.spawnUnit(outpost);
                }
            }
        });

        // Update player units
        this.updateUnits(this.playerUnits, this.enemyUnits, 'player', deltaTime);

        // Update enemy units
        this.updateUnits(this.enemyUnits, this.playerUnits, 'enemy', deltaTime);

        // AI for enemy
        if (Math.random() < 0.1 * deltaTime) {
            this.enemyAI();
        }
    }

    updateUnits(friendlyUnits, enemyUnits, side, deltaTime) {
        friendlyUnits.forEach((unit, index) => {
            if (unit.hp <= 0) {
                friendlyUnits.splice(index, 1);
                return;
            }

            // Apply buffs/debuffs
            if (unit.buffs) {
                unit.buffs.forEach((buff, buffIndex) => {
                    buff.duration -= deltaTime;
                    if (buff.duration <= 0) {
                        unit.buffs.splice(buffIndex, 1);
                    }
                });
            }

            // Find target
            let target = this.findNearestTarget(unit, enemyUnits);

            if (!target) {
                // Move towards enemy base
                const enemyBase = side === 'player' ? this.enemyBase : this.playerBase;
                this.moveUnit(unit, enemyBase.x, enemyBase.y, deltaTime);

                // Attack enemy base if in range
                const distToBase = this.getDistance(unit, enemyBase);
                if (distToBase < unit.range * 2) {
                    this.attackBase(unit, enemyBase, deltaTime);
                }
            } else {
                // Move towards target
                const distance = this.getDistance(unit, target);

                if (distance <= unit.range * 2) {
                    // Attack
                    unit.attackCooldown = (unit.attackCooldown || 0) - deltaTime;
                    if (unit.attackCooldown <= 0) {
                        this.attack(unit, target);
                        unit.attackCooldown = 1.0; // 1 second attack cooldown
                    }
                } else {
                    // Move towards target
                    this.moveUnit(unit, target.x, target.y, deltaTime);
                }
            }
        });
    }

    findNearestTarget(unit, enemies) {
        let nearest = null;
        let minDist = Infinity;

        enemies.forEach(enemy => {
            const dist = this.getDistance(unit, enemy);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        });

        return nearest;
    }

    getDistance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    moveUnit(unit, targetX, targetY, deltaTime) {
        const dx = targetX - unit.x;
        const dy = targetY - unit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            const moveSpeed = unit.speed * deltaTime * 2;
            unit.x += (dx / dist) * moveSpeed;
            unit.y += (dy / dist) * moveSpeed;
        }
    }

    attack(attacker, target) {
        const raceBonuses = RACES[attacker.race].bonuses;
        let damage = attacker.attack * (raceBonuses.attack || 1);

        // Apply buffs
        if (attacker.buffs) {
            attacker.buffs.forEach(buff => {
                if (buff.type === 'attack') {
                    damage *= buff.value;
                }
            });
        }

        // Critical hit (for elves)
        if (attacker.race === 'elf' && Math.random() < (raceBonuses.critChance || 0)) {
            damage *= 2;
        }

        // Apply defense
        const defense = target.defense;
        damage = Math.max(1, damage - defense);

        target.hp -= damage;

        // Vampire life steal
        if (attacker.unitId === 'vampire') {
            attacker.hp = Math.min(attacker.maxHp, attacker.hp + damage * 0.3);
        }
    }

    attackBase(unit, base, deltaTime) {
        unit.attackCooldown = (unit.attackCooldown || 0) - deltaTime;
        if (unit.attackCooldown <= 0) {
            base.hp -= unit.attack;
            unit.attackCooldown = 1.0;
        }
    }

    spawnUnit(outpost) {
        const race = outpost.owner === 'player' ? this.playerRace : this.enemyRace;
        const unitTypes = UNIT_TYPES[race];

        // Select random unit type
        const unitType = unitTypes[Math.floor(Math.random() * Math.min(2, unitTypes.length))];

        const unit = {
            ...unitType,
            id: Date.now() + Math.random(),
            race: race,
            unitId: unitType.id,
            x: outpost.x,
            y: outpost.y,
            hp: unitType.hp,
            maxHp: unitType.hp,
            buffs: []
        };

        if (outpost.owner === 'player') {
            this.playerUnits.push(unit);
        } else {
            this.enemyUnits.push(unit);
        }
    }

    captureOutpost(outpost, side) {
        if (outpost.owner === side) {
            // Already owned, increase layer
            if (outpost.layer < outpost.maxLayers) {
                outpost.layer++;
                outpost.hp = outpost.maxHp;
            }
        } else {
            // Attack the outpost
            outpost.hp -= 10;

            if (outpost.hp <= 0) {
                if (outpost.layer > 0) {
                    // Destroy one layer
                    outpost.layer--;
                    outpost.hp = outpost.maxHp;
                } else {
                    // Capture outpost
                    outpost.owner = side;
                    outpost.layer = 0;
                    outpost.hp = outpost.maxHp;
                }
            }
        }
    }

    castSpell(spellId, target) {
        const spell = SPELLS[this.playerRace].find(s => s.id === spellId);

        if (!spell) return false;
        if (this.spellCooldowns[spellId]) return false;
        if (this.playerMana < spell.cost) return false;

        this.playerMana -= spell.cost;
        this.spellCooldowns[spellId] = spell.cooldown;

        // Apply spell effect
        const effect = spell.effect;

        switch (effect.type) {
            case 'heal':
                this.playerUnits.forEach(unit => {
                    unit.hp = Math.min(unit.maxHp, unit.hp + effect.value);
                });
                break;

            case 'buff_attack':
                this.playerUnits.forEach(unit => {
                    if (!unit.buffs) unit.buffs = [];
                    unit.buffs.push({
                        type: 'attack',
                        value: effect.value,
                        duration: effect.duration
                    });
                });
                break;

            case 'buff_defense':
                this.playerUnits.forEach(unit => {
                    if (!unit.buffs) unit.buffs = [];
                    unit.buffs.push({
                        type: 'defense',
                        value: effect.value,
                        duration: effect.duration
                    });
                });
                break;

            case 'buff_speed':
                this.playerUnits.forEach(unit => {
                    if (!unit.buffs) unit.buffs = [];
                    unit.buffs.push({
                        type: 'speed',
                        value: effect.value,
                        duration: effect.duration
                    });
                });
                break;

            case 'damage':
                if (this.enemyUnits.length > 0) {
                    const randomEnemy = this.enemyUnits[Math.floor(Math.random() * this.enemyUnits.length)];
                    randomEnemy.hp -= effect.value;
                }
                break;

            case 'area_damage':
                this.enemyUnits.forEach(unit => {
                    unit.hp -= effect.value;
                });
                break;

            case 'summon':
                const unitType = UNIT_TYPES[this.playerRace].find(u => u.id === effect.unitId);
                for (let i = 0; i < effect.count; i++) {
                    const unit = {
                        ...unitType,
                        id: Date.now() + Math.random() + i,
                        race: this.playerRace,
                        unitId: unitType.id,
                        x: this.playerBase.x + 10,
                        y: this.playerBase.y + Math.random() * 10 - 5,
                        hp: unitType.hp,
                        maxHp: unitType.hp,
                        buffs: []
                    };
                    this.playerUnits.push(unit);
                }
                break;

            case 'drain':
                if (this.enemyUnits.length > 0) {
                    const randomEnemy = this.enemyUnits[Math.floor(Math.random() * this.enemyUnits.length)];
                    randomEnemy.hp -= effect.value;
                    this.playerBase.hp = Math.min(this.playerBase.maxHp, this.playerBase.hp + effect.value);
                }
                break;
        }

        return true;
    }

    enemyAI() {
        // Simple AI: randomly cast spells and capture outposts
        const enemySpells = SPELLS[this.enemyRace];

        if (Math.random() < 0.3 && enemySpells) {
            const randomSpell = enemySpells[Math.floor(Math.random() * enemySpells.length)];
            // Enemy casts spell (simplified, doesn't check mana)
            if (Math.random() < 0.5) {
                // Simulate enemy spell casting
                if (randomSpell.effect.type === 'damage' && this.playerUnits.length > 0) {
                    const randomPlayer = this.playerUnits[Math.floor(Math.random() * this.playerUnits.length)];
                    randomPlayer.hp -= randomSpell.effect.value * 0.5; // Reduced for balance
                }
            }
        }

        // Try to capture neutral outposts
        const neutralOutposts = this.outposts.filter(o => o.owner === 'neutral');
        if (neutralOutposts.length > 0 && this.enemyUnits.length < 10) {
            const randomOutpost = neutralOutposts[Math.floor(Math.random() * neutralOutposts.length)];
            this.captureOutpost(randomOutpost, 'enemy');
        }
    }

    checkVictoryConditions() {
        if (this.playerBase.hp <= 0) {
            this.result = 'defeat';
            this.stop();
        } else if (this.enemyBase.hp <= 0) {
            this.result = 'victory';
            this.stop();
        }
    }

    render() {
        // Rendering is handled by UI
        if (window.updateBattleUI) {
            window.updateBattleUI(this);
        }
    }

    getState() {
        return {
            playerBase: this.playerBase,
            enemyBase: this.enemyBase,
            outposts: this.outposts,
            playerUnits: this.playerUnits,
            enemyUnits: this.enemyUnits,
            playerMana: this.playerMana,
            maxMana: this.maxMana,
            playerGold: this.playerGold,
            spellCooldowns: this.spellCooldowns,
            battleTime: this.battleTime,
            result: this.result
        };
    }
}
