// Пост-сборка для Timeweb App Platform (Caddy, SPA fallback выключен).
//
// Quartz кладёт страницы в `slug.html`, а ссылается на них без расширения: `/slug`.
// Caddy не умеет try_files `{path}.html`, а каталог `slug/index.html` отдаёт только
// после редиректа 308 на `/slug/` — и тогда ломаются относительные пути Quartz.
// Поэтому страница переезжает в файл без расширения: Caddy отдаёт `/slug` как есть,
// тип определяет по содержимому (`<!DOCTYPE html>` → text/html).
//
// Не трогаем: `index.html` (индексы каталогов) и `404.html` (его ищет Caddy).
// Если рядом уже есть каталог с тем же именем — оставляем `.html`, иначе конфликт.
import fs from "node:fs/promises"
import path from "node:path"

const root = path.resolve(process.argv[2] ?? "public")
const KEEP = new Set(["index.html", "404.html"])

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

let moved = 0
const skipped = []
for await (const file of walk(root)) {
  if (!file.endsWith(".html") || KEEP.has(path.basename(file))) continue
  const target = file.slice(0, -".html".length)
  const clash = await fs.stat(target).catch(() => null)
  if (clash) {
    skipped.push(path.relative(root, file))
    continue
  }
  await fs.rename(file, target)
  moved += 1
}

console.log(`flatten-html: ${moved} pages moved to extensionless paths`)
if (skipped.length > 0) {
  console.warn(`flatten-html: kept .html because of a same-named folder: ${skipped.join(", ")}`)
}
