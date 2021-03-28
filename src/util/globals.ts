import { Entity } from '../characters/entity';
import { Stage } from './stage';
import { selectStage } from '../stages/mapHandler';
import { Rand } from 'malwoden';
import { Log } from './logs';

export enum GameState {
  GAME_START,
  PLAYER_TURN,
  ENEMY_TURN,
  AWAITING_INPUT,
  GAME_WIN,
  GAME_LOSS,
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
  INTERACT = 'interact',
}

const startingStage = 0;
export const gameSeed = new Rand.AleaRNG();

interface GlobalState {
  stageCount: number;
  stage: Stage;
  posCache: Map<string, Entity[]>;
  playerCache: Entity | undefined;
  help: boolean;
  currentGameState: GameState;
}

export const state: GlobalState = {
  // The current level 'depth'
  stageCount: 0,
  // Stores the current level
  stage: selectStage(startingStage),
  // Allows quick lookup of entities.
  // Should not be changed outside the cache system
  posCache: new Map<string, Entity[]>(),
  // Allows quick lookup of player entity.
  // Should not be changed outside the cache system
  playerCache: undefined,
  // Toggle Help Screen
  help: false,
  // The state of the game
  currentGameState: GameState.GAME_START,
};

export function restart() {
  Log.addEntryHigh('You are reborn. Let the snailing continue!');
  state.stageCount = 1;
  const newLevel = selectStage(state.stageCount);
  state.stage = newLevel;
  state.currentGameState = GameState.GAME_START;
}
