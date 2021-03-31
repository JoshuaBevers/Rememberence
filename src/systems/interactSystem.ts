import { Stage } from '../util/stage';
import { Entity } from '../characters/entity';
import { state } from '../util/globals';
import { dialogue } from '../stages/dialogue';

export class InteractSystem {
  private handleDialogue(
    interaction: { source: Entity; dialogue?: boolean },
    entity: Entity,
  ) {
    console.log('dialogue', interaction, entity);
    state.prevStage = state.stage;
    state.stage = dialogue(interaction.source, entity);
    //create dialogue scene.
  }

  loop(stage: Stage) {
    for (let e of stage.entites) {
      while (e.interactQueue && e.interactQueue.length > 0) {
        //check to
        const interaction = e.interactQueue.pop();

        //handle dialogue
        if (interaction && interaction.dialogue === true) {
          this.handleDialogue(interaction, e);
        }
      }
    }
  }
}
