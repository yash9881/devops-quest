// js/level2_data.js

const level2Data = {
  id: "level2",
  title: "Level 2: DevOps Adventurer",
  description: "Build automated pipelines, write Infrastructure as Code, and deploy to Kubernetes clusters.",
  chapters: [
    {
      id: "jenkins",
      title: "Jenkins CI/CD Pipeline",
      story: "You enter the Automation Foundry. The gearwheels of Jenkins turn relentlessly. Your task is to harness the power of Jenkinsfiles, build steps, and quality gates using SonarQube and Nexus.",
      icon: "🏗️",
      xpReward: 500,
      skills: ["jenkins_ci", "sonarqube_quality", "nexus_repo"],
      stats: { cicd: 20 },
      knowledge: {
        concept: "Jenkins is a self-hosted automation server. It acts as a robot worker that triggers whenever you push code, automatically building, testing, and preparing it for deployment.",
        whyExists: "Developers push code updates multiple times a day. Checking every change manually for bugs and deploying them by hand is slow, error-prone, and doesn't scale.",
        problemSolved: "Jenkins automates the entire workflow. It eliminates human errors in builds, ensures tests run on every commit, and creates a fast feedback loop for developers.",
        internals: "Jenkins runs on Java. It listens for webhooks (notifications) from GitHub. When a webhook arrives, the Jenkins master allocates a workspace on a 'Build Agent' (worker node), checks out the code, and runs steps defined in a script file called a **Jenkinsfile**.",
        companyUse: "Companies use Jenkins to build complex, multi-stage pipelines that compile code (using Maven/Gradle), analyze security (using SonarQube), publish binaries (to Nexus), and trigger deployments.",
        whatsNext: "After Jenkins, you will learn GitHub Actions, a modern cloud-hosted alternative, before diving into Infrastructure as Code with Terraform.",
        examples: [
          { title: "Jenkinsfile Declarative Syntax", desc: "A script versioned in your Git repo that defines stages: `Build`, `Test`, and `Deploy` using code." },
          { title: "Quality Gates", desc: "SonarQube scans code for security vulnerabilities and fails the build if code coverage drops below a set percentage." }
        ]
      },
      visualFlow: [
        { label: "Developer Git Push", detail: "Triggers webhook to Jenkins" },
        { label: "Build Stage (Maven)", detail: "Jenkins compiles code and creates a JAR/WAR file" },
        { label: "Analysis Stage (SonarQube)", detail: "Scans for security vulnerabilities and code quality" },
        { label: "Publish Stage (Nexus)", detail: "Uploads build artifacts to Nexus Repository Manager" }
      ],
      handsOn: {
        objective: "Set up a local Jenkins instance and run a declarative build pipeline.",
        steps: [
          "Run Jenkins locally inside a Docker container: `docker run -d -p 8080:8080 -p 50000:50000 --name jenkins jenkins/jenkins:lts`.",
          "Open `http://localhost:8080` and follow setup instructions using the initial admin password.",
          "Install suggested plugins.",
          "Create a new 'Pipeline' job named `hello-world-pipeline`.",
          "In the pipeline script box, paste this declarative script:",
          "  `pipeline {`",
          "  `    agent any`",
          "  `    stages {`",
          "  `        stage('Build') { steps { echo 'Compiling application...' } }`",
          "  `        stage('Test') { steps { echo 'Running unit tests...' } }`",
          "  `        stage('Analyze') { steps { echo 'Running SonarQube scan...' } }`",
          "  `    }`",
          "  `}`",
          "Click 'Build Now' and inspect the Console Output to see the stages run."
        ]
      },
      challenge: {
        title: "The Quality Guardian",
        desc: "Modify your pipeline script to include a post-build step that prints 'Pipeline Successful' if the build passes, or 'Pipeline Failed' if a stage fails.",
        hint: "Use the `post { success { ... } failure { ... } }` blocks at the end of the pipeline structure."
      },
      quiz: [
        {
          question: "Which file is used to define a Jenkins pipeline in a Git repository?",
          options: ["jenkins.config", "Jenkinsfile", "build.gradle", "docker-compose.yml"],
          answer: 1,
          explanation: "The `Jenkinsfile` is a text file that contains the definition of a Jenkins Pipeline and is committed to source control."
        },
        {
          question: "What does SonarQube do in a CI/CD pipeline?",
          options: ["Compiles the Java source files", "Hosts built software artifacts", "Performs static code analysis to scan for bugs, vulnerabilities, and code smell", "Deploys containers to production"],
          answer: 2,
          explanation: "SonarQube is a static analysis tool that inspects code quality and security, generating reports on technical debt and vulnerabilities."
        },
        {
          question: "What is Nexus Repository Manager used for?",
          options: ["To version control raw source code", "To store and manage binary artifacts (like JAR, WAR, or Docker images) created during builds", "To monitor server CPU load", "To host virtual server instances"],
          answer: 1,
          explanation: "Nexus is an artifact repository manager. Instead of rebuilding jars, pipelines publish compiled binaries to Nexus where they can be retrieved securely for deployment."
        }
      ],
      interview: [
        {
          q: "What is the difference between Declarative and Scripted pipelines in Jenkins?",
          ans: {
            beg: "Declarative is newer and easier to write using a strict structure. Scripted uses Groovy code and is more complex but highly flexible.",
            int: "Declarative pipelines use a pre-defined schema (`pipeline { agent any ... }`) which is structured, easier to read, and less prone to errors. Scripted pipelines use custom Groovy code (`node { ... }`), which provides maximum flexibility but is harder to write and maintain.",
            scenario: "For 90% of projects, write a Declarative pipeline. Use Scripted blocks only if you need complex, dynamic logic (e.g., custom loops, complex environment variables parsing)."
          }
        },
        {
          q: "What is a 'Quality Gate' and how does it block a deployment?",
          ans: {
            beg: "It is a set of rules (like 'no critical bugs') that stops the pipeline if the code fails code quality standards.",
            int: "A Quality Gate is a set of boolean conditions defined in SonarQube (e.g., code coverage > 80%, 0 blocker bugs, security rating A). During execution, Jenkins sends the code report to SonarQube, waits for the result, and if the Quality Gate fails, it aborts the pipeline, preventing bad code from proceeding to deployment.",
            scenario: "If a developer pushes code with high security risk, SonarQube fails. The webhook returns a 'FAILED' status to Jenkins, aborting the next stage (e.g., AWS deploy), protecting production from vulnerability."
          }
        }
      ]
    },
    {
      id: "github_actions",
      title: "GitHub Actions CI/CD",
      story: "You exit the Jenkins Foundry and enter the Cloud Gate of GitHub. Instead of running servers, you call upon Github Actions runners using YAML workflows.",
      icon: "⚙️",
      xpReward: 500,
      skills: ["github_actions_workflows", "secrets_management"],
      stats: { cicd: 25 },
      knowledge: {
        concept: "GitHub Actions is a cloud-hosted automation platform built directly into GitHub. It lets you automate software workflows (build, test, deploy) using YAML configuration files inside your repository.",
        whyExists: "Managing Jenkins servers requires patches, backups, and server maintenance. GitHub Actions removes this overhead by running workflows on GitHub's own secure, hosted cloud servers.",
        problemSolved: "It eliminates server maintenance. You get serverless, elastic runners that scale up and down dynamically, integrated seamlessly with issues, pulls, and releases.",
        internals: "You place YAML files in `.github/workflows/`. GitHub detects events (like `push` or `pull_request`). It provisions a clean Virtual Machine (or container runner), executes your specified steps, and displays output in the repository tab.",
        companyUse: "Companies use GitHub Actions to automate code linting, run unit tests on pull requests, package Docker images, push them to registry systems, and deploy to AWS.",
        whatsNext: "Now that you can automate builds in the cloud, you will learn to build the cloud servers themselves using Terraform (Infrastructure as Code).",
        examples: [
          { title: "Workflow YAML Structure", desc: "Contains `on` (triggers), `jobs` (parallel tasks), and `steps` (sequential commands using actions like `actions/checkout@v3`)." },
          { title: "GitHub Secrets", desc: "Variables (like AWS keys) encrypted securely on GitHub, referenced in scripts using `${{ secrets.AWS_ACCESS_KEY }}`." }
        ]
      },
      visualFlow: [
        { label: "Git Push to GitHub", detail: "GitHub detects commit on main" },
        { label: "Trigger Workflow", detail: "Spins up hosted runner (Ubuntu VM)" },
        { label: "Run Actions Steps", detail: "Checks out code, installs Node/Java, runs tests" },
        { label: "Build & Deploy", detail: "Pushes Docker image to ECR, notifies AWS" }
      ],
      handsOn: {
        objective: "Write a GitHub Actions workflow that executes tests on every push.",
        steps: [
          "Create a new repository on GitHub named `github-actions-quest`.",
          "Clone it locally and create a directory: `.github/workflows`.",
          "Inside it, create a file named `ci.yml`.",
          "Paste the following YAML content:",
          "  `name: Node CI`",
          "  `on: [push]`",
          "  `jobs:`",
          "  `  build-and-test:`",
          "  `    runs-on: ubuntu-latest`",
          "  `    steps:`",
          "  `      - name: Checkout Code`",
          "  `        uses: actions/checkout@v3`",
          "  `      - name: Set up Node.js`",
          "  `        uses: actions/setup-node@v3`",
          "  `        with:`",
          "  `          node-version: 18`",
          "  `      - name: Run Tests`",
          "  `        run: echo 'Running unit tests...'`",
          "Commit and push this file to GitHub.",
          "Click the 'Actions' tab on your GitHub repository page to see your live pipeline run!"
        ]
      },
      challenge: {
        title: "The Secure Deployer",
        desc: "Add a new secret `DUMMY_DEPLOY_TOKEN` to your GitHub Repository Settings. Modify your workflow to read this secret and echo its character count (do not print the actual secret!).",
        hint: "Access the secret using `${{ secrets.DUMMY_DEPLOY_TOKEN }}`. To test, echo it into a shell variable and print the length using `wc -c`."
      },
      quiz: [
        {
          question: "Where must you store GitHub Actions workflow files in your repository?",
          options: [".github/actions/", ".github/workflows/", "config/github/", "actions/"],
          answer: 1,
          explanation: "GitHub Actions looks for workflow configuration files in the `.github/workflows/` directory at the root of your repository."
        },
        {
          question: "In a GitHub Actions workflow, what is the role of a 'runner'?",
          options: ["The developer pushing the code", "The virtual machine or container server that runs the jobs defined in the workflow", "A script that downloads GitHub code", "A local test environment"],
          answer: 1,
          explanation: "Runners are the execution servers (hosted by GitHub or self-hosted) where your workflow jobs run."
        },
        {
          question: "How do you securely pass API keys or passwords to a GitHub Actions job?",
          options: ["Hardcode them directly inside the YAML file", "Define them as variables in package.json", "Store them in 'GitHub Secrets' and reference them using the secrets context", "Commit an .env file containing the passwords"],
          answer: 2,
          explanation: "Secrets are encrypted variables created in repository settings. They are injected at runtime using `${{ secrets.SECRET_NAME }}` and masked in console logs."
        }
      ],
      interview: [
        {
          q: "What is the difference between GitHub Actions and Jenkins?",
          ans: {
            beg: "Jenkins is self-hosted (you run the servers), while GitHub Actions is cloud-hosted (GitHub runs the servers for you).",
            int: "Jenkins is a self-hosted automation platform requiring server infrastructure, plugins management, and administration, but offering infinite customization. GitHub Actions is a modern cloud-first CI/CD SaaS, configuration-as-code (YAML), serverless by default, and tightly integrated into the GitHub ecosystem.",
            scenario: "If a company wants zero server maintenance, GitHub Actions is ideal. If they need strictly on-premise execution behind tight firewalls with massive custom build configurations, Jenkins is preferred."
          }
        },
        {
          q: "What is a 'Job' in GitHub Actions and do they run in parallel or sequence?",
          ans: {
            beg: "A Job is a set of steps. By default, different jobs run at the same time (parallel).",
            int: "A Job is a logical group of steps executed sequentially on the same runner. By default, multiple jobs within a workflow run in parallel. However, you can configure dependencies using the `needs` keyword to force jobs to run sequentially.",
            scenario: "In a release workflow, you have a `test` job and a `deploy` job. Since you shouldn't deploy failing code, use `needs: test` on the `deploy` job to make it wait for test completion."
          }
        }
      ]
    },
    {
      id: "terraform",
      title: "Terraform AWS Infrastructure",
      story: "You enter the Architect's Guild. Instead of clicking the AWS Console, you write scrolls of Terraform declarations. With a single command, you manifest networks, servers, and storage.",
      icon: "🏗️",
      xpReward: 500,
      skills: ["terraform_providers", "terraform_state", "terraform_commands"],
      stats: { iac: 30 },
      knowledge: {
        concept: "Terraform is an Infrastructure as Code (IaC) tool. It lets you write text files to describe your cloud infrastructure (VPCs, EC2s, S3s) and provision them automatically.",
        whyExists: "Creating servers and networks manually in the AWS Console is slow, cannot be version controlled, and leads to configuration drift (inconsistent setups).",
        problemSolved: "Terraform makes infrastructure reproducible. You can deploy identical Dev, Staging, and Production environments instantly, trace history in Git, and destroy resources cleanly.",
        internals: "Terraform reads your configuration files (`.tf`). It queries cloud APIs to check current infrastructure, compares it against a ledger file called the **State File** (`terraform.tfstate`), calculates a delta plan, and executes API requests to align the cloud with your code.",
        companyUse: "Companies use Terraform to define entire cloud architectures—from networking subnets to Kubernetes clusters—allowing complete infrastructure rebuilds in minutes.",
        whatsNext: "Once your cloud infrastructure is provisioned with Terraform, you will learn to manage applications running inside it using Kubernetes container orchestration.",
        examples: [
          { title: "Terraform Code", desc: "`resource 'aws_instance' 'web' { ami = 'ami-xyz' instance_type = 't2.micro' }` defines an EC2 instance." },
          { title: "Plan Action", desc: "`terraform plan` shows you exactly what resources will be created, modified, or destroyed before making changes." }
        ]
      },
      visualFlow: [
        { label: "Write Terraform Code (.tf)", detail: "Define providers, resources, variables" },
        { label: "Run 'terraform init'", detail: "Download cloud provider plugins (AWS)" },
        { label: "Run 'terraform plan'", detail: "Preview changes comparing against tfstate" },
        { label: "Run 'terraform apply'", detail: "Execute API calls and updates cloud resources" }
      ],
      handsOn: {
        objective: "Initialize Terraform, write basic resource blocks, and launch an EC2 instance.",
        steps: [
          "Install Terraform CLI on your machine.",
          "Create a new directory `terraform-quest` and enter it.",
          "Create a file named `main.tf`.",
          "Paste the configuration:",
          "  `provider \"aws\" {`",
          "  `  region = \"us-east-1\"`",
          "  `}`",
          "  `resource \"aws_security_group\" \"quest_sg\" {`",
          "  `  name        = \"quest-sg\"`",
          "  `  ingress {`",
          "  `    from_port   = 80`",
          "  `    to_port     = 80`",
          "  `    protocol    = \"tcp\"`",
          "  `    cidr_blocks = [\"0.0.0.0/0\"]`",
          "  `  }`",
          "  `}`",
          "Run `terraform init` to download the AWS provider plugins.",
          "Run `terraform plan` to verify the creation plans.",
          "Run `terraform apply -auto-approve` (requires AWS credentials configured) to create the Security Group in your account.",
          "Run `terraform destroy -auto-approve` to clean up and delete it."
        ]
      },
      challenge: {
        title: "The Variables Scroll",
        desc: "Modify your `main.tf` to make the AWS region configurable using a variable block, and reference it in your provider configuration.",
        hint: "Define `variable \"aws_region\" { default = \"us-east-1\" }` and reference it using `var.aws_region`."
      },
      quiz: [
        {
          question: "What is the purpose of the `.tfstate` file in Terraform?",
          options: ["It contains the source code of the AWS provider", "It stores the record of your managed infrastructure state to map real-world resources to your configuration", "It is a temporary file deleted after terraform apply", "It lists passwords and credentials securely"],
          answer: 1,
          explanation: "The state file acts as Terraform's database, tracking resource IDs and mappings to understand what is currently deployed in the cloud."
        },
        {
          question: "Which command must be run first to download provider plugins in a new Terraform folder?",
          options: ["terraform plan", "terraform apply", "terraform init", "terraform validate"],
          answer: 2,
          explanation: "`terraform init` initializes a working directory by downloading necessary providers and modules."
        },
        {
          question: "What is the difference between `terraform plan` and `terraform apply`?",
          options: ["plan compiles code, apply deploys it", "plan previews changes, apply executes changes on the cloud provider", "plan is for local files, apply is for AWS", "plan destroys resources, apply builds them"],
          answer: 1,
          explanation: "`terraform plan` performs a read-only dry run to show what will happen, whereas `terraform apply` actually sends API requests to provision resources."
        }
      ],
      interview: [
        {
          q: "What is configuration drift and how does Terraform handle it?",
          ans: {
            beg: "Drift is when someone changes cloud settings manually instead of using code. Terraform fixes it by comparing code with the cloud and restoring it.",
            int: "Configuration drift occurs when the actual state of cloud infrastructure diverges from the defined configuration files (e.g., someone manually edits a Security Group). When running `terraform plan`, Terraform queries live cloud API states, compares them against the state file and code, and suggests updates to restore the infrastructure to the state defined in your code.",
            scenario: "If a developer manually opens port 22 in AWS console, running `terraform apply` detects the drift and removes that rule to keep the setup secure as defined in Git."
          }
        },
        {
          q: "Why should you store your Terraform state file in a remote location instead of locally?",
          ans: {
            beg: "Because if you lose your local file, Terraform loses track of what it built, and you cannot easily collaborate with other developers.",
            int: "Local state files prevent collaboration since others can't see updates, and present security risks since they may contain secrets in plain text. Storing state remotely (e.g., in AWS S3 with DynamoDB state locking) allows teams to share state safely, prevents concurrent executions from corrupting files, and secures data.",
            scenario: "In production, set up an S3 backend with DynamoDB locking. If two developers run terraform apply at the same time, DynamoDB locks the state so only one execution runs, preventing race conditions."
          }
        }
      ]
    },
    {
      id: "kubernetes",
      title: "Kubernetes Orchestration",
      story: "You enter the Citadel of Container Orchestration. Hundreds of Docker containers run around you. To keep them organized, scaling, and resilient, you must assume command of Kubernetes.",
      icon: "☸️",
      xpReward: 600,
      skills: ["k8s_pods_deployments", "k8s_services", "k8s_configs_secrets"],
      stats: { containers: 35 },
      knowledge: {
        concept: "Kubernetes (K8s) is an open-source system that manages hundreds of containers. It handles scaling, automatic failover, load balancing, and networking for containerized apps.",
        whyExists: "Running ten Docker containers manually on one machine is easy. Managing 500 containers across 20 servers—handling crashes, updates, and load balancing—is impossible manually.",
        problemSolved: "Kubernetes automates operations. If a container crashes, K8s restarts it. If traffic spikes, K8s scales up copies. If a server dies, K8s shifts containers to another server instantly.",
        internals: "K8s has a **Control Plane** (the master brains) and **Worker Nodes** (servers running containers). The Control Plane runs the **API Server** (receives YAML commands), **Scheduler** (assigns containers to nodes), and **etcd** (database). Nodes run **Kubelet** (agent) and **Container Runtime** (Docker/Containerd).",
        companyUse: "Companies use Kubernetes to run microservices in production, ensuring zero-downtime updates (rolling updates) and efficient cloud resource utilization.",
        whatsNext: "Once your apps run on Kubernetes, you'll need monitoring tools like Prometheus and Grafana to watch over their health.",
        examples: [
          { title: "Pod", desc: "The smallest deployable unit in K8s, containing one or more containers." },
          { title: "Service", desc: "An abstraction layer that gives a group of pods a single permanent IP and balances traffic between them." }
        ]
      },
      visualFlow: [
        { label: "Apply Deployment YAML", detail: "Sent to API Server: kubectl apply -f deploy.yaml" },
        { label: "Scheduler Assigns Nodes", detail: "Determines which worker node has resources" },
        { label: "Kubelet Launches Pod", detail: "Node agent downloads image and starts containers" },
        { label: "Service Exposes Pods", detail: "Routes user requests to live containers" }
      ],
      handsOn: {
        objective: "Launch a local Kubernetes cluster and deploy an application.",
        steps: [
          "Install Minikube or Docker Desktop (with Kubernetes enabled) on your computer.",
          "Verify the cluster is active: `kubectl cluster-info`.",
          "Create a file named `deployment.yaml` with the contents:",
          "  `apiVersion: apps/v1`",
          "  `kind: Deployment`",
          "  `metadata:`",
          "  `  name: nginx-deployment`",
          "  `spec:`",
          "  `  replicas: 3`",
          "  `  selector:`",
          "  `    matchLabels:`",
          "  `      app: web`",
          "  `  template:`",
          "  `    metadata:`",
          "  `      labels:`",
          "  `        app: web`",
          "  `    spec:`",
          "  `      containers:`",
          "  `      - name: nginx`",
          "  `        image: nginx:alpine`",
          "  `        ports:`",
          "  `        - containerPort: 80`",
          "Run the deployment: `kubectl apply -f deployment.yaml`.",
          "Check the running pods: `kubectl get pods`. You should see 3 running replicas!",
          "Expose the deployment: `kubectl expose deployment nginx-deployment --type=NodePort --port=80`.",
          "Get the URL to visit your service: `minikube service nginx-deployment --url` (Minikube)."
        ]
      },
      challenge: {
        title: "The Auto-Healer Test",
        desc: "Kill one of your running pods manually using `kubectl delete pod [pod-name]`. Observe what happens immediately in `kubectl get pods`.",
        hint: "Kubernetes will instantly notice the missing pod and spin up a new one to maintain the target count of 3 replicas!"
      },
      quiz: [
        {
          question: "What is the smallest deployable object in Kubernetes?",
          options: ["Container", "Pod", "Service", "Deployment"],
          answer: 1,
          explanation: "A Pod is the smallest execution unit in Kubernetes, representing a single instance of a running process."
        },
        {
          question: "Which Kubernetes component is responsible for storing all cluster configuration data and state?",
          options: ["API Server", "etcd", "Scheduler", "Kubelet"],
          answer: 1,
          explanation: "`etcd` is a consistent, distributed key-value store used as Kubernetes' backing store for all cluster data."
        },
        {
          question: "Which resource is used to expose an application running in Pods to external web traffic?",
          options: ["ConfigMap", "Service (or Ingress)", "Volume", "Namespace"],
          answer: 1,
          explanation: "Services and Ingress define policies for accessing Pods, mapping traffic from load balancers or nodes into specific container ports."
        }
      ],
      interview: [
        {
          q: "What is the difference between a Deployment and a Pod in Kubernetes?",
          ans: {
            beg: "A Pod runs the container. A Deployment manages the Pods, making sure they scale and restart if they crash.",
            int: "A Pod is a wrapper around one or more containers. A Deployment is a higher-level controller that manages Pod lifecycle. It describes a desired state (like 'run 3 copies of this image') and instructs the ReplicaSet to create/update/scale Pods automatically.",
            scenario: "If you deploy a Pod directly, it won't restart on another server if its host node dies. If you use a Deployment, it automatically reschedules the Pods to healthy nodes."
          }
        },
        {
          q: "How does Kubernetes perform a Rolling Update?",
          ans: {
            beg: "It updates your app by replacing old pods with new ones slowly, one by one, so the website never goes offline.",
            int: "During a Rolling Update, Kubernetes starts new pods running the updated image version, waits for them to pass readiness probes, then terminates old pods. It repeats this incrementally (controlled by maxUnavailable and maxSurge settings) to ensure application availability.",
            scenario: "To update an app from v1 to v2 without downtime, update the deployment YAML image and run `kubectl apply`. K8s ensures at least 75% capacity remains active during the replacement."
          }
        }
      ]
    },
    {
      id: "monitoring",
      title: "DevOps Monitoring Stack",
      story: "You enter the Watchtower of Metrics. To ensure your applications are running healthy, you must learn to read Prometheus telemetry streams and visualize them on Grafana screens.",
      icon: "📊",
      xpReward: 500,
      skills: ["prometheus_scraping", "grafana_dashboards", "alertmanager"],
      stats: { cloud: 30 },
      knowledge: {
        concept: "Monitoring is the practice of observing server health (CPU, RAM, errors). Prometheus scrapes metrics from targets, and Grafana displays those metrics in beautiful dashboards.",
        whyExists: "Apps crash, memory leaks occur, and servers run out of disk space. Without monitoring, you only find out when angry customers complain about downtime.",
        problemSolved: "Monitoring provides observability. It acts as an early warning system, showing you live performance graphs and alerting you before a server runs out of disk space.",
        internals: "Prometheus uses a **Pull Model**. It reads a list of target IPs and requests metrics from them (like `/metrics` endpoint) at regular intervals (scrapes). It stores data in a Time-Series Database. Grafana connects to Prometheus and runs queries (PromQL) to draw graphs.",
        companyUse: "Companies build central monitoring centers. AlertManager sends instant Slack or PagerDuty messages if production error rates spike above 1%.",
        whatsNext: "Now that you can build, deploy, and monitor applications, you will tackle the Level 2 Boss: deploying a complete cloud-native app pipeline.",
        examples: [
          { title: "Prometheus Metric", desc: "`http_requests_total{status='500'}` counts how many server errors occurred." },
          { title: "Grafana Panel", desc: "A line chart showing CPU utilization percentage over the last 24 hours." }
        ]
      },
      visualFlow: [
        { label: "App Exposes /metrics", detail: "Prints text metrics like: cpu_usage 42" },
        { label: "Prometheus Scrapes", detail: "Pulls metrics every 15s and stores in TSDB" },
        { label: "Grafana Queries", detail: "Fetches TSDB data using PromQL queries" },
        { label: "AlertManager Triggers", detail: "Sends Slack message if cpu_usage > 90%" }
      ],
      handsOn: {
        objective: "Set up Prometheus and Grafana, and query basic metrics.",
        steps: [
          "Create a `docker-compose.yml` to spin up Prometheus and Grafana:",
          "  `version: '3.8'`",
          "  `services:`",
          "  `  prometheus:`",
          "  `    image: prom/prometheus`",
          "  `    ports:`",
          "  `      - '9090:9090'`",
          "  `  grafana:`",
          "  `    image: grafana/grafana`",
          "  `    ports:`",
          "  `      - '3000:3000'`",
          "Run `docker-compose up -d`.",
          "Open Prometheus UI: `http://localhost:9090`. Try querying: `up` (shows status of targets).",
          "Open Grafana: `http://localhost:3000` (default login: admin/admin).",
          "Add Prometheus as a Data Source, using `http://prometheus:9090` as the URL.",
          "Create a new Dashboard, add a panel, and write the PromQL query: `up` to see target statuses."
        ]
      },
      challenge: {
        title: "The Alerting Flare",
        desc: "Write a simple Prometheus alerting rule that triggers an alert when a target is down for more than 1 minute.",
        hint: "Define a rule under `groups.rules` containing: `alert: InstanceDown; expr: up == 0; for: 1m`."
      },
      quiz: [
        {
          question: "How does Prometheus collect metrics from target servers?",
          options: ["Servers send metrics to Prometheus (Push Model)", "Prometheus queries servers at intervals (Pull Model)", "Prometheus reads logs files directly", "Prometheus doesn't collect metrics; Grafana does"],
          answer: 1,
          explanation: "Prometheus primarily collects metrics by HTTP scraping (pulling metrics) from targets at defined scrape intervals."
        },
        {
          question: "What query language is used to extract data from Prometheus?",
          options: ["SQL", "GraphQL", "PromQL", "YAML"],
          answer: 2,
          explanation: "PromQL (Prometheus Query Language) is the time-series query language used to search and calculate metrics."
        },
        {
          question: "What is the purpose of AlertManager in a Prometheus setup?",
          options: ["To draw charts and graphs", "To handle, deduplicate, group, and route alerts to notification channels like Slack, PagerDuty, or Email", "To compile app code", "To scale container pods"],
          answer: 1,
          explanation: "AlertManager manages alerts sent by Prometheus, routing them to destinations and silencing notifications during maintenance."
        }
      ],
      interview: [
        {
          q: "What is the difference between Prometheus and Grafana?",
          ans: {
            beg: "Prometheus is the database that stores server metrics. Grafana is the screen that displays them as beautiful charts.",
            int: "Prometheus is a time-series database and monitoring tool that scrapes metrics via HTTP and handles alerting rules. Grafana is a visualization platform that connects to data sources like Prometheus, MySQL, or Elasticsearch to build dynamic dashboard panels.",
            scenario: "To build a dashboard, connect Grafana to a Prometheus datasource and query metrics like `node_cpu_seconds_total` using PromQL."
          }
        },
        {
          q: "What is the difference between push-based and pull-based monitoring?",
          ans: {
            beg: "Push means servers send reports to the database. Pull means the database visits servers to ask for reports.",
            int: "Pull-based systems (like Prometheus) query targets at configured intervals; this simplifies target agents and prevents servers from overloading the monitor. Push-based systems (like Datadog or InfluxDB) require targets to push data to a central collector; this is better for short-lived serverless jobs where pull-scraping is impossible.",
            scenario: "For ephemeral AWS Lambda functions that execute in seconds, use a Push gateway or cloud logs because Prometheus cannot scrape them before they terminate."
          }
        }
      ]
    },
    {
      id: "level2_boss",
      title: "Level 2 Final Boss: The Pipeline Overlord",
      story: "The Grand Pipeline Overlord awaits. To prove your transition from Adventurer to Senior DevOps Candidate, you must orchestrate a fully automated CI/CD release workflow: Developer Push -> Jenkins Build & Package -> Docker Image Publish -> Terraform AWS Infrastructure -> Deploy onto Kubernetes.",
      icon: "👹",
      xpReward: 800,
      skills: ["jenkins_ci", "terraform_commands", "k8s_pods_deployments"],
      stats: { iac: 40, cicd: 40, containers: 40 },
      knowledge: {
        concept: "The ultimate Level 2 test merges all tools. You will create a complete deployment chain: committing code to GitHub triggers Jenkins to build a Docker image, Terraform sets up the AWS network and Kubernetes host environment, and Jenkins deploys the app on Kubernetes.",
        whyExists: "This is the core daily workflow of a DevOps Engineer: creating fully automated, touchless deployment pathways that take code from git push all the way to cloud-native production environments.",
        problemSolved: "It completely eliminates manual SSH commands, hand-made servers, and manual container runs. The deployment is 100% automated, fast, and repeatable.",
        internals: "A webhook triggers a Jenkins agent. Jenkins compiles the app, executes `docker build`, logs into Docker Hub/ECR, and pushes the image. Next, Jenkins executes Terraform to ensure the environment is ready. Finally, it uses `kubectl set image` to update the Kubernetes cluster, triggering a zero-downtime rolling update.",
        companyUse: "This pipeline architecture is standard across Netflix, Spotify, and Uber to handle thousands of microservice updates every single day.",
        whatsNext: "Winning this battle promotes you to Level 3, where you will build production-grade architectures and ATS-friendly resumes to get hired.",
        examples: [
          { title: "Automated Loop", desc: "Push commit -> GitHub Webhook -> Jenkins -> Docker Build -> Docker Push -> Kubectl Deploy -> Live Site Updated" }
        ]
      },
      visualFlow: [
        { label: "1. GitHub Push", detail: "Webhook triggers Jenkins pipeline" },
        { label: "2. Jenkins Build & Test", detail: "Compiles app and packages to Docker image" },
        { label: "3. Registry Push", detail: "Pushes image to AWS ECR or Docker Hub" },
        { label: "4. Infrastructure Sync", detail: "Terraform verifies AWS/K8s infrastructure is active" },
        { label: "5. Kubernetes Deploy", detail: "K8s updates Pod images, performing rolling restart" }
      ],
      handsOn: {
        objective: "Build a complete pipeline connecting GitHub, Jenkins, Docker, and Kubernetes.",
        steps: [
          "Ensure Docker, Minikube (Kubernetes), and Jenkins are running locally.",
          "Create a Node.js project repository on GitHub containing a simple app and a Dockerfile.",
          "Write a `Jenkinsfile` in the repository with the stages:",
          "  - `Checkout`: Download code from Git.",
          "  - `Docker Build`: Compile the container image (`docker build -t my-k8s-app:latest .`).",
          "  - `Terraform Apply`: Run Terraform to deploy/verify K8s resources (optional step).",
          "  - `Kubernetes Deploy`: Run `kubectl apply -f k8s-deployment.yaml` and `kubectl rollout status deployment/k8s-app`.",
          "Configure Jenkins credentials for Docker Hub and your local Kubernetes config (`~/.kube/config`).",
          "Configure a pipeline project in Jenkins pointed to your GitHub repository.",
          "Run the Jenkins pipeline, and verify the build passes and updates your pods in Kubernetes!"
        ]
      },
      challenge: {
        title: "The Rollback Protocol",
        desc: "Simulate a broken code push. Break your application (e.g. write a syntax error), push it, watch the Jenkins test stage fail, and verify that the old Kubernetes application is NOT updated, ensuring uptime.",
        hint: "Run tests in the pipeline before building the Docker image. If tests fail, Jenkins exits with failure, skipping the deploy stage."
      },
      quiz: [
        {
          question: "Why do we run automated tests in the pipeline BEFORE deploying to Kubernetes?",
          options: ["Because Kubernetes cannot run code with tests", "To verify code health and fail the pipeline early, avoiding deploying bugs to users", "To save hard drive space", "Testing on Kubernetes is too expensive"],
          answer: 1,
          explanation: "Failing early prevents unstable code from reaching production, preserving system stability."
        },
        {
          question: "How does Jenkins authenticate with a Kubernetes cluster during the deployment stage?",
          options: ["Using username and password in the URL", "By copying the `kubeconfig` security token to Jenkins Credentials", "Jenkins does not need authentication", "Using SSH on port 22"],
          answer: 1,
          explanation: "Jenkins needs a valid `kubeconfig` file or ServiceAccount token with RBAC permissions to call the Kubernetes API Server."
        },
        {
          question: "What command is used to check the status of a rolling deployment in Kubernetes?",
          options: ["kubectl get deployment", "kubectl rollout status deployment/name", "kubectl logs -f", "kubectl check deploy"],
          answer: 1,
          explanation: "`kubectl rollout status` monitors the progress of replica updates, exiting with a 0 code only when all new pods are healthy."
        }
      ],
      interview: [
        {
          q: "Walk through your Level 2 Boss Project pipeline.",
          ans: {
            beg: "When I push code to GitHub, it tells Jenkins. Jenkins downloads the code, builds a Docker image, pushes it to Docker Hub, checks that Kubernetes is ready using Terraform, and runs kubectl to deploy the new image.",
            int: "The architecture represents a complete Git-driven CI/CD loop. A GitHub push events triggers Jenkins via webhooks. The Jenkinsfile initiates a multi-stage pipeline: First, it compiles and runs unit tests. If successful, it builds a Docker image and pushes it to Docker Hub. Next, it executes Terraform to verify the target infrastructure state. Finally, it uses `kubectl` to update the Kubernetes Deployment, triggering a zero-downtime rolling update verified by `kubectl rollout status`.",
            scenario: "To implement this in AWS production, we would use GitHub Actions pushing to AWS ECR, and deploy to AWS EKS (Elastic Kubernetes Service) using Helm charts to manage K8s releases."
          }
        }
      ]
    }
  ]
};

// Export to window object for browser access
if (typeof window !== 'undefined') {
  window.level2Data = level2Data;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = level2Data;
}
