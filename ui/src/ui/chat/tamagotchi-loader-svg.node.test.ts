import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const REQUIRED_MARKERS = [
  "--loader-ink",
  "--loader-shell",
  "--loader-accent",
  "kf-creat_jump",
  "prefers-reduced-motion: reduce",
];

function readLoaderSvg(pathFromUiRoot: string): string {
  return readFileSync(resolve(process.cwd(), pathFromUiRoot), "utf8");
}

describe("tamagotchi loader SVG variants", () => {
  it("use loader v2 markers in both asset locations", () => {
    const svgInSourceAssets = readLoaderSvg("src/ui/assets/tamagotchi-loader.svg");
    const svgInPublicLoaders = readLoaderSvg("public/loaders/tamagotchi-loader.svg");

    for (const marker of REQUIRED_MARKERS) {
      expect(svgInSourceAssets).toContain(marker);
      expect(svgInPublicLoaders).toContain(marker);
    }
  });
});
