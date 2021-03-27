import { state } from '../util/globals';

export class CacheSystem {
  loop() {
    // Update the position cache
    state.posCache.clear();
    for (let e of state.stage.entites) {
      const key = `${e.position.x}:${e.position.y}`;

      if (state.posCache.has(key)) {
        state.posCache.get(key)?.push(e);
      } else {
        state.posCache.set(key, [e]);
      }

      // Update the player cache
      if (e.player) {
        state.playerCache = e;
      }
    }
  }
}
