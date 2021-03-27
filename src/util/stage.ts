import { Entity } from '../characters/entity';
import { Util, Vector2 } from 'malwoden';
import { Terrain } from './terrain';

export const map_width = 52;
export const map_height = 38;

export class Stage {
  name: string;
  startPos: Vector2;
  entites: Entity[];
  map: Util.Table<Terrain>;
  fow: boolean;
  fowVisited: Util.Table<boolean>;

  constructor(
    name: string,
    map: Util.Table<Terrain>,
    entities: Entity[],
    startPos: Vector2,
  ) {
    this.name = name;
    this.map = map;
    this.entites = entities;
    this.startPos = startPos;
    this.fow = true;
    this.fowVisited = new Util.Table(this.map.width, this.map.height);
  }

  addEntity(e: Entity) {
    this.entites.push(e);
  }

  removeEntity(e: Entity) {
    this.entites = this.entites.filter((x) => x.id !== e.id);
  }
}
