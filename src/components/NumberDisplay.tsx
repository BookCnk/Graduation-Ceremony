import { useEffect, useState } from "react";
import { getQuotaSummary } from "@/services/graduatesService";

const NumberDisplay = () => {
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await getQuotaSummary();
        if (res.status === "success" && res.data?.length > 0) {
          setRemainingCount(res.data[0].assigned);
        }
      } catch (err) {
        console.error("❌ โหลดข้อมูลไม่สำเร็จ:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-2xl font-semibold mb-2 text-orange-600 text-center">
        รอบที่ 1 <br />
        ยอดคงเหลือ
      </div>
      <div className="text-[15rem] font-black leading-none text-orange-600 drop-shadow-sm">
        {remainingCount !== null ? remainingCount : "–"}
      </div>
    </div>
  );
};

export default NumberDisplay;
