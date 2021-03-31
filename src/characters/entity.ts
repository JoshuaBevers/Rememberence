import { Glyph, Vector2 } from 'malwoden';
import { Direction } from '../util/globals';

// Entity

interface Stats {
  hp: number;
  maxHp: number;
  level: number;
  attack: number;
  armor: number;
  exp: number;
}

interface conditions {
  paralysed: boolean;
}

export interface Entity {
  id: string;
  name: string;
  description?: string;
  label?: string;
  ai?: 'wander' | 'chase' | 'guard';
  enemy?: boolean;
  collision?: boolean;

  position: Vector2;
  glyph: Glyph;
  renderPriority: number;

  player?: boolean;
  stairs?: boolean;
  restart?: boolean;
  stats?: Stats;
  incomingDamage?: { source: string; damage: number }[];
  droppedItem?: Item;
  inventory?: Map<number, Item>;
  wantsToMove?: Direction;

  dialogue?: boolean;
  dialogueList?: {
    m?: string;
    question?: string;
    answer?: { m: string; next: string };
  }[];
  inDialogue?: boolean;
  dialogueStep?: number;
  conversingWith?: Entity;
  dialogueNext?: boolean;

  condition?: conditions;
  interactQueue?: { source: Entity; dialogue?: boolean }[];

  consumable?: {
    hp?: number;
    exp?: number;
    winCondition?: boolean;
  };

  vision?: number;
  viewShed?: {
    dirty: boolean;
    area: Map<string, Vector2>;
  };
}

// Items
export interface Item {
  id: string;
  name: string;
  description: string;
  trap?: string;

  canEquip: boolean;
  equipSlot?: string;

  healAmount: number;
}
