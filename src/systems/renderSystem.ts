import { Terminal, GUI, Input, Color, CharCode, Vector2 } from 'malwoden';
import { Stage } from '../util/stage';
import { FOWTerrainGlyphs, TerrainGlyphs } from '../util/terrain';
import { GameState, state } from '../util/globals';
import { Entity } from '../characters/entity';
import { Log, LogLevel } from '../util/logs';
import { diaLog } from '../util/diaLogs';

interface RenderSystemContext {
  stage: Stage;
  terminal: Terminal.RetroTerminal;
  mapTerminal: Terminal.PortTerminal;
}

const logLevelColor: { [l in LogLevel]: Color } = {
  high: Color.Cyan,
  mid: Color.White,
  low: Color.Gray,
  warning: Color.Red,
};

export class RenderSystem {
  mouse = new Input.MouseHandler();

  loop({ terminal, mapTerminal }: RenderSystemContext) {
    // Rendering
    terminal.clear();
    const player = state.stage.entites.find((x) => x.player);
    const playerViewshed = player?.viewShed?.area || new Map<string, Vector2>();

    // Player Box
    GUI.box(terminal, {
      title: 'Player',
      origin: { x: 0, y: 0 },
      width: 15,
      height: 20,
    });
    if (player) {
      if (player.stats) {
        terminal.writeAt(
          { x: 2, y: 2 },
          `HP: ${player.stats.hp}/${player.stats.maxHp}`,
        );
        drawBar(
          terminal,
          { x: 2, y: 3 },
          10,
          player.stats.hp / player.stats.maxHp,
          Color.Red,
        );

        terminal.writeAt({ x: 2, y: 5 }, `EXP`);

        terminal.writeAt({ x: 2, y: 9 }, `Level:  ${player.stats.level}`);
        terminal.writeAt({ x: 2, y: 10 }, `Attack: ${player.stats.attack}`);
        terminal.writeAt({ x: 2, y: 11 }, `Armor:  ${player.stats.armor}`);
      }
    }

    terminal.writeAt({ x: 2, y: 18 }, '(h) help');

    // -------------------------------------------------------------------------
    // Logs
    // -------------------------------------------------------------------------

    GUI.box(terminal, {
      title: 'Log',
      origin: { x: 16, y: 40 },
      width: 53,
      height: 9,
    });

    for (let i = 0; i < Log.length(); i++) {
      const [logLevel, txt] = Log.entries[i];
      const logColor = logLevelColor[logLevel];
      terminal.writeAt({ x: 17, y: 41 + i }, txt, logColor);
    }

    // -------------------------------------------------------------------------
    // Draw World
    // -------------------------------------------------------------------------
    GUI.box(terminal, {
      origin: { x: 16, y: 0 },
      width: 53,
      height: 39,
    });
    terminal.writeAt({ x: 17, y: 0 }, `Location: ${state.stage.name} `);

    for (let x = 0; x < state.stage.map.width; x++) {
      for (let y = 0; y < state.stage.map.height; y++) {
        const v = { x, y };
        const terrain = state.stage.map.get({ x, y });

        const isVisible =
          state.stage.fowVisited.isInBounds(v) && state.stage.fowVisited.get(v);

        if (!isVisible) {
          mapTerminal.drawCharCode(
            v,
            CharCode.blackSquare,
            Color.DimGray.blendPercent(Color.Black, 70),
            Color.DimGray.blendPercent(Color.Black, 70),
          );
          continue;
        }

        // Draw FOW Terrain
        if (terrain !== undefined) {
          const glyph = FOWTerrainGlyphs[terrain];
          if (glyph) {
            mapTerminal.drawGlyph({ x, y }, glyph);
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // possible dialogue box
    // -------------------------------------------------------------------------
    if (player && player.inDialogue === true) {
      GUI.box(terminal, {
        title: 'chat',
        origin: { x: 16, y: 40 },
        width: 53,
        height: 9,
      });

      for (let i = 0; i < diaLog.length(); i++) {
        const [logLevel, txt] = diaLog.entries[i];
        const logColor = logLevelColor[logLevel];
        terminal.writeAt({ x: 17, y: 41 + i }, txt, logColor);
        terminal.writeAt({ x: 28, y: 40 }, 'press spacebar to continue.');
      }
    }

    // Calculate for player's viewshed

    const entitiesInSight: Entity[] = [];
    playerViewshed.forEach((pos) => {
      const terrain = state.stage.map.get(pos);
      const entities = state.posCache.get(`${pos.x}:${pos.y}`) || [];
      entitiesInSight.push(...entities);

      // Draw Revealed Terrain
      if (terrain !== undefined) {
        const glyph = TerrainGlyphs[terrain];
        if (glyph) {
          mapTerminal.drawGlyph(pos, glyph);
        }
      }
      // Draw entities
      if (entities?.length) {
        const sortedEntities = entities.sort(
          (a, b) => b.renderPriority - a.renderPriority,
        );
        for (let e of sortedEntities) {
          mapTerminal.drawGlyph(e.position, e.glyph);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Info Box
    // -------------------------------------------------------------------------
    GUI.box(terminal, {
      title: 'Info',
      origin: { x: 0, y: 21 },
      width: 15,
      height: 28,
    });

    // Info HP
    const infoEntities = entitiesInSight
      .filter((x) => x.enemy && x.stats) // Only get enemies with stats
      .sort((a, b) => a.id.localeCompare(b.id)); // Sort to make sure we always render the same order

    for (let i = 0; i < Math.min(infoEntities.length, 5); i++) {
      const e = infoEntities[i];
      const y = 23 + i * 3;
      terminal.writeAt({ x: 2, y: y }, e.name);
      drawBar(
        terminal,
        { x: 2, y: y + 1 },
        10,
        e.stats!.hp / e.stats!.maxHp,
        e.glyph.fore,
      );
    }

    // -------------------------------------------------------------------------
    // Labels
    // -------------------------------------------------------------------------
    const mousePos = this.mouse.getPos();
    const termPos = terminal.pixelToChar(mousePos);

    // Offset for portTerminal

    // World Position offset for port terminal
    const worldPos = {
      x: termPos.x - 17,
      y: termPos.y - 1,
    };

    // Only draw the label if the player can see it
    if (player?.viewShed?.area.has(`${worldPos.x}:${worldPos.y}`)) {
      const selectedEntities = state.posCache.get(
        `${worldPos.x}:${worldPos.y}`,
      );
      if (selectedEntities?.length) {
        drawLabel(terminal, termPos, selectedEntities[0].name);
      }
    }

    if (state.currentGameState === GameState.GAME_WIN) {
      renderWon(mapTerminal);
    }
    if (state.currentGameState === GameState.GAME_LOSS) {
      renderLost(mapTerminal);
    }
    // Render Help
    if (state.help) {
      renderHelp(terminal);
    }

    // Render Terminal
    terminal.render();
  }
}

function drawBar(
  terminal: Terminal.BaseTerminal,
  pos: Vector2,
  width: number,
  percent: number,
  color: Color,
) {
  const filledWidth = Math.ceil(width * percent);

  for (let x = 0; x < width; x++) {
    const isFilled = x <= filledWidth;
    const c = isFilled ? color : color.blend(Color.Black);
    terminal.drawCharCode(
      { x: pos.x + x, y: pos.y },
      CharCode.blackSquare,
      c,
      c,
    );
  }
}

function drawLabel(
  terminal: Terminal.BaseTerminal,
  pos: Vector2,
  text: string,
) {
  if (pos.x < 50) {
    const textPos = { x: pos.x + 3, y: pos.y };
    terminal.drawCharCode(
      { x: pos.x + 1, y: pos.y },
      CharCode.leftwardsArrow,
      Color.DarkSlateGray,
      Color.White,
    );
    terminal.drawCharCode(
      { x: pos.x + 2, y: pos.y },
      CharCode.blackSquare,
      Color.White,
      Color.DarkSlateGray,
    );
    terminal.writeAt(textPos, text, Color.White, Color.DarkSlateGray);
  } else {
    terminal.drawCharCode(
      {
        x: pos.x - 1,
        y: pos.y,
      },
      CharCode.rightwardsArrow,
      Color.DarkSlateGray,
      Color.White,
    );
    terminal.drawCharCode(
      {
        x: pos.x - 2,
        y: pos.y,
      },
      CharCode.blackSquare,
      Color.White,
      Color.DarkSlateGray,
    );
    const textPos = { x: pos.x - 2 - text.length, y: pos.y };
    terminal.writeAt(textPos, text, Color.White, Color.DarkSlateGray);
  }
}

function renderHelp(terminal: Terminal.BaseTerminal) {
  GUI.box(terminal, {
    origin: { x: 2, y: 2 },
    width: 65,
    height: 45,
    title: 'Help',
  });

  // Intro Start X/Y
  const isX = 5;
  const isY = 6;

  terminal.writeAt({ x: isX, y: isY }, 'Help');
  terminal.writeAt({ x: isX + 5, y: isY }, 'Mal the Snail', Color.Yellow);
  terminal.writeAt({ x: isX + 19, y: isY }, 'travel through the garden,');

  terminal.writeAt({ x: isX, y: isY + 2 }, 'and retrieve the ');
  terminal.writeAt(
    { x: isX + 17, y: isY + 2 },
    'Mystic Shell',
    Color.MediumPurple,
  );
  terminal.writeAt({ x: isX + 29, y: isY + 2 }, '.');

  // Controls

  const cX = 5;
  const cY = 12;
  terminal.writeAt({ x: cX, y: cY }, '-- Controls --', Color.Cyan);
  terminal.writeAt({ x: cX, y: cY + 2 }, '- Use ↑ ↓ ← → to move.');
  terminal.writeAt({ x: cX, y: cY + 4 }, '- Use (Space) to skip a turn.');
  terminal.writeAt(
    { x: cX, y: cY + 6 },
    '- Move into an enemy to attack them.',
  );
  terminal.writeAt(
    { x: cX, y: cY + 8 },
    '- Hover over objects to see a description.',
  );

  // Quit
  const qX = 47;
  const qY = 45;
  terminal.writeAt({ x: qX, y: qY }, 'Press (esc) to ');
  terminal.writeAt({ x: qX + 15, y: qY }, '@_,', Color.Yellow);
}

const winAnim = {
  faceRight: true,
  dX: 0,
};

setInterval(() => {
  if (state.currentGameState !== GameState.GAME_WIN) {
    winAnim.faceRight = true;
    winAnim.dX = 0;
    return;
  }
  if (winAnim.faceRight) {
    if (winAnim.dX < 25) {
      winAnim.dX++;
    } else {
      winAnim.faceRight = false;
    }
  } else {
    if (winAnim.dX > 0) {
      winAnim.dX--;
    } else {
      winAnim.faceRight = true;
    }
  }
}, 150);

function renderWon(terminal: Terminal.PortTerminal) {
  terminal.clear();

  const wX = 12;
  const wY = 15;

  terminal.writeAt({ x: wX, y: wY }, 'Mal', Color.Yellow);
  terminal.writeAt({ x: wX + 4, y: wY }, 'found the');
  terminal.writeAt({ x: wX + 14, y: wY }, 'Mystic Shell!', Color.MediumPurple);

  const mX = 12;
  const mY = 10;

  if (winAnim.faceRight) {
    terminal.writeAt({ x: mX + winAnim.dX, y: mY }, '@', Color.MediumPurple);
    terminal.writeAt({ x: mX + 1 + winAnim.dX, y: mY }, '_,', Color.Yellow);
  } else {
    terminal.writeAt({ x: mX - 3 + winAnim.dX, y: mY }, ',_', Color.Yellow);
    terminal.writeAt(
      { x: mX - 1 + winAnim.dX, y: mY },
      '@',
      Color.MediumPurple,
    );
  }

  terminal.writeAt(
    { x: 5, y: 20 },
    "With the shell's wisdom, the snail kingdom",
  );
  terminal.writeAt({ x: 7, y: 22 }, 'would propser under a new golden age.');
  terminal.writeAt({ x: 12, y: 26 }, 'Not the fastest golden age,');
  terminal.writeAt({ x: 15, y: 28 }, 'but good nonetheless.');

  // Quit
  const qX = 25;
  const qY = 35;
  terminal.writeAt({ x: qX, y: qY }, 'Press (esc) to ');
  terminal.writeAt({ x: qX + 15, y: qY }, '@_,', Color.Yellow);
  terminal.writeAt({ x: qX + 19, y: qY }, 'again!');
}

function renderLost(terminal: Terminal.PortTerminal) {
  terminal.clear();

  const wX = 20;
  const wY = 15;

  terminal.writeAt({ x: wX, y: wY }, 'Mal', Color.Yellow);
  terminal.writeAt({ x: wX + 4, y: wY }, 'has');
  terminal.writeAt({ x: wX + 8, y: wY }, 'Died!', Color.Red);

  const mX = 24;
  const mY = 10;

  terminal.writeAt({ x: mX + winAnim.dX, y: mY }, '@_,', Color.Red);

  // Quit
  const qX = 25;
  const qY = 35;
  terminal.writeAt({ x: qX, y: qY }, 'Press (esc) to ');
  terminal.writeAt({ x: qX + 15, y: qY }, '@_,', Color.Yellow);
  terminal.writeAt({ x: qX + 19, y: qY }, 'again!');
}
