import type { BeastId } from "./beastProfile";

/** 官方幻兽立绘：`/public/beasts/*.png`（黑底 PNG；`PhantomBeastCanvas` 使用 lighten 融底）。 */
export const BEAST_PORTRAIT_SRC: Record<BeastId, string> = {
  leon: "/beasts/leon.png",
  mercury: "/beasts/mercury.png",
  atlas: "/beasts/atlas.png",
  luna: "/beasts/luna.png",
  pyro: "/beasts/pyro.png",
  volt: "/beasts/volt.png",
};
