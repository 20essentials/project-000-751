class GameboyScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  playStackTower() {
    const $ = el => this.shadowRoot.querySelector(el);
    const parentComponent = $('div.container');
    const $canvas = $('.stack-tower');
    const $ctx = $canvas.getContext('2d');
    const $modal = $('.stack-modal');
    const $maxScore = $('.max-score-stack-tower .top-score');
    const $currentScore = $('.current-score-stack-tower .top-score');

    //MUSIC STACK TOWER
    const $audio = document.createElement('audio');
    $audio.src = 'assets/music/tower.mp3';
    $audio.loop = true;
    document.addEventListener('play-music', e => {
      $audio.play();
    });

    document.addEventListener('pause-music', e => {
      $audio.pause();
    });

    //////////////////////GLOBAL
    let currentCounter = 0;
    let maxCounter =
      localStorage.getItem('stack-tower-counter') ?? currentCounter;
    let animationFrameId;
    const INITIAL_X_SPEED = 5;
    const INITIAL_Y_SPEED = 6;
    const BOX_WIDTH = 200;
    const BOX_HEIGTH = 50;
    const INITIAL_Y_CANVAS = 600;
    const MODES = {
      BOX_BOUNCE: 'box-bounce',
      BOX_FALL: 'box-fall',
      GAME_OVER: 'game-over'
    };
    let current, cameraY, scrollCounter, speedX, speedY, mode;

    //////////////////////STATE
    let boxes = [];
    let restBox = { x: 0, y: 0, width: 0 };

    //////////////////////FUNCTIONS
    function updateCounter() {
      maxCounter = Number(maxCounter);
      if (currentCounter > maxCounter) {
        localStorage.setItem('stack-tower-counter', currentCounter);
        maxCounter = currentCounter;
      }
      $maxScore.innerHTML = maxCounter;
      $currentScore.innerHTML = currentCounter;
    }

    function generateColor() {
      return `rgb(
    ${~~(Math.random() * 200) + 50},
    ${~~(Math.random() * 200) + 50},
    ${~~(Math.random() * 200) + 50}
    )`;
    }

    function initialGameState() {
      boxes = [
        {
          x: $canvas.width / 2 - BOX_WIDTH / 2,
          y: 200,
          width: BOX_WIDTH,
          color: generateColor()
        }
      ];

      current = 1;
      scrollCounter = 0;
      cameraY = 0;
      mode = MODES.BOX_BOUNCE;
      speedX = INITIAL_X_SPEED;
      speedY = INITIAL_Y_SPEED;
      currentCounter = 0;
      updateCounter();

      createNexBox();
    }

    function createNexBox() {
      boxes[current] = {
        width: boxes[current - 1].width,
        x: 0,
        y: (current + 10) * BOX_HEIGTH,
        color: generateColor()
      };
    }

    function drawBoxes() {
      boxes.forEach(box => {
        const { x, y, width, color } = box;
        const newY = INITIAL_Y_CANVAS - y + cameraY;
        $ctx.fillStyle = color;
        $ctx.fillRect(x, newY, width, BOX_HEIGTH);
      });
    }

    function drawRestOfBox() {
      const { x, y, width } = restBox;
      const newY = INITIAL_Y_CANVAS - y + cameraY;
      $ctx.fillStyle = 'red';
      $ctx.fillRect(x, newY, width, BOX_HEIGTH);
    }

    function createNewRestOfBox(difference) {
      const currentBox = boxes[current];
      const prevBox = boxes[current - 1];
      const restX =
        currentBox.x > prevBox.x ? currentBox.x + currentBox.width : prevBox.x;

      restBox = {
        x: restX,
        y: currentBox.y,
        width: difference
      };
    }

    function drawBackground() {
      //Gradient from top to bottom
      const newGradient = $ctx.createLinearGradient(
        $canvas.width / 2,
        0,
        $canvas.width / 2,
        $canvas.height
      );
      newGradient.addColorStop(0, '#000');
      newGradient.addColorStop(1, 'darkblue');
      $ctx.fillStyle = newGradient;
      $ctx.fillRect(0, 0, $canvas.width, $canvas.height);
    }

    function boxBounceMoveAndCollision() {
      const currentBox = boxes[current];
      currentBox.x += speedX;

      const hitRightSide = currentBox.x + currentBox.width > $canvas.width;
      const hitLeftSide = currentBox.x < 0;

      if (hitRightSide || hitLeftSide) {
        speedX *= -1;
      }
    }

    function gameOver() {
      $ctx.fillStyle = '#f008';
      $ctx.fillRect(0, 0, $canvas.width, $canvas.height);
      $modal.classList.add('modal-open');
    }

    function boxFallCollision() {
      const currentBox = boxes[current];
      const previousBox = boxes[current - 1];
      currentBox.y -= speedY;

      //When the box fall
      if (previousBox.y + BOX_HEIGTH === currentBox.y) {
        const diffWidth = currentBox.x - previousBox.x;

        if (currentBox.x > previousBox.x) {
          currentBox.width -= diffWidth;
        } else {
          currentBox.width += diffWidth;
          currentBox.x = previousBox.x;
        }

        //Game Over
        if (Math.abs(diffWidth) > previousBox.width || currentBox.width < 2) {
          mode = MODES.GAME_OVER;
          gameOver();
          return;
        }

        createNewRestOfBox(diffWidth);
        current++;
        scrollCounter = BOX_HEIGTH;
        mode = MODES.BOX_BOUNCE;
        currentCounter++;
        updateCounter();
        createNexBox();
      }
    }

    function updateCamera() {
      if (scrollCounter > 0) {
        scrollCounter--;
        cameraY++;
      }
    }

    function drawGame() {
      if (mode === MODES.GAME_OVER) return;
      drawBackground();
      drawBoxes();
      drawRestOfBox();

      if (mode === MODES.BOX_BOUNCE) {
        boxBounceMoveAndCollision();
      } else if (mode === MODES.BOX_FALL) {
        boxFallCollision();
      }

      restBox.y -= speedY;
      updateCamera();
      animationFrameId = requestAnimationFrame(drawGame);
    }

    function initGame() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      initialGameState();
      drawGame();
    }

    //////////////////////EVENTS
    initGame();

    parentComponent.addEventListener('click', e => {
      if (
        e.target.matches('.again-game') ||
        (e.target.matches('.stack-tower') && mode === MODES.GAME_OVER)
      ) {
        $modal.classList.remove('modal-open');
        initGame();
      } else if (mode === MODES.BOX_BOUNCE && e.target.matches('.stack-tower')) {
        mode = MODES.BOX_FALL;
      }
    });

    document.addEventListener('again-stack-tower', e => {
      if ($modal.classList.contains('modal-open')) {
        $modal.classList.remove('modal-open');
        initGame();
      }
    });

    document.addEventListener('stack-tower-piece-fall', e => {
      mode = MODES.BOX_FALL;
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

      span {
        font-family: 'Press Start 2P', Arial;
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


     /*****************************STACK TOWER*****************************/
     .container-stack-tower {
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
    
      .score-stack-tower {
        position: absolute;
        gap: 6px;
        display: flex;
        flex-direction: column;
    
        span {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          user-select: none;
        }
    
        &.max-score-stack-tower {
          bottom: 6.5px;
          right: 6.5px;
          text-align: right;
        }
    
        &.current-score-stack-tower {
          top: 6.5px;
          left: 6.5px;
          text-align: left;
          flex-direction: column-reverse;
        }
      }
    
      .stack-tower {
        margin-inline: auto;
        background-color: #9ca04c;
      }
    
      .stack-modal {
        position: absolute;
        border-radius: 10px;
        top: 50%;
        left: 50%;
        width: 170px;
        height: 150px;
        display: flex;
        flex-direction: column;
        place-content: center;
        padding: 1rem;
        background-image: linear-gradient(to bottom, springgreen, orange);
          text-align: center;
        gap: 1rem;
        transition: transform 0.4s ease, opacity 0.4s ease;
        z-index: 30;
        zoom: 0.65;
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    
        &.modal-open {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
    
        .again-game {
          --duration: 7s;
          --easing: linear;
          --c-color-1: rgba(255, 163, 26, 0.7);
          --c-color-2: #1a23ff;
          --c-color-3: #e21bda;
          --c-color-4: rgba(255, 232, 26, 0.7);
          --c-shadow: rgba(255, 223, 87, 0.5);
          --c-shadow-inset-top: rgba(255, 223, 52, 0.9);
          --c-shadow-inset-bottom: rgba(255, 250, 215, 0.8);
          --c-radial-inner: #ffd215;
          --c-radial-outer: #fff172;
          --c-color: #fff;
          -webkit-tap-highlight-color: transparent;
          appearance: none;
          outline: none;
          position: relative;
          cursor: pointer;
          border: none;
          display: table;
          border-radius: 24px;
          padding: 0;
          margin: 0;
          text-align: center;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: 0.02em;
          line-height: 1.5;
          color: var(--c-color);
          background: radial-gradient(
            circle,
            var(--c-radial-inner),
            var(--c-radial-outer) 80%
          );
          box-shadow: 0 0 14px var(--c-shadow);
    
          * {
            pointer-events: none;
          }
        }
    
        .again-game:before {
          content: '';
          pointer-events: none;
          position: absolute;
          z-index: 3;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          box-shadow: inset 0 3px 12px var(--c-shadow-inset-top),
            inset 0 -3px 4px var(--c-shadow-inset-bottom);
        }
    
        .again-game .wrapper {
          mask-image: radial-gradient(white, black);
          overflow: hidden;
          border-radius: 24px;
          min-width: 132px;
          padding: 12px 0;
          align-content: center;
        }
    
        .again-game .wrapper span {
          display: inline-block;
          position: relative;
          z-index: 1;
          line-height: 100%;
          top: 5px;
        }
    
        .again-game:hover {
          --duration: 1400ms;
        }
    
        .again-game .wrapper .circle {
          position: absolute;
          left: 0;
          top: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          filter: blur(var(--blur, 8px));
          background: var(--background, transparent);
          transform: translate(var(--x, 0), var(--y, 0)) translateZ(0);
          animation: var(--animation, none) var(--duration) var(--easing) infinite;
        }
    
        .again-game .wrapper .circle.circle-1,
        .again-game .wrapper .circle.circle-9,
        .again-game .wrapper .circle.circle-10 {
          --background: var(--c-color-4);
        }
    
        .again-game .wrapper .circle.circle-3,
        .again-game .wrapper .circle.circle-4 {
          --background: var(--c-color-2);
          --blur: 14px;
        }
    
        .again-game .wrapper .circle.circle-5,
        .again-game .wrapper .circle.circle-6 {
          --background: var(--c-color-3);
          --blur: 16px;
        }
    
        .again-game .wrapper .circle.circle-2,
        .again-game .wrapper .circle.circle-7,
        .again-game .wrapper .circle.circle-8,
        .again-game .wrapper .circle.circle-11,
        .again-game .wrapper .circle.circle-12 {
          --background: var(--c-color-1);
          --blur: 12px;
        }
    
        .again-game .wrapper .circle.circle-1 {
          --x: 0;
          --y: -40px;
          --animation: circle-1;
        }
    
        .again-game .wrapper .circle.circle-2 {
          --x: 92px;
          --y: 8px;
          --animation: circle-2;
        }
    
        .again-game .wrapper .circle.circle-3 {
          --x: -12px;
          --y: -12px;
          --animation: circle-3;
        }
    
        .again-game .wrapper .circle.circle-4 {
          --x: 80px;
          --y: -12px;
          --animation: circle-4;
        }
    
        .again-game .wrapper .circle.circle-5 {
          --x: 12px;
          --y: -4px;
          --animation: circle-5;
        }
    
        .again-game .wrapper .circle.circle-6 {
          --x: 56px;
          --y: 16px;
          --animation: circle-6;
        }
    
        .again-game .wrapper .circle.circle-7 {
          --x: 8px;
          --y: 28px;
          --animation: circle-7;
        }
    
        .again-game .wrapper .circle.circle-8 {
          --x: 28px;
          --y: -4px;
          --animation: circle-8;
        }
    
        .again-game .wrapper .circle.circle-9 {
          --x: 20px;
          --y: -12px;
          --animation: circle-9;
        }
    
        .again-game .wrapper .circle.circle-10 {
          --x: 64px;
          --y: 16px;
          --animation: circle-10;
        }
    
        .again-game .wrapper .circle.circle-11 {
          --x: 4px;
          --y: 4px;
          --animation: circle-11;
        }
    
        .again-game .wrapper .circle.circle-12 {
          --blur: 14px;
          --x: 52px;
          --y: 4px;
          --animation: circle-12;
        }
      }
    }
    
    @keyframes circle-1 {
      33% {
        transform: translate(0px, 16px) translateZ(0);
      }
    
      66% {
        transform: translate(12px, 64px) translateZ(0);
      }
    }
    
    @keyframes circle-2 {
      33% {
        transform: translate(80px, -10px) translateZ(0);
      }
    
      66% {
        transform: translate(72px, -48px) translateZ(0);
      }
    }
    
    @keyframes circle-3 {
      33% {
        transform: translate(20px, 12px) translateZ(0);
      }
    
      66% {
        transform: translate(12px, 4px) translateZ(0);
      }
    }
    
    @keyframes circle-4 {
      33% {
        transform: translate(76px, -12px) translateZ(0);
      }
    
      66% {
        transform: translate(112px, -8px) translateZ(0);
      }
    }
    
    @keyframes circle-5 {
      33% {
        transform: translate(84px, 28px) translateZ(0);
      }
    
      66% {
        transform: translate(40px, -32px) translateZ(0);
      }
    }
    
    @keyframes circle-6 {
      33% {
        transform: translate(28px, -16px) translateZ(0);
      }
    
      66% {
        transform: translate(76px, -56px) translateZ(0);
      }
    }
    
    @keyframes circle-7 {
      33% {
        transform: translate(8px, 28px) translateZ(0);
      }
    
      66% {
        transform: translate(20px, -60px) translateZ(0);
      }
    }
    
    @keyframes circle-8 {
      33% {
        transform: translate(32px, -4px) translateZ(0);
      }
    
      66% {
        transform: translate(56px, -20px) translateZ(0);
      }
    }
    
    @keyframes circle-9 {
      33% {
        transform: translate(20px, -12px) translateZ(0);
      }
    
      66% {
        transform: translate(80px, -8px) translateZ(0);
      }
    }
    
    @keyframes circle-10 {
      33% {
        transform: translate(68px, 20px) translateZ(0);
      }
    
      66% {
        transform: translate(100px, 28px) translateZ(0);
      }
    }
    
    @keyframes circle-11 {
      33% {
        transform: translate(4px, 4px) translateZ(0);
      }
    
      66% {
        transform: translate(68px, 20px) translateZ(0);
      }
    }
    
    @keyframes circle-12 {
      33% {
        transform: translate(56px, 0px) translateZ(0);
      }
    
      66% {
        transform: translate(60px, -32px) translateZ(0);
      }
     }
    }
    `;
  }

  connectedCallback() {
    this.render();
    this.playStackTower();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyScreen.styles}</style>
    <div class="container schemeCrystal">
           <section class="start-game stack-tower-the-game active-game">
          <section class="container-stack-tower">
              <canvas class="stack-tower" width="320" height="500"></canvas>
              <output class="score-stack-tower max-score-stack-tower">
                <span class="top-score"> 0 </span>
                <span class="bottom-score"> MAX </span>
              </output>
              <output class="score-stack-tower current-score-stack-tower">
                <span class="top-score"> 0 </span>
                <span class="bottom-score"> NOW </span>
              </output>
              <aside class="stack-modal">
                <h2>GAME OVER</h2>
                <button class="again-game">
                  <div class="wrapper">
                    <span>AGAIN</span>
                    <div class="circle circle-12"></div>
                    <div class="circle circle-11"></div>
                    <div class="circle circle-10"></div>
                    <div class="circle circle-9"></div>
                    <div class="circle circle-8"></div>
                    <div class="circle circle-7"></div>
                    <div class="circle circle-6"></div>
                    <div class="circle circle-5"></div>
                    <div class="circle circle-4"></div>
                    <div class="circle circle-3"></div>
                    <div class="circle circle-2"></div>
                    <div class="circle circle-1"></div>
                  </div>
                </button>
              </aside>
          </section>
        </section>
    </div>`;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
