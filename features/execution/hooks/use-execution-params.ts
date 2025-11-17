import { useQueryStates } from "nuqs";
import { executionsParams } from "../components/params";

export const useExecutionsParams = () => {
  return useQueryStates(executionsParams);
};
