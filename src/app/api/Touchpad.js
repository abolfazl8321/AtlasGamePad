const HID = require('node-hid');
const WebSocket = require('ws');

// حذف مقادیر ثابت، فقط device را داینامیک نگه می‌داریم
let device = null;
let currentVendorId = null;
let currentProductId = null;
let TOUCHPAD_RANGE = { x: 1920, y: 940 };

const wss = new WebSocket.Server({ port: 7070 });
console.log("🚀 سرور WebSocket روی ws://localhost:7070 در حال اجراست");

function openDevice(vendorId, productId) {
  if (device) {
    try { device.close(); } catch {}
    device = null;
  }
  try {
    device = new HID.HID(vendorId, productId);
    currentVendorId = vendorId;
    currentProductId = productId;
    TOUCHPAD_RANGE = {
      x: 1920,
      y: productId === 0x05C4 ? 942 : 940 // PS4=942, PS5=940
    };
    console.log(`🎮 کنترلر با VID ${vendorId.toString(16)} و PID ${productId.toString(16)} متصل شد`);
    device.on('data', handleData);
    device.on('error', (err) => {
      console.error('💥 خطای HID:', err);
      try { device.close(); } catch {}
      device = null;
    });
  } catch (err) {
    console.error(`❌ باز کردن کنترلر با VID ${vendorId.toString(16)} و PID ${productId.toString(16)} شکست خورد:`, err.message);
  }
}

function handleData(data) {
  try {
    const bytes = [...data];
    let x = 0, y = 0, active = false;

    if (bytes.length >= 40) {
      const t0_active = (bytes[35] & 0x80) === 0;
      const xRaw = ((bytes[37] & 0x0F) << 8) | bytes[36];
      const yRaw = ((bytes[38] & 0xFF) << 4) | ((bytes[37] & 0xF0) >> 4);

      active = t0_active;
      x = Math.max(0, Math.min(TOUCHPAD_RANGE.x, xRaw));
      y = Math.max(0, Math.min(TOUCHPAD_RANGE.y, yRaw));
      x = +(x / TOUCHPAD_RANGE.x).toFixed(3);
      y = +(y / TOUCHPAD_RANGE.y).toFixed(3);
    }

    const touchData = { x, y, active };

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(touchData));
      }
    });

    if (active) {
      console.log(`📍 تاچ فعال | X: ${x}, Y: ${y}`);
    }
  } catch (error) {
    console.error('❌ خطا در پردازش داده‌های HID:', error);
  }
}

wss.on('connection', (ws) => {
  console.log('🟢 کلاینت جدید متصل شد');
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.vendorId && data.productId) {
        // اگر device فعلی با این مقادیر نیست، device جدید باز کن
        if (
          !device ||
          currentVendorId !== data.vendorId ||
          currentProductId !== data.productId
        ) {
          openDevice(data.vendorId, data.productId);
        }
      }
    } catch {}
  });
  ws.on('close', () => {
    console.log('🔴 کلاینت قطع شد');
  });
});
openDevice(0x054C, 0x09CC); // PS5 پیش‌فرض