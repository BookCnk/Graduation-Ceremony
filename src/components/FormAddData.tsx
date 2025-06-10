import { useEffect, useState } from "react";
import { getQuotaGroups, saveQuotaGroups } from "@/services/graduatesService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface QuotaItem {
  faculty_id: number;
  faculty_name: string;
  round_number: number | null;
  quota: number;
}

const FormAddData = () => {
  const [groups, setGroups] = useState<QuotaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res: any = await getQuotaGroups();
        if (res.status === "success" && Array.isArray(res.data)) {
          setGroups(res.data);
        } else {
          alert("ไม่สามารถโหลดข้อมูลรอบบัณฑิตได้");
        }
      } catch (err) {
        console.error("❌ โหลดข้อมูลล้มเหลว:", err);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchQuota();
  }, []);

  const handleQuotaChange = (index: number, newQuota: number) => {
    const updated = [...groups];
    updated[index].quota = newQuota;
    setGroups(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveQuotaGroups(groups);
      if (res.status === "success") {
        alert("✅ บันทึกข้อมูลสำเร็จ");
      } else {
        alert("❌ บันทึกล้มเหลว: " + res.message);
      }
    } catch (err) {
      console.error("❌ บันทึกไม่สำเร็จ:", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <Card className="bg-white shadow-xl border border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-600">ชื่อคณะ</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="กรอกชื่อคณะ..." />
            <div className="pt-4 text-right">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                บันทึก
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="bg-white shadow-xl border border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-600">ปีหลักสูตร</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="กรอกปีหลักสูตร..." />
            <div className="pt-4 text-right">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                บันทึก
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="bg-white shadow-xl border border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-600">ชื่อสาขา</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="กรอกชื่อสาขา..." />
            <div className="pt-4 text-right">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                บันทึก
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="bg-white shadow-xl border border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-600">ระดับปริญญา</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="กรอกระดับปริญญา..." />
            <div className="pt-4 text-right">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                บันทึก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FormAddData;
