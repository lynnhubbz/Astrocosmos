import path from "path"
import { FilePath } from "./path"
import { globby } from "globby"

export function toPosixPath(fp: string): string {
  return fp.split(path.sep).join("/")
}

export async function glob(
  pattern: string,
  cwd: string,
  ignorePatterns: [
    "content/"
  ],
): Promise<FilePath[]> {
  const fps = (
    await globby(pattern, {
      cwd,
      ignore: ignorePatterns,
// @note : make somethign like an exception list for this, because Quartz cant read content/ because it is gitignored
// for now, gitignore will remain false. default=true
      gitignore: false, 
    })
  ).map(toPosixPath)
  return fps as FilePath[]
}
