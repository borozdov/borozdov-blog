import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { FullSlug, canonicalPageUrl } from "../../util/path"

// robots.txt собирается из контента, руками не ведётся (canon §25.3): страницы с
// `noindex: true` (витрина /kitchen-sink и любые служебные) закрыты, карта сайта указана.
export const Robots: QuartzEmitterPlugin = () => ({
  name: "Robots",
  async *emit(ctx, content) {
    const baseUrl = ctx.cfg.configuration.baseUrl
    if (!baseUrl) return

    const origin = canonicalPageUrl(baseUrl, "index" as FullSlug)
    const disallow = content
      .filter(([, file]) => file.data.frontmatter?.noindex === true)
      .map(([, file]) => new URL(canonicalPageUrl(baseUrl, file.data.slug!)).pathname)
      .sort()

    const lines = [
      "User-agent: *",
      "Allow: /",
      ...disallow.map((pathname) => `Disallow: ${pathname}`),
      "",
      `Sitemap: ${origin}sitemap.xml`,
      "",
    ]

    yield write({ ctx, slug: "robots" as FullSlug, ext: ".txt", content: lines.join("\n") })
  },
})
