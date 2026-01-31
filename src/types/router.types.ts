import type { Role } from "@/types/vo.types";
export interface Router {
  key: string;
  label: string;
  href: string;
  showInMenu?: boolean;
  requiresRole: Role[];
  children?: Router[];
}
