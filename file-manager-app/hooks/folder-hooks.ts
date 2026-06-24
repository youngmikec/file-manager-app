import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Folder, ApiResponse, RootFolderType } from "@/types";
import { CreateFolderRequest } from "@/validations/folder";
import { useFolderStore } from "@/store/folderStore";

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
    const { addChildToCurrentFolder } = useFolderStore();
    return useMutation({
        mutationFn: async (payload: CreateFolderRequest) => {
        const res = await api.post<ApiResponse<Folder>>("/folders", payload);
        addChildToCurrentFolder(res.data.data);
        return res.data.data;
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["folders"] });
        },
    });
};

export const useSingleFolder = (id: string) => {
    const { setCurrentFolder } = useFolderStore();
    
    return useQuery({
        queryKey: ["folders", id],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Folder>>(`/folders/${id}`);
            setCurrentFolder(res.data.data);
            return res.data.data;
        },
        enabled: !!id,
    });
};
