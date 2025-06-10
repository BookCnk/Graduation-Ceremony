import { useState, useEffect } from "react";
import { getRoundCallSummary } from "@/services/graduatesService";

export function AdminSettings() {
  const [settings, setSettings] = useState({
    ceremonyYear: "2024",
    startOrder: "1",
    endOrder: "100",
  });

  const [summary, setSummary] = useState<null | {
    current_round: number;
    total_in_round: number;
    already_called: number;
    remaining: number;
    latest_called_sequence: number | null;
    total_all_rounds: number;
  }>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res: any = await getRoundCallSummary();
        if (res.status === "success") {
          setSummary(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      }
    }
    fetchSummary();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Settings saved:", settings);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>

      {/* 🔹 แสดงข้อมูลรอบล่าสุด */}
      {summary && (
        <div className="mb-6 bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
          <p className="text-sm font-medium mb-1">🎓 Current Round Summary:</p>
          <ul className="text-sm pl-4 list-disc">
            <li>Current Round: {summary.current_round}</li>
            <li>Total in Round: {summary.total_in_round}</li>
            <li>Already Called: {summary.already_called}</li>
            <li>Remaining: {summary.remaining}</li>
            <li>
              Latest Called Sequence: {summary.latest_called_sequence ?? "N/A"}
            </li>
            <li>Total All Rounds: {summary.total_all_rounds}</li>
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="ceremonyYear"
            className="block text-sm font-medium mb-1">
            Ceremony Year
          </label>
          <input
            type="text"
            id="ceremonyYear"
            value={settings.ceremonyYear}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, ceremonyYear: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startOrder"
              className="block text-sm font-medium mb-1">
              Start Order
            </label>
            <input
              type="number"
              id="startOrder"
              value={settings.startOrder}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, startOrder: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
          <div>
            <label
              htmlFor="endOrder"
              className="block text-sm font-medium mb-1">
              End Order
            </label>
            <input
              type="number"
              id="endOrder"
              value={settings.endOrder}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, endOrder: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium">
          Save Settings
        </button>
      </form>
    </>
  );
}
