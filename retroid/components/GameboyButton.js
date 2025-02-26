class GameboyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.interval = null;
  }

  static get styles() {
    return /* css */ `
      :host {
        --size: 47px;
      }

      .container {
        width: var(--size);
        height: var(--size);
        background-color: #E66E94;
        border-radius: 50%;
        background: radial-gradient(26px 26px at 24px 27px, #6F0119 75%, #A20D37 90%,#EF94B2);
        box-shadow: 1px -4px 0 -3px #7c4b5b inset, -3px 7px 5px -2px #1e0009, 1px -1px 0 2px #53182b;
        transition: box-shadow .2s linear;

        &:active {
          box-shadow: 1px -4px 8px -3px #7c4b5b44 inset, -3px 7px 8px -2px #1e000944, 1px -1px 2px 2px #53182b44;
        }
      }

      .label {
        font-family: "Pretendo";
        font-size: 12px;
        letter-spacing: 0.5px;
        color: #302058;
        transform: translate(35%, 450%);
        pointer-events: none;
      }
    `;
  }

  addListeners(params) {
    const parentComponent = this.shadowRoot.querySelector('.container');
    const startPress = e => {
      if (this.name === 'A' && e.target.classList.contains('container')) {
        if (!this.interval) {
          this.interval = setInterval(() => {
            this.dispatchEvent(
              new CustomEvent('retroid-button-right', {
                bubbles: true,
                composed: true
              })
            );
          }, 20);
        }
      } else if (this.name === 'B' && e.target.classList.contains('container')) {
        if (!this.interval) {
          this.interval = setInterval(() => {
            this.dispatchEvent(
              new CustomEvent('retroid-button-left', {
                bubbles: true,
                composed: true
              })
            );
          }, 20);
        }
      }
    };

    const stopPress = () => {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.dispatchEvent(
        new CustomEvent('retroid-button-right-mouseup', {
          bubbles: true,
          composed: true
        })
      );
      this.dispatchEvent(
        new CustomEvent('retroid-button-left-mouseup', {
          bubbles: true,
          composed: true
        })
      );
    };

    parentComponent.addEventListener('touchstart', startPress, {
      passive: false
    });
    parentComponent.addEventListener('touchend', stopPress);
    parentComponent.addEventListener('touchcancel', stopPress);
    parentComponent.addEventListener('mousedown', startPress, { passive: false });
    parentComponent.addEventListener('mouseup', stopPress);

    this.addEventListener('click', e => {
      if (this.name === 'B') {
        this.dispatchEvent(
          new CustomEvent('retroid-button-left-click', {
            bubbles: true,
            composed: true
          })
        );
      } else if (this.name === 'A') {
        this.dispatchEvent(
          new CustomEvent('retroid-button-right-click', {
            bubbles: true,
            composed: true
          })
        );
      }
    });
  }

  connectedCallback() {
    this.name = this.getAttribute('name');
    this.render();
    this.addListeners();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyButton.styles}</style>
    <div class="container">
      <div class="label">${this.name}</div>
    </div>`;
  }
}

customElements.define('gameboy-button', GameboyButton);
