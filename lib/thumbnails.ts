const THUMBNAILS_BY_ORDER: Record<number, string> = {
  1: "/thumbnails/lean-intro.png",
  2: "/thumbnails/lean-5s.png",
  3: "/thumbnails/lean-kaizen.png",
  4: "/thumbnails/lean-vsm.png",
  5: "/thumbnails/lean-kpi.png",
};

export function resolveThumbnail(order: number, stored?: string | null) {
  return THUMBNAILS_BY_ORDER[order] ?? stored ?? "/thumbnails/lean-intro.png";
}
