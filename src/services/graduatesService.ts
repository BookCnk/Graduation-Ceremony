const BASE_URL = import.meta.env.VITE_API_URL;

export const getGraduates = async ({
  facultyId,
  page = 1,
  pageSize = 10,
}: {
  facultyId: number;
  page?: number;
  pageSize?: number;
}) => {
  const res = await fetch(`${BASE_URL}/graduates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ facultyId, page, pageSize }),
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};

export const getQuotaGroups = async (): Promise<{
  status: string;
  data: {
    title: string;
    items: {
      id: number;
      name: string;
      value: number;
    }[];
  }[];
}> => {
  const res = await fetch(`${BASE_URL}/quota-groups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};

export const saveQuotaGroups = async (
  payload: {
    title: string;
    items: {
      id: number;
      name: string;
      value: number;
    }[];
  }[]
): Promise<{
  status: string;
  message?: string;
}> => {
  const res = await fetch(`${BASE_URL}/quota-groups/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Save failed: ${res.status}`);
  return await res.json();
};

export const getQuotaSummary = async (): Promise<{
  status: string;
  message?: string;
  data?: {
    title: string;
    items: {
      id: number;
      name: string;
      value: number;
      assigned: number;
      remaining: number;
    }[];
  }[];
}> => {
  const res = await fetch(`${BASE_URL}/quota-summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};
