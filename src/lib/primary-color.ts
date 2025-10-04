import { useSelector } from "react-redux";
import { selectCampus } from "@/store/campus/selector";
import { hexToRgba } from "./hex-to-rgba";

export const usePrimaryColor = () => {
  const campus = useSelector(selectCampus);

  const defaultColor = "#ef4444";
  const primaryColor = campus?.customization?.primaryColor || defaultColor;

  const BACKGROUND_PRIMARY_COLOR = (intensity = 1) => ({
    backgroundColor: hexToRgba(primaryColor, intensity),
  });

  const TEXT_PRIMARY_COLOR = (intensity = 1) => ({
    color: hexToRgba(primaryColor, intensity),
  });

  return { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR };
};