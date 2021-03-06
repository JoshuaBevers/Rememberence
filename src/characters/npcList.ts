import { Vector2, Glyph, CharCode, Color } from 'malwoden';
import { Entity } from './entity';
import { GarryDialogue } from '../dialogue-trees/garryDialogue';
interface EntityOptions {
  position: Vector2;
}

export function Garry(options: EntityOptions): Entity {
  return {
    id: Math.random().toString(),
    name: 'Garry',
    player: false,
    position: options.position,
    incomingDamage: [],
    renderPriority: 1,
    glyph: Glyph.fromCharCode(CharCode.at, Color.AliceBlue),
    vision: 7,
    collision: true,
    dialogue: true,
    dialogueList: GarryDialogue,
    stats: {
      hp: 15,
      maxHp: 15,
      level: 1,
      attack: 3,
      armor: 1,
      exp: 0,
    },
  };
}
