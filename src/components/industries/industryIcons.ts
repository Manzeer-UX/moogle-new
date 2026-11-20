import type { IconType } from "react-icons";
import {
  LuBuilding2,
  LuFactory,
  LuGraduationCap,
  LuHardHat,
  LuHeartPulse,
  LuLandmark,
  LuTruck,
  LuUmbrella,
  LuWallet,
} from "react-icons/lu";

export const INDUSTRY_ICONS: Record<string, IconType> = {
  healthcare: LuHeartPulse,
  logistics: LuTruck,
  fintech: LuWallet,
  edtech: LuGraduationCap,
  "real-estate": LuBuilding2,
  manufacturing: LuFactory,
  insurance: LuUmbrella,
  construction: LuHardHat,
  government: LuLandmark,
};

/** 1 → "01" */
export const pad2 = (value: number) => String(value).padStart(2, "0");
