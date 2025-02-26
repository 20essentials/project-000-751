class GameboyScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  playRetroid() {
    const $ = el => this.shadowRoot.querySelector(el);
    const parentComponent = $('div.container');
    const canvas = $('.retroid-canvas');
    const ctx = canvas.getContext('2d');
    const $globalSprite = $('.general-sprite');
    const $bricksSprite = $('.bricks-sprite');
    const modal = $('.modal-retroid');
    const message = modal.querySelector('.message');

    const ballRadius = 3;
    let colorBall = '#fff';
    let xCoordinateBall = canvas.width / 2;
    let yCoordinateBall = canvas.height - 46;
    let growBallInX = -1.5;
    let growBallInY = -1.5;

    function drawBall() {
      ctx.beginPath();
      ctx.fillStyle = colorBall;
      ctx.arc(xCoordinateBall, yCoordinateBall, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }

    function ballMovement() {
      if (
        xCoordinateBall + growBallInX > canvas.width - ballRadius ||
        xCoordinateBall + growBallInX < ballRadius
      ) {
        growBallInX = -growBallInX;
      }
      if (yCoordinateBall + growBallInY < ballRadius) {
        growBallInY = -growBallInY;
      }
      if (
        xCoordinateBall > paddleX &&
        xCoordinateBall < paddleX + paddleWidth &&
        yCoordinateBall > paddleY &&
        yCoordinateBall < paddleY + ballRadius
      ) {
        growBallInY = -growBallInY;
      } else if (yCoordinateBall + growBallInY > canvas.height - ballRadius) {
        modal.classList.add('modal-open');
      }
      xCoordinateBall += growBallInX;
      yCoordinateBall += growBallInY;
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const paddleWidth = 42;
    const paddleHeight = 14;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let paddleY = canvas.height - 20;
    let keyCapLeftPressed = false;
    let keyCapRightPressed = false;
    let growPaddleInX = 7;

    function drawPaddle() {
      ctx.drawImage(
        $globalSprite,
        28,
        173,
        paddleWidth + 10,
        paddleHeight,
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight
      );
    }

    function initEvents() {
      document.addEventListener('keydown', handleKeydown);
      document.addEventListener('keyup', handleKeyUp);

      function handleKeydown({ key }) {
        if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
          keyCapLeftPressed = true;
        } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
          keyCapRightPressed = true;
        }
      }

      function handleKeyUp({ key }) {
        if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
          keyCapLeftPressed = false;
        } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
          keyCapRightPressed = false;
        }
      }

      document.addEventListener('retroid-button-right', () => {
        keyCapRightPressed = true;
      });

      document.addEventListener('retroid-button-right-mouseup', () => {
        keyCapRightPressed = false;
      });

      document.addEventListener('retroid-button-left', () => {
        keyCapLeftPressed = true;
      });
      document.addEventListener('retroid-button-left-click', () => {
        keyCapLeftPressed = true;
        setTimeout(() => keyCapLeftPressed = false, 50);
      });
      document.addEventListener('retroid-button-right-click', () => {
        keyCapRightPressed = true;
        setTimeout(() => keyCapRightPressed = false, 50);
      });

      document.addEventListener('retroid-button-left-mouseup', () => {
        keyCapLeftPressed = false;
      });
    }

    const bricksColumnCount = 9;
    const bricksRowCount = 5;
    const brickWidth = 15;
    const brickHeight = 10;
    const brickPadding = 2;
    const brickOffsetLeft = 32;
    const brickOffsetTop = 20;
    const STATUS = {
      ACTIVE: 1,
      DESTROYED: 0
    };
    let bricks = [];

    function generateBricks() {
      for (let c = 0; c < bricksColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < bricksRowCount; r++) {
          const brickX = c * (brickPadding + brickWidth) + brickOffsetLeft;
          const brickY = r * (brickPadding + brickHeight) + brickOffsetTop;
          const randomColor = Math.floor(Math.random() * 8);
          bricks[c][r] = {
            x: brickX,
            y: brickY,
            color: randomColor,
            status: STATUS.ACTIVE
          };
        }
      }
    }

    generateBricks();

    function drawBricks() {
      for (let c = 0; c < bricksColumnCount; c++) {
        for (let r = 0; r < bricksRowCount; r++) {
          const currentBrick = bricks[c][r];
          if (currentBrick.status === STATUS.DESTROYED) continue;
          ctx.drawImage(
            $bricksSprite,
            currentBrick.color * 32,
            0,
            32,
            14,
            currentBrick.x,
            currentBrick.y,
            brickWidth,
            brickHeight
          );
        }
      }
    }

    function collisionDetectionBricks() {
      let arrayDeStatus = [];

      for (let c = 0; c < bricksColumnCount; c++) {
        for (let r = 0; r < bricksRowCount; r++) {
          let newArray = bricks.flat(2);
          const currentBrick = bricks[c][r];
          if (currentBrick.status === STATUS.DESTROYED) continue;
          if (
            xCoordinateBall > currentBrick.x &&
            xCoordinateBall < currentBrick.x + brickWidth &&
            yCoordinateBall > currentBrick.y &&
            yCoordinateBall < currentBrick.y + brickHeight
          ) {
            growBallInY = -growBallInY;
            currentBrick.status = STATUS.DESTROYED;
          }
        }
      }

      for (let c = 0; c < bricksColumnCount; c++) {
        for (let r = 0; r < bricksRowCount; r++) {
          arrayDeStatus.push(bricks[c][r].status);
        }
      }

      let allBricksDestroyed = arrayDeStatus.every(status => status === 0);
      if (allBricksDestroyed) {
        message.innerHTML = 'You win 🏆';
        colorBall = 'transparent';
        modal.classList.add('modal-open');
      }
    }

    function paddleMovement() {
      if (keyCapLeftPressed && paddleX > 0) {
        paddleX -= growPaddleInX;
      } else if (keyCapRightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += growPaddleInX;
      }
    }

    function drawCanvas() {
      clearCanvas();
      drawBall();
      drawBricks();
      drawPaddle();
      collisionDetectionBricks();
      paddleMovement();
      ballMovement();
      requestAnimationFrame(drawCanvas);
    }

    drawCanvas();
    initEvents();

    function resetStateRetroid() {
      bricks = [];
      generateBricks();
      message.innerHTML = 'You Lost!';
      colorBall = '#fff';
      modal.classList.remove('modal-open');
      const numRandom = Math.floor(Math.random() * 20) * -1;
      xCoordinateBall = canvas.width / 2;
      yCoordinateBall = canvas.height / 2 + numRandom;
    }

    parentComponent.addEventListener('click', e => {
      if (e.target.matches('.button-play-again')) {
        resetStateRetroid();
      }
    });

    document.addEventListener('again-retroid', e => {
      if (modal.classList.contains('modal-open')) {
        resetStateRetroid();
      }
    });

    //MUSIC RETROID
    const $audio = document.createElement('audio');
    $audio.src = 'assets/music/retroid.mp3';
    $audio.loop = true;
    document.addEventListener('play-music', e => {
      $audio.play();
    });

    document.addEventListener('pause-music', e => {
      $audio.pause();
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

      /*****************************RETROID*****************************/
      .container-retroid {
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
        position: relative;
      
        canvas {
          background-color: black;
          background-image: linear-gradient(to bottom, darkgreen, black);
        }
      
        .modal-retroid {
          width: 120px;
          height: 100px;
          border-radius: 16px;
          background-image: linear-gradient(45deg, springgreen, magenta);
          scale: 0;
          opacity: 0;
          padding: 0.6rem;
          position: absolute;
          top: calc(50% - 60px);
          left: calc(50% - 68px);
          transition: scale 0.3s ease, opacity 0.3s ease;
      
          &.modal-open {
            scale: 1;
            opacity: 1;
          }
      
          .container-modal {
            padding: 0.2rem;
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            text-transform: uppercase;
            letter-spacing: 2px;
            word-spacing: 4px;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
      
            h2 {
              color: transparent;
              background-image: linear-gradient(to left, springgreen, white, magenta);
              background-clip: text;
              font-size: 15px;
              text-align: center;
            }
      
            button {
              padding: 0.3rem 0.6rem;
              border-radius: 999px;
              border: none;
              outline: none;
              background-color: #e9e9e9;
              opacity: 1;
              transition: opacity 0.4s ease;
      
              &:hover {
                opacity: 0.6;
              }
            }
          }
        }
      }
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.playRetroid();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyScreen.styles}</style>
    <div class="container schemeCrystal">
      <article class="start-game retroid-the-game active-game">
            <section class="container-retroid">
              <canvas width="210" height="180" class="retroid-canvas"></canvas>
              <aside class="modal-retroid">
                <div class="container-modal">
                  <h2 class="message">You Lost!</h2>
                  <button class="button-play-again">Play again</button>
                </div>
              </aside>
            </section>

          <img
            class="general-sprite"
            hidden
            src="assets/retroid/arkanoid-sprite.png"
            alt="arkanoid sprite"
          />
          <img
            class="bricks-sprite"
            hidden
            src="assets/retroid/bricks-sprite.png"
            alt="bricks sprite"
          />
        </article>
    </div>`;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
