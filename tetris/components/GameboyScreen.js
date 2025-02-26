class GameboyScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  playTetris() {
    const $ = el => this.shadowRoot.querySelector(el);
    const parentComponent = $('div.container');
    const $canvas = $('.game-tetris');
    const context = $canvas.getContext('2d');
    const $cubeBaseImg = $('.cube-base');
    const $score = $('.score');
    const $modal = $('.modal');
    const $lineOutput = $('.line-output');
    const $levelOutput = $('.level-output');

    //MUSIC TETRIS
    const $audio = document.createElement('audio');
    $audio.src = 'assets/music/tetris.mp3';
    $audio.loop = true;
    document.addEventListener('play-music', e => {
      if ($('.tetris-the-game').classList.contains('active-game')) {
        $audio.play();
      }
    });

    document.addEventListener('pause-music', e => {
      $audio.pause();
    });

    const blocksize = 13;
    const boardWidth = 18;
    const boardHeight = 28;
    let contador = 0;
    let counterLines = 0;
    let counterLevel = 1;
    let timeOfFall = 500;

    $canvas.width = blocksize * boardWidth;
    $canvas.height = blocksize * boardHeight;

    context.scale(blocksize, blocksize);

    let boardMatrix = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    let initialBoardMatrix = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const allPieces = [
      [
        [0, 1, 0],
        [1, 1, 1]
      ],
      [
        [1, 1, 1],
        [1, 0, 0]
      ],
      [[1, 1, 1, 1]],
      [
        [1, 1, 0],
        [0, 1, 1]
      ]
    ];

    const piece = {
      position: { x: 8, y: 5 },
      shape: [
        [1, 1],
        [1, 1]
      ]
    };

    /*******************FUNCTIONS*******************/

    function draw() {
      context.clearRect(0, 0, $canvas.width, $canvas.height);

      boardMatrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value === 1) {
            context.drawImage($cubeBaseImg, 0, 0, 61, 61, x, y, 1, 1);
          }
        });
      });

      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            context.drawImage(
              $cubeBaseImg,
              0,
              0,
              61,
              61,
              piece.position.x + x,
              piece.position.y + y,
              1,
              1
            );
          }
        });
      });
    }

    function detectCollision() {
      return piece.shape.find((row, y) => {
        return row.find((value, x) => {
          return (
            value === 1 &&
            boardMatrix?.[y + piece.position.y]?.[x + piece.position.x] !== 0
          );
        });
      });
    }

    function newShape() {
      let newShape = allPieces[~~(Math.random() * allPieces.length)];
      let maxCorX = boardWidth - newShape[0].length;
      let posX = ~~(Math.random() * (maxCorX - 1));

      piece.shape = newShape;
      piece.position = { x: posX, y: 0 };

      if (detectCollision()) {
        $modal.classList.add('open');
      }
    }

    function solidifyPiece() {
      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value === 1) {
            boardMatrix[piece.position.y + y][piece.position.x + x] = 1;
          }
        });
      });
    }

    function deleteRows() {
      let rowsToDelete = [];
      boardMatrix.forEach((row, y) => {
        if (row.every(cell => cell === 1)) {
          rowsToDelete.push(y);
        }
      });

      rowsToDelete.toReversed().forEach(y => {
        boardMatrix.splice(y, 1);

        let newRow = Array(boardWidth).fill(0);
        boardMatrix.unshift(newRow);
      });

      let nPoints = rowsToDelete.length;
      Array.from({ length: nPoints }, (_, i) => {
        contador += ~~(Math.random() * 101) + 20;
        counterLines += 1;
      });

      $score.innerHTML = contador;
      $lineOutput.innerHTML = counterLines;
    }

    setInterval(() => {
      counterLevel++;
      timeOfFall -= 50;
      $levelOutput.innerHTML = counterLevel;
    }, 120000);

    let dropTime = 0;
    let lastTime = 0;

    function update(time = 0) {
      let deltaTime = time - lastTime;
      lastTime = time;
      dropTime += deltaTime;

      if (dropTime > timeOfFall) {
        piece.position.y++;

        if (detectCollision()) {
          piece.position.y--;
          solidifyPiece();
          deleteRows();
          newShape();
        }

        dropTime = 0;
      }

      draw();
      requestAnimationFrame(update);
    }

    update();

    /*******************EVENTS*******************/
    document.addEventListener('keydown', ({ key }) => {
      if (key === 'ArrowDown' || key === 'S' || key === 's') {
        piece.position.y++;
        if (detectCollision()) {
          piece.position.y--;
          solidifyPiece();
          deleteRows();
          newShape();
        }
      }
      if (key === 'ArrowLeft' || key === 'A' || key === 'a') {
        piece.position.x--;
        if (detectCollision()) {
          piece.position.x++;
        }
      }

      if (key === 'ArrowRight' || key === 'D' || key === 'd') {
        piece.position.x++;
        if (detectCollision()) {
          piece.position.x--;
        }
      }

      if (key === 'ArrowUp' || key === 'W' || key === 'w') {
        const shapeRotated = [];

        for (let col = 0; col < piece.shape[0].length; col++) {
          let rowShape = [];

          for (let row = piece.shape.length - 1; row >= 0; row--) {
            rowShape.push(piece.shape[row][col]);
          }

          shapeRotated.push(rowShape);
        }

        let previousShape = piece.shape;
        piece.shape = shapeRotated;

        if (detectCollision()) {
          piece.shape = previousShape;
        }
      }
    });

    document.addEventListener('tetris-rotate-piece', () => {
      const shapeRotated = [];

      for (let col = 0; col < piece.shape[0].length; col++) {
        let rowShape = [];

        for (let row = piece.shape.length - 1; row >= 0; row--) {
          rowShape.push(piece.shape[row][col]);
        }

        shapeRotated.push(rowShape);
      }

      let previousShape = piece.shape;
      piece.shape = shapeRotated;

      if (detectCollision()) {
        piece.shape = previousShape;
      }
    });

    document.addEventListener('tetris-button-right', () => {
      piece.position.x++;
      if (detectCollision()) {
        piece.position.x--;
      }
    });

    document.addEventListener('tetris-button-left', () => {
      piece.position.x--;
      if (detectCollision()) {
        piece.position.x++;
      }
    });
    
    document.addEventListener('tetris-button-bottom', () => {
      piece.position.y++;
      if (detectCollision()) {
        piece.position.y--;
        solidifyPiece();
        deleteRows();
        newShape();
      }
    });

    document.addEventListener('again-tetris', e => {
      let modal = $('.modal');
      if (modal.classList.contains('open')) {
        modal.classList.remove('open');
        contador = 0;
        counterLines = 0;
        counterLevel = 1;
        timeOfFall = 500;
        boardMatrix = structuredClone(initialBoardMatrix);
        $score.innerHTML = contador;
        $lineOutput.innerHTML = counterLines;
        $levelOutput.innerHTML = counterLevel;
      }
    });

    parentComponent.addEventListener('click', ({ target }) => {
      if (target.matches('.again')) {
        let modal = target.closest('.modal');
        modal.classList.remove('open');
        contador = 0;
        counterLines = 0;
        counterLevel = 1;
        timeOfFall = 500;
        boardMatrix = structuredClone(initialBoardMatrix);
        $score.innerHTML = contador;
        $lineOutput.innerHTML = counterLines;
        $levelOutput.innerHTML = counterLevel;
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

      /*****************************TETRIS*****************************/

      .scheme-canvas {
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
      
        .barra {
          width: 10px;
          height: 100%;
          background-image: url('assets/tetris/bg-repeat.png');
          background-size: 10px;
        }
      
        canvas {
          width: 120px;
          height: 180px;
          background-color: #ffffff30;
        }
      
        .score-match {
          --current-black: #0008;
          --current-green: #c2cda2;
          display: flex;
          flex-direction: column;
          background-color: #444;
          height: 100%;
          flex-grow: 1;
          position: relative;
      
          .titulo {
            height: 35px;
            width: 100%;
            background-image: url('assets/tetris/tetris-logo.avif');
            background-size: contain;
            background-color: #555;
            background-repeat: no-repeat;
          }
      
          .line-green {
            width: 100%;
            height: 1.5px;
            background-color: var(--current-green);
          }
      
          .fondo {
            background-color: #444;
            height: 15px;
          }
      
          .letrero-score {
            position: absolute;
            top: 30px;
            left: 0;
            text-align: center;
            width: 65%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 9px;
            color: var(--current-black);
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            background-color: var(--current-green);
            border: 1px solid var(--current-black);
            outline: 2px solid var(--current-green);
            border-radius: 999px;
          }
      
          .score {
            width: 100%;
            height: 25px;
            margin-inline: auto;
            position: relative;
            background-color: var(--current-green);
            font-family: 'Score', sans-serif;
            color: var(--current-black);
            display: flex;
            font-size: 16px;
            flex-wrap: wrap;
            place-content: center;
            border-block: 2px solid #000;
          }
      
          .stack-green {
            position: absolute;
            width: 60%;
            padding: 0.2rem;
            display: flex;
            flex-direction: column;
            left: 50%;
            text-align: right;
            color: var(--current-black);
            border: 1px solid var(--current-black);
            background-color: var(--current-green);
            transform: translateX(-50%) scale(0.9);
            border-radius: 4px;
            outline: 2px solid var(--current-green);
            font-size: 9px;
      
            output,
            header {
              letter-spacing: 1px;
              font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            }
            
            &.levels {
              top: 99px;
            }
      
            &.lines {
              top: 135px;
            }
          }
        }
      
        .modal {
          border: none;
          border-radius: 10px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.5s ease;
          background-color: #ccc;
          padding: 1rem;
      
          &.open {
            transform: translate(-50%, -50%) scale(1);
          }
      
          &::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, #b587e6, #d169d1);
            background: linear-gradient(90deg, springgreen, #9ca04c);
            filter: blur(30px);
          }
      
          .container-modal {
            padding-block: 0.3rem;
            width: 80px;
            display: flex;
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
      
            h2 {
              z-index: 20;
              font-size: 13px;
            }
      
            button {
              width: 30px;
              height: 30px;
              outline: none;
              border: none;
              border-radius: 50%;
              margin-inline: auto;
              display: flex;
              flex-wrap: wrap;
              place-content: center;
              padding: 0.2rem;
              transform: scale(1);
              transition: opacity 0.2s linear;
      
              &:hover {
                opacity: 0.7;
              }
            }
      
            img {
              width: 80%;
              height: 80%;
              pointer-events: none;
            }
          }
        }
        
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.playTetris();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyScreen.styles}</style>
    <div class="container schemeCrystal">
      <article class="start-game tetris-the-game active-game">
          <section class="scheme-canvas">
              <div class="barra barra-left"></div>
              <canvas class="game-tetris" width="120" height="150"></canvas>
              <div class="barra barra-right"></div>
              <aside class="score-match">
                <header class="titulo"></header>
                <div class="line-green"></div>
                <aside class="fondo"></aside>
                <article class="letrero-score">SCORE</article>
                <div class="line-green"></div>
                <aside class="score">0</aside>
                <div class="line-green"></div>
                <article class="levels stack-green">
                  <header>LEVEL</header>
                  <output class="level-output">1</output>
                </article>
                <article class="lines stack-green">
                  <header>LINES</header>
                  <output class="line-output">0</output>
                </article>
              </aside>
              <aside class="modal">
                <article class="container-modal">
                  <h2>GAME OVER</h2>
                  <button class="again">
                    <img src="assets/tetris/again.png" alt="again game" />
                  </button>
                </article>
              </aside>
          </section>

          <img
              hidden
              class="cube-base"
              src="assets/tetris/cubeBase.png"
              alt="cube base"
          />
        </article>
    </div>`;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
