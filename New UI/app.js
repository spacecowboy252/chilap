// App data from provided JSON
const appData = {
  "children": [
    {
      "id": 1,
      "name": "Emma",
      "age": 8,
      "avatar": "🧒",
      "points": 45,
      "tasksCompleted": 6,
      "tasksTotal": 8,
      "level": "Super Star",
      "tasks": [
        {"id": 1, "title": "Brush your teeth", "completed": true, "points": 5},
        {"id": 2, "title": "Make your bed", "completed": true, "points": 5},
        {"id": 3, "title": "Be kind to siblings", "completed": false, "points": 10},
        {"id": 4, "title": "Complete homework", "completed": true, "points": 15},
        {"id": 5, "title": "Help with dishes", "completed": false, "points": 10},
        {"id": 6, "title": "Put toys away", "completed": true, "points": 5},
        {"id": 7, "title": "Eat vegetables at dinner", "completed": true, "points": 10},
        {"id": 8, "title": "Ready for school on time", "completed": true, "points": 10}
      ]
    },
    {
      "id": 2,
      "name": "Jake",
      "age": 6,
      "avatar": "👦",
      "points": 30,
      "tasksCompleted": 4,
      "tasksTotal": 6,
      "level": "Rising Star",
      "tasks": [
        {"id": 1, "title": "Brush your teeth", "completed": true, "points": 5},
        {"id": 2, "title": "Share your toys", "completed": true, "points": 10},
        {"id": 3, "title": "Say please and thank you", "completed": false, "points": 5},
        {"id": 4, "title": "Listen to instructions", "completed": true, "points": 10},
        {"id": 5, "title": "Put on shoes by yourself", "completed": false, "points": 5},
        {"id": 6, "title": "Eat your snack nicely", "completed": true, "points": 5}
      ]
    },
    {
      "id": 3,
      "name": "Sophie",
      "age": 10,
      "avatar": "👧",
      "points": 65,
      "tasksCompleted": 7,
      "tasksTotal": 9,
      "level": "Gold Star",
      "tasks": [
        {"id": 1, "title": "Complete all homework", "completed": true, "points": 20},
        {"id": 2, "title": "Practice piano", "completed": true, "points": 15},
        {"id": 3, "title": "Help with little brother", "completed": false, "points": 15},
        {"id": 4, "title": "Organize backpack", "completed": true, "points": 10},
        {"id": 5, "title": "Be respectful to parents", "completed": true, "points": 10},
        {"id": 6, "title": "Brush teeth morning & night", "completed": true, "points": 5},
        {"id": 7, "title": "Make bed neatly", "completed": true, "points": 5},
        {"id": 8, "title": "Read for 30 minutes", "completed": false, "points": 10},
        {"id": 9, "title": "Get ready for school independently", "completed": true, "points": 10}
      ]
    }
  ],
  "rewards": [
    {"id": 1, "title": "Extra screen time", "cost": 20, "icon": "📱"},
    {"id": 2, "title": "Choose family movie", "cost": 30, "icon": "🎬"},
    {"id": 3, "title": "Special one-on-one time", "cost": 40, "icon": "❤️"},
    {"id": 4, "title": "Stay up 30 min later", "cost": 35, "icon": "🌙"},
    {"id": 5, "title": "Pick dinner menu", "cost": 25, "icon": "🍝"},
    {"id": 6, "title": "Small toy or treat", "cost": 50, "icon": "🎁"},
    {"id": 7, "title": "Friend sleepover", "cost": 80, "icon": "🏠"},
    {"id": 8, "title": "Special outing", "cost": 100, "icon": "🎪"}
  ],
  "familyStats": {
    "totalPointsEarned": 140,
    "tasksCompletedToday": 17,
    "totalTasksToday": 23,
    "streakDays": 5
  },
  "upcomingEvents": [
    {"date": "Today", "event": "Soccer practice - Emma", "time": "4:00 PM"},
    {"date": "Tomorrow", "event": "Piano lesson - Sophie", "time": "3:30 PM"},
    {"date": "Friday", "event": "Jake's playdate", "time": "2:00 PM"}
  ]
};

// Current state
let currentScreen = 'main-menu';
let currentChild = null;

// Screen management
function showScreen(screenId) {
  console.log('Switching to screen:', screenId);
  
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    currentScreen = screenId;
  } else {
    console.error('Screen not found:', screenId);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  
  // Initialize all content first
  initializeApp();
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('App initialized successfully');
});

function initializeApp() {
  loadParentDashboard();
  loadChildProfiles();
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Main menu navigation
  const parentBtn = document.getElementById('parent-btn');
  const childBtn = document.getElementById('child-btn');
  
  if (parentBtn) {
    parentBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Parent button clicked');
      showScreen('parent-dashboard');
    });
  }
  
  if (childBtn) {
    childBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Child button clicked');
      showScreen('child-selection');
    });
  }
  
  // Back button navigation
  const backFromParent = document.getElementById('back-from-parent');
  if (backFromParent) {
    backFromParent.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen('main-menu');
    });
  }
  
  const backFromChildSelect = document.getElementById('back-from-child-select');
  if (backFromChildSelect) {
    backFromChildSelect.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen('main-menu');
    });
  }
  
  const backFromChildView = document.getElementById('back-from-child-view');
  if (backFromChildView) {
    backFromChildView.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen('child-selection');
    });
  }
  
  // Modal close
  const closeModal = document.getElementById('close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('success-modal');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  }
  
  // Add keyboard support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('success-modal');
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    }
  });
  
  console.log('Event listeners set up successfully');
}

function loadParentDashboard() {
  loadChildrenList();
  loadEventsList();
  loadRewardsGrid();
}

function loadChildrenList() {
  const childrenList = document.getElementById('children-list');
  if (!childrenList) return;
  
  childrenList.innerHTML = '';
  
  appData.children.forEach(child => {
    const childCard = document.createElement('div');
    childCard.className = 'child-card';
    childCard.innerHTML = `
      <div class="child-avatar">${child.avatar}</div>
      <div class="child-info">
        <div class="child-name">${child.name} (${child.age})</div>
        <div class="child-stats">
          <span>Tasks: ${child.tasksCompleted}/${child.tasksTotal}</span>
          <span>Points: ${child.points}</span>
        </div>
      </div>
      <div class="child-level">${child.level}</div>
    `;
    childrenList.appendChild(childCard);
  });
}

function loadEventsList() {
  const eventsList = document.getElementById('events-list');
  if (!eventsList) return;
  
  eventsList.innerHTML = '';
  
  appData.upcomingEvents.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.innerHTML = `
      <div class="event-date">${event.date}</div>
      <div class="event-title">${event.event}</div>
      <div class="event-time">${event.time}</div>
    `;
    eventsList.appendChild(eventItem);
  });
}

function loadRewardsGrid() {
  const rewardsGrid = document.getElementById('rewards-grid');
  if (!rewardsGrid) return;
  
  rewardsGrid.innerHTML = '';
  
  appData.rewards.forEach(reward => {
    const rewardCard = document.createElement('div');
    rewardCard.className = 'reward-card';
    rewardCard.innerHTML = `
      <div class="reward-icon">${reward.icon}</div>
      <div class="reward-title">${reward.title}</div>
      <div class="reward-cost">${reward.cost} points</div>
    `;
    rewardsGrid.appendChild(rewardCard);
  });
}

function loadChildProfiles() {
  const childProfilesGrid = document.getElementById('child-profiles-grid');
  if (!childProfilesGrid) return;
  
  childProfilesGrid.innerHTML = '';
  
  appData.children.forEach(child => {
    const profileCard = document.createElement('div');
    profileCard.className = 'child-profile-card';
    profileCard.innerHTML = `
      <div class="child-profile-avatar">${child.avatar}</div>
      <div class="child-profile-name">${child.name}</div>
      <div class="child-profile-level">${child.level}</div>
    `;
    
    profileCard.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      currentChild = child;
      loadChildView(child);
      showScreen('child-view');
    });
    
    childProfilesGrid.appendChild(profileCard);
  });
}

function loadChildView(child) {
  // Load child header
  const childHeader = document.getElementById('child-header');
  if (childHeader) {
    childHeader.innerHTML = `
      <div class="child-header-avatar">${child.avatar}</div>
      <div class="child-header-info">
        <h2>Hi, ${child.name}!</h2>
        <div class="child-header-level">${child.level}</div>
      </div>
    `;
  }
  
  // Load child progress
  loadChildProgress(child);
  
  // Load child tasks
  loadChildTasks(child);
  
  // Load child rewards
  loadChildRewards(child);
}

function loadChildProgress(child) {
  const progressElement = document.getElementById('child-progress');
  if (!progressElement) return;
  
  const progressPercentage = Math.round((child.tasksCompleted / child.tasksTotal) * 100);
  
  progressElement.innerHTML = `
    <div class="progress-text">Today's Progress: ${child.tasksCompleted}/${child.tasksTotal} tasks</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progressPercentage}%"></div>
    </div>
    <div class="points-display">
      <div class="points-item">
        <span class="points-number">${child.points}</span>
        <span class="points-label">Points Today</span>
      </div>
      <div class="points-item">
        <span class="points-number">${child.tasksCompleted}</span>
        <span class="points-label">Tasks Done</span>
      </div>
    </div>
  `;
}

function loadChildTasks(child) {
  const tasksContainer = document.getElementById('child-tasks');
  if (!tasksContainer) return;
  
  tasksContainer.innerHTML = '';
  
  child.tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.innerHTML = `
      <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}">
        ${task.completed ? '✓' : ''}
      </div>
      <div class="task-info">
        <div class="task-title">${task.title}</div>
      </div>
      <div class="task-points">+${task.points} pts</div>
    `;
    
    // Add click event to checkbox if not completed
    if (!task.completed) {
      const checkbox = taskItem.querySelector('.task-checkbox');
      checkbox.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        completeTask(child.id, task.id, task.points, task.title);
      });
    }
    
    tasksContainer.appendChild(taskItem);
  });
}

function loadChildRewards(child) {
  const rewardsContainer = document.getElementById('child-rewards');
  if (!rewardsContainer) return;
  
  rewardsContainer.innerHTML = '';
  
  appData.rewards.forEach(reward => {
    const rewardCard = document.createElement('div');
    const canAfford = child.points >= reward.cost;
    rewardCard.className = `child-reward-card ${canAfford ? 'affordable' : 'expensive'}`;
    rewardCard.innerHTML = `
      <div class="reward-icon">${reward.icon}</div>
      <div class="reward-title">${reward.title}</div>
      <div class="reward-cost">${reward.cost} points</div>
    `;
    
    if (canAfford) {
      rewardCard.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSuccessModal(`You can redeem: ${reward.title}!`, 0);
      });
    }
    
    rewardsContainer.appendChild(rewardCard);
  });
}

function completeTask(childId, taskId, points, taskTitle) {
  console.log('Completing task:', taskTitle, 'for child:', childId);
  
  // Find the child and task
  const child = appData.children.find(c => c.id === childId);
  const task = child.tasks.find(t => t.id === taskId);
  
  if (task && !task.completed) {
    // Mark task as completed
    task.completed = true;
    child.tasksCompleted++;
    child.points += points;
    
    // Update family stats
    appData.familyStats.totalPointsEarned += points;
    appData.familyStats.tasksCompletedToday++;
    
    // Reload child view
    loadChildView(child);
    
    // Show success modal
    showSuccessModal(`Great job completing: ${taskTitle}!`, points);
    
    console.log('Task completed successfully');
  }
}

function showSuccessModal(message, points) {
  const modal = document.getElementById('success-modal');
  const messageElement = document.getElementById('success-message');
  const pointsElement = document.getElementById('points-earned');
  
  if (modal && messageElement && pointsElement) {
    messageElement.textContent = message;
    pointsElement.textContent = points;
    modal.classList.add('active');
    
    // Add celebration animation
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.classList.add('bounce');
      setTimeout(() => {
        modalContent.classList.remove('bounce');
      }, 1000);
    }
  }
}

// Add visual feedback for interactions
document.addEventListener('click', function(e) {
  // Add click effect to buttons
  if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
    const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), 300);
  }
  
  // Add click effect to cards
  if (e.target.closest('.child-card') || e.target.closest('.child-profile-card')) {
    const card = e.target.closest('.child-card') || e.target.closest('.child-profile-card');
    card.classList.add('pulse');
    setTimeout(() => card.classList.remove('pulse'), 300);
  }
});

// Prevent text selection on buttons
document.addEventListener('selectstart', function(e) {
  if (e.target.closest('.btn') || e.target.closest('.child-profile-card') || e.target.closest('.task-checkbox')) {
    e.preventDefault();
  }
});

// Add encouraging messages
const encouragingMessages = [
  "Keep up the great work!",
  "You're doing amazing!",
  "Super job today!",
  "You're a star!",
  "Fantastic effort!",
  "Way to go!",
  "You're awesome!",
  "Great job, superstar!"
];

function getRandomEncouragingMessage() {
  return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
}

// Add some periodic updates for visual appeal
setInterval(() => {
  const progressFills = document.querySelectorAll('.progress-fill');
  progressFills.forEach(fill => {
    fill.style.transition = 'width 0.3s ease';
  });
}, 5000);

console.log('App script loaded successfully');