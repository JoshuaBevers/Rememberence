import { Stage, map_height, map_width } from '../util/stage';
import { Generation, Rand, Vector2 } from 'malwoden';
import { Terrain } from '../util/terrain';
import { strokeTable } from './helpers';
import { Entity } from '../characters/entity';
import * as CharList from '../characters/teamList';
import * as NPCList from '../characters/npcList';

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

  const startPos = { x: 15, y: 15 };
  const npcPOS = { x: 20, y: 15 };
  // Generate Player if applicable, start pos either way

  source.position = npcPOS;
  entity.position = startPos;
  // Generate Entities

  entities.push(entity);
  const npcPos = entity.position;
  entities.push(source);

  // Generate berries

  // Generate book

  // Create level
  return new Stage(NPCList.Garry.name, map.table, entities, startPos);
}
