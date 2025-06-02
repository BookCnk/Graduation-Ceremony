import { motion } from "framer-motion";
// import { Bar, Doughnut } from "react-chartjs-2";
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
// Register chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const summaryData = [
  { label: "จำนวนนักศึกษาทั้งหมด", value: 3450, unit: "คน" },
  { label: "จำนวนนักศึกษาที่รับทั้งหมด", value: 1885, unit: "คน" },
  { label: "จำนวนที่ขาด", value: 1565, unit: "คน" },
  { label: "ลำดับแรก", value: 5, unit: "" },
  { label: "ลำดับสุดท้าย", value: 3450, unit: "" },
];

const studentInfo = {
  order: 5,
  name: "กิตติศักดิ์ อำนวยการ",
  faculty: "คณะวิทยาศาสตร์",
};
import { GroupedFacultyInput } from "@/components/GroupedFacultyInput";

const pageData = [
  {
    title: "รอบที่ 1",
    items: [
      { id: 1, name: "คณะวิศวกรรมศาสตร์", value: 30 },
      { id: 2, name: "คณะวิทยาศาสตร์", value: 60 },
    ],
  },
  {
    title: "คณะที่ยังไม่ได้จัดรอบ",
    items: [
      { id: 3, name: "คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี", value: 0 },
      { id: 4, name: "คณะเทคโนโลยีสารสนเทศ", value: 0 },
    ],
  },
];

// Count-up animation component
const AnimatedNumber = ({ value }: { value: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}>
      <motion.span
        initial={{ count: 0 }}
        animate={{ count: value }}
        transition={{ duration: 1.2, ease: "easeOut" }}>
        {Math.floor(value)}
      </motion.span>
    </motion.span>
  );
};

const Summary = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
        {/* Card: ผู้จะรับเริ่มต้น */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}>
          <h3 className="text-xl font-bold text-orange-600 border-b pb-2 mb-4">
            ผู้ที่จะรับเริ่มต้น
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm text-gray-700">
            <div>
              <dt className="font-medium">ลำดับ</dt>
              <dd>
                <AnimatedNumber value={studentInfo.order} />
              </dd>
            </div>
            <div>
              <dt className="font-medium">ชื่อ</dt>
              <dd>{studentInfo.name}</dd>
            </div>
            <div>
              <dt className="font-medium">คณะ</dt>
              <dd>{studentInfo.faculty}</dd>
            </div>
          </dl>
        </motion.div>

        {/* Card: ภาพรวมข้อมูล */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}>
          <h3 className="text-xl font-bold text-orange-600 border-b pb-2 mb-4">
            ภาพรวมข้อมูล
          </h3>
          <dl className="divide-y divide-gray-200 text-sm text-gray-700">
            {summaryData.map((item, idx) => (
              <motion.div
                key={item.label}
                className="flex justify-between py-3 items-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}>
                <dt>{item.label}</dt>
                <dd className="font-semibold text-right text-orange-700 text-lg">
                  <AnimatedNumber value={item.value} />
                  <span className="ml-1">{item.unit}</span>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}>
          <h3 className="text-xl font-bold text-orange-600 border-b pb-2 mb-4">
            ราบชื่อ
          </h3>
          <GraduateTable></GraduateTable>
          <GroupedFacultyInput grouped={pageData} />;
        </motion.div>
      </div>
    </>
  );
};

export default Summary;
