import { selectAuthAccessToken } from "@/entities/auth/model";
import { useAppSelector } from "@/shared/hooks/app/useAppSelector";

export const useAccessToken = () => useAppSelector(selectAuthAccessToken);
