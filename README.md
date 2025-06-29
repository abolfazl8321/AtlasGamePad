# 🎮 USB Gamepad Touchpad Visualizer

A simple and powerful Node.js project that allows real-time reading and visualization of the **touchpad input from PS4 and PS5 controllers** directly in your browser.

This tool is perfect for testing, debugging, or showcasing the functionality of your controller’s touchpad on a web interface.

---

## 🚀 Features

- 🔌 Connects via USB (no Bluetooth required)
- 🎮 Supports both DualShock 4 (PS4) and DualSense (PS5) controllers
- 📡 Real-time streaming of touchpad data via WebSocket
- 🖥️ Web interface that shows touch activity as visual interaction

---

## 🧰 Technologies Used

- Node.js
- WebSocket (ws)
- node-hid
- HTML + JavaScript (frontend)
- NextJs

---

## 📦 Requirements

- Node.js (v16 or later)
- A PS4 or PS5 controller connected via USB
- Chrome or any modern browser

---

## 🛠 Installation

```bash
git clone https://github.com/abolfazl8321/AtlasGamePad.git
cd usb-touchpad-viewer
npm install
```

---

## ▶️ Run the Project

```bash
node src/server/touchpad.js
```

Then open the frontend (usually `index.html`) in your browser and move your finger on the controller’s touchpad.

---

## 🧪 Tested Devices

- ✅ DualShock 4 (PS4)
- ✅ DualSense (PS5)

---

## 🤝 Contributions

Pull requests are welcome! Feel free to fork and enhance the visual experience or expand support.

---

## 📄 License

This project is licensed under the MIT License.