import { i18n } from "../i18n"
import { FullSlug, canonicalPageUrl, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { METRIKA_ID, metrikaPixel, metrikaScript } from "./scripts/metrika"
// @ts-ignore
import metrikaHitScript from "./scripts/metrika.inline"

// Латиница и кириллица, вариативные 400–700 (canon §4.4)
const CYRILLIC_RANGE = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"
const LATIN_RANGE =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
const fontFace = (family: string, file: string, range: string) =>
  `@font-face{font-family:"${family}";font-style:normal;font-weight:400 700;font-display:swap;src:url("/static/fonts/${file}.woff2") format("woff2");unicode-range:${range}}`
const fontFaces = [
  fontFace("Inter", "inter-cyrillic", CYRILLIC_RANGE),
  fontFace("Inter", "inter-latin", LATIN_RANGE),
  fontFace("JetBrains Mono", "jetbrains-mono-cyrillic", CYRILLIC_RANGE),
  fontFace("JetBrains Mono", "jetbrains-mono-latin", LATIN_RANGE),
].join("")

function nonEmptyString(value: unknown): string | undefined {
  const text = typeof value === "string" ? value.trim() : undefined
  return text ? text : undefined
}

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      nonEmptyString(fileData.frontmatter?.socialDescription) ??
      nonEmptyString(fileData.frontmatter?.description) ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : canonicalPageUrl(cfg.baseUrl!, fileData.slug!)

    const ogImagePath = `https://${cfg.baseUrl}/static/og-image.png`

    const noindex = fileData.slug === "404" || fileData.frontmatter?.noindex === true
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: cfg.pageTitle,
      url: url.toString(),
      inLanguage: "ru",
      author: { "@type": "Person", name: "Никита Бороздов", url: "https://borozdov.ru/" },
    })

    return (
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="author" content="Никита Бороздов" />
        {noindex && <meta name="robots" content="noindex, follow" />}
        {!noindex && cfg.baseUrl && <link rel="canonical" href={socialUrl} />}

        {/* Шрифты — самохостинг (canon §4.4): @font-face инлайном, preload первого экрана */}
        <link
          rel="preload"
          href={joinSegments(baseDir, "static/fonts/inter-cyrillic.woff2")}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={joinSegments(baseDir, "static/fonts/inter-latin.woff2")}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={joinSegments(baseDir, "static/fonts/jetbrains-mono-latin.woff2")}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style data-persist dangerouslySetInnerHTML={{ __html: fontFaces }} />

        <meta name="yandex-verification" content="80f947e774535d84" />
        <meta
          name="google-site-verification"
          content="qOwWmdq24kGcVTyxc1GL2W8TxQk63Z5lBH3NSv4hH4s"
        />

        <meta property="og:site_name" content={cfg.pageTitle} />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImagePath} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content={cfg.pageTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImagePath} />
        {cfg.baseUrl && (
          <>
            <meta property="og:url" content={socialUrl} />
            <meta name="twitter:domain" content={cfg.baseUrl} />
            <meta name="twitter:url" content={socialUrl} />
          </>
        )}

        {/* Иконки бренда (canon §19): .ico первым и с sizes */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="120x120" href="/static/favicon-120.png" />
        <link rel="apple-touch-icon" href="/static/apple-touch-icon.png" />
        <link rel="manifest" href="/static/site.webmanifest" />

        {/* Один тег с id: лик выбирает переключатель (canon §12.4) */}
        <meta name="theme-color" id="meta-theme-color" content="#0d0d0d" />
        <meta name="color-scheme" content="dark light" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BOROZDOV" />
        <meta name="application-name" content="BOROZDOV" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="generator" content="Quartz" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <link rel="preconnect" href="https://mc.yandex.ru" />
        <script data-persist dangerouslySetInnerHTML={{ __html: metrikaScript(METRIKA_ID) }} />
        <noscript>
          <img class="metrika-pixel" src={metrikaPixel(METRIKA_ID)} alt="" />
        </noscript>

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  Head.afterDOMLoaded = metrikaHitScript
  return Head
}) satisfies QuartzComponentConstructor
