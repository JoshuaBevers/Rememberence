import { Entity } from '../characters/entity';

function notifyDamage(source: string, power: number, target: Entity) {
  if (!target.incomingDamage) {
    target.incomingDamage = [];
  }
  target.incomingDamage?.push({ source, damage: power });
}

function calcAttack(source: Entity): number {
  let totalAttack = 0;
  if (source.stats) {
    totalAttack = source.stats.attack;
  }

  return totalAttack;
}

function calcDefence(target: Entity): number {
  let totalDefence = 0;
  if (target.stats) {
    //verifies that target has stats and is a valid target.
    totalDefence = totalDefence + target.stats?.armor;
  }

  return totalDefence;
}

export function dealDamage(source: Entity, target: Entity) {
  let defence; //setup for more complicated defence formula.
  let attack; //setup for comre complicated attack formula.

  defence = calcDefence(target);
  attack = calcAttack(source);
  let power: number = 0;
  power = attack - defence;
  if (power < 0) {
    power = 1;
  }
  notifyDamage(source.name, power, target);
}
