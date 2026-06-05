// js/level3_data.js

const level3Data = {
  id: "level3",
  title: "Level 3: DevOps Engineer",
  description: "Complete industry-grade projects, craft your DevOps resume, and prepare for interviews.",
  projects: [
    {
      id: "task_manager",
      title: "Project 1: Cloud Native Task Manager",
      story: "You have arrived at the Citadel. To earn your DevOps badge, you must construct a modern, cloud-native Task Manager app, containerize it, build a GitHub Actions pipeline, provision cloud networks via Terraform, and monitor it on Kubernetes.",
      icon: "📋",
      xpReward: 1000,
      techStack: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus", "Grafana"],
      architecture: [
        "User Browser -> AWS Route 53 (DNS)",
        "-> Application Load Balancer (ALB) managed by AWS VPC",
        "-> AWS EKS (Elastic Kubernetes Service) Cluster Nodes",
        "-> Task Manager Frontend Pods (React) & Backend API Pods (Go/Node.js)",
        "-> AWS RDS (Relational Database Service) PostgreSQL",
        "-> Prometheus (Scrapes Pod Metrics) & Grafana (Visualizes Dashboards)"
      ],
      folderStructure: `task-manager-devops/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── terraform/
│   ├── main.tf                 # Terraform resource declarations
│   ├── variables.tf            # Variables config
│   ├── outputs.tf              # State outputs
│   └── terraform.tfvars        # Active variable inputs
├── k8s/
│   ├── frontend-deploy.yaml    # React Pods & Services
│   ├── backend-deploy.yaml     # API Pods & Services
│   ├── ingress.yaml            # ALB routing rules
│   ├── configmap.yaml          # Config values
│   └── secrets.yaml            # Encrypted db passwords (base64)
├── src/
│   ├── frontend/               # React app code & Dockerfile
│   └── backend/                # API service code & Dockerfile
└── prometheus/
    └── prometheus.yml          # Scrape target rules`,
      githubStructure: [
        "main branch: Stable, release-ready code.",
        "dev branch: Active development branch.",
        "PR protection: Require 1 approving review and passing GitHub Actions tests before merging to main."
      ],
      cicdPipeline: `name: Build & Deploy Task Manager
on:
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Backend Tests
        run: cd src/backend && npm install && npm test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Login to AWS ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      - name: Build & Push Backend
        run: |
          docker build -t \${{ steps.login-ecr.outputs.registry }}/task-backend:latest src/backend
          docker push \${{ steps.login-ecr.outputs.registry }}/task-backend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update Kubeconfig
        run: aws eks update-kubeconfig --name task-cluster --region us-east-1
      - name: Deploy to EKS
        run: |
          kubectl apply -f k8s/configmap.yaml
          kubectl apply -f k8s/secrets.yaml
          kubectl apply -f k8s/backend-deploy.yaml
          kubectl apply -f k8s/frontend-deploy.yaml
          kubectl rollout status deployment/task-backend-deploy`,
      monitoringSetup: `1. Enable Prometheus annotations in k8s deployment:
   spec.template.metadata.annotations:
     prometheus.io/scrape: "true"
     prometheus.io/port: "8080"
2. Install Prometheus Operator using Helm.
3. Import Grafana Dashboard ID 1860 (Node Exporter Full) to track cluster CPU/RAM.
4. Set up alert in Prometheus for high memory usage (>85%).`,
      securityBestPractices: [
        "Secrets Management: Never commit raw passwords to Git. Inject them using AWS Secrets Manager or sealed Kubernetes Secrets.",
        "IAM Roles: Use IAM Roles for Service Accounts (IRSA) to grant pods access to AWS RDS instead of static keys.",
        "Container Security: Run containers as non-root users and scan images using Trivy in GitHub Actions."
      ],
      resumeDescription: [
        "Architected and deployed a multi-tier containerized Task Manager application on AWS EKS, improving deployment speed by 60% using GitHub Actions CI/CD pipelines.",
        "Provisioned scalable cloud networks, subnets, and EC2 instances on AWS using reusable Terraform modules, maintaining state files in S3 with DynamoDB state locking.",
        "Configured Prometheus metric collection and designed Grafana dashboards, reducing average issue resolution time by 30% through Slack alert integrations."
      ],
      interviewExplanation: {
        scenario: "Tell me about a time you deployed a cloud-native application.",
        guide: "Start with SITUATION: We needed to migrate a legacy task app to a scalable, automated cloud environment. TASK: My job was to containerize the app, write infrastructure as code, build the deployment pipeline, and configure monitoring. ACTION: I containerized the services using Docker, wrote Terraform scripts to deploy an AWS EKS cluster, constructed a GitHub Actions pipeline to run tests and push images to AWS ECR, and configured Prometheus/Grafana. RESULT: The app scales automatically based on load, and deployment is completed in 3 minutes with zero downtime."
      }
    },
    {
      id: "netflix_clone",
      title: "Project 2: Netflix Clone DevOps Pipeline",
      story: "You enter the Media streaming territory. Your mission is to automate the deployment of a React Netflix Clone. You will set up a Jenkins master/agent cluster, run SonarQube quality scans, upload packages to Nexus, and deploy the application on AWS EKS.",
      icon: "🎬",
      xpReward: 1000,
      techStack: ["React", "Docker", "Jenkins", "Kubernetes", "Terraform", "AWS"],
      architecture: [
        "User Browser -> Route 53 -> CloudFront (CDN)",
        "-> Application Load Balancer -> AWS EKS Cluster Nodes",
        "-> Netflix Clone Frontend Pods (Nginx serving static React build)",
        "-> Jenkins Master Server (AWS EC2) -> Jenkins Agents (AWS EC2)",
        "-> SonarQube Server (EC2) & Nexus Repository Manager (EC2)"
      ],
      folderStructure: `netflix-clone-devops/
├── Jenkinsfile                 # Multi-stage build script
├── terraform/
│   ├── main.tf                 # Provisions EKS, EC2 for Jenkins
│   ├── variables.tf
│   └── outputs.tf
├── k8s/
│   ├── deployment.yaml         # Netflix App deployment
│   ├── service.yaml            # LoadBalancer service
│   └── ingress.yaml
├── Dockerfile                  # Multi-stage React build
└── package.json`,
      githubStructure: [
        "main branch: Monitored by Jenkins for automatic releases.",
        "feature branches: Built and analyzed by Jenkins on PR creation."
      ],
      cicdPipeline: `pipeline {
    agent any
    environment {
        REGISTRY = "docker.io/hero"
        IMAGE_NAME = "netflix-clone"
        TAG = "\${BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv('SonarQube-Server') {
                        sh "\${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=netflix"
                    }
                }
            }
        }
        stage('Build Image') {
            steps {
                sh "docker build -t \${REGISTRY}/\${IMAGE_NAME}:\${TAG} ."
            }
        }
        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "docker login -u \${USER} -p \${PASS}"
                    sh "docker push \${REGISTRY}/\${IMAGE_NAME}:\${TAG}"
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh "sed -i 's|IMAGE_PLACEHOLDER|\${REGISTRY}/\${IMAGE_NAME}:\${TAG}|g' k8s/deployment.yaml"
                sh "kubectl apply -f k8s/deployment.yaml"
                sh "kubectl apply -f k8s/service.yaml"
            }
        }
    }
}`,
      monitoringSetup: `1. Monitor Jenkins agent CPU/RAM load using Prometheus Node Exporter.
2. Monitor application response times using CloudFront latency dashboards.
3. Configure Jenkins Slack Plugin to send build status messages to the dev-team channel.`,
      securityBestPractices: [
        "SonarQube Quality Gate: Enforce rules that fail the Jenkins pipeline if critical vulnerabilities are discovered in JavaScript libraries.",
        "Secure Jenkins: Run Jenkins behind a reverse proxy (Nginx) with SSL enabled, and enforce RBAC (Role-Based Access Control) for users.",
        "Docker Security: Minimize image size by using multi-stage builds (`node:alpine` for build, `nginx:alpine` for serve) to reduce attack surface."
      ],
      resumeDescription: [
        "Designed and implemented a Jenkins CI/CD pipeline featuring SonarQube static analysis and automated Docker Hub image packaging, ensuring code quality before deployments.",
        "Scaled build infrastructure by establishing a Jenkins Master-Agent architecture on AWS EC2, reducing pipeline build queues by 45%.",
        "Managed Kubernetes manifest deployments, creating zero-downtime rolling updates of client-facing web applications."
      ],
      interviewExplanation: {
        scenario: "Describe how you managed code quality and security in your pipeline.",
        guide: "Start with SITUATION: We were deploying a React web application but had security issues in dependencies. TASK: I had to implement automated code auditing in the CI/CD pipeline. ACTION: I integrated SonarQube with a Jenkins pipeline, configuring a webhook that pauses the build until SonarQube returns a quality scan report. I set a 'Quality Gate' rule that aborts the pipeline if security drops. I also wrote multi-stage Dockerfiles to keep images small and secure. RESULT: We caught 95% of security bugs and code smells before they went live, keeping our production secure."
      }
    },
    {
      id: "ecommerce_infra",
      title: "Project 3: Production E-Commerce Infrastructure",
      story: "You enter the High-Traffic Retail Zone. Your mission is to build a highly available, auto-scaling, and secure production infrastructure for an E-Commerce application. You must orchestrate EKS node groups, set up Ingress rules, secure configuration, and connect advanced monitoring.",
      icon: "🛒",
      xpReward: 1200,
      techStack: ["AWS EKS", "Terraform", "Docker", "Kubernetes", "GitHub Actions", "Prometheus", "Grafana"],
      architecture: [
        "User Browser -> Route 53 (DNS) -> AWS Ingress Controller (ALB)",
        "-> AWS EKS Cluster (Elastic Kubernetes Service)",
        "-> Private Subnets containing EKS Managed Node Groups (Auto-scaling)",
        "-> Microservices Pods: Cart, Catalog, Payments, Auth",
        "-> Internal Cluster IP Services -> External Ingress Routing",
        "-> AWS RDS (Multi-AZ Postgres DB) & AWS ElastiCache (Redis Cache)"
      ],
      folderStructure: `ecommerce-infrastructure/
├── .github/
│   └── workflows/
│       └── production-deploy.yml
├── terraform/
│   ├── vpc.tf                  # Provisions HA network (3 AZs, NAT Gateways)
│   ├── eks.tf                  # Provisions EKS control plane & node groups
│   ├── rds.tf                  # Provisions Multi-AZ database
│   ├── variables.tf
│   └── outputs.tf
├── k8s/
│   ├── catalog-service.yaml    # Catalog app Deployment & Service
│   ├── cart-service.yaml       # Cart app Deployment & Service
│   ├── ingress-controller.yaml # ALB Ingress controller setup
│   └── hpa.yaml                # Horizontal Pod Autoscaling (HPA) settings
└── monitoring/
    ├── prometheus-rules.yaml   # Custom AlertManager alert rules
    └── grafana-dashboard.json  # E-commerce dashboard template`,
      githubStructure: [
        "main branch: Production-grade deployments, requiring approval from lead engineers.",
        "release/* branches: For staging and QA validation before production push."
      ],
      cicdPipeline: `name: Production Infrastructure & App Deployment
on:
  release:
    types: [published]
jobs:
  terraform-apply:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      - name: Terraform Apply
        run: |
          cd terraform
          terraform init
          terraform apply -auto-approve
  deploy-services:
    needs: terraform-apply
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure Kubeconfig
        run: aws eks update-kubeconfig --name prod-cluster --region us-east-1
      - name: Deploy Microservices
        run: |
          kubectl apply -f k8s/catalog-service.yaml
          kubectl apply -f k8s/cart-service.yaml
          kubectl apply -f k8s/ingress-controller.yaml
          kubectl apply -f k8s/hpa.yaml`,
      monitoringSetup: `1. Implement Prometheus Node Exporter and kube-state-metrics in the EKS cluster.
2. Build custom Grafana dashboards visualizing CPU limit saturation, HTTP latency, and active database connection counts.
3. Configure AlertManager to trigger PagerDuty phone/text notifications if Kubernetes Pod restarts exceed 5 in 10 minutes.`,
      securityBestPractices: [
        "Network Isolation: EKS worker nodes must be provisioned in private subnets, with NAT gateways handling egress internet calls only.",
        "IAM Access Control: Configure AWS EKS OIDC provider to bind Kubernetes ServiceAccounts directly to restricted AWS IAM Roles.",
        "Secrets Encryption: Enable KMS envelope encryption for Kubernetes secrets stored in the EKS cluster's backing etcd database."
      ],
      resumeDescription: [
        "Designed and deployed a highly-available AWS EKS cluster spanning 3 Availability Zones using Terraform, supporting high-traffic microservices.",
        "Implemented Horizontal Pod Autoscaler (HPA) and EKS Cluster Autoscaler, enabling the infrastructure to dynamically scale from 10 to 50 nodes, handling traffic spikes of 300%.",
        "Orchestrated Kubernetes Ingress using AWS ALB Ingress Controller, securing path-based routing rules and SSL/TLS terminations via AWS Certificate Manager (ACM)."
      ],
      interviewExplanation: {
        scenario: "Explain how you designed an infrastructure to scale and handle traffic spikes.",
        guide: "Start with SITUATION: We were preparing an e-commerce platform for a major sales event expecting 5x normal traffic. TASK: My job was to design an autoscaling, resilient cloud network. ACTION: I used Terraform to build an AWS VPC with private subnets across 3 AZs. On EKS, I configured EKS Managed Node Groups with Cluster Autoscaler to add virtual servers when physical limits were reached. Inside Kubernetes, I configured the Horizontal Pod Autoscaler (HPA) to monitor CPU metrics and spin up extra pod replicas. I also set up CloudFront for caching and ALB for traffic distribution. RESULT: During the sales peak, EKS successfully scaled up pods and nodes automatically, maintaining response times below 200ms with zero downtime."
      }
    }
  ]
};

// Export to window object for browser access
if (typeof window !== 'undefined') {
  window.level3Data = level3Data;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = level3Data;
}
