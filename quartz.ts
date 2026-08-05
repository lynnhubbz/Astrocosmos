import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components"
import type { ExplorerOptions } from "./.quartz/plugins"

/* ====================================================================== */
/* EXPLORER WIDGET                                                        */
/* ====================================================================== */

const mapFn: ExplorerOptions["mapFn"] = (node) => {
  // implement your function here
}

const filterFn: ExplorerOptions["filterFn"] = (node) => {
  // Exclude files 
  return (
    node.data?.tags?.includes("explorerexclude") !== true
  )
}

const sortFn: ExplorerOptions["sortFn"] = (a, b) => {
  // implement your function here
}

componentRegistry.setOptionOverrides("explorer", {
  title: "Contents",
  // ... your other options
  // mapFn,
  filterFn
  // sortFn,
})

/* ====================================================================== */
/* SOMETHING                                                              */
/* ====================================================================== */

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
