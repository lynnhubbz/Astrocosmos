### branching/forking workflow

~~~mermaid
flowchart TD
    %% Define the core branches
    M[branch: main]
    D[branch: big retcon and change]
    S[branch/fork: submission]
    O[orphan branch: gh-pages]

    %% Describe the operational flow
    M -->|1. Sync Loop: Keep retcon updated| D
    S -->|2. Fast-Track Community Lore| M
    D -->|3. Merge Massive Structural Overhauls| M
    M -->|4. Automated Build Script triggers| O

    %% Style accents for clarity
    style M fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style D fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    style O fill:#e67e22,stroke:#d35400,stroke-width:2px,color:#fff
~~~

~~~mermaid
gitGraph
    %% Initialize the stable public repository state
    commit id: "Initial Universe Setup"
    commit id: "v0.9-Stable-Canon" tag: "v0.9"
    
    %% 1. Fan creates a submission fork/branch directly from main
    branch submission-branch/fork
    checkout submission-branch/fork
    commit id: "Add: Planet-Xyz-Lore"
    commit id: "Fix: Typo-in-Andromeda-Page"
    
    %% 2. Meanwhile, Lead Team starts a massive Retcon workshop
    checkout main
    branch retcon-branch
    checkout retcon-branch
    commit id: "Overhaul: FTL-Travel-Rules"
    
    %% 3. Fan submission is reviewed, approved, and merged directly to main
    checkout main
    merge submission-branch/fork id: "Merge PR #42: Fan Planet Entry"
    
    %% 4. CRUCIAL SYNC LOOP: Retcon branch pulls the new fan lore to check for clashes
    checkout retcon-branch
    merge main id: "Sync: Pull Fan Planet into Sandbox"
    commit id: "Adjust: Adapt Fan Planet to new FTL rules"
    
    %% 5. The big update is finalized and deployed back into main canon
    checkout main
    merge retcon-branch id: "Merge PR #45: Grand FTL Overhaul"
    commit id: "v1.0-Release-Snapshot" tag: "v1.0"
~~~

## Making template and how tempalte is used

~~~mermaid
flowchart TD
    A[Gather Information]
    B[Pydantic]
    C[TOML Template]
    D[TOML Data]

    %% Operational Steps using safe string padding to prevent parse errors
    X[" "]
    Y[" "]

    A -->|Apply / induce it as| B
    B -->|Generate empty TOML as template| C

    %% Clean structural convergence for the update loop
    B -->|Update structure| X
    C -->|Map & move keys| X
    X --> C

    %% Clean structural convergence for the final data filling

    C ==>|Non-programmer user fill in| D
    C -->|Provide template| Y
    B ==>|Generate data| Y
    Y ==> D

    %% Color the lines in the final section green (indices 5, 6, 7, and 8)
    
    %% maintainer
    linkStyle 0,1,2,4 stroke:#ff0000

    %% user
    linkStyle 5,7,8 stroke:#22c55e
~~~
Legend: 
    green = user workflow  
    red = maintainer workflow

## Making a celestial systems

~~~mermaid
flowchart LR
    subgraph A["Build"]
    direction LR

        BuilderOrogen["Orogen"]
        Lagrange
        Terraforge["Terraforge (Builder)"]

    end
    
    A --> B

    subgraph B[Place]
    direction RL
        PlacerTerraforge["Terraforge"]
    end

    B -- translate to Celestia --> Celestia
    
    subgraph C[Visualize]
    direction RL
        Celestia
    end
~~~
