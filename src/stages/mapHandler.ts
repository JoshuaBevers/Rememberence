import { map_height, map_width, Stage } from '../util/stage';
import { characterCreation } from './characterCreation';

export function selectStage(stage: number): Stage {
  switch (stage) {
    case 0:
      return characterCreation(map_width, map_height, true, {
        name: '????',
      });
  }
  throw new Error('Stage ID not recognized!');
}
