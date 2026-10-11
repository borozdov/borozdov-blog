import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { resolveRelative } from "../util/path"
import { byDateAndAlphabetical } from "./PageList"

interface Options {
  // Какие страницы — заметки ленты. Тот же фильтр, что у «Последних заметок»
  filter: (f: QuartzPluginData) => boolean
}

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="square"
  >
    <path d={dir === "left" ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"} />
  </svg>
)

// Соседние заметки по дате: «Раньше» — старше текущей, «Позже» — новее.
// Вид — styles/brand/_navigation.scss (раздел «Соседние заметки»).
export default ((opts: Options) => {
  const NoteNav: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
    if (!opts.filter(fileData)) return null
    const notes = allFiles.filter(opts.filter).sort(byDateAndAlphabetical(cfg))
    const index = notes.findIndex((f) => f.slug === fileData.slug)
    if (index === -1) return null

    const newer = notes[index - 1]
    const older = notes[index + 1]
    if (!newer && !older) return null

    const title = (f: QuartzPluginData) => f.frontmatter?.title ?? f.slug
    return (
      <nav class="note-nav" aria-label="Соседние заметки">
        {older && (
          <a
            class="note-nav__link note-nav__link--prev"
            href={resolveRelative(fileData.slug!, older.slug!)}
            rel="prev"
          >
            <span class="note-nav__label">
              <Arrow dir="left" />
              Раньше
            </span>
            <span class="note-nav__title">{title(older)}</span>
          </a>
        )}
        {newer && (
          <a
            class="note-nav__link note-nav__link--next"
            href={resolveRelative(fileData.slug!, newer.slug!)}
            rel="next"
          >
            <span class="note-nav__label">
              Позже
              <Arrow dir="right" />
            </span>
            <span class="note-nav__title">{title(newer)}</span>
          </a>
        )}
      </nav>
    )
  }

  return NoteNav
}) satisfies QuartzComponentConstructor<Options>
