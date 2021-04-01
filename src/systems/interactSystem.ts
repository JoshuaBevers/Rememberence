import { Stage } from '../util/stage';
import { Entity } from '../characters/entity';

export class InteractSystem {
  private handleDialogue(
    interaction: { source: Entity; dialogue?: boolean },
    entity: Entity,
  ) {
    if (entity) {
      entity.inDialogue = true;
      entity.conversingWith = interaction.source;
      entity.dialogueStep = 0;
    }
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
          e.inDialogue = true;
        }
      }
    }
  }
}
