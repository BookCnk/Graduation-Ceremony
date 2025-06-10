import { UserCircle, Settings, PackagePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { GraduationDisplay } from "@/components/GraduationDisplay";
import { ProgressTracker } from "@/components/ProgressTracker";
// import { AdminSettings } from "@/components/AdminSettings";
import NextGraduatesTable from "@/components/NextGraduatesTable";
import { GroupedFacultyInput } from "@/components/GroupedFacultyInput";
import FormAddData from "@/components/FormAddData";
// import { setGraduateAsReceived } from "@/services/graduatesService";

interface DashboardMainProps {
  currentGraduate: {
    name: string;
    order: number;
    faculty: string;
  };
  progress: {
    total: number;
    called: number;
    remaining: number;
  };
  handleNextGraduate: () => void;
}

const DashboardMain: React.FC<DashboardMainProps> = (
  {
    // currentGraduate,
    // progress,
    // handleNextGraduate,
  }
) => {
  const [activeTab, setActiveTab] = useState<
    "graduates" | "rounds" | "adddata"
  >("graduates");
  const [isUpdate, setIsupdate] = useState<number>(0);

  useEffect(() => {}, [isUpdate]);

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

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-orange-100 mb-6  ">
        <button
          onClick={() => setActiveTab("graduates")}
          className={`px-4 py-2 flex items-center space-x-2 ${
            activeTab === "graduates"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-600"
          }`}>
          <UserCircle className="w-5 h-5" />
          <span>จัดการรายชื่อบัณฑิต</span>
        </button>

        <button
          onClick={() => setActiveTab("rounds")}
          className={`px-4 py-2 flex items-center space-x-2 ${
            activeTab === "rounds"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-600"
          }`}>
          <Settings className="w-5 h-5" />
          <span>ตั้งค่าจำนวนบัณฑิตและรอบ</span>
        </button>

        <button
          onClick={() => setActiveTab("adddata")}
          className={`px-4 py-2 flex items-center space-x-2 ${
            activeTab === "adddata"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-600"
          }`}>
          <PackagePlus className="w-5 h-5" />
          <span>หน้าเพิ่มข้อมูล</span>
        </button>
      </div>

      {/* ✅ ตรงนี้คือส่วนที่เปลี่ยนตามแท็บ */}
      {activeTab === "graduates" && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
          <GraduationDisplay onClick={() => setIsupdate(Math.random())} />
          <div className="mt-6 flex justify-center">
            {/* <button
              onClick={handleNextGraduate}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
              เรียกบัณฑิตคนถัดไป
            </button> */}
          </div>
        </div>
      )}

      {activeTab === "rounds" && (
        <div>
          <GroupedFacultyInput />;
        </div>
      )}

      {activeTab === "adddata" && (
        <div>
          <FormAddData />;
        </div>
      )}

      {activeTab === "graduates" && (
        <div className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
                <NextGraduatesTable isUpdate={isUpdate} />
              </div>
            </div>
            <div>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
                <ProgressTracker isUpdate={isUpdate} />
              </div>
            </div>
          </div>

          {/* <div className="mt-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
            <AdminSettings />
          </div>
        </div> */}

          {/* <div className="mt-8 flex justify-center">
          <button
            onClick={handleNextGraduate}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
            เรียกบัณฑิตคนถัดไป
          </button>
        </div> */}
        </div>
      )}
    </>
  );
};

export default DashboardMain;
