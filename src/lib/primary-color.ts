import { useSelector } from "react-redux";
import { selectCampus } from "@/store/campus/selector";
import { hexToRgba } from "./hex-to-rgba";

export const usePrimaryColor = () => {
  const campus = useSelector(selectCampus);

  const BACKGROUND_PRIMARY_COLOR = (intensity = 1) => ({
    backgroundColor: hexToRgba(campus?.customization.primaryColor, intensity),
  });

  const TEXT_PRIMARY_COLOR = (intensity = 1) => ({
    color: hexToRgba(campus?.customization.primaryColor, intensity),
  });

  return { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR };
};
