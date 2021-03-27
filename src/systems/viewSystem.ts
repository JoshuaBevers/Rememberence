import { FOV, Vector2 } from 'malwoden';
import { Stage } from '../util/stage';
import { state } from '../util/globals';
import { TerrainBlocksVision } from '../util/terrain';

export class ViewSystem {
  fov = new FOV.PreciseShadowcasting({
    topology: 'eight',
    cartesianRange: true,
    lightPasses: (pos) => {
      const terrain = state.stage.map.get(pos);
      if (!terrain) return true;
      else return TerrainBlocksVision[terrain] === false;
    },
  });

  loop(level: Stage) {
    // Loop through entities
    for (const e of level.entites) {
      if (!e.vision) continue;
      if (e.viewShed && e.viewShed.dirty === false) continue;

      if (e.vision && (!e.viewShed || e.viewShed.dirty)) {
        // Calculate
        const tiles = this.fov.calculateArray(e.position, e.vision);
        const area = new Map<string, Vector2>();
        for (const t of tiles) {
          area.set(`${t.pos.x}:${t.pos.y}`, t.pos);
        }

        // Set area and mark viewshed as clean
        e.viewShed = {
          area,
          dirty: false,
        };
        // If we're updating the player, update the level's
        // visited table
        if (e.player) {
          for (const t of tiles) {
            if (level.fowVisited.isInBounds(t.pos)) {
              level.fowVisited.set(t.pos, true);
            }
          }
        }
      }
    }
  }
}
