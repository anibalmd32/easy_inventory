import { apiFetch } from "../../../libs/api";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    role: string;
  };
};

export function loginUser(data: LoginInput): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: data,
  });
}
