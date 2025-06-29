import { useEffect, useState, useRef } from 'react';

export const useGamepad = () => {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);
  const [connected, setConnected] = useState(false);
  const [buttons, setButtons] = useState<boolean[]>([]);
  const [axes, setAxes] = useState<number[]>([]);
  const [controllerType, setControllerType] = useState<'ps4' | 'ps5' | 'xbox' | null>(null);
  const [touchpadData, setTouchpadData] = useState<{x: number, y: number, active: boolean} | null>(null);
  const [touchpadConnected, setTouchpadConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const detectControllerType = (id: string) => {
    if (id.includes('Xbox') || id.includes('XBOX')) return 'xbox';
    if (id.includes('DualSense')) return 'ps5';
    if (id.includes('DualShock')) return 'ps4';
    return null;
  };

  // اتصال WebSocket برای تاچ‌پد (همیشه فعال باشد برای سازگاری با تست کامل)
  useEffect(() => {
    const ws = new window.WebSocket('ws://localhost:7070');
    wsRef.current = ws;
    ws.onopen = () => setTouchpadConnected(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // داده سرور: x, y بین 0 و 1، active بولین
        if (
          typeof data.x === 'number' &&
          typeof data.y === 'number' &&
          typeof data.active === 'boolean'
        ) {
          setTouchpadData({
            x: data.x,
            y: data.y,
            active: data.active
          });
        }
      } catch {}
    };
    ws.onerror = () => setTouchpadConnected(false);
    ws.onclose = () => {
      setTouchpadConnected(false);
      setTouchpadData(null);
    };
    return () => ws.close();
  }, []);

  // ارسال vendorId و productId به سرور هر بار که دسته جدید وصل شد
  useEffect(() => {
    if (gamepad?.id && wsRef.current && wsRef.current.readyState === 1) {
      const ids = extractVendorProductId(gamepad.id);
      if (ids) {
        wsRef.current.send(JSON.stringify({
          vendorId: ids.vendorId,
          productId: ids.productId
        }));
      }
    }
  }, [gamepad?.id]);

  // مدیریت اتصال دسته بازی
  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      const gp = e.gamepad;
      setGamepad(gp);
      setConnected(true);
      setButtons(Array(gp.buttons.length).fill(false));
      setAxes(Array(gp.axes.length).fill(0));
      setControllerType(detectControllerType(gp.id));
    };

    const handleGamepadDisconnected = () => {
      setGamepad(null);
      setConnected(false);
      setButtons([]);
      setAxes([]);
      setControllerType(null);
      setTouchpadConnected(false);
      setTouchpadData(null);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // بررسی اولیه برای دسته‌های از قبل متصل
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        handleGamepadConnected(new GamepadEvent('gamepadconnected', {
          gamepad: gamepads[i]!
        }));
        break;
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  // به‌روزرسانی وضعیت دسته
  useEffect(() => {
    let animationFrameId: number;

    const updateGamepadStatus = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads[0]) {
        const gp = gamepads[0];
        setGamepad(gp);
        setButtons(gp.buttons.map(button => button.pressed));
        setAxes(gp.axes.map(axis => axis));
      }
      animationFrameId = requestAnimationFrame(updateGamepadStatus);
    };

    if (connected) {
      animationFrameId = requestAnimationFrame(updateGamepadStatus);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [connected]);

  return { 
    gamepad, 
    connected, 
    buttons, 
    axes, 
    controllerType,
    touchpadData,
    touchpadConnected,
    setTouchpadData 
  };
};
export function extractVendorProductId(gamepadId: string): { vendorId: number, productId: number } | null {
  // مثال: "Vendor: 054C Product: 09CC" یا "054C-09CC" یا "054C:09CC"
  const match = gamepadId.match(/([0-9a-fA-F]{4})[^0-9a-fA-F]?([0-9a-fA-F]{4})/);
  if (match) {
    return {
      vendorId: parseInt(match[1], 16),
      productId: parseInt(match[2], 16)
    };
  }
  return null;
}