import { Util } from 'malwoden';

export function strokeTable<T>(table: Util.Table<T>, val: T) {
  for (let x = 0; x < table.width; x++) {
    for (let y = 0; y < table.height; y++) {
      if (
        x === 0 ||
        x === table.width - 1 ||
        y === 0 ||
        y === table.height - 1
      ) {
        table.set({ x, y }, val);
      }
    }
  }
}
