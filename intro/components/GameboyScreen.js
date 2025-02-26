class GameboyScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['on'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'on') {
      const isON = newValue === 'true';
      const $intro = this?.shadowRoot?.querySelector('.intro');
      if ($intro) {
        $intro?.classList?.toggle('open', isON);
      }

      if (isON) {
        const $audio = document.createElement('audio');
        $audio.src = 'intro/assets/start-coin.mp3';
        $audio.play();

        setTimeout(() => {
          $intro.classList.remove('open');
          setTimeout(() => {
            window.open('./allGames/index.html', '_self');
          }, 500);
        }, 1000);
      } else {
        this.shadowRoot
          .querySelectorAll('.scene')
          .forEach(scene => scene?.classList?.remove('open'));
        this.shadowRoot
          .querySelectorAll('.active-game')
          .forEach(scene => scene?.classList?.remove('active-game'));
      }
    }

    document.addEventListener('close-all-games', e => {
      this.shadowRoot
        ?.querySelectorAll('.active-game')
        ?.forEach(scene => scene?.classList?.remove('active-game'));
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

      
            
       
      }
    `;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyScreen.styles}</style>
    <div class="container">
      <aside class="scene intro">
        <span>Nintendo<sup>®</sup></span>
      </aside>
    </div>`;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
