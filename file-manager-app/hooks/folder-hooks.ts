import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Folder, ApiResponse, RootFolderType } from "@/types";

export const useFolders = () => {
  return useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<RootFolderType>>("/folders");
      return res.data.data;
    },
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; parentId?: string }) => {
      const res = await api.post<ApiResponse<Folder>>("/folders", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};