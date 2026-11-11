import { selectAuthUser } from "@/entities/auth/model";
import { useAppSelector } from "@/shared/hooks/app/useAppSelector";

export const useUser = () => useAppSelector(selectAuthUser);
