import React, { useEffect, useState } from "react";

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Wait for fade transition before unmounting
          return 100;
        }
        // Increment progress smoothly, simulating asset loading
        return p + Math.floor(Math.random() * 15 + 2);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0b10] transition-opacity duration-500 ease-in-out ${progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center gap-6 transform scale-90 sm:scale-100">
        {/* Provider Branding */}
        <div className="flex flex-col items-center gap-4">
          <img 
            src={`${process.env.PUBLIC_URL}/JILLU-ICON.png`} 
            alt="JILLU Icon" 
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]" 
          />
          <img 
            src={`${process.env.PUBLIC_URL}/JILLU-LOGO.png`} 
            alt="JILLU" 
            className="h-10 sm:h-12 object-contain drop-shadow-[0_2px_15px_rgba(255,215,0,0.3)]"
          />
        </div>
        
        <div className="w-16 h-[1px] bg-white/20 my-2"></div>
        
        {/* Game Title */}
        <div className="text-2xl sm:text-3xl font-black italic text-[#ef4444] tracking-widest drop-shadow-[0_2px_10px_rgba(239,68,68,0.3)]">
          AVIATOR
        </div>
        
        {/* Loading Progress Bar */}
        <div className="w-64 sm:w-72 mt-10">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#ef4444] to-[#f59e0b] rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_rgba(245,158,11,0.6)]"
              style={{ width: `${Math.min(100, progress)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-3 text-white/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest">
            <span>Loading Assets</span>
            <span className="font-bold text-white/70">{Math.min(100, progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
