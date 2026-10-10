import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const isIndex = (slug: string | undefined) => slug === "index"

// Шапка сайта: вордмарк, поиск, граф связей, лик, режим чтения. Одна на все страницы.
const siteHeader = [
  Component.PageTitle(),
  Component.Spacer(),
  Component.Search(),
  Component.Graph({
    globalGraph: { scale: 0.8, linkDistance: 40, fontSize: 0.55 },
  }),
  Component.Darkmode(),
  Component.DesktopOnly(Component.ReaderMode()),
]

// Проводник: служебная витрина /kitchen-sink открывается только по прямой ссылке
const explorer = Component.Explorer({
  title: "Разделы",
  folderDefaultState: "open",
  filterFn: (node) => node.slugSegment !== "tags" && node.slugSegment !== "kitchen-sink",
})

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: siteHeader,
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "Последние заметки",
        limit: 10,
        showTags: true,
        // Только заметки: без главной, служебных страниц и index.md папок
        filter: (f) =>
          f.slug !== "index" && !f.slug!.endsWith("/index") && f.frontmatter?.noindex !== true,
      }),
      condition: (page) => isIndex(page.fileData.slug),
    }),
    // Комментарии — обсуждение поста в @BorozdovBlog. Ссылка на пост лежит в заметке:
    // telegram_discussion: https://t.me/BorozdovBlog/123 (или просто 123)
    Component.Comments({
      provider: "telegram",
      options: {
        channel: "BorozdovBlog",
        commentsLimit: 10,
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      "borozdov.ru": "https://borozdov.ru",
      Telegram: "https://t.me/borozdov",
      RSS: "/index.xml",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({ rootName: "Главная", spacerSymbol: "/" }),
      condition: (page) => !isIndex(page.fileData.slug),
    }),
    Component.ArticleTitle(),
    Component.ContentMeta({ showComma: false }),
    Component.TagList(),
  ],
  left: [explorer],
  right: [Component.DesktopOnly(Component.TableOfContents()), Component.Backlinks()],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ rootName: "Главная", spacerSymbol: "/" }),
    Component.ArticleTitle(),
    Component.ContentMeta({ showComma: false }),
  ],
  left: [explorer],
  // Страницы папок и тегов не входят в граф — правая колонка пустая
  right: [],
}
