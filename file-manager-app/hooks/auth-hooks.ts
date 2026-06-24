import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type { AuthFormData } from "@/validations/auth";
import type { AuthResponse } from "@/types/auth";
import toast from "react-hot-toast";

export const useRegisterUser = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: AuthFormData) => {
      const response = await api.post<AuthResponse>("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.data.accessToken);
      toast.success(data.message || "Registration successful");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Registration failed. Try again."
      );
    },
  });
};

export const useLoginUser = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: AuthFormData) => {
      const response = await api.post<AuthResponse>("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.data.accessToken);
      toast.success(data.message || "Login successful");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Login failed. Try again."
      );
    },
  });
};