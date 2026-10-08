* =====================================================
   SUPER PINTO JUMPER
   VERSÃO COMPLETA
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const game = document.getElementById("game");
const bird = document.getElementById("bird");

const scoreElement = document.getElementById("score");
const comboElement = document.getElementById("combo");
const livesElement = document.getElementById("lives");
const powerupHud = document.getElementById("powerupHud");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const storyButton = document.getElementById("storyButton");
const storyScreen = document.getElementById("storyScreen");
const storyStartButton = document.getElementById("storyStartButton");
const storyDescription = document.getElementById("storyDescription");
const storyProgress = document.getElementById("storyProgress");

const settingsButton = document.getElementById("settingsButton");
const settingsScreen = document.getElementById("settingsScreen");
const soundButton = document.getElementById("soundButton");
const musicButton = document.getElementById("musicButton");

const shopButton = document.getElementById("shopButton");
const shopScreen = document.getElementById("shopScreen");
const shopCoins = document.getElementById("shopCoins");

const achievementButton =
    document.getElementById("achievementButton");

const achievementScreen =
    document.getElementById("achievementScreen");

const achievementList =
    document.getElementById("achievementList");

const statsButton =
    document.getElementById("statsButton");

const statsScreen =
    document.getElementById("statsScreen");

const statBest =
    document.getElementById("statBest");

const statCoins =
    document.getElementById("statCoins");

const statCombo =
    document.getElementById("statCombo");

const statGames =
    document.getElementById("statGames");

const statHits =
    document.getElementById("statHits");

const statMedals =
    document.getElementById("statMedals");

const gameOverScreen =
    document.getElementById("gameOver");

const restartButton =
    document.getElementById("restart");

const menuButton =
    document.getElementById("menuButton");

const pauseScreen =
    document.getElementById("pauseScreen");

const pauseMenuButton =
    document.getElementById("pauseMenuButton");

const finalScore =
    document.getElementById("finalScore");

const bestScore =
    document.getElementById("bestScore");

const finalCoins =
    document.getElementById("finalCoins");

const medal =
    document.getElementById("medal");

const gameOverMessage =
    document.getElementById("gameOverMessage");

const messagePopup =
    document.getElementById("messagePopup");

const bossHud =
    document.getElementById("bossHud");

const bossHealth =
    document.getElementById("bossHealth");


/* =====================================================
   ESTADO
===================================================== */

let gameRunning = false;
let paused = false;

let score = 0;
let coins = 0;
let lives = 3;
let combo = 0;

let birdY = 280;
let velocity = 0;

let pipes = [];
let coinsArray = [];
let powerups = [];
let particles = [];

let lastTime = 0;
let pipeTimer = 0;
let powerupTimer = 0;

let selectedCharacter = "yellow";
let selectedWorld = "day";

let difficulty = localStorage.getItem("spjDifficulty") || "normal";

let soundEnabled =
    localStorage.getItem("spjSound") !== "false";

let musicEnabled =
    localStorage.getItem("spjMusic") !== "false";

let gameMode = "arcade";

let currentLevel = 1;

let bossActive = false;
let bossHP = 100;

let shieldActive = false;
let magnetActive = false;
let slowActive = false;
let turboActive = false;

let shieldTimer = 0;
let magnetTimer = 0;
let slowTimer = 0;
let turboTimer = 0;

let audioContext = null;
let musicInterval = null;


/* =====================================================
   CONFIGURAÇÕES DE DIFICULDADE
===================================================== */

const difficultySettings = {

    easy: {
        speed: 2.0,
        gap: 175,
        spawn: 110,
        gravity: .38,
        jump: -7.2
    },

    normal: {
        speed: 2.5,
        gap: 150,
        spawn: 95,
        gravity: .42,
        jump: -7.5
    },

    hard: {
        speed: 3.2,
        gap: 130,
        spawn: 82,
        gravity: .46,
        jump: -7.8
    }

};


/* =====================================================
   FRASES DAS NUVENS
===================================================== */

const cloudPhrases = [

    "VAI 2DS!",
    "DS MELHOR CURSO!",
    "BORZUK LINDO!",
    "FEITO POR JOAO VITOR!",
    "NÃO CAI!",
    "VAI PINTO!",
    "2DS DOMINANDO!",
    "BORA!",
    "QUASE!",
    "VOCÊ CONSEGUE!"

];

function changeCloudPhrases() {

    document.querySelectorAll(".cloud").forEach(cloud => {

        const text =
            cloud.querySelector(".cloud-text");

        if (!text) return;

        const index =
            Math.floor(
                Math.random() * cloudPhrases.length
            );

        text.textContent =
            cloudPhrases[index];

    });

}

setInterval(changeCloudPhrases, 3000);

changeCloudPhrases();


/* =====================================================
   AUDIO
===================================================== */

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

}


function playSound(type) {

    if (!soundEnabled) return;

    initAudio();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    let frequency = 400;
    let duration = .08;

    if (type === "jump") {
        frequency = 500;
    }

    if (type === "coin") {
        frequency = 800;
        duration = .12;
    }

    if (type === "hit") {
        frequency = 120;
        duration = .2;
    }

    if (type === "power") {
        frequency = 1000;
        duration = .15;
    }

    if (type === "boss") {
        frequency = 80;
        duration = .3;
    }

    if (type === "win") {
        frequency = 1200;
        duration = .3;
    }

    oscillator.frequency.value =
        frequency;

    oscillator.type = "square";

    gain.gain.setValueAtTime(
        .05,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        .001,
        audioContext.currentTime + duration
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );

}


function startMusic() {

    if (!musicEnabled) return;

    initAudio();

    stopMusic();

    musicInterval =
        setInterval(() => {

            if (!gameRunning || paused) return;

            playMusicNote();

        }, 550);

}


function playMusicNote() {

    if (!musicEnabled || !audioContext) return;

    const notes = [
        261,
        329,
        392,
        523,
        392,
        329
    ];

    const note =
        notes[
            Math.floor(
                Math.random() * notes.length
            )
        ];

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = note;

    oscillator.type = "square";

    gain.gain.setValueAtTime(
        .015,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        .001,
        audioContext.currentTime + .25
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + .25
    );

}


function stopMusic() {

    if (musicInterval) {

        clearInterval(musicInterval);

        musicInterval = null;

    }

}


/* =====================================================
   PERSONAGENS
===================================================== */

document.querySelectorAll(".character")
    .forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            const character =
                button.dataset.character;

            if (
                button.classList.contains("locked") &&
                !isCharacterUnlocked(character)
            ) {

                showMessage(
                    "🔒 PERSONAGEM BLOQUEADO!"
                );

                return;

            }

            document
                .querySelectorAll(".character")
                .forEach(btn =>
                    btn.classList.remove("selected")
                );

            button.classList.add("selected");

            selectedCharacter =
                character;

            applyCharacter();

            playSound("power");

        });

    });


function applyCharacter() {

    bird.className = "";

    bird.classList.add(
        "character-" + selectedCharacter
    );

}


/* =====================================================
   MUNDOS
===================================================== */

document.querySelectorAll(".world")
    .forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            document
                .querySelectorAll(".world")
                .forEach(btn =>
                    btn.classList.remove("selected")
                );

            button.classList.add("selected");

            selectedWorld =
                button.dataset.world;

            applyWorld();

        });

    });


function applyWorld() {

    game.classList.remove(
        "world-day",
        "world-night",
        "world-forest",
        "world-volcano",
        "world-space"
    );

    game.classList.add(
        "world-" + selectedWorld
    );

}


/* =====================================================
   CONTROLES
===================================================== */

function jump() {

    if (!gameRunning || paused) return;

    const settings =
        difficultySettings[difficulty];

    velocity =
        turboActive
            ? settings.jump * 1.15
            : settings.jump;

    playSound("jump");

}


document.addEventListener("keydown", event => {

    if (
        event.code === "Space" ||
        event.code === "ArrowUp"
    ) {

        event.preventDefault();

        jump();

    }

    if (
        event.key.toLowerCase() === "p"
    ) {

        togglePause();

    }

});


game.addEventListener("mousedown", event => {

    if (
        event.target.closest("button") ||
        event.target.closest(".menuOverlay") ||
        event.target.closest("#gameOver") ||
        event.target.closest("#pauseScreen")
    ) return;

    jump();

});


game.addEventListener(
    "touchstart",
    event => {

        if (
            event.target.closest("button") ||
            event.target.closest(".menuOverlay")
        ) return;

        event.preventDefault();

        jump();

    },
    { passive: false }
);


/* =====================================================
   CANOS
===================================================== */

function createPipe() {

    const settings =
        difficultySettings[difficulty];

    let gap =
        settings.gap;

    if (currentLevel >= 3) {
        gap -= 5;
    }

    if (currentLevel >= 5) {
        gap -= 5;
    }

    const minHeight = 70;

    const maxHeight =
        game.clientHeight -
        70 -
        gap -
        80;

    const topHeight =
        Math.floor(
            Math.random() *
            (maxHeight - minHeight)
        ) + minHeight;

    const bottomHeight =
        game.clientHeight -
        70 -
        gap -
        topHeight;


    const topPipe =
        document.createElement("div");

    topPipe.className =
        "pipe top";

    topPipe.style.height =
        topHeight + "px";

    topPipe.style.left =
        game.clientWidth + "px";


    const topText =
        document.createElement("span");

    topText.className =
        "pipe-text";

    topText.textContent =
        "2DS O MELHOR!";

    topPipe.appendChild(topText);


    const bottomPipe =
        document.createElement("div");

    bottomPipe.className =
        "pipe bottom";

    bottomPipe.style.height =
        bottomHeight + "px";

    bottomPipe.style.left =
        game.clientWidth + "px";


    const bottomText =
        document.createElement("span");

    bottomText.className =
        "pipe-text";

    bottomText.textContent =
        "2DS O MELHOR!";

    bottomPipe.appendChild(bottomText);


    game.appendChild(topPipe);
    game.appendChild(bottomPipe);


    const pipeObject = {

        top: topPipe,
        bottom: bottomPipe,

        x: game.clientWidth,

        passed: false

    };


    pipes.push(pipeObject);


    createCoin(
        game.clientWidth + 20,
        topHeight + gap / 2
    );


    /* CHANCE DE POWER-UP */

    if (Math.random() < .18) {

        const types = [
            "shield",
            "magnet",
            "slow",
            "life",
            "turbo"
        ];

        const type =
            types[
                Math.floor(
                    Math.random() *
                    types.length
                )
            ];

        createPowerup(
            game.clientWidth + 35,
            topHeight + gap / 2 + 40,
            type
        );

    }

}


/* =====================================================
   MOEDAS
===================================================== */

function createCoin(x, y) {

    const coin =
        document.createElement("div");

    coin.className =
        "coin";

    coin.style.left =
        x + "px";

    coin.style.top =
        y + "px";

    game.appendChild(coin);

    coinsArray.push({

        element: coin,

        x: x,

        y: y,

        collected: false

    });

}


/* =====================================================
   POWER-UPS
===================================================== */

function createPowerup(x, y, type) {

    const powerup =
        document.createElement("div");

    powerup.className =
        "powerup " + type;

    const icons = {

        shield: "🛡️",
        magnet: "🧲",
        slow: "🐌",
        life: "❤️",
        turbo: "⚡"

    };

    powerup.textContent =
        icons[type];

    powerup.style.left =
        x + "px";

    powerup.style.top =
        y + "px";

    game.appendChild(powerup);

    powerups.push({

        element: powerup,

        x: x,

        y: y,

        type: type

    });

}


function activatePowerup(type) {

    playSound("power");

    if (type === "shield") {

        shieldActive = true;
        shieldTimer = 8000;

        showMessage("🛡️ ESCUDO ATIVADO!");

    }

    if (type === "magnet") {

        magnetActive = true;
        magnetTimer = 8000;

        showMessage("🧲 ÍMÃ ATIVADO!");

    }

    if (type === "slow") {

        slowActive = true;
        slowTimer = 6000;

        showMessage("🐌 TEMPO LENTO!");

    }

    if (type === "life") {

        if (lives < 3) {

            lives++;

            updateHUD();

            showMessage("❤️ VIDA EXTRA!");

        } else {

            score += 5;

            showMessage(
                "❤️ VIDA CHEIA! +5"
            );

        }

    }

    if (type === "turbo") {

        turboActive = true;
        turboTimer = 5000;

        showMessage("⚡ TURBO!");

    }

}


/* =====================================================
   COLISÃO
===================================================== */

function checkCollision(rect1, rect2) {

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );

}


/* =====================================================
   VIDA
===================================================== */

function loseLife() {

    if (shieldActive) {

        shieldActive = false;

        showMessage(
            "🛡️ ESCUDO BLOQUEOU O DANO!"
        );

        playSound("power");

        return;

    }

    lives--;

    combo = 0;

    recordHit();

    playSound("hit");

    updateHUD();

    game.classList.add("damage");

    setTimeout(() => {

        game.classList.remove("damage");

    }, 200);


    if (lives <= 0) {

        endGame();

        return;

    }


    birdY = 280;

    velocity = 0;

}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    scoreElement.textContent =
        score;

    comboElement.textContent =
        "COMBO x" + combo;

    livesElement.textContent =
        "❤️ ".repeat(lives);


    const active = [];

    if (shieldActive)
        active.push("🛡️ ESCUDO");

    if (magnetActive)
        active.push("🧲 ÍMÃ");

    if (slowActive)
        active.push("🐌 LENTO");

    if (turboActive)
        active.push("⚡ TURBO");

    powerupHud.textContent =
        active.join(" | ");

}


/* =====================================================
   COLETAR MOEDA
===================================================== */

function collectCoin(coin) {

    if (coin.collected) return;

    coin.collected = true;

    coins++;

    score++;

    combo++;

    updateStatistics();

    checkAchievements();

    playSound("coin");

    coin.element.classList.add(
        "collecting"
    );

    createParticles(
        coin.x,
        coin.y
    );

    setTimeout(() => {

        if (coin.element)
            coin.element.remove();

    }, 300);

    updateHUD();

}


/* =====================================================
   PARTÍCULAS
===================================================== */

function createParticles(x, y) {

    for (let i = 0; i < 8; i++) {

        const particle =
            document.createElement("div");

        particle.className =
            "particle";

        particle.style.left =
            x + "px";

        particle.style.top =
            y + "px";

        particle.style.setProperty(
            "--x",
            (Math.random() * 80 - 40) + "px"
        );

        particle.style.setProperty(
            "--y",
            (Math.random() * 80 - 40) + "px"
        );

        game.appendChild(particle);

        setTimeout(() => {

            particle.remove();

        }, 600);

    }

}


/* =====================================================
   DESTRUIR OBJETOS
===================================================== */

function destroyPipe(pipe) {

    if (!pipe) return;

    if (pipe.top)
        pipe.top.remove();

    if (pipe.bottom)
        pipe.bottom.remove();

    const index =
        pipes.indexOf(pipe);

    if (index !== -1)
        pipes.splice(index, 1);

}


function removeAllPipes() {

    pipes.forEach(pipe => {

        if (pipe.top)
            pipe.top.remove();

        if (pipe.bottom)
            pipe.bottom.remove();

    });

    pipes = [];

}


function removeAllCoins() {

    coinsArray.forEach(coin => {

        if (coin.element)
            coin.element.remove();

    });

    coinsArray = [];

}


function removeAllPowerups() {

    powerups.forEach(powerup => {

        if (powerup.element)
            powerup.element.remove();

    });

    powerups = [];

}


/* =====================================================
   INICIAR JOGO
===================================================== */

function startGame(mode = "arcade") {

    initAudio();

    gameMode = mode;

    score = 0;
    coins = 0;
    lives = 3;
    combo = 0;

    birdY = 280;
    velocity = 0;

    pipeTimer = 0;
    powerupTimer = 0;

    currentLevel =
        mode === "story"
            ? currentLevel
            : 1;

    bossActive = false;
    bossHP = 100;

    shieldActive = false;
    magnetActive = false;
    slowActive = false;
    turboActive = false;

    removeAllPipes();
    removeAllCoins();
    removeAllPowerups();

    gameRunning = true;
    paused = false;

    startScreen.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    pauseScreen.style.display =
        "none";

    storyScreen.style.display =
        "none";

    settingsScreen.style.display =
        "none";

    shopScreen.style.display =
        "none";

    achievementScreen.style.display =
        "none";

    statsScreen.style.display =
        "none";

    bossHud.style.display =
        "none";

    applyCharacter();
    applyWorld();

    updateHUD();

    recordGame();

    lastTime =
        performance.now();

    startMusic();

    requestAnimationFrame(gameLoop);

}


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    gameRunning = false;

    paused = false;

    stopMusic();

    const oldBest =
        Number(
            localStorage.getItem(
                "superPintoBest"
            ) || 0
        );


    if (score > oldBest) {

        localStorage.setItem(
            "superPintoBest",
            score
        );

        showMessage(
            "🏆 NOVO RECORDE!"
        );

    }


    const best =
        Number(
            localStorage.getItem(
                "superPintoBest"
            ) || 0
        );


    finalScore.textContent =
        score;

    bestScore.textContent =
        best;

    finalCoins.textContent =
        coins;


    if (score >= 30) {

        medal.textContent =
            "🏆 OURO";

    } else if (score >= 20) {

        medal.textContent =
            "🥈 PRATA";

    } else if (score >= 10) {

        medal.textContent =
            "🥉 BRONZE";

    } else {

        medal.textContent =
            "🐤 TENTE NOVAMENTE";

    }


    if (
        gameMode === "story" &&
        !bossActive &&
        score >= 20
    ) {

        gameOverMessage.textContent =
            "FASE CONCLUÍDA!";

    } else {

        gameOverMessage.textContent =
            "TENTE BATER SEU RECORDE!";

    }


    updateStatistics();

    checkAchievements();

    gameOverScreen.style.display =
        "flex";

}


/* =====================================================
   VOLTAR AO MENU
===================================================== */

function returnToMenu() {

    gameRunning = false;

    paused = false;

    stopMusic();

    removeAllPipes();
    removeAllCoins();
    removeAllPowerups();

    score = 0;
    coins = 0;
    lives = 3;
    combo = 0;

    birdY = 280;
    velocity = 0;

    pipeTimer = 0;

    bossActive = false;

    bossHud.style.display =
        "none";

    bird.style.top =
        birdY + "px";

    gameOverScreen.style.display =
        "none";

    pauseScreen.style.display =
        "none";

    storyScreen.style.display =
        "none";

    settingsScreen.style.display =
        "none";

    shopScreen.style.display =
        "none";

    achievementScreen.style.display =
        "none";

    statsScreen.style.display =
        "none";

    startScreen.style.display =
        "flex";

    updateHUD();

    changeCloudPhrases();

}


/* =====================================================
   PAUSA
===================================================== */

function togglePause() {

    if (!gameRunning) return;

    paused = !paused;

    if (paused) {

        pauseScreen.style.display =
            "flex";

    } else {

        pauseScreen.style.display =
            "none";

        lastTime =
            performance.now();

        requestAnimationFrame(gameLoop);

    }

}


/* =====================================================
   BOSS
===================================================== */

function startBoss() {

    if (bossActive) return;

    bossActive = true;

    bossHP = 100;

    bossHud.style.display =
        "block";

    bossHealth.style.width =
        "100%";

    playSound("boss");

    showMessage(
        "👹 CHEFE APARECEU!"
    );

}


function damageBoss(amount) {

    if (!bossActive) return;

    bossHP -= amount;

    if (bossHP < 0)
        bossHP = 0;

    bossHealth.style.width =
        bossHP + "%";


    if (bossHP <= 0) {

        defeatBoss();

    }

}


function defeatBoss() {

    bossActive = false;

    bossHud.style.display =
        "none";

    score += 50;

    combo += 10;

    playSound("win");

    showMessage(
        "🏆 CHEFE DERROTADO! +50"
    );

    if (gameMode === "story") {

        currentLevel++;

        saveStoryProgress();

    }

    updateHUD();

}


/* =====================================================
   NÍVEIS
===================================================== */

function checkLevelProgress() {

    if (gameMode !== "story")
        return;

    const required =
        currentLevel * 20;

    if (
        score >= required &&
        !bossActive
    ) {

        if (
            currentLevel === 5
        ) {

            startBoss();

        } else {

            currentLevel++;

            showMessage(
                "⭐ FASE " +
                currentLevel
            );

            updateStoryScreen();

        }

    }

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop(time) {

    if (!gameRunning || paused)
        return;


    const delta =
        Math.min(
            (time - lastTime) / 16.67,
            2
        );

    lastTime = time;


    const settings =
        difficultySettings[difficulty];


    /* GRAVIDADE */

    velocity +=
        settings.gravity * delta;

    birdY +=
        velocity * delta;


    bird.style.top =
        birdY + "px";


    /* LIMITES */

    if (
        birdY < 0 ||
        birdY >
        game.clientHeight - 120
    ) {

        loseLife();

    }


    /* CANOS */

    pipeTimer += delta;


    if (
        pipeTimer >
        settings.spawn
    ) {

        createPipe();

        pipeTimer = 0;

    }


    /* POWERUPS */

    powerupTimer += delta;


    const birdRect =
        bird.getBoundingClientRect();


    /* MOVIMENTO DOS CANOS */

    const speed =
        settings.speed *
        (slowActive ? .55 : 1);


    pipes.slice().forEach(pipe => {

        pipe.x -=
            speed * delta;


        pipe.top.style.left =
            pipe.x + "px";

        pipe.bottom.style.left =
            pipe.x + "px";


        const topRect =
            pipe.top.getBoundingClientRect();

        const bottomRect =
            pipe.bottom.getBoundingClientRect();


        if (
            checkCollision(
                birdRect,
                topRect
            ) ||
            checkCollision(
                birdRect,
                bottomRect
            )
        ) {

            destroyPipe(pipe);

            loseLife();

            return;

        }


        if (
            !pipe.passed &&
            pipe.x < 80
        ) {

            pipe.passed = true;

            score++;

            combo++;

            if (combo > getStat("bestCombo")) {

                localStorage.setItem(
                    "spjBestCombo",
                    combo
                );

            }

            playSound("coin");

            updateHUD();

            checkAchievements();

        }


        if (
            pipe.x < -100
        ) {

            destroyPipe(pipe);

        }

    });


    /* MOEDAS */

    coinsArray.slice().forEach(coin => {

        if (coin.collected)
            return;


        coin.x -=
            speed * delta;

        coin.element.style.left =
            coin.x + "px";


        const coinRect =
            coin.element.getBoundingClientRect();


        if (
            magnetActive
        ) {

            const dx =
                birdRect.left -
                coinRect.left;

            const dy =
                birdRect.top -
                coinRect.top;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distance < 130) {

                coin.x +=
                    dx * .04;

                coin.y +=
                    dy * .04;

                coin.element.style.top =
                    coin.y + "px";

            }

        }


        if (
            checkCollision(
                birdRect,
                coinRect
            )
        ) {

            collectCoin(coin);

            return;

        }


        if (
            coin.x < -50
        ) {

            coin.element.remove();

            const index =
                coinsArray.indexOf(coin);

            if (index !== -1)
                coinsArray.splice(
                    index,
                    1
                );

        }

    });


    /* POWERUPS */

    powerups.slice().forEach(powerup => {

        powerup.x -=
            speed * delta;

        powerup.element.style.left =
            powerup.x + "px";


        const rect =
            powerup.element.getBoundingClientRect();


        if (
            checkCollision(
                birdRect,
                rect
            )
        ) {

            activatePowerup(
                powerup.type
            );

            powerup.element.remove();

            const index =
                powerups.indexOf(powerup);

            if (index !== -1)
                powerups.splice(
                    index,
                    1
                );

            return;

        }


        if (
            powerup.x < -50
        ) {

            powerup.element.remove();

            const index =
                powerups.indexOf(powerup);

            if (index !== -1)
                powerups.splice(
                    index,
                    1
                );

        }

    });


    /* TEMPORIZADORES */

    updatePowerupTimers(delta);


    /* NUVENS */

    document
        .querySelectorAll(".cloud")
        .forEach(cloud => {

            let left =
                parseFloat(
                    getComputedStyle(
                        cloud
                    ).left
                );

            left -=
                .3 * delta;

            if (
                left < -130
            ) {

                left =
                    game.clientWidth + 50;

            }

            cloud.style.left =
                left + "px";

        });


    /* BOSS */

    if (
        bossActive &&
        Math.random() < .002
    ) {

        createPowerup(
            game.clientWidth,
            250,
            "shield"
        );

    }


    /* PROGRESSÃO */

    checkLevelProgress();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   POWERUP TIMERS
===================================================== */

function updatePowerupTimers(delta) {

    const amount =
        delta * 16.67;


    if (shieldActive) {

        shieldTimer -= amount;

        if (shieldTimer <= 0)
            shieldActive = false;

    }


    if (magnetActive) {

        magnetTimer -= amount;

        if (magnetTimer <= 0)
            magnetActive = false;

    }


    if (slowActive) {

        slowTimer -= amount;

        if (slowTimer <= 0)
            slowActive = false;

    }


    if (turboActive) {

        turboTimer -= amount;

        if (turboTimer <= 0)
            turboActive = false;

    }


    updateHUD();

}


/* =====================================================
   POPUP
===================================================== */

let popupTimeout;

function showMessage(message) {

    messagePopup.textContent =
        message;

    messagePopup.style.display =
        "block";

    clearTimeout(
        popupTimeout
    );

    popupTimeout =
        setTimeout(() => {

            messagePopup.style.display =
                "none";

        }, 1300);

}


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

function updateSettingsButtons() {

    soundButton.textContent =
        soundEnabled
            ? "ON"
            : "OFF";

    musicButton.textContent =
        musicEnabled
            ? "ON"
            : "OFF";


    document
        .querySelectorAll(".difficulty")
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.dataset.difficulty ===
                difficulty
            );

        });

}


settingsButton.addEventListener(
    "click",
    () => {

        settingsScreen.style.display =
            "flex";

        updateSettingsButtons();

    }
);


soundButton.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;

        localStorage.setItem(
            "spjSound",
            soundEnabled
        );

        updateSettingsButtons();

        if (soundEnabled)
            playSound("power");

    }
);


musicButton.addEventListener(
    "click",
    () => {

        musicEnabled =
            !musicEnabled;

        localStorage.setItem(
            "spjMusic",
            musicEnabled
        );

        if (
            musicEnabled &&
            gameRunning
        ) {

            startMusic();

        } else {

            stopMusic();

        }

        updateSettingsButtons();

    }
);


document
    .querySelectorAll(".difficulty")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                difficulty =
                    button.dataset.difficulty;

                localStorage.setItem(
                    "spjDifficulty",
                    difficulty
                );

                updateSettingsButtons();

                showMessage(
                    "DIFICULDADE: " +
                    difficulty.toUpperCase()
                );

            }
        );

    });


/* =====================================================
   LOJA
===================================================== */

shopButton.addEventListener(
    "click",
    () => {

        shopScreen.style.display =
            "flex";

        updateShop();

    }
);


function updateShop() {

    shopCoins.textContent =
        getTotalCoins();

}


document
    .querySelectorAll(".shopItem")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const type =
                    item.dataset.item;

                buyItem(type);

            }
        );

    });


function buyItem(type) {

    const prices = {

        fire: 100,
        robot: 200,
        shield: 50,
        magnet: 75

    };


    const price =
        prices[type];


    const owned =
        getOwnedItems();


    if (
        owned.includes(type)
    ) {

        showMessage(
            "✅ JÁ POSSUI!"
        );

        return;

    }


    if (
        getTotalCoins() < price
    ) {

        showMessage(
            "❌ MOEDAS INSUFICIENTES!"
        );

        return;

    }


    let total =
        getTotalCoins();

    total -= price;

    localStorage.setItem(
        "spjCoins",
        total
    );


    owned.push(type);

    localStorage.setItem(
        "spjItems",
        JSON.stringify(owned)
    );


    showMessage(
        "🛒 COMPRADO!"
    );

    updateShop();

    updateCharacters();

}


function getOwnedItems() {

    return JSON.parse(
        localStorage.getItem(
            "spjItems"
        ) || "[]"
    );

}


function getTotalCoins() {

    return Number(
        localStorage.getItem(
            "spjCoins"
        ) || 0
    );

}


function updateCharacters() {

    const owned =
        getOwnedItems();

    document
        .querySelectorAll(".character.locked")
        .forEach(button => {

            if (
                owned.includes(
                    button.dataset.character
                )
            ) {

                button.classList.remove(
                    "locked"
                );

            }

        });

}


function isCharacterUnlocked(character) {

    if (
        character === "yellow" ||
        character === "red" ||
        character === "blue"
    ) {

        return true;

    }

    return getOwnedItems()
        .includes(character);

}


/* =====================================================
   CONQUISTAS
===================================================== */

const achievements = [

    {
        id: "first",
        name: "🥚 PRIMEIRO VOO",
        description: "Jogue sua primeira partida.",
        check: () => getStat("games") >= 1
    },

    {
        id: "coins50",
        name: "🪙 COLECIONADOR",
        description: "Colete 50 moedas.",
        check: () => getTotalCoins() >= 50
    },

    {
        id: "combo20",
        name: "🔥 SEM MEDO",
        description: "Chegue ao combo 20.",
        check: () => getStat("bestCombo") >= 20
    },

    {
        id: "score100",
        name: "🏆 CAMPEÃO",
        description: "Faça 100 pontos.",
        check: () => getStat("best") >= 100
    },

    {
        id: "score500",
        name: "👑 LENDA 2DS",
        description: "Faça 500 pontos.",
        check: () => getStat("best") >= 500
    },

    {
        id: "boss",
        name: "👹 CAÇADOR DE CHEFES",
        description: "Derrote um chefe.",
        check: () => getStat("bosses") >= 1
    }

];


function getUnlockedAchievements() {

    return JSON.parse(
        localStorage.getItem(
            "spjAchievements"
        ) || "[]"
    );

}


function checkAchievements() {

    const unlocked =
        getUnlockedAchievements();


    achievements.forEach(achievement => {

        if (
            !unlocked.includes(
                achievement.id
            ) &&
            achievement.check()
        ) {

            unlocked.push(
                achievement.id
            );

            localStorage.setItem(
                "spjAchievements",
                JSON.stringify(
                    unlocked
                )
            );

            showMessage(
                "🏆 " +
                achievement.name
            );

        }

    });

}


function renderAchievements() {

    const unlocked =
        getUnlockedAchievements();


    achievementList.innerHTML = "";


    achievements.forEach(achievement => {

        const div =
            document.createElement("div");

        div.className =
            "achievement";


        if (
            unlocked.includes(
                achievement.id
            )
        ) {

            div.classList.add(
                "unlocked"
            );

            div.innerHTML =
                "<strong>" +
                achievement.name +
                "</strong><br>" +
                achievement.description;

        } else {

            div.innerHTML =
                "🔒 ???<br>" +
                "<small>" +
                achievement.description +
                "</small>";

        }


        achievementList.appendChild(
            div
        );

    });

}


achievementButton.addEventListener(
    "click",
    () => {

        renderAchievements();

        achievementScreen.style.display =
            "flex";

    }
);


/* =====================================================
   ESTATÍSTICAS
===================================================== */

function getStat(name) {

    const keys = {

        best: "spjBest",
        coins: "spjCoins",
        bestCombo: "spjBestCombo",
        games: "spjGames",
        hits: "spjHits",
        bosses: "spjBosses"

    };


    return Number(
        localStorage.getItem(
            keys[name]
        ) || 0
    );

}


function updateStatistics() {

    const best =
        Number(
            localStorage.getItem(
                "superPintoBest"
            ) || 0
        );


    if (
        score >
        getStat("best")
    ) {

        localStorage.setItem(
            "spjBest",
            score
        );

    }


    if (
        combo >
        getStat("bestCombo")
    ) {

        localStorage.setItem(
            "spjBestCombo",
            combo
        );

    }


    const total =
        getStat("coins") +
        coins;

    if (coins > 0) {

        localStorage.setItem(
            "spjCoins",
            getTotalCoins() + coins
        );

    }


    statBest.textContent =
        Math.max(
            best,
            getStat("best")
        );

    statCoins.textContent =
        getTotalCoins();

    statCombo.textContent =
        getStat("bestCombo");

    statGames.textContent =
        getStat("games");

    statHits.textContent =
        getStat("hits");

    statMedals.textContent =
        getUnlockedAchievements().length;

}


function recordGame() {

    localStorage.setItem(
        "spjGames",
        getStat("games") + 1
    );

}


function recordHit() {

    localStorage.setItem(
        "spjHits",
        getStat("hits") + 1
    );

}


/* =====================================================
   MODO HISTÓRIA
===================================================== */

const storyLevels = [

    {
        title: "FASE 1 — O PRIMEIRO VOO",
        description:
            "O Pinto acabou de começar sua aventura. Atravesse os primeiros canos!",
        world: "day"
    },

    {
        title: "FASE 2 — FLORESTA 2DS",
        description:
            "Entre na floresta e enfrente obstáculos mais difíceis.",
        world: "forest"
    },

    {
        title: "FASE 3 — NOITE DO BORZUK",
        description:
            "A noite chegou. Cuidado com os canos!",
        world: "night"
    },

    {
        title: "FASE 4 — VULCÃO",
        description:
            "O calor aumentou e os obstáculos estão mais perigosos.",
        world: "volcano"
    },

    {
        title: "FASE 5 — ESPAÇO",
        description:
            "Chegou ao espaço. Prepare-se para o chefe final!",
        world: "space"
    }

];


function updateStoryScreen() {

    const level =
        storyLevels[
            Math.min(
                currentLevel - 1,
                storyLevels.length - 1
            )
        ];


    storyDescription.textContent =
        level.title +
        " — " +
        level.description;


    storyProgress.textContent =
        "FASE " +
        currentLevel +
        " / " +
        storyLevels.length;


    storyStartButton.textContent =
        "COMEÇAR " +
        level.title;


    selectedWorld =
        level.world;

    applyWorld();

}


storyButton.addEventListener(
    "click",
    () => {

        currentLevel =
            Number(
                localStorage.getItem(
                    "spjStoryLevel"
                ) || 1
            );

        if (
            currentLevel >
            storyLevels.length
        ) {

            currentLevel = 1;

        }

        updateStoryScreen();

        storyScreen.style.display =
            "flex";

    }
);


storyStartButton.addEventListener(
    "click",
    () => {

        startGame("story");

    }
);


function saveStoryProgress() {

    localStorage.setItem(
        "spjStoryLevel",
        currentLevel
    );

}


/* =====================================================
   BOTÕES DE FECHAR
===================================================== */

document
    .querySelectorAll("[data-close]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    document.getElementById(
                        button.dataset.close
                    );

                if (target) {

                    target.style.display =
                        "none";

                }

            }
        );

    });


/* =====================================================
   ESTATÍSTICAS / MENU
===================================================== */

statsButton.addEventListener(
    "click",
    () => {

        updateStatistics();

        statsScreen.style.display =
            "flex";

    }
);


/* =====================================================
   BOTÕES PRINCIPAIS
===================================================== */

startButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        startGame("arcade");

    }
);


restartButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        startGame(gameMode);

    }
);


menuButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        returnToMenu();

    }
);


pauseMenuButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        returnToMenu();

    }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

updateHUD();

updateCharacters();

updateSettingsButtons();

updateStatistics();

game.classList.add(
    "world-day"
);
