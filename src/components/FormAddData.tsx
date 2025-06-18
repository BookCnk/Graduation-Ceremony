import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resetReceivedCards } from "@/services/graduatesService";

const FormAddData = () => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  /** เรียก API รีเซ็ต แล้วปิด Dialog */
  const handleConfirmReset = async () => {
    try {
      await resetReceivedCards(); // GET /reset-cards
      // 🔄 refresh data here (ถ้ามี)
    } catch (err) {
      console.error("❌ resetReceivedCards error:", err);
    } finally {
      setIsResetDialogOpen(false);
    }
  };

  return (
    <>
      {/* 🔹 Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการรีเซ็ตค่ารับปริญญา</DialogTitle>
            <DialogDescription>
              คุณต้องการรีเซ็ตสถานะ “รับบัตร” ของบัณฑิตทั้งหมดใช่หรือไม่?
              <br />
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(false)}>
              ยกเลิก
            </Button>

            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={handleConfirmReset}>
              ยืนยันรีเซ็ต
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔹 Main Card */}
      <Card className="bg-white shadow-xl border border-orange-100">
        {/* --- Section: Reset Button --- */}
        <CardHeader>
          <CardTitle className="text-orange-600">รีเซ็ตค่ารับปริญญา</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="pt-4">
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => setIsResetDialogOpen(true)} // เปิด Dialog
            >
              รีเซ็ตค่ารับปริญญา
            </Button>
          </div>
        </CardContent>

        {/* --- Section: Faculty Name Input --- */}
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
    </>
  );
};

export default FormAddData;
