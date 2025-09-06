export function hexToRgba(hex: string, intensity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // blend ke putih
  const newR = Math.round(r * intensity + 255 * (1 - intensity));
  const newG = Math.round(g * intensity + 255 * (1 - intensity));
  const newB = Math.round(b * intensity + 255 * (1 - intensity));

  return `rgba(${newR}, ${newG}, ${newB}, 1)`;
}