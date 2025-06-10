import { useEffect, useState } from "react";
import { getRemainingNotReceived } from "@/services/graduatesService";

const NumberDisplay = () => {
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await getRemainingNotReceived();
        if (res?.status === "success" && res.data) {
          console.log("📦 API Response:", res);
          setRemainingCount(res.data.remaining_not_received);
          setRoundNumber(res.data.round_number);
        }
      } catch (err) {
        console.error("❌ โหลดข้อมูลไม่สำเร็จ:", err);
      }
    };

    // ✅ เรียกครั้งแรกก่อนตั้ง interval
    fetchData();

    const interval = setInterval(fetchData, 500); // ดึงข้อมูลทุก 0.5 วินาที

    return () => clearInterval(interval); // เคลียร์ interval เมื่อ component ถูก unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 ">
      {/* Header */}
      <div className="text-[100px] font-bold mb-6 text-orange-700 drop-shadow">
        {typeof roundNumber === "number"
          ? `รอบที่ ${roundNumber}  ยอดคงเหลือ`
          : "รอบที่ – • ยอดคงเหลือ"}
      </div>

      {/* Number Display */}
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
