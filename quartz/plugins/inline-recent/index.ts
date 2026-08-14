import fs from "fs"
import path from "path"

export interface Options {
  limit: number
  showTags: boolean
  title: string
}

const defaultOptions: Options = {
  limit: 5,
  showTags: true,
  title: "Recent Notes",
}

// Directly scans the content folder structure to pull frontmatter profiles on build
function getRecentNotesFromFS(contentDir: string, limit: number): Array<{ slug: string, title: string, date: Date, tags: string[] }> {
  const notes: Array<{ slug: string, title: string, date: Date, tags: string[] }> = []

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        if (!file.startsWith(".") && file !== "node_modules") {
          walk(fullPath)
        }
      } else if (file.endsWith(".md")) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8")
          const match = content.match(/^---([\s\S]*?)---/)
          let title = path.basename(file, ".md")
          let dateStr = ""
          let tags: string[] = []

          if (match) {
            const yaml = match[1]
            const titleMatch = yaml.match(/title:\s*(.*)/)
            const dateMatch = yaml.match(/date:\s*(.*)/)
            const tagsMatch = yaml.match(/tags:\s*\[(.*?)\]/) || yaml.match(/tags:\s*\n((?:\s*-\s.*\n?)+)/)

            if (titleMatch) title = titleMatch[1].replace(/['"]/g, "").trim()
            if (dateMatch) dateStr = dateMatch[1].trim()
            
            if (tagsMatch) {
              if (tagsMatch[1].includes("-")) {
                tags = tagsMatch[1].split("-").map(t => t.trim()).filter(Boolean)
              } else {
                tags = tagsMatch[1].split(",").map(t => t.trim()).filter(Boolean)
              }
            }
          }

          // Use the explicit frontmatter date if available, otherwise fall back to filesystem last modified time
          const date = dateStr ? new Date(dateStr) : stat.mtime
          const relativePath = path.relative(contentDir, fullPath).replace(/\\/g, "/")
          let slug = relativePath.slice(0, -3) // Drop .md extension
          
          if (slug.endsWith("/index")) slug = slug.slice(0, -6)
          if (slug === "index") slug = ""

          notes.push({ slug, title, date, tags })
        } catch (e) {
          // Skip unreadable files safely
        }
      }
    }
  }

  walk(contentDir)
  return notes.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit)
}

export const InlineRecentNotes = (userOpts?: Partial<Options>): any => {
  const opts = { ...defaultOptions, ...userOpts }
  
  return {
    name: "InlineRecentNotes",
    textTransform(ctx: any, src: string) {
      // Defensive check: ensure src is a valid string and contains our placeholder token
      if (typeof src !== "string" || (!src.includes("<recent-notes>") && !src.includes("<recent-notes/>") && !src.includes("id=\"recent-notes\""))) {
        return src
      }

      const contentDir = path.resolve("content")
      const recentPages = getRecentNotesFromFS(contentDir, opts.limit)

      let htmlContent = `<div class="inline-recent-notes"><h3>${opts.title}</h3><ul class="recent-ul">`

      for (const page of recentPages) {
        const urlPath = page.slug === "" ? "/" : `/${page.slug}`
        
        // Format the resolved date using a standard scannable format (e.g., Nov 24, 2026)
        const formattedDate = page.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
        
        htmlContent += `<li class="recent-li" style="margin-bottom: 8px;"><div class="section"><div class="desc" style="display: flex; align-items: baseline; gap: 8px;">`
        htmlContent += `<a href="${urlPath}" class="internal" style="font-weight: 500;">${page.title}</a>`
        htmlContent += `<span class="recent-date" style="font-size: 0.8em; color: var(--gray); font-style: italic;">— ${formattedDate}</span>`
        htmlContent += `</div>`
        
        if (opts.showTags && page.tags.length > 0) {
          htmlContent += `<ul class="tags" style="margin-top: 4px;">`
          for (const tag of page.tags) {
            htmlContent += `<li><a href="/tags/${tag}" class="internal tag-link">#${tag}</a></li>`
          }
          htmlContent += `</ul>`
        }
        htmlContent += `</div></li>`
      }
      htmlContent += `</ul></div>`

      // Replace custom element placeholders anywhere inside the raw text stream safely
      return src
        .replace(/<recent-notes\s*\/?>/g, htmlContent)
        .replace(/<div\s+id=["']recent-notes["']\s*><\/div>/g, htmlContent)
    }
  }
}

export default InlineRecentNotes
