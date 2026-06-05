// js/skills.js

const skillTree = {
  nodes: [
    // Level 1 Nodes
    { id: "linux_basics", label: "Linux Foundations", description: "Master files, permissions, SSH, and terminal control.", level: 1, x: 100, y: 150, unlockedBy: null, chapterId: "linux" },
    { id: "bash_scripting", label: "Bash Scripting", description: "Automate system tasks using conditional shell loops.", level: 1, x: 280, y: 150, unlockedBy: "linux_basics", chapterId: "linux" },
    { id: "networking_basics", label: "DevOps Networking", description: "Understand TCP/IP, DNS routing, and firewall rules.", level: 1, x: 100, y: 300, unlockedBy: null, chapterId: "networking" },
    { id: "git_vcs", label: "Git Version Control", description: "Branch, stash, commit, and manage source file history.", level: 1, x: 100, y: 450, unlockedBy: null, chapterId: "git" },
    { id: "github_flows", label: "GitHub Workflows", description: "Collaborate via Pull Requests, code reviews, and forks.", level: 1, x: 280, y: 450, unlockedBy: "git_vcs", chapterId: "git" },
    { id: "aws_basics", label: "AWS Cloud Basics", description: "Deploy virtual servers (EC2) and configure access (IAM).", level: 1, x: 460, y: 300, unlockedBy: "networking_basics", chapterId: "aws" },
    { id: "docker_containers", label: "Docker Containers", description: "Freeze application environments inside light runtimes.", level: 1, x: 460, y: 450, unlockedBy: "github_flows", chapterId: "docker" },
    
    // Level 2 Nodes
    { id: "jenkins_ci", label: "Jenkins pipelines", description: "Automate compiling, quality testing (SonarQube) and publishing.", level: 2, x: 640, y: 150, unlockedBy: "docker_containers", chapterId: "jenkins" },
    { id: "github_actions", label: "GitHub Actions", description: "Build serverless continuous integration in YAML workflows.", level: 2, x: 640, y: 280, unlockedBy: "docker_containers", chapterId: "github_actions" },
    { id: "terraform_iac", label: "Terraform IaC", description: "Write reusable infrastructure templates for AWS.", level: 2, x: 640, y: 410, unlockedBy: "aws_basics", chapterId: "terraform" },
    { id: "k8s_orchestration", label: "Kubernetes Cluster", description: "Orchestrate scaling, networks, and storage for microservices.", level: 2, x: 820, y: 350, unlockedBy: "terraform_iac", chapterId: "kubernetes" },
    { id: "prometheus_grafana", label: "Observability Stack", description: "Scrape systems telemetry and draw alert dashboards.", level: 2, x: 820, y: 480, unlockedBy: "k8s_orchestration", chapterId: "monitoring" },

    // Level 3 Nodes
    { id: "cloud_native_task", label: "Cloud Native App", description: "Deploy Task Manager on EKS using CI/CD & Monitoring.", level: 3, x: 1000, y: 200, unlockedBy: "k8s_orchestration", chapterId: "task_manager" },
    { id: "netflix_pipeline", label: "Netflix CI/CD", description: "Build Jenkins pipeline with SonarQube quality gates.", level: 3, x: 1000, y: 330, unlockedBy: "jenkins_ci", chapterId: "netflix_clone" },
    { id: "ecommerce_eks", label: "Prod E-Commerce", description: "Establish scalable, secure retail infrastructure on EKS.", level: 3, x: 1000, y: 460, unlockedBy: "prometheus_grafana", chapterId: "ecommerce_infra" }
  ],
  connections: [
    { from: "linux_basics", to: "bash_scripting" },
    { from: "git_vcs", to: "github_flows" },
    { from: "networking_basics", to: "aws_basics" },
    { from: "github_flows", to: "docker_containers" },
    { from: "docker_containers", to: "jenkins_ci" },
    { from: "docker_containers", to: "github_actions" },
    { from: "aws_basics", to: "terraform_iac" },
    { from: "terraform_iac", to: "k8s_orchestration" },
    { from: "k8s_orchestration", to: "prometheus_grafana" },
    { from: "k8s_orchestration", to: "cloud_native_task" },
    { from: "jenkins_ci", to: "netflix_pipeline" },
    { from: "prometheus_grafana", to: "ecommerce_eks" }
  ]
};

if (typeof window !== 'undefined') {
  window.skillTree = skillTree;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = skillTree;
}
