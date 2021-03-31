import { Stage, map_height, map_width } from '../util/stage';
import { Generation, Vector2 } from 'malwoden';
import { Terrain } from '../util/terrain';
import { strokeTable } from './helpers';
import { Entity } from '../characters/entity';
import { state } from '../util/globals';
import { Log } from '../util/logs';
import { selectStage } from '../stages/mapHandler';

export function dialogue(source: Entity, entity: Entity): Stage {
  //generate seed
  // Generate Terrain

  const map = new Generation.CellularAutomata<Terrain>(map_width, map_height, {
    aliveValue: Terrain.none,
    deadValue: Terrain.none,
  });
  map.randomize(0.63);
  strokeTable(map.table, Terrain.tree); // change terrain for dialogue

  const open: Vector2[] = [];
  for (let x = 0; x < map.table.width; x++) {
    for (let y = 0; y < map.table.height; y++) {
      if (map.table.get({ x, y }) === 0) open.push({ x, y });
    }
  }

  const entities: Entity[] = [];

  const startPos = { x: 25, y: 15 };
  const npcPos = { x: 30, y: 15 };
  // Generate Entities

  source.position = npcPos;
  entity.position = startPos;
  if (entity.viewShed) {
    entity.viewShed.dirty = true;
  }

  entities.push(entity);
  entities.push(source);

  //testing
  console.log('ello', state.prevLocation);
  console.log(state.stage);
  Log.addEntryMid(`entering, ${state.stage.name}`);

  return new Stage('conversation', map.table, entities, startPos);
}
