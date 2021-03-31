import { Stage } from '../util/stage';
import { Entity } from '../characters/entity';
import { state } from '../util/globals';
import { dialogue } from '../stages/dialogue';

export class mapTransitionSystem {
  loop(stage: Stage) {
    const dialogueTest = stage.entites.filter((x) => x);

    for (let t of dialogueTest) {
    }
  }
}
