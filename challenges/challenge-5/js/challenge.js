import { startIntro } from '/challenges/common/js/storyline.js';
import { setupEventListeners, triggerStartGame, initializeGameParameters, startTimer, endGame } from '/challenges/common/js/game-mechanics.js';
import { showPlayerNumberInput, isPlayerNumberValid } from '/challenges/common/js/player-input.js';
import * as GAME from '/challenges/common/js/game-variables.js';
import { getScore, setScore, isGameOver, setGameOver, getTimerInterval, setTimerInterval } from '/challenges/common/js/game-variables.js';
import { getPlayerImage } from './players.js';

const gameId = "challenge-5";

const storyTitles = ["Storyline", "Challenge"];

// Specific storyline
const storylineText = [
  "The handover phase is long gone...Your floor is empty. Desks abandoned. Monitors unplugged. The great migration has begun. With your rocket launcher slung over your shoulder and a box of tangled cables in hand, you set out to conquer the uncharted lands of...another office floor. But this is no end...just the beginning of new, bizarre challenges ahead.",
  "Aliens are blocking the exits, asteroids are crashing through the ceiling, and the elevator’s out—again! Only one way out: survive five relentless waves of extreme chaos. Thankfully, Master Chef’s snacks drop from the rubble—bite-sized miracles to restore your HP. Make it to the end and the Game Master will finally show their face...just in time for dessert!"
];

// Specific game elements
const scoreDisplay = document.getElementById('score-display');
const canvas = document.getElementById("game-container-canvas");
const ctx = canvas.getContext("2d");

// Specific game sounds
let backgroundMusic = null;
const gameStartSound = document.getElementById('game-start-sound');
const gameWave2StartSound = document.getElementById('game-start-sound-wave-2');
const gameWave3StartSound = document.getElementById('game-start-sound-wave-3');
const gameWave4StartSound = document.getElementById('game-start-sound-wave-4');
const gameWave5StartSound = document.getElementById('game-start-sound-wave-5');
const gameWaveSounds = [ gameStartSound, gameWave2StartSound, gameWave3StartSound, gameWave4StartSound, gameWave5StartSound ];
const playerLaserSound = document.getElementById('player-laser-sound');
const enemyLaserSound = document.getElementById('enemy-laser-sound');
const bossLaserSound = document.getElementById('boss-laser-sound');
const spaceshipHit = document.getElementById('spaceship-hit-sound');
const shieldHitSound = document.getElementById('shield-hit-sound');
const shieldExplosionSound = document.getElementById('shield-explosion-sound');
const spaceshipExplosionSound = document.getElementById('spaceship-explosion-sound');
const asteroidExplosionSound = document.getElementById('asteroid-explosion-sound');
const boostPickUpSound = document.getElementById('boost-pick-up-sound');
const rocketEngineSound = document.getElementById('rocket-engine-sound');

// Specific game mechanics variables
let startTime = 30;
let isPaused = false;

// Set canvas size (reduce the scale of the canvas)
canvas.width = 600;
canvas.height = 400;

const playerImage = new Image();
playerImage.src = "./assets/img/player.png";

const player = {
  img: playerImage,
  x: canvas.width / 2 - 20,
  y: canvas.height - 40,
  width: 30,
  height: 30,
  speed: 5,
  hp: 100,
  maxHP: 100,
  damage: 10,
  hit: false,
  hitTimer: 0,
  shield: 100,
  maxShield: 100,
  isShieldActive: false,
  wasShieldApplied: false,
  shieldHitTimer: 0,
  pulseTimer: 0,
  hasDoubleGun: false,
};

let playerPortrait = new Image();
let playerBase64Img = getPlayerImage('player');
if (playerBase64Img) playerPortrait.src = playerBase64Img;

const playerBarHeight = 100;
const playerBarWidth = 10;

let canShoot = true;
let shootCooldown = 200;

let propulsorFrame = 0;
let propulsorTimer = 0;
let isPropulsorActive = false;
const propulsorFrames = [];
for (let i = 1; i <= 3; i++) {
  const img = new Image();
  img.src = `./assets/img/propulsor-${i}.png`;
  propulsorFrames.push(img);
}

// Preload all images before starting the game
let imagesLoaded = false;
const allImages = [playerImage, ...propulsorFrames];

allImages.forEach(img => {
  img.onload = () => {
    imagesLoaded = allImages.every(img => img.complete);
  };
});

// Track the screen shake state
let screenShake = {
  x: 0,
  y: 0,
  duration: 0,
  intensity: 10
};

const explosionFrames = [];
for (let i = 1; i <= 4; i++) {
  const img = new Image();
  img.src = `./assets/img/explosion-${i}.png`;
  explosionFrames.push(img);
}

let stars = [];
let playerBullets = [];
let enemies = [];
let enemyBullets = [];
let explosions = [];
let asteroids = [];
let boss = null;
let bossPortrait = new Image();
let isBossActive = false;
let isBossDefeated = false;
let gameState = "intro"; // 'intro', 'spawning', 'running', 'boss', 'end'
let currentWave = 1;
let nextWaveIsBoss = false;
let waveStartTime = 0;
const waveIntroTextDuration = 3000;

let boosters = [];
const boosterTypes = [
  { type: "hp-pizza-slice", img: "./assets/img/hp-pizza-slice.png", effect: () => player.hp = Math.min(player.hp + 10, player.maxHP) },
  { type: "hp-pizza",       img: "./assets/img/hp-pizza.png",       effect: () => player.hp = Math.min(player.hp + 20, player.maxHP) },
  { type: "hp-50",          img: "./assets/img/hp-50.png",          effect: () => player.hp = Math.min(player.hp + 50, player.maxHP) },
  { type: "hp-heart",       img: "./assets/img/hp-heart.png",       effect: () => player.hp = player.maxHP },
  { type: "hp-shield",      img: "./assets/img/hp-shield.png",      effect: () => { player.shield = player.maxShield; player.isShieldActive = true; player.wasShieldApplied = true; } },
  { type: "double-gun",     img: "./assets/img/double-gun.png",     effect: () => player.hasDoubleGun = true }
];

const waveScoreThresholds = {
  1: 10, //250,
  2: 10, //500, 
  3: 10, //750,
  4: 10, //1000,
};

// Specific game mechanics intervals
let gameInterval;
let keysInterval;
let waveInterval = null;
let asteroidInterval = null;
let animationFrame;

// Specific game key controls
const keys = {};

window.onload = showPlayerNumberInput(startIntro, storylineText,storyTitles);

// Call the setup function
setupEventListeners({
  playerNumberSelect: GAME.playerNumberSelect,
  beginChallengeButton: GAME.beginChallengeButton,
  isPlayerNumberValid,
  startIntro,
  storylineText,
  storyTitles,
  homeButton: GAME.homeButton,
});

// Specific game player selector (for this game there is not a player selector)
function handleShapeSelection() {
  // Hide player selector and show game
  instructionsPopup.style.display = 'none';
  GAME.gameContainer.style.display = 'block';

  // Start the game
  startGame();
}

// Call the reusable function with custom shape selection logic
triggerStartGame(GAME.startGameButton, handleShapeSelection);

function startGame() {
  // Initialize common game state logic
  initializeGameParameters(GAME, startTime);
  // Initialize specific game state logic
  initializeGameSpecificParameters();

  // Start timer countdown
  setTimerInterval(
    startTimer(
      getTimerInterval(),
      startTime,
      GAME.timerDisplay, 
      GAME.countdownSound, 
      GAME.countdownFastSound,
      gameId,
      GAME, 
      getGameOptions()
    )
  );
}

function initializeGameSpecificParameters(){
  // Start game loops
  gameInterval = setInterval(updateGameState, 20);

  // Start animation loop
  animationFrame = requestAnimationFrame(renderGame);

  // Update UI
  scoreDisplay.textContent = `Score: ${getScore()}`;

  // Reset game state
  resetGameState();

  // Generate random stars (background stars)
  createStars(100);

  gameState = 'intro';
  waveStartTime = 0;

  // Set up keyboard listeners
  setupControls();
}

function resetGameState() {
  startTime = 30;
  
  // Reset player
  player.x = canvas.width / 2 - 20;
  player.y = canvas.height - 40;;
  player.hp = player.maxHP;
  player.damage = 10;
  player.hit = false;
  player.hitTimer = 0;
  player.shield = player.maxShield;
  player.isShieldActive = false;
  player.wasShieldApplied = false;
  player.shieldHitTimer = 0;
  player.pulseTimer = 0;
  player.hasDoubleGun = false;
  
  // Reset boss
  if (boss) {
  boss.x = canvas.width / 2 - 40;
  boss.y = -100;
  boss.speed = 2;
  boss.hp = boss.maxHP;
  boss.damage = 30;
  boss.hit = false;
  boss.hitTimer = 0;
  boss.shield = boss.maxShield;
  boss.isShieldActive = true;
  boss.shieldHitTimer = 0;
  boss.shieldBreakTimer = 0;
  boss.pulseTimer = 0;
  boss.isCharging = false;
  boss.chargeStart = 0;
  boss.lastChargeTime = 0;
  boss.rageMode = false;
  }

  // Reset game elements
  stars = [];
  playerBullets = [];
  enemies = [];
  enemyBullets = [];
  explosions = [];
  asteroids = [];
  boss = null;
  isBossActive = false;
  isBossDefeated = false;

  // Reset wave/progression
  currentWave = 1;
  nextWaveIsBoss = false;
  waveStartTime = 0;
  if (waveInterval) clearInterval(waveInterval);
  if (asteroidInterval) clearInterval(asteroidInterval);
  waveInterval = null;
  asteroidInterval = null;

  // Reset UI or other flags
  gameState = "intro";
  isPaused = false;
}

function setupControls() { 
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  function checkKeys() {
      // Don't process inputs if game is paused or not in active state
      if (isPaused || gameState === 'intro' || gameState === 'end' || gameState === 'gameOver') return;

      // Horizontal movement
      if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
      }
      if (keys['ArrowRight'] && player.x + player.width < canvas.width) {
        player.x += player.speed;
      }

      // Vertical movement
      if (keys['ArrowDown'] && player.y + player.height < canvas.height) {
        player.y += player.speed;
      }

      if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
        if (!isPropulsorActive) {
          isPropulsorActive = true;
          playSound(rocketEngineSound, 0.5);
        }
      }
    }
  
  keysInterval = setInterval(checkKeys, 20);
}

function handleKeyDown(e) {
  keys[e.key] = true;

  // Pause toggle
  if (e.key === 'p' || e.key === 'P') {
    isPaused = !isPaused;
    if (backgroundMusic) {
      isPaused ? backgroundMusic.pause() : backgroundMusic.play();
    }
  }

  // Shoot (spacebar or "Space" code)
  if ((e.key === ' ' || e.code === 'Space') && canShoot) {
    // Don't process inputs if game is paused or not in active state
    if (isPaused || gameState === 'intro' || gameState === 'end' || gameState === 'gameOver') return;

    shootPlayerBullet();
    if (!isPaused) playSound(playerLaserSound, 0.5);
    canShoot = false;
    setTimeout(() => canShoot = true, shootCooldown);
  }
}

function handleKeyUp(e) {
  keys[e.key] = false;

  // Variable jump height
  if ((e.key === ' ' || e.key === 'ArrowUp') && player.y > 0) {
    player.velocityY = -3;
  }

  // Reset propulsor if ArrowUp was released
  if (e.key === 'ArrowUp') {
    isPropulsorActive = false;
    propulsorFrame = 0;
    rocketEngineSound.pause();
  }
}

function updateGameState() {
  if (isGameOver()) return;
  if (!isPaused) update();
  updateEnemyShooting();
}

function renderGame() {
  if (isGameOver()) return;

  // Continue animation loop
  animationFrame = requestAnimationFrame(renderGame);
  draw();
}

function createStars(numStars) {
  stars.length = 0;
  for (let i = 0; i < numStars; i++) {
    const size = Math.random() < 0.8
      ? Math.random() * 0.6 + 0.2     // 80% are very small
      : Math.random() * 1 + 0.4;      // 20% are slightly larger, still modest

    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: size,
      glow: Math.random() < 0.15,     // Glow chance reduced to 15%
      sharp: Math.random() < 0.2      // 20% cross-shaped
    });
  }
}

// Function to draw the stars
function drawStars() {
  stars.forEach(star => {
    if (star.glow) {
      ctx.shadowColor = "white";
      ctx.shadowBlur = 8;
    } else {
      ctx.shadowBlur = 0;
    }

    if (star.sharp) {
      // Cross/starburst
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(star.x - star.size, star.y);
      ctx.lineTo(star.x + star.size, star.y);
      ctx.moveTo(star.x, star.y - star.size);
      ctx.lineTo(star.x, star.y + star.size);
      ctx.stroke();
    } else {
      // Round star
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0; // Reset glow
  });
}

function moveStars() {
  if (isBossDefeated) return;
  stars.forEach(star => {
    star.y += star.size * 0.5;  // Smaller stars move slower
    // Recycle star to top when it goes off the screen
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}

// Function to spawn a new enemy spaceship
function spawnEnemy() {
  if (isPaused || boss) return;

  switch (currentWave) {
    case 1:
      spawnAlienEnemy(); break;
    case 2:
      spawnEasyEnemy(); break;
    case 3:
      spawnMediumEnemy(); break;
    case 4:
      spawnHardEnemy(); break;
    default:
      spawnHardEnemy(); break; // fallback to hard if wave > 4
  }
}

function spawnCustomEnemy(config) {
  const enemyImage = new Image();
  enemyImage.src = config.imgSrc;

  const enemy = {
    img: enemyImage,
    x: Math.random() * (canvas.width - config.width),
    y: -30,
    width: config.width,
    height: config.height,
    speed: config.baseSpeed + Math.random() * config.speedRange,
    hp: config.hp,
    maxHP: config.hp,
    damage: config.damage,
    points: config.points,
    laserColor: config.laserColor,
    laserGlow: config.laserGlow,
    hit: false,
    hitTimer: 10
  };

  enemies.push(enemy);
}

function spawnAlienEnemy() {
  spawnCustomEnemy({
    imgSrc: "./assets/img/enemy-alien.png",
    width: 35,
    height: 30,
    baseSpeed: 0.2,
    speedRange: 0.8,
    hp: 10,
    damage: 10,
    points: 10,
    laserColor: "green",
    laserGlow: 5
  });
}

function spawnEasyEnemy() {
  spawnCustomEnemy({
    imgSrc: "./assets/img/enemy-easy.png",
    width: 35,
    height: 40,
    baseSpeed: 0.5,
    speedRange: 0.8,
    hp: 20,
    damage: 20,
    points: 20,
    laserColor: "yellow",
    laserGlow: 10
  });
}

function spawnMediumEnemy() {
  spawnCustomEnemy({
    imgSrc: "./assets/img/enemy-medium.png",
    width: 40,
    height: 45,
    baseSpeed: 0.7,
    speedRange: 0.8,
    hp: 30,
    damage: 30,
    points: 30,
    laserColor: "orange",
    laserGlow: 15
  });
}

function spawnHardEnemy() {
  spawnCustomEnemy({
    imgSrc: "./assets/img/enemy-hard.png",
    width: 35,
    height: 45,
    baseSpeed: 0.9,
    speedRange: 0.8,
    hp: 40,
    damage: 40,
    points: 40,
    laserColor: "red",
    laserGlow: 20
  });
}

// Function to move the enemies down slowly into the screen
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;

    // If enemy is visible, it might shoot
    if (enemy.y > 0 && enemy.y < canvas.height) {
      if (Math.random() < 0.005) {
        enemyBullets.push({
          x: enemy.x + enemy.width / 2 - 2,
          y: enemy.y + enemy.height,
          width: 4,
          height: 10,
          damage: enemy.damage || 5,
          laserColor: enemy.laserColor,
          laserGlow: enemy.laserGlow
        });
        playSound(enemyLaserSound, 0.5);
      }
    }

    // Remove enemy if it goes off the bottom of the screen
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
      //console.log("Enemy left the screen and was removed.");
    }
  });
}

// Draw player spaceship
function drawPlayer() {
  if (player.hit) {
    ctx.shadowColor = "red";
    ctx.shadowBlur = 20;
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
  ctx.shadowBlur = 0;
}

// Draw player bullets (lasers)
function drawPlayerBullets() {
  playerBullets.forEach((bullet, index) => {
     ctx.shadowColor = bullet.color;
     ctx.shadowBlur = bullet.glow;
     ctx.fillStyle = bullet.color;

     if (!isPaused) bullet.y -= 7;  // Move the bullet upwards
     ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

     // Remove bullet if it goes off screen
     if (bullet.y < 0) {
       playerBullets.splice(index, 1);
     }
  });

  ctx.shadowBlur = 0;
}

// Draw enemy spaceships
function drawEnemies() {
  enemies.forEach((enemy) => {
    if (enemy.hit) {
      ctx.shadowColor = "red";
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowBlur = 0;
    }
      
    ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.shadowBlur = 0;
  });
}

// Draw enemy bullets (lasers)
function drawEnemyBullets() {
  enemyBullets.forEach((bullet, index) => {
    if (!isBossActive) {
      ctx.shadowColor = bullet.laserColor;
      ctx.shadowBlur = bullet.laserGlow;
      ctx.fillStyle = bullet.laserColor;
    }

    if (!isPaused) bullet.y += 5;  // Move the bullet downwards
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    // Remove bullet if it goes off screen
    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
    }
  });

  enemyBullets.forEach((bullet) => {
    // Check if it's a boss bullet and draw it in red, but adding an extra yellow effect
    if (isBossActive && boss && bullet.fromBoss) {
      ctx.shadowColor = "yellow";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "yellow";

      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

      // Boss laser color is red
      ctx.shadowColor = boss.laserColor;
      ctx.shadowBlur = boss.laserGlow;
      ctx.fillStyle = boss.laserColor;

      if (bullet.aimed && !isPaused) {
        bullet.x += bullet.velocityX;
        bullet.y += bullet.velocityY;
      } else if (bullet.wave && !isPaused) {
        bullet.angle += 0.1;
        bullet.y += bullet.speed;
        bullet.x = bullet.baseX + Math.sin(bullet.angle) * 40;
      } else if (bullet.homing && !isPaused) {
        const dx = player.x + player.width / 2 - bullet.x;
        const dy = player.y + player.height / 2 - bullet.y;
        const desiredAngle = Math.atan2(dy, dx);
        const turnRate = 0.05;
      
        bullet.angle += turnRate * (desiredAngle - bullet.angle);
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
      } else {
        if (!isPaused) bullet.y += 5;  // Move the bullet downwards
      }

      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
  });

  ctx.shadowBlur = 0;  // Reset shadow for any future objects
}

function drawFinalBoss() {
  if (isBossActive && boss) {
    if (boss.hit) {
      ctx.shadowColor = "red";
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowBlur = 0;
    }
    
    ctx.drawImage(boss.img, boss.x, boss.y, boss.width, boss.height);
    ctx.shadowBlur = 0;
  }
}

// Check for collisions between bullets, enemies, player, asteroids, etc
function checkCollision() {
  checkFinalBossCollisions();
  checkPlayerBulletsCollisions();
  checkEnemyCollisions();
  checkAsteroidCollisions();
}

function checkFinalBossCollisions() {
  if (!isBossActive || !boss) return;

  playerBullets.forEach((bullet, bi) => {
    if (!isBossActive || !boss) return;

    // Check if bullet hits the boss (considering shield)
    const isBulletInsideShield = bullet.x < boss.x + boss.width &&
                                 bullet.x + bullet.width > boss.x &&
                                 bullet.y < boss.y + boss.height &&
                                 bullet.y + bullet.height > boss.y;

    if (isBulletInsideShield) {
      // If the shield is active and has health
      if (boss.isShieldActive && boss.shield > 0) {
        playerBullets.splice(bi, 1);   // Remove bullet upon hitting shield
        boss.shield -= bullet.damage;  // Reduce shield health
        //console.log(`Player hit boss shield. Reduced ${bullet.damage}hp. Boss shield hp: ${boss.shield}`);

        // Trigger visual impact (flash and pulse effects)
        boss.shieldHitTimer = 15;  // Flash effect duration (frames)
        boss.pulseTimer = 5;       // Pulse effect duration (frames)

        playSound(shieldHitSound, 0.5);

        // If the shield is depleted, deactivate the shield and trigger shield break animation
        if (boss.shield <= 0) {
          boss.shield = 0;
          boss.isShieldActive = false;
          boss.shieldBreakTimer = 30;  // Trigger the shield break animation
          playSound(shieldExplosionSound, 0.5);
          //console.log("Boss shield is destroyed!");
        }
      }
      // If the shield is not active, or shield health is 0, hit the boss
      else {
        playerBullets.splice(bi, 1);  // Remove bullet upon hitting boss
        boss.hp -= bullet.damage;     // Reduce boss health
        //console.log(`Player hit boss. Reduced ${bullet.damage}hp. Boss hp: ${boss.hp}`);
        playSound(spaceshipHit, 0.5);
        triggerScreenShake();

        // Trigger hit effect
        boss.hit = true;
        boss.hitTimer = 10;

        // If the boss is defeated
        if (boss.hp <= 0) {
          explosions.push({
            x: boss.x,
            y: boss.y,
            width: boss.width,
            height: boss.height,
            frame: 0,
            timer: 0
          });

          // Boss is defeated
          setScore(getScore() + boss.points);
          scoreDisplay.textContent = `Score: ${getScore()}`;

          if (!player.wasShieldApplied) {
            setScore(getScore() + 250);
            scoreDisplay.textContent = `Score: ${getScore()}`;
          }

          if (!player.hasDoubleGun) {
            setScore(getScore() + 250);
            scoreDisplay.textContent = `Score: ${getScore()}`;
          }

          //console.log("Boss defeated!");
          //console.log("Player got " + boss.points + " points");
          //console.log("Player score: " + score);
          isBossDefeated = true;
          isBossActive = false;
          boss = null;
          gameState = 'end';
        }
      }
    }
  });
}

function checkPlayerBulletsCollisions() {
  // Check player bullets collisions with enemies
  playerBullets.forEach((bullet, bi) => {
    enemies.forEach((enemy, ai) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.hp -= bullet.damage;
        //console.log("Player hit enemy. Reduced " + bullet.damage + "hp. Enemy hp: " + enemy.hp);

        if (enemy.hp <= 0) {
          playSound(spaceshipExplosionSound, 1);
          explosions.push({
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height,
            frame: 0,
            timer: 0
          });
  
          // Enemy is defeated
          setScore(getScore() + enemy.points);
          scoreDisplay.textContent = `Score: ${getScore()}`;
          //console.log("Enemy defeated!");
          //console.log("Player got " + enemy.points + " points");
          //console.log("Player score: " + score);
          // Remove enemy
          enemies.splice(ai, 1);
        } else {
          // Trigger hit effect
          enemy.hit = true;
          enemy.hitTimer = 10;
          playSound(spaceshipHit, 0.5);
        }

        // Remove bullet
        playerBullets.splice(bi, 1);
        triggerScreenShake();
      }
    });
  });
}

function checkEnemyCollisions() {
  // Check enemy bullet collisions with player
  enemyBullets.forEach((bullet, bi) => {
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      // Player got hit by enemy
      damagePlayer(bullet.damage);
      enemyBullets.splice(bi, 1);  // Remove bullet after hitting player
      playSound(spaceshipHit, 0.5);
      triggerScreenShake();
    }
  });

  // Check enemy collision with player
  enemies.forEach((enemy, ai) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      // Player collides with enemy, player loses HP
      damagePlayer(enemy.damage);
      triggerScreenShake();
    }
  });

}

function checkAsteroidCollisions() {
  // Asteroid vs player
  asteroids.forEach((asteroid, ai) => {
    if (
      player.x < asteroid.x + asteroid.width &&
      player.x + player.width > asteroid.x &&
      player.y < asteroid.y + asteroid.height &&
      player.y + player.height > asteroid.y
    ) {
      damagePlayer(asteroid.damage); // heavy hit
      asteroids.splice(ai, 1);       // asteroid gone on impact
      triggerScreenShake();
      return; // skip further checks
    }

  // Asteroid vs player bullets
  playerBullets.forEach((bullet, bi) => {
    if (
      bullet.x < asteroid.x + asteroid.width &&
      bullet.x + bullet.width > asteroid.x &&
      bullet.y < asteroid.y + asteroid.height &&
      bullet.y + bullet.height > asteroid.y
    ) {
      asteroid.hits++;
      playerBullets.splice(bi, 1);

      if (asteroid.hits >= asteroid.maxHits) {
        //console.log("Player destroyed asteroid.");
        playSound(asteroidExplosionSound, 0.5);

        // Trigger explosion animation
        explosions.push({
          x: asteroid.x,
          y: asteroid.y,
          width: asteroid.width,
          height: asteroid.height,
          frame: 0,
          timer: 0,
          type: "asteroid"
        });

        spawnHpBoost(asteroid);  // Calculate probability for asteroid to drop hp boost
        asteroids.splice(ai, 1); // Remove asteroid
      }
    }
  });
 });
}

function getAsteroidMaxHits(wave) {
  if (wave <= 2) return 1;
  if (wave <= 4) return 2;
  return 3;
}

function drawExplosions() {
  explosions.forEach((explosion, index) => {
    let img = explosionFrames[explosion.frame];
    ctx.drawImage(img, explosion.x, explosion.y, explosion.width, explosion.height);

    explosion.timer++;
    if (explosion.timer >= 6) {
      explosion.frame++;
      explosion.timer = 0;
    }

    const maxFrames = explosionFrames.length;
    if (explosion.frame >= maxFrames) {
      explosions.splice(index, 1);
    }
  });
}

function spawnHpBoost(asteroid) {
  if (isPaused) return;

  // Drop chance increases with wave
  const targetHeight = 32;
  const dropChance = Math.min(0.2 + currentWave * 0.05, 1); // 20% base, +5%/wave, max 90%
  const randomDrop = Math.random();
  if (randomDrop < dropChance) {
    //console.log("HP Boost loaded!");
    const boosterData = getGeneratedHpBooster();
    // If no valid booster (null), do not spawn anything
    if (!boosterData) return;
    const img = new Image();
    img.src = boosterData.img;
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const scaledWidth = targetHeight * aspectRatio;
      boosters.push({
        ...boosterData,
        x: asteroid.x,
        y: asteroid.y,
        speed: 1.5,
        width: scaledWidth,
        height: targetHeight,
        imgObj: img
      });
    };
  }
}

function getGeneratedHpBooster() {
  const hpRatio = player.maxHP > 0 ? Math.min(Math.max(player.hp / player.maxHP, 0), 1) : 1;
  const isAtFullHealth = player.hp >= player.maxHP;
  const extraShieldWeight = Math.max(0, Math.round((1 - hpRatio) * 5));
  const weightedBoosters = [];

  // Only add HP-related boosters if not at full health
  if (!isAtFullHealth) {
    const extraHP50Weight = Math.max(0, Math.round((1 - hpRatio) * 3));
    const extraFullHPWeight = Math.max(0, Math.round((1 - hpRatio) * 4));

    weightedBoosters.push(
      boosterTypes[0], // slice
      boosterTypes[1], // pizza,
      ...Array(extraHP50Weight).fill(boosterTypes[2]),
      ...Array(extraFullHPWeight).fill(boosterTypes[3])
    );
  }
    
  // Add shield only if not owned and wave is 4 or greater
  if (!player.isShieldActive && currentWave >= 4) {
    weightedBoosters.push(
      ...Array(extraShieldWeight).fill(boosterTypes[4])
    );
  }

  // Add double gun only if not owned and wave is 3 or greater
  if (!player.hasDoubleGun && currentWave >= 3) {
    weightedBoosters.push(...Array(3).fill(boosterTypes[5])); // Higher weight
  }

  // If there is a chance to get a boost but is not applicable to player at the moment due to previous logic
  if (weightedBoosters.length === 0) {
    return null;
  }

  const boostItemIndex = Math.floor(Math.random() * weightedBoosters.length);
  const boosterData = weightedBoosters[boostItemIndex];
  //console.log("Boost data length: " + weightedBoosters.length + " | Boost data index: " + boostItemIndex + " | Boost Data: " + boosterData.type);
  return boosterData;
}

function damagePlayer(damage) {
  // When player is hit and shield is active
  if (player.isShieldActive && player.shield > 0) {
    player.shield -= damage;
    player.shieldHitTimer = 10;
    playSound(shieldHitSound, 0.5);
    //console.log("Player shield suffered " + damage + "damage. Player shield: " + player.shield);

    // Subtract overflow damage from HP
    if (player.shield <= 0) {
      player.shield = 0;
      player.hp += player.shield;
      player.isShieldActive = false;
      player.shieldBreakTimer = 30;
      //console.log("Player shield is destroyed!");
      isPlayedHpDepleted();
    }
  } else {
    // When player is hit and shield is inactive
    player.hp -= damage;
    isPlayedHpDepleted();

    // Trigger hit effect
    player.hit = true;
    player.hitTimer = 10;  // Frames or ticks the effect lasts (~10 frames)
    playSound(spaceshipHit, 0.5);

    //if (player.hp > 0) console.log("Player suffered " + damage + " damage. Player hp: " + player.hp);
  }

}

function isPlayedHpDepleted() {
  if (player.hp <= 0) {
    player.hp = 0;
    playSound(spaceshipExplosionSound, 0.5);
    //console.log("Player HP depleted and ship was destroyed!");
    gameState = 'gameOver';
    setGameOver(true);
    gameOver(false);
  }
}

function drawPlayerHPBar() { 
  const x = canvas.width - playerBarWidth - 10;
  const y = canvas.height - playerBarHeight - 10;

  // Bar Background
  ctx.fillStyle = "#444";
  ctx.fillRect(x, y, playerBarWidth, playerBarHeight);

  // Bar Border
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, playerBarWidth, playerBarHeight);

  // HP Bar
  const hpHeight = (player.hp / player.maxHP) * playerBarHeight;
  if (player.hp > 75) ctx.fillStyle = "#00ff00";
  else if (player.hp > 50) ctx.fillStyle = "yellow";
  else if (player.hp > 25) ctx.fillStyle = "orange";
  else ctx.fillStyle = "red";
  ctx.fillRect(x, y + (playerBarHeight - hpHeight), playerBarWidth, hpHeight);

  // Shield Bar
  if (player.isShieldActive && player.shield > 0) {
    const shieldHeight = (player.shield / player.maxShield) * playerBarHeight;
    ctx.fillStyle = "cyan";
    ctx.fillRect(x, y + (playerBarHeight - shieldHeight), playerBarWidth, shieldHeight);
  }
}

function drawPlayerPortrait() {
  // Portrait image
  const padding = 10;
  const portraitSize = 32; // square box

  const x = canvas.width - playerBarWidth - padding;
  const y = canvas.height - playerBarHeight - padding;

  const portraitX = x - portraitSize - 8;
  const portraitY = y + playerBarHeight - portraitSize; // align bottom of portrait with bottom of bar

  // === Draw portrait border box ===
  ctx.fillStyle = "#222"; // Background fill inside the box
  ctx.fillRect(portraitX, portraitY, portraitSize, portraitSize);

  ctx.strokeStyle = "#444";
  ctx.lineWidth = 3;
  ctx.strokeRect(portraitX, portraitY, portraitSize, portraitSize);

  if (playerPortrait  && playerPortrait.complete && playerPortrait.naturalWidth !== 0) {
    ctx.drawImage(playerPortrait, portraitX, portraitY, portraitSize, portraitSize);
  }
}

function drawPlayerShield() {
  if (player.isShieldActive) {
    // Draw shield outline
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 200, 255, 0.5)";  // Outline of the shield
    ctx.lineWidth = 2;
    ctx.arc(
      player.x + player.width / 2,
      player.y + player.height / 2,
      player.width - 8,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Add color fill inside the circle (semi-transparent)
    ctx.beginPath();
    ctx.arc(
      player.x + player.width / 2,
      player.y + player.height / 2,
      player.width - 10,  // Slightly smaller radius to leave space for the stroke
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(0, 200, 255, 0.3)"; // Light blue with transparency
    ctx.fill();

    // Visual Impact (Flash Effect)
    if (player.shieldHitTimer > 0) {
      // Smooth Flash effect when hit
      const flashAlpha = Math.sin(player.shieldHitTimer * 0.3) * 0.3 + 0.4;  // Smooth fade-in/fade-out effect
      ctx.beginPath();
      ctx.arc(
        player.x + player.width / 2,
        player.y + player.height / 2,
        player.width - 10,
        0,
        Math.PI * 2
      );
      // Soft cyan flash color with dynamic opacity
      ctx.fillStyle = `rgba(0, 255, 255, ${flashAlpha})`;
      ctx.fill();
      player.shieldHitTimer--;  // Reduce timer
    }

    // Visual Impact (Pulse Effect)
    if (player.pulseTimer > 0) {
      // Pulse effect (slightly scale the shield)
      const pulseScale = 1 + Math.sin(player.pulseTimer * 0.3) * 0.05; // Pulse scale effect
      ctx.beginPath();
      ctx.arc(
        player.x + player.width / 2,
        player.y + player.height / 2,
        (player.width - 10) * pulseScale,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(0, 200, 255, 0.3)";
      ctx.fill();
      player.pulseTimer--;
    }

    // Shield break effect: When shield is destroyed
    if (!player.isShieldActive && player.shieldBreakTimer > 0) {
      const breakEffectAlpha = Math.sin(player.shieldBreakTimer * 0.5) * 0.4 + 0.6;
      ctx.beginPath();
      ctx.arc(
        player.x + player.width / 2,
        player.y + player.height / 2,
        player.width - 10,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(255, 0, 255, ${breakEffectAlpha})`;  // Cracks in the shield (purple)
      ctx.lineWidth = 2;
      ctx.stroke();
      player.shieldBreakTimer--;
    }
  }
}

function drawFinalBossHPBar() {
  // Draw hp bars
  if (isBossActive && boss) {
    // Boss HP Bar
    ctx.fillStyle = "grey";
    ctx.fillRect(boss.x, boss.y - 8, boss.width, 5);

    ctx.fillStyle = "red";
    const hpWidth = (boss.hp / boss.maxHP) * boss.width;
    ctx.fillRect(boss.x, boss.y - 8, hpWidth, 5);

    // Boss Shield Bar
    ctx.fillStyle = "rgba(0, 200, 255, 0.4)";
    ctx.fillRect(boss.x, boss.y - 15, boss.width, 5);
    
    ctx.fillStyle = "cyan";
    const shieldWidth = (boss.shield / boss.maxShield) * boss.width;
    ctx.fillRect(boss.x, boss.y - 15, shieldWidth, 5);
  }
}

function drawFinalBossPortrait() {
  if (isBossActive && boss) {
    // Portrait image
    if (bossPortrait && bossPortrait.complete && bossPortrait.naturalWidth !== 0) {
      ctx.drawImage(bossPortrait, boss.x + 25, boss.y - 45, 30, 30);
    }
  }
}

function drawFinalBossShield() {
  if (isBossActive && boss && boss.isShieldActive) {
    // Draw shield outline
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 200, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.arc(
      boss.x + boss.width / 2,
      boss.y + boss.height / 2,
      boss.width - 5,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Add color fill inside the circle (semi-transparent)
    ctx.beginPath();
    ctx.arc(
      boss.x + boss.width / 2,
      boss.y + boss.height / 2,
      boss.width - 10,  // Slightly smaller radius to leave space for the stroke
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(0, 200, 255, 0.3)"; // Light blue with transparency
    ctx.fill();

    // Visual Impact (Flash Effect)
    if (boss.shieldHitTimer > 0) {
      // Smooth Flash effect when hit
      const flashAlpha = Math.sin(boss.shieldHitTimer * 0.3) * 0.3 + 0.4;  // Smooth fade-in/fade-out effect
      ctx.beginPath();
      ctx.arc(
        boss.x + boss.width / 2,
        boss.y + boss.height / 2,
        boss.width - 10,
        0,
        Math.PI * 2
      );
      // Soft cyan flash color with dynamic opacity
      ctx.fillStyle = `rgba(0, 255, 255, ${flashAlpha})`;
      ctx.fill();
      boss.shieldHitTimer--;  // Reduce timer
    }

    // Visual Impact (Pulse Effect)
    if (boss.pulseTimer > 0) {
      // Pulse effect (slightly scale the shield)
      const pulseScale = 1 + Math.sin(boss.pulseTimer * 0.3) * 0.05; // Pulse scale effect
      ctx.beginPath();
      ctx.arc(
        boss.x + boss.width / 2,
        boss.y + boss.height / 2,
        (boss.width - 10) * pulseScale,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(0, 200, 255, 0.3)";  // Same color as shield fill
      ctx.fill();
      boss.pulseTimer--;  // Reduce timer
    }

    // Shield break effect: When shield is destroyed
    if (!boss.isShieldActive && boss.shieldBreakTimer > 0) {
      const breakEffectAlpha = Math.sin(boss.shieldBreakTimer * 0.5) * 0.4 + 0.6;
      ctx.beginPath();
      ctx.arc(
        boss.x + boss.width / 2,
        boss.y + boss.height / 2,
        boss.width - 10,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(255, 0, 255, ${breakEffectAlpha})`;  // Cracks in the shield (purple)
      ctx.lineWidth = 2;
      ctx.stroke();
      boss.shieldBreakTimer--;
    }
  }
}

function triggerScreenShake() {
  screenShake.duration = 15;
  screenShake.intensity = 10;
}

// Update the game state
function update() {
  if (isPaused || !imagesLoaded || isBossDefeated) return;

  applyPlayerPropulsorAnimation();
  applyHitBehavior();

  // Update other elements
  moveStars();
  moveEnemies();
  moveAsteroids();
  moveFinalBoss();
  moveBoosters();
  checkCollision();
  checkBounds(); // Make sure this is called last
}

function applyPlayerPropulsorAnimation() {
  // Cycle through propulsor frames
  if (isPropulsorActive) {
    propulsorTimer++;

    if (propulsorTimer >= 6) {  // Change frame every 6 frames
      propulsorFrame++;         // Move to the next propulsor frame
      propulsorTimer = 0;       // Reset the timer
    }

    // Loop back to the first frame if all frames are shown
    if (propulsorFrame >= propulsorFrames.length) {
      propulsorFrame = 0;  // Restart the animation
    }
  }
}

function applyHitBehavior() {
  // Player behavior when hit
  if (player.hit) {
    player.hitTimer--;
    if (player.hitTimer <= 0) {
      player.hit = false;
    }
  }

  // Enemy behavior when hit
  enemies.forEach((enemy) => {
    if (enemy.hit) {
      enemy.hitTimer--;
      if (enemy.hitTimer <= 0) {
        enemy.hit = false;
      }
    }
  });

  // Boss behavior when hit
  if (isBossActive && boss) {
    if (boss.hit) {
      boss.hitTimer--;
      if (boss.hitTimer <= 0) {
        boss.hit = false;
      }
    }
  }
}

// Function to render propulsors with the correct image
function drawPropulsors() {
  // If the player is pressing the up key, draw the propulsor image beneath the player
  if (isPropulsorActive) {
    const propulsorImage = propulsorFrames[propulsorFrame];

    // Draw the propulsor image beneath the player
    ctx.drawImage(
      propulsorImage, 
      player.x + (player.width / 4),  // Center propulsor image horizontally with player
      player.y + player.height,      // Position it just below the player
      player.width / 2,              // Set the width of the propulsor image
      player.height / 2              // Adjust height for propulsor (optional)
    );
  }
}

function moveFinalBoss() {
  if (isBossActive && boss) {
    // Enter the screen
    if (boss.y < 50) {
      boss.y += boss.speed;
    } else {
      // Side to side movement
      boss.x += boss.speed * boss.direction;

      // Reverse direction at edges
      if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
        boss.direction *= -1;
      }

      drawFinalBossBullets();
      chargeAndBurst();
      checkRageMode();
    }
  }
}

function drawFinalBossBullets() {
  if (isPaused) return;

  if (Math.random() < 0.03) {
    const pattern = Math.floor(Math.random() * 6);

    switch (pattern) {
      case 0:
        // Single centered laser
        enemyBullets.push({
          x: boss.x + boss.width / 2 - 3,
          y: boss.y + boss.height,
          width: 6,
          height: 24,
          damage: 30,
          fromBoss: true
        });
        break;
      case 1:
        // Dual side lasers
        enemyBullets.push({
          x: boss.x + boss.width / 4,
          y: boss.y + boss.height,
          width: 6,
          height: 24,
          damage: 30,
          fromBoss: true
        });
        enemyBullets.push({
          x: boss.x + (boss.width * 3) / 4,
          y: boss.y + boss.height,
          width: 6,
          height: 24,
          damage: 30,
          fromBoss: true
        });
        break;
      case 2:
        shootAimedBullet(4);
        break;
      case 3:
        shootSpiralPattern(12, 3);
        playSound(bossLaserSound, 0.5);
        break;
      case 4:
        shootWaveLaser();
        break;
      case 5:
        shootHomingMissile();
        break;
    }
  }
}

function shootAimedBullet(speed = 5) {
  const dx = player.x + player.width / 2 - (boss.x + boss.width / 2);
  const dy = player.y + player.height / 2 - (boss.y + boss.height);
  const angle = Math.atan2(dy, dx);

  const velocityX = Math.cos(angle) * speed;
  const velocityY = Math.sin(angle) * speed;

  enemyBullets.push({
    x: boss.x + boss.width / 2,
    y: boss.y + boss.height,
    width: 8,
    height: 8,
    damage: 35,
    fromBoss: true,
    velocityX,
    velocityY,
    aimed: true
  });
}


function shootSpiralPattern(count = 12, speed = 3) {
  if (!boss.rageMode) return;
  let spiralAngle = 0;

  for (let i = 0; i < count; i++) {
    const angle = spiralAngle + (i * (Math.PI * 2)) / count;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    enemyBullets.push({
      x: boss.x + boss.width / 2,
      y: boss.y + boss.height / 2,
      width: 6,
      height: 6,
      damage: 20,
      fromBoss: true,
      velocityX,
      velocityY,
      aimed: true
    });
  }

  spiralAngle += 0.1; // Slowly rotate the pattern
}

function shootWaveLaser() {
  if (!boss.isShieldActive) return;
  const waveBullet = {
    x: boss.x + boss.width / 2,
    y: boss.y + boss.height,
    width: 6,
    height: 24,
    baseX: boss.x + boss.width / 2,
    angle: 0,
    speed: 3,
    damage: 30,
    fromBoss: true,
    wave: true
  };

  enemyBullets.push(waveBullet);
}

function shootHomingMissile() {
  const angle = Math.atan2(
    player.y - boss.y,
    player.x - boss.x
  );

  enemyBullets.push({
    x: boss.x + boss.width / 2,
    y: boss.y + boss.height,
    width: 10,
    height: 10,
    angle: angle,
    speed: 2,
    homing: true,
    fromBoss: true
  });
}

function chargeAndBurst() {
  if (!boss.rageMode) return;
  const bossOriginalX = boss.x;
  const bossOriginalY = boss.y;
  const cooldown = 5000;
  const now = Date.now();

  // If not charging, rageMode is on, and cooldown has passed
  if (
    boss.rageMode &&
    !boss.isCharging &&
    now - boss.lastChargeTime > cooldown &&
    Math.random() < 0.01 // still a random chance, but now only checked every 5s+
  ) {
    boss.isCharging = true;
    boss.chargeStart = now;
    boss.lastChargeTime = now; // set cooldown timestamp
  }

  if (boss.isCharging) {
    const elapsed = now - boss.chargeStart;

    if (elapsed < 2000) {
      const dx = player.x - boss.x;
      const dy = player.y - boss.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 6;

      if (distance > 5) {
        boss.x += (dx / distance) * speed;
        boss.y += (dy / distance) * speed;
      }
    } else {
        for (let i = 0; i < 2; i++) {
          shootAimedBullet(3 + Math.random() * 2);
        }

        // Reset position after charge
        boss.x = bossOriginalX;
        boss.y = bossOriginalY;

        boss.isCharging = false;
    }
  }
}

function checkRageMode() {
  // Activate boss rage mode if hp is at 50%
  if (!boss.rageMode && boss.hp <= boss.maxHP / 2) {
    boss.rageMode = true;
    boss.laserColor = "magenta"; // change visuals
    boss.laserGlow = 50;
  }
}

// Update enemy shooting behavior
function updateEnemyShooting() {
  if (isPaused) return;

  enemies.forEach((enemy) => {
    if (Math.random() < 0.005) {  // Reduced chance for enemies to shoot
      enemyBullets.push({
        x: enemy.x + enemy.width / 2 - 2,  // Centered horizontally
        y: enemy.y + enemy.height,         // Just below the enemy spaceship
        width: 4,
        height: 10,
        damage: enemy.damage || 5,
        fromBoss: false,
        laserColor: enemy.laserColor, 
        laserGlow: enemy.laserGlow
      });
      playSound(enemyLaserSound, 0.5);
    }
  });
}

function checkBounds() {
  // Clamp player position to canvas
  player.x = Math.min(Math.max(player.x, 0), canvas.width - player.width);
  player.y = Math.min(Math.max(player.y, 0), canvas.height - player.height);

  // Clamp enemies (optional, helps prevent edge clipping too)
  enemies.forEach(enemy => {
    enemy.x = Math.min(Math.max(enemy.x, 0), canvas.width - enemy.width);
    //enemy.y = Math.min(Math.max(enemy.y, 0), canvas.height - enemy.height);
  });
}

// Draw everything on the canvas
function draw() {
  if (isGameOver()) return;

  // Save the current canvas state (before shake)
  ctx.save();

  // Apply screen shake effect
  if (screenShake.duration > 0) {
    const dx = Math.random() * screenShake.intensity * 2 - screenShake.intensity;
    const dy = Math.random() * screenShake.intensity * 2 - screenShake.intensity;
    ctx.translate(dx, dy);
    screenShake.duration--;
  }

  // Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw game elements (with possible shake)
  drawStars();

  // Apply game logic, depending on game state
  if (gameState != 'gameOver') {
    drawPlayer();
    drawPlayerHPBar();
    drawPlayerPortrait();
    drawPlayerShield();
  }

  if (gameState != 'end' && gameState != 'gameOver') {
    drawPropulsors();
    drawPlayerBullets();
  }

  if (gameState === 'intro') {
    showWaveText();
  }

  if (gameState === 'running' || gameState === 'boss') {
    drawEnemyBullets();
    drawExplosions();
  }
  
  if (gameState === 'running') {
    drawEnemies();
    drawAsteroids();
    drawBoosters();
  }
  
  if (gameState === 'boss') {
    drawAsteroids();
    drawFinalBoss();
  }

  handleGameState();

  ctx.restore(); // Restore canvas state (remove shake)

  // UI elements (health bar, etc.) without shake
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform (no scale or shake)

  if (gameState === 'boss') {
    drawFinalBossHPBar();
    drawFinalBossPortrait();
    drawFinalBossShield();
  }

  ctx.restore();

  // show paused overlay if the game is paused
  if (isPaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.fillStyle = "#fff";
    ctx.font = "22px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Game Paused", canvas.width / 2, canvas.height / 2);
  }
}

function handleGameState() {
  if (gameState === 'intro') {
    if (waveStartTime === 0) {
      waveStartTime = Date.now();
      playWaveSound();
    } else if (Date.now() - waveStartTime >= waveIntroTextDuration) {
      if (nextWaveIsBoss) {
        spawnFinalBoss();
        startAsteroids();
        isBossActive = true;
        player.damage = 5;
        gameState = 'boss';
      } else {
        createEnemiesWave();
        startAsteroids();
        gameState = 'running';
      }
    }
  }

  if (gameState === 'running') {
    // Transition to next wave if conditions are met
    if (!isBossActive && getScore() >= waveScoreThresholds[currentWave]) {
      clearAllElements();
      currentWave++;
      if (currentWave > 4) nextWaveIsBoss = true;
      waveStartTime = 0;
      gameState = 'intro'; // Go to wave intro
    }
  }

  if (gameState === 'boss') player.damage = 5;
  if (gameState === 'end' || gameState === 'gameOver' ) {
    clearAllElements()
    gameOver(true);
  }
}

function createEnemiesWave() {
  const enemiesPerSpawn = currentWave + 1; // e.g., Wave 1 = 2 enemies, Wave 4 = 5 enemies
  const spawnRate = Math.max(3000 - currentWave * 100, 500); // faster spawns each wave

  waveInterval = setInterval(() => {
    for (let i = 0; i < enemiesPerSpawn; i++) {
      spawnEnemy();
    }
  }, spawnRate);
}

function startAsteroids() {
  const asteroidsPerSpawn = Math.floor((currentWave + 1) / 2); 
  const spawnRate = Math.max(3000 - currentWave * 100, 1000);

  asteroidInterval = setInterval(() => {
    for (let i = 0; i < asteroidsPerSpawn; i++) {
      spawnAsteroid();
    }
  }, spawnRate);
}

function clearAllElements() {
  clearInterval(waveInterval);
  clearInterval(asteroidInterval);
  enemies = [];
  enemyBullets = [];
  asteroids = [];
  playerBullets = [];
  explosions = [];
}

function shootPlayerBullet() {
  if (!player.hasDoubleGun) {
    playerBullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 15,
      damage: player.damage,
      color: "#00ccff",
      glow: 30
    });
  } else {
    playerBullets.push({
      x: player.x + player.width / 2 - 10,
      y: player.y,
      width: 4,
      height: 20,
      damage: player.damage,
      color: "#1e90ff",
      glow: 30,
    });
    playerBullets.push({
      x: player.x + player.width / 2 + 5,
      y: player.y,
      width: 4,
      height: 20,
      damage: player.damage,
      color: "#1e90ff",
      glow: 30
    });
  }
}

function showWaveText() {
  if (waveStartTime > 0 && Date.now() - waveStartTime < waveIntroTextDuration) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "22px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText(nextWaveIsBoss ? "FINAL BOSS" : `WAVE ${currentWave}`, canvas.width / 2, canvas.height / 2);
  }
}

function playWaveSound() {
  // Stop all current wave sounds
  gameWaveSounds.forEach(sound => {
    if (sound && isSoundPlaying(sound)) {
      sound.pause();
      sound.currentTime = 0;
    }
  });

  const index = currentWave - 1;
  const musicElement = gameWaveSounds[index];

  if (musicElement) {
    playSound(musicElement, 1.0);
    backgroundMusic = musicElement;
  }
  else console.warn("No music for wave:", currentWave);
}

function spawnAsteroid() {
  if (isPaused) return;

  const asteroidImages = [new Image(), new Image(), new Image()];
  asteroidImages[0].src = "./assets/img/asteroid-1.png";
  asteroidImages[1].src = "./assets/img/asteroid-2.png";
  asteroidImages[2].src = "./assets/img/asteroid-3.png";

  const maxHits = getAsteroidMaxHits(currentWave);

  asteroids.push({
    img: asteroidImages,
    x: Math.random() * (canvas.width - 30),
    y: -40,
    width: 30,
    height: 30,
    speed: 1 + Math.random() * 1.0,
    damage: 20,
    hits: 0,
    maxHits: maxHits
  });
}

function drawAsteroids() {
  asteroids.forEach(asteroid => {
    const img = asteroid.img[Math.min(asteroid.hits, 2)];
    ctx.drawImage(img, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  });
}

function moveAsteroids() {
  asteroids.forEach((asteroid, index) => {
    asteroid.y += asteroid.speed;

    // Remove if it goes off screen
    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1);
    }
  });
}

function drawBoosters() {
  boosters.forEach(booster => {
    ctx.drawImage(booster.imgObj, booster.x, booster.y, booster.width, booster.height);
  });
}

function moveBoosters() {
  boosters.forEach((booster, i) => {
    booster.y += booster.speed;

    // Collect by player
    if (
      player.x < booster.x + booster.width &&
      player.x + player.width > booster.x &&
      player.y < booster.y + booster.height &&
      player.y + player.height > booster.y
    ) {
      booster.effect(); // Apply effect
      playSound(boostPickUpSound, 0.5);
      boosters.splice(i, 1);
      return;
    }

    // Off screen
    if (booster.y > canvas.height) boosters.splice(i, 1);
  });
}

function spawnFinalBoss() {
  let base64Img = getPlayerImage('player001');
  if (base64Img) bossPortrait.src = base64Img;

  if (!isBossActive) {
    const bossImage = new Image();
    bossImage.src = "./assets/img/final-boss.png";

    boss = {
      img: bossImage,
      x: canvas.width / 2 - 40,
      y: -100,
      width: 80,
      height: 80,
      direction: 1,
      speed: 2,
      hp: 200,
      maxHP: 200,
      damage: 30,
      points: 1000,
      hit: false,
      hitTimer: 0,
      laserColor: "red",
      laserGlow: 30,
      shield: 200,
      maxShield: 200,
      isShieldActive: true,
      shieldHitTimer: 0,
      shieldBreakTimer: 0,
      pulseTimer: 0,
      isCharging: false,
      chargeStart: 0,
      lastChargeTime: 0,
      rageMode: false,
    };
    isBossActive = true;
  }

  // Remove all enemies from screen
  enemies.length = 0;
}

function playSound(element, volume) {
  element.volume = volume;
  element.currentTime = 0;
  element.play().catch(err => {
    console.error("Audio playback failed:", err);
  });
}

function isSoundPlaying(audioElement) {
  return !audioElement.paused && !audioElement.ended && audioElement.currentTime > 0;
}

function gameOver(isVictory) {
  endGame(isVictory, gameId, GAME, getGameOptions());
}

function getGameOptions() {
  return {
    clearIntervals: [gameInterval, keysInterval, waveInterval, asteroidInterval],
    removeEventListeners: [
      { event: 'keydown', handler: handleKeyDown },
      { event: 'keyup', handler: handleKeyUp }
    ]
  };
}

// Retry button functionality
GAME.retryButton.addEventListener('click', () => {
  // Reset game elements
  GAME.gameOverElement.style.display = 'none';
 
  // Restart the game
  startGame();
});