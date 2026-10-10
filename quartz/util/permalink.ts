import fs from "fs"
import path from "path"
import matter from "gray-matter"
import yaml from "js-yaml"
import { styleText } from "util"
import { FilePath, FullSlug, permalinkSlug, slugifyFilePath } from "./path"

// Адреса из свойства `permalink` читаются до разбора заметок: slug страницы должен быть
// известен всем сразу, иначе вики-ссылки по имени файла вели бы на редирект, а обратные
// ссылки и граф теряли бы связь. Результат: slug по пути файла → slug из permalink.
export async function readSlugOverrides(
  directory: string,
  markdownPaths: string[],
): Promise<Record<string, FullSlug>> {
  const overrides: Record<string, FullSlug> = {}
  const owners = new Map<FullSlug, string>()

  for (const fp of markdownPaths) {
    const fileSlug = slugifyFilePath(fp as FilePath)
    let data: Record<string, unknown> = {}
    try {
      const text = await fs.promises.readFile(path.join(directory, fp), "utf8")
      if (!text.startsWith("---")) continue
      data = matter(text, {
        engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
      }).data
    } catch {
      continue // битый frontmatter покажет сам FrontMatter при разборе
    }

    const slug = permalinkSlug(data.permalink, fileSlug) ?? fileSlug
    if (slug !== fileSlug) overrides[fileSlug] = slug

    const owner = owners.get(slug)
    if (owner) {
      console.warn(styleText("yellow", `Warning: ${fp} and ${owner} share the address /${slug}/`))
    }
    owners.set(slug, fp)

    // Адрес без permalink берётся из имени файла; кириллица в нём уйдёт в процент-код
    if (data.draft !== true && /[^\x00-\x7f]/.test(slug)) {
      console.warn(
        styleText("yellow", `Warning: ${fp} has no English permalink, its address is /${slug}/`),
      )
    }
  }

  return overrides
}
