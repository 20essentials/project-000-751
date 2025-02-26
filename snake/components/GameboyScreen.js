class GameboyScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  playSnakeGame() {
    const $ = el => this.shadowRoot.querySelector(el);
    const parentComponent = $('div.container');

    //MUSIC SNAKE
    const $audio = document.createElement('audio');
    $audio.src = 'assets/music/snake.mp3';
    $audio.loop = true;
    document.addEventListener('play-music', e => {
      if ($('.snake-the-game').classList.contains('active-game')) {
        $audio.play();
      }
    });

    document.addEventListener('pause-music', e => {
      $audio.pause();
    });

    const $canvas = $('.snake-game');
    const $reset = $('.snake-reset');
    const $modal = $('.snake-modal');
    const $h2Modal = $modal.querySelector('h2');
    const $fruitSprite = $('.fruits-snake');

    ////////////////////////////////GLOBAL
    const $ctx = $canvas.getContext('2d');
    const widthCanvas = $canvas.width;
    const heightCanvas = $canvas.height;
    let randomNum = () => ~~(Math.random() * 10);
    let randomXImage = randomNum();
    let canvasColor = '#9ca04c';
    let snakeColor = '#9ca04c';
    let snakeBorderColor = '#000';
    let running = false;
    let foodColor = '#f00';
    let unitSize = 25;
    let foodX = 0;
    let foodY = 0;
    let speedX = unitSize;
    let speedY = 0;
    let snake = [
      { x: unitSize * 4, y: 0 },
      { x: unitSize * 3, y: 0 },
      { x: unitSize * 2, y: 0 },
      { x: unitSize * 1, y: 0 },
      { x: unitSize * 0, y: 0 }
    ];
    let timeOutSave = null;

    ////////////////////////////////FUNCTIONS
    function initStateGame() {
      clearTimeout(timeOutSave);
      $modal.classList.remove('modal-snake-active');
      $h2Modal.textContent = 'YOU LOST 🥹';
      running = false;
      foodX = 0;
      foodY = 0;
      speedX = unitSize;
      speedY = 0;
      snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize * 1, y: 0 },
        { x: unitSize * 0, y: 0 }
      ];
    } //'✅'

    function initGame() {
      running = true;
      createFood();
      drawGame();
    } //'✅'

    function clearBackground() {
      $ctx.fillStyle = canvasColor;
      $ctx.fillRect(0, 0, widthCanvas, heightCanvas);
    } //'✅'

    function drawGame() {
      if (running) {
        clearBackground();
        drawFood();
        drawSnake();
        moveSnake();
        checkGameOver();
      } else {
        displayGameOver();
        clearBackground();
        clearTimeout(timeOutSave);
        return;
      }
      let time = 100;
      if (window.innerWidth < 1000) {
        time = 200;
      }

      timeOutSave = setTimeout(drawGame, time);
    }

    function createFood() {
      const randomNumber = (min, max) => {
        return (
          Math.floor(Math.random() * ((max - min) / unitSize + 1)) * unitSize +
          min
        );
      };
      foodX = randomNumber(0, widthCanvas - unitSize);
      foodY = randomNumber(0, heightCanvas - unitSize);
    } //'✅'

    function drawFood() {
      const oneImageWidth = 130;
      $ctx.filter = 'brightness(150%)';
      $ctx.fillStyle = foodColor;
      $ctx.drawImage(
        $fruitSprite,
        randomXImage * oneImageWidth,
        0,
        oneImageWidth,
        oneImageWidth,
        foodX,
        foodY,
        unitSize * 1.3,
        unitSize * 1.3
      );
      $ctx.filter = 'none';
    } //'✅'

    function moveSnake() {
      const head = {
        x: snake[0].x + speedX,
        y: snake[0].y + speedY
      };

      snake.unshift(head);

      if (head.x === foodX && head.y === foodY) {
        createFood();
        randomXImage = randomNum();
      } else {
        snake.pop();
      }
    } //'✅'

    function drawSnake() {
      $ctx.fillStyle = snakeColor;
      $ctx.strokeStyle = snakeBorderColor;
      $ctx.filter = 'brightness(120%)';
      snake.forEach(({ x, y }) => {
        $ctx.fillRect(x, y, unitSize, unitSize);
        $ctx.strokeRect(x, y, unitSize, unitSize);
      });
      $ctx.filter = 'none';
    } //'✅'

    function checkGameOver() {
      const head = {
        x: snake[0].x,
        y: snake[0].y
      };

      const hitRight = head.x >= widthCanvas;
      const hitLeft = head.x < 0;
      const hitTop = head.y < 0;
      const hitBottom = head.y >= heightCanvas;

      if (hitRight || hitLeft || hitTop || hitBottom) {
        running = false;
      }

      for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
          running = false;
        }
      }

      const nTotalSquares = widthCanvas;
      if (nTotalSquares === snake.length) {
        $h2Modal.textContent = 'YOU WIN 👻';
        running = false;
      }
    } //'✅'

    function displayGameOver() {
      $modal.classList.add('modal-snake-active');
    } //'✅'

    function handleMoves({ key }) {
      if (!running) return;

      if ((key === 'ArrowUp' || key === 'w' || key === 'W') && speedY === 0) {
        // Evita ir hacia arriba si ya va hacia abajo
        if (snake[0].y - unitSize !== snake[1].y) {
          speedX = 0;
          speedY = -unitSize;
        }
        return;
      }

      if ((key === 'ArrowRight' || key === 'd' || key === 'D') && speedX === 0) {
        // Evita ir hacia la derecha si ya va hacia la izquierda
        if (snake[0].x + unitSize !== snake[1].x) {
          speedX = unitSize;
          speedY = 0;
        }
        return;
      }

      if ((key === 'ArrowDown' || key === 's' || key === 'S') && speedY === 0) {
        // Evita ir hacia abajo si ya va hacia arriba
        if (snake[0].y + unitSize !== snake[1].y) {
          speedX = 0;
          speedY = unitSize;
        }
        return;
      }

      if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && speedX === 0) {
        // Evita ir hacia la izquierda si ya va hacia la derecha
        if (snake[0].x - unitSize !== snake[1].x) {
          speedX = -unitSize;
          speedY = 0;
        }
        return;
      }
    } //'✅'

    ////////////////////////////////EVENTS
    initStateGame();
    initGame();

    document.addEventListener('keydown', handleMoves);
    parentComponent.addEventListener('click', e => {
      if (e.target === $reset) {
        initStateGame();
        initGame();
      }
    });

    document.addEventListener('again-snake-game', e => {
      if ($modal.classList.contains('modal-snake-active')) {
        initStateGame();
        initGame();
      }
    });

    document.addEventListener('snake-to-top', _ => {
      if (!running) return;
      if (speedY === 0) {
        if (snake[0].y - unitSize !== snake[1].y) {
          speedX = 0;
          speedY = -unitSize;
        }
      }
    });

    document.addEventListener('snake-to-bottom', _ => {
      if (!running) return;
      if (speedY === 0) {
        if (snake[0].y + unitSize !== snake[1].y) {
          speedX = 0;
          speedY = unitSize;
        }
      }
    });

    document.addEventListener('snake-to-right', _ => {
      if (!running) return;
      if (speedX === 0) {
        if (snake[0].x + unitSize !== snake[1].x) {
          speedX = unitSize;
          speedY = 0;
        }
      }
    });

    document.addEventListener('snake-to-left', _ => {
      if (!running) return;
      if (speedX === 0) {
        if (snake[0].x - unitSize !== snake[1].x) {
          speedX = -unitSize;
          speedY = 0;
        }
      }
    });

    document.addEventListener('mousedown', e => {
      if (e.target.matches('.toUp')) {
        return;
      } else if (e.target.matches('.toLeft')) {
        speedX = -unitSize;
        speedY = 0;
        return;
      } else if (e.target.matches('.toDown')) {
        speedX = 0;
        speedY = unitSize;
        return;
      } else if (e.target.matches('.toRight')) {
        speedX = unitSize;
        speedY = 0;
        return;
      }
    });
  }

  static get styles() {
    return /* css */ `
      :host {
        --width: 210px;
        --height: 180px;
      }

      .container {
        background: #9ca04c;
        box-shadow:
        5px 5px 10px #0008 inset,
        -2px -1px 10px #0005 inset,
        0 0 4px 3px #aaa4;
        width: var(--width);
        height: var(--height);
        display: flex;
        position: relative;
        justify-content: center;
        align-items: flex-start;
        overflow: hidden;
      }

     

      .start-game {
        content-visibility: auto;
        visibility: hidden;
        pointer-events: none;
        flex-wrap: wrap;
        place-content: center;
        position: absolute; 
        inset: 0;
        background-color: red;
        background: #9ca04c;
        box-shadow:
        5px 5px 10px #0008 inset,
        -2px -1px 10px #0005 inset,
        0 0 4px 3px #aaa4;
        z-index: 5;
        opacity: 0;
        transform: scale(0);
        transition: opacity 0.5s ease-in-out, visibility 0s linear 0.5s;

        &.active-game {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: scale(1);
          transition: transform 1s ease-in-out, opacity 1s ease-in-out;
        }
      }


      
      /*****************************SNAKE GAME*****************************/
      .snake-game-container {
        content-visibility: auto;
        --width: 210px;
        --height: 180px;
        background: #9ca04c;
        box-shadow: 5px 5px 10px #0008 inset, -2px -1px 10px #0005 inset,
          0 0 4px 3px #aaa4;
        width: var(--width);
        height: var(--height);
        overflow: hidden;
        display: flex;
      
        .canvas-shadow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: 5px 5px 10px #0008 inset, -2px -1px 10px #0005 inset,
            0 0 4px 3px #aaa4;
          pointer-events: none;
        }
      
   
        output {
          font-size: 20px;
        }
      
        .snake-game {
          margin-inline: auto;
          width: 100%;
        }
      
        .snake-reset {
          --btn-default-bg: rgb(41, 41, 41);
          --btn-padding: 15px 20px;
          --btn-hover-bg: rgb(51, 51, 51);
          --btn-transition: 0.3s;
          --btn-letter-spacing: 0.1rem;
          --btn-animation-duration: 1.2s;
          --btn-shadow-color: rgba(0, 0, 0, 0.137);
          --btn-shadow: 0 2px 10px 0 var(--btn-shadow-color);
          --hover-btn-color: #fac921;
          --default-btn-color: #fff;
          --font-size: 16px;
          --font-weight: 600;
          --font-family: Menlo, Roboto Mono, monospace;
          box-sizing: border-box;
          padding: var(--btn-padding);
          max-width: 120px;
          margin-inline: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--default-btn-color);
          font: var(--font-weight) var(--font-size) var(--font-family);
          background: var(--btn-default-bg);
          border: none;
          cursor: pointer;
          transition: var(--btn-transition);
          overflow: hidden;
          box-shadow: var(--btn-shadow);
          border-radius: 11px;
          outline: none;
      
          * {
            pointer-events: none;
          }
      
          & footer {
            letter-spacing: var(--btn-letter-spacing);
            transition: var(--btn-transition);
            box-sizing: border-box;
            position: relative;
            background: inherit;
          }
      
          & footer::before {
            box-sizing: border-box;
            position: absolute;
            content: '';
            background: inherit;
          }
      
          &:hover,
          &:focus {
            background: var(--btn-hover-bg);
          }
      
          &:hover footer,
          &:focus footer {
            color: var(--hover-btn-color);
          }
      
          &:hover footer::before,
          &:focus footer::before {
            animation: chitchat linear both var(--btn-animation-duration);
          }
        }
      
        .snake-modal {
          width: 200px;
          height: 150px;
          position: absolute;
          top: 50%;
          left: 50%;
          background-image: linear-gradient(to bottom, dodgerblue, springgreen);
          display: flex;
          flex-wrap: wrap;
          place-content: center;
          flex-direction: column;
          gap: 1.3rem;
          border-radius: 12px;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.4s ease;
          zoom: 0.75;

          h2 {
            margin: 0;
          }
      
          &.modal-snake-active {
            transform: translate(-50%, -50%) scale(1);
          }
        }
      }
      
      @keyframes chitchat {
        0% {
          content: '#';
        }
      
        5% {
          content: '.';
        }
      
        10% {
          content: '^{';
        }
      
        15% {
          content: '-!';
        }
      
        20% {
          content: '#$_';
        }
      
        25% {
          content: '№:0';
        }
      
        30% {
          content: '#{+.';}35%{content: '@}-?';
        }
      
        40% {
          content: '?{4@%';
        }
      
        45% {
          content: '=.,^!';
        }
      
        50% {
          content: '?2@%';
        }
      
        55% {
          content: '\;1}]';
        }
      
        60% {
          content: '?{%:%';
          right: 0;
        }
      
        65% {
          content: '|{f[4';
          right: 0;
        }
      
        70% {
          content: '{4%0%';
          right: 0;
        }
      
        75% {
          content: "'1_0<";
          right: 0;
        }
      
        80% {
          content: '{0%';
          right: 0;
        }
      
        85% {
          content: "]>'";
          right: 0;
        }
      
        90% {
          content: '4';
          right: 0;
        }
      
        95% {
          content: '2';
          right: 0;
        }
      
        100% {
          content: '';
          right: 0;
        }
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.playSnakeGame();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyScreen.styles}</style>
    <div class="container schemeCrystal">
      <article class="start-game snake-the-game active-game">
            <aside class="snake-game-container">
              <canvas class="snake-game" width="500" height="500"></canvas>
              <div class="canvas-shadow"></div>
              <aside class="container-sprites" style="display: none">
                <img
                  src="assets/snake-game/fruits.png"
                  alt="fruit"
                  class="fruits-snake"
                />
              </aside>

              <aside class="snake-modal">
                <h2>YOU LOST 🥹</h2>
                <button class="snake-reset">
                  <footer> Reset </footer>
                </button>
              </aside>
            </aside>
      </article>
    </div>`;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
