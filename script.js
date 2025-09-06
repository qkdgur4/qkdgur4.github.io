// 타워 디펜스 게임 클래스
class TowerDefenseGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // UI 요소들
        this.resourcesElement = document.getElementById('resources');
        this.livesElement = document.getElementById('lives');
        this.waveElement = document.getElementById('wave');
        this.scoreElement = document.getElementById('score');
        this.speedElement = document.getElementById('speed');
        this.gameStatusElement = document.getElementById('game-status');
        this.gameOverlay = document.getElementById('game-overlay');
        this.towerShop = document.getElementById('tower-shop');
        this.shopToggleBtn = document.getElementById('shop-toggle');
        this.speedBtn = document.getElementById('speed-btn');
        
        // 게임 설정
        this.canvasWidth = 500;
        this.canvasHeight = 400;
        this.gridSize = 20;
        
        // 게임 상태
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = 1;
        this.speedMultiplier = 1;
        this.speedLevels = [1, 2, 3, 4, 5]; // 1x, 2x, 3x, 4x, 5x
        this.currentSpeedIndex = 0;
        this.resources = 1000;
        this.lives = 20;
        this.score = 0;
        this.currentWave = 1;
        this.maxWaves = 10;
        
        // 게임 객체들
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.towerPositions = this.generateTowerPositions();
        this.path = this.generatePath();
        
        // 선택된 타워 타입
        this.selectedTowerType = null;
        this.selectedTower = null;
        
        // 상점 상태
        this.shopCollapsed = false;
        
        // 웨이브 설정
        this.waveEnemies = [];
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 2000; // 2초마다 적 스폰
        
        // 타워 타입 정의
        this.towerTypes = {
            basic: { cost: 50, damage: 10, range: 60, fireRate: 1000, color: '#3498db' },
            heavy: { cost: 120, damage: 25, range: 80, fireRate: 1500, color: '#e67e22' },
            magic: { cost: 200, damage: 40, range: 100, fireRate: 2000, color: '#9b59b6' }
        };
        
        // 이벤트 리스너 등록
        this.setupEventListeners();
        
        // 게임 루프 시작
        this.gameLoop();
    }
    
    setupEventListeners() {
        // 캔버스 클릭 이벤트
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameRunning) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.handleCanvasClick(x, y);
        });
        
        // 타워 상점 클릭 이벤트
        document.querySelectorAll('.tower-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const towerType = item.dataset.towerType;
                this.selectTowerType(towerType);
            });
        });
        
        // 버튼 이벤트
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('overlay-start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('upgrade-btn').addEventListener('click', () => {
            this.upgradeTower();
        });
        
        document.getElementById('sell-btn').addEventListener('click', () => {
            this.sellTower();
        });
        
        // 상점 토글 버튼
        this.shopToggleBtn.addEventListener('click', () => {
            this.toggleShop();
        });
        
        // 배속 버튼
        this.speedBtn.addEventListener('click', () => {
            this.toggleSpeed();
        });
    }
    
    generateTowerPositions() {
        // 타워를 건설할 수 있는 위치들
        return [
            { x: 150, y: 150 },
            { x: 200, y: 120 },
            { x: 300, y: 140 },
            { x: 350, y: 110 },
            { x: 400, y: 160 },
            { x: 150, y: 250 },
            { x: 250, y: 280 },
            { x: 350, y: 260 }
        ];
    }
    
    generatePath() {
        // 적이 이동할 경로 (베지어 곡선)
        return [
            { x: 70, y: 200 },
            { x: 150, y: 180 },
            { x: 250, y: 200 },
            { x: 350, y: 200 },
            { x: 450, y: 200 },
            { x: 500, y: 220 },
            { x: 550, y: 200 }
        ];
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameOverlay.style.display = 'none';
        this.gameStatusElement.textContent = '게임 진행 중';
        this.startWave();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        this.gameStatusElement.textContent = this.gamePaused ? '일시정지' : '게임 진행 중';
    }
    
    startWave() {
        // 웨이브별 적 생성
        const enemyCount = 5 + this.currentWave * 2;
        this.waveEnemies = [];
        
        // 일반 적들 생성
        for (let i = 0; i < enemyCount; i++) {
            this.waveEnemies.push({
                x: this.path[0].x,
                y: this.path[0].y,
                pathIndex: 0,
                health: 50 + this.currentWave * 10,
                maxHealth: 50 + this.currentWave * 10,
                speed: 1 + this.currentWave * 0.2,
                reward: 10 + this.currentWave * 2,
                isBoss: false,
                size: 8
            });
        }
        
        // 보스몹 추가 (5웨이브마다, 또는 마지막 웨이브)
        if (this.currentWave % 5 === 0 || this.currentWave === this.maxWaves) {
            this.waveEnemies.push({
                x: this.path[0].x,
                y: this.path[0].y,
                pathIndex: 0,
                health: 200 + this.currentWave * 50,
                maxHealth: 200 + this.currentWave * 50,
                speed: 0.8 + this.currentWave * 0.1,
                reward: 100 + this.currentWave * 20,
                isBoss: true,
                size: 15,
                bossType: this.currentWave % 5 === 0 ? 'mini' : 'final'
            });
        }
        
        this.enemySpawnTimer = 0;
    }
    
    selectTowerType(towerType) {
        this.selectedTowerType = towerType;
        this.selectedTower = null; // 타워 상점 선택 시 기존 타워 선택 해제
        
        // UI 업데이트
        document.querySelectorAll('.tower-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-tower-type="${towerType}"]`).classList.add('selected');
        
        this.updateTowerActions();
    }
    
    toggleShop() {
        this.shopCollapsed = !this.shopCollapsed;
        
        if (this.shopCollapsed) {
            this.towerShop.classList.add('collapsed');
            this.shopToggleBtn.classList.add('active');
            this.shopToggleBtn.textContent = '🛒';
        } else {
            this.towerShop.classList.remove('collapsed');
            this.shopToggleBtn.classList.remove('active');
            this.shopToggleBtn.textContent = '🛒';
        }
    }
    
    toggleSpeed() {
        // 다음 속도 레벨로 변경
        this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speedLevels.length;
        this.speedMultiplier = this.speedLevels[this.currentSpeedIndex];
        
        // 버튼 텍스트 업데이트
        this.speedBtn.textContent = `🚀 ${this.speedMultiplier}x`;
        
        // UI 업데이트
        this.updateUI();
        
        // 활성 상태 표시
        if (this.speedMultiplier > 1) {
            this.speedBtn.classList.add('active');
        } else {
            this.speedBtn.classList.remove('active');
        }
    }
    
    handleCanvasClick(x, y) {
        // 먼저 타워 선택 시도
        const tower = this.findTowerAt(x, y);
        if (tower) {
            this.selectTower(tower);
            this.selectedTowerType = null; // 타워 선택 시 건설 모드 해제
            return;
        }
        
        // 타워가 선택되지 않았고 건설 모드인 경우
        if (this.selectedTowerType) {
            const position = this.findNearestTowerPosition(x, y);
            if (position && this.canBuildTower(position)) {
                this.buildTower(position, this.selectedTowerType);
            }
        } else {
            // 아무것도 선택되지 않은 경우
            this.selectedTower = null;
            this.updateTowerActions();
        }
    }
    
    findNearestTowerPosition(x, y) {
        let nearest = null;
        let minDistance = Infinity;
        
        this.towerPositions.forEach(pos => {
            const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (distance < minDistance && distance < 30) {
                minDistance = distance;
                nearest = pos;
            }
        });
        
        return nearest;
    }
    
    canBuildTower(position) {
        const towerType = this.towerTypes[this.selectedTowerType];
        return this.resources >= towerType.cost && !this.isPositionOccupied(position);
    }
    
    isPositionOccupied(position) {
        return this.towers.some(tower => 
            tower.x === position.x && tower.y === position.y
        );
    }
    
    buildTower(position, towerType) {
        const type = this.towerTypes[towerType];
        this.resources -= type.cost;
        
        this.towers.push({
            x: position.x,
            y: position.y,
            type: towerType,
            level: 1,
            damage: type.damage,
            range: type.range,
            fireRate: type.fireRate,
            lastFireTime: 0,
            color: type.color
        });
        
        this.updateUI();
    }
    
    findTowerAt(x, y) {
        return this.towers.find(tower => {
            const distance = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
            return distance < 20;
        });
    }
    
    selectTower(tower) {
        this.selectedTower = tower;
        this.updateTowerActions();
        
        // 타워 상점에서 선택 해제
        document.querySelectorAll('.tower-item').forEach(item => {
            item.classList.remove('selected');
        });
    }
    
    updateTowerActions() {
        const upgradeBtn = document.getElementById('upgrade-btn');
        const sellBtn = document.getElementById('sell-btn');
        
        if (this.selectedTower) {
            upgradeBtn.disabled = false;
            sellBtn.disabled = false;
            
            // 업그레이드 비용 표시
            const upgradeCost = this.towerTypes[this.selectedTower.type].cost * this.selectedTower.level;
            upgradeBtn.textContent = `업그레이드 (${upgradeCost})`;
            
            // 판매 가격 표시
            const sellPrice = Math.floor(this.towerTypes[this.selectedTower.type].cost * this.selectedTower.level * 0.7);
            sellBtn.textContent = `판매 (${sellPrice})`;
        } else {
            upgradeBtn.disabled = true;
            sellBtn.disabled = true;
            upgradeBtn.textContent = '업그레이드';
            sellBtn.textContent = '판매';
        }
    }
    
    upgradeTower() {
        if (!this.selectedTower) return;
        
        const upgradeCost = Math.floor(this.towerTypes[this.selectedTower.type].cost * 0.5 * this.selectedTower.level);
        
        if (this.resources >= upgradeCost) {
            this.resources -= upgradeCost;
            this.selectedTower.level++;
            this.selectedTower.damage += Math.floor(this.towerTypes[this.selectedTower.type].damage * 0.3);
            this.selectedTower.range += 15;
            this.updateUI();
            this.updateTowerActions(); // 업그레이드 후 버튼 텍스트 업데이트
        }
    }
    
    sellTower() {
        if (!this.selectedTower) return;
        
        const sellPrice = this.towerTypes[this.selectedTower.type].cost * this.selectedTower.level * 0.7;
        this.resources += Math.floor(sellPrice);
        
        this.towers = this.towers.filter(tower => tower !== this.selectedTower);
        this.selectedTower = null;
        this.updateTowerActions();
        this.updateUI();
    }
    
    updateUI() {
        this.resourcesElement.textContent = this.resources;
        this.livesElement.textContent = this.lives;
        this.waveElement.textContent = `${this.currentWave}/${this.maxWaves}`;
        this.scoreElement.textContent = this.score;
        this.speedElement.textContent = `${this.speedMultiplier}x`;
    }
    
    gameLoop() {
        if (this.gameRunning && !this.gamePaused) {
        this.update();
        }
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.updateEnemies();
        this.updateTowers();
        this.updateProjectiles();
        this.checkWaveComplete();
        this.checkGameOver();
    }
    
    updateEnemies() {
        // 적 스폰
        if (this.waveEnemies.length > 0 && this.enemySpawnTimer >= this.enemySpawnInterval) {
            const newEnemy = this.waveEnemies.shift();
            this.enemies.push(newEnemy);
            
            // 보스몹 등장 시 특별 효과
            if (newEnemy.isBoss) {
                this.showBossAlert(newEnemy);
            }
            
            this.enemySpawnTimer = 0;
        } else {
            this.enemySpawnTimer += 16 * this.gameSpeed * this.speedMultiplier;
        }
        
        // 적 이동
        this.enemies.forEach(enemy => {
            if (enemy.pathIndex < this.path.length - 1) {
                const target = this.path[enemy.pathIndex + 1];
                const dx = target.x - enemy.x;
                const dy = target.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < enemy.speed) {
                    enemy.pathIndex++;
                } else {
                    enemy.x += (dx / distance) * enemy.speed * this.speedMultiplier;
                    enemy.y += (dy / distance) * enemy.speed * this.speedMultiplier;
                }
            } else {
                // 골에 도달
                this.lives--;
                this.enemies = this.enemies.filter(e => e !== enemy);
                this.updateUI();
            }
        });
    }
    
    updateTowers() {
        this.towers.forEach(tower => {
            // 가장 가까운 적 찾기
            let target = null;
            let minDistance = tower.range;
            
            this.enemies.forEach(enemy => {
                const distance = Math.sqrt((enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    target = enemy;
                }
            });
            
            // 공격 (100% 명중 - 투사체 없이 직접 데미지)
            if (target && Date.now() - tower.lastFireTime >= tower.fireRate) {
                // 투사체 생성 (시각적 효과용)
                this.projectiles.push({
                    x: tower.x,
                    y: tower.y,
                    targetX: target.x,
                    targetY: target.y,
                    damage: tower.damage,
                    speed: 8,
                    hit: false
                });
                
                // 즉시 데미지 적용 (100% 명중 보장)
                target.health -= tower.damage;
                if (target.health <= 0) {
                    this.resources += target.reward;
                    this.score += target.reward * 10;
                    this.enemies = this.enemies.filter(e => e !== target);
                    this.updateUI();
                }
                
                tower.lastFireTime = Date.now();
            }
        });
    }
    
    updateProjectiles() {
        this.projectiles.forEach((projectile, index) => {
            const dx = projectile.targetX - projectile.x;
            const dy = projectile.targetY - projectile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < projectile.speed) {
                // 투사체가 목표에 도달
                projectile.hit = true;
                this.projectiles.splice(index, 1);
            } else {
                // 투사체 이동 (시각적 효과만)
                projectile.x += (dx / distance) * projectile.speed * this.speedMultiplier;
                projectile.y += (dy / distance) * projectile.speed * this.speedMultiplier;
            }
        });
    }
    
    checkWaveComplete() {
        if (this.enemies.length === 0 && this.waveEnemies.length === 0) {
            this.currentWave++;
            if (this.currentWave <= this.maxWaves) {
                this.startWave();
            } else {
                this.gameWin();
            }
        }
    }
    
    checkGameOver() {
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gameStatusElement.textContent = '게임 오버';
        this.showGameOverMessage('게임 오버!', `최종 점수: ${this.score}`);
    }
    
    gameWin() {
        this.gameRunning = false;
        this.gameStatusElement.textContent = '승리!';
        this.showGameOverMessage('승리!', `모든 웨이브를 클리어했습니다! 최종 점수: ${this.score}`);
    }
    
    showBossAlert(boss) {
        // 중세풍 보스몹 등장 알림
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #8B0000, #4B0082);
            color: #FFD700;
            padding: 25px 50px;
            border: 4px solid #FFD700;
            border-radius: 15px;
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            z-index: 1000;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
            animation: bossAlert 2s ease-in-out;
            font-family: 'Times New Roman', serif;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        `;
        
        const bossType = boss.bossType === 'final' ? '🐉 드래곤 보스' : '⚔️ 오크 전사';
        alertDiv.innerHTML = `
            <div style="font-size: 36px; margin-bottom: 10px;">${bossType}</div>
            <div style="font-size: 20px;">등장!</div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // 3초 후 제거
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }
    
    showGameOverMessage(title, message) {
        const overlay = this.gameOverlay;
        const messageDiv = overlay.querySelector('.game-message');
        messageDiv.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
            <button id="restart-btn" class="game-btn">다시 시작</button>
        `;
        overlay.style.display = 'flex';
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    restartGame() {
        this.resources = 1000;
        this.lives = 20;
        this.score = 0;
        this.currentWave = 1;
        this.speedMultiplier = 1;
        this.currentSpeedIndex = 0;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.selectedTower = null;
        this.selectedTowerType = null;
        this.gameOverlay.style.display = 'none';
        this.speedBtn.textContent = '🚀 1x';
        this.speedBtn.classList.remove('active');
        this.updateUI();
        this.updateTowerActions();
    }
    
    render() {
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // 배경 그리드
        this.drawGrid();
        
        // 경로 그리기
        this.drawPath();
        
        // 타워 그리기
        this.towers.forEach(tower => {
            this.drawTower(tower);
        });
        
        // 적 그리기
        this.enemies.forEach(enemy => {
            this.drawEnemy(enemy);
        });
        
        // 투사체 그리기
        this.projectiles.forEach(projectile => {
            this.drawProjectile(projectile);
        });
        
        // 타워 건설 위치 표시
        if (this.selectedTowerType) {
            this.drawTowerPositions();
        }
        
        // 선택된 타워 범위 표시
        if (this.selectedTower) {
            this.drawTowerRange(this.selectedTower);
        }
    }
    
    drawGrid() {
        // 중세풍 배경 - 들판
        this.ctx.fillStyle = '#228B22'; // 녹색 들판
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // 들판 패턴
        this.ctx.strokeStyle = '#32CD32';
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.2;
        
        for (let x = 0; x < this.canvasWidth; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasHeight);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvasHeight; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasWidth, y);
            this.ctx.stroke();
        }
        
        // 중세풍 장식 - 나무들
        this.drawDecorativeTrees();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawDecorativeTrees() {
        // 배경 나무들
        const trees = [
            { x: 50, y: 50, size: 8 },
            { x: 450, y: 80, size: 10 },
            { x: 100, y: 350, size: 6 },
            { x: 400, y: 320, size: 9 }
        ];
        
        trees.forEach(tree => {
            // 나무 줄기
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(tree.x - 2, tree.y - tree.size, 4, tree.size);
            
            // 나무 잎
            this.ctx.fillStyle = '#228B22';
            this.ctx.beginPath();
            this.ctx.arc(tree.x, tree.y - tree.size - 3, tree.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawPath() {
        // 중세 길 - 돌길
        this.ctx.strokeStyle = '#696969';
        this.ctx.lineWidth = 12;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        this.ctx.stroke();
        
        // 길 중앙선
        this.ctx.strokeStyle = '#A9A9A9';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // 스폰 포인트 - 악마의 문
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(this.path[0].x - 20, this.path[0].y - 20, 40, 40);
        
        // 문 프레임
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(this.path[0].x - 20, this.path[0].y - 20, 40, 40);
        
        // 문 손잡이
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(this.path[0].x + 10, this.path[0].y, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 악마 표시
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('👹', this.path[0].x, this.path[0].y + 5);
        
        // 골 포인트 - 성문
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(this.path[this.path.length - 1].x - 20, this.path[this.path.length - 1].y - 20, 40, 40);
        
        // 성문 장식
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.path[this.path.length - 1].x - 20, this.path[this.path.length - 1].y - 20, 40, 40);
        
        // 성문 문양
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('🏰', this.path[this.path.length - 1].x, this.path[this.path.length - 1].y + 5);
    }
    
    drawTower(tower) {
        const x = tower.x;
        const y = tower.y;
        const size = 15;
        const isSelected = tower === this.selectedTower;
        
        // 선택된 타워는 황금 빛 효과
        if (isSelected) {
            this.ctx.shadowColor = '#f39c12';
            this.ctx.shadowBlur = 10;
        }
        
        // 타워 타입별 중세풍 디자인
        if (tower.type === 'basic') {
            this.drawBasicTower(x, y, size, tower.level);
        } else if (tower.type === 'heavy') {
            this.drawHeavyTower(x, y, size, tower.level);
        } else if (tower.type === 'magic') {
            this.drawMagicTower(x, y, size, tower.level);
        }
        
        // 선택된 타워 표시
        if (isSelected) {
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = '#f39c12';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(x, y, size + 5, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }
    
    drawBasicTower(x, y, size, level) {
        // 기본 타워 - 중세 망루
        this.ctx.fillStyle = '#8B4513'; // 갈색
        this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
        
        // 지붕
        this.ctx.fillStyle = '#DC143C'; // 진한 빨강
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size - 5);
        this.ctx.lineTo(x - size - 2, y - size);
        this.ctx.lineTo(x + size + 2, y - size);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 창문
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(x - 3, y - 3, 6, 6);
        
        // 깃발
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(x + size - 2, y - size - 3, 4, 3);
        
        // 레벨 표시
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(level.toString(), x, y + 3);
    }
    
    drawHeavyTower(x, y, size, level) {
        // 강화 타워 - 중세 성채
        this.ctx.fillStyle = '#696969'; // 회색
        this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
        
        // 성벽
        this.ctx.fillStyle = '#A9A9A9';
        this.ctx.fillRect(x - size - 2, y - size - 2, size * 2 + 4, 4);
        this.ctx.fillRect(x - size - 2, y + size - 2, size * 2 + 4, 4);
        this.ctx.fillRect(x - size - 2, y - size - 2, 4, size * 2 + 4);
        this.ctx.fillRect(x + size - 2, y - size - 2, 4, size * 2 + 4);
        
        // 탑
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(x - 4, y - size - 8, 8, 8);
        
        // 지붕
        this.ctx.fillStyle = '#8B0000';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size - 12);
        this.ctx.lineTo(x - 6, y - size - 8);
        this.ctx.lineTo(x + 6, y - size - 8);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 레벨 표시
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(level.toString(), x, y + 3);
    }
    
    drawMagicTower(x, y, size, level) {
        // 마법 타워 - 마법사 탑
        this.ctx.fillStyle = '#4B0082'; // 보라색
        this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
        
        // 마법 구체
        this.ctx.fillStyle = '#9370DB';
        this.ctx.beginPath();
        this.ctx.arc(x, y - size - 5, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 마법 빛 효과
        this.ctx.strokeStyle = '#FF69B4';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y - size - 5, 8, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 별 모양 장식
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('★', x, y - size - 2);
        
        // 레벨 표시
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.fillText(level.toString(), x, y + 3);
    }
    
    drawEnemy(enemy) {
        if (enemy.isBoss) {
            this.drawBossEnemy(enemy);
        } else {
            this.drawNormalEnemy(enemy);
        }
    }
    
    drawNormalEnemy(enemy) {
        const x = enemy.x;
        const y = enemy.y;
        const size = enemy.size;
        
        // 고블린 몬스터
        this.ctx.fillStyle = '#228B22'; // 녹색 몸체
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 고블린 귀
        this.ctx.fillStyle = '#32CD32';
        this.ctx.beginPath();
        this.ctx.arc(x - size/2, y - size/2, size/3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y - size/2, size/3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 고블린 눈
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(x - size/3, y - size/4, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + size/3, y - size/4, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 고블린 이빨
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x - 1, y + size/3, 2, 3);
        this.ctx.fillRect(x + 1, y + size/3, 2, 3);
        
        // 테두리
        this.ctx.strokeStyle = '#006400';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 체력 바
        this.drawHealthBar(x, y - 15, 16, 4, enemy.health, enemy.maxHealth, '#c0392b', '#27ae60');
    }
    
    drawBossEnemy(enemy) {
        const x = enemy.x;
        const y = enemy.y;
        const size = enemy.size;
        
        if (enemy.bossType === 'final') {
            // 최종 보스 - 드래곤
            this.drawDragonBoss(x, y, size);
        } else {
            // 미니 보스 - 오크 전사
            this.drawOrcBoss(x, y, size);
        }
        
        // 보스 체력 바
        this.drawHealthBar(x, y - 25, 30, 6, enemy.health, enemy.maxHealth, '#c0392b', '#f39c12');
    }
    
    drawDragonBoss(x, y, size) {
        // 드래곤 몸체
        this.ctx.fillStyle = '#8B0000'; // 진한 빨강
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 드래곤 날개
        this.ctx.fillStyle = '#DC143C';
        this.ctx.beginPath();
        this.ctx.arc(x - size, y - size/2, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + size, y - size/2, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 드래곤 눈
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(x - size/3, y - size/3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + size/3, y - size/3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 드래곤 이빨
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x - 2, y + size/2, 4, 4);
        this.ctx.fillRect(x + 2, y + size/2, 4, 4);
        
        // 불꽃 효과
        this.ctx.fillStyle = '#FF4500';
        this.ctx.beginPath();
        this.ctx.arc(x + size + 3, y, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 테두리
        this.ctx.strokeStyle = '#4B0000';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // 보스 표시
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DRAGON', x, y + size + 12);
    }
    
    drawOrcBoss(x, y, size) {
        // 오크 몸체
        this.ctx.fillStyle = '#556B2F'; // 올리브 그린
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 오크 갑옷
        this.ctx.fillStyle = '#696969';
        this.ctx.fillRect(x - size/2, y - size/2, size, size/2);
        
        // 오크 헬멧
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(x - size/2, y - size, size, size/2);
        
        // 오크 눈
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(x - size/4, y - size/3, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + size/4, y - size/3, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 오크 이빨
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x - 1, y + size/3, 2, 4);
        this.ctx.fillRect(x + 1, y + size/3, 2, 4);
        
        // 무기 (도끼)
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + size - 2, y - size/2, 6, 2);
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(x + size + 2, y - size/2, 3, 2);
        
        // 테두리
        this.ctx.strokeStyle = '#2F4F4F';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // 보스 표시
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ORC', x, y + size + 12);
    }
    
    drawHealthBar(x, y, width, height, current, max, bgColor, fillColor) {
        const healthPercent = current / max;
        
        // 배경
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(x - width/2, y, width, height);
        
        // 체력
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(x - width/2, y, width * healthPercent, height);
        
        // 테두리
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - width/2, y, width, height);
    }
    
    drawProjectile(projectile) {
        const x = projectile.x;
        const y = projectile.y;
        
        // 화살 모양 투사체
        this.ctx.fillStyle = '#8B4513'; // 갈색 화살대
        this.ctx.fillRect(x - 1, y - 4, 2, 8);
        
        // 화살촉
        this.ctx.fillStyle = '#C0C0C0'; // 은색 화살촉
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 6);
        this.ctx.lineTo(x - 2, y - 4);
        this.ctx.lineTo(x + 2, y - 4);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 화살 깃털
        this.ctx.fillStyle = '#FFD700'; // 금색 깃털
        this.ctx.fillRect(x - 1, y + 2, 2, 3);
        
        // 화살 궤적 효과
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);
        this.ctx.beginPath();
        this.ctx.moveTo(x - 3, y - 3);
        this.ctx.lineTo(x + 3, y + 3);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawTowerPositions() {
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.globalAlpha = 0.7;
        
        this.towerPositions.forEach(pos => {
            if (!this.isPositionOccupied(pos)) {
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    drawTowerRange(tower) {
        this.ctx.strokeStyle = tower.color;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.globalAlpha = 0.5;
        
        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
        this.ctx.globalAlpha = 1;
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TowerDefenseGame();
});