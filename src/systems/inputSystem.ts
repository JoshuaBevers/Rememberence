import { Input } from 'malwoden';
import { Stage } from '../util/stage';
import { state, Direction } from '../util/globals';

enum PlayerInput {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  SPACE,
  ESC,
  HELP,
  INTERACT,
  //dialogue options
  ONE,
  TWO,
  THREE,
  FOUR,
}

export class InputSystem {
  currentPlayerInput: PlayerInput = PlayerInput.NONE;

  constructor() {
    const keyboard = new Input.KeyboardHandler();
    const movement = new Input.KeyboardContext()
      .onDown(
        Input.KeyCode.DownArrow,
        () => (this.currentPlayerInput = PlayerInput.DOWN),
      )
      .onDown(
        Input.KeyCode.LeftArrow,
        () => (this.currentPlayerInput = PlayerInput.LEFT),
      )
      .onDown(
        Input.KeyCode.RightArrow,
        () => (this.currentPlayerInput = PlayerInput.RIGHT),
      )
      .onDown(
        Input.KeyCode.UpArrow,
        () => (this.currentPlayerInput = PlayerInput.UP),
      )
      .onDown(
        Input.KeyCode.Space,
        () => (this.currentPlayerInput = PlayerInput.SPACE),
      )
      .onDown(
        Input.KeyCode.Escape,
        () => (this.currentPlayerInput = PlayerInput.ESC),
      )
      .onDown(
        Input.KeyCode.H,
        () => (this.currentPlayerInput = PlayerInput.HELP),
      )
      .onDown(
        Input.KeyCode.E,
        () => (this.currentPlayerInput = PlayerInput.INTERACT),
      )
      .onDown(
        Input.KeyCode.One,
        () => (this.currentPlayerInput = PlayerInput.ONE),
      )
      .onDown(
        Input.KeyCode.Two,
        () => (this.currentPlayerInput = PlayerInput.TWO),
      )
      .onDown(
        Input.KeyCode.Three,
        () => (this.currentPlayerInput = PlayerInput.THREE),
      )
      .onDown(
        Input.KeyCode.Four,
        () => (this.currentPlayerInput = PlayerInput.FOUR),
      );

    keyboard.setContext(movement);
  }

  // Returns true if player input was detected
  loop(stage: Stage): boolean {
    if (this.currentPlayerInput === PlayerInput.NONE) return false;
    const player = stage.entites.find((x) => x.player)!;

    let wasInput = false;

    if (this.currentPlayerInput === PlayerInput.HELP) {
      state.help = true;
      wasInput = false;
    }
    if (this.currentPlayerInput === PlayerInput.ESC) {
      if (state.help) {
        state.help = false;
      }
      //exit dialogue
      if (player.inDialogue === true) {
        player.inDialogue = false;
        player.dialogueStep = 0;
      }
      wasInput = false;
    } else if (this.currentPlayerInput === PlayerInput.SPACE) {
      // Normal Movement!
      // Space to wait
      player.wantsToMove = Direction.CONTINUE;
      player.dialogueNext = true;
      wasInput = true;
    } else if (this.currentPlayerInput === PlayerInput.UP) {
      // Direction Keys
      player.wantsToMove = Direction.UP;
      wasInput = true;
      if (player.inDialogue === true) {
        player.dialogueStep = 0;
        player.inDialogue = false;
      }
    } else if (this.currentPlayerInput === PlayerInput.DOWN) {
      player.wantsToMove = Direction.DOWN;
      wasInput = true;
      if (player.inDialogue === true) {
        player.dialogueStep = 0;
        player.inDialogue = false;
      }
    } else if (this.currentPlayerInput === PlayerInput.RIGHT) {
      player.wantsToMove = Direction.RIGHT;
      wasInput = true;
      if (player.inDialogue === true) {
        player.dialogueStep = 0;
        player.inDialogue = false;
      }
    } else if (this.currentPlayerInput === PlayerInput.LEFT) {
      player.wantsToMove = Direction.LEFT;
      wasInput = true;
      if (player.inDialogue === true) {
        player.dialogueStep = 0;
        player.inDialogue = false;
      }
    } else if (this.currentPlayerInput === PlayerInput.INTERACT) {
      player.wantsToMove = Direction.INTERACT;
      if (player.inDialogue === true) {
        player.dialogueStep = 0;
        player.inDialogue = false;
      }
    } else if (this.currentPlayerInput === PlayerInput.ONE) {
      // answers to questions
      player.questionAnswer = 0;
    } else if (this.currentPlayerInput === PlayerInput.TWO) {
      player.questionAnswer = 1;
    } else if (this.currentPlayerInput === PlayerInput.THREE) {
      player.questionAnswer = 2;
    } else if (this.currentPlayerInput === PlayerInput.FOUR) {
      player.questionAnswer = 3;
    }

    // Make sure we reset the player input
    this.currentPlayerInput = PlayerInput.NONE;
    return wasInput;
  }
}
