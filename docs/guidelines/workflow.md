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

### Submission folder workflow

~~~mermaid
flowchart TD

    %% Nodes
    N1["Astrocosmos main repository"]
    N2["Contributor fork / branch"]
    N3["Submission workspace"]

    subgraph PUSH["Push / Put"]
    direction TD
        N4["Submission manifest"]
        N5["Unique entry metadata"]
        N6["Write the articles"]
        N7["Copy and paste to defined manifest"]
        N8["Resolve / handle links"]
    end

    N9["Submission accepted / integrated"]
    N10["Canonical content"]

    subgraph PULL["Pull / Fetch"]
    direction TD
        N11["Manifest path lookup"]
        N12{"Entry found at manifest path?"}
        N13["Metadata lookup"]
        N14{"Entry found by metadata?"}
        N15["Update manifest path"]
        N16["Unresolved entry"]
        N17["Fetch entry"]
        N18["Record local synchronization state"]
    end

    subgraph CHANGES["Handle Changes"]
    direction TD
        N19["Detect upstream changes"]
        N20["Show affected entries / diff"]
        N21["Contributor reviews and handles changes"]
    end

    N22["Updated submission"]

    %% Main workflow
    N1 ==> N2
    N2 ==> N3
    N3 ==> PUSH
    PUSH ==> N9
    N9 ==> N10
    N10 ==> PULL
    CHANGES ==> N22
    N22 ==> PUSH

    %% Push / Put
    N4 -.-> N7
    N5 -.-> N7
    N6 --> N7
    N7 --> N8

    %% Pull / Fetch
    PULL --> N11
    N11 --> N12
    N12 -- Yes --> N17
    N12 -- No --> N13
    N13 --> N14
    N14 -- Yes --> N15
    N15 -.-> N4
    N15 --> N17
    N14 -- No --> N16
    N17 --> N18

    %% Handle Changes
    N18 -. "baseline" .-> N19
    N10 --> N19
    N19 --> N20
    N20 --> N21

    %% Machine nodes
    class N7,N8,N11,N13,N15,N17,N18,N19,N20 machine;

    %% End-user nodes
    class N2,N3,N4,N5,N6,N21,N22,PUSH,CHANGES enduser;

    %% Canonical repository/data
    class N1,N9,N10 canonical;

    classDef machine fill:#d9ecff,stroke:#4285c5,color:#000;
    classDef enduser fill:#dff3df,stroke:#4d9b4d,color:#000;
    classDef canonical fill:#eeeeee,stroke:#666,color:#000;
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
    
    B.Oro["Orogen"]
    Lag["Lagrange"]
    B.TeF["Terraforge (Builder)"]
    P.TeF["Terraforge"]
    
    subgraph A["Build Planet"]
    direction TD
        Q1{"Scientifically accurate and detailed?"}

        Q1 --YES--> N:::hidden
        Q1 --NO--> Q2
        N --> B.TeF
        N --> S

        B.TeF --> Q2
        S --> Q2

        Q2{"is the resulted planet very similar to earth?"}
        Q2 --YES--> B.Oro
        Lag
        B.TeF

    end
    
    A --> B

    subgraph B[Place]
    direction TD
        P.TeF
    end

    B -- translate to Celestia --> Celestia
    
    subgraph C[Visualize]
    direction TD
        Celestia
    end
~~~
