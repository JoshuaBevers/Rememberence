import { Stage } from '../util/stage';
import { Entity } from '../characters/entity';

export class ConditionSystem {
  loop(stage: Stage) {
    for (let e of stage.entites) {
      //handle paralysis
    }
  }
}
