class GameboyScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  playPong() {
    const $ = el => this.shadowRoot.querySelector(el);
    const $canvas = $('.pong-game');
    const ctx = $canvas.getContext('2d');
    const $width = ($canvas.width = 210);
    const $height = ($canvas.height = 180);
    const $canvasHalfWidth = $canvas.width / 2;

    let delay = generateDelayOfIA();
    let playerLeftCounter = 0;
    let playerRightCounter = 0;

    //MUSIC PONG
    const $audio = document.createElement('audio');
    $audio.src = 'assets/music/pong.mp3';
    $audio.loop = true;
    document.addEventListener('play-music', e => {
      $audio.play();
    });

    document.addEventListener('pause-music', e => {
      $audio.pause();
    });

    function showCounter(playerLeftCounter, playerRightCounter) {
      ctx.fillStyle = '#fff';
      ctx.font = '28px Symtext';
      ctx.textAlign = 'center';

      ctx.fillText(playerLeftCounter, $canvasHalfWidth / 2 + 3, 40);

      ctx.fillText(
        playerRightCounter,
        $canvasHalfWidth + $canvasHalfWidth / 2 + 3,
        40
      );
    }

    //Paddle Variables
    const paddleOffsetLeft = 7;
    const paddleWidth = 7;
    const paddleHeight = 32;
    const paddleColor = '#fff';
    //PaddleLeft
    let paddleX = paddleOffsetLeft;
    let paddleY = ($height - paddleHeight) / 2;
    //PadleRight
    let paddleXRight = $width - paddleOffsetLeft - paddleWidth;
    let paddleYRight = ($height - paddleHeight) / 2;
    //Keys Variables of PaddleLeft
    let keyCapWpressed = false;
    let keyCapSpressed = false;
    //Keys Variables of paddLeRight
    let keyCapArrowUp = false;
    let keyCapArrowDown = false;

    //Ball Variables
    const ballWidth = 7;
    const ballColor = paddleColor;
    let ballX = $canvasHalfWidth;
    let ballY = ($height - ballWidth) / 2;
    let dirBallX = -2;
    let dirBallY = -2;

    if (window.innerWidth < 1000) {
      dirBallX = -1;
      dirBallY = -1;
    }

    function drawPaddleLeft() {
      ctx.fillStyle = paddleColor;
      ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
    }

    function drawPaddleRight() {
      ctx.fillStyle = paddleColor;
      ctx.fillRect(paddleXRight, paddleYRight, paddleWidth, paddleHeight);
    }

    document.addEventListener('pong-paddel-to-top-click', () => {
      keyCapWpressed = true;
      setTimeout(() => (keyCapWpressed = false), 20);
    });

    document.addEventListener('pong-paddel-to-top-mouseup', () => {
      keyCapWpressed = false;
    });

    document.addEventListener('pong-paddel-to-top', () => {
      keyCapWpressed = true;
    });

    document.addEventListener('pong-paddel-to-bottom-mouseup', () => {
      keyCapSpressed = false;
    });

    document.addEventListener('pong-paddel-to-bottom', () => {
      keyCapSpressed = true;
    });

    document.addEventListener('pong-paddel-to-bottom-click', () => {
      keyCapSpressed = true;
      setTimeout(() => (keyCapSpressed = false), 20);
    });

    function initKeyEvents() {
      document.addEventListener('keydown', ({ key }) => {
        if (key === 'W' || key === 'w') {
          keyCapWpressed = true;
        } else if (key === 'S' || key === 's') {
          keyCapSpressed = true;
        }

        if (key === 'ArrowUp') {
          keyCapArrowUp = true;
        } else if (key === 'ArrowDown') {
          keyCapArrowDown = true;
        }
      });

      document.addEventListener('keyup', ({ key }) => {
        if (key === 'W' || key === 'w') {
          keyCapWpressed = false;
        } else if (key === 'S' || key === 's') {
          keyCapSpressed = false;
        }

        if (key === 'ArrowUp') {
          keyCapArrowUp = false;
        } else if (key === 'ArrowDown') {
          keyCapArrowDown = false;
        }
      });
    }

    function paddleLeftAndRightMovement() {
      if (keyCapWpressed && paddleY > 1) {
        paddleY -= 8;
      } else if (keyCapSpressed && paddleY < $height - paddleHeight - 1) {
        paddleY += 8;
      }

      if (keyCapArrowUp && paddleYRight > 1) {
        paddleYRight -= 8;
      } else if (keyCapArrowDown && paddleYRight < $height - paddleHeight - 1) {
        paddleYRight += 8;
      }
    }

    function generateDelayOfIA() {
      return [-1, -2, -3, -4, -1, -5][~~[Math.random() * 6]];
    }

    function paddleLeftAndRight_IA(delay) {
      if (keyCapWpressed && paddleY > 1) {
        paddleY -= 8;
      } else if (keyCapSpressed && paddleY < $height - paddleHeight - 1) {
        paddleY += 8;
      }
      paddleYRight = ballY + paddleHeight / delay;
    }

    function reseteo() {
      ballX = $canvasHalfWidth;
      ballY = ($height - ballWidth) / 2;
    }

    function drawBall() {
      ctx.fillStyle = ballColor;
      ctx.fillRect(ballX, ballY, ballWidth, ballWidth);
    }

    function ballMovement() {
      //Paddle Left
      let paddleTopRight = paddleX + paddleWidth;
      let paddleBottomLeft = paddleY + paddleHeight;
      //Paddle Right
      let paddleTopRight2 = paddleXRight + paddleWidth;
      let paddleBottomLeft2 = paddleYRight + paddleHeight;

      if (
        ballX < paddleTopRight - 1 &&
        ballX > paddleX &&
        ballY > paddleY &&
        ballY < paddleBottomLeft
        //If it bounces to the right of the left paddle
      ) {
        dirBallX = -dirBallX;
      } else if (
        ballX >= paddleX &&
        ballX <= paddleTopRight + 3 &&
        ballY === paddleY - ballWidth
      ) {
        // If it bounces to the top of the paddle left
        dirBallX = -dirBallX;
      } else if (
        ballX >= paddleX &&
        ballX <= paddleTopRight + 3 &&
        ballY === paddleBottomLeft
      ) {
        // If it bounces to the bottom of the paddle left
        dirBallX = -dirBallX;
      } else if (
        ballX + ballWidth < paddleTopRight2 - 1 &&
        ballX + ballWidth > paddleXRight &&
        ballY > paddleYRight &&
        ballY < paddleBottomLeft2
        //If it bounces to the left of the right paddle
      ) {
        dirBallX = -dirBallX;
      } else if (
        //If it bounces to the top of the right paddle
        ballX + ballWidth <= paddleXRight + ballWidth + 3 &&
        ballX + ballWidth >= paddleXRight - 3 &&
        ballY <= paddleYRight - ballWidth &&
        ballY >= paddleYRight - ballWidth - 3
      ) {
        // If it bounces to the top of the paddle right
        dirBallX = -dirBallX;
      } else if (
        ballX + ballWidth <= paddleXRight + ballWidth + 3 &&
        ballX + ballWidth >= paddleXRight - 3 &&
        ballY >= paddleYRight + ballWidth &&
        ballY <= paddleYRight + ballWidth + 3
      ) {
        // If it bounces to the bottom of the paddle right
        dirBallX = -dirBallX;
      } else if (ballY < 0) {
        //top total
        dirBallY = -dirBallY;
      } else if (ballY > $height - ballWidth) {
        //bottom total
        dirBallY = -dirBallY;
      } else if (ballX < 0) {
        //left total
        playerRightCounter++;
        showCounter(playerLeftCounter, playerRightCounter);
        delay = generateDelayOfIA();
        reseteo();
      } else if (ballX > $width - ballWidth) {
        //right total
        playerLeftCounter++;
        showCounter(playerLeftCounter, playerRightCounter);
        delay = generateDelayOfIA();
        reseteo();
      }
      ballX += dirBallX;
      ballY += dirBallY;
    }

    function backgroundBlackAndWhiteLines() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, $width, $height);
      ctx.fillStyle = '#fff';
      const widthLine = 3;
      const heightLine = 15;
      const padding = 10;
      const rows = Math.floor($height / 25);

      for (let row = 0; row < rows; row++) {
        ctx.fillStyle = '#000';
        ctx.fillRect($canvasHalfWidth, row * 30, widthLine, padding);
        ctx.fillStyle = '#fff';
        ctx.fillRect($canvasHalfWidth, padding + row * 30, widthLine, heightLine);
      }
    }

    const clearBackground = () => ctx.clearRect(0, 0, $width, $height);

    function gameOnePlayer() {
      clearBackground();
      backgroundBlackAndWhiteLines();
      drawPaddleLeft();
      drawPaddleRight();
      drawBall();
      ballMovement();
      showCounter(playerLeftCounter, playerRightCounter);
      paddleLeftAndRight_IA(delay);

      requestAnimationFrame(gameOnePlayer);
    }

    document.addEventListener('DOMContentLoaded', () => {});

    backgroundBlackAndWhiteLines();
    initKeyEvents();
    gameOnePlayer(delay);
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


       /*****************************PONG*****************************/

       .pong-scheme {
        content-visibility: auto;
        --width: 210px;
        --height: 180px;
        background: #9ca04c;
        box-shadow: 5px 5px 10px #0008 inset, -2px -1px 10px #0005 inset,
          0 0 4px 3px #aaa4;
        width: var(--width);
        height: var(--height);
        overflow: hidden;
        position: relative;
      }      
       
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.playPong();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyScreen.styles}</style>
    <div class="container schemeCrystal">
        <section class="start-game pong-the-game active-game">
          <section class="pong-scheme">
            <canvas class="pong-game"></canvas>
          </section>
        </section>
    </div>`;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
