import { Input } from 'malwoden';
import { Stage } from '../util/stage';
import { state, Direction, GameState, restart } from '../util/globals';

enum PlayerInput {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  SPACE,
  ESC,
  HELP,
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
      if (
        state.currentGameState === GameState.GAME_WIN ||
        state.currentGameState === GameState.GAME_LOSS
      ) {
        restart();
      }
      wasInput = false;
    } else if (this.currentPlayerInput === PlayerInput.SPACE) {
      // Normal Movement!
      // Space to wait
      wasInput = true;
    } else if (this.currentPlayerInput === PlayerInput.UP) {
      // Direction Keys
      player.wantsToMove = Direction.UP;
      wasInput = true;
    } else if (this.currentPlayerInput === PlayerInput.DOWN) {
      player.wantsToMove = Direction.DOWN;
      wasInput = true;
    } else if (this.currentPlayerInput === PlayerInput.RIGHT) {
      player.wantsToMove = Direction.RIGHT;
      wasInput = true;
    } else if (this.currentPlayerInput === PlayerInput.LEFT) {
      player.wantsToMove = Direction.LEFT;
      wasInput = true;
    }

    // Make sure we reset the player input
    this.currentPlayerInput = PlayerInput.NONE;
    return wasInput;
  }
}
