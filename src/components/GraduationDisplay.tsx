import { useEffect, useState, useCallback } from "react";
import {
  getFirstGraduateNotReceived,
  setGraduateAsReceived,
} from "@/services/graduatesService";
import { motion, AnimatePresence } from "framer-motion";

interface Graduate {
  id: number;
  name: string;
  order: number;
  faculty: string;
  round: number;
}

interface GraduateProps {
  onClick: () => void;
}

export function GraduationDisplay({ onClick }: GraduateProps) {
  const [graduate, setGraduate] = useState<Graduate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGraduate = useCallback(async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      const res = await getFirstGraduateNotReceived();
      if (res.status === "success" && res.data) {
        const {
          id,
          prefix,
          first_name,
          last_name,
          sequence,
          degree_name,
          faculty_name,
          round_number,
        } = res.data;

        setGraduate({
          id,
          name: `${prefix} ${first_name} ${last_name}`,
          order: sequence,
          faculty: `${faculty_name} (${degree_name})`,
          round: round_number,
        });
      } else {
        setGraduate(null);
      }
    } catch (err) {
      console.error("❌ โหลดข้อมูลไม่สำเร็จ:", err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraduate(true); // เรียกครั้งแรกแสดง loading
  }, [fetchGraduate]);

  const handleNextGraduate = useCallback(async () => {
    if (!graduate) return;
    try {
      await setGraduateAsReceived(graduate.id);
      await fetchGraduate(); // ไม่โชว์ loading overlay
      onClick();
    } catch (err) {
      console.error("❌ อัปเดตสถานะบัณฑิตล้มเหลว:", err);
    }
  }, [graduate, fetchGraduate, onClick]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleNextGraduate();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNextGraduate]);

  if (!graduate && !loading) {
    return <p className="text-red-600 text-center">ไม่พบข้อมูลบัณฑิต</p>;
  }

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <p className="text-orange-600 animate-pulse">กำลังโหลด...</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {graduate && (
          <motion.div
            key={graduate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 relative z-0">
            <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center border-b pb-2">
              ข้อมูลบัณฑิตปัจจุบัน
            </h2>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                ชื่อ-สกุล
              </label>
              <p className="text-2xl font-semibold text-gray-900 tracking-wide">
                {graduate.name}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                รอบและลำดับ
              </label>
              <p className="text-2xl font-semibold text-orange-700">
                รอบ {graduate.round} ลำดับที่ {graduate.order}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                สาขา/คณะ
              </label>
              <p className="text-xl font-medium text-gray-700">
                {graduate.faculty}
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleNextGraduate}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                เรียกบัณฑิตคนถัดไป (Space)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
