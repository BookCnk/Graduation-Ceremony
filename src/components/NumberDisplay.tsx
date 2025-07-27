// components/DisplayBoard.tsx
import { useEffect, useState } from "react";
import socket from "@/socket";

interface DisplayData {
  round_number: number;
  total_capacity: number;
  remaining_count: number;
  current_faculty_name: string;
  current_faculty_quota: number;
  current_faculty_remaining: number;
}

const DisplayBoard = () => {
  const [data, setData] = useState<DisplayData | null>(null);

  useEffect(() => {
    const onGraduateOverview = (payload: any) => {
      console.log(payload);

      const raw: any = payload.data;

      const transformed: DisplayData = {
        round_number: Number(raw.round_number),
        total_capacity: Number(raw.total_capacity),
        remaining_count: Number(raw.remaining_count),
        current_faculty_name: raw.current_faculty_name,
        current_faculty_quota: Number(raw.current_faculty_quota),
        current_faculty_remaining: Number(raw.current_faculty_remaining),
      };

      setData(transformed);
      console.log("📡 แปลงข้อมูลแล้ว:", transformed);
    };

    socket.on("graduate-overview", onGraduateOverview);

    return () => {
      socket.off("graduate-overview", onGraduateOverview);
    };
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <img
          src="/assets/loading.svg"
          alt="Loading..."
          className="h-24 animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Bar */}
      <div className="bg-orange-600 text-white flex justify-between items-center px-10 py-10 shadow-md">
        <div className="flex items-center gap-6">
          <img
            src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png"
            alt="KMUTT Logo"
            className="h-20 bg-white rounded"
          />
          <span className="text-5xl font-bold">
            รอบที่{" "}
            <span className="bg-white text-orange-600 px-6 py-2 rounded text-5xl">
              {data.round_number}
            </span>
          </span>
        </div>

        <div className="text-[100px] font-extrabold text-white leading-none text-right">
          ยอด {Number(data.total_capacity)} คน
        </div>
      </div>

      {/* Center Number */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-[360px] font-black text-black leading-none drop-shadow-xl">
          {data.remaining_count.toLocaleString()}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-orange-600 text-white text-4xl font-bold flex justify-between items-center px-10 py-10 shadow-inner">
        <div className="flex items-center gap-4">
          <span>{data.current_faculty_name}</span>
          <span className="bg-white text-orange-600 px-6 py-2 rounded text-5xl">
            {data.current_faculty_quota.toLocaleString()} คน
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>เหลือกำลังรับ</span>
          <span className="bg-white text-red-600 px-6 py-2 rounded text-6xl font-extrabold">
            {data.current_faculty_remaining.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisplayBoard;
