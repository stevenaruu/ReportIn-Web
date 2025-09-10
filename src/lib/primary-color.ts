import { hexToRgba } from "./hex-to-rgba";
import { getSubdomainResponseExample } from "@/examples/campuses";

export const BACKGROUND_PRIMARY_COLOR = (intensity: number) => {
  const primaryColor = getSubdomainResponseExample.data.customization.primaryColor;

  return {
    backgroundColor: hexToRgba(primaryColor, intensity)
  }
}

export const TEXT_PRIMARY_COLOR = (intensity: number) => {
  const primaryColor = getSubdomainResponseExample.data.customization.primaryColor;

  return {
    color: hexToRgba(primaryColor, intensity)
  }
}