🚨 Disaster Preparedness & Response Management System

A real-time emergency alert and disaster management system designed to improve safety, communication, and response efficiency across campuses or organizations.

📌 Overview:----

This project is built to simulate and manage emergency situations such as fires, earthquakes, lockdowns, and medical incidents. It integrates real-time communication using MQTT to instantly broadcast alerts and update the dashboard dynamically.
The system ensures that critical information reaches the right audience at the right time, enhancing preparedness and response capabilities.

⚙️ Features:-----
🚨 Real-time Emergency Alerts (Fire, Earthquake, Medical, etc.)
📡 MQTT-based Communication (Live alert updates)
📊 Interactive Dashboard with Recent Alerts
🔔 Instant Notification Popup with Sound Alerts
🧭 Section-based Navigation System
📅 Drill Scheduling & Emergency Planning (Extendable)
📈 System Status Monitoring

🧠 How It Works:----

The system connects to a public MQTT broker using WebSockets.
Mobile or external systems publish emergency alerts to a topic.
The dashboard subscribes to this topic and listens for incoming alerts.
On receiving a message:
It parses the alert data
Updates the internal dataset
Refreshes the UI dynamically
Triggers a notification popup with sound

🛠️ Tech Stack:---

Frontend: HTML, CSS, JavaScript
Real-time Communication: MQTT (HiveMQ WebSocket Broker)

