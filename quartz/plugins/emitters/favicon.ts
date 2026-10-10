import fs from "fs"
import path from "path"
import { joinSegments, QUARTZ, FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"

// Иконки рисует генератор бренда (canon §19): ICO 16/32/48 со скруглением и альфой,
// PNG 120 для выдачи Яндекса, 180 для iOS. Кладём их в корень как есть, без пережатия:
// и Яндекс, и Safari запрашивают /favicon.ico и /apple-touch-icon.png напрямую.
const ROOT_ICONS = ["favicon.ico", "favicon-120.png", "apple-touch-icon.png"]

export const Favicon: QuartzEmitterPlugin = () => ({
  name: "Favicon",
  async *emit({ argv }) {
    for (const file of ROOT_ICONS) {
      const ext = path.extname(file) as `.${string}`
      yield write({
        ctx: { argv } as BuildCtx,
        slug: path.basename(file, ext) as FullSlug,
        ext,
        content: await fs.promises.readFile(joinSegments(QUARTZ, "static", file)),
      })
    }
  },
  async *partialEmit() {},
})
