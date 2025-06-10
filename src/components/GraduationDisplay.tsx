import { useEffect, useState } from "react";
import {
  getFirstGraduateNotReceived,
  setGraduateAsReceived,
} from "@/services/graduatesService";

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

  const fetchGraduate = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleNextGraduate = async () => {
    if (!graduate) return;

    try {
      await setGraduateAsReceived(graduate.id);
      await fetchGraduate(); 
      onClick();// โหลดบัณฑิตคนใหม่
    } catch (err) {
      console.error("❌ อัปเดตสถานะบัณฑิตล้มเหลว:", err);
    }
  };

  useEffect(() => {
    fetchGraduate();
  }, []);

  return (
    <>
      {loading ? (
        <p className="text-orange-600 text-lg text-center animate-pulse">
          กำลังโหลดข้อมูล...
        </p>
      ) : graduate ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center border-b pb-2">
            ข้อมูลบัณฑิตปัจจุบัน
          </h2>
          <div className="space-y-6">
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
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleNextGraduate}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
              เรียกบัณฑิตคนถัดไป
            </button>
          </div>
        </>
      ) : (
        <p className="text-red-600 text-center">ไม่พบข้อมูลบัณฑิต</p>
      )}
    </>
  );
}
