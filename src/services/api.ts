const BASE_URL = import.meta.env.VITE_API_URL;

export interface LoginPayload {
  name: string;
  password: string;
}

export interface LoginResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    user: {
      id: number;
      name: string;
      created_at: string;
    };
    token: string;
  };
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

export const register = async (
  payload: any
): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

export const getAllUser = async (): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  return await res.json();
};

export const changePassword = async (payload: any): Promise<any> => {
  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.status === "error") {
    throw new Error(json.message || "Something went wrong");
  }

  return json;
};
