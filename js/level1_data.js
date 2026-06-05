// js/level1_data.js

const level1Data = {
  id: "level1",
  title: "Level 1: DevOps Apprentice",
  description: "Build strong foundations in Linux, Networking, Git, AWS, and Docker.",
  chapters: [
    {
      id: "linux",
      title: "Linux & Shell Scripting",
      story: "You enter the dark dungeons of the Operating System. The ancient runes are written in terminal commands. To pass, you must learn to speak Bash and command the Linux Kernel.",
      icon: "🐚",
      xpReward: 300,
      skills: ["linux_basics", "bash_scripting"],
      stats: { linux: 15 },
      knowledge: {
        concept: "Linux is an open-source operating system (like Windows or macOS) that powers almost all servers on the internet. Instead of clicking icons, you talk to it using text commands.",
        whyExists: "Linux was created to give developers and companies a free, secure, stable, and highly customizable system that can run 24/7 without crashing.",
        problemSolved: "Before Linux, companies had to pay massive license fees for operating systems that were heavy, insecure, and couldn't easily be automated via code.",
        internals: "The core is the **Kernel** (the brain) which talks directly to hardware. Around it is the **Shell** (the translator) which takes your commands, passes them to the Kernel, and returns the result to your terminal.",
        companyUse: "Companies use Linux to run web servers, databases, and microservices in the cloud. Over 96% of the top 1 million web servers run Linux.",
        whatsNext: "After Linux, you will learn how computers talk to each other over the network, which is essential for connecting Linux servers.",
        examples: [
          { title: "Managing Files", desc: "`mkdir project && cd project` creates and enters a directory. `touch app.js` creates a file." },
          { title: "Checking Resources", desc: "`top` or `htop` displays live CPU and memory usage, showing you which processes are running." }
        ]
      },
      visualFlow: [
        { label: "Your Terminal Command", detail: "You type: mkdir code" },
        { label: "The Shell", detail: "Translates command to system call" },
        { label: "The Kernel", detail: "Directs the Hard Drive to allocate space" },
        { label: "Hardware", detail: "A physical folder is created" }
      ],
      handsOn: {
        objective: "Launch a Linux terminal (use WSL, Git Bash, or an EC2 instance) and run basic commands.",
        steps: [
          "Create a directory named `quest`: `mkdir quest`",
          "Navigate inside: `cd quest`",
          "Create a file: `touch scroll.txt`",
          "Write text to it: `echo 'DevOps is awesome' > scroll.txt`",
          "Read it: `cat scroll.txt`",
          "Check permissions: `ls -la scroll.txt`"
        ]
      },
      challenge: {
        title: "The Automator's Scroll",
        desc: "Create a shell script named `backup.sh` that creates a directory named `backups` and copies `scroll.txt` into it with a timestamp suffix (e.g., `scroll_2026.txt`). Run it using `./backup.sh`.",
        hint: "Use `cp scroll.txt backups/scroll_$(date +%Y).txt` and remember to make the script executable using `chmod +x backup.sh`!"
      },
      quiz: [
        {
          question: "Which command is used to change file permissions in Linux?",
          options: ["chown", "chmod", "chperm", "attrib"],
          answer: 1,
          explanation: "`chmod` (Change Mode) modifies read, write, and execute permissions of files and directories."
        },
        {
          question: "How do you search for a specific pattern inside a file in the terminal?",
          options: ["find", "locate", "grep", "search"],
          answer: 2,
          explanation: "`grep` searches a file for lines matching a regular expression or string pattern."
        },
        {
          question: "What does the symbol `>` do in a Bash command?",
          options: ["Redirects standard output to a file, overwriting its contents", "Appends standard output to a file", "Pipes output to another command", "Compares two files"],
          answer: 0,
          explanation: "The single `>` symbol redirects standard output to a file, overwriting it. `>>` is used for appending."
        }
      ],
      interview: [
        {
          q: "What is the difference between chmod and chown?",
          ans: {
            beg: "chmod changes who can read, write, or run a file. chown changes who owns the file.",
            int: "chmod (change mode) alters file permissions using octal (like 755) or symbolic notation (like u+x). chown (change owner) modifies the owner and/or group ownership of a file.",
            scenario: "If a web server cannot read a config file because it lacks permissions, use chmod 644. If it's because the web server user doesn't own it, use chown www-data:www-data config.json."
          }
        },
        {
          q: "What is a 'zombie process' in Linux and how do you kill it?",
          ans: {
            beg: "A zombie process is a dead process that hasn't been cleared from the system memory by its parent.",
            int: "A zombie process has finished execution but still has an entry in the process table because the parent process hasn't read its exit status. You cannot kill it directly with kill -9; you must kill its parent process or wait for init to adopt it.",
            scenario: "If an app spawns children but crashes without reading their exit codes, the system gets filled with zombies. Locate the parent PID with `ps -o ppid= -p [zombiePID]` and kill it to reap the zombies."
          }
        }
      ]
    },
    {
      id: "networking",
      title: "DevOps Networking",
      story: "Servers must talk, but they speak in packets. To establish communication lines across the network forest, you must understand ports, IP addresses, and secure paths.",
      icon: "🌐",
      xpReward: 300,
      skills: ["dns_basics", "ports_and_protocols"],
      stats: { networking: 15 },
      knowledge: {
        concept: "Networking is how computers find and talk to each other. Every server has an address (IP Address) and uses doors (Ports) to send packets of data.",
        whyExists: "Without networks, servers would be isolated islands. Web application code running on one machine could never receive requests from users or talk to database servers.",
        problemSolved: "Networking protocols organize chaos. They make sure data sent from America arrives at the correct computer in Europe, gets received by the correct app, and isn't corrupted.",
        internals: "Computers use the **TCP/IP Model**. **IP** routes packets across the internet. **TCP** guarantees delivery. **DNS** acts as an address book, translating domain names (google.com) to IPs (142.250.190.46).",
        companyUse: "Companies use subnets, firewalls (Security Groups), and load balancers to secure their networks so hackers cannot access databases directly while allowing users to access the web frontend.",
        whatsNext: "Once you know how servers communicate, you'll learn how to version control your code with Git to start deploying software over this network.",
        examples: [
          { title: "Standard Ports", desc: "Port 80 (HTTP - unsecure web), Port 443 (HTTPS - secure web), Port 22 (SSH - remote login)." },
          { title: "DNS Lookup", desc: "Running `nslookup devopsquest.com` tells you the IP address where the website is hosted." }
        ]
      },
      visualFlow: [
        { label: "User inputs website URL", detail: "http://devops.quest (Browser)" },
        { label: "DNS Query", detail: "Asks DNS server: What is the IP? -> Returns 54.21.90.3" },
        { label: "HTTP Connection", detail: "Browser sends request to 54.21.90.3 on Port 80" },
        { label: "Web Server Response", detail: "Server receives request and returns web pages" }
      ],
      handsOn: {
        objective: "Verify network paths and resolve hostnames using diagnostic commands.",
        steps: [
          "Check if a server is online: `ping google.com`",
          "Find the IP of a website: `nslookup github.com`",
          "Test connection to a specific port: `curl -I https://www.github.com`",
          "Find your local IP address: `ipconfig` (Windows) or `ip a` (Linux)"
        ]
      },
      challenge: {
        title: "The Firewall Breach",
        desc: "Imagine a client cannot access a web app running on your server. Run a command to test if the port 80 is listening on localhost.",
        hint: "Use `netstat -ano` on Windows or `sudo netstat -tulnp | grep :80` on Linux to inspect active listeners."
      },
      quiz: [
        {
          question: "Which protocol is responsible for translating domain names into IP addresses?",
          options: ["DHCP", "DNS", "HTTP", "FTP"],
          answer: 1,
          explanation: "DNS (Domain Name System) translates human-readable domain names (like google.com) to machine-readable IP addresses."
        },
        {
          question: "What port does SSH (Secure Shell) use by default?",
          options: ["80", "443", "22", "8080"],
          answer: 2,
          explanation: "SSH defaults to Port 22 for secure command-line access to remote systems."
        },
        {
          question: "What is the difference between TCP and UDP?",
          options: ["TCP is faster, UDP is reliable", "TCP is reliable and guarantees delivery, UDP is fast but does not guarantee delivery", "TCP is only for websites, UDP is for databases", "TCP does not use IP addresses"],
          answer: 1,
          explanation: "TCP is connection-oriented and guarantees that all packets arrive in order. UDP is connectionless and sends packets immediately without verification, making it faster but less reliable."
        }
      ],
      interview: [
        {
          q: "What happens when you type 'google.com' in a browser and hit enter?",
          ans: {
            beg: "The browser looks up the website's IP address using DNS, connects to that IP on port 443, and displays the webpage code it receives.",
            int: "1. Browser checks cache for DNS. 2. DNS resolver queries root, TLD, and authoritative nameservers to resolve the IP. 3. TCP 3-Way Handshake is established with the target IP. 4. TLS Handshake encrypts the connection. 5. Browser sends an HTTP GET request. 6. Server processes it and returns an HTML/CSS/JS response.",
            scenario: "If a user reports 'Site cannot be reached' but you can ping the IP directly, the issue lies in the DNS resolution phase or local hosts file configuration."
          }
        },
        {
          q: "What is the difference between public IP and private IP?",
          ans: {
            beg: "Public IP is visible to the whole internet. Private IP is only used inside your home or company network.",
            int: "A public IP is globally unique and routable on the public internet, assigned by ISPs. A private IP (defined by RFC 1918 ranges, e.g., 10.x.x.x, 192.168.x.x) is used inside local area networks (LANs) and VPCs to communicate without exposing machines directly to the internet.",
            scenario: "In AWS, an application server runs on a private IP for security. A load balancer with a public IP accepts user requests and forwards them to the private instances."
          }
        }
      ]
    },
    {
      id: "git",
      title: "Git & GitHub",
      story: "In DevOps, everything is code. To save your progress, coordinate with allies, and prevent code disasters, you must master the Time-Machine of Git.",
      icon: "🐙",
      xpReward: 300,
      skills: ["git_basics", "github_flows"],
      stats: { git: 20 },
      knowledge: {
        concept: "Git is a version control system that tracks history of file changes, letting you roll back time if code breaks. GitHub is a cloud library where teams share and merge Git repositories.",
        whyExists: "Without Git, teams would overwrite each other's code by sending files via email or ZIPs, making collaboration on the same app impossible.",
        problemSolved: "Git solves conflicts. It lets thousands of developers work on the same codebase simultaneously, tracks who made what change, and makes merging updates simple.",
        internals: "Git stores data as a tree of commits (snapshots). Your files live in three states: **Working Directory** (current changes), **Staging Area** (prepared for save), and **Local Repository** (committed history).",
        companyUse: "Companies use Git to enforce code reviews. Developers write code, push to a GitHub 'Pull Request', and automated systems run tests before merging it to production.",
        whatsNext: "With Git working, we will deploy our code onto the cloud. Next is AWS, where we launch virtual servers to run the code we pushed.",
        examples: [
          { title: "Committing Code", desc: "`git add .` stages all changes. `git commit -m 'feat: login'` creates a permanent history point." },
          { title: "Branching", desc: "`git checkout -b feature-payment` creates an isolated playground for new features." }
        ]
      },
      visualFlow: [
        { label: "Working Directory", detail: "Edit files locally" },
        { label: "Staging Area", detail: "Run 'git add' to queue changes" },
        { label: "Local Repo", detail: "Run 'git commit' to save snapshot" },
        { label: "GitHub Remote", detail: "Run 'git push' to upload online" }
      ],
      handsOn: {
        objective: "Initialize a local Git repository, perform commits, and create a branch.",
        steps: [
          "Initialize Git: `git init`",
          "Configure identity: `git config --global user.name 'Hero'`",
          "Check status: `git status`",
          "Stage your file: `git add scroll.txt`",
          "Commit changes: `git commit -m 'feat: initial scroll commit'`",
          "Create and switch to a branch: `git checkout -b feature/quest`"
        ]
      },
      challenge: {
        title: "The Split Timeline",
        desc: "Create a branch named `hotfix`, make a change to `scroll.txt` (e.g. edit the text to 'DevOps is super awesome'), commit it, and merge it back to the `main` branch.",
        hint: "Use `git checkout main` and then `git merge hotfix` to combine the histories."
      },
      quiz: [
        {
          question: "Which command uploads local commits to a remote repository like GitHub?",
          options: ["git commit", "git push", "git pull", "git upload"],
          answer: 1,
          explanation: "`git push` sends committed changes from your local repository to a remote repository."
        },
        {
          question: "What is the staging area in Git?",
          options: ["A temporary folder where deleted files go", "An intermediate place to prepare changes before committing them", "The production server where code runs", "A branch for testing code"],
          answer: 1,
          explanation: "The Staging Area (index) acts as a draft space where you select which modifications are ready to be included in the next commit."
        },
        {
          question: "How do you download the latest changes from GitHub AND merge them into your local branch automatically?",
          options: ["git fetch", "git pull", "git download", "git sync"],
          answer: 1,
          explanation: "`git pull` is a combination of `git fetch` (downloading data) and `git merge` (combining history)."
        }
      ],
      interview: [
        {
          q: "What is the difference between git fetch and git pull?",
          ans: {
            beg: "git fetch downloads new code but doesn't change your files. git pull downloads and merges the code into your files immediately.",
            int: "git fetch retrieves commits, files, and refs from a remote repository without modifying your local working directory. git pull performs a git fetch followed by a git merge to apply those remote changes to your current branch.",
            scenario: "To inspect what code changes coworkers made without messing up your active work, run git fetch origin and git diff origin/main before merging."
          }
        },
        {
          q: "What is a git merge conflict and how do you resolve it?",
          ans: {
            beg: "It happens when two people edit the same line of a file. You resolve it by opening the file, selecting the correct code, and committing it.",
            int: "A merge conflict occurs when Git cannot automatically reconcile differences between two commits (typically when the same lines of a file are modified in both branches). To resolve, you open the conflicted files, manually choose between incoming and current changes (removing Git markers like <<<<<<< and >>>>>>>), stage the file, and run git commit.",
            scenario: "During a release, if your feature conflicts with another merged PR, use an IDE to merge lines, verify with tests, then run git add and git commit."
          }
        }
      ]
    },
    {
      id: "aws",
      title: "AWS Cloud Basics",
      story: "You ascend to the Cloud Heights. Rather than buying physical servers, you invoke virtual machines, storage blocks, and security gates using the AWS Console.",
      icon: "☁️",
      xpReward: 400,
      skills: ["aws_iam", "aws_ec2", "aws_s3_ebs"],
      stats: { cloud: 25 },
      knowledge: {
        concept: "AWS (Amazon Web Services) is a platform that rents server power, databases, and storage. Instead of maintaining physical hardware, you rent them by the second.",
        whyExists: "Before AWS, launching a website meant buying physical servers, renting datacenter space, and waiting weeks for hardware delivery.",
        problemSolved: "AWS provides global scale. You can launch 1,000 servers in Tokyo in 2 minutes, pay only for what you use, and delete them when done.",
        internals: "AWS runs massive physical data centers globally, divided into **Regions** (geographic locations) and **Availability Zones (AZs)** (individual datacenters). They use hypervisors to slice physical computers into Virtual Machines (EC2).",
        companyUse: "Companies host their entire infrastructure on AWS: EC2 for computing power, S3 for storing files, and IAM for controlling who can access what.",
        whatsNext: "Once you can launch AWS servers, you'll learn how to package applications into light containers using Docker to run on those servers.",
        examples: [
          { title: "AWS EC2", desc: "Elastic Compute Cloud. A virtual Linux server in Amazon's datacenter." },
          { title: "AWS S3", desc: "Simple Storage Service. A digital hard drive in the cloud for storing images, backups, and logs." }
        ]
      },
      visualFlow: [
        { label: "IAM (Security Gate)", detail: "Grants access permissions to users/servers" },
        { label: "EC2 (Virtual Server)", detail: "Runs your app in a virtual machine" },
        { label: "EBS (Attached Hard Drive)", detail: "Stores operating system and persistent data" },
        { label: "S3 (Cloud Storage)", detail: "Stores static files and assets globally" }
      ],
      handsOn: {
        objective: "Understand how to spin up virtual instances and manage user permissions in AWS.",
        steps: [
          "Log into AWS Console and navigate to IAM.",
          "Create a new user with programmatic access named `devops-apprentice`.",
          "Attach the policy `PowerUserAccess` for testing.",
          "Navigate to EC2 and launch a free-tier `t2.micro` running Ubuntu Linux.",
          "Create a Security Group allowing SSH (Port 22) and HTTP (Port 80) from anywhere.",
          "Download your Key Pair (.pem) and connect via terminal: `ssh -i key.pem ubuntu@YOUR_EC2_IP`"
        ]
      },
      challenge: {
        title: "The Cloud Vault",
        desc: "Create an AWS S3 bucket named `devops-quest-vault-[your-name]` using the AWS CLI or Console. Upload a text file named `secret.txt` to it and verify it's stored.",
        hint: "Make sure your S3 bucket name is globally unique, as bucket names are shared across all AWS users!"
      },
      quiz: [
        {
          question: "Which AWS service provides resizable virtual servers in the cloud?",
          options: ["S3", "EC2", "IAM", "RDS"],
          answer: 1,
          explanation: "EC2 (Elastic Compute Cloud) provides virtual computing capacity (servers) in the AWS cloud."
        },
        {
          question: "What is the main purpose of AWS IAM?",
          options: ["To store databases", "To manage user access and permissions to AWS resources securely", "To run container applications", "To route DNS domains"],
          answer: 1,
          explanation: "IAM (Identity and Access Management) controls authentication (who can log in) and authorization (what permissions they have) in your AWS account."
        },
        {
          question: "What is the difference between AWS EBS and AWS S3?",
          options: ["EBS is for databases, S3 is for operating systems", "EBS is a local block store attached to a single EC2; S3 is object storage accessible via URL", "S3 is faster than EBS", "EBS is free, S3 is paid"],
          answer: 1,
          explanation: "EBS (Elastic Block Store) is like a virtual hard drive plugged directly into one EC2 instance. S3 (Simple Storage Service) is object storage that stores files independently of servers and makes them accessible via API/web URLs."
        }
      ],
      interview: [
        {
          q: "What are AWS Security Groups and how do they work?",
          ans: {
            beg: "Security Groups are virtual firewalls that control what network traffic can go in and out of your EC2 servers.",
            int: "AWS Security Groups are stateful virtual firewalls that control inbound and outbound traffic at the EC2 instance level. Stateful means if you allow inbound traffic on port 80, the return traffic is automatically allowed.",
            scenario: "If an EC2 web app is running but users get a timeout error, check if the Security Group allows inbound HTTP traffic on port 80/443 from source 0.0.0.0/0."
          }
        },
        {
          q: "How does IAM enforce the 'Principle of Least Privilege'?",
          ans: {
            beg: "By giving users and apps only the exact permissions they need to do their jobs, and nothing more.",
            int: "It ensures users, roles, and services have the minimum required permissions to perform their specific tasks. We implement this by writing custom IAM policies with specific actions (like s3:GetObject instead of s3:*) restricted to specific resource ARNs.",
            scenario: "Instead of granting full AdminAccess to an EC2 instance that only needs to upload logs to one S3 bucket, create an IAM Role with a policy allowing s3:PutObject on that specific bucket and attach the role to the EC2."
          }
        }
      ]
    },
    {
      id: "docker",
      title: "Docker Basics",
      story: "You reach the Container Port. To stop the 'works on my machine' curse, you must learn to freeze applications, code, and configurations inside lightweight, isolated capsules.",
      icon: "🐳",
      xpReward: 400,
      skills: ["containers_vs_vms", "dockerfile_creation", "docker_compose"],
      stats: { containers: 25 },
      knowledge: {
        concept: "Docker is a tool that packages code, libraries, and settings together into an **Image**. This image runs inside an isolated environment called a **Container**.",
        whyExists: "Before Docker, deploying an app on a server was painful. Server dependencies differed from developer machines, causing crashes (the 'works on my machine' problem).",
        problemSolved: "Docker standardizes environments. A container running on a developer's laptop runs *exactly* the same way on a staging server or on a Kubernetes cluster.",
        internals: "Unlike Virtual Machines which pack a whole guest Operating System, Docker containers share the host Linux Kernel and use kernel features like **Namespaces** (for isolation) and **Cgroups** (for resource limits). This makes them start in milliseconds and use minimal RAM.",
        companyUse: "Companies package their microservices as Docker images, store them in registries (like Docker Hub or AWS ECR), and spin up hundreds of container copies in seconds.",
        whatsNext: "After Docker basics, you will build the Level 1 Boss Project: hosting a website inside a Docker container on an EC2 instance.",
        examples: [
          { title: "Running a Container", desc: "`docker run -d -p 80:80 nginx` downloads and runs a prebuilt Nginx web server container." },
          { title: "Building an Image", desc: "`docker build -t my-app .` reads a Dockerfile script and compiles your custom app image." }
        ]
      },
      visualFlow: [
        { label: "Dockerfile", detail: "Recipe script: base image, copy code, set command" },
        { label: "Docker Image", detail: "Built static package (frozen read-only file system)" },
        { label: "Docker Registry", detail: "Cloud library sharing images (Docker Hub, AWS ECR)" },
        { label: "Docker Container", detail: "Running, isolated instance of the image" }
      ],
      handsOn: {
        objective: "Write a Dockerfile, build a custom image, and orchestrate containers with Docker Compose.",
        steps: [
          "Install Docker Desktop or run on your EC2 Linux instance.",
          "Create a file named `Dockerfile` with these instructions:",
          "  `FROM nginx:alpine`",
          "  `COPY index.html /usr/share/nginx/html/`",
          "Create an `index.html` file with: `<h1>Hello Docker World</h1>`.",
          "Build your image: `docker build -t quest-web:1.0 .`",
          "Run the container: `docker run -d -p 8080:80 quest-web:1.0`",
          "Open `http://localhost:8080` to verify your containerized site runs!"
        ]
      },
      challenge: {
        title: "The Container Orchestra",
        desc: "Create a `docker-compose.yml` file that runs a frontend web container (Nginx) and a backend container (Redis) together on the same network.",
        hint: "Define two services under the `services` block: `web` (ports: - '80:80') and `db` (image: redis:alpine)."
      },
      quiz: [
        {
          question: "What is the primary difference between a Docker container and a Virtual Machine?",
          options: ["Containers are more secure", "Virtual Machines share the host OS kernel; Containers contain separate guest OS kernels", "Containers share the host OS kernel; Virtual Machines contain a full guest OS", "Containers only run on Linux"],
          answer: 2,
          explanation: "Containers are lightweight because they share the host operating system's kernel, whereas VMs run a complete separate guest OS on top of a hypervisor."
        },
        {
          question: "Which file is used to define instructions for building a Docker image?",
          options: ["docker-compose.yml", "Dockerfile", "package.json", "docker.config"],
          answer: 1,
          explanation: "The `Dockerfile` is a text document containing all the commands a user could call on the command line to assemble an image."
        },
        {
          question: "What is the purpose of Docker Compose?",
          options: ["To compile Docker source code", "To run and manage multi-container Docker applications using a single YAML file", "To host private Docker images online", "To manage AWS EC2 instances"],
          answer: 1,
          explanation: "`docker-compose` allows you to define services, networks, and volumes for multiple containers in a single `docker-compose.yml` file and launch them with `docker-compose up`."
        }
      ],
      interview: [
        {
          q: "What is the difference between a Docker Image and a Docker Container?",
          ans: {
            beg: "An image is like a recipe or blueprint (static file). A container is the actual cake baked from the recipe (running process).",
            int: "A Docker Image is a read-only, immutable template consisting of stacked layers containing the application code, runtime, libraries, and environment. A Docker Container is a running, writable instance of an image. You can launch multiple containers from a single image.",
            scenario: "If code updates, you must rebuild the image (`docker build`) and replace the running container with a new one constructed from the updated image."
          }
        },
        {
          q: "What are Docker volumes and why do we use them?",
          ans: {
            beg: "Volumes are folders on the host computer that containers use to save data so it doesn't disappear when the container stops.",
            int: "Docker volumes are directories mapped outside of the container's Union File System, hosted on the host machine. They bypass container layer copies, making reads/writes fast and allowing data persistence and sharing across containers.",
            scenario: "For a database container (e.g., PostgreSQL), if you stop or update the container, all data inside it is lost by default. Mount a volume to `/var/lib/postgresql/data` to keep DB data safe across container restarts."
          }
        }
      ]
    },
    {
      id: "level1_boss",
      title: "Level 1 Final Boss: Cloud Portal Deploy",
      story: "The Gatekeeper of the Apprentice Level stands before you. To secure your promotion to DevOps Adventurer, you must deploy a live, custom static website on an AWS EC2 instance using Git version control and Docker containers.",
      icon: "👹",
      xpReward: 600,
      skills: ["aws_ec2", "git_basics", "dockerfile_creation"],
      stats: { cloud: 30, containers: 30 },
      knowledge: {
        concept: "The Final Boss combines everything you've learned. You will write a static webpage, commit it to Git, push it, launch an EC2 instance, install Docker, pull the code, and run it as an Nginx container.",
        whyExists: "This project mirrors a real developer workflow: writing code locally, managing it with Git, and deploying it inside containers on cloud servers.",
        problemSolved: "It proves you can integrate cloud computing (AWS), containerization (Docker), and version control (Git) to deploy a live, public application.",
        internals: "The client browser makes an HTTP request to the public IP of your AWS EC2 instance on Port 80. The security group permits it. The Linux kernel forwards it to the Docker engine, which maps it to the Nginx process running inside the isolated container.",
        companyUse: "Every web company uses this architecture in staging and production to run lightweight microservices on virtual cloud instances.",
        whatsNext: "Defeating the Boss unlocks Level 2, where you will build automated CI/CD pipelines (Jenkins & GitHub Actions) to deploy apps automatically without manual SSH commands.",
        examples: [
          { title: "Architecture", desc: "User Browser -> DNS (Optional) -> AWS EC2 (Port 80) -> Docker Container (Nginx) -> Local Index.html" },
          { title: "Verification", desc: "Accessing the public IPv4 DNS of your EC2 instance displays your customized landing page." }
        ]
      },
      visualFlow: [
        { label: "Write HTML & Dockerfile", detail: "Create web app locally" },
        { label: "Git Commit & Push", detail: "Push code to GitHub" },
        { label: "Launch AWS EC2", detail: "Create Ubuntu server, open ports 22 & 80" },
        { label: "Install Docker & Run", detail: "SSH into EC2, clone repo, run Nginx container" }
      ],
      handsOn: {
        objective: "Deploy a dockerized static page on a live AWS EC2 instance.",
        steps: [
          "Create a new folder `boss-project` on your local machine.",
          "Create `index.html` with a custom title 'DevOps Apprentice Portal'. Add CSS styling for a cool design.",
          "Create a `Dockerfile` using `FROM nginx:alpine` and copying the `index.html` file into the container.",
          "Initialize Git, commit the files, and push them to a public GitHub repository.",
          "Launch a free-tier AWS EC2 instance (Ubuntu) and open port 80 and 22 in its Security Group.",
          "SSH into your EC2 instance: `ssh -i your-key.pem ubuntu@your-ec2-ip`.",
          "Install Docker on EC2: `sudo apt-get update && sudo apt-get install -y docker.io`.",
          "Clone your GitHub repository on the EC2 server: `git clone [your-repo-url]`.",
          "Build the Docker image inside the EC2 instance: `sudo docker build -t portal-site .`.",
          "Run the container: `sudo docker run -d -p 80:80 portal-site`.",
          "Open your web browser and go to your EC2 instance's Public IP. You should see your custom website live!"
        ]
      },
      challenge: {
        title: "The Zero-Downtime Update",
        desc: "Without stopping the web server, make an edit to your code locally, push it, pull it on the EC2 instance, build a new version `portal-site:v2`, and run it on port 8080 to test. Once verified, stop the port 80 container and map the new version to port 80.",
        hint: "Use `docker ps` to see running containers, `docker stop [id]` to stop them, and run the new container in its place."
      },
      quiz: [
        {
          question: "When running the command `docker run -d -p 80:80 portal-site`, what does the `-p 80:80` segment do?",
          options: ["It assigns 80 containers to run", "It binds port 80 of the host machine to port 80 inside the container", "It opens port 80 on the AWS Security Group", "It defines a limit of 80% CPU"],
          answer: 1,
          explanation: "The `-p hostPort:containerPort` flag publishes/binds a port of the host system to a port inside the container so traffic can flow inside."
        },
        {
          question: "Which of the following is required in the EC2 Security Group to see your website from a web browser?",
          options: ["Inbound Rule allowing SSH on port 22", "Inbound Rule allowing HTTP on port 80 from 0.0.0.0/0", "Outbound Rule blocking all traffic", "Inbound Rule allowing database access on port 3306"],
          answer: 1,
          explanation: "Web browsers connect over HTTP (port 80) by default. The security group must allow inbound traffic on port 80 from anywhere (0.0.0.0/0)."
        },
        {
          question: "Why do we use a container (Docker) to run the website instead of installing Nginx directly on the EC2 operating system?",
          options: ["Installing Nginx on EC2 is impossible", "Docker guarantees that the exact Nginx configuration works independent of the EC2 OS version/dependencies", "Containers are free, but Nginx requires a license", "Docker makes websites load faster"],
          answer: 1,
          explanation: "Docker isolates dependencies, making the deployment uniform and portable. The container runs exactly the same way regardless of whether the EC2 runs Ubuntu, Amazon Linux, or RedHat."
        }
      ],
      interview: [
        {
          q: "Explain how you deployed the Level 1 Boss Project.",
          ans: {
            beg: "I created an HTML website and a Dockerfile locally, committed them to Git, pushed them to GitHub, launched a virtual EC2 server in AWS, installed Docker, cloned my code on it, built the Docker image, and ran the container on port 80.",
            int: "I implemented a manual deployment workflow by writing a custom static web page hosted in an Nginx-alpine base container defined by a Dockerfile. The source code was versioned in Git and pushed to GitHub. On AWS, I provisioned an EC2 instance with custom Security Groups (allowing SSH on 22, HTTP on 80). Using SSH, I logged in, installed the Docker engine, cloned the repository, compiled the image, and bound port 80 of the host to port 80 of the container.",
            scenario: "To scale this up in a real environment, we would automate the deployment using a Jenkins or GitHub Actions CI/CD pipeline, and push the image to AWS ECR instead of building it directly on the production host."
          }
        }
      ]
    }
  ]
};

// Export to window object for browser access
if (typeof window !== 'undefined') {
  window.level1Data = level1Data;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = level1Data;
}
