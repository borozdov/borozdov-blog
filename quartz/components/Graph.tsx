import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/graph.inline"
import style from "./styles/graph.scss"
import { classNames } from "../util/lang"

export interface D3Config {
  drag: boolean
  zoom: boolean
  depth: number
  scale: number
  repelForce: number
  centerForce: number
  linkDistance: number
  fontSize: number
  opacityScale: number
  removeTags: string[]
  showTags: boolean
  focusOnHover?: boolean
  enableRadial?: boolean
}

interface GraphOptions {
  localGraph: Partial<D3Config> | undefined
  globalGraph: Partial<D3Config> | undefined
}

const defaultOptions: GraphOptions = {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.1,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: false,
    enableRadial: false,
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.5,
    centerForce: 0.2,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    enableRadial: true,
  },
}

export default ((opts?: Partial<GraphOptions>) => {
  // Граф открывается кнопкой в шапке, во всплывающем окне: отдельной панели под него нет.
  // ⌘G / Ctrl+G открывает и закрывает его с клавиатуры.
  const Graph: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const globalGraph = { ...defaultOptions.globalGraph, ...opts?.globalGraph }
    return (
      <div class={classNames(displayClass, "graph")}>
        <button
          class="graph-button global-graph-icon"
          type="button"
          aria-label="Граф связей"
          title="Граф связей · ⌘G"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="square"
          >
            <circle cx="6" cy="6" r="2.5" />
            <circle cx="18" cy="9" r="2.5" />
            <circle cx="10" cy="18" r="2.5" />
            <path d="M8.4 6.6l7.2 1.8M6.8 8.4l2.4 7.2M16.3 10.9l-4.6 5.2" />
          </svg>
        </button>
        <div class="global-graph-outer">
          <div class="global-graph-container" data-cfg={JSON.stringify(globalGraph)}></div>
        </div>
      </div>
    )
  }

  Graph.css = style
  Graph.afterDOMLoaded = script

  return Graph
}) satisfies QuartzComponentConstructor
