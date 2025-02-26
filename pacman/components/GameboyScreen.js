class GameboyScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  playPacman() {
    //////////////////////////////////GLOBAL
    const $ = el => this.shadowRoot.querySelector(el);
    const $$ = el => this.shadowRoot.querySelectorAll(el);
    const parentComponent = $('div.container');
    const $canvas = $('.packman-canvas');
    const ctx = $canvas.getContext('2d');
    const oneBlockSize = 20;
    const $ghostSprite = $('.ghost-sprite');
    const $ghostSprite2 = $('.ghost-sprite-2');
    const $pacmanSprite = $('.pacman-sprite');
    const $pacmanLives = $$('.pacman-live');
    let banderSongYes = false;

    class Ghost {
      constructor(
        x,
        y,
        width,
        height,
        speed,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        range,
        sprite,
        ghostBlue,
        ghostEyes
      ) {
        this.x = x;
        this.y = y;
        this.initialPositionTarget = { x: x, y: y };
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION.RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        setInterval(() => {
          this.changeRandomDirection();
        }, 10000);
        this.sprite = sprite;
        this.ghostBlue = ghostBlue;
        this.ghostEyes = ghostEyes;
        this.aspect = 'normal';
        this.currentFrame = 1;
        this.countFrame = 4;
        this.aspectInterval = null;
        this.aspectTimeOut = null;
      }

      changeRandomDirection() {
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
      }

      addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
          poped.x - 1 >= 0 &&
          poped.x - 1 < numOfRows &&
          mp[poped.y][poped.x - 1] != 1
        ) {
          let tempMoves = poped.moves.slice();
          tempMoves.push(DIRECTION.LEFT);
          queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (
          poped.x + 1 >= 0 &&
          poped.x + 1 < numOfRows &&
          mp[poped.y][poped.x + 1] != 1
        ) {
          let tempMoves = poped.moves.slice();
          tempMoves.push(DIRECTION.RIGHT);
          queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (
          poped.y - 1 >= 0 &&
          poped.y - 1 < numOfColumns &&
          mp[poped.y - 1][poped.x] != 1
        ) {
          let tempMoves = poped.moves.slice();
          tempMoves.push(DIRECTION.UP);
          queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (
          poped.y + 1 >= 0 &&
          poped.y + 1 < numOfColumns &&
          mp[poped.y + 1][poped.x] != 1
        ) {
          let tempMoves = poped.moves.slice();
          tempMoves.push(DIRECTION.BOTTOM);
          queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
      }

      calculateNewDirection(matriz, destX, destY) {
        let mp = [];
        for (let i = 0; i < matriz.length; i++) {
          mp[i] = matriz[i].slice();
        }

        let queue = [
          {
            x: this.getMapX(),
            y: this.getMapY(),
            rightX: this.get_X_MapRightSide(),
            rightY: this.get_Y_MapRightSide(),
            moves: []
          }
        ];

        while (queue.length > 0) {
          let poped = queue.shift();
          if (poped.x === destX && poped.y === destY) {
            return poped.moves[0];
          } else {
            mp[poped.y][poped.x] = 1;
            let neighborList = this.addNeighbors(poped, mp);
            for (let i = 0; i < neighborList.length; i++) {
              queue.push(neighborList[i]);
            }
          }
        }

        return 1; // direction right
      }

      changeAnimation() {
        if (this.aspect === 'normal') return;
        this.currentFrame =
          this.currentFrame === this.countFrame ? 1 : this.currentFrame + 1;
      }

      moveGhost() {
        if (this.aspect === 'blue') {
          this.target = this.initialPositionTarget;

          if (
            this.getMapX() == pacman.getMapX() &&
            this.getMapY() == pacman.getMapY()
          ) {
            this.changeAspect('eyes');
          }
        } else if (this.aspect === 'eyes') {
          this.target = this.initialPositionTarget;
        } else if (this.isInRange()) {
          this.target = pacman;
        } else {
          this.target = randomTargetsForGhosts[this.randomTargetIndex];
        }
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollision()) {
          this.moveBackwards();
          return;
        }
      }

      changeAspect(newAspect) {
        this.aspect = newAspect;
      }

      getAspectOfGhost() {
        return this.aspect;
      }

      draw() {
        //normal
        let sprite = this.sprite;
        let imageX = this.imageX;
        let imageY = this.imageY;
        let imageWidth = this.imageWidth;
        let imageHeight = this.imageHeight;
        let pintadoWidth = this.width;
        let pintadoHeigth = this.height;

        if (this.aspect === 'normal') {
          ghostToBlue.volume = 0;
          ghostAudio.volume = 1;
          if (this.aspectInterval) {
            clearInterval(this.aspectInterval);
            this.aspectInterval = null;
          }
        }

        if (this.aspect === 'blue' || this.aspect === 'eyes') {
          ghostToBlue.volume = 1;
          ghostAudio.volume = 0;
          imageX = (this.currentFrame - 1) * 32;
          imageY = 0;
          imageWidth = 32;
          imageHeight = 32;
          pintadoWidth = oneBlockSize;
          pintadoHeigth = oneBlockSize;
          if (!this.aspectInterval) {
            this.aspectInterval = setInterval(() => this.changeAnimation(), 75);
          }
        }

        if (this.aspect === 'blue') {
          sprite = this.ghostBlue;
          if (!this.aspectTimeOut) {
            this.aspectTimeOut = setTimeout(() => {
              changeAspectOfGhosts('normal');
              clearTimeout(this.aspectTimeOut);
              this.aspectTimeOut = null;
            }, 4000);
          }
        } else if (this.aspect === 'eyes') {
          sprite = this.ghostEyes;
        }

        ctx.save();
        ctx.drawImage(
          sprite,
          imageX,
          imageY,
          imageWidth,
          imageHeight,
          this.x,
          this.y,
          pintadoWidth,
          pintadoHeigth
        );
        ctx.restore();
      }

      changeDirectionIfPossible() {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
          matriz,
          parseInt(this.target.x / oneBlockSize),
          parseInt(this.target.y / oneBlockSize)
        );
        if (typeof this.direction == 'undefined') {
          this.direction = tempDirection;
          return;
        }
        if (
          this.getMapY() != this.get_Y_MapRightSide() &&
          (this.direction === DIRECTION.LEFT ||
            this.direction === DIRECTION.RIGHT)
        ) {
          this.direction = DIRECTION.UP;
        }
        if (
          this.getMapX() != this.get_X_MapRightSide() &&
          this.direction === DIRECTION.UP
        ) {
          this.direction = DIRECTION.LEFT;
        }
        this.moveForwards();
        if (this.checkCollision()) {
          this.moveBackwards();
          this.direction = tempDirection;
        } else {
          this.moveBackwards();
        }
      }

      getMapX() {
        return parseInt(this.x / oneBlockSize);
      }

      getMapY() {
        return parseInt(this.y / oneBlockSize);
      }

      get_X_MapRightSide() {
        return parseInt((this.x * 0.999 + oneBlockSize) / oneBlockSize);
      }

      get_Y_MapRightSide() {
        return parseInt((this.y * 0.999 + oneBlockSize) / oneBlockSize);
      }

      checkCollision() {
        let A = matriz[this.getMapY()][this.getMapX()] === TYPE.WALL;
        let B = matriz[this.getMapY()][this.get_X_MapRightSide()] === TYPE.WALL;
        let C = matriz[this.get_Y_MapRightSide()][this.getMapX()] === TYPE.WALL;
        let D =
          matriz[this.get_Y_MapRightSide()][this.get_X_MapRightSide()] ===
          TYPE.WALL;

        return A || B || C || D;
      }

      isInRange() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (
          Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range
        ) {
          return true;
        }
        return false;
      }

      moveForwards() {
        switch (this.direction) {
          case DIRECTION.RIGHT:
            this.x += this.speed;
            break;
          case DIRECTION.UP:
            this.y -= this.speed;
            break;
          case DIRECTION.LEFT:
            this.x -= this.speed;
            break;
          case DIRECTION.BOTTOM:
            this.y += this.speed;
            break;
        }
      }

      moveBackwards() {
        switch (this.direction) {
          case DIRECTION.RIGHT:
            this.x -= this.speed;
            break;
          case DIRECTION.UP:
            this.y += this.speed;
            break;
          case DIRECTION.LEFT:
            this.x += this.speed;
            break;
          case DIRECTION.BOTTOM:
            this.y -= this.speed;
            break;
        }
      }
    }

    class Pacman {
      constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION.RIGHT;
        this.nextDirection = this.direction;
        this.currentFrame = 1;
        this.countFrame = 7;
        setInterval(() => this.changeAnimation(), 75);
      }

      checkGhostCollision(ghosts) {
        for (let i = 0; i < ghosts.length; i++) {
          let ghost = ghosts[i];
          if (
            ghost.getMapX() == this.getMapX() &&
            ghost.getMapY() == this.getMapY()
          ) {
            return true;
          }
        }
        return false;
      }

      movePacman() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollision()) {
          this.moveBackwards();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x + oneBlockSize / 2, this.y + oneBlockSize / 2);
        ctx.rotate((this.direction * 90 * Math.PI) / 180);
        ctx.translate(-this.x - oneBlockSize / 2, -this.y - oneBlockSize / 2);
        ctx.drawImage(
          $pacmanSprite,
          (this.currentFrame - 1) * oneBlockSize,
          0,
          oneBlockSize,
          oneBlockSize,
          this.x,
          this.y,
          oneBlockSize,
          oneBlockSize
        );
        ctx.restore();
      }

      eat() {
        matriz.forEach((row, y) => {
          row.forEach((value, x) => {
            if (
              value === TYPE.SPACE &&
              this.getMapX() === x &&
              this.getMapY() === y
            ) {
              matriz[y][x] = 3;
              counterScore++;
              onlyFoodScore++;
            }
            if (
              value === TYPE.FRUIT &&
              this.getMapX() === x &&
              this.getMapY() === y
            ) {
              matriz[y][x] = 3;
              counterScore += 5000;
            }
            if (
              value === TYPE.SPECIAL_FOOD &&
              this.getMapX() === x &&
              this.getMapY() === y
            ) {
              matriz[y][x] = 3;
              counterScore += 1000;
              changeAspectOfGhosts('blue');
            }
          });
        });
      }

      changeDirectionIfPossible() {
        if (this.direction === this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollision()) {
          this.moveBackwards();
          this.direction = tempDirection;
        } else {
          this.moveBackwards();
        }
      }

      getMapX() {
        return parseInt(this.x / oneBlockSize);
      }

      getMapY() {
        return parseInt(this.y / oneBlockSize);
      }

      get_X_MapRightSide() {
        return parseInt((this.x * 0.999 + oneBlockSize) / oneBlockSize);
      }

      get_Y_MapRightSide() {
        return parseInt((this.y * 0.999 + oneBlockSize) / oneBlockSize);
      }

      changeAnimation() {
        this.currentFrame =
          this.currentFrame === this.countFrame ? 1 : this.currentFrame + 1;
      }

      checkCollision() {
        let A = matriz[this.getMapY()][this.getMapX()] === TYPE.WALL;
        let B = matriz[this.getMapY()][this.get_X_MapRightSide()] === TYPE.WALL;
        let C = matriz[this.get_Y_MapRightSide()][this.getMapX()] === TYPE.WALL;
        let D =
          matriz[this.get_Y_MapRightSide()][this.get_X_MapRightSide()] ===
          TYPE.WALL;

        return A || B || C || D;
      }

      moveForwards() {
        switch (this.direction) {
          case DIRECTION.RIGHT:
            this.x += this.speed;
            break;
          case DIRECTION.UP:
            this.y -= this.speed;
            break;
          case DIRECTION.LEFT:
            this.x -= this.speed;
            break;
          case DIRECTION.BOTTOM:
            this.y += this.speed;
            break;
        }
      }

      moveBackwards() {
        switch (this.direction) {
          case DIRECTION.RIGHT:
            this.x -= this.speed;
            break;
          case DIRECTION.UP:
            this.y += this.speed;
            break;
          case DIRECTION.LEFT:
            this.x += this.speed;
            break;
          case DIRECTION.BOTTOM:
            this.y -= this.speed;
            break;
        }
      }
    }

    const $pacmanModal = $('.pacman-modal');
    const $fruitSprite = $('.fruit-sprite');
    const $h2Win = $('.pacman-win');
    const $h2Lost = $('.pacman-lost');
    const $score = $('.pacman-score');
    const $ghostBlue = $('.ghost-blue');
    const $ghostEyes = $('.ghost-eyes');

    //Audios
    const pacmanEatingAudio = new Audio('assets/pacman-game/eating.mp3');
    pacmanEatingAudio.loop = true;
    pacmanEatingAudio.volume = 0.8;
    const ghostAudio = new Audio('assets/pacman-game/ghost-normal-move.mp3');
    ghostAudio.loop = true;
    const ghostToBlue = new Audio('assets/pacman-game/ghost-turn-to-blue.mp3');
    ghostToBlue.loop = true;
    ghostToBlue.volume = 0;
    const EndGameAudio = new Audio('assets/pacman-game/start-music.mp3');
    EndGameAudio.loop = true;
    EndGameAudio.volume = 0;

    //PACMAN AUDIOS
    document.addEventListener('play-music', e => {
      banderSongYes = true;
      if ($pacmanModal.classList.contains('hiddenModal') && banderSongYes) {
        playSoundsOfGame();
      } else if (banderSongYes) {
        EndGameAudio.volume = 1;
      }
    });

    document.addEventListener('pause-music', e => {
      banderSongYes = false;
      if ($pacmanModal.classList.contains('hiddenModal') && !banderSongYes) {
        PauseSoundsOfGame();
      } else if (!banderSongYes) {
        EndGameAudio.volume = 0;
      }
    });

    function playSoundsOfGame() {
      pacmanEatingAudio.play();
      ghostAudio.play();
      ghostToBlue.play();
      EndGameAudio.play();
      EndGameAudio.volume = 0;
    }

    function PauseSoundsOfGame() {
      pacmanEatingAudio.pause();
      ghostAudio.pause();
      ghostToBlue.pause();
      EndGameAudio.pause();
    }

    let randomFruit = ~~(Math.random() * 7);

    let matriz = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
      [1, 4, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 4, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
      [1, 4, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 4, 1],
      [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
      [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    let originalMatriz = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
      [1, 4, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 4, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
      [1, 4, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 4, 1],
      [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
      [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    let lives = 3;
    let ghostCount = 4;
    let ghostImageLocations = [
      { x: 0, y: 0 },
      { x: 176, y: 0 },
      { x: 0, y: 121 },
      { x: 176, y: 121 }
    ];
    let ghosts = [];
    let randomTargetsForGhosts = [
      { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
      { x: 1 * oneBlockSize, y: (matriz.length - 2) * oneBlockSize },
      { x: (matriz[0].length - 2) * oneBlockSize, y: oneBlockSize },
      {
        x: (matriz[0].length - 2) * oneBlockSize,
        y: (matriz.length - 2) * oneBlockSize
      }
    ];
    let counterScore = 0;
    let onlyFoodScore = 0;

    const DIRECTION = {
      RIGHT: 4,
      UP: 3,
      LEFT: 2,
      BOTTOM: 1
    };

    //width = 21cols x 20 = 420
    //height = 23rows x 20 = 460
    const widthCanvas = $canvas.width;
    const heightCanvas = $canvas.height;
    const canvasBackground = '#000';
    const wallColor = 'dodgerblue';
    const foodColor = 'yellow';
    const wallInnerColor = '#000';
    const pacmanSpeed = 1;
    let totalFoodCircles = 0;
    const TYPE = {
      HOLE: 0,
      WALL: 1,
      SPACE: 2,
      SPECIAL_FOOD: 4,
      FRUIT: 5
    };

    let pacman = new Pacman(
      oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      0
    );
    let wallWidth = oneBlockSize / 1.5;
    let wallOffset = (oneBlockSize - wallWidth) / 2;
    let fps = 500;

    let gameInterval = setInterval(() => gameLoop(), 1000 / fps);

    //////////////////////////////////FUNCTIONS
    function drawRect(x, y, width, height, color) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      ctx.closePath();
    }

    (function total_n_item_foods() {
      matriz.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value === TYPE.SPACE) {
            totalFoodCircles++;
          }
        });
      });
    })();

    (function addFruitToMap() {
      const time = 30000; //60 segundos

      setInterval(() => {
        randomFruit = ~~(Math.random() * 7);
        matriz[13][10] = 5;
      }, time);
    })();

    function updateGhosts() {
      for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveGhost();
      }
    }

    function changeAspectOfGhosts(newAspect) {
      for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].changeAspect(newAspect);
      }
    }

    function drawGhosts() {
      for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
      }
    }

    function gameLoop() {
      update();
      draw();
      $score.textContent = counterScore;
      updateGhosts();
      if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
      }
    }

    function update() {
      pacman.movePacman();
      pacman.eat();
      checkWin();
    }

    function draw() {
      ctx.clearRect(0, 0, widthCanvas, heightCanvas);
      drawRect(0, 0, widthCanvas, heightCanvas, canvasBackground);
      drawWalls();
      pacman.draw();
      drawFood();
      drawGhosts();
    }

    function drawWalls() {
      matriz.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value === TYPE.WALL) {
            drawRect(
              x * oneBlockSize,
              y * oneBlockSize,
              oneBlockSize,
              oneBlockSize,
              wallColor
            );
          }
          if (x > 0 && matriz[y][x - 1] === TYPE.WALL) {
            drawRect(
              x * oneBlockSize,
              y * oneBlockSize + wallOffset,
              wallWidth + wallOffset,
              wallWidth,
              wallInnerColor
            );
          }
          if (x < matriz[0].length - 1 && matriz[y][x + 1] === TYPE.WALL) {
            drawRect(
              x * oneBlockSize + wallOffset,
              y * oneBlockSize + wallOffset,
              wallWidth + wallOffset,
              wallWidth,
              wallInnerColor
            );
          }

          if (y > 0 && matriz[y - 1][x] === TYPE.WALL) {
            drawRect(
              x * oneBlockSize + wallOffset,
              y * oneBlockSize,
              wallWidth,
              wallWidth + wallOffset,
              wallInnerColor
            );
          }

          if (y < matriz.length - 1 && matriz[y + 1][x] === TYPE.WALL) {
            drawRect(
              x * oneBlockSize + wallOffset,
              y * oneBlockSize + wallOffset,
              wallWidth,
              wallWidth + wallOffset,
              wallInnerColor
            );
          }
        });
      });
    }

    function createNewPacman() {
      pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        pacmanSpeed
      );
    }

    function drawCircle({ x, y, radius, color }) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(
        x * oneBlockSize + oneBlockSize / 2,
        y * oneBlockSize + oneBlockSize / 2,
        radius,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.closePath();
    }

    function drawFood() {
      matriz.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value === TYPE.SPACE) {
            drawCircle({ x, y, radius: oneBlockSize / 10, color: foodColor });
          }
          if (value === TYPE.SPECIAL_FOOD) {
            drawCircle({ x, y, radius: oneBlockSize / 3, color: foodColor });
          }
          if (value === TYPE.FRUIT) {
            ctx.drawImage(
              $fruitSprite,
              randomFruit * 32,
              0,
              32,
              32,
              x * oneBlockSize,
              y * oneBlockSize,
              oneBlockSize,
              oneBlockSize
            );
          }
        });
      });
    }

    function resetGameComplete() {
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = null;
      lives = 3;
      counterScore = 0;
      onlyFoodScore = 0;
      $score.textContent = counterScore;
      $pacmanLives.forEach(pacman => pacman.classList.remove('desaparecer'));
      restartPacmanAndGhosts();
      gameInterval = setInterval(() => gameLoop(), 1000 / fps);
      matriz = structuredClone(originalMatriz);
    }

    function gameOver() {
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = null;
      pacmanEatingAudio.pause();
      ghostAudio.pause();
      ghostToBlue.pause();
      $pacmanModal.classList.remove('hiddenModal');
      if (banderSongYes && !$pacmanModal.classList.contains('hiddenModal')) {
        EndGameAudio.volume = 1;
      }
    }

    function checkWin() {
      if (onlyFoodScore >= totalFoodCircles) {
        $h2Win.classList.toggle('h2-hidden', false);
        $h2Lost.classList.toggle('h2-hidden', true);
        gameOver();
      }
    }

    function allGhostsAreNormal() {
      return ghosts.every(ghost => ghost.getAspectOfGhost() === 'normal');
    }

    function onGhostCollision() {
      if (allGhostsAreNormal()) {
        lives--;
        restartPacmanAndGhosts();
        $pacmanLives[lives].classList.add('desaparecer');

        if (lives == 0) {
          $h2Win.classList.toggle('h2-hidden', true);
          $h2Lost.classList.toggle('h2-hidden', false);
          ctx.clearRect(0, 0, widthCanvas, heightCanvas);
          gameOver();
        }

        return;
      }
    }

    function createGhosts() {
      ghosts = [];
      for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
          9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
          10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          pacman.speed / 2,
          ghostImageLocations[i % 4].x,
          ghostImageLocations[i % 4].y,
          124,
          116,
          6 + i,
          $ghostSprite,
          $ghostBlue,
          $ghostEyes
        );
        ghosts.push(newGhost);
      }
      for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
          9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
          10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          pacman.speed / 2,
          ghostImageLocations[i % 4].x,
          ghostImageLocations[i % 4].y,
          124,
          116,
          6 + i,
          $ghostSprite2,
          $ghostBlue,
          $ghostEyes
        );
        ghosts.push(newGhost);
      }
    }

    function restartPacmanAndGhosts() {
      createNewPacman();
      createGhosts();
    }

    //////////////////////////////////EVENTS
    document.addEventListener('keydown', ({ key }) => {
      if (key === 'ArrowRight' || key === 'D' || key === 'd')
        pacman.nextDirection = DIRECTION.RIGHT;
      else if (key === 'ArrowLeft' || key === 'A' || key === 'a')
        pacman.nextDirection = DIRECTION.LEFT;
      else if (key === 'ArrowUp' || key === 'W' || key === 'w')
        pacman.nextDirection = DIRECTION.UP;
      else if (key === 'ArrowDown' || key === 'S' || key === 's')
        pacman.nextDirection = DIRECTION.BOTTOM;
    });

    document.addEventListener('again-pacman', _ => {
      if (!$pacmanModal.classList.contains('hiddenModal')) {
        resetGameComplete();
        $pacmanModal.classList.add('hiddenModal');
        if (banderSongYes && $pacmanModal.classList.contains('hiddenModal')) {
          playSoundsOfGame();
        }
      }
    });

    parentComponent.addEventListener('click', e => {
      if (
        e.target.matches('.btn-pacman-again') ||
        e.target.matches('.btn-pacman-again *')
      ) {
        $pacmanModal.classList.add('hiddenModal');
        resetGameComplete();
        if (banderSongYes && $pacmanModal.classList.contains('hiddenModal')) {
          playSoundsOfGame();
        }
      }
    });

    document.addEventListener('pacman-to-up', _ => {
      pacman.nextDirection = DIRECTION.UP;
    });
    document.addEventListener('pacman-to-down', _ => {
      pacman.nextDirection = DIRECTION.BOTTOM;
    });
    document.addEventListener('pacman-to-right', _ => {
      pacman.nextDirection = DIRECTION.RIGHT;
    });
    document.addEventListener('pacman-to-left', _ => {
      pacman.nextDirection = DIRECTION.LEFT;
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


      /*****************************PACMAN*****************************/
      .container-packman {
        position: relative;
        content-visibility: auto;
        --width: 210px;
        --height: 180px;
        background: #000;
        width: var(--width);
        height: var(--height);
        overflow: hidden;
        display: flex;
      
        .packman-canvas {
          margin-inline: auto;
          transform: translateY(-5px) scale(0.9);
        }
      
        .pacman-modal {
          zoom: 0.6;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          width: 222px;
          height: 222px;
          border-radius: 30px;
          background: #e0e0e0;
          box-shadow: 15px 15px 30px #bebebe66, -15px -15px 30px #ffffff66;
          display: flex;
          flex-wrap: wrap;
          place-content: center;
          flex-direction: column;
          gap: 1rem;
          text-align: center;
          transition: transform 0.5s ease;
      
          &.hiddenModal {
            transform: translate(-50%, -50%) scale(0);
          }
      
          h2 {
            font-size: 18px;
            text-wrap: balance;
            padding: 1.4rem;
      
            &.h2-hidden {
              display: none;
            }
          }
      
          .btn-pacman-again {
            --primary: 255, 90, 120;
            --secondary: 150, 50, 60;
            width: 60px;
            height: 50px;
            border: none;
            outline: none;
            cursor: pointer;
            user-select: none;
            touch-action: manipulation;
            outline: 10px solid rgb(var(--primary), 0.5);
            border-radius: 100%;
            position: relative;
            transition: 0.3s;
            margin-inline: auto;
      
            .back {
              background: rgb(var(--secondary));
              border-radius: 100%;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            }
      
            .front {
              background: linear-gradient(
                0deg,
                rgba(var(--primary), 0.6) 20%,
                rgba(var(--primary)) 50%
              );
              box-shadow: 0 0.5em 1em -0.2em rgba(var(--secondary), 0.5);
              border-radius: 100%;
              position: absolute;
              border: 1px solid rgb(var(--secondary));
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 1.2rem;
              font-weight: 600;
              font-family: inherit;
              transform: translateY(-15%);
              transition: 0.15s;
              color: rgb(var(--secondary));
            }
      
            &:active .front {
              transform: translateY(0%);
              box-shadow: 0 0;
            }
          }
        }
      
        .container-pacman-lives {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: flex;
          gap: 0.2rem;
          zoom: 0.3;
      
          .pacman-live {
            width: 20px;
            height: 20px;
            background-image: url('assets/pacman-game/pacman.gif');
      
            &.desaparecer {
              opacity: 0;
            }
          }
        }
      
        .container-pacman-score {
          position: absolute;
          bottom: 5px;
          left: 8px;
          color: #fff;
          zoom: 0.35;
        }
      
        .container-packman-sprites {
          display: none;
        }
      }
    }`;
  }

  connectedCallback() {
    this.render();
    this.playPacman();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameboyScreen.styles}</style>
    <div class="container schemeCrystal">
       <article class="start-game pacman-the-game active-game">
          <section class="container-packman">
              <canvas class="packman-canvas" width="420" height="460"></canvas>
              <div class="container-packman-sprites">
                <img
                  src="assets/pacman-game/ghost.png"
                  alt="ghost"
                  class="ghost-sprite"
                />
                <img
                  src="assets/pacman-game/pacman.gif"
                  alt="pacman"
                  class="pacman-sprite"
                />
                <img
                  src="assets/pacman-game/ghost2.png"
                  alt="ghost"
                  class="ghost-sprite-2"
                />
                <img
                  src="assets/pacman-game/fruit.png"
                  alt="ghost"
                  class="fruit-sprite"
                />
                <img
                  src="assets/pacman-game/ghotBlue.png"
                  alt="ghost"
                  class="ghost-blue"
                />
                <img
                  src="assets/pacman-game/ghotEyes.png"
                  alt="ghost"
                  class="ghost-eyes"
                />
              </div>
              <div class="pacman-modal">
                <h2 class="pacman-lost h2-hidden">SORRY, YOU LOST!</h2>
                <h2 class="pacman-win h2-hidden">CONGRATULATIONS, YOU WON!</h2>
                <button class="btn-pacman-again">
                  <span class="back"></span>
                  <span class="front"></span>
                </button>
              </div>
              <aside class="container-pacman-lives">
                <div class="pacman-live"></div>
                <div class="pacman-live"></div>
                <div class="pacman-live"></div>
              </aside>
              <aside class="container-pacman-score">
                Score: <output class="pacman-score">0</output>
              </aside>
            </section>
        </article>
    </div>`;
  }
}

customElements.define('gameboy-screen', GameboyScreen);
