import HID from 'node-hid';
import { WebSocketServer } from 'ws';

let device = null;
let currentPath = null;
let TOUCHPAD_RANGE = { x: 1920, y: 940 };

const wss = new WebSocketServer({ port: 7070 });
console.log("🚀 WebSocket server on ws://localhost:7070");

function openByPath(path) {
  if (device) try { device.close(); } catch {}
  try {
    device = new HID.HID(path);
    currentPath = path;
    const info = HID.devices().find(d => d.path === path);
    const pid = info.productId;
    TOUCHPAD_RANGE.y = (pid === 0x05C4 ? 942 : 940);
    console.log(`🎮 Device opened: ${info.vendorId.toString(16)}:${pid.toString(16)}`);
    device.on('data', handleData);
    device.on('error', () => {
      console.error('💥 HID error, closing');
      try { device.close(); } catch {}
      device = null;
    });
  } catch (err) {
    console.error('❌ Failed to open device:', err.message);
    device = null;
    currentPath = null;
  }
}

function handleData(data) {
  const bytes = [...data];
  let x = 0, y = 0, active = false;
  if (bytes.length >= 40) {
    const t0_active = (bytes[35] & 0x80) === 0;
    const xRaw = ((bytes[37] & 0x0F) << 8) | bytes[36];
    const yRaw = ((bytes[38] & 0xFF) << 4) | ((bytes[37] & 0xF0) >> 4);
    active = t0_active;
    x = Math.min(Math.max(0, xRaw), TOUCHPAD_RANGE.x) / TOUCHPAD_RANGE.x;
    y = Math.min(Math.max(0, yRaw), TOUCHPAD_RANGE.y) / TOUCHPAD_RANGE.y;
    x = +x.toFixed(3); y = +y.toFixed(3);
  }
  const payload = JSON.stringify({ x, y, active });
  for (const c of wss.clients) {
    if (c.readyState === c.OPEN) c.send(payload);
  }
  if (active) console.log(`📍 Touch at X:${x}, Y:${y}`);
}

wss.on('connection', ws => {
  console.log('🟢 Client connected');
  ws.on('message', msg => {
    try {
      const { vendorId, productId } = JSON.parse(msg);
      const dev = HID.devices().find(d =>
        d.vendorId === vendorId &&
        d.productId === productId
      );
      if (dev && dev.path !== currentPath) openByPath(dev.path);
    } catch {}
  });
  ws.on('close', () => console.log('🔴 Client disconnected'));
});

// برای شروع، اولین دسته سونی متصل رو باز میکنیم:
const all = HID.devices().filter(d => d.vendorId === 0x054C);
if (all.length > 0) openByPath(all[0].path);
else console.log('⚠️ No Sony controller connected');
