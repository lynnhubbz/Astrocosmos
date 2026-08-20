This folder gitignores all the contents except: 
- `watchlist.default.yaml`
- `xlsxTOtables.default.yaml`
- `README.md`
- `.gitignore`

So it doesnt and shouldnt track your local edits, while the yaml get updated

copy the `watchlist.default.yaml` and rename the copy into `watchlist.yaml`

## Summary of the workflow

To make submissions centrilized, there are few aspect about this:
1. push/put submission into content
2. pull/fetch content into submission
3. supportin changes handling

Number 1 is copy&paste. but number 2 must be a metadata detection.

In short and summarized, the workflow for this centralized is:
1. submitter define a manifest where to put where
2. creates (unique) metadata
3. push/put
4. to fetch, script check the path defined in manifest firstly
5. if not found, then detect metadata for the whole content childrens
6. if still not found, put error without stopping the script
7. update the manifest
8. fetch

See the complete workflow [here](../docs/guidelines/workflow.md#submission-folder-workflow)