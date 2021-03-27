import { CharCode, Color, Glyph } from 'malwoden';

// Level
export enum Terrain {
  none = 0,
  tree = 1,
  mountain = 2,
  hedge = 4,

  mushroomRed = 5,
  mushroomPurple = 6,
  mushroomDarkPurple = 7,

  wall = 8,
}

export const TerrainCollision: { [e in Terrain]: boolean } = {
  [Terrain.none]: false,
  [Terrain.tree]: true,
  [Terrain.mountain]: true,
  [Terrain.hedge]: true,

  [Terrain.mushroomRed]: true,
  [Terrain.mushroomPurple]: true,
  [Terrain.mushroomDarkPurple]: true,

  [Terrain.wall]: true,
};

export const TerrainGlyphs: { [e in Terrain]: Glyph | undefined } = {
  [Terrain.none]: Glyph.fromCharCode(
    CharCode.blackSquare,
    Color.Black,
    Color.Black,
  ),
  [Terrain.tree]: Glyph.fromCharCode(CharCode.blackSpadeSuit, Color.Green),
  [Terrain.mountain]: Glyph.fromCharCode(
    CharCode.blackUpPointingTriangle,
    Color.Brown,
  ),
  [Terrain.hedge]: Glyph.fromCharCode(CharCode.greekSmallLetterPi),

  [Terrain.mushroomRed]: Glyph.fromCharCode(CharCode.blackSpadeSuit, Color.Red),
  [Terrain.mushroomPurple]: Glyph.fromCharCode(
    CharCode.blackClubSuit,
    Color.MediumPurple,
  ),
  [Terrain.mushroomDarkPurple]: Glyph.fromCharCode(
    CharCode.blackSpadeSuit,
    Color.Purple,
  ),
  [Terrain.wall]: Glyph.fromCharCode(CharCode.asterisk, Color.White),
};

export const FOWTerrainGlyphs: { [e in Terrain]: Glyph | undefined } = {
  [Terrain.none]: Glyph.fromCharCode(
    CharCode.blackSquare,
    Color.Black.blendPercent(Color.DimGray, 50),
    Color.Black.blendPercent(Color.DimGray, 50),
  ),
  [Terrain.tree]: Glyph.fromCharCode(
    CharCode.blackSpadeSuit,
    Color.Black.blendPercent(Color.DimGray, 20),
    Color.Black.blendPercent(Color.DimGray, 50),
  ),
  [Terrain.mountain]: Glyph.fromCharCode(
    CharCode.blackUpPointingTriangle,
    Color.DarkGray,
  ),
  [Terrain.hedge]: Glyph.fromCharCode(CharCode.greekSmallLetterPi),
  [Terrain.mushroomRed]: Glyph.fromCharCode(
    CharCode.blackSpadeSuit,
    Color.Gray,
  ),
  [Terrain.mushroomPurple]: Glyph.fromCharCode(
    CharCode.blackClubSuit,
    Color.DimGray,
  ),
  [Terrain.mushroomDarkPurple]: Glyph.fromCharCode(
    CharCode.blackSpadeSuit,
    Color.DarkGray,
  ),
  [Terrain.wall]: Glyph.fromCharCode(CharCode.asterisk, Color.Gray),
};

// Used by View System to calculate FOV
export const TerrainBlocksVision: { [e in Terrain]: boolean } = {
  [Terrain.none]: false,
  [Terrain.tree]: true,
  [Terrain.mountain]: true,
  [Terrain.hedge]: true,
  [Terrain.mushroomRed]: true,
  [Terrain.mushroomPurple]: true,
  [Terrain.mushroomDarkPurple]: true,
  [Terrain.wall]: true,
};
