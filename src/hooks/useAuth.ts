import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  return { user };
};
