import { useEffect, useState } from "react";
import { getRoundCallSummary } from "@/services/graduatesService";

interface SummaryData {
  current_round: number;
  total_in_round: number;
  already_called: number;
  remaining: number;
  latest_called_sequence: number | null;
  total_all_rounds: number;
}
interface Props {
  isUpdate: number;
}

export function ProgressTracker({ isUpdate }: Props) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getRoundCallSummary();
        if (res.status === "success" && res.data) {
          setSummary({
            current_round: res.data.current_round,
            total_in_round: Number(res.data.total_in_round),
            already_called: Number(res.data.already_called),
            remaining: Number(res.data.remaining),
            latest_called_sequence: res.data.latest_called_sequence,
            total_all_rounds: Number(res.data.total_all_rounds),
          });
        }
      } catch (err) {
        console.error("❌ Failed to fetch round summary:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isUpdate]);

  if (loading)
    return <p className="text-sm text-muted-foreground">Loading progress...</p>;
  if (!summary)
    return <p className="text-sm text-red-500">No data available.</p>;

  const percentage = summary.total_in_round
    ? Math.round((summary.already_called / summary.total_in_round) * 100)
    : 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ceremony Progress</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Round {summary.current_round} Progress
            </span>
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{summary.total_in_round}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{summary.already_called}</p>
            <p className="text-sm text-muted-foreground">Called</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{summary.remaining}</p>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}
