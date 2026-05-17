[
  {
    "input_text": "A customer places an order on an e-commerce site. The system checks if the item is in stock. If in stock, it processes payment and then ships the order. If out of stock, it asks the customer to wait for restock or cancel the order. After shipping, the order is marked completed.",
    "mermaid": "graph TD\n    A[Customer places order] --> B{Item in stock?}\n    B -->|Yes| C[Process payment]\n    C --> D[Ship order]\n    D --> E[Order completed]\n    B -->|No| F{Choice: Wait or cancel?}\n    F -->|Wait| G[Notify when restocked]\n    G --> B\n    F -->|Cancel| H[Order canceled]",
    "expanded_text": "The process begins when a customer places an order on the e-commerce platform. The system then checks whether the requested item is currently in stock. If the item is available, the system proceeds to process the customer's payment, then ships the order, and finally marks the order as completed. If the item is out of stock, the system presents the customer with a choice: either wait for restock or cancel the order. If the customer chooses to wait, the system will notify them when the item is restocked and then loop back to check stock again. If the customer chooses to cancel, the order is simply canceled and the process ends.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "loop"]
    }
  },
  {
    "input_text": "Our CI/CD pipeline works as follows: Developers push code to GitHub, which triggers a parallel build on three different OS runners (Linux, macOS, Windows). All builds must succeed before running unit tests in parallel. If any build fails, the pipeline stops and notifies the team. After tests pass, the code is deployed to a staging environment, then manually approved for production. Finally, production deployment happens automatically after approval.",
    "mermaid": "graph TD\n    A[Push code to GitHub] --> B[Trigger pipeline]\n    B --> C[Parallel builds]\n    subgraph Builds\n        C1[Build on Linux]\n        C2[Build on macOS]\n        C3[Build on Windows]\n    end\n    C --> C1 & C2 & C3\n    C1 & C2 & C3 --> D{All builds succeeded?}\n    D -->|No| E[Notify team]\n    E --> F[Pipeline stops]\n    D -->|Yes| G[Run unit tests in parallel]\n    G --> H{Tests passed?}\n    H -->|No| E\n    H -->|Yes| I[Deploy to staging]\n    I --> J[Manual approval for production]\n    J --> K[Deploy to production]",
    "expanded_text": "The CI/CD pipeline begins when developers push code to the GitHub repository, which triggers the pipeline. The system then initiates parallel builds on three different operating system runners: Linux, macOS, and Windows. The pipeline checks whether all three builds succeeded. If any build fails, the team is notified and the pipeline stops immediately. If all builds succeed, the system runs the unit tests in parallel. If any unit test fails, again the team is notified and the pipeline stops. If all tests pass, the code is deployed to a staging environment. After staging, a human manually approves the deployment for production. Once approved, the final production deployment occurs automatically.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["parallel tasks", "conditional branches", "hierarchy"]
    }
  },
  {
    "input_text": "A student starts a math module. They watch an instructional video, then take a quiz. If they score 80% or higher, they move to the next module. If they score below 80%, they must review the video again and retake the quiz. They can repeat this up to 3 times. After 3 failures, they get a remedial assignment.",
    "mermaid": "graph TD\n    A[Start math module] --> B[Watch instructional video]\n    B --> C[Take quiz]\n    C --> D{Score >= 80%?}\n    D -->|Yes| E[Move to next module]\n    D -->|No| F{Attempts < 3?}\n    F -->|Yes| G[Review video again]\n    G --> C\n    F -->|No| H[Assign remedial work]",
    "expanded_text": "The learning process begins when a student starts a math module. First, they watch an instructional video. Then they take a quiz. The system checks if their score is 80% or higher. If yes, the student successfully moves on to the next module. If not, the system checks how many attempts the student has made so far. If the number of attempts is less than three, the student is asked to review the video again and then retake the quiz, creating a loop. If the student has already attempted three times and still fails to reach 80%, they are given a remedial assignment instead of proceeding.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "loop"]
    }
  },
  {
    "input_text": "In emergency room triage, a patient arrives and is assessed for severity. If the patient has life-threatening symptoms (e.g., chest pain, difficulty breathing), they go immediately to resuscitation. Otherwise, the nurse checks if the patient can walk. If yes and stable, they go to ambulatory care. If not able to walk, they go to a standard bed. After treatment in any path, the patient is either discharged or admitted to the hospital.",
    "mermaid": "graph TD\n    A[Patient arrives] --> B[Initial severity assessment]\n    B --> C{Life-threatening symptoms?}\n    C -->|Yes| D[Resuscitation]\n    C -->|No| E{Can patient walk?}\n    E -->|Yes| F[Ambulatory care]\n    E -->|No| G[Standard bed]\n    D --> H[Treatment]\n    F --> H\n    G --> H\n    H --> I{Discharge or admit?}\n    I -->|Discharge| J[Patient leaves]\n    I -->|Admit| K[Hospital admission]",
    "expanded_text": "The patient arrives at the emergency room and undergoes an initial severity assessment. The triage nurse checks for life-threatening symptoms such as chest pain or difficulty breathing. If such symptoms are present, the patient is sent immediately to the resuscitation unit. Otherwise, the nurse checks whether the patient is able to walk. If the patient can walk and is stable, they are directed to ambulatory care. If the patient cannot walk, they are assigned to a standard bed. After receiving treatment in any of these three paths (resuscitation, ambulatory care, or standard bed), the patient is evaluated for discharge or hospital admission. If discharged, the patient leaves; if admitted, they are moved to a hospital inpatient bed.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "parallel tasks (treatment paths)"]
    }
  },
  {
    "input_text": "The player enters the boss room. The boss has three phases. Phase 1: normal attacks. After reducing boss HP to 70%, Phase 2 begins: the boss summons minions every 20 seconds. When HP reaches 30%, Phase 3: boss enrages, dealing double damage. If the player dies at any phase, they respawn at the checkpoint and restart the boss fight. When the boss HP hits 0, the player wins and a treasure chest appears.",
    "mermaid": "graph TD\n    A[Enter boss room] --> B[Phase 1: Normal attacks]\n    B --> C{Boss HP <= 70%?}\n    C -->|No| B\n    C -->|Yes| D[Phase 2: Summon minions every 20s]\n    D --> E{Boss HP <= 30%?}\n    E -->|No| D\n    E -->|Yes| F[Phase 3: Enrage - double damage]\n    F --> G{Boss HP == 0?}\n    G -->|No| F\n    G -->|Yes| H[Player wins, treasure chest appears]\n    B -.->|Player dies| I[Respawn at checkpoint]\n    D -.-> I\n    F -.-> I\n    I --> A",
    "expanded_text": "The player enters the boss room and begins Phase 1, where the boss uses normal attacks. The game continuously checks if the boss's health points (HP) have dropped to 70% or below. If not, the fight remains in Phase 1. Once HP reaches 70%, the fight transitions to Phase 2, where the boss summons minions every 20 seconds. Again, the game checks if HP is at 30% or lower; if not, Phase 2 continues. When HP hits 30%, Phase 3 begins: the boss becomes enraged and deals double damage. The game checks if HP reaches exactly zero; if not, Phase 3 continues. When HP reaches zero, the player wins and a treasure chest appears. If at any phase the player dies, they respawn at the last checkpoint and must restart the entire boss fight from the beginning.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["sequential flows", "conditional branches", "loops", "state transitions (phases)", "feedback loop (death respawn)"]
    }
  },
  {
    "input_text": "Alice texts Bob: 'Hey, how are you?' Bob feels happy because Alice remembered him. He replies, 'I'm great! Miss you!' Alice, feeling a bit sad but relieved, says, 'I miss you too. Can we meet?' Bob excitedly agrees and suggests a coffee shop. They both feel excited and plan for Saturday. If Bob had been upset, he would have ignored the message.",
    "mermaid": "graph TD\n    A[Alice texts: 'Hey, how are you?'] --> B[Bob feels happy - remembered]\n    B --> C[Bob replies: 'I'm great! Miss you!']\n    C --> D[Alice feels sad but relieved]\n    D --> E[Alice replies: 'I miss you too. Can we meet?']\n    E --> F[Bob feels excited]\n    F --> G[Bob suggests coffee shop]\n    G --> H[Both excited, plan Saturday]\n    style B fill:#c9f,stroke:#333\n    style D fill:#f9c,stroke:#333\n    style F fill:#cf9,stroke:#333\n    H -.->|Alternative path| I[Bob upset?]\n    I --> J[Bob ignores message]",
    "expanded_text": "Alice initiates a text conversation with Bob, asking 'Hey, how are you?' Bob feels happy because Alice remembered him, and he replies with enthusiasm: 'I'm great! Miss you!' Upon receiving this, Alice experiences mixed emotions—sadness mixed with relief—and responds, 'I miss you too. Can we meet?' Bob feels excited by this request and eagerly suggests meeting at a coffee shop. Both individuals end up feeling excited and together plan to meet on Saturday. In an alternative scenario, if Bob had been upset for any reason, he would have ignored Alice's initial message entirely, leading to a different outcome.",
    "metadata": {
      "domain": "social interactions",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branch (alternative)"]
    }
  },
  {
    "input_text": "The hero begins in the Ordinary World. They receive a Call to Adventure, but initially Refuse it. A Mentor appears and provides aid, leading to the Crossing of the First Threshold. Then they face Tests, Allies, and Enemies. Next is the Approach to the Inmost Cave, followed by the Ordeal (a life-or-death crisis). After surviving, the hero takes the Reward and begins the Road Back. A Resurrection moment occurs, then they Return with the Elixir.",
    "mermaid": "stateDiagram-v2\n    [*] --> OrdinaryWorld\n    OrdinaryWorld --> CallToAdventure: Receives call\n    CallToAdventure --> Refusal: Refuses\n    Refusal --> Mentor: Mentor appears\n    Mentor --> Threshold: Crossing first threshold\n    Threshold --> Tests: Tests, allies, enemies\n    Tests --> Approach: Approach inmost cave\n    Approach --> Ordeal: Ordeal (crisis)\n    Ordeal --> Reward: Survives, takes reward\n    Reward --> RoadBack: Road back\n    RoadBack --> Resurrection: Resurrection moment\n    Resurrection --> Elixir: Return with elixir\n    Elixir --> [*]",
    "expanded_text": "The hero's journey begins in the Ordinary World, their normal environment. They then receive a Call to Adventure, an invitation to step into the unknown. Initially, the hero Refuses the call due to fear or obligation. A Mentor figure appears and provides guidance, tools, or encouragement, enabling the hero to Cross the First Threshold into the special world. Once in the special world, the hero faces a series of Tests, meets Allies, and confronts Enemies. The next stage is the Approach to the Inmost Cave, where the hero prepares for a major challenge. Then comes the Ordeal, a life-or-death crisis that tests the hero to their limits. After surviving the ordeal, the hero seizes the Reward. The hero then begins the Road Back, trying to return to the Ordinary World. A final Resurrection moment occurs where the hero is purified or reborn. Finally, the hero Returns with the Elixir—a boon, treasure, or wisdom to share.",
    "metadata": {
      "domain": "storytelling",
      "complexity": "medium",
      "graph_features": ["state transitions", "sequential flows"]
    }
  },
  {
    "input_text": "An investor wants to rebalance their portfolio quarterly. First, they check the current asset allocation against target weights (60% stocks, 30% bonds, 10% cash). If any asset class deviates by more than 5%, they sell overperforming assets and buy underperforming ones. After rebalancing, they log the transaction. The feedback loop: if market volatility is high, they rebalance monthly instead of quarterly. This triggers a new check every month until volatility subsides.",
    "mermaid": "graph TD\n    A[Quarterly rebalance trigger] --> B[Check current allocation vs target]\n    B --> C{Any asset deviation > 5%?}\n    C -->|No| D[No action, wait next quarter]\n    C -->|Yes| E[Sell overperformers, buy underperformers]\n    E --> F[Log transaction]\n    D --> G{Market volatility high?}\n    F --> G\n    G -->|Yes| H[Switch to monthly rebalancing]\n    H --> I[Monthly check]\n    I --> B\n    G -->|No| J[Remain quarterly]",
    "expanded_text": "The investor initiates a portfolio rebalancing process on a quarterly basis. First, they compare the current asset allocation against target weights: 60% stocks, 30% bonds, and 10% cash. If no asset class deviates from its target by more than 5 percentage points, no action is taken and the investor waits for the next quarter. If a deviation exceeding 5% is detected, the investor sells assets that have become overrepresented and buys underrepresented assets to restore the target allocation. After the trades, the transaction is logged. The system also checks whether market volatility is high. If volatility is high, the investor switches from quarterly to monthly rebalancing, which creates a loop: every month, the allocation is checked again, and the cycle repeats until volatility subsides. If volatility is not high, the investor remains on the quarterly schedule.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["conditional branches", "feedback loop", "sequential flows"]
    }
  },
  {
    "input_text": "A machine learning training pipeline: Load raw data from S3. Split into training (70%) and validation (30%). Train a model with hyperparameters from a config file. After each epoch, compute validation loss. If validation loss improves, save the model checkpoint. If validation loss does not improve for 5 consecutive epochs, stop training early and revert to the best checkpoint. Then evaluate on a test set. Finally, deploy the best model to a production endpoint.",
    "mermaid": "graph TD\n    A[Load raw data from S3] --> B[Split: 70% train, 30% validation]\n    B --> C[Load hyperparameters from config]\n    C --> D[Train model for one epoch]\n    D --> E[Compute validation loss]\n    E --> F{Validation loss improved?}\n    F -->|Yes| G[Save model checkpoint]\n    G --> H[Reset early stop counter]\n    H --> I{More epochs?}\n    F -->|No| J[Increment early stop counter]\n    J --> K{Counter >= 5?}\n    K -->|No| I\n    K -->|Yes| L[Stop training, revert to best checkpoint]\n    I -->|Yes| D\n    I -->|No| M[Evaluate on test set]\n    L --> M\n    M --> N[Deploy best model to production endpoint]",
    "expanded_text": "The machine learning pipeline begins by loading raw data from Amazon S3. The data is then split into a training set (70%) and a validation set (30%). Hyperparameters are loaded from a configuration file. The model is trained for one epoch, after which validation loss is computed. If validation loss has improved compared to the previous best, the current model checkpoint is saved and an early stopping counter is reset to zero. If validation loss has not improved, the early stopping counter is incremented. If the counter reaches 5 (meaning five consecutive epochs without improvement), training is stopped early and the model reverts to the best checkpoint saved so far. Otherwise, training continues for another epoch. After training completes (either naturally or via early stopping), the model is evaluated on a separate test set. Finally, the best performing model is deployed to a production endpoint.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["sequential flows", "conditional branches", "loop", "early stopping feedback"]
    }
  },
  {
    "input_text": "A package is picked up from a warehouse. Two parallel processes occur: the package is scanned for tracking, and its destination address is validated. After both complete, the system chooses a shipping carrier based on weight and delivery speed. If weight < 5kg and standard delivery, use Carrier A. If weight >= 5kg or express delivery, use Carrier B. Then the package is routed to a regional sort center, loaded onto a truck, and delivered. If delivery fails (e.g., wrong address), the package is returned to the sender.",
    "mermaid": "graph TD\n    A[Pickup from warehouse] --> B[Parallel tasks]\n    B --> C[Scan for tracking]\n    B --> D[Validate destination address]\n    C & D --> E{Carrier selection}\n    E --> F[Weight < 5kg AND standard?]\n    F -->|Yes| G[Carrier A]\n    F -->|No| H[Carrier B]\n    G --> I[Route to regional sort center]\n    H --> I\n    I --> J[Load onto truck]\n    J --> K[Attempt delivery]\n    K --> L{Delivery successful?}\n    L -->|Yes| M[Delivered]\n    L -->|No| N[Return to sender]",
    "expanded_text": "The logistics process starts with a package being picked up from a warehouse. Two tasks then happen in parallel: the package is scanned to generate a tracking record, and its destination address is validated for correctness. Once both parallel tasks are complete, the system selects a shipping carrier based on the package's weight and required delivery speed. If the package weighs less than 5 kilograms and standard delivery is selected, Carrier A is used. If the weight is 5 kilograms or more, or if express delivery is required, Carrier B is used. After carrier assignment, the package is routed to a regional sort center, then loaded onto a delivery truck, and an attempt is made to deliver it. If delivery is successful, the process ends with a 'Delivered' status. If delivery fails (for example, due to an incorrect address or recipient not available), the package is returned to the sender.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["parallel tasks", "conditional branches", "sequential flows"]
    }
  },
  {
    "input_text": "A user files a complaint with customer support. The bot first apologizes automatically. Then a human agent reviews the issue. If it's a technical bug, it goes to engineering with a severity label (P1, P2, P3). If it's a billing issue, it goes to finance. For P1 bugs, the engineering team must respond within 2 hours; for P2 within 24 hours; for P3 within 5 days. After resolution, the user receives a satisfaction survey. If the user is dissatisfied, the case is reopened.",
    "mermaid": "graph TD\n    A[User files complaint] --> B[Bot auto-apologizes]\n    B --> C[Human agent reviews]\n    C --> D{Issue type?}\n    D -->|Technical bug| E{Assign severity}\n    E -->|P1| F[Engineering: respond within 2h]\n    E -->|P2| G[Engineering: respond within 24h]\n    E -->|P3| H[Engineering: respond within 5d]\n    D -->|Billing| I[Finance team]\n    F --> J[Resolve issue]\n    G --> J\n    H --> J\n    I --> J\n    J --> K[Send satisfaction survey]\n    K --> L{User satisfied?}\n    L -->|Yes| M[Close case]\n    L -->|No| N[Reopen case]\n    N --> C",
    "expanded_text": "The customer support workflow begins when a user files a complaint. An automated bot immediately apologizes to acknowledge the issue. Then a human agent reviews the complaint to determine its nature. If the issue is a technical bug, the agent assigns a severity level: P1 (critical) requires engineering response within 2 hours, P2 (high) within 24 hours, and P3 (normal) within 5 days. If the issue is billing-related, it is routed to the finance team. After the responsible team resolves the issue, the system sends a satisfaction survey to the user. If the user indicates satisfaction, the case is closed. If the user is dissatisfied, the case is reopened and returns to the human agent for further review, creating a feedback loop.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["conditional branches", "parallel routing", "feedback loop"]
    }
  },
  {
    "input_text": "A marketing campaign has three stages: awareness, consideration, and conversion. In awareness, we run Facebook ads and Google display ads in parallel. Each ad has a budget cap of $500. After 7 days, we measure impressions and CTR. If CTR > 2%, we move the ad to consideration. If CTR <= 2%, we pause the ad and reallocate budget to better performers. In consideration, we send email newsletters and retargeting ads. After 14 days, if conversion rate > 5%, the user is tagged as 'converted'. If not, they enter a win-back flow with a 10% discount offer.",
    "mermaid": "graph TD\n    subgraph Awareness\n        A1[Facebook ads - $500 cap]\n        A2[Google display ads - $500 cap]\n    end\n    A1 & A2 --> B[Wait 7 days]\n    B --> C{CTR > 2%?}\n    C -->|Yes| D[Move to Consideration]\n    C -->|No| E[Pause ad, reallocate budget]\n    E --> A1\n    subgraph Consideration\n        F[Email newsletters]\n        G[Retargeting ads]\n    end\n    D --> F & G\n    F & G --> H[Wait 14 days]\n    H --> I{Conversion rate > 5%?}\n    I -->|Yes| J[Tag user as converted]\n    I -->|No| K[Win-back flow: 10% discount]\n    K --> L[Offer expires in 30 days]",
    "expanded_text": "The marketing campaign is structured into three stages: awareness, consideration, and conversion. During the awareness stage, the system runs Facebook ads and Google display ads in parallel, each with a budget cap of $500. After 7 days, the system measures impressions and click-through rate (CTR) for each ad. If CTR exceeds 2%, the ad moves to the consideration stage. If CTR is 2% or lower, the ad is paused and its remaining budget is reallocated to better-performing ads, creating a loop back to the awareness stage. In the consideration stage, the user receives email newsletters and retargeting ads in parallel. After 14 days, the system checks the conversion rate. If the conversion rate is above 5%, the user is tagged as 'converted'. If not, the user enters a win-back flow that offers a 10% discount, which expires after 30 days.",
    "metadata": {
      "domain": "marketing",
      "complexity": "high",
      "graph_features": ["parallel tasks", "conditional branches", "subgraphs", "feedback loop"]
    }
  },
  {
    "input_text": "An employee requests time off in the HR system. The request first goes to the immediate manager. If the manager approves, it goes to HR for compliance check (e.g., remaining leave balance). If HR approves, the request is granted and the calendar is updated. If the manager rejects, the employee is notified and can appeal to the department head. The department head can either overrule the rejection (approve) or uphold it. If upheld, the employee can request a formal review by the HR committee, which is final. All approvals and rejections are logged with timestamps.",
    "mermaid": "graph TD\n    A[Employee requests time off] --> B[Immediate manager]\n    B --> C{Manager approves?}\n    C -->|Yes| D[HR compliance check]\n    D --> E{HR approves?}\n    E -->|Yes| F[Request granted, calendar updated]\n    E -->|No| G[Reject, notify employee]\n    C -->|No| H[Notify employee, offer appeal]\n    H --> I{Employee appeals?}\n    I -->|Yes| J[Department head review]\n    I -->|No| G\n    J --> K{Head overrules?}\n    K -->|Yes| D\n    K -->|No| L[Uphold rejection]\n    L --> M{Request formal HR committee review?}\n    M -->|Yes| N[HR committee final decision]\n    M -->|No| G\n    N --> O[Final approval or denial]\n    O --> F\n    style F fill:#9f9\n    style G fill:#f99",
    "expanded_text": "The employee requests time off through the HR system. The request is first routed to the employee's immediate manager. If the manager approves, the request proceeds to HR for a compliance check, which verifies remaining leave balance and policy adherence. If HR approves, the request is granted and the company calendar is updated. If HR rejects, the employee is notified of the rejection. If the immediate manager rejects the request, the employee is notified and given the option to appeal. If the employee appeals, the department head reviews the case. The department head can either overrule the manager's rejection (approving the request, which then goes to HR compliance) or uphold the rejection. If the rejection is upheld, the employee may request a formal review by the HR committee, whose decision is final. That final decision results in either approval or denial. All approvals and rejections at every step are logged with timestamps for audit purposes.",
    "metadata": {
      "domain": "HR workflows",
      "complexity": "high",
      "graph_features": ["sequential flows", "multiple conditional branches", "hierarchy", "appeal loop"]
    }
  },
  {
    "input_text": "A legal contract lifecycle: Drafting → Internal review → Redlining → Legal review → Signing. During internal review, if any clause violates company policy, the contract is sent back to drafting with comments. During legal review, if the counterparty proposes changes, a negotiation sub-process begins: the legal team can accept, reject, or counter. Counter-proposals loop back to redlining. After three negotiation cycles without agreement, the contract is abandoned. Upon signing, the contract is archived and a notification is sent to all stakeholders.",
    "mermaid": "graph TD\n    A[Drafting] --> B[Internal review]\n    B --> C{Policy violation?}\n    C -->|Yes| D[Send back to drafting with comments]\n    D --> A\n    C -->|No| E[Redlining]\n    E --> F[Legal review]\n    F --> G{Counterparty changes?}\n    G -->|No| H[Signing]\n    G -->|Yes| I[Negotiation sub-process]\n    I --> J{Legal decision}\n    J -->|Accept| H\n    J -->|Reject| K[Contract abandoned]\n    J -->|Counter| L[Return to redlining]\n    L --> E\n    I --> M{Cycle count >= 3?}\n    M -->|Yes| K\n    M -->|No| I\n    H --> N[Archive contract]\n    N --> O[Notify stakeholders]",
    "expanded_text": "The legal contract lifecycle begins with drafting the contract document. It then goes to internal review, where company policy compliance is checked. If any clause violates policy, the contract is sent back to drafting with comments, creating a loop. If compliant, the contract proceeds to redlining (marking proposed changes). Next, legal review occurs. If the counterparty has not proposed any changes, the contract moves to signing. If the counterparty has proposed changes, a negotiation sub-process begins. In this sub-process, the legal team can either accept the changes (proceed to signing), reject them (contract abandoned), or propose a counter. A counter-proposal sends the contract back to redlining, after which legal review occurs again. The system tracks negotiation cycles: after three full cycles without reaching an agreement, the contract is automatically abandoned. Once signing occurs, the contract is archived and all stakeholders receive a notification.",
    "metadata": {
      "domain": "legal processes",
      "complexity": "high",
      "graph_features": ["sequential flows", "conditional branches", "loop (feedback)", "cycle counter"]
    }
  },
  {
    "input_text": "A customer wants to send money abroad. They enter amount, source currency (USD) and target currency (EUR). The system checks the daily limit ($10,000 per day). If exceeded, the transaction is blocked and customer notified. If within limit, the system fetches the live exchange rate from an API. Then it calculates fees: 1% for amounts < $1000, 0.5% for $1000-$5000, 0.25% for > $5000. After fee calculation, the user confirms. If confirmed, the system debits the source account, converts currency, and credits the target account. A receipt is emailed. If the user cancels, no action is taken.",
    "mermaid": "graph TD\n    A[Enter amount, USD to EUR] --> B{Daily limit <= $10,000?}\n    B -->|No| C[Block transaction, notify customer]\n    B -->|Yes| D[Fetch live exchange rate from API]\n    D --> E{Amount < $1000?}\n    E -->|Yes| F[Fee = 1%]\n    E -->|No| G{Amount $1000-$5000?}\n    G -->|Yes| H[Fee = 0.5%]\n    G -->|No| I[Fee = 0.25%]\n    F --> J[Calculate total]\n    H --> J\n    I --> J\n    J --> K{User confirms?}\n    K -->|Yes| L[Debit source account]\n    L --> M[Convert currency]\n    M --> N[Credit target account]\n    N --> O[Email receipt]\n    K -->|No| P[Cancel - no action]",
    "expanded_text": "The customer initiates an international money transfer by entering the amount, source currency (USD), and target currency (EUR). The system first checks whether the transaction exceeds the daily limit of $10,000. If the limit is exceeded, the transaction is blocked and the customer is notified. If within the limit, the system fetches the live exchange rate from an external API. Next, the fee is calculated based on the amount: 1% for amounts under $1,000, 0.5% for amounts between $1,000 and $5,000, and 0.25% for amounts above $5,000. The total cost (amount + fee) is presented, and the user is asked to confirm. If the user confirms, the system debits the source account, converts the amount using the fetched exchange rate, credits the target account, and emails a receipt. If the user cancels, no further action is taken.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["conditional branches", "sequential flows", "hierarchical decisions"]
    }
  },
  {
    "input_text": "A scientific experiment on plant growth: Prepare 30 seeds. Divide into three groups (A, B, C) of 10 each. Group A gets 8 hours light/day. Group B gets 12 hours light/day. Group C gets 16 hours light/day. All groups receive same water and soil. Measure height every 3 days for 30 days. After day 30, calculate average growth per group. If average growth of group B or C is significantly higher than A (p < 0.05), conclude that more light increases growth. If not, conclude no significant effect.",
    "mermaid": "graph TD\n    A[Prepare 30 seeds] --> B[Divide into 3 groups of 10]\n    B --> C1[Group A: 8h light/day]\n    B --> C2[Group B: 12h light/day]\n    B --> C3[Group C: 16h light/day]\n    C1 & C2 & C3 --> D[Same water and soil]\n    D --> E[Measure height every 3 days for 30 days]\n    E --> F[Calculate average growth per group]\n    F --> G{Group B or C avg significantly higher than A? (p<0.05)}\n    G -->|Yes| H[Conclude: More light increases growth]\n    G -->|No| I[Conclude: No significant effect]",
    "expanded_text": "The plant growth experiment begins with preparing 30 seeds. These are divided into three groups of 10 seeds each: Group A receives 8 hours of light per day, Group B receives 12 hours, and Group C receives 16 hours. All groups are given the same amount of water and soil to control for confounding variables. The researchers measure the height of each plant every 3 days over a total period of 30 days. After the final measurement, the average growth (final minus initial height) is calculated for each group. A statistical test is then performed: if the average growth of Group B or Group C is significantly higher than that of Group A (with a p-value less than 0.05), the conclusion is that increased light exposure enhances plant growth. If no significant difference is found, the conclusion is that light variation within this range does not have a significant effect on growth.",
    "metadata": {
      "domain": "scientific explanations",
      "complexity": "medium",
      "graph_features": ["parallel groups", "sequential flows", "conditional conclusion"]
    }
  },
  {
    "input_text": "A user logs into a web app. The system checks if they have two-factor authentication (2FA) enabled. If yes, they enter their password, then a TOTP code. If the code is valid, they are granted access. If the code is invalid after 3 attempts, the account is locked for 15 minutes. If 2FA is not enabled, the system checks if the user is logging in from a new device. If new device, they must verify via email link. If email verification succeeds, they are granted access. If not, access denied. After successful login, a session token is created with a 24-hour expiry.",
    "mermaid": "graph TD\n    A[User login attempt] --> B{2FA enabled?}\n    B -->|Yes| C[Enter password]\n    C --> D[Enter TOTP code]\n    D --> E{Code valid?}\n    E -->|Yes| F[Grant access]\n    E -->|No| G{Attempts < 3?}\n    G -->|Yes| D\n    G -->|No| H[Lock account for 15 minutes]\n    B -->|No| I{New device?}\n    I -->|No| F\n    I -->|Yes| J[Send email verification link]\n    J --> K{Email verified?}\n    K -->|Yes| F\n    K -->|No| L[Access denied]\n    F --> M[Create session token, 24h expiry]\n    style H fill:#f99\n    style L fill:#f99\n    style F fill:#9f9",
    "expanded_text": "A user attempts to log into a web application. The system first checks whether two-factor authentication (2FA) is enabled for that account. If 2FA is enabled, the user must enter their password and then a time-based one-time password (TOTP) code. If the TOTP code is valid, access is granted. If the code is invalid, the system counts attempts: after fewer than 3 invalid attempts, the user is prompted to try again; after 3 invalid attempts, the account is locked for 15 minutes. If 2FA is not enabled, the system checks whether the user is logging in from a new device. If the device is recognized, access is granted directly. If the device is new, an email verification link is sent to the user's registered email. If the user verifies via the link, access is granted; otherwise, access is denied. Once access is granted, the system creates a session token that expires after 24 hours.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["conditional branches", "loop (TOTP retries)", "state (locked)"]
    }
  },
  {
    "input_text": "An AI customer support chatbot handles refund requests. The user says 'I want a refund'. The bot asks for the order ID. If the order is less than 30 days old, the bot checks the refund policy: if product is digital and unused, refund is automatic. If product is physical and unopened, refund requires manager approval. If product is physical and opened, refund denied. After decision, the bot says 'Refund approved' or 'Refund denied' and offers a feedback option. If manager approval is needed, a ticket is created and the user is told to expect a response within 48 hours.",
    "mermaid": "graph TD\n    A[User: 'I want a refund'] --> B[Bot asks for order ID]\n    B --> C[Check order age]\n    C --> D{Order < 30 days old?}\n    D -->|No| E[Refund denied]\n    D -->|Yes| F{Product type}\n    F -->|Digital & unused| G[Automatic refund approved]\n    F -->|Physical & unopened| H[Manager approval required]\n    F -->|Physical & opened| E\n    H --> I[Create ticket, notify user: 48h response]\n    G --> J[Bot: 'Refund approved']\n    E --> K[Bot: 'Refund denied']\n    J --> L[Offer feedback]\n    K --> L\n    I --> L",
    "expanded_text": "The AI customer support chatbot handles a refund request initiated by the user saying 'I want a refund'. The bot first asks for the order ID. Upon receiving it, the bot checks the order's age. If the order is 30 days old or older, the refund is denied. If the order is less than 30 days old, the bot checks the product type. For a digital product that is unused, the refund is approved automatically. For a physical product that is unopened, manager approval is required: the bot creates a support ticket and informs the user to expect a response within 48 hours. For a physical product that is opened, the refund is denied. After the decision (approved, denied, or pending manager approval), the bot communicates the outcome ('Refund approved' or 'Refund denied') and offers the user an option to provide feedback on the interaction.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["conditional branches", "sequential flows", "hierarchy of product types"]
    }
  },
  {
    "input_text": "A mobile game has a daily reward system. Day 1: 100 coins. Day 2: 200 coins. Day 3: 300 coins + a bonus chest. Day 4: 400 coins. Day 5: 500 coins + rare item. Day 6: 600 coins. Day 7: 1000 coins + legendary item. If the player misses a day, the streak resets to Day 1. After collecting Day 7, the streak resets to Day 1 but the player gets a 'Week completed' badge. The player can also watch an ad to double the coins for any day (once per day).",
    "mermaid": "graph TD\n    A[Daily login] --> B{Streak active?}\n    B -->|No| C[Reset to Day 1]\n    B -->|Yes| D[Current day]\n    C --> E[Day 1: 100 coins]\n    D --> F{Which day?}\n    F -->|Day1| G[100 coins]\n    F -->|Day2| H[200 coins]\n    F -->|Day3| I[300 coins + bonus chest]\n    F -->|Day4| J[400 coins]\n    F -->|Day5| K[500 coins + rare item]\n    F -->|Day6| L[600 coins]\n    F -->|Day7| M[1000 coins + legendary item]\n    G & H & I & J & K & L & M --> N{Watch ad to double?}\n    N -->|Yes| O[Double coins]\n    N -->|No| P[Keep original coins]\n    O --> Q[Award coins & items]\n    P --> Q\n    Q --> R{Day == 7?}\n    R -->|Yes| S[Award 'Week completed' badge, reset to Day1]\n    R -->|No| T[Increment day counter]\n    S --> U[Next login: Day1]\n    T --> U\n    A -.->|Miss day| V[Streak broken]\n    V --> C",
    "expanded_text": "The mobile game's daily reward system activates upon a player's daily login. The system first checks if the player has an active streak (i.e., logged in consecutively). If the streak is broken because the player missed a day, the streak resets to Day 1. If the streak is active, the system identifies the current day in the 7-day cycle. Rewards are: Day 1: 100 coins; Day 2: 200 coins; Day 3: 300 coins plus a bonus chest; Day 4: 400 coins; Day 5: 500 coins plus a rare item; Day 6: 600 coins; Day 7: 1000 coins plus a legendary item. After determining the base reward, the player is given the option to watch an ad to double the coins (once per day). If they watch, coins are doubled; otherwise, they receive the original amount. The system then awards the coins and any items. If the player completed Day 7, they also receive a 'Week completed' badge, and the streak resets to Day 1 for the next login. If it was not Day 7, the day counter increments. If the player misses a day at any point, the streak is broken and the next login starts again from Day 1.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["state machine (streak)", "conditional branches", "loop (weekly cycle)", "reset logic"]
    }
  },
  {
    "input_text": "A university admissions process: Student submits application with transcript and essays. The system checks if minimum GPA >= 3.0. If not, application is automatically rejected. If yes, the application is sent to two reviewers independently. Each reviewer assigns a score (1-10). If both scores are >= 8, the student is accepted. If both scores are <= 4, rejected. If scores differ (one high, one low), a third reviewer adjudicates. The third reviewer's score determines acceptance (>=7) or rejection (<7). The student is notified by email. All decisions are logged in a database.",
    "mermaid": "graph TD\n    A[Submit application] --> B{GPA >= 3.0?}\n    B -->|No| C[Auto-reject]\n    B -->|Yes| D[Send to two independent reviewers]\n    D --> E1[Reviewer 1: score 1-10]\n    D --> E2[Reviewer 2: score 1-10]\n    E1 & E2 --> F{Both scores >= 8?}\n    F -->|Yes| G[Accept]\n    F -->|No| H{Both scores <= 4?}\n    H -->|Yes| C\n    H -->|No| I[Third reviewer adjudicates]\n    I --> J[Third reviewer score >= 7?]\n    J -->|Yes| G\n    J -->|No| C\n    G --> K[Email notification: Accepted]\n    C --> L[Email notification: Rejected]\n    K --> M[Log decision to database]\n    L --> M",
    "expanded_text": "The university admissions process begins when a student submits an application that includes transcripts and essays. The system first checks whether the student's minimum GPA is 3.0 or higher. If the GPA is below 3.0, the application is automatically rejected. If the GPA meets the threshold, the application is sent to two independent reviewers. Each reviewer assigns a score from 1 to 10 based on the essays and overall profile. If both reviewers give scores of 8 or above, the student is accepted. If both reviewers give scores of 4 or below, the student is rejected. If the scores are mixed (one high, one low, or any other combination between 5 and 7), a third reviewer is brought in to adjudicate. The third reviewer's score determines the outcome: if the score is 7 or higher, the student is accepted; if below 7, rejected. Finally, the student is notified via email of the decision (acceptance or rejection), and the decision is logged in the university's database for record-keeping.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["conditional branches", "parallel reviewers", "adjudication flow"]
    }
  },
  {
    "input_text": "When a new customer signs up for our SaaS platform, they first verify their email address. If verification succeeds, they're guided through a personalized onboarding wizard where they select their industry and team size. Based on these selections, the system provisions appropriate workspace templates. If verification fails, the customer receives a retry prompt with a support link. After successful setup, customers enter a 14-day trial period with automated check-in emails on days 3, 7, and 12. Trial users who activate key features receive an upgrade prompt; inactive users get re-engagement campaigns.",
    "mermaid": "flowchart TD\n    A[Customer Signs Up] --> B[Send Email Verification]\n    B --> C{Verification Successful?}\n    C -->|Yes| D[Launch Onboarding Wizard]\n    D --> E[Select Industry & Team Size]\n    E --> F[Provision Workspace Templates]\n    F --> G[Start 14-Day Trial]\n    G --> H[Automated Check-ins: Days 3,7,12]\n    H --> I{Key Features Activated?}\n    I -->|Yes| J[Send Upgrade Prompt]\n    I -->|No| K[Trigger Re-engagement Campaign]\n    C -->|No| L[Send Retry Prompt + Support Link]\n    L --> B\n    style A fill:#e1f5fe\n    style J fill:#c8e6c9\n    style K fill:#fff9c4",
    "expanded_text": "This customer onboarding workflow begins when a new user registers on the SaaS platform. The system immediately initiates email verification as a security and identity confirmation step. Upon successful verification, the user progresses to a personalized onboarding wizard—a guided interface where they specify their industry vertical and organizational team size. These inputs drive intelligent template provisioning, ensuring the workspace is pre-configured with relevant tools and layouts. If verification fails, the system doesn't abandon the user; instead, it offers a clear retry mechanism paired with direct access to support resources, reducing friction and abandonment. Once setup completes, the user enters a structured 14-day trial phase featuring strategically timed automated check-ins on days 3, 7, and 12 to provide guidance and collect feedback. The system monitors feature adoption: users who engage with core functionalities receive timely upgrade prompts highlighting premium benefits, while inactive users are enrolled in targeted re-engagement campaigns designed to rekindle interest through personalized content and incentives. This flow balances automation with human-centric support, optimizing conversion while maintaining user trust.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["conditional branches", "feedback loop", "labeled edges", "process nodes", "sequential flow"]
    }
  },
  {
    "input_text": "In our microservices architecture, when a developer pushes code to the main branch, GitHub Actions triggers parallel jobs: one runs unit tests with Jest, another performs linting with ESLint, and a third builds a Docker image. If all jobs pass, the pipeline deploys to the staging environment and notifies the QA team via Slack. If any job fails, the pipeline halts and posts an alert to the #dev-alerts channel with error logs. Successful staging deployments trigger integration tests; if those pass, a manual approval gate requires sign-off from two senior engineers before production deployment. Post-deployment, health checks run every 30 seconds for 5 minutes, and if anomalies are detected, an automatic rollback initiates.",
    "mermaid": "flowchart LR\n    subgraph GitHub_Actions [CI/CD Pipeline]\n        A[Code Push to Main] --> B[Trigger Pipeline]\n        B --> C1[Run Jest Unit Tests]\n        B --> C2[Run ESLint Linting]\n        B --> C3[Build Docker Image]\n        C1 & C2 & C3 --> D{All Jobs Passed?}\n        D -->|Yes| E[Deploy to Staging]\n        D -->|No| F[Post Alert to #dev-alerts + Logs]\n        E --> G[Notify QA via Slack]\n        G --> H[Run Integration Tests]\n        H --> I{Tests Passed?}\n        I -->|Yes| J[Manual Approval: 2 Senior Engineers]\n        I -->|No| F\n        J --> K[Deploy to Production]\n        K --> L[Health Checks: 30s intervals × 5min]\n        L --> M{Anomalies Detected?}\n        M -->|Yes| N[Automatic Rollback]\n        M -->|No| O[Deployment Complete ✅]\n    end\n    style D fill:#ffccbc\n    style J fill:#e1bee7\n    style N fill:#ffcdd2",
    "expanded_text": "This CI/CD pipeline orchestrates a robust, multi-stage deployment workflow for a microservices application. When code is pushed to the main branch, GitHub Actions initiates three parallel validation jobs: Jest executes unit tests to verify component logic, ESLint enforces code quality standards, and a Docker build creates a containerized artifact for consistent environments. The pipeline employs a gatekeeping mechanism—if any parallel job fails, execution halts immediately and a detailed alert with error logs is posted to the #dev-alerts Slack channel for rapid developer response. When all jobs succeed, the system deploys to a staging environment that mirrors production, then notifies the QA team via Slack to begin manual testing. Successful staging validation triggers integration tests that verify service interactions; passing these tests activates a critical manual approval gate requiring consensus from two senior engineers, ensuring architectural oversight before production release. After production deployment, an automated monitoring phase runs health checks every 30 seconds for five minutes, evaluating metrics like response time and error rates. If anomalies exceed thresholds, the system initiates an automatic rollback to the previous stable version, minimizing user impact. This design balances speed, safety, and accountability through parallelism, conditional gating, human oversight, and self-healing capabilities.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["parallel tasks", "conditional branches", "subgraphs", "manual approval gate", "feedback loop", "labeled edges"]
    }
  },
  {
    "input_text": "A student enrolls in an online data science course. They start with Module 1: Python Basics. After completing quizzes with ≥80% score, they unlock Module 2: Data Manipulation. If quiz scores fall below 80%, the system recommends review resources and allows retakes. Module 2 completion unlocks parallel paths: students can choose either Module 3A: Visualization with Matplotlib or Module 3B: Statistics Fundamentals. Both paths converge at Module 4: Machine Learning Intro, which requires a capstone project submission. Projects are peer-reviewed; if feedback indicates major revisions, students resubmit. Approved projects grant course completion and a digital badge shareable on LinkedIn.",
    "mermaid": "flowchart TD\n    A[Student Enrolls] --> B[Module 1: Python Basics]\n    B --> C{Quiz Score ≥80%?}\n    C -->|Yes| D[Unlock Module 2: Data Manipulation]\n    C -->|No| E[Recommend Review Resources]\n    E --> F[Allow Quiz Retake]\n    F --> C\n    D --> G{Choose Learning Path}\n    G --> H[Module 3A: Visualization]\n    G --> I[Module 3B: Statistics]\n    H & I --> J[Module 4: ML Intro + Capstone Project]\n    J --> K[Peer Review Process]\n    K --> L{Major Revisions Needed?}\n    L -->|Yes| M[Revise & Resubmit]\n    M --> K\n    L -->|No| N[Course Complete ✅ + LinkedIn Badge]\n    style G fill:#e0f7fa\n    style N fill:#c8e6c9\n    style M fill:#fff9c4",
    "expanded_text": "This adaptive learning pathway guides students through a structured yet flexible online data science curriculum. Enrollment begins with foundational Python programming, where mastery is validated through quizzes requiring an 80% threshold. Students who don't meet this benchmark receive personalized review resources and unlimited retake opportunities, embodying a growth mindset philosophy. Upon mastering Module 2 (Data Manipulation with Pandas), learners gain agency by selecting between two parallel specialization tracks: visualization-focused (Matplotlib/Seaborn) or statistics-focused (probability, hypothesis testing). This branching design accommodates diverse career goals while maintaining core competency alignment. Both tracks reconverge at Module 4, introducing machine learning concepts and culminating in a capstone project that synthesizes all acquired skills. The peer review system fosters collaborative learning and critical thinking; projects requiring major revisions trigger an iterative improvement cycle, reinforcing that quality emerges through refinement. Final approval unlocks not only course completion but also a verifiable digital badge optimized for LinkedIn sharing, enhancing professional visibility. The workflow integrates pedagogical best practices: mastery learning, learner autonomy, iterative feedback, and credential portability.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["conditional branches", "loops", "parallel tasks", "convergence", "labeled edges", "process nodes"]
    }
  },
  {
    "input_text": "A patient arrives at a telehealth platform with symptoms of persistent cough and fatigue. The AI triage bot collects symptom details, duration, and severity. Based on predefined clinical rules, the system categorizes urgency: low (self-care advice), medium (schedule PCP visit within 48h), or high (immediate ER referral). For medium/high cases, the platform checks insurance eligibility and in-network provider availability. If no same-day appointments exist, the system escalates to a nurse callback queue. Post-consultation, the EHR updates with diagnosis and treatment plan; patients receive medication reminders and follow-up scheduling prompts. If symptoms worsen within 72 hours, patients can trigger a rapid re-assessment loop.",
    "mermaid": "flowchart TD\n    A[Patient Reports Symptoms] --> B[AI Triage Bot: Collect Details]\n    B --> C{Apply Clinical Rules}\n    C -->|Low Urgency| D[Provide Self-Care Advice]\n    C -->|Medium Urgency| E[Schedule PCP Visit ≤48h]\n    C -->|High Urgency| F[Immediate ER Referral]\n    E & F --> G[Check Insurance + In-Network Providers]\n    G --> H{Same-Day Appointment Available?}\n    H -->|Yes| I[Confirm Appointment]\n    H -->|No| J[Escalate to Nurse Callback Queue]\n    I & J --> K[Post-Consult: Update EHR]\n    K --> L[Send Medication Reminders + Follow-up Prompt]\n    L --> M{Symptoms Worsen in 72h?}\n    M -->|Yes| N[Trigger Rapid Re-assessment]\n    N --> B\n    M -->|No| O[Case Closed ✅]\n    style C fill:#ffccbc\n    style F fill:#ffcdd2\n    style N fill:#e1f5fe",
    "expanded_text": "This telehealth triage workflow prioritizes patient safety through intelligent, rule-based urgency classification. When a patient reports symptoms like persistent cough and fatigue, an AI-powered bot conducts a structured intake, capturing symptom characteristics, duration, and severity metrics. Clinical decision rules—aligned with evidence-based guidelines—categorize cases into three urgency tiers: low (manageable with self-care resources), medium (requiring primary care evaluation within 48 hours), or high (necessitating emergency services). For non-emergent cases, the system proactively verifies insurance coverage and scans real-time provider availability to minimize access barriers. If same-day appointments are unavailable, automatic escalation to a nurse callback queue ensures no patient falls through the cracks. After consultation, the electronic health record (EHR) is updated with diagnosis and treatment details, triggering personalized patient engagement: medication adherence reminders and automated follow-up scheduling. Critically, the system embeds a safety net—a 72-hour symptom monitoring window allows patients to initiate rapid re-assessment if conditions deteriorate, creating a closed-loop feedback mechanism that supports continuous care. This design balances automation efficiency with clinical oversight, regulatory compliance (HIPAA-aware data handling), and patient empowerment.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["conditional branches", "feedback loop", "state transitions", "subgraphs implied", "labeled edges", "process nodes"]
    }
  },
  {
    "input_text": "In our RPG game, a player accepts a quest from the Guild Master. The quest has three optional objectives: defeat 10 shadow wolves, collect 5 moon herbs, and solve an ancient riddle. Players can complete objectives in any order. Each completed objective grants partial rewards and updates the quest log. Once all objectives are done, the player returns to the Guild Master. If the player's reputation with the Guild is ≥50, they receive a rare item bonus; otherwise, they get standard rewards. Post-quest, the system checks if the player reached level 15; if yes, it unlocks the next story chapter and sends a celebratory notification.",
    "mermaid": "flowchart LR\n    A[Accept Quest from Guild Master] --> B[Quest Objectives]\n    subgraph Objectives [Complete in Any Order]\n        B --> C1[Defeat 10 Shadow Wolves]\n        B --> C2[Collect 5 Moon Herbs]\n        B --> C3[Solve Ancient Riddle]\n        C1 & C2 & C3 --> D[Update Quest Log + Partial Rewards]\n    end\n    D --> E{All Objectives Done?}\n    E -->|No| B\n    E -->|Yes| F[Return to Guild Master]\n    F --> G{Guild Reputation ≥50?}\n    G -->|Yes| H[Grant Rare Item Bonus]\n    G -->|No| I[Grant Standard Rewards]\n    H & I --> J{Player Level ≥15?}\n    J -->|Yes| K[Unlock Next Story Chapter + Celebration Notify]\n    J -->|No| L[Quest Complete ✅]\n    style Objectives fill:#f3e5f5,stroke:#7b1fa2\n    style G fill:#ffccbc\n    style K fill:#c8e6c9",
    "expanded_text": "This RPG quest system emphasizes player agency and progressive reward mechanics. Upon accepting a guild quest, players encounter three distinct, non-linear objectives: combat (defeating shadow wolves), exploration (gathering moon herbs), and puzzle-solving (deciphering an ancient riddle). The parallel objective design allows players to leverage their preferred playstyle or current resources, enhancing engagement and reducing frustration. Each completed objective provides immediate positive feedback through partial rewards and quest log updates, maintaining motivation through incremental progress. Once all objectives are fulfilled, the player returns to the Guild Master for final evaluation. A reputation-based reward tier system adds strategic depth: players with ≥50 guild reputation (earned through prior quests or faction choices) receive rare items, incentivizing long-term engagement and role-playing consistency. Post-quest, a level-gating mechanism checks if the player has reached level 15; if so, the narrative advances by unlocking the next story chapter, accompanied by a celebratory notification that reinforces achievement. This workflow integrates game design principles: player choice, variable rewards, reputation systems, and narrative pacing, all while maintaining clear state tracking through the quest log.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["parallel tasks", "conditional branches", "loops", "subgraphs", "labeled edges", "hierarchy"]
    }
  },
  {
    "input_text": "Planning a surprise birthday party: First, the organizer creates a private event group on WhatsApp. They poll guests for date preferences using Doodle. Once a date is locked, they split tasks: one friend books the venue via Peerspace, another orders catering from Uber Eats, and a third designs digital invites on Canva. All tasks must finish 48 hours before the event. If the venue booking fails, the organizer activates a backup location list. After invites are sent, RSVPs are tracked; if attendance drops below 70% of invited guests, the organizer sends personalized follow-ups. On event day, a shared Google Doc coordinates setup timelines and emergency contacts.",
    "mermaid": "flowchart TD\n    A[Create WhatsApp Event Group] --> B[Poll Dates via Doodle]\n    B --> C[Lock Final Date]\n    C --> D[Split Tasks]\n    subgraph Parallel_Tasks [48h Pre-Event Deadline]\n        D --> E1[Book Venue: Peerspace]\n        D --> E2[Order Catering: Uber Eats]\n        D --> E3[Design Invites: Canva]\n        E1 --> F1{Venue Confirmed?}\n        F1 -->|No| G[Activate Backup Venue List]\n        G --> E1\n        F1 -->|Yes| H[Task Complete]\n        E2 & E3 --> H\n    end\n    H --> I[Send Digital Invites]\n    I --> J[Track RSVPs]\n    J --> K{Attendance ≥70%?}\n    K -->|No| L[Send Personalized Follow-ups]\n    L --> J\n    K -->|Yes| M[Event Day: Coordinate via Google Doc]\n    M --> N[Party Time! 🎉]\n    style Parallel_Tasks fill:#e8f5e9,stroke:#2e7d32\n    style K fill:#ffccbc\n    style N fill:#c8e6c9",
    "expanded_text": "This social coordination workflow orchestrates a surprise birthday party through collaborative digital tools and adaptive planning. The organizer initiates by creating a private WhatsApp group to centralize communication, then uses Doodle to democratically select a date that maximizes guest availability. Once the date is confirmed, task delegation occurs across three parallel workstreams: venue booking (via Peerspace), catering (via Uber Eats), and invite design (via Canva), all bound by a 48-hour pre-event deadline to ensure readiness. The venue booking subflow includes resilience: if the primary choice is unavailable, a pre-vetted backup list is activated, preventing single-point failures. After invites are distributed, RSVP tracking monitors commitment levels; if attendance falls below the 70% threshold, personalized follow-ups re-engage hesitant guests, leveraging social proof and FOMO psychology. On event day, a shared Google Doc serves as a real-time command center for setup logistics, role assignments, and emergency contacts, enabling agile coordination. This workflow exemplifies modern social planning: leveraging platform-specific strengths (WhatsApp for chat, Doodle for polling, Canva for design), building in contingency planning, and using data-driven thresholds (70% attendance) to trigger interventions—all while preserving the emotional core of celebration and surprise.",
    "metadata": {
      "domain": "social interactions",
      "complexity": "medium",
      "graph_features": ["parallel tasks", "conditional branches", "loops", "subgraphs", "labeled edges", "deadline constraints"]
    }
  },
  {
    "input_text": "A small business applies for a $50k equipment loan. The bank's system first validates business registration and tax ID. Then it pulls credit reports from Experian and TransUnion; if either score is <650, the application routes to manual underwriting. If scores are ≥650, an automated DTI (debt-to-income) calculation runs. If DTI ≤40%, the system generates a preliminary approval with interest rate tiers based on credit score bands. If DTI >40%, the applicant is asked to provide collateral details. After collateral assessment (if needed), a loan officer reviews the full package. Final approval requires dual sign-off: one from risk management and one from the regional manager. Upon approval, e-signature requests are sent via DocuSign; after signing, funds disburse via ACH within 2 business days.",
    "mermaid": "flowchart TD\n    A[Submit $50k Equipment Loan Application] --> B[Validate Business Reg + Tax ID]\n    B --> C[Pull Credit Reports: Experian & TransUnion]\n    C --> D{Both Scores ≥650?}\n    D -->|No| E[Route to Manual Underwriting]\n    D -->|Yes| F[Calculate Automated DTI]\n    F --> G{DTI ≤40%?}\n    G -->|Yes| H[Generate Prelim Approval + Rate Tiers]\n    G -->|No| I[Request Collateral Details]\n    I --> J[Assess Collateral Value]\n    J --> K[Loan Officer Review]\n    E --> K\n    H --> K\n    K --> L{Dual Sign-off: Risk + Regional Mgr?}\n    L -->|No| M[Request Revisions/Additional Docs]\n    M --> K\n    L -->|Yes| N[Send DocuSign E-Signature Request]\n    N --> O[Receive Signed Documents]\n    O --> P[Disburse Funds via ACH ≤2 Business Days]\n    style D fill:#ffccbc\n    style G fill:#ffccbc\n    style L fill:#e1bee7\n    style P fill:#c8e6c9",
    "expanded_text": "This commercial loan approval workflow balances automation with human oversight to manage risk while ensuring fair access to capital. The process begins with foundational validation: confirming business registration and tax ID authenticity to prevent fraud. Next, dual credit bureau checks (Experian and TransUnion) provide a holistic view of creditworthiness; a score below 650 from either bureau triggers manual underwriting, acknowledging that algorithmic models may miss contextual factors. For applicants meeting the score threshold, an automated debt-to-income (DTI) calculation assesses repayment capacity. A DTI ≤40% qualifies for streamlined preliminary approval with dynamic interest rate tiers (e.g., 7.5% for 750+ scores, 9.2% for 650-749), rewarding stronger credit profiles. Higher DTI applicants are asked to pledge collateral, introducing asset-based risk mitigation. All paths converge at loan officer review, where qualitative factors (business plan viability, industry trends) are evaluated. Final approval requires dual authorization—a risk management sign-off ensures policy compliance, while regional manager approval adds local market context. This two-key system prevents unilateral decisions and distributes accountability. Upon approval, DocuSign enables secure, legally binding e-signatures, and ACH disbursement within two business days delivers capital efficiently. The workflow embeds regulatory safeguards (fair lending checks), adaptive risk assessment, and operational efficiency, reflecting modern fintech principles.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["conditional branches", "parallel validation", "hierarchy", "manual review gates", "labeled edges", "process nodes"]
    }
  },
  {
    "input_text": "Training a computer vision model for defect detection: Data engineers curate images from factory cameras, labeling defects with CVAT. The dataset is split 70/15/15 for train/validation/test. A PyTorch training job launches on AWS SageMaker with hyperparameter optimization enabled. During training, TensorBoard logs loss curves and accuracy metrics. If validation mAP doesn't improve for 5 epochs, early stopping triggers. After training, the model is evaluated on the test set; if test mAP ≥92%, it's registered in MLflow and deployed to a staging endpoint. If mAP <92%, the system flags misclassified examples for data augmentation and retrains. Deployed models undergo A/B testing against the previous version; if new model reduces false negatives by ≥15%, it promotes to production with canary rollout.",
    "mermaid": "flowchart LR\n    A[Curate Factory Images + Label with CVAT] --> B[Split Dataset: 70/15/15]\n    B --> C[Launch SageMaker Training Job + HPO]\n    C --> D[Log Metrics to TensorBoard]\n    D --> E{Val mAP Improved in Last 5 Epochs?}\n    E -->|No| F[Trigger Early Stopping]\n    E -->|Yes| C\n    F --> G[Evaluate on Test Set]\n    G --> H{Test mAP ≥92%?}\n    H -->|No| I[Flag Misclassified Examples]\n    I --> J[Apply Data Augmentation]\n    J --> C\n    H -->|Yes| K[Register Model in MLflow]\n    K --> L[Deploy to Staging Endpoint]\n    L --> M[A/B Test vs Previous Version]\n    M --> N{False Negatives Reduced ≥15%?}\n    N -->|Yes| O[Promote to Production: Canary Rollout]\n    N -->|No| P[Retain Current Model + Log Insights]\n    style E fill:#ffccbc\n    style H fill:#ffccbc\n    style N fill:#ffccbc\n    style O fill:#c8e6c9",
    "expanded_text": "This MLOps pipeline orchestrates the end-to-end training and deployment of a computer vision model for industrial defect detection, emphasizing iterative improvement and risk-mitigated release. Data engineers begin by curating and annotating factory camera images using CVAT, ensuring high-quality ground truth labels. The dataset is strategically partitioned (70% train, 15% validation, 15% test) to enable robust model evaluation. Training launches on AWS SageMaker with hyperparameter optimization (HPO), automatically exploring learning rates, batch sizes, and architecture variants to maximize performance. Real-time monitoring via TensorBoard tracks loss curves and accuracy, while an early stopping mechanism halts training if validation mAP (mean Average Precision) stagnates for five epochs, saving compute resources. Post-training, rigorous test set evaluation determines readiness: models achieving ≥92% mAP are registered in MLflow for version control and deployed to a staging endpoint for integration testing. Sub-threshold models trigger a feedback loop—misclassified examples are flagged for targeted data augmentation (rotation, noise injection, synthetic defects), then retraining commences. Finally, A/B testing in staging compares the new model against the production baseline; only if false negatives (critical missed defects) decrease by ≥15% does the model promote to production via canary rollout, gradually shifting traffic to monitor real-world impact. This workflow embodies responsible AI: continuous validation, human-in-the-loop refinement, and conservative deployment strategies to ensure reliability in high-stakes manufacturing environments.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["loops", "conditional branches", "feedback loops", "parallel implied", "labeled edges", "process nodes", "state transitions"]
    }
  },
  {
    "input_text": "A customer submits a support ticket via chatbot complaining about a failed payment. The bot first checks order status in Shopify. If the order is 'pending', it retries the payment via Stripe. If retry succeeds, the bot confirms resolution and closes the ticket. If retry fails or order is 'cancelled', the bot escalates to a human agent with priority 'high'. The agent investigates: if the issue is bank decline, they email the customer with alternative payment links; if it's a system bug, they tag the engineering team via Jira. After resolution, the agent updates the ticket status and triggers a satisfaction survey. If the survey score is ≤3/5, the ticket reopens for a manager follow-up.",
    "mermaid": "flowchart TD\n    A[Customer Submits Payment Failure Ticket] --> B[Bot Checks Order Status in Shopify]\n    B --> C{Order Status}\n    C -->|Pending| D[Retry Payment via Stripe]\n    D --> E{Retry Successful?}\n    E -->|Yes| F[Confirm Resolution + Close Ticket]\n    E -->|No| G[Escalate to Human Agent: Priority High]\n    C -->|Cancelled| G\n    G --> H[Agent Investigates Root Cause]\n    H --> I{Issue Type}\n    I -->|Bank Decline| J[Email Customer: Alternative Payment Links]\n    I -->|System Bug| K[Tag Engineering Team via Jira]\n    J & K --> L[Update Ticket Status + Send Satisfaction Survey]\n    L --> M{Survey Score ≤3/5?}\n    M -->|Yes| N[Reopen Ticket: Manager Follow-up]\n    N --> H\n    M -->|No| O[Case Closed ✅]\n    style C fill:#ffccbc\n    style E fill:#ffccbc\n    style I fill:#ffccbc\n    style M fill:#ffccbc\n    style N fill:#fff9c4",
    "expanded_text": "This customer support workflow blends AI automation with human expertise to resolve payment failures efficiently while preserving customer trust. When a ticket arrives via chatbot, the system first queries Shopify to determine order status—a critical context gate. For pending orders, an automated Stripe retry attempts to recover transient failures (e.g., network glitches); success triggers instant resolution and ticket closure, delighting customers with speed. If the retry fails or the order is already cancelled, the bot escalates to a human agent with 'high' priority, ensuring complex issues receive expert attention. Agents diagnose root causes: bank declines prompt empathetic communication with secure alternative payment links, while system bugs trigger engineering engagement via Jira integration, closing the loop between support and product teams. Post-resolution, a satisfaction survey captures voice-of-customer data; critically, low scores (≤3/5) automatically reopen the ticket for manager intervention, embedding a quality assurance feedback loop. This design optimizes for first-contact resolution where possible, but never at the expense of thoroughness—escalation paths are clear, handoffs are contextualized, and continuous improvement is driven by survey analytics. The workflow also respects platform ecosystems (Shopify, Stripe, Jira) and maintains auditability through ticket status tracking.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["conditional branches", "feedback loop", "state transitions", "escalation paths", "labeled edges", "process nodes"]
    }
  },
  {
    "input_text": "A pharmaceutical company manages clinical trial logistics. When a trial site requests drug shipments, the system checks inventory levels in the central warehouse. If stock is sufficient, it generates a temperature-controlled shipping manifest and schedules courier pickup via FedEx Clinical. If stock is low, it triggers a production request to the manufacturing unit and places the shipment on hold. All shipments include IoT temperature loggers; if real-time monitoring detects deviations >2°C from 2-8°C range, an alert notifies the quality team. Upon site receipt, staff scan QR codes to confirm delivery and log chain-of-custody. Monthly, the system audits all shipments for compliance; discrepancies trigger CAPA (Corrective Action Preventive Action) workflows. Trial data from sites flows into a centralized EDC system, with automated validation checks before database lock.",
    "mermaid": "flowchart TD\n    A[Trial Site Requests Drug Shipment] --> B[Check Central Warehouse Inventory]\n    B --> C{Stock Sufficient?}\n    C -->|Yes| D[Generate Temp-Controlled Manifest + Schedule FedEx Clinical]\n    C -->|No| E[Trigger Production Request + Hold Shipment]\n    E --> F[Monitor Production Completion]\n    F -->|Done| D\n    D --> G[Attach IoT Temperature Logger]\n    G --> H[Real-Time Temp Monitoring: 2-8°C]\n    H --> I{Temp Deviation >2°C?}\n    I -->|Yes| J[Alert Quality Team + Initiate Investigation]\n    I -->|No| K[Site Receives Shipment]\n    K --> L[Scan QR Code + Log Chain-of-Custody]\n    L --> M[Monthly Compliance Audit]\n    M --> N{Discrepancies Found?}\n    N -->|Yes| O[Trigger CAPA Workflow]\n    N -->|No| P[Audit Complete ✅]\n    O --> Q[Implement Corrections + Preventive Measures]\n    Q --> M\n    subgraph Data_Flow [Trial Data Management]\n        L --> R[Upload Data to Central EDC]\n        R --> S[Automated Validation Checks]\n        S --> T{Validation Passed?}\n        T -->|No| U[Flag for Site Query]\n        U --> R\n        T -->|Yes| V[Ready for Database Lock]\n    end\n    style C fill:#ffccbc\n    style I fill:#ffccbc\n    style N fill:#ffccbc\n    style J fill:#ffcdd2\n    style Data_Flow fill:#e3f2fd,stroke:#1565c0",
    "expanded_text": "This clinical trial logistics workflow ensures pharmaceutical integrity, regulatory compliance, and data reliability across a global supply chain. When a trial site requests investigational drug shipments, the system first validates inventory availability at the central warehouse—a critical gate to prevent stockouts or overproduction. Sufficient stock triggers generation of a temperature-controlled shipping manifest compliant with GDP (Good Distribution Practice) and schedules pickup via FedEx Clinical, a specialized courier for medical shipments. Low inventory initiates a production request to manufacturing, placing the shipment on hold until replenishment, with progress monitoring to minimize delays. Every shipment includes IoT temperature loggers providing real-time telemetry; deviations exceeding ±2°C from the required 2-8°C range instantly alert the quality team, enabling rapid intervention to protect product efficacy. Upon site receipt, QR code scanning confirms delivery and digitally logs chain-of-custody, creating an immutable audit trail. Monthly compliance audits systematically review all shipments; identified discrepancies activate CAPA workflows to correct root causes and prevent recurrence, embodying continuous quality improvement. Parallel to logistics, trial data flows into a centralized Electronic Data Capture (EDC) system, where automated validation rules (range checks, consistency logic) ensure data integrity before database lock—a prerequisite for regulatory submission. This integrated design harmonizes physical logistics with digital data governance, embedding quality-by-design principles, real-time risk monitoring, and end-to-end traceability essential for patient safety and regulatory success in clinical research.",
    "metadata": {
      "domain": "logistics",
      "complexity": "high",
      "graph_features": ["conditional branches", "loops", "parallel subgraphs", "feedback loops", "IoT integration", "labeled edges", "process nodes", "compliance gates"]
    }
  },
  {
    "input_text": "Hey, I need to submit a travel reimbursement. First, I fill out the expense form with receipts. Then my manager has to approve it. If it's under $100, auto-approve after manager OK. If over $100, finance team also needs to sign off. Once both approvals done, accounting sends the money within 5 business days. If my manager rejects it, I get an email to revise and resubmit.",
    "mermaid": "graph TD\n    A[Fill expense form with receipts] --> B{Manager approves?}\n    B -->|No| C[Email: revise and resubmit]\n    C --> A\n    B -->|Yes| D{Total amount?}\n    D -->|Under $100| E[Auto-approve]\n    D -->|Over $100| F[Finance team sign-off]\n    F --> G{Finance approves?}\n    G -->|No| C\n    G -->|Yes| E\n    E --> H[Accounting sends payment within 5 business days]",
    "expanded_text": "The travel reimbursement process starts when an employee fills out an expense form and attaches receipts. The request is then sent to the employee's manager for approval. If the manager rejects it, the employee receives an email asking them to revise and resubmit, which loops back to the form filling stage. If the manager approves, the system checks the total amount claimed. For amounts under $100, the request is auto-approved after manager approval. For amounts over $100, the finance team must also provide a sign-off. If finance rejects, the request goes back to the employee for revision. If finance approves, the request proceeds to auto-approval. Finally, accounting sends the reimbursement payment within five business days.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "loop", "approval system"]
    }
  },
  {
    "input_text": "When a user logs into our app, they enter username and password. The system validates credentials against the database. If invalid, show error and allow up to 3 retries. After 3 failures, lock account for 30 minutes. If valid, check if 2FA is enabled. If yes, generate a TOTP and send to user's authenticator app. User enters code. If code matches, login success. If not, allow 2 retries then lock. If 2FA not enabled, login success directly. Upon success, issue JWT token with 1-hour expiry.",
    "mermaid": "sequenceDiagram\n    participant U as User\n    participant A as App\n    participant DB as Database\n    participant T as TOTP Service\n    U->>A: Enter username/password\n    A->>DB: Validate credentials\n    alt Invalid credentials\n        DB-->>A: Invalid\n        A->>U: Show error\n        Note over U,A: Retry up to 3 times\n        alt 3 failures\n            A->>A: Lock account 30 min\n        end\n    else Valid credentials\n        DB-->>A: Valid\n        A->>A: Check 2FA enabled?\n        alt 2FA enabled\n            A->>T: Generate TOTP\n            T-->>A: TOTP secret\n            A->>U: Request TOTP code\n            U->>A: Enter code\n            A->>T: Validate code\n            alt Code valid\n                T-->>A: OK\n                A->>A: Login success\n            else Code invalid\n                T-->>A: Fail\n                Note over A,U: 2 retries then lock\n            end\n        else 2FA disabled\n            A->>A: Login success\n        end\n        A->>U: Issue JWT token (1h expiry)\n    end",
    "expanded_text": "The user login flow begins when a user enters their username and password into the application. The app validates these credentials against the database. If the credentials are invalid, the app shows an error message to the user and allows up to three retry attempts. After three failed attempts, the account is locked for 30 minutes. If the credentials are valid, the app checks whether two-factor authentication (2FA) is enabled for that account. If 2FA is enabled, the app generates a time-based one-time password (TOTP) and sends it to the user's authenticator application. The user then enters the code, and the app validates it. If the code is valid, login succeeds; if invalid, the user gets two retries before the account is locked. If 2FA is not enabled, login succeeds directly after password validation. Upon successful login, the app issues a JSON Web Token (JWT) with a one-hour expiry to the user.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["sequence diagram", "conditional branches", "retries", "lockout state"]
    }
  },
  {
    "input_text": "Our model training pipeline has the following steps. First, data ingestion from S3. Then preprocessing (cleaning, normalization). After that, feature extraction. Then the model trains for up to 100 epochs. After each epoch, we compute validation loss. If validation loss improves, we save a checkpoint. If it does not improve for 10 consecutive epochs, we stop early and load the best checkpoint. Then we evaluate on a test set. If test accuracy > 95%, we promote the model to staging. If not, we retrain with different hyperparameters (up to 5 retries). After promotion, we run A/B testing against the current production model for 7 days. If the new model wins (higher CTR), we deploy to production. Else, we keep the old model and log the experiment.",
    "mermaid": "graph TD\n    A[Data ingestion from S3] --> B[Preprocessing: cleaning, normalization]\n    B --> C[Feature extraction]\n    C --> D[Train for one epoch]\n    D --> E[Compute validation loss]\n    E --> F{Validation loss improved?}\n    F -->|Yes| G[Save checkpoint, reset counter]\n    F -->|No| H[Increment counter]\n    G --> I{More epochs?}\n    H --> J{Counter >= 10?}\n    J -->|Yes| K[Stop early, load best checkpoint]\n    J -->|No| I\n    I -->|Yes| D\n    I -->|No| K\n    K --> L[Evaluate on test set]\n    L --> M{Test accuracy > 95%?}\n    M -->|No| N{Retries < 5?}\n    N -->|Yes| O[Tune hyperparameters]\n    O --> D\n    N -->|No| P[Log failure]\n    M -->|Yes| Q[Promote to staging]\n    Q --> R[A/B test vs production for 7 days]\n    R --> S{New model wins? (higher CTR)}\n    S -->|Yes| T[Deploy to production]\n    S -->|No| U[Keep old model, log experiment]",
    "expanded_text": "The model training pipeline starts with data ingestion from Amazon S3. The data then undergoes preprocessing steps including cleaning and normalization, followed by feature extraction. The model trains iteratively for up to 100 epochs. After each epoch, the pipeline computes validation loss. If validation loss improves compared to the previous best, a checkpoint is saved and an early stopping counter resets to zero. If validation loss does not improve, the counter increments. When the counter reaches 10 consecutive epochs without improvement, training stops early and the best saved checkpoint is loaded. After training completes, the model is evaluated on a test set. If test accuracy exceeds 95%, the model is promoted to a staging environment. If not, the pipeline retrains using different hyperparameters, up to a maximum of 5 retries; if all retries fail, the failure is logged. Once promoted, the model undergoes A/B testing against the current production model for 7 days, comparing click-through rates (CTR). If the new model shows superior performance, it is deployed to production; otherwise, the existing model remains and the experiment is logged.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["sequential flows", "loop (epochs)", "early stopping", "feedback loop (retries)", "conditional branches"]
    }
  },
  {
    "input_text": "A patient with chest pain enters the ER. Triage nurse assesses: if patient is unconscious or not breathing, go to Code Blue team immediately. If conscious but in severe distress, go to Resuscitation Bay. If stable, go to Fast Track. In Resuscitation Bay, doctors perform EKG and blood work. If EKG shows STEMI, activate cath lab within 10 minutes. If non-STEMI, admit to cardiology ward. In Fast Track, if pain is musculoskeletal, discharge with NSAIDs. If suspected GERD, give antacid and schedule follow-up. All discharged patients receive a 48-hour call back to check status.",
    "mermaid": "stateDiagram-v2\n    [*] --> Triage\n    Triage --> Unconscious: Not breathing\n    Triage --> SevereDistress: Conscious, severe distress\n    Triage --> Stable: Stable\n    Unconscious --> CodeBlue: Immediate intervention\n    SevereDistress --> ResuscitationBay\n    ResuscitationBay --> EKG: Perform EKG & blood work\n    EKG --> STEMI: EKG shows STEMI\n    STEMI --> CathLab: Activate within 10min\n    EKG --> NonSTEMI: Non-STEMI\n    NonSTEMI --> CardiologyWard: Admit\n    Stable --> FastTrack\n    FastTrack --> Musculoskeletal: Pain type\n    Musculoskeletal --> Discharge: Prescribe NSAIDs\n    FastTrack --> GERD: Suspected GERD\n    GERD --> Discharge: Antacid + follow-up\n    Discharge --> CallBack: 48h call back\n    CallBack --> [*]",
    "expanded_text": "A patient presenting with chest pain enters the emergency room. The triage nurse assesses the patient's condition. If the patient is unconscious or not breathing, they are immediately sent to the Code Blue team for life-saving intervention. If the patient is conscious but in severe distress, they go to the Resuscitation Bay. If the patient is stable, they go to Fast Track. In the Resuscitation Bay, doctors perform an EKG and blood work. If the EKG shows ST-elevation myocardial infarction (STEMI), the cath lab is activated within 10 minutes. If the EKG shows non-STEMI, the patient is admitted to the cardiology ward. In Fast Track, the type of pain is evaluated: if musculoskeletal, the patient is discharged with NSAIDs; if suspected GERD, they receive antacids and are scheduled for a follow-up appointment. All discharged patients receive a follow-up phone call within 48 hours to check their status.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["state transitions", "conditional branches", "parallel paths"]
    }
  },
  {
    "input_text": "The Dark Lord has three phases. Phase 1: casts fireballs every 5 seconds. When HP drops to 70%, Phase 2: summons two adds and teleports every 10 seconds. When HP drops to 30%, Phase 3: enrages, damage doubled, and casts nova on death. If player dies in any phase, respawn at checkpoint and restart Phase 1. After defeating Phase 3, player gets legendary sword. If player uses the 'ice shield' item, fireball damage is halved throughout the fight.",
    "mermaid": "stateDiagram-v2\n    [*] --> Phase1\n    Phase1 --> Phase2: HP <= 70%\n    Phase2 --> Phase3: HP <= 30%\n    Phase3 --> Victory: HP == 0\n    Victory --> Reward: Legendary sword\n    Reward --> [*]\n    Phase1 --> Respawn: Player dies\n    Phase2 --> Respawn\n    Phase3 --> Respawn\n    Respawn --> Phase1: Restart fight\n    state Phase1 {\n        [*] --> Fireball: every 5s\n    }\n    state Phase2 {\n        [*] --> SummonAdds\n        SummonAdds --> Teleport: every 10s\n    }\n    state Phase3 {\n        [*] --> Enrage\n        Enrage --> NovaOnDeath\n    }\n    note right of Phase3 : Damage doubled\n    note right of Phase1 : Ice shield halves fireball damage",
    "expanded_text": "The boss fight against the Dark Lord consists of three phases. Phase 1: the boss casts fireballs every 5 seconds. When the boss's health points drop to 70% or below, the fight transitions to Phase 2: the boss summons two additional enemies and teleports every 10 seconds. When HP reaches 30% or below, Phase 3 begins: the boss enrages, dealing double damage, and casts a nova spell upon death. If the player dies during any phase, they respawn at the last checkpoint and must restart the fight from Phase 1. After successfully defeating Phase 3, the player receives a legendary sword as a reward. Throughout the fight, if the player uses the 'ice shield' item, all fireball damage is halved.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["state transitions", "conditional branches", "feedback loop (respawn)", "item effect"]
    }
  },
  {
    "input_text": "Subject: Contract approval workflow - please review. Our process: Legal drafts the NDA. Then it goes to the counterparty. If they accept, sign. If they propose changes, redlining occurs. After redlining, legal reviews again. If legal agrees, sign. If not, counter-propose. This can loop up to 3 times. After 3 rounds without agreement, escalate to executive. Executive decides: accept, reject, or walk away. Once signed, contract is archived and both parties notified.",
    "mermaid": "graph TD\n    A[Legal drafts NDA] --> B[Send to counterparty]\n    B --> C{Counterparty accepts?}\n    C -->|Yes| D[Sign]\n    C -->|No| E[Redlining]\n    E --> F[Legal reviews changes]\n    F --> G{Legal agrees?}\n    G -->|Yes| D\n    G -->|No| H[Counter-propose]\n    H --> I{Cycle count < 3?}\n    I -->|Yes| B\n    I -->|No| J[Escalate to executive]\n    J --> K{Executive decision}\n    K -->|Accept| D\n    K -->|Reject| L[Terminate]\n    K -->|Walk away| L\n    D --> M[Archive contract]\n    M --> N[Notify both parties]",
    "expanded_text": "The legal contract approval workflow for an NDA begins with Legal drafting the agreement. The draft is then sent to the counterparty. If the counterparty accepts the terms, the contract proceeds to signing. If the counterparty proposes changes, redlining (marking modifications) occurs. After redlining, Legal reviews the proposed changes. If Legal agrees, the contract is signed. If Legal disagrees, a counter-proposal is generated. The process of sending to counterparty, redlining, and legal review loops, but only for up to three cycles. After three rounds without reaching an agreement, the matter is escalated to an executive. The executive has three options: accept the latest terms (then sign), reject (terminate), or walk away (terminate). Once signed, the contract is archived and both parties receive a notification.",
    "metadata": {
      "domain": "legal",
      "complexity": "high",
      "graph_features": ["conditional branches", "loop with counter", "escalation path", "approval system"]
    }
  },
  {
    "input_text": "A customer tweets '@SupportApp my payment failed but money is deducted'. Support agent replies within 15 min asking for transaction ID. Customer provides ID. Agent checks payment gateway. If status is 'success' but our system shows 'failed', we trigger a sync job to reconcile. If reconciliation fixes it, we apologize and confirm. If not, we escalate to engineering with priority P1 (2h SLA). If status is 'failed', we issue a refund within 24h. All cases logged to CRM. If customer is not satisfied after resolution, offer $5 credit.",
    "mermaid": "graph TD\n    A[Tweet: payment failed] --> B[Agent replies in 15 min: ask for transaction ID]\n    B --> C[Customer provides ID]\n    C --> D[Agent checks payment gateway status]\n    D --> E{Gateway status?}\n    E -->|Success, but system shows failed| F[Trigger reconciliation sync job]\n    F --> G{Reconciliation fixes?}\n    G -->|Yes| H[Apologize and confirm]\n    G -->|No| I[Escalate to engineering, P1, 2h SLA]\n    I --> J[Engineering fixes]\n    J --> H\n    E -->|Failed| K[Issue refund within 24h]\n    H --> L[Log to CRM]\n    K --> L\n    L --> M{Customer satisfied?}\n    M -->|No| N[Offer $5 credit]\n    M -->|Yes| O[Close ticket]",
    "expanded_text": "A customer tweets '@SupportApp my payment failed but money is deducted'. A support agent replies within 15 minutes, asking for the transaction ID. The customer provides the ID. The agent then checks the payment gateway status. If the gateway shows 'success' but the company's internal system shows 'failed', the agent triggers a reconciliation sync job. If reconciliation fixes the discrepancy, the agent apologizes and confirms the resolution. If reconciliation does not fix it, the issue is escalated to engineering with a P1 priority and a 2-hour SLA. Engineering resolves the issue, and then the agent apologizes and confirms. If the gateway status is 'failed', the agent issues a refund within 24 hours. After resolution, all details are logged to the CRM. The agent then checks if the customer is satisfied. If not satisfied, the agent offers a $5 credit. If satisfied, the ticket is closed.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["conditional branches", "sequential flows", "escalation", "feedback loop (satisfaction)"]
    }
  },
  {
    "input_text": "I need to plan my exam study schedule for 3 subjects: Math, Physics, English. Math requires 20 hours total. Physics 15 hours. English 10 hours. I have 5 weeks. Each week: first, review theory (2h per subject). Then practice problems (3h for Math, 2h for Physics, 1h for English). Weekends: take a mock test for each subject alternately. If mock score < 70%, add 2 extra practice hours the following week for that subject. In the final week, no new material, only full-length exams and error analysis.",
    "mermaid": "gantt\n    title Exam Study Plan (5 weeks)\n    dateFormat YYYY-MM-DD\n    section Weekly routine (Mon-Fri)\n    Math theory   :a1, 2024-01-01, 2h\n    Physics theory:a2, after a1, 2h\n    English theory:a3, after a2, 2h\n    Math practice :a4, after a3, 3h\n    Physics prac  :a5, after a4, 2h\n    English prac  :a6, after a5, 1h\n    section Weekend\n    Mock test (alternating) :crit, 2024-01-06, 3h\n    section Conditional (if mock <70%)\n    Extra practice next week :active, after mock, 2h\n    section Final week (week 5)\n    Full exam & error analysis :milestone, 2024-01-29, 8h",
    "expanded_text": "The exam study schedule spans 5 weeks for three subjects: Math (20 total hours), Physics (15 hours), and English (10 hours). Each week from Monday to Friday, the student first reviews theory for 2 hours per subject. Then, practice problems are done: 3 hours for Math, 2 hours for Physics, and 1 hour for English. On weekends, the student takes a mock test for each subject on an alternating basis. If a mock test score is below 70%, an additional 2 hours of practice for that subject are added to the following week. During the final week (week 5), no new material is introduced; instead, the student takes full-length exams and performs error analysis.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["gantt chart", "sequential flows", "conditional branch (mock score)", "feedback loop"]
    }
  },
  {
    "input_text": "A cybersecurity incident response plan: Detect anomaly via SIEM alert. Analyst triages: if false positive, close. If true positive, isolate affected system from network. Then collect forensic data (memory, logs, disk). Parallel task: notify CISO and legal. Analyze data to determine root cause. If malware, run antivirus and restore from clean backup. If unauthorized access, reset credentials and review access logs. If data exfiltration suspected, activate breach notification process within 72 hours per GDPR. After remediation, run full vulnerability scan. If clean, reconnect system and document lessons learned. If still vulnerable, repeat remediation.",
    "mermaid": "graph TD\n    A[SIEM alert: anomaly detected] --> B[Analyst triage]\n    B --> C{False positive?}\n    C -->|Yes| D[Close incident]\n    C -->|No| E[Isolate affected system from network]\n    E --> F[Collect forensic data: memory, logs, disk]\n    E --> G[Notify CISO and legal] (parallel)\n    F --> H[Analyze root cause]\n    G --> H\n    H --> I{Type of incident?}\n    I -->|Malware| J[Run antivirus]\n    J --> K[Restore from clean backup]\n    I -->|Unauthorized access| L[Reset credentials, review access logs]\n    I -->|Data exfiltration| M[Activate breach notification within 72h (GDPR)]\n    K --> N[Run full vulnerability scan]\n    L --> N\n    M --> N\n    N --> O{Vulnerabilities found?}\n    O -->|Yes| P[Remediate vulnerabilities]\n    P --> N\n    O -->|No| Q[Reconnect system, document lessons learned]",
    "expanded_text": "The cybersecurity incident response process begins when a SIEM (Security Information and Event Management) system detects an anomaly and generates an alert. An analyst triages the alert. If it is a false positive, the incident is closed. If it is a true positive, the analyst isolates the affected system from the network. Two parallel actions then occur: forensic data (memory, logs, and disk images) is collected, and the CISO (Chief Information Security Officer) and legal department are notified. The collected data is analyzed to determine the root cause. Based on the incident type: if malware is found, antivirus is run and the system is restored from a clean backup; if unauthorized access occurred, credentials are reset and access logs reviewed; if data exfiltration is suspected, the breach notification process is activated within 72 hours to comply with GDPR. After remediation, a full vulnerability scan is performed. If vulnerabilities remain, the system repeats remediation and scanning. If the system is clean, it is reconnected to the network, and lessons learned are documented.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["conditional branches", "parallel tasks", "loop (remediation)", "sequential flows"]
    }
  },
  {
    "input_text": "Making a cup of tea. Boil water. While water boils, put a teabag in a mug. When water is ready, pour it into the mug. Let it steep for 3 minutes. Remove teabag. Add sugar if desired. Add milk if desired. Stir. Enjoy. If you forget the teabag, you just have hot water — start over. If you steep too long (>5 min), tea becomes bitter — discard and restart.",
    "mermaid": "graph TD\n    A[Boil water] --> B[Put teabag in mug]\n    B --> C[Pour water into mug]\n    C --> D[Steep for 3 minutes]\n    D --> E{Steep time?}\n    E -->|>5 min| F[Tea bitter: discard and restart]\n    E -->|≤5 min| G[Remove teabag]\n    G --> H{Sugar?}\n    H -->|Yes| I[Add sugar]\n    H -->|No| J{Milk?}\n    I --> J\n    J -->|Yes| K[Add milk]\n    J -->|No| L[Stir]\n    K --> L\n    L --> M[Enjoy]\n    F --> A\n    note right of A: If you forget teabag\n    A -.->|No teabag| N[Hot water: start over]\n    N --> A",
    "expanded_text": "The process of making a cup of tea begins by boiling water. While the water is boiling, or after starting to boil, put a teabag into a mug. Once the water is ready, pour it into the mug. Let the tea steep for 3 minutes. If steeping exceeds 5 minutes, the tea becomes bitter and must be discarded, restarting from boiling water. If steeping time is 5 minutes or less, remove the teabag. Then, if desired, add sugar. After sugar (or skipping it), add milk if desired. Finally, stir the tea and enjoy. A separate failure mode: if you forget to put the teabag in the mug before pouring water, you end up with hot water alone, so you must start over from the beginning.",
    "metadata": {
      "domain": "daily life",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches", "failure recovery loops"]
    }
  },
  {
    "input_text": "Every time I try to quit social media, I last about three days before boredom kicks in, I open the apps again, scroll for hours, feel guilty, and promise myself I'll try again next week.",
    "mermaid": "flowchart TD\n    Start[Decide to Quit] --> Day1[Days 1-3: Strong Motivation]\n    Day1 --> Trigger[Boredom or FOMO]\n    Trigger --> Relapse[Reopen Apps]\n    Relapse --> Scroll[Endless Scrolling]\n    Scroll --> Guilt[Feel Guilty]\n    Guilt --> Promise[New Resolution]\n    Promise --> Start",
    "expanded_text": "The cycle begins with a firm decision to quit social media. For the first three days, motivation remains high. Eventually, boredom or fear of missing out acts as a trigger, leading to relapse by reopening the apps. This results in prolonged scrolling sessions followed by intense guilt. The guilt prompts a new promise to try quitting again, restarting the entire loop.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["feedback loop", "habit cycle", "emotional states"]
    }
  },
  {
    "input_text": "When a junior developer submits their first major pull request, our team lead reviews the code, suggests improvements on architecture and tests, the developer implements changes, and only then it gets merged into the main branch after a second quick review.",
    "mermaid": "flowchart LR\n    Submit[Junior Submits PR] --> Review1[Team Lead Review]\n    Review1 --> Feedback[Architecture & Test Feedback]\n    Feedback --> Implement[Developer Implements Changes]\n    Implement --> Review2[Second Quick Review]\n    Review2 --> Merge[Merge to Main]",
    "expanded_text": "The process starts when a junior developer submits their first major pull request. The team lead performs an initial review focusing on architecture and testing quality, providing detailed feedback. The developer then implements the suggested improvements. A second, lighter review follows to verify changes before the code is finally merged into the main branch. This structured approach helps juniors grow while maintaining code quality.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["sequential flow", "approval system", "feedback loop"]
    }
  },
  {
    "input_text": "Our fraud detection system monitors transactions in real-time. If amount is unusually high or location differs from user's history, it flags the transaction, sends an OTP to the customer, and holds the payment until verification. If not verified within 5 minutes, the transaction is declined.",
    "mermaid": "flowchart TD\n    Transaction[New Transaction] --> Monitor[Real-time Monitoring]\n    Monitor --> Risk{Risk Factors?}\n    Risk -->|No| Approve[Approve Payment]\n    Risk -->|Yes| Flag[Flag Transaction]\n    Flag --> OTP[Send OTP Verification]\n    OTP --> Hold[Hold Payment]\n    Hold --> Verify{Verified within 5min?}\n    Verify -->|Yes| Approve\n    Verify -->|No| Decline[Decline Transaction]",
    "expanded_text": "Every incoming transaction enters real-time monitoring. Normal transactions are approved immediately. Suspicious ones, based on amount or location anomalies, get flagged. An OTP is sent to the customer while the payment is held. If the customer verifies within five minutes, the transaction proceeds. Otherwise, it is automatically declined. This balances security with user experience.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["branching conditions", "time-bound decision", "real-time processing"]
    }
  },
  {
    "input_text": "The immune response to a viral infection involves innate immunity acting first within hours, followed by adaptive immunity that takes days to ramp up. Antibodies are produced and memory cells are created for faster future responses.",
    "mermaid": "flowchart TD\n    Infection[Virus Enters Body] --> Innate[Innate Immunity Activation]\n    Innate --> Bridge[Bridge to Adaptive]\n    Bridge --> Adaptive[Adaptive Immunity Activation]\n    Adaptive --> Antibodies[Produce Antibodies]\n    Antibodies --> Clear[Clear Infection]\n    Adaptive --> Memory[Create Memory Cells]\n    Memory --> Future[Faster Response on Re-exposure]",
    "expanded_text": "Upon viral entry, the innate immune system activates rapidly within hours as the first line of defense. It bridges to the slower but more specific adaptive immunity, which ramps up over several days. The adaptive response leads to antibody production that helps clear the infection and the creation of memory cells. These memory cells ensure a much faster and stronger response if the same virus is encountered again.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["sequential stages", "causal progression", "long-term effect"]
    }
  },
  {
    "input_text": "Emma wants to surprise her boyfriend with a romantic dinner but she has to finish her work deadline first, pick up groceries, cook without burning anything this time, set the table nicely, and still act normal when he comes home early.",
    "mermaid": "flowchart TD\n    Goal[Surprise Romantic Dinner] --> Deadline[Finish Work Project]\n    Deadline --> Groceries[Buy Ingredients]\n    Groceries --> Cook[Cook Carefully]\n    Cook --> Setup[Set Table Elegantly]\n    Setup --> ActNormal[Behave Normally]\n    ActNormal --> Arrival{Boyfriend Arrives Early?}\n    Arrival -->|Yes| Panic[Quick Adjustments]\n    Arrival -->|No| Success[Perfect Surprise]",
    "expanded_text": "Emma's goal is to prepare a surprise romantic dinner. She must first complete her work deadline, then purchase groceries, cook carefully to avoid past mistakes, beautifully set the table, and maintain normal behavior. A key risk is her boyfriend arriving early, which would force quick adjustments. Successful completion without early arrival leads to the perfect surprise.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "simple",
      "graph_features": ["task dependency", "conditional risk", "personal goal"]
    }
  },
  {
    "input_text": "In our student admission system, applications go through eligibility check, document verification, entrance test scheduling, interview if needed for certain programs, final merit list generation, and offer letter issuance. Rejections happen at any validation stage.",
    "mermaid": "flowchart TD\n    Apply[Application Submitted] --> Eligibility{Eligibility Check}\n    Eligibility -->|Fail| Reject[Application Rejected]\n    Eligibility -->|Pass| DocVerify[Document Verification]\n    DocVerify -->|Fail| Reject\n    DocVerify -->|Pass| Test[Entrance Test Scheduling]\n    Test --> Interview{Needs Interview?}\n    Interview -->|Yes| Conduct[Conduct Interview]\n    Interview -->|No| Merit[Generate Merit List]\n    Conduct --> Merit\n    Merit --> Offer[Issue Offer Letter]",
    "expanded_text": "Student applications first undergo an eligibility check. Failures are rejected immediately. Passing applications move to document verification, where issues also cause rejection. Valid applications proceed to entrance test scheduling. Certain programs require an additional interview. Finally, a merit list is generated and successful candidates receive offer letters. The process includes multiple validation gates to ensure quality.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["multi-stage validation", "rejection paths", "conditional branching"]
    }
  },
  {
    "input_text": "The machine learning pipeline for our recommendation engine starts with collecting user behavior data, cleaning and feature engineering, training multiple models in parallel, evaluating them using A/B testing, selecting the best performer, and deploying it with continuous monitoring for drift.",
    "mermaid": "flowchart TD\n    Data[Collect User Behavior] --> Clean[Data Cleaning & Feature Engineering]\n    Clean --> Train[Parallel Model Training]\n    Train --> Eval[A/B Testing & Evaluation]\n    Eval --> Select[Select Best Model]\n    Select --> Deploy[Deploy to Production]\n    Deploy --> Monitor[Continuous Monitoring]\n    Monitor --> Drift{Concept Drift Detected?}\n    Drift -->|Yes| Retrain[Retrain Models]\n    Drift -->|No| Monitor",
    "expanded_text": "User interaction data is continuously collected and then cleaned with feature engineering performed. Multiple recommendation models are trained in parallel. These models undergo rigorous A/B testing and evaluation. The best performing model is selected and deployed into production. A monitoring layer tracks performance for concept drift. When drift is detected, the pipeline loops back to retraining. This ensures recommendations remain relevant over time.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["parallel tasks", "feedback loop", "monitoring", "MLOps pipeline"]
    }
  },
  {
    "input_text": "During a product launch, the marketing team prepares assets, legal approves messaging, engineering finalizes features, sales trains the team, and only after all green lights from stakeholders does the campaign go live on social media and email.",
    "mermaid": "flowchart TD\n    Launch[Product Launch Prep] --> Parallel[Parallel Workstreams]\n    Parallel --> Marketing[Marketing Assets]\n    Parallel --> Legal[Legal Approval]\n    Parallel --> Engineering[Feature Finalization]\n    Parallel --> Sales[Sales Training]\n    Marketing --> Approval{Gate}\n    Legal --> Approval\n    Engineering --> Approval\n    Sales --> Approval\n    Approval --> Live[Campaign Goes Live]\n    Live --> Channels[Social + Email]",
    "expanded_text": "Product launch preparation involves several parallel workstreams: marketing creates assets, legal reviews all messaging, engineering completes final features, and sales trains the team. All streams must pass through a central approval gate involving key stakeholders. Only once every team gives the green light does the campaign officially launch across social media and email channels. This coordinated approach minimizes risks.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["parallel tasks", "approval system", "converging dependencies"]
    }
  },
  {
    "input_text": "Whenever the server starts throwing 500 errors, our ops team restarts the service first. If that doesn't help, they check database connections, then review recent deployments, roll back if necessary, and finally page the on-call engineer if it's still broken.",
    "mermaid": "flowchart TD\n    Error[500 Errors Detected] --> Restart[Restart Service]\n    Restart --> Check1{Resolved?}\n    Check1 -->|No| DB[Check Database Connections]\n    DB --> Check2{Resolved?}\n    Check2 -->|No| Deploy[Review Recent Deployments]\n    Deploy --> Rollback{Rollback Needed?}\n    Rollback -->|Yes| Execute[Execute Rollback]\n    Rollback -->|No| Page[Page On-call Engineer]\n    Execute --> Check3{Resolved?}\n    Check3 -->|No| Page",
    "expanded_text": "Upon detection of repeated 500 errors, the first action is to restart the affected service. If issues persist, database connections are examined. Next, recent code deployments are reviewed and potentially rolled back. If the problem remains unresolved after these steps, the on-call engineer is paged for deeper investigation. The process follows a clear escalation path with multiple retry and diagnostic stages.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["troubleshooting scenario", "sequential retries", "escalation"]
    }
  },
  {
    "input_text": "To decide which apartment to rent, I list all options, compare rent and location, check reviews and safety ratings, visit the top three in person, negotiate with landlords, and then sign the lease on the one that feels right both financially and emotionally.",
    "mermaid": "flowchart TD\n    Decide[Decide to Rent] --> List[List All Options]\n    List --> Compare[Compare Rent, Location, Size]\n    Compare --> Research[Reviews & Safety Ratings]\n    Research --> Shortlist[Shortlist Top 3]\n    Shortlist --> Visit[In-Person Visits]\n    Visit --> Negotiate[Negotiate Terms]\n    Negotiate --> Choose[Select Best Fit]\n    Choose --> Sign[Sign Lease]",
    "expanded_text": "The apartment hunting process starts by listing all available options and comparing practical factors like rent, location, and size. Research into reviews and safety ratings helps narrow it down to the top three. These are visited in person to get a real feel. Negotiation with landlords follows, after which the final choice is made based on both financial sensibility and emotional comfort before signing the lease.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["decision process", "multi-criteria evaluation", "sequential filtering"]
    }
  },
  {
    "input_text": "In our game, players start at the village, accept a quest from the elder, travel through the forest where they might encounter wolves, collect three magical herbs, return to defeat the goblin boss, and finally claim their reward. If they die, they respawn at the village with half their items.",
    "mermaid": "flowchart TD\n    Start[Village Spawn] --> Accept[Accept Quest from Elder]\n    Accept --> Forest[Enter Forest]\n    Forest --> Encounter{Wolves?}\n    Encounter -->|Yes| Combat[Combat Wolves]\n    Encounter -->|No| Gather[Gather 3 Herbs]\n    Combat --> Gather\n    Gather --> Return[Return to Village]\n    Return --> Boss[Defeat Goblin Boss]\n    Boss --> Reward[Claim Reward]\n    Boss -->|Player Dies| Respawn[Respawn at Village - Half Items]\n    Respawn --> Accept",
    "expanded_text": "The gameplay loop begins in the village where the player accepts a quest from the elder. They venture into the forest, facing random wolf encounters that require combat. Players must collect three magical herbs before returning. The final challenge is defeating the goblin boss. Success grants the reward, while death causes respawning at the village with halved inventory, restarting the quest cycle.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["game loop", "branching events", "death & respawn", "conditional encounters"]
    }
  },
  {
    "input_text": "New employee onboarding at TechFlow involves signing offer letter, completing HR paperwork, setting up accounts on Slack, Jira, and Gmail, a 1:1 with manager, department orientation, and 30-day check-in. Some steps can happen in parallel.",
    "mermaid": "flowchart TD\n    Offer[Offer Accepted] --> Parallel[Parallel Onboarding]\n    Parallel --> HR[HR Paperwork & Compliance]\n    Parallel --> Accounts[Create Slack, Jira, Gmail]\n    HR --> Manager[1:1 with Manager]\n    Accounts --> Orientation[Department Orientation]\n    Manager --> Orientation\n    Orientation --> Work[Start First Tasks]\n    Work --> Checkin[30-Day Performance Check-in]",
    "expanded_text": "After accepting the offer, new employees enter a structured yet flexible onboarding. HR paperwork runs alongside IT account creation for Slack, Jira, and Gmail. Once initial setup completes, they have a one-on-one meeting with their manager and attend department orientation. They begin working on initial tasks, culminating in a formal 30-day check-in to assess integration and address concerns.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["parallel tasks", "sequential milestones", "onboarding workflow"]
    }
  },
  {
    "input_text": "Before any contract can be signed with a new vendor, the legal team reviews terms, procurement verifies pricing and SLAs, finance approves budget, security does a vendor risk assessment, and all stakeholders must sign off before final execution.",
    "mermaid": "flowchart TD\n    Proposal[Vendor Contract Proposal] --> Legal[Legal Team Review]\n    Proposal --> Procurement[Procurement Verification]\n    Proposal --> Finance[Budget Approval]\n    Proposal --> Security[Vendor Risk Assessment]\n    Legal --> Approval{Gate: All Clear?}\n    Procurement --> Approval\n    Finance --> Approval\n    Security --> Approval\n    Approval -->|Yes| Sign[Contract Execution]\n    Approval -->|No| Revise[Request Revisions]",
    "expanded_text": "Vendor contract proposals undergo multiple independent reviews: legal examines terms and risks, procurement checks pricing and service levels, finance confirms budget availability, and security performs a risk assessment. These converge at a final approval gate. Only when every department gives clearance can the contract be signed. Otherwise, revisions are requested and the process loops.",
    "metadata": {
      "domain": "legal",
      "complexity": "high",
      "graph_features": ["approval system", "parallel reviews", "converging dependencies"]
    }
  },
  {
    "input_text": "Photosynthesis in plants starts with sunlight hitting the leaves, water absorbed from roots, carbon dioxide from air, producing glucose and oxygen as byproduct. The process has light-dependent and light-independent stages.",
    "mermaid": "flowchart TD\n    Sun[Sunlight] --> Light[Light-Dependent Reactions]\n    Roots[Water from Roots] --> Light\n    Air[CO2 from Air] --> Dark[Light-Independent Reactions]\n    Light --> ATP[ATP + NADPH]\n    ATP --> Dark\n    Dark --> Glucose[Glucose Production]\n    Dark --> Oxygen[Oxygen Release]",
    "expanded_text": "Photosynthesis begins when sunlight reaches the leaves, triggering light-dependent reactions that use water absorbed by roots to generate ATP and NADPH while releasing oxygen. These energy carriers then power the light-independent reactions (Calvin cycle), which consume carbon dioxide from the air to synthesize glucose. The overall process converts light energy into chemical energy stored in sugars.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["causal chain", "parallel inputs", "scientific process"]
    }
  },
  {
    "input_text": "My typical day managing multiple projects includes checking Slack messages first thing, updating task status in Notion, attending standup at 10, deep work until lunch, client calls in afternoon, and ending with tomorrow's planning. I usually get distracted by emails.",
    "mermaid": "flowchart TD\n    Morning[Start Day] --> Slack[Check Slack Messages]\n    Slack --> Notion[Update Notion Tasks]\n    Notion --> Standup[10 AM Standup]\n    Standup --> Deep[Deep Focused Work]\n    Deep --> Lunch[Lunch Break]\n    Lunch --> Calls[Afternoon Client Calls]\n    Calls --> Emails[Handle Emails - Distraction]\n    Emails --> Plan[Plan Next Day]\n    Plan --> End[End Day]",
    "expanded_text": "The daily routine of a project manager starts with checking Slack, followed by updating tasks in Notion. A team standup occurs at 10 AM, leading into a block of deep focused work until lunch. Afternoons are dedicated to client calls, often interrupted by email management. The day concludes with planning for the next day. The flow highlights both structured activities and common distractions.",
    "metadata": {
      "domain": "productivity",
      "complexity": "simple",
      "graph_features": ["daily workflow", "sequential routine", "distraction points"]
    }
  },
  {
    "input_text": "The backend architecture for our SaaS platform consists of a React frontend talking to a Node.js API, which connects to PostgreSQL for data, Redis for caching, and S3 for file storage. Authentication flows through Auth0.",
    "mermaid": "flowchart TD\n    User[User] --> Frontend[React Frontend]\n    Frontend --> API[Node.js API Gateway]\n    API --> Auth[Auth0 Authentication]\n    API --> Postgres[(PostgreSQL Database)]\n    API --> Redis[(Redis Cache)]\n    API --> S3[(AWS S3 Storage)]\n    Postgres --> API\n    Redis --> API\n    S3 --> API",
    "expanded_text": "Users interact with the React frontend, which communicates with the central Node.js API layer. All requests first pass through Auth0 for authentication. The API then interacts with PostgreSQL for persistent data, Redis for high-speed caching, and AWS S3 for file storage. This decoupled architecture ensures scalability, security, and performance.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["system architecture", "dependency graph", "data flow"]
    }
  },
  {
    "input_text": "Sarah has been feeling overwhelmed at work lately. She wants better work-life balance but fears asking for a raise or reduced hours will make her seem uncommitted. Meanwhile, her boss thinks she's doing great and has no idea about her burnout.",
    "mermaid": "mindmap\n  root((Work Burnout))\n    Sarah\n      Feelings\n        Overwhelmed\n        Anxious about asking\n      Goals\n        Better balance\n        Raise or flexibility\n    Boss\n      Perception\n        High performer\n        No awareness of issues\n    Barriers\n      Fear of judgment\n      Lack of open communication\n    Potential Path\n      Schedule honest conversation\n      Propose solutions",
    "expanded_text": "This mindmap explores Sarah's burnout situation. She feels overwhelmed and anxious about requesting changes, worrying it will signal lack of commitment. Her boss views her as a strong performer and remains unaware of her struggles. Key barriers include fear and poor communication. A constructive path forward involves scheduling an open discussion and collaboratively proposing solutions for better work-life balance.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "simple",
      "graph_features": ["mindmap", "emotional analysis", "perspective contrast"]
    }
  },
  {
    "input_text": "International package shipping from China to Europe: seller packs item, books courier, clears Chinese export customs, ocean or air transit, EU import customs clearance, final delivery to customer, with tracking updates at each stage.",
    "mermaid": "flowchart TD\n    Pack[Item Packed by Seller] --> Book[Book International Courier]\n    Book --> Export[Chinese Export Customs]\n    Export --> Transit[Ocean or Air Transit]\n    Transit --> Import[EU Import Customs]\n    Import --> Delivery[Final Mile Delivery]\n    Delivery --> Tracking[Customer Notifications]",
    "expanded_text": "The shipping process starts with the seller carefully packing the item and booking a courier. Export customs in China must be cleared before the package enters ocean or air transit. Upon arrival in Europe, import customs clearance occurs, which can involve duties and inspections. Finally, the package reaches the customer via local delivery services. Customers receive tracking updates throughout the entire journey.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["sequential international workflow", "regulatory checkpoints", "tracking"]
    }
  },
  {
    "input_text": "When our payment processor returns a declined transaction, we first retry once after 30 seconds. If it fails again, we notify the user, save the cart, and suggest alternative payment methods like switching cards or using PayPal.",
    "mermaid": "flowchart TD\n    Decline[Payment Declined] --> Retry[Retry After 30s]\n    Retry --> Success{Approved?}\n    Success -->|Yes| Complete[Complete Order]\n    Success -->|No| Notify[Notify User]\n    Notify --> Save[Save Cart]\n    Save --> Suggest[Suggest Alternatives]\n    Suggest --> User[User Chooses New Method]",
    "expanded_text": "On a declined payment, the system automatically retries once after a 30-second delay. If the second attempt also fails, the user receives a polite notification explaining the issue. Their shopping cart is saved, and they are guided toward alternative payment options such as trying a different card or using PayPal. This graceful failure handling improves conversion rates.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["retry logic", "error handling", "user recovery path"]
    }
  },
  {
    "input_text": "Building a minimum viable product involves validating the problem with 20 potential customers, creating a basic prototype, launching a landing page with waitlist, gathering feedback through interviews, iterating on core features, and only then developing the full version if validation metrics are met.",
    "mermaid": "flowchart TD\n    Idea[Initial Idea] --> Validate[Customer Problem Validation]\n    Validate --> Prototype[Build Basic Prototype]\n    Prototype --> Landing[Launch Landing Page + Waitlist]\n    Landing --> Interviews[Gather Feedback]\n    Interviews --> Metrics{Evaluate Metrics}\n    Metrics -->|Strong| Iterate[Iterate Core Features]\n    Metrics -->|Weak| Pivot[Reconsider Idea]\n    Iterate --> MVP[Develop Full MVP]",
    "expanded_text": "The lean startup approach to building an MVP starts with validating the problem through interviews with at least 20 potential customers. A basic prototype follows, accompanied by a landing page to collect waitlist signups. Real user feedback is gathered via interviews and analyzed against success metrics. Strong validation leads to iteration on core features before building the full minimum viable product. Weak signals prompt pivoting.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["validation loop", "decision gates", "iterative process", "startup methodology"]
    }
  },
  {
    "input_text": "An employee works remotely. In the morning, they check Slack for urgent messages. Then they review their calendar for meetings. If there is a meeting within the next hour, they prepare notes. If not, they start a deep work session (2 hours). During deep work, phone is on DND. After deep work, they check emails and respond to non-urgent ones. At 1 PM, lunch break. After lunch, they attend any scheduled meetings. At 5 PM, they write a daily summary and send to manager. If any critical issue arises during the day (server down, customer complaint), they pause everything and handle it first.",
    "mermaid": "mindmap\n  root((Remote Work Day))\n    Morning\n      Check Slack urgent\n      Review calendar\n        Meeting within 1h\n          Prepare notes\n        No meeting\n          Deep work 2h\n            Phone DND\n    Midday\n      Check emails\n      1PM Lunch\n    Afternoon\n      Attend meetings\n    Evening\n      5PM Daily summary to manager\n    Handled as needed\n      Critical issue\n        Pause everything\n        Resolve first",
    "expanded_text": "A typical remote work day starts in the morning. The employee first checks Slack for any urgent messages. Then they review their calendar for scheduled meetings. If a meeting is coming up within the next hour, they prepare notes for it. If no meeting is imminent, they start a 2-hour deep work session with their phone set to Do Not Disturb. After deep work, they check emails and respond to non-urgent correspondence. At 1 PM, they take a lunch break. In the afternoon, they attend any meetings that were scheduled. At 5 PM, they write a daily summary and send it to their manager. Throughout the day, if any critical issue arises (such as a server outage or a major customer complaint), they pause all other activities and handle the issue first before resuming the normal workflow.",
    "metadata": {
      "domain": "productivity",
      "complexity": "low",
      "graph_features": ["mindmap", "conditional branches", "priority interruption"]
    }
  },
  {
    "input_text": "A teacher grades a student's essay. First, check for plagiarism using software. If plagiarism > 30%, return to student with zero and a warning. If <= 30%, read for thesis clarity. If thesis is unclear, ask student to revise and resubmit within 3 days. If clear, evaluate grammar — deduct 1 point per error up to 10 points. Then evaluate argument strength: weak (70%), moderate (85%), strong (100%). Final grade = (grammar_score * 0.4 + argument_score * 0.6). If final grade >= 90%, offer to submit to writing competition. If < 60%, require student to attend a writing workshop. Grade is recorded in LMS and email sent to student.",
    "mermaid": "graph TD\n    A[Student submits essay] --> B[Check plagiarism]\n    B --> C{Plagiarism > 30%?}\n    C -->|Yes| D[Return: zero, warning]\n    C -->|No| E[Check thesis clarity]\n    E --> F{Thesis clear?}\n    F -->|No| G[Ask to revise and resubmit within 3 days]\n    G --> A\n    F -->|Yes| H[Evaluate grammar: -1 per error, max -10]\n    H --> I[Evaluate argument strength]\n    I --> I1[Weak: 70%]\n    I --> I2[Moderate: 85%]\n    I --> I3[Strong: 100%]\n    I1 --> J[Calculate final grade: grammar*0.4 + argument*0.6]\n    I2 --> J\n    I3 --> J\n    J --> K{Final grade >= 90%?}\n    K -->|Yes| L[Offer to submit to writing competition]\n    K -->|No| M{Final grade < 60%?}\n    M -->|Yes| N[Require writing workshop]\n    M -->|No| O[Record grade in LMS]\n    L --> O\n    N --> O\n    O --> P[Email student]",
    "expanded_text": "The essay grading process begins when a student submits an essay. The teacher first checks for plagiarism using detection software. If plagiarism exceeds 30%, the essay is returned with a zero grade and a warning. If plagiarism is 30% or less, the teacher reads for thesis clarity. If the thesis is unclear, the teacher asks the student to revise and resubmit within 3 days, looping back to the start. If the thesis is clear, the teacher evaluates grammar, deducting 1 point per error up to a maximum of 10 points. Next, the argument strength is evaluated: weak (70% score), moderate (85%), or strong (100%). The final grade is calculated as 40% of the grammar score plus 60% of the argument score. If the final grade is 90% or higher, the student is offered the chance to submit the essay to a writing competition. If the final grade is below 60%, the student is required to attend a writing workshop. Otherwise, the grade is simply recorded. The final grade is recorded in the Learning Management System (LMS), and an email is sent to the student.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["sequential flows", "conditional branches", "loop (revision)", "weighted scoring"]
    }
  },
  {
    "input_text": "A user forgets their password. They click 'Forgot password' on the login page. System asks for email. System checks if email exists. If not, show 'No account found'. If exists, generate a 6-digit reset code and send via email. User has 10 minutes to enter code. If code incorrect after 3 attempts, lock reset for 1 hour. If correct, system asks for new password. Password must be at least 8 chars, include uppercase, lowercase, number. If valid, update password and redirect to login. If invalid, show requirements and retry.",
    "mermaid": "stateDiagram-v2\n    [*] --> ForgotClick\n    ForgotClick --> EmailEntry: Click 'Forgot password'\n    EmailEntry --> EmailCheck: Submit email\n    EmailCheck --> NoAccount: Email not found\n    NoAccount --> EmailEntry: Show 'No account found'\n    EmailCheck --> CodeSend: Email exists\n    CodeSend --> CodeEntry: Send 6-digit code via email\n    CodeEntry --> CodeValidate: Enter code\n    CodeValidate --> CodeInvalid: Incorrect\n    CodeInvalid --> AttemptCheck: Increment attempt\n    AttemptCheck --> CodeEntry: Attempts < 3\n    AttemptCheck --> Locked: Attempts >= 3\n    Locked --> [*]: Lock reset for 1h\n    CodeValidate --> NewPassword: Code correct\n    NewPassword --> ValidatePassword: Enter new password\n    ValidatePassword --> PasswordInvalid: Fails requirements\n    PasswordInvalid --> NewPassword: Show requirements\n    ValidatePassword --> PasswordSuccess: Valid\n    PasswordSuccess --> LoginRedirect: Update password\n    LoginRedirect --> [*]",
    "expanded_text": "The password reset flow begins when a user clicks 'Forgot password' on the login page. The system asks for the user's email address. After submission, the system checks if the email exists in the database. If not, it shows 'No account found' and prompts the user to enter the email again. If the email exists, the system generates a 6-digit reset code and sends it via email. The user has 10 minutes to enter the code. If the code is entered incorrectly, the system increments an attempt counter. After three incorrect attempts, the reset process is locked for one hour. If the code is correct, the system asks the user to enter a new password. The password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number. If the password meets the requirements, it is updated and the user is redirected to the login page. If the password does not meet requirements, the system shows the rules and asks the user to try again.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["state diagram", "conditional branches", "retry limits", "timeout"]
    }
  },
  {
    "input_text": "An investor wants to assess a stock for purchase. They check the P/E ratio. If P/E < 15, consider undervalued. If P/E between 15 and 25, fairly valued. If P/E > 25, overvalued. Then check debt-to-equity ratio. If > 0.6, high risk — reject unless P/E < 10 (deep value). Then check revenue growth over 5 years. If growth > 10% annually, strong buy. If growth between 2-10%, hold if dividend yield > 3%. If growth < 2%, sell or avoid. Finally, check analyst ratings. If majority 'buy' and all other checks pass, execute purchase. If not, add to watchlist.",
    "mermaid": "graph TD\n    A[Start stock assessment] --> B[Check P/E ratio]\n    B --> C{P/E < 15?}\n    C -->|Yes| D[Undervalued]\n    C -->|No| E{P/E 15-25?}\n    E -->|Yes| F[Fairly valued]\n    E -->|No| G[Overvalued (P/E > 25)]\n    D --> H[Check debt-to-equity]\n    F --> H\n    G --> H\n    H --> I{Debt/Equity > 0.6?}\n    I -->|Yes| J{Is P/E < 10? (deep value)}\n    J -->|Yes| K[Accept high risk]\n    J -->|No| L[Reject: too risky]\n    I -->|No| M[Debt acceptable]\n    K --> N[Check 5-year revenue growth]\n    M --> N\n    L --> O[Stop - do not buy]\n    N --> P{Growth > 10%?}\n    P -->|Yes| Q[Strong buy]\n    P -->|No| R{Growth 2-10%?}\n    R -->|Yes| S{Dividend yield > 3%?}\n    S -->|Yes| T[Buy/hold]\n    S -->|No| U[Watchlist]\n    R -->|No| V[Growth < 2%: sell/avoid]\n    Q --> W[Check analyst ratings]\n    T --> W\n    U --> W\n    V --> W\n    W --> X{Mostly 'buy'?}\n    X -->|Yes| Y[Execute purchase]\n    X -->|No| Z[Add to watchlist]",
    "expanded_text": "The stock assessment process starts by checking the price-to-earnings (P/E) ratio. If P/E is less than 15, the stock is considered undervalued. If P/E is between 15 and 25, it is fairly valued. If P/E exceeds 25, it is overvalued. Next, the debt-to-equity (D/E) ratio is examined. If D/E is above 0.6, the stock is high risk, but an exception is made if P/E is below 10 (deep value case) — then high risk is accepted; otherwise, reject the stock. If D/E is 0.6 or below, debt is considered acceptable. Then the 5-year revenue growth is evaluated. If annual growth exceeds 10%, it is a strong buy. If growth is between 2% and 10%, check the dividend yield: if above 3%, buy or hold; if not, add to watchlist. If growth is below 2%, sell or avoid. Finally, analyst ratings are checked. If the majority of analysts rate the stock as 'buy' and all previous checks passed, execute the purchase. Otherwise, add the stock to a watchlist for future monitoring.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["conditional branches", "hierarchical rules", "exception path"]
    }
  },
  {
    "input_text": "A customer wants to book a flight. They open the airline app. They enter departure city, destination, and date. System shows available flights. User selects a flight. System checks seat availability. If no seats, suggest alternate flights. If seats available, user proceeds to passenger details. After entering details, system holds the booking for 15 minutes. User enters payment. If payment succeeds, system issues e-ticket and sends confirmation email. If payment fails, user can retry up to 2 times. After 2 failures, release hold. If user abandons before payment, booking is auto-canceled after 15 minutes.",
    "mermaid": "sequenceDiagram\n    participant U as User\n    participant A as App\n    participant B as Booking System\n    participant P as Payment Gateway\n    U->>A: Enter departure, destination, date\n    A->>B: Query available flights\n    B-->>A: List of flights\n    A-->>U: Show flights\n    U->>A: Select flight\n    A->>B: Check seat availability\n    alt No seats\n        B-->>A: Unavailable\n        A-->>U: Suggest alternate flights\n    else Seats available\n        B-->>A: Available\n        A->>U: Request passenger details\n        U->>A: Enter details\n        A->>B: Hold booking (15 min)\n        B-->>A: Hold confirmed\n        A->>U: Proceed to payment\n        U->>A: Enter payment\n        A->>P: Charge\n        alt Payment success\n            P-->>A: Success\n            A->>B: Confirm booking\n            B-->>A: E-ticket issued\n            A->>U: Send confirmation email\n        else Payment fails\n            P-->>A: Failure\n            alt Retries < 2\n                A->>U: Retry payment\n            else 2 failures\n                A->>B: Release hold\n                A->>U: Booking canceled\n            end\n        end\n    end\n    Note over U,A: If user abandons or times out >15 min\n    A->>B: Auto-cancel hold",
    "expanded_text": "The flight booking process begins when a user opens the airline app and enters departure city, destination, and date. The system queries available flights and shows them to the user. The user selects a flight. The system checks seat availability. If no seats are available, the system suggests alternate flights. If seats are available, the user proceeds to enter passenger details. After details are entered, the booking system holds the booking for 15 minutes. The user then enters payment information. The app sends the charge request to the payment gateway. If payment succeeds, the booking system confirms the booking, issues an e-ticket, and sends a confirmation email to the user. If payment fails, the user is allowed to retry up to two times. After two failures, the hold is released and the booking is canceled. Additionally, if the user abandons the process before completing payment and the 15-minute hold expires, the system automatically cancels the hold.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["sequence diagram", "conditional branches", "retry logic", "timeout"]
    }
  },
  {
    "input_text": "A smart home automation routine for 'Good Night'. When triggered (voice or app), it first locks all doors. Then checks if any window is open. If windows are open, sends notification to user and waits 30 seconds. If user doesn't close windows, proceeds anyway. Then turns off all lights except bedroom nightlight. Then sets thermostat to 68°F. Then checks if garage door is closed. If open, closes it. Then arms the security system in 'Stay' mode. Finally, plays a soft chime on bedroom speaker and sets alarm for 7 AM. If any action fails (e.g., door lock jammed), retry once, then log error and continue.",
    "mermaid": "graph TD\n    A[Trigger 'Good Night'] --> B[Lock all doors]\n    B --> C{Any window open?}\n    C -->|Yes| D[Send notification]\n    D --> E[Wait 30 seconds]\n    E --> F[Turn off all lights except bedroom nightlight]\n    C -->|No| F\n    F --> G[Set thermostat to 68°F]\n    G --> H{Garage door open?}\n    H -->|Yes| I[Close garage door]\n    H -->|No| J[Arm security system: Stay mode]\n    I --> J\n    J --> K[Play soft chime on bedroom speaker]\n    K --> L[Set alarm for 7 AM]\n    B -.->|Fail| M[Retry once]\n    M -.->|Still fail| N[Log error, continue]\n    N --> F",
    "expanded_text": "The 'Good Night' smart home routine is triggered either by voice command or through an app. First, the system attempts to lock all doors. If any door lock fails (e.g., jammed), it retries once; if still fails, it logs an error but continues the routine. Next, it checks if any window is open. If windows are open, it sends a notification to the user's phone and waits 30 seconds for the user to take action; regardless of whether the windows are closed, the routine then proceeds. The system turns off all lights except the bedroom nightlight. It then sets the thermostat to 68 degrees Fahrenheit. Next, it checks if the garage door is open; if so, it closes it. Then the security system is armed in 'Stay' mode. Finally, a soft chime is played on the bedroom speaker, and the morning alarm is set for 7 AM.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "retry with logging", "notification"]
    }
  },
  {
    "input_text": "A social media post goes viral. The sequence: User posts a controversial take. Within 10 minutes, first reply appears (supporter). Then at 30 minutes, a hater replies. At 1 hour, a neutral comment asks for clarification. The original poster responds emotionally at 2 hours. This triggers a reply chain. By 6 hours, the post has 5000 likes and 2000 shares. At 12 hours, a media outlet writes an article referencing the post. At 24 hours, the original poster issues an apology or doubles down. If apology, likes increase further. If doubling down, the post gets ratioed. After 48 hours, engagement declines. The platform's algorithm then deprioritizes the post.",
    "mermaid": "graph LR\n    A[User posts controversial take] --> B[10 min: Supporter replies]\n    B --> C[30 min: Hater replies]\n    C --> D[1 hour: Neutral asks clarification]\n    D --> E[2 hours: OP responds emotionally]\n    E --> F[Reply chain accelerates]\n    F --> G[6 hours: 5000 likes, 2000 shares]\n    G --> H[12 hours: Media outlet writes article]\n    H --> I[24 hours: OP decision]\n    I --> J{OP apology?}\n    J -->|Apology| K[Likes increase further]\n    J -->|Doubles down| L[Post gets ratioed]\n    K --> M[48 hours: Engagement declines]\n    L --> M\n    M --> N[Algorithm deprioritizes post]\n    style I fill:#f96\n    style J fill:#ff9",
    "expanded_text": "The timeline of a viral social media post begins when a user posts a controversial take. Within 10 minutes, a supporter replies. At 30 minutes, a hater replies. At the 1-hour mark, a neutral commenter asks for clarification. At 2 hours, the original poster responds emotionally, which triggers a rapid reply chain. By 6 hours, the post has accumulated 5,000 likes and 2,000 shares. At 12 hours, a media outlet writes an article that references the post. At 24 hours, the original poster makes a decision: either issue an apology or double down on the original statement. If they apologize, likes increase further. If they double down, the post gets \"ratioed\" (more replies than likes, indicating negative sentiment). After 48 hours, overall engagement declines, and the platform's algorithm deprioritizes the post, reducing its visibility.",
    "metadata": {
      "domain": "social interactions",
      "complexity": "medium",
      "graph_features": ["timeline (event chain)", "conditional branch", "algorithm feedback"]
    }
  },
  {
    "input_text": "A company's database schema for an e-commerce site. We have Customers (id, name, email). Orders (id, customer_id, order_date, total). Products (id, name, price, stock). Order_Items (order_id, product_id, quantity). A customer can have many orders. An order can have many order_items. A product can appear in many order_items. The system also tracks Payments (id, order_id, amount, status). Status can be 'pending', 'completed', 'failed'. Each order has exactly one payment. We also store Reviews (id, customer_id, product_id, rating, comment) — a customer can write many reviews, a product can have many reviews.",
    "mermaid": "erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    CUSTOMER ||--o{ REVIEW : writes\n    ORDER ||--|{ ORDER_ITEM : contains\n    ORDER ||--|| PAYMENT : has\n    ORDER_ITEM }o--|| PRODUCT : references\n    PRODUCT ||--o{ REVIEW : receives\n    \n    CUSTOMER {\n        int id PK\n        string name\n        string email\n    }\n    ORDER {\n        int id PK\n        int customer_id FK\n        date order_date\n        decimal total\n    }\n    ORDER_ITEM {\n        int order_id FK\n        int product_id FK\n        int quantity\n    }\n    PRODUCT {\n        int id PK\n        string name\n        decimal price\n        int stock\n    }\n    PAYMENT {\n        int id PK\n        int order_id FK\n        decimal amount\n        enum status\n    }\n    REVIEW {\n        int id PK\n        int customer_id FK\n        int product_id FK\n        int rating\n        text comment\n    }",
    "expanded_text": "The e-commerce database schema includes five main entities. The Customer entity has attributes id (primary key), name, and email. A customer can place many orders (one-to-many relationship), and a customer can write many reviews (also one-to-many). The Order entity has id (PK), customer_id (foreign key referencing Customer), order_date, and total. Each order can contain many order items (one-to-many), and each order has exactly one payment (one-to-one). The Order_Item entity is a junction table with composite foreign keys order_id and product_id, plus quantity. The Product entity has id (PK), name, price, and stock. A product can appear in many order items (many-to-many via Order_Item), and a product can receive many reviews. The Payment entity has id (PK), order_id (FK), amount, and status, which can be 'pending', 'completed', or 'failed'. The Review entity has id (PK), customer_id (FK), product_id (FK), rating, and comment.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["ER diagram", "hierarchy", "relationships", "cardinality"]
    }
  },
  {
    "input_text": "A person wakes up with a headache. They decide to troubleshoot: first, drink a glass of water (dehydration cause). If headache subsides within 30 minutes, done. If not, check if they slept well last night. If slept < 6 hours, take a 20-minute power nap. If still persists, consider caffeine withdrawal — drink coffee. If headache continues after coffee, take ibuprofen. If after 2 hours ibuprofen doesn't work, check for light sensitivity. If yes, rest in dark room for 1 hour. If still no relief, call doctor. If headache is severe with vomiting and confusion, skip all steps and go to ER immediately.",
    "mermaid": "stateDiagram-v2\n    [*] --> Headache\n    Headache --> Water: Drink water\n    Water --> CheckWater: Wait 30 min\n    CheckWater --> Done: Subsided\n    CheckWater --> SleepCheck: Still present\n    SleepCheck --> ShortSleep: Slept < 6h\n    ShortSleep --> Nap: 20 min nap\n    Nap --> AfterNap: Check\n    AfterNap --> Caffeine: Still present\n    SleepCheck --> Caffeine: Slept >= 6h\n    Caffeine --> DrinkCoffee: Drink coffee\n    DrinkCoffee --> AfterCoffee: Wait 30 min\n    AfterCoffee --> Ibuprofen: Still present\n    Ibuprofen --> AfterIbu: Wait 2h\n    AfterIbu --> LightCheck: No relief\n    LightCheck --> DarkRoom: Light sensitivity yes\n    DarkRoom --> AfterDark: 1h later\n    AfterDark --> CallDoctor: Still present\n    CallDoctor --> [*]\n    AfterIbu --> Done: Relief\n    AfterCoffee --> Done: Relief\n    AfterNap --> Done: Relief\n    Water --> Done: Relief\n    Headache --> SevereCheck: Severe + vomiting + confusion\n    SevereCheck --> ER: Go to ER immediately\n    ER --> [*]\n    Done --> [*]",
    "expanded_text": "A person wakes up with a headache and follows a troubleshooting process. First, they drink a glass of water in case of dehydration. If the headache subsides within 30 minutes, they are done. If not, they check how much they slept last night. If they slept less than 6 hours, they take a 20-minute power nap. If the headache still persists after the nap, or if they slept 6 hours or more initially, they consider caffeine withdrawal and drink a cup of coffee. If the headache continues after coffee, they take ibuprofen. If after 2 hours the ibuprofen has not worked, they check for light sensitivity. If light sensitivity is present, they rest in a dark room for 1 hour. If still no relief, they call a doctor. However, if at any point the headache becomes severe and is accompanied by vomiting and confusion, they skip all previous steps and go to the emergency room immediately.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["state transitions", "sequential flows", "conditional branches", "escalation path"]
    }
  },
  {
    "input_text": "To bake chocolate chip cookies: Preheat oven to 375°F. Mix dry ingredients (flour, baking soda, salt). In another bowl, cream butter and sugars. Add eggs and vanilla. Gradually add dry mix. Stir in chocolate chips. Drop dough onto baking sheet. Bake for 10-12 minutes. While baking, prepare cooling rack. When cookies are done (edges golden), remove from oven. Let cool on sheet for 2 minutes, then transfer to rack. If cookies are undercooked (too soft), return to oven for 2 more minutes. If burned, discard and start over. Finally, serve with milk.",
    "mermaid": "graph TD\n    A[Preheat oven to 375°F] --> B[Mix dry: flour, baking soda, salt]\n    B --> C[Cream butter and sugars]\n    C --> D[Add eggs and vanilla]\n    D --> E[Gradually add dry mix]\n    E --> F[Stir in chocolate chips]\n    F --> G[Drop dough onto baking sheet]\n    G --> H[Bake for 10-12 minutes]\n    H --> I[Prepare cooling rack (parallel)]\n    I --> J{Check cookies: edges golden?}\n    J -->|Yes| K[Remove from oven]\n    J -->|No, undercooked| L[Return to oven for 2 more minutes]\n    L --> J\n    J -->|Burned| M[Discard and start over]\n    M --> A\n    K --> N[Cool on sheet 2 min]\n    N --> O[Transfer to rack]\n    O --> P[Serve with milk]",
    "expanded_text": "The chocolate chip cookie baking process starts by preheating the oven to 375°F. In one bowl, mix the dry ingredients: flour, baking soda, and salt. In a separate bowl, cream together butter and sugars until smooth. Add eggs and vanilla, then gradually mix in the dry ingredients. Stir in chocolate chips. Drop spoonfuls of dough onto a baking sheet. Place the sheet in the oven and bake for 10 to 12 minutes. While the cookies are baking, prepare a cooling rack. After baking, check the cookies: if the edges are golden, remove them from the oven. If the cookies are undercooked (too soft), return them to the oven for 2 more minutes and recheck. If the cookies are burned, discard them and start over from preheating. Once done, let the cookies cool on the baking sheet for 2 minutes, then transfer them to a cooling rack. Finally, serve the cookies with milk.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "loop (undercooked)", "parallel task"]
    }
  },
  {
    "input_text": "How does the expense reimbursement process work at our company? Employees submit receipts through the portal, managers approve within 48 hours, finance reviews for policy compliance, and then payments are processed every Friday.",
    "mermaid": "flowchart TD\n    Submit[Employee Submits Receipts] --> Manager[Manager Approval]\n    Manager --> Time{Within 48hrs?}\n    Time -->|Yes| Finance[Finance Policy Review]\n    Time -->|No| Reminder[Send Reminder]\n    Reminder --> Manager\n    Finance --> Compliant{Compliant?}\n    Compliant -->|Yes| Process[Process Payment]\n    Compliant -->|No| Reject[Reject & Notify]\n    Process --> Friday[Pay on Friday]",
    "expanded_text": "Employees begin by submitting expense receipts via the company portal. The direct manager must review and approve within 48 hours. Approved claims move to finance for policy compliance verification. Compliant expenses are queued for payment every Friday. Non-compliant ones are rejected with notification. Reminders are sent if managers delay approval.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["approval workflow", "time conditions", "escalation"]
    }
  },
  {
    "input_text": "Tell me what happens in a typical Dungeons & Dragons combat round: players roll initiative, then take turns acting — moving, attacking, casting spells, or using items. The dungeon master controls monsters that act on their own turns. Combat ends when one side is defeated.",
    "mermaid": "flowchart TD\n    Start[Combat Begins] --> Initiative[Roll Initiative]\n    Initiative --> Order[Determine Turn Order]\n    Order --> PlayerTurn[Player 1 Turn]\n    PlayerTurn --> Action{Move / Attack / Spell / Item}\n    Action --> NextPlayer[Next Player]\n    NextPlayer --> DM[DM Controls Monsters]\n    DM --> Check{All Turns Done?}\n    Check -->|No| PlayerTurn\n    Check -->|Yes| RoundEnd[End of Round]\n    RoundEnd --> Continue{Combat Over?}\n    Continue -->|No| Order\n    Continue -->|Yes| Victory[Resolve Outcome]",
    "expanded_text": "Combat starts with all participants rolling initiative to establish turn order. Players and the Dungeon Master then take sequential turns. On their turn, a player can move, attack, cast spells, or use items. The DM controls enemy monsters on their turns. Each full cycle completes one round. This continues until one side achieves victory or combat resolves.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["turn-based loop", "sequential actions", "conditional end"]
    }
  },
  {
    "input_text": "Our microservices architecture uses Kubernetes for orchestration. The API gateway routes requests to different services. User service handles authentication, payment service processes transactions, and notification service sends emails. All services communicate via Kafka events.",
    "mermaid": "flowchart TD\n    Client[Client Request] --> Gateway[API Gateway]\n    Gateway --> User[User Service]\n    Gateway --> Payment[Payment Service]\n    Gateway --> Notification[Notification Service]\n    User --> Kafka[(Kafka Event Bus)]\n    Payment --> Kafka\n    Notification --> Kafka\n    Kafka --> User\n    Kafka --> Payment\n    Kafka --> Notification",
    "expanded_text": "External clients send requests through the API gateway, which intelligently routes them to specialized microservices. The User service manages authentication and profiles, Payment service handles transactions, and Notification service sends alerts. Services communicate asynchronously through a Kafka event bus, enabling loose coupling and resilience in the Kubernetes-orchestrated environment.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["system architecture", "event-driven", "dependency graph"]
    }
  },
  {
    "input_text": "Why is my 5-year-old son suddenly afraid of the dark after watching a cartoon with a monster? He now insists on leaving the hallway light on and wants me to check under the bed every night.",
    "mermaid": "mindmap\n  root((Fear of Dark))\n    Trigger\n      Cartoon Monster\n    Emotional Response\n      Anxiety at bedtime\n      Safety seeking\n    Behaviors\n      Hallway light on\n      Bed check requests\n    Parental Role\n      Reassurance\n      Gradual exposure\n    Long-term Goal\n      Regain confidence\n      Healthy sleep routine",
    "expanded_text": "The child's sudden fear of the dark stems from a recent cartoon featuring a monster. This has created bedtime anxiety, manifesting in requests for the hallway light to stay on and repeated checks under the bed. The parent plays a key role in providing reassurance while planning gradual exposure techniques to help the child rebuild confidence and restore a healthy sleep routine.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["mindmap", "causal relationship", "emotional hierarchy"]
    }
  },
  {
    "input_text": "What are the steps involved when a patient reports chest pain in the emergency room?",
    "mermaid": "flowchart TD\n    Arrival[Patient Arrives] --> Triage[Rapid Triage]\n    Triage --> ECG[ECG within 10 mins]\n    ECG --> Blood[Blood Tests: Troponin]\n    Blood --> Assess{Heart Attack Suspected?}\n    Assess -->|Yes| Cath[Emergency Catheterization]\n    Assess -->|No| Further[Further Diagnosis]\n    Cath --> Stabilize[Stabilize Patient]\n    Further --> Monitor[Observation & Monitoring]",
    "expanded_text": "Upon arrival with chest pain, the patient undergoes immediate triage. An ECG is performed within 10 minutes, followed by blood tests for cardiac markers like troponin. Based on results, if a heart attack is suspected, the patient is rushed for emergency catheterization. Otherwise, further diagnostic tests and monitoring are conducted. The priority is rapid assessment and stabilization.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["emergency protocol", "time-critical decisions", "branching diagnostics"]
    }
  },
  {
    "input_text": "Launch campaign for the new fitness app: teaser posts on Instagram for 2 weeks, influencer partnerships, app store optimization, paid ads starting on launch day, email sequence to waitlist, and community building in Discord.",
    "mermaid": "gantt\n    title Fitness App Launch Campaign\n    dateFormat  YYYY-MM-DD\n    section Pre-Launch\n    Teaser Content :a1, 2026-05-01, 14d\n    Influencer Outreach : 10d\n    section Launch Day\n    App Store Launch : 2026-05-15, 1d\n    Paid Ads Start : 2026-05-15, 30d\n    section Post-Launch\n    Email Nurture :after a1, 21d\n    Discord Community : 2026-05-15, 60d",
    "expanded_text": "The marketing campaign begins with two weeks of Instagram teaser content and influencer outreach. On launch day, the app goes live on stores, paid advertising starts, and the email sequence activates for the waitlist. Ongoing efforts focus on building an engaged community in Discord. The timeline ensures momentum before, during, and after the official launch.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["gantt chart", "timeline", "parallel campaigns"]
    }
  },
  {
    "input_text": "How should our support team handle a customer reporting a security breach on their account?",
    "mermaid": "stateDiagram-v2\n    [*] --> Reported\n    Reported --> Verify[Verify Identity]\n    Verify --> Lock[Lock Account]\n    Lock --> Investigate[Security Investigation]\n    Investigate --> Breach{Confirmed Breach?}\n    Breach -->|Yes| Notify[Notify Customer + Authorities]\n    Breach -->|No| Unlock[Restore Access]\n    Notify --> Monitor[Monitor for 30 days]\n    Monitor --> [*]",
    "expanded_text": "When a security breach is reported, the support team first verifies the customer's identity before locking the account to prevent further damage. A thorough investigation follows. If a breach is confirmed, the customer and relevant authorities are notified, and the account is monitored for 30 days. If no breach occurred, access is restored immediately.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["state diagram", "incident response", "conditional actions"]
    }
  },
  {
    "input_text": "The hiring process for senior engineers includes resume screening, technical phone screen, take-home assignment, virtual onsite with 4 interviews, team fit discussion, and finally offer negotiation.",
    "mermaid": "flowchart TD\n    Resume[Resume Screening] --> Phone[Technical Phone Screen]\n    Phone --> Takehome[Take-home Assignment]\n    Takehome --> Onsite[Virtual Onsite - 4 Rounds]\n    Onsite --> Team[Team Fit Discussion]\n    Team --> Decision{Hiring Decision}\n    Decision -->|Yes| Offer[Offer Negotiation]\n    Decision -->|No| Reject[ Polite Rejection]",
    "expanded_text": "Senior engineer hiring starts with resume screening, followed by a technical phone screen. Candidates who pass receive a take-home assignment. Successful completers advance to a comprehensive virtual onsite consisting of four interviews. A team fit discussion occurs before a final hiring decision. Approved candidates enter offer negotiation, while others receive polite rejection.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["multi-stage process", "sequential filtering", "decision gate"]
    }
  },
  {
    "input_text": "My friend keeps borrowing money and forgetting to pay it back. Last month it was $50 for groceries, now he's asking for $200 for rent. I want to help but I'm starting to feel taken advantage of.",
    "mermaid": "mindmap\n  root((Money Borrowing Pattern))\n    Friend\n      Requests\n        $50 groceries\n        $200 rent\n      Behavior\n        Forgets repayment\n    Self\n      Emotions\n        Desire to help\n        Feeling used\n      Dilemma\n        Set boundaries\n        Risk friendship\n    Options\n      Polite refusal\n      Loan with agreement\n      Offer non-monetary help",
    "expanded_text": "The situation reveals a recurring pattern where the friend borrows money for various needs but consistently forgets repayment. The individual feels conflicted between wanting to be supportive and sensing they are being taken advantage of. The mindmap explores emotional tension and presents options such as setting clear boundaries, creating formal agreements, or offering alternative forms of help.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "simple",
      "graph_features": ["mindmap", "interpersonal conflict", "decision options"]
    }
  },
  {
    "input_text": "Explain the full cycle of how a bill becomes law in the US Congress, including committee review, amendments, voting in both chambers, and the possibility of a presidential veto.",
    "mermaid": "flowchart TD\n    Introduce[Bill Introduced] --> Committee[Committee Review]\n    Committee --> Markup[Amendments & Markup]\n    Markup --> Floor[Floor Debate & Vote]\n    Floor --> Chamber1[Pass House or Senate]\n    Chamber1 --> Chamber2[Other Chamber Review]\n    Chamber2 --> Conference{Conference Committee?}\n    Conference -->|Yes| Compromise[Reconcile Versions]\n    Conference -->|No| President[Send to President]\n    President --> Sign[Signed into Law]\n    President --> Veto[Veto]\n    Veto --> Override{2/3 Override?}\n    Override -->|Yes| Law[Becomes Law]\n    Override -->|No| Fail[Bill Fails]",
    "expanded_text": "A bill is first introduced in either the House or Senate and sent to the relevant committee for review and markup with possible amendments. It then reaches the floor for debate and voting. If passed in one chamber, it goes to the other. Differences are reconciled in a conference committee if needed. The final version goes to the President, who can sign it into law or veto it. Congress can override a veto with a two-thirds majority in both chambers.",
    "metadata": {
      "domain": "legal",
      "complexity": "high",
      "graph_features": ["legislative process", "complex branching", "approval loops"]
    }
  },
  {
    "input_text": "How does the refund process work for our online course platform? A student requests a refund within 14 days, the system checks completion percentage, if under 30% it auto-approves, otherwise it goes to the instructor for review, and finally finance processes the payment reversal.",
    "mermaid": "flowchart TD\n    Request[Refund Request] --> Check[Check 14-Day Window]\n    Check -->|Valid| Completion{Completion < 30%?}\n    Completion -->|Yes| Auto[Auto Approve]\n    Completion -->|No| Instructor[Instructor Review]\n    Instructor --> Approve{Approve?}\n    Approve -->|Yes| Finance[Process Reversal]\n    Approve -->|No| Deny[Deny Request]\n    Auto --> Finance",
    "expanded_text": "Students can request refunds within 14 days of purchase. The system first validates the timeframe. If course completion is below 30%, it auto-approves. Higher completion routes the request to the instructor for manual review. Approved refunds proceed to finance for payment reversal, while denials notify the student with reasons.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["conditional approval", "time-based rules", "escalation path"]
    }
  },
  {
    "input_text": "Describe the daily standup meeting flow in our agile team.",
    "mermaid": "flowchart TD\n    Start[Standup Begins] --> Yesterday[What I did yesterday]\n    Yesterday --> Today[What I will do today]\n    Today --> Blockers[Any blockers?]\n    Blockers --> Next[Next Person]\n    Next --> End{All Done?}\n    End -->|No| Yesterday\n    End -->|Yes| Action[Record Action Items]",
    "expanded_text": "The daily standup follows a consistent round-robin format. Each team member shares what they accomplished yesterday, what they plan to do today, and any blockers preventing progress. This continues until everyone has spoken. The meeting ends with recording any action items that emerged from the discussion.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "simple",
      "graph_features": ["sequential flow", "team ritual", "iterative rounds"]
    }
  },
  {
    "input_text": "A child learning to ride a bicycle typically starts with training wheels, practices balancing, then removes the wheels, experiences several falls, receives encouragement from parents, and eventually rides confidently. Each fall teaches them something new.",
    "mermaid": "flowchart TD\n    Start[Start with Training Wheels] --> Balance[Practice Balancing]\n    Balance --> Remove[Remove Training Wheels]\n    Remove --> Attempt[First Independent Attempts]\n    Attempt --> Fall[Fall & Get Up]\n    Fall --> Learn[Learn from Mistake]\n    Learn --> Encourage[Parental Encouragement]\n    Encourage --> Retry[Retry Riding]\n    Retry --> Confident{Riding Confidently?}\n    Confident -->|No| Attempt\n    Confident -->|Yes| Success[Independent Riding]",
    "expanded_text": "Learning to ride a bicycle is an iterative process. It begins with training wheels for safety and basic balancing practice. Once comfortable, the training wheels are removed for independent attempts. Falls are common and provide valuable learning opportunities. Parental encouragement helps maintain motivation. Through repeated retries, the child eventually achieves confident independent riding.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["learning loop", "feedback through failure", "encouragement cycle"]
    }
  },
  {
    "input_text": "What happens internally when a user clicks 'Buy Now' on our e-commerce site?",
    "mermaid": "sequenceDiagram\n    participant User\n    participant Frontend\n    participant CartService\n    participant Payment\n    participant Inventory\n    participant OrderService\n    User->>Frontend: Click Buy Now\n    Frontend->>CartService: Validate Cart\n    CartService->>Inventory: Check Stock\n    Inventory-->>CartService: Available\n    CartService->>Payment: Process Payment\n    Payment-->>CartService: Success\n    CartService->>OrderService: Create Order\n    OrderService-->>Frontend: Order Confirmed\n    Frontend-->>User: Thank You Page",
    "expanded_text": "When a user clicks 'Buy Now', the frontend validates the cart contents. The cart service checks real-time inventory availability. If stock is confirmed, payment processing is initiated. Upon successful payment, an order record is created in the order service. The user is then shown a confirmation page. All steps occur in rapid succession to provide a smooth checkout experience.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["sequence diagram", "transactional flow", "service orchestration"]
    }
  },
  {
    "input_text": "My anxiety before public speaking follows a pattern: I overprepare, still feel nervous, deliver the talk while rushing through slides, then feel relieved but overly critical of my performance afterwards.",
    "mermaid": "flowchart TD\n    Trigger[Upcoming Presentation] --> Overprepare[Over-preparation]\n    Overprepare --> Nervous[Persistent Anxiety]\n    Nervous --> Deliver[Deliver Talk - Rush]\n    Deliver --> Relief[Immediate Relief]\n    Relief --> SelfCritic[Harsh Self-Criticism]\n    SelfCritic --> Next[Anticipate Future Events]",
    "expanded_text": "The anxiety cycle starts with an upcoming presentation triggering intense over-preparation. Despite this, nervousness persists into the actual delivery, often causing the speaker to rush through slides. After finishing, there is a short period of relief followed by harsh self-criticism of the performance. This pattern influences preparation for future speaking events.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["emotional feedback loop", "personal pattern"]
    }
  },
  {
    "input_text": "Outline the AI training pipeline we use for our image recognition model.",
    "mermaid": "flowchart TD\n    Data[Collect Dataset] --> Augment[Data Augmentation]\n    Augment --> Split[Train/Val/Test Split]\n    Split --> Train[Model Training]\n    Train --> Eval[Evaluation on Validation Set]\n    Eval --> Metrics{Metrics Acceptable?}\n    Metrics -->|No| Hyper[Hyperparameter Tuning]\n    Hyper --> Train\n    Metrics -->|Yes| Test[Final Test Evaluation]\n    Test --> Deploy[Deploy Model]",
    "expanded_text": "The image recognition model training begins with dataset collection followed by augmentation techniques. Data is split into training, validation, and test sets. The model undergoes training with periodic evaluation on the validation set. If performance metrics are insufficient, hyperparameter tuning occurs and training loops back. Once acceptable, final evaluation on the test set is performed before deployment.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["ML pipeline", "feedback loop", "conditional iteration"]
    }
  },
  {
    "input_text": "The conflict between Marketing and Sales teams keeps happening. Marketing complains sales doesn't follow up on leads, while sales says the leads are poor quality. This has been going on for months and is hurting revenue.",
    "mermaid": "mindmap\n  root((Marketing-Sales Conflict))\n    Marketing\n      Complaint\n        Poor follow-up\n      Goal\n        More qualified leads used\n    Sales\n      Complaint\n        Low quality leads\n      Goal\n        Better lead scoring\n    Impact\n      Delayed revenue\n      Team frustration\n    Root Cause\n      Misaligned incentives\n      Lack of communication\n    Solution Path\n      Joint meetings\n      Shared KPIs\n      Lead feedback loop",
    "expanded_text": "This mindmap captures the ongoing tension between Marketing and Sales. Marketing feels their leads are ignored, while Sales finds the leads unqualified. The conflict has persisted for months and is negatively impacting revenue. Underlying issues include misaligned incentives and poor communication. A constructive path forward involves regular joint meetings, shared KPIs, and implementing a lead feedback system.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["mindmap", "interdepartmental conflict", "causal analysis"]
    }
  },
  {
    "input_text": "Walk me through how a package moves from our warehouse in Jakarta to a customer in Surabaya.",
    "mermaid": "flowchart TD\n    Pick[Order Picked from Warehouse] --> Pack[Pack & Label]\n    Pack --> Sort[Sortation Center]\n    Sort --> Transport[Ground Transport]\n    Transport --> Hub[Regional Hub]\n    Hub --> LastMile[Last Mile Delivery]\n    LastMile --> Delivered[Customer Delivery]\n    Delivered --> Update[Status Update to Customer]",
    "expanded_text": "The package journey starts with order picking in the Jakarta warehouse, followed by careful packing and labeling. It moves to a sortation center, then travels via ground transport to the Surabaya regional hub. From there, last-mile delivery partners handle final delivery to the customer. Real-time status updates keep the customer informed throughout the process.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["supply chain flow", "sequential stages", "geographic movement"]
    }
  },
  {
    "input_text": "What are the risks and mitigation steps if our main database goes down during peak hours?",
    "mermaid": "flowchart TD\n    Failure[Database Outage] --> Detect[Monitoring Alert]\n    Detect --> Failover[Switch to Read Replica]\n    Failover --> Notify[Notify Engineering]\n    Notify --> Diagnose[Root Cause Analysis]\n    Diagnose --> Restore[Restore Primary]\n    Restore --> Sync[Data Synchronization]\n    Sync --> Monitor[Performance Monitoring]\n    Monitor --> Normal[Back to Normal]",
    "expanded_text": "During a main database outage in peak hours, monitoring systems immediately detect the failure and trigger an alert. The system automatically fails over to a read replica to maintain service. Engineering is notified to diagnose the root cause while the replica handles traffic. Once fixed, the primary database is restored and data is synchronized. Continuous monitoring ensures stability before declaring normal operations.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["incident response", "failover logic", "recovery workflow"]
    }
  },
  {
    "input_text": "Planning a surprise birthday party for my best friend next month: I need to book the venue, invite friends secretly, arrange catering, get decorations, plan games, and make sure she doesn't find out until the day.",
    "mermaid": "flowchart TD\n    Idea[Decide on Surprise Party] --> Venue[Book Venue]\n    Venue --> Invites[Secret Invitations]\n    Invites --> Catering[Arrange Catering]\n    Catering --> Decor[Buy Decorations]\n    Decor --> Games[Plan Activities]\n    Games --> Secrecy{Maintain Surprise?}\n    Secrecy -->|At Risk| Adjust[Adjust Plans]\n    Secrecy -->|Safe| Execute[Party Day Execution]",
    "expanded_text": "Organizing a surprise birthday party involves multiple coordinated tasks. First, the venue is booked, followed by sending secret invitations to friends. Catering and decorations are arranged while planning engaging games. Throughout the process, maintaining secrecy is critical. If there's a risk of the friend finding out, plans are adjusted. Everything culminates in successful execution on the party day.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["project planning", "secrecy condition", "parallel tasks"]
    }
  },
  {
    "input_text": "Describe our complete enterprise software release process from ideation to post-production monitoring. It involves multiple stakeholders, compliance checks, security audits, canary deployments, and rollback plans if metrics deteriorate after launch.",
    "mermaid": "flowchart TD\n    Ideation[Ideation & Requirements] --> Planning[Roadmap Planning]\n    Planning --> Design[System Design Review]\n    Design --> Dev[Development Sprints]\n    Dev --> CodeReview[Code Review + Static Analysis]\n    CodeReview --> Security[Security Audit & Pentest]\n    Security --> QA[QA Testing + Automation]\n    QA --> Compliance[Compliance & Legal Review]\n    Compliance --> Staging[Deploy to Staging]\n    Staging --> Canary[Canary Deployment 10%]\n    Canary --> Monitor[Monitor KPIs 24hrs]\n    Monitor --> Metrics{Metrics Healthy?}\n    Metrics -->|Yes| FullDeploy[Full Rollout]\n    Metrics -->|No| Rollback[Rollback to Previous Version]\n    FullDeploy --> PostMonitor[Post-Production Monitoring]\n    Rollback --> Fix[Fix Issues]\n    Fix --> Dev",
    "expanded_text": "The enterprise software release process is highly structured and risk-averse. It starts with ideation and detailed roadmap planning, followed by architecture design review. Development occurs in sprints with continuous code reviews and static analysis. Security audits and penetration testing are mandatory before QA. Compliance and legal reviews ensure regulatory adherence. The release moves to staging, then a cautious 10% canary deployment. After 24 hours of intensive KPI monitoring, the team decides between full rollout or immediate rollback. Post-production monitoring continues for ongoing stability.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["multi-stage gates", "conditional rollback", "parallel reviews", "deployment strategy"]
    }
  },
  {
    "input_text": "How does our autonomous AI research agent handle complex scientific literature review tasks when it encounters contradictory findings or knowledge gaps?",
    "mermaid": "flowchart TD\n    Query[Research Query] --> Search[Multi-Source Literature Search]\n    Search --> Extract[Extract Claims & Evidence]\n    Extract --> Analyze[Contradiction Detection]\n    Analyze --> Gap{Gaps or Contradictions?}\n    Gap -->|Yes| DeepDive[Deep Dive + Primary Sources]\n    Gap -->|No| Synthesize[Synthesize Findings]\n    DeepDive --> Validate[Cross-Validation]\n    Validate --> Confidence{Confidence Level}\n    Confidence -->|Low| Loop[Query Expansion & New Search]\n    Confidence -->|High| Report[Generate Structured Report]\n    Report --> Cite[Add Citations & Uncertainty]\n    Loop --> Search",
    "expanded_text": "The autonomous AI agent begins with broad multi-source literature search based on the user query. It extracts key claims and supporting evidence, then analyzes for contradictions or knowledge gaps. When issues are found, it performs deeper investigation into primary sources and cross-validates findings. A confidence scoring mechanism determines whether to loop back with expanded queries or proceed to synthesis. The final report includes structured findings, proper citations, and explicit uncertainty notations to maintain scientific integrity.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["feedback loop", "conditional reasoning", "uncertainty handling", "multi-step agent workflow"]
    }
  },
  {
    "input_text": "Outline the comprehensive care pathway for a patient diagnosed with Type 2 Diabetes, including lifestyle intervention, medication, regular monitoring, specialist referrals, and complication prevention strategies.",
    "mermaid": "flowchart TD\n    Diagnosis[Type 2 Diabetes Diagnosis] --> Education[Patient Education]\n    Education --> Lifestyle[Lifestyle Intervention]\n    Lifestyle --> Monitor[Regular Monitoring HbA1c]\n    Monitor --> Control{Well Controlled?}\n    Control -->|Yes| Maintenance[Maintenance Phase]\n    Control -->|No| Meds[Start/Adjust Medication]\n    Meds --> Specialist{Specialist Needed?}\n    Specialist -->|Yes| Referral[Endocrinologist / Dietitian]\n    Specialist -->|No| Monitor\n    Maintenance --> Complication[Screen for Complications]\n    Complication --> Prevent[Prevention Strategies]\n    Prevent --> Monitor",
    "expanded_text": "Following a Type 2 Diabetes diagnosis, patients receive comprehensive education. Initial focus is on lifestyle modifications including diet and exercise. Regular HbA1c monitoring determines control status. If targets are not met, medication is introduced or adjusted. Specialist referrals occur when necessary. Long-term maintenance includes complication screening and aggressive prevention. The pathway forms a continuous cycle of monitoring, intervention, and adjustment tailored to patient response.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["chronic care pathway", "decision branches", "long-term feedback loop"]
    }
  },
  {
    "input_text": "Walk me through the full supply chain disruption recovery protocol we activated during last year's port strike.",
    "mermaid": "flowchart TD\n    Detect[Disruption Detected] --> Assess[Impact Assessment]\n    Assess --> Activate[Activate BCP]\n    Activate --> Parallel[Parallel Actions]\n    Parallel --> Alternative[Source Alternative Suppliers]\n    Parallel --> Inventory[Emergency Inventory Allocation]\n    Parallel --> Route[Re-route Shipments]\n    Parallel --> Communication[Stakeholder Communication]\n    Alternative --> Qualify[Qualify New Suppliers]\n    Qualify --> Integrate[Integrate into ERP]\n    Route --> Monitor[Real-time Tracking]\n    Monitor --> Stabilize{Supply Stabilized?}\n    Stabilize -->|No| Parallel\n    Stabilize -->|Yes| Review[Post-Incident Review]\n    Review --> Improve[Update BCP]",
    "expanded_text": "Upon detection of a major disruption like a port strike, the team immediately assesses business impact and activates the Business Continuity Plan. Multiple workstreams run in parallel: sourcing alternatives, reallocating inventory, re-routing shipments, and transparent stakeholder communication. New suppliers undergo qualification before integration. Real-time monitoring continues until stability is achieved. A thorough post-incident review leads to improvements in the continuity plan.",
    "metadata": {
      "domain": "logistics",
      "complexity": "high",
      "graph_features": ["crisis management", "parallel execution", "recovery workflow"]
    }
  },
  {
    "input_text": "Explain the multi-stage contract negotiation process between two corporations for a strategic partnership.",
    "mermaid": "flowchart TD\n    Initial[Initial Term Sheet] --> Legal1[Legal Review Round 1]\n    Legal1 --> Business[Business Negotiation]\n    Business --> Redline[Redline Exchange]\n    Redline --> Finance[Finance & Risk Assessment]\n    Finance --> Legal2[Legal Review Round 2]\n    Legal2 --> Executive[Executive Alignment]\n    Executive --> Compliance[Regulatory Compliance Check]\n    Compliance --> Approval[Board Approval]\n    Approval --> Sign[Contract Signing]\n    Sign --> Post[Post-Signature Integration Planning]",
    "expanded_text": "Strategic partnership contract negotiation is a complex multi-round process. It begins with a term sheet, followed by initial legal review. Business teams negotiate key commercial terms while legal teams exchange redlines. Finance conducts risk and valuation analysis. A second legal round incorporates feedback. Executive alignment and regulatory compliance checks are critical before board approval. Only after all gates are cleared does contract signing occur, followed by detailed integration planning.",
    "metadata": {
      "domain": "legal",
      "complexity": "high",
      "graph_features": ["approval gates", "iterative negotiation", "multi-stakeholder coordination"]
    }
  },
  {
    "input_text": "How does our advanced threat hunting system operate when it detects potential advanced persistent threats in the network?",
    "mermaid": "flowchart TD\n    Detect[Anomaly Detected] --> Correlate[Threat Intelligence Correlation]\n    Correlate --> Score[Risk Scoring]\n    Score --> HighRisk{High Risk APT?}\n    HighRisk -->|Yes| Isolate[Isolate Affected Systems]\n    HighRisk -->|No| Monitor[Enhanced Monitoring]\n    Isolate --> Forensics[Digital Forensics]\n    Forensics --> IOC[Extract Indicators of Compromise]\n    IOC --> Hunt[Proactive Threat Hunting]\n    Hunt --> Eradicate[Eradicate Threat]\n    Eradicate --> Recover[System Recovery]\n    Recover --> Review[Lessons Learned]\n    Monitor --> Review",
    "expanded_text": "The threat hunting system begins by correlating detected anomalies with external threat intelligence and assigns risk scores. High-risk indicators trigger immediate isolation of affected systems. Digital forensics teams then extract indicators of compromise to fuel broader proactive hunting across the network. Confirmed threats are eradicated, systems are recovered, and a lessons-learned review improves future detection. Lower risk events move to enhanced monitoring before review.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["incident response", "conditional escalation", "forensics loop"]
    }
  },
  {
    "input_text": "Design a personalized learning pathway system for high school students that adapts based on performance, learning style, and career goals.",
    "mermaid": "flowchart TD\n    Profile[Student Profile Creation] --> Assess[Initial Diagnostic Assessment]\n    Assess --> Style[Learning Style Analysis]\n    Style --> Goals[Career Goal Input]\n    Goals --> Path[Generate Initial Learning Path]\n    Path --> Content[Deliver Adaptive Content]\n    Content --> Performance[Real-time Performance Tracking]\n    Performance --> Adjust{Adjustment Needed?}\n    Adjust -->|Yes| Modify[Modify Difficulty & Sequence]\n    Adjust -->|No| Progress[Track Progress]\n    Modify --> Content\n    Progress --> Milestone{Milestone Achieved?}\n    Milestone -->|Yes| Recommend[Recommend Next Module/Career Path]\n    Milestone -->|No| Content",
    "expanded_text": "The system starts by building a rich student profile through diagnostic assessments, learning style analysis, and career goal input. It generates a personalized learning path and delivers adaptive content. Real-time performance tracking continuously evaluates progress. When needed, the system dynamically adjusts difficulty and content sequence. Milestone achievements trigger recommendations for new modules or refined career pathways, creating a continuously evolving educational journey.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["adaptive loop", "personalization engine", "multi-factor decisioning"]
    }
  },
  {
    "input_text": "What is the complete end-to-end process for approving and disbursing a large commercial loan at our bank?",
    "mermaid": "flowchart TD\n    Application[Loan Application] --> KYC[KYC & Due Diligence]\n    KYC --> Credit[Credit Risk Assessment]\n    Credit --> Collateral[Collateral Valuation]\n    Collateral --> Committee[Credit Committee Review]\n    Committee --> Approval{Approved?}\n    Approval -->|Yes| Legal[Legal Documentation]\n    Approval -->|No| Reject[Reject with Reasons]\n    Legal --> Disburse[Disbursement]\n    Disburse --> Monitoring[Ongoing Monitoring]\n    Monitoring --> Covenant{Covenant Breach?}\n    Covenant -->|Yes| Action[Remedial Action]\n    Covenant -->|No| Monitoring",
    "expanded_text": "Large commercial loan processing starts with formal application and thorough KYC due diligence. Detailed credit risk assessment and collateral valuation follow. A credit committee makes the final approval decision. Approved loans proceed to legal documentation before disbursement. Post-disbursement, continuous monitoring ensures covenant compliance. Any breaches trigger remedial actions while performing loans continue under regular oversight.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["multi-stage approval", "risk management", "ongoing monitoring loop"]
    }
  },
  {
    "input_text": "Explain the complex quest progression system in our open-world RPG, including main story, side quests, faction reputation, skill trees, and dynamic world events.",
    "mermaid": "flowchart TD\n    Start[Player Starts Game] --> Main[Main Story Quests]\n    Main --> Side[Side Quests & Exploration]\n    Side --> Faction[Faction Reputation]\n    Faction --> Dynamic[Dynamic World Events]\n    Dynamic --> Skill[Skill Tree Progression]\n    Skill --> Unlock[Unlock New Areas/Abilities]\n    Unlock --> Main\n    Main --> Boss[Major Story Boss]\n    Boss --> Choice{Narrative Choice}\n    Choice --> Branch1[Path A - Alliance]\n    Choice --> Branch2[Path B - Conflict]\n    Branch1 --> Continue[Continue Story]\n    Branch2 --> Continue",
    "expanded_text": "The RPG features interconnected progression systems. Players advance the main story while engaging with side quests that influence faction reputation. Dynamic world events respond to player actions and reputation levels. Skill tree progression unlocks new abilities and areas. Major story bosses present narrative choices that create branching storylines. All systems feed into each other, creating a rich, reactive game world.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["branching narrative", "interconnected systems", "dynamic events"]
    }
  },
  {
    "input_text": "How does our cross-functional product team handle feature requests coming from multiple sources including customers, support tickets, and competitive analysis?",
    "mermaid": "flowchart TD\n    Sources[Feature Requests from Multiple Sources] --> Intake[Intake & Prioritization]\n    Intake --> Scoring[ICE Scoring]\n    Scoring --> Backlog[Product Backlog]\n    Backlog --> Refinement[Backlog Refinement]\n    Refinement --> Design[UX & Technical Design]\n    Design --> Review[Stakeholder Review]\n    Review --> Sprint{Sprint Planning}\n    Sprint --> Development[Development]\n    Development --> QA[Testing & QA]\n    QA --> Release[Release & Monitoring]\n    Release --> Feedback[Collect Feedback]\n    Feedback --> Intake",
    "expanded_text": "Feature requests from customers, support tickets, and competitive intelligence flow into a centralized intake process. Each request receives ICE scoring (Impact, Confidence, Ease) before entering the product backlog. During refinement, UX and technical designs are created and reviewed by stakeholders. Selected features enter sprint planning, followed by development, rigorous testing, and release. Post-release feedback is collected and fed back into the intake system, closing the continuous improvement loop.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["feedback loop", "prioritization workflow", "cross-functional process"]
    }
  },
  {
    "input_text": "Describe our quarterly OKR planning and tracking process across departments, including alignment sessions, scoring at the end of the quarter, and how it influences compensation and promotion decisions.",
    "mermaid": "flowchart TD\n    Start[New Quarter Planning] --> Alignment[Company-Wide Alignment Sessions]\n    Alignment --> Department[Department OKR Workshops]\n    Department --> Individual[Individual OKR Setting]\n    Individual --> Approval[Manager Approval]\n    Approval --> Track[Quarterly Tracking]\n    Track --> Review[Mid-Quarter Review]\n    Review --> Adjust[Adjust OKRs if Needed]\n    Adjust --> Track\n    Track --> End[End of Quarter]\n    End --> Scoring[OKR Scoring]\n    Scoring --> Calibration[Calibration Meeting]\n    Calibration --> Impact{Impact on Comp & Promo?}\n    Impact -->|Yes| Decisions[Compensation & Promotion Decisions]\n    Impact -->|No| Archive[Archive for Next Cycle]",
    "expanded_text": "The OKR process begins with company alignment sessions followed by department workshops and individual goal setting with manager approval. Throughout the quarter, teams track progress with a mid-quarter review allowing adjustments. At quarter end, objective scoring occurs followed by calibration meetings. Final scores directly influence compensation adjustments and promotion considerations before archiving results for the next planning cycle.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["hierarchical alignment", "feedback cycles", "performance linkage"]
    }
  },
  {
    "input_text": "Explain the vulnerability management lifecycle in our security operations center from discovery to final remediation verification.",
    "mermaid": "flowchart TD\n    Discover[Vulnerability Discovered] --> Assess[Risk Assessment & Prioritization]\n    Assess --> Triage[Triage by Severity]\n    Triage --> Patch[Patch Available?]\n    Patch -->|Yes| Deploy[Deploy Patch]\n    Patch -->|No| Mitigate[Implement Mitigation Controls]\n    Deploy --> Verify[Verification Scan]\n    Mitigate --> Verify\n    Verify --> Remediated{Remediated?}\n    Remediated -->|Yes| Report[Report & Document]\n    Remediated -->|No| Escalate[Escalate to Engineering]\n    Escalate --> Deploy",
    "expanded_text": "New vulnerabilities are discovered through scans or threat intel. They undergo risk assessment and prioritization based on severity and business impact. The team then decides between patching or implementing temporary mitigations. After deployment, verification scans confirm successful remediation. Unresolved issues escalate to engineering teams. All activities are properly documented for compliance and audit trails.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["lifecycle workflow", "decision branching", "verification loop"]
    }
  },
  {
    "input_text": "How does the adaptive difficulty system work in our mobile puzzle game when players are struggling or breezing through levels?",
    "mermaid": "flowchart TD\n    Play[Player Starts Level] --> Performance[Track Performance Metrics]\n    Performance --> Analyze{Analyze Skill Level}\n    Analyze -->|Too Easy| Increase[Increase Difficulty]\n    Analyze -->|Too Hard| Decrease[Decrease Difficulty]\n    Analyze -->|Balanced| Maintain[Maintain Difficulty]\n    Increase --> NewLevel[Generate New Level]\n    Decrease --> NewLevel\n    Maintain --> NewLevel\n    NewLevel --> Play\n    Play --> Streak{Win/Loss Streak}\n    Streak -->|Long Win| Increase\n    Streak -->|Multiple Losses| Decrease",
    "expanded_text": "The game continuously monitors player performance metrics during levels. Based on real-time analysis, the system dynamically increases difficulty for players who are performing too well, decreases it for struggling players, or maintains current level when balanced. Win/loss streaks provide additional signals for adjustment. This creates a personalized and engaging experience that keeps players in a state of flow.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["dynamic feedback loop", "real-time adaptation", "performance-based branching"]
    }
  },
  {
    "input_text": "Walk me through the entire civil litigation process from filing a complaint to final appeal in the court system.",
    "mermaid": "flowchart TD\n    File[File Complaint] --> Serve[Serve Defendant]\n    Serve --> Answer[Defendant Answer or Motion]\n    Answer --> Discovery[Discovery Phase]\n    Discovery --> Motions[Pre-Trial Motions]\n    Motions --> Trial[Trial]\n    Trial --> Verdict[Verdict]\n    Verdict --> Appeal{Appeal Filed?}\n    Appeal -->|Yes| Appellate[Court of Appeals]\n    Appeal -->|No| Enforce[Enforce Judgment]\n    Appellate --> Supreme{Supreme Court?}\n    Supreme -->|Yes| Final[Final Decision]\n    Supreme -->|No| Enforce",
    "expanded_text": "Civil litigation begins with filing a complaint and serving the defendant. After the defendant responds, both parties enter the discovery phase to exchange evidence. Pre-trial motions may resolve or narrow issues before trial. Following the trial and verdict, the losing party may appeal to higher courts. The process may reach the Supreme Court in exceptional cases. Once appeals are exhausted, the judgment is enforced.",
    "metadata": {
      "domain": "legal",
      "complexity": "high",
      "graph_features": ["long sequential process", "decision points", "hierarchical appeals"]
    }
  },
  {
    "input_text": "Describe our A/B testing framework for optimizing marketing campaigns including sample sizing, statistical significance, and rollout decisions.",
    "mermaid": "flowchart TD\n    Hypothesis[Form Hypothesis] --> Design[Design A/B Test Variants]\n    Design --> Sample[Calculate Sample Size]\n    Sample --> Launch[Launch Test]\n    Launch --> Monitor[Monitor Results in Real-time]\n    Monitor --> Duration{Test Duration Met?}\n    Duration -->|Yes| Analyze[Statistical Analysis]\n    Duration -->|No| Monitor\n    Analyze --> Significance{Statistically Significant?}\n    Significance -->|Yes| Winner[Declare Winner]\n    Significance -->|No| Extend[Extend Test or Stop]\n    Winner --> Rollout[Gradual Rollout]\n    Rollout --> Measure[Measure Long-term Impact]",
    "expanded_text": "The framework starts with a clear hypothesis and variant design. Appropriate sample sizes are calculated to ensure statistical power. Tests run with continuous monitoring until sufficient duration and data are collected. Rigorous statistical analysis determines significance. Winning variants undergo gradual rollout while long-term business impact is measured. Non-significant tests are either extended or concluded.",
    "metadata": {
      "domain": "marketing",
      "complexity": "high",
      "graph_features": ["experimentation workflow", "statistical decision gates", "gradual rollout"]
    }
  },
  {
    "input_text": "I am considering buying a new car. I need to research models, compare features and prices, test drive options, check financing, review insurance costs, and negotiate with dealers before making the final purchase.",
    "mermaid": "flowchart TD\n    Research[Research Models & Reviews] --> Compare[Compare Features & Pricing]\n    Compare --> Budget[Assess Budget & Financing]\n    Budget --> TestDrive[Schedule Test Drives]\n    TestDrive --> Insurance[Review Insurance Costs]\n    Insurance --> Shortlist[Create Shortlist]\n    Shortlist --> Negotiate[Negotiate with Dealers]\n    Negotiate --> Final{Decision Made?}\n    Final -->|Yes| Purchase[Complete Purchase]\n    Final -->|No| Research",
    "expanded_text": "The car buying process is multi-faceted. It starts with thorough research and comparison of models based on features, reliability, and pricing. Budget and financing options are evaluated early. Test drives provide real-world experience while insurance costs are reviewed. After shortlisting, negotiations with dealers take place. The process may loop back to research if no suitable option is found before final purchase.",
    "metadata": {
      "domain": "daily life",
      "complexity": "high",
      "graph_features": ["multi-criteria decision", "iterative evaluation", "personal finance"]
    }
  },
  {
    "input_text": "Explain the curriculum development process for a new university degree program from concept to first student intake.",
    "mermaid": "flowchart TD\n    Concept[Program Concept Proposal] --> Market[Market & Industry Research]\n    Market --> Faculty[Faculty & Expert Input]\n    Faculty --> Design[Curriculum Design]\n    Design --> Approval[Academic Senate Approval]\n    Approval --> Accreditation[Accreditation Process]\n    Accreditation --> Resource[Resource Allocation]\n    Resource --> Marketing[Program Marketing]\n    Marketing --> Admissions[Student Admissions]\n    Admissions --> Intake[First Student Intake]\n    Intake --> Review[Post-Launch Review]",
    "expanded_text": "Developing a new university degree program starts with a concept proposal supported by market and industry research. Faculty and experts collaborate on detailed curriculum design. Multiple levels of academic approval are required, followed by accreditation. Resources are allocated and the program is marketed to attract students. After admissions, the first cohort begins studies, followed by a comprehensive post-launch review for continuous improvement.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["multi-stakeholder approval", "sequential development", "launch process"]
    }
  },
  {
    "input_text": "What is our blue-green deployment strategy for zero-downtime updates to the customer-facing platform?",
    "mermaid": "flowchart TD\n    Current[Current Version - Blue] --> Build[Build New Version - Green]\n    Build --> Test[Automated Testing]\n    Test --> Smoke[Smoke Tests on Green]\n    Smoke --> Traffic[Route Small % Traffic to Green]\n    Traffic --> Monitor[Monitor Performance & Errors]\n    Monitor --> Healthy{Healthy?}\n    Healthy -->|Yes| Increase[Increase Traffic Gradually]\n    Healthy -->|No| Rollback[Switch Back to Blue]\n    Increase --> Full[100% Traffic to Green]\n    Full --> Decommission[Decommission Old Blue]",
    "expanded_text": "In blue-green deployment, the current production environment (Blue) continues serving users while a new version (Green) is built and thoroughly tested. Smoke tests run on the idle environment. Traffic is gradually shifted from Blue to Green while closely monitoring performance and error rates. If issues arise, traffic is instantly switched back. Once fully migrated, the old environment is decommissioned. This ensures zero-downtime updates.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["deployment strategy", "rollback capability", "gradual migration"]
    }
  },
  {
    "input_text": "Describe the multi-step investment decision process our fund uses when evaluating startup pitches.",
    "mermaid": "flowchart TD\n    Pitch[Startup Pitch Received] --> Screen[Initial Screening]\n    Screen --> Due[Detailed Due Diligence]\n    Due --> Market[Market Analysis]\n    Market --> Team[Team & Founder Evaluation]\n    Team --> Financial[Financial Modeling]\n    Financial --> Risk[Risk Assessment]\n    Risk --> Committee[Investment Committee Review]\n    Committee --> Decision{Approve?}\n    Decision -->|Yes| Term[Term Sheet Negotiation]\n    Decision -->|No| Reject[Decline]\n    Term --> Close[Deal Closing]\n    Close --> Portfolio[Portfolio Management]",
    "expanded_text": "Startup investment evaluation follows a rigorous multi-stage process. Initial screening filters pitches before deep due diligence covering market potential, team capabilities, and financial projections. Comprehensive risk assessment leads to investment committee review. Approved deals move to term sheet negotiation and closing. Post-investment, active portfolio management begins. Rejected opportunities receive professional decline feedback.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["evaluation pipeline", "multi-stage gating", "risk management"]
    }
  },
  {
    "input_text": "How does our content recommendation engine balance exploration and exploitation when suggesting articles to users?",
    "mermaid": "flowchart TD\n    User[User Session Starts] --> History[Review User History]\n    History --> Embed[Generate User Embedding]\n    Embed --> Candidate[Generate Candidate Articles]\n    Candidate --> Score[Score by Relevance]\n    Score --> Epsilon{Epsilon-Greedy?}\n    Epsilon -->|Exploit| Top[Select Top Recommendations]\n    Epsilon -->|Explore| Random[Include Random Diverse Articles]\n    Top --> Mix[Mixed Recommendations]\n    Random --> Mix\n    Mix --> Serve[Serve to User]\n    Serve --> Feedback[Collect Implicit Feedback]\n    Feedback --> Update[Update User Model]",
    "expanded_text": "The recommendation engine analyzes user history and creates embeddings to generate candidate articles. Articles are scored for relevance. Using an epsilon-greedy approach, the system mostly exploits high-scoring items but occasionally explores diverse or less-certain articles to improve long-term learning. Feedback from user interactions continuously updates the model, creating a balanced exploration-exploitation cycle.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["reinforcement learning concept", "exploration-exploitation", "feedback loop"]
    }
  },
  {
    "input_text": "Describe our complete CI/CD pipeline for deploying microservices to Kubernetes, including automated testing, security scanning, approval gates, blue-green deployment, and post-deployment monitoring.",
    "mermaid": "flowchart TD\n    Commit[Code Commit] --> Build[Build & Unit Tests]\n    Build --> Security[SAST + Dependency Scan]\n    Security --> Integration[Integration Tests]\n    Integration --> Container[Build Container Image]\n    Container --> Scan[Image Vulnerability Scan]\n    Scan --> Approval[Manual Approval Gate]\n    Approval --> Deploy[Blue-Green Deployment]\n    Deploy --> Monitor[Monitoring & Metrics]\n    Monitor --> Healthy{Healthy After 30min?}\n    Healthy -->|Yes| Promote[Promote Green]\n    Healthy -->|No| Rollback[Rollback to Blue]\n    Promote --> Observability[Long-term Observability]",
    "expanded_text": "Every code commit triggers the CI/CD pipeline starting with build and unit tests. Security and dependency scanning follow, then integration tests. Successful builds create container images which undergo vulnerability scanning. A manual approval gate ensures quality before blue-green deployment to Kubernetes. Post-deployment monitoring for 30 minutes determines success. Healthy deployments promote the new version while unhealthy ones trigger automatic rollback. Long-term observability continues after promotion.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["CI/CD pipeline", "approval gates", "deployment strategy", "rollback mechanism"]
    }
  },
  {
    "input_text": "How does a Phase III clinical drug trial progress from recruitment to final regulatory submission?",
    "mermaid": "flowchart TD\n    Protocol[Protocol Approval] --> Recruit[Patient Recruitment]\n    Recruit --> Screening[Screening & Randomization]\n    Screening --> Treatment[Treatment Phase]\n    Treatment --> Monitoring[Safety & Efficacy Monitoring]\n    Monitoring --> Data[Data Collection & Analysis]\n    Data --> Interim{Interim Analysis?}\n    Interim -->|Yes| DSMB[DSMB Review]\n    DSMB --> Continue{Continue Trial?}\n    Continue -->|Yes| Treatment\n    Data --> Final[Final Statistical Analysis]\n    Final --> Report[Clinical Study Report]\n    Report --> Submission[Regulatory Submission]",
    "expanded_text": "Phase III clinical trials begin with protocol approval followed by patient recruitment and rigorous screening. Randomized participants enter the treatment phase with continuous safety and efficacy monitoring. Interim analyses may occur with independent DSMB review. Upon completion, comprehensive data analysis produces a clinical study report that supports regulatory submission for market approval.",
    "metadata": {
      "domain": "science",
      "complexity": "high",
      "graph_features": ["multi-phase process", "decision gates", "regulatory workflow"]
    }
  },
  {
    "input_text": "Map out the complete customer journey for purchasing a high-value B2B SaaS solution from awareness to renewal.",
    "mermaid": "flowchart TD\n    Awareness[Brand Awareness] --> Research[Research & Comparison]\n    Research --> Demo[Request Demo]\n    Demo --> Evaluation[Technical Evaluation & POC]\n    Evaluation --> Stakeholder[Stakeholder Buy-in]\n    Stakeholder --> Negotiation[Contract Negotiation]\n    Negotiation --> Purchase[Purchase Decision]\n    Purchase --> Onboarding[Implementation & Onboarding]\n    Onboarding --> Adoption[User Adoption]\n    Adoption --> Value{Value Realized?}\n    Value -->|Yes| Renewal[Contract Renewal]\n    Value -->|No| Churn[Risk of Churn]",
    "expanded_text": "The B2B SaaS customer journey starts with initial brand awareness and moves through research and comparison. Qualified prospects request demos, followed by technical evaluations and proof-of-concept trials. Multiple stakeholders must align before contract negotiation and purchase. Successful implementation leads to user adoption. Long-term value realization determines renewal likelihood or churn risk.",
    "metadata": {
      "domain": "marketing",
      "complexity": "high",
      "graph_features": ["customer journey", "long sales cycle", "decision funnel"]
    }
  },
  {
    "input_text": "How do we handle performance improvement plans for underperforming employees?",
    "mermaid": "flowchart TD\n    Identify[Performance Issue Identified] --> Document[Document Issues]\n    Document --> Meeting[Initial PIP Meeting]\n    Meeting --> Plan[Create 30-60-90 Day PIP]\n    Plan --> Support[Provide Resources & Support]\n    Support --> Review[Regular Check-ins]\n    Review --> Progress{Progress Satisfactory?}\n    Progress -->|Yes| Success[Close PIP Successfully]\n    Progress -->|No| Extend[Extend Plan]\n    Extend --> Review\n    Progress -->|No After Extension| Termination[Termination Process]",
    "expanded_text": "When performance issues are identified, they are thoroughly documented before an initial meeting with the employee. A structured 30-60-90 day Performance Improvement Plan is created with clear goals and support resources. Regular check-ins track progress. Satisfactory improvement leads to successful closure. Insufficient progress after possible extension may result in termination following company policy.",
    "metadata": {
      "domain": "HR",
      "complexity": "high",
      "graph_features": ["performance process", "time-bound reviews", "escalation path"]
    }
  },
  {
    "input_text": "Explain the complex character progression and prestige system in our fantasy MMORPG.",
    "mermaid": "flowchart TD\n    Leveling[Leveling System] --> Skills[Skill Tree Unlocks]\n    Skills --> Reputation[Faction Reputation]\n    Reputation --> Gear[Gear & Equipment Upgrades]\n    Gear --> Prestige[Prestige System]\n    Prestige --> Reset[Reset Character Level]\n    Reset --> NewPerks[New Prestige Perks]\n    NewPerks --> Leveling\n    Leveling --> Endgame[Endgame Content]\n    Endgame --> Achievements[Achievements & Titles]",
    "expanded_text": "Character progression combines traditional leveling with deep skill trees and faction reputation systems. Players upgrade gear while building reputation. Upon reaching maximum level, they can enter the prestige system which resets their level in exchange for powerful permanent perks. This creates a rewarding long-term progression loop. Endgame content and achievements provide additional layers of mastery and status.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["progression systems", "prestige loop", "interconnected mechanics"]
    }
  },
  {
    "input_text": "What steps are involved in preparing a patient for major cardiac surgery?",
    "mermaid": "flowchart TD\n    Referral[Cardiologist Referral] --> Consultation[Pre-op Consultation]\n    Consultation --> Tests[Comprehensive Pre-op Tests]\n    Tests --> Risk[Risk Assessment]\n    Risk --> Optimization[Patient Optimization]\n    Optimization --> Consent[Informed Consent]\n    Consent --> Anesthesia[Anesthesia Evaluation]\n    Anesthesia --> Schedule[Surgery Scheduling]\n    Schedule --> Final[Final Pre-op Assessment]\n    Final --> Surgery[Day of Surgery]",
    "expanded_text": "Preparation for major cardiac surgery starts with specialist referral and detailed consultation. Multiple diagnostic tests assess the patient's condition and surgical risk. The patient undergoes medical optimization to improve outcomes. Informed consent is obtained after thorough discussion. Anesthesia evaluation ensures safety. The process includes careful scheduling and a final pre-operative assessment on the day of surgery.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["medical protocol", "multi-disciplinary steps", "risk management"]
    }
  },
  {
    "input_text": "How does our data governance framework ensure compliance with GDPR and CCPA across all business units?",
    "mermaid": "flowchart TD\n    Data[New Data Collected] --> Classify[Data Classification]\n    Classify --> Consent[Consent Management]\n    Consent --> Store[Secure Storage]\n    Store --> Access[Access Control & Logging]\n    Access --> Process[Data Processing Activities]\n    Process --> DPIA{Data Protection Impact Assessment?}\n    DPIA -->|Required| Assessment[Conduct DPIA]\n    Process --> Retention[Retention Policy Enforcement]\n    Retention --> Audit[Regular Compliance Audits]\n    Audit --> Report[Regulatory Reporting]",
    "expanded_text": "The data governance framework classifies all new data and manages consent according to regulatory requirements. Data is stored securely with strict access controls and logging. Processing activities undergo Data Protection Impact Assessments when required. Automated retention policies delete data when no longer needed. Regular audits ensure ongoing compliance with GDPR and CCPA, with formal reporting to regulators as needed.",
    "metadata": {
      "domain": "legal",
      "complexity": "high",
      "graph_features": ["compliance framework", "regulatory workflow", "audit cycle"]
    }
  },
  {
    "input_text": "Our family is planning a 2-week international vacation. We need to decide destination, book flights and hotels, arrange transportation, manage budget, prepare documents, and plan daily activities.",
    "mermaid": "flowchart TD\n    Decide[Destination Decision] --> Budget[Budget Planning]\n    Budget --> Flights[Book Flights]\n    Flights --> Hotels[Book Accommodations]\n    Hotels --> Transport[Local Transportation]\n    Transport --> Documents[Passports & Visas]\n    Documents --> Activities[Daily Itinerary Planning]\n    Activities --> Insurance[Travel Insurance]\n    Insurance --> Final[Final Review & Packing]",
    "expanded_text": "Family vacation planning begins with collective destination decision followed by realistic budget allocation. Flights and hotels are booked early. Local transportation arrangements and necessary travel documents are secured. Detailed daily activities are planned while ensuring comprehensive travel insurance coverage. A final family review confirms all arrangements before packing.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["project planning", "dependency chain", "family coordination"]
    }
  },
  {
    "input_text": "Describe the ethical decision-making framework used by our AI development team when facing ambiguous situations.",
    "mermaid": "flowchart TD\n    Situation[Ethical Dilemma Identified] --> Gather[Gather Facts]\n    Gather --> Stakeholders[Identify Affected Parties]\n    Stakeholders --> Principles[Apply Ethical Principles]\n    Principles --> Options[Generate Options]\n    Options --> Evaluate[Evaluate Consequences]\n    Evaluate --> Consult[Consult Ethics Board]\n    Consult --> Decision[Make Decision]\n    Decision --> Document[Document Reasoning]\n    Document --> Monitor[Monitor Outcomes]",
    "expanded_text": "When facing ethical dilemmas, the team first gathers complete facts and identifies all stakeholders. Core ethical principles are applied to generate multiple options. Each option is evaluated for short and long-term consequences. The ethics board is consulted when needed. A decision is made, thoroughly documented with reasoning, and outcomes are monitored post-implementation.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["decision framework", "ethical reasoning", "documentation loop"]
    }
  },
  {
    "input_text": "Outline the crisis communication plan we activate during a major service outage.",
    "mermaid": "flowchart TD\n    Outage[Major Outage Detected] --> Assess[Assess Impact & Expected Duration]\n    Assess --> Notify[Internal Leadership Notification]\n    Notify --> Template[Activate Communication Templates]\n    Template --> Channel[Multi-channel Customer Notification]\n    Channel --> Status[Regular Status Updates]\n    Status --> ETA{ETA Available?}\n    ETA -->|Yes| Resolution[Work Towards Resolution]\n    ETA -->|No| Transparent[Transparent Communication]\n    Resolution --> Recovery[Service Recovery]\n    Recovery --> Post[Post-Incident Review & Apology]",
    "expanded_text": "Upon detecting a major service outage, the team quickly assesses impact and estimated recovery time. Leadership is notified immediately while pre-approved communication templates are activated. Customers receive timely notifications across multiple channels with regular status updates. The plan emphasizes transparency. Once resolved, a post-incident review occurs along with formal apologies and compensation where appropriate.",
    "metadata": {
      "domain": "customer support",
      "complexity": "high",
      "graph_features": ["crisis management", "communication workflow", "post-mortem"]
    }
  },
  {
    "input_text": "A non-technical manager asks: 'How does the user authentication system work?' The engineer explains: 'First, user submits username/password. Our backend hashes the password with bcrypt and compares with stored hash. If match, we generate a JWT token and send it back. The token expires in 1 hour. For every subsequent request, the client includes the token in the Authorization header. We verify the token signature before processing the request. If token expired, we return a 401 error and the client must re-authenticate. If invalid token, reject immediately.'",
    "mermaid": "graph TD\n    A[Client: submit username/password] --> B[Backend: hash password with bcrypt]\n    B --> C{Compare with stored hash?}\n    C -->|Match| D[Generate JWT, expires 1h]\n    D --> E[Send token to client]\n    C -->|No match| F[Return 401 Unauthorized]\n    E --> G[Client includes token in Authorization header for subsequent requests]\n    G --> H[Backend: verify token signature]\n    H --> I{Token valid and not expired?}\n    I -->|Yes| J[Process request, return data]\n    I -->|Expired| K[Return 401, client re-authenticates]\n    I -->|Invalid signature| L[Reject immediately]",
    "expanded_text": "The engineer explains the user authentication system to a non-technical manager. The process begins when the client submits a username and password to the backend via a POST /login request. The backend hashes the provided password using bcrypt and compares it with the stored hash in the database. If the credentials match, the backend generates a JSON Web Token (JWT) that expires in 1 hour and sends it back to the client. For every subsequent request, the client includes the JWT in the Authorization header as a Bearer token. The backend verifies the token's signature before processing the request. If the token is valid and not expired, the request is processed and data is returned. If the token has expired, the backend returns a 401 Unauthorized error and the client must re-authenticate. If the token signature is invalid, the request is rejected immediately with a 401 error.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["conditional branches", "loop", "expiration logic"]
    }
  },
  {
    "input_text": "A customer calls support: 'My internet keeps dropping every few minutes.' The agent troubleshoots: Have you restarted your router? If not, unplug for 30 seconds and plug back in. If yes, check your coax/ethernet cables — are they tight? If loose, tighten them. If still dropping, log into the router admin panel and check signal levels. If downstream power is outside -7 to +7 dBmV, schedule a technician visit. If signal is fine, ask if many devices are connected. If >15 devices, upgrade your plan. If none of these work, escalate to Tier 2 support.",
    "mermaid": "graph TD\n    A[Customer: internet keeps dropping] --> B{Restarted router?}\n    B -->|No| C[Unplug for 30s, plug back]\n    C --> D[Test connection]\n    D --> E{Problem fixed?}\n    E -->|Yes| F[Close case]\n    E -->|No| B\n    B -->|Yes| G{Cables tight?}\n    G -->|No| H[Tighten coax/ethernet]\n    H --> D\n    G -->|Yes| I[Check signal levels in admin panel]\n    I --> J{Downstream power -7 to +7 dBmV?}\n    J -->|No| K[Schedule technician visit]\n    J -->|Yes| L{Many devices? (>15)}\n    L -->|Yes| M[Upgrade plan]\n    L -->|No| N[Escalate to Tier 2 support]",
    "expanded_text": "A customer reports that their internet keeps dropping every few minutes. The support agent first asks if the customer has restarted the router. If not, the agent instructs them to unplug the router for 30 seconds and plug it back in. After testing, if the problem is fixed, the case is closed. If still dropping, the agent again checks the restart status. If the customer has already restarted, the agent checks whether the coax or ethernet cables are tight; if loose, they are tightened and the connection is retested. If cables are already tight, the agent instructs the customer to log into the router's admin panel and check signal levels. If downstream power is outside the range of -7 to +7 dBmV, a technician visit is scheduled. If signal levels are normal, the agent asks if more than 15 devices are connected to the network; if yes, the agent recommends upgrading the internet plan. If none of these steps resolve the issue, the case is escalated to Tier 2 support.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["conditional branches", "loop (retest)", "escalation"]
    }
  },
  {
    "input_text": "The immune system's response to a virus: A virus enters the body. Innate immune cells (macrophages) recognize and engulf viruses. They release cytokines, causing inflammation and fever. If the virus spreads, dendritic cells capture viral antigens and migrate to lymph nodes. There, they activate helper T cells. Helper T cells then activate B cells and cytotoxic T cells. B cells produce antibodies that neutralize the virus. Cytotoxic T cells kill infected cells. After the infection clears, memory B and memory T cells remain for faster response next time. If the immune response is too strong, it can cause a cytokine storm damaging organs.",
    "mermaid": "graph TD\n    A[Virus enters body] --> B[Macrophages engulf virus]\n    B --> C[Release cytokines, inflammation, fever]\n    C --> D{Virus spreads?}\n    D -->|Yes| E[Dendritic cells capture antigens, migrate to lymph nodes]\n    D -->|No| F[Infection controlled]\n    E --> G[Activate helper T cells]\n    G --> H[Activate B cells]\n    G --> I[Activate cytotoxic T cells]\n    H --> J[B cells produce antibodies, neutralize virus]\n    I --> K[Cytotoxic T cells kill infected cells]\n    J --> L[Infection cleared]\n    K --> L\n    L --> M[Memory B and T cells remain]\n    C --> N{Immune response too strong?}\n    N -->|Yes| O[Cytokine storm damages organs]\n    N -->|No| L",
    "expanded_text": "The immune response to a virus begins when a virus enters the body. Macrophages (innate immune cells) recognize and engulf the viruses. They release cytokines, which trigger inflammation and fever. If the virus spreads, dendritic cells capture viral antigens and migrate to the lymph nodes. There, they activate helper T cells. Helper T cells then activate both B cells and cytotoxic T cells. B cells produce antibodies that neutralize the virus. Cytotoxic T cells kill infected cells. After the infection is cleared, memory B cells and memory T cells remain in the body to enable a faster response to future infections. However, if the immune response is too strong, it can cause a cytokine storm, which leads to organ damage.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["conditional branches", "parallel activation", "feedback loop (memory)", "pathological branch"]
    }
  },
  {
    "input_text": "Project timeline for launching a mobile app: Month 1 - Requirements gathering and wireframing. Month 2 - UI/UX design and backend setup. Month 3 - Frontend development starts. Month 4 - API integration and internal alpha testing. Month 5 - Bug fixing and beta testing with 100 users. Month 6 - Final polish, App Store submission, and marketing prep. Month 7 - Launch week: press release, app goes live, monitoring for crashes. Month 8 - Post-launch: collect reviews, first feature update planning.",
    "mermaid": "graph LR\n    A[Month1: Requirements & wireframing] --> B[Month2: UI/UX design & backend setup]\n    B --> C[Month3: Frontend development]\n    C --> D[Month4: API integration & alpha testing]\n    D --> E[Month5: Bug fix & beta test with 100 users]\n    E --> F[Month6: Final polish, store submission, marketing prep]\n    F --> G[Month7: Launch week - press, go-live, monitor crashes]\n    G --> H[Month8: Collect reviews, plan first update]",
    "expanded_text": "The mobile app launch project spans 8 months. Month 1 is dedicated to requirements gathering and wireframing. Month 2 involves UI/UX design and backend setup. Month 3: frontend development begins. Month 4: API integration and internal alpha testing occur. Month 5: bug fixing and beta testing with 100 external users. Month 6: final polish, App Store submission, and marketing preparation. Month 7 is launch week: a press release is issued, the app goes live, and the team monitors for crashes. Month 8: post-launch activities including collecting user reviews and planning the first feature update.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "low",
      "graph_features": ["sequential dependencies"]
    }
  },
  {
    "input_text": "A hiring process for a software engineer: Recruiter screens resume. If no relevant experience, reject. If yes, send a coding assessment (HackerRank). If score < 70%, reject. If >=70%, schedule technical phone screen. If phone screen passes, schedule onsite (4 rounds: coding, system design, behavioral, hiring manager). Each round gives a score of 1-5. Minimum passing: coding >=4, system design >=4, behavioral >=3, hiring manager >=3. If any round fails, candidate is rejected but can reapply after 6 months. If all pass, extend offer. If candidate accepts, background check runs. If background check passes, start date set. If fails, offer rescinded.",
    "mermaid": "graph TD\n    A[Recruiter screens resume] --> B{Relevant experience?}\n    B -->|No| C[Reject]\n    B -->|Yes| D[Send HackerRank assessment]\n    D --> E{Score >= 70%?}\n    E -->|No| C\n    E -->|Yes| F[Technical phone screen]\n    F --> G{Pass?}\n    G -->|No| C\n    G -->|Yes| H[Onsite: 4 rounds]\n    H --> I[Coding round score 1-5]\n    H --> J[System design score 1-5]\n    H --> K[Behavioral score 1-5]\n    H --> L[Hiring manager score 1-5]\n    I --> M{Coding >= 4?}\n    J --> N{System design >= 4?}\n    K --> O{Behavioral >= 3?}\n    L --> P{Hiring manager >= 3?}\n    M -->|No| Q[Reject, can reapply in 6 months]\n    N -->|No| Q\n    O -->|No| Q\n    P -->|No| Q\n    M -->|Yes| R{All rounds passed?}\n    N -->|Yes| R\n    O -->|Yes| R\n    P -->|Yes| R\n    R -->|Yes| S[Extend offer]\n    S --> T{Candidate accepts?}\n    T -->|No| C\n    T -->|Yes| U[Background check]\n    U --> V{Pass?}\n    V -->|Yes| W[Set start date]\n    V -->|No| X[Rescind offer]",
    "expanded_text": "The software engineer hiring process begins with a recruiter screening the candidate's resume. If the candidate lacks relevant experience, they are rejected immediately. If they have relevant experience, the recruiter sends a HackerRank coding assessment. A score below 70% leads to rejection; a score of 70% or above moves the candidate to a technical phone screen. If the phone screen is passed, the candidate proceeds to an onsite interview consisting of four rounds: coding, system design, behavioral, and hiring manager. Each round is scored from 1 to 5. Passing thresholds are: coding >=4, system design >=4, behavioral >=3, and hiring manager >=3. If any round fails, the candidate is rejected but may reapply after 6 months. If all four rounds pass, the company extends an offer. If the candidate accepts, a background check is conducted. If the background check passes, a start date is set. If the background check fails, the offer is rescinded.",
    "metadata": {
      "domain": "HR workflows",
      "complexity": "high",
      "graph_features": ["conditional branches", "multiple decision nodes", "thresholds", "cool-down period"]
    }
  },
  {
    "input_text": "A user wants to send a direct message to another user on a social platform. First, check if they are friends. If not, check if the recipient allows DMs from strangers. If yes, message goes to 'Requests' folder. If no, message blocked. If friends, check if the recipient has muted the sender. If muted, message goes to hidden folder, no notification. If not muted, deliver normally. Also check for spam content: if message contains a link and sender is not verified, flag as spam and hold for review. If spam review passes, deliver. If flagged, block.",
    "mermaid": "graph TD\n    A[User sends DM] --> B{Friends?}\n    B -->|Yes| C{Recipient muted sender?}\n    C -->|Yes| D[Move to hidden folder, no notification]\n    C -->|No| E[Check spam content]\n    B -->|No| F{Recipient allows DMs from strangers?}\n    F -->|Yes| G[Move to Requests folder]\n    G --> E\n    F -->|No| H[Block message]\n    E --> I{Contains link AND sender not verified?}\n    I -->|Yes| J[Flag as spam, hold for review]\n    J --> K{Spam review passes?}\n    K -->|Yes| L[Deliver normally]\n    K -->|No| M[Block permanently]\n    I -->|No| L",
    "expanded_text": "When a user sends a direct message to another user, the platform first checks if they are friends. If they are friends, it checks whether the recipient has muted the sender. If muted, the message goes to a hidden folder with no notification. If not muted, the system proceeds to a spam content check. If the users are not friends, the system checks if the recipient allows direct messages from strangers. If not, the message is blocked. If allowed, the message goes to the recipient's Requests folder, then undergoes the spam check. The spam check examines whether the message contains a link and whether the sender is a verified account. If both conditions are true, the message is flagged as spam and placed on hold for manual review. If the spam review passes, the message is delivered normally; if the review fails, the message is permanently blocked. If the message does not contain a link or the sender is verified, it is delivered normally without spam flagging.",
    "metadata": {
      "domain": "social interactions",
      "complexity": "medium",
      "graph_features": ["conditional branches", "spam filtering", "moderation hold"]
    }
  },
  {
    "input_text": "A data pipeline for a recommendation system. Step 1: Collect user click events from Kafka. Step 2: Join with user profile data from Redis. Step 3: Filter out events from bots (user_agent contains 'bot'). Step 4: Aggregate clicks per user per item over 1-hour windows (Flink). Step 5: Update item popularity scores in Cassandra. Step 6: Trigger ML model training every 6 hours using the aggregated data. Step 7: Model outputs new recommendations, stored in Redis cache. Step 8: API serves recommendations from cache. If cache miss, fallback to precomputed popular items. Monitor latency: if any step takes > 200ms, alert to Slack.",
    "mermaid": "graph TD\n    A[Kafka: user click events] --> B[Join with Redis user profile]\n    B --> C[Filter bot events]\n    C --> D[Flink: aggregate per user per item, 1h windows]\n    D --> E[Update Cassandra: item popularity]\n    E --> F[Every 6h: trigger ML model training]\n    F --> G[Model outputs recommendations]\n    G --> H[Store in Redis cache]\n    H --> I[API serves from cache]\n    I --> J{Cache hit?}\n    J -->|Yes| K[Return recommendations]\n    J -->|No| L[Fallback to popular items]\n    L --> K\n    D --> M{Latency > 200ms?}\n    E --> M\n    F --> M\n    M -->|Yes| N[Alert to Slack]",
    "expanded_text": "The recommendation system data pipeline begins by collecting user click events from Apache Kafka. These events are joined with user profile data stored in Redis. Next, events from bots are filtered out based on user agent strings containing 'bot'. The filtered events are aggregated per user per item over 1-hour windows using Apache Flink. The aggregated data is used to update item popularity scores in Cassandra. Every 6 hours, the pipeline triggers training of the machine learning model using the aggregated data. The trained model outputs new recommendations, which are stored in a Redis cache. The API serves recommendations directly from the cache. If a cache miss occurs, the API falls back to serving precomputed popular items. A monitoring system checks the latency of each step; if any step exceeds 200 milliseconds, an alert is sent to a Slack channel.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["data pipeline", "sequential flows", "parallel monitoring", "fallback", "alerting"]
    }
  },
  {
    "input_text": "A bank processes a loan application. Applicant fills out form with income, credit score, loan amount. System checks credit score: if < 580, auto-reject. If 580-669, require collateral. If 670-739, standard approval with rate 7%. If 740+, prime rate 5%. Then debt-to-income (DTI) check: if DTI > 43%, reject or require co-signer. For amounts > $50k, require income verification (upload W2). If income verification fails, reject. If passes, underwriting manually reviews within 48 hours. If approved, generate closing documents. If rejected, send adverse action letter explaining reasons.",
    "mermaid": "graph TD\n    A[Applicant submits loan form] --> B[Check credit score]\n    B --> C{Score < 580?}\n    C -->|Yes| D[Auto-reject]\n    C -->|No| E{Score 580-669?}\n    E -->|Yes| F[Require collateral]\n    E -->|No| G{Score 670-739?}\n    G -->|Yes| H[Standard approval, 7% rate]\n    G -->|No| I[Score >=740: prime rate 5%]\n    F --> J[Check DTI]\n    H --> J\n    I --> J\n    J --> K{DTI > 43%?}\n    K -->|Yes| L{Loan amount > $50k?}\n    L -->|Yes| M[Reject or require co-signer]\n    L -->|No| N[Reject]\n    K -->|No| O{Amount > $50k?}\n    O -->|Yes| P[Require income verification: upload W2]\n    O -->|No| Q[Underwriting manual review within 48h]\n    P --> R{Income verified?}\n    R -->|No| S[Reject]\n    R -->|Yes| Q\n    Q --> T{Underwriting approves?}\n    T -->|Yes| U[Generate closing documents]\n    T -->|No| V[Send adverse action letter]",
    "expanded_text": "A bank processes a loan application after the applicant submits a form with income, credit score, and loan amount. The system checks the credit score. Below 580 results in auto-rejection. From 580 to 669, collateral is required. From 670 to 739, standard approval at a 7% interest rate. For scores of 740 or above, the prime rate of 5% applies. Next, the debt-to-income (DTI) ratio is checked. If DTI exceeds 43%, the loan is rejected unless a co-signer is provided (only for amounts over $50k). If DTI is acceptable, and the loan amount is over $50,000, income verification via uploaded W2 is required; if verification fails, the loan is rejected. If income verification passes, or if the loan amount is $50k or less, underwriting performs a manual review within 48 hours. If underwriting approves, closing documents are generated. If underwriting rejects, an adverse action letter explaining the reasons is sent to the applicant.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["conditional branches", "credit score tiers", "manual review", "income verification"]
    }
  },
  {
    "input_text": "A team is debugging a production issue. First, check logs in Datadog for error messages around the time of incident. If error found, search internal knowledge base for known solution. If solution exists, apply hotfix. If no known solution, reproduce in staging environment. If reproducible, developer writes unit test that fails, then fixes code. If not reproducible, add more logging and deploy to canary. Monitor canary for 1 hour. If error reappears, rollback and escalate to senior engineer. If no error, gradually roll to 100% production.",
    "mermaid": "graph TD\n    A[Production incident detected] --> B[Check Datadog logs]\n    B --> C{Error found?}\n    C -->|No| D[Add more logging, deploy to canary]\n    D --> E[Monitor canary for 1 hour]\n    E --> F{Error reappears?}\n    F -->|Yes| G[Rollback, escalate to senior engineer]\n    F -->|No| H[Gradually roll to 100% production]\n    C -->|Yes| I[Search internal KB for known solution]\n    I --> J{Known solution exists?}\n    J -->|Yes| K[Apply hotfix]\n    J -->|No| L[Reproduce in staging]\n    L --> M{Reproducible?}\n    M -->|Yes| N[Write unit test that fails, fix code]\n    N --> H\n    M -->|No| D",
    "expanded_text": "The team debugs a production issue by first checking Datadog logs for error messages around the time of the incident. If an error is found, they search the internal knowledge base for a known solution. If a known solution exists, they apply a hotfix. If no known solution exists, they attempt to reproduce the issue in a staging environment. If reproducible, a developer writes a unit test that fails (to capture the bug), then fixes the code. If not reproducible in staging, they add more logging and deploy the current code to a canary environment. The canary is monitored for one hour. If the error reappears in canary, they rollback the change and escalate the issue to a senior engineer. If the error does not appear, they gradually roll the canary deployment to 100% of production traffic.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["conditional branches", "reproduction loop", "canary deployment", "escalation"]
    }
  },
  {
    "input_text": "An environmental science process: Carbon cycle in a forest. Trees absorb CO2 during photosynthesis. They store carbon in biomass (leaves, wood, roots). When trees die, decomposers break down organic matter, releasing CO2 back to atmosphere. During a forest fire, stored carbon is rapidly released as CO2. Some carbon becomes soil organic matter, stored long-term. Deforestation transfers carbon to the atmosphere faster than regrowth can absorb. Reforestation increases carbon capture. The system has a feedback loop: higher CO2 increases photosynthesis (up to a limit), which increases biomass, which can increase decomposition if temperatures rise.",
    "mermaid": "graph TD\n    A[Atmospheric CO2] -->|Photosynthesis| B[Trees absorb carbon]\n    B -->|Store in biomass| C[Leaves, wood, roots]\n    C -->|Tree death| D[Decomposers break down matter]\n    D -->|Respiration| A\n    C -->|Forest fire| E[Rapid CO2 release]\n    E --> A\n    C -->|Partial decay| F[Soil organic matter long-term storage]\n    F -->|Slow decomposition| A\n    C -->|Deforestation| G[Faster release than regrowth]\n    G --> A\n    A -->|Reforestation| H[Increased capture]\n    H --> B\n    A -->|Higher CO2| I[Increased photosynthesis rate up to limit]\n    I --> B\n    I -->|Warm temperatures| J[Increased decomposition rate]\n    J --> A",
    "expanded_text": "The carbon cycle in a forest begins with atmospheric CO2. Trees absorb CO2 during photosynthesis and store the carbon in biomass such as leaves, wood, and roots. When trees die, decomposers break down the organic matter and release CO2 back to the atmosphere through respiration. During a forest fire, stored carbon is rapidly released as CO2. Some carbon from partially decayed matter becomes soil organic matter, which is stored for long periods before slow decomposition returns CO2 to the atmosphere. Deforestation transfers carbon to the atmosphere faster than regrowth can absorb it. Reforestation increases carbon capture, feeding back into tree biomass. A positive feedback loop exists: higher atmospheric CO2 increases the rate of photosynthesis up to a certain limit, which increases biomass. However, if temperatures rise, the rate of decomposition also increases, which can release more CO2 back to the atmosphere, partially counteracting the benefit.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["feedback loop", "parallel pathways", "conditional limits", "long-term storage"]
    }
  },
  {
    "input_text": "Describe our full incident management process following ITIL best practices when a major production incident occurs.",
    "mermaid": "flowchart TD\n    Detect[Incident Detected] --> Log[Log & Categorize]\n    Log --> Prioritize[Prioritize by Impact]\n    Prioritize --> Assign[Assign to Resolution Team]\n    Assign --> Diagnose[Root Cause Diagnosis]\n    Diagnose --> Workaround{Workaround Available?}\n    Workaround -->|Yes| Implement[Implement Temporary Fix]\n    Workaround -->|No| Resolve[Permanent Resolution]\n    Implement --> Communicate[Stakeholder Communication]\n    Resolve --> Test[Test & Verify]\n    Test --> Close[Close Incident]\n    Close --> Postmortem[Post-Incident Review]",
    "expanded_text": "When a major incident is detected, it is immediately logged and categorized. The team prioritizes based on business impact and assigns appropriate resources. Diagnosis identifies the root cause while exploring workarounds. Temporary fixes are implemented when permanent solutions take longer. Throughout the process, stakeholders receive clear communication. After resolution and verification, the incident is closed followed by a formal post-mortem to prevent recurrence.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["incident lifecycle", "decision branching", "communication flow", "post-mortem loop"]
    }
  },
  {
    "input_text": "How does our recommendation system for an e-learning platform adapt to different student learning patterns and goals?",
    "mermaid": "flowchart TD\n    Profile[Student Profile & Goals] --> History[Learning History Analysis]\n    History --> Behavior[Real-time Behavior Tracking]\n    Behavior --> Knowledge[Knowledge Gap Detection]\n    Knowledge --> Style[Learning Style Preference]\n    Style --> Generate[Generate Recommendations]\n    Generate --> Deliver[Deliver Personalized Content]\n    Deliver --> Feedback[Implicit & Explicit Feedback]\n    Feedback --> Update[Update Student Model]\n    Update --> Profile",
    "expanded_text": "The system maintains rich student profiles including goals and past performance. It analyzes historical data alongside real-time learning behaviors to detect knowledge gaps and preferred learning styles. Personalized content recommendations are generated and delivered. Continuous feedback from interactions refines the model, creating a dynamic, continuously improving personalization loop.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["adaptive system", "feedback loop", "multi-factor personalization"]
    }
  },
  {
    "input_text": "Explain the M&A due diligence process our firm follows when evaluating potential acquisition targets.",
    "mermaid": "flowchart TD\n    NDA[NDA Signed] --> DataRoom[Access Virtual Data Room]\n    DataRoom --> Financial[Financial Due Diligence]\n    Financial --> Legal[Legal & Compliance Review]\n    Legal --> Operational[Operational Due Diligence]\n    Operational --> Technical[Technical & IP Assessment]\n    Technical --> HR[HR & Cultural Assessment]\n    HR --> Risk[Risk & Contingent Liabilities]\n    Risk --> Valuation[Valuation & Synergy Analysis]\n    Valuation --> Committee[Investment Committee Decision]\n    Committee --> Proceed{Proceed?}\n    Proceed -->|Yes| Negotiation[Negotiation Phase]\n    Proceed -->|No| Exit[Exit Process]",
    "expanded_text": "The due diligence process starts after signing an NDA and gaining access to the data room. Teams conduct parallel reviews covering financials, legal matters, operations, technology and IP, human resources, and cultural fit. Risk assessment and valuation with synergy calculations inform the investment committee. Positive decisions lead to negotiations, while negative ones trigger a structured exit.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["multi-stream due diligence", "parallel reviews", "decision gate"]
    }
  },
  {
    "input_text": "What is the complete player onboarding and progression system in our battle royale game?",
    "mermaid": "flowchart TD\n    Register[Player Registration] --> Tutorial[Interactive Tutorial]\n    Tutorial --> Placement[Skill-Based Placement Matches]\n    Placement --> Rank[Initial Rank Assignment]\n    Rank --> Matches[Play Matches]\n    Matches --> Rewards[Seasonal Rewards & Battle Pass]\n    Rewards --> Progression[Skill & Rank Progression]\n    Progression --> Events[Limited Time Events]\n    Events --> Cosmetics[Cosmetic Unlocks]\n    Cosmetics --> Matches\n    Progression --> Leaderboard[Global Leaderboards]",
    "expanded_text": "New players go through registration and an engaging tutorial before skill-based placement matches determine their initial rank. Regular matches earn rewards through the battle pass system. Skill progression unlocks better competition tiers while limited-time events provide cosmetic rewards. The system continuously feeds back into matchmaking and leaderboard competition.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["progression system", "seasonal loops", "skill-based matchmaking"]
    }
  },
  {
    "input_text": "Outline the process for developing and launching a new consumer packaged goods product from idea to shelf.",
    "mermaid": "flowchart TD\n    Idea[Product Idea] --> Research[Market & Consumer Research]\n    Research --> Concept[Concept Development]\n    Concept --> Prototype[Prototype Creation]\n    Prototype --> Testing[Consumer Testing]\n    Testing --> Formulation[Final Formulation]\n    Formulation --> Packaging[Packaging Design]\n    Packaging --> Regulatory[Regulatory Approval]\n    Regulatory --> Production[Scale Manufacturing]\n    Production --> Distribution[Distribution Network]\n    Distribution --> Launch[Market Launch]\n    Launch --> Monitor[Post-Launch Performance]",
    "expanded_text": "New CPG product development starts with idea generation backed by market research. Concepts are developed and prototyped, followed by consumer testing. Successful ideas move to final formulation, packaging design, and regulatory approvals. Manufacturing is scaled up and distribution networks prepared before the official market launch. Post-launch monitoring determines success and necessary adjustments.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["product development lifecycle", "sequential gates", "parallel testing"]
    }
  },
  {
    "input_text": "How does our hospital handle emergency triage during a mass casualty incident?",
    "mermaid": "flowchart TD\n    Arrival[Patients Arrive] --> Triage[Triage Officer Assessment]\n    Triage --> Category{Categorization}\n    Category -->|Immediate| Resus[Resuscitation Area]\n    Category -->|Delayed| Treatment[Treatment Area]\n    Category -->|Minimal| Waiting[Waiting Area]\n    Category -->|Expectant| Palliative[Palliative Care]\n    Resus --> Stabilize[Stabilize & Transfer]\n    Treatment --> Monitor[Monitor & Treat]\n    Waiting --> Reassess[Periodic Reassessment]\n    Stabilize --> OR[Operating Room if Needed]",
    "expanded_text": "In mass casualty events, arriving patients are rapidly assessed by a triage officer and assigned categories: Immediate, Delayed, Minimal, or Expectant. Immediate cases go to resuscitation, while others move to appropriate treatment or waiting areas. Continuous reassessment ensures patients receive timely care as their condition changes. Critical patients may proceed directly to operating rooms after initial stabilization.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["emergency protocol", "categorization branching", "dynamic reassessment"]
    }
  },
  {
    "input_text": "Describe the multi-cloud architecture decision process our infrastructure team uses when selecting between AWS, Azure, and GCP for new workloads.",
    "mermaid": "flowchart TD\n    Workload[New Workload Requirements] --> Assess[Assess Technical Needs]\n    Assess --> Cost[Cost Analysis]\n    Cost --> Compliance[Compliance & Security Requirements]\n    Compliance --> Latency[Latency & Performance]\n    Latency --> Team[Team Expertise]\n    Team --> Strategy{Cloud Strategy Alignment}\n    Strategy --> Multi[Multi-Cloud Considerations]\n    Multi --> Decision[Final Decision]\n    Decision --> POC[Proof of Concept]\n    POC --> Approve[Architecture Approval]",
    "expanded_text": "For new workloads, the team evaluates technical requirements, cost implications, compliance needs, latency constraints, and existing team expertise. These factors are weighed against the overall cloud strategy, including multi-cloud considerations. A decision leads to a proof of concept before final architectural approval. This structured approach ensures optimal technology selection.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["decision framework", "multi-criteria evaluation", "assessment workflow"]
    }
  },
  {
    "input_text": "How do we manage the annual performance review and calibration process across the entire organization?",
    "mermaid": "flowchart TD\n    Self[Self Assessment] --> Manager[Manager Review]\n    Manager --> Peer[Peer Feedback Collection]\n    Peer --> Calibration[Department Calibration]\n    Calibration --> Company[Company-Wide Calibration]\n    Company --> Final[Final Ratings]\n    Final --> Meeting[Performance Review Meeting]\n    Meeting --> Development[Development Plan]\n    Development --> Compensation[Compensation Decisions]\n    Compensation --> Archive[Archive Records]",
    "expanded_text": "The performance process starts with employee self-assessment followed by manager evaluation and peer feedback. Multiple levels of calibration ensure fairness and consistency across departments and the company. Final ratings lead to one-on-one review meetings where development plans are created. These outcomes directly inform compensation decisions before records are archived.",
    "metadata": {
      "domain": "HR",
      "complexity": "high",
      "graph_features": ["multi-stage review", "calibration process", "organizational alignment"]
    }
  },
  {
    "input_text": "Explain the feedback loop and continuous improvement mechanism in our customer success platform.",
    "mermaid": "flowchart TD\n    Usage[Customer Usage Data] --> Health[Customer Health Score]\n    Health --> Signals[Risk & Opportunity Signals]\n    Signals --> Action[Automated + Human Actions]\n    Action --> Touchpoint[Customer Touchpoints]\n    Touchpoint --> Feedback[Collect Feedback]\n    Feedback --> Analyze[Sentiment & Theme Analysis]\n    Analyze --> Product[Product Feedback to Engineering]\n    Product --> Improve[Product Improvements]\n    Improve --> Usage",
    "expanded_text": "The platform continuously collects usage data to calculate health scores and identify risks or expansion opportunities. These signals trigger both automated and human interventions. Customer interactions generate feedback which undergoes sentiment and thematic analysis. Insights flow to the product team for improvements that ultimately enhance customer usage, closing the virtuous improvement cycle.",
    "metadata": {
      "domain": "customer support",
      "complexity": "high",
      "graph_features": ["closed feedback loop", "predictive signals", "cross-team integration"]
    }
  },
  {
    "input_text": "Describe the end-to-end international trade finance process for issuing a letter of credit.",
    "mermaid": "flowchart TD\n    Request[Buyer Requests LC] --> Application[Bank Application]\n    Application --> Review[Compliance & Risk Review]\n    Review --> Approval[Credit Approval]\n    Approval --> Issue[Issue Letter of Credit]\n    Issue --> Advise[Advise to Seller's Bank]\n    Advise --> Ship[Goods Shipment]\n    Ship --> Documents[Document Presentation]\n    Documents --> Examination[Document Examination]\n    Examination --> Payment[Payment to Seller]\n    Payment --> Release[Release Documents to Buyer]",
    "expanded_text": "International trade finance via letter of credit starts when the buyer submits an application to their bank. After compliance, risk, and credit reviews, the LC is approved and issued. The seller's bank is advised and goods are shipped. The seller presents documents which undergo strict examination. Upon compliance, payment is made to the seller and shipping documents are released to the buyer.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["trade finance workflow", "document-heavy process", "compliance gates"]
    }
  },
  {
    "input_text": "After our team finishes coding a new feature, we run unit tests, then integration tests, followed by a code review. If the review passes, we merge to staging where QA tests it. Any bugs send it back to development. Once QA approves, it moves to production.",
    "mermaid": "flowchart TD\n    Code[Feature Coding Complete] --> Unit[Run Unit Tests]\n    Unit --> Integration[Run Integration Tests]\n    Integration --> Review[Peer Code Review]\n    Review -->|Pass| Staging[Deploy to Staging]\n    Review -->|Fail| Fix[Fix Issues]\n    Staging --> QATest[QA Testing]\n    QATest -->|Bugs Found| Fix\n    QATest -->|Pass| Production[Deploy to Production]",
    "expanded_text": "The feature development workflow starts after coding is complete. Unit tests are executed first, followed by integration tests. A peer code review must pass before deploying to the staging environment. QA then performs thorough testing. Any discovered bugs loop back to the development team for fixes. Only after QA approval does the feature reach production.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["sequential flow", "approval gates", "feedback loop"]
    }
  },
  {
    "input_text": "When choosing a university, students usually research programs, compare rankings and fees, visit campuses if possible, talk to current students, consider location and campus life, then submit applications before the deadline.",
    "mermaid": "flowchart TD\n    Start[Begin University Search] --> Research[Research Programs & Courses]\n    Research --> Compare[Compare Rankings, Fees & Reputation]\n    Compare --> Visit[Campus Visits]\n    Visit --> Talk[Talk to Students & Alumni]\n    Talk --> Factors[Evaluate Location & Campus Life]\n    Factors --> Shortlist[Create Shortlist]\n    Shortlist --> Apply[Submit Applications]",
    "expanded_text": "The university selection process begins with broad research into available programs. Students then compare rankings, tuition fees, and institutional reputation. Campus visits and conversations with current students provide real insight. Important factors like location and campus culture are weighed carefully before creating a final shortlist and submitting applications before deadlines.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["decision process", "multi-criteria evaluation"]
    }
  },
  {
    "input_text": "My morning routine is quite fixed. I wake up, drink water, do 20 minutes of yoga, take a shower, prepare breakfast while listening to news, eat, then check my calendar and start work.",
    "mermaid": "flowchart TD\n    Wake[Wake Up] --> Hydrate[Drink Water]\n    Hydrate --> Yoga[20min Yoga]\n    Yoga --> Shower[Morning Shower]\n    Shower --> Prep[Prepare Breakfast + News]\n    Prep --> Eat[Eat Breakfast]\n    Eat --> Plan[Check Calendar]\n    Plan --> Work[Start Workday]",
    "expanded_text": "The daily morning routine flows smoothly from waking up and immediately hydrating. This is followed by a 20-minute yoga session for physical and mental preparation. After showering, breakfast is prepared while catching up on news. Eating leads to reviewing the day's calendar before officially beginning work.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["sequential routine"]
    }
  },
  {
    "input_text": "Our content approval workflow requires the writer to submit the draft, editor reviews for quality and tone, legal checks compliance issues, marketing approves messaging, and only then can it be published.",
    "mermaid": "flowchart TD\n    Submit[Writer Submits Draft] --> Editor[Editor Review]\n    Editor --> Legal[Legal Compliance Check]\n    Legal --> Marketing[Marketing Approval]\n    Marketing --> Final{All Approved?}\n    Final -->|Yes| Publish[Publish Content]\n    Final -->|No| Revise[Return for Revisions]",
    "expanded_text": "Content creation follows a strict multi-stage approval process. After the writer submits the draft, the editor reviews it for quality, clarity, and tone. Legal then examines it for compliance risks. Marketing ensures the messaging aligns with brand guidelines. Only when all parties approve does the content get published. Otherwise, it returns for revisions.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["approval system", "sequential reviews"]
    }
  },
  {
    "input_text": "When a customer complains about a delayed delivery, our support team first verifies the order details, then checks tracking status. If the package is stuck, we contact the courier. We update the customer at every step and offer compensation if the delay exceeds our policy.",
    "mermaid": "flowchart TD\n    Complaint[Customer Reports Delay] --> Verify[Verify Order Details]\n    Verify --> Track[Check Tracking Status]\n    Track --> Stuck{Delivery Stuck?}\n    Stuck -->|Yes| Courier[Contact Courier]\n    Stuck -->|No| Update[Update Customer]\n    Courier --> Resolution[Resolve with Courier]\n    Resolution --> Compensate{Delay > Policy?}\n    Compensate -->|Yes| Offer[Offer Compensation]\n    Compensate -->|No| Close[Close Ticket]",
    "expanded_text": "Customer complaints about delayed deliveries are handled systematically. The support team first verifies order information and checks current tracking status. If the package appears stuck, they proactively contact the courier partner. The customer receives updates throughout. If the delay exceeds policy thresholds, appropriate compensation is offered before closing the case.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["troubleshooting flow", "conditional actions"]
    }
  },
  {
    "input_text": "Building financial models involves gathering historical data, making assumptions about growth, creating projections, running sensitivity analysis, reviewing with stakeholders, and finalizing the model with clear documentation.",
    "mermaid": "flowchart TD\n    Gather[Collect Historical Data] --> Assumptions[Define Key Assumptions]\n    Assumptions --> Build[Build Financial Projections]\n    Build --> Sensitivity[Run Sensitivity Analysis]\n    Sensitivity --> Review[Stakeholder Review]\n    Review --> Revise{Needs Changes?}\n    Revise -->|Yes| Assumptions\n    Revise -->|No| Document[Finalize & Document]",
    "expanded_text": "Financial model development starts with collecting reliable historical data and establishing reasonable assumptions about future growth. The core projections are then built and tested through sensitivity analysis. Stakeholders review the model, often triggering revisions that loop back to assumptions. Once finalized, the model is properly documented for transparency and future use.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["iterative process", "feedback loop"]
    }
  },
  {
    "input_text": "Sarah wants to confront her roommate about the messy kitchen but is worried about creating tension. She decides to wait until both are calm, prepare her points, choose a good time, and suggest a cleaning schedule together.",
    "mermaid": "flowchart TD\n    Issue[Messy Kitchen Problem] --> Wait[Wait for Calm Moment]\n    Wait --> Prepare[Prepare Talking Points]\n    Prepare --> Timing[Choose Right Time]\n    Timing --> Conversation[Have Honest Discussion]\n    Conversation --> Suggest[Propose Cleaning Schedule]\n    Suggest --> Agree{Mutual Agreement?}\n    Agree -->|Yes| Implement[Implement Plan]\n    Agree -->|No| Adjust[Adjust Approach]",
    "expanded_text": "Sarah approaches the roommate conflict thoughtfully. She waits for a calm moment before preparing her key points. Choosing an appropriate time, she initiates a respectful conversation and suggests creating a shared cleaning schedule. The goal is reaching mutual agreement and implementing a sustainable solution while preserving their relationship.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["conflict resolution", "emotional consideration"]
    }
  },
  {
    "input_text": "The machine learning model training process includes data collection, cleaning, feature engineering, splitting datasets, training multiple algorithms, hyperparameter tuning, evaluation, and deployment if performance criteria are met.",
    "mermaid": "flowchart TD\n    Collect[Data Collection] --> Clean[Data Cleaning]\n    Clean --> Features[Feature Engineering]\n    Features --> Split[Train-Test Split]\n    Split --> Train[Model Training]\n    Train --> Tune[Hyperparameter Tuning]\n    Tune --> Evaluate[Performance Evaluation]\n    Evaluate --> Criteria{Meets Criteria?}\n    Criteria -->|Yes| Deploy[Deploy Model]\n    Criteria -->|No| Retrain[Return to Training]",
    "expanded_text": "Machine learning model development follows several critical stages. After collecting raw data, it is cleaned and transformed through feature engineering. The dataset is split for training and testing. Multiple algorithms are trained and optimized via hyperparameter tuning. Rigorous evaluation determines if the model meets required performance criteria. Successful models move to deployment while others loop back for further improvement.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["ML pipeline", "iteration loop"]
    }
  },
  {
    "input_text": "To plan a successful product launch, we coordinate marketing campaigns, prepare sales training, finalize technical documentation, set up customer support readiness, and align all teams through regular sync meetings.",
    "mermaid": "flowchart TD\n    Planning[Launch Planning] --> Parallel[Parallel Preparations]\n    Parallel --> Marketing[Marketing Campaign Setup]\n    Parallel --> Sales[Sales Team Training]\n    Parallel --> Docs[Technical Documentation]\n    Parallel --> Support[Customer Support Readiness]\n    Marketing --> Sync[Cross-team Sync Meetings]\n    Sales --> Sync\n    Docs --> Sync\n    Support --> Sync\n    Sync --> Launch[Product Launch]",
    "expanded_text": "Product launch preparation involves multiple parallel streams of work. Marketing develops campaigns while sales receives training. Technical teams complete documentation and customer support prepares for incoming queries. Regular cross-functional sync meetings ensure alignment. All activities converge toward the coordinated product launch date.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["parallel tasks", "coordination points"]
    }
  },
  {
    "input_text": "When troubleshooting a slow internet connection, I first restart the router, then check cables, test speed on different devices, scan for malware, and finally contact my ISP if the problem continues.",
    "mermaid": "flowchart TD\n    Issue[Slow Internet Reported] --> Restart[Restart Router]\n    Restart --> Cables[Check Physical Connections]\n    Cables --> SpeedTest[Run Speed Tests]\n    SpeedTest --> Devices[Test Multiple Devices]\n    Devices --> Malware[Scan for Malware]\n    Malware --> ISP{Problem Persists?}\n    ISP -->|Yes| Contact[Contact ISP]\n    ISP -->|No| Resolved[Issue Resolved]",
    "expanded_text": "Slow internet troubleshooting follows a logical escalation path. The first step is restarting the router. Physical cable connections are then verified. Speed tests are conducted across multiple devices to isolate the issue. A malware scan is performed as a precaution. If the problem remains unresolved after these steps, the internet service provider is contacted for further assistance.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["troubleshooting scenario", "sequential diagnostics"]
    }
  },
  {
    "input_text": "A user signs up for a newsletter. They enter their email. System checks if email is valid format (contains @ and .). If invalid, show error and ask again. If valid, check if email already subscribed. If yes, notify user 'Already subscribed'. If no, send confirmation email with a unique link. User clicks link within 24 hours. If clicked, mark as confirmed and add to mailing list. If not clicked within 24 hours, delete the pending record.",
    "mermaid": "graph TD\n    A[User enters email] --> B{Email valid format?}\n    B -->|No| C[Show error, ask again]\n    C --> A\n    B -->|Yes| D{Email already subscribed?}\n    D -->|Yes| E[Notify: Already subscribed]\n    D -->|No| F[Send confirmation email with unique link]\n    F --> G[User clicks link within 24 hours?]\n    G -->|Yes| H[Mark confirmed, add to mailing list]\n    G -->|No| I[Delete pending record]",
    "expanded_text": "The newsletter signup process begins when a user enters their email address. The system first checks whether the email has a valid format (contains an '@' symbol and a domain with a dot). If invalid, an error message is shown and the user is prompted to re-enter their email. If valid, the system checks whether the email is already subscribed. If already subscribed, the user is notified and the process ends. If not subscribed, the system sends a confirmation email containing a unique link. The user must click the link within 24 hours. If the link is clicked within the time limit, the email is marked as confirmed and added to the mailing list. If not clicked within 24 hours, the pending subscription record is deleted.",
    "metadata": {
      "domain": "marketing",
      "complexity": "low",
      "graph_features": ["conditional branches", "loop (retry on invalid)", "timeout"]
    }
  },
  {
    "input_text": "A warehouse robot receives a command to pick an item. First, navigate to shelf location using LiDAR. If path is blocked, wait 5 seconds and retry up to 3 times. After 3 failures, report blockage and switch to idle. If shelf reached, scan barcode. If barcode matches target, grasp item. If grasp fails, retry once. If still fails, mark item as 'stuck' and alert human. If grasp succeeds, move to packing station. Drop item into bin. Return to home position. Log all actions to central server.",
    "mermaid": "graph TD\n    A[Command: pick item] --> B[Navigate to shelf using LiDAR]\n    B --> C{Path blocked?}\n    C -->|Yes| D[Wait 5 seconds, retry count++]\n    D --> E{Retry count < 3?}\n    E -->|Yes| B\n    E -->|No| F[Report blockage, switch to idle]\n    C -->|No| G[Scan barcode]\n    G --> H{Barcode matches target?}\n    H -->|No| F\n    H -->|Yes| I[Attempt grasp]\n    I --> J{Grasp successful?}\n    J -->|No| K[Retry once]\n    K --> L{Still fails?}\n    L -->|Yes| M[Mark item stuck, alert human]\n    L -->|No| N[Move to packing station]\n    J -->|Yes| N\n    N --> O[Drop item into bin]\n    O --> P[Return to home position]\n    P --> Q[Log all actions to server]",
    "expanded_text": "A warehouse robot receives a command to pick an item. It first navigates to the shelf location using LiDAR sensors. If the path is blocked, the robot waits 5 seconds and retries the navigation up to 3 times. After 3 failed attempts, it reports a blockage and switches to idle mode. If the shelf is reached successfully, the robot scans the barcode on the item. If the barcode does not match the target item, the robot reports the issue and goes idle. If it matches, the robot attempts to grasp the item. If the grasp fails, it retries once. If still fails, the item is marked as 'stuck' and a human is alerted. If the grasp succeeds, the robot moves to the packing station, drops the item into a bin, returns to its home position, and logs all actions to the central server.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "retries with limit", "alerting"]
    }
  },
  {
    "input_text": "A student is late for class. The teacher asks for a reason. If the reason is valid (e.g., doctor's note, family emergency), teacher accepts it and marks 'excused late'. If not valid, teacher marks 'unexcused late' and deducts participation points. After three unexcused lates, a detention is issued. The student can appeal a detention to the principal. If principal overturns, detention removed. If not, student serves detention. Parents are notified after each unexcused late.",
    "mermaid": "graph TD\n    A[Student is late] --> B[Teacher asks for reason]\n    B --> C{Reason valid?}\n    C -->|Yes| D[Accept, mark excused late]\n    C -->|No| E[Mark unexcused late, deduct points]\n    E --> F[Notify parents]\n    F --> G{Unexcused late count >= 3?}\n    G -->|Yes| H[Issue detention]\n    G -->|No| I[End]\n    H --> J{Student appeals to principal?}\n    J -->|Yes| K{Principal overturns?}\n    K -->|Yes| L[Detention removed]\n    K -->|No| M[Serve detention]\n    J -->|No| M",
    "expanded_text": "When a student is late for class, the teacher asks for a reason. If the reason is considered valid (such as a doctor's note or a family emergency), the teacher accepts it and marks the late as 'excused'. If the reason is not valid, the teacher marks it as 'unexcused late' and deducts participation points. After each unexcused late, parents are notified. If the student accumulates three unexcused lates, a detention is issued. The student may appeal the detention to the principal. If the principal overturns the detention, it is removed. If the principal upholds it, the student must serve the detention.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["conditional branches", "accumulation threshold", "appeal process"]
    }
  },
  {
    "input_text": "A user wants to download a large file. The browser first checks local cache. If file exists and not expired (last-modified < 7 days), serve from cache. If not in cache or expired, send a GET request to server with If-None-Match header. Server checks ETag. If ETag matches, return 304 Not Modified, browser uses cache. If ETag doesn't match, server returns 200 with new file. Browser saves to cache with new ETag. If download fails due to network error, retry up to 3 times with exponential backoff (1s, 2s, 4s). After 3 failures, show 'Download failed' message.",
    "mermaid": "graph TD\n    A[User requests large file] --> B{In cache and not expired?}\n    B -->|Yes| C[Serve from cache]\n    B -->|No| D[Send GET with If-None-Match header]\n    D --> E[Server checks ETag]\n    E --> F{ETag matches?}\n    F -->|Yes| G[304 Not Modified, use cache]\n    F -->|No| H[200 OK, send new file]\n    H --> I[Save to cache with new ETag]\n    G --> C\n    I --> J[Download complete]\n    D --> K{Network error?}\n    K -->|Yes| L[Retry with backoff: 1s,2s,4s]\n    L --> M{Retries < 3?}\n    M -->|Yes| D\n    M -->|No| N[Show 'Download failed']",
    "expanded_text": "When a user requests a large file, the browser first checks its local cache. If the file exists and has not expired (last-modified date within the last 7 days), it serves the file directly from cache. If the file is not in cache or has expired, the browser sends a GET request to the server with an If-None-Match header containing the ETag. The server checks the ETag. If the ETag matches the current version, the server returns a 304 Not Modified response, and the browser uses the cached version. If the ETag does not match, the server returns a 200 OK response with the new file, and the browser saves it to cache with the new ETag. If a network error occurs during the request, the browser retries up to 3 times using exponential backoff (1 second, 2 seconds, 4 seconds). After 3 failed retries, the browser displays a 'Download failed' message.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["conditional branches", "cache validation", "retry with backoff"]
    }
  },
  {
    "input_text": "A coffee shop loyalty program: Customer buys a coffee. System adds 1 stamp. After 5 stamps, customer gets a free coffee. Free coffee redemptions reset stamp count to 0. If customer refers a friend, they get 2 bonus stamps. Bonus stamps count toward free coffee. Stamps expire 30 days after last purchase. If expired, reset to 0. Customer can check stamp balance via app. If balance >=5, app shows 'Free coffee ready'.",
    "mermaid": "graph TD\n    A[Customer buys coffee] --> B[Add 1 stamp]\n    B --> C{Stamps >= 5?}\n    C -->|Yes| D[Free coffee available]\n    D --> E[Customer redeems free coffee]\n    E --> F[Reset stamp count to 0]\n    C -->|No| G[Keep stamps]\n    A --> H{Customer refers a friend?}\n    H -->|Yes| I[Add 2 bonus stamps]\n    I --> C\n    G --> J{Last purchase > 30 days?}\n    J -->|Yes| K[Stamps expire, reset to 0]\n    J -->|No| L[Stamps valid]\n    K --> M[App shows balance]\n    L --> M\n    M --> N{Balance >= 5?}\n    N -->|Yes| O[Show 'Free coffee ready']\n    N -->|No| P[Show current stamp count]",
    "expanded_text": "The coffee shop loyalty program works as follows: When a customer buys a coffee, the system adds 1 stamp. If the customer refers a friend, they receive 2 bonus stamps. Both regular and bonus stamps count toward a free coffee. When the stamp balance reaches 5 or more, the customer is eligible for a free coffee. Upon redemption, the stamp count resets to 0. Stamps expire 30 days after the customer's last purchase; if there is no purchase within 30 days, the stamp balance resets to 0. Customers can check their stamp balance via the app. If the balance is 5 or greater, the app displays a 'Free coffee ready' message; otherwise, it shows the current stamp count.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["conditional branches", "accumulation", "expiration logic", "bonus mechanism"]
    }
  },
  {
    "input_text": "An incident response playbook for a data breach: Step 1: Identify breached systems and isolate them from the network. Step 2: Preserve forensic evidence (logs, memory images). Step 3: Notify CISO and legal within 1 hour. Step 4: Determine if PII was exposed. If yes, notify affected customers within 72 hours (GDPR). If no, internal notification only. Step 5: Eradicate the threat: remove malware, patch vulnerabilities. Step 6: Recover systems from clean backups. Step 7: Monitor for 30 days for signs of re-compromise. If re-compromise detected, repeat from Step 1. After 30 days clean, close incident and write post-mortem report.",
    "mermaid": "graph TD\n    A[Data breach detected] --> B[Identify and isolate breached systems]\n    B --> C[Preserve forensic evidence: logs, memory]\n    C --> D[Notify CISO and legal within 1h]\n    D --> E{PII exposed?}\n    E -->|Yes| F[Notify affected customers within 72h (GDPR)]\n    E -->|No| G[Internal notification only]\n    F --> H[Eradicate threat: remove malware, patch]\n    G --> H\n    H --> I[Recover from clean backups]\n    I --> J[Monitor for 30 days]\n    J --> K{Re-compromise detected?}\n    K -->|Yes| B\n    K -->|No| L[Close incident, write post-mortem]",
    "expanded_text": "The data breach incident response follows a structured playbook. First, the breached systems are identified and isolated from the network to prevent further spread. Second, forensic evidence including logs and memory images is preserved. Third, the CISO and legal department are notified within one hour. Fourth, the response team determines if personally identifiable information (PII) was exposed. If yes, affected customers are notified within 72 hours to comply with GDPR; if no, only internal notification is made. Fifth, the threat is eradicated by removing malware and patching vulnerabilities. Sixth, systems are recovered from clean backups. Seventh, the team monitors for 30 days to detect any signs of re-compromise. If re-compromise is detected, the process repeats from isolation. If no re-compromise is detected after 30 days, the incident is closed and a post-mortem report is written.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branch", "monitoring loop", "regulatory compliance"]
    }
  },
  {
    "input_text": "A user wants to apply for a job on a company website. They upload their resume. System parses the resume and extracts skills, experience, education. If years of experience < 2 for entry-level role, auto-reject with feedback. If experience >=2, check if required skills (e.g., Python, SQL) are present. If missing key skills, move to 'maybe' pile for recruiter review. If key skills present, schedule an online assessment. Assessment score > 70% passes. If pass, move to hiring manager review. If fail, reject. Hiring manager can approve or reject. If approve, send interview invite. If reject, send rejection email.",
    "mermaid": "graph TD\n    A[User uploads resume] --> B[Parse resume: skills, experience, education]\n    B --> C{Experience >= 2 years?}\n    C -->|No| D[Auto-reject with feedback]\n    C -->|Yes| E{Required skills present? (Python, SQL)}\n    E -->|No| F[Move to 'maybe' pile for recruiter review]\n    E -->|Yes| G[Schedule online assessment]\n    G --> H{Assessment score > 70%?}\n    H -->|No| I[Reject]\n    H -->|Yes| J[Hiring manager review]\n    J --> K{Manager approves?}\n    K -->|Yes| L[Send interview invite]\n    K -->|No| M[Send rejection email]",
    "expanded_text": "A job applicant uploads their resume to the company website. The system parses the resume to extract skills, years of experience, and education. If the applicant has less than 2 years of experience for an entry-level role, they are auto-rejected with feedback. If experience is 2 years or more, the system checks whether the required skills (Python and SQL) are present. If key skills are missing, the application is moved to a 'maybe' pile for a recruiter to review manually. If the required skills are present, the system schedules an online assessment. If the assessment score is 70% or lower, the applicant is rejected. If the score exceeds 70%, the application proceeds to hiring manager review. The hiring manager can either approve (sending an interview invite) or reject (sending a rejection email).",
    "metadata": {
      "domain": "HR workflows",
      "complexity": "medium",
      "graph_features": ["conditional branches", "skill matching", "assessment threshold", "manual review"]
    }
  },
  {
    "input_text": "A smart thermostat adjusts temperature based on occupancy and time. If motion sensor detects no movement for 30 minutes, enter 'Away' mode: set temp to 62°F in winter, 78°F in summer. When motion detected again, resume 'Home' mode: 68°F winter, 74°F summer. At 10 PM, regardless of occupancy, enter 'Sleep' mode: 60°F winter, 72°F summer. At 6 AM, return to 'Home' mode. If user manually overrides via app, hold manual temp for 2 hours, then revert to scheduled mode. Outside temperature below 20°F triggers 'Freeze protect' mode (55°F) to prevent pipe freezing.",
    "mermaid": "graph TD\n    A[Thermostat running] --> B{Motion detected in last 30 min?}\n    B -->|No| C[Away mode: winter 62°F, summer 78°F]\n    B -->|Yes| D[Home mode: winter 68°F, summer 74°F]\n    C --> E[Motion detected?]\n    E -->|Yes| D\n    D --> F{Time = 10 PM?}\n    F -->|Yes| G[Sleep mode: winter 60°F, summer 72°F]\n    F -->|No| H{Time = 6 AM?}\n    H -->|Yes| D\n    H -->|No| I{User manual override?}\n    I -->|Yes| J[Set manual temp for 2 hours]\n    J --> K[After 2h, revert to scheduled mode]\n    I -->|No| L{Outside temp < 20°F?}\n    L -->|Yes| M[Freeze protect: 55°F]\n    L -->|No| A",
    "expanded_text": "The smart thermostat continuously monitors occupancy and time. If no motion is detected for 30 minutes, it enters 'Away' mode, setting the temperature to 62°F in winter or 78°F in summer. When motion is detected again, it resumes 'Home' mode (68°F winter, 74°F summer). At 10 PM, regardless of occupancy, it switches to 'Sleep' mode (60°F winter, 72°F summer). At 6 AM, it returns to 'Home' mode. If the user manually overrides the temperature via the app, the manual setting is held for 2 hours, after which the thermostat reverts to the scheduled mode. Additionally, if the outside temperature drops below 20°F, a 'Freeze protect' mode is triggered, setting the temperature to 55°F to prevent pipes from freezing.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["state transitions", "time-based triggers", "manual override with timeout", "exception condition"]
    }
  },
  {
    "input_text": "A customer wants to return a product bought online. They log into their account and go to 'My Orders'. They select the order and click 'Return'. System checks return window: 30 days from delivery. If outside window, show 'Return not allowed'. If within window, ask for reason. If reason is 'defective', generate prepaid shipping label. If reason is 'changed mind', customer pays return shipping. Customer prints label, packs item, drops off at carrier. When item received at warehouse, inspected. If defective and within warranty, issue full refund. If changed mind and item unopened, issue refund minus shipping. If opened, deduct 15% restocking fee. Refund issued to original payment method within 5 business days.",
    "mermaid": "graph TD\n    A[Customer clicks Return on order] --> B{Within 30 days of delivery?}\n    B -->|No| C[Show: Return not allowed]\n    B -->|Yes| D[Ask for reason]\n    D --> E{Reason = defective?}\n    E -->|Yes| F[Generate prepaid shipping label]\n    E -->|No| G[Customer pays return shipping]\n    F --> H[Customer prints label, packs, drops off]\n    G --> H\n    H --> I[Warehouse receives and inspects]\n    I --> J{Defective and in warranty?}\n    J -->|Yes| K[Full refund]\n    J -->|No| L{Changed mind & unopened?}\n    L -->|Yes| M[Refund minus shipping cost]\n    L -->|No| N[Opened: deduct 15% restocking fee]\n    K --> O[Issue refund to original payment method within 5 business days]\n    M --> O\n    N --> O",
    "expanded_text": "A customer initiates a return for a product bought online. After logging into their account and selecting the order, they click 'Return'. The system checks the return window: 30 days from delivery. If outside the window, a 'Return not allowed' message is shown. If within the window, the customer is asked for the return reason. If the reason is 'defective', a prepaid shipping label is generated. If the reason is 'changed mind', the customer pays for return shipping. The customer prints the label, packs the item, and drops it off at a carrier. When the warehouse receives the item, it is inspected. If the item is defective and still under warranty, a full refund is issued. If the customer changed their mind and the item is unopened, a refund is issued minus the shipping cost. If the item was opened, a 15% restocking fee is deducted. The refund is issued to the original payment method within 5 business days.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["conditional branches", "inspection logic", "refund tiers"]
    }
  },
  {
    "input_text": "A driver uses a ride-hailing app. They open the app and enter destination. App shows estimated fare and nearby drivers. Driver selects a ride type (economy, premium). App finds a driver. If no driver available, show 'Try again later' and notify when one becomes available. If driver found, app confirms booking and shows driver ETA. Passenger waits. If driver arrives and passenger is not at pickup after 5 minutes, driver can cancel and charge waiting fee. If passenger cancels before driver arrival, fee applies after 2 minutes. After trip ends, passenger rates driver (1-5 stars). Driver rates passenger. Payment is auto-charged from saved card.",
    "mermaid": "graph TD\n    A[Open app, enter destination] --> B[Show fare and nearby drivers]\n    B --> C[Select ride type: economy/premium]\n    C --> D{Driver available?}\n    D -->|No| E[Show 'Try again later', notify when available]\n    D -->|Yes| F[Confirm booking, show driver ETA]\n    F --> G[Passenger waits]\n    G --> H{Driver arrives, passenger not at pickup after 5 min?}\n    H -->|Yes| I[Driver cancels, charge waiting fee]\n    H -->|No| J[Passenger cancels before driver arrival?]\n    J -->|Yes| K{Cancel after 2 minutes?}\n    K -->|Yes| L[Charge cancellation fee]\n    K -->|No| M[No fee]\n    J -->|No| N[Trip proceeds, drop off]\n    N --> O[Passenger rates driver 1-5 stars]\n    O --> P[Driver rates passenger]\n    P --> Q[Auto-charge payment from saved card]",
    "expanded_text": "A driver uses a ride-hailing app by opening it and entering a destination. The app displays an estimated fare and shows nearby available drivers. The driver selects a ride type (economy or premium). The app attempts to find a driver. If no driver is available, the app shows 'Try again later' and notifies the driver when one becomes available. If a driver is found, the app confirms the booking and shows the driver's estimated time of arrival (ETA). The passenger waits. If the driver arrives and the passenger is not at the pickup location after 5 minutes, the driver can cancel and charge a waiting fee. If the passenger cancels before the driver arrives, a fee applies only if the cancellation occurs after 2 minutes have passed. After the trip ends, the passenger rates the driver from 1 to 5 stars, and the driver rates the passenger. Payment is automatically charged from the passenger's saved card.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["conditional branches", "time-based fees", "mutual rating", "auto-payment"]
    }
  },
  {
    "input_text": "When our warehouse receives a new shipment, staff first inspect the goods for damage, then update inventory in the system, sort items by category, store them in designated locations, and notify the procurement team if any discrepancies are found.",
    "mermaid": "flowchart TD\n    Receive[Shipment Arrival] --> Inspect[Inspect for Damage]\n    Inspect --> Update[Update Inventory System]\n    Update --> Sort[Sort by Category]\n    Sort --> Store[Place in Designated Locations]\n    Store --> Check{Discrepancies Found?}\n    Check -->|Yes| Notify[Notify Procurement Team]\n    Check -->|No| Complete[Mark Shipment Complete]",
    "expanded_text": "The warehouse intake process begins upon shipment arrival. Staff perform a thorough inspection for damage, followed by system updates to reflect new stock. Items are sorted by category and placed in their proper storage locations. A final check identifies any discrepancies, triggering procurement notification when necessary, ensuring inventory accuracy.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["sequential flow", "conditional check"]
    }
  },
  {
    "input_text": "The process of writing a research paper starts with choosing a topic, conducting literature review, collecting data, analyzing results, writing the draft, getting peer feedback, and revising before final submission.",
    "mermaid": "flowchart TD\n    Topic[Choose Research Topic] --> Literature[Conduct Literature Review]\n    Literature --> Data[Collect & Organize Data]\n    Data --> Analysis[Analyze Results]\n    Analysis --> Draft[Write Initial Draft]\n    Draft --> Feedback[Seek Peer Review]\n    Feedback --> Revise[Revise Manuscript]\n    Revise --> Submit[Final Submission]",
    "expanded_text": "Academic research paper writing follows a methodical sequence. After selecting a focused topic, researchers perform an extensive literature review. Data collection and analysis form the core, leading to the first draft. Peer feedback highlights areas for improvement before thorough revisions. The polished manuscript is then ready for submission to a journal or conference.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["sequential workflow", "feedback stage"]
    }
  },
  {
    "input_text": "Every time I set a new fitness goal, I create a workout plan, track my progress daily, adjust intensity based on how I feel, celebrate small wins, and occasionally restart when I lose motivation.",
    "mermaid": "flowchart TD\n    Goal[Set New Fitness Goal] --> Plan[Create Workout Plan]\n    Plan --> Track[Daily Progress Tracking]\n    Track --> Adjust{Adjust Intensity}\n    Adjust --> Celebrate[Celebrate Small Wins]\n    Celebrate --> Motivation{Motivated?}\n    Motivation -->|No| Restart[Restart Plan]\n    Motivation -->|Yes| Continue[Continue Routine]",
    "expanded_text": "Pursuing fitness goals involves creating a structured workout plan followed by consistent daily tracking. Intensity is adjusted based on physical feedback. Celebrating milestones helps maintain momentum. When motivation dips, the individual often restarts the plan, forming a flexible but cyclical approach to long-term habit building.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["feedback loop", "motivation branching"]
    }
  },
  {
    "input_text": "Our hiring team screens resumes, conducts initial phone interviews, schedules technical assessments, holds panel interviews, checks references, and makes final offers only after all stages are cleared.",
    "mermaid": "flowchart TD\n    Resume[Resume Screening] --> Phone[Initial Phone Interview]\n    Phone --> Technical[Technical Assessment]\n    Technical --> Panel[Panel Interview]\n    Panel --> Reference[Reference Checks]\n    Reference --> Decision{Final Decision}\n    Decision -->|Positive| Offer[Extend Offer]\n    Decision -->|Negative| Reject[Send Rejection]",
    "expanded_text": "The recruitment process is multi-layered to ensure quality hires. It starts with resume screening, followed by phone interviews to gauge fit. Technical assessments test required skills, while panel interviews evaluate cultural alignment. Reference checks provide external validation. Only after completing all stages does the team make a final hiring decision and extend an offer.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["multi-stage filtering", "sequential gates"]
    }
  },
  {
    "input_text": "When debugging a crashing mobile app, developers first reproduce the issue, check crash logs, identify the problematic code section, fix the bug, run tests, and then release a new version after verification.",
    "mermaid": "flowchart TD\n    Crash[App Crash Reported] --> Reproduce[Reproduce the Issue]\n    Reproduce --> Logs[Analyze Crash Logs]\n    Logs --> Identify[Locate Problematic Code]\n    Identify --> Fix[Implement Fix]\n    Fix --> Test[Run Regression Tests]\n    Test --> Verify{Stable?}\n    Verify -->|Yes| Release[Release New Version]\n    Verify -->|No| Identify",
    "expanded_text": "Mobile app crash debugging follows a systematic approach. Developers begin by reproducing the issue consistently. Crash logs and stack traces help pinpoint the faulty code. Once identified, a fix is implemented and thoroughly tested. Only when verification confirms stability is the updated version released to users.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["troubleshooting loop", "verification step"]
    }
  },
  {
    "input_text": "To prepare for final exams, students review lecture notes, summarize key concepts, practice past papers, form study groups, take mock tests, and focus on weak areas before the actual exam day.",
    "mermaid": "flowchart TD\n    Start[Exam Preparation Begins] --> Review[Review Lecture Notes]\n    Review --> Summarize[Create Summaries]\n    Summarize --> Practice[Solve Past Papers]\n    Practice --> Group[Study Group Discussions]\n    Group --> Mock[Take Mock Tests]\n    Mock --> Weak[Identify Weak Areas]\n    Weak --> Focus[Focused Revision]\n    Focus --> Exam[Exam Day]",
    "expanded_text": "Effective final exam preparation is an iterative process. Students start by reviewing comprehensive lecture notes and creating concise summaries. They practice with past papers and discuss concepts in study groups. Mock tests reveal knowledge gaps, leading to targeted revision of weak areas. This builds confidence heading into the actual examinations.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["iterative preparation", "self-assessment"]
    }
  },
  {
    "input_text": "The loan approval system checks applicant credit score, verifies income documents, evaluates debt-to-income ratio, assesses collateral if applicable, and then makes a final approval decision.",
    "mermaid": "flowchart TD\n    Application[Loan Application Submitted] --> Credit[Check Credit Score]\n    Credit --> Income[Verify Income Documents]\n    Income --> Ratio[Calculate Debt-to-Income Ratio]\n    Ratio --> Collateral[Assess Collateral if Needed]\n    Collateral --> Decision{Final Approval?}\n    Decision -->|Yes| Approve[Approve Loan]\n    Decision -->|No| Reject[Reject Application]",
    "expanded_text": "Loan processing involves several risk assessment stages. The system first pulls the applicant's credit history, followed by income verification. Debt-to-income ratio calculation provides insight into repayment capacity. For secured loans, collateral valuation is performed. All factors contribute to the final automated or manual approval decision.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["risk assessment flow", "multi-factor decision"]
    }
  },
  {
    "input_text": "Managing a software project requires gathering requirements, creating timelines, assigning tasks to developers, conducting regular sprint reviews, handling changes, and delivering the final product to the client.",
    "mermaid": "flowchart TD\n    Gather[Requirements Gathering] --> Plan[Create Project Timeline]\n    Plan --> Assign[Assign Tasks]\n    Assign --> Execute[Development Sprints]\n    Execute --> Review[Sprint Reviews]\n    Review --> Changes{Change Requests?}\n    Changes -->|Yes| Adjust[Adjust Scope & Timeline]\n    Changes -->|No| Deliver[Final Delivery]",
    "expanded_text": "Software project management follows a structured path from initial requirements gathering to timeline creation and task assignment. During development sprints, regular reviews help track progress. Change requests are evaluated and may require scope or timeline adjustments. The project culminates in successful delivery to the client.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["project management", "change handling"]
    }
  },
  {
    "input_text": "When planning a surprise anniversary trip, I research destinations, check flight prices, book accommodation secretly, arrange activities, set a budget, and coordinate with friends for alibis.",
    "mermaid": "flowchart TD\n    Idea[Decide on Surprise Trip] --> Research[Research Destinations]\n    Research --> Flights[Compare Flight Prices]\n    Flights --> Book[Book Flights & Hotel Secretly]\n    Book --> Activities[Plan Activities]\n    Activities --> Budget[Set & Track Budget]\n    Budget --> Alibi[Coordinate Alibis with Friends]\n    Alibi --> Execute[Execute Surprise]",
    "expanded_text": "Organizing a surprise anniversary trip demands careful planning. Destination research leads to comparing flight options and secretly booking accommodations. Thoughtful activities are selected while maintaining a strict budget. Coordinating with friends ensures a believable alibi. All elements come together for the successful surprise execution.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["planning workflow", "secrecy considerations"]
    }
  },
  {
    "input_text": "Our cybersecurity team follows a standard procedure when responding to a phishing email report: isolate the affected account, investigate the source, scan for malware, reset credentials, educate the user, and update threat filters.",
    "mermaid": "flowchart TD\n    Report[Phishing Email Reported] --> Isolate[Isolate Affected Account]\n    Isolate --> Investigate[Investigate Source]\n    Investigate --> Scan[Malware Scan]\n    Scan --> Reset[Reset Credentials]\n    Reset --> Educate[User Security Training]\n    Educate --> Update[Update Email Filters]\n    Update --> Monitor[Monitor for Follow-up Attacks]",
    "expanded_text": "Phishing incident response starts with immediate account isolation to limit damage. The team investigates the email source and performs malware scans on affected systems. Credentials are reset as a precaution. The user receives targeted security education while email security filters are updated. Ongoing monitoring helps prevent similar future attacks.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["incident response", "sequential containment"]
    }
  },
  {
    "input_text": "When a user reports a bug in our mobile app, the support team reproduces the issue, collects device logs, assigns it to the development team with priority, developers fix it, QA verifies the fix, and then it is included in the next release.",
    "mermaid": "flowchart TD\n    Report[Bug Reported by User] --> Reproduce[Support Reproduces Issue]\n    Reproduce --> Logs[Collect Device Logs]\n    Logs --> Assign[Assign to Development Team]\n    Assign --> Fix[Developers Implement Fix]\n    Fix --> QAVerify[QA Verifies Fix]\n    QAVerify --> Release[Include in Next Update]",
    "expanded_text": "The bug handling process starts when a user submits a report. Support first tries to reproduce the issue and gathers relevant device and environment logs. The ticket is then assigned to developers with appropriate priority. After the code fix is implemented, QA performs verification. Once confirmed resolved, the fix is bundled into the next app release.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["sequential workflow", "handover points"]
    }
  },
  {
    "input_text": "To bake a chocolate cake, I preheat the oven, mix dry ingredients, mix wet ingredients separately, combine them carefully, pour into pans, bake for 30 minutes, cool completely, and then frost the layers.",
    "mermaid": "flowchart TD\n    Start[Start Recipe] --> Preheat[Preheat Oven]\n    Preheat --> Dry[Mix Dry Ingredients]\n    Dry --> Wet[Mix Wet Ingredients]\n    Wet --> Combine[Combine Mixtures]\n    Combine --> Pour[Pour into Cake Pans]\n    Pour --> Bake[Bake 30 Minutes]\n    Bake --> Cool[Cool Completely]\n    Cool --> Frost[Frost Layers]",
    "expanded_text": "Baking a chocolate cake follows a precise sequence. The oven is preheated first while dry ingredients like flour and cocoa are mixed. Wet ingredients are prepared separately before being gently combined to avoid overmixing. The batter is poured into prepared pans and baked. After cooling, the layers are assembled and frosted.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["sequential process"]
    }
  },
  {
    "input_text": "Our quarterly budget planning involves department heads submitting proposals, finance reviewing them, consolidation of all requests, executive review with adjustments, final approval by the board, and then allocation to departments.",
    "mermaid": "flowchart TD\n    Submit[Departments Submit Proposals] --> Review[Finance Team Review]\n    Review --> Consolidate[Consolidate All Budgets]\n    Consolidate --> Executive[Executive Leadership Review]\n    Executive --> Adjust[Make Adjustments]\n    Adjust --> Board[Board Final Approval]\n    Board --> Allocate[Allocate Funds to Departments]",
    "expanded_text": "Quarterly budget planning is a collaborative top-down process. Department heads submit detailed proposals which finance initially reviews. All requests are consolidated into a company-wide view. Executive leadership examines the total and makes strategic adjustments before seeking final board approval. Once approved, funds are distributed back to the respective departments.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["approval hierarchy"]
    }
  },
  {
    "input_text": "The photosynthesis process in plants involves light absorption by chlorophyll, splitting of water molecules, generation of ATP and NADPH, carbon fixation in the Calvin cycle, and production of glucose as the final output.",
    "mermaid": "flowchart TD\n    Light[Light Absorption by Chlorophyll] --> Split[Water Splitting]\n    Split --> Energy[Generate ATP and NADPH]\n    Energy --> Calvin[Calvin Cycle - Carbon Fixation]\n    Calvin --> Glucose[Produce Glucose]",
    "expanded_text": "Photosynthesis is a two-stage biochemical process. Light energy is first absorbed by chlorophyll, leading to the splitting of water molecules and release of oxygen. This generates energy carriers ATP and NADPH. These power the Calvin cycle where carbon dioxide is fixed and ultimately converted into glucose for the plant's energy needs.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["scientific process", "sequential stages"]
    }
  },
  {
    "input_text": "When planning our wedding, we first set a date, create a guest list, choose a venue, hire vendors, send invitations, arrange catering and decor, and finally confirm all details two weeks before the event.",
    "mermaid": "flowchart TD\n    Date[Set Wedding Date] --> GuestList[Create Guest List]\n    GuestList --> Venue[Book Venue]\n    Venue --> Vendors[Hire Photographers & Vendors]\n    Vendors --> Invites[Send Invitations]\n    Invites --> Arrange[Arrange Catering & Decor]\n    Arrange --> Confirm[Final Confirmation Two Weeks Before]",
    "expanded_text": "Wedding planning is a major coordination effort. It begins with selecting a meaningful date and compiling the guest list. The venue is secured early, followed by hiring key vendors. Invitations are sent once details are confirmed. Catering, decorations, and other arrangements follow. A final confirmation round ensures everything is ready two weeks before the celebration.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["event planning", "dependency chain"]
    }
  },
  {
    "input_text": "Our automated trading system monitors market data, applies technical indicators, evaluates risk parameters, executes trades when conditions are met, and continuously logs all decisions for later analysis.",
    "mermaid": "flowchart TD\n    Monitor[Monitor Market Data] --> Indicators[Apply Technical Indicators]\n    Indicators --> Risk[Evaluate Risk Parameters]\n    Risk --> Conditions{Trading Conditions Met?}\n    Conditions -->|Yes| Execute[Execute Trade]\n    Conditions -->|No| Monitor\n    Execute --> Log[Log Decision & Outcome]",
    "expanded_text": "The algorithmic trading system runs in a continuous loop. It monitors real-time market data and applies multiple technical indicators. Risk parameters are evaluated before any decision. When all conditions align, trades are automatically executed. Every action, whether executed or not, is logged for performance analysis and strategy refinement.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["feedback loop", "conditional execution"]
    }
  },
  {
    "input_text": "To onboard a new client in our consulting firm, we schedule a kickoff meeting, assign a project manager, define scope and deliverables, set up communication channels, create a project timeline, and schedule regular progress reviews.",
    "mermaid": "flowchart TD\n    NewClient[New Client Signed] --> Kickoff[Schedule Kickoff Meeting]\n    Kickoff --> Assign[Assign Project Manager]\n    Assign --> Scope[Define Scope & Deliverables]\n    Scope --> Channels[Set Up Communication Channels]\n    Channels --> Timeline[Create Detailed Timeline]\n    Timeline --> Reviews[Schedule Regular Progress Reviews]",
    "expanded_text": "Client onboarding ensures smooth project starts. After signing, a kickoff meeting aligns expectations. A dedicated project manager is assigned to lead the engagement. The team then jointly defines scope and deliverables, establishes communication protocols, builds a comprehensive timeline, and sets recurring review meetings.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["onboarding workflow"]
    }
  },
  {
    "input_text": "When my anxiety increases, I first notice physical symptoms, then use breathing exercises, reframe negative thoughts, engage in physical activity, talk to a friend, and reflect on what triggered it to prevent future episodes.",
    "mermaid": "flowchart TD\n    Trigger[Anxiety Increase] --> Notice[Notice Physical Symptoms]\n    Notice --> Breathe[Practice Breathing Exercises]\n    Breathe --> Reframe[Reframe Negative Thoughts]\n    Reframe --> Activity[Physical Activity]\n    Activity --> Talk[Talk to Support Person]\n    Talk --> Reflect[Reflect on Triggers]",
    "expanded_text": "Personal anxiety management follows a reliable coping sequence. Upon noticing rising anxiety and its physical signs, breathing techniques are applied first. Cognitive reframing helps shift perspective. Physical movement and reaching out to trusted friends provide relief. Finally, reflection on triggers builds long-term resilience.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["coping mechanism", "sequential response"]
    }
  },
  {
    "input_text": "The code deployment pipeline includes building the application, running automated tests, security scanning, manual approval for production, deploying to servers, and monitoring system health after release.",
    "mermaid": "flowchart TD\n    Build[Build Application] --> Tests[Run Automated Tests]\n    Tests --> Security[Security Scanning]\n    Security --> Approval[Manual Production Approval]\n    Approval --> Deploy[Deploy to Production Servers]\n    Deploy --> Monitor[Monitor System Health]",
    "expanded_text": "The deployment pipeline ensures safe releases. The application is built and subjected to comprehensive automated testing. Security scans check for vulnerabilities. A manual approval gate is required before production deployment. Once live, continuous monitoring tracks system performance and stability.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["deployment pipeline", "approval gate"]
    }
  },
  {
    "input_text": "During a forest fire, firefighters first assess the situation, create containment lines, evacuate nearby residents, deploy aerial support if needed, monitor weather changes, and continue until the fire is fully extinguished.",
    "mermaid": "flowchart TD\n    Report[Fire Reported] --> Assess[Assess Fire Situation]\n    Assess --> Containment[Create Containment Lines]\n    Containment --> Evacuate[Evacuate Residents]\n    Evacuate --> Aerial{Need Aerial Support?}\n    Aerial -->|Yes| DeployAerial[Deploy Helicopters]\n    DeployAerial --> Monitor[Monitor Weather Changes]\n    Aerial -->|No| Monitor\n    Monitor --> Extinguish[Continue Until Fully Extinguished]",
    "expanded_text": "Forest fire response follows critical safety and containment protocols. Initial assessment determines strategy. Containment lines are established while residents are evacuated from danger zones. Aerial support is called when ground efforts need reinforcement. Weather monitoring is constant throughout the operation until the fire is declared fully extinguished.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["emergency response", "conditional actions"]
    }
  },
  {
    "input_text": "Our monthly financial closing process starts with reconciling all bank accounts, followed by reviewing outstanding invoices, adjusting journal entries, generating financial statements, getting management approval, and finally filing reports with tax authorities.",
    "mermaid": "flowchart TD\n    Start[Month End] --> Reconcile[Reconcile Bank Accounts]\n    Reconcile --> Review[Review Outstanding Invoices]\n    Review --> Adjustments[Record Journal Adjustments]\n    Adjustments --> Statements[Generate Financial Statements]\n    Statements --> Approval[Management Review & Approval]\n    Approval --> File[File Reports with Authorities]",
    "expanded_text": "The monthly financial close is a structured accounting workflow. It begins with bank reconciliations to ensure cash balances match. Outstanding invoices are reviewed and accruals made. Necessary journal adjustments are recorded before generating the complete set of financial statements. Management approval is required prior to official filing with regulatory bodies.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["sequential workflow", "approval gate"]
    }
  },
  {
    "input_text": "When teaching a new math concept, I first explain the theory, show worked examples, let students try practice problems, review common mistakes, provide additional exercises, and finally assess understanding with a quiz.",
    "mermaid": "flowchart TD\n    Theory[Explain Theory] --> Examples[Show Worked Examples]\n    Examples --> Practice[Student Practice Problems]\n    Practice --> Review[Review Common Mistakes]\n    Review --> Exercises[Additional Targeted Exercises]\n    Exercises --> Quiz[Assessment Quiz]",
    "expanded_text": "Effective math instruction follows a scaffolded approach. The teacher begins by clearly explaining the underlying theory, then demonstrates multiple worked examples. Students practice independently while the instructor reviews frequent errors. Additional targeted exercises help reinforce weak areas before a final quiz measures true understanding.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["teaching sequence", "progressive learning"]
    }
  },
  {
    "input_text": "To ship an international order, we first verify the shipping address, prepare customs documentation, pack the items securely, label according to regulations, hand over to the courier, and track until successful delivery.",
    "mermaid": "flowchart TD\n    Order[Order Confirmed] --> Verify[Verify Shipping Address]\n    Verify --> Documents[Prepare Customs Documents]\n    Documents --> Pack[Secure Packaging]\n    Pack --> Label[Apply Required Labels]\n    Label --> Handover[Hand to Courier]\n    Handover --> Track[Track Until Delivery]",
    "expanded_text": "International order fulfillment requires careful compliance steps. The process starts with address verification and customs documentation preparation. Items are then packed securely with appropriate labeling to meet destination country regulations. Once handed to the courier, continuous tracking ensures visibility until the customer receives the package.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["compliance workflow", "sequential execution"]
    }
  },
  {
    "input_text": "My typical evening wind-down routine includes having dinner, watching one episode of a show, reading for 30 minutes, preparing clothes for tomorrow, setting my alarm, and going to bed by 11 PM.",
    "mermaid": "flowchart TD\n    Dinner[Have Dinner] --> Show[Watch One Episode]\n    Show --> Read[Read for 30 Minutes]\n    Read --> Prepare[Prepare Tomorrow Clothes]\n    Prepare --> Alarm[Set Alarm]\n    Alarm --> Sleep[Go to Bed by 11 PM]",
    "expanded_text": "The evening wind-down routine helps ensure restful sleep. It begins with dinner, followed by light entertainment through one TV episode. Reading provides mental relaxation before practical tasks like preparing clothes for the next day and setting an alarm. The routine consistently ends with bedtime by 11 PM.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["personal routine", "sequential habits"]
    }
  },
  {
    "input_text": "The new employee training program consists of orientation day, department shadowing, system access training, compliance modules, hands-on project work, and a 30-day performance review.",
    "mermaid": "flowchart TD\n    Orientation[Company Orientation] --> Shadowing[Department Shadowing]\n    Shadowing --> Systems[System Access Training]\n    Systems --> Compliance[Compliance & Policy Training]\n    Compliance --> HandsOn[Hands-on Project Work]\n    HandsOn --> Review[30-Day Performance Review]",
    "expanded_text": "New employee onboarding is designed as a progressive immersion program. It starts with company-wide orientation, followed by shadowing experienced team members. Employees then receive training on internal systems and mandatory compliance modules. Practical hands-on work builds confidence before a formal 30-day performance review.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["onboarding sequence", "progressive training"]
    }
  },
  {
    "input_text": "When a server goes down, our ops team first checks basic connectivity, restarts the service, examines log files for errors, verifies database connections, checks resource usage, and escalates to senior engineers if unresolved.",
    "mermaid": "flowchart TD\n    Down[Server Down] --> Connectivity[Check Basic Connectivity]\n    Connectivity --> Restart[Restart Service]\n    Restart --> Logs[Review Error Logs]\n    Logs --> Database[Verify Database Connection]\n    Database --> Resources[Check CPU & Memory Usage]\n    Resources --> Escalate{Escalate to Senior?}\n    Escalate -->|Yes| Senior[Escalate to Senior Engineers]",
    "expanded_text": "Server downtime response follows a diagnostic escalation path. The team begins with basic connectivity checks and service restart attempts. Log analysis helps identify root causes. Database connectivity and server resource utilization are examined. If the issue persists, it is promptly escalated to senior engineering staff.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["troubleshooting", "escalation path"]
    }
  },
  {
    "input_text": "Planning a birthday party for a child involves deciding the theme, booking a venue, creating a guest list, ordering food and cake, arranging games and entertainment, and sending out invitations.",
    "mermaid": "flowchart TD\n    Theme[Decide Party Theme] --> Venue[Book Venue]\n    Venue --> GuestList[Create Guest List]\n    GuestList --> Food[Order Food & Cake]\n    Food --> Activities[Arrange Games & Entertainment]\n    Activities --> Invites[Send Invitations]",
    "expanded_text": "Children's birthday party planning requires coordinated steps. The process starts with selecting an engaging theme which influences venue choice. A guest list is prepared next, followed by catering arrangements including the cake. Fun games and entertainment are organized before invitations are sent to ensure good attendance.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["event planning", "dependency order"]
    }
  },
  {
    "input_text": "The immune system responds to infection by first activating innate immunity, then recruiting adaptive immunity cells, producing antibodies, eliminating the pathogen, and creating memory cells for future protection.",
    "mermaid": "flowchart TD\n    Infection[Pathogen Entry] --> Innate[Innate Immunity Activation]\n    Innate --> Adaptive[Recruit Adaptive Immunity]\n    Adaptive --> Antibodies[Produce Antibodies]\n    Antibodies --> Eliminate[Eliminate Pathogen]\n    Eliminate --> Memory[Create Memory Cells]",
    "expanded_text": "The biological immune response is layered. Upon pathogen detection, the fast-acting innate immune system provides immediate defense. This triggers the slower but more specific adaptive immune response. Antibodies are produced to neutralize the threat. Once the pathogen is eliminated, memory cells are formed to enable faster future responses.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["biological process", "sequential stages"]
    }
  },
  {
    "input_text": "Our marketing team runs campaigns by first researching the target audience, creating content, scheduling posts across platforms, monitoring engagement, analyzing performance data, and optimizing future campaigns based on results.",
    "mermaid": "flowchart TD\n    Research[Audience Research] --> Content[Create Campaign Content]\n    Content --> Schedule[Schedule Posts]\n    Schedule --> Monitor[Monitor Engagement]\n    Monitor --> Analyze[Analyze Performance Data]\n    Analyze --> Optimize[Optimize Future Campaigns]",
    "expanded_text": "Successful marketing campaigns follow a data-driven cycle. Thorough audience research informs content creation. Posts are scheduled across multiple platforms. Real-time engagement monitoring leads to detailed performance analysis. Insights gained directly inform optimization strategies for subsequent campaigns.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["campaign cycle", "feedback loop"]
    }
  },
  {
    "input_text": "When negotiating a salary raise, I first gather evidence of my achievements, research industry standards, prepare my talking points, schedule a meeting with my manager, present my case confidently, and discuss possible outcomes.",
    "mermaid": "flowchart TD\n    Prepare[Gather Achievements & Data] --> Research[Research Market Rates]\n    Research --> Points[Prepare Talking Points]\n    Points --> Schedule[Schedule Meeting]\n    Schedule --> Present[Present Case]\n    Present --> Discuss[Discuss Outcomes]",
    "expanded_text": "Negotiating a salary increase requires careful preparation. The employee compiles strong evidence of contributions and researches appropriate compensation benchmarks. Talking points are organized before requesting a formal meeting. During the discussion, the case is presented confidently, followed by open dialogue about potential outcomes and next steps.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["preparation flow", "negotiation process"]
    }
  },
  {
    "input_text": "A customer wants to check their bank balance using an ATM. They insert their debit card. The ATM reads the card and prompts for a PIN. If the PIN is incorrect, the user gets two more attempts. After three failures, the card is retained. If the PIN is correct, the user selects 'Balance Inquiry'. The ATM sends a request to the bank. If the bank responds, the balance is displayed. If there is a network error, the ATM shows an error and ejects the card. After displaying the balance, the ATM asks if the user wants another transaction. If yes, the menu repeats. If no, the card is ejected.",
    "mermaid": "graph TD\n    A[Insert debit card] --> B[ATM reads card, prompt PIN]\n    B --> C{PIN correct?}\n    C -->|No| D[Incorrect count +1]\n    D --> E{Count < 3?}\n    E -->|Yes| B\n    E -->|No| F[Card retained]\n    C -->|Yes| G[Select 'Balance Inquiry']\n    G --> H[Send request to bank]\n    H --> I{Network OK?}\n    I -->|No| J[Show error, eject card]\n    I -->|Yes| K[Display balance]\n    K --> L{Another transaction?}\n    L -->|Yes| G\n    L -->|No| M[Eject card]",
    "expanded_text": "The ATM balance inquiry process begins when the customer inserts their debit card. The ATM reads the card and prompts for a PIN. If the PIN is incorrect, the ATM increments a failure counter. The user gets up to three attempts; after three incorrect PINs, the card is retained by the machine. If the PIN is correct, the user selects 'Balance Inquiry' from the menu. The ATM sends a request to the bank's server. If a network error occurs, the ATM displays an error message and ejects the card. If the bank responds successfully, the balance is displayed on the screen. After showing the balance, the ATM asks if the user wants another transaction. If yes, the menu returns to the transaction selection step (balance inquiry again, or other options). If no, the card is ejected and the session ends.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "retry limit", "loop"]
    }
  },
  {
    "input_text": "An e-commerce order processing system works as follows. When a customer places an order, the system first checks inventory for each item. If any item is out of stock, the entire order is put on hold and the customer is notified to wait or cancel. If all items are in stock, the system reserves the items and processes payment. If payment fails, the customer is asked to provide a new payment method; this can be retried up to two times. After two failures, the order is canceled. If payment succeeds, the system sends a confirmation email and notifies the warehouse to pick and pack the items. Tracking information is generated and sent once the order ships.",
    "mermaid": "graph TD\n    A[Customer places order] --> B[Check inventory per item]\n    B --> C{Any item out of stock?}\n    C -->|Yes| D[Put order on hold, notify customer]\n    D --> E[Customer waits or cancels]\n    C -->|No| F[Reserve items, process payment]\n    F --> G{Payment success?}\n    G -->|No| H[Ask for new payment method]\n    H --> I{Retries < 2?}\n    I -->|Yes| F\n    I -->|No| J[Cancel order]\n    G -->|Yes| K[Send confirmation email]\n    K --> L[Notify warehouse to pick and pack]\n    L --> M[Generate tracking, send when shipped]",
    "expanded_text": "When a customer places an order, the e-commerce system checks inventory for each item in the order. If any item is out of stock, the entire order is put on hold and the customer is notified; they can either wait for restock or cancel. If all items are in stock, the system reserves the items and attempts to process payment. If payment fails, the customer is prompted to provide a new payment method, with up to two retry attempts. After two failures, the order is canceled. If payment succeeds, a confirmation email is sent to the customer, and the warehouse is notified to pick and pack the items. Once the order ships, tracking information is generated and sent to the customer.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "retries", "notification"]
    }
  },
  {
    "input_text": "The process of photosynthesis in plants involves several steps. First, light energy is absorbed by chlorophyll in the leaves. This energy splits water molecules into oxygen, protons, and electrons. Oxygen is released as a byproduct. The electrons travel through an electron transport chain, creating ATP. Meanwhile, carbon dioxide enters the leaf through stomata and combines with RuBP in the Calvin cycle. The ATP and electrons (as NADPH) power the Calvin cycle to produce glucose. If light intensity is too low, the rate of ATP production decreases, slowing glucose synthesis. If carbon dioxide concentration is too low, the Calvin cycle cannot proceed efficiently.",
    "mermaid": "graph TD\n    A[Light energy absorbed by chlorophyll] --> B[Water split into O2, protons, electrons]\n    B --> C[Oxygen released]\n    B --> D[Electrons travel through ETC, produce ATP]\n    E[CO2 enters via stomata] --> F[CO2 combines with RuBP in Calvin cycle]\n    D --> G[ATP and NADPH go to Calvin cycle]\n    F --> H[Calvin cycle uses ATP and NADPH to produce glucose]\n    G --> H\n    A --> I{Light intensity too low?}\n    I -->|Yes| J[ATP production decreases, slower glucose]\n    E --> K{CO2 concentration too low?}\n    K -->|Yes| L[Calvin cycle inefficient]",
    "expanded_text": "Photosynthesis begins when light energy is absorbed by chlorophyll in plant leaves. This energy splits water molecules into oxygen (released as a byproduct), protons, and electrons. The electrons move through an electron transport chain, generating ATP. Meanwhile, carbon dioxide enters the leaf through stomata and combines with RuBP in the Calvin cycle. The ATP and NADPH (derived from the electrons) power the Calvin cycle to produce glucose. If light intensity is too low, ATP production decreases, slowing glucose synthesis. If carbon dioxide concentration is too low, the Calvin cycle cannot proceed efficiently, also reducing glucose output.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["sequential flows", "parallel paths (light and CO2)", "conditional impacts"]
    }
  },
  {
    "input_text": "A software bug report triage process. When a bug is reported, the QA engineer verifies if it's reproducible. If not reproducible, the bug is returned to the reporter for more details. If reproducible, the severity is assessed: Low, Medium, High, or Critical. For Critical bugs, the on-call engineer is paged immediately and a hotfix is started within 1 hour. For High severity, the bug is scheduled for the next sprint. For Medium and Low, it goes to the product backlog. All bugs are assigned a unique ID and tracked in Jira. After a fix is deployed, QA tests the fix. If the fix passes, the bug is closed. If not, it is reopened and reassigned.",
    "mermaid": "graph TD\n    A[Bug reported] --> B[QA verifies reproducible?]\n    B -->|No| C[Return to reporter for details]\n    C --> A\n    B -->|Yes| D[Assess severity]\n    D --> E[Critical]\n    D --> F[High]\n    D --> G[Medium or Low]\n    E --> H[Page on-call engineer, hotfix within 1h]\n    F --> I[Schedule for next sprint]\n    G --> J[Add to product backlog]\n    H --> K[Assign ID, track in Jira]\n    I --> K\n    J --> K\n    K --> L[Deploy fix]\n    L --> M[QA tests fix]\n    M --> N{Test passes?}\n    N -->|Yes| O[Close bug]\n    N -->|No| P[Reopen, reassign to developer]\n    P --> L",
    "expanded_text": "When a bug is reported, QA first verifies whether the bug is reproducible. If not, the bug is returned to the reporter for more details, and the process restarts. If reproducible, the severity is assessed as Critical, High, Medium, or Low. Critical bugs trigger an immediate page to the on-call engineer, and a hotfix must be started within 1 hour. High severity bugs are scheduled for the next development sprint. Medium and Low severity bugs are added to the product backlog for future prioritization. All bugs receive a unique ID and are tracked in Jira. After a fix is deployed, QA performs a regression test. If the test passes, the bug is closed. If it fails, the bug is reopened and reassigned to the developer for another fix.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["conditional branches", "severity tiers", "loop (reopen)", "escalation"]
    }
  },
  {
    "input_text": "A medical prescription refill request process. A patient submits a refill request via the patient portal. The system checks if the prescription has remaining refills. If no refills remain, the request is sent to the doctor for authorization. The doctor can approve or deny. If denied, the patient is notified. If approved, or if refills remain, the pharmacy receives the request. The pharmacist reviews for drug interactions. If an interaction is found, the pharmacist contacts the doctor. If no interaction, the prescription is filled and the patient is notified to pick it up. After 7 days, if the patient has not picked up the medication, the pharmacy sends a reminder.",
    "mermaid": "graph TD\n    A[Patient submits refill request] --> B{Refills remaining?}\n    B -->|Yes| C[Send request to pharmacy]\n    B -->|No| D[Send to doctor for authorization]\n    D --> E{Doctor approves?}\n    E -->|No| F[Notify patient denied]\n    E -->|Yes| C\n    C --> G[Pharmacist checks for drug interactions]\n    G --> H{Interaction found?}\n    H -->|Yes| I[Contact doctor]\n    I --> J[Doctor revises or approves]\n    J --> C\n    H -->|No| K[Fill prescription]\n    K --> L[Notify patient to pick up]\n    L --> M{Not picked up after 7 days?}\n    M -->|Yes| N[Send reminder]\n    M -->|No| O[End]",
    "expanded_text": "A patient requests a prescription refill through the patient portal. The system first checks whether the prescription has remaining refills. If refills remain, the request is sent directly to the pharmacy. If no refills remain, the request is sent to the doctor for authorization; if the doctor denies it, the patient is notified; if approved, the request proceeds to the pharmacy. At the pharmacy, the pharmacist reviews the prescription for potential drug interactions. If an interaction is found, the pharmacist contacts the doctor, who may revise or re-approve the prescription, looping back to the pharmacy. If no interaction is present, the prescription is filled, and the patient is notified to pick up the medication. If the patient has not picked it up after 7 days, the pharmacy sends a reminder.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["conditional branches", "authorization flow", "loop (doctor contact)", "reminder"]
    }
  },
  {
    "input_text": "A gamer tries to defeat a level boss. The boss has two phases. In phase 1, the boss uses basic attacks. The player must dodge and deal damage. When the boss's health drops below 50%, phase 2 begins: the boss summons minions and uses a fire AoE attack every 15 seconds. If the player dies in either phase, they respawn at the checkpoint and must restart the fight from phase 1. After defeating the boss, the player receives a key to unlock the next area. If the player uses a 'shield potion' before the fire AoE, damage is reduced by 50%.",
    "mermaid": "graph TD\n    A[Start boss fight] --> B[Phase 1: basic attacks]\n    B --> C{Dodge and deal damage}\n    C --> D{Boss HP < 50%?}\n    D -->|No| B\n    D -->|Yes| E[Phase 2: summon minions, fire AoE every 15s]\n    E --> F{Player uses shield potion before AoE?}\n    F -->|Yes| G[Damage reduced 50%]\n    F -->|No| H[Full damage]\n    G --> I{Boss defeated?}\n    H --> I\n    I -->|No| E\n    I -->|Yes| J[Receive key to next area]\n    B -.->|Player dies| K[Respawn at checkpoint]\n    E -.->|Player dies| K\n    K --> A",
    "expanded_text": "The boss fight consists of two phases. In Phase 1, the boss uses basic attacks; the player must dodge and deal damage. When the boss's health drops below 50%, Phase 2 begins: the boss summons minions and casts a fire area-of-effect (AoE) attack every 15 seconds. If the player uses a shield potion just before the fire AoE, the damage taken is reduced by 50%; otherwise, full damage is applied. If the player dies during either phase, they respawn at the last checkpoint and must restart the entire fight from Phase 1. Upon defeating the boss, the player receives a key that unlocks the next area of the game.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["state transitions (phases)", "conditional branch (potion use)", "feedback loop (death respawn)"]
    }
  },
  {
    "input_text": "A company's employee onboarding process. HR sends a welcome email with links to complete tax forms and upload a photo for ID. The employee completes the forms online. The system checks that all mandatory fields are filled. If missing, the employee is prompted to complete them. Once complete, IT provisions a laptop and creates accounts (email, Slack, Jira). This happens in parallel. Facilities prepares a desk and access card. When both IT and Facilities are done, HR schedules a 1-hour orientation session. The employee attends orientation. After orientation, the employee is marked 'active' and can start work. If the employee fails to complete forms within 5 days, HR sends a reminder.",
    "mermaid": "graph TD\n    A[HR sends welcome email] --> B[Employee completes tax forms and uploads photo]\n    B --> C{All mandatory fields filled?}\n    C -->|No| D[Prompt employee to complete missing fields]\n    D --> B\n    C -->|Yes| E[Parallel tasks start]\n    E --> F[IT: provision laptop, create accounts]\n    E --> G[Facilities: prepare desk, access card]\n    F --> H[Both done?]\n    G --> H\n    H --> I[HR schedules orientation session]\n    I --> J[Employee attends orientation]\n    J --> K[Mark 'active', start work]\n    B --> L{Forms not complete after 5 days?}\n    L -->|Yes| M[HR sends reminder]\n    M --> B",
    "expanded_text": "The employee onboarding process begins with HR sending a welcome email containing links to complete tax forms and upload a photo for ID. The employee fills out the forms online. The system validates that all mandatory fields are completed; if any are missing, the employee is prompted to correct them. Once the forms are complete, two parallel activities occur: IT provisions a laptop and creates accounts for email, Slack, and Jira; Facilities prepares a desk and an access card. When both IT and Facilities have finished, HR schedules a 1-hour orientation session. The employee attends the orientation, after which they are marked as 'active' and can begin work. If the employee fails to complete the forms within 5 days, HR sends a reminder email, looping back to the form completion step.",
    "metadata": {
      "domain": "HR workflows",
      "complexity": "medium",
      "graph_features": ["sequential flows", "parallel tasks", "conditional branch (missing fields)", "reminder loop"]
    }
  },
  {
    "input_text": "A user wants to reset their password on a social media platform. They click 'Forgot password' and enter their email. The system sends a 6-digit code to that email. The user has 10 minutes to enter the code. If the code is incorrect, they can try again up to 3 times. After 3 failures, the reset is locked for 1 hour. If the code is correct, the user is prompted to enter a new password. The password must be at least 8 characters, with one uppercase letter, one number, and one special character. If the password meets requirements, it is saved and the user is redirected to login. If not, the system shows the requirements and asks again.",
    "mermaid": "graph TD\n    A[Click 'Forgot password', enter email] --> B[Send 6-digit code to email]\n    B --> C[User enters code within 10 min]\n    C --> D{Code correct?}\n    D -->|No| E[Incorrect count +1]\n    E --> F{Count < 3?}\n    F -->|Yes| C\n    F -->|No| G[Lock reset for 1 hour]\n    D -->|Yes| H[Prompt for new password]\n    H --> I[Check password requirements: >=8 chars, uppercase, number, special]\n    I --> J{Password valid?}\n    J -->|No| K[Show requirements, ask again]\n    K --> H\n    J -->|Yes| L[Save password, redirect to login]",
    "expanded_text": "To reset a password, the user clicks 'Forgot password' and enters their email address. The system sends a 6-digit verification code to that email. The user has 10 minutes to enter the code. If the code is incorrect, they can retry up to three times; after three failures, the password reset is locked for 1 hour. If the code is correct, the user is prompted to enter a new password. The password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character. If the password meets the requirements, it is saved and the user is redirected to the login page. If not, the system displays the requirements and asks the user to try again.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches", "retry limit", "time lock", "validation loop"]
    }
  },
  {
    "input_text": "A marketing team runs an A/B test for an email campaign. They split a list of 10,000 subscribers into two equal groups: A and B. Group A receives the original email. Group B receives a variant with a personalized subject line. The system tracks open rates and click-through rates for 7 days. After 7 days, if the variant's click-through rate is at least 5% higher than the original with 95% statistical significance, the variant is adopted as the new baseline. If not significant, the original remains. If the variant is adopted, the team runs another test with a new variant next month. If not, they tweak the variant and retest immediately.",
    "mermaid": "graph TD\n    A[10,000 subscribers] --> B[Split into two equal groups]\n    B --> C[Group A: original email]\n    B --> D[Group B: personalized subject line]\n    C --> E[Track opens and clicks for 7 days]\n    D --> E\n    E --> F{CTR of B >= CTR of A + 5% and p<0.05?}\n    F -->|Yes| G[Adopt variant as new baseline]\n    F -->|No| H[Keep original as baseline]\n    G --> I[Run new test next month]\n    H --> J[Tweak variant and retest immediately]\n    J --> B",
    "expanded_text": "The marketing team conducts an A/B test on an email campaign using 10,000 subscribers divided evenly into two groups. Group A receives the original email, while Group B receives a variant with a personalized subject line. The system tracks open rates and click-through rates (CTR) for a period of 7 days. After 7 days, if the variant's CTR is at least 5% higher than the original's CTR and the result is statistically significant at the 95% confidence level, the variant is adopted as the new baseline for future campaigns. The team then schedules another test with a new variant for the following month. If the variant does not achieve a significant improvement, the original remains as the baseline, and the team tweaks the variant (e.g., different wording or timing) and retests immediately, looping back to the split step.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["parallel groups (A/B)", "conditional branch (statistical significance)", "feedback loop (retest)"]
    }
  },
  {
    "input_text": "A legal contract approval chain. A junior lawyer drafts a contract. It goes to a senior lawyer for review. If the senior lawyer finds issues, they send it back with comments. The junior revises and resubmits. This can happen up to 2 revision cycles. After the second revision, if still not approved, it escalates to a partner. The partner can either approve, reject, or request further changes. If approved, the contract moves to the client for signature. If rejected, the process ends. If the partner requests changes, it goes back to the junior lawyer. Once the client signs, the contract is executed and stored in the document management system. All versions are timestamped in the system.",
    "mermaid": "graph TD\n    A[Junior lawyer drafts contract] --> B[Senior lawyer reviews]\n    B --> C{Issues found?}\n    C -->|Yes| D{Revision cycle < 2?}\n    D -->|Yes| E[Send back with comments]\n    E --> F[Junior revises and resubmits]\n    F --> B\n    D -->|No| G[Escalate to partner]\n    C -->|No| H[Ready for client signature]\n    G --> I{Partner decision}\n    I -->|Approve| H\n    I -->|Reject| J[Process ends]\n    I -->|Request changes| E\n    H --> K[Client signs]\n    K --> L[Contract executed, stored in DMS]\n    L --> M[All versions timestamped]",
    "expanded_text": "The contract approval chain starts with a junior lawyer drafting the contract. It is then reviewed by a senior lawyer. If the senior lawyer finds issues and the number of revision cycles is less than two, the contract is sent back with comments for revision. The junior revises and resubmits, and the senior reviews again. If after two revision cycles the contract is still not approved, it is escalated to a partner. The partner may approve (moving the contract to the client for signature), reject (ending the process), or request further changes (sending it back to the junior for another revision). Once approved by the partner or senior lawyer without issues, the contract is sent to the client for signature. After the client signs, the contract is executed and stored in the document management system (DMS), with all versions timestamped for audit.",
    "metadata": {
      "domain": "legal",
      "complexity": "high",
      "graph_features": ["sequential flows", "conditional branches", "revision limit", "escalation", "approval loop"]
    }
  },
  {
    "input_text": "When a patient visits the clinic with symptoms, the doctor first takes medical history, performs a physical examination, orders necessary lab tests if needed, reviews the results, makes a diagnosis, and prescribes treatment.",
    "mermaid": "flowchart TD\n    Arrival[Patient Arrives] --> History[Take Medical History]\n    History --> Examination[Physical Examination]\n    Examination --> Tests{Tests Needed?}\n    Tests -->|Yes| Order[Order Lab Tests]\n    Tests -->|No| Diagnosis[Make Diagnosis]\n    Order --> Review[Review Test Results]\n    Review --> Diagnosis\n    Diagnosis --> Prescribe[Prescribe Treatment]",
    "expanded_text": "The patient consultation process is methodical. It begins with gathering detailed medical history followed by a physical examination. Depending on findings, diagnostic tests may be ordered and reviewed. A diagnosis is established before prescribing appropriate treatment or further referrals.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["sequential flow", "conditional branching"]
    }
  },
  {
    "input_text": "In our platformer game, players collect coins while avoiding enemies, reach the end of the level to unlock the next one, and can replay levels to achieve three stars based on time and collection rate.",
    "mermaid": "flowchart TD\n    Start[Level Begins] --> Navigate[Navigate Platform]\n    Navigate --> Collect[Collect Coins]\n    Collect --> Avoid[Avoid Enemies]\n    Avoid --> End{Reach Level End?}\n    End -->|Yes| Unlock[Unlock Next Level]\n    End -->|No| Navigate\n    Unlock --> Stars{Achieve 3 Stars?}\n    Stars -->|Yes| Perfect[Perfect Score]\n    Stars -->|No| Replay[Replay Level]",
    "expanded_text": "Gameplay in the platformer involves continuous navigation while collecting coins and avoiding hazards. Reaching the level exit unlocks the next stage. Players can replay completed levels to improve their star rating based on completion time and coin collection percentage.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["game loop", "conditional goals"]
    }
  },
  {
    "input_text": "I use the Pomodoro technique by working for 25 minutes, taking a 5-minute break, repeating this four times, then taking a longer 15-30 minute break before starting another cycle.",
    "mermaid": "flowchart TD\n    Start[Start Pomodoro] --> Work[Work 25 Minutes]\n    Work --> ShortBreak[5-Minute Break]\n    ShortBreak --> Count{Pomodoros Completed?}\n    Count -->|Less than 4| Work\n    Count -->|4| LongBreak[15-30 Minute Break]\n    LongBreak --> Next[Start New Cycle]",
    "expanded_text": "The Pomodoro productivity technique structures work into focused 25-minute intervals followed by short breaks. After completing four pomodoros, a longer break is taken to maintain mental freshness before beginning the next cycle.",
    "metadata": {
      "domain": "productivity",
      "complexity": "simple",
      "graph_features": ["repeating cycle", "timed workflow"]
    }
  },
  {
    "input_text": "Before signing any vendor contract, our legal team reviews the terms, checks for compliance risks, negotiates unfavorable clauses, gets internal stakeholder approval, and then finalizes the agreement.",
    "mermaid": "flowchart TD\n    Receive[Contract Received] --> Review[Legal Team Review]\n    Review --> Compliance[Compliance Risk Check]\n    Compliance --> Negotiate[Negotiate Clauses]\n    Negotiate --> Stakeholder[Internal Stakeholder Approval]\n    Stakeholder --> Finalize[Finalize & Sign Agreement]",
    "expanded_text": "Vendor contract processing includes multiple protective layers. The legal team thoroughly reviews terms and identifies compliance risks. Unfavorable clauses are negotiated before seeking approval from relevant internal stakeholders. Only after all clearances is the contract finalized and signed.",
    "metadata": {
      "domain": "legal",
      "complexity": "medium",
      "graph_features": ["review process", "approval chain"]
    }
  },
  {
    "input_text": "Our customer support chatbot greets the user, understands their query using NLP, retrieves relevant information from the knowledge base, generates a helpful response, and asks if the user needs further assistance.",
    "mermaid": "flowchart TD\n    User[User Message] --> Greet[Greet User]\n    Greet --> Understand[Understand Intent via NLP]\n    Understand --> Retrieve[Retrieve from Knowledge Base]\n    Retrieve --> Generate[Generate Response]\n    Generate --> Check{Needs More Help?}\n    Check -->|Yes| Understand\n    Check -->|No| End[End Conversation]",
    "expanded_text": "The support chatbot follows a conversational loop. It greets users and uses natural language processing to understand queries. Information is pulled from the knowledge base to craft accurate responses. The bot continues the conversation until the user indicates their issue is resolved.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["conversational loop", "conditional continuation"]
    }
  },
  {
    "input_text": "Organizing a weekend hiking trip with friends requires choosing a location, checking weather forecasts, booking transportation, preparing gear lists, dividing food responsibilities, and confirming everyone's availability.",
    "mermaid": "flowchart TD\n    Idea[Decide to Go Hiking] --> Location[Choose Destination]\n    Location --> Weather[Check Weather Forecast]\n    Weather --> Transport[Arrange Transportation]\n    Transport --> Gear[Prepare Gear List]\n    Gear --> Food[Assign Food Responsibilities]\n    Food --> Confirm[Confirm Availability]",
    "expanded_text": "Group hiking trip planning involves several coordination steps. After selecting a suitable location and confirming good weather, transportation is arranged. Individual gear lists are prepared and food responsibilities divided among participants. Final confirmation of everyone's availability ensures the trip proceeds smoothly.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["group coordination", "dependency tasks"]
    }
  },
  {
    "input_text": "The password recovery process starts when a user requests a reset, verifies their identity through email, generates a secure reset link, allows the user to create a new password, and confirms successful update.",
    "mermaid": "flowchart TD\n    Request[Password Reset Request] --> Verify[Verify Identity via Email]\n    Verify --> Generate[Generate Reset Link]\n    Generate --> Click[User Clicks Link]\n    Click --> NewPass[Create New Password]\n    NewPass --> Confirm[Confirm Password Updated]",
    "expanded_text": "Secure password recovery involves multiple verification steps. Upon request, the system verifies user identity through registered email. A time-limited reset link is generated and sent. When clicked, the user creates a new strong password which is then confirmed and updated in the system.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["security workflow", "verification steps"]
    }
  },
  {
    "input_text": "To qualify sales leads, our team first checks if they match the ideal customer profile, then assesses budget and authority, determines their timeline, and finally assigns a lead score before passing to sales representatives.",
    "mermaid": "flowchart TD\n    Lead[New Lead Received] --> ICP[Check Ideal Customer Profile]\n    ICP --> BANT[Assess Budget, Authority, Need, Timeline]\n    BANT --> Score[Calculate Lead Score]\n    Score --> Qualify{Qualified?}\n    Qualify -->|Yes| Sales[Handover to Sales Team]\n    Qualify -->|No| Nurture[Add to Nurture Campaign]",
    "expanded_text": "Sales lead qualification follows the BANT framework. Leads are first evaluated against the ideal customer profile. Budget, authority, need, and timeline are assessed. A composite score determines whether the lead is sales-ready or should continue in a nurturing sequence.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["qualification process", "scoring decision"]
    }
  },
  {
    "input_text": "My weekly grocery shopping involves making a list based on meal plans, checking what we already have at home, going to the store, comparing prices, avoiding impulse buys, and organizing items when I get home.",
    "mermaid": "flowchart TD\n    Plan[Review Meal Plan] --> List[Create Shopping List]\n    List --> Check[Check Pantry & Fridge]\n    Check --> Store[Go to Grocery Store]\n    Store --> Compare[Compare Prices]\n    Compare --> Avoid[Avoid Impulse Purchases]\n    Avoid --> Organize[Organize Groceries at Home]",
    "expanded_text": "Efficient grocery shopping starts with meal planning and list creation. A quick inventory check prevents buying duplicates. At the store, price comparison helps stay within budget while consciously avoiding impulse purchases. Proper organization upon returning home completes the cycle.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["routine process", "budget control"]
    }
  },
  {
    "input_text": "Writing a good essay requires understanding the prompt, researching the topic, creating an outline, writing the first draft, revising content and structure, proofreading for errors, and formatting before submission.",
    "mermaid": "flowchart TD\n    Prompt[Understand Assignment Prompt] --> Research[Conduct Research]\n    Research --> Outline[Create Essay Outline]\n    Outline --> Draft[Write First Draft]\n    Draft --> Revise[Revise Content & Structure]\n    Revise --> Proofread[Proofread & Edit]\n    Proofread --> Format[Final Formatting]\n    Format --> Submit[Submit Essay]",
    "expanded_text": "Essay writing is an iterative academic process. It begins with fully understanding the prompt and thorough research. A clear outline guides the first draft. Multiple revision rounds improve content, flow, and structure. Careful proofreading catches errors before final formatting and submission.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["writing process", "iterative refinement"]
    }
  },
  {
    "input_text": "Our code review process requires the developer to submit a pull request, assign two reviewers, wait for their feedback, address all comments, get final approval, and then merge the changes into the main branch.",
    "mermaid": "flowchart TD\n    Submit[Submit Pull Request] --> Assign[Assign Two Reviewers]\n    Assign --> Feedback[Collect Reviewer Feedback]\n    Feedback --> Address[Address All Comments]\n    Address --> Approval{Final Approval?}\n    Approval -->|Yes| Merge[Merge to Main]\n    Approval -->|No| Address",
    "expanded_text": "The code review workflow ensures quality before integration. After submitting a pull request, two reviewers are assigned. Their feedback must be collected and all comments addressed. Only after receiving final approval from reviewers can the developer merge the changes into the main branch.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["approval workflow", "feedback loop"]
    }
  },
  {
    "input_text": "Nurses follow a strict protocol when administering medication: verify the doctor's order, check patient identity, confirm allergies, calculate the correct dose, administer the drug, and document everything in the system.",
    "mermaid": "flowchart TD\n    Order[Receive Doctor Order] --> Verify[Verify Order Details]\n    Verify --> Identity[Confirm Patient Identity]\n    Identity --> Allergies[Check Patient Allergies]\n    Allergies --> Dose[Calculate Correct Dose]\n    Dose --> Administer[Administer Medication]\n    Administer --> Document[Record in Patient Chart]",
    "expanded_text": "Medication administration follows the 'five rights' safety protocol. Nurses verify the order, confirm patient identity using two identifiers, check for allergies, calculate and prepare the correct dose, administer the medication safely, and complete documentation immediately afterward.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["safety protocol", "sequential verification"]
    }
  },
  {
    "input_text": "Creating our monthly social media content calendar involves brainstorming topics, aligning with marketing goals, designing visuals, scheduling posts, and reviewing performance after publication.",
    "mermaid": "flowchart TD\n    Brainstorm[Brainstorm Content Ideas] --> Align[Align with Campaign Goals]\n    Align --> Design[Create Visual Assets]\n    Design --> Schedule[Schedule Posts]\n    Schedule --> Publish[Publish Content]\n    Publish --> Review[Review Performance Metrics]",
    "expanded_text": "The social media content process starts with collaborative brainstorming. Ideas are refined to match broader marketing objectives. Visual content is designed and posts are scheduled across platforms. After publishing, the team analyzes engagement metrics to inform future content strategy.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["content workflow", "performance loop"]
    }
  },
  {
    "input_text": "Every night before sleep, I lock the doors, turn off all lights, brush my teeth, set my alarm clock, read for ten minutes, and then turn off the bedside lamp.",
    "mermaid": "flowchart TD\n    Start[Bedtime Routine] --> Lock[Lock All Doors]\n    Lock --> Lights[Turn Off Lights]\n    Lights --> Brush[Brush Teeth]\n    Brush --> Alarm[Set Morning Alarm]\n    Alarm --> Read[Read for 10 Minutes]\n    Read --> Lamp[Turn Off Bedside Lamp]",
    "expanded_text": "The bedtime routine is a calming sequence that ensures security and relaxation. It includes securing the house, turning off lights, dental hygiene, setting the alarm, brief reading for wind-down, and finally switching off the lamp to sleep.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["personal routine"]
    }
  },
  {
    "input_text": "Invoice approval in our company requires the finance assistant to verify the amount and supporting documents, forward it to the department head for approval, then to finance manager for final sign-off before payment processing.",
    "mermaid": "flowchart TD\n    Receive[Invoice Received] --> Verify[Verify Amount & Documents]\n    Verify --> DeptHead[Department Head Approval]\n    DeptHead --> FinanceMgr[Finance Manager Sign-off]\n    FinanceMgr --> Process[Process Payment]",
    "expanded_text": "The invoice approval workflow maintains financial control through multiple layers. The finance assistant verifies accuracy and documentation before routing to the relevant department head. Final approval by the finance manager is required before initiating payment.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["approval hierarchy"]
    }
  },
  {
    "input_text": "Our AI email assistant reads incoming messages, classifies their intent, drafts appropriate replies, suggests attachments if needed, and lets the user review and send the response.",
    "mermaid": "flowchart TD\n    Email[New Email Received] --> Read[Read & Analyze Content]\n    Read --> Classify[Classify Intent]\n    Classify --> Draft[Draft Reply]\n    Draft --> Suggest[Suggest Attachments]\n    Suggest --> Review[User Reviews Draft]\n    Review --> Send[Send Response]",
    "expanded_text": "The AI email assistant processes messages by first reading and understanding context. It classifies the intent and generates a suitable draft reply. Relevant attachments are suggested when appropriate. The user reviews the draft before the email is sent.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["automation flow", "human-in-the-loop"]
    }
  },
  {
    "input_text": "When processing product returns, we inspect the item condition, verify the original purchase, issue a refund or exchange, update inventory, and notify the customer of the resolution.",
    "mermaid": "flowchart TD\n    Return[Return Request] --> Inspect[Inspect Item Condition]\n    Inspect --> Verify[Verify Original Purchase]\n    Verify --> Decide[Decide Refund or Exchange]\n    Decide --> Update[Update Inventory Records]\n    Update --> Notify[Notify Customer]",
    "expanded_text": "Product return handling ensures fairness and accuracy. Items are physically inspected for condition, purchases are verified in the system, and appropriate resolutions like refunds or exchanges are processed. Inventory is updated in real-time and customers receive confirmation.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["reverse logistics", "verification steps"]
    }
  },
  {
    "input_text": "The water cycle consists of water evaporating from oceans and lakes, rising into the atmosphere, condensing to form clouds, falling as precipitation, and eventually returning to bodies of water.",
    "mermaid": "flowchart TD\n    Evaporation[Evaporation from Water Bodies] --> Condensation[Condensation in Atmosphere]\n    Condensation --> Clouds[Cloud Formation]\n    Clouds --> Precipitation[Rain or Snow]\n    Precipitation --> Collection[Collection in Rivers & Oceans]\n    Collection --> Evaporation",
    "expanded_text": "The natural water cycle is a continuous closed loop. Solar energy causes evaporation from surface water. Water vapor rises and condenses into clouds. Precipitation returns water to the ground, which flows back into rivers, lakes, and oceans, restarting the cycle.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["natural cycle", "feedback loop"]
    }
  },
  {
    "input_text": "Employees requesting leave must submit an application through the HR portal, get manager approval, and then HR updates the attendance record and notifies payroll if necessary.",
    "mermaid": "flowchart TD\n    Submit[Submit Leave Request] --> Manager[Manager Approval]\n    Manager --> HR[HR Verification]\n    HR --> Update[Update Attendance System]\n    Update --> Notify[Notify Payroll if Needed]",
    "expanded_text": "The leave management process is digitized for efficiency. Employees submit requests via the portal. Direct managers approve or reject based on team workload. HR verifies policy compliance, updates records, and coordinates with payroll when the leave affects salary calculations.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["approval process"]
    }
  },
  {
    "input_text": "In our survival game, players gather resources during the day, build shelter before nightfall, defend against enemies at night, and use collected materials to upgrade tools and base defenses each morning.",
    "mermaid": "flowchart TD\n    Day[Gather Resources] --> Build[Build/Repair Shelter]\n    Build --> Night[Survive Night Attack]\n    Night --> Morning[Morning Resource Management]\n    Morning --> Upgrade[Upgrade Tools & Defenses]\n    Upgrade --> Day",
    "expanded_text": "The survival game loop alternates between day and night phases. Players spend daylight gathering resources and strengthening their base. As night falls, they must defend against threats. Each new morning allows upgrading equipment and defenses using accumulated resources, creating an ever-progressing survival experience.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["game loop", "day-night cycle"]
    }
  },
  {
    "input_text": "A smart home security system has three modes: Disarmed, Armed-Stay, and Armed-Away. When the user arms the system in Stay mode, only door and window sensors are active; motion sensors are ignored. In Away mode, both doors/windows and motion sensors are active. If a sensor is triggered in Armed-Stay or Armed-Away, a 30-second entry delay starts. During this delay, the user can disarm the system using a code. If the code is correct within 30 seconds, the alarm cancels. If not, the siren sounds and a push notification is sent to the user's phone. The user can then remotely disarm. If disarmed remotely within 2 minutes, the siren stops. Otherwise, the system calls the police.",
    "mermaid": "graph TD\n    A[System disarmed] --> B{User action}\n    B -->|Arm Stay| C[Armed-Stay: doors/windows only]\n    B -->|Arm Away| D[Armed-Away: doors, windows, motion]\n    C --> E[Sensor triggered]\n    D --> E\n    E --> F[30 sec entry delay starts]\n    F --> G{User disarms with code within 30 sec?}\n    G -->|Yes| A\n    G -->|No| H[Siren sounds, push notification to phone]\n    H --> I{User remotely disarms within 2 min?}\n    I -->|Yes| J[Siren stops, return to disarmed]\n    I -->|No| K[Call police]",
    "expanded_text": "The smart home security system operates in three modes: Disarmed, Armed-Stay, and Armed-Away. When the user arms in Stay mode, only door and window sensors are active; interior motion sensors are ignored. In Away mode, both door/window and motion sensors are active. If a sensor is triggered in either armed mode, a 30-second entry delay begins. During this delay, the user can disarm the system by entering their code. If the correct code is entered within 30 seconds, the alarm cancels and the system returns to Disarmed. If not, the siren sounds and a push notification is sent to the user's phone. The user may then remotely disarm the system via the app. If disarming occurs within 2 minutes of the siren, the siren stops and the system disarms. If not, the system automatically calls the police.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["state transitions", "conditional branches", "timeout", "escalation"]
    }
  },
  {
    "input_text": "A student wants to calculate their final grade in a course. The course has three components: homework (30%), midterm exam (30%), and final exam (40%). The student inputs their homework average (out of 100), midterm score, and final exam score. The system calculates weighted total = (homework * 0.3) + (midterm * 0.3) + (final * 0.4). If the total >= 90, letter grade A. If 80-89, B. If 70-79, C. If 60-69, D. Below 60, F. Additionally, if the student's final exam score is below 50, they automatically fail the course regardless of other scores (instructor policy). The system outputs the letter grade and a message if the automatic fail condition is met.",
    "mermaid": "graph TD\n    A[Input homework avg, midterm, final] --> B[Calculate weighted total: H*0.3 + M*0.3 + F*0.4]\n    B --> C{Final exam score < 50?}\n    C -->|Yes| D[Auto-fail: grade = F]\n    C -->|No| E{Total >= 90?}\n    E -->|Yes| F[Grade = A]\n    E -->|No| G{Total >= 80?}\n    G -->|Yes| H[Grade = B]\n    G -->|No| I{Total >= 70?}\n    I -->|Yes| J[Grade = C]\n    I -->|No| K{Total >= 60?}\n    K -->|Yes| L[Grade = D]\n    K -->|No| M[Grade = F]\n    D --> N[Output grade and auto-fail message]\n    F --> N\n    H --> N\n    J --> N\n    L --> N\n    M --> N",
    "expanded_text": "To calculate the final grade, the student inputs their homework average, midterm exam score, and final exam score, each out of 100. The system computes a weighted total: homework contributes 30%, midterm 30%, and final 40%. If the final exam score is below 50, the student automatically fails the course with a grade of F, regardless of other scores. Otherwise, the weighted total determines the letter grade: 90 or above is A, 80–89 is B, 70–79 is C, 60–69 is D, and below 60 is F. The system outputs the letter grade along with a message if the automatic fail condition was applied.",
    "metadata": {
      "domain": "education",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches", "exception rule"]
    }
  },
  {
    "input_text": "A customer service chatbot for a telecom company handles internet outage complaints. The user types 'My internet is down'. The bot checks the user's account status. If the account is suspended due to non-payment, the bot replies with a link to make a payment. If the account is active, the bot runs a line test. If the test shows a local signal issue, the bot guides the user to restart the modem and wait 2 minutes. If that fixes the issue, the bot asks for a confirmation and closes the ticket. If not fixed, the bot schedules a technician visit. If the line test shows a regional outage, the bot informs the user of the estimated fix time and offers a SMS notification when service is restored.",
    "mermaid": "graph TD\n    A[User: 'My internet is down'] --> B[Check account status]\n    B --> C{Account suspended?}\n    C -->|Yes| D[Reply with payment link]\n    C -->|No| E[Run line test]\n    E --> F{Line test result}\n    F -->|Local signal issue| G[Guide user to restart modem, wait 2 min]\n    G --> H{Issue fixed?}\n    H -->|Yes| I[Ask confirmation, close ticket]\n    H -->|No| J[Schedule technician visit]\n    F -->|Regional outage| K[Inform estimated fix time, offer SMS notification]\n    J --> L[End]\n    K --> L\n    I --> L",
    "expanded_text": "The chatbot handles an internet outage complaint when the user types 'My internet is down'. It first checks the user's account status. If the account is suspended due to non-payment, the bot replies with a link to make a payment. If the account is active, the bot runs a line test. If the test indicates a local signal issue, the bot guides the user to restart the modem and wait 2 minutes. If the issue is resolved, the bot asks for confirmation and closes the ticket. If not resolved, the bot schedules a technician visit. If the line test detects a regional outage, the bot informs the user of the estimated fix time and offers to send an SMS notification when service is restored.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["conditional branches", "troubleshooting flow", "fallback"]
    }
  },
  {
    "input_text": "A continuous integration pipeline for a microservice. A developer pushes code to the 'develop' branch. This triggers automated unit tests. If any unit test fails, the build is marked broken and the developer is notified via Slack. If all unit tests pass, the code is deployed to a staging environment. In staging, integration tests and smoke tests run in parallel. If either test suite fails, the team is alerted and the deployment is rolled back. If both pass, a manual approval step is required for production deployment. A senior engineer must click 'Approve' within 12 hours. If no approval within 12 hours, the pipeline stalls and sends a reminder. Once approved, the code is deployed to production and a success notification is sent to the team's channel.",
    "mermaid": "graph TD\n    A[Push to develop branch] --> B[Run unit tests]\n    B --> C{All unit tests pass?}\n    C -->|No| D[Mark build broken, notify developer on Slack]\n    C -->|Yes| E[Deploy to staging]\n    E --> F[Run integration tests and smoke tests in parallel]\n    F --> G{Both test suites pass?}\n    G -->|No| H[Alert team, rollback staging]\n    G -->|Yes| I[Manual approval required for production]\n    I --> J{Senior engineer approves within 12 hours?}\n    J -->|Yes| K[Deploy to production]\n    J -->|No| L[Send reminder, stall pipeline]\n    K --> M[Send success notification to team channel]",
    "expanded_text": "When a developer pushes code to the 'develop' branch, the CI pipeline automatically runs unit tests. If any unit test fails, the build is marked as broken and the developer receives a Slack notification. If all unit tests pass, the code is deployed to a staging environment. In staging, integration tests and smoke tests run in parallel. If either test suite fails, the team is alerted and the staging deployment is rolled back. If both pass, the pipeline requires manual approval from a senior engineer before production deployment. The senior engineer must click 'Approve' within 12 hours; if no approval is received within that window, the pipeline stalls and sends a reminder. Once approved, the code is deployed to production and a success notification is sent to the team's communication channel.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["sequential flows", "parallel tasks", "conditional branches", "manual approval with timeout", "notifications"]
    }
  },
  {
    "input_text": "A library book borrowing process. A patron presents a book and their library card. The librarian scans the card and checks the patron's record. If the patron has overdue books or unpaid fines exceeding $10, the system blocks the checkout and displays the amount due. The patron can pay fines at the desk. After payment, the checkout proceeds. If the patron is in good standing, the system scans the book and updates its status to 'checked out'. The due date is set to 21 days from today. A receipt is printed. If the book is a bestseller, the loan period is reduced to 14 days. The patron also receives an email reminder 3 days before the due date.",
    "mermaid": "graph TD\n    A[Patron presents book and card] --> B[Scan card, check record]\n    B --> C{Overdue books or fines > $10?}\n    C -->|Yes| D[Display amount due, block checkout]\n    D --> E[Patron pays fines]\n    E --> F[Proceed to checkout]\n    C -->|No| F\n    F --> G[Scan book, update status to checked out]\n    G --> H{Bestseller?}\n    H -->|Yes| I[Set due date to 14 days]\n    H -->|No| J[Set due date to 21 days]\n    I --> K[Print receipt]\n    J --> K\n    K --> L[Send email reminder 3 days before due date]",
    "expanded_text": "A patron borrows a book by presenting the book and their library card. The librarian scans the card and checks the patron's record. If the patron has overdue books or unpaid fines exceeding $10, the system blocks checkout and displays the amount due. The patron may pay the fines at the desk; after payment, checkout proceeds. If the patron is in good standing, checkout proceeds immediately. The book is scanned, and its status is updated to 'checked out'. The due date is set to 21 days from today, except for bestsellers, which have a 14-day loan period. A receipt is printed for the patron. The system also sends an email reminder to the patron three days before the due date.",
    "metadata": {
      "domain": "daily life",
      "complexity": "low",
      "graph_features": ["conditional branches", "fine resolution flow", "rule variation (bestseller)"]
    }
  },
  {
    "input_text": "An insurance claims processing system. A customer files a claim online. The system first checks if the policy is active and covers the incident type. If not, the claim is automatically denied with an explanation. If covered, the claim enters a verification stage where the system cross-references police reports or medical records (depending on claim type). If verification fails, a claims adjuster is assigned to manually review within 5 business days. If verification succeeds, the claim is approved for payment. For claims under $500, payment is issued automatically within 24 hours. For claims between $500 and $5000, a manager must approve the payment. For claims over $5000, the claim goes to a special investigations unit (SIU) for fraud review. SIU has 10 days to approve, deny, or request more info. If approved, payment is issued. If denied, the customer receives a denial letter.",
    "mermaid": "graph TD\n    A[Customer files claim online] --> B{Policy active and covers incident?}\n    B -->|No| C[Auto-deny with explanation]\n    B -->|Yes| D[Verification: cross-reference external records]\n    D --> E{Verification succeeds?}\n    E -->|No| F[Assign claims adjuster, manual review within 5 days]\n    E -->|Yes| G[Claim approved for payment]\n    G --> H{Claim amount}\n    H -->|Under $500| I[Auto-pay within 24h]\n    H -->|$500 - $5000| J[Manager approves payment]\n    H -->|Over $5000| K[Send to SIU for fraud review]\n    K --> L[SIU reviews within 10 days]\n    L --> M{SIU decision}\n    M -->|Approve| N[Issue payment]\n    M -->|Deny| O[Send denial letter]\n    M -->|Request info| P[Customer provides info, return to verification]\n    J --> N\n    I --> N",
    "expanded_text": "When a customer files a claim online, the system checks whether the policy is active and covers the incident type. If not, the claim is automatically denied with an explanation. If covered, the system attempts to verify the claim by cross-referencing external records (police reports for auto claims, medical records for health claims). If verification fails, a claims adjuster is assigned for manual review within 5 business days. If verification succeeds, the claim is approved for payment. The payment amount determines the next step: claims under $500 are auto-paid within 24 hours; claims between $500 and $5000 require a manager's approval; claims over $5000 go to the Special Investigations Unit (SIU) for fraud review. SIU has 10 days to approve, deny, or request more information. If approved, payment is issued. If denied, a denial letter is sent. If more information is requested, the customer provides it and the claim returns to the verification stage.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["conditional branches", "tiered thresholds", "escalation (SIU)", "manual review", "verification loop"]
    }
  },
  {
    "input_text": "A patient schedule for a colonoscopy. The patient receives a prep kit and instructions. Two days before the procedure, the patient starts a low-fiber diet. The day before, they drink a laxative solution in two doses: 1 liter at 4 PM and 1 liter at 8 PM. They must also drink 2 liters of clear fluids throughout the day. On the morning of the procedure, they take nothing by mouth (NPO) for at least 6 hours. At check-in, the nurse verifies adherence to prep. If prep was inadequate (residual stool visible on intake), the procedure is rescheduled and the patient must repeat the prep. If adequate, the patient is sedated and the colonoscopy is performed. After recovery, the patient is discharged with results. They cannot drive for 24 hours due to sedation.",
    "mermaid": "graph TD\n    A[Receive prep kit and instructions] --> B[2 days before: low-fiber diet]\n    B --> C[Day before: laxative 1L at 4PM, 1L at 8PM, plus 2L clear fluids]\n    C --> D[Morning of procedure: NPO for >=6 hours]\n    D --> E[Check-in, nurse verifies prep adequacy]\n    E --> F{Prep adequate?}\n    F -->|No| G[Reschedule procedure, repeat prep]\n    G --> A\n    F -->|Yes| H[Patient sedated, colonoscopy performed]\n    H --> I[Recovery, discharge with results]\n    I --> J[Patient cannot drive for 24 hours]",
    "expanded_text": "The colonoscopy preparation and procedure begin with the patient receiving a prep kit and instructions. Two days before the procedure, the patient starts a low-fiber diet. The day before, they drink a laxative solution in two doses: one liter at 4 PM and another liter at 8 PM, plus two liters of clear fluids throughout the day. On the morning of the procedure, the patient must have nothing by mouth (NPO) for at least six hours. At check-in, a nurse verifies the adequacy of the bowel preparation using an intake assessment (e.g., visualizing residual stool). If the prep is inadequate, the procedure is rescheduled and the patient must repeat the entire preparation process. If adequate, the patient receives sedation, and the colonoscopy is performed. After the procedure, the patient recovers, is discharged with results, and is instructed not to drive for 24 hours due to the lingering effects of sedation.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branch (prep adequacy)", "loop (reschedule)"]
    }
  },
  {
    "input_text": "A warehouse restocking process. When inventory of a product falls below the reorder point, the system automatically generates a purchase order to the supplier. The supplier has 3 days to confirm the order. If no confirmation within 3 days, the system sends a follow-up email. After confirmation, the supplier ships the goods. The warehouse receives the shipment and scans each item. If the quantity received matches the order, the inventory is updated. If the quantity is short, the system creates a backorder for the missing quantity and notifies the purchasing manager. If the quantity exceeds the order (over-shipment), the warehouse rejects the excess and returns it to the supplier. After updating inventory, the system checks if the new stock level is still below the reorder point; if yes, another purchase order is triggered automatically.",
    "mermaid": "graph TD\n    A[Inventory < reorder point] --> B[Auto-generate purchase order to supplier]\n    B --> C{Supplier confirms within 3 days?}\n    C -->|No| D[Send follow-up email]\n    D --> C\n    C -->|Yes| E[Supplier ships goods]\n    E --> F[Warehouse receives, scans items]\n    F --> G{Quantity matches order?}\n    G -->|Yes| H[Update inventory]\n    G -->|Short| I[Create backorder for missing quantity, notify purchasing manager]\n    I --> H\n    G -->|Excess| J[Reject excess, return to supplier, update inventory with correct quantity]\n    J --> H\n    H --> K{New stock level < reorder point?}\n    K -->|Yes| B\n    K -->|No| L[End]",
    "expanded_text": "When inventory of a product falls below the reorder point, the system automatically generates a purchase order to the supplier. The supplier has 3 days to confirm the order; if no confirmation is received, the system sends a follow-up email and continues to wait. After confirmation, the supplier ships the goods. The warehouse receives the shipment and scans each item. If the received quantity exactly matches the order, inventory is updated. If the quantity is short, a backorder is created for the missing quantity, the purchasing manager is notified, and inventory is updated with the received amount. If the shipment exceeds the order, the excess is rejected and returned to the supplier, and inventory is updated with the correct ordered quantity. After updating inventory, the system checks whether the new stock level is still below the reorder point; if yes, another purchase order is automatically generated, continuing the loop.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["conditional branches (quantity match)", "loop (reorder)", "timeout with reminder", "exception handling (short/excess)"]
    }
  },
  {
    "input_text": "A social media platform's content moderation pipeline. A user reports a post. The system first checks if the same post has already been reported by 5 or more users in the past hour. If yes, the post is automatically hidden and flagged for priority review. If less than 5 reports, it goes to a queue for human moderators. A moderator reviews the post against community guidelines. If the post violates guidelines (e.g., hate speech, harassment), the moderator removes it and issues a warning to the poster. For a second violation within 30 days, the poster receives a 7-day suspension. For a third violation, permanent ban. If the post does not violate guidelines, it is left up, and the reporting user is notified that no action was taken. All moderation actions are logged for audit.",
    "mermaid": "graph TD\n    A[User reports a post] --> B{ >=5 reports in past hour?}\n    B -->|Yes| C[Auto-hide post, flag for priority review]\n    C --> D[Moderator reviews]\n    B -->|No| D\n    D --> E{Violates guidelines?}\n    E -->|No| F[Leave post up, notify reporting user no action]\n    E -->|Yes| G[Remove post, issue warning to poster]\n    G --> H{Poster's violation count in last 30 days?}\n    H -->|First| I[Log warning]\n    H -->|Second| J[7-day suspension]\n    H -->|Third| K[Permanent ban]\n    I --> L[Log action for audit]\n    J --> L\n    K --> L\n    F --> L",
    "expanded_text": "When a user reports a post, the system checks whether the same post has received five or more reports within the past hour. If so, the post is automatically hidden and flagged for priority review by a moderator. If fewer than five reports exist, the post enters a standard queue for human moderation. A moderator reviews the post against community guidelines. If the post does not violate guidelines, it remains visible, and the reporting user is notified that no action was taken. If a violation is found (e.g., hate speech, harassment), the post is removed and the poster receives a warning. For a second violation within a 30-day window, the poster receives a 7-day suspension. For a third violation, the account is permanently banned. All moderation actions are logged for audit purposes.",
    "metadata": {
      "domain": "social interactions",
      "complexity": "medium",
      "graph_features": ["conditional branches", "violation escalation (3 strikes)", "automatic threshold trigger", "audit logging"]
    }
  },
  {
    "input_text": "A machine learning model deployment pipeline for a fraud detection system. Data scientists train a model offline using historical transaction data. The model is evaluated on a holdout test set. If the F1 score is below 0.85, the model is rejected and retraining is attempted with different hyperparameters. If F1 >= 0.85, the model is packaged into a Docker container and deployed to a canary environment alongside the current production model. 5% of live traffic is routed to the canary for 24 hours. If the canary model's false positive rate (FPR) is within 10% of the production model's FPR, the canary is promoted to production and receives 100% of traffic. If FPR is worse, the canary is rolled back, and the data science team is notified to retrain. The old production model is kept as a fallback for 7 days, then archived.",
    "mermaid": "graph TD\n    A[Train model on historical data] --> B[Evaluate on test set]\n    B --> C{F1 score >= 0.85?}\n    C -->|No| D[Retrain with different hyperparameters]\n    D --> A\n    C -->|Yes| E[Package into Docker container]\n    E --> F[Deploy to canary environment with 5% traffic]\n    F --> G[Monitor for 24 hours: compare FPR]\n    G --> H{Canary FPR within 10% of production FPR?}\n    H -->|Yes| I[Promote canary to production, 100% traffic]\n    H -->|No| J[Roll back canary, notify data science team to retrain]\n    J --> A\n    I --> K[Keep old model as fallback for 7 days, then archive]",
    "expanded_text": "Data scientists train a fraud detection model using historical transaction data. The model is evaluated on a holdout test set. If the F1 score is below 0.85, the model is rejected and retraining is attempted with different hyperparameters. Once the F1 score reaches 0.85 or higher, the model is packaged into a Docker container and deployed to a canary environment alongside the current production model. Five percent of live traffic is routed to the canary for 24 hours. If the canary model's false positive rate (FPR) is within 10% of the production model's FPR, the canary is promoted to production and receives 100% of traffic. If the FPR is worse (i.e., more than 10% higher), the canary is rolled back, and the data science team is notified to retrain from the beginning. The old production model is retained as a fallback for 7 days before being archived.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["conditional branches", "retraining loop", "canary deployment", "metric comparison", "fallback retention"]
    }
  },
  {
    "input_text": "When our system detects a security breach attempt, it immediately blocks the IP address, alerts the security team, logs all activities, investigates the source, and updates firewall rules to prevent future attacks.",
    "mermaid": "flowchart TD\n    Detect[Breach Attempt Detected] --> Block[Block IP Address]\n    Block --> Alert[Alert Security Team]\n    Alert --> Log[Log All Activities]\n    Log --> Investigate[Investigate Source]\n    Investigate --> Update[Update Firewall Rules]",
    "expanded_text": "The automated security response begins the moment a breach attempt is detected. The offending IP is instantly blocked while the security team receives an immediate alert. All related activities are logged in detail. The team then investigates the attack source and strengthens defenses by updating firewall rules.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["incident response", "sequential containment"]
    }
  },
  {
    "input_text": "I manage my daily tasks by listing everything I need to do, prioritizing them by importance and urgency, tackling high-priority items first, reviewing progress in the afternoon, and moving unfinished tasks to the next day.",
    "mermaid": "flowchart TD\n    Morning[List All Tasks] --> Prioritize[Prioritize by Importance & Urgency]\n    Prioritize --> Execute[Work on High Priority Tasks]\n    Execute --> Afternoon[Afternoon Progress Review]\n    Afternoon --> Unfinished{Move Remaining Tasks?}\n    Unfinished -->|Yes| NextDay[Add to Next Day List]",
    "expanded_text": "Daily task management follows a structured personal system. All pending tasks are listed in the morning and prioritized based on importance and deadlines. High-priority work takes precedence. An afternoon review assesses progress, with any unfinished items carried over to the following day's list.",
    "metadata": {
      "domain": "productivity",
      "complexity": "medium",
      "graph_features": ["personal workflow", "prioritization"]
    }
  },
  {
    "input_text": "Finalizing a business contract involves drafting the agreement, legal review, sending to the other party for comments, incorporating their feedback, obtaining signatures from both sides, and archiving the signed document.",
    "mermaid": "flowchart TD\n    Draft[Draft Contract] --> Legal[Internal Legal Review]\n    Legal --> Send[Send to Counterparty]\n    Send --> Feedback[Receive Comments]\n    Feedback --> Incorporate[Incorporate Changes]\n    Incorporate --> Sign[Obtain Signatures]\n    Sign --> Archive[Archive Signed Copy]",
    "expanded_text": "The contract finalization process is collaborative and meticulous. It starts with drafting, followed by internal legal review. The document is shared with the other party for their input. All feedback is incorporated before both parties sign. The fully executed agreement is then properly archived.",
    "metadata": {
      "domain": "legal",
      "complexity": "medium",
      "graph_features": ["review cycle", "multi-party approval"]
    }
  },
  {
    "input_text": "My weekend grocery preparation routine includes planning meals for the week, making a detailed shopping list, going to the market early Saturday, buying fresh produce, and prepping ingredients for the week on Sunday.",
    "mermaid": "flowchart TD\n    Plan[Plan Weekly Meals] --> List[Create Shopping List]\n    List --> Market[Early Saturday Market Trip]\n    Market --> Buy[Buy Fresh Ingredients]\n    Buy --> Prep[Sunday Meal Prep]",
    "expanded_text": "Weekend meal preparation is a two-day routine. It begins with planning meals for the coming week and creating an organized shopping list. Fresh ingredients are purchased early Saturday morning. On Sunday, the focus shifts to chopping, marinating, and prepping ingredients to make weekday cooking faster.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["weekly routine"]
    }
  },
  {
    "input_text": "The annual performance review cycle includes self-evaluation, manager assessment, calibration meeting, feedback discussion, goal setting for the next year, and linking results to compensation adjustments.",
    "mermaid": "flowchart TD\n    Self[Employee Self-Evaluation] --> Manager[Manager Assessment]\n    Manager --> Calibration[Calibration Meeting]\n    Calibration --> Discussion[Feedback Conversation]\n    Discussion --> Goals[Set Next Year Goals]\n    Goals --> Compensation[Link to Compensation]",
    "expanded_text": "The yearly performance management cycle is comprehensive. Employees complete self-evaluations which managers review and assess. Calibration meetings ensure fairness across teams. One-on-one feedback discussions follow, leading to collaborative goal setting for the next period. Final ratings directly influence compensation decisions.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["performance cycle", "multi-step review"]
    }
  },
  {
    "input_text": "Writing an undergraduate thesis involves selecting a topic, conducting literature review, designing the methodology, collecting and analyzing data, writing chapters, revising based on supervisor feedback, and final submission.",
    "mermaid": "flowchart TD\n    Topic[Select Thesis Topic] --> Literature[Literature Review]\n    Literature --> Method[Design Methodology]\n    Method --> Data[Collect & Analyze Data]\n    Data --> Writing[Write Thesis Chapters]\n    Writing --> Feedback[Supervisor Review]\n    Feedback --> Revise[Revise Draft]\n    Revise --> Submit[Final Submission]",
    "expanded_text": "Undergraduate thesis writing is a long-term academic project. It starts with topic selection and extensive literature review. Students design their research methodology, gather and analyze data, then write the various chapters. Multiple rounds of supervisor feedback drive revisions before the final thesis is submitted.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["long-form process", "iterative feedback"]
    }
  },
  {
    "input_text": "Our customer onboarding chatbot welcomes new users, explains key features, guides them through profile setup, suggests relevant content based on interests, and checks in after a few days to ensure they're getting value.",
    "mermaid": "flowchart TD\n    Welcome[Welcome New User] --> Explain[Explain Key Features]\n    Explain --> Profile[Guide Profile Setup]\n    Profile --> Suggest[Suggest Personalized Content]\n    Suggest --> Usage[Monitor Initial Usage]\n    Usage --> Checkin[Follow-up Check-in]",
    "expanded_text": "The onboarding chatbot creates a smooth introduction for new users. It starts with a warm welcome and feature overview, then guides users through profile completion. Personalized content suggestions help users find immediate value. A follow-up check-in after several days ensures they are progressing well.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["onboarding flow", "personalization"]
    }
  },
  {
    "input_text": "Administering a flu vaccine involves checking patient eligibility, verifying medical history, preparing the vaccine, administering the shot, observing for reactions, and recording the vaccination in the system.",
    "mermaid": "flowchart TD\n    Check[Check Eligibility] --> History[Review Medical History]\n    History --> Prepare[Prepare Vaccine]\n    Prepare --> Administer[Administer Injection]\n    Administer --> Observe[Observe for Reactions]\n    Observe --> Record[Record in Health System]",
    "expanded_text": "Flu vaccination follows strict medical protocols. Staff first confirm patient eligibility and review medical history for contraindications. The vaccine is prepared, administered safely, and the patient is monitored briefly for adverse reactions. All details are accurately recorded in the healthcare system.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["medical protocol", "safety checks"]
    }
  },
  {
    "input_text": "To generate qualified marketing leads, we create targeted content, promote it on social channels, capture visitor information through forms, nurture leads with email sequences, and score them before passing to the sales team.",
    "mermaid": "flowchart TD\n    Content[Create Targeted Content] --> Promote[Promote on Channels]\n    Promote --> Capture[Capture Lead Information]\n    Capture --> Nurture[Email Nurture Sequence]\n    Nurture --> Score[Lead Scoring]\n    Score --> Sales[Handover to Sales]",
    "expanded_text": "The lead generation funnel is multi-staged. High-value content is created and promoted across platforms to attract prospects. Visitor information is captured via forms. Automated email sequences nurture interest over time. Leads are scored based on engagement before being qualified and passed to sales.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["funnel process", "nurturing loop"]
    }
  },
  {
    "input_text": "In our battle arena game, players select a character, enter matchmaking, fight opponents in rounds, earn experience points after each match, upgrade abilities between matches, and climb the competitive leaderboard.",
    "mermaid": "flowchart TD\n    Select[Select Character] --> Matchmaking[Enter Matchmaking]\n    Matchmaking --> Fight[Battle Opponents]\n    Fight --> Rewards[Earn XP & Rewards]\n    Rewards --> Upgrade[Upgrade Abilities]\n    Upgrade --> Leaderboard[Update Leaderboard Position]",
    "expanded_text": "The competitive arena game loop is engaging and progressive. Players choose their character and enter matchmaking. After intense battles, they earn experience and rewards. Between matches, they upgrade abilities to become stronger. Consistent performance improves their position on the global leaderboard.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["game progression loop"]
    }
  },
  {
    "input_text": "When a customer requests a refund for a defective product, we first verify the purchase receipt, inspect the returned item, check warranty status, process the refund if valid, and update inventory records.",
    "mermaid": "flowchart TD\n    Request[Refund Request] --> Verify[Verify Purchase Receipt]\n    Verify --> Inspect[Inspect Returned Item]\n    Inspect --> Warranty[Check Warranty Status]\n    Warranty --> Valid{Valid Claim?}\n    Valid -->|Yes| Process[Process Refund]\n    Valid -->|No| Deny[Deny Request]\n    Process --> Update[Update Inventory]",
    "expanded_text": "The refund process for defective products includes multiple verification steps. Staff confirm the original purchase, physically inspect the returned item for defects, and validate warranty eligibility. Approved claims result in refund processing and inventory updates, while invalid ones are politely denied.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["verification flow", "decision branching"]
    }
  },
  {
    "input_text": "Our bug triage system categorizes reported issues by severity, assigns them to the correct team, estimates effort required, prioritizes based on impact, and schedules them into the next sprint.",
    "mermaid": "flowchart TD\n    Report[Bug Reported] --> Categorize[Categorize by Severity]\n    Categorize --> Assign[Assign to Team]\n    Assign --> Estimate[Estimate Effort]\n    Estimate --> Prioritize[Prioritize by Impact]\n    Prioritize --> Schedule[Schedule into Sprint]",
    "expanded_text": "Bug triage ensures efficient issue resolution. Incoming reports are categorized by severity level, assigned to the responsible development team, and effort is estimated. The team then prioritizes based on business impact before scheduling work into the appropriate development sprint.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["triage process", "prioritization"]
    }
  },
  {
    "input_text": "My quick breakfast routine is simple: I boil water for coffee, toast bread, fry an egg, slice some fruit, and eat everything while checking morning news on my phone.",
    "mermaid": "flowchart TD\n    Start[Start Breakfast] --> Boil[Boil Water for Coffee]\n    Boil --> Toast[Toast Bread]\n    Toast --> Fry[Fry Egg]\n    Fry --> Fruit[Slice Fruit]\n    Fruit --> Eat[Eat While Reading News]",
    "expanded_text": "The fast-paced breakfast routine maximizes efficiency. Water is boiled for coffee while bread is toasted. An egg is fried simultaneously and fruit is sliced. All items are consumed together while catching up on morning news.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["parallel tasks", "personal routine"]
    }
  },
  {
    "input_text": "The sales pipeline moves leads from initial contact to qualification, needs analysis, proposal presentation, negotiation, and finally closing the deal with contract signing.",
    "mermaid": "flowchart TD\n    Contact[Initial Contact] --> Qualify[Lead Qualification]\n    Qualify --> Analysis[Needs Analysis]\n    Analysis --> Proposal[Present Proposal]\n    Proposal --> Negotiation[Negotiation Phase]\n    Negotiation --> Close[Close Deal & Sign Contract]",
    "expanded_text": "The B2B sales pipeline is a progressive journey. It starts with initial contact and lead qualification. Sales representatives conduct thorough needs analysis before presenting tailored proposals. Negotiation addresses objections and terms, ultimately leading to deal closure and contract signing.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["sales funnel", "sequential stages"]
    }
  },
  {
    "input_text": "Students submitting assignments must upload the file before the deadline, run plagiarism checks, get peer review if required, and await teacher grading with feedback.",
    "mermaid": "flowchart TD\n    Prepare[Prepare Assignment] --> Upload[Upload Before Deadline]\n    Upload --> Plagiarism[Run Plagiarism Check]\n    Plagiarism --> Peer{Peer Review Required?}\n    Peer -->|Yes| Review[Peer Review]\n    Review --> Submit[Final Submission]\n    Peer -->|No| Submit\n    Submit --> Grade[Teacher Grading & Feedback]",
    "expanded_text": "Assignment submission follows institutional protocols. Students upload work before the deadline and run plagiarism detection. Some courses require peer review. The final submission goes to the teacher for grading and detailed feedback.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["submission workflow", "conditional steps"]
    }
  },
  {
    "input_text": "Expense claims are processed by first verifying receipts, checking policy compliance, approving by the manager, and finally reimbursing through payroll.",
    "mermaid": "flowchart TD\n    Submit[Submit Expense Claim] --> Verify[Verify Receipts]\n    Verify --> Compliance[Check Policy Compliance]\n    Compliance --> Manager[Manager Approval]\n    Manager --> Reimburse[Process Reimbursement]",
    "expanded_text": "Expense reimbursement follows a controlled approval process. Employees submit claims with supporting receipts. Finance verifies validity and policy compliance before manager approval. Approved amounts are then reimbursed through the payroll system.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["approval process"]
    }
  },
  {
    "input_text": "The butterfly life cycle begins with eggs being laid, hatching into caterpillars, forming a chrysalis during pupation, and finally emerging as an adult butterfly.",
    "mermaid": "flowchart TD\n    Eggs[Eggs Laid] --> Hatch[Hatch into Caterpillar]\n    Hatch --> Larva[Caterpillar Stage]\n    Larva --> Pupa[Form Chrysalis]\n    Pupa --> Adult[Emergence as Butterfly]",
    "expanded_text": "The metamorphosis of a butterfly is a classic complete life cycle. It starts with eggs that hatch into larvae (caterpillars). After significant growth and feeding, the caterpillar forms a pupa (chrysalis) where transformation occurs. Finally, a fully formed adult butterfly emerges.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["life cycle", "sequential transformation"]
    }
  },
  {
    "input_text": "The promotion evaluation process includes performance review, skill assessment, leadership feedback, comparison with promotion criteria, and final decision by department head.",
    "mermaid": "flowchart TD\n    Review[Performance Review] --> Skills[Skill Assessment]\n    Skills --> Feedback[Leadership Feedback]\n    Feedback --> Compare[Compare with Promotion Criteria]\n    Compare --> Decision[Department Head Decision]",
    "expanded_text": "Employee promotion decisions are based on a holistic evaluation. Recent performance reviews, demonstrated skills, and leadership input are carefully considered. Candidates are measured against official promotion criteria before the department head makes the final decision.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["evaluation process"]
    }
  },
  {
    "input_text": "Order fulfillment in our e-commerce warehouse includes picking items from shelves, packing them securely, printing shipping labels, handing over to courier, and updating the customer with tracking information.",
    "mermaid": "flowchart TD\n    Order[New Order Received] --> Pick[Pick Items from Shelves]\n    Pick --> Pack[Secure Packing]\n    Pack --> Label[Print Shipping Labels]\n    Label --> Handover[Hand to Courier]\n    Handover --> Notify[Send Tracking to Customer]",
    "expanded_text": "E-commerce order fulfillment is a fast-paced physical process. Items are picked according to the order, carefully packed to prevent damage, and labeled with shipping details. The package is handed to the courier service, and the customer is immediately provided with tracking information.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["fulfillment workflow"]
    }
  },
  {
    "input_text": "Our AI content moderation system scans text for toxicity, analyzes images for inappropriate content, flags suspicious posts for human review, applies actions based on severity, and logs decisions for model improvement.",
    "mermaid": "flowchart TD\n    Post[New Content Posted] --> Text[Scan Text for Toxicity]\n    Text --> Image[Analyze Images]\n    Image --> Flag{Flagged for Review?}\n    Flag -->|Yes| Human[Human Moderator Review]\n    Flag -->|No| Action[Apply Automated Action]\n    Human --> Action\n    Action --> Log[Log Decision for Training]",
    "expanded_text": "The content moderation pipeline combines automated AI checks with human oversight. Text is scanned for toxic language while images are analyzed for policy violations. Suspicious content is escalated to human moderators. Appropriate actions are taken based on severity, and all decisions help continuously improve the underlying models.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["moderation pipeline", "human-in-the-loop"]
    }
  },
  {
    "input_text": "The house cleaning routine starts with decluttering surfaces, followed by dusting furniture, vacuuming floors, cleaning bathrooms, wiping kitchen counters, and finally mopping the floors.",
    "mermaid": "flowchart TD\n    Start[Begin House Cleaning] --> Declutter[Declutter Surfaces]\n    Declutter --> Dust[Dust Furniture]\n    Dust --> Vacuum[Vacuum Floors]\n    Vacuum --> Bathroom[Clean Bathrooms]\n    Bathroom --> Kitchen[Wipe Kitchen Counters]\n    Kitchen --> Mop[Mop All Floors]",
    "expanded_text": "Weekly house cleaning follows a logical top-to-bottom sequence. It begins with decluttering visible surfaces, then dusting, vacuuming, deep cleaning bathrooms, wiping down the kitchen, and ends with mopping floors to avoid re-dirtying cleaned areas.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential routine", "logical order"]
    }
  },
  {
    "input_text": "Team sprint planning includes reviewing the product backlog, discussing user stories, estimating effort with story points, selecting items for the sprint, identifying dependencies, and committing to the sprint goal.",
    "mermaid": "flowchart TD\n    Backlog[Review Product Backlog] --> Discuss[Discuss User Stories]\n    Discuss --> Estimate[Estimate Effort]\n    Estimate --> Select[Select Sprint Items]\n    Select --> Dependencies[Identify Dependencies]\n    Dependencies --> Commit[Commit to Sprint Goal]",
    "expanded_text": "Sprint planning is a collaborative team activity. The team reviews the backlog, discusses details of user stories, estimates effort using story points, selects what can be completed, maps out dependencies, and collectively commits to achievable sprint goals.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["planning process", "team collaboration"]
    }
  },
  {
    "input_text": "When feeling stressed, I first recognize the signs, take deep breaths, go for a short walk, listen to calming music, talk to someone close, and reflect on what I can control.",
    "mermaid": "flowchart TD\n    Stress[Feeling Stressed] --> Recognize[Recognize Symptoms]\n    Recognize --> Breathe[Practice Deep Breathing]\n    Breathe --> Walk[Take Short Walk]\n    Walk --> Music[Listen to Calming Music]\n    Music --> Talk[Talk to Someone]\n    Talk --> Reflect[Reflect on Controllables]",
    "expanded_text": "Personal stress management uses a progressive calming sequence. It starts with awareness of stress signals, followed by breathing exercises, physical movement, soothing music, social support, and cognitive reframing focused on what can be controlled.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["coping sequence", "emotional regulation"]
    }
  },
  {
    "input_text": "The recruitment funnel begins with job posting, followed by resume screening, phone screening, technical interviews, cultural fit assessment, offer extension, and onboarding preparation.",
    "mermaid": "flowchart TD\n    Post[Job Posting] --> Screen[Resume Screening]\n    Screen --> Phone[Phone Screening]\n    Phone --> Technical[Technical Interviews]\n    Technical --> Cultural[Cultural Fit Assessment]\n    Cultural --> Offer[Extend Offer]\n    Offer --> Onboard[Prepare Onboarding]",
    "expanded_text": "The hiring funnel systematically narrows down candidates. It starts with public job posting and moves through resume screening, initial phone calls, technical evaluations, cultural fit interviews, formal offers, and preparation for new hire onboarding.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["funnel process", "sequential filtering"]
    }
  },
  {
    "input_text": "Making homemade pizza involves preparing the dough, letting it rise, shaping the base, adding sauce and toppings, baking in a hot oven, and slicing before serving.",
    "mermaid": "flowchart TD\n    Dough[Prepare Pizza Dough] --> Rise[Let Dough Rise]\n    Rise --> Shape[Shape Pizza Base]\n    Shape --> Toppings[Add Sauce & Toppings]\n    Toppings --> Bake[Bake in Hot Oven]\n    Bake --> Slice[Slice and Serve]",
    "expanded_text": "Homemade pizza making is a multi-stage culinary process. Fresh dough is prepared and allowed to rise. It is then shaped into a base, covered with sauce and chosen toppings, baked at high temperature, and finally sliced for serving.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["recipe workflow"]
    }
  },
  {
    "input_text": "Our risk management process identifies potential risks, assesses their likelihood and impact, develops mitigation strategies, assigns owners, monitors throughout the project, and reviews after completion.",
    "mermaid": "flowchart TD\n    Identify[Identify Risks] --> Assess[Assess Likelihood & Impact]\n    Assess --> Mitigate[Develop Mitigation Plans]\n    Mitigate --> Assign[Assign Risk Owners]\n    Assign --> Monitor[Monitor Risks]\n    Monitor --> Review[Post-Project Review]",
    "expanded_text": "Project risk management is proactive and continuous. Risks are identified early, then assessed for probability and potential impact. Mitigation strategies are created and assigned to responsible owners. Ongoing monitoring occurs throughout the project lifecycle, ending with a lessons-learned review.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["risk management cycle"]
    }
  },
  {
    "input_text": "The plant growth process starts with seed germination, followed by seedling development, vegetative growth, flowering, pollination, fruit development, and seed dispersal.",
    "mermaid": "flowchart TD\n    Germination[Seed Germination] --> Seedling[Seedling Development]\n    Seedling --> Vegetative[Vegetative Growth]\n    Vegetative --> Flowering[Flowering Stage]\n    Flowering --> Pollination[Pollination]\n    Pollination --> Fruit[Fruit Development]\n    Fruit --> Dispersal[Seed Dispersal]",
    "expanded_text": "Plant development follows distinct biological stages. It begins with seed germination, progresses through seedling and vegetative growth phases, leads to flowering and pollination, then fruit formation, and concludes with seed dispersal to continue the cycle.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["biological cycle", "sequential stages"]
    }
  },
  {
    "input_text": "When updating website content, the marketing team drafts new copy, gets legal approval for claims, designs supporting visuals, has the content reviewed by stakeholders, publishes it, and monitors engagement metrics.",
    "mermaid": "flowchart TD\n    Draft[Draft New Content] --> Legal[Legal Approval]\n    Legal --> Design[Create Visuals]\n    Design --> Review[Stakeholder Review]\n    Review --> Publish[Publish on Website]\n    Publish --> Monitor[Monitor Engagement]",
    "expanded_text": "Website content updates follow a careful review process. Marketing drafts the copy, legal approves any claims, visuals are designed, and stakeholders provide final feedback. Once published, performance metrics are tracked to measure effectiveness.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["content publishing workflow", "approval gates"]
    }
  },
  {
    "input_text": "In our MOBA game, players choose heroes, enter matchmaking, play team fights, destroy enemy structures, defeat the enemy base, and earn rewards based on performance.",
    "mermaid": "flowchart TD\n    Choose[Select Hero] --> Matchmaking[Enter Matchmaking]\n    Matchmaking --> Laning[Laning Phase]\n    Laning --> Teamfight[Team Fights]\n    Teamfight --> Destroy[Destroy Structures]\n    Destroy --> Win{Win Match?}\n    Win -->|Yes| Rewards[Earn Rewards]",
    "expanded_text": "A typical MOBA match follows strategic phases. Players select heroes and enter matchmaking. The early game focuses on laning, then transitions into team fights. Teams work together to destroy enemy structures and ultimately the enemy base. Victory grants performance-based rewards.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["game phases", "team objective flow"]
    }
  },
  {
    "input_text": "Handling customer complaints involves listening empathetically, apologizing for the inconvenience, investigating the root cause, offering a suitable solution, following up to ensure satisfaction, and recording the case for quality improvement.",
    "mermaid": "flowchart TD\n    Receive[Receive Complaint] --> Listen[Listen Empathetically]\n    Listen --> Apologize[Apologize Sincerely]\n    Apologize --> Investigate[Investigate Cause]\n    Investigate --> Solution[Offer Resolution]\n    Solution --> FollowUp[Follow-up with Customer]\n    FollowUp --> Record[Record for Improvement]",
    "expanded_text": "Effective complaint handling prioritizes empathy and resolution. The team listens carefully, apologizes, investigates the underlying issue, proposes fair solutions, follows up to confirm customer satisfaction, and documents insights to prevent recurrence.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["service recovery process", "feedback loop"]
    }
  },
  {
    "input_text": "A user wants to transfer money to a friend using a banking app. They log in and select 'Send Money'. They enter the recipient's phone number and amount. The system checks if the recipient is registered with the same bank. If not, it prompts the user to use a different method (e.g., wire transfer). If yes, it checks the user's balance. If insufficient funds, it shows an error and asks the user to enter a lower amount. If sufficient, it sends a push notification to the recipient to accept the transfer. The recipient has 5 minutes to accept. If accepted, the money is deducted from the sender and credited to the recipient instantly. If not accepted, the transfer is canceled. A confirmation message is sent to both parties via SMS.",
    "mermaid": "graph TD\n    A[Login to banking app] --> B[Select 'Send Money']\n    B --> C[Enter recipient phone number and amount]\n    C --> D{Recipient registered with same bank?}\n    D -->|No| E[Prompt: use different method]\n    D -->|Yes| F[Check user balance]\n    F --> G{Sufficient funds?}\n    G -->|No| H[Show error, ask for lower amount]\n    H --> C\n    G -->|Yes| I[Send push notification to recipient to accept]\n    I --> J{Recipient accepts within 5 minutes?}\n    J -->|Yes| K[Deduct sender, credit recipient instantly]\n    J -->|No| L[Cancel transfer]\n    K --> M[Send SMS confirmation to both parties]\n    L --> M",
    "expanded_text": "The money transfer process begins when a user logs into their banking app and selects 'Send Money'. They enter the recipient's phone number and the amount to send. The system first checks whether the recipient is registered with the same bank. If not, the user is prompted to use a different transfer method (such as a wire transfer or external service). If the recipient is registered, the system checks the user's account balance. If funds are insufficient, an error is shown and the user is asked to enter a lower amount. If funds are sufficient, the system sends a push notification to the recipient requesting acceptance. The recipient has 5 minutes to accept the transfer. If accepted, the money is deducted from the sender's account and credited to the recipient's account instantly. If not accepted within the time limit, the transfer is canceled. In either final case (accepted or canceled after timeout), an SMS confirmation is sent to both parties.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "timeout", "two-factor acceptance", "retry on insufficient funds"]
    }
  },
  {
    "input_text": "A student registers for courses online. The student logs into the portal and selects a course. The system checks if the student has met the prerequisites. If not, registration is blocked and the student is shown which prerequisites are missing. If prerequisites are met, the system checks if the course has available seats. If seats are full, the student is added to a waitlist and notified when a seat becomes available. If seats are available, the system checks for time conflicts with already registered courses. If a conflict exists, the student is asked to drop one of the conflicting courses. If no conflict, registration is confirmed and the student receives an email. The student can repeat the process for up to 5 courses per semester.",
    "mermaid": "graph TD\n    A[Login to portal] --> B[Select a course]\n    B --> C{Prerequisites met?}\n    C -->|No| D[Block registration, show missing prerequisites]\n    C -->|Yes| E{Seats available?}\n    E -->|No| F[Add to waitlist, notify when seat opens]\n    E -->|Yes| G{Time conflict with existing courses?}\n    G -->|Yes| H[Ask student to drop conflicting course]\n    H --> B\n    G -->|No| I[Confirm registration, send email]\n    I --> J{Registered courses < 5?}\n    J -->|Yes| B\n    J -->|No| K[End - max courses reached]",
    "expanded_text": "The online course registration process begins when a student logs into the portal and selects a course. The system checks whether the student has met the prerequisites for that course. If not, registration is blocked and the student is shown which specific prerequisites are missing. If prerequisites are met, the system checks whether the course has available seats. If seats are full, the student is added to a waitlist and will be notified when a seat becomes available. If seats are available, the system checks for time conflicts with courses the student has already registered for. If a conflict exists, the student is asked to drop one of the conflicting courses, and the process restarts from course selection. If there is no conflict, registration is confirmed and an email confirmation is sent. The student may repeat this process for additional courses up to a maximum of 5 courses per semester.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["conditional branches", "prerequisite check", "waitlist", "conflict resolution", "max enrollment limit"]
    }
  },
  {
    "input_text": "A user interacts with a voice assistant to set an alarm. The user says 'Set alarm for 7 AM'. The assistant confirms the time and asks for a label (optional). The user says 'Weekday'. The assistant checks if an alarm already exists for that time. If yes, it asks if the user wants to replace it. If the user says yes, the old alarm is overwritten. If no, the assistant asks for a different time. If no existing alarm, the assistant saves the alarm. At 7 AM on weekdays, the alarm rings. The user can say 'Snooze' to delay by 10 minutes, up to 3 times. After the third snooze or if the user says 'Stop', the alarm stops. If the user does not interact, the alarm rings for 5 minutes then auto-stops.",
    "mermaid": "graph TD\n    A[User: 'Set alarm for 7 AM'] --> B[Assistant: confirm time, ask for label]\n    B --> C[User: 'Weekday']\n    C --> D{Alarm exists at 7 AM already?}\n    D -->|Yes| E[Assistant: 'Replace existing alarm?']\n    E --> F{User says 'Yes'?}\n    F -->|Yes| G[Overwrite old alarm]\n    F -->|No| H[Assistant asks for different time]\n    H --> A\n    D -->|No| G\n    G --> I[Alarm saved]\n    I --> J[7 AM weekday: alarm rings]\n    J --> K{User action}\n    K -->|Snooze| L{Snooze count < 3?}\n    L -->|Yes| M[Delay 10 minutes, increment snooze count, return to J]\n    L -->|No| N[Stop alarm]\n    K -->|Stop| N\n    K -->|No interaction for 5 min| N",
    "expanded_text": "The voice assistant alarm setting process starts when the user says 'Set alarm for 7 AM'. The assistant confirms the time and asks for an optional label. The user responds 'Weekday'. The assistant checks whether an alarm already exists for that exact time. If an alarm exists, the assistant asks if the user wants to replace it. If the user says yes, the old alarm is overwritten. If the user says no, the assistant asks for a different time and the process restarts. If no existing alarm is found, or after overwriting, the alarm is saved. At 7 AM on weekdays, the alarm rings. The user can say 'Snooze' to delay by 10 minutes; this can be done up to three times. After the third snooze, or if the user says 'Stop', the alarm stops. If the user does not interact with the alarm at all, it rings for 5 minutes and then auto-stops.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "retry/alternative path", "snooze loop with counter", "timeout auto-stop"]
    }
  },
  {
    "input_text": "A support ticket escalation matrix. Level 1 support tries to resolve a ticket. If they cannot resolve within 30 minutes, the ticket escalates to Level 2. Level 2 has 2 hours to resolve. If unresolved, it escalates to Level 3 (engineering). Level 3 has 4 hours to resolve. If still unresolved, a critical incident is declared and the head of engineering is notified. The head of engineering can either assign more resources or declare an outage. If an outage is declared, the status page is updated. At any level, if a solution is found, the ticket is closed and the customer is notified. The customer can reopen a closed ticket within 7 days if the issue recurs.",
    "mermaid": "graph TD\n    A[Ticket created] --> B[Level 1 support tries to resolve]\n    B --> C{Resolved within 30 min?}\n    C -->|Yes| D[Close ticket, notify customer]\n    C -->|No| E[Escalate to Level 2]\n    E --> F[Level 2 tries to resolve within 2 hours]\n    F --> G{Resolved?}\n    G -->|Yes| D\n    G -->|No| H[Escalate to Level 3 (engineering)]\n    H --> I[Level 3 tries to resolve within 4 hours]\n    I --> J{Resolved?}\n    J -->|Yes| D\n    J -->|No| K[Declare critical incident, notify head of engineering]\n    K --> L{Head of engineering decision}\n    L -->|Assign more resources| I\n    L -->|Declare outage| M[Update status page]\n    D --> N{Customer reopens within 7 days?}\n    N -->|Yes| A\n    N -->|No| O[End]",
    "expanded_text": "The support ticket escalation process begins when a ticket is created. Level 1 support attempts to resolve it within 30 minutes. If successful, the ticket is closed and the customer is notified. If not, the ticket escalates to Level 2 support, which has 2 hours to resolve. If Level 2 resolves it, the ticket closes and the customer is notified. If not, the ticket escalates to Level 3 (engineering), which has 4 hours to resolve. If Level 3 resolves it, the ticket closes. If not, a critical incident is declared and the head of engineering is notified. The head may assign more resources to Level 3 (looping back to the Level 3 resolution attempt) or declare an outage, which triggers a status page update. After a ticket is closed, the customer may reopen it within 7 days if the same issue recurs, restarting the entire process from ticket creation.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["sequential flows", "time-based escalation", "conditional branches", "reopen loop", "escalation matrix"]
    }
  },
  {
    "input_text": "A user creates a new project in a project management tool. They click 'New Project' and enter a name, description, and due date. The system checks if the project name is unique within the organization. If not, it suggests an alternative name. If unique, the system creates the project and asks the user to add team members. The user can add members by email or username. The system sends an email invitation to each added member. Members have 7 days to accept. If a member does not accept within 7 days, the system automatically removes them from the project and notifies the project owner. The project owner can also manually remove members at any time. When at least one member has accepted, the project status changes from 'Planning' to 'Active'.",
    "mermaid": "graph TD\n    A[Click 'New Project'] --> B[Enter name, description, due date]\n    B --> C{Project name unique?}\n    C -->|No| D[Suggest alternative name]\n    D --> B\n    C -->|Yes| E[Create project, status Planning]\n    E --> F[User adds team members by email/username]\n    F --> G[Send email invitation to each member]\n    G --> H{Member accepts within 7 days?}\n    H -->|Yes| I[Member added to project]\n    H -->|No| J[Auto-remove member, notify owner]\n    I --> K{At least one member accepted?}\n    J --> K\n    K -->|Yes| L[Change project status to Active]\n    K -->|No| M[Remain in Planning status]\n    E --> N[Project owner can manually remove member anytime]\n    N --> I",
    "expanded_text": "When a user creates a new project, they click 'New Project' and enter a name, description, and due date. The system checks whether the project name is unique within the organization. If the name is not unique, it suggests an alternative name and asks the user to re-enter. If the name is unique, the system creates the project with an initial status of 'Planning'. The user is then prompted to add team members by email or username. For each added member, the system sends an email invitation. Members have 7 days to accept the invitation. If a member accepts within that window, they are added to the project. If they do not accept within 7 days, the system automatically removes them and notifies the project owner. The project owner may also manually remove members at any time. Once at least one member has accepted their invitation, the project status changes from 'Planning' to 'Active'. If no members accept, the project remains in 'Planning' indefinitely.",
    "metadata": {
      "domain": "productivity",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "invitation timeout", "manual removal", "status transition"]
    }
  },
  {
    "input_text": "A scientific peer review process for a journal. An author submits a manuscript. The editor performs an initial check for scope and formatting. If the manuscript is out of scope or poorly formatted, it is rejected without review (desk reject). If it passes, the editor selects 2-3 peer reviewers. Reviewers have 3 weeks to submit their comments. If a reviewer declines or does not respond within 3 weeks, the editor finds a replacement. When all reviews are in, the editor makes a decision: accept, minor revisions, major revisions, or reject. If accept, the manuscript goes to production. If minor or major revisions, the author has 2 weeks (minor) or 6 weeks (major) to resubmit. The revised manuscript is sent back to the original reviewers for a second round. If reject, the author is notified with reviewer comments. The author can appeal a reject decision within 30 days by submitting a rebuttal letter.",
    "mermaid": "graph TD\n    A[Author submits manuscript] --> B[Editor initial check: scope and format]\n    B --> C{Passes check?}\n    C -->|No| D[Desk reject]\n    C -->|Yes| E[Editor selects 2-3 reviewers]\n    E --> F[Invite reviewers, 3 weeks to respond]\n    F --> G{Reviewer declines or no response?}\n    G -->|Yes| H[Find replacement reviewer]\n    H --> F\n    G -->|No| I[All reviews received]\n    I --> J[Editor decision]\n    J --> K{Decision type}\n    K -->|Accept| L[Send to production]\n    K -->|Minor revisions| M[Author has 2 weeks to revise]\n    K -->|Major revisions| N[Author has 6 weeks to revise]\n    K -->|Reject| O[Notify author with comments]\n    M --> P[Resubmit revision to same reviewers]\n    N --> P\n    P --> Q{Reviewers approve?}\n    Q -->|Yes| L\n    Q -->|No| J\n    O --> R{Author appeals within 30 days?}\n    R -->|Yes| S[Editor reviews rebuttal]\n    S --> J\n    R -->|No| T[Process ends]",
    "expanded_text": "The scientific peer review process begins when an author submits a manuscript to a journal. The editor performs an initial check for alignment with the journal's scope and adherence to formatting guidelines. If the manuscript is out of scope or poorly formatted, it receives a desk rejection without external review. If it passes, the editor selects two to three peer reviewers. Reviewers are given three weeks to submit their comments. If a reviewer declines the invitation or fails to respond within three weeks, the editor finds a replacement and re-invites. Once all reviews are received, the editor makes a decision: accept, minor revisions, major revisions, or reject. If accepted, the manuscript goes to production. If minor or major revisions are requested, the author has two weeks (for minor) or six weeks (for major) to revise and resubmit. The revised manuscript is sent back to the original reviewers for a second round of review. If the reviewers approve, the manuscript is accepted; if not, the editor decides again. If the initial decision is reject, the author is notified with reviewer comments. The author may appeal a reject decision within 30 days by submitting a rebuttal letter, which the editor reviews before making a final decision.",
    "metadata": {
      "domain": "science",
      "complexity": "high",
      "graph_features": ["sequential flows", "conditional branches", "revision loops (minor/major)", "reviewer replacement", "appeal path"]
    }
  },
  {
    "input_text": "A cybersecurity user tries to log into a corporate VPN. They enter their username, password, and a one-time code from an authenticator app. The system first checks if the user's device is compliant with company policies (disk encryption, OS updates). If the device is non-compliant, access is blocked and the user is directed to IT to remediate. If compliant, the system authenticates credentials and OTP. If authentication fails three times, the account is locked for 15 minutes. After successful authentication, the system checks if the user's IP address is from an allowed country list. If not, access is blocked and an alert is sent to security. If allowed, the VPN connection is established. The user is prompted to re-authenticate every 8 hours.",
    "mermaid": "graph TD\n    A[Enter username, password, OTP] --> B{Device compliant? (encryption, OS updates)}\n    B -->|No| C[Block access, direct to IT for remediation]\n    B -->|Yes| D[Authenticate credentials and OTP]\n    D --> E{Auth succeeds?}\n    E -->|No| F[Failed attempt counter +1]\n    F --> G{Attempts < 3?}\n    G -->|Yes| A\n    G -->|No| H[Lock account for 15 minutes]\n    E -->|Yes| I{IP address from allowed country list?}\n    I -->|No| J[Block access, send alert to security]\n    I -->|Yes| K[Establish VPN connection]\n    K --> L[Connection active]\n    L --> M{8 hours elapsed?}\n    M -->|Yes| A\n    M -->|No| L",
    "expanded_text": "The corporate VPN login process begins when the user enters their username, password, and a one-time code from an authenticator app. The system first checks whether the user's device is compliant with company policies, including disk encryption and operating system updates. If the device is non-compliant, access is blocked and the user is directed to IT for remediation. If compliant, the system authenticates the credentials and OTP. If authentication fails, the failure counter increments; after three failures, the account is locked for 15 minutes. If authentication succeeds, the system checks whether the user's IP address originates from an allowed country list. If not, access is blocked and a security alert is sent. If allowed, the VPN connection is established. Once connected, the session remains active until 8 hours have elapsed, at which point the user is prompted to re-authenticate, restarting the login flow from credential entry.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["conditional branches", "device compliance check", "retry with lockout", "geo-IP filtering", "re-authentication timer loop"]
    }
  },
  {
    "input_text": "A game quest system for an RPG. The player accepts a quest from an NPC. The quest has three objectives: collect 10 wolf pelts, defeat a goblin chief, and return to the NPC. The player can complete objectives in any order. The quest log tracks each objective's status. When all three objectives are complete, the quest status changes to 'Ready to turn in'. The player returns to the NPC and selects 'Complete Quest'. The system checks if the player has all required items (pelts removed from inventory, goblin chief must be dead in quest flags). If all conditions met, the player receives 500 XP and 100 gold. If the player tries to turn in without completing all objectives, the NPC says a specific dialogue: 'You haven't finished yet!' The player can abandon the quest at any time, which removes all progress and quest items from inventory.",
    "mermaid": "graph TD\n    A[Accept quest from NPC] --> B[Quest active: 3 objectives]\n    B --> C[Collect 10 wolf pelts]\n    B --> D[Defeat goblin chief]\n    B --> E[Return to NPC]\n    C --> F{Objective complete?}\n    D --> F\n    E --> F\n    F -->|No| B\n    F -->|Yes (all 3)| G[Quest status: Ready to turn in]\n    G --> H[Player returns to NPC, selects 'Complete Quest']\n    H --> I{All conditions met? (pelts in inventory, chief dead)}\n    I -->|No| J[NPC dialogue: 'You haven't finished yet!']\n    J --> G\n    I -->|Yes| K[Remove pelts from inventory, reward 500 XP + 100 gold]\n    B --> L{Player abandons quest?}\n    L -->|Yes| M[Remove all progress and quest items, quest ends]\n    L -->|No| B",
    "expanded_text": "The RPG quest system starts when the player accepts a quest from an NPC. The quest has three objectives that can be completed in any order: collect 10 wolf pelts, defeat a goblin chief, and return to the NPC. The quest log tracks the status of each objective individually. When all three objectives are complete, the quest status changes to 'Ready to turn in'. The player then returns to the NPC and selects 'Complete Quest'. The system checks whether all conditions are met: the player must have 10 wolf pelts in their inventory, and the goblin chief must be marked as dead in the quest flags. If conditions are not met, the NPC displays a specific dialogue ('You haven't finished yet!') and the player is sent back to the ready state. If conditions are met, the pelts are removed from inventory, and the player receives 500 experience points and 100 gold. At any time during the active quest, the player may abandon the quest, which removes all progress and any quest-related items from inventory, ending the quest entirely.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["parallel objectives (any order)", "state tracking", "conditional completion", "abandon path"]
    }
  },
  {
    "input_text": "An employee requests a new laptop via an IT asset management system. The employee fills out a request form with specifications (RAM, storage, OS). The system checks if the requested configuration is within budget ($1500 limit). If over budget, the request is automatically rejected and the employee is asked to select lower specs. If within budget, the request is sent to the IT manager for approval. The IT manager has 2 business days to approve or deny. If no response within 2 days, a reminder is sent and the clock resets for 2 more days. If still no response after the second reminder, the request is auto-approved. If approved, the system checks inventory. If the laptop is in stock, it is assigned to the employee and shipped within 3 days. If not in stock, a purchase order is created, and the employee is notified of a 2-week lead time. Once shipped, the employee receives a tracking number.",
    "mermaid": "graph TD\n    A[Fill request: RAM, storage, OS] --> B{Configuration within $1500 budget?}\n    B -->|No| C[Auto-reject, ask for lower specs]\n    C --> A\n    B -->|Yes| D[Send to IT manager for approval]\n    D --> E{Manager approves within 2 business days?}\n    E -->|Yes| F[Proceed to inventory check]\n    E -->|No| G[Send reminder, wait 2 more days]\n    G --> H{Manager approves within second period?}\n    H -->|Yes| F\n    H -->|No| I[Auto-approve request]\n    I --> F\n    F --> J{Laptop in stock?}\n    J -->|Yes| K[Assign to employee, ship within 3 days]\n    J -->|No| L[Create purchase order, notify employee of 2-week lead time]\n    L --> M[Order arrives, assign to employee, ship]\n    K --> N[Employee receives tracking number]\n    M --> N",
    "expanded_text": "The IT asset request process begins when an employee fills out a request form specifying desired RAM, storage, and operating system. The system checks whether the requested configuration falls within the budget limit of $1500. If over budget, the request is automatically rejected and the employee is asked to select lower specifications, looping back to the form. If within budget, the request is sent to the IT manager for approval. The manager has 2 business days to approve or deny. If no response within 2 days, a reminder is sent and the manager receives an additional 2 days. If still no response after the second reminder, the request is auto-approved. Once approved (either by manager or auto-approval), the system checks inventory. If the laptop is in stock, it is assigned to the employee and shipped within 3 days. If not in stock, a purchase order is created and the employee is notified of a 2-week lead time; when the order arrives, the laptop is assigned and shipped. Finally, the employee receives a tracking number for the shipment.",
    "metadata": {
      "domain": "HR workflows",
      "complexity": "medium",
      "graph_features": ["conditional branches", "budget check", "approval with reminders and timeout", "auto-approval fallback", "inventory check with lead time"]
    }
  },
  {
    "input_text": "A family uses a shared grocery list app. Anyone in the family can add an item to the list. When an item is added, the app sends a push notification to all family members. A member can mark an item as 'purchased'. Once marked purchased, the item is moved to a separate 'purchased' section and a notification is sent that the item has been bought. If a member accidentally marks the wrong item, they can undo within 30 seconds. After 30 seconds, the item is permanently in purchased and cannot be undone; a family member must re-add it to the active list. At the end of each week, the app automatically clears the purchased section and archives it to a history log. Any items remaining in the active list for more than 14 days are highlighted in red and a reminder is sent to all members.",
    "mermaid": "graph TD\n    A[Member adds item to list] --> B[Send push notification to all members]\n    B --> C[Item in active list]\n    C --> D{Member marks item as purchased?}\n    D -->|Yes| E[Move item to purchased section]\n    E --> F[Send notification: item bought]\n    F --> G{Member undoes within 30 seconds?}\n    G -->|Yes| H[Move back to active list]\n    G -->|No| I[Item permanently in purchased]\n    I --> J{Item needed again?}\n    J -->|Yes| K[Member must re-add to active list]\n    K --> A\n    J -->|No| L[Item stays in purchased]\n    C --> M{Item in active list > 14 days?}\n    M -->|Yes| N[Highlight red, send reminder to all]\n    N --> C\n    I --> O[End of week: clear purchased section, archive to history log]",
    "expanded_text": "The shared grocery list app allows any family member to add an item to the list. When an item is added, a push notification is sent to all family members. The item resides in the active list. A member can mark an item as 'purchased', which moves it to a separate purchased section and sends a notification that the item has been bought. If the member accidentally marked the wrong item, they have 30 seconds to undo the action; if undone, the item moves back to the active list. After 30 seconds, the item is permanently fixed in the purchased section. If the family still needs that item, a member must re-add it to the active list manually. Any item that remains in the active list for more than 14 days is highlighted in red, and a reminder notification is sent to all members. At the end of each week, the app automatically clears the purchased section and archives its contents to a history log for future reference.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "undo window (30 sec)", "time-based highlights (14 days)", "weekly archive"]
    }
  },
  {
    "input_text": "Every morning I check the weather. If it's sunny I go for a run, otherwise I do indoor yoga. Then I shower, make coffee, prepare breakfast, review my to-do list, and start working.",
    "mermaid": "flowchart TD\n    Wake[Wake Up] --> Weather{Check Weather}\n    Weather -->|Sunny| Run[Go for Outdoor Run]\n    Weather -->|Rainy| Yoga[Indoor Yoga]\n    Run --> Shower[Take Shower]\n    Yoga --> Shower\n    Shower --> Coffee[Make Coffee]\n    Coffee --> Breakfast[Prepare Breakfast]\n    Breakfast --> Review[Review To-Do List]\n    Review --> Work[Start Workday]",
    "expanded_text": "The morning routine begins upon waking and immediately checking the weather forecast. This decision point determines physical activity — an outdoor run on sunny days or indoor yoga when it's raining. Both paths lead to showering, making coffee, preparing breakfast, reviewing daily tasks, and transitioning into the workday.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["conditional branching", "converging paths", "sequential routine"]
    }
  },
  {
    "input_text": "Our new product development process starts with idea generation, then market research, concept validation, detailed design, prototype building, user testing, iteration based on feedback, and finally production planning.",
    "mermaid": "flowchart TD\n    Idea[Idea Generation] --> Research[Market Research]\n    Research --> Validation[Concept Validation]\n    Validation --> Design[Detailed Design Phase]\n    Design --> Prototype[Build Prototype]\n    Prototype --> Testing[User Testing]\n    Testing --> Feedback{Feedback Positive?}\n    Feedback -->|No| Design\n    Feedback -->|Yes| Production[Production Planning]",
    "expanded_text": "Product development is an iterative journey beginning with idea generation and thorough market research. Concepts are validated before moving into detailed design and prototype creation. User testing provides critical feedback that often triggers design iterations. Only when feedback is consistently positive does the process advance to production planning.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["iterative loop", "feedback-driven progression"]
    }
  },
  {
    "input_text": "When admitting a patient to the hospital, staff first complete registration, verify insurance, conduct initial assessment, assign a room, update electronic records, and inform the attending physician.",
    "mermaid": "flowchart TD\n    Arrival[Patient Arrival] --> Registration[Complete Registration]\n    Registration --> Insurance[Verify Insurance]\n    Insurance --> Assessment[Initial Medical Assessment]\n    Assessment --> Room[Assign Room]\n    Room --> Records[Update Electronic Health Records]\n    Records --> Inform[Notify Attending Physician]",
    "expanded_text": "Hospital admission follows a standardized administrative and clinical sequence. Registration and insurance verification occur first, followed by a quick medical assessment. The patient is then assigned a room, all information is entered into the digital system, and the responsible physician is promptly informed.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["admission workflow", "sequential verification"]
    }
  },
  {
    "input_text": "Feature requests from customers go through initial review, prioritization by the product team, technical feasibility assessment, development if approved, QA testing, and release in the next sprint.",
    "mermaid": "flowchart TD\n    Request[Customer Feature Request] --> Review[Initial Triage]\n    Review --> Prioritize[Product Team Prioritization]\n    Prioritize --> Feasibility[Technical Feasibility Check]\n    Feasibility --> Approve{Approved?}\n    Approve -->|Yes| Develop[Development]\n    Approve -->|No| Backlog[Add to Backlog]\n    Develop --> QA[QA Testing]\n    QA --> Release[Release in Next Sprint]",
    "expanded_text": "Customer feature requests enter a structured evaluation pipeline. After initial review and product team prioritization, technical feasibility is assessed. Approved requests move into development, followed by rigorous QA testing before being included in the upcoming sprint release. Rejected ideas are stored for future consideration.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["prioritization workflow", "decision gate"]
    }
  },
  {
    "input_text": "To complete a group project, students first assign roles, create a timeline, conduct individual research, hold progress meetings, compile findings, review the final draft together, and submit before the deadline.",
    "mermaid": "flowchart TD\n    Start[Project Assigned] --> Roles[Assign Team Roles]\n    Roles --> Timeline[Create Project Timeline]\n    Timeline --> Research[Individual Research]\n    Research --> Meetings[Progress Meetings]\n    Meetings --> Compile[Compile Findings]\n    Compile --> Review[Team Final Review]\n    Review --> Submit[Submit Project]",
    "expanded_text": "Successful group projects require clear coordination. Roles are assigned early and a shared timeline is established. Team members conduct individual research before regular progress meetings. Findings are compiled, the complete draft is reviewed collectively, and the final version is submitted before the deadline.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["collaborative workflow", "parallel tasks"]
    }
  },
  {
    "input_text": "Loan approval at the bank involves application submission, credit check, income verification, collateral evaluation for large loans, risk committee review, and final decision notification to the applicant.",
    "mermaid": "flowchart TD\n    Submit[Loan Application] --> Credit[Credit Score Check]\n    Credit --> Income[Income Verification]\n    Income --> Collateral{Requires Collateral?}\n    Collateral -->|Yes| Evaluate[Collateral Evaluation]\n    Collateral -->|No| Committee[Risk Committee Review]\n    Evaluate --> Committee\n    Committee --> Decision[Final Decision]\n    Decision --> Notify[Notify Applicant]",
    "expanded_text": "Bank loan processing includes several risk assessment layers. After application submission, credit history and income are verified. Larger loans require collateral evaluation. All cases go through a risk committee before a final decision is made and communicated to the applicant.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["conditional branching", "risk assessment flow"]
    }
  },
  {
    "input_text": "In our RPG, players explore the world, complete side quests to gain experience, upgrade equipment, strengthen alliances, and eventually challenge the main story boss.",
    "mermaid": "flowchart TD\n    Start[Begin Adventure] --> Explore[World Exploration]\n    Explore --> Quests[Complete Side Quests]\n    Quests --> Upgrade[Upgrade Equipment]\n    Upgrade --> Alliances[Build Alliances]\n    Alliances --> Challenge[Challenge Main Boss]",
    "expanded_text": "Progression in the role-playing game encourages exploration and side activities. Players explore the open world and complete optional quests to earn experience and rewards. These allow equipment upgrades and alliance building, which ultimately prepare them to face the main story boss.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["progression system", "optional paths"]
    }
  },
  {
    "input_text": "Sarah and Mike argued about household chores again. Sarah felt overwhelmed and unheard while Mike thought he was already doing enough. They both cooled down, sat together, listed all tasks, divided them fairly, and agreed to review the arrangement in two weeks.",
    "mermaid": "flowchart TD\n    Argument[Argument About Chores] --> Emotions[Emotional Cooling Period]\n    Emotions --> Discussion[Calm Discussion]\n    Discussion --> List[List All Tasks]\n    List --> Divide[Fair Division of Chores]\n    Divide --> Agreement[Mutual Agreement]\n    Agreement --> Review[Review in Two Weeks]",
    "expanded_text": "This domestic conflict resolution shows a healthy approach. After the initial argument, both partners take time to calm down before engaging in constructive discussion. They create a complete list of responsibilities, divide them equitably, reach agreement, and set a future review date to ensure the system works.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["conflict resolution", "emotional progression"]
    }
  },
  {
    "input_text": "The continuous integration pipeline triggers on code commit, runs unit tests, performs code quality checks, builds the application, runs integration tests, and notifies developers if any stage fails.",
    "mermaid": "flowchart TD\n    Commit[Code Commit] --> Unit[Run Unit Tests]\n    Unit --> Quality[Code Quality Analysis]\n    Quality --> Build[Build Application]\n    Build --> Integration[Run Integration Tests]\n    Integration --> Status{All Tests Passed?}\n    Status -->|No| Notify[Notify Developers]\n    Status -->|Yes| Success[Mark Build Successful]",
    "expanded_text": "The CI pipeline activates automatically upon every code commit. It sequentially executes unit tests, static code analysis, application build, and integration tests. Any failure immediately notifies the development team, while successful completion marks the build as green.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["automation pipeline", "failure notification"]
    }
  },
  {
    "input_text": "When planning a surprise proposal, Alex researched ring styles, saved money for months, chose a meaningful location, coordinated with friends for photography, rehearsed the moment, and finally popped the question.",
    "mermaid": "flowchart TD\n    Decide[Decide to Propose] --> Research[Research Ring Styles]\n    Research --> Save[Save Money]\n    Save --> Location[Choose Special Location]\n    Location --> Coordinate[Coordinate with Friends]\n    Coordinate --> Rehearse[Rehearse Proposal]\n    Rehearse --> Propose[Pop the Question]",
    "expanded_text": "Planning a surprise marriage proposal is a thoughtful, multi-month endeavor. It involves researching preferences, careful financial saving, selecting a meaningful location, secretly coordinating help for photography, rehearsing the moment, and ultimately executing the proposal.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["long-term planning", "secret coordination"]
    }
  },
  {
    "input_text": "When I feel overwhelmed with work, I first close all tabs, make a list of urgent tasks, tackle the most important one, take a short break, continue with the next priority, and reward myself after completing three major tasks.",
    "mermaid": "flowchart TD\n    Overwhelm[Feeling Overwhelmed] --> Close[Close All Tabs]\n    Close --> List[Make Priority List]\n    List --> First[Tackle Most Important Task]\n    First --> Break[Short Break]\n    Break --> Next[Next Priority Task]\n    Next --> Reward{Three Tasks Done?}\n    Reward -->|Yes| Treat[Reward Myself]\n    Reward -->|No| First",
    "expanded_text": "This personal stress management technique follows a structured reset. The user begins by clearing digital clutter, creates a focused priority list, attacks the highest-impact task first, incorporates short breaks, and builds momentum. After completing three key tasks, a small reward reinforces positive behavior.",
    "metadata": {
      "domain": "productivity",
      "complexity": "medium",
      "graph_features": ["looping workflow", "reward system", "prioritization"]
    }
  },
  {
    "input_text": "The employee promotion process includes performance evaluation, peer feedback collection, leadership discussion, skills gap analysis, final committee decision, and official announcement.",
    "mermaid": "flowchart TD\n    Evaluation[Performance Evaluation] --> Peer[Collect Peer Feedback]\n    Peer --> Leadership[Leadership Discussion]\n    Leadership --> Skills[Skills Gap Analysis]\n    Skills --> Committee[Promotion Committee Review]\n    Committee --> Decision[Final Decision]\n    Decision --> Announce[Official Announcement]",
    "expanded_text": "Promotion decisions follow a thorough multi-source evaluation. It starts with formal performance review, incorporates peer feedback, involves leadership discussions, includes skills assessment, and culminates in a committee decision before the official announcement to the employee.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["multi-source evaluation", "hierarchical decision"]
    }
  },
  {
    "input_text": "Making a cup of perfect filter coffee involves boiling water, grinding fresh beans, placing filter paper, adding coffee grounds, pouring hot water in stages, waiting for it to brew, and finally enjoying the cup.",
    "mermaid": "flowchart TD\n    Boil[Boil Water] --> Grind[Grind Fresh Beans]\n    Grind --> Filter[Place Filter Paper]\n    Filter --> Grounds[Add Coffee Grounds]\n    Grounds --> Pour[Pour Hot Water in Stages]\n    Pour --> Brew[Wait for Brewing]\n    Brew --> Serve[Enjoy Coffee]",
    "expanded_text": "Brewing filter coffee is a careful ritual. Fresh water is boiled while beans are ground. Filter paper is placed in the dripper, followed by the right amount of grounds. Hot water is poured in controlled stages to allow proper extraction. After brewing, the coffee is ready to serve.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["sequential process"]
    }
  },
  {
    "input_text": "Our incident post-mortem process includes collecting timeline data, identifying root causes, discussing what went well and what didn't, documenting lessons learned, creating action items, and tracking their completion.",
    "mermaid": "flowchart TD\n    Incident[Incident Resolved] --> Timeline[Collect Timeline Data]\n    Timeline --> Root[Identify Root Causes]\n    Root --> Discussion[Team Retrospective]\n    Discussion --> Lessons[Document Lessons Learned]\n    Lessons --> Actions[Create Action Items]\n    Actions --> Track[Track Implementation]",
    "expanded_text": "Post-incident analysis is crucial for improvement. The team gathers accurate timelines, digs deep into root causes, holds an open retrospective covering successes and failures, documents key lessons, defines concrete action items, and ensures follow-through on implementation.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["retrospective workflow", "continuous improvement"]
    }
  },
  {
    "input_text": "Planning a family vacation requires deciding the destination, setting dates, booking flights and hotel, planning daily activities, preparing necessary documents, and packing essentials.",
    "mermaid": "flowchart TD\n    Decide[Decide Destination] --> Dates[Set Travel Dates]\n    Dates --> Book[Book Flights & Hotel]\n    Book --> Activities[Plan Daily Itinerary]\n    Activities --> Documents[Prepare Travel Documents]\n    Documents --> Pack[Pack Essentials]",
    "expanded_text": "Family vacation planning is a coordinated effort. It begins with choosing a destination and suitable dates. Flights and accommodation are booked early. A rough daily itinerary is created, travel documents are organized, and finally, packing lists are prepared.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "medium",
      "graph_features": ["family coordination", "planning sequence"]
    }
  },
  {
    "input_text": "The fraud detection team monitors transactions in real-time, flags suspicious patterns, verifies with the customer, blocks the transaction if confirmed fraudulent, and updates the detection model with new data.",
    "mermaid": "flowchart TD\n    Monitor[Real-time Transaction Monitoring] --> Flag[Flag Suspicious Activity]\n    Flag --> Verify[Customer Verification]\n    Verify --> Confirmed{Confirmed Fraud?}\n    Confirmed -->|Yes| Block[Block Transaction]\n    Confirmed -->|No| Allow[Allow Transaction]\n    Block --> Update[Update Detection Model]",
    "expanded_text": "Fraud detection operates as a continuous real-time system. Suspicious transactions are flagged automatically and verified with the account holder. Confirmed fraudulent attempts are blocked immediately while legitimate ones proceed. All cases help retrain and improve the underlying detection algorithms.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["real-time monitoring", "verification loop"]
    }
  },
  {
    "input_text": "Learning a new language involves daily vocabulary practice, grammar study, listening to native speakers, speaking practice with partners, reviewing mistakes, and gradually increasing conversation complexity.",
    "mermaid": "flowchart TD\n    Vocab[Daily Vocabulary Practice] --> Grammar[Grammar Study]\n    Grammar --> Listen[Listen to Native Content]\n    Listen --> Speak[Speaking Practice]\n    Speak --> Review[Review Mistakes]\n    Review --> Increase[Increase Difficulty]",
    "expanded_text": "Language acquisition requires consistent, multi-faceted practice. Learners work on vocabulary and grammar fundamentals, immerse themselves through listening, practice speaking regularly, review errors, and progressively tackle more complex conversations.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["learning cycle", "progressive difficulty"]
    }
  },
  {
    "input_text": "Our content publishing workflow requires writers to submit drafts, editors to review for quality, designers to create visuals, legal to approve claims, and marketing to schedule and promote the final piece.",
    "mermaid": "flowchart TD\n    Submit[Writer Submits Draft] --> Edit[Editor Quality Review]\n    Edit --> Design[Create Supporting Visuals]\n    Design --> Legal[Legal Approval]\n    Legal --> Schedule[Marketing Schedules Post]\n    Schedule --> Promote[Promote Content]",
    "expanded_text": "Professional content publishing is a collaborative cross-functional process. After the writer submits the draft, editors refine quality and tone. Designers prepare visuals, legal reviews sensitive claims, and marketing handles final scheduling and promotion across channels.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["cross-team workflow", "approval chain"]
    }
  },
  {
    "input_text": "In emergency response, the team first secures the scene, assesses casualties, provides immediate first aid, calls for specialized help if needed, transports critical patients, and documents the entire incident.",
    "mermaid": "flowchart TD\n    Alert[Emergency Alert] --> Secure[Secure the Scene]\n    Secure --> Assess[Assess Casualties]\n    Assess --> Aid[Provide First Aid]\n    Aid --> Call{Call Specialized Help?}\n    Call -->|Yes| Request[Request Backup]\n    Aid --> Transport[Transport Critical Patients]\n    Transport --> Document[Document Incident]",
    "expanded_text": "Emergency medical response prioritizes safety and speed. The team first secures the area, quickly assesses victims, delivers immediate life-saving aid, requests specialized assistance when necessary, transports critical patients, and ensures complete documentation for follow-up.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["emergency protocol", "conditional escalation"]
    }
  },
  {
    "input_text": "Players in our strategy game gather resources, build bases, research technologies, train units, form alliances, and launch coordinated attacks against opponents.",
    "mermaid": "flowchart TD\n    Gather[Gather Resources] --> Build[Construct Base]\n    Build --> Research[Research Technologies]\n    Research --> Train[Train Military Units]\n    Train --> Alliance[Form Alliances]\n    Alliance --> Attack[Launch Coordinated Attacks]",
    "expanded_text": "Strategy game progression emphasizes balanced development. Players collect resources to expand their base and research new technologies. They train combat units, form strategic alliances with others, and eventually coordinate powerful attacks against rival players.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["strategy progression", "resource management"]
    }
  },
  {
    "input_text": "When a password is compromised, our security team forces a reset, notifies the user, reviews login attempts from the past 24 hours, scans for malware if suspicious activity is found, and strengthens account security settings.",
    "mermaid": "flowchart TD\n    Detect[Compromised Password Detected] --> Force[Force Password Reset]\n    Force --> Notify[Notify User]\n    Notify --> Review[Review Recent Login Attempts]\n    Review --> Suspicious{Suspicious Activity?}\n    Suspicious -->|Yes| Scan[Malware Scan]\n    Suspicious -->|No| Strengthen[Enhance Account Security]\n    Scan --> Strengthen",
    "expanded_text": "The compromised password response protocol begins with forcing an immediate password reset and notifying the affected user. The team then examines recent login activity. If suspicious patterns appear, a malware scan is performed. Finally, account security settings are strengthened with additional protections like two-factor authentication.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["incident response", "conditional branching", "security escalation"]
    }
  },
  {
    "input_text": "When a package delivery fails, the courier notes the reason, attempts redelivery the next day, contacts the recipient if needed, holds the package at the local depot after two attempts, and finally returns it to the sender if unclaimed.",
    "mermaid": "flowchart TD\n    Fail[Delivery Attempt Fails] --> Reason[Record Failure Reason]\n    Reason --> Redeliver[Schedule Redelivery]\n    Redeliver --> Contact{Contact Recipient?}\n    Contact --> Attempt2[Second Delivery Attempt]\n    Attempt2 --> Depot{Held at Depot?}\n    Depot -->|Yes| Return[Return to Sender]\n    Depot -->|No| Contact",
    "expanded_text": "Failed package delivery follows a clear escalation path. The system records the specific reason for failure and schedules a redelivery attempt. The recipient is contacted if necessary. After two unsuccessful tries, the package is held at the local depot. If still unclaimed, it is returned to the sender.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["exception handling", "retry logic", "escalation path"]
    }
  },
  {
    "input_text": "Our customer support chatbot tries to resolve simple queries automatically, but when it cannot understand the request or the user becomes frustrated, it transfers the conversation to a human agent.",
    "mermaid": "flowchart TD\n    Query[User Query] --> Bot[Chatbot Response]\n    Bot --> Success{Resolved?}\n    Success -->|Yes| End[End Conversation]\n    Success -->|No| Frustrated{User Frustrated?}\n    Frustrated -->|Yes| Transfer[Transfer to Human Agent]\n    Frustrated -->|No| Bot",
    "expanded_text": "The intelligent support chatbot first attempts to handle user queries autonomously. If the issue remains unresolved or the user shows signs of frustration through repeated messages or negative sentiment, the system seamlessly transfers the conversation to a live human support agent.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["decision logic", "escalation trigger"]
    }
  },
  {
    "input_text": "Students who want to appeal their final grade must submit a formal request with evidence, the professor reviews the appeal, consults with the department head if needed, makes a decision, and updates the student record.",
    "mermaid": "flowchart TD\n    Submit[Submit Grade Appeal] --> Evidence[Provide Supporting Evidence]\n    Evidence --> Professor[Professor Review]\n    Professor --> Consult{Consult Department Head?}\n    Consult -->|Yes| Head[Department Head Consultation]\n    Consult -->|No| Decision[Final Decision]\n    Head --> Decision\n    Decision --> Update[Update Student Record]",
    "expanded_text": "The grade appeal process ensures academic fairness. Students submit a formal request with clear evidence. The professor reviews the case and may consult the department head for complex situations. A final decision is made and the student's academic record is updated accordingly.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["appeal process", "conditional consultation"]
    }
  },
  {
    "input_text": "Preparing for a quarterly business review meeting involves collecting performance data from all departments, analyzing key metrics, creating presentation slides, scheduling the meeting, and distributing materials in advance.",
    "mermaid": "flowchart TD\n    Start[Quarter End] --> Collect[Collect Department Data]\n    Collect --> Analyze[Analyze Key Metrics]\n    Analyze --> Slides[Create Presentation]\n    Slides --> Schedule[Schedule Review Meeting]\n    Schedule --> Distribute[Distribute Materials]",
    "expanded_text": "Quarterly business review preparation is a data-driven process. Performance data is gathered from every department and thoroughly analyzed. Insights are turned into clear presentation slides. The meeting is scheduled with key stakeholders, and all materials are shared in advance to ensure productive discussion.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["preparation workflow", "data-driven process"]
    }
  },
  {
    "input_text": "My evening journaling practice includes reflecting on three things I am grateful for, noting one lesson learned during the day, writing down tomorrow's top priorities, and closing with a positive affirmation.",
    "mermaid": "flowchart TD\n    Start[Begin Journaling] --> Gratitude[Write Three Gratitudes]\n    Gratitude --> Lesson[Note One Key Lesson]\n    Lesson --> Priorities[Set Tomorrow Priorities]\n    Priorities --> Affirmation[Write Positive Affirmation]",
    "expanded_text": "The evening journaling ritual promotes mindfulness and intention. It begins with gratitude practice by listing three positive things from the day. The writer then reflects on a meaningful lesson learned, sets clear priorities for the next day, and ends with an empowering positive affirmation.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["personal ritual", "reflective sequence"]
    }
  },
  {
    "input_text": "When negative comments appear on our social media posts, the community manager first assesses the tone, responds empathetically if appropriate, escalates serious complaints to the PR team, and monitors for similar issues.",
    "mermaid": "flowchart TD\n    Comment[Negative Comment Detected] --> Assess[Assess Tone & Severity]\n    Assess --> Respond{Respond Publicly?}\n    Respond -->|Yes| Reply[Empathetic Public Reply]\n    Respond -->|No| Escalate[Escalate to PR Team]\n    Reply --> Monitor[Monitor Thread]\n    Escalate --> Monitor",
    "expanded_text": "Social media crisis management requires quick judgment. The community manager evaluates the tone and severity of negative comments. Appropriate ones receive empathetic public replies, while serious complaints are escalated internally. All cases are closely monitored to prevent escalation.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["crisis response", "decision branching"]
    }
  },
  {
    "input_text": "Scientific experiment validation requires repeating the test multiple times, analyzing data for consistency, comparing results with control groups, peer review of methodology, and documentation of findings.",
    "mermaid": "flowchart TD\n    Test[Conduct Experiment] --> Repeat[Repeat Test Multiple Times]\n    Repeat --> Analyze[Analyze Data Consistency]\n    Analyze --> Control[Compare with Control Group]\n    Control --> Peer[Peer Review Methodology]\n    Peer --> Document[Document Findings]",
    "expanded_text": "Reliable scientific validation demands rigor. The core experiment is repeated several times to ensure consistency. Results are statistically analyzed and compared against control groups. The methodology undergoes peer review before comprehensive documentation of all findings.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["validation process", "repetition loop"]
    }
  },
  {
    "input_text": "The employee offboarding process includes conducting an exit interview, collecting company assets, revoking system access, processing final payments, and updating organizational records.",
    "mermaid": "flowchart TD\n    Resign[Employee Resignation] --> Interview[Exit Interview]\n    Interview --> Assets[Collect Company Assets]\n    Assets --> Access[Revoke System Access]\n    Access --> Payment[Process Final Payment]\n    Payment --> Update[Update HR Records]",
    "expanded_text": "Smooth employee offboarding protects company interests while maintaining goodwill. It begins with a structured exit interview, followed by collection of assets, revocation of all digital access, processing of final compensation, and updating of internal records.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["offboarding workflow", "security steps"]
    }
  },
  {
    "input_text": "In our open-world survival game, players must manage hunger and thirst, build shelter before night, craft better tools, explore dangerous areas for rare resources, and defend against increasingly difficult enemies.",
    "mermaid": "flowchart TD\n    Spawn[Player Spawns] --> Gather[Gather Basic Resources]\n    Gather --> Build[Build Basic Shelter]\n    Build --> Craft[Craft Better Tools]\n    Craft --> Explore[Explore Dangerous Areas]\n    Explore --> Defend[Defend Against Enemies]",
    "expanded_text": "Survival gameplay creates a compelling progression loop. Players begin by gathering basic resources and building shelter before nightfall. They craft improved tools to explore riskier areas for rare materials while preparing to defend against increasingly challenging threats.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["survival loop", "progressive difficulty"]
    }
  },
  {
    "input_text": "Our production deployment process is highly controlled. After code is merged to main, it goes through automated security scanning and performance testing. If all checks pass, we deploy to a canary environment serving 5% of traffic. We monitor key metrics for 30 minutes. If everything is stable, we gradually increase traffic to 100%. If any anomaly is detected, we automatically rollback and notify the on-call engineer.",
    "mermaid": "flowchart TD\n    Merge[Code Merged to Main] --> Scan[Security & Performance Tests]\n    Scan --> Canary[Deploy to Canary - 5% Traffic]\n    Canary --> Monitor[Monitor KPIs for 30min]\n    Monitor --> Stable{All Metrics Stable?}\n    Stable -->|Yes| Ramp[Gradually Increase Traffic]\n    Ramp --> Full[100% Production Traffic]\n    Stable -->|No| Rollback[Automatic Rollback]\n    Rollback --> Notify[Alert On-call Engineer]\n    Full --> Observe[Post-Deployment Observation]",
    "expanded_text": "The production deployment follows a cautious, multi-stage strategy to minimize risk. After merging to main, comprehensive automated tests run. Successful builds deploy to a canary environment serving only 5% of users. Intensive monitoring occurs for 30 minutes. Stable performance leads to gradual traffic ramp-up to full production. Any detected anomalies trigger automatic rollback and immediate notification to the on-call engineer, followed by continued observation.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["multi-stage deployment", "conditional rollback", "monitoring loop", "gradual rollout"]
    }
  },
  {
    "input_text": "Managing a complex customer escalation involves the support agent documenting the issue, attempting standard resolutions, involving a senior engineer if unresolved, conducting a joint screen share, proposing workarounds or fixes, obtaining customer approval, and following up 48 hours later.",
    "mermaid": "flowchart TD\n    Escalate[Customer Escalation] --> Document[Document Issue Details]\n    Document --> Standard[Apply Standard Resolutions]\n    Standard --> Resolved{Resolved?}\n    Resolved -->|No| Senior[Escalate to Senior Engineer]\n    Senior --> Screen[Joint Screen Share Session]\n    Screen --> Solution{Propose Solution}\n    Solution --> Approval[Customer Approval]\n    Approval --> FollowUp[48-Hour Follow-up]",
    "expanded_text": "Complex customer escalations follow a structured escalation and resolution path. The support agent thoroughly documents the problem and attempts standard fixes. If unsuccessful, a senior engineer is involved for deeper investigation, often including collaborative screen sharing. A solution or workaround is proposed, customer approval is obtained, and a follow-up occurs after 48 hours to ensure sustained resolution.",
    "metadata": {
      "domain": "customer support",
      "complexity": "high",
      "graph_features": ["escalation path", "multi-party collaboration", "verification loop"]
    }
  },
  {
    "input_text": "The AI training pipeline for our recommendation engine includes data collection from user interactions, cleaning and feature engineering, training multiple models in parallel, hyperparameter optimization, A/B testing the top candidates, selecting the best performer based on business metrics, and continuous monitoring for drift with retraining triggers.",
    "mermaid": "flowchart TD\n    Collect[Collect User Interaction Data] --> Clean[Data Cleaning & Feature Engineering]\n    Clean --> Parallel[Parallel Model Training]\n    Parallel --> Optimize[Hyperparameter Optimization]\n    Optimize --> AB[A/B Testing Top Models]\n    AB --> Select[Select Best Model by Business Metrics]\n    Select --> Deploy[Deploy to Production]\n    Deploy --> Monitor[Continuous Drift Monitoring]\n    Monitor --> Drift{Concept Drift Detected?}\n    Drift -->|Yes| Collect\n    Drift -->|No| Monitor",
    "expanded_text": "The recommendation engine training pipeline is a sophisticated MLOps workflow. It starts with collecting rich user interaction data, followed by extensive cleaning and feature engineering. Multiple models train in parallel with hyperparameter tuning. The best candidates undergo rigorous A/B testing using real business metrics. The winner is deployed, with continuous monitoring for concept drift that triggers retraining when necessary.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["MLOps pipeline", "parallel processing", "feedback loop", "drift detection"]
    }
  },
  {
    "input_text": "Treating a patient with suspected heart disease involves initial ECG and blood tests, risk stratification, lifestyle counseling, medication prescription if needed, possible referral to cardiology, regular follow-ups, and adjustment of treatment plan based on response.",
    "mermaid": "flowchart TD\n    Symptoms[Patient Presents Symptoms] --> Tests[ECG + Blood Tests]\n    Tests --> Risk[Risk Stratification]\n    Risk --> Counsel[Lifestyle Counseling]\n    Counsel --> Meds{Medication Needed?}\n    Meds -->|Yes| Prescribe[Prescribe Medication]\n    Prescribe --> Follow[Regular Follow-ups]\n    Meds -->|No| Refer[Cardiology Referral]\n    Refer --> Follow\n    Follow --> Response{Treatment Effective?}\n    Response -->|No| Adjust[Adjust Treatment Plan]",
    "expanded_text": "Heart disease management is a long-term, adaptive care pathway. It begins with diagnostic tests and risk assessment. Patients receive lifestyle counseling and appropriate medications. Some cases require specialist referral. Continuous follow-up allows the care team to monitor response and dynamically adjust the treatment plan to optimize outcomes.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["chronic care pathway", "adaptive treatment", "multi-decision branching"]
    }
  },
  {
    "input_text": "When a major service outage occurs, we activate our incident command protocol: technical teams investigate root cause while communication teams notify customers, leadership is briefed in parallel, workarounds are implemented if possible, and a full post-mortem is conducted after restoration.",
    "mermaid": "flowchart TD\n    Outage[Major Outage Detected] --> Activate[Activate Incident Command]\n    Activate --> Parallel[Parallel Workstreams]\n    Parallel --> Investigate[Root Cause Investigation]\n    Parallel --> Communicate[Customer Notifications]\n    Parallel --> Brief[Leadership Briefing]\n    Investigate --> Workaround{Workaround Possible?}\n    Workaround -->|Yes| Implement[Temporary Fix]\n    Implement --> Restore[Service Restoration]\n    Restore --> Postmortem[Full Post-Mortem]",
    "expanded_text": "Major service outage response uses a coordinated incident command structure. Upon detection, parallel workstreams begin: technical diagnosis, customer communication, and leadership updates. If feasible, temporary workarounds are deployed. Once service is restored, a comprehensive post-mortem analysis ensures systemic improvements.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["crisis management", "parallel execution", "post-incident loop"]
    }
  },
  {
    "input_text": "International procurement for manufacturing involves supplier selection, contract negotiation, quality audits, shipping arrangement, customs clearance coordination, receipt inspection, and supplier performance evaluation for future orders.",
    "mermaid": "flowchart TD\n    Need[Procurement Need Identified] --> Selection[Supplier Selection]\n    Selection --> Negotiation[Contract Negotiation]\n    Negotiation --> Audit[Quality & Compliance Audit]\n    Audit --> Shipping[Arrange International Shipping]\n    Shipping --> Customs[Customs Clearance]\n    Customs --> Inspection[Receipt & Quality Inspection]\n    Inspection --> Evaluate[Supplier Performance Review]",
    "expanded_text": "Global procurement is a complex cross-border process. It starts with careful supplier selection and rigorous contract negotiation. Quality and compliance audits are performed before shipping arrangements. Upon arrival, customs clearance is managed, followed by detailed receipt inspection. Supplier performance is evaluated to inform future sourcing decisions.",
    "metadata": {
      "domain": "logistics",
      "complexity": "high",
      "graph_features": ["international workflow", "multi-stage verification"]
    }
  },
  {
    "input_text": "Developing our annual marketing strategy requires competitive analysis, customer segmentation, goal setting, channel selection, budget allocation, content planning, campaign scheduling, and success metric definition with quarterly reviews.",
    "mermaid": "flowchart TD\n    Analysis[Competitive & Market Analysis] --> Segmentation[Customer Segmentation]\n    Segmentation --> Goals[Set Marketing Goals]\n    Goals --> Channels[Select Marketing Channels]\n    Channels --> Budget[Budget Allocation]\n    Budget --> Content[Content Strategy Planning]\n    Content --> Schedule[Campaign Scheduling]\n    Schedule --> Metrics[Define Success KPIs]\n    Metrics --> Review[Quarterly Performance Reviews]",
    "expanded_text": "Annual marketing strategy development is a comprehensive strategic exercise. It incorporates competitive intelligence and customer segmentation to inform goal setting. Appropriate channels are chosen, budgets allocated, and detailed content plans created. Campaigns are scheduled with clear success metrics, supported by regular quarterly performance reviews.",
    "metadata": {
      "domain": "marketing",
      "complexity": "high",
      "graph_features": ["strategic planning", "multi-factor analysis"]
    }
  },
  {
    "input_text": "The adaptive learning system evaluates student performance after each module, adjusts difficulty level, recommends supplementary materials for weak areas, tracks overall progress toward learning goals, and generates personalized reports for teachers and parents.",
    "mermaid": "flowchart TD\n    Module[Complete Learning Module] --> Evaluate[Assess Performance]\n    Evaluate --> Adjust[Adjust Difficulty Level]\n    Adjust --> Recommend[Recommend Supplementary Content]\n    Recommend --> Track[Track Progress Toward Goals]\n    Track --> Report[Generate Personalized Reports]",
    "expanded_text": "The adaptive learning platform creates individualized educational journeys. After each module, student performance is evaluated to dynamically adjust difficulty. Weak areas receive targeted supplementary materials. Overall progress toward defined goals is continuously tracked, culminating in detailed personalized reports for educators and parents.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["adaptive system", "personalization engine", "progress tracking"]
    }
  },
  {
    "input_text": "Sarah has been distant lately. Mike notices she seems stressed about work and family. He decides to give her space initially, then gently starts a conversation, listens without interrupting, offers support without trying to fix everything, and suggests they plan a quiet weekend together.",
    "mermaid": "flowchart TD\n    Notice[Mike Notices Distance] --> Space[Give Initial Space]\n    Space --> Initiate[Gently Start Conversation]\n    Initiate --> Listen[Active Listening]\n    Listen --> Support[Offer Emotional Support]\n    Support --> Plan[Propose Weekend Together]",
    "expanded_text": "This relationship navigation shows emotional intelligence. Mike first observes Sarah's withdrawal and gives her space. He then carefully initiates dialogue, practices active listening without jumping to solutions, offers genuine support, and suggests a restorative activity to reconnect.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "high",
      "graph_features": ["emotional intelligence flow", "relationship repair"]
    }
  },
  {
    "input_text": "The venture capital investment decision process includes initial screening, deep due diligence across financial, legal, technical and market dimensions, reference calls, partner meeting, term sheet negotiation, final legal closing, and post-investment portfolio support.",
    "mermaid": "flowchart TD\n    Pitch[Startup Pitch] --> Screening[Initial Screening]\n    Screening --> Due[Detailed Due Diligence]\n    Due --> References[Reference Calls]\n    References --> Partner[Partner Meeting]\n    Partner --> Term[Term Sheet Negotiation]\n    Term --> Legal[Legal Closing]\n    Legal --> Support[Post-Investment Portfolio Support]",
    "expanded_text": "Venture capital investment follows a rigorous, multi-layered evaluation. Promising startups pass initial screening before entering comprehensive due diligence covering all major aspects. Reference checks and partner discussions inform term sheet negotiations. Successful deals proceed to legal closing, followed by active portfolio support and value creation.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["investment funnel", "multi-dimensional evaluation"]
    }
  },
  {
    "input_text": "A user wants to withdraw cash from an ATM. They insert their card and enter their PIN. If the PIN is incorrect after three attempts, the card is retained. If correct, they select 'Withdrawal' and enter an amount. The system checks if the amount is a multiple of $20 and does not exceed the daily limit of $500. If the amount exceeds the limit, the ATM shows an error and asks for a smaller amount. If the amount is valid, the system checks the account balance. If insufficient funds, it shows an error and returns to the amount screen. If sufficient, it dispenses the cash, prints a receipt, and ejects the card.",
    "mermaid": "graph TD\n    A[Insert card] --> B[Enter PIN]\n    B --> C{PIN correct?}\n    C -->|No| D[Incorrect attempts +1]\n    D --> E{Attempts < 3?}\n    E -->|Yes| B\n    E -->|No| F[Card retained]\n    C -->|Yes| G[Select Withdrawal, enter amount]\n    G --> H{Amount multiple of $20 AND <= $500?}\n    H -->|No| I[Show error, ask for smaller amount]\n    I --> G\n    H -->|Yes| J{Sufficient balance?}\n    J -->|No| K[Show insufficient funds error]\n    K --> G\n    J -->|Yes| L[Dispense cash, print receipt, eject card]",
    "expanded_text": "The ATM withdrawal process begins when the user inserts their card and enters their PIN. If the PIN is incorrect, the system increments a failure counter. The user has up to three attempts; after three incorrect PIN entries, the card is retained by the machine. If the PIN is correct, the user selects 'Withdrawal' and enters an amount. The system checks whether the amount is a multiple of $20 and does not exceed the daily limit of $500. If either condition fails, an error message is shown and the user is asked to enter a different amount. If the amount is valid, the system checks the account balance. If funds are insufficient, an error is shown and the user returns to the amount entry step. If funds are sufficient, the ATM dispenses the cash, prints a receipt, and ejects the card.",
    "metadata": {
      "domain": "finance",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches", "retry limit", "validation checks"]
    }
  },
  {
    "input_text": "A project manager assigns tasks to a team. First, the manager creates a task in Jira with a description, priority, and due date. The system automatically assigns the task to the team member with the lowest current workload. That team member receives an email notification. If the team member does not acknowledge the task within 24 hours, a reminder is sent every 12 hours for up to 3 reminders. After 3 reminders with no acknowledgment, the task is reassigned to the next available team member. When the team member starts work, they move the task to 'In Progress'. Upon completion, they move it to 'Done' and the manager is notified for review. If the manager rejects the work, the task goes back to 'In Progress' with comments. If accepted, the task is closed.",
    "mermaid": "graph TD\n    A[Manager creates task in Jira] --> B[System assigns to member with lowest workload]\n    B --> C[Send email notification]\n    C --> D{Member acknowledges within 24h?}\n    D -->|Yes| E[Member starts work, moves to 'In Progress']\n    D -->|No| F[Send reminder every 12h, up to 3 reminders]\n    F --> G{Acknowledged after reminders?}\n    G -->|Yes| E\n    G -->|No| H[Reassign to next available member]\n    H --> C\n    E --> I[Member completes task, moves to 'Done']\n    I --> J[Manager reviews]\n    J --> K{Manager accepts?}\n    K -->|No| L[Return to 'In Progress' with comments]\n    L --> E\n    K -->|Yes| M[Close task]",
    "expanded_text": "A project manager creates a task in Jira with a description, priority, and due date. The system automatically assigns the task to the team member who currently has the lowest workload. That member receives an email notification. If the member does not acknowledge the task within 24 hours, the system sends a reminder every 12 hours, up to a maximum of three reminders. If still no acknowledgment after three reminders, the task is reassigned to the next available team member, and the notification process repeats. Once the member acknowledges and starts work, they move the task status to 'In Progress'. When work is complete, they move it to 'Done', and the manager is notified to review. If the manager rejects the work, the task is returned to 'In Progress' with comments, and the member must work on it again. If the manager accepts, the task is closed.",
    "metadata": {
      "domain": "productivity",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "reminder escalation", "reassignment loop", "review loop"]
    }
  },
  {
    "input_text": "A customer buys a product online. They add an item to their cart and proceed to checkout. They enter their shipping address and select a payment method (credit card, PayPal, or gift card). If they choose credit card, the system validates the card number and expiration date. If invalid, they are asked to re-enter. If valid, it charges the card. If PayPal is chosen, they are redirected to PayPal to log in and authorize the payment. If gift card is chosen, the system checks the balance. If insufficient, it asks for an additional payment method. After successful payment, the system sends an order confirmation email and redirects to an order summary page. If payment fails for any reason, the customer is shown an error and asked to try a different payment method.",
    "mermaid": "graph TD\n    A[Add item to cart, proceed to checkout] --> B[Enter shipping address]\n    B --> C{Select payment method}\n    C -->|Credit card| D[Enter card number and expiry]\n    D --> E{Card valid?}\n    E -->|No| D\n    E -->|Yes| F[Charge card]\n    C -->|PayPal| G[Redirect to PayPal, log in, authorize]\n    G --> H{Authorization successful?}\n    C -->|Gift card| I[Enter gift card code]\n    I --> J{Gift card balance sufficient?}\n    J -->|No| K[Ask for additional payment method]\n    K --> C\n    J -->|Yes| L[Apply gift card balance]\n    F --> M{Payment successful?}\n    H -->|Yes| M\n    H -->|No| N[Show error, try again]\n    N --> G\n    L --> M\n    M -->|Yes| O[Send order confirmation email, show summary]\n    M -->|No| P[Show error, ask for different method]\n    P --> C",
    "expanded_text": "The online checkout process begins when a customer adds an item to their cart and proceeds to checkout. They enter a shipping address, then select a payment method: credit card, PayPal, or gift card. If credit card is selected, the customer enters the card number and expiration date; the system validates the information and, if invalid, prompts re-entry. If valid, the card is charged. If PayPal is selected, the customer is redirected to PayPal to log in and authorize the payment. If gift card is selected, the customer enters a gift card code; if the balance is insufficient, the system asks for an additional payment method, returning to the payment selection step. If the balance is sufficient, the gift card balance is applied. After any payment method, if the payment succeeds, an order confirmation email is sent and the order summary page is shown. If payment fails (e.g., declined card, insufficient PayPal funds), an error is shown and the customer is asked to try a different payment method, returning to the payment selection step.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["conditional branches (payment methods)", "validation loops", "fallback logic", "retry on failure"]
    }
  },
  {
    "input_text": "A teacher posts an assignment in an online learning platform. Students submit their work before the deadline. After the deadline, the system automatically locks submissions. The teacher then grades each submission and provides written feedback. For each student, the teacher enters a score out of 100. If the score is below 60, the system prompts the teacher to confirm that the student has been offered a chance to revise. If confirmed, the student receives a notification that they can resubmit within 3 days. The student resubmits, and the teacher regrades. If the score improves to 60 or above, the final grade is recorded. If still below 60, the student receives a failing grade with mandatory tutoring. If the original score is 60 or above, the grade is immediately recorded. All final grades are published to the gradebook.",
    "mermaid": "graph TD\n    A[Teacher posts assignment] --> B[Students submit before deadline]\n    B --> C[Deadline passes, system locks submissions]\n    C --> D[Teacher grades submission, enters score]\n    D --> E{Score < 60?}\n    E -->|No| F[Record final grade, publish to gradebook]\n    E -->|Yes| G[System prompts teacher to confirm revision offer]\n    G --> H{Teacher confirms?}\n    H -->|No| I[Student receives failing grade with tutoring]\n    I --> F\n    H -->|Yes| J[Notify student: can resubmit within 3 days]\n    J --> K[Student resubmits]\n    K --> L[Teacher regrades]\n    L --> M{New score >= 60?}\n    M -->|Yes| F\n    M -->|No| I",
    "expanded_text": "A teacher posts an assignment on an online learning platform. Students submit their work before the stated deadline. After the deadline passes, the system automatically locks further submissions. The teacher then grades each submission and enters a score out of 100. If the score is 60 or above, the final grade is immediately recorded and published to the gradebook. If the score is below 60, the system prompts the teacher to confirm whether the student has been offered a chance to revise. If the teacher does not confirm, the student receives a failing grade along with a mandatory tutoring requirement, and the grade is recorded. If the teacher confirms, the student is notified that they may resubmit within 3 days. The student resubmits, the teacher regrades the work. If the new score is 60 or above, the final grade is recorded. If the new score is still below 60, the student receives a failing grade with mandatory tutoring.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "revision loop", "grade thresholds"]
    }
  },
  {
    "input_text": "An employee books a meeting room. They open the company's room booking system and select a date and time. The system shows available rooms. The employee selects a room and enters the purpose of the meeting. The system checks if the employee has permissions to book that room (some rooms are executive-only). If not, it shows an error. If yes, it reserves the room and sends a calendar invite to the employee. The employee can add optional attendees. Each attendee receives an email with a link to accept or decline. The system tracks responses. If the meeting organizer cancels at least 2 hours before the start time, the room is released and all attendees are notified. If canceled less than 2 hours before, the room is still released but a late-cancel penalty is logged. After three late cancels in a month, the employee loses booking privileges for 30 days.",
    "mermaid": "graph TD\n    A[Open booking system, select date/time] --> B[Show available rooms]\n    B --> C[Select room, enter purpose]\n    C --> D{Employee has permission for this room?}\n    D -->|No| E[Show error]\n    D -->|Yes| F[Reserve room, send calendar invite to employee]\n    F --> G[Employee adds optional attendees]\n    G --> H[Send email to each attendee: accept/decline]\n    H --> I[System tracks responses]\n    I --> J{Organizer cancels meeting?}\n    J -->|Yes| K{Cancel time >= 2 hours before start?}\n    K -->|Yes| L[Release room, notify all attendees]\n    K -->|No| M[Release room, log late-cancel penalty]\n    M --> N{Late cancels in month >= 3?}\n    N -->|Yes| O[Revoke booking privileges for 30 days]\n    J -->|No| P[Meeting proceeds as scheduled]",
    "expanded_text": "An employee books a meeting room by opening the company's room booking system and selecting a date and time. The system displays available rooms. The employee selects a room and enters the meeting's purpose. The system checks whether the employee has permission to book that particular room (some rooms are restricted to executives). If not, an error is shown. If permission is granted, the system reserves the room and sends a calendar invite to the employee. The employee may then add optional attendees. Each attendee receives an email with a link to accept or decline, and the system tracks responses. If the meeting organizer cancels at least 2 hours before the start time, the room is released and all attendees are notified. If cancellation occurs less than 2 hours before the start, the room is still released but a late-cancel penalty is logged. If the employee accumulates three late cancels within a single month, their booking privileges are revoked for 30 days.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "permission check", "penalty tracking", "privilege revocation"]
    }
  },
  {
    "input_text": "A user subscribes to a streaming service. They visit the pricing page and choose a plan: Basic ($9.99/month, one screen, SD), Standard ($15.49/month, two screens, HD), or Premium ($19.99/month, four screens, 4K). They enter their email and create a password. The system checks if the email is already registered. If yes, it prompts them to log in instead. If no, it asks for payment information. The user enters credit card details. The system validates the card and charges the first month. If the card is declined, the user is asked to enter a different card. After successful payment, the account is created, and a confirmation email is sent. The user can start streaming immediately. The subscription auto-renews monthly unless canceled. If canceled, access continues until the end of the current billing period, then the account is deactivated.",
    "mermaid": "graph TD\n    A[Visit pricing page] --> B[Choose plan: Basic, Standard, or Premium]\n    B --> C[Enter email and create password]\n    C --> D{Email already registered?}\n    D -->|Yes| E[Prompt to log in instead]\n    D -->|No| F[Enter credit card details]\n    F --> G{Card valid and charged successfully?}\n    G -->|No| H[Ask for different card]\n    H --> F\n    G -->|Yes| I[Create account, send confirmation email]\n    I --> J[User can start streaming immediately]\n    J --> K[Subscription auto-renews monthly]\n    K --> L{User cancels?}\n    L -->|No| K\n    L -->|Yes| M[Access continues until end of billing period, then deactivate]",
    "expanded_text": "A user subscribes to a streaming service by first visiting the pricing page and choosing a plan: Basic ($9.99/month, one screen, SD quality), Standard ($15.49/month, two screens, HD), or Premium ($19.99/month, four screens, 4K). The user then enters their email and creates a password. The system checks whether the email is already registered. If the email exists, the user is prompted to log in instead. If the email is new, the system asks for credit card details. The user enters their card information, and the system validates the card and charges the first month. If the card is declined, the user is asked to enter a different card. After successful payment, an account is created, and a confirmation email is sent. The user can start streaming immediately. The subscription auto-renews monthly unless the user cancels. If the user cancels, access continues until the end of the current billing period, after which the account is deactivated.",
    "metadata": {
      "domain": "business",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches (email exists)", "payment retry loop", "auto-renewal loop", "cancelation with grace period"]
    }
  },
  {
    "input_text": "A data backup job runs every night at 2 AM. The backup script first checks if the previous day's backup completed successfully. If not, it sends an alert to the admin and aborts. If yes, it connects to the database and performs a full dump. The dump is then compressed using gzip. The compressed file is encrypted with AES-256. The encrypted file is uploaded to an S3 bucket. After upload, the script verifies the file size matches the expected size. If verification fails, it retries the upload up to 3 times. After 3 failures, it sends a critical alert. If verification succeeds, it deletes local backup files older than 30 days. Finally, it logs the success and sends a summary report to the admin.",
    "mermaid": "graph TD\n    A[2 AM: backup job starts] --> B{Previous day's backup successful?}\n    B -->|No| C[Send alert to admin, abort]\n    B -->|Yes| D[Connect to database, perform full dump]\n    D --> E[Compress dump with gzip]\n    E --> F[Encrypt with AES-256]\n    F --> G[Upload encrypted file to S3]\n    G --> H{Upload verification: size matches?}\n    H -->|No| I[Retry upload, count +1]\n    I --> J{Retries < 3?}\n    J -->|Yes| G\n    J -->|No| K[Send critical alert]\n    H -->|Yes| L[Delete local backup files older than 30 days]\n    L --> M[Log success, send summary report to admin]",
    "expanded_text": "A nightly data backup job runs automatically at 2 AM. The script first checks whether the previous day's backup completed successfully. If not, it sends an alert to the administrator and aborts the job. If the previous backup succeeded, the script connects to the database and performs a full dump. The dump is then compressed using gzip. The compressed file is encrypted with AES-256 encryption. The encrypted file is uploaded to an S3 bucket. After upload, the script verifies that the uploaded file size matches the expected size. If verification fails, it retries the upload up to three times. If all three retries fail, it sends a critical alert. If verification succeeds, the script deletes any local backup files that are older than 30 days to free up disk space. Finally, it logs the success of the backup and sends a summary report to the administrator.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "retry loop with limit", "alerting", "cleanup"]
    }
  },
  {
    "input_text": "A rider requests a ride using a ride-hailing app. The app finds nearby drivers and shows estimated arrival times. The rider confirms the request. The system assigns the closest available driver. If no driver is within 10 minutes, the app offers to wait or cancel. If the rider waits, the system continues searching for 5 more minutes. If still no driver, the request is canceled. Once a driver is assigned, the driver navigates to the pickup location. If the driver arrives and the rider is not there after 3 minutes, the driver can cancel and charge a waiting fee. If the rider cancels after the driver has been assigned, a cancellation fee applies. If the ride completes, the rider pays the fare (calculated by distance and time) and rates the driver. The driver also rates the rider.",
    "mermaid": "graph TD\n    A[Rider requests ride] --> B[App finds nearby drivers, shows ETA]\n    B --> C[Rider confirms request]\n    C --> D{Driver available within 10 min?}\n    D -->|Yes| E[Assign closest driver]\n    D -->|No| F[Offer: wait or cancel?]\n    F -->|Cancel| G[Request canceled]\n    F -->|Wait| H[Continue searching for 5 more minutes]\n    H --> I{Driver found within 5 min?}\n    I -->|Yes| E\n    I -->|No| G\n    E --> J[Driver navigates to pickup]\n    J --> K{Driver arrives, rider not there after 3 min?}\n    K -->|Yes| L[Driver can cancel, charge waiting fee]\n    K -->|No| M[Rider cancels after assignment?]\n    M -->|Yes| N[Cancellation fee applies]\n    M -->|No| O[Ride completes, pay fare, rider rates driver]\n    O --> P[Driver rates rider]",
    "expanded_text": "A rider requests a ride using a ride-hailing app. The app finds nearby drivers and displays estimated arrival times. The rider confirms the request. The system checks if a driver is available within a 10-minute radius. If yes, the closest available driver is assigned. If no driver is within 10 minutes, the app offers the rider the choice to wait or cancel. If the rider cancels, the request ends. If the rider chooses to wait, the system continues searching for an additional 5 minutes. If a driver is found within that time, assignment proceeds; if not, the request is canceled. Once a driver is assigned, the driver navigates to the pickup location. If the driver arrives and the rider is not present after 3 minutes, the driver may cancel the trip and charge a waiting fee. If the rider cancels after a driver has already been assigned, a cancellation fee applies. If neither cancellation occurs, the ride completes successfully: the rider pays the fare (calculated based on distance and time), then rates the driver, and the driver rates the rider in return.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["conditional branches (driver availability)", "wait loop", "cancellation paths", "mutual rating"]
    }
  },
  {
    "input_text": "A user signs up for a gym membership. They visit the gym and talk to a sales representative. The rep explains three membership types: Basic ($30/month, no classes), Premium ($50/month, unlimited classes), and Family ($80/month, up to 4 people). The user chooses a plan and fills out a waiver. The rep enters the user's information into the system. The system checks if the user has been a member before. If yes, it reactivates the old account. If no, it creates a new account. The user pays the first month's fee plus a one-time enrollment fee of $50. Payment can be by credit card or cash. After payment, the user receives a key fob for access. The membership auto-renews monthly. If the user misses payment for two consecutive months, the membership is suspended and a $25 reinstatement fee is required.",
    "mermaid": "graph TD\n    A[User visits gym, talks to sales rep] --> B[Rep explains plans: Basic, Premium, Family]\n    B --> C[User chooses plan, fills out waiver]\n    C --> D[Rep enters information into system]\n    D --> E{Previously a member?}\n    E -->|Yes| F[Reactivate old account]\n    E -->|No| G[Create new account]\n    F --> H[User pays first month + $50 enrollment fee]\n    G --> H\n    H --> I{Payment method}\n    I -->|Credit card| J[Charge card]\n    I -->|Cash| K[Accept cash, mark paid]\n    J --> L[Issue key fob for access]\n    K --> L\n    L --> M[Membership auto-renews monthly]\n    M --> N{Payment missed for 2 consecutive months?}\n    N -->|Yes| O[Suspend membership, require $25 reinstatement fee]\n    N -->|No| M",
    "expanded_text": "A user signs up for a gym membership by visiting the gym and speaking with a sales representative. The rep explains three membership options: Basic ($30/month, no classes), Premium ($50/month, unlimited classes), and Family ($80/month, up to 4 people). The user selects a plan and fills out a liability waiver. The rep enters the user's information into the gym's system. The system checks whether the user has been a member before. If so, the old account is reactivated; otherwise, a new account is created. The user then pays the first month's fee plus a one-time enrollment fee of $50. Payment can be made by credit card (which is charged immediately) or cash (recorded as paid). After payment is confirmed, the user receives a key fob for gym access. The membership auto-renews monthly. If the user fails to pay for two consecutive months, the membership is suspended, and a $25 reinstatement fee is required to reactivate it.",
    "metadata": {
      "domain": "business",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches (previous member)", "payment method split", "auto-renewal loop", "suspension threshold"]
    }
  },
  {
    "input_text": "A software testing process for a new feature. A developer writes unit tests for the feature and runs them locally. If any unit test fails, the developer fixes the code and reruns tests until all pass. Once all unit tests pass, the developer pushes the code to a shared branch. This triggers a CI pipeline that runs integration tests. If integration tests fail, the build is marked broken and the developer is notified to fix within 2 hours. If not fixed within 2 hours, the commit is reverted. If integration tests pass, the code is deployed to a staging environment. In staging, QA runs manual tests. If QA finds a bug, they file a ticket, and the developer fixes it, then the process restarts from unit tests. If QA approves, the code is deployed to production with a feature flag disabled. The product owner enables the flag for 10% of users as a canary test. After 24 hours with no errors, the flag is enabled for all users. If errors are detected, the flag is disabled immediately.",
    "mermaid": "graph TD\n    A[Developer writes unit tests, runs locally] --> B{All unit tests pass?}\n    B -->|No| C[Developer fixes code, reruns tests]\n    C --> B\n    B -->|Yes| D[Push to shared branch, trigger CI]\n    D --> E[Run integration tests in CI]\n    E --> F{Integration tests pass?}\n    F -->|No| G[Mark build broken, notify developer]\n    G --> H{Fixed within 2 hours?}\n    H -->|No| I[Revert commit]\n    H -->|Yes| D\n    F -->|Yes| J[Deploy to staging]\n    J --> K[QA runs manual tests]\n    K --> L{Bug found?}\n    L -->|Yes| M[File ticket, developer fixes]\n    M --> A\n    L -->|No| N[Deploy to production with flag disabled]\n    N --> O[Product owner enables flag for 10% of users]\n    O --> P{Errors detected in 24 hours?}\n    P -->|Yes| Q[Disable flag immediately]\n    P -->|No| R[Enable flag for all users]",
    "expanded_text": "The software testing process for a new feature begins with the developer writing unit tests and running them locally. If any unit test fails, the developer fixes the code and reruns the tests until all pass. Once all unit tests pass, the developer pushes the code to a shared branch, which triggers a CI pipeline to run integration tests. If integration tests fail, the build is marked broken and the developer is notified; they must fix the issue within 2 hours, or else the commit is automatically reverted. If the fix is made in time, the pipeline restarts from the integration test step. If integration tests pass, the code is deployed to a staging environment. In staging, QA performs manual tests. If QA finds a bug, a ticket is filed, the developer fixes the bug, and the entire process restarts from unit tests. If QA approves, the code is deployed to production with a feature flag disabled. The product owner then enables the flag for 10% of users as a canary test. If no errors are detected within 24 hours, the flag is enabled for all users. If errors are detected at any point, the flag is disabled immediately.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["sequential flows", "conditional branches", "loops (unit tests, CI fix window)", "staging approval", "canary deployment with rollback"]
    }
  },
  {
    "input_text": "Our enterprise software release management follows a gated process: feature development in sprint, internal code review, security and compliance audit, QA regression testing, staging deployment with smoke tests, beta release to selected customers, monitoring for 72 hours, and only then full production rollout with rollback readiness.",
    "mermaid": "flowchart TD\n    Sprint[Feature Development] --> Review[Code Review]\n    Review --> Audit[Security & Compliance Audit]\n    Audit --> QATest[QA Regression Testing]\n    QATest --> Staging[Deploy to Staging]\n    Staging --> Smoke[Smoke Tests]\n    Smoke --> Beta[Beta Release to Select Customers]\n    Beta --> Monitor[Monitor 72 Hours]\n    Monitor --> Stable{Stable Performance?}\n    Stable -->|Yes| Production[Full Production Rollout]\n    Stable -->|No| Rollback[Rollback & Fix]",
    "expanded_text": "Enterprise software releases are carefully orchestrated through multiple quality gates. Development occurs in sprints, followed by peer code reviews, security audits, and comprehensive QA testing. The application is first deployed to staging for smoke tests, then released to a beta group of customers. After 72 hours of close monitoring, a go/no-go decision determines full production rollout or rollback.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["multi-gate process", "conditional rollout", "monitoring phase", "rollback path"]
    }
  },
  {
    "input_text": "Treating a patient with Type 2 Diabetes requires initial diagnosis confirmation, lifestyle intervention planning, medication initiation if needed, regular HbA1c monitoring, complication screening, specialist referral for advanced cases, and continuous treatment adjustment based on patient response and lab results.",
    "mermaid": "flowchart TD\n    Diagnosis[Diagnosis Confirmation] --> Lifestyle[Lifestyle Intervention Plan]\n    Lifestyle --> Meds{Medication Required?}\n    Meds -->|Yes| Initiate[Start Medication]\n    Meds -->|No| Monitor[Regular HbA1c Monitoring]\n    Initiate --> Monitor\n    Monitor --> Screen[Complication Screening]\n    Screen --> Response{Treatment Effective?}\n    Response -->|No| Adjust[Adjust Treatment Plan]\n    Response -->|Yes| Continue[Continue Monitoring]\n    Adjust --> Specialist{Refer Specialist?}\n    Specialist -->|Yes| Referral[Endocrinologist Referral]",
    "expanded_text": "Type 2 Diabetes management is a personalized, long-term adaptive pathway. It starts with diagnostic confirmation and lifestyle modifications. Medication is introduced when necessary. Regular monitoring of HbA1c and complication screening guide ongoing adjustments. Treatment is continuously optimized, with specialist referrals made for complex or poorly controlled cases.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["chronic disease management", "adaptive loop", "multi-decision branching"]
    }
  },
  {
    "input_text": "When a cyber threat is detected, our SOC team follows a structured playbook: isolate affected systems, collect forensic data, analyze attack vectors, contain the breach, eradicate the threat, recover systems from clean backups, conduct post-incident analysis, and update detection rules.",
    "mermaid": "flowchart TD\n    Detect[Threat Detected] --> Isolate[Isolate Affected Systems]\n    Isolate --> Forensics[Collect Forensic Data]\n    Forensics --> Analyze[Analyze Attack Vectors]\n    Analyze --> Contain[Contain Breach]\n    Contain --> Eradicate[Eradicate Threat]\n    Eradicate --> Recover[System Recovery from Backups]\n    Recover --> Analysis[Post-Incident Analysis]\n    Analysis --> Update[Update Detection Rules]",
    "expanded_text": "Cyber threat response follows the NIST-inspired incident handling lifecycle. Upon detection, affected systems are isolated. Forensic data is preserved while attack vectors are analyzed. The breach is contained, the threat eradicated, and systems recovered from verified clean backups. A detailed post-incident review leads to detection rule improvements.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["incident response playbook", "sequential containment", "improvement loop"]
    }
  },
  {
    "input_text": "Our multi-agent AI research system works by first breaking down the research question, assigning sub-tasks to specialized agents for literature search, data analysis, and hypothesis generation. Agents collaborate through a shared knowledge base, resolve conflicts via debate mechanism, synthesize findings, and produce a final report with confidence scores.",
    "mermaid": "flowchart TD\n    Query[Research Query] --> Breakdown[Task Decomposition]\n    Breakdown --> Assign[Assign to Specialized Agents]\n    Assign --> Parallel[Parallel Agent Execution]\n    Parallel --> Collaborate[Collaborate via Shared Knowledge]\n    Collaborate --> Debate[Conflict Resolution Debate]\n    Debate --> Synthesize[Synthesize Findings]\n    Synthesize --> Report[Generate Final Report with Confidence]",
    "expanded_text": "The multi-agent research system decomposes complex queries and distributes subtasks to specialized agents for literature review, data analysis, and hypothesis generation. Agents work in parallel while sharing a common knowledge base. Conflicts are resolved through structured debate. Finally, findings are synthesized into a comprehensive report that includes confidence assessments.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["multi-agent system", "parallel execution", "collaboration mechanism"]
    }
  },
  {
    "input_text": "International supply chain disruption recovery involves activating alternative suppliers, rerouting shipments, reallocating inventory across warehouses, negotiating with customers on delays, updating production schedules, and conducting a full risk assessment for future prevention.",
    "mermaid": "flowchart TD\n    Disruption[Supply Chain Disruption] --> Activate[Activate Alternative Suppliers]\n    Activate --> Reroute[Reroute Shipments]\n    Reroute --> Reallocate[Reallocate Inventory]\n    Reallocate --> Negotiate[Customer Delay Negotiations]\n    Negotiate --> Update[Update Production Schedules]\n    Update --> Risk[Future Risk Assessment]",
    "expanded_text": "Supply chain disruption management requires rapid, coordinated actions. Alternative suppliers are activated while shipments are rerouted. Inventory is dynamically reallocated across the network. Customers are engaged regarding potential delays. Production schedules are adjusted accordingly, followed by a comprehensive risk assessment to strengthen resilience.",
    "metadata": {
      "domain": "logistics",
      "complexity": "high",
      "graph_features": ["crisis recovery", "parallel mitigation", "preventive analysis"]
    }
  },
  {
    "input_text": "The venture capital due diligence process includes financial analysis, legal review of contracts and IP, technical architecture evaluation, market and competitive landscape study, founder background checks, customer reference calls, and final investment committee presentation.",
    "mermaid": "flowchart TD\n    Start[Investment Opportunity] --> Financial[Financial Analysis]\n    Financial --> Legal[Legal & IP Review]\n    Legal --> Technical[Technical Evaluation]\n    Technical --> Market[Market & Competitive Analysis]\n    Market --> Background[Founder Background Checks]\n    Background --> References[Customer Reference Calls]\n    References --> Committee[Investment Committee Presentation]",
    "expanded_text": "Venture capital due diligence is a comprehensive multi-dimensional investigation. It covers detailed financial modeling, legal scrutiny of contracts and intellectual property, deep technical assessment, market opportunity analysis, founder background verification, and customer references before the final investment committee presentation.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["due diligence process", "multi-dimensional evaluation"]
    }
  },
  {
    "input_text": "Personalized learning path adaptation analyzes student performance data, identifies knowledge gaps, adjusts content difficulty, recommends supplementary resources, updates the learner profile, and generates progress reports for educators while maintaining motivation through achievement badges.",
    "mermaid": "flowchart TD\n    Performance[Student Performance Data] --> Gap[Identify Knowledge Gaps]\n    Gap --> Adjust[Adjust Content Difficulty]\n    Adjust --> Recommend[Recommend Supplementary Resources]\n    Recommend --> Update[Update Learner Profile]\n    Update --> Report[Generate Progress Reports]\n    Report --> Motivate[Issue Achievement Badges]",
    "expanded_text": "The adaptive learning system continuously processes performance data to detect knowledge gaps and dynamically adjusts content difficulty. It recommends targeted supplementary materials, maintains an evolving learner profile, generates insightful reports for teachers, and uses achievement badges to sustain student motivation.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["adaptive learning", "personalization loop", "motivation system"]
    }
  },
  {
    "input_text": "Sarah wants to improve her relationship with her teenage daughter who has been withdrawing. She decides to create more quality time without pressure, actively listen without judgment, set reasonable boundaries, seek professional guidance if needed, and celebrate small positive interactions.",
    "mermaid": "flowchart TD\n    Notice[Notice Withdrawal] --> Quality[Create Low-Pressure Quality Time]\n    Quality --> Listen[Practice Active Listening]\n    Listen --> Boundaries[Set Reasonable Boundaries]\n    Boundaries --> Evaluate{Improvement Seen?}\n    Evaluate -->|No| Guidance[Seek Professional Help]\n    Evaluate -->|Yes| Celebrate[Celebrate Small Wins]",
    "expanded_text": "Repairing a strained parent-teen relationship requires patience and strategy. Sarah focuses on creating relaxed quality time and practicing non-judgmental listening. She establishes healthy boundaries while remaining flexible. Progress is regularly evaluated. If needed, professional guidance is sought, while small positive moments are consciously celebrated.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "high",
      "graph_features": ["relationship repair", "emotional strategy", "iterative evaluation"]
    }
  },
  {
    "input_text": "Campaign performance optimization involves real-time monitoring of key metrics, A/B testing different creatives, audience segmentation refinement, budget reallocation to best-performing channels, creative refresh when engagement drops, and monthly strategy recalibration.",
    "mermaid": "flowchart TD\n    Launch[Campaign Launch] --> Monitor[Real-time Metric Monitoring]\n    Monitor --> AB[A/B Testing Creatives]\n    AB --> Segment[Refine Audience Segments]\n    Segment --> Reallocate[Reallocate Budget]\n    Reallocate --> Refresh{Creative Refresh Needed?}\n    Refresh -->|Yes| Update[Update Creative Assets]\n    Refresh -->|No| Recalibrate[Monthly Strategy Review]",
    "expanded_text": "Marketing campaign optimization is a continuous improvement cycle. Real-time metrics are monitored while A/B tests compare creative variations. Audience segments are refined and budgets dynamically reallocated to top performers. When engagement declines, creatives are refreshed. Monthly strategy reviews ensure alignment with evolving goals.",
    "metadata": {
      "domain": "marketing",
      "complexity": "high",
      "graph_features": ["optimization loop", "real-time adjustment", "budget dynamics"]
    }
  },
  {
    "input_text": "Our game economy balancing involves monitoring resource inflation, adjusting drop rates, introducing new sinks for excess currency, running limited-time events, analyzing player progression data, and conducting regular economy resets if needed.",
    "mermaid": "flowchart TD\n    Monitor[Monitor Economy Metrics] --> Inflation{Resource Inflation?}\n    Inflation -->|Yes| Adjust[Adjust Drop Rates]\n    Inflation -->|No| Sink[Introduce New Resource Sinks]\n    Sink --> Events[Run Limited-Time Events]\n    Events --> Analyze[Analyze Player Progression]\n    Analyze --> Reset{Economy Reset Needed?}\n    Reset -->|Yes| Balance[Perform Economy Reset]",
    "expanded_text": "Game economy balancing is an ongoing data-driven process. The team continuously monitors key metrics for inflation and player behavior. Drop rates are tuned, new resource sinks are introduced, and special events help regulate currency flow. Regular analysis of progression data determines if broader economy resets are necessary to maintain healthy gameplay.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["economy management", "balancing loop", "data-driven adjustments"]
    }
  },
  {
    "input_text": "Our global expansion strategy for entering a new market includes extensive market research, regulatory compliance assessment, local partner identification, legal entity setup, localized product adaptation, hiring regional teams, marketing campaign launch, and continuous performance monitoring with quarterly strategy adjustments.",
    "mermaid": "flowchart TD\n    Research[Market Research] --> Compliance[Regulatory Compliance Assessment]\n    Compliance --> Partner[Identify Local Partners]\n    Partner --> Legal[Legal Entity Setup]\n    Legal --> Adaptation[Product Localization]\n    Adaptation --> Hiring[Regional Team Recruitment]\n    Hiring --> Launch[Marketing Campaign Launch]\n    Launch --> Monitor[Performance Monitoring]\n    Monitor --> Adjust{Quarterly Strategy Review}",
    "expanded_text": "Entering a new international market is a complex, multi-phase strategic initiative. It begins with deep market research followed by thorough regulatory and compliance checks. Local partners are identified and legal entities established. Products are adapted to local needs, regional teams are hired, and targeted marketing campaigns are launched. Continuous monitoring drives quarterly strategy refinements.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["strategic expansion", "sequential dependencies", "review cycles"]
    }
  },
  {
    "input_text": "The autonomous drone delivery system operates by receiving order coordinates, planning optimal flight path while avoiding no-fly zones, conducting pre-flight safety checks, executing the delivery with real-time weather adaptation, confirming successful drop-off, and returning to base with automated charging.",
    "mermaid": "flowchart TD\n    Order[Order Received] --> Plan[Flight Path Planning]\n    Plan --> Safety[Pre-Flight Safety Checks]\n    Safety --> Avoid[Avoid No-Fly Zones]\n    Avoid --> Execute[Execute Delivery Flight]\n    Execute --> Adapt[Real-time Weather Adaptation]\n    Adapt --> Drop[Confirm Drop-off]\n    Drop --> Return[Return to Base]\n    Return --> Charge[Automated Charging]",
    "expanded_text": "The drone delivery system manages complex autonomous operations. Upon receiving order coordinates, it calculates an optimal route while respecting restricted airspace. Rigorous pre-flight checks are performed before execution. During flight, the system dynamically adapts to weather conditions. After successful delivery confirmation, the drone returns to base for automated recharging.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["autonomous workflow", "real-time adaptation", "safety protocols"]
    }
  },
  {
    "input_text": "Handling a data breach incident requires immediate containment, forensic investigation, regulatory notification within 72 hours, customer communication, credit monitoring offers, system security enhancement, and long-term audit trail review.",
    "mermaid": "flowchart TD\n    Breach[Data Breach Detected] --> Contain[Immediate Containment]\n    Contain --> Forensics[Forensic Investigation]\n    Forensics --> Notify[Regulatory Notification]\n    Notify --> Customer[Customer Communication]\n    Customer --> Support[Credit Monitoring Offers]\n    Support --> Enhance[Security Enhancements]\n    Enhance --> Audit[Long-term Audit Review]",
    "expanded_text": "Data breach response follows strict legal and ethical protocols. The team first contains the breach to limit damage, then conducts forensic analysis. Regulatory bodies are notified within required timeframes. Affected customers are informed transparently and offered protective services. Security infrastructure is strengthened and a comprehensive audit ensures future prevention.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["incident response", "compliance timeline", "multi-stakeholder coordination"]
    }
  },
  {
    "input_text": "Curriculum development for a new university program involves industry needs assessment, learning outcome definition, course structure design, faculty recruitment, resource allocation, accreditation application, pilot testing with students, and iterative refinement based on feedback.",
    "mermaid": "flowchart TD\n    Assessment[Industry Needs Analysis] --> Outcomes[Define Learning Outcomes]\n    Outcomes --> Design[Course Structure Design]\n    Design --> Faculty[Faculty Recruitment]\n    Faculty --> Resources[Resource Allocation]\n    Resources --> Accreditation[Accreditation Application]\n    Accreditation --> Pilot[Pilot with Students]\n    Pilot --> Refine[Iterative Refinement]",
    "expanded_text": "Creating a new academic program is a collaborative, multi-year effort. It starts with industry gap analysis and clear learning outcome definition. Course architecture is designed, qualified faculty recruited, and necessary resources allocated. Accreditation is pursued before pilot testing with students. Feedback drives continuous refinement until the program is fully mature.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["curriculum development", "accreditation process", "iterative refinement"]
    }
  },
  {
    "input_text": "Managing a cross-functional product launch requires alignment across marketing, sales, engineering, support, and legal teams through weekly syncs, asset creation, training sessions, beta testing coordination, go-to-market strategy finalization, launch day execution, and post-launch performance analysis.",
    "mermaid": "flowchart TD\n    Alignment[Cross-Team Alignment] --> Assets[Marketing & Sales Assets]\n    Assets --> Training[Team Training Sessions]\n    Training --> Beta[Beta Testing Coordination]\n    Beta --> Strategy[Go-to-Market Finalization]\n    Strategy --> Launch[Launch Day Execution]\n    Launch --> Analysis[Post-Launch Performance Review]",
    "expanded_text": "A successful product launch demands tight orchestration across departments. Regular alignment meetings keep all teams synchronized while marketing and sales assets are developed. Training ensures readiness. Beta testing provides real feedback before final go-to-market strategy approval. Launch execution is followed by detailed performance analysis and optimization.",
    "metadata": {
      "domain": "marketing",
      "complexity": "high",
      "graph_features": ["cross-functional coordination", "launch timeline"]
    }
  },
  {
    "input_text": "Sarah noticed her best friend seemed withdrawn after a breakup. Instead of pushing for details, she sent a gentle check-in message, offered to listen without pressure, suggested low-key activities together, respected boundaries when needed, and consistently showed up as a reliable friend over several weeks.",
    "mermaid": "flowchart TD\n    Notice[Notice Friend's Withdrawal] --> Gentle[Gentle Check-in]\n    Gentle --> Listen[Offer to Listen]\n    Listen --> Activities[Suggest Low-Key Activities]\n    Activities --> Respect[Respect Boundaries]\n    Respect --> Consistent[Consistent Support Over Time]",
    "expanded_text": "Supporting a friend through heartbreak requires sensitivity and patience. Sarah begins with a gentle, non-intrusive check-in and offers space for sharing. She suggests easy, low-pressure activities while carefully respecting boundaries. Her approach emphasizes consistent, long-term presence rather than quick fixes.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "high",
      "graph_features": ["emotional support", "boundary awareness", "long-term commitment"]
    }
  },
  {
    "input_text": "The machine learning model lifecycle includes problem definition, data collection and labeling, exploratory data analysis, feature engineering, model selection and training, hyperparameter tuning, rigorous evaluation, deployment, monitoring for drift, and periodic retraining.",
    "mermaid": "flowchart TD\n    Problem[Problem Definition] --> Data[Data Collection & Labeling]\n    Data --> EDA[Exploratory Data Analysis]\n    EDA --> Features[Feature Engineering]\n    Features --> Train[Model Training]\n    Train --> Tune[Hyperparameter Tuning]\n    Tune --> Evaluate[Model Evaluation]\n    Evaluate --> Deploy[Model Deployment]\n    Deploy --> Monitor[Production Monitoring]\n    Monitor --> Drift{Drift Detected?}\n    Drift -->|Yes| Retrain[Retrain Model]",
    "expanded_text": "The complete machine learning lifecycle is iterative and comprehensive. It starts with clear problem definition and moves through data preparation, exploratory analysis, and feature engineering. Models are trained, tuned, and rigorously evaluated before deployment. In production, continuous monitoring for drift triggers retraining cycles to maintain performance.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["ML lifecycle", "iterative retraining", "monitoring loop"]
    }
  },
  {
    "input_text": "Handling a major airline flight delay involves notifying passengers, offering rebooking options, arranging hotel accommodations for overnight delays, providing meal vouchers, coordinating with ground staff, updating flight status across systems, and managing compensation claims.",
    "mermaid": "flowchart TD\n    Delay[Flight Delay Detected] --> Notify[Passenger Notification]\n    Notify --> Rebook[Offer Rebooking Options]\n    Rebook --> Hotel[Arrange Accommodations]\n    Hotel --> Vouchers[Issue Meal Vouchers]\n    Vouchers --> Ground[Coordinate Ground Staff]\n    Ground --> Update[Update All Systems]\n    Update --> Compensation[Process Claims]",
    "expanded_text": "Major flight delay management is a customer-centric, multi-channel operation. Passengers are promptly informed while rebooking options are provided. For significant delays, hotels and meal vouchers are arranged. Ground teams are coordinated and all systems updated in real-time. Compensation processes run in parallel to maintain trust.",
    "metadata": {
      "domain": "logistics",
      "complexity": "high",
      "graph_features": ["crisis management", "customer experience", "parallel actions"]
    }
  },
  {
    "input_text": "The board approval process for a large capital expenditure requires detailed proposal submission, financial analysis review, risk assessment, strategic alignment check, multiple committee discussions, final board vote, and post-approval audit trail documentation.",
    "mermaid": "flowchart TD\n    Proposal[Capital Expenditure Proposal] --> Financial[Financial Analysis Review]\n    Financial --> Risk[Risk Assessment]\n    Risk --> Strategic[Strategic Alignment Check]\n    Strategic --> Committee[Committee Discussions]\n    Committee --> Board[Board Review & Vote]\n    Board --> Document[Post-Approval Documentation]",
    "expanded_text": "Large capital expenditure decisions undergo rigorous governance. Detailed proposals are submitted and subjected to financial modeling, risk evaluation, and strategic fit assessment. Multiple committee layers discuss the proposal before it reaches the full board for voting. Comprehensive documentation ensures auditability after approval.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["governance process", "multi-level approval"]
    }
  },
  {
    "input_text": "In our competitive MOBA game, players must balance laning phase farming, map awareness for ganks, objective control like towers and dragons, team coordination for fights, resource management, and adaptation to enemy strategies throughout the match.",
    "mermaid": "flowchart TD\n    Start[Match Begins] --> Laning[Laning Phase Farming]\n    Laning --> Awareness[Map Awareness & Ganks]\n    Awareness --> Objectives[Control Map Objectives]\n    Objectives --> Coordination[Team Fight Coordination]\n    Coordination --> Resources[Resource Management]\n    Resources --> Adapt[Adapt to Enemy Strategy]",
    "expanded_text": "Success in competitive MOBA gameplay requires simultaneous management of multiple strategic layers. Players focus on efficient laning and farming while maintaining map awareness to avoid or execute ganks. They contest important objectives, coordinate with teammates during fights, manage resources wisely, and continuously adapt to the evolving enemy strategy.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["multi-layered strategy", "real-time decision making"]
    }
  },
  {
    "input_text": "Our zero-trust security architecture requires continuous user authentication, device posture assessment, least privilege access enforcement, real-time threat monitoring, automated response to anomalies, detailed audit logging, and periodic policy reviews.",
    "mermaid": "flowchart TD\n    Access[Access Request] --> Auth[Continuous Authentication]\n    Auth --> Device[Device Posture Check]\n    Device --> Privilege[Least Privilege Enforcement]\n    Privilege --> Monitor[Real-time Threat Monitoring]\n    Monitor --> Anomaly{Anomaly Detected?}\n    Anomaly -->|Yes| Response[Automated Response]\n    Anomaly -->|No| Logging[Audit Logging]\n    Response --> Logging\n    Logging --> Review[Periodic Policy Review]",
    "expanded_text": "The zero-trust security model operates on continuous verification rather than implicit trust. Every access request triggers authentication and device health validation. Access is granted with minimal privileges and constantly monitored. Any suspicious activity triggers automated containment while all actions are logged. Regular policy reviews ensure the system evolves with emerging threats.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["continuous verification", "real-time monitoring", "automated response loop"]
    }
  },
  {
    "input_text": "Developing a new mobile banking feature goes through user research, UX design, security architecture review, frontend and backend development, integration testing with core banking system, penetration testing, compliance approval, beta release, and full launch with monitoring.",
    "mermaid": "flowchart TD\n    Research[User Research] --> Design[UX/UI Design]\n    Design --> Security[Security Architecture Review]\n    Security --> Development[Frontend & Backend Dev]\n    Development --> Integration[Core Banking Integration]\n    Integration --> Pentest[Penetration Testing]\n    Pentest --> Compliance[Regulatory Approval]\n    Compliance --> Beta[Beta Release]\n    Beta --> Launch[Full Launch & Monitoring]",
    "expanded_text": "Mobile banking feature development follows strict security and compliance standards. It starts with user research and thoughtful design, followed by security architecture validation. Parallel development occurs with continuous integration testing against the core banking system. Multiple rounds of penetration testing and regulatory approval precede a controlled beta release before full production launch with intensive monitoring.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["regulated development", "security gates", "multi-phase approval"]
    }
  },
  {
    "input_text": "Sarah's anxiety management plan includes daily mindfulness practice, cognitive behavioral exercises, regular physical activity, maintaining a support network, tracking triggers in a journal, weekly therapy sessions, and medication review with her psychiatrist when symptoms intensify.",
    "mermaid": "flowchart TD\n    Daily[Daily Practices] --> Mindfulness[Mindfulness Exercise]\n    Daily --> CBT[Cognitive Behavioral Work]\n    Daily --> Exercise[Physical Activity]\n    Support[Support Network] --> Journal[Trigger Journaling]\n    Journal --> Therapy[Weekly Therapy]\n    Therapy --> Review{Medication Review?}\n    Review -->|Intense Symptoms| Psychiatrist[Psychiatrist Consultation]",
    "expanded_text": "Sarah's comprehensive anxiety management combines daily habits with professional support. She maintains mindfulness, cognitive exercises, and physical activity. A strong support network and trigger journaling provide insight. Weekly therapy offers guidance while medication is reviewed with her psychiatrist during periods of increased symptoms.",
    "metadata": {
      "domain": "daily life",
      "complexity": "high",
      "graph_features": ["personal wellness plan", "multi-modal approach", "conditional escalation"]
    }
  },
  {
    "input_text": "The supply chain optimization system continuously analyzes demand patterns, supplier performance, inventory levels, transportation costs, and external factors like weather and geopolitics to dynamically adjust ordering, routing, and stocking decisions.",
    "mermaid": "flowchart TD\n    Analyze[Continuous Data Analysis] --> Demand[Demand Pattern Recognition]\n    Analyze --> Supplier[Supplier Performance]\n    Analyze --> Inventory[Inventory Level Monitoring]\n    Analyze --> External[External Factors Assessment]\n    Demand --> Optimize[Optimization Engine]\n    Supplier --> Optimize\n    Inventory --> Optimize\n    External --> Optimize\n    Optimize --> Adjust[Dynamic Adjustments]",
    "expanded_text": "Modern supply chain optimization uses sophisticated analytics across multiple dimensions. The system simultaneously evaluates demand forecasts, supplier reliability, current inventory, logistics costs, and external disruptions. These inputs feed into a central optimization engine that makes real-time adjustments to ordering quantities, delivery routes, and warehouse stocking levels.",
    "metadata": {
      "domain": "logistics",
      "complexity": "high",
      "graph_features": ["real-time optimization", "multi-factor analysis", "dynamic decisioning"]
    }
  },
  {
    "input_text": "Creating an effective college application strategy involves researching target schools, building an academic and extracurricular profile, preparing standardized test scores, writing compelling personal essays, securing strong recommendation letters, and submitting applications before deadlines with follow-up.",
    "mermaid": "flowchart TD\n    Research[Research Target Schools] --> Profile[Build Strong Profile]\n    Profile --> Tests[Prepare Test Scores]\n    Tests --> Essays[Write Personal Essays]\n    Essays --> Recommendations[Secure Recommendation Letters]\n    Recommendations --> Submit[Submit Applications]\n    Submit --> FollowUp[Post-Submission Follow-up]",
    "expanded_text": "Successful college applications require long-term strategic planning. Students research and select target schools while strengthening their academic and extracurricular profiles. Test preparation, authentic personal essays, and thoughtful recommendation letters are critical components. Applications are carefully submitted before deadlines, followed by appropriate follow-up communication.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["long-term strategy", "multi-component preparation"]
    }
  },
  {
    "input_text": "When implementing a new CRM system, we conduct needs assessment, select the platform, migrate legacy data, customize workflows, train all departments, run parallel operations for two weeks, fully cut over, and provide ongoing support with regular optimization.",
    "mermaid": "flowchart TD\n    Assessment[Needs Assessment] --> Selection[Platform Selection]\n    Selection --> Migration[Data Migration]\n    Migration --> Customize[Workflow Customization]\n    Customize --> Training[Department Training]\n    Training --> Parallel[Parallel Operations]\n    Parallel --> Cutover[Full System Cutover]\n    Cutover --> Support[Ongoing Support & Optimization]",
    "expanded_text": "CRM implementation is a major organizational change project. It begins with thorough needs assessment and platform selection. Historical data is carefully migrated and workflows customized. Comprehensive training prepares all teams. A two-week parallel run minimizes risk before full cutover. Post-implementation support ensures successful adoption and continuous improvement.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["system implementation", "change management", "risk mitigation"]
    }
  },
  {
    "input_text": "The game boss fight design includes multiple phases with escalating difficulty, environmental hazards, player ability cooldown management, team coordination requirements, weak point exploitation, and adaptive AI that responds to player strategies.",
    "mermaid": "flowchart TD\n    Start[Boss Encounter] --> Phase1[Phase 1 - Basic Attacks]\n    Phase1 --> Hazards[Introduce Environmental Hazards]\n    Hazards --> Cooldown[Manage Ability Cooldowns]\n    Cooldown --> Coordination[Require Team Coordination]\n    Coordination --> WeakPoints[Exploit Weak Points]\n    WeakPoints --> Adaptive[Adaptive AI Response]\n    Adaptive --> Final[Final Phase Escalation]",
    "expanded_text": "Boss fight design creates an engaging, multi-layered challenge. The encounter progresses through distinct phases with increasing complexity. Environmental hazards, ability timing, team coordination, and strategic weak point attacks are required. The boss AI dynamically adapts to player tactics, culminating in a high-stakes final phase.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["progressive challenge", "multi-phase design", "adaptive mechanics"]
    }
  },
  {
    "input_text": "Our content recommendation engine balances exploration and exploitation by tracking user engagement, calculating similarity scores, incorporating diversity factors, applying contextual signals like time of day, and continuously updating embeddings based on implicit and explicit feedback.",
    "mermaid": "flowchart TD\n    Track[Track User Engagement] --> Similarity[Calculate Similarity Scores]\n    Similarity --> Diversity[Apply Diversity Factors]\n    Diversity --> Context[Incorporate Contextual Signals]\n    Context --> Recommend[Generate Recommendations]\n    Recommend --> Feedback[Collect Implicit & Explicit Feedback]\n    Feedback --> Update[Update User Embeddings]",
    "expanded_text": "The recommendation engine employs a sophisticated balancing act. It analyzes past engagement and computes content similarity while deliberately introducing diversity. Contextual factors such as time and location refine suggestions. Both implicit behavior and explicit feedback continuously update user embeddings to improve future personalization.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["recommendation logic", "exploration-exploitation balance", "continuous learning"]
    }
  },
  {
    "input_text": "Navigating a difficult conversation with a micromanaging boss requires preparing specific examples, choosing the right time, using 'I' statements, focusing on impact rather than blame, proposing collaborative solutions, and agreeing on clear expectations moving forward.",
    "mermaid": "flowchart TD\n    Prepare[Prepare Specific Examples] --> Timing[Choose Right Moment]\n    Timing --> Approach[Use I Statements]\n    Approach --> Focus[Focus on Impact]\n    Focus --> Propose[Propose Solutions]\n    Propose --> Agreement[Agree on Expectations]",
    "expanded_text": "Addressing micromanagement requires emotional intelligence and strategic communication. The employee prepares concrete examples beforehand and selects an appropriate time. During the conversation, 'I' statements keep the tone non-accusatory. The discussion focuses on business impact and collaboratively develops solutions with clear future expectations.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "high",
      "graph_features": ["difficult conversation", "professional communication strategy"]
    }
  },
  {
    "input_text": "The financial forecasting model integrates historical performance data, market trend analysis, economic indicator projections, scenario modeling for best/worst cases, sensitivity analysis, executive review, and quarterly forecast updates based on actual results.",
    "mermaid": "flowchart TD\n    Historical[Historical Data] --> Trends[Market Trend Analysis]\n    Trends --> Economic[Economic Indicators]\n    Economic --> Scenarios[Scenario Modeling]\n    Scenarios --> Sensitivity[Sensitivity Analysis]\n    Sensitivity --> Executive[Executive Review]\n    Executive --> Update[Quarterly Forecast Updates]",
    "expanded_text": "Corporate financial forecasting combines multiple data sources and analytical techniques. Historical results are analyzed alongside market trends and macroeconomic projections. Multiple scenarios and sensitivity tests provide a robust range of outcomes. Executive input refines the model, which is updated quarterly based on actual performance versus forecast.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["forecasting model", "scenario analysis", "iterative refinement"]
    }
  },
  {
    "input_text": "Our microservices migration from monolithic architecture involves service identification, dependency mapping, database decomposition, API gateway implementation, incremental migration with strangler pattern, comprehensive testing, traffic shifting, and full cutover with monitoring.",
    "mermaid": "flowchart TD\n    Assess[Monolith Assessment] --> Identify[Service Identification]\n    Identify --> Map[Dependency Mapping]\n    Map --> Database[Database Decomposition]\n    Database --> Gateway[API Gateway Setup]\n    Gateway --> Incremental[Incremental Migration]\n    Incremental --> Testing[Comprehensive Testing]\n    Testing --> Shift[Gradual Traffic Shifting]\n    Shift --> Cutover[Full Cutover]\n    Cutover --> Monitor[Post-Migration Monitoring]",
    "expanded_text": "Migrating from a monolithic to microservices architecture is a carefully phased transformation. The process begins with thorough assessment and service boundary identification, followed by dependency mapping and database decomposition strategies. An API gateway is established before incremental migration using the strangler pattern. Rigorous testing precedes gradual traffic shifting, culminating in full cutover with intensive post-migration monitoring.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["migration strategy", "incremental rollout", "dependency management"]
    }
  },
  {
    "input_text": "Clinical drug development progresses through discovery phase, preclinical testing, Phase I safety trials, Phase II efficacy trials, Phase III large-scale confirmation, regulatory review, and post-market surveillance.",
    "mermaid": "flowchart TD\n    Discovery[Drug Discovery] --> Preclinical[Preclinical Testing]\n    Preclinical --> Phase1[Phase I - Safety]\n    Phase1 --> Phase2[Phase II - Efficacy]\n    Phase2 --> Phase3[Phase III - Large Scale]\n    Phase3 --> Regulatory[Regulatory Approval]\n    Regulatory --> PostMarket[Post-Market Surveillance]",
    "expanded_text": "Bringing a new drug to market is a lengthy, highly regulated journey. It starts with discovery and laboratory research, followed by extensive preclinical testing. Successful candidates advance through Phase I safety trials in small groups, Phase II efficacy studies, and large-scale Phase III confirmation trials. Regulatory authorities review all data before approval, followed by ongoing post-market safety monitoring.",
    "metadata": {
      "domain": "science",
      "complexity": "high",
      "graph_features": ["phased pipeline", "regulatory gates", "sequential progression"]
    }
  },
  {
    "input_text": "When launching a major company-wide initiative like diversity and inclusion program, we start with leadership buy-in, conduct organization-wide assessment, form cross-functional task force, develop action plans, roll out training, establish metrics, and review progress quarterly.",
    "mermaid": "flowchart TD\n    BuyIn[Secure Leadership Buy-in] --> Assessment[Organization Assessment]\n    Assessment --> TaskForce[Form Cross-Functional Team]\n    TaskForce --> Plans[Develop Action Plans]\n    Plans --> Training[Company-wide Training]\n    Training --> Metrics[Define Success Metrics]\n    Metrics --> Review[Quarterly Progress Reviews]",
    "expanded_text": "Launching a company-wide diversity and inclusion program requires strong foundational support. It begins with leadership commitment and a thorough organizational assessment. A dedicated cross-functional team develops detailed action plans and delivers comprehensive training. Clear metrics are established with regular quarterly reviews to measure impact and adjust strategies.",
    "metadata": {
      "domain": "HR",
      "complexity": "high",
      "graph_features": ["change management", "multi-phase rollout", "measurement framework"]
    }
  },
  {
    "input_text": "Home renovation project management includes defining scope and budget, hiring architects and contractors, obtaining permits, demolition phase, structural work, electrical and plumbing, finishing work, final inspection, and punch list completion.",
    "mermaid": "flowchart TD\n    Scope[Define Scope & Budget] --> Hire[Hire Professionals]\n    Hire --> Permits[Obtain Permits]\n    Permits --> Demolition[Demolition Phase]\n    Demolition --> Structural[Structural Work]\n    Structural --> MEP[Electrical & Plumbing]\n    MEP --> Finishing[Finishing & Interior Work]\n    Finishing --> Inspection[Final Inspection]\n    Inspection --> PunchList[Punch List Completion]",
    "expanded_text": "Managing a home renovation is a complex sequential project. It starts with clear scope definition and budgeting, followed by hiring qualified professionals and securing necessary permits. The physical work progresses from demolition through structural changes, MEP systems, and interior finishing. Final inspections and punch list resolution complete the project.",
    "metadata": {
      "domain": "daily life",
      "complexity": "high",
      "graph_features": ["project management", "sequential phases", "dependency chain"]
    }
  },
  {
    "input_text": "The influencer marketing campaign lifecycle consists of influencer identification, vetting and negotiation, content brief creation, content approval, campaign launch with coordinated posting, performance tracking, engagement management, and final performance reporting with ROI analysis.",
    "mermaid": "flowchart TD\n    Identify[Influencer Identification] --> Vetting[Vetting & Negotiation]\n    Vetting --> Brief[Content Brief Creation]\n    Brief --> Approval[Content Approval]\n    Approval --> Launch[Campaign Launch]\n    Launch --> Track[Performance Tracking]\n    Track --> Engagement[Engagement Management]\n    Engagement --> Report[Final ROI Report]",
    "expanded_text": "Successful influencer marketing campaigns follow a structured end-to-end process. Potential influencers are identified and carefully vetted before contract negotiation. Detailed content briefs are created and approved. The campaign launches with synchronized activities. Real-time tracking and engagement management lead to comprehensive final reporting and ROI evaluation.",
    "metadata": {
      "domain": "marketing",
      "complexity": "high",
      "graph_features": ["campaign lifecycle", "approval gates", "performance tracking"]
    }
  },
  {
    "input_text": "Patient discharge planning in hospitals requires medication reconciliation, follow-up appointment scheduling, patient education on care instructions, arranging home care services if needed, transportation coordination, and a 48-hour post-discharge follow-up call.",
    "mermaid": "flowchart TD\n    Decision[Discharge Decision] --> Reconciliation[Medication Reconciliation]\n    Reconciliation --> Appointments[Schedule Follow-ups]\n    Appointments --> Education[Patient & Family Education]\n    Education --> HomeCare{Home Care Needed?}\n    HomeCare -->|Yes| Arrange[Arrange Support Services]\n    Education --> Transport[Transportation Planning]\n    Transport --> FollowUp[48-Hour Post-Discharge Call]",
    "expanded_text": "Effective hospital discharge planning ensures smooth transition and reduces readmission risk. The process includes medication reconciliation, scheduling follow-up care, comprehensive patient education, coordination of home health services when necessary, transportation arrangements, and proactive follow-up contact within 48 hours.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["care transition", "patient safety", "multi-stakeholder coordination"]
    }
  },
  {
    "input_text": "Ethical AI deployment requires bias assessment, transparency documentation, stakeholder impact analysis, human oversight mechanisms, regular auditing, incident response planning, and continuous ethical review as the system evolves.",
    "mermaid": "flowchart TD\n    Develop[AI System Development] --> Bias[Bias & Fairness Assessment]\n    Bias --> Transparency[Transparency Documentation]\n    Transparency --> Impact[Stakeholder Impact Analysis]\n    Impact --> Oversight[Human Oversight Design]\n    Oversight --> Audit[Regular Auditing]\n    Audit --> Response[Incident Response Planning]\n    Response --> Review[Continuous Ethical Review]",
    "expanded_text": "Responsible AI deployment incorporates ethics at every stage. Bias detection and mitigation are performed alongside transparency documentation. Potential societal impacts are analyzed and human oversight mechanisms established. The system undergoes regular audits with clear incident response procedures, supported by ongoing ethical governance as the model evolves.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["ethical framework", "governance process", "continuous review"]
    }
  },
  {
    "input_text": "Resolving a major team conflict at work involves private conversations with each party, understanding underlying issues, facilitating a mediated discussion, agreeing on behavioral expectations, implementing follow-up check-ins, and measuring improvement over time.",
    "mermaid": "flowchart TD\n    Identify[Conflict Identified] --> Private[Private Individual Conversations]\n    Private --> Understand[Understand Root Causes]\n    Understand --> Mediate[Facilitated Group Discussion]\n    Mediate --> Agreement[Establish Clear Expectations]\n    Agreement --> Checkins[Regular Follow-up Check-ins]\n    Checkins --> Measure[Measure Resolution Progress]",
    "expanded_text": "Effective team conflict resolution is a sensitive, structured process. The manager begins with separate conversations to understand each person's perspective. A mediated joint discussion follows where root causes are addressed. Clear behavioral agreements are established, supported by scheduled check-ins and measurable progress tracking.",
    "metadata": {
      "domain": "HR",
      "complexity": "high",
      "graph_features": ["conflict resolution", "mediation process", "follow-up mechanism"]
    }
  },
  {
    "input_text": "Seasonal inventory planning for retail involves demand forecasting based on historical sales, trend analysis, supplier lead time consideration, safety stock calculation, budget allocation, phased ordering, and mid-season adjustment based on actual sales performance.",
    "mermaid": "flowchart TD\n    Forecast[Demand Forecasting] --> Trend[Trend Analysis]\n    Trend --> LeadTime[Supplier Lead Time Planning]\n    LeadTime --> Safety[Safety Stock Calculation]\n    Safety --> Budget[Budget Allocation]\n    Budget --> Ordering[Phased Purchase Orders]\n    Ordering --> Monitor[Mid-Season Performance Review]\n    Monitor --> Adjust[Inventory Adjustment]",
    "expanded_text": "Effective seasonal inventory management combines predictive analytics with flexibility. Historical sales and trend data inform demand forecasts. Supplier constraints and safety stock requirements shape ordering strategy within budget limits. Phased procurement is followed by continuous mid-season monitoring and dynamic adjustments based on real performance.",
    "metadata": {
      "domain": "logistics",
      "complexity": "high",
      "graph_features": ["inventory optimization", "forecasting cycle", "adaptive planning"]
    }
  },
  {
    "input_text": "Character progression in our RPG game includes completing main quests for story advancement, side quests for reputation and resources, skill tree investment, equipment upgrading, faction alignment choices that affect world state, and unlocking new areas based on overall power level.",
    "mermaid": "flowchart TD\n    Start[Character Creation] --> MainQuests[Main Story Quests]\n    MainQuests --> SideQuests[Side Quests & Exploration]\n    SideQuests --> Skills[Skill Tree Progression]\n    Skills --> Equipment[Gear Upgrading]\n    Equipment --> Faction[Faction Alignment Choices]\n    Faction --> Unlock[Unlock New Areas]\n    Unlock --> Power[Overall Power Assessment]",
    "expanded_text": "RPG character progression creates rich, interconnected systems. Players advance the main storyline while engaging in optional side content for rewards and reputation. Skill points are invested strategically, equipment is upgraded, and faction choices meaningfully impact the game world. New areas become accessible as the character's overall power level increases.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["progression systems", "player choice impact", "interconnected mechanics"]
    }
  },
  {
    "input_text": "Our talent acquisition pipeline includes workforce planning, job requisition approval, sourcing candidates through multiple channels, screening and interviewing, skills assessment, cultural fit evaluation, offer negotiation, background verification, and seamless onboarding integration.",
    "mermaid": "flowchart TD\n    Planning[Workforce Planning] --> Requisition[Job Requisition Approval]\n    Requisition --> Sourcing[Multi-Channel Sourcing]\n    Sourcing --> Screening[Screening & Shortlisting]\n    Screening --> Interview[Interview Process]\n    Interview --> Assessment[Skills Assessment]\n    Assessment --> Cultural[Cultural Fit Evaluation]\n    Cultural --> Negotiation[Offer Negotiation]\n    Negotiation --> Verification[Background Checks]\n    Verification --> Onboarding[Seamless Onboarding]",
    "expanded_text": "The end-to-end talent acquisition process is strategic and multi-layered. It begins with workforce planning and approved job requisitions. Candidates are sourced across various platforms and rigorously screened. Multiple interview rounds, skills tests, and cultural evaluations lead to offer negotiations. Final background verification ensures compliance before a structured onboarding experience.",
    "metadata": {
      "domain": "HR",
      "complexity": "high",
      "graph_features": ["recruitment pipeline", "multi-stage filtering", "sequential verification"]
    }
  },
  {
    "input_text": "When launching a new SaaS feature, the team conducts user research, designs the UX, develops the backend and frontend in parallel, implements analytics tracking, runs beta tests with power users, gathers feedback, iterates quickly, and monitors adoption metrics post-release.",
    "mermaid": "flowchart TD\n    Research[User Research] --> Design[UX Design]\n    Design --> Parallel[Parallel Development]\n    Parallel --> Analytics[Implement Analytics]\n    Analytics --> Beta[Beta Testing with Power Users]\n    Beta --> Feedback[Gather & Analyze Feedback]\n    Feedback --> Iterate[Quick Iterations]\n    Iterate --> Release[Feature Release]\n    Release --> Monitor[Adoption & Usage Monitoring]",
    "expanded_text": "SaaS feature launches follow a user-centered, iterative approach. Initial research informs UX design while backend and frontend development proceed in parallel. Analytics tracking is embedded early. Selected power users participate in beta testing, providing valuable feedback that drives rapid iterations before official release. Post-launch monitoring tracks adoption and engagement.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["product development", "parallel workstreams", "feedback iteration"]
    }
  },
  {
    "input_text": "The emergency department triage system categorizes patients by severity, prioritizes life-threatening cases, assigns appropriate resources, continuously reassesses waiting patients, and escalates care when conditions deteriorate.",
    "mermaid": "flowchart TD\n    Arrival[Patient Arrival] --> Triage[Initial Triage Assessment]\n    Triage --> Priority[Assign Priority Level]\n    Priority --> Resources[Allocate Resources]\n    Resources --> Treat[Treatment Begins]\n    Treat --> Reassess[Continuous Reassessment]\n    Reassess --> Deteriorate{Condition Worsens?}\n    Deteriorate -->|Yes| Escalate[Escalate Care]",
    "expanded_text": "Emergency department triage is a dynamic, high-stakes process. Upon arrival, patients receive rapid assessment and priority classification. Resources are allocated accordingly. Treatment begins while waiting patients are continuously monitored. Any deterioration triggers immediate escalation to higher care levels.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["triage system", "continuous reassessment", "escalation logic"]
    }
  },
  {
    "input_text": "Building a successful personal brand on social media requires consistent content creation, audience engagement, collaboration with other creators, value-driven storytelling, analytics review, and strategic platform expansion over time.",
    "mermaid": "flowchart TD\n    Content[Consistent Content Creation] --> Engage[Audience Engagement]\n    Engage --> Collaborate[Creator Collaborations]\n    Collaborate --> Story[Value-Driven Storytelling]\n    Story --> Analytics[Performance Analytics Review]\n    Analytics --> Expand[Strategic Platform Growth]",
    "expanded_text": "Personal branding on social media is an intentional long-term endeavor. It centers on consistent, high-quality content and active audience engagement. Strategic collaborations amplify reach while authentic storytelling builds connection. Regular analytics reviews inform content strategy and guide thoughtful expansion across platforms.",
    "metadata": {
      "domain": "marketing",
      "complexity": "high",
      "graph_features": ["personal branding", "growth loop", "analytics-driven"]
    }
  },
  {
    "input_text": "The AI content generation workflow includes prompt engineering, content generation, quality evaluation against brand guidelines, fact-checking, human editing, SEO optimization, and A/B testing before final publishing.",
    "mermaid": "flowchart TD\n    Prompt[Prompt Engineering] --> Generate[AI Content Generation]\n    Generate --> Evaluate[Quality & Brand Evaluation]\n    Evaluate --> FactCheck[Fact Verification]\n    FactCheck --> Edit[Human Editing]\n    Edit --> SEO[SEO Optimization]\n    SEO --> AB[A/B Testing Variants]\n    AB --> Publish[Final Publishing]",
    "expanded_text": "AI-assisted content creation combines automation with human oversight. Well-crafted prompts generate initial drafts that undergo strict quality and brand alignment checks. Fact verification, human editing, and SEO optimization follow. A/B testing determines the strongest version before final publication.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "high",
      "graph_features": ["content pipeline", "quality gates", "human-AI collaboration"]
    }
  },
  {
    "input_text": "Resolving a high-value client dispute requires gathering all documentation, internal review of contract terms, senior leadership involvement, legal consultation, proposing multiple resolution options, negotiating with the client, and documenting the agreed settlement.",
    "mermaid": "flowchart TD\n    Dispute[Client Dispute Raised] --> Documentation[Gather Evidence]\n    Documentation --> Internal[Internal Contract Review]\n    Internal --> Leadership[Senior Leadership Involvement]\n    Leadership --> Legal[Legal Consultation]\n    Legal --> Options[Develop Resolution Options]\n    Options --> Negotiate[Client Negotiation]\n    Negotiate --> Settlement[Document Agreement]",
    "expanded_text": "High-value client disputes demand careful, professional handling. All relevant documentation is compiled and internally reviewed against contract terms. Senior leaders and legal teams are engaged early. Multiple resolution scenarios are prepared before constructive negotiation. Any agreement reached is formally documented to prevent future issues.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["dispute resolution", "multi-level involvement", "negotiation process"]
    }
  },
  {
    "input_text": "The daily stand-up meeting in agile teams follows a strict format where each member answers what they did yesterday, what they will do today, and any blockers, with the scrum master facilitating and removing impediments.",
    "mermaid": "flowchart TD\n    Start[Stand-up Begins] --> Yesterday[What I Did Yesterday]\n    Yesterday --> Today[What I Will Do Today]\n    Today --> Blockers[Any Blockers?]\n    Blockers --> Next[Next Team Member]\n    Next --> Complete{All Members Done?}\n    Complete -->|No| Yesterday\n    Complete -->|Yes| Action[Record Action Items]",
    "expanded_text": "Daily stand-up meetings maintain team alignment through a focused, time-boxed format. Each member briefly shares yesterday’s accomplishments, today’s plans, and any blockers. The scrum master facilitates the meeting and takes ownership of removing impediments while action items are captured for follow-up.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["team ritual", "iterative round-robin", "impediment removal"]
    }
  },
  {
    "input_text": "Navigating grief after losing a loved one often involves allowing oneself to feel emotions, seeking support from family and friends, maintaining daily routines when possible, honoring memories through rituals, professional counseling if needed, and gradually finding new meaning.",
    "mermaid": "flowchart TD\n    Loss[Experience Loss] --> Emotions[Allow Emotional Expression]\n    Emotions --> Support[Seek Social Support]\n    Support --> Routine[Maintain Daily Routines]\n    Routine --> Honor[Create Memory Rituals]\n    Honor --> Counseling{Professional Help?}\n    Counseling --> Meaning[Find New Meaning]",
    "expanded_text": "The grief journey is deeply personal and non-linear. Individuals first allow themselves to experience the full range of emotions. Support from loved ones and maintaining some routines provide stability. Honoring the deceased through rituals helps processing. Some seek professional counseling while gradually rediscovering purpose and meaning.",
    "metadata": {
      "domain": "social relationships",
      "complexity": "high",
      "graph_features": ["emotional process", "support systems", "healing pathway"]
    }
  },
  {
    "input_text": "Website performance optimization includes image compression, code minification, caching strategy implementation, CDN usage, lazy loading, database query optimization, and regular performance auditing with user experience monitoring.",
    "mermaid": "flowchart TD\n    Audit[Initial Performance Audit] --> Images[Image Optimization]\n    Images --> Minify[Code Minification]\n    Minify --> Caching[Implement Caching]\n    Caching --> CDN[Content Delivery Network]\n    CDN --> Lazy[Lazy Loading]\n    Lazy --> Database[Database Optimization]\n    Database --> Monitor[Continuous Monitoring]",
    "expanded_text": "Website performance optimization is a multi-layered technical effort. It starts with comprehensive auditing followed by image compression, code minification, intelligent caching, CDN integration, lazy loading techniques, and database query improvements. Ongoing monitoring ensures sustained user experience quality.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["optimization workflow", "technical improvements", "continuous monitoring"]
    }
  },
  {
    "input_text": "Building customer loyalty involves delivering exceptional product quality, providing proactive support, creating personalized experiences, running loyalty programs, gathering and acting on feedback, and maintaining consistent brand communication.",
    "mermaid": "flowchart TD\n    Quality[Deliver Product Quality] --> Support[Proactive Customer Support]\n    Support --> Personalize[Personalized Experiences]\n    Personalize --> Loyalty[Implement Loyalty Programs]\n    Loyalty --> Feedback[Gather & Act on Feedback]\n    Feedback --> Communication[Consistent Brand Communication]",
    "expanded_text": "Sustainable customer loyalty is built through multiple reinforcing practices. It starts with superior product quality and responsive support. Personalized experiences and structured loyalty programs enhance connection. Continuous feedback collection and genuine responses, paired with consistent brand communication, strengthen long-term relationships.",
    "metadata": {
      "domain": "customer support",
      "complexity": "high",
      "graph_features": ["loyalty building", "feedback loop", "relationship nurturing"]
    }
  },
  {
    "input_text": "A patient books a telehealth appointment. They log into the patient portal and select a doctor from the list of available providers. They choose a date and time slot. The system checks if the selected time is within the doctor's working hours (Monday to Friday, 9 AM to 5 PM). If not, it shows an error and asks the patient to pick another time. If valid, the system checks for scheduling conflicts with the doctor's calendar. If the doctor is already booked at that time, the patient is shown alternative slots. If no conflict, the appointment is confirmed. A confirmation email with a video call link is sent to the patient. The patient receives an SMS reminder 1 hour before the appointment. At the appointment time, the patient clicks the link to join the video call. If the patient does not join within 15 minutes, the doctor marks the appointment as missed and a $25 no-show fee is charged.",
    "mermaid": "graph TD\n    A[Log into patient portal] --> B[Select doctor from available providers]\n    B --> C[Choose date and time slot]\n    C --> D{Time within doctor's working hours? (M-F 9-5)}\n    D -->|No| E[Show error, pick another time]\n    E --> C\n    D -->|Yes| F{Doctor available at that time?}\n    F -->|No| G[Show alternative slots]\n    G --> C\n    F -->|Yes| H[Confirm appointment, send email with video link]\n    H --> I[Send SMS reminder 1 hour before]\n    I --> J[At appointment time, patient clicks link to join]\n    J --> K{Patient joins within 15 minutes?}\n    K -->|Yes| L[Doctor conducts visit]\n    K -->|No| M[Doctor marks missed, charge $25 no-show fee]",
    "expanded_text": "A patient books a telehealth appointment by logging into the patient portal and selecting a doctor from the list of available providers. They then choose a date and time slot. The system first checks whether the selected time falls within the doctor's working hours, which are Monday through Friday, 9 AM to 5 PM. If not, an error is shown and the patient must pick another time. If the time is valid, the system checks for scheduling conflicts with the doctor's existing calendar. If the doctor is already booked at that time, the patient is shown alternative available slots and asked to choose again. If no conflict exists, the appointment is confirmed, and a confirmation email containing a video call link is sent to the patient. One hour before the appointment, the patient receives an SMS reminder. At the scheduled appointment time, the patient clicks the link to join the video call. If the patient does not join within 15 minutes, the doctor marks the appointment as missed and a $25 no-show fee is charged to the patient's account.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches", "time validation", "reminders", "no-show penalty"]
    }
  },
  {
    "input_text": "An e-commerce site applies discount codes at checkout. The user enters a discount code in a text box and clicks 'Apply'. The system checks if the code exists in the database. If not, it shows 'Invalid code'. If the code exists, it checks if the code has expired. If the expiration date is in the past, it shows 'Code expired'. If still valid, it checks if the code has a minimum purchase requirement (e.g., '$50 minimum'). If the cart total is below the minimum, it shows 'Minimum purchase not met'. If all checks pass, the system calculates the discount. Percentage codes reduce the subtotal by the given percentage (e.g., 10% off). Fixed-amount codes subtract a specific dollar amount. If the discount exceeds the cart total, the total becomes $0. The discounted total is displayed, and the code is marked as used for this user (if one-time use). The user can only apply one code per order.",
    "mermaid": "graph TD\n    A[User enters discount code, clicks Apply] --> B{Code exists in database?}\n    B -->|No| C[Show 'Invalid code']\n    B -->|Yes| D{Code expired?}\n    D -->|Yes| E[Show 'Code expired']\n    D -->|No| F{Minimum purchase requirement met?}\n    F -->|No| G[Show 'Minimum purchase not met']\n    F -->|Yes| H{Discount type?}\n    H -->|Percentage| I[Subtract percentage from subtotal]\n    H -->|Fixed amount| J[Subtract fixed dollar amount]\n    I --> K{Discount > cart total?}\n    J --> K\n    K -->|Yes| L[Total becomes $0]\n    K -->|No| M[Calculate discounted total]\n    L --> N[Display discounted total, mark code as used]\n    M --> N\n    N --> O[User cannot apply another code]",
    "expanded_text": "At checkout, the user enters a discount code in a text box and clicks 'Apply'. The system first checks whether the code exists in the database. If not, 'Invalid code' is displayed. If the code exists, the system checks whether the code has expired by comparing the expiration date to the current date. If expired, 'Code expired' is displayed. If still valid, the system checks whether there is a minimum purchase requirement (e.g., $50 minimum). If the cart total is below the minimum, 'Minimum purchase not met' is shown. If all checks pass, the system identifies the discount type. If the code is a percentage code (e.g., 10% off), the subtotal is reduced by that percentage. If it is a fixed-amount code, a specific dollar amount is subtracted. If the calculated discount exceeds the cart total, the total becomes $0. Otherwise, the discounted total is calculated. The discounted total is then displayed, and the code is marked as used for this user (if the code is one-time use). Only one discount code can be applied per order.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["conditional branches", "validation chain", "discount calculation logic", "edge case (total to zero)"]
    }
  },
  {
    "input_text": "A user reports a phishing email to their company's IT security team. The user forwards the suspicious email to a designated address (phish@company.com). The system automatically analyzes the email headers and links. If the analysis determines the email is a false positive (legitimate email marked as phishing), the system replies to the user that no action is needed. If it is confirmed as phishing, the system extracts any malicious URLs and adds them to a blocklist. It then checks if any other employees have received the same email by scanning the company's email server. For each employee who received it, the system automatically deletes the email from their inbox and sends them a notification warning about the phishing attempt. Additionally, if the phish requested credentials or payment, the system generates a report for the security team to review within 24 hours. The security team may then decide to require password resets for affected users if credentials were compromised.",
    "mermaid": "graph TD\n    A[User forwards email to phish@company.com] --> B[System analyzes headers and links]\n    B --> C{Is it actually phishing?}\n    C -->|No - false positive| D[Reply to user: no action needed]\n    C -->|Yes - confirmed phishing| E[Extract malicious URLs, add to blocklist]\n    E --> F[Scan email server for other recipients]\n    F --> G[For each recipient: auto-delete email, send warning notification]\n    G --> H{Did phish request credentials or payment?}\n    H -->|Yes| I[Generate report for security team, review within 24h]\n    H -->|No| J[Process ends]\n    I --> K{Security team determines credentials compromised?}\n    K -->|Yes| L[Require password reset for affected users]\n    K -->|No| J",
    "expanded_text": "When a user reports a suspicious email, they forward it to phish@company.com. The system automatically analyzes the email's headers and any embedded links. If the analysis determines that the email is a false positive (a legitimate email that was mistakenly reported as phishing), the system replies to the user stating that no action is needed. If the email is confirmed as phishing, the system extracts any malicious URLs and adds them to a corporate blocklist. It then scans the company's email server to identify any other employees who received the same email. For each recipient, the system automatically deletes the phishing email from their inbox and sends them a warning notification about the attempt. Additionally, if the phishing email requested sensitive information such as login credentials or payment details, the system generates a report for the security team, who must review it within 24 hours. If the security team determines that any user's credentials were actually compromised, they require an immediate password reset for those affected users.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "bulk action (multiple recipients)", "escalation to security team", "remediation (password reset)"]
    }
  },
  {
    "input_text": "A student applies for financial aid. The student fills out the FAFSA form online, providing tax information and family income. The system checks if the student meets the basic eligibility requirements (citizenship, enrollment status, not in default on prior loans). If not, the application is rejected and the student is notified. If eligible, the system calculates the Expected Family Contribution (EFC) using a federal formula. The EFC is then compared to the school's Cost of Attendance (COA). If the EFC is greater than or equal to the COA, the student is not eligible for need-based aid, but may be offered unsubsidized loans. If the EFC is less than the COA, the student's financial need is calculated as COA minus EFC. The school's financial aid office then packages aid: first grants (free money), then work-study, then subsidized loans, then unsubsidized loans. The student receives an award letter and must accept or decline each component within 30 days. If the student does not respond within 30 days, the award is canceled.",
    "mermaid": "graph TD\n    A[Student fills out FAFSA form] --> B{Meets basic eligibility?}\n    B -->|No| C[Reject application, notify student]\n    B -->|Yes| D[Calculate Expected Family Contribution (EFC)]\n    D --> E{EFC >= Cost of Attendance (COA)?}\n    E -->|Yes| F[Not eligible for need-based aid, offer unsubsidized loans only]\n    E -->|No| G[Calculate need: COA - EFC]\n    G --> H[Aid office packages aid: grants, work-study, subsidized loans, unsubsidized loans]\n    F --> I[Send award letter to student]\n    H --> I\n    I --> J{Student accepts/declines components within 30 days?}\n    J -->|Yes| K[Award disbursed to student account]\n    J -->|No| L[Award canceled]",
    "expanded_text": "A student applies for financial aid by completing the FAFSA form online, providing tax information and family income. The system first checks whether the student meets basic eligibility requirements, including citizenship status, enrollment status, and not being in default on prior student loans. If not eligible, the application is rejected and the student is notified. If eligible, the system calculates the Expected Family Contribution (EFC) using a federal formula. The EFC is then compared to the school's Cost of Attendance (COA). If the EFC is greater than or equal to the COA, the student is not eligible for need-based aid, but may be offered unsubsidized loans. If the EFC is less than the COA, the student's financial need is calculated as COA minus EFC. The school's financial aid office then packages aid in the following order: grants (free money that does not need to be repaid), work-study (part-time job earnings), subsidized loans (government pays interest while in school), and finally unsubsidized loans (interest accrues immediately). The student receives an award letter detailing the aid package and must accept or decline each component within 30 days. If the student does not respond within the 30-day window, the entire award is canceled.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "financial calculation", "aid packaging order", "acceptance deadline"]
    }
  },
  {
    "input_text": "A homeowner files a home insurance claim after a kitchen fire. The homeowner calls the insurance company's claims hotline. The agent creates a claim record and assigns a claim number. The agent asks the homeowner to upload photos of the damage and a list of damaged items. The system then dispatches an adjuster to inspect the property within 48 hours. The adjuster assesses the damage and estimates repair costs. If the estimated repair cost is below the deductible ($1,000), the claim is closed with no payout. If the cost exceeds the deductible, the adjuster approves the claim and calculates the payout as (repair cost - deductible). The payment is then approved by a claims manager for amounts over $5,000. For amounts under $5,000, the adjuster can approve directly. Once approved, the payment is sent to the homeowner within 7 days. The homeowner can appeal a denial within 30 days by submitting additional evidence.",
    "mermaid": "graph TD\n    A[Homeowner calls claims hotline] --> B[Agent creates claim record, assigns claim number]\n    B --> C[Homeowner uploads photos and damaged items list]\n    C --> D[Dispatcher sends adjuster within 48 hours]\n    D --> E[Adjuster inspects, estimates repair cost]\n    E --> F{Repair cost > deductible ($1000)?}\n    F -->|No| G[Close claim, no payout]\n    F -->|Yes| H[Adjuster approves claim, calculates payout = repair cost - deductible]\n    H --> I{Payout amount > $5000?}\n    I -->|Yes| J[Claims manager must approve]\n    I -->|No| K[Adjuster approves directly]\n    J --> L[Send payment within 7 days]\n    K --> L\n    G --> M{Homeowner appeals within 30 days?}\n    M -->|Yes| N[Submit additional evidence, re-evaluate]\n    N --> E\n    M -->|No| O[Claim closed permanently]",
    "expanded_text": "A homeowner files a home insurance claim after a kitchen fire by calling the insurance company's claims hotline. An agent creates a claim record and assigns a unique claim number. The agent then asks the homeowner to upload photos of the damage and a list of damaged items. The system dispatches an adjuster to inspect the property within 48 hours. The adjuster assesses the damage and estimates the repair cost. If the estimated repair cost is below the deductible of $1,000, the claim is closed with no payout. If the cost exceeds the deductible, the adjuster approves the claim and calculates the payout as the repair cost minus the deductible. If the payout amount is over $5,000, a claims manager must approve the payment; if under $5,000, the adjuster can approve directly. Once approved, the payment is sent to the homeowner within 7 days. If the claim was denied (either due to being below the deductible or another reason), the homeowner may appeal the denial within 30 days by submitting additional evidence, which triggers a re-evaluation by the adjuster.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (deductible threshold)", "approval tiers (manager vs adjuster)", "appeal loop"]
    }
  },
  {
    "input_text": "A developer sets up a new development environment. First, they install Git and clone the repository from GitHub. Then they install Node.js and npm. They run 'npm install' to download dependencies. Next, they create a .env file with API keys (database URL, secret key, etc.) using a template. They then set up the database by running migrations ('npm run migrate'). If the migrations fail, they check the database connection string and retry. After migrations succeed, they seed the database with test data ('npm run seed'). Finally, they start the development server ('npm run dev'). If the server fails to start due to a port conflict, they change the port in the .env file and restart. Once the server is running, they open a browser to localhost:3000 to verify. If the page loads, the environment is ready for development. They commit the .env.example file (but not the actual .env) to the repository for other developers.",
    "mermaid": "graph TD\n    A[Install Git, clone repo from GitHub] --> B[Install Node.js and npm]\n    B --> C[Run 'npm install']\n    C --> D[Create .env file from template, add API keys]\n    D --> E[Run 'npm run migrate']\n    E --> F{Migration succeeds?}\n    F -->|No| G[Check database connection string, retry]\n    G --> E\n    F -->|Yes| H[Run 'npm run seed' to load test data]\n    H --> I[Run 'npm run dev' to start server]\n    I --> J{Server starts?}\n    J -->|No - port conflict| K[Change port in .env, restart]\n    K --> I\n    J -->|Yes| L[Open browser to localhost:3000 to verify]\n    L --> M{Page loads?}\n    M -->|Yes| N[Environment ready, commit .env.example (not .env)]\n    M -->|No| O[Troubleshoot further]",
    "expanded_text": "A developer sets up a new development environment by first installing Git and cloning the repository from GitHub. They then install Node.js and npm (Node Package Manager). Running 'npm install' downloads all project dependencies listed in package.json. Next, they create a .env file using a provided template, populating it with necessary API keys such as the database URL and secret key. They then set up the database by running database migrations with 'npm run migrate'. If migrations fail, they check the database connection string and retry the migration. After migrations succeed, they seed the database with test data using 'npm run seed'. They then start the development server with 'npm run dev'. If the server fails to start due to a port conflict, they change the port number in the .env file and restart the server. Once the server is running successfully, they open a web browser to localhost:3000 to verify that the application loads. If the page loads correctly, the development environment is ready for use. Finally, they commit the .env.example file (which contains placeholder values) to the repository for other developers, but ensure the actual .env file (containing real keys) is excluded via .gitignore.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches with retries", "database setup", "server configuration", "security best practice"]
    }
  },
  {
    "input_text": "A company conducts a quarterly employee performance review. The employee first completes a self-assessment, rating themselves on a scale of 1 to 5 in categories like teamwork, communication, and productivity. The employee submits the self-assessment to their manager. The manager then writes a manager assessment for the same employee, also rating the same categories. The system calculates the delta (difference) between self-rating and manager rating for each category. If the delta is 2 or more points in any category, the system flags a 'disagreement' and schedules a calibration meeting between the employee and manager. In the calibration meeting, they discuss the discrepancy and agree on a final rating. If no disagreements exist, the final rating is the average of self and manager ratings. The final rating determines the bonus percentage: 5 = 15% bonus, 4 = 10%, 3 = 5%, 2 or 1 = 0% bonus. The employee must acknowledge the final rating by signing off in the system within 7 days. If not signed off, the rating is auto-accepted.",
    "mermaid": "graph TD\n    A[Employee completes self-assessment (1-5 ratings)] --> B[Submit to manager]\n    B --> C[Manager completes manager assessment (1-5 ratings)]\n    C --> D[System calculates delta for each category]\n    D --> E{Any category delta >= 2?}\n    E -->|Yes| F[Flag disagreement, schedule calibration meeting]\n    F --> G[Employee and manager discuss, agree on final rating]\n    E -->|No| H[Final rating = average of self and manager ratings]\n    G --> I[Final rating determined]\n    H --> I\n    I --> J[Map rating to bonus: 5=15%, 4=10%, 3=5%, 2-1=0%]\n    J --> K{Employee signs off within 7 days?}\n    K -->|Yes| L[Rating confirmed, bonus processed]\n    K -->|No| M[Auto-accept rating after 7 days]",
    "expanded_text": "The quarterly employee performance review process begins with the employee completing a self-assessment, rating themselves on a scale of 1 to 5 in categories such as teamwork, communication, and productivity. The employee submits this self-assessment to their manager. The manager then writes a manager assessment for the same employee, also rating the same categories. The system calculates the delta (absolute difference) between the self-rating and manager rating for each category. If any category has a delta of 2 or more points, the system flags a 'disagreement' and automatically schedules a calibration meeting between the employee and manager. In that meeting, they discuss the discrepancy and mutually agree on a final rating. If no disagreements exist (all deltas are 0 or 1), the final rating is the average of the self and manager ratings, rounded according to company policy. The final rating determines the bonus percentage: a rating of 5 yields a 15% bonus, 4 yields 10%, 3 yields 5%, and ratings of 2 or 1 yield a 0% bonus. The employee must acknowledge and sign off on the final rating in the system within 7 days. If the employee does not sign off within that period, the rating is auto-accepted.",
    "metadata": {
      "domain": "HR workflows",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branch (disagreement)", "calibration meeting", "bonus mapping", "sign-off with auto-accept"]
    }
  },
  {
    "input_text": "A user tries to upload a profile picture to a social media site. They click 'Upload' and select an image file from their computer. The system checks that the file type is either JPEG, PNG, or GIF. If not, it shows an error: 'Unsupported file type'. If the type is supported, it checks that the file size is under 5 MB. If too large, it shows an error: 'File too large, max 5 MB'. If the size is acceptable, the system creates three versions of the image: original (preserved), thumbnail (100x100 pixels for profile icon), and medium (500x500 pixels for timeline posts). Each version is stored in a CDN. The URLs for all three versions are saved to the user's database record. The user's profile page immediately displays the new thumbnail. If the upload fails at any step (e.g., network error), the system retries up to 2 times. After 2 failures, it shows 'Upload failed, please try again later'.",
    "mermaid": "graph TD\n    A[User clicks Upload, selects image] --> B{File type JPEG, PNG, or GIF?}\n    B -->|No| C[Error: Unsupported file type]\n    B -->|Yes| D{File size < 5 MB?}\n    D -->|No| E[Error: File too large, max 5 MB]\n    D -->|Yes| F[Create original, thumbnail (100x100), medium (500x500)]\n    F --> G[Store all three versions in CDN]\n    G --> H[Save URLs to user database record]\n    H --> I[Update profile page with new thumbnail]\n    F --> J{Upload fails (network error)?}\n    J -->|Yes| K[Retry up to 2 times]\n    K --> L{Success after retry?}\n    L -->|Yes| H\n    L -->|No| M[Error: Upload failed, try again later]\n    J -->|No| I",
    "expanded_text": "A user uploads a profile picture to a social media site by clicking 'Upload' and selecting an image file from their computer. The system first checks whether the file type is JPEG, PNG, or GIF. If the type is not supported, an error message 'Unsupported file type' is shown. If the type is supported, the system checks that the file size is under 5 MB. If the file is too large, an error 'File too large, max 5 MB' is shown. If the size is acceptable, the system creates three versions of the image: the original (preserved as-is), a thumbnail cropped to 100x100 pixels for use as a profile icon, and a medium version at 500x500 pixels for timeline posts. Each version is stored in a content delivery network (CDN). The URLs for all three versions are saved to the user's database record. The user's profile page then immediately displays the new thumbnail. If any step of the upload process fails (e.g., due to a network error), the system retries the upload up to two times. After two failed retries, it shows 'Upload failed, please try again later'.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (file type, size)", "image processing", "retry logic", "CDN storage"]
    }
  },
  {
    "input_text": "A smart home lighting routine for movie night. The user says 'Movie night' to a voice assistant. The assistant checks if the TV is on. If not, it attempts to turn on the TV via HDMI-CEC. If the TV cannot be turned on, it asks the user to turn it on manually. Next, the assistant dims the living room lights to 10% brightness. If there are smart blinds, it closes them halfway. It then checks if any other lights are on in adjacent rooms (kitchen, hallway). If they are on, it prompts the user: 'Turn off kitchen lights?' If the user agrees, it turns them off; if not, leaves them as is. Finally, the assistant sets the AV receiver to surround sound mode and plays a preset playlist of movie trailers. If the user interrupts during the routine, the assistant cancels all pending actions and asks what they would like instead.",
    "mermaid": "graph TD\n    A[User says 'Movie night'] --> B{TV is on?}\n    B -->|Yes| C[Dim living room lights to 10%]\n    B -->|No| D[Attempt to turn on TV via HDMI-CEC]\n    D --> E{TV turns on?}\n    E -->|Yes| C\n    E -->|No| F[Ask user to turn on manually]\n    F --> C\n    C --> G[Close smart blinds halfway if present]\n    G --> H[Check kitchen/hallway lights status]\n    H --> I{Other lights on?}\n    I -->|Yes| J[Prompt: 'Turn off kitchen lights?']\n    J --> K{User agrees?}\n    K -->|Yes| L[Turn off kitchen/hallway lights]\n    K -->|No| M[Leave them as is]\n    I -->|No| M\n    L --> N[Set AV receiver to surround sound, play trailer playlist]\n    M --> N\n    A -.->|User interrupts| O[Cancel pending actions, ask what user wants]",
    "expanded_text": "A smart home lighting routine for movie night begins when the user says 'Movie night' to a voice assistant. The assistant first checks whether the TV is already on. If not, it attempts to turn on the TV via HDMI-CEC (Consumer Electronics Control). If the TV cannot be turned on remotely, the assistant asks the user to turn it on manually. Next, the assistant dims the living room lights to 10% brightness. If the home has smart blinds, it closes them halfway. The assistant then checks whether any lights are on in adjacent rooms, such as the kitchen or hallway. If lights are on, the assistant prompts the user: 'Turn off kitchen lights?' If the user agrees, it turns them off; if not, it leaves them as is. Finally, the assistant sets the AV receiver to surround sound mode and begins playing a preset playlist of movie trailers. If the user interrupts during the routine (e.g., by saying 'Stop' or giving another command), the assistant cancels all pending actions and asks what the user would like instead.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "device control (TV, lights, blinds)", "user confirmation prompt", "interruption handling"]
    }
  },
  {
    "input_text": "A retail store offers a return policy for store credit only (no cash refunds). A customer brings an item to the returns counter. The cashier scans the receipt. The system checks if the purchase date is within 30 days. If not, the return is rejected. If within 30 days, the cashier scans the item. The system checks if the item is in sellable condition (original packaging, no damage). If not sellable, the return is rejected. If sellable, the system issues store credit for the original purchase price. The credit is added to the customer's loyalty account as points (1 point = $1). The customer can use points for future purchases. The cashier gives the customer a printed receipt showing the new point balance. If the customer does not have a loyalty account, they must create one to receive store credit. The returned item is marked as 'returned' in inventory and placed in a clearance bin for repackaging.",
    "mermaid": "graph TD\n    A[Customer brings item to returns counter] --> B[Cashier scans receipt]\n    B --> C{Purchase date within 30 days?}\n    C -->|No| D[Reject return]\n    C -->|Yes| E[Cashier scans item]\n    E --> F{Item in sellable condition? (original packaging, no damage)}\n    F -->|No| D\n    F -->|Yes| G{Customer has loyalty account?}\n    G -->|No| H[Require account creation]\n    H --> I[Issue store credit as loyalty points (1 point = $1)]\n    G -->|Yes| I\n    I --> J[Print receipt with new point balance]\n    J --> K[Mark item as 'returned' in inventory, place in clearance bin]",
    "expanded_text": "A retail store offers a return policy that provides store credit only, not cash refunds. A customer brings an item to the returns counter, and the cashier scans the receipt. The system checks whether the purchase date is within 30 days; if not, the return is rejected. If the purchase is within the return window, the cashier scans the item. The system then checks whether the item is in sellable condition, meaning it has original packaging and no damage. If not sellable, the return is rejected. If sellable, the system checks whether the customer has a loyalty account. If the customer does not have an account, they must create one at that moment to receive store credit. Once an account exists (or is created), the system issues store credit equal to the original purchase price, which is added to the customer's loyalty account as points where one point equals one dollar. The cashier prints a receipt showing the customer's new point balance. The returned item is then marked as 'returned' in the inventory system and placed in a clearance bin for later repackaging or discount sale.",
    "metadata": {
      "domain": "business",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches (time window, condition, account status)", "store credit as points", "inventory update"]
    }
  },
  {
    "input_text": "The marketing team launches a new ad campaign every Monday. If the click-through rate is below 2%, they redesign the creatives and try again. If the CTR is above 2% but conversions are low, they optimize the landing page. Once both CTR and conversions are acceptable, the campaign budget is increased.",
    "mermaid": "flowchart TD\n    A[Launch Weekly Ad Campaign] --> B{CTR Above 2%?}\n    B -- No --> C[Redesign Ad Creatives]\n    C --> A\n    B -- Yes --> D{Conversions Acceptable?}\n    D -- No --> E[Optimize Landing Page]\n    E --> D\n    D -- Yes --> F[Increase Campaign Budget]",
    "expanded_text": "The process begins with the marketing team launching a weekly advertising campaign. Performance is measured using click-through rate. If the CTR is below the acceptable threshold of 2%, the ads are redesigned and relaunched in a retry loop. Once the CTR becomes acceptable, the team evaluates conversion performance. If conversions remain low, the landing page is optimized repeatedly until results improve. When both CTR and conversion metrics meet expectations, the campaign budget is scaled upward.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["branching", "retry loop", "business logic", "optimization workflow"]
    }
  },
  {
    "input_text": "Sarah texted her friend asking if they still wanted to go hiking. Her friend replied that it depended on the weather. If it rained, they would stay home and play board games instead. Otherwise, they planned to leave early in the morning and stop for coffee on the way.",
    "mermaid": "flowchart TD\n    A[Sarah Asks About Hiking Plans] --> B{Weather Good?}\n    B -- No --> C[Stay Home]\n    C --> D[Play Board Games]\n    B -- Yes --> E[Leave Early Morning]\n    E --> F[Stop for Coffee]\n    F --> G[Go Hiking]",
    "expanded_text": "Sarah initiates a conversation about hiking plans. The decision depends on weather conditions. If the weather is bad or rainy, the hiking trip is canceled and replaced with an indoor activity involving board games. If the weather is favorable, the friends wake up early, grab coffee during the trip, and proceed with the hike.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["conditional branching", "social interaction", "event chain"]
    }
  },
  {
    "input_text": "When a customer submits a password reset request, the authentication service generates a token and emails it to the user. If the token expires before being used, the user must request a new one. After entering a valid token, the user can set a new password. The system then invalidates all active sessions.",
    "mermaid": "flowchart TD\n    A[Customer Requests Password Reset] --> B[Generate Reset Token]\n    B --> C[Send Email to User]\n    C --> D[User Opens Reset Link]\n    D --> E{Token Valid?}\n    E -- No --> F[Request New Reset Token]\n    F --> B\n    E -- Yes --> G[Set New Password]\n    G --> H[Invalidate Active Sessions]",
    "expanded_text": "The workflow starts when a customer requests a password reset. The authentication system creates a temporary reset token and emails it to the customer. The user opens the reset link and the system validates the token. If the token has expired or is invalid, the user must restart the reset process. If the token is valid, the customer creates a new password and the system logs out all existing sessions to improve account security.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["authentication flow", "retry mechanism", "security workflow"]
    }
  },
  {
    "input_text": "A hospital triage nurse evaluates incoming patients. Critical patients are sent directly to emergency treatment. Non-critical patients wait for a doctor consultation. After consultation, some patients are discharged while others are admitted for further care.",
    "mermaid": "flowchart TD\n    A[Patient Arrives] --> B[Triage Assessment]\n    B --> C{Critical Condition?}\n    C -- Yes --> D[Emergency Treatment]\n    C -- No --> E[Wait for Doctor Consultation]\n    E --> F[Doctor Evaluation]\n    F --> G{Needs Admission?}\n    G -- Yes --> H[Admit Patient]\n    G -- No --> I[Discharge Patient]",
    "expanded_text": "The healthcare workflow begins when a patient arrives at the hospital. A triage nurse assesses the severity of the patient's condition. Critical patients bypass standard waiting procedures and receive immediate emergency treatment. Non-critical patients wait for a scheduled consultation with a doctor. After evaluation, the doctor determines whether the patient requires hospitalization or can safely return home.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["decision tree", "priority routing", "healthcare operations"]
    }
  },
  {
    "input_text": "The game server checks whether a player has completed the tutorial. New players are forced into tutorial mode. Returning players enter the main lobby immediately. During matchmaking, if no opponents are found within 30 seconds, the search range expands to other regions.",
    "mermaid": "flowchart TD\n    A[Player Connects to Game Server] --> B{Tutorial Completed?}\n    B -- No --> C[Enter Tutorial Mode]\n    C --> D[Complete Tutorial]\n    D --> E[Enter Main Lobby]\n    B -- Yes --> E\n    E --> F[Start Matchmaking]\n    F --> G{Opponent Found Within 30 Seconds?}\n    G -- No --> H[Expand Search to Other Regions]\n    H --> F\n    G -- Yes --> I[Start Match]",
    "expanded_text": "When a player joins the game server, the system checks whether they previously completed the tutorial. New users are routed into a mandatory tutorial experience before entering the main lobby. Existing players skip directly to the lobby. The matchmaking system then searches for opponents. If no suitable match is found within 30 seconds, the matchmaking criteria expand geographically to include players from other regions until a match becomes available.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["state progression", "retry loop", "multiplayer matchmaking"]
    }
  },
  {
    "input_text": "A startup founder emails investors with a pitch deck. Interested investors schedule meetings. After meetings, investors either decline, request more financial information, or move to due diligence. If due diligence succeeds, the investment round closes.",
    "mermaid": "flowchart TD\n    A[Founder Sends Pitch Deck] --> B{Investor Interested?}\n    B -- No --> C[Investor Declines]\n    B -- Yes --> D[Schedule Meeting]\n    D --> E{Post-Meeting Decision}\n    E -- Need More Info --> F[Request Financial Data]\n    F --> E\n    E -- Decline --> C\n    E -- Proceed --> G[Due Diligence]\n    G --> H{Due Diligence Successful?}\n    H -- No --> C\n    H -- Yes --> I[Close Investment Round]",
    "expanded_text": "The founder begins fundraising by sending investors a pitch deck. Investors who show interest arrange meetings with the founder. Following these discussions, investors may reject the opportunity, request additional financial documents, or continue into due diligence. The due diligence phase validates the startup’s financial and operational claims. If the review succeeds, the funding round is finalized.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["approval workflow", "decision branching", "business negotiation"]
    }
  },
  {
    "input_text": "A software deployment pipeline automatically runs tests after developers push code. If tests fail, the deployment stops and developers receive alerts. If tests pass, the application is deployed to staging. QA can approve the release for production or reject it for fixes.",
    "mermaid": "flowchart TD\n    A[Developer Pushes Code] --> B[Run Automated Tests]\n    B --> C{Tests Passed?}\n    C -- No --> D[Stop Deployment]\n    D --> E[Notify Developers]\n    C -- Yes --> F[Deploy to Staging]\n    F --> G[QA Review]\n    G --> H{Approve Production Release?}\n    H -- No --> I[Request Fixes]\n    I --> A\n    H -- Yes --> J[Deploy to Production]",
    "expanded_text": "The CI/CD pipeline begins when developers push new code changes. Automated tests validate functionality and stability. Failed tests halt deployment and trigger notifications to the development team. Successful builds are deployed into a staging environment for quality assurance review. QA testers then decide whether the release is production-ready. Rejected releases return to developers for corrections, while approved builds are deployed live.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["CI/CD pipeline", "approval system", "feedback loop", "deployment workflow"]
    }
  },
  {
    "input_text": "During online classes, students first watch prerecorded lectures. They then complete quizzes. If a student scores below 70%, the platform recommends review materials before allowing another attempt. Students who pass unlock the weekly assignment.",
    "mermaid": "flowchart TD\n    A[Student Watches Lecture] --> B[Complete Quiz]\n    B --> C{Score Above 70%?}\n    C -- No --> D[Recommend Review Materials]\n    D --> E[Retry Quiz]\n    E --> C\n    C -- Yes --> F[Unlock Weekly Assignment]",
    "expanded_text": "Students begin the learning process by watching prerecorded instructional videos. Afterward, they complete an assessment quiz. Students who fail to achieve the minimum passing score are directed toward supplemental review content before retaking the quiz. Once students pass the assessment, they gain access to the next assignment module.",
    "metadata": {
      "domain": "education",
      "complexity": "simple",
      "graph_features": ["learning loop", "conditional access", "retry mechanism"]
    }
  },
  {
    "input_text": "A warehouse receives shipments from suppliers every morning. Items are scanned and checked for damage. Damaged inventory is reported back to suppliers and moved into a return zone. Approved inventory is categorized and distributed to storage shelves. When stock levels drop too low, the purchasing system automatically creates replenishment orders.",
    "mermaid": "flowchart TD\n    A[Receive Supplier Shipment] --> B[Scan Inventory]\n    B --> C{Items Damaged?}\n    C -- Yes --> D[Report Damage to Supplier]\n    D --> E[Move to Return Zone]\n    C -- No --> F[Categorize Inventory]\n    F --> G[Store on Warehouse Shelves]\n    G --> H{Stock Levels Low?}\n    H -- Yes --> I[Generate Replenishment Order]\n    H -- No --> J[Continue Monitoring Inventory]",
    "expanded_text": "The logistics process starts when supplier shipments arrive at the warehouse. Inventory is scanned and inspected for damage. Damaged products are documented and separated into a designated return area for supplier resolution. Valid inventory is categorized and stored appropriately. Inventory levels are continuously monitored, and when stock falls below a threshold, the purchasing system automatically creates new replenishment orders.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["inventory management", "conditional routing", "automation workflow"]
    }
  },
  {
    "input_text": "Emma noticed her coworker becoming unusually quiet during meetings and missing deadlines. She asked if everything was okay. Her coworker admitted feeling overwhelmed because of overlapping projects. Emma suggested delegating some tasks and speaking with their manager. After discussing workload adjustments with management, the coworker slowly regained confidence and productivity improved.",
    "mermaid": "flowchart TD\n    A[Emma Notices Behavioral Changes] --> B[Ask Coworker if Everything is Okay]\n    B --> C[Coworker Shares Feeling Overwhelmed]\n    C --> D[Suggest Delegating Tasks]\n    D --> E[Speak with Manager]\n    E --> F[Adjust Workload]\n    F --> G[Confidence Improves]\n    G --> H[Productivity Recovers]",
    "expanded_text": "Emma observes emotional and behavioral warning signs from her coworker, including silence during meetings and declining performance. She initiates a supportive conversation, uncovering that excessive workload and overlapping responsibilities are causing stress. Emma recommends practical solutions such as delegation and manager involvement. Following management intervention and workload balancing, the coworker gradually regains emotional stability and work performance improves.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["causal chain", "emotional context", "support workflow", "workplace relationships"]
    }
  },
  {
    "input_text": "A customer contacts technical support because their smart thermostat keeps disconnecting from Wi-Fi. The support agent first checks whether the router is online. If the router works normally, the agent asks the customer to restart the thermostat. If the issue still happens after restarting, a firmware update is pushed remotely. Devices that continue failing are escalated to hardware replacement.",
    "mermaid": "flowchart TD\n    A[Customer Reports Thermostat Disconnecting] --> B[Check Router Status]\n    B --> C{Router Online?}\n    C -- No --> D[Resolve Router Connectivity]\n    D --> E[Test Thermostat Again]\n    C -- Yes --> F[Restart Thermostat]\n    F --> G{Issue Resolved?}\n    G -- Yes --> H[Close Support Ticket]\n    G -- No --> I[Push Firmware Update]\n    I --> J{Issue Still Occurring?}\n    J -- No --> H\n    J -- Yes --> K[Escalate to Hardware Replacement]",
    "expanded_text": "The support workflow begins when a customer reports connectivity problems with a smart thermostat. The support agent verifies whether the customer’s router is functioning correctly. If the router is offline, connectivity issues are resolved before retesting the thermostat. If the router is working normally, the thermostat is restarted. Persistent issues trigger a remote firmware update. Devices that still fail after software fixes are escalated for hardware replacement.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["troubleshooting workflow", "conditional branching", "technical escalation"]
    }
  },
  {
    "input_text": "The legal department reviews every new vendor contract. Contracts below $10,000 are approved automatically. Contracts above that amount require manager approval. If the agreement contains unusual clauses, the legal team requests revisions before final approval.",
    "mermaid": "flowchart TD\n    A[Receive Vendor Contract] --> B{Contract Value Below $10,000?}\n    B -- Yes --> C[Automatic Approval]\n    B -- No --> D[Manager Review]\n    D --> E{Contains Unusual Clauses?}\n    E -- Yes --> F[Request Contract Revisions]\n    F --> D\n    E -- No --> G[Final Legal Approval]",
    "expanded_text": "The legal review process starts when a vendor contract is submitted. Low-value contracts under $10,000 move through automatic approval to reduce administrative overhead. Higher-value agreements require managerial review. During evaluation, the legal department checks for risky or unusual clauses. Contracts containing problematic terms are returned for revision and re-evaluated until acceptable. Once compliance and risk standards are satisfied, final approval is granted.",
    "metadata": {
      "domain": "legal",
      "complexity": "medium",
      "graph_features": ["approval system", "compliance review", "revision loop"]
    }
  },
  {
    "input_text": "A machine learning platform collects user interaction data daily. The data is cleaned and labeled before training begins. If model accuracy falls below the target benchmark, engineers tune hyperparameters and retrain the model. Once the model passes evaluation, it is deployed into production monitoring.",
    "mermaid": "flowchart TD\n    A[Collect User Interaction Data] --> B[Clean and Label Data]\n    B --> C[Train ML Model]\n    C --> D{Accuracy Meets Benchmark?}\n    D -- No --> E[Tune Hyperparameters]\n    E --> C\n    D -- Yes --> F[Deploy Model to Production]\n    F --> G[Monitor Model Performance]",
    "expanded_text": "The AI workflow starts with collecting user interaction data. The data undergoes preprocessing and labeling to prepare it for machine learning training. After training, model performance is evaluated against a target accuracy benchmark. Models failing to meet the requirement enter an optimization cycle where engineers adjust hyperparameters and retrain. Successful models are deployed into production and continuously monitored for performance drift.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["machine learning lifecycle", "feedback loop", "model deployment"]
    }
  },
  {
    "input_text": "Every morning, Jake checks his calendar before work. If he has meetings before noon, he skips the gym and starts work earlier. Otherwise, he exercises first and grabs breakfast afterward before logging in.",
    "mermaid": "flowchart TD\n    A[Check Morning Calendar] --> B{Meetings Before Noon?}\n    B -- Yes --> C[Skip Gym]\n    C --> D[Start Work Early]\n    B -- No --> E[Go to Gym]\n    E --> F[Grab Breakfast]\n    F --> G[Log Into Work]",
    "expanded_text": "Jake begins his morning by reviewing his schedule. If early meetings are scheduled, he prioritizes work responsibilities and skips his workout routine. On less busy mornings, he exercises first, eats breakfast afterward, and then starts work. His daily routine dynamically changes based on calendar obligations.",
    "metadata": {
      "domain": "productivity",
      "complexity": "simple",
      "graph_features": ["daily routine", "conditional planning", "personal workflow"]
    }
  },
  {
    "input_text": "An e-commerce platform monitors payment transactions for fraud. Transactions from trusted customers are approved instantly. Suspicious transactions are analyzed by a fraud detection engine. High-risk transactions are blocked, while medium-risk cases are sent for manual review.",
    "mermaid": "flowchart TD\n    A[Customer Submits Payment] --> B{Trusted Customer?}\n    B -- Yes --> C[Approve Transaction]\n    B -- No --> D[Run Fraud Analysis]\n    D --> E{Risk Level}\n    E -- High --> F[Block Transaction]\n    E -- Medium --> G[Manual Review]\n    E -- Low --> C",
    "expanded_text": "The payment security workflow begins when a customer submits a transaction. Trusted users with established histories are approved immediately for efficiency. Transactions from unknown or suspicious accounts undergo fraud analysis. High-risk payments are blocked automatically to prevent fraud. Medium-risk transactions require manual investigation, while low-risk cases proceed normally.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["risk analysis", "decision branching", "security workflow"]
    }
  },
  {
    "input_text": "During a chemistry experiment, researchers heat a solution gradually while monitoring color changes. If the mixture turns blue, a catalyst is added. If the temperature exceeds safety thresholds, the heating process is stopped immediately. Once the reaction stabilizes, samples are collected for analysis.",
    "mermaid": "flowchart TD\n    A[Heat Chemical Solution] --> B[Monitor Reaction]\n    B --> C{Mixture Turns Blue?}\n    C -- Yes --> D[Add Catalyst]\n    D --> E[Continue Monitoring]\n    C -- No --> E\n    E --> F{Temperature Safe?}\n    F -- No --> G[Stop Heating Immediately]\n    F -- Yes --> H{Reaction Stabilized?}\n    H -- No --> E\n    H -- Yes --> I[Collect Samples for Analysis]",
    "expanded_text": "Researchers begin the experiment by heating a chemical solution under controlled conditions. Throughout the process, they monitor both temperature and visual changes in the reaction. A blue color indicates the need for catalyst intervention. Safety protocols require immediate shutdown if temperatures exceed acceptable limits. Once the reaction becomes stable, researchers collect samples for scientific analysis.",
    "metadata": {
      "domain": "science",
      "complexity": "high",
      "graph_features": ["monitoring loop", "safety conditions", "experimental workflow"]
    }
  },
  {
    "input_text": "The HR onboarding process starts after a candidate signs the offer letter. IT prepares accounts and devices while HR schedules orientation sessions. Managers assign training tasks during the employee’s first week. If mandatory compliance training is incomplete, system access remains limited.",
    "mermaid": "flowchart TD\n    A[Candidate Signs Offer Letter] --> B[Start Onboarding]\n    B --> C[IT Prepares Accounts and Devices]\n    B --> D[HR Schedules Orientation]\n    C --> E[Employee Starts First Week]\n    D --> E\n    E --> F[Manager Assigns Training Tasks]\n    F --> G{Compliance Training Completed?}\n    G -- No --> H[Restrict System Access]\n    G -- Yes --> I[Grant Full Access]",
    "expanded_text": "The onboarding workflow begins after a candidate formally accepts an offer. Multiple departments work in parallel, with IT preparing devices and credentials while HR organizes orientation activities. Managers then assign initial training responsibilities. Employees who fail to complete mandatory compliance courses retain restricted access privileges until all requirements are satisfied.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["parallel tasks", "access control", "employee onboarding"]
    }
  },
  {
    "input_text": "A food delivery driver accepts an order through the app. The restaurant prepares the meal while the driver navigates to the pickup location. If the restaurant is delayed, the customer automatically receives a notification. After pickup, the driver delivers the order and the customer leaves a rating.",
    "mermaid": "flowchart TD\n    A[Driver Accepts Delivery Order] --> B[Restaurant Prepares Meal]\n    A --> C[Driver Travels to Restaurant]\n    B --> D{Restaurant Delayed?}\n    D -- Yes --> E[Notify Customer About Delay]\n    D -- No --> F[Meal Ready for Pickup]\n    E --> F\n    C --> F\n    F --> G[Driver Picks Up Order]\n    G --> H[Deliver Order to Customer]\n    H --> I[Customer Leaves Rating]",
    "expanded_text": "The delivery process starts when a driver accepts an order through the platform. The restaurant prepares the food while the driver heads toward the pickup location simultaneously. If preparation takes longer than expected, the system proactively notifies the customer. Once the order is ready, the driver collects it, completes the delivery, and the customer provides feedback through ratings.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["parallel workflows", "real-time notifications", "delivery process"]
    }
  },
  {
    "input_text": "A cybersecurity monitoring system detects unusual login behavior from an employee account. The system checks whether the login location matches previous patterns. If the login appears suspicious, multi-factor authentication is triggered. Repeated failed verification attempts temporarily lock the account and alert the security team.",
    "mermaid": "flowchart TD\n    A[Detect Unusual Login Activity] --> B[Analyze Login Pattern]\n    B --> C{Location Matches Previous Behavior?}\n    C -- Yes --> D[Allow Login]\n    C -- No --> E[Trigger Multi-Factor Authentication]\n    E --> F{Verification Successful?}\n    F -- Yes --> D\n    F -- No --> G{Repeated Failures?}\n    G -- No --> E\n    G -- Yes --> H[Lock Account Temporarily]\n    H --> I[Alert Security Team]",
    "expanded_text": "The cybersecurity system monitors account activity for anomalies. When suspicious login behavior is detected, the system compares the login location against historical user patterns. Unrecognized locations trigger multi-factor authentication. Users who repeatedly fail verification attempts cause the system to temporarily lock the account and notify security personnel about the potential threat.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["security escalation", "authentication loop", "threat detection"]
    }
  },
  {
    "input_text": "A university research group applies for grant funding. The proposal is reviewed internally before submission. Funding agencies evaluate scientific impact, feasibility, and budget justification. Rejected proposals are revised and resubmitted during the next funding cycle. Approved projects receive funding and begin experiments.",
    "mermaid": "flowchart TD\n    A[Research Team Drafts Proposal] --> B[Internal University Review]\n    B --> C[Submit to Funding Agency]\n    C --> D[Evaluate Scientific Impact]\n    D --> E[Evaluate Feasibility]\n    E --> F[Evaluate Budget Justification]\n    F --> G{Proposal Approved?}\n    G -- No --> H[Revise Proposal]\n    H --> C\n    G -- Yes --> I[Receive Grant Funding]\n    I --> J[Begin Research Experiments]",
    "expanded_text": "The academic funding process starts when a research group prepares a grant proposal. Universities often conduct internal reviews before external submission. Funding agencies assess the proposal across multiple dimensions, including scientific value, practical feasibility, and budget credibility. Rejected applications are revised and resubmitted in future cycles. Successful proposals secure funding that enables the research project to begin experimental work.",
    "metadata": {
      "domain": "education",
      "complexity": "high",
      "graph_features": ["multi-stage evaluation", "approval workflow", "resubmission loop"]
    }
  },
  {
    "input_text": "The factory quality control system inspects every product coming off the assembly line. Items with cosmetic defects are sent for repackaging, while products with functional failures are discarded. Approved products are packaged and shipped to distributors.",
    "mermaid": "flowchart TD\n    A[Product Leaves Assembly Line] --> B[Quality Inspection]\n    B --> C{Defect Detected?}\n    C -- Cosmetic --> D[Send for Repackaging]\n    D --> E[Reinspect Product]\n    E --> B\n    C -- Functional --> F[Discard Product]\n    C -- None --> G[Package Product]\n    G --> H[Ship to Distributors]",
    "expanded_text": "The manufacturing workflow begins when finished products leave the assembly line for inspection. Products with cosmetic defects are redirected for repackaging and reinspection. Items with serious functional problems are removed from circulation entirely. Products that pass inspection are packaged and shipped to distributors for retail delivery.",
    "metadata": {
      "domain": "manufacturing",
      "complexity": "medium",
      "graph_features": ["quality control", "inspection loop", "conditional routing"]
    }
  },
  {
    "input_text": "A student preparing for final exams creates a study plan every Sunday. Difficult subjects receive extra study sessions. If practice test scores remain low, the student asks classmates for help and revisits weak topics before retaking another practice exam.",
    "mermaid": "flowchart TD\n    A[Create Weekly Study Plan] --> B[Study Subjects]\n    B --> C[Take Practice Exam]\n    C --> D{Score Acceptable?}\n    D -- No --> E[Ask Classmates for Help]\n    E --> F[Review Weak Topics]\n    F --> C\n    D -- Yes --> G[Continue Exam Preparation]",
    "expanded_text": "The student organizes exam preparation through a weekly study plan. Practice exams are used to measure understanding. Low scores trigger additional learning activities, including peer assistance and focused review sessions. This feedback loop continues until performance improves sufficiently for the student to feel prepared.",
    "metadata": {
      "domain": "education",
      "complexity": "simple",
      "graph_features": ["feedback loop", "learning workflow", "performance evaluation"]
    }
  },
  {
    "input_text": "A cloud infrastructure platform automatically scales server resources based on traffic levels. When CPU usage exceeds 80%, additional instances are launched. If traffic decreases for an extended period, unused instances are terminated to reduce costs.",
    "mermaid": "flowchart TD\n    A[Monitor Application Traffic] --> B{CPU Usage Above 80%?}\n    B -- Yes --> C[Launch Additional Server Instances]\n    C --> D[Distribute Traffic Load]\n    B -- No --> E{Traffic Low for Extended Period?}\n    E -- Yes --> F[Terminate Unused Instances]\n    E -- No --> A\n    F --> A\n    D --> A",
    "expanded_text": "The cloud platform continuously monitors system traffic and CPU usage. High traffic conditions trigger automatic scaling by launching additional server instances to maintain performance. When traffic drops for long periods, the platform reduces infrastructure costs by shutting down unnecessary instances. The system continuously reevaluates traffic conditions in a monitoring loop.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["auto-scaling", "monitoring loop", "resource optimization"]
    }
  },
  {
    "input_text": "After posting a video online, a content creator monitors audience engagement. Videos with high watch time are promoted through paid ads. Videos with low engagement are analyzed to identify weak thumbnails, titles, or pacing issues before future uploads.",
    "mermaid": "flowchart TD\n    A[Upload Video Content] --> B[Monitor Audience Engagement]\n    B --> C{High Watch Time?}\n    C -- Yes --> D[Promote Video with Ads]\n    C -- No --> E[Analyze Thumbnail]\n    E --> F[Analyze Title]\n    F --> G[Analyze Video Pacing]\n    G --> H[Improve Future Uploads]",
    "expanded_text": "The creator publishes video content and evaluates audience engagement metrics such as watch time. Successful videos receive additional advertising investment to increase reach. Underperforming videos trigger analysis of presentation factors including thumbnails, titles, and pacing. Insights from this analysis are used to improve future content strategy.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["performance analysis", "content optimization", "causal evaluation"]
    }
  },
  {
    "input_text": "An airline passenger checks in online before departure. If baggage needs to be dropped off, the passenger visits a counter at the airport. Security screening is required before boarding. Delayed flights automatically trigger notification emails and gate updates.",
    "mermaid": "flowchart TD\n    A[Passenger Checks In Online] --> B{Checked Baggage?}\n    B -- Yes --> C[Visit Baggage Drop Counter]\n    B -- No --> D[Proceed to Security]\n    C --> D\n    D --> E[Security Screening]\n    E --> F{Flight Delayed?}\n    F -- Yes --> G[Send Delay Notifications]\n    G --> H[Update Boarding Gate Information]\n    F -- No --> I[Board Aircraft]\n    H --> I",
    "expanded_text": "The travel process begins with online check-in before arrival at the airport. Passengers carrying checked baggage must visit a baggage counter before heading to security screening. Flight delays trigger automatic communication systems that notify passengers and update gate information. Once all procedures are completed, passengers board the aircraft.",
    "metadata": {
      "domain": "transportation",
      "complexity": "medium",
      "graph_features": ["travel workflow", "conditional routing", "notification system"]
    }
  },
  {
    "input_text": "A therapist encourages a patient to track stress levels daily. When stress spikes occur, the patient practices breathing exercises and reduces social media usage. Over time, recurring triggers are identified and discussed during therapy sessions.",
    "mermaid": "flowchart TD\n    A[Track Daily Stress Levels] --> B{Stress Spike Detected?}\n    B -- No --> C[Continue Daily Monitoring]\n    B -- Yes --> D[Practice Breathing Exercises]\n    D --> E[Reduce Social Media Usage]\n    E --> F[Identify Recurring Triggers]\n    F --> G[Discuss Triggers During Therapy]\n    G --> A",
    "expanded_text": "The emotional wellness process involves daily monitoring of stress levels. When stress increases significantly, the patient responds with coping strategies such as breathing exercises and reduced social media exposure. Patterns and triggers are gradually identified and explored in therapy sessions, creating a continuous feedback loop for emotional management.",
    "metadata": {
      "domain": "mental wellness",
      "complexity": "medium",
      "graph_features": ["behavioral feedback loop", "emotional monitoring", "coping strategies"]
    }
  },
  {
    "input_text": "A cryptocurrency exchange verifies identity documents before allowing large withdrawals. Users with incomplete verification can continue trading but face withdrawal limits. Suspicious accounts are frozen and escalated to compliance investigators.",
    "mermaid": "flowchart TD\n    A[User Requests Large Withdrawal] --> B[Verify Identity Documents]\n    B --> C{Verification Complete?}\n    C -- No --> D[Apply Withdrawal Limits]\n    D --> E[Allow Limited Trading]\n    C -- Yes --> F{Suspicious Activity Detected?}\n    F -- Yes --> G[Freeze Account]\n    G --> H[Escalate to Compliance Team]\n    F -- No --> I[Approve Withdrawal]",
    "expanded_text": "The exchange begins by validating identity documentation when users request large withdrawals. Accounts lacking sufficient verification remain operational but face withdrawal restrictions. Additional fraud monitoring checks for suspicious activity. Accounts flagged for potential misconduct are frozen and escalated to compliance investigators for further review.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["compliance workflow", "fraud prevention", "conditional access"]
    }
  },
  {
    "input_text": "A smart home system automatically adjusts room temperature throughout the day. In the morning, heating increases gradually before residents wake up. If nobody is detected at home, energy-saving mode activates. Evening routines dim the lights and lock the doors automatically.",
    "mermaid": "flowchart TD\n    A[Start Daily Smart Home Routine] --> B[Increase Morning Heating]\n    B --> C{Anyone Home?}\n    C -- No --> D[Activate Energy-Saving Mode]\n    C -- Yes --> E[Maintain Comfort Settings]\n    D --> F[Monitor Occupancy]\n    E --> F\n    F --> G[Start Evening Routine]\n    G --> H[Dim Lights]\n    H --> I[Lock Doors Automatically]",
    "expanded_text": "The smart home system automates household comfort and security throughout the day. Heating increases before residents wake up to improve comfort. Occupancy sensors determine whether the system should activate energy-saving mode or maintain normal settings. During the evening routine, lights are dimmed and doors are locked automatically for convenience and safety.",
    "metadata": {
      "domain": "IoT",
      "complexity": "medium",
      "graph_features": ["automation workflow", "sensor-based conditions", "daily routine"]
    }
  },
  {
    "input_text": "A publishing company reviews manuscript submissions from authors. Editors reject incomplete submissions immediately. Promising manuscripts are sent to peer reviewers. If reviewers request revisions, authors update the manuscript and resubmit it before publication approval.",
    "mermaid": "flowchart TD\n    A[Author Submits Manuscript] --> B{Submission Complete?}\n    B -- No --> C[Reject Submission]\n    B -- Yes --> D[Send to Peer Reviewers]\n    D --> E{Revisions Requested?}\n    E -- Yes --> F[Author Revises Manuscript]\n    F --> D\n    E -- No --> G[Approve for Publication]",
    "expanded_text": "The publishing process starts with manuscript submission from authors. Incomplete submissions are rejected early to save editorial resources. Complete manuscripts enter peer review, where reviewers evaluate quality and accuracy. Requested revisions create an iterative improvement cycle between reviewers and authors. Accepted manuscripts proceed toward publication.",
    "metadata": {
      "domain": "publishing",
      "complexity": "medium",
      "graph_features": ["review cycle", "approval workflow", "revision loop"]
    }
  },
  {
    "input_text": "A robotics warehouse system uses autonomous robots to retrieve products for packaging. If a robot detects an obstacle, it reroutes automatically. Low battery levels trigger charging mode before tasks resume. Packed orders are sent to outbound shipping stations.",
    "mermaid": "flowchart TD\n    A[Receive Product Retrieval Task] --> B[Robot Navigates Warehouse]\n    B --> C{Obstacle Detected?}\n    C -- Yes --> D[Reroute Robot Path]\n    D --> B\n    C -- No --> E{Battery Level Low?}\n    E -- Yes --> F[Enter Charging Mode]\n    F --> B\n    E -- No --> G[Retrieve Product]\n    G --> H[Send Item for Packaging]\n    H --> I[Transfer to Shipping Station]",
    "expanded_text": "The robotics system begins when a warehouse task is assigned to an autonomous robot. The robot navigates toward inventory locations while continuously monitoring obstacles and battery levels. Obstacles trigger automatic rerouting, while low power initiates charging behavior before operations resume. Retrieved products move through packaging and eventually toward outbound shipping.",
    "metadata": {
      "domain": "robotics",
      "complexity": "high",
      "graph_features": ["autonomous navigation", "retry loops", "resource monitoring", "logistics automation"]
    }
  },
  {
    "input_text": "A user wants to track their daily water intake using a fitness app. They open the app and tap 'Log Water'. They enter the number of ounces they drank. The app adds this amount to today's total. If the total reaches or exceeds the daily goal of 64 ounces, the app shows a congratulatory message and sends a push notification. If the user logs more than 100 ounces in a day, the app displays a warning about overhydration. The user can also set reminders: every hour from 9 AM to 5 PM, the app sends a notification asking 'Have you had water?'. The user can enable or disable reminders in settings. At midnight each day, the total resets to zero, and the previous day's total is saved to a history graph.",
    "mermaid": "graph TD\n    A[Open app, tap 'Log Water'] --> B[Enter number of ounces]\n    B --> C[Add to today's total]\n    C --> D{Total >= 64 oz?}\n    D -->|Yes| E[Show congratulatory message, send push notification]\n    D -->|No| F{Total > 100 oz?}\n    F -->|Yes| G[Show overhydration warning]\n    F -->|No| H[Continue]\n    E --> H\n    G --> H\n    H --> I[Reminders enabled in settings?]\n    I -->|Yes| J[Send reminder every hour 9am-5pm: 'Have you had water?']\n    I -->|No| K[No reminders]\n    J --> L[At midnight: reset total to zero, save previous day to history]\n    K --> L",
    "expanded_text": "A user tracks their daily water intake using a fitness app. They open the app and tap 'Log Water', then enter the number of ounces they drank. The app adds this amount to today's cumulative total. If the total reaches or exceeds the daily goal of 64 ounces, the app shows a congratulatory message and sends a push notification. If the user logs more than 100 ounces in a single day, the app displays a warning about the risks of overhydration. The user can optionally set reminders in the app's settings: when enabled, the app sends a push notification every hour from 9 AM to 5 PM asking 'Have you had water?'. At midnight each day, the daily total resets to zero, and the previous day's total is saved to a historical graph so the user can track their intake over time.",
    "metadata": {
      "domain": "daily life",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches (goal thresholds)", "recurring reminders", "midnight reset"]
    }
  },
  {
    "input_text": "A company wants to migrate its on-premise database to the cloud. First, the DBA takes a full backup of the on-premise database. The backup file is compressed and encrypted. The DBA then uploads the backup to an S3 bucket using the AWS CLI. If the upload fails due to network issues, the DBA retries up to 5 times with exponential backoff. After a successful upload, the DBA restores the backup to an RDS instance in the cloud. The DBA runs a verification query to compare row counts between on-premise and cloud. If counts match, the DBA updates the application's database connection string to point to the cloud database. If counts do not match, the DBA investigates discrepancies and repeats the process from the backup step. Once the connection string is updated, the DBA monitors the application for 24 hours for errors. If no errors occur, the migration is marked complete and the on-premise database is decommissioned after 30 days.",
    "mermaid": "graph TD\n    A[Take full backup of on-premise DB] --> B[Compress and encrypt backup file]\n    B --> C[Upload to S3 bucket using AWS CLI]\n    C --> D{Upload succeeds?}\n    D -->|No| E[Retry with exponential backoff, up to 5 times]\n    E --> F{Success after retries?}\n    F -->|Yes| G[Restore backup to RDS instance]\n    F -->|No| H[Manual intervention required]\n    D -->|Yes| G\n    G --> I[Run verification query: compare row counts]\n    I --> J{Row counts match?}\n    J -->|No| K[Investigate discrepancies]\n    K --> A\n    J -->|Yes| L[Update app connection string to point to cloud DB]\n    L --> M[Monitor application for 24 hours for errors]\n    M --> N{Errors detected?}\n    N -->|Yes| O[Roll back to on-premise DB]\n    O --> A\n    N -->|No| P[Mark migration complete, decommission on-premise after 30 days]",
    "expanded_text": "A company migrates its on-premise database to the cloud. The DBA first takes a full backup of the on-premise database, then compresses and encrypts the backup file. The DBA uploads the backup to an S3 bucket using the AWS CLI. If the upload fails due to network issues, the DBA retries up to five times with exponential backoff (waiting longer between each retry). After a successful upload, the DBA restores the backup to an RDS instance in the cloud. The DBA then runs a verification query to compare row counts between the on-premise and cloud databases. If the row counts do not match, the DBA investigates the discrepancies and repeats the entire process from the backup step. If the counts match, the DBA updates the application's database connection string to point to the cloud database. The DBA then monitors the application for 24 hours for any errors. If errors are detected, the DBA rolls back to the on-premise database and starts over. If no errors occur, the migration is marked as complete, and the on-premise database is decommissioned after 30 days.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "high",
      "graph_features": ["sequential flows", "conditional branches", "retry with backoff", "verification step", "rollback capability", "decommission delay"]
    }
  },
  {
    "input_text": "A marketing team launches a referral program. An existing user gets a unique referral link. When a new user signs up using that link, the system checks if the new user's email domain matches the referrer's domain. If they work at the same company, the referrer gets 2x points (20 points instead of 10). If the new user makes a purchase within 30 days, the referrer gets an additional 50 points. Points can be redeemed for discounts: 100 points = $10 off. The referrer can also see a leaderboard showing top referrers. At the end of each month, the top 3 referrers receive a bonus: 1st place 500 points, 2nd place 300 points, 3rd place 100 points. If a referred user requests a refund, the referrer's points for that referral are revoked.",
    "mermaid": "graph TD\n    A[Existing user gets unique referral link] --> B[New user signs up using link]\n    B --> C{New user's email domain matches referrer's domain?}\n    C -->|Yes| D[Referrer gets 20 points (2x)]\n    C -->|No| E[Referrer gets 10 points]\n    D --> F{New user makes purchase within 30 days?}\n    E --> F\n    F -->|Yes| G[Referrer gets additional 50 points]\n    F -->|No| H[No bonus points]\n    G --> I[Points can be redeemed: 100 points = $10 off]\n    H --> I\n    I --> J[Leaderboard shows top referrers]\n    J --> K[End of month: top 3 get bonus: 1st=500, 2nd=300, 3rd=100]\n    K --> L{Referred user requests refund?}\n    L -->|Yes| M[Revoke referrer's points for that referral]\n    L -->|No| N[Points remain]",
    "expanded_text": "A marketing team launches a referral program. An existing user receives a unique referral link to share. When a new user signs up using that link, the system checks whether the new user's email domain matches the referrer's email domain. If they work at the same company, the referrer receives double points (20 points instead of the standard 10). If the new user makes a purchase within 30 days of signing up, the referrer receives an additional 50 points. Accumulated points can be redeemed for discounts at a rate of 100 points for $10 off. The program includes a leaderboard that displays the top referrers. At the end of each month, the top three referrers receive bonus points: 1st place gets 500 points, 2nd gets 300, and 3rd gets 100. However, if a referred user later requests a refund for their purchase, the referrer's points for that referral are revoked (the initial 10/20 points and the 50 purchase bonus are deducted).",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["conditional branches (domain match, purchase within window)", "points system", "leaderboard", "monthly bonus", "refund revocation"]
    }
  },
  {
    "input_text": "A logistics company tracks a package from pickup to delivery. The driver scans the package at pickup, and the status becomes 'In Transit'. The package is taken to a regional sorting facility. At the facility, a conveyor belt system scans the package automatically. If the scan fails (e.g., barcode unreadable), a worker manually enters the tracking number. The system then decides the next destination based on the package's ZIP code. If the destination is within 100 miles, the package is loaded onto a local delivery truck. If farther, it is loaded onto a long-haul trailer. When the package arrives at the destination facility, it is scanned again and status becomes 'Out for Delivery'. The driver scans it upon delivery, status becomes 'Delivered'. If the delivery fails (customer not home), the driver leaves a notice and the package is taken back to the facility. A second delivery attempt is made the next day. After 3 failed attempts, the package is returned to sender.",
    "mermaid": "graph TD\n    A[Driver scans at pickup] --> B[Status: In Transit]\n    B --> C[Package arrives at regional sorting facility]\n    C --> D{Conveyor scan succeeds?}\n    D -->|No| E[Worker manually enters tracking number]\n    D -->|Yes| F[System reads barcode]\n    E --> F\n    F --> G{Destination within 100 miles?}\n    G -->|Yes| H[Load onto local delivery truck]\n    G -->|No| I[Load onto long-haul trailer]\n    H --> J[Package arrives at destination facility, scan: Out for Delivery]\n    I --> J\n    J --> K[Driver scans at delivery]\n    K --> L{Delivery successful?}\n    L -->|Yes| M[Status: Delivered]\n    L -->|No| N[Leave notice, return to facility, attempt +1]\n    N --> O{Attempts < 3?}\n    O -->|Yes| K\n    O -->|No| P[Return to sender]",
    "expanded_text": "A logistics company tracks a package from pickup to delivery. The driver scans the package at pickup, setting the status to 'In Transit'. The package is then taken to a regional sorting facility. At the facility, an automated conveyor belt system scans the package. If the scan fails (e.g., due to an unreadable or damaged barcode), a worker manually enters the tracking number. The system then determines the next destination based on the package's ZIP code. If the destination is within 100 miles, the package is loaded onto a local delivery truck. If it is farther away, it is loaded onto a long-haul trailer. When the package arrives at the destination facility, it is scanned again and the status changes to 'Out for Delivery'. The driver scans the package upon attempted delivery. If delivery is successful, the status becomes 'Delivered'. If the delivery fails (e.g., the customer is not home), the driver leaves a notice, and the package is taken back to the facility. A second delivery attempt is made the next day. If after three failed attempts the package still has not been delivered, it is returned to the sender.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (scan failure, distance)", "delivery retry loop", "return to sender after max attempts"]
    }
  },
  {
    "input_text": "A user wants to build a custom PC. They use a compatibility checker tool. First, they select a CPU. The tool then filters compatible motherboards by socket type (e.g., LGA1700) and chipset. Next, they select a motherboard. The tool checks if the motherboard has enough RAM slots for the selected RAM kit. If not, it shows a warning. Then they select RAM. The tool checks if the RAM type (DDR4 vs DDR5) matches the motherboard. If not, it blocks selection. They then select a GPU. The tool calculates the total power draw of all components. If the total exceeds the PSU's wattage, it shows a warning and recommends a higher-wattage PSU. Finally, they select a case. The tool checks if the GPU length and CPU cooler height fit within the case dimensions. If any incompatibility is found, the user cannot proceed. If all checks pass, the tool generates a build list and an estimated total price.",
    "mermaid": "graph TD\n    A[Select CPU] --> B[Filter motherboards by socket and chipset]\n    B --> C[Select motherboard]\n    C --> D{Motherboard has enough RAM slots for selected RAM?}\n    D -->|No| E[Show warning: insufficient slots]\n    D -->|Yes| F[Select RAM]\n    F --> G{RAM type matches motherboard? (DDR4 vs DDR5)}\n    G -->|No| H[Block selection, show error]\n    G -->|Yes| I[Select GPU]\n    I --> J[Calculate total power draw of all components]\n    J --> K{Total > PSU wattage?}\n    K -->|Yes| L[Show warning, recommend higher-wattage PSU]\n    K -->|No| M[Select case]\n    L --> M\n    M --> N{GPU length and CPU cooler height fit in case?}\n    N -->|No| O[Show incompatibility error]\n    N -->|Yes| P[Generate build list and estimated price]",
    "expanded_text": "A user builds a custom PC using a compatibility checker tool. First, they select a CPU. The tool then filters compatible motherboards based on the CPU's socket type (e.g., LGA1700) and chipset. The user selects a motherboard. The tool checks whether the motherboard has enough RAM slots for the RAM kit the user intends to install; if not, a warning is shown. The user then selects RAM. The tool checks whether the RAM type (DDR4 vs DDR5) matches the motherboard's supported type; if not, the selection is blocked with an error message. Next, the user selects a GPU. The tool calculates the total power draw of all selected components (CPU, GPU, drives, fans, etc.). If the total exceeds the power supply unit's wattage, a warning is shown and a higher-wattage PSU is recommended. Finally, the user selects a case. The tool checks whether the GPU length and CPU cooler height fit within the case's internal dimensions. If any incompatibility is found at any step, the user cannot proceed until the issue is resolved. If all checks pass, the tool generates a complete build list along with an estimated total price.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (compatibility checks)", "warning vs blocking", "power calculation"]
    }
  },
  {
    "input_text": "A bank customer reports a lost debit card. They call the bank's 24/7 hotline. The agent verifies the customer's identity by asking for their date of birth and the last four digits of their Social Security number. If verification fails, the agent asks a second set of security questions. After two failed attempts, the call is transferred to fraud department for manual verification. If verification succeeds, the agent immediately blocks the lost card and notes the time of report. The agent then orders a replacement card, which will arrive in 5-7 business days. The customer can request expedited shipping for an additional $25 fee. The agent also checks if any unauthorized transactions occurred between the last known use and the report time. If unauthorized transactions are found, the agent initiates a dispute process and issues provisional credit within 48 hours. The customer is given a temporary virtual card number for online purchases while waiting for the physical card.",
    "mermaid": "graph TD\n    A[Customer calls hotline, reports lost card] --> B[Agent verifies identity: DOB and last 4 of SSN]\n    B --> C{Verification succeeds?}\n    C -->|Yes| D[Block lost card, note time of report]\n    C -->|No| E[Ask second set of security questions]\n    E --> F{Second verification succeeds?}\n    F -->|Yes| D\n    F -->|No| G[Transfer to fraud department for manual verification]\n    D --> H{Expedited shipping requested?}\n    H -->|Yes| I[Charge $25 fee, order replacement with expedited shipping]\n    H -->|No| J[Order replacement, standard 5-7 business days]\n    I --> K[Check for unauthorized transactions between last use and report]\n    J --> K\n    K --> L{Unauthorized transactions found?}\n    L -->|Yes| M[Initiate dispute process, issue provisional credit within 48h]\n    L -->|No| N[Issue temporary virtual card number for online use]\n    M --> N",
    "expanded_text": "A bank customer calls the 24/7 hotline to report a lost debit card. The agent verifies the customer's identity by asking for their date of birth and the last four digits of their Social Security number. If this verification fails, the agent asks a second set of security questions. If the second attempt also fails, the call is transferred to the fraud department for manual verification. Once identity is successfully verified, the agent immediately blocks the lost card and records the time of the report. The agent then orders a replacement card. If the customer requests expedited shipping, a $25 fee is charged and the card will arrive sooner; otherwise, standard shipping takes 5-7 business days. The agent also checks whether any unauthorized transactions occurred between the customer's last known card use and the time of the report. If unauthorized transactions are found, the agent initiates a dispute process and issues a provisional credit to the customer's account within 48 hours. Finally, the customer is given a temporary virtual card number for online purchases while waiting for the physical replacement card to arrive.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (verification attempts, expedited shipping, fraud check)", "escalation to fraud department", "provisional credit"]
    }
  },
  {
    "input_text": "A user wants to convert a YouTube video to MP3. They go to a conversion website and paste the YouTube URL. The website fetches the video metadata (title, duration, thumbnail). If the video is longer than 3 hours, the website shows an error: 'Video too long, max 3 hours'. If the duration is acceptable, the user selects audio quality: Low (128kbps), Medium (192kbps), or High (320kbps). The website queues the conversion job. Free users have to wait for 10 minutes (ad-supported) or pay $5/month for priority processing. After the conversion is complete, the website provides a download link that expires in 24 hours. The user can download the MP3 file. If the user does not download within 24 hours, the file is deleted from the server. The website also offers a browser extension that adds a 'Download MP3' button directly on YouTube pages, bypassing the URL paste step.",
    "mermaid": "graph TD\n    A[User pastes YouTube URL] --> B[Fetch metadata: title, duration, thumbnail]\n    B --> C{Duration <= 3 hours?}\n    C -->|No| D[Error: Video too long, max 3 hours]\n    C -->|Yes| E[User selects audio quality: Low/Medium/High]\n    E --> F{User payment status?}\n    F -->|Free| G[Queue job with 10 minute wait (ad-supported)]\n    F -->|Paid ($5/month)| H[Priority processing, no wait]\n    G --> I[Convert video to MP3]\n    H --> I\n    I --> J[Generate download link, expires in 24 hours]\n    J --> K{User downloads within 24 hours?}\n    K -->|Yes| L[Download MP3 file]\n    K -->|No| M[Delete file from server]\n    N[Browser extension installed] --> O[Add 'Download MP3' button on YouTube pages]\n    O --> A",
    "expanded_text": "A user converts a YouTube video to MP3 using a conversion website. The user pastes the YouTube URL into the website, which then fetches the video's metadata, including title, duration, and thumbnail. If the video is longer than 3 hours, the website shows an error message: 'Video too long, max 3 hours'. If the duration is acceptable, the user selects an audio quality: Low (128kbps), Medium (192kbps), or High (320kbps). The website then checks the user's payment status. Free users must wait 10 minutes in an ad-supported queue, while users who pay $5 per month receive priority processing with no wait. After the conversion is complete, the website provides a download link that expires in 24 hours. If the user downloads the MP3 file within that window, they receive the file; if not, the file is automatically deleted from the server. Additionally, the website offers a browser extension that adds a 'Download MP3' button directly on YouTube pages, allowing the user to bypass the URL paste step entirely.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (duration limit, payment status)", "queuing with wait time", "expiring download link", "browser extension alternative path"]
    }
  },
  {
    "input_text": "A university professor creates a multiple-choice exam in an LMS. The professor uploads a CSV file with questions, answer choices, and correct answers. The system validates the CSV format: each row must have question text, exactly 4 answer choices, and one correct answer marked A, B, C, or D. If the format is invalid, the system returns an error and highlights the problematic row. If valid, the system creates the exam and sets a start time and end time. When students take the exam, the system randomly shuffles the order of questions for each student. It also randomizes the order of answer choices for each question, except for questions where answer order matters (e.g., 'All of the above'). The system auto-grades the exam immediately upon submission. Students see their score but not which questions they got wrong until the professor releases the answer key. The professor can manually override any auto-graded score before publishing final grades.",
    "mermaid": "graph TD\n    A[Professor uploads CSV with questions and answers] --> B{CSV format valid?}\n    B -->|No| C[Return error, highlight problematic row]\n    B -->|Yes| D[Create exam, set start and end time]\n    D --> E[Student takes exam]\n    E --> F[System shuffles question order per student]\n    F --> G[For each question, randomize answer choices unless order matters]\n    G --> H[Student submits exam]\n    H --> I[System auto-grades immediately]\n    I --> J[Student sees score, but not which were wrong]\n    J --> K[Professor releases answer key later]\n    K --> L[Students see correct/incorrect]\n    J --> M[Professor can manually override any score before publishing final grades]",
    "expanded_text": "A university professor creates a multiple-choice exam in a Learning Management System (LMS). The professor uploads a CSV file containing questions, answer choices, and correct answers. The system validates the CSV format: each row must include question text, exactly four answer choices, and one correct answer marked as A, B, C, or D. If the format is invalid, the system returns an error and highlights the specific problematic row. If the format is valid, the system creates the exam and sets a designated start time and end time. When students take the exam, the system randomly shuffles the order of questions for each student individually to prevent cheating. It also randomizes the order of answer choices for each question, except for questions where the answer order matters semantically (e.g., 'All of the above' must remain last). The system auto-grades the exam immediately upon submission. Students see their raw score immediately, but they do not see which questions they got wrong until the professor releases the answer key. The professor has the ability to manually override any auto-graded score for individual students before publishing final grades to the gradebook.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (CSV validation, answer order matters)", "randomization per student", "auto-grading", "manual override"]
    }
  },
  {
    "input_text": "A homeowner sets up a smart irrigation system. The system checks the weather forecast every morning at 6 AM. If rain is predicted in the next 24 hours, the system skips watering for the day. If no rain, it checks the soil moisture sensor in each zone. If moisture level is above 30%, that zone is skipped. If below 30%, the system waters that zone for the scheduled duration (lawn: 20 minutes, garden: 10 minutes, flower beds: 5 minutes). During watering, if the wind speed exceeds 15 mph, the system pauses watering for 10 minutes and then resumes. If the water flow sensor detects no flow while the sprinklers are on (indicating a broken sprinkler head), the system stops watering that zone, sends an alert to the homeowner, and logs the error. The homeowner can manually override any zone from the app.",
    "mermaid": "graph TD\n    A[6 AM: Check weather forecast] --> B{Rain predicted in next 24h?}\n    B -->|Yes| C[Skip watering for the day]\n    B -->|No| D[Check soil moisture per zone]\n    D --> E{Moisture > 30%?}\n    E -->|Yes| F[Skip this zone]\n    E -->|No| G[Water zone for scheduled duration: lawn=20min, garden=10min, flowers=5min]\n    G --> H{During watering: wind speed > 15 mph?}\n    H -->|Yes| I[Pause watering for 10 min, then resume]\n    H -->|No| J{Water flow detected?}\n    I --> J\n    J -->|No| K[Stop zone watering, send alert, log error]\n    J -->|Yes| L[Continue watering]\n    L --> M[Move to next zone or end]\n    F --> M\n    C --> N[End]\n    M --> N\n    O[Homeowner app] --> P[Manually override any zone]",
    "expanded_text": "A homeowner sets up a smart irrigation system. Every morning at 6 AM, the system checks the weather forecast. If rain is predicted within the next 24 hours, the system skips watering entirely for the day. If no rain is predicted, it checks the soil moisture sensor for each zone individually. If the moisture level in a zone is above 30%, that zone is skipped. If below 30%, the system waters that zone for a pre-scheduled duration: 20 minutes for the lawn, 10 minutes for the garden, and 5 minutes for flower beds. During watering, if the wind speed exceeds 15 miles per hour, the system pauses watering for 10 minutes and then resumes. If the water flow sensor detects no flow while the sprinklers are supposed to be on (indicating a broken sprinkler head or clogged line), the system immediately stops watering that zone, sends an alert to the homeowner via the app, and logs the error for maintenance. The homeowner can also manually override any zone at any time using the mobile app to start or stop watering as desired.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (rain, moisture, wind, flow)", "zone-specific durations", "manual override", "alerting"]
    }
  },
  {
    "input_text": "A user participates in a daily word game. The game selects a secret 5-letter word. The user has 6 attempts to guess it. After each guess, the game provides feedback: green (correct letter, correct position), yellow (correct letter, wrong position), or gray (letter not in word). The user enters a guess. The game validates that the guess is a real 5-letter word using a dictionary. If not a real word, it rejects the guess and does not count as an attempt. If valid, the game compares the guess to the secret word and displays the color-coded feedback. If the guess matches the secret word exactly, the user wins. If after 6 attempts the user has not guessed the word, the game reveals the secret word. The user can share their results as an emoji grid (green squares, yellow squares, gray squares) without revealing the word. A new word is available each day. Users can also play a practice mode with random words from a 2000-word list with no daily limit.",
    "mermaid": "graph TD\n    A[Game selects secret 5-letter word] --> B[User has 6 attempts]\n    B --> C[User enters a guess]\n    C --> D{Guess is a real 5-letter word?}\n    D -->|No| E[Reject guess, does not count as attempt]\n    E --> C\n    D -->|Yes| F[Compare guess to secret word]\n    F --> G[Display color-coded feedback: green, yellow, gray]\n    G --> H{Guess matches secret word exactly?}\n    H -->|Yes| I[User wins]\n    H -->|No| J{Attempts used < 6?}\n    J -->|Yes| C\n    J -->|No| K[Game reveals secret word, user loses]\n    I --> L[User can share results as emoji grid]\n    K --> L\n    L --> M[New word next day]\n    N[Practice mode] --> O[Random word from 2000-word list, no daily limit]",
    "expanded_text": "A user plays a daily word game. The game selects a secret 5-letter word at the start of each day. The user has six attempts to guess the word. After each guess, the game provides feedback using colored tiles: green means the letter is correct and in the correct position, yellow means the letter is in the word but in the wrong position, and gray means the letter is not in the word at all. The user enters a guess, and the game first validates that the guess is a real 5-letter word using an internal dictionary. If the guess is not a real word (e.g., 'ABCDE'), the guess is rejected and does not count as one of the six attempts. If the guess is valid, the game compares it to the secret word and displays the color-coded feedback. If the guess matches the secret word exactly, the user wins. If after six attempts the user has not guessed the word, the game reveals the secret word and the user loses. In either outcome, the user can share their results as an emoji grid showing only the pattern of green, yellow, and gray squares without revealing the actual word. A new secret word is available each day. The game also includes a practice mode where users can play an unlimited number of rounds using random words from a 2000-word list, with no daily reset.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches (word validity, match, attempts remaining)", "feedback generation", "sharing feature", "practice vs daily mode"]
    }
  },
  {
    "input_text": "A restaurant manager reviews online reservations every afternoon. If reservations exceed available tables, overflow customers are placed on a waitlist. VIP guests receive priority seating. Customers who cancel late may be charged a cancellation fee.",
    "mermaid": "flowchart TD\n    A[Review Daily Reservations] --> B{Reservations Exceed Capacity?}\n    B -- Yes --> C[Place Customers on Waitlist]\n    B -- No --> D[Confirm Reservations]\n    C --> D\n    D --> E{VIP Guest?}\n    E -- Yes --> F[Assign Priority Seating]\n    E -- No --> G[Assign Standard Seating]\n    F --> H[Monitor Cancellations]\n    G --> H\n    H --> I{Late Cancellation?}\n    I -- Yes --> J[Charge Cancellation Fee]\n    I -- No --> K[Close Reservation Process]",
    "expanded_text": "The restaurant manager begins by reviewing reservation demand. If bookings exceed seating capacity, excess customers are added to a waitlist. VIP customers are prioritized during seating assignments. The system also monitors cancellations, and customers who cancel too late may incur fees to compensate for lost reservations.",
    "metadata": {
      "domain": "hospitality",
      "complexity": "medium",
      "graph_features": ["priority handling", "capacity management", "conditional workflow"]
    }
  },
  {
    "input_text": "A mobile banking app monitors failed login attempts. Users who mistype passwords several times receive a temporary account lock. If suspicious activity continues after unlocking, the app requires identity verification before allowing further access.",
    "mermaid": "flowchart TD\n    A[User Attempts Login] --> B{Password Correct?}\n    B -- Yes --> C[Grant Account Access]\n    B -- No --> D[Increase Failed Attempt Counter]\n    D --> E{Too Many Failed Attempts?}\n    E -- No --> A\n    E -- Yes --> F[Temporarily Lock Account]\n    F --> G[Unlock After Waiting Period]\n    G --> H{Suspicious Activity Continues?}\n    H -- Yes --> I[Require Identity Verification]\n    H -- No --> A\n    I --> J[Restore Secure Access]",
    "expanded_text": "The banking app monitors authentication attempts to protect user accounts. Incorrect passwords increase a failure counter, and repeated failures trigger a temporary account lock. If suspicious login behavior continues after the lock expires, the system escalates security by requiring identity verification before restoring access.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["security escalation", "authentication loop", "fraud prevention"]
    }
  },
  {
    "input_text": "A freelance designer receives project requests through email. Small projects are quoted immediately, while larger projects require a consultation call. If the client accepts the proposal, a contract and deposit invoice are sent before work begins.",
    "mermaid": "flowchart TD\n    A[Receive Client Project Request] --> B{Project Small?}\n    B -- Yes --> C[Send Immediate Quote]\n    B -- No --> D[Schedule Consultation Call]\n    D --> E[Prepare Custom Proposal]\n    C --> F{Client Accepts Proposal?}\n    E --> F\n    F -- No --> G[Close Opportunity]\n    F -- Yes --> H[Send Contract]\n    H --> I[Send Deposit Invoice]\n    I --> J[Begin Design Work]",
    "expanded_text": "The freelance workflow begins when a client submits a project request. Small projects are simple enough for immediate pricing, while complex projects require consultation discussions before proposals are created. Clients who approve the proposal receive contracts and invoices for deposits before project execution officially starts.",
    "metadata": {
      "domain": "business",
      "complexity": "medium",
      "graph_features": ["sales funnel", "client approval", "project onboarding"]
    }
  },
  {
    "input_text": "A biology teacher assigns students into lab groups. Students complete experiments and record observations. If experimental results differ significantly between groups, the teacher reviews procedures to identify possible mistakes before discussing conclusions.",
    "mermaid": "flowchart TD\n    A[Assign Students to Lab Groups] --> B[Conduct Experiment]\n    B --> C[Record Observations]\n    C --> D{Results Consistent Between Groups?}\n    D -- Yes --> E[Discuss Scientific Conclusions]\n    D -- No --> F[Review Experimental Procedures]\n    F --> G[Identify Possible Errors]\n    G --> E",
    "expanded_text": "The classroom laboratory process starts with group assignments for students. After performing experiments and recording data, the teacher compares results between groups. Inconsistent findings trigger a review of procedures and potential mistakes before scientific conclusions are discussed with the class.",
    "metadata": {
      "domain": "science",
      "complexity": "simple",
      "graph_features": ["experimental analysis", "educational workflow", "error investigation"]
    }
  },
  {
    "input_text": "A ride-sharing app matches passengers with nearby drivers. If no driver accepts within two minutes, surge pricing activates to attract additional drivers. Passengers can either accept the higher fare or wait for pricing to normalize.",
    "mermaid": "flowchart TD\n    A[Passenger Requests Ride] --> B[Search Nearby Drivers]\n    B --> C{Driver Accepts Within Two Minutes?}\n    C -- Yes --> D[Confirm Ride Booking]\n    C -- No --> E[Activate Surge Pricing]\n    E --> F{Passenger Accepts Higher Fare?}\n    F -- Yes --> G[Search Additional Drivers]\n    G --> D\n    F -- No --> H[Wait for Pricing to Normalize]",
    "expanded_text": "The ride-sharing system searches for available nearby drivers after a passenger requests transportation. If no driver accepts quickly, surge pricing increases incentives for drivers. Passengers then choose whether to accept higher pricing immediately or wait until demand decreases and normal rates return.",
    "metadata": {
      "domain": "transportation",
      "complexity": "medium",
      "graph_features": ["dynamic pricing", "conditional decision", "matching workflow"]
    }
  },
  {
    "input_text": "A software team conducts sprint planning every two weeks. Developers estimate tasks and assign priorities. If the workload exceeds team capacity, lower-priority features are postponed to future sprints.",
    "mermaid": "flowchart TD\n    A[Start Sprint Planning Meeting] --> B[Estimate Development Tasks]\n    B --> C[Assign Task Priorities]\n    C --> D{Workload Within Team Capacity?}\n    D -- Yes --> E[Finalize Sprint Backlog]\n    D -- No --> F[Postpone Lower-Priority Features]\n    F --> E",
    "expanded_text": "The agile development process begins with sprint planning sessions. Developers estimate task complexity and prioritize features. When the planned workload exceeds available capacity, less important features are deferred to future iterations so the sprint remains achievable.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "simple",
      "graph_features": ["resource planning", "priority management", "agile workflow"]
    }
  },
  {
    "input_text": "A family preparing for a vacation first decides on a destination. If travel costs exceed their budget, they compare cheaper alternatives or shorten the trip duration. Once plans are finalized, flights and hotels are booked.",
    "mermaid": "flowchart TD\n    A[Choose Vacation Destination] --> B[Estimate Travel Costs]\n    B --> C{Within Budget?}\n    C -- Yes --> D[Book Flights]\n    D --> E[Reserve Hotels]\n    C -- No --> F[Compare Cheaper Alternatives]\n    F --> G{Reduce Trip Duration?}\n    G --> B",
    "expanded_text": "The family starts vacation planning by selecting a destination and estimating costs. Budget constraints influence decision-making, leading the family to compare alternatives or shorten the trip if expenses are too high. Once an affordable plan is found, travel and accommodation bookings are completed.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["budget evaluation", "planning loop", "decision-making"]
    }
  },
  {
    "input_text": "A pharmaceutical company tests a new drug through multiple trial phases. Early trials evaluate safety, while later phases measure effectiveness. Severe side effects pause the trial immediately for regulatory review before continuation decisions are made.",
    "mermaid": "flowchart TD\n    A[Develop Experimental Drug] --> B[Conduct Safety Trials]\n    B --> C{Severe Side Effects Detected?}\n    C -- Yes --> D[Pause Clinical Trial]\n    D --> E[Regulatory Safety Review]\n    E --> F{Approved to Continue?}\n    F -- No --> G[Terminate Drug Development]\n    F -- Yes --> H[Resume Clinical Trial]\n    C -- No --> I[Conduct Effectiveness Trials]\n    H --> I\n    I --> J[Analyze Trial Results]",
    "expanded_text": "The pharmaceutical development process progresses through multiple testing stages. Initial clinical trials focus on safety assessment, while later phases evaluate drug effectiveness. Severe adverse effects trigger an immediate pause and regulatory investigation. Regulators then determine whether the trial can continue or should be terminated entirely.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["regulatory workflow", "safety monitoring", "approval decisions"]
    }
  },
  {
    "input_text": "An online multiplayer tournament begins with qualification matches. Players who lose early enter a secondary bracket for another chance. Winners advance into elimination rounds until a final champion is determined.",
    "mermaid": "flowchart TD\n    A[Start Qualification Matches] --> B{Player Wins Match?}\n    B -- Yes --> C[Advance to Elimination Rounds]\n    B -- No --> D[Enter Secondary Bracket]\n    D --> E{Win Secondary Bracket Match?}\n    E -- Yes --> C\n    E -- No --> F[Eliminated from Tournament]\n    C --> G{Win Elimination Match?}\n    G -- Yes --> H[Advance Further]\n    H --> G\n    G -- No --> F\n    H --> I[Become Tournament Champion]",
    "expanded_text": "The gaming tournament begins with qualification matches. Players who lose initially still have another opportunity through a secondary bracket system. Successful players progress into elimination rounds where repeated victories are required to continue. Eventually, the remaining competitor becomes the tournament champion.",
    "metadata": {
      "domain": "gaming",
      "complexity": "high",
      "graph_features": ["competitive progression", "double-elimination logic", "tournament workflow"]
    }
  },
  {
    "input_text": "A nonprofit organization collects donations during fundraising campaigns. Donations are categorized into emergency relief, education programs, and operational costs. If emergency funding drops below targets, additional campaigns are launched to increase awareness and contributions.",
    "mermaid": "flowchart TD\n    A[Collect Donations] --> B[Categorize Donations]\n    B --> C[Allocate to Emergency Relief]\n    B --> D[Allocate to Education Programs]\n    B --> E[Allocate to Operational Costs]\n    C --> F{Emergency Funding Meets Target?}\n    F -- Yes --> G[Continue Programs Normally]\n    F -- No --> H[Launch Additional Awareness Campaign]\n    H --> A",
    "expanded_text": "The nonprofit receives donations and distributes funds across multiple operational categories. Emergency relief funding is monitored closely because shortages may impact urgent humanitarian work. When emergency funding goals are not achieved, the organization launches additional awareness campaigns to encourage more public donations.",
    "metadata": {
      "domain": "nonprofit",
      "complexity": "medium",
      "graph_features": ["resource allocation", "feedback loop", "fundraising workflow"]
    }
  },
  {
    "input_text": "What should happen if a customer tries to withdraw more money than their bank account balance allows?",
    "mermaid": "flowchart TD\n    A[Customer Requests Withdrawal] --> B[Check Account Balance]\n    B --> C{Sufficient Funds?}\n    C -- Yes --> D[Approve Withdrawal]\n    D --> E[Update Account Balance]\n    C -- No --> F[Reject Withdrawal]\n    F --> G[Notify Customer of Insufficient Funds]",
    "expanded_text": "The banking system first checks the customer's available balance when a withdrawal request is made. If enough funds are available, the withdrawal is approved and the balance is updated. If the balance is insufficient, the transaction is denied and the customer receives a notification explaining the issue.",
    "metadata": {
      "domain": "finance",
      "complexity": "simple",
      "graph_features": ["decision branching", "transaction workflow", "error handling"]
    }
  },
  {
    "input_text": "How does an online store process orders when some items are out of stock?",
    "mermaid": "flowchart TD\n    A[Customer Places Order] --> B[Check Inventory Availability]\n    B --> C{All Items In Stock?}\n    C -- Yes --> D[Prepare Shipment]\n    D --> E[Ship Order]\n    C -- No --> F[Separate Available and Missing Items]\n    F --> G[Notify Customer About Out-of-Stock Items]\n    G --> H{Customer Accepts Partial Shipment?}\n    H -- Yes --> I[Ship Available Items]\n    H -- No --> J[Cancel Entire Order]",
    "expanded_text": "The e-commerce system verifies inventory after an order is placed. If all products are available, the shipment is prepared normally. If some items are unavailable, the customer is informed and asked whether they want a partial shipment. Depending on the customer's decision, the store either ships available items or cancels the order.",
    "metadata": {
      "domain": "e-commerce",
      "complexity": "medium",
      "graph_features": ["inventory management", "customer decision flow", "conditional routing"]
    }
  },
  {
    "input_text": "What happens when a software deployment fails during production release?",
    "mermaid": "flowchart TD\n    A[Start Production Deployment] --> B[Run Deployment Process]\n    B --> C{Deployment Successful?}\n    C -- Yes --> D[Release New Version]\n    C -- No --> E[Trigger Rollback]\n    E --> F[Restore Previous Stable Version]\n    F --> G[Notify Engineering Team]\n    G --> H[Investigate Deployment Failure]",
    "expanded_text": "The deployment workflow attempts to release a new software version into production. Successful deployments make the new version available to users. Failed deployments automatically trigger rollback procedures that restore the previous stable release. Engineers are then alerted so they can investigate the root cause.",
    "metadata": {
      "domain": "software engineering",
      "complexity": "medium",
      "graph_features": ["rollback workflow", "failure recovery", "deployment automation"]
    }
  },
  {
    "input_text": "How should a hospital respond when too many emergency patients arrive at once?",
    "mermaid": "flowchart TD\n    A[Emergency Patients Arrive] --> B[Perform Triage Assessment]\n    B --> C{Hospital Capacity Available?}\n    C -- Yes --> D[Assign Patients to Treatment Rooms]\n    C -- No --> E[Activate Emergency Overflow Protocol]\n    E --> F[Prioritize Critical Patients]\n    F --> G[Transfer Stable Patients to Nearby Hospitals]\n    G --> H[Continue Emergency Treatment]",
    "expanded_text": "The hospital first performs triage assessments to prioritize incoming emergency patients. If sufficient resources are available, patients are treated normally. During overcrowding situations, emergency overflow procedures are activated. Critical patients receive priority care, while stable patients may be transferred to nearby hospitals to balance capacity.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "high",
      "graph_features": ["capacity management", "priority routing", "emergency response"]
    }
  },
  {
    "input_text": "How does a game server handle players disconnecting during multiplayer matches?",
    "mermaid": "flowchart TD\n    A[Player Disconnects During Match] --> B[Start Reconnection Timer]\n    B --> C{Player Reconnects in Time?}\n    C -- Yes --> D[Restore Player Session]\n    C -- No --> E[Replace Player with AI Bot]\n    E --> F[Continue Match]\n    D --> F",
    "expanded_text": "When a player disconnects during an online match, the server temporarily reserves the player's session and waits for reconnection. If the player reconnects quickly, the session is restored seamlessly. If reconnection fails within the allowed time, the system replaces the player with an AI-controlled bot so the match can continue.",
    "metadata": {
      "domain": "gaming",
      "complexity": "simple",
      "graph_features": ["timeout handling", "session recovery", "multiplayer continuity"]
    }
  },
  {
    "input_text": "What steps should a company take if an employee reports a phishing email?",
    "mermaid": "flowchart TD\n    A[Employee Reports Suspicious Email] --> B[Security Team Reviews Email]\n    B --> C{Phishing Confirmed?}\n    C -- No --> D[Close Investigation]\n    C -- Yes --> E[Block Malicious Sender]\n    E --> F[Warn Other Employees]\n    F --> G[Scan Systems for Compromise]\n    G --> H{Systems Infected?}\n    H -- Yes --> I[Isolate Affected Devices]\n    H -- No --> J[Document Security Incident]",
    "expanded_text": "The cybersecurity team investigates suspicious emails reported by employees. If the email is harmless, the investigation ends. Confirmed phishing attempts lead to blocking the sender, warning staff, and scanning internal systems for compromise. Infected devices are isolated to prevent further spread before the incident is documented.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["incident response", "security escalation", "threat containment"]
    }
  },
  {
    "input_text": "How can a teacher help students who consistently fail quizzes in an online course?",
    "mermaid": "flowchart TD\n    A[Student Fails Multiple Quizzes] --> B[Analyze Weak Subject Areas]\n    B --> C[Assign Supplemental Learning Materials]\n    C --> D[Schedule Support Session]\n    D --> E[Retake Quiz]\n    E --> F{Quiz Passed?}\n    F -- Yes --> G[Continue Course Progress]\n    F -- No --> H[Provide Additional Tutoring]\n    H --> E",
    "expanded_text": "The educational support process begins when a student repeatedly fails quizzes. The teacher identifies weak areas and provides supplemental learning materials. Support sessions and tutoring are arranged before the student retakes assessments. This feedback loop continues until the student demonstrates improvement.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["learning feedback loop", "performance intervention", "educational support"]
    }
  },
  {
    "input_text": "What should happen if a delivery driver cannot reach the customer at the drop-off location?",
    "mermaid": "flowchart TD\n    A[Driver Arrives at Delivery Location] --> B[Attempt to Contact Customer]\n    B --> C{Customer Responds?}\n    C -- Yes --> D[Complete Delivery]\n    C -- No --> E[Wait for Response Timeout]\n    E --> F{Still No Response?}\n    F -- No --> D\n    F -- Yes --> G[Return Package to Distribution Center]\n    G --> H[Notify Customer About Failed Delivery]",
    "expanded_text": "The delivery driver attempts to contact the customer upon arrival. If the customer responds, the package is delivered successfully. If the customer remains unreachable after a waiting period, the package is returned to the distribution center and the customer is notified about the failed delivery attempt.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["timeout handling", "customer communication", "delivery workflow"]
    }
  },
  {
    "input_text": "How should an AI moderation system react when users post harmful content repeatedly?",
    "mermaid": "flowchart TD\n    A[User Posts Content] --> B[AI Moderation Review]\n    B --> C{Content Violates Policy?}\n    C -- No --> D[Allow Content]\n    C -- Yes --> E[Remove Harmful Content]\n    E --> F[Increase Violation Counter]\n    F --> G{Repeated Violations?}\n    G -- No --> H[Warn User]\n    G -- Yes --> I[Suspend User Account]\n    I --> J[Escalate Case for Human Review]",
    "expanded_text": "The AI moderation system evaluates user-generated content against platform rules. Harmful content is removed immediately, and violations are tracked over time. Users with repeated offenses receive stronger penalties, including account suspension and escalation to human moderators for deeper review.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["policy enforcement", "moderation workflow", "escalation logic"]
    }
  },
  {
    "input_text": "What should a family do if their planned outdoor wedding suddenly faces severe weather forecasts?",
    "mermaid": "flowchart TD\n    A[Monitor Wedding Weather Forecast] --> B{Severe Weather Expected?}\n    B -- No --> C[Continue Outdoor Preparations]\n    B -- Yes --> D[Activate Backup Indoor Venue]\n    D --> E[Notify Guests About Venue Change]\n    E --> F[Adjust Decorations and Seating]\n    F --> G[Proceed with Wedding Ceremony]",
    "expanded_text": "The family continuously monitors weather forecasts before the wedding. If conditions remain favorable, the outdoor ceremony continues as planned. Severe weather triggers contingency plans involving an indoor venue. Guests are informed, arrangements are adjusted, and the ceremony proceeds safely indoors.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["contingency planning", "event management", "conditional workflow"]
    }
  },
  {
    "input_text": "The startup's customer success team noticed that new users who skipped onboarding tutorials were far more likely to cancel subscriptions within the first month. To improve retention, the company introduced interactive onboarding steps, automated reminder emails, and live support chat for users who became inactive during setup.",
    "mermaid": "flowchart TD\n    A[New User Registers] --> B{Completes Onboarding Tutorial?}\n    B -- Yes --> C[Continue Product Usage]\n    B -- No --> D[Higher Risk of Cancellation]\n    D --> E[Trigger Reminder Emails]\n    E --> F[Offer Interactive Onboarding]\n    F --> G{User Becomes Active Again?}\n    G -- Yes --> H[Continue Subscription]\n    G -- No --> I[Offer Live Support Chat]\n    I --> J{Issue Resolved?}\n    J -- Yes --> H\n    J -- No --> K[Subscription Cancellation]",
    "expanded_text": "The customer success workflow begins when a new user signs up for the platform. Users who complete onboarding tutorials are more likely to continue using the service successfully. Users who skip onboarding enter a higher-risk category for churn. The company attempts to recover these users through reminder emails, interactive onboarding guidance, and eventually live support intervention. Successful engagement reduces cancellation risk, while unresolved inactivity leads to subscription loss.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["customer retention loop", "behavioral analysis", "conditional escalation", "support workflow"]
    }
  },
  {
    "input_text": "Emma spent weeks preparing for her driving test. Every evening, she reviewed traffic signs and practiced parking with her father. If she made repeated mistakes during practice, they focused specifically on those maneuvers before trying the full driving route again.",
    "mermaid": "flowchart TD\n    A[Prepare for Driving Test] --> B[Review Traffic Signs]\n    B --> C[Practice Driving Skills]\n    C --> D{Repeated Mistakes Detected?}\n    D -- Yes --> E[Focus on Weak Maneuvers]\n    E --> C\n    D -- No --> F[Practice Full Driving Route]\n    F --> G[Gain Driving Confidence]",
    "expanded_text": "Emma's preparation process combines theoretical learning with practical driving experience. Traffic sign review builds knowledge while driving practice develops skill. Mistakes trigger focused repetition on weak areas before broader driving practice resumes. Over time, repeated practice improves both confidence and driving ability.",
    "metadata": {
      "domain": "daily life",
      "complexity": "simple",
      "graph_features": ["practice loop", "skill improvement", "feedback-based learning"]
    }
  },
  {
    "input_text": "The AI recommendation engine continuously analyzes viewing behavior on the streaming platform. When users finish watching a series, the system compares viewing patterns with similar users and generates personalized recommendations. If recommended content is ignored repeatedly, the recommendation weights are recalibrated.",
    "mermaid": "flowchart TD\n    A[User Watches Content] --> B[Analyze Viewing Behavior]\n    B --> C[Compare Similar User Patterns]\n    C --> D[Generate Recommendations]\n    D --> E{User Engages with Recommendations?}\n    E -- Yes --> F[Improve Recommendation Confidence]\n    E -- No --> G[Recalibrate Recommendation Weights]\n    G --> D",
    "expanded_text": "The streaming platform monitors user viewing habits to personalize recommendations. Behavioral similarities between users are used to predict relevant content. Positive engagement strengthens recommendation confidence, while repeated rejection of recommendations triggers recalibration to improve future suggestions.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "medium",
      "graph_features": ["feedback loop", "behavior analysis", "recommendation optimization"]
    }
  },
  {
    "input_text": "A university research lab receives sensor data from ocean monitoring devices every hour. Corrupted readings are filtered automatically before scientists analyze trends related to temperature and pollution levels. Significant anomalies trigger alerts for further investigation.",
    "mermaid": "flowchart TD\n    A[Collect Ocean Sensor Data] --> B[Validate Incoming Readings]\n    B --> C{Data Corrupted?}\n    C -- Yes --> D[Filter Invalid Data]\n    D --> E[Store Clean Dataset]\n    C -- No --> E\n    E --> F[Analyze Environmental Trends]\n    F --> G{Anomaly Detected?}\n    G -- Yes --> H[Trigger Scientific Alert]\n    G -- No --> I[Continue Monitoring]",
    "expanded_text": "Ocean monitoring sensors continuously transmit environmental data to the research lab. Incoming readings are validated and corrupted data is removed automatically. Scientists analyze cleaned datasets to detect environmental trends such as rising temperatures or pollution changes. Significant anomalies generate alerts requiring additional scientific investigation.",
    "metadata": {
      "domain": "science",
      "complexity": "medium",
      "graph_features": ["data pipeline", "anomaly detection", "environmental monitoring"]
    }
  },
  {
    "input_text": "The HR department noticed employee burnout increasing after several months of overtime. Managers were instructed to redistribute workloads, encourage time off, and monitor team morale during weekly check-ins. Employees showing severe stress symptoms were referred to wellness counseling.",
    "mermaid": "flowchart TD\n    A[Detect Increased Employee Burnout] --> B[Redistribute Workloads]\n    B --> C[Encourage Time Off]\n    C --> D[Conduct Weekly Morale Check-Ins]\n    D --> E{Severe Stress Symptoms Observed?}\n    E -- Yes --> F[Refer to Wellness Counseling]\n    E -- No --> G[Continue Team Monitoring]",
    "expanded_text": "The organization responds to rising burnout by reducing workload pressure and encouraging recovery time. Managers regularly monitor morale to identify employees struggling emotionally. Severe cases trigger referrals to wellness counseling services, while general morale tracking continues for the broader team.",
    "metadata": {
      "domain": "HR",
      "complexity": "medium",
      "graph_features": ["wellness intervention", "organizational response", "employee monitoring"]
    }
  },
  {
    "input_text": "As the hurricane approached the coastal city, emergency teams coordinated evacuation routes, opened temporary shelters, and distributed supplies. Residents in flood-risk zones were prioritized first. After the storm passed, utility crews began restoring electricity while rescue teams searched damaged neighborhoods.",
    "mermaid": "flowchart TD\n    A[Hurricane Warning Issued] --> B[Coordinate Evacuation Routes]\n    B --> C[Open Temporary Shelters]\n    C --> D[Distribute Emergency Supplies]\n    D --> E[Prioritize Flood-Risk Residents]\n    E --> F[Storm Makes Landfall]\n    F --> G[Assess Damage]\n    G --> H[Restore Electricity]\n    G --> I[Conduct Rescue Operations]\n    H --> J[Begin Recovery Phase]\n    I --> J",
    "expanded_text": "Emergency management operations begin before the hurricane arrives through evacuations, shelter preparation, and supply distribution. High-risk residents are prioritized for evacuation. After the storm passes, authorities transition into recovery operations involving damage assessment, power restoration, and search-and-rescue missions.",
    "metadata": {
      "domain": "emergency management",
      "complexity": "high",
      "graph_features": ["parallel operations", "disaster response", "priority routing", "event chain"]
    }
  },
  {
    "input_text": "The online learning platform introduced a peer-review system for essay assignments. Students first submitted drafts, then anonymously reviewed classmates' work using grading rubrics. Essays with highly conflicting scores were escalated to instructors for manual evaluation.",
    "mermaid": "flowchart TD\n    A[Student Submits Essay Draft] --> B[Assign Anonymous Peer Reviewers]\n    B --> C[Review Essays Using Rubrics]\n    C --> D[Calculate Review Scores]\n    D --> E{Scores Highly Conflicting?}\n    E -- Yes --> F[Escalate to Instructor Review]\n    E -- No --> G[Finalize Assignment Grade]",
    "expanded_text": "The education platform uses peer review to evaluate essays. Students anonymously assess each other's work according to grading rubrics. The system compares review consistency, and assignments with conflicting evaluations are escalated to instructors for final judgment.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["peer review workflow", "quality validation", "escalation logic"]
    }
  },
  {
    "input_text": "The cybersecurity team observed an unusual spike in outbound network traffic late at night. Analysts suspected malware communicating with external servers. They isolated affected machines, blocked suspicious IP addresses, and initiated forensic analysis to determine the source of the compromise.",
    "mermaid": "flowchart TD\n    A[Detect Unusual Network Traffic] --> B[Analyze Traffic Patterns]\n    B --> C{Potential Malware Activity?}\n    C -- Yes --> D[Isolate Affected Machines]\n    D --> E[Block Suspicious IP Addresses]\n    E --> F[Initiate Forensic Analysis]\n    F --> G[Identify Source of Compromise]\n    C -- No --> H[Continue Monitoring Systems]",
    "expanded_text": "Security analysts identify abnormal outbound traffic that may indicate malware activity. Suspected systems are isolated to contain the threat, and malicious external addresses are blocked. Investigators then perform forensic analysis to determine how the compromise occurred and what systems were affected.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "high",
      "graph_features": ["incident response", "threat containment", "forensic investigation"]
    }
  },
  {
    "input_text": "A hospital introduced wearable devices to monitor patient heart rates remotely after surgery. Patients with stable readings continued standard recovery, while abnormal readings triggered immediate nurse notifications and physician reviews.",
    "mermaid": "flowchart TD\n    A[Patient Wears Monitoring Device] --> B[Track Heart Rate Remotely]\n    B --> C{Heart Rate Stable?}\n    C -- Yes --> D[Continue Standard Recovery]\n    C -- No --> E[Notify Nursing Staff]\n    E --> F[Physician Reviews Patient Condition]\n    F --> G[Adjust Treatment Plan]",
    "expanded_text": "Post-surgery patients are monitored remotely using wearable health devices. Stable heart readings allow patients to continue normal recovery procedures. Abnormal heart activity automatically alerts nurses and physicians, enabling rapid medical intervention and treatment adjustments.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["remote monitoring", "medical alerts", "conditional intervention"]
    }
  },
  {
    "input_text": "The indie game studio released an early-access version of their survival game. Developers monitored bug reports, player feedback, and gameplay balance metrics daily. Features receiving negative feedback were redesigned before the official launch.",
    "mermaid": "flowchart TD\n    A[Release Early-Access Game] --> B[Collect Player Feedback]\n    B --> C[Monitor Bug Reports]\n    C --> D[Analyze Gameplay Balance]\n    D --> E{Feature Receiving Negative Feedback?}\n    E -- Yes --> F[Redesign Game Feature]\n    F --> G[Deploy Updated Build]\n    G --> B\n    E -- No --> H[Prepare Official Launch]",
    "expanded_text": "The game studio uses early access to gather community feedback before full release. Developers monitor bugs and gameplay balance continuously. Features criticized by players are redesigned and updated iteratively. Once feedback stabilizes and issues are resolved, the game moves toward official launch.",
    "metadata": {
      "domain": "gaming",
      "complexity": "medium",
      "graph_features": ["iterative development", "feedback loop", "community-driven optimization"]
    }
  },
  {
    "input_text": "The accounting department closes monthly financial reports at the end of each quarter. Transactions are first reconciled against bank statements. Any discrepancies are flagged for investigation before managers approve the final report for executive review.",
    "mermaid": "flowchart TD\n    A[Start Quarterly Financial Closing] --> B[Reconcile Transactions with Bank Statements]\n    B --> C{Discrepancies Found?}\n    C -- Yes --> D[Investigate Financial Discrepancies]\n    D --> E[Correct Accounting Records]\n    E --> B\n    C -- No --> F[Generate Final Financial Report]\n    F --> G[Manager Approval]\n    G --> H[Executive Review]",
    "expanded_text": "The accounting workflow begins during quarterly financial closing. Transactions are reconciled against official banking records to ensure accuracy. Any inconsistencies trigger investigations and corrections before reconciliation is repeated. Once the financial records are verified, managers approve the report for executive-level review.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["reconciliation loop", "approval workflow", "financial auditing"]
    }
  },
  {
    "input_text": "Lucas started training for a marathon after realizing he became exhausted climbing stairs at work. He followed a schedule that alternated between running days and recovery days. Whenever knee pain increased, he reduced training intensity and focused on stretching before gradually resuming full workouts.",
    "mermaid": "flowchart TD\n    A[Decide to Train for Marathon] --> B[Follow Running Schedule]\n    B --> C[Alternate Recovery Days]\n    C --> D{Knee Pain Increasing?}\n    D -- Yes --> E[Reduce Training Intensity]\n    E --> F[Focus on Stretching Exercises]\n    F --> G[Gradually Resume Full Workouts]\n    G --> B\n    D -- No --> H[Continue Marathon Preparation]",
    "expanded_text": "Lucas begins marathon training to improve his physical fitness. His routine alternates between exercise and recovery periods to prevent overtraining. When knee pain appears, he temporarily lowers workout intensity and focuses on recovery exercises before carefully returning to full training.",
    "metadata": {
      "domain": "fitness",
      "complexity": "medium",
      "graph_features": ["health monitoring", "adaptive training", "feedback loop"]
    }
  },
  {
    "input_text": "A telecommunications provider monitors network towers continuously. If a tower stops responding, automated diagnostics attempt a remote restart. Towers that remain offline are escalated to field technicians for physical inspection.",
    "mermaid": "flowchart TD\n    A[Monitor Network Towers] --> B{Tower Responding Normally?}\n    B -- Yes --> C[Continue Monitoring]\n    B -- No --> D[Run Automated Diagnostics]\n    D --> E[Attempt Remote Restart]\n    E --> F{Tower Back Online?}\n    F -- Yes --> C\n    F -- No --> G[Dispatch Field Technicians]\n    G --> H[Perform Physical Inspection]",
    "expanded_text": "The telecommunications system continuously monitors network tower health. Non-responsive towers trigger automated diagnostics and restart attempts. Successful recovery returns the tower to monitoring status, while unresolved failures require technician intervention on-site.",
    "metadata": {
      "domain": "telecommunications",
      "complexity": "medium",
      "graph_features": ["infrastructure monitoring", "automated recovery", "technical escalation"]
    }
  },
  {
    "input_text": "The museum launched an interactive mobile app that guides visitors through exhibits. Visitors can scan QR codes to access historical information and audio narration. Popular exhibits receive additional multimedia content updates based on visitor engagement analytics.",
    "mermaid": "flowchart TD\n    A[Visitor Opens Museum App] --> B[Scan Exhibit QR Code]\n    B --> C[Display Historical Information]\n    C --> D[Play Audio Narration]\n    D --> E[Track Visitor Engagement]\n    E --> F{Exhibit Highly Popular?}\n    F -- Yes --> G[Add More Multimedia Content]\n    G --> H[Update App Experience]\n    F -- No --> I[Continue Standard Experience]",
    "expanded_text": "The museum app enhances visitor engagement through QR-based exhibit interactions. Visitors receive multimedia educational content while the system tracks engagement data. Highly popular exhibits are expanded with additional digital experiences to improve future visitor interaction.",
    "metadata": {
      "domain": "education",
      "complexity": "medium",
      "graph_features": ["interactive learning", "analytics feedback loop", "content personalization"]
    }
  },
  {
    "input_text": "After launching a new product line, the fashion retailer monitored social media reactions closely. Positive trends increased advertising budgets, while negative comments about sizing inconsistencies triggered manufacturing reviews and revised sizing guides.",
    "mermaid": "flowchart TD\n    A[Launch New Product Line] --> B[Monitor Social Media Reactions]\n    B --> C{Positive Customer Trends?}\n    C -- Yes --> D[Increase Advertising Budget]\n    C -- No --> E[Analyze Customer Complaints]\n    E --> F{Sizing Issues Reported?}\n    F -- Yes --> G[Review Manufacturing Process]\n    G --> H[Update Sizing Guides]\n    F -- No --> I[Continue Monitoring]",
    "expanded_text": "The retailer analyzes customer sentiment after releasing new products. Positive engagement supports increased advertising investment. Negative feedback, especially regarding sizing problems, initiates manufacturing investigations and updates to sizing documentation to reduce customer dissatisfaction.",
    "metadata": {
      "domain": "marketing",
      "complexity": "medium",
      "graph_features": ["sentiment analysis", "feedback-driven improvements", "quality review"]
    }
  },
  {
    "input_text": "The space agency's rover collected rock samples on Mars while transmitting environmental data back to Earth. Dust storms occasionally interrupted communication signals, forcing the rover into low-power safe mode until signal quality improved.",
    "mermaid": "flowchart TD\n    A[Rover Collects Rock Samples] --> B[Transmit Environmental Data]\n    B --> C{Dust Storm Affecting Signal?}\n    C -- No --> D[Continue Exploration Mission]\n    C -- Yes --> E[Enter Low-Power Safe Mode]\n    E --> F[Monitor Signal Conditions]\n    F --> G{Signal Stable Again?}\n    G -- No --> F\n    G -- Yes --> H[Resume Rover Operations]\n    H --> D",
    "expanded_text": "The Mars rover performs scientific exploration while continuously transmitting environmental data to Earth. Dust storms disrupt communications and force the rover into a protective low-power state. Once signal conditions recover, the rover resumes its mission activities.",
    "metadata": {
      "domain": "space exploration",
      "complexity": "high",
      "graph_features": ["state transitions", "environmental monitoring", "autonomous recovery"]
    }
  },
  {
    "input_text": "The customer support chatbot handles basic refund requests automatically. Complex cases involving damaged products or policy disputes are transferred to human agents. Customer satisfaction ratings are collected after each interaction to improve support quality.",
    "mermaid": "flowchart TD\n    A[Customer Requests Refund] --> B[Chatbot Reviews Request]\n    B --> C{Simple Refund Case?}\n    C -- Yes --> D[Process Refund Automatically]\n    C -- No --> E[Transfer to Human Support Agent]\n    E --> F[Resolve Customer Issue]\n    D --> G[Collect Satisfaction Rating]\n    F --> G\n    G --> H[Analyze Feedback for Improvements]",
    "expanded_text": "The support system automates simple refund requests using a chatbot. More complicated cases involving disputes or damaged products are escalated to human agents. After resolution, customer feedback is collected and analyzed to improve overall support quality.",
    "metadata": {
      "domain": "customer support",
      "complexity": "medium",
      "graph_features": ["human escalation", "automation workflow", "feedback collection"]
    }
  },
  {
    "input_text": "The law firm reviews intellectual property filings for startup clients. Attorneys verify trademark conflicts before submitting applications. If conflicts exist, clients receive recommendations for alternative brand names before legal filing continues.",
    "mermaid": "flowchart TD\n    A[Receive Trademark Filing Request] --> B[Search Existing Trademarks]\n    B --> C{Trademark Conflict Found?}\n    C -- Yes --> D[Recommend Alternative Brand Names]\n    D --> E[Client Selects Revised Brand]\n    E --> B\n    C -- No --> F[Prepare Legal Filing]\n    F --> G[Submit Trademark Application]",
    "expanded_text": "The legal process begins with trademark research to identify possible conflicts with existing intellectual property. Conflicts require clients to revise branding decisions before the application process continues. Once a conflict-free name is identified, attorneys prepare and submit the trademark filing.",
    "metadata": {
      "domain": "legal",
      "complexity": "medium",
      "graph_features": ["compliance verification", "revision loop", "legal approval workflow"]
    }
  },
  {
    "input_text": "A robotics startup developed warehouse drones capable of tracking inventory automatically. Drones scanned shelf labels while AI systems compared counts against expected stock levels. Inventory mismatches triggered alerts for human supervisors to investigate possible theft or scanning errors.",
    "mermaid": "flowchart TD\n    A[Warehouse Drone Scans Inventory] --> B[Read Shelf Labels]\n    B --> C[Compare Against Expected Stock]\n    C --> D{Inventory Mismatch Detected?}\n    D -- No --> E[Update Inventory Database]\n    D -- Yes --> F[Trigger Supervisor Alert]\n    F --> G[Investigate Theft or Scanning Error]\n    G --> H[Correct Inventory Records]",
    "expanded_text": "Autonomous drones scan warehouse inventory and compare observed stock counts against database records. Matching counts update inventory normally. Mismatches trigger supervisor investigations to determine whether the issue results from theft, misplaced items, or scanning inaccuracies.",
    "metadata": {
      "domain": "robotics",
      "complexity": "medium",
      "graph_features": ["automation workflow", "inventory validation", "anomaly detection"]
    }
  },
  {
    "input_text": "The nonprofit organization's volunteers distributed food supplies across rural villages after severe flooding damaged transportation routes. Villages with the highest reported shortages were prioritized first, while additional supply runs were scheduled for areas that remained inaccessible due to road damage.",
    "mermaid": "flowchart TD\n    A[Collect Emergency Food Supplies] --> B[Assess Village Shortages]\n    B --> C[Prioritize High-Risk Villages]\n    C --> D[Deliver Supplies]\n    D --> E{Road Access Available?}\n    E -- Yes --> F[Complete Delivery Route]\n    E -- No --> G[Schedule Additional Supply Run]\n    G --> H[Wait for Transportation Access]\n    H --> D",
    "expanded_text": "The nonprofit coordinates disaster relief logistics after flooding disrupts transportation routes. Villages experiencing the most severe shortages receive priority attention. Areas blocked by damaged roads require repeated delivery attempts once transportation becomes possible again.",
    "metadata": {
      "domain": "logistics",
      "complexity": "high",
      "graph_features": ["priority routing", "disaster logistics", "retry loop", "resource allocation"]
    }
  },
  {
    "input_text": "How do I return a product I bought online? I have the receipt. Do I need to contact customer service first? What if the product is damaged? Will I get a refund or store credit?",
    "mermaid": "graph TD\n    A[Customer wants to return product] --> B{Product damaged?}\n    B -->|Yes| C[Contact customer service for damage claim]\n    C --> D[Agent approves return with prepaid label]\n    B -->|No| E{Within 30-day return window?}\n    E -->|No| F[Return rejected]\n    E -->|Yes| G[Print return label from website]\n    D --> H[Pack item with receipt]\n    G --> H\n    H --> I[Drop off at carrier]\n    I --> J{Restock fee applies?}\n    J -->|Yes| K[Refund minus 15% restocking fee]\n    J -->|No| L[Full refund to original payment method]\n    F --> M[Offer store credit instead]\n    K --> N[Process complete]\n    L --> N",
    "expanded_text": "To return a product purchased online, the customer first checks whether the product is damaged. If damaged, they must contact customer service to file a damage claim; the agent approves the return and provides a prepaid shipping label. If the product is not damaged, the customer checks whether they are within the 30-day return window. If outside the window, the return is rejected, though store credit may be offered as an alternative. If within the window, the customer prints a return label from the website. The customer then packs the item along with the receipt and drops it off at a carrier. Upon processing, if a restocking fee applies, the customer receives a refund minus 15%; otherwise, they receive a full refund to the original payment method.",
    "metadata": {
      "domain": "customer support",
      "complexity": "low",
      "graph_features": ["conditional branches", "question-driven flow", "damage vs non-damage path"]
    }
  },
  {
    "input_text": "What happens when I report a post on social media as hate speech? Does the post get removed immediately? Who reviews it? Can the poster appeal?",
    "mermaid": "graph TD\n    A[User reports post as hate speech] --> B{Already reported by ≥5 users in past hour?}\n    B -->|Yes| C[Auto-hide post immediately]\n    B -->|No| D[Add to moderation queue]\n    C --> E[Human moderator reviews within 24h]\n    D --> E\n    E --> F{Violates hate speech policy?}\n    F -->|Yes| G[Remove post, issue warning to poster]\n    F -->|No| H[Restore post if auto-hidden, no action]\n    G --> I{Poster has prior violations?}\n    I -->|First| J[Warning only]\n    I -->|Second| K[3-day suspension]\n    I -->|Third or more| L[Permanent ban]\n    G --> M[Poster can appeal within 30 days]\n    M --> N{Appeal granted?}\n    N -->|Yes| O[Restore post, remove penalty]\n    N -->|No| P[Penalty stands]",
    "expanded_text": "When a user reports a post as hate speech, the system first checks whether the same post has already been reported by five or more users in the past hour. If yes, the post is auto-hidden immediately. If not, it is added to a moderation queue. In either case, a human moderator reviews the post within 24 hours. If the moderator determines that the post does not violate hate speech policy, any auto-hidden status is reversed and no action is taken. If the post violates policy, it is permanently removed and the poster receives a warning. If the poster has prior violations, the penalty escalates: a first violation results in a warning only, a second violation results in a 3-day suspension, and a third or subsequent violation results in a permanent ban. The poster may appeal the decision within 30 days; if the appeal is granted, the post is restored and the penalty is removed; if denied, the penalty remains in effect.",
    "metadata": {
      "domain": "social interactions",
      "complexity": "medium",
      "graph_features": ["conditional branches", "threshold (5 reports)", "escalating penalties", "appeal loop"]
    }
  },
  {
    "input_text": "I forgot my laptop password. Can I reset it without losing my files? What if I also forgot my security questions? Is there a recovery key option?",
    "mermaid": "graph TD\n    A[User forgot laptop password] --> B{Recovery key available?}\n    B -->|Yes| C[Enter recovery key]\n    C --> D[Reset password, files preserved]\n    B -->|No| E{Security questions remembered?}\n    E -->|Yes| F[Answer security questions]\n    F --> G{Answers correct?}\n    G -->|Yes| D\n    G -->|No| H[Attempts < 3?]\n    H -->|Yes| F\n    H -->|No| I[Use password reset disk if previously created]\n    E -->|No| J{Password reset disk exists?}\n    J -->|Yes| I\n    J -->|No| K[Need to reinstall OS - files lost unless backed up]\n    I --> L{Reset disk works?}\n    L -->|Yes| D\n    L -->|No| K",
    "expanded_text": "When a user forgets their laptop password, the recovery process depends on what recovery options were set up beforehand. If a recovery key was created and is available, the user can enter it to reset the password without losing any files. If no recovery key exists but the user remembers their security questions, they can answer them; after three incorrect attempts, they must use another method. If security questions are not remembered or were never set up, the user can use a previously created password reset disk (USB drive). If a reset disk exists and works, password reset succeeds with files intact. If no recovery key, no security questions, and no reset disk are available, the user must reinstall the operating system, which will erase all files unless they were previously backed up to an external drive or cloud storage.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["conditional branches", "multiple recovery paths", "retry limit", "data loss condition"]
    }
  },
  {
    "input_text": "I think I have a fever. Should I go to the ER, urgent care, or stay home? What symptoms should I look for?",
    "mermaid": "graph TD\n    A[User has fever] --> B{Has difficulty breathing?}\n    B -->|Yes| C[Go to ER immediately]\n    B -->|No| D{Temperature > 103°F?}\n    D -->|Yes| C\n    D -->|No| E{Has rash or stiff neck?}\n    E -->|Yes| C\n    E -->|No| F{Duration > 3 days?}\n    F -->|Yes| G[Go to urgent care]\n    F -->|No| H{Other mild symptoms only? (cough, sore throat)}\n    H -->|Yes| I[Stay home, rest, hydrate, monitor]\n    H -->|No| J[Call doctor's office for advice]\n    I --> K{Fever persists > 3 days?}\n    K -->|Yes| G\n    K -->|No| L[Recover at home]\n    J --> G",
    "expanded_text": "When a user has a fever, the appropriate next step depends on accompanying symptoms. The user should go to the emergency room immediately if they have difficulty breathing, a temperature above 103°F, or a rash accompanied by a stiff neck (possible meningitis). If none of these emergency signs are present but the fever has lasted more than three days, the user should go to urgent care. If the fever is recent (less than 3 days) and the user has only mild symptoms such as cough or sore throat, they should stay home, rest, hydrate, and monitor their condition. If the fever persists beyond three days even with mild symptoms, they should then go to urgent care. If symptoms are unclear or moderate, the user should call their doctor's office for advice, which may lead to an urgent care referral. If the fever resolves within three days, the user recovers at home without needing medical attention.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["conditional branches", "triage flags (ER vs urgent care vs home)", "duration threshold"]
    }
  },
  {
    "input_text": "My credit card was declined but I have enough money. Why? Could it be a fraud alert? Do I need to call the bank?",
    "mermaid": "graph TD\n    A[Credit card declined despite sufficient funds] --> B{Is this an unusual purchase location or amount?}\n    B -->|Yes| C[Likely fraud alert: bank flagged transaction]\n    B -->|No| D{Have you exceeded daily spending limit?}\n    D -->|Yes| E[Transaction over $5000 daily limit]\n    D -->|No| F{Card expired?}\n    F -->|Yes| G[Check expiration date on card]\n    F -->|No| H{Recent missed payment?}\n    H -->|Yes| I[Card may be frozen due to delinquency]\n    H -->|No| J[Check if card is locked in mobile app]\n    C --> K[Call bank's fraud department to verify]\n    E --> L[Wait until tomorrow or request limit increase]\n    G --> M[Request replacement card]\n    I --> N[Make payment to unfreeze card]\n    J --> O[Unlock card in app]\n    K --> P[Bank removes fraud hold, retry transaction]\n    L --> P\n    M --> P\n    N --> P\n    O --> P",
    "expanded_text": "When a credit card is declined despite having sufficient funds, several issues could be the cause. First, the user should consider whether the purchase is unusual—if the location or amount is atypical, the bank may have triggered a fraud alert. In that case, the user must call the bank's fraud department to verify the transaction, after which the hold will be removed. If the purchase is normal, the user should check whether they have exceeded their daily spending limit (typically $5,000); if so, they can wait until the next day or request a limit increase. If the card has expired, they need to request a replacement. If they have missed a recent payment, the card may be frozen due to delinquency; making a payment will unfreeze it. Finally, many mobile banking apps allow users to manually lock their card; the user should check if the card is locked and unlock it via the app.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["conditional branches", "troubleshooting flow", "fraud detection", "limits and locks"]
    }
  },
  {
    "input_text": "How do I get a replacement social security card? Can I do it online? What documents do I need? How long does it take?",
    "mermaid": "graph TD\n    A[User needs replacement Social Security card] --> B{Has state-issued driver's license or ID?}\n    B -->|Yes| C{User lives in eligible state?}\n    C -->|Yes| D[Apply online at ssa.gov]\n    C -->|No| E[Print application form SS-5]\n    B -->|No| F[No online option - must visit local office]\n    E --> G[Submit form with original/certified birth certificate]\n    F --> H[Bring birth certificate and any other ID to SSA office]\n    D --> I[Verification takes 2-3 business days]\n    I --> J[Card mailed within 14 days]\n    G --> J\n    H --> J\n    J --> K[Receive replacement card]\n    K --> L[Limit: 10 replacement cards per lifetime, 3 per year]",
    "expanded_text": "To get a replacement Social Security card, the user first checks whether they have a state-issued driver's license or ID. If they do, and they live in an eligible state, they can apply online at ssa.gov. If they have an ID but live in a non-eligible state, they must print Form SS-5 and submit it along with an original or certified copy of their birth certificate. If the user does not have a driver's license or state ID, online application is not available; they must visit a local Social Security office in person, bringing a birth certificate and any other acceptable identification. Online verification takes 2-3 business days. Regardless of the application method, the replacement card is mailed and arrives within 14 days. Users should be aware of replacement limits: only 10 cards per lifetime and no more than 3 per calendar year.",
    "metadata": {
      "domain": "legal",
      "complexity": "low",
      "graph_features": ["conditional branches", "eligibility gates (ID, state)", "online vs offline paths", "limits"]
    }
  },
  {
    "input_text": "My car won't start. Is it the battery, alternator, or starter? How can I tell without a mechanic?",
    "mermaid": "graph TD\n    A[Car won't start] --> B{Headlights dim or no power at all?}\n    B -->|Yes| C[Likely dead battery]\n    B -->|No| D{Clicking sound when turning key?}\n    D -->|Yes| E[Likely starter issue]\n    D -->|No| F{Car starts but dies while driving?}\n    F -->|Yes| G[Likely alternator issue]\n    F -->|No| H[Check other causes: fuel, spark plugs]\n    C --> I[Jump start car]\n    I --> J{Car starts with jump?}\n    J -->|Yes| K[Battery needs replacement or charging]\n    J -->|No| L[Battery terminals corroded or different issue]\n    E --> M[Tap starter with tool while turning key]\n    M --> N{Tapping helps?}\n    N -->|Yes| O[Starter failing - replace soon]\n    N -->|No| P[Electrical or other issue]\n    G --> Q[Check dashboard battery light while driving]\n    Q --> R{Light stays on?}\n    R -->|Yes| S[Alternator not charging - replace]\n    R -->|No| T[Get full electrical system test]",
    "expanded_text": "When a car won't start, the user can diagnose the likely cause without a mechanic. First, check if headlights are dim or there is no electrical power at all. If yes, the battery is likely dead. If headlights are bright, listen for a clicking sound when turning the key: a rapid clicking suggests a starter issue. If the car starts but later dies while driving, the alternator is likely failing. For a dead battery, attempt a jump start; if the car starts with a jump, the battery needs replacement or charging. If it doesn't start even with a jump, check for corroded battery terminals. For a suspected starter issue, tap the starter with a tool while turning the key; if that helps, the starter is failing and needs replacement soon. For alternator issues, check whether the dashboard battery light stays on while driving; if so, the alternator is not charging properly and needs replacement. If none of these apply, the problem may be related to fuel, spark plugs, or other electrical issues requiring a mechanic.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["conditional branches", "diagnostic tree", "symptom-based triage", "temporary fixes (tap starter)"]
    }
  },
  {
    "input_text": "I want to apply for a mortgage. What factors affect my eligibility? Do I need 20% down payment? What credit score is required?",
    "mermaid": "graph TD\n    A[Apply for mortgage] --> B[Check credit score]\n    B --> C{Score >= 740?}\n    C -->|Yes| D[Best interest rates, 5% down possible]\n    C -->|No| E{Score 620-739?}\n    E -->|Yes| F[Qualified, but higher interest rate]\n    E -->|No| G{Score 580-619?}\n    G -->|Yes| H[May need FHA loan with 10% down]\n    G -->|No| I[Not eligible - improve credit first]\n    D --> J[Calculate debt-to-income ratio]\n    F --> J\n    H --> J\n    J --> K{DTI <= 43%?}\n    K -->|Yes| L[Eligible for conventional loan]\n    K -->|No| M{DTI 43-50%?}\n    M -->|Yes| N[Possible with compensating factors (large savings, job tenure)]\n    M -->|No| O[Too much debt - reduce DTI first]\n    L --> P{Down payment amount?}\n    N --> P\n    P -->|< 20%| Q[Need private mortgage insurance (PMI)]\n    P -->|>= 20%| R[No PMI required]\n    Q --> S[Loan approved]\n    R --> S",
    "expanded_text": "When applying for a mortgage, several factors determine eligibility and terms. Credit score is the first gate: scores of 740 or above qualify for the best interest rates and may allow as little as 5% down. Scores between 620 and 739 qualify but at higher interest rates. Scores between 580 and 619 may qualify for an FHA loan with 10% down. Scores below 580 are generally ineligible. Next, the debt-to-income ratio (DTI) is evaluated. A DTI of 43% or lower is ideal for conventional loans. A DTI between 43% and 50% may still qualify with compensating factors such as a large savings balance or long job tenure. A DTI above 50% is likely too high. Finally, the down payment amount affects whether private mortgage insurance (PMI) is required: down payments below 20% require PMI, while 20% or more does not.",
    "metadata": {
      "domain": "finance",
      "complexity": "high",
      "graph_features": ["conditional branches", "tiered thresholds (credit score, DTI, down payment)", "compensating factors", "PMI logic"]
    }
  },
  {
    "input_text": "How do I get a passport for the first time? Where do I go? What documents do I need? How long does it take? Can I expedite it?",
    "mermaid": "graph TD\n    A[First-time passport application] --> B[Gather documents: birth certificate, driver's license, passport photo]\n    B --> C{Fill out Form DS-11 online or print}\n    C --> D[Do NOT sign form yet]\n    D --> E[Find local acceptance facility: post office, library, courthouse]\n    E --> F[Appointment required?]\n    F -->|Yes| G[Schedule appointment online]\n    F -->|No| H[Walk in during hours]\n    G --> I[Bring documents and form to appointment]\n    H --> I\n    I --> J[Acceptance agent verifies identity and witnesses signature]\n    J --> K[Pay fees: application fee + execution fee]\n    K --> L{Travel within 3 weeks?}\n    L -->|Yes| M[Pay expedited fee + express shipping]\n    L -->|No| N[Standard processing]\n    M --> O[Processing time: 2-3 weeks]\n    N --> P[Processing time: 8-11 weeks]\n    O --> Q[Passport mailed to applicant]\n    P --> Q",
    "expanded_text": "To get a passport for the first time, the applicant first gathers required documents: an original or certified birth certificate, a driver's license or other government ID, and a passport photo meeting specific requirements. The applicant fills out Form DS-11 online or prints it, but does NOT sign it until instructed. Next, they locate an acceptance facility (such as a post office, library, or courthouse). Some facilities require an appointment; others allow walk-ins during posted hours. The applicant brings all documents and the unsigned form to the facility, where an acceptance agent verifies identity and witnesses the signature. Fees include an application fee and an execution fee. If the applicant needs to travel within 3 weeks, they can pay an expedited fee plus express shipping for 2-3 week processing; otherwise, standard processing takes 8-11 weeks. The passport is then mailed directly to the applicant.",
    "metadata": {
      "domain": "legal",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches (appointment needed, expedite)", "document preparation"]
    }
  },
  {
    "input_text": "My phone is running slow. Should I clear cache, delete apps, or factory reset? What order should I try these in?",
    "mermaid": "graph TD\n    A[Phone running slow] --> B[Step 1: Restart phone]\n    B --> C{Still slow?}\n    C -->|No| D[Problem solved]\n    C -->|Yes| E[Step 2: Clear app cache for each app or system cache partition]\n    E --> F{Still slow?}\n    F -->|No| D\n    F -->|Yes| G[Step 3: Check storage space]\n    G --> H{Storage > 90% full?}\n    H -->|Yes| I[Delete unused apps, old photos, downloaded files]\n    H -->|No| J[Step 4: Check for OS updates]\n    I --> K{Still slow?}\n    K -->|No| D\n    K -->|Yes| J\n    J --> L{Update available?}\n    L -->|Yes| M[Install OS update]\n    L -->|No| N[Step 5: Factory reset as last resort]\n    M --> O{Still slow?}\n    O -->|No| D\n    O -->|Yes| N\n    N --> P[Backup data first, then reset]\n    P --> Q[Restore only necessary apps, test performance]",
    "expanded_text": "When a phone is running slow, the user should try solutions in a specific order, from least to most disruptive. Step 1: Restart the phone. This clears temporary system states and often resolves slowdowns. Step 2: Clear app cache, either per app or via the system cache partition (on Android). Step 3: Check storage space. If storage is more than 90% full, delete unused apps, old photos, and downloaded files to free up space. Step 4: Check for operating system updates; installing the latest OS can improve performance. Step 5: If all else fails, perform a factory reset. Before resetting, back up all important data. After the reset, restore only essential apps and test performance. Factory reset is a last resort because it erases all personal data and settings.",
    "metadata": {
      "domain": "daily life",
      "complexity": "low",
      "graph_features": ["sequential flows", "conditional branches", "ordered troubleshooting (least to most destructive)", "backup requirement for reset"]
    }
  },
  {
    "input_text": "The multinational retail company experienced declining profits despite increased online traffic. Executives suspected the issue was caused by abandoned shopping carts, delayed shipping times, and inconsistent regional pricing. The analytics team began monitoring customer journeys across the website, while logistics managers reviewed warehouse fulfillment speeds in parallel. Customers abandoning carts received automated discount emails within 24 hours. If shipping delays exceeded internal targets, orders were rerouted to alternative warehouses with available inventory. Meanwhile, pricing analysts compared competitor pricing daily and adjusted regional discounts automatically. Weekly executive reviews evaluated whether profit margins improved. If profitability continued falling for two consecutive quarters, the company planned to restructure underperforming regions and reduce operational costs.",
    "mermaid": "flowchart TD\n    A[Detect Declining Retail Profits] --> B[Analyze Potential Causes]\n    B --> C[Monitor Customer Website Journeys]\n    B --> D[Review Warehouse Fulfillment Speeds]\n    B --> E[Analyze Regional Pricing Competitiveness]\n    C --> F{Customer Abandons Cart?}\n    F -- Yes --> G[Send Automated Discount Email]\n    D --> H{Shipping Delays Exceed Targets?}\n    H -- Yes --> I[Reroute Orders to Alternative Warehouses]\n    E --> J[Compare Competitor Pricing]\n    J --> K[Adjust Regional Discounts]\n    G --> L[Track Conversion Recovery]\n    I --> M[Improve Delivery Performance]\n    K --> N[Monitor Regional Sales Impact]\n    L --> O[Weekly Executive Profitability Review]\n    M --> O\n    N --> O\n    O --> P{Profit Margins Improving?}\n    P -- Yes --> Q[Continue Optimization Strategy]\n    P -- No --> R{Decline Continues for Two Quarters?}\n    R -- No --> B\n    R -- Yes --> S[Restructure Underperforming Regions]\n    S --> T[Reduce Operational Costs]",
    "expanded_text": "The retail company responds to declining profitability through multiple parallel investigations and interventions. Customer behavior analytics identify abandoned carts, triggering automated recovery campaigns. Logistics teams optimize fulfillment by rerouting delayed shipments to faster warehouses. Pricing analysts continuously compare regional prices against competitors and apply discount adjustments dynamically. Executive leadership reviews aggregated performance metrics weekly. If profitability does not improve over multiple quarters, large-scale restructuring and cost reduction measures are initiated.",
    "metadata": {
      "domain": "business",
      "complexity": "very high",
      "graph_features": ["parallel workflows", "feedback loops", "executive decision-making", "automation", "long-term escalation"]
    }
  },
  {
    "input_text": "The hospital network implemented an AI-assisted patient monitoring system across intensive care units. Wearable devices streamed heart rate, oxygen, and blood pressure data into a central platform. AI models continuously analyzed patient stability scores. Mild anomalies triggered nurse notifications, while severe anomalies automatically alerted emergency physicians and reserved ICU equipment. If communication with a wearable device failed, backup bedside monitors activated automatically. Hospital administrators also reviewed weekly false-positive rates from the AI system. Excessive false alarms required retraining the prediction model using updated patient datasets before redeployment.",
    "mermaid": "flowchart TD\n    A[Collect Patient Vital Data] --> B[Stream Data to Central Monitoring Platform]\n    B --> C[AI Analyzes Stability Scores]\n    C --> D{Mild Anomaly Detected?}\n    D -- Yes --> E[Notify Nursing Staff]\n    C --> F{Severe Anomaly Detected?}\n    F -- Yes --> G[Alert Emergency Physicians]\n    G --> H[Reserve ICU Equipment]\n    B --> I{Wearable Communication Failure?}\n    I -- Yes --> J[Activate Backup Bedside Monitors]\n    E --> K[Continue Monitoring Patient]\n    H --> K\n    J --> K\n    K --> L[Review Weekly AI False-Positive Rates]\n    L --> M{False Alarms Excessive?}\n    M -- No --> N[Maintain Current AI Model]\n    M -- Yes --> O[Retrain AI Prediction Model]\n    O --> P[Validate Updated Patient Datasets]\n    P --> Q[Redeploy AI Monitoring System]",
    "expanded_text": "The hospital uses AI-assisted monitoring to continuously evaluate ICU patient conditions. Wearable devices stream live medical data into centralized systems that assess patient stability. Minor anomalies generate nurse alerts, while severe emergencies escalate directly to physicians and equipment reservation systems. Backup monitoring systems maintain continuity during hardware failures. Administrators also monitor AI reliability metrics, retraining models whenever false alarms become excessive to improve diagnostic accuracy.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "very high",
      "graph_features": ["AI-assisted monitoring", "parallel emergency workflows", "redundancy systems", "model retraining loop"]
    }
  },
  {
    "input_text": "A global cybersecurity firm discovered coordinated ransomware attacks targeting multiple client organizations simultaneously. Security analysts isolated compromised systems while automated scripts disabled lateral network movement. Backup restoration procedures began immediately for unaffected infrastructure. Clients with outdated backups entered emergency recovery mode, requiring forensic investigation before restoration. Threat intelligence teams compared attack signatures with previous incidents to identify the ransomware group responsible. Once attribution confidence exceeded internal thresholds, legal teams coordinated with law enforcement agencies and distributed mitigation advisories to all clients worldwide.",
    "mermaid": "flowchart TD\n    A[Detect Coordinated Ransomware Attacks] --> B[Isolate Compromised Systems]\n    A --> C[Disable Lateral Network Movement]\n    A --> D[Initiate Backup Restoration]\n    D --> E{Backups Up-to-Date?}\n    E -- Yes --> F[Restore Affected Infrastructure]\n    E -- No --> G[Enter Emergency Recovery Mode]\n    G --> H[Conduct Forensic Investigation]\n    H --> I[Attempt Secure Restoration]\n    B --> J[Collect Threat Intelligence]\n    J --> K[Compare Attack Signatures]\n    K --> L{Attribution Confidence High?}\n    L -- No --> J\n    L -- Yes --> M[Coordinate with Legal Teams]\n    M --> N[Notify Law Enforcement Agencies]\n    N --> O[Distribute Global Mitigation Advisories]",
    "expanded_text": "The cybersecurity firm responds to widespread ransomware attacks through simultaneous containment, restoration, and intelligence operations. Infected systems are isolated while network spread is blocked automatically. Recovery depends on backup quality, with outdated systems requiring deeper forensic analysis before restoration. Threat intelligence teams investigate attack signatures to identify the responsible group. Once attribution becomes reliable, the organization coordinates legal and law enforcement responses while warning clients globally.",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "very high",
      "graph_features": ["parallel incident response", "forensic workflows", "threat attribution", "global coordination"]
    }
  },
  {
    "input_text": "The autonomous vehicle fleet used by the logistics company relied on real-time traffic analysis, weather forecasting, and warehouse scheduling systems. Delivery routes were recalculated continuously based on congestion levels and battery status. Vehicles approaching low battery thresholds were redirected to charging stations with the shortest estimated wait times. Severe weather alerts triggered temporary speed restrictions and rerouting around high-risk regions. If delivery delays exceeded contractual limits, customer support teams proactively contacted affected clients while compensation credits were calculated automatically.",
    "mermaid": "flowchart TD\n    A[Monitor Delivery Fleet Operations] --> B[Analyze Real-Time Traffic]\n    A --> C[Analyze Vehicle Battery Status]\n    A --> D[Monitor Weather Forecasts]\n    B --> E[Recalculate Delivery Routes]\n    C --> F{Battery Below Threshold?}\n    F -- Yes --> G[Redirect to Fastest Charging Station]\n    D --> H{Severe Weather Alert?}\n    H -- Yes --> I[Apply Speed Restrictions]\n    I --> J[Reroute Around High-Risk Areas]\n    E --> K[Track Delivery Times]\n    G --> K\n    J --> K\n    K --> L{Contractual Delay Limit Exceeded?}\n    L -- No --> M[Complete Deliveries Normally]\n    L -- Yes --> N[Notify Customer Support Teams]\n    N --> O[Contact Affected Customers]\n    O --> P[Calculate Compensation Credits]",
    "expanded_text": "The logistics company manages autonomous deliveries through constant optimization using traffic, weather, and battery data. Vehicles dynamically reroute to avoid congestion and charging delays. Dangerous weather conditions enforce operational safety restrictions. Customer service workflows activate automatically when delays violate contractual agreements, ensuring proactive communication and compensation management.",
    "metadata": {
      "domain": "logistics",
      "complexity": "very high",
      "graph_features": ["real-time optimization", "parallel monitoring systems", "dynamic rerouting", "automated compensation"]
    }
  },
  {
    "input_text": "The game studio launched a massive online expansion update that introduced new regions, multiplayer raids, and player-driven economies. Server infrastructure scaled automatically based on player concurrency, while anti-cheat systems monitored unusual trading behavior. Players flagged for suspicious economic activity were temporarily restricted from marketplace access pending investigation. Community managers monitored social media sentiment and prioritized bug reports based on severity and player impact. If server crashes exceeded tolerance thresholds during peak hours, emergency maintenance windows were deployed immediately and rollback patches were prepared.",
    "mermaid": "flowchart TD\n    A[Launch Online Expansion Update] --> B[Monitor Player Concurrency]\n    B --> C[Scale Server Infrastructure Automatically]\n    A --> D[Monitor Player Marketplace Activity]\n    D --> E{Suspicious Trading Behavior Detected?}\n    E -- Yes --> F[Restrict Marketplace Access]\n    F --> G[Investigate Economic Exploits]\n    A --> H[Monitor Social Media Sentiment]\n    H --> I[Prioritize Bug Reports]\n    I --> J{Critical Bug Severity?}\n    J -- Yes --> K[Deploy Emergency Fixes]\n    B --> L{Server Crashes Exceed Threshold?}\n    L -- Yes --> M[Initiate Emergency Maintenance]\n    M --> N[Prepare Rollback Patches]\n    L -- No --> O[Continue Live Operations]",
    "expanded_text": "The online game expansion requires simultaneous infrastructure scaling, anti-cheat enforcement, and live community management. Server resources scale automatically according to player demand. Economic systems are monitored for exploitative behavior, triggering restrictions and investigations when suspicious activity appears. Community sentiment and bug reports influence operational priorities. Severe technical instability leads to emergency maintenance and rollback preparation.",
    "metadata": {
      "domain": "gaming",
      "complexity": "very high",
      "graph_features": ["live service management", "real-time monitoring", "anti-cheat systems", "infrastructure scaling"]
    }
  },
  {
    "input_text": "The pharmaceutical research company accelerated vaccine development during a rapidly spreading outbreak. Research teams conducted molecular simulations while manufacturing divisions prepared production facilities in parallel. Early trial participants were monitored continuously for adverse reactions. Severe reactions paused enrollment automatically pending safety review board decisions. Supply chain teams simultaneously negotiated raw material contracts to prevent shortages during global distribution. Regulatory approval triggered immediate mass production and international shipping coordination.",
    "mermaid": "flowchart TD\n    A[Start Accelerated Vaccine Development] --> B[Conduct Molecular Simulations]\n    A --> C[Prepare Manufacturing Facilities]\n    B --> D[Begin Clinical Trials]\n    D --> E[Monitor Trial Participants]\n    E --> F{Severe Adverse Reactions Detected?}\n    F -- Yes --> G[Pause Trial Enrollment]\n    G --> H[Conduct Safety Review Board Evaluation]\n    H --> I{Approved to Continue?}\n    I -- Yes --> D\n    I -- No --> J[Terminate Vaccine Program]\n    C --> K[Negotiate Raw Material Contracts]\n    K --> L[Prepare Global Distribution Logistics]\n    D --> M{Regulatory Approval Granted?}\n    M -- Yes --> N[Begin Mass Production]\n    N --> O[Coordinate International Shipping]",
    "expanded_text": "The pharmaceutical company accelerates vaccine development by running research, manufacturing preparation, and supply chain planning simultaneously. Clinical trials include continuous safety monitoring, with severe reactions triggering regulatory pauses and review board evaluations. Once regulatory approval is granted, large-scale production and global distribution operations begin immediately.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "very high",
      "graph_features": ["parallel operations", "regulatory workflows", "safety monitoring", "global logistics"]
    }
  },
  {
    "input_text": "The AI-powered hiring platform evaluated job applicants using resume analysis, coding assessments, and behavioral interviews. Bias detection systems continuously audited recommendation patterns across demographic groups. Applicants rejected automatically could request human review, triggering manual recruiter evaluations. Companies using the platform also received predictive retention scores for candidates based on historical employment patterns. If hiring outcomes showed significant fairness disparities, the recommendation models were retrained using adjusted weighting strategies and updated datasets.",
    "mermaid": "flowchart TD\n    A[Receive Job Applications] --> B[Analyze Resumes with AI]\n    B --> C[Conduct Coding Assessments]\n    C --> D[Perform Behavioral Interviews]\n    D --> E[Generate Candidate Recommendations]\n    E --> F[Audit Recommendations for Bias]\n    F --> G{Fairness Disparities Detected?}\n    G -- No --> H[Provide Hiring Recommendations to Companies]\n    G -- Yes --> I[Retrain Recommendation Models]\n    I --> J[Adjust Model Weighting Strategies]\n    J --> K[Deploy Updated AI Models]\n    E --> L{Applicant Rejected Automatically?}\n    L -- Yes --> M[Allow Human Review Request]\n    M --> N[Manual Recruiter Evaluation]\n    H --> O[Generate Predictive Retention Scores]",
    "expanded_text": "The AI hiring platform combines automated resume screening, coding evaluations, and behavioral assessments to recommend candidates. Fairness auditing systems continuously analyze demographic outcomes for bias. Applicants rejected by automation may request manual human review. Employers also receive predictive retention insights. Significant fairness issues trigger retraining of recommendation models using updated weighting and datasets.",
    "metadata": {
      "domain": "AI systems",
      "complexity": "very high",
      "graph_features": ["AI decision systems", "bias auditing", "human-in-the-loop review", "predictive analytics"]
    }
  },
  {
    "input_text": "The international airline alliance coordinated thousands of daily flights across multiple countries. Weather systems, air traffic restrictions, crew schedules, and aircraft maintenance statuses were analyzed continuously. Delayed flights automatically triggered passenger rebooking workflows and hotel voucher calculations for overnight disruptions. Crew shortages caused reserve staff activation, while severe mechanical failures grounded aircraft until engineering teams completed inspections and regulatory approvals.",
    "mermaid": "flowchart TD\n    A[Coordinate International Flight Operations] --> B[Monitor Weather Systems]\n    A --> C[Monitor Air Traffic Restrictions]\n    A --> D[Track Crew Schedules]\n    A --> E[Monitor Aircraft Maintenance Status]\n    B --> F[Adjust Flight Schedules]\n    C --> F\n    D --> G{Crew Shortage Detected?}\n    G -- Yes --> H[Activate Reserve Crew Staff]\n    E --> I{Mechanical Failure Detected?}\n    I -- Yes --> J[Ground Aircraft]\n    J --> K[Engineering Inspection]\n    K --> L[Regulatory Approval Review]\n    F --> M{Flight Delay Occurring?}\n    M -- Yes --> N[Trigger Passenger Rebooking]\n    N --> O[Calculate Hotel Vouchers]\n    M -- No --> P[Continue Standard Flight Operations]",
    "expanded_text": "The airline alliance manages flight operations through continuous coordination of weather, staffing, maintenance, and traffic systems. Delays and disruptions automatically trigger customer support processes such as rebooking and compensation. Crew shortages activate reserve staffing plans, while severe technical issues ground aircraft until inspections and regulatory approvals are completed.",
    "metadata": {
      "domain": "transportation",
      "complexity": "very high",
      "graph_features": ["multi-system coordination", "automated customer workflows", "regulatory compliance", "parallel monitoring"]
    }
  },
  {
    "input_text": "The national power grid operator balanced renewable energy sources, fossil fuel plants, and battery storage facilities during periods of unstable electricity demand. AI forecasting systems predicted hourly consumption patterns while weather models estimated solar and wind output. Unexpected drops in renewable generation triggered backup power plants automatically. Excess renewable energy charged battery reserves for later usage. Critical shortages forced rolling blackout decisions prioritized to minimize disruption to hospitals and emergency infrastructure.",
    "mermaid": "flowchart TD\n    A[Monitor National Electricity Demand] --> B[Forecast Consumption Patterns with AI]\n    A --> C[Estimate Renewable Energy Output]\n    C --> D{Renewable Output Stable?}\n    D -- Yes --> E[Balance Grid Normally]\n    D -- No --> F[Activate Backup Power Plants]\n    E --> G{Excess Renewable Energy Available?}\n    G -- Yes --> H[Charge Battery Storage Facilities]\n    G -- No --> I[Continue Energy Distribution]\n    F --> J{Critical Energy Shortage?}\n    J -- Yes --> K[Initiate Rolling Blackout Decisions]\n    K --> L[Prioritize Hospitals and Emergency Infrastructure]\n    J -- No --> I",
    "expanded_text": "The national power grid uses AI forecasting and renewable energy estimation to stabilize electricity distribution. Backup power plants compensate for unstable renewable output, while surplus energy charges battery reserves. During severe shortages, rolling blackouts are strategically managed to protect critical infrastructure such as hospitals and emergency services.",
    "metadata": {
      "domain": "energy infrastructure",
      "complexity": "very high",
      "graph_features": ["AI forecasting", "resource balancing", "critical infrastructure prioritization", "automated failover"]
    }
  },
  {
    "input_text": "The multinational social media platform faced coordinated misinformation campaigns during a major election period. AI moderation systems flagged suspicious content clusters while human fact-checkers reviewed high-visibility posts. Accounts repeatedly sharing manipulated media were temporarily restricted pending investigation. Trusted government and news organizations received priority escalation channels for reporting viral misinformation. Platform executives monitored public trust metrics daily. If misinformation spread accelerated despite mitigation efforts, emergency policy restrictions reduced content amplification and limited recommendation algorithms temporarily.",
    "mermaid": "flowchart TD\n    A[Monitor Platform During Election Period] --> B[AI Detects Suspicious Content Clusters]\n    B --> C[Human Fact-Checkers Review High-Visibility Posts]\n    C --> D{Manipulated Media Confirmed?}\n    D -- Yes --> E[Restrict Offending Accounts]\n    E --> F[Investigate Coordinated Campaigns]\n    A --> G[Receive Reports from Trusted Organizations]\n    G --> H[Prioritize Escalated Misinformation Cases]\n    F --> I[Track Public Trust Metrics]\n    H --> I\n    I --> J{Misinformation Spread Accelerating?}\n    J -- No --> K[Continue Standard Moderation]\n    J -- Yes --> L[Reduce Content Amplification]\n    L --> M[Temporarily Limit Recommendation Algorithms]",
    "expanded_text": "The social media platform combines AI detection systems and human fact-checking to combat election misinformation campaigns. Accounts spreading manipulated media are restricted while coordinated campaigns are investigated. Trusted institutions receive faster escalation channels for reporting dangerous content. Platform leadership continuously monitors public trust indicators, escalating moderation policies if misinformation spreads faster than mitigation systems can contain it.",
    "metadata": {
      "domain": "social media governance",
      "complexity": "very high",
      "graph_features": ["AI-human collaboration", "content moderation", "escalation policies", "trust monitoring"]
    }
  },
  {
    "input_text": "The global semiconductor manufacturer faced severe production instability after geopolitical tensions disrupted raw material exports. Procurement teams searched for alternative suppliers while factory managers adjusted production schedules to prioritize high-demand chips used in medical devices and automotive systems. AI forecasting models estimated future shortages based on customer orders and shipping delays. Factories with insufficient materials entered reduced-capacity mode automatically. Enterprise clients received transparent delivery risk reports weekly, while executive teams evaluated whether emergency acquisitions or strategic partnerships were necessary to stabilize long-term supply chains.",
    "mermaid": "flowchart TD\n    A[Detect Raw Material Supply Disruption] --> B[Search for Alternative Suppliers]\n    A --> C[Analyze Customer Demand Priorities]\n    C --> D[Prioritize Medical and Automotive Chips]\n    A --> E[Run AI Shortage Forecasting Models]\n    E --> F[Estimate Future Supply Risks]\n    B --> G{Sufficient Materials Available?}\n    G -- Yes --> H[Continue Standard Manufacturing]\n    G -- No --> I[Activate Reduced-Capacity Production]\n    I --> J[Adjust Factory Schedules]\n    F --> K[Generate Delivery Risk Reports]\n    K --> L[Notify Enterprise Clients]\n    L --> M[Executive Supply Chain Review]\n    M --> N{Long-Term Stability Threatened?}\n    N -- Yes --> O[Evaluate Acquisitions and Partnerships]\n    N -- No --> P[Continue Supply Optimization]",
    "expanded_text": "The semiconductor manufacturer responds to geopolitical supply disruptions through simultaneous procurement, forecasting, and production optimization strategies. Alternative suppliers are evaluated while critical industries receive manufacturing priority. AI systems forecast shortages and delivery risks, allowing enterprise customers to prepare for delays. Long-term instability may trigger strategic acquisitions or partnerships to secure future supply resilience.",
    "metadata": {
      "domain": "manufacturing",
      "complexity": "very high",
      "graph_features": ["AI forecasting", "resource prioritization", "parallel operations", "executive escalation"]
    }
  },
  {
    "input_text": "The smart city transportation platform coordinated traffic lights, public transit systems, emergency vehicle routing, and pedestrian monitoring in real time. AI systems predicted congestion hotspots using live camera feeds and historical commuting patterns. Traffic signals dynamically adjusted timing to reduce bottlenecks, while emergency vehicles automatically received green-light priority along optimized routes. Transit delays triggered automatic schedule updates in commuter mobile apps. During severe accidents, nearby intersections entered restricted traffic mode while emergency dispatch teams coordinated ambulance access and crowd management.",
    "mermaid": "flowchart TD\n    A[Monitor Smart City Transportation Network] --> B[Analyze Live Traffic Data]\n    B --> C[Predict Congestion Hotspots with AI]\n    C --> D[Adjust Traffic Signal Timing]\n    A --> E[Monitor Emergency Vehicle Requests]\n    E --> F[Grant Green-Light Priority]\n    F --> G[Optimize Emergency Routes]\n    A --> H[Track Public Transit Schedules]\n    H --> I{Transit Delay Detected?}\n    I -- Yes --> J[Update Commuter Mobile Apps]\n    B --> K{Severe Accident Detected?}\n    K -- Yes --> L[Activate Restricted Traffic Mode]\n    L --> M[Coordinate Ambulance Access]\n    M --> N[Manage Nearby Crowds]\n    K -- No --> O[Continue Standard Operations]",
    "expanded_text": "The smart city platform integrates AI traffic prediction, emergency response coordination, and public transit management into a unified system. Traffic lights adapt dynamically to congestion, emergency vehicles receive routing priority, and commuter applications update automatically during delays. Major accidents trigger emergency traffic restrictions and coordinated rescue operations.",
    "metadata": {
      "domain": "urban infrastructure",
      "complexity": "very high",
      "graph_features": ["real-time optimization", "AI prediction", "parallel emergency workflows", "adaptive control systems"]
    }
  },
  {
    "input_text": "The cloud computing provider experienced a cascading outage after a regional data center lost power during a cooling system malfunction. Automated failover systems redirected workloads to backup regions while engineers investigated overheating servers. Priority services such as healthcare platforms and banking APIs received dedicated resource reservations to minimize downtime. Customers were notified through status dashboards and incident alerts. If failover capacity approached operational limits, non-essential workloads were throttled temporarily until infrastructure stability was restored.",
    "mermaid": "flowchart TD\n    A[Regional Data Center Failure] --> B[Activate Automated Failover Systems]\n    B --> C[Redirect Workloads to Backup Regions]\n    A --> D[Investigate Cooling System Malfunction]\n    D --> E[Inspect Overheating Servers]\n    C --> F[Reserve Resources for Critical Services]\n    F --> G[Maintain Healthcare and Banking APIs]\n    C --> H[Update Customer Status Dashboards]\n    H --> I[Send Incident Alerts]\n    C --> J{Failover Capacity Near Limit?}\n    J -- Yes --> K[Throttle Non-Essential Workloads]\n    K --> L[Restore Infrastructure Stability]\n    J -- No --> M[Continue Failover Operations]",
    "expanded_text": "The cloud provider handles a cascading infrastructure outage through automated failover and resource prioritization. Backup regions absorb workloads while engineering teams investigate the root cause. Essential services receive protected resources, and customers receive transparent communication through status systems. If backup capacity becomes strained, less important workloads are temporarily restricted until recovery completes.",
    "metadata": {
      "domain": "cloud infrastructure",
      "complexity": "very high",
      "graph_features": ["disaster recovery", "failover systems", "resource prioritization", "incident communication"]
    }
  },
  {
    "input_text": "The financial regulator detected unusual high-frequency trading patterns across several international exchanges. AI surveillance systems flagged synchronized trades potentially linked to market manipulation. Investigators correlated transaction timestamps, brokerage accounts, and communication records while freezing suspicious trading activity temporarily. Exchanges cooperating with the investigation received updated compliance directives. If evidence confirmed coordinated manipulation, penalties included license suspensions, criminal referrals, and mandatory transparency audits across affected institutions.",
    "mermaid": "flowchart TD\n    A[Detect Unusual Trading Patterns] --> B[AI Flags Suspicious Transactions]\n    B --> C[Correlate Timestamps and Brokerage Accounts]\n    C --> D[Analyze Communication Records]\n    D --> E{Potential Market Manipulation Confirmed?}\n    E -- No --> F[Continue Market Surveillance]\n    E -- Yes --> G[Freeze Suspicious Trading Activity]\n    G --> H[Issue Compliance Directives to Exchanges]\n    H --> I[Conduct Regulatory Investigation]\n    I --> J{Coordinated Manipulation Proven?}\n    J -- Yes --> K[Suspend Trading Licenses]\n    K --> L[Initiate Criminal Referrals]\n    L --> M[Enforce Transparency Audits]\n    J -- No --> F",
    "expanded_text": "The financial regulator uses AI surveillance to identify suspicious trading activity across global exchanges. Investigators analyze correlated trades and communication patterns to detect coordinated manipulation schemes. Confirmed violations trigger trading freezes, regulatory enforcement, criminal investigations, and institutional audits.",
    "metadata": {
      "domain": "finance",
      "complexity": "very high",
      "graph_features": ["AI surveillance", "regulatory escalation", "forensic analysis", "cross-institution coordination"]
    }
  },
  {
    "input_text": "The interplanetary research station orbiting Jupiter managed scientific experiments, radiation shielding systems, life-support infrastructure, and communication relays simultaneously. Radiation storms forced external drones to return automatically while non-essential experiments paused to conserve energy. Crew health monitoring systems continuously evaluated oxygen levels, stress indicators, and sleep quality. Critical life-support anomalies triggered emergency repair protocols and remote engineering consultations from Earth. Mission commanders also reviewed fuel reserves weekly to determine whether scientific missions needed reprioritization before the return launch window closed.",
    "mermaid": "flowchart TD\n    A[Operate Jupiter Research Station] --> B[Manage Scientific Experiments]\n    A --> C[Monitor Radiation Levels]\n    A --> D[Monitor Crew Health Systems]\n    A --> E[Track Fuel Reserves]\n    C --> F{Radiation Storm Detected?}\n    F -- Yes --> G[Recall External Drones]\n    G --> H[Pause Non-Essential Experiments]\n    D --> I{Life-Support Anomaly Detected?}\n    I -- Yes --> J[Activate Emergency Repair Protocols]\n    J --> K[Consult Earth Engineering Teams]\n    E --> L[Weekly Mission Commander Review]\n    L --> M{Fuel Reserves Sufficient?}\n    M -- No --> N[Reprioritize Scientific Missions]\n    M -- Yes --> O[Continue Mission Objectives]",
    "expanded_text": "The Jupiter research station coordinates scientific research, radiation safety, crew monitoring, and mission logistics simultaneously. Dangerous radiation conditions force drones to retreat and experiments to pause. Life-support anomalies trigger emergency repairs and remote consultation with Earth engineers. Fuel reserve management influences long-term mission prioritization before the station's return window expires.",
    "metadata": {
      "domain": "space operations",
      "complexity": "very high",
      "graph_features": ["multi-system coordination", "environmental hazard response", "life-support monitoring", "resource planning"]
    }
  },
  {
    "input_text": "The multinational pharmaceutical distributor tracked vaccine shipments requiring ultra-cold storage across hundreds of airports and medical facilities. IoT temperature sensors transmitted live data throughout transit. Temperature deviations triggered immediate rerouting to nearby refrigeration hubs and replacement shipment preparation. Customs clearance delays automatically notified regional logistics coordinators. Public health agencies received predictive inventory dashboards estimating shortages several weeks in advance using machine learning demand models.",
    "mermaid": "flowchart TD\n    A[Track Global Vaccine Shipments] --> B[Monitor IoT Temperature Sensors]\n    B --> C{Temperature Within Safe Range?}\n    C -- Yes --> D[Continue Shipment Transit]\n    C -- No --> E[Reroute to Refrigeration Hub]\n    E --> F[Prepare Replacement Shipment]\n    A --> G[Monitor Customs Clearance Status]\n    G --> H{Customs Delay Detected?}\n    H -- Yes --> I[Notify Regional Logistics Coordinators]\n    A --> J[Run Machine Learning Demand Forecasts]\n    J --> K[Generate Predictive Inventory Dashboards]\n    K --> L[Alert Public Health Agencies of Potential Shortages]",
    "expanded_text": "The pharmaceutical distributor uses IoT monitoring and predictive analytics to manage sensitive vaccine logistics globally. Temperature deviations trigger emergency rerouting and replacement preparation. Customs delays generate coordination alerts, while machine learning systems forecast shortages to help health agencies prepare proactively.",
    "metadata": {
      "domain": "healthcare logistics",
      "complexity": "very high",
      "graph_features": ["IoT monitoring", "predictive analytics", "global coordination", "automated rerouting"]
    }
  },
  {
    "input_text": "The autonomous underwater mining corporation deployed robotic extraction units to collect rare minerals from deep-sea volcanic regions. Environmental AI systems monitored oceanic ecosystem impact continuously while engineering teams analyzed pressure-related equipment stress. Excessive ecological disruption triggered temporary extraction suspensions and marine biologist reviews. Damaged robotic units surfaced automatically for repair while backup units replaced active operations. Government regulators audited environmental reports quarterly before approving expansion into new mining zones.",
    "mermaid": "flowchart TD\n    A[Deploy Underwater Mining Robots] --> B[Extract Rare Minerals]\n    A --> C[Monitor Ocean Ecosystem Impact]\n    A --> D[Analyze Equipment Stress Levels]\n    C --> E{Ecological Disruption Excessive?}\n    E -- Yes --> F[Suspend Extraction Operations]\n    F --> G[Conduct Marine Biology Review]\n    D --> H{Equipment Damage Detected?}\n    H -- Yes --> I[Surface Robots for Repair]\n    I --> J[Deploy Backup Robotic Units]\n    B --> K[Generate Quarterly Environmental Reports]\n    K --> L[Government Regulatory Audit]\n    L --> M{Expansion Approved?}\n    M -- Yes --> N[Expand Mining Zones]\n    M -- No --> O[Maintain Current Operations]",
    "expanded_text": "The underwater mining company balances mineral extraction with environmental monitoring and equipment safety systems. Ecological disruption triggers operational suspensions and scientific reviews. Damaged robots are replaced automatically to maintain productivity. Regulatory agencies evaluate environmental reports before approving future expansion.",
    "metadata": {
      "domain": "industrial robotics",
      "complexity": "very high",
      "graph_features": ["environmental governance", "autonomous operations", "regulatory oversight", "failover systems"]
    }
  },
  {
    "input_text": "The decentralized digital identity platform allowed users to authenticate across banking, healthcare, and government systems without sharing raw personal data. Blockchain verification nodes validated encrypted identity proofs while fraud detection AI monitored abnormal authentication patterns. Compromised credentials triggered immediate revocation workflows and multi-factor revalidation requirements. Government agencies periodically audited node operators to ensure compliance with privacy laws and cybersecurity regulations. User trust scores also influenced transaction verification speed dynamically.",
    "mermaid": "flowchart TD\n    A[User Requests Identity Authentication] --> B[Validate Encrypted Identity Proof]\n    B --> C[Blockchain Nodes Verify Credentials]\n    C --> D[Grant Cross-Platform Authentication]\n    C --> E[AI Monitors Authentication Patterns]\n    E --> F{Suspicious Activity Detected?}\n    F -- Yes --> G[Revoke Compromised Credentials]\n    G --> H[Require Multi-Factor Revalidation]\n    E --> I[Calculate Dynamic Trust Scores]\n    I --> J[Adjust Verification Speed]\n    A --> K[Government Compliance Audits]\n    K --> L[Review Node Operator Security Standards]",
    "expanded_text": "The decentralized identity platform combines blockchain verification, AI fraud monitoring, and privacy-preserving authentication. Suspicious activity triggers immediate credential revocation and stricter verification requirements. Trust scoring systems dynamically influence authentication efficiency, while regulators audit infrastructure operators for compliance.",
    "metadata": {
      "domain": "digital identity systems",
      "complexity": "very high",
      "graph_features": ["blockchain verification", "AI fraud detection", "dynamic trust systems", "regulatory auditing"]
    }
  },
  {
    "input_text": "The international disaster relief coalition coordinated drones, satellites, volunteer networks, and AI translation systems after a massive earthquake affected multiple countries simultaneously. Satellite imagery identified collapsed infrastructure while drones delivered medical supplies to isolated communities. AI translation services enabled volunteers from different countries to coordinate rescue efforts efficiently. Areas reporting severe shortages automatically received higher priority in supply allocation models. Political instability in certain regions required military escorts before humanitarian convoys could proceed safely.",
    "mermaid": "flowchart TD\n    A[Respond to Multi-Country Earthquake Disaster] --> B[Analyze Satellite Imagery]\n    B --> C[Identify Collapsed Infrastructure]\n    A --> D[Deploy Medical Supply Drones]\n    D --> E[Deliver Aid to Isolated Communities]\n    A --> F[Activate AI Translation Systems]\n    F --> G[Coordinate International Volunteers]\n    A --> H[Assess Regional Supply Shortages]\n    H --> I[Prioritize High-Risk Areas]\n    I --> J[Allocate Emergency Supplies]\n    J --> K{Political Instability Present?}\n    K -- Yes --> L[Request Military Escorts]\n    L --> M[Secure Humanitarian Convoys]\n    K -- No --> N[Proceed with Aid Deliveries]",
    "expanded_text": "The disaster relief coalition integrates satellite analysis, drone logistics, multilingual coordination, and dynamic supply prioritization during a large-scale earthquake response. AI translation improves international cooperation, while unstable regions require military-protected humanitarian operations.",
    "metadata": {
      "domain": "humanitarian operations",
      "complexity": "very high",
      "graph_features": ["international coordination", "AI-assisted communication", "priority allocation", "security escalation"]
    }
  },
  {
    "input_text": "The advanced educational platform personalized learning paths for millions of students using adaptive AI tutors. Student performance, attention patterns, and emotional engagement metrics were analyzed continuously during lessons. Students struggling repeatedly with concepts received simplified explanations, interactive simulations, and live tutoring escalation. Teachers monitored classroom analytics dashboards highlighting at-risk students. Educational researchers also audited model recommendations for socioeconomic bias and curriculum imbalance before approving major system updates for nationwide deployment.",
    "mermaid": "flowchart TD\n    A[Deliver Adaptive AI Learning Sessions] --> B[Analyze Student Performance]\n    A --> C[Monitor Attention and Emotional Engagement]\n    B --> D{Student Struggling Repeatedly?}\n    D -- Yes --> E[Provide Simplified Explanations]\n    E --> F[Launch Interactive Simulations]\n    F --> G[Escalate to Live Tutoring]\n    D -- No --> H[Continue Personalized Curriculum]\n    C --> I[Update Classroom Analytics Dashboards]\n    I --> J[Highlight At-Risk Students]\n    A --> K[Audit AI Recommendations for Bias]\n    K --> L{Socioeconomic Bias Detected?}\n    L -- Yes --> M[Adjust Curriculum Weighting]\n    M --> N[Validate Updated Models]\n    N --> O[Approve Nationwide Deployment]\n    L -- No --> O",
    "expanded_text": "The educational platform continuously adapts learning experiences using AI tutors and engagement analytics. Students facing repeated difficulties receive progressively more personalized interventions, including live tutoring. Teachers monitor risk indicators through analytics dashboards. Researchers audit the AI system for fairness before approving large-scale deployment updates.",
    "metadata": {
      "domain": "education technology",
      "complexity": "very high",
      "graph_features": ["adaptive AI learning", "emotional analytics", "human escalation", "bias auditing"]
    }
  },
  {
    "input_text": "I'm planning a vacation. Should I book flights first or hotels? What if I'm on a tight budget? What if I have flexible dates?",
    "mermaid": "graph TD\n    A[Plan vacation] --> B{Is budget the main constraint?}\n    B -->|Yes| C[Search flights first to find cheapest dates]\n    C --> D[Book flights once found]\n    D --> E[Search hotels for same dates]\n    B -->|No| F{Are dates flexible?}\n    F -->|Yes| G[Search hotels first for best deals]\n    G --> H[Book hotels once found]\n    H --> I[Search flights around hotel dates]\n    F -->|No| J[Dates fixed: search flights and hotels in parallel]\n    J --> K[Book whichever has limited availability first]\n    E --> L[Vacation booked]\n    I --> L\n    K --> L",
    "expanded_text": "When planning a vacation, the order of booking depends on priorities. If budget is the main constraint, search for flights first to identify the cheapest travel dates, book the flights, then search for hotels on those same dates. If dates are flexible but budget is less critical, search for hotels first to find the best deals, book the hotels, then search for flights that align with those dates. If dates are fixed and budget is not the primary concern, search for flights and hotels in parallel, then book whichever option has limited availability first to avoid missing out. In all cases, the goal is to balance cost and availability based on the traveler's specific constraints.",
    "metadata": {
      "domain": "daily life",
      "complexity": "low",
      "graph_features": ["conditional branches", "parallel tasks", "priority-based ordering"]
    }
  },
  {
    "input_text": "How does a blood pressure monitor work? What do the two numbers mean? When should I measure? How do I know if my reading is normal?",
    "mermaid": "graph TD\n    A[Blood pressure monitor inflates cuff] --> B[Cuff measures systolic pressure when heartbeat first heard]\n    B --> C[Cuff continues deflating, measures diastolic when heartbeat stops]\n    C --> D[Display shows systolic/diastolic, e.g., 120/80]\n    D --> E{Compare systolic to guidelines}\n    E -->|< 90| F[Low - consult doctor]\n    E -->|90-119| G[Normal - good]\n    E -->|120-139| H[Elevated - monitor lifestyle]\n    E -->|140+| I[High - consult doctor]\n    D --> J{Compare diastolic to guidelines}\n    J -->|< 60| K[Low - consult doctor]\n    J -->|60-79| G\n    J -->|80-89| H\n    J -->|90+| I\n    G --> L[Measure at same time each day, after resting 5 min]\n    H --> L\n    I --> L\n    F --> L\n    K --> L",
    "expanded_text": "A blood pressure monitor works by inflating a cuff around the upper arm and then slowly releasing pressure. The systolic pressure (top number) is measured when the heartbeat is first heard through the stethoscope or detected by the sensor. The diastolic pressure (bottom number) is measured when the heartbeat can no longer be heard. The two numbers together indicate blood pressure status. According to guidelines, systolic below 90 or diastolic below 60 is low; systolic 90-119 with diastolic 60-79 is normal; systolic 120-139 or diastolic 80-89 is elevated; systolic 140+ or diastolic 90+ is high. For accurate readings, measure at the same time each day, after resting quietly for 5 minutes, and consult a doctor for readings that are consistently low or high.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "low",
      "graph_features": ["sequential flows", "parallel comparisons (systolic and diastolic)", "threshold-based classification"]
    }
  },
  {
    "input_text": "I received a suspicious email claiming to be from my bank. How can I tell if it's phishing? Should I click the link? What if I already clicked?",
    "mermaid": "graph TD\n    A[Suspicious email received] --> B{Check sender email address domain}\n    B -->|Mismatches bank's official domain| C[Likely phishing]\n    B -->|Matches official domain| D{Check for generic greeting like 'Dear Customer'?}\n    D -->|Yes| C\n    D -->|No| E{Does email ask for password or SSN?}\n    E -->|Yes| C\n    E -->|No| F{Contains urgent threat like 'account closed'?}\n    F -->|Yes| C\n    F -->|No| G[Likely legitimate, but verify separately]\n    C --> H[Do NOT click any links]\n    H --> I[Report as phishing to bank and IT]\n    I --> J[Delete email]\n    G --> K[Call bank using number from official website, not email]\n    K --> L[Verify if email was legitimate]\n    H --> M{Already clicked link?}\n    M -->|Yes| N[Do NOT enter any information]\n    N --> O[Run antivirus scan on device]\n    O --> P[Change bank password from trusted device]\n    M -->|No| J",
    "expanded_text": "To determine if a suspicious email is phishing, first check the sender's email address domain. If it does not exactly match the bank's official domain, it is likely phishing. If the domain matches, check for generic greetings like 'Dear Customer' instead of your name. Also check if the email asks for sensitive information (password, Social Security number) or creates an urgent threat like 'Your account will be closed.' Any of these signs suggest phishing. Do NOT click any links in suspicious emails. Report the email as phishing to your bank and IT department, then delete it. If you already clicked a link, do not enter any information on the resulting page. Run an antivirus scan on your device and change your bank password from a trusted device (not the one used to click the link). To verify a legitimate-looking email, call your bank using a phone number from their official website (not from the email).",
    "metadata": {
      "domain": "cybersecurity",
      "complexity": "medium",
      "graph_features": ["conditional branches (multiple red flags)", "sequential checks", "remediation path if link clicked"]
    }
  },
  {
    "input_text": "How do I dispute a charge on my credit card? Do I call the merchant first or the bank? What documentation do I need? How long do I have?",
    "mermaid": "graph TD\n    A[Charge appears on credit card] --> B{Did you authorize this charge?}\n    B -->|Yes| C[Not a dispute - handle with merchant directly]\n    B -->|No| D{Have you contacted merchant first?}\n    D -->|No| E[Contact merchant to request refund/credit]\n    E --> F{Merchant resolves within 15 days?}\n    F -->|Yes| G[Dispute resolved, no bank action needed]\n    F -->|No| H[Proceed to bank dispute]\n    D -->|Yes| H\n    H --> I[Gather documentation: receipt, merchant contact log, statements]\n    I --> J[File dispute within 60 days of charge date]\n    J --> K[Bank issues provisional credit within 5 business days]\n    K --> L[Bank investigates for up to 90 days]\n    L --> M{Bank sides with you?}\n    M -->|Yes| N[Provisional credit becomes permanent]\n    M -->|No| O[Provisional credit reversed, you owe amount]",
    "expanded_text": "To dispute a credit card charge, first determine whether you authorized the charge. If yes, it is not a dispute; handle the issue directly with the merchant. If not, try contacting the merchant first to request a refund or credit. If the merchant resolves the issue within 15 days, no bank action is needed. If the merchant does not resolve the issue, or if you have already contacted them without success, proceed to dispute with the bank. Gather documentation including the receipt, any communication logs with the merchant, and account statements. File the dispute within 60 days of the charge date. The bank will issue a provisional credit to your account within 5 business days while they investigate. The investigation takes up to 90 days. If the bank sides with you, the provisional credit becomes permanent. If the bank sides with the merchant, the provisional credit is reversed and you owe the amount.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["sequential flows", "conditional branches", "time windows (15 days, 60 days, 90 days)", "provisional credit loop"]
    }
  },
  {
    "input_text": "My child has a fever and a rash. Should I take them to the ER, urgent care, or wait for the pediatrician? What signs are dangerous?",
    "mermaid": "graph TD\n    A[Child has fever and rash] --> B{Rash looks like small purple spots that don't fade when pressed?}\n    B -->|Yes| C[Go to ER immediately - possible meningitis]\n    B -->|No| D{Child has difficulty breathing or stiff neck?}\n    D -->|Yes| C\n    D -->|No| E{Age < 3 months with fever > 100.4°F?}\n    E -->|Yes| C\n    E -->|No| F{Child is lethargic or inconsolable?}\n    F -->|Yes| G[Go to urgent care today]\n    F -->|No| H{Rash is blistering or involves mouth/eyes?}\n    H -->|Yes| G\n    H -->|No| I[Call pediatrician for same-day appointment]\n    G --> J[Monitor for worsening over 24h]\n    I --> J\n    J --> K{Improvement?}\n    K -->|No| G\n    K -->|Yes| L[Follow up with pediatrician as scheduled]",
    "expanded_text": "When a child has a fever with a rash, parents should look for danger signs that require emergency care. Go to the ER immediately if the rash consists of small purple spots that do not fade when pressed (glass test), if the child has difficulty breathing or a stiff neck, or if the child is under 3 months old with a fever above 100.4°F. Go to urgent care if the child is lethargic or inconsolable, or if the rash involves blistering or spreads to the mouth or eyes. Otherwise, call the pediatrician for a same-day appointment. Monitor the child for worsening symptoms over 24 hours; if no improvement, go to urgent care. If the child improves, follow up with the pediatrician as scheduled.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["conditional branches (danger signs)", "triage levels (ER > urgent care > pediatrician)", "monitoring loop"]
    }
  },
  {
    "input_text": "How do I freeze my credit report? Why would I do that? Does it affect my credit score? How do I temporarily lift it?",
    "mermaid": "graph TD\n    A[Decide to freeze credit] --> B{Reason for freeze?}\n    B -->|Identity theft or data breach| C[Freeze recommended immediately]\n    B -->|Prevent unauthorized accounts| D[Freeze as preventive measure]\n    B -->|Planning to apply for credit soon| E[Do not freeze - use lock instead]\n    C --> F[Contact each bureau: Equifax, Experian, TransUnion]\n    D --> F\n    F --> G[Create account on each bureau's website]\n    G --> H[Request credit freeze - free by law]\n    H --> I[Receive unique PIN or password for each bureau]\n    I --> J[Credit frozen - no new accounts can be opened]\n    J --> K{Does freeze affect credit score?}\n    K -->|No| L[Score unchanged - existing accounts work normally]\n    J --> M{Need to apply for credit?}\n    M -->|Yes| N[Temporarily lift freeze using PIN]\n    N --> O{Choose lift duration}\n    O -->|Specific date range| P[Freeze auto-reinstates after date]\n    O -->|Single lender| Q[Provide temporary access to specific lender only]\n    J -->|No| R[Keep frozen indefinitely]",
    "expanded_text": "A credit freeze is recommended after identity theft or a data breach, or as a preventive measure to stop unauthorized accounts from being opened in your name. However, if you are planning to apply for credit soon, use a credit lock instead (which is faster to lift). To freeze your credit, contact each of the three major bureaus: Equifax, Experian, and TransUnion. Create an account on each website and request a freeze—it is free by law. You will receive a unique PIN or password for each bureau to manage the freeze. Once frozen, no new accounts can be opened in your name. Freezing your credit does NOT affect your credit score, and existing accounts (credit cards, loans) continue to work normally. When you need to apply for credit, temporarily lift the freeze using your PIN. You can lift it for a specific date range (after which it auto-reinstates) or provide temporary access to a single lender only. Otherwise, you can keep the freeze indefinitely.",
    "metadata": {
      "domain": "finance",
      "complexity": "medium",
      "graph_features": ["conditional branches (reason for freeze)", "parallel actions (3 bureaus)", "temporary lift options", "PIN management"]
    }
  },
  {
    "input_text": "I want to start a small business. Should I form an LLC, S-Corp, or sole proprietorship? What are the tax differences?",
    "mermaid": "graph TD\n    A[Start small business] --> B{Do you have significant personal assets to protect? (home, savings)}\n    B -->|Yes| C[Need liability protection - consider LLC or S-Corp]\n    B -->|No| D[Low liability risk - sole proprietorship is simplest]\n    C --> E{Do you expect > $60k annual profit?}\n    E -->|Yes| F[S-Corp can save on self-employment taxes]\n    E -->|No| G[LLC is simpler and sufficient]\n    F --> H[S-Corp: pay yourself reasonable salary, remainder as distribution]\n    H --> I[S-Corp saves ~15% on distributions vs self-employment tax]\n    G --> J[LLC: pay self-employment tax on all profit, but simple filing]\n    D --> K[Sole prop: simplest, no state filing fees, but unlimited liability]\n    K --> L[Report on Schedule C with personal tax return]\n    I --> M[File separate business tax return (1120-S)]\n    J --> N[LLC taxed as sole prop by default, or elect S-Corp]\n    N --> M\n    L --> O{Sell products with sales tax?}\n    J --> O\n    M --> O\n    O -->|Yes| P[Must register for sales tax permit in your state]\n    O -->|No| Q[No sales tax registration needed]",
    "expanded_text": "When starting a small business, the choice of structure depends on liability risk and expected profit. If you have significant personal assets to protect (home, savings), you need liability protection from an LLC or S-Corp. If you have few assets and low risk, a sole proprietorship is simplest. For those needing liability protection, if you expect more than $60,000 in annual profit, an S-Corp can save on self-employment taxes by allowing you to pay yourself a reasonable salary and take the remainder as distributions (saving about 15% on the distribution portion). If profit is below $60,000, an LLC is simpler and has less administrative burden. A sole proprietorship reports income on Schedule C with your personal tax return, but offers no liability protection. S-Corps require filing a separate business return (Form 1120-S). By default, an LLC is taxed as a sole proprietorship (if single-member) but can elect to be taxed as an S-Corp. If you sell physical products, you must register for a sales tax permit in your state regardless of structure.",
    "metadata": {
      "domain": "business",
      "complexity": "high",
      "graph_features": ["conditional branches (assets, profit threshold)", "tax comparison", "elective options", "sequential decisions"]
    }
  },
  {
    "input_text": "I want to buy a used car from a private seller. What should I check? Do I need a mechanic? How do I avoid scams?",
    "mermaid": "graph TD\n    A[Find used car from private seller] --> B{Check vehicle history report (Carfax) for salvage title or odometer rollback?}\n    B -->|Issues found| C[Walk away - too risky]\n    B -->|Clean history| D[Schedule in-person inspection]\n    D --> E[Bring a mechanic or pay for pre-purchase inspection]\n    E --> F{Mechanic finds major issues? (engine, transmission, frame damage)}\n    F -->|Yes| C\n    F -->|No| G[Test drive: listen for noises, check brakes, steering]\n    G --> H{Smell coolant or burning oil?}\n    H -->|Yes| C\n    H -->|No| I{Check title matches seller's ID?}\n    I -->|No| J[Possible stolen car - verify before paying]\n    I -->|Yes| K{Payment method}\n    J --> L[Ask for title in seller's name, avoid curbstoning]\n    L --> I\n    K -->|Cash| M[Get signed bill of sale, title transfer, release of liability]\n    K -->|Cashier's check| M\n    K -->|Wire transfer| M\n    K -->|Personal check| N[Do NOT accept - risk of fake check]\n    N --> K",
    "expanded_text": "When buying a used car from a private seller, first obtain a vehicle history report (e.g., Carfax) to check for salvage titles or odometer rollback. If issues are found, walk away. If the history is clean, schedule an in-person inspection and bring a mechanic or pay for a pre-purchase inspection. If the mechanic finds major issues (engine, transmission, frame damage), walk away. If the mechanic approves, take a test drive, listening for unusual noises and checking brakes and steering. If you smell coolant or burning oil during the test drive, walk away. Next, verify that the title matches the seller's ID; if not, the car could be stolen or the seller may be a curbstoner (illegally flipping cars). For payment, cash or a cashier's check are safe; personal checks are risky due to potential fraud. Never accept a personal check from a private seller. Always get a signed bill of sale, completed title transfer, and release of liability form before handing over payment.",
    "metadata": {
      "domain": "daily life",
      "complexity": "medium",
      "graph_features": ["sequential checks", "conditional branches (red flags)", "mechanic inspection loop", "payment safety"]
    }
  },
  {
    "input_text": "I'm having trouble sleeping. Should I try melatonin? What about diet changes? When should I see a doctor?",
    "mermaid": "graph TD\n    A[Sleep difficulty] --> B{How long has this been happening?}\n    B -->|< 2 weeks| C[Try lifestyle changes first]\n    B -->|> 2 weeks| D{Is it affecting daytime function? (tiredness, mood, focus)}\n    C --> E[Establish consistent bedtime/wake time even on weekends]\n    E --> F{Using screens in bed?}\n    F -->|Yes| G[Stop screens 1 hour before bed - blue light suppresses melatonin]\n    F -->|No| H[Keep bedroom cool, dark, quiet]\n    G --> H\n    H --> I{Avoid caffeine after 2 PM?}\n    I -->|No| J[Cut caffeine by early afternoon]\n    I -->|Yes| K[Try melatonin 0.5-3mg one hour before bed]\n    J --> K\n    K --> L{Still struggling after 2 weeks of lifestyle changes?}\n    L -->|Yes| M[See primary care doctor]\n    L -->|No| N[Sleep improved - continue habits]\n    D -->|Yes| M\n    D -->|No| C\n    M --> O[Doctor may order sleep study or prescribe medication]",
    "expanded_text": "For sleep difficulty, first consider the duration. If sleep problems have lasted less than 2 weeks, try lifestyle changes before medication. If problems have lasted more than 2 weeks and affect daytime function (tiredness, mood, focus), see a doctor directly. Lifestyle changes include: establishing a consistent bedtime and wake time (even on weekends), stopping screen use one hour before bed (blue light suppresses natural melatonin), keeping the bedroom cool, dark, and quiet, and avoiding caffeine after 2 PM. After implementing these changes, if sleep is still poor, try melatonin 0.5 to 3 mg one hour before bed. If after two weeks of lifestyle changes and melatonin you are still struggling, see a primary care doctor, who may order a sleep study or prescribe medication. If sleep improves, continue the healthy habits.",
    "metadata": {
      "domain": "healthcare",
      "complexity": "medium",
      "graph_features": ["conditional branches (duration, daytime impact)", "sequential lifestyle interventions", "2-week trial period", "escalation to doctor"]
    }
  },
  {
    "input_text": "My flight was canceled. What are my rights? Do I get a refund or rebooking? What if the cancellation was due to weather?",
    "mermaid": "graph TD\n    A[Flight canceled] --> B{Reason for cancellation}\n    B -->|Weather or air traffic control (outside airline control)| C[Airline not required to compensate but must rebook or refund]\n    B -->|Mechanical issue or crew shortage (airline's fault)| D[Airline must rebook or refund AND compensate]\n    C --> E{Do you accept rebooking?}\n    D --> E\n    E -->|Yes| F[Airline rebooks on next available flight]\n    E -->|No| G[Request full refund to original payment]\n    F --> H{New departure > 3 hours later than original?}\n    H -->|Yes| I[Due compensation: $300-$700 depending on delay length]\n    H -->|No| J[No extra compensation for minor delay]\n    I --> K{Was overnight stay required?}\n    K -->|Yes| L[Airline must provide hotel and meal vouchers]\n    K -->|No| M[No hotel needed]\n    G --> N[Refund issued within 7 days]\n    C --> O[If weather cancellation, travel insurance may cover expenses]\n    D --> O",
    "expanded_text": "When a flight is canceled, passenger rights depend on the reason for cancellation. If the cancellation is due to weather or air traffic control (outside the airline's control), the airline is not required to provide monetary compensation but must rebook you on the next available flight or offer a full refund. If the cancellation is due to a mechanical issue or crew shortage (within the airline's control), the airline must rebook or refund AND provide additional compensation. You may choose between rebooking or a refund. If you accept rebooking and the new departure time is more than 3 hours later than the original, you are due compensation of $300 to $700 depending on the delay length. If the rebooking requires an overnight stay, the airline must provide hotel and meal vouchers. If you choose a refund, it must be issued within 7 days. For weather-related cancellations, travel insurance (if purchased) may cover additional expenses such as hotels or alternate transportation.",
    "metadata": {
      "domain": "logistics",
      "complexity": "medium",
      "graph_features": ["conditional branches (reason for cancellation)", "compensation tiers", "rebooking vs refund", "overnight stay policy"]
    }
  },
  {
    "input_text": "The global climate research consortium integrated satellite imagery, ocean buoy sensors, atmospheric simulations, and AI forecasting systems to predict extreme weather events months in advance. Data arriving from different countries often used inconsistent measurement formats, so normalization pipelines converted readings into standardized models before analysis. AI systems calculated hurricane formation probabilities and drought risks continuously. Regions identified as high-risk triggered early warning alerts to governments, emergency agencies, and agricultural suppliers simultaneously. If confidence scores remained low because of incomplete sensor coverage, additional satellite scans and drone-based atmospheric surveys were scheduled automatically. International policy teams reviewed prediction reports quarterly to coordinate long-term climate adaptation funding and infrastructure planning.",
    "mermaid": "flowchart TD\n    A[Collect Global Climate Data] --> B[Receive Satellite and Sensor Inputs]\n    B --> C[Normalize International Measurement Formats]\n    C --> D[Feed Standardized Data into AI Forecasting Systems]\n    D --> E[Calculate Hurricane and Drought Risks]\n    E --> F{High-Risk Region Detected?}\n    F -- Yes --> G[Trigger Early Warning Alerts]\n    G --> H[Notify Governments and Emergency Agencies]\n    G --> I[Notify Agricultural Suppliers]\n    E --> J{Prediction Confidence Low?}\n    J -- Yes --> K[Schedule Additional Satellite Scans]\n    K --> L[Deploy Atmospheric Survey Drones]\n    L --> D\n    J -- No --> M[Generate Forecast Reports]\n    M --> N[Quarterly International Policy Review]\n    N --> O[Coordinate Climate Adaptation Funding]",
    "expanded_text": "The climate consortium aggregates environmental data from multiple international systems and standardizes measurements before AI analysis. Forecasting systems estimate risks such as hurricanes and droughts continuously. High-risk predictions trigger simultaneous alerts to governments and infrastructure stakeholders. Low-confidence predictions cause additional data collection efforts before models are recalculated. Long-term policy coordination uses these forecasts to guide global climate adaptation investments.",
    "metadata": {
      "domain": "climate science",
      "complexity": "extreme",
      "graph_features": ["AI forecasting", "international coordination", "data normalization", "feedback loops", "multi-agency alerts"]
    }
  },
  {
    "input_text": "The intercontinental quantum communications network attempted to maintain encrypted government communications across unstable orbital relay satellites. Quantum key exchanges were validated continuously between terrestrial stations and satellites. Signal degradation caused by solar interference triggered automatic rerouting through backup relay paths. Failed encryption synchronization forced regeneration of quantum keys before secure communication resumed. Intelligence agencies simultaneously monitored network anomalies for evidence of interception attempts. Persistent anomalies escalated to cybersecurity command centers, where analysts coordinated emergency countermeasures and temporarily isolated vulnerable communication nodes.",
    "mermaid": "flowchart TD\n    A[Initiate Quantum Communication Session] --> B[Validate Quantum Key Exchanges]\n    B --> C{Signal Stable?}\n    C -- Yes --> D[Maintain Secure Communications]\n    C -- No --> E[Reroute Through Backup Relay Satellites]\n    E --> F{Encryption Synchronization Successful?}\n    F -- No --> G[Regenerate Quantum Encryption Keys]\n    G --> B\n    F -- Yes --> D\n    D --> H[Monitor Network Anomalies]\n    H --> I{Potential Interception Detected?}\n    I -- Yes --> J[Escalate to Cybersecurity Command Centers]\n    J --> K[Coordinate Emergency Countermeasures]\n    K --> L[Isolate Vulnerable Communication Nodes]\n    I -- No --> M[Continue Monitoring]",
    "expanded_text": "The quantum communications network maintains secure government transmissions through continuous encryption validation and orbital relay coordination. Signal instability caused by space interference triggers automatic rerouting and key regeneration procedures. Intelligence systems monitor anomalies for interception attempts, escalating severe threats to cybersecurity command operations for containment and countermeasures.",
    "metadata": {
      "domain": "quantum communications",
      "complexity": "extreme",
      "graph_features": ["secure communications", "failover routing", "threat monitoring", "cybersecurity escalation"]
    }
  },
  {
    "input_text": "The autonomous farming ecosystem combined drone surveillance, robotic harvesters, soil chemistry sensors, and predictive weather AI to maximize crop yields while minimizing water consumption. Drones scanned fields daily for pest outbreaks and nutrient deficiencies. Crops showing early disease indicators triggered localized pesticide deployment instead of field-wide spraying. Water irrigation schedules adapted dynamically based on rainfall predictions and soil moisture data. Robotic harvesters prioritized crops approaching peak ripeness while logistics systems coordinated transportation to nearby distribution centers. Agricultural economists reviewed seasonal output forecasts to determine future export pricing strategies and emergency food reserve allocations.",
    "mermaid": "flowchart TD\n    A[Monitor Autonomous Farming Ecosystem] --> B[Scan Fields with Drones]\n    B --> C[Detect Pest Outbreaks and Nutrient Deficiencies]\n    C --> D{Crop Disease Indicators Found?}\n    D -- Yes --> E[Deploy Localized Pesticide Treatment]\n    D -- No --> F[Continue Crop Monitoring]\n    A --> G[Analyze Soil Moisture and Weather Forecasts]\n    G --> H[Adjust Irrigation Schedules Dynamically]\n    A --> I[Monitor Crop Ripeness]\n    I --> J[Prioritize Robotic Harvesting]\n    J --> K[Coordinate Distribution Logistics]\n    K --> L[Generate Seasonal Output Forecasts]\n    L --> M[Agricultural Economic Review]\n    M --> N[Adjust Export Pricing and Food Reserves]",
    "expanded_text": "The autonomous farming ecosystem integrates AI forecasting, robotic harvesting, and precision agriculture techniques to optimize food production. Drone surveillance detects localized crop issues, enabling targeted treatment instead of wasteful large-scale interventions. Irrigation adapts dynamically to environmental conditions, while harvest and logistics systems coordinate efficient food distribution and long-term agricultural planning.",
    "metadata": {
      "domain": "agricultural technology",
      "complexity": "extreme",
      "graph_features": ["AI-driven agriculture", "robotics coordination", "precision treatment", "predictive optimization"]
    }
  },
  {
    "input_text": "The international digital banking alliance introduced a decentralized fraud prevention network shared between hundreds of financial institutions. Transaction metadata was anonymized and streamed into a federated AI system capable of identifying emerging fraud patterns without exposing customer identities. Suspicious transaction clusters automatically increased authentication requirements across participating banks. Institutions with repeated compliance failures were temporarily isolated from the network pending regulatory review. Central banking authorities reviewed fraud trend dashboards weekly and coordinated cross-border enforcement operations whenever organized criminal patterns were confirmed.",
    "mermaid": "flowchart TD\n    A[Stream Anonymized Banking Transactions] --> B[Analyze Data with Federated AI]\n    B --> C[Identify Emerging Fraud Patterns]\n    C --> D{Suspicious Transaction Cluster Detected?}\n    D -- Yes --> E[Increase Authentication Requirements]\n    E --> F[Notify Participating Banks]\n    B --> G[Monitor Institutional Compliance]\n    G --> H{Repeated Compliance Failure?}\n    H -- Yes --> I[Temporarily Isolate Institution]\n    I --> J[Conduct Regulatory Review]\n    C --> K[Generate Fraud Trend Dashboards]\n    K --> L[Central Banking Authority Review]\n    L --> M{Organized Criminal Activity Confirmed?}\n    M -- Yes --> N[Coordinate Cross-Border Enforcement]\n    M -- No --> O[Continue Fraud Monitoring]",
    "expanded_text": "The decentralized banking alliance uses federated AI to detect fraud patterns while preserving customer privacy. Suspicious activity triggers stronger authentication across institutions. Non-compliant organizations may be isolated until regulatory investigations conclude. Central banking authorities monitor trends and coordinate international law enforcement operations against organized financial crime.",
    "metadata": {
      "domain": "financial cybersecurity",
      "complexity": "extreme",
      "graph_features": ["federated AI", "cross-border coordination", "compliance enforcement", "adaptive authentication"]
    }
  },
  {
    "input_text": "The global biotech corporation engineered synthetic microorganisms capable of breaking down ocean plastic waste. Research laboratories monitored mutation rates, environmental stability, and unintended ecosystem interactions continuously. Dangerous mutation indicators triggered automated containment procedures and genetic kill-switch activation. Marine deployment zones required approval from environmental regulators and independent scientific ethics boards before large-scale release. Public concern campaigns on social media also influenced deployment timelines, forcing executive teams to balance scientific progress with political and environmental trust considerations.",
    "mermaid": "flowchart TD\n    A[Develop Synthetic Plastic-Degrading Microorganisms] --> B[Monitor Mutation Rates]\n    A --> C[Monitor Ecosystem Interactions]\n    B --> D{Dangerous Mutation Detected?}\n    D -- Yes --> E[Activate Genetic Kill-Switch]\n    E --> F[Initiate Containment Procedures]\n    D -- No --> G[Continue Controlled Testing]\n    G --> H[Request Environmental Regulatory Approval]\n    H --> I[Independent Ethics Board Review]\n    I --> J{Deployment Approved?}\n    J -- Yes --> K[Deploy Microorganisms in Ocean Zones]\n    J -- No --> L[Revise Deployment Strategy]\n    K --> M[Monitor Public and Environmental Response]\n    M --> N[Executive Trust and Policy Review]",
    "expanded_text": "The biotech corporation develops synthetic organisms for environmental cleanup while balancing scientific innovation with ecological safety and public trust. Continuous monitoring detects dangerous mutations, triggering containment systems automatically. Deployment requires both regulatory and ethical approval, while public sentiment influences strategic deployment decisions.",
    "metadata": {
      "domain": "biotechnology",
      "complexity": "extreme",
      "graph_features": ["genetic safety systems", "ethics governance", "public trust feedback", "environmental monitoring"]
    }
  },
  {
    "input_text": "The multinational entertainment streaming platform deployed a generative AI content engine capable of producing personalized trailers, dubbing, and dynamic story recommendations in real time. User emotional engagement metrics were inferred from watch duration, pause frequency, and interaction behavior. Low engagement scores triggered alternative recommendation strategies and experimental trailer variations automatically. AI-generated dubbing passed through human linguistic reviewers for culturally sensitive markets before release. Legal teams also audited licensing restrictions continuously to prevent unauthorized regional distribution conflicts.",
    "mermaid": "flowchart TD\n    A[Collect Streaming User Behavior Data] --> B[Analyze Emotional Engagement Metrics]\n    B --> C{Engagement Score Low?}\n    C -- Yes --> D[Generate Alternative Recommendations]\n    D --> E[Create Experimental Trailer Variations]\n    C -- No --> F[Continue Personalized Content Delivery]\n    A --> G[Generate AI Dubbing and Localization]\n    G --> H{Sensitive Market Detected?}\n    H -- Yes --> I[Human Linguistic Review]\n    I --> J[Approve Localized Content]\n    H -- No --> J\n    J --> K[Distribute Streaming Content]\n    K --> L[Audit Regional Licensing Restrictions]\n    L --> M{Distribution Conflict Detected?}\n    M -- Yes --> N[Restrict Unauthorized Regions]\n    M -- No --> O[Continue Global Streaming]",
    "expanded_text": "The entertainment platform uses generative AI to personalize streaming experiences dynamically. Engagement analytics influence recommendation strategies and experimental content variations. AI localization systems are supervised by human reviewers in culturally sensitive markets, while legal audits ensure regional licensing compliance.",
    "metadata": {
      "domain": "media technology",
      "complexity": "extreme",
      "graph_features": ["generative AI", "behavioral analytics", "human-AI review", "legal compliance"]
    }
  },
  {
    "input_text": "The global space traffic authority managed thousands of satellites, orbital cargo vehicles, and crewed missions simultaneously in low Earth orbit. Collision prediction systems continuously analyzed orbital trajectories using AI-enhanced simulations. High-risk intersections triggered automated maneuver recommendations and mandatory coordination between operators. Communication failures with satellites initiated emergency beacon tracking and debris-risk assessments. Nations refusing to comply with orbital safety protocols faced launch restrictions and international sanctions coordinated through multinational treaties.",
    "mermaid": "flowchart TD\n    A[Monitor Global Orbital Traffic] --> B[Analyze Satellite Trajectories with AI]\n    B --> C{Collision Risk Detected?}\n    C -- Yes --> D[Generate Maneuver Recommendations]\n    D --> E[Coordinate Between Satellite Operators]\n    E --> F[Execute Orbital Adjustments]\n    C -- No --> G[Continue Orbital Monitoring]\n    A --> H[Monitor Communication Status]\n    H --> I{Satellite Communication Failure?}\n    I -- Yes --> J[Activate Emergency Beacon Tracking]\n    J --> K[Assess Debris Collision Risks]\n    A --> L[Audit International Safety Compliance]\n    L --> M{Nation Violating Safety Protocols?}\n    M -- Yes --> N[Apply Launch Restrictions]\n    N --> O[Coordinate International Sanctions]\n    M -- No --> P[Maintain Treaty Cooperation]",
    "expanded_text": "The orbital traffic authority coordinates satellite safety using AI collision prediction and international regulatory enforcement. Potential collisions trigger mandatory coordination between operators, while communication failures initiate emergency debris tracking procedures. Nations violating orbital safety agreements face sanctions and launch restrictions.",
    "metadata": {
      "domain": "space governance",
      "complexity": "extreme",
      "graph_features": ["AI simulation", "international regulation", "collision prevention", "multi-actor coordination"]
    }
  },
  {
    "input_text": "The advanced neurotechnology startup developed brain-computer interfaces capable of assisting paralyzed patients with communication and robotic limb control. Neural signal decoding systems adapted continuously to each patient's brain activity patterns using reinforcement learning. Inconsistent neural signals triggered recalibration sessions supervised by neurologists and machine learning engineers. Hardware anomalies forced devices into safe mode to prevent accidental robotic movement. Regulatory agencies monitored long-term cognitive impact studies while ethics committees reviewed concerns regarding mental privacy and potential misuse by commercial partners.",
    "mermaid": "flowchart TD\n    A[Collect Neural Brain Signals] --> B[Decode Signals with Reinforcement Learning]\n    B --> C[Control Communication and Robotic Systems]\n    B --> D{Neural Signals Consistent?}\n    D -- No --> E[Conduct Recalibration Session]\n    E --> F[Neurologist and Engineer Supervision]\n    F --> B\n    D -- Yes --> G[Continue Adaptive Learning]\n    C --> H[Monitor Hardware Integrity]\n    H --> I{Hardware Anomaly Detected?}\n    I -- Yes --> J[Activate Device Safe Mode]\n    J --> K[Prevent Accidental Robotic Movement]\n    A --> L[Conduct Long-Term Cognitive Studies]\n    L --> M[Regulatory and Ethics Committee Review]\n    M --> N[Evaluate Privacy and Misuse Risks]",
    "expanded_text": "The neurotechnology system adapts brain-computer interfaces to patient neural activity using reinforcement learning. Signal inconsistencies trigger supervised recalibration processes, while safety systems prevent unintended robotic actions during hardware anomalies. Long-term ethical and regulatory reviews focus on privacy, cognitive impact, and misuse concerns.",
    "metadata": {
      "domain": "neurotechnology",
      "complexity": "extreme",
      "graph_features": ["reinforcement learning", "adaptive interfaces", "hardware fail-safe systems", "ethical oversight"]
    }
  },
  {
    "input_text": "The autonomous legal research platform processed millions of court documents, international treaties, and regulatory filings daily for multinational law firms. Natural language reasoning systems generated case summaries, predicted litigation risks, and recommended precedent strategies automatically. Contradictory legal precedents triggered escalation to senior legal analysts for manual interpretation. Jurisdiction-specific privacy laws restricted cross-border data processing, forcing regional AI clusters to isolate certain datasets. Clients also received confidence scores indicating uncertainty levels in predictive legal outcomes before making strategic decisions.",
    "mermaid": "flowchart TD\n    A[Process Global Legal Documents] --> B[Generate AI Case Summaries]\n    B --> C[Predict Litigation Risks]\n    C --> D[Recommend Legal Precedent Strategies]\n    D --> E{Contradictory Precedents Detected?}\n    E -- Yes --> F[Escalate to Senior Legal Analysts]\n    F --> G[Manual Legal Interpretation]\n    E -- No --> H[Deliver Strategic Recommendations]\n    A --> I[Check Jurisdiction Privacy Restrictions]\n    I --> J{Cross-Border Data Restricted?}\n    J -- Yes --> K[Isolate Regional AI Processing Clusters]\n    J -- No --> L[Continue Unified Data Processing]\n    H --> M[Generate Confidence Scores for Clients]\n    M --> N[Support Strategic Legal Decision-Making]",
    "expanded_text": "The AI legal platform automates legal research and litigation forecasting across international jurisdictions. Contradictory precedents require human analyst intervention, while privacy laws influence regional data processing architecture. Clients receive predictive insights together with uncertainty estimates to support legal strategy decisions.",
    "metadata": {
      "domain": "legal technology",
      "complexity": "extreme",
      "graph_features": ["AI reasoning", "human escalation", "jurisdictional compliance", "uncertainty estimation"]
    }
  },
  {
    "input_text": "The multinational energy corporation operated fusion reactors, renewable energy farms, and hydrogen storage facilities within a unified smart grid system. AI balancing engines dynamically shifted power loads between regions based on consumption spikes and weather conditions. Reactor instability warnings triggered controlled energy redistribution to prevent cascading outages. Hydrogen reserves automatically compensated for renewable shortfalls during prolonged storms. Environmental regulators audited emission metrics continuously, while investors monitored long-term profitability dashboards influenced by energy demand forecasts and geopolitical energy policies.",
    "mermaid": "flowchart TD\n    A[Operate Unified Smart Energy Grid] --> B[Monitor Regional Energy Demand]\n    B --> C[AI Balancing Engine Redistributes Power Loads]\n    A --> D[Monitor Fusion Reactor Stability]\n    D --> E{Reactor Instability Warning?}\n    E -- Yes --> F[Redistribute Energy to Prevent Outages]\n    A --> G[Track Renewable Energy Output]\n    G --> H{Renewable Shortfall Detected?}\n    H -- Yes --> I[Activate Hydrogen Energy Reserves]\n    H -- No --> J[Continue Renewable Distribution]\n    A --> K[Audit Environmental Emissions]\n    K --> L[Regulatory Compliance Review]\n    C --> M[Generate Profitability Forecast Dashboards]\n    M --> N[Investor Strategic Review]",
    "expanded_text": "The energy corporation coordinates fusion, renewable, and hydrogen systems within a unified smart grid managed by AI balancing engines. Reactor instability and renewable shortages trigger automated redistribution and reserve activation. Environmental audits and profitability forecasting influence both regulatory compliance and investor strategy.",
    "metadata": {
      "domain": "energy systems",
      "complexity": "extreme",
      "graph_features": ["smart grids", "AI load balancing", "hybrid energy infrastructure", "regulatory auditing"]
    }
  }
]