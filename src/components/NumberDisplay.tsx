import { useEffect, useState, useRef } from "react";
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
  const lastDataRef = useRef<DisplayData | null>(null);

  useEffect(() => {
    const onGraduateOverview = (payload: any) => {
      const raw = payload.data;

      const transformed: DisplayData = {
        round_number: Number(raw.round_number),
        total_capacity: Number(raw.total_capacity),
        remaining_count: Number(raw.remaining_count),
        current_faculty_name: raw.current_faculty_name,
        current_faculty_quota: Number(raw.current_faculty_quota),
        current_faculty_remaining: Number(raw.current_faculty_remaining),
      };

      lastDataRef.current = transformed;
      setData(transformed);
    };

    socket.on("graduate-overview", onGraduateOverview);

    // ✅ Properly clean up the listener
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

  const isFinished =
    data.round_number === 0 &&
    data.total_capacity === 0 &&
    data.remaining_count === 0 &&
    data.current_faculty_quota === 0 &&
    data.current_faculty_remaining === 0;

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
              {isFinished ? "0" : data.round_number}
            </span>
          </span>
        </div>

        <div className="text-[100px] font-extrabold text-white leading-none text-right">
          ยอด {isFinished ? "0" : data.total_capacity.toLocaleString()} คน
        </div>
      </div>

      {/* Center Display */}
      <div className="flex-grow flex items-center justify-center">
        {isFinished ? (
          <div className="text-[120px] md:text-[160px] lg:text-[200px] font-extrabold text-green-600 text-center drop-shadow-lg animate-pulse">
            🎉 เสร็จสิ้นรอบนี้
          </div>
        ) : (
          <div className="text-[360px] font-black text-black leading-none drop-shadow-xl">
            {data.remaining_count.toLocaleString()}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bg-orange-600 text-white text-4xl font-bold flex justify-between items-center px-10 py-10 shadow-inner">
        <div className="flex items-center gap-4">
          <span>{isFinished ? "" : data.current_faculty_name}</span>
          <span className="bg-white text-orange-600 px-6 py-2 rounded text-5xl">
            {isFinished ? "0" : data.current_faculty_quota.toLocaleString()} คน
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>เหลือกำลังรับ</span>
          <span className="bg-white text-red-600 px-6 py-2 rounded text-6xl font-extrabold">
            {isFinished ? "0" : data.current_faculty_remaining.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisplayBoard;
