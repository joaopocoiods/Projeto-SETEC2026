/* =====================================================
   SUPER PINTO JUMPER
===================================================== */


/* =========================
   ELEMENTOS
========================= */

const game = document.getElementById("game");
const bird = document.getElementById("bird");

const scoreElement =
    document.getElementById("score");

const comboElement =
    document.getElementById("combo");

const livesElement =
    document.getElementById("lives");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const gameOverScreen =
    document.getElementById("gameOver");

const restartButton =
    document.getElementById("restart");

const menuButton =
    document.getElementById("menuButton");

const pauseScreen =
    document.getElementById("pauseScreen");

const finalScore =
    document.getElementById("finalScore");

const bestScore =
    document.getElementById("bestScore");

const finalCoins =
    document.getElementById("finalCoins");

const medal =
    document.getElementById("medal");


/* =========================
   ESTADO DO JOGO
========================= */

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

let lastTime = 0;
let pipeTimer = 0;

let selectedCharacter = "yellow";
let selectedWorld = "day";


/* =========================
   FÍSICA
========================= */

const gravity = 0.42;
const jumpForce = -7.5;


/* =========================
   FRASES DAS NUVENS
========================= */

const cloudPhrases = [

    "VAI 2DS!",

    "DS MELHOR CURSO!",

    "BORZUK LINDO!",

    "FEITO POR JOAO VITOR!"

];


/* =========================
   TROCAR FRASES DAS NUVENS
========================= */

function changeCloudPhrases() {

    const clouds =
        document.querySelectorAll(".cloud");

    clouds.forEach(function(cloud) {

        const text =
            cloud.querySelector(".cloud-text");

        if (!text) return;

        const randomIndex =
            Math.floor(
                Math.random() *
                cloudPhrases.length
            );

        text.textContent =
            cloudPhrases[randomIndex];

    });

}


/* =========================
   TROCAR FRASES A CADA 3 SEGUNDOS
========================= */

setInterval(function() {

    changeCloudPhrases();

}, 3000);


/* =========================
   FRASES INICIAIS
========================= */

changeCloudPhrases();


/* =========================
   PERSONAGEM
========================= */

document
    .querySelectorAll(".character")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                document
                    .querySelectorAll(".character")
                    .forEach(function(btn) {

                        btn.classList.remove(
                            "selected"
                        );

                    });

                button.classList.add(
                    "selected"
                );

                selectedCharacter =
                    button.dataset.character;

                bird.className = "";

                bird.classList.add(
                    "character-" +
                    selectedCharacter
                );

            }
        );

    });


/* =========================
   MUNDO
========================= */

document
    .querySelectorAll(".world")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                document
                    .querySelectorAll(".world")
                    .forEach(function(btn) {

                        btn.classList.remove(
                            "selected"
                        );

                    });

                button.classList.add(
                    "selected"
                );

                selectedWorld =
                    button.dataset.world;

                game.classList.remove(
                    "world-day",
                    "world-night",
                    "world-forest"
                );

                game.classList.add(
                    "world-" +
                    selectedWorld
                );

            }
        );

    });


/* =========================
   PULAR
========================= */

function jump() {

    if (!gameRunning || paused) {
        return;
    }

    velocity = jumpForce;

}


/* =========================
   CONTROLES DO TECLADO
========================= */

document.addEventListener(
    "keydown",
    function(event) {

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

    }
);


/* =========================
   MOUSE
========================= */

game.addEventListener(
    "mousedown",
    function(event) {

        if (
            event.target.closest(".character") ||
            event.target.closest(".world") ||
            event.target.closest("#startButton") ||
            event.target.closest("#restart") ||
            event.target.closest("#menuButton")
        ) {

            return;

        }

        jump();

    }
);


/* =========================
   TOQUE
========================= */

game.addEventListener(
    "touchstart",
    function(event) {

        if (
            event.target.closest(".character") ||
            event.target.closest(".world") ||
            event.target.closest("#startButton") ||
            event.target.closest("#restart") ||
            event.target.closest("#menuButton")
        ) {

            return;

        }

        event.preventDefault();

        jump();

    },
    { passive: false }
);


/* =========================
   CRIAR CANO
========================= */

function createPipe() {

    const gap = 150;

    const minHeight = 80;

    const maxHeight =
        game.clientHeight -
        70 -
        gap -
        80;

    const topHeight =
        Math.floor(
            Math.random() *
            (maxHeight - minHeight)
        ) +
        minHeight;

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


    const bottomPipe =
        document.createElement("div");

    bottomPipe.className =
        "pipe bottom";

    bottomPipe.style.height =
        bottomHeight + "px";

    bottomPipe.style.left =
        game.clientWidth + "px";


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

}


/* =========================
   CRIAR MOEDA
========================= */

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


/* =========================
   REMOVER CANO
========================= */

function destroyPipe(pipe) {

    if (!pipe) return;


    if (pipe.top) {

        pipe.top.remove();

    }


    if (pipe.bottom) {

        pipe.bottom.remove();

    }


    const index =
        pipes.indexOf(pipe);


    if (index !== -1) {

        pipes.splice(index, 1);

    }

}


/* =========================
   REMOVER TODOS OS CANOS
========================= */

function removeAllPipes() {

    pipes.forEach(function(pipe) {

        if (pipe.top) {
            pipe.top.remove();
        }

        if (pipe.bottom) {
            pipe.bottom.remove();
        }

    });

    pipes = [];

}


/* =========================
   REMOVER TODAS AS MOEDAS
========================= */

function removeAllCoins() {

    coinsArray.forEach(
        function(coin) {

            if (coin.element) {

                coin.element.remove();

            }

        }
    );

    coinsArray = [];

}


/* =========================
   COLISÃO
========================= */

function checkCollision(
    rect1,
    rect2
) {

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );

}


/* =========================
   PERDER VIDA
========================= */

function loseLife() {

    lives--;

    combo = 0;

    updateHUD();


    game.classList.add(
        "damage"
    );


    setTimeout(
        function() {

            game.classList.remove(
                "damage"
            );

        },
        200
    );


    if (lives <= 0) {

        endGame();

    } else {

        birdY = 280;

        velocity = 0;

    }

}


/* =========================
   ATUALIZAR HUD
========================= */

function updateHUD() {

    scoreElement.textContent =
        score;

    comboElement.textContent =
        "COMBO x" + combo;


    livesElement.textContent =
        "❤️ ".repeat(lives);

}


/* =========================
   COLETAR MOEDA
========================= */

function collectCoin(coin) {

    if (coin.collected) {
        return;
    }

    coin.collected = true;

    coins++;

    score++;

    combo++;


    coin.element.classList.add(
        "collecting"
    );


    createParticles(
        coin.x,
        coin.y
    );


    setTimeout(
        function() {

            if (coin.element) {
                coin.element.remove();
            }

        },
        300
    );


    updateHUD();

}


/* =========================
   PARTÍCULAS
========================= */

function createParticles(x, y) {

    for (
        let i = 0;
        i < 8;
        i++
    ) {

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
            (Math.random() * 80 - 40) +
            "px"
        );

        particle.style.setProperty(
            "--y",
            (Math.random() * 80 - 40) +
            "px"
        );


        game.appendChild(
            particle
        );


        setTimeout(
            function() {

                particle.remove();

            },
            600
        );

    }

}


/* =========================
   INICIAR JOGO
========================= */

function startGame() {

    score = 0;

    coins = 0;

    lives = 3;

    combo = 0;

    birdY = 280;

    velocity = 0;

    pipeTimer = 0;

    gameRunning = true;

    paused = false;


    removeAllPipes();

    removeAllCoins();


    startScreen.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    pauseScreen.style.display =
        "none";


    bird.className = "";

    bird.classList.add(
        "character-" +
        selectedCharacter
    );


    game.classList.remove(
        "world-day",
        "world-night",
        "world-forest"
    );

    game.classList.add(
        "world-" +
        selectedWorld
    );


    updateHUD();


    lastTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================
   FINALIZAR JOGO
========================= */

function endGame() {

    gameRunning = false;

    paused = false;


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


    gameOverScreen.style.display =
        "flex";

}


/* =========================
   VOLTAR PARA O MENU
========================= */

function returnToMenu() {

    gameRunning = false;

    paused = false;


    /* Remove elementos da partida */

    removeAllPipes();

    removeAllCoins();


    /* Reseta os valores */

    score = 0;

    coins = 0;

    lives = 3;

    combo = 0;

    birdY = 280;

    velocity = 0;

    pipeTimer = 0;


    /* Reposiciona o passarinho */

    bird.style.top =
        birdY + "px";


    /* Esconde telas */

    gameOverScreen.style.display =
        "none";

    pauseScreen.style.display =
        "none";


    /* Mostra menu principal */

    startScreen.style.display =
        "flex";


    /* Atualiza HUD */

    updateHUD();


    /* Troca frases das nuvens */

    changeCloudPhrases();

}


/* =========================
   PAUSA
========================= */

function togglePause() {

    if (!gameRunning) {
        return;
    }


    paused = !paused;


    if (paused) {

        pauseScreen.style.display =
            "flex";

    } else {

        pauseScreen.style.display =
            "none";

        lastTime =
            performance.now();

        requestAnimationFrame(
            gameLoop
        );

    }

}


/* =========================
   LOOP DO JOGO
========================= */

function gameLoop(time) {

    if (
        !gameRunning ||
        paused
    ) {

        return;

    }


    const delta =
        Math.min(
            (time - lastTime) / 16.67,
            2
        );


    lastTime = time;


    /* =====================
       PASSARINHO
    ===================== */

    velocity +=
        gravity * delta;

    birdY +=
        velocity * delta;


    bird.style.top =
        birdY + "px";


    if (
        birdY < 0 ||
        birdY >
            game.clientHeight - 120
    ) {

        loseLife();

    }


    /* =====================
       CANOS
    ===================== */

    pipeTimer +=
        delta;


    if (pipeTimer > 95) {

        createPipe();

        pipeTimer = 0;

    }


    const birdRect =
        bird.getBoundingClientRect();


    pipes
        .slice()
        .forEach(
            function(pipe) {

                pipe.x -=
                    2.5 * delta;


                pipe.top.style.left =
                    pipe.x + "px";

                pipe.bottom.style.left =
                    pipe.x + "px";


                const topRect =
                    pipe.top
                        .getBoundingClientRect();


                const bottomRect =
                    pipe.bottom
                        .getBoundingClientRect();


                /* COLISÃO */

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


                /* PONTUAÇÃO */

                if (
                    !pipe.passed &&
                    pipe.x < 80
                ) {

                    pipe.passed = true;

                    score++;

                    combo++;

                    updateHUD();

                }


                /* REMOVER CANO */

                if (
                    pipe.x < -100
                ) {

                    destroyPipe(pipe);

                }

            }
        );


    /* =====================
       MOEDAS
    ===================== */

    coinsArray
        .slice()
        .forEach(
            function(coin) {

                if (coin.collected) {
                    return;
                }


                coin.x -=
                    2.5 * delta;


                coin.element.style.left =
                    coin.x + "px";


                const coinRect =
                    coin.element
                        .getBoundingClientRect();


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
                        coinsArray.indexOf(
                            coin
                        );


                    if (index !== -1) {

                        coinsArray.splice(
                            index,
                            1
                        );

                    }

                }

            }
        );


    /* =====================
       NUVENS
    ===================== */

    document
        .querySelectorAll(".cloud")
        .forEach(
            function(cloud) {

                let left =
                    parseFloat(
                        getComputedStyle(
                            cloud
                        ).left
                    );


                left -=
                    0.3 * delta;


                if (
                    left < -130
                ) {

                    left =
                        game.clientWidth +
                        50;

                }


                cloud.style.left =
                    left + "px";

            }
        );


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================
   BOTÃO JOGAR
========================= */

startButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        startGame();

    }
);


/* =========================
   BOTÃO JOGAR NOVAMENTE
========================= */

restartButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        startGame();

    }
);


/* =========================
   BOTÃO MENU PRINCIPAL
========================= */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            returnToMenu();

        }
    );

}


/* =========================
   INICIALIZAÇÃO
========================= */

updateHUD();

game.classList.add(
    "world-day"
);