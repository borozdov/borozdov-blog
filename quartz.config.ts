import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "BOROZDOV",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ru-RU",
    baseUrl: "blog.borozdov.ru",
    ignorePatterns: ["private", "templates", ".templates", ".attachments", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      // BOROZDOV brand: два лика — ТИТАН (light) и ОБСИДИАН (dark), только серая шкала
      colors: {
        lightMode: {
          light: "#fafafa", // canvas
          lightgray: "#e4e4e4", // border
          gray: "#6b6b6b", // slate
          darkgray: "#0d0d0d", // text
          dark: "#0d0d0d", // text
          secondary: "#0d0d0d", // ссылки — тот же полюс текста, различаются подчёркиванием
          tertiary: "#3d3d3d", // soft — ховеры
          highlight: "rgba(13, 13, 13, 0.05)",
          textHighlight: "rgba(13, 13, 13, 0.12)",
        },
        darkMode: {
          light: "#0d0d0d", // canvas
          lightgray: "#2e2e2e", // border
          gray: "#8a8a8a", // slate
          darkgray: "#fafafa", // text
          dark: "#fafafa", // text
          secondary: "#fafafa",
          tertiary: "#d1d1d1", // soft — ховеры
          highlight: "rgba(250, 250, 250, 0.06)",
          textHighlight: "rgba(250, 250, 250, 0.16)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.HardLineBreaks(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages({
        generateFallbackImages: false,
      }),
    ],
  },
}

export default config
