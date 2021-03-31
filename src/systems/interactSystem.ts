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
    const prev = state.stage;
    state.prevLocation = prev;
    state.stage = dialogue(interaction.source, entity);
    setInterval(() => {
      state.stage = prev;
    }, 3000);
    //create dialogue scene.
    if (entity.inDialogue) {
      entity.inDialogue = true;
    }
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
