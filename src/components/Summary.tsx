import { motion } from "framer-motion";
import { useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import GraduateTable from "@/components/GraduateTable";
import { GraduationDisplay } from "@/components/GraduationDisplay";
import { ProgressTracker } from "@/components/ProgressTracker";
import NextGraduatesTable from "@/components/NextGraduatesTable";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// const summaryData = [
//   { label: "จำนวนนักศึกษาทั้งหมด", value: 3450, unit: "คน" },
//   { label: "จำนวนนักศึกษาที่รับทั้งหมด", value: 1885, unit: "คน" },
//   { label: "จำนวนที่ขาด", value: 1565, unit: "คน" },
//   { label: "ลำดับแรก", value: 5, unit: "" },
//   { label: "ลำดับสุดท้าย", value: 3450, unit: "" },
// ];

// const studentInfo = {
//   order: 5,
//   name: "กิตติศักดิ์ อำนวยการ",
//   faculty: "คณะวิทยาศาสตร์",
// };

// const AnimatedNumber = ({ value }: { value: number }) => (
//   <motion.span
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8 }}>
//     <motion.span transition={{ duration: 1.2, ease: "easeOut" }}>
//       {Math.floor(value)}
//     </motion.span>
//   </motion.span>
// );

const Summary = () => {
  const [isUpdate, setIsUpdate] = useState(Math.random());

  return (
    <>
      {/* GraduationDisplay */}
      <motion.div
        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}>
        <GraduationDisplay onClick={() => setIsUpdate(Math.random())} />
        <div className="mt-6 flex justify-center">
          {/* Button can be added here if needed */}
        </div>
      </motion.div>

      {/* NextGraduatesTable and ProgressTracker */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          <NextGraduatesTable isUpdate={isUpdate} />
        </motion.div>
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}>
          <ProgressTracker isUpdate={isUpdate} />
        </motion.div>
      </div>

      {/* Graduate Table */}
      <motion.div
        className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100 col-span-2">
          <h3 className="text-xl font-bold text-orange-600 border-b pb-2 mb-4">
            ราบชื่อ
          </h3>
          <GraduateTable />
        </div>
      </motion.div>
    </>
  );
};

export default Summary;
