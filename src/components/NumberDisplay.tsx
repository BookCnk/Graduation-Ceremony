import { useEffect, useState } from "react";
import socket from "@/socket";

const NumberDisplay = () => {
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState<number | null>(null);

  useEffect(() => {
    const onGraduateCalled = (data: {
      round_number: number;
      remaining_not_received: number;
    }) => {
      console.log("📡 Received via graduate-called:", data);
      setRemainingCount(data.remaining_not_received);
      setRoundNumber(data.round_number);
    };

    // ✅ ฟัง event graduate-called
    socket.on("graduate-called", onGraduateCalled);

    return () => {
      // ❌ cleanup เมื่อ unmount
      socket.off("graduate-called", onGraduateCalled);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="text-[100px] font-bold mb-6 text-orange-700 drop-shadow">
        {typeof roundNumber === "number"
          ? `รอบที่ ${roundNumber}  ยอดคงเหลือ`
          : "รอบที่ – • ยอดคงเหลือ"}
      </div>

      <div className="leading-none">
        <div className="text-[500px] font-black text-orange-600 drop-shadow-xl">
          {typeof remainingCount === "number"
            ? remainingCount.toLocaleString()
            : "–"}
        </div>
      </div>
    </div>
  );
};

export default NumberDisplay;
