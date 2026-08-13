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
  // Define targets
  const isTagIndexA = a.name === "tag-index" || a.displayName === "Tag Index"
  const isTagIndexB = b.name === "tag-index" || b.displayName === "Tag Index"

  const isSubmissionA = a.name === "submission" || a.displayName === "Submission"
  const isSubmissionB = b.name === "submission" || b.displayName === "Submission"

  // 1. Rank Tag Index above Submission, but below everything else
  if (isTagIndexA && isSubmissionB) return -1
  if (isSubmissionA && isTagIndexB) return 1

  // 2. Force Submission to the absolute bottom against any standard item
  if (isSubmissionA && !isSubmissionB) return 1
  if (isSubmissionB && !isSubmissionA) return -1

  // 3. Force Tag Index second to last against any standard item
  if (isTagIndexA && !isTagIndexB) return 1
  if (isTagIndexB && !isTagIndexA) return -1

  // 4. Structural Rule: Prioritize standalone files over folders
  if (!a.isFolder && b.isFolder) return -1
  if (a.isFolder && !b.isFolder) return 1

  // 5. Fallback: Sort remaining siblings alphabetically
  return a.displayName.localeCompare(b.displayName, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}




componentRegistry.setOptionOverrides("explorer", {
  title: "Contents",
  // ... your other options
  // mapFn,
  filterFn,
  sortFn,
  order: ["filter", "map", "sort"],
})

/* ====================================================================== */
/* SOMETHING                                                              */
/* ====================================================================== */

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
