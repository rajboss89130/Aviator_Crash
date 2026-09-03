// ============================================================================
// CASINO AVIATOR CRASH GAME MODULE ENTRY POINT
// ============================================================================

import React, { useState } from "react";
import { GameBoard } from "./GameBoard";
import { LoadingScreen } from "../LoadingScreen";
import "../../styles/casino.css";

const Aviator: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className={loading ? "hidden" : "block h-full w-full"}>
        <GameBoard />
      </div>
    </>
  );
};

export default Aviator;
