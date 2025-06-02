const BASE_URL = import.meta.env.VITE_API_URL;

export const getDropdowns = async (type: string): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/faculty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  return await res.json();
};
