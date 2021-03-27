import { Terminal } from 'malwoden';
import { GameState } from './util/globals';
import { map_height, map_width } from './util/stage';
import { RenderSystem } from './systems/renderSystem';
import { state } from './util/globals';
import { CacheSystem } from './systems/cacheSystem';
import { InputSystem } from './systems/inputSystem';
import { MovementSystem } from './systems/movementSystem';
import { AISystem } from './systems/aiSystem';
import { ViewSystem } from './systems/viewSystem';

// Globals
let terminal: Terminal.RetroTerminal;
let mapTerminal: Terminal.PortTerminal;

// Systems
const renderSystem = new RenderSystem();
const cacheSystem = new CacheSystem();
const inputSystem = new InputSystem();
const movementSystem = new MovementSystem();
const aiSystem = new AISystem();
const viewSystem = new ViewSystem();

export function init(term: Terminal.RetroTerminal) {
  terminal = term;
  mapTerminal = terminal.port({ x: 17, y: 1 }, map_width, map_height);

  // Render once to start
  renderSystem.loop({
    stage: state.stage,
    mapTerminal,
    terminal,
  });
}

export function loop() {
  // Cache System should always run first to build up cache
  cacheSystem.loop();

  // Input System
  if (state.currentGameState === GameState.AWAITING_INPUT) {
    const wasInput = inputSystem.loop(state.stage);
    if (wasInput) state.currentGameState = GameState.PLAYER_TURN;
  }

  // Logic Systems
  movementSystem.loop(state.stage);
  viewSystem.loop(state.stage);

  if (state.currentGameState === GameState.ENEMY_TURN) {
    aiSystem.loop(state.stage);
  }

  // Transition between needed states
  // Keep logic above, this is just for automatic
  // transitions between states
  if (state.currentGameState === GameState.GAME_START) {
    state.currentGameState = GameState.AWAITING_INPUT;
  } else if (state.currentGameState === GameState.PLAYER_TURN) {
    state.currentGameState = GameState.ENEMY_TURN;
  } else if (state.currentGameState === GameState.ENEMY_TURN) {
    state.currentGameState = GameState.AWAITING_INPUT;
  }

  // Render comes very last
  renderSystem.loop({
    stage: state.stage,
    mapTerminal,
    terminal,
  });
}
