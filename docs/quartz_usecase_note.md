Working with orphan branch as a worktree.
Need some file to be symlinked and gitignored in other file.

```javascript
export async function glob(
  pattern: string,
  cwd: string,
  ignorePatterns: string[],
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
```