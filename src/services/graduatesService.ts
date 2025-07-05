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

export const getRemainingNotReceived = async (): Promise<{
  status: string;
  message?: string;
  data?: {
    round_number: number;
    remaining_not_received: number;
  } | null;
}> => {
  const res = await fetch(`${BASE_URL}/remaining-not-received`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};

export const getFirstGraduateNotReceived = async (): Promise<any> => {
  const res = await fetch(`${BASE_URL}/first-not-received`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};

export const getRoundCallSummary = async (): Promise<{
  status: string;
  message?: string;
  data?: {
    current_round: number;
    total_in_round: number;
    already_called: number;
    remaining: number;
    latest_called_sequence: number | null;
    total_all_rounds: number;
  } | null;
}> => {
  const res = await fetch(`${BASE_URL}/round-call-summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};

export const getNextGraduates = async (): Promise<{
  status: string;
  message?: string;
  data?: {
    id: number;
    prefix: string;
    first_name: string;
    last_name: string;
    sequence: number;
    faculty_id: number;
    faculty_name: string;
    round_number: number;
  }[];
}> => {
  const res = await fetch(`${BASE_URL}/next-graduates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};

export const setGraduateAsReceived = async (id: number) => {
  const res = await fetch(`${BASE_URL}/set-received`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error("Failed to update graduate status");
  return await res.json();
};

export const resetReceivedCards = async (): Promise<{
  status: string;
  message?: string;
  data?: { success: boolean };
}> => {
  const res = await fetch(`${BASE_URL}/reset-cards`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};

export const getGraduateSummary = async (): Promise<any> => {
  const res = await fetch(`${BASE_URL}/graduate/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};

export const CurrentRoundOverview = async (): Promise<any> => {
  const res = await fetch(`${BASE_URL}/graduate/overview`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.json();
};
