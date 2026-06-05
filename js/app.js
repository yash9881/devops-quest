// js/app.js

// Sound Effects Synthesizer using Web Audio API
const sfx = {
  enabled: true,
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  play(freqs, durations, type = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      let time = this.ctx.currentTime;
      freqs.forEach((f, idx) => {
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(f, time);
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.005, time + durations[idx]);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + durations[idx]);
        time += durations[idx] * 0.75;
      });
    } catch (e) {
      console.warn("Web Audio failed to initialize: ", e);
    }
  },
  click() { this.play([350], [0.08], 'triangle'); },
  correct() { this.play([523.25, 659.25, 783.99], [0.1, 0.1, 0.15], 'sine'); },
  wrong() { this.play([220, 147], [0.12, 0.18], 'sawtooth'); },
  unlock() { this.play([261.63, 329.63, 392.00, 523.25], [0.07, 0.07, 0.07, 0.18], 'triangle'); },
  levelUp() { this.play([261.63, 392.00, 523.25, 659.25, 783.99, 1046.50], [0.08, 0.08, 0.08, 0.08, 0.08, 0.25], 'sine'); }
};

// Global App State
let gameState = {};
let activeLevelId = "level1"; // level1, level2
let activeChapterId = "linux"; // default chapter
let activeSubtab = "story"; // story, concept, diagram, handson, boss
let activeResumeProjectId = "task_manager";

// Cache DOM elements
const el = {
  charName: document.getElementById("char-name"),
  charTitle: document.getElementById("char-title"),
  charAvatar: document.getElementById("char-avatar"),
  statusLevel: document.getElementById("status-level"),
  statusXpCurrent: document.getElementById("status-xp-current"),
  statusXpNeeded: document.getElementById("status-xp-needed"),
  statusXpBar: document.getElementById("status-xp-bar"),
  statLinux: document.getElementById("stat-linux"),
  statNetworking: document.getElementById("stat-networking"),
  statGit: document.getElementById("stat-git"),
  statCloud: document.getElementById("stat-cloud"),
  statContainers: document.getElementById("stat-containers"),
  statCicd: document.getElementById("stat-cicd"),
  badgeRack: document.getElementById("badge-rack"),
  questLogBoard: document.getElementById("quest-log-board"),
  sfxToggle: document.getElementById("sfx-toggle"),
  resetBtn: document.getElementById("reset-btn"),
  
  // Modals
  editProfileModal: document.getElementById("edit-profile-modal"),
  heroNameInput: document.getElementById("hero-name-input"),
  saveProfileBtn: document.getElementById("save-profile-btn"),
  closeProfileModal: document.getElementById("close-profile-modal"),
  editProfileBtn: document.getElementById("edit-profile-btn"),
  
  levelupModal: document.getElementById("levelup-modal"),
  levelupLvlNum: document.getElementById("levelup-lvl-num"),
  levelupTitleText: document.getElementById("levelup-title-text"),
  levelupStatsList: document.getElementById("levelup-stats-list"),
  levelupModalClose: document.getElementById("levelup-modal-close"),
  
  badgeModal: document.getElementById("badge-modal"),
  badgeModalName: document.getElementById("badge-modal-name"),
  badgeModalIcon: document.getElementById("badge-modal-icon"),
  badgeModalDesc: document.getElementById("badge-modal-desc"),
  badgeModalClose: document.getElementById("badge-modal-close"),
  
  // Views
  viewTabs: document.querySelectorAll(".tab-btn"),
  panes: document.querySelectorAll(".view-pane"),
  
  // Dashboard Level Cards
  levelCards: document.querySelectorAll(".level-card"),
  
  // Quest Room elements
  questChaptersNav: document.getElementById("quest-chapters-nav"),
  chapterTabHeaders: document.getElementById("chapter-tab-headers"),
  chapterContentBody: document.getElementById("chapter-content-body"),
  
  // Interview Prep elements
  interviewSearch: document.getElementById("interview-search"),
  interviewQuestionsList: document.getElementById("interview-questions-list"),
  
  // Resume elements
  resumeProjectSelector: document.getElementById("resume-project-selector"),
  resumeDetailsContainer: document.getElementById("resume-details-container")
};

// Initialize Application
window.addEventListener("DOMContentLoaded", () => {
  loadGame();
  setupEventListeners();
  renderDashboard();
  renderSidebar();
  renderSkillTree();
  initQuizzes();
});

// Load state from local storage or set initial
function loadGame() {
  const savedState = localStorage.getItem("devops_quest_state");
  if (savedState) {
    try {
      gameState = JSON.parse(savedState);
      
      // Ensure daily quests are reset or set properly
      if (!gameState.dailyQuests || gameState.dailyQuests.length === 0) {
        gameState.dailyQuests = gamificationSystem.getInitialState().dailyQuests;
      }
      if (!gameState.weeklyChallenge) {
        gameState.weeklyChallenge = gamificationSystem.getInitialState().weeklyChallenge;
      }
    } catch (e) {
      gameState = gamificationSystem.getInitialState();
    }
  } else {
    gameState = gamificationSystem.getInitialState();
  }
  
  const savedSfx = localStorage.getItem("devops_quest_sfx");
  if (savedSfx !== null) {
    sfx.enabled = savedSfx === "true";
    el.sfxToggle.innerText = sfx.enabled ? "🔈 SFX: ON" : "🔇 SFX: OFF";
  }
}

// Save game state
function saveGame() {
  localStorage.setItem("devops_quest_state", JSON.stringify(gameState));
}

// Reset Game State
function resetGame() {
  if (confirm("Are you sure you want to delete all your progress, badges, and levels? This cannot be undone!")) {
    gameState = gamificationSystem.getInitialState();
    saveGame();
    sfx.click();
    showToast("Game Reset Complete", "alert");
    renderSidebar();
    renderDashboard();
    renderSkillTree();
    
    // Switch to dashboard
    switchView("dashboard");
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation Tabs
  el.viewTabs.forEach(btn => {
    btn.addEventListener("click", (e) => {
      sfx.click();
      const viewId = btn.dataset.view;
      switchView(viewId);
    });
  });

  // Level Selection Cards
  el.levelCards.forEach(card => {
    card.addEventListener("click", () => {
      const targetLvl = card.dataset.levelSelect;
      
      if (targetLvl === "1") {
        activeLevelId = "level1";
        activeChapterId = level1Data.chapters[0].id;
        sfx.click();
        renderQuestRoom();
        switchView("quest-room");
      } else if (targetLvl === "2") {
        if (gameState.badges.includes("level1_boss") || gameState.xp >= 1000) {
          activeLevelId = "level2";
          activeChapterId = level2Data.chapters[0].id;
          sfx.click();
          renderQuestRoom();
          switchView("quest-room");
        } else {
          sfx.wrong();
          showToast("Defeat Level 1 Boss or earn 1,000 XP to unlock Level 2!", "warning");
        }
      } else if (targetLvl === "3") {
        if (gameState.badges.includes("level2_boss") || gameState.xp >= 3000) {
          sfx.click();
          renderResumeArmory();
          switchView("resume");
        } else {
          sfx.wrong();
          showToast("Defeat Level 2 Boss or earn 3,000 XP to unlock Level 3!", "warning");
        }
      }
    });
  });

  // Sound FX toggle
  el.sfxToggle.addEventListener("click", () => {
    sfx.enabled = !sfx.enabled;
    localStorage.setItem("devops_quest_sfx", sfx.enabled);
    el.sfxToggle.innerText = sfx.enabled ? "🔈 SFX: ON" : "🔇 SFX: OFF";
    sfx.click();
  });

  // Reset progress
  el.resetBtn.addEventListener("click", resetGame);

  // Profile Edit Modal
  el.editProfileBtn.addEventListener("click", () => {
    sfx.click();
    el.heroNameInput.value = gameState.username;
    // Highlight current selected avatar
    document.querySelectorAll(".avatar-select-btn").forEach(item => {
      if (item.dataset.avatar === gameState.avatar) {
        item.style.borderColor = "var(--neon-cyan)";
        item.style.background = "rgba(0, 229, 255, 0.1)";
      } else {
        item.style.borderColor = "transparent";
        item.style.background = "transparent";
      }
    });
    el.editProfileModal.style.display = "flex";
  });

  // Save profile edit
  el.saveProfileBtn.addEventListener("click", () => {
    const newName = el.heroNameInput.value.trim();
    if (newName) {
      gameState.username = newName;
      saveGame();
      sfx.click();
      el.editProfileModal.style.display = "none";
      renderSidebar();
    }
  });

  // Avatar select buttons
  document.querySelectorAll(".avatar-select-btn").forEach(item => {
    item.addEventListener("click", () => {
      gameState.avatar = item.dataset.avatar;
      sfx.click();
      document.querySelectorAll(".avatar-select-btn").forEach(i => {
        i.style.borderColor = "transparent";
        i.style.background = "transparent";
      });
      item.style.borderColor = "var(--neon-cyan)";
      item.style.background = "rgba(0, 229, 255, 0.1)";
    });
  });

  el.closeProfileModal.addEventListener("click", () => {
    sfx.click();
    el.editProfileModal.style.display = "none";
  });

  // Modal Closures
  el.levelupModalClose.addEventListener("click", () => {
    sfx.click();
    el.levelupModal.style.display = "none";
  });

  el.badgeModalClose.addEventListener("click", () => {
    sfx.click();
    el.badgeModal.style.display = "none";
  });

  // Chapter subtab switching
  document.querySelectorAll(".sub-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      sfx.click();
      document.querySelectorAll(".sub-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeSubtab = btn.dataset.subtab;
      renderChapterContent();
    });
  });

  // Interview Questions Search Filter
  el.interviewSearch.addEventListener("input", () => {
    renderInterviewPrep();
  });
}

// Router pane switcher
function switchView(viewId) {
  el.viewTabs.forEach(tab => {
    if (tab.dataset.view === viewId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  el.panes.forEach(pane => {
    if (pane.id === `view-${viewId}`) {
      pane.style.display = "block";
    } else {
      pane.style.display = "none";
    }
  });

  // Specific initializations
  if (viewId === "skills") {
    renderSkillTree();
  } else if (viewId === "quest-room") {
    renderQuestRoom();
  } else if (viewId === "interview") {
    renderInterviewPrep();
  } else if (viewId === "resume") {
    renderResumeArmory();
  } else if (viewId === "dashboard") {
    renderDashboard();
  }
}

// Render Sidebar Status & Trophies
function renderSidebar() {
  el.charName.innerText = gameState.username;
  el.charAvatar.innerText = gameState.avatar;
  
  const currentLvl = gamificationSystem.calculateLevel(gameState.xp);
  gameState.level = currentLvl;
  
  el.charTitle.innerText = gamificationSystem.getTitleForLevel(currentLvl);
  el.statusLevel.innerText = currentLvl;
  el.statusXpCurrent.innerText = gameState.xp;
  
  const nextThreshold = gamificationSystem.getXpThreshold(currentLvl);
  el.statusXpNeeded.innerText = nextThreshold;
  
  const prevThreshold = currentLvl === 1 ? 0 : gamificationSystem.getXpThreshold(currentLvl - 1);
  const relativeCurrent = gameState.xp - prevThreshold;
  const relativeNeeded = nextThreshold - prevThreshold;
  
  const fillPct = Math.max(0, Math.min(100, (relativeCurrent / relativeNeeded) * 100));
  el.statusXpBar.style.width = `${fillPct}%`;
  
  // Render Attributes
  el.statLinux.innerText = gameState.attributes.linux;
  el.statNetworking.innerText = gameState.attributes.networking;
  el.statGit.innerText = gameState.attributes.git;
  el.statCloud.innerText = gameState.attributes.cloud;
  el.statContainers.innerText = gameState.attributes.containers;
  el.statCicd.innerText = gameState.attributes.cicd;
  
  // Render Badges Rack
  el.badgeRack.innerHTML = "";
  Object.keys(gamificationSystem.badges).forEach(key => {
    const badge = gamificationSystem.badges[key];
    const isUnlocked = gameState.badges.includes(key);
    
    const bDiv = document.createElement("div");
    bDiv.className = `badge-item ${isUnlocked ? "" : "locked"}`;
    bDiv.innerHTML = `
      ${badge.icon}
      <div class="badge-detail-popup">
        <strong style="color: ${badge.color}">${badge.name}</strong><br>
        <span>${isUnlocked ? badge.desc : "Locked Node - Complete " + key + " quest."}</span>
      </div>
    `;
    el.badgeRack.appendChild(bDiv);
  });

  // Render Quests Log
  el.questLogBoard.innerHTML = "";
  
  // Daily Quests
  gameState.dailyQuests.forEach(quest => {
    const qDiv = document.createElement("div");
    qDiv.className = "quest-item";
    qDiv.innerHTML = `
      <input type="checkbox" class="quest-check" disabled ${quest.completed ? "checked" : ""}>
      <div class="quest-desc ${quest.completed ? "done" : ""}">
        <strong>Daily:</strong> ${quest.text} (${quest.current}/${quest.target})<br>
        <span style="color: var(--neon-cyan); font-size: 11px;">+${quest.xp} XP</span>
      </div>
    `;
    el.questLogBoard.appendChild(qDiv);
  });

  // Weekly Challenge
  const wQuest = gameState.weeklyChallenge;
  const wDiv = document.createElement("div");
  wDiv.className = "quest-item";
  wDiv.innerHTML = `
    <input type="checkbox" class="quest-check" disabled ${wQuest.completed ? "checked" : ""}>
    <div class="quest-desc ${wQuest.completed ? "done" : ""}">
      <strong>Weekly:</strong> ${wQuest.text} (${wQuest.current}/${wQuest.target})<br>
      <span style="color: var(--neon-purple); font-size: 11px;">+${wQuest.xp} XP</span>
    </div>
  `;
  el.questLogBoard.appendChild(wDiv);
}

// Render Dashboard (Level unlocking)
function renderDashboard() {
  const l2Card = document.getElementById("level-card-2");
  const l3Card = document.getElementById("level-card-3");
  
  const isL2Unlocked = gameState.badges.includes("level1_boss") || gameState.xp >= 1000;
  const isL3Unlocked = gameState.badges.includes("level2_boss") || gameState.xp >= 3000;
  
  if (isL2Unlocked) {
    l2Card.classList.remove("locked");
  } else {
    l2Card.classList.add("locked");
  }
  
  if (isL3Unlocked) {
    l3Card.classList.remove("locked");
  } else {
    l3Card.classList.add("locked");
  }
}

// Render Skill Tree View (SVG Connections)
function renderSkillTree() {
  const container = document.getElementById("skill-tree-canvas-container");
  const svg = document.getElementById("skill-tree-svg");
  
  // Clear existing nodes (leave SVG)
  container.querySelectorAll(".skill-node-wrapper").forEach(node => node.remove());
  svg.innerHTML = "";
  
  // Adjust SVG Size dynamically based on max X/Y coordinates
  let maxX = 1200;
  let maxY = 600;
  
  // Render Connection Lines first
  skillTree.connections.forEach(conn => {
    const fromNode = skillTree.nodes.find(n => n.id === conn.from);
    const toNode = skillTree.nodes.find(n => n.id === conn.to);
    
    if (fromNode && toNode) {
      const fromUnlocked = isSkillNodeUnlocked(fromNode);
      const toUnlocked = isSkillNodeUnlocked(toNode);
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", fromNode.x + 30); // Node center shift (width/2)
      line.setAttribute("y1", fromNode.y + 30);
      line.setAttribute("x2", toNode.x + 30);
      line.setAttribute("y2", toNode.y + 30);
      
      if (fromUnlocked && toUnlocked) {
        line.setAttribute("stroke", "var(--neon-cyan)");
        line.setAttribute("stroke-width", "2.5");
        line.setAttribute("style", "filter: drop-shadow(0 0 4px var(--neon-cyan))");
      } else {
        line.setAttribute("stroke", "#202538");
        line.setAttribute("stroke-width", "2");
      }
      svg.appendChild(line);
    }
  });
  
  // Render nodes
  skillTree.nodes.forEach(node => {
    const isUnlocked = isSkillNodeUnlocked(node);
    const isCurrent = activeChapterId === node.chapterId;
    const chapData = getChapterDataById(node.chapterId);
    const icon = chapData ? chapData.icon : "📚";
    
    const wrapper = document.createElement("div");
    wrapper.className = "skill-node-wrapper";
    wrapper.style.position = "absolute";
    wrapper.style.left = `${node.x}px`;
    wrapper.style.top = `${node.y}px`;
    wrapper.style.zIndex = "10";
    
    const nDiv = document.createElement("div");
    nDiv.className = `skill-node ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`;
    nDiv.innerHTML = isUnlocked ? icon : "🔒";
    
    const label = document.createElement("div");
    label.className = "skill-label";
    label.innerText = node.label;
    
    // Skill Detail Tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "badge-detail-popup";
    tooltip.style.bottom = "80px";
    tooltip.innerHTML = `
      <strong style="color: var(--neon-cyan)">${node.label}</strong><br>
      <span style="font-size: 11px; margin-top: 4px; display: block; color: var(--text-main)">${node.description}</span>
      <span style="font-size: 10px; margin-top: 6px; display: block; color: var(--text-dim)">Prerequisite: ${node.unlockedBy ? node.unlockedBy : 'None'}</span>
    `;
    
    nDiv.appendChild(tooltip);
    wrapper.appendChild(nDiv);
    wrapper.appendChild(label);
    
    // Hover details
    nDiv.addEventListener("mouseenter", () => tooltip.style.display = "block");
    nDiv.addEventListener("mouseleave", () => tooltip.style.display = "none");
    
    // Click navigates
    nDiv.addEventListener("click", () => {
      if (isUnlocked) {
        sfx.click();
        
        // Find which level it belongs to
        const inL1 = level1Data.chapters.some(c => c.id === node.chapterId);
        if (inL1) {
          activeLevelId = "level1";
          activeChapterId = node.chapterId;
          activeSubtab = "story";
          renderQuestRoom();
          switchView("quest-room");
        } else {
          const inL2 = level2Data.chapters.some(c => c.id === node.chapterId);
          if (inL2) {
            activeLevelId = "level2";
            activeChapterId = node.chapterId;
            activeSubtab = "story";
            renderQuestRoom();
            switchView("quest-room");
          } else {
            // Level 3 project
            activeResumeProjectId = node.chapterId;
            renderResumeArmory();
            switchView("resume");
          }
        }
      } else {
        sfx.wrong();
        showToast("Complete preceding nodes to unlock this skill!", "warning");
      }
    });
    
    container.appendChild(wrapper);
  });
}

// Logic helper to determine if a skill node is unlocked
function isSkillNodeUnlocked(node) {
  if (!node.unlockedBy) return true;
  
  // Find predecessor node
  const parent = skillTree.nodes.find(n => n.id === node.unlockedBy);
  if (!parent) return true;
  
  // Parent chapter must be completed
  return gameState.completedQuizzes.includes(parent.chapterId);
}

// Helper to grab chapter contents
function getChapterDataById(chapterId) {
  let chap = level1Data.chapters.find(c => c.id === chapterId);
  if (!chap) chap = level2Data.chapters.find(c => c.id === chapterId);
  return chap;
}

// Render Quest Room frame (sidebar and learning views)
function renderQuestRoom() {
  el.questChaptersNav.innerHTML = "";
  
  const activeLevel = activeLevelId === "level1" ? level1Data : level2Data;
  
  activeLevel.chapters.forEach(chap => {
    const isCompleted = gameState.completedQuizzes.includes(chap.id);
    
    const btn = document.createElement("div");
    btn.className = `quest-nav-item ${activeChapterId === chap.id ? 'active' : ''}`;
    
    btn.innerHTML = `
      <span>${chap.icon}</span>
      <span style="flex: 1; text-align: left;">${chap.title}</span>
      <span>${isCompleted ? '✅' : '⚡'}</span>
    `;
    
    btn.addEventListener("click", () => {
      sfx.click();
      activeChapterId = chap.id;
      activeSubtab = "story";
      
      // Update subtabs UI active header
      document.querySelectorAll(".sub-tab-btn").forEach(b => {
        if (b.dataset.subtab === "story") b.classList.add("active");
        else b.classList.remove("active");
      });
      
      renderQuestRoom();
    });
    
    el.questChaptersNav.appendChild(btn);
  });
  
  renderChapterContent();
}

// Render active chapter's dynamic subtab contents
function renderChapterContent() {
  const activeLevel = activeLevelId === "level1" ? level1Data : level2Data;
  const chapter = activeLevel.chapters.find(c => c.id === activeChapterId);
  
  if (!chapter) return;
  
  let html = "";
  
  if (activeSubtab === "story") {
    html = `
      <div class="content-section">
        <h3>${chapter.title} - The Quest Begins</h3>
        <div class="story-box">
          "${chapter.story}"
        </div>
        <p style="font-size: 15px; margin-top: 10px;">In this mission, you will unlock knowledge and skills in this feature area. Expand your understanding in the next tabs, practice with combat trials, and face the quiz boss to claim your XP and Badge reward!</p>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <button class="btn-primary" onclick="setSubtab('concept')">Scroll of Knowledge →</button>
        </div>
      </div>
    `;
  } else if (activeSubtab === "concept") {
    html = `
      <div class="content-section">
        <h3>Scroll of Knowledge</h3>
        <div class="concept-point">
          <div class="concept-num">1</div>
          <div>
            <div class="concept-title">What is it in simple terms?</div>
            <div style="font-size: 14px;">${chapter.knowledge.concept}</div>
          </div>
        </div>
        <div class="concept-point">
          <div class="concept-num">2</div>
          <div>
            <div class="concept-title">Why does it exist?</div>
            <div style="font-size: 14px;">${chapter.knowledge.whyExists}</div>
          </div>
        </div>
        <div class="concept-point">
          <div class="concept-num">3</div>
          <div>
            <div class="concept-title">What problem does it solve?</div>
            <div style="font-size: 14px;">${chapter.knowledge.problemSolved}</div>
          </div>
        </div>
        <div class="concept-point">
          <div class="concept-num">4</div>
          <div>
            <div class="concept-title">How does it work internally?</div>
            <div style="font-size: 14px;">${chapter.knowledge.internals}</div>
          </div>
        </div>
        <div class="concept-point">
          <div class="concept-num">5</div>
          <div>
            <div class="concept-title">Where do companies use it?</div>
            <div style="font-size: 14px;">${chapter.knowledge.companyUse}</div>
          </div>
        </div>
        <div class="concept-point">
          <div class="concept-num">6</div>
          <div>
            <div class="concept-title">What comes next after learning this?</div>
            <div style="font-size: 14px;">${chapter.knowledge.whatsNext}</div>
          </div>
        </div>
        <div class="concept-point">
          <div class="concept-num">7</div>
          <div>
            <div class="concept-title">Real-world Examples</div>
            <div style="font-size: 14px;">
              ${chapter.knowledge.examples.map(ex => `<strong>${ex.title}</strong>: ${ex.desc}<br>`).join('')}
            </div>
          </div>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
          <button class="btn-secondary" onclick="setSubtab('story')">← Story Scroll</button>
          <button class="btn-primary" onclick="setSubtab('diagram')">Tactical Holo-map →</button>
        </div>
      </div>
    `;
  } else if (activeSubtab === "diagram") {
    // Generate interactive flow nodes
    const flowHtml = chapter.visualFlow.map((node, index) => `
      <div class="diagram-node" onclick="showDiagramNodeDetail(${index})" id="diag-node-${index}">
        <div class="node-title">${node.label}</div>
        <div class="node-desc">${node.detail.substring(0, 30)}...</div>
      </div>
      ${index < chapter.visualFlow.length - 1 ? '<div class="diagram-arrow">➔</div>' : ''}
    `).join('');
    
    html = `
      <div class="content-section">
        <h3>Tactical Holo-map (Architecture Flow)</h3>
        <p style="font-size: 14px; margin-bottom: 16px;">Click on any architectural node inside the map to expand its technical flow explanation:</p>
        <div class="interactive-diagram">
          <div class="diagram-flow">
            ${flowHtml}
          </div>
        </div>
        <div class="diagram-explainer" id="diagram-detail-box">
          <em>Select an active element in the flow above to examine its telemetry...</em>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
          <button class="btn-secondary" onclick="setSubtab('concept')">← Knowledge Scroll</button>
          <button class="btn-primary" onclick="setSubtab('handson')">Combat Trial →</button>
        </div>
      </div>
    `;
  } else if (activeSubtab === "handson") {
    // Checkboxes for task items
    const stepsHtml = chapter.handsOn.steps.map((step, index) => {
      const stepKey = `${chapter.id}_step_${index}`;
      const isDone = gameState.completedTasks.includes(stepKey);
      return `
        <div class="task-step ${isDone ? 'done' : ''}" onclick="toggleTaskStep('${chapter.id}', ${index})">
          <div class="task-checkbox">${isDone ? '✓' : ''}</div>
          <div class="task-details" style="flex: 1; font-size: 14px;">
            ${step.startsWith("  `") ? `<pre class="code-box">${step.replace(/`/g, '')}<button class="code-btn" onclick="copySnippet(event, this)">Copy</button></pre>` : step}
          </div>
        </div>
      `;
    }).join('');

    html = `
      <div class="content-section">
        <h3>Combat Trial & Mini Challenges</h3>
        <div style="background: rgba(0, 229, 255, 0.03); border: 1px solid var(--border-neon-cyan); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <strong style="color: var(--neon-cyan);">Objective:</strong> ${chapter.handsOn.objective}
        </div>
        
        <h4 style="color: var(--text-bright); margin-bottom: 12px;">Hands-on Instructions (Earn XP per check!):</h4>
        <div style="margin-bottom: 24px;">
          ${stepsHtml}
        </div>

        <div style="background: rgba(189, 0, 255, 0.03); border: 1px dashed var(--neon-purple); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <strong style="color: var(--neon-purple); font-size: 15px;">🔮 Hero's Trial (Mini Challenge)</strong>
          <h4 style="color: var(--text-bright); margin-top: 6px; margin-bottom: 6px;">${chapter.challenge.title}</h4>
          <p style="font-size: 14px; margin-bottom: 10px;">${chapter.challenge.desc}</p>
          <p style="font-size: 13px; color: var(--text-dim);">💡 <strong>Hint:</strong> ${chapter.challenge.hint}</p>
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
          <button class="btn-secondary" onclick="setSubtab('diagram')">← Holo-map</button>
          <button class="btn-primary" onclick="setSubtab('boss')">Initiate Boss Battle 👹</button>
        </div>
      </div>
    `;
  } else if (activeSubtab === "boss") {
    // Quiz arena
    const isCompleted = gameState.completedQuizzes.includes(chapter.id);
    
    html = `
      <div class="content-section">
        <h3>Boss Battle: Quiz Challenge</h3>
        ${isCompleted ? `
          <div style="background: rgba(0, 255, 102, 0.05); border: 2px solid var(--neon-green); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 48px;">🏆</span>
            <h4 style="color: var(--neon-green); margin-top: 10px; font-size: 20px;">BOSS DEFEATED</h4>
            <p style="font-size: 14px; margin-top: 6px;">You have conquered this arena, earned the badge, and unlocked any dependent skill nodes! You can replay this battle to test your skills again.</p>
          </div>
        ` : `
          <p style="font-size: 14px; margin-bottom: 20px;">Prepare yourself. Correctly answer all questions in this sequence to defeat the boss, unlock XP, and claim your badge. Any failure resets the boss health!</p>
        `}
        
        <div id="quiz-question-container">
          <!-- Populated dynamically by renderQuizQuestion -->
        </div>
      </div>
    `;
  }
  
  el.chapterContentBody.innerHTML = html;
  
  // Specific view actions
  if (activeSubtab === "boss") {
    renderQuizQuestion(chapter.id, 0);
  }
}

// Global scope tab navigation hook
window.setSubtab = function(tabName) {
  activeSubtab = tabName;
  document.querySelectorAll(".sub-tab-btn").forEach(btn => {
    if (btn.dataset.subtab === tabName) btn.classList.add("active");
    else btn.classList.remove("active");
  });
  renderChapterContent();
  sfx.click();
};

// Toggle checklist items and award XP
window.toggleTaskStep = function(chapterId, index) {
  const stepKey = `${chapterId}_step_${index}`;
  const idx = gameState.completedTasks.indexOf(stepKey);
  
  if (idx > -1) {
    gameState.completedTasks.splice(idx, 1);
    // Deduct XP
    gamificationSystem.addXp(gameState, -20);
    sfx.click();
  } else {
    gameState.completedTasks.push(stepKey);
    // Award XP
    gamificationSystem.addXp(gameState, 20);
    sfx.click();
    showToast("+20 XP: Task Checked! ⚡");
    
    // Update daily read quest progress
    const readQuest = gameState.dailyQuests.find(q => q.id === "daily_read");
    if (readQuest && !readQuest.completed) {
      readQuest.current = Math.min(readQuest.target, readQuest.current + 1);
      if (readQuest.current >= readQuest.target) {
        readQuest.completed = true;
        gamificationSystem.addXp(gameState, readQuest.xp);
        showToast(`Daily Complete: +${readQuest.xp} XP! 🌟`, "achievement");
      }
    }
  }
  
  saveGame();
  renderSidebar();
  renderDashboard();
  renderChapterContent();
};

// Expand detailed text on diagram nodes
window.showDiagramNodeDetail = function(nodeIndex) {
  const activeLevel = activeLevelId === "level1" ? level1Data : level2Data;
  const chapter = activeLevel.chapters.find(c => c.id === activeChapterId);
  const node = chapter.visualFlow[nodeIndex];
  
  sfx.click();
  
  // Remove active from all nodes
  document.querySelectorAll(".diagram-node").forEach(n => n.classList.remove("active"));
  // Set current active
  document.getElementById(`diag-node-${nodeIndex}`).classList.add("active");
  
  const detailBox = document.getElementById("diagram-detail-box");
  detailBox.innerHTML = `
    <strong style="color: var(--neon-cyan); font-size: 15px;">Stage ${nodeIndex + 1}: ${node.label}</strong>
    <p style="margin-top: 6px; font-size: 14px; color: var(--text-bright);">${node.detail}</p>
  `;
};

// Code snippet copy handler
window.copySnippet = function(event, button) {
  event.stopPropagation(); // Avoid checking checkbox on click
  
  const pre = button.parentElement;
  // Exclude button text from copy
  let codeText = pre.textContent.trim();
  if (codeText.endsWith("Copy")) {
    codeText = codeText.substring(0, codeText.length - 4).trim();
  }
  
  navigator.clipboard.writeText(codeText).then(() => {
    sfx.correct();
    button.innerText = "Copied!";
    setTimeout(() => {
      button.innerText = "Copy";
    }, 1500);
  }).catch(err => {
    console.error("Copy failed: ", err);
  });
};

// Quiz active state variables
let currentQuizAnswers = [];

// Initialize quiz states
function initQuizzes() {
  currentQuizAnswers = [];
}

// Render active quiz question inside chapter boss view
function renderQuizQuestion(chapterId, questionIdx) {
  const activeLevel = activeLevelId === "level1" ? level1Data : level2Data;
  const chapter = activeLevel.chapters.find(c => c.id === chapterId);
  
  const qContainer = document.getElementById("quiz-question-container");
  if (!qContainer || !chapter) return;
  
  if (questionIdx === 0) {
    currentQuizAnswers = [];
  }
  
  const qCount = chapter.quiz.length;
  
  if (questionIdx >= qCount) {
    // Quiz completed!
    processQuizVictory(chapter);
    return;
  }
  
  const qData = chapter.quiz[questionIdx];
  
  let optionsHtml = qData.options.map((opt, oIdx) => `
    <div class="quiz-option" onclick="submitQuizOption('${chapterId}', ${questionIdx}, ${oIdx})" id="quiz-opt-${oIdx}">
      <div class="option-marker">${String.fromCharCode(65 + oIdx)}</div>
      <div style="font-size: 14px;">${opt}</div>
    </div>
  `).join('');
  
  qContainer.innerHTML = `
    <div class="quiz-question-card">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-dim); margin-bottom: 8px;">
        <span>BOSS HEALTH BAR: ${qCount - questionIdx} / ${qCount}</span>
        <span>Question ${questionIdx + 1} of ${qCount}</span>
      </div>
      <div class="question-text">${qData.question}</div>
      <div class="quiz-options">
        ${optionsHtml}
      </div>
      <div id="quiz-explainer-panel"></div>
    </div>
  `;
}

// Process single option select in active quiz
window.submitQuizOption = function(chapterId, questionIdx, selectedOptionIdx) {
  const activeLevel = activeLevelId === "level1" ? level1Data : level2Data;
  const chapter = activeLevel.chapters.find(c => c.id === chapterId);
  const qData = chapter.quiz[questionIdx];
  
  const isCorrect = selectedOptionIdx === qData.answer;
  currentQuizAnswers.push(isCorrect);
  
  // Disable all options
  document.querySelectorAll(".quiz-option").forEach((opt, idx) => {
    opt.style.pointerEvents = "none";
    if (idx === qData.answer) {
      opt.classList.add("correct");
    } else if (idx === selectedOptionIdx) {
      opt.classList.add("wrong");
    }
  });
  
  const explainerPanel = document.getElementById("quiz-explainer-panel");
  explainerPanel.innerHTML = `
    <div class="quiz-explanation">
      <strong style="color: ${isCorrect ? 'var(--neon-green)' : 'var(--neon-pink)'}">
        ${isCorrect ? 'CORRECT HIT! ⚔️' : 'BOSS BLOCKED! 🛡️'}
      </strong><br>
      <span style="font-size: 13px; display: block; margin-top: 4px; color: var(--text-bright);">${qData.explanation}</span>
    </div>
    <div class="quiz-submit-bar">
      <span></span>
      <button class="btn-primary" onclick="nextQuizStep('${chapterId}', ${questionIdx})">
        ${questionIdx === chapter.quiz.length - 1 ? 'Finish Battle' : 'Next Question'}
      </button>
    </div>
  `;
  
  if (isCorrect) {
    sfx.correct();
  } else {
    sfx.wrong();
  }
};

// Advance or reset quiz state
window.nextQuizStep = function(chapterId, currentIdx) {
  sfx.click();
  
  // If user got it wrong, they must reset the boss
  const lastAns = currentQuizAnswers[currentQuizAnswers.length - 1];
  if (!lastAns) {
    // Reset to start
    showToast("Quiz Reset! Defeat the Boss with 100% correct streak.", "alert");
    renderQuizQuestion(chapterId, 0);
  } else {
    renderQuizQuestion(chapterId, currentIdx + 1);
  }
};

// Award badges, XP, check level-ups
function processQuizVictory(chapter) {
  sfx.levelUp();
  
  const wasAlreadyCompleted = gameState.completedQuizzes.includes(chapter.id);
  const perfectScore = currentQuizAnswers.every(ans => ans === true);
  
  if (perfectScore) {
    gameState.lastQuizPerfectScore = true;
  }
  
  if (!wasAlreadyCompleted) {
    gameState.completedQuizzes.push(chapter.id);
    
    // Award Badge
    const badgeKey = chapter.id;
    if (gamificationSystem.badges[badgeKey] && !gameState.badges.includes(badgeKey)) {
      gameState.badges.push(badgeKey);
      triggerBadgeUnlock(badgeKey);
    }
    
    // Award Base XP
    gamificationSystem.addXp(gameState, chapter.xpReward, triggerLevelUpModal);
    
    // Award chapter attributes
    if (chapter.stats) {
      Object.keys(chapter.stats).forEach(stat => {
        if (gameState.attributes[stat] !== undefined) {
          gameState.attributes[stat] += chapter.stats[stat];
        }
      });
    }
    
    showToast(`Boss Defeated! +${chapter.xpReward} XP! 🎉`, "success");
    
    // Update daily boss quest progress
    const bossQuest = gameState.dailyQuests.find(q => q.id === "daily_boss");
    if (bossQuest && !bossQuest.completed) {
      bossQuest.current = Math.min(bossQuest.target, bossQuest.current + 1);
      if (bossQuest.current >= bossQuest.target) {
        bossQuest.completed = true;
        gamificationSystem.addXp(gameState, bossQuest.xp, triggerLevelUpModal);
        showToast(`Daily Complete: +${bossQuest.xp} XP! 🌟`, "achievement");
      }
    }
  } else {
    showToast("Boss re-defeated! Skills sharpened.", "success");
  }
  
  // Check achievements
  gamificationSystem.checkAchievements(gameState, (ach) => {
    triggerAchievementUnlock(ach);
  });
  
  saveGame();
  renderSidebar();
  renderDashboard();
  renderQuestRoom();
}

// Trigger level up alert modal
function triggerLevelUpModal(newLevel, addedStats) {
  sfx.levelUp();
  el.levelupLvlNum.innerText = newLevel;
  el.levelupTitleText.innerText = gamificationSystem.getTitleForLevel(newLevel);
  
  const statsList = document.getElementById("levelup-stats-list");
  statsList.innerHTML = Object.keys(addedStats).map(s => `
    <div style="background: rgba(0,229,255,0.05); padding: 4px; border-radius: 4px; text-align: center;">
      <span style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">${s}</span><br>
      <strong style="color: var(--neon-cyan); font-size: 14px;">${addedStats[s]}</strong>
    </div>
  `).join('');
  
  el.levelupModal.style.display = "flex";
}

// Trigger badge alert modal
function triggerBadgeUnlock(badgeId) {
  sfx.unlock();
  const badge = gamificationSystem.badges[badgeId];
  if (!badge) return;
  
  el.badgeModalName.innerText = badge.name;
  el.badgeModalIcon.innerText = badge.icon;
  el.badgeModalDesc.innerText = badge.desc;
  
  // Custom glowing styling for badge type
  const card = el.badgeModal.querySelector(".modal-card");
  card.style.borderColor = badge.color;
  card.style.boxShadow = `0 0 20px ${badge.color}`;
  
  el.badgeModal.style.display = "flex";
}

// Trigger achievements alert modal
function triggerAchievementUnlock(ach) {
  sfx.unlock();
  
  el.badgeModalName.innerText = ach.name;
  el.badgeModalIcon.innerText = "🏆";
  el.badgeModalDesc.innerText = ach.desc;
  
  const card = el.badgeModal.querySelector(".modal-card");
  card.style.borderColor = "var(--neon-purple)";
  card.style.boxShadow = "var(--glow-purple)";
  
  el.badgeModal.style.display = "flex";
}

// Create floating toast alert
function showToast(text, type = "info") {
  const container = el.toastContainer;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'achievement' ? '🏆' : type === 'success' ? '⚡' : 'ℹ️'}</span>
    <span>${text}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    toast.style.animation = "slide-in 0.3s ease-out reverse forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Render Expandable Interview Prep cards
function renderInterviewPrep() {
  el.interviewQuestionsList.innerHTML = "";
  const filterText = el.interviewSearch.value.trim().toLowerCase();
  
  const allLevels = [level1Data, level2Data];
  let matchesFound = 0;
  
  allLevels.forEach(lvl => {
    lvl.chapters.forEach(chap => {
      chap.interview.forEach((item, index) => {
        // Filter rules
        const matchesTopic = chap.title.toLowerCase().includes(filterText) || 
                             item.q.toLowerCase().includes(filterText);
                             
        if (filterText && !matchesTopic) return;
        
        matchesFound++;
        
        const card = document.createElement("div");
        card.className = "glass-panel interview-card glow-cyan-hover";
        card.id = `int-card-${lvl.id}-${chap.id}-${index}`;
        
        card.innerHTML = `
          <div class="interview-question" onclick="toggleInterviewCard('${lvl.id}', '${chap.id}', ${index})">
            <span style="font-size: 14px;"><strong>Q:</strong> ${item.q}</span>
            <span class="question-arrow">▼</span>
          </div>
          <div class="interview-answers-box">
            <div class="answer-level-tabs">
              <button class="ans-tab-btn active" onclick="setAnswerPane(event, '${lvl.id}', '${chap.id}', ${index}, 'beg')">Beginner</button>
              <button class="ans-tab-btn" onclick="setAnswerPane(event, '${lvl.id}', '${chap.id}', ${index}, 'int')">Intermediate</button>
              <button class="ans-tab-btn" onclick="setAnswerPane(event, '${lvl.id}', '${chap.id}', ${index}, 'scenario')">Scenario</button>
            </div>
            <div class="answer-pane active" id="ans-pane-${lvl.id}-${chap.id}-${index}-beg">
              <p>${item.ans.beg}</p>
            </div>
            <div class="answer-pane" id="ans-pane-${lvl.id}-${chap.id}-${index}-int">
              <p>${item.ans.int}</p>
            </div>
            <div class="answer-pane" id="ans-pane-${lvl.id}-${chap.id}-${index}-scenario">
              <p>${item.ans.scenario}</p>
            </div>
          </div>
        `;
        el.interviewQuestionsList.appendChild(card);
      });
    });
  });

  if (matchesFound === 0) {
    el.interviewQuestionsList.innerHTML = `
      <div style="text-align: center; color: var(--text-dim); padding: 40px;">
        No interview questions match your current search queries. Try entering a different keyword.
      </div>
    `;
  }
}

// Accordion toggles on interview card
window.toggleInterviewCard = function(lvlId, chapId, index) {
  sfx.click();
  const card = document.getElementById(`int-card-${lvlId}-${chapId}-${index}`);
  card.classList.toggle("open");
};

// Switch sub-answers tabs (Beginner / Intermediate / Scenario)
window.setAnswerPane = function(event, lvlId, chapId, index, levelKey) {
  event.stopPropagation(); // Stop parent accordion toggle
  sfx.click();
  
  const card = document.getElementById(`int-card-${lvlId}-${chapId}-${index}`);
  
  // Set tab buttons UI active
  card.querySelectorAll(".ans-tab-btn").forEach(btn => {
    if (btn.innerText.toLowerCase() === levelKey || (btn.innerText === "Scenario" && levelKey === "scenario")) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  // Set answers active
  card.querySelectorAll(".answer-pane").forEach(pane => {
    if (pane.id === `ans-pane-${lvlId}-${chapId}-${index}-${levelKey}`) {
      pane.classList.add("active");
    } else {
      pane.classList.remove("active");
    }
  });
};

// Render Resume Armory View (Level 3 Projects)
function renderResumeArmory() {
  el.resumeProjectSelector.innerHTML = "";
  
  level3Data.projects.forEach(proj => {
    const isCompleted = gameState.completedQuizzes.includes(proj.id);
    const isL3Unlocked = gameState.badges.includes("level2_boss") || gameState.xp >= 3000;
    
    const btn = document.createElement("button");
    btn.className = `btn-secondary ${activeResumeProjectId === proj.id ? 'active' : ''}`;
    btn.style.whiteSpace = "nowrap";
    btn.style.opacity = isL3Unlocked ? "1" : "0.5";
    btn.innerText = `${proj.icon} ${proj.title}`;
    
    btn.addEventListener("click", () => {
      if (isL3Unlocked) {
        sfx.click();
        activeResumeProjectId = proj.id;
        renderResumeArmory();
      } else {
        sfx.wrong();
        showToast("Defeat Level 2 Boss or earn 3,000 XP to unlock the Armory!", "warning");
      }
    });
    
    el.resumeProjectSelector.appendChild(btn);
  });
  
  renderResumeDetails();
}

// Render dynamic elements for active Level 3 project
function renderResumeDetails() {
  const project = level3Data.projects.find(p => p.id === activeResumeProjectId);
  const container = el.resumeDetailsContainer;
  
  if (!project) {
    container.innerHTML = "";
    return;
  }
  
  const isCompleted = gameState.completedQuizzes.includes(project.id);
  
  container.innerHTML = `
    <!-- Top info -->
    <div class="glass-panel" style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="color: var(--text-bright); font-size: 22px;">${project.icon} ${project.title}</h3>
        <span style="color: var(--neon-gold); font-size: 13px; font-weight: 700; border: 1px solid var(--neon-gold); padding: 4px 10px; border-radius: 4px;">XP REWARD: +${project.xpReward} XP</span>
      </div>
      <p style="font-size: 14px; margin-bottom: 12px;"><strong>Tech Stack:</strong> ${project.techStack.map(t => `<span style="color: var(--neon-cyan); font-weight: 600; margin-right: 8px;">${t}</span>`).join('')}</p>
      <div class="story-box" style="margin-bottom: 0;">"${project.story}"</div>
    </div>
    
    <!-- Checklist / Sub-tasks -->
    <div class="glass-panel" style="margin-bottom: 24px;">
      <h4 style="color: var(--text-bright); margin-bottom: 14px;">Project Implementation Log (Check off tasks to gain XP!):</h4>
      <div id="resume-project-checklists">
        <!-- Render checklists dynamically -->
      </div>
    </div>

    <!-- Complete Button -->
    <div style="text-align: center; margin-bottom: 24px;">
      ${isCompleted ? `
        <div style="background: rgba(0, 255, 102, 0.05); border: 2px solid var(--neon-green); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
          <h4 style="color: var(--neon-green);">🏆 RESUME ARSENAL UNLOCKED</h4>
          <p style="font-size: 13px;">You have conquered this project! Copy the professional points below to elevate your Resume, GitHub, and LinkedIn profiles.</p>
        </div>
      ` : `
        <button class="btn-primary" style="font-size: 16px; padding: 12px 32px;" onclick="completeResumeProject('${project.id}')">Submit Project Build & Claim Badge 🛡️</button>
      `}
    </div>

    <!-- Architecture & Implementation Tabs -->
    <div class="glass-panel" style="margin-bottom: 24px;">
      <h3 style="color: var(--text-bright); margin-bottom: 14px;">Technical Blueprint Specifications</h3>
      
      <div class="resume-section">
        <h4>1. Cloud Network Architecture Flow</h4>
        <div style="background: rgba(5,7,18,0.5); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
          <ul style="list-style: none; padding-left: 0;">
            ${project.architecture.map((a, idx) => `
              <li style="margin-bottom: 8px; font-size: 14px; padding-left: 20px; position: relative;">
                <span style="position: absolute; left: 0; color: var(--neon-cyan); font-weight: 700;">${idx + 1}.</span> ${a}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="resume-section">
        <h4>2. Target Folder Directory Structure</h4>
        <pre class="code-box">${project.folderStructure}<button class="code-btn" onclick="copySnippet(event, this)">Copy</button></pre>
      </div>

      <div class="resume-section">
        <h4>3. Automated CI/CD Pipeline Configuration</h4>
        <pre class="code-box">${project.cicdPipeline}<button class="code-btn" onclick="copySnippet(event, this)">Copy</button></pre>
      </div>

      <div class="resume-section">
        <h4>4. Prometheus Scrapes & Monitoring Configuration</h4>
        <pre class="code-box">${project.monitoringSetup}<button class="code-btn" onclick="copySnippet(event, this)">Copy</button></pre>
      </div>

      <div class="resume-section">
        <h4>5. Security Reinforcements</h4>
        <ul style="list-style: none; padding-left: 0;">
          ${project.securityBestPractices.map(s => `<li style="font-size: 14px; margin-bottom: 8px; padding-left: 16px; position: relative;"><span style="position: absolute; left: 0; color: var(--neon-pink);">🔒</span>${s}</li>`).join('')}
        </ul>
      </div>
    </div>

    <!-- Resume Mode Assets -->
    <div class="glass-panel" style="opacity: ${isCompleted ? '1' : '0.4'}; pointer-events: ${isCompleted ? 'auto' : 'none'};">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span style="font-size: 24px;">🛡️</span>
        <h3 style="color: var(--text-bright);">Unlocked Resume Mode Assets</h3>
      </div>
      
      <div class="resume-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="margin-bottom: 0;">ATS-Friendly Resume Points</h4>
          <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="copyElementText('resume-points-copy')">Copy All</button>
        </div>
        <div class="copy-box" id="resume-points-copy">${project.resumeDescription.map(r => `• ${r}`).join('\n')}</div>
      </div>

      <div class="resume-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="margin-bottom: 0;">LinkedIn Project Description</h4>
          <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="copyElementText('linkedin-copy')">Copy</button>
        </div>
        <div class="copy-box" id="linkedin-copy">🚀 I just finished deploying my latest project: "${project.title}"!

🛠️ Tech Stack: ${project.techStack.join(', ')}

Key Achievements:
${project.resumeDescription.map(r => `- ${r}`).join('\n')}

Check out the full repository and let me know your thoughts! #DevOps #AWS #EKS #Kubernetes #Terraform #CI_CD</div>
      </div>

      <div class="resume-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="margin-bottom: 0;">GitHub repository README.md Intro</h4>
          <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="copyElementText('readme-copy')">Copy</button>
        </div>
        <div class="copy-box" id="readme-copy"># ${project.title}

An industry-grade, cloud-native project establishing high-availability pipelines and self-healing infrastructure.

## 📐 Architecture
${project.architecture.map(a => `- ${a}`).join('\n')}

## 🚀 Key Features
- Automated CI/CD pipeline triggering on Git commits
- Infrastructure provisioned through declarative Terraform configuration
- Real-time Prometheus monitoring dashboard on Grafana
- Sealed secure credentials variables injection</div>
      </div>

      <div class="resume-section" style="margin-top: 24px;">
        <h4 style="color: var(--neon-purple);">Interview Simulator Explanation Script</h4>
        <div style="background: rgba(189, 0, 255, 0.03); border: 1px dashed var(--neon-purple); border-radius: 8px; padding: 16px;">
          <strong style="color: var(--neon-purple); font-size: 13px; text-transform: uppercase;">Interview Scenario Prompt:</strong>
          <p style="font-weight: 600; font-size: 14px; margin-top: 4px; margin-bottom: 12px; color: var(--text-bright);">${project.interviewExplanation.scenario}</p>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.06); margin-bottom: 12px;">
          <strong style="color: var(--neon-green); font-size: 13px; text-transform: uppercase;">Star Response Guide Script:</strong>
          <p style="font-size: 14px; color: var(--text-main); margin-top: 6px; line-height: 1.6;">${project.interviewExplanation.guide}</p>
        </div>
      </div>
    </div>
  `;

  // Render project subtask list
  const pChecklists = document.getElementById("resume-project-checklists");
  
  // Custom checklist items for each level 3 project
  const tasks = [
    `Initialize Git and structure directories: ${project.id}/terraform/ and ${project.id}/k8s/`,
    `Write base Dockerfiles for each frontend/backend microservice and test local runs`,
    `Draft Terraform configurations for VPC networks, subnets, and clusters`,
    `Build YAML/Jenkinsfile configuration for stages (Test -> Analyze -> Build -> Push)`,
    `Assemble Kubernetes Deployments, ClusterIP Services, and Ingress routing assets`,
    `Connect Prometheus scrape metrics and design dynamic dashboards in Grafana`,
    `Audit container safety levels and secure database credentials`
  ];

  pChecklists.innerHTML = tasks.map((task, index) => {
    const taskKey = `${project.id}_step_${index}`;
    const isDone = gameState.completedTasks.includes(taskKey);
    return `
      <div class="task-step ${isDone ? 'done' : ''}" onclick="toggleTaskStep('${project.id}', ${index})">
        <div class="task-checkbox">${isDone ? '✓' : ''}</div>
        <div class="task-details" style="flex: 1; font-size: 14px;">${task}</div>
      </div>
    `;
  }).join('');
}

// Level 3 project submit build
window.completeResumeProject = function(projectId) {
  sfx.levelUp();
  const project = level3Data.projects.find(p => p.id === projectId);
  
  if (!gameState.completedQuizzes.includes(projectId)) {
    gameState.completedQuizzes.push(projectId);
    
    // Award Badge
    if (!gameState.badges.includes(projectId)) {
      gameState.badges.push(projectId);
      triggerBadgeUnlock(projectId);
    }
    
    // Award XP
    gamificationSystem.addXp(gameState, project.xpReward, triggerLevelUpModal);
    
    // Award stats
    gameState.attributes.cloud += 15;
    gameState.attributes.cicd += 15;
    gameState.attributes.containers += 15;
    
    showToast(`Project Build Confirmed! +${project.xpReward} XP! 🛡️`, "success");
    
    // Check achievements
    gamificationSystem.checkAchievements(gameState, (ach) => {
      triggerAchievementUnlock(ach);
    });
    
    saveGame();
    renderSidebar();
    renderResumeArmory();
  }
};

// Clipboard copying helper for plain elements
window.copyElementText = function(elementId) {
  sfx.correct();
  const text = document.getElementById(elementId).innerText;
  
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied to Clipboard!", "success");
  }).catch(err => {
    console.error("Copy failed: ", err);
  });
};
