import { useState } from "react";

export function AdminSettings() {
  const [settings, setSettings] = useState({
    ceremonyYear: "2024",
    startOrder: "1",
    endOrder: "100",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the settings to the backend
    console.log("Settings saved:", settings);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
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
