import './GameboyTop.js';
import './GameboyCrystal.js';
import './GameboyCross.js';
import './GameboyButton.js';
import './GameboyOptionButton.js';
import './GameboySpeaker.js';

class GameboyConsole extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get styles() {
    return /* css */ `
      :host {
        --width: 380px;
        --height: 625px;
        --zoom: .8;
      }

      .container {
        zoom: var(--zoom);
        --gameboy-bottom-depth: linear-gradient(transparent 97.75%, #0004 98.5%, #0005 99%);
        width: var(--width);
        height: var(--height);
        background-color: #d7d2d8;
        background-image:
          linear-gradient(-31deg, #8b8b8b 0 75px, transparent 80px),
          var(--gameboy-bottom-depth);
        border-radius: 12px 12px 75px 12px;
        box-shadow:
          0 0 10px #0006,
          1px 0 10px 3px #0004 inset;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
      }

      .screen-container {
        height: 325px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 0 25px;
        border-top: 1px solid #fff8;
        border-radius: 2% 2% 0% 0% / 0.5% 0.5% 0% 0%;
      }

      .brand {
        color: #332C60;
        padding-top: 4px;
        text-shadow: 0 0 1px #30205855;
        width: 100%;
      }

      .brand .company {
        font-family: "Pretendo";
        font-size: 15px;
        letter-spacing: 0.5px;
      }

      .brand .product {
        font-family: "Lato";
        font-size: 23px;
        font-weight: bold;
        font-style: italic;
      }

      .brand sub {
        display: inline-block;
        font-family: "Lato";
        font-size: 15px;
        transform: translateY(2px);
      }

      .controls-container {
        height: 275px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .controls {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 140px;
        padding: 0 20px 0 10px;
        box-sizing: border-box;
      }

      .controls gameboy-cross {
        width: 130px;
        height: 130px;
      }

      .controls .buttons {
        width: 140px;
        height: 68px;
        background: linear-gradient(10deg, #EFF2F099, #AE9FA699);
        box-shadow:
          0 0 4px 2px #ccc,
          0 20px 4px -2px #6661 inset;
        border-radius: 40px;
        transform: translateY(30px) rotate(-25deg);

        display: flex;
        justify-content: space-between;
        padding: 10px;
        box-sizing: border-box;
      }

      gameboy-speaker {
        width: 130px;
        height: 90px;
        position: absolute;
        bottom: 0;
        right: 0;
      }

      .option-buttons {
        width: 130px;
        height: 55px;
        display: flex;
        gap: .7rem;
        transform: translate(-20px, 12px);
      }

      .bottom {
        position: absolute;
        bottom: 0;
      }

      .bottom .phones {
        display: inline-block;
        font-family: Arial, sans-serif;
        font-size: 10px;
        color: #eee;
        border-radius: 15px;
        padding: 2px 4px;
        text-shadow: 1px 1px 1px #0003;
        box-shadow:
          1px 2px 2px #0005 inset,
          0px -2px 2px #fffd inset;
        opacity: 0.8;
        transform: translate(-2px, 0);
      }

      .bottom .phones span {
        filter: brightness(0) invert(0.95);
      }

      .slot {
        margin: auto;
      }

      .slot,
      .slot::before,
      .slot::after {
        width: 5px;
        height: 10px;
        background-image: radial-gradient(transparent, #0003);
      }

      .slot::before,
      .slot::after {
        content: "";
        display: block;
        width: 5px;
        height: 10px;
        position: absolute;
      }

      .slot::before {
        transform: translateX(-8px);
      }

      .slot::after {
        transform: translateX(8px);
      }

      .power-switch {
        width: 34px;
        height: 30px;
        border-radius: 50%;
        position: absolute;
        background: #fff;
        background-image: repeating-linear-gradient(to bottom, #fff 0 1px, #ddd 1px 3px);
        transform: translate(40px, -11.5px);
        clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%);
        transition: transform .4s ease;

        &.on {
          transform: translate(75px, -11.5px);
        }
      }

      .checkbox-music {
        --sound-yes: url(assets/sound-yes.svg);
        --sound-no: url(assets/sound-no.svg);
        display: inline-block;
        margin-left: 10px;
        translate: 0 7px;
        outline: 0;
      
        .music-or-not {
          background-image: linear-gradient(
              hsla(0, 0%, 0%, 0.1),
              hsla(0, 0%, 100%, 0.1)
            ),
            -webkit-linear-gradient(left, #f66 50%, #6cf 50%);
          background-size: 100% 100%, 200% 100%;
          background-position: 0 0, 15px 0;
          border-radius: 25px;
          box-shadow: inset 0 1px 4px hsla(0, 0%, 0%, 0.5),
            inset 0 0 10px hsla(0, 0%, 0%, 0.5), 0 0 0 1px hsla(0, 0%, 0%, 0.1),
            0 -1px 2px 2px hsla(0, 0%, 0%, 0.25), 0 2px 2px 2px hsla(0, 0%, 100%, 0.75);
          cursor: pointer;
          height: 25px;
          padding-right: 25px;
          width: 75px;
          appearance: none;
          transition: 0.25s;
          position: relative;
          outline: none !important;
      
          &:checked {
            background-position: 0 0, 35px 0;
            padding-left: 25px;
            padding-right: 0;
      
            &::before {
              background-image: var(--sound-yes);
            }
          }
      
          &::before,
          &::after {
            pointer-events: none;
          }
      
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-size: 70%;
            background-image: var(--sound-no);
            background-repeat: no-repeat;
            background-position: center;
            transition: left 0.1s linear;
          }
      
          &::after {
            background-color: #eee;
            background-image: linear-gradient(
              hsla(0, 0%, 100%, 0.1),
              hsla(0, 0%, 0%, 0.1)
            );
            border-radius: 25px;
            box-shadow: inset 0 1px 1px 1px hsla(0, 0%, 100%, 1),
              inset 0 -1px 1px 1px hsla(0, 0%, 0%, 0.25),
              0 1px 3px 1px hsla(0, 0%, 0%, 0.5), 0 0 2px hsla(0, 0%, 0%, 0.25);
            content: '';
            display: block;
            height: 25px;
            width: 50px;
          }
        }
      }
      
      
    `;
  }

  connectedCallback() {
    this.render();
    this.shadowRoot
      .querySelector('.power-switch')
      .addEventListener('click', e => {
        const powerSwitch = e.target;
        powerSwitch.classList.toggle('on');
        const isOn = powerSwitch.classList.contains('on');
        if (!isOn) {
          window.open("../index.html", "_self");
        }
      });
    
    this.shadowRoot
      .querySelector('.music-or-not')
      .addEventListener('change', e => {
        if (e.target.checked) {
          this.dispatchEvent(
            new CustomEvent("play-music", { bubbles: true, composed: true })
          );
        } else {
          this.dispatchEvent(
            new CustomEvent("pause-music", { bubbles: true, composed: true })
          );
        }
      });
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyConsole.styles}</style>
    <div class="container">
      <div class="power-switch on"></div>
      <gameboy-top></gameboy-top>
      <div class="screen-container">
        <gameboy-crystal></gameboy-crystal>
        <div class="brand">
          <span class="company">Nintendo</span>
          <span class="product">GAME BOY</span>
          <sub>™</sub>
          <aside class="checkbox-music no">
            <input type="checkbox" class="music-or-not" />
          </aside>
        </div>
      </div>
      <div class="controls-container">
        <div class="controls">
          <gameboy-cross></gameboy-cross>
          <div class="buttons">
            <gameboy-button name="B"></gameboy-button>
            <gameboy-button name="A"></gameboy-button>
          </div>
        </div>
        <gameboy-speaker></gameboy-speaker>
        <div class="option-buttons">
          <gameboy-option-button name="SELECT"></gameboy-option-button>
          <gameboy-option-button name="START"></gameboy-option-button>
        </div>
        <div class="bottom">
          <div class="phones"><span>🎧</span>PHONES</div>
          <div class="slot"></div>
        </div>
      </div>
    </div>`;
  }
}

customElements.define('gameboy-console', GameboyConsole);
