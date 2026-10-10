// `telegram_discussion` → "channel/123" для виджета. Принимает ссылку на пост в любом
// виде (https://t.me/ch/123, t.me/s/ch/123?single, telegram.me/ch/123/), "ch/123"
// и просто номер поста — тогда канал берётся из опций. Приватные t.me/c/… виджет не
// показывает (у них нет юзернейма канала), их и мусор отбрасываем.
export function telegramDiscussionId(value: unknown, channel?: string): string | null {
  const raw = String(value ?? "").trim()
  if (/^\d+$/.test(raw)) return channel ? `${channel}/${raw}` : null
  const path = raw
    .replace(/^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\//i, "")
    .replace(/^s\//, "")
    .split(/[?#]/)[0]
    .replace(/\/+$/, "")
  const match = path.match(/^([A-Za-z][A-Za-z0-9_]{3,})\/(\d+)$/)
  return match ? `${match[1]}/${match[2]}` : null
}
