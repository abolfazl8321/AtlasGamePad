'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Gamepad2, Languages, XCircle, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useGamepad } from '../hooks/useGamepad';

function HourglassGamepadIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="14" width="36" height="20" rx="10" fill="#222" stroke="#3B82F6" strokeWidth="2"/>
      <rect x="20" y="18" width="8" height="12" rx="4" fill="#fff" fillOpacity="0.15"/>
      <polygon points="24,20 28,28 20,28" fill="#3B82F6" fillOpacity="0.5"/>
      <g>
        <motion.rect
          x="23" y="23" width="2" height="4" rx="1"
          fill="#3B82F6"
          animate={{ y: [23, 26, 23] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
      </g>
      <circle cx="16" cy="28" r="2" fill="#3B82F6"/>
      <circle cx="32" cy="28" r="2" fill="#3B82F6"/>
      <circle cx="32" cy="20" r="1.2" fill="#fff"/>
      <circle cx="34" cy="22" r="1.2" fill="#fff"/>
      <circle cx="30" cy="22" r="1.2" fill="#fff"/>
      <circle cx="32" cy="24" r="1.2" fill="#fff"/>
    </svg>
  );
}

export default function Home() {
  // استفاده از هوک برای دریافت وضعیت دسته و تاچ‌پد
  const {
    gamepad,
    connected,
    buttons,
    axes,
    controllerType,
    touchpadData,
    touchpadConnected,
    setTouchpadData,
  } = useGamepad();

  const [testResult,] = useState<'healthy' | 'needs_attention' | 'faulty' | null>(null);
  const [language, setLanguage] = useState<'fa' | 'en'>('fa');
  const [showFullTest, setShowFullTest] = useState(false);
  const [testing, setTesting] = useState(false); // اضافه شد

  const analogStickRef = useRef<HTMLDivElement>(null);
  const fullTestCardRef = useRef<HTMLDivElement>(null);

  const t = {
    fa: {
      title: 'داشبورد تست ATLAS',
      connectionStatus: 'وضعیت اتصال',
      controllerVisual: 'نمایش دسته بازی',
      healthTest: 'تست سلامت',
      runTest: 'اجرای تست',
      testing: 'در حال تست...',
      connected: 'متصل',
      disconnected: 'قطع',
      healthy: 'سالم',
      needsAttention: 'نیاز به توجه',
      faulty: 'مشکل دار',
      startTesting: 'شروع تست کامل',
      buttonsTest: 'تست دکمه‌ها',
      analogTest: 'تست آنالوگ',
      triggersTest: 'تست ماشه‌ها',
      touchpadTest: 'تست تاچ پد',
      fullTestTitle: 'تست کامل دسته بازی',
      connectedSuccessfully: 'دسته با موفقیت متصل شد!',
      startFullTest: 'شروع تست کامل',
      closeFullTest: 'بستن تست کامل',
      testInstructions: 'تمام دکمه‌ها، آنالوگ‌ها و ماشه‌ها را تست کنید',
      pressToTest: 'برای تست فشار دهید',
      touchpadConnected: 'اتصال تاچ‌پد فعال',
      touchpadDisconnected: 'اتصال تاچ‌پد قطع'
    },
    en: {
      title: 'ATLAS Gamepad Tester',
      connectionStatus: 'Connection Status',
      controllerVisual: 'Controller Visual',
      healthTest: 'Health Test',
      runTest: 'Run Test',
      testing: 'Testing...',
      connected: 'Connected',
      disconnected: 'Disconnected',
      healthy: 'Healthy',
      needsAttention: 'Needs Attention',
      faulty: 'Faulty',
      startTesting: 'Start Full Test',
      buttonsTest: 'Buttons Test',
      analogTest: 'Analog Test',
      triggersTest: 'Triggers Test',
      touchpadTest: 'Touchpad Test',
      fullTestTitle: 'Full Controller Test',
      connectedSuccessfully: 'Controller connected successfully!',
      startFullTest: 'Start Full Test',
      closeFullTest: 'Close Full Test',
      testInstructions: 'Test all buttons, analog sticks and triggers',
      pressToTest: 'Press to test',
      touchpadConnected: 'Touchpad connected',
      touchpadDisconnected: 'Touchpad disconnected'
    }
  };

  const startFullTest = () => {
    setShowFullTest(true);
    setTesting(true); // شروع تست
    setTimeout(() => {
      if (fullTestCardRef.current) {
        fullTestCardRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const renderControllerVisual = () => {
    if (!controllerType) return null;
    
    return (
      <motion.div 
        className="relative w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {controllerType === 'ps4' && (
            <div className="gamepad-ps4 w-64 h-48 relative">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-2 border-blue-500/30">
                <motion.div
                  ref={analogStickRef}
                  className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-blue-500 -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <div className="absolute top-28 left-8 w-8 h-8 rounded-full border border-blue-500/30"></div>
              <div className="absolute top-28 right-8 w-8 h-8 rounded-full border border-blue-500/30"></div>
            </div>
          )}
          
          {controllerType === 'ps5' && (
            <div className="gamepad-ps5 w-72 h-48 relative">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-28 rounded-full border-2 border-purple-500/30">
                <motion.div
                  ref={analogStickRef}
                  className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-purple-500 -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <div className="absolute top-32 left-10 w-10 h-10 rounded-full border border-purple-500/30"></div>
              <div className="absolute top-32 right-10 w-10 h-10 rounded-full border border-purple-500/30"></div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <span className="inline-block px-4 py-2 rounded-lg bg-blue-900/60 text-blue-200 text-base font-semibold shadow">
              {controllerType === 'ps4'
                ? 'دسته PS4 شناسایی شد. برای شروع تست کامل، روی دکمه "شروع تست کامل" کلیک کنید.'
                : 'دسته PS5 شناسایی شد. برای شروع تست کامل، روی دکمه "شروع تست کامل" کلیک کنید.'}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // نمایش تاچ‌پد با داده WebSocket
  const renderFullTestCard = () => {
    if (!showFullTest || !gamepad) return null;
    return (
      <motion.div
        ref={fullTestCardRef}
        className="mt-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-blue-500 p-3 md:p-6"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-start justify-center">
          {/* آنالوگ‌ها */}
          <div className="flex flex-row gap-3 md:gap-6">
            {/* Left Analog */}
            <div className="flex flex-col items-center">
              <svg width="90" height="90" className="block md:w-[120px] md:h-[120px] w-[90px] h-[90px]">
                <circle cx="45" cy="45" r="40" stroke="#888" strokeWidth="2" fill="none" />
                <line x1="45" y1="5" x2="45" y2="85" stroke="#555" strokeWidth="1.5"/>
                <line x1="5" y1="45" x2="85" y2="45" stroke="#555" strokeWidth="1.5"/>
                <circle
                  cx={45 + (axes[0] || 0) * 40}
                  cy={45 + (axes[1] || 0) * 40}
                  r="10"
                  fill="#e11d48"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-xs text-gray-400 mt-1 font-mono">
                {`${(axes[0] || 0).toFixed(2)}, ${(axes[1] || 0).toFixed(2)}`}
              </div>
            </div>
            {/* Right Analog */}
            <div className="flex flex-col items-center">
              <svg width="90" height="90" className="block md:w-[120px] md:h-[120px] w-[90px] h-[90px]">
                <circle cx="45" cy="45" r="40" stroke="#888" strokeWidth="2" fill="none" />
                <line x1="45" y1="5" x2="45" y2="85" stroke="#555" strokeWidth="1.5"/>
                <line x1="5" y1="45" x2="85" y2="45" stroke="#555" strokeWidth="1.5"/>
                <circle
                  cx={45 + (axes[2] || 0) * 40}
                  cy={45 + (axes[3] || 0) * 40}
                  r="10"
                  fill="#e11d48"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-xs text-gray-400 mt-1 font-mono">
                {`${(axes[2] || 0).toFixed(2)}, ${(axes[3] || 0).toFixed(2)}`}
              </div>
            </div>
          </div>
          {/* دکمه‌ها */}
          <div className="flex-1 flex flex-wrap gap-2 md:gap-3 items-start min-w-[200px] md:min-w-[340px] justify-center">
            {buttons.map((pressed, index) => (
              <div
                key={index}
                className={cn(
                  "w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center border border-gray-500 rounded-xl transition-colors duration-150",
                  pressed ? "bg-green-600/90 text-white shadow-lg scale-105" : "bg-gray-800/80 text-gray-200"
                )}
                style={{ fontSize: "1.1rem" }}
                tabIndex={0}
                aria-label={`Button ${index} ${pressed ? "pressed" : "not pressed"}`}
              >
                <svg
                  width="48"
                  height="48"
                  className="block"
                  style={{ display: "block" }}
                  aria-hidden="true"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={pressed ? "#22c55e" : "#aaa"}
                    strokeWidth="2"
                    fill={pressed ? "#22c55e" : "none"}
                    style={{ transition: "stroke 0.2s, fill 0.2s" }}
                  />
                  <text
                    x="50%"
                    y="52%"
                    textAnchor="middle"
                    fill={pressed ? "#fff" : "#bbb"}
                    fontSize="16"
                    fontFamily="monospace"
                    dy=".3em"
                    style={{ fontWeight: 700, userSelect: "none" }}
                  >
                    {index}
                  </text>
                </svg>
                <span
                  className={cn(
                    "block font-mono mt-1",
                    pressed ? "text-white" : "text-gray-300"
                  )}
                  style={{
                    fontSize: "1.35rem",
                    lineHeight: 1,
                    fontWeight: 700,
                    letterSpacing: "0.01em"
                  }}
                >
                  {(gamepad.buttons[index]?.value ?? 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          {/* تریگرها */}
          <div className="flex flex-col gap-2 min-w-[90px] md:min-w-[130px]">
            <div>
              <div className="text-xs text-gray-300 mb-1">L2</div>
              <div className="relative h-6 md:h-8 w-20 md:w-28 bg-gray-700 rounded-full border border-gray-600 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  style={{
                    width: `${(gamepad.buttons[6]?.value || 0) * 100}%`,
                    transition: "width 0.2s"
                  }}
                />
                <div className="absolute right-2 top-1 text-xs text-white font-mono">
                  {(gamepad.buttons[6]?.value || 0).toFixed(2)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-300 mb-1">R2</div>
              <div className="relative h-6 md:h-8 w-20 md:w-28 bg-gray-700 rounded-full border border-gray-600 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{
                    width: `${(gamepad.buttons[7]?.value || 0) * 100}%`,
                    transition: "width 0.2s"
                  }}
                />
                <div className="absolute right-2 top-1 text-xs text-white font-mono">
                  {(gamepad.buttons[7]?.value || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          {/* تاچ پد */}
          <div className="flex flex-col items-center min-w-[120px] md:min-w-[160px]">
            {/* وضعیت تاچ‌پد */}
            <div className="mb-1 text-xs font-bold"
              style={{ color: touchpadConnected ? "#22c55e" : "#dc2626" }}>
              {touchpadConnected
                ? (language === "fa" ? "تاچ‌پد متصل است" : "Touchpad connected")
                : (language === "fa" ? "تاچ‌پد قطع است" : "Touchpad disconnected")}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${touchpadConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
            <div
              id="touchpad-area"
              className="relative w-28 h-20 md:w-36 md:h-24 bg-gray-700 rounded-2xl border-2 border-blue-400 flex items-center justify-center select-none touch-none"
              style={{ touchAction: "none" }}
            >
              {/* دایره قرمز کوچک هنگام لمس */}
              {touchpadData && touchpadData.active && (
                <div
                  className="absolute rounded-full bg-red-600 shadow"
                  style={{
                    left: `calc(${(touchpadData.x ?? 0) * 100}% - 8px)`,
                    top: `calc(${(touchpadData.y ?? 0) * 100}% - 8px)`,
                    width: 16,
                    height: 16,
                    pointerEvents: "none",
                    boxShadow: "0 0 8px 2px #dc2626aa"
                  }}
                />
              )}
              <span className="text-xs text-gray-400 absolute bottom-1 left-1">
                {touchpadData && touchpadData.active
                  ? `X: ${(touchpadData.x ?? 0).toFixed(2)} Y: ${(touchpadData.y ?? 0).toFixed(2)}`
                  : (language === "fa"
                    ? "برای تست لمس، روی تاچ‌پد کلیک یا لمس کنید"
                    : "Tap or click the touchpad to test")}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // پشتیبانی از لمس موس/تاچ (در کنار WebSocket)
  useEffect(() => {
    if (!showFullTest) return;
    const area = document.getElementById("touchpad-area");
    if (!area) return;

    const handlePointer = (e: any) => {
      const rect = area.getBoundingClientRect();
      let x = 0, y = 0;
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        x = (t.clientX - rect.left) / rect.width;
        y = (t.clientY - rect.top) / rect.height;
      } else if (typeof e.clientX === "number" && typeof e.clientY === "number") {
        x = (e.clientX - rect.left) / rect.width;
        y = (e.clientY - rect.top) / rect.height;
      }
      setTouchpadData?.({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
        active: true,
      });
    };
    const handlePointerUp = () => {
      setTouchpadData?.(prev => prev ? { ...prev, active: false } : null);
    };

    area.addEventListener("pointerdown", handlePointer);
    area.addEventListener("pointermove", handlePointer);
    area.addEventListener("pointerup", handlePointerUp);
    area.addEventListener("pointerleave", handlePointerUp);

    area.addEventListener("mousedown", handlePointer);
    area.addEventListener("mousemove", handlePointer);
    area.addEventListener("mouseup", handlePointerUp);
    area.addEventListener("mouseleave", handlePointerUp);

    area.addEventListener("touchstart", handlePointer, { passive: false });
    area.addEventListener("touchmove", handlePointer, { passive: false });
    area.addEventListener("touchend", handlePointerUp, { passive: false });

    return () => {
      area.removeEventListener("pointerdown", handlePointer);
      area.removeEventListener("pointermove", handlePointer);
      area.removeEventListener("pointerup", handlePointerUp);
      area.removeEventListener("pointerleave", handlePointerUp);

      area.removeEventListener("mousedown", handlePointer);
      area.removeEventListener("mousemove", handlePointer);
      area.removeEventListener("mouseup", handlePointerUp);
      area.removeEventListener("mouseleave", handlePointerUp);

      area.removeEventListener("touchstart", handlePointer);
      area.removeEventListener("touchmove", handlePointer);
      area.removeEventListener("touchend", handlePointerUp);
    };
  }, [showFullTest, setTouchpadData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.header
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          initial={false}
          animate="show"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Gamepad2 className="w-6 h-6 text-white" />
            </motion.div>
            
            <motion.h1
              className="text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 120 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {t[language].title}
              </span>
            </motion.h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, type: "spring", stiffness: 120 }}
          >
            <Button 
              variant="outline" 
              className={cn(
                "border-gray-700 flex items-center gap-2",
                language === 'fa' ? 'text-purple-500' : 'text-blue-500'
              )}
              onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
            >
              <Languages className="w-4 h-4" />
              {language === 'fa' ? 'English' : 'فارسی'}
            </Button>
          </motion.div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Gamepad2 className="w-5 h-5 text-blue-400" />
                  {t[language].controllerVisual}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!connected ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl p-8 flex flex-col items-center">
                      <div className="mb-4">
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                          className="inline-block"
                        >
                          <HourglassGamepadIcon className="w-12 h-12 mx-auto" />
                        </motion.span>
                      </div>
                      <p className="text-gray-400 mb-2">
                        {language === 'fa' ? 'دسته بازی متصل نیست' : 'Controller not connected'}
                      </p>
                      <p className="text-sm text-gray-500 max-w-md">
                        {language === 'fa' 
                          ? 'لطفاً دسته بازی PS4 یا PS5 را از طریق USB به کامپیوتر متصل کنید' 
                          : 'Please connect your PS4 or PS5 controller via USB'}
                      </p>
                      <div className="mt-6 flex gap-3">
                        <Badge variant="outline" className="border-blue-500 text-blue-500">
                          PS4
                        </Badge>
                        <Badge variant="outline" className="border-purple-500 text-purple-500">
                          PS5
                        </Badge>
                      </div>
                    </div>
                    
                    <motion.div
                      className="mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                    >
                      <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-600 rounded-xl px-6 py-5 max-w-xl mx-auto text-yellow-100 text-sm leading-relaxed shadow">
                        <div className="font-bold mb-2 flex items-center gap-2">
                          <AlertCircle className="inline-block w-5 h-5 text-yellow-400" />
                          {language === 'fa'
                            ? 'اگر دسته با USB وصل است اما کار نمی‌کند، این موارد را بررسی کنید:'
                            : 'If your controller is connected via USB but not working, check these:'}
                        </div>
                        <ul className="list-disc pr-5 space-y-2 text-right">
                          {language === 'fa' ? (
                            <>
                              <li>کابل USB معیوب یا ناسازگار است (حتماً با کابل اصلی یا کابل دیتا تست کنید).</li>
                              <li>پورت USB کامپیوتر مشکل دارد (پورت دیگری را امتحان کنید).</li>
                              <li>دسته نیاز به شارژ دارد یا باتری آن خراب است.</li>
                              <li>درایور دسته در ویندوز نصب نشده یا به‌درستی نصب نشده است.</li>
                              <li>برنامه‌های دیگر دسته را اشغال کرده‌اند (مثلاً Steam یا نرم‌افزارهای شبیه‌ساز).</li>
                              <li>دسته به صورت بلوتوث قبلاً جفت شده و تداخل دارد (درایور بلوتوث را غیرفعال کنید و فقط USB تست کنید).</li>
                              <li>سیستم عامل نیاز به ریستارت دارد.</li>
                            </>
                          ) : (
                            <>
                              <li>The USB cable is faulty or not a data cable (try the original or a data-capable cable).</li>
                              <li>The computer's USB port is faulty (try a different port).</li>
                              <li>The controller needs charging or has a bad battery.</li>
                              <li>The controller driver is missing or not installed correctly in Windows.</li>
                              <li>Other software is capturing the controller (e.g. Steam or emulators).</li>
                              <li>The controller is paired via Bluetooth and conflicts (disable Bluetooth driver and test only USB).</li>
                              <li>The operating system needs a restart.</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <motion.div
                      className="flex flex-col items-center justify-center mb-2"
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.7, type: "spring" }}
                    >
                      <motion.div
                        className="rounded-full bg-green-600/80 shadow-lg flex items-center justify-center mb-2"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 #22c55e55", "0 0 0 16px #22c55e11", "0 0 0 0 #22c55e55"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        style={{ width: 60, height: 60 }}
                      >
                        <Gamepad2 className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.div
                        className="text-green-400 font-bold text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {t[language].connectedSuccessfully}
                      </motion.div>
                    </motion.div>
                    
                    {renderControllerVisual()}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-lg font-bold flex items-center justify-center gap-2"
                        onClick={startFullTest}
                        disabled={testing}
                      >
                        {testing ? (
                          <>
                            <span>
                              {language === "fa" ? "در حال تست..." : "Testing..."}
                            </span>
                            <span className="inline-block w-3 h-3 rounded-full ml-2 mr-1"
                              style={{
                                background: "#22c55e",
                                boxShadow: "0 0 0 0 #22c55e",
                                animation: "blink-dot 1s infinite"
                              }}
                            />
                          </>
                        ) : (
                          t[language].startFullTest
                        )}
                      </Button>
                      <style>
                        {`
                          @keyframes blink-dot {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.2; }
                          }
                        `}
                      </style>
                      <p className="text-center text-gray-400 mt-2 text-sm">
                        {language === 'fa'
                          ? 'برای تست کامل تمام دکمه‌ها و بخش‌های دسته بازی کلیک کنید'
                          : 'Click to test all buttons and components of the controller'}
                      </p>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={false}
            animate="show"
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
            >
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-blue-400" />
                    {t[language].connectionStatus}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-4 h-4 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <p className="text-white">{connected ? t[language].connected : t[language].disconnected}</p>
                  </div>
                  
                  {connected && (
                    <div className="space-y-4">
                      <div>
                        <p className="font-mono text-sm truncate text-white">{gamepad?.id}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 100 }}
            >
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    {t[language].healthTest}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className="rounded-xl border border-gray-700 bg-gray-800/70 px-6 py-5 mt-2 mb-2"
                    style={{ direction: language === 'fa' ? 'rtl' : 'ltr' }}
                  >
                    {language === 'fa' ? (
                      <>
                        <div className="mb-3 font-bold text-white text-base">راهنمای تست سلامت برای تعمیرکاران:</div>
                        <ul className="space-y-3 pl-6">
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">تمام دکمه‌ها را به صورت جداگانه فشار دهید و مطمئن شوید که هر کدام در نرم‌افزار شناسایی می‌شوند.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">آنالوگ‌ها را در تمام جهات حرکت دهید و بررسی کنید که حرکت نرم و بدون پرش باشد.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">ماشه‌ها (Triggers) را تا انتها فشار دهید و مقدار آن‌ها را مشاهده کنید.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">در صورت وجود تاچ‌پد، عملکرد لمس را تست کنید.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">در صورت مشاهده هرگونه تاخیر یا عدم شناسایی، احتمال خرابی سخت‌افزاری وجود دارد.</span>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <div className="mb-3 font-bold text-white text-base">Health Test Tips for Technicians:</div>
                        <ul className="space-y-3 pl-6">
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">Press each button individually and ensure it is detected by the software.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">Move analog sticks in all directions and check for smooth, jump-free movement.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">Fully press triggers and observe their value changes.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">If available, test the touchpad for proper touch response.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block flex-shrink-0"></span>
                            <span className="text-white">If you notice any lag or unrecognized input, hardware failure may be present.</span>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>

                  {testResult && (
                    <motion.div 
                      className={`p-4 rounded-lg ${testResult === 'healthy' ? 'bg-green-900/30 border border-green-800' : testResult === 'needs_attention' ? 'bg-yellow-900/30 border border-yellow-800' : 'bg-red-900/30 border border-red-800'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2">
                        {testResult === 'healthy' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {testResult === 'needs_attention' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                        {testResult === 'faulty' && <XCircle className="w-5 h-5 text-red-500" />}
                        <span className="font-medium">
                          {testResult === 'healthy' && t[language].healthy}
                          {testResult === 'needs_attention' && t[language].needsAttention}
                          {testResult === 'faulty' && t[language].faulty}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence>
          {renderFullTestCard()}
        </AnimatePresence>

        <motion.footer 
          className="mt-16 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p>ATLAS Gamepad Tester - {language === 'fa' ? 'نسخه حرفه‌ای برای تعمیرکاران' : 'Professional version for technicians'}</p>
        </motion.footer>
      </div>
    </div>
  );
}