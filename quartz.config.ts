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
    // Метрика подключена в Head.tsx (canon §26); сторонней аналитики нет
    analytics: null,
    locale: "ru-RU",
    baseUrl: "blog.borozdov.ru",
    ignorePatterns: ["private", "templates", ".templates", ".attachments", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      // Шрифты — самохостинг (quartz/static/fonts, @font-face в Head.tsx)
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      // BOROZDOV: переменные самого Quartz, выраженные через роли бренда (canon §2).
      // Источник истины — токены в quartz/styles/custom.scss; значения здесь им равны.
      colors: {
        lightMode: {
          light: "#fafafa", // canvas
          lightgray: "#e4e4e4", // hairline
          gray: "#6b6b6b", // slate
          darkgray: "#3d3d3d", // soft — основной текст абзацев
          dark: "#0d0d0d", // ink — заголовки
          secondary: "#0d0d0d", // ссылки — тот же полюс, что и текст
          tertiary: "#8a8a8a", // tertiary
          highlight: "#ececec", // inset
          textHighlight: "rgba(13, 13, 13, 0.22)", // focus-ring
        },
        darkMode: {
          light: "#0d0d0d",
          lightgray: "#2e2e2e",
          gray: "#8a8a8a",
          darkgray: "#d1d1d1",
          dark: "#fafafa",
          secondary: "#fafafa",
          tertiary: "#6b6b6b",
          highlight: "#121212",
          textHighlight: "rgba(250, 250, 250, 0.22)",
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
      // Подсветка только серой шкалой (canon §10.6): цвета Shiki гасятся в syntax.scss,
      // иерархию токенов несут вес, курсив и прозрачность.
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
    ],
  },
}

export default config
