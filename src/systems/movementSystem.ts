import { Vector2 } from 'malwoden';
import { Direction, state } from '../util/globals';
import { Stage } from '../util/stage';
import { TerrainCollision } from '../util/terrain';
import { Entity } from '../characters/entity';
import { dealDamage } from '../util/damageFunction';

const directionVectors: any = {
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.DOWN]: { x: 0, y: 1 },
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.RIGHT]: { x: 1, y: 0 },
  [Direction.INTERACT]: { x: 0, y: 0 },
  [Direction.CONTINUE]: { x: 0, y: 0 },
};

export class MovementSystem {
  loop(stage: Stage) {
    //sets up monsters that can be collided with.
    for (let e of stage.entites) {
      if (e.wantsToMove) {
        // Get direction, the reset wants to move
        const direction = directionVectors[e.wantsToMove];
        //dilogue checks
        const possibleDialogue: {
          source: Entity;
          dialogue: boolean;
        } = this.checkDialogue(e); // returns an object if they have dialogue options.
        if (possibleDialogue.dialogue === true && e.interactQueue) {
          e.interactQueue.push({
            source: possibleDialogue.source,
            dialogue: true,
          });
        }

        //end dialogue checks

        //line
        e.wantsToMove = undefined;

        //where e wants to go.
        const stepPos: Vector2 = {
          x: e.position.x + direction.x,
          y: e.position.y + direction.y,
        };

        // Check entities
        const stepEntities =
          state.posCache.get(`${stepPos.x}:${stepPos.y}`) || [];
        const entitiesBlocking = stepEntities.some((x) => x.collision);

        if (entitiesBlocking) {
          // Check combat
          this.checkCombat(e, stepEntities);
          continue;
        }

        // Check terrain
        const terrain = stage.map.get(stepPos);
        const terrainBlocking = terrain ? TerrainCollision[terrain] : false;
        if (terrainBlocking) {
          continue;
        }

        // Nothing blocking, adjust position
        e.position.x += direction.x;
        e.position.y += direction.y;

        // Recalculate view if necessary
        if (e.vision && e.viewShed) {
          e.viewShed.dirty = true;
        }
      }
    }
  }

  checkDialogue(e: Entity): { source: Entity; dialogue: boolean } {
    if (e.wantsToMove === 'continue') {
      e.wantsToMove = undefined;
    }

    if (e.wantsToMove === 'interact') {
      // get the possible positions
      const up = state.posCache.get(`${e.position.x}:${e.position.y - 1}`);
      const left = state.posCache.get(`${e.position.x - 1}:${e.position.y}`);
      const right = state.posCache.get(`${e.position.x + 1}:${e.position.y}`);
      const down = state.posCache.get(`${e.position.x}:${e.position.y + 1}`);

      if (up || left || right || down !== undefined) {
        const interactArray = [up, left, right, down];
        const filteredInteractArray = interactArray.filter((x) => {
          if (x !== undefined) {
            return x[0].dialogue === true;
          }
        });
        if (filteredInteractArray[0]) {
          const checkSum = filteredInteractArray[0];

          if (checkSum[0].dialogue) {
            return { source: checkSum[0], dialogue: true };
          }
        } // returns object
      }
    }
    return { source: e, dialogue: false };
  }

  // Converts a movement into a melee attack if applicable
  checkCombat(currentEntity: Entity, blockingEntities: Entity[]) {
    const otherFactionEntity = blockingEntities.find(
      (x) => x.enemy !== currentEntity.enemy && x.stats,
    );

    if (otherFactionEntity && otherFactionEntity.stats) {
      dealDamage(currentEntity, otherFactionEntity);
    }
  }
}
