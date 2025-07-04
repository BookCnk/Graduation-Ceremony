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

export const createFaculty = async (payload: any): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/faculty/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  return await res.json();
};

export const deleteFaculty = async (id: number): Promise<any> => {
  const res = await fetch(`${BASE_URL}/faculty/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Delete failed: ${res.status}`);
  }

  return await res.json();
};

export const importGraduates = async (payload: any[]): Promise<any> => {
  const res = await fetch(`${BASE_URL}/import/grad`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Import failed: ${res.status}`);
  }

  return await res.json();
};



