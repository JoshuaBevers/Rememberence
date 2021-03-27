import { map_height, map_width, Stage } from '../util/stage';
import { generateStage1 } from './characterCreation';

export function selectStage(stage: number): Stage {
  switch (stage) {
    case 1:
      return generateStage1(map_width, map_height, true, {
        name: 'Town',
        enemies: 7,
      });
  }
  throw new Error('Stage ID not recognized!');
}
