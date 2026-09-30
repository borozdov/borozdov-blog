/**
 * Яндекс.Метрика блога (canon §26). Номер счётчика назван только здесь.
 * Модуль импортируют Head.tsx (загрузчик) и инлайн-скрипты (цели, SPA-хиты).
 */
export const METRIKA_ID = 109047859

type Goal = "theme_toggle" | "search"
type Params = Record<string, string | number>
type Metrika = (id: number, action: string, ...args: unknown[]) => void

const getYm = (): Metrika | undefined => {
  const ym = (window as unknown as { ym?: Metrika }).ym
  return typeof ym === "function" ? ym : undefined
}

/** Цель. Молчит, если счётчик не загрузился, и никогда не бросает. */
export const trackGoal = (goal: Goal, params?: Params): void => {
  try {
    getYm()?.(METRIKA_ID, "reachGoal", goal, params)
  } catch {}
}

/** Хит SPA-перехода: Quartz меняет страницу без перезагрузки. */
export const trackHit = (url: string, referer: string, title: string): void => {
  try {
    getYm()?.(METRIKA_ID, "hit", url, { referer, title })
  } catch {}
}

/**
 * Загрузчик — один шаблонный литерал, без конкатенации (canon §26): сборка
 * сворачивает `+` и однажды уже выбросила из загрузчика кусок кода.
 * Отложенный вариант: стаб ym() создаётся сразу, tag.js грузится после load.
 */
export const metrikaScript = (id: number): string => {
  const src = `https://mc.yandex.ru/metrika/tag.js?id=${id}`
  // Локальная сборка не пишет визиты в боевой счётчик: стаб есть, tag.js не грузится
  return `if(['localhost','127.0.0.1','[::1]'].indexOf(location.hostname)>=0){window.ym=function(){}}else{(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date()})(window,document,'script','${src}','ym');ym(${id},'init',{ssr:true,webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});(function(){function s(){for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src==='${src}'){return}}var k=document.createElement('script'),a=document.getElementsByTagName('script')[0];k.async=1;k.src='${src}';a.parentNode.insertBefore(k,a)}if(document.readyState==='complete'){s()}else{window.addEventListener('load',s,{once:true})}})();}`
}

export const metrikaPixel = (id: number): string => `https://mc.yandex.ru/watch/${id}`
