import { useSelector } from "react-redux";
import { hexToRgba } from "./hex-to-rgba";
import { selectCampus } from "@/store/campus/selector";

export const BACKGROUND_PRIMARY_COLOR = (intensity: number) => {
  const campus = useSelector(selectCampus);
  return {
    backgroundColor: hexToRgba(campus?.customization.primaryColor, intensity)
  }
}

export const TEXT_PRIMARY_COLOR = (intensity: number) => {
  const campus = useSelector(selectCampus);
  return {
    color: hexToRgba(campus?.customization.primaryColor, intensity)
  }
}