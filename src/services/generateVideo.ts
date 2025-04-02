import { GetVideoByIdRes, Text2VideoReq, Text2VideoRes } from "@/types/types";
import { request } from "@/utils/request";
import { useQuery, useMutation } from "@tanstack/react-query";

export const text2Video = async (req: Text2VideoReq): Promise<Text2VideoRes> => {
    const response = await request.post('/api/ai/agent/text2Video', req);
    return response.data;
}

export const useText2Video = () => {
    return useMutation({
        mutationFn: text2Video,
        onError: (error) => {
            console.error('Video generation failed:', error);
        }
    });
}

export const getVideoById = async (id: string): Promise<GetVideoByIdRes> => {
    const response = await request.get(`/api/ai/agent/text2Video/${id}`);
    return response.data;
}

export const useGetVideoById = (id: string | null, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["getVideoById", id],
        queryFn: () => getVideoById(id!),
        staleTime: 0,
        gcTime: 0,
        refetchInterval: enabled ? 2000 : false,
        enabled: !!id && enabled,
    });
}
