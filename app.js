// ==========================
// Application Data
// ==========================
const appData = {
  "emergencyAlerts": [
    {
      "id": 1,
      "type": "Fire",
      "message": "Fire detected in Building A, 2nd Floor. Evacuate immediately.",
      "timestamp": "2025-09-10T14:30:00",
      "status": "Active",
      "target": "Building A",
      "recipients": 245
    },
    {
      "id": 2,
      "type": "Drill",
      "message": "Monthly earthquake drill scheduled for tomorrow at 10:00 AM",
      "timestamp": "2025-09-09T16:00:00",
      "status": "Scheduled",
      "target": "All Buildings",
      "recipients": 1250
    }
  ],
  // Other datasets...
  "emergencyPlans": [],
  "drillSchedule": [],
  "resources": [],
  "incidents": [],
  "emergencyContacts": [],
  "trainingModules": [],
  "systemStatus": {
    "overallReadiness": "Good",
    "alertSystemStatus": "Online",
    "lastSystemCheck": "2025-09-10T08:00:00",
    "activeAlerts": 0,
    "scheduledDrills": 2,
    "trainingCompletion": 79
  }
};

// ==========================
// MQTT Integration
// ==========================

// Use a public HiveMQ WebSocket broker
const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
const topic = "safecampus/emergency";

const mqttClient = mqtt.connect(brokerUrl);

mqttClient.on("connect", () => {
  console.log("✅ Connected to MQTT Broker");
  mqttClient.subscribe(topic, (err) => {
    if (!err) {
      console.log("Subscribed to topic:", topic);
    } else {
      console.error("Subscription error:", err);
    }
  });
});

// When message received from mobile
mqttClient.on("message", (topic, message) => {
  try {
    const alertData = JSON.parse(message.toString());
    console.log("🚨 Incoming Alert:", alertData);

    // Add alert to dashboard data
    const newAlert = {
      id: appData.emergencyAlerts.length + 1,
      type: alertData.type.charAt(0).toUpperCase() + alertData.type.slice(1),
      message: alertData.message,
      timestamp: new Date().toISOString(),
      status: "Active",
      target: alertData.target || "Unknown",
      recipients: alertData.recipients || 0
    };

    appData.emergencyAlerts.unshift(newAlert);

    // Update dashboard display
    loadRecentAlerts();
    loadAlertsData();

    // Show popup notification
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");
    notificationMessage.textContent = `🔥 ${newAlert.type} ALERT: ${newAlert.message}`;
    notification.classList.remove("hidden");

    // Play sound alert
    const alertSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
    alertSound.play();
  } catch (error) {
    console.error("Error handling MQTT message:", error);
  }
});

// ==========================
// Application State
// ==========================
let currentSection = 'dashboard';
let charts = {};

// ==========================
// Initialization
// ==========================
document.addEventListener('DOMContentLoaded', function () {
  console.log('Initializing application...');

  setTimeout(() => {
    initializeNavigation();
    initializeEmergencyButtons();
    initializeModals();
    initializeActionButtons();
    loadDashboardData();
    loadAllSections();
    initializeCharts();
    console.log('Application initialization complete');
  }, 50);
});

// ==========================
// Navigation System
// ==========================
function initializeNavigation() {
  const navItems = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('.section');

  navItems.forEach(navItem => {
    const targetSection = navItem.getAttribute('data-section');
    navItem.addEventListener('click', function (e) {
      e.preventDefault();
      navigateToSection(targetSection);
    });
  });
}

function navigateToSection(targetSection) {
  const navItems = document.querySelectorAll('[data-section]');
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-section') === targetSection);
  });

  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.toggle('active', section.id === targetSection);
  });

  currentSection = targetSection;
  loadSectionData(targetSection);
}

// ==========================
// Emergency Buttons
// ==========================
function initializeEmergencyButtons() {
  const emergencyButtons = [
    { id: 'fireAlert', type: 'fire' },
    { id: 'earthquakeAlert', type: 'earthquake' },
    { id: 'lockdownAlert', type: 'lockdown' },
    { id: 'evacuationAlert', type: 'evacuation' },
    { id: 'weatherAlert', type: 'weather' },
    { id: 'medicalAlert', type: 'medical' }
  ];

  emergencyButtons.forEach(buttonConfig => {
    const button = document.getElementById(buttonConfig.id);
    if (button) {
      button.addEventListener('click', function () {
        openAlertModal(buttonConfig.type);
      });
    }
  });
}

// ==========================
// Modal System
// ==========================
function initializeModals() {
  const closeNotificationBtn = document.getElementById('closeNotification');
  if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener('click', closeNotification);
  }
}

function closeNotification() {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.classList.add('hidden');
  }
}

// ==========================
// Load Data into Dashboard
// ==========================
function loadDashboardData() {
  loadRecentAlerts();
  // add other loading functions if required
}

function loadRecentAlerts() {
  const container = document.getElementById('recentAlerts');
  if (!container) return;

  const recentAlerts = appData.emergencyAlerts.slice(0, 3);
  container.innerHTML = recentAlerts.map(alert => `
    <div class="activity-item">
      <div class="activity-content">
        <div class="activity-title">${alert.type} Alert - ${alert.target}</div>
        <div class="activity-meta">${formatDateTime(alert.timestamp)}</div>
      </div>
      <span class="badge badge--${alert.status.toLowerCase()}">${alert.status}</span>
    </div>
  `).join('');
}

// ==========================
// Helper Functions
// ==========================
function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
