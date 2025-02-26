class GameboyScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.matriz = [
      [1, 2, 3],
      [4, 5, 6]
    ];
    this.posX = 0;
    this.posY = 0;
    this.temporalX = 0;
    this.temporalY = 0;
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

      .scene {
        display: grid;
        place-content: center;
        width: 100%;
        height: 100%;
        text-align: center;
        
        & span {
          font-family: "Press Start 2P", sans-serif;
          font-weight: bold;
          font-size: 16px;
          letter-spacing: -.7px;
          color: #0f380f;
          display: block;
          width: 100%;
          

          & sup {
            font-weight: normal;
            font-size: 10px;
          }
        }
      }

      .intro,
      .games {
        transform: translateY(-100%);
        transition: transform .5s ease, opacity .5s ease;
        opacity: 0;
        display: none;

        &.open {
          transform: translateY(0%);
          opacity: 1;
          display: grid;
        }
      }

      .games {
        display: none;
        grid-template-columns: repeat(3, 50px);
        gap: 8px;

        .game {
          width: 50px;
          heigth: 50px;
          box-shadow: inset -4px -4px 3px #fff, inset 4px 4px 3px #000, 0 0 3px 1px #0008;
          text-decoration: none;

          &:hover,
          &.box-active {
            filter: contrast(120%) brightness(110%) saturate(120%);
            box-shadow: inset -4px -4px 3px #fff, inset 4px 4px 3px #000, 0 0 5px 5px #0002;
          }

          &.box-active {
            outline: 3px solid #f008;
          }

          img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
            transition: filter .3s ease-in-out;
            pointer-events: none;
            cursor: pointer;
          }
        }
      }

      
      }
    `;
  }

  giveFocusToAnchor(bandera = false) {

    const $ = el => this.shadowRoot.querySelector(el);
    const $$ = el => this.shadowRoot.querySelectorAll(el);
    const matrizValue = this.matriz?.[this.posY]?.[this.posX];
    let value = null;
    if (matrizValue) {
      [this.temporalX, this.temporalY] = [this.posX, this.posY];
      value = matrizValue;
      const $audio = document.createElement('audio');
      $audio.src = 'assets/pop.mp3';
      $audio.volume = '0.5';
      $audio.play();
    } else {
      const prevMatrizValue = this.matriz?.[this.temporalY]?.[this.temporalX];
      [this.posX, this.posY] = [this.temporalX, this.temporalY];
      value = prevMatrizValue;
    }
    const $box = $(`.box-${value}`);
    $$('.box-active').forEach(el => el.classList.remove('box-active'));
    $box.classList.add('box-active');
    if (bandera) {
      $box.click();
    }
  }

  addListeners() {
    document.addEventListener('box-up', () => {
      this.posY--;
      this.giveFocusToAnchor();
    });
    document.addEventListener('box-down', () => {
      this.posY++;
      this.giveFocusToAnchor();
    });
    document.addEventListener('box-left', () => {
      this.posX--;
      this.giveFocusToAnchor();
    });
    document.addEventListener('box-right', () => {
      this.posX++;
      this.giveFocusToAnchor();
    });
    document.addEventListener('box-click', () => {
      let bandera = true;
      this.giveFocusToAnchor(bandera);

    });
  }

  keyEvents() {
    document.addEventListener('keydown', ({ key }) => {
      if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        this.posX++;
        this.giveFocusToAnchor();
      } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        this.posX--;
        this.giveFocusToAnchor();
      } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
        this.posY++;
        this.giveFocusToAnchor();
      } else if (key === 'ArrowUp' || key === 'w' || key === 'W') {
        this.posY--;
        this.giveFocusToAnchor();
      }
    });
  }

  connectedCallback() {
    this.render();
    this.keyEvents();
    this.addListeners();
    this.shadowRoot.querySelector('.box-1').classList.add('box-active');
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyScreen.styles}</style>
    <div class="container schemeCrystal">
      <aside class="scene games open">
        <a tabindex="1" class="game box-1" href="../tetris/" blank="_self">
          <img src="assets/portada-tetris.avif" alt="tetris game">
        </a>
        <a tabindex="2" class="game box-2" href="../pacman/" blank="_self">
          <img src="assets/portada-pacman.avif" alt="pacman game">
        </a>
        <a tabindex="3" class="game box-3" href="../retroid/" blank="_self">
          <img src="assets/portada-retroid-or-arkanoid.avif" alt="retroid game">
        </a>
        <a tabindex="4" class="game box-4" href="../snake/" blank="_self">
          <img src="assets/portada-snake.avif" alt="snake game">
        </a>
        <a tabindex="5" class="game box-5" href="../stackTower/" blank="_self">
          <img src="assets/portada-stack-tower.avif" alt="stack tower game">
        </a>
        <a tabindex="6" class="game box-6" href="../pong/" blank="_self">
          <img src="assets/portada-pong.avif" alt="pong game">
        </a>
      </aside>
    </div>`;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
