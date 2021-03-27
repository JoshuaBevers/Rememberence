import { Vector2, Glyph, CharCode, Color } from 'malwoden';
import { Entity } from './entity';

interface EntityOptions {
  position: Vector2;
}

export function getPlayer(options: EntityOptions): Entity {
  return {
    id: Math.random().toString(),
    name: 'Mal',
    player: true,
    position: options.position,
    incomingDamage: [],
    renderPriority: 1,
    glyph: Glyph.fromCharCode(CharCode.at, Color.Yellow),
    vision: 7,
    collision: true,
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
