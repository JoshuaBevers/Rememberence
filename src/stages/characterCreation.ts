import { Stage } from '../util/stage';
import { Generation, Rand, Vector2 } from 'malwoden';
import { Terrain } from '../util/terrain';
import { strokeTable } from './helpers';
import { Entity } from '../characters/entity';
import * as CharList from '../characters/teamList';

interface Stage1Config {
  name: string;
  enemies: number;
}
export function generateStage1(
  width: number,
  height: number,
  createPlayer: boolean,
  config: Stage1Config,
): Stage {
  //generate seed
  // Generate Terrain
  const map_width = width;
  const map_height = height;
  const map = new Generation.CellularAutomata<Terrain>(map_width, map_height, {
    aliveValue: Terrain.tree,
    deadValue: Terrain.none,
  });
  map.randomize(0.63);
  map.doSimulationStep(3);
  map.connect();
  strokeTable(map.table, Terrain.tree);

  const open: Vector2[] = [];
  for (let x = 0; x < map.table.width; x++) {
    for (let y = 0; y < map.table.height; y++) {
      if (map.table.get({ x, y }) === 0) open.push({ x, y });
    }
  }
  const rng = new Rand.AleaRNG();
  const randomOpen = rng.shuffle(open);
  const entities: Entity[] = [];

  let rngPos = 0;

  const startPos = randomOpen[rngPos++];
  // Generate Player if applicable, start pos either way
  if (createPlayer) {
    entities.push(CharList.getPlayer({ position: startPos }));
  }

  // Generate Entities

  // Generate berries

  // Generate book

  // Create level
  return new Stage(config.name, map.table, entities, startPos);
}