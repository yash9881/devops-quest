// js/gamification.js

const gamificationSystem = {
  // Title mapping based on level
  getTitleForLevel(level) {
    if (level >= 10) return "Grandmaster DevOps Engineer 👑";
    if (level >= 8) return "Lead Cloud Architect 🌌";
    if (level >= 5) return "Senior DevOps Adventurer ⚔️";
    if (level >= 3) return "Kubernetes Pathfinder ☸️";
    if (level >= 2) return "Platform Squire 🛡️";
    return "Apprentice Initiate 🐚";
  },

  // Calculate level based on XP
  calculateLevel(xp) {
    // Level 1: 0 - 999 XP
    // Level 2: 1000 - 2999 XP (requires 1000 total)
    // Level 3: 3000 - 5999 XP (requires 3000 total)
    // Level 4: 6000+ XP
    if (xp >= 6000) return 4;
    if (xp >= 3000) return 3;
    if (xp >= 1000) return 2;
    return 1;
  },

  // Get next level XP threshold
  getXpThreshold(level) {
    if (level === 1) return 1000;
    if (level === 2) return 3000;
    if (level === 3) return 6000;
    return (level - 1) * 3000;
  },

  // Badges catalog
  badges: {
    linux: { id: "linux", name: "Bash Conqueror 🐚", desc: "Completed the Linux & Shell Scripting quest.", icon: "🐚", color: "#00E5FF" },
    networking: { id: "networking", name: "Network Navigator 🌐", desc: "Established secure ports and DNS networks.", icon: "🌐", color: "#2979FF" },
    git: { id: "git", name: "Git Time-Lord 🐙", desc: "Mastered git timeline manipulation.", icon: "🐙", color: "#F50057" },
    aws: { id: "aws", name: "Sky Walker ☁️", desc: "Launched EC2 instances and IAM policies.", icon: "☁️", color: "#FF9100" },
    docker: { id: "docker", name: "Container Captain 🐳", desc: "Built docker images and composed networks.", icon: "🐳", color: "#00E5FF" },
    level1_boss: { id: "level1_boss", name: "Gate Defeated 👹", desc: "Deployed a live website on AWS using Git & Docker.", icon: "👹", color: "#FF1744" },
    jenkins: { id: "jenkins", name: "Pipeline Wizard 🏗️", desc: "Automated Maven/SonarQube build streams.", icon: "🏗️", color: "#D500F9" },
    github_actions: { id: "github_actions", name: "Action Hero ⚙️", desc: "Orchestrated cloud serverless pipelines.", icon: "⚙️", color: "#00E676" },
    terraform: { id: "terraform", name: "Terraformer 🏗️", desc: "Manifested cloud networks through code files.", icon: "🏗️", color: "#AA00FF" },
    kubernetes: { id: "kubernetes", name: "K8s Commander ☸️", desc: "Orchestrated scaling nodes and Pod services.", icon: "☸️", color: "#2979FF" },
    monitoring: { id: "monitoring", name: "Lord of Metrics 📊", desc: "Configured telemetry scans and dashboards.", icon: "📊", color: "#FFC400" },
    level2_boss: { id: "level2_boss", name: "Grand Overlord Slayer 🐉", desc: "Orchestrated a fully automated CI/CD pipeline on K8s.", icon: "🐉", color: "#FF1744" },
    task_manager: { id: "task_manager", name: "Task Conqueror 📋", desc: "Completed the Cloud Native Task Manager.", icon: "📋", color: "#00E676" },
    netflix_clone: { id: "netflix_clone", name: "Stream Master 🎬", desc: "Orchestrated the Netflix Clone CI/CD pipelines.", icon: "🎬", color: "#F50057" },
    ecommerce_infra: { id: "ecommerce_infra", name: "Trade King 🛒", desc: "Engineered HA Production E-Commerce on EKS.", icon: "🛒", color: "#FFD600" }
  },

  // Achievements list
  achievements: [
    { id: "first_xp", name: "First Blood 🩸", desc: "Gained your first XP points in DevOps Quest.", trigger: (state) => state.xp > 0 },
    { id: "halfway_level1", name: "Apprentice Adept 🛡️", desc: "Completed 3 Level 1 Chapters.", trigger: (state) => {
      const level1Ids = ["linux", "networking", "git", "aws", "docker"];
      const doneCount = level1Ids.filter(id => state.completedQuizzes.includes(id)).length;
      return doneCount >= 3;
    }},
    { id: "level1_master", name: "Ascendant Adept ✨", desc: "Cleared all Level 1 challenges and the Boss project.", trigger: (state) => state.badges.includes("level1_boss") },
    { id: "full_mark", name: "Mind Palace 🧠", desc: "Cleared a quiz with a perfect score.", trigger: (state) => state.lastQuizPerfectScore === true },
    { id: "all_skills", name: "DevOps Oracle 🔮", desc: "Unlocked all skills in the skill tree.", trigger: (state) => state.completedQuizzes.length >= 10 }
  ],

  // Check achievements and award them
  checkAchievements(state, notifyCallback) {
    let newAchievements = [];
    this.achievements.forEach(ach => {
      if (!state.achievements.includes(ach.id) && ach.trigger(state)) {
        state.achievements.push(ach.id);
        newAchievements.push(ach);
        if (notifyCallback) notifyCallback(ach);
      }
    });
    return newAchievements;
  },

  // Initialize a fresh game state
  getInitialState() {
    return {
      username: "DevOps Recruit",
      avatar: "warrior", // warrior, wizard, rogue, hunter
      xp: 0,
      level: 1,
      completedQuizzes: [],
      completedTasks: [],
      completedChallenges: [],
      attributes: {
        linux: 1,
        networking: 1,
        git: 1,
        cloud: 1,
        containers: 1,
        cicd: 1
      },
      badges: [],
      achievements: [],
      lastQuizPerfectScore: false,
      dailyQuests: [
        { id: "daily_read", text: "Read a concept scroll 📖", target: 1, current: 0, xp: 50, completed: false },
        { id: "daily_boss", text: "Defeat a boss quiz ⚔️", target: 1, current: 0, xp: 100, completed: false }
      ],
      weeklyChallenge: {
        id: "weekly_challenge",
        text: "Earn 1,500 total XP points",
        target: 1500,
        current: 0,
        xp: 300,
        completed: false
      }
    };
  },

  // Add XP and handle level up
  addXp(state, amount, notifyLevelUpCallback) {
    const oldLevel = state.level;
    state.xp += amount;
    
    // Update weekly challenge progress
    if (!state.weeklyChallenge.completed) {
      state.weeklyChallenge.current = Math.min(state.weeklyChallenge.target, state.xp);
      if (state.weeklyChallenge.current >= state.weeklyChallenge.target) {
        state.weeklyChallenge.completed = true;
        state.xp += state.weeklyChallenge.xp;
      }
    }

    const newLevel = this.calculateLevel(state.xp);
    
    if (newLevel > oldLevel) {
      state.level = newLevel;
      // Increment random attributes
      const attrs = Object.keys(state.attributes);
      attrs.forEach(attr => {
        state.attributes[attr] += Math.floor(Math.random() * 3) + 1; // Increase stat randomly
      });
      if (notifyLevelUpCallback) {
        notifyLevelUpCallback(newLevel, state.attributes);
      }
    }
  }
};

if (typeof window !== 'undefined') {
  window.gamificationSystem = gamificationSystem;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = gamificationSystem;
}
