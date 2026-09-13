each entry should have:

1. a `readme` markdown file
2. a metadata authorship file, named `metadata.yaml`
3. the information stored in some extension like json or such, named `index-data.ltf` or `index-data.toml`
4. the long description stored in some markdown or text files, 
   1. the main file is named `index.md`.
   2. `index-chronology.md`, 
      - located in the same folder as its index, this then be created a linked file under the `chronology` folder. 
      - the main file will embed history file
5. some script for making the data/information, preferably python or notebook  
6. the visualizer stored as graphic or audio files

`.README.md` and `metadata.yaml` MUST NOT be renamedi

IF the scripts, docs, and assets are getting cluttered, it COULD be grouped by folders but the folders MUST be named with `_scripts`, `_docs`, and `_assets`. 

assets are stored per entry, thus is not unified for the whole project.

`.README.md` file contains:
1. Directory Map of the entry