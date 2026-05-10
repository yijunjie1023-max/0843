/** 去掉尾部 `/`，统一 `/` 与空串，便于路由判断（避免 `/onboarding/` 与 hook 不一致）。 */
export function normalizePath(p: string): string {
  if (!p) return "";
  const s = p.replace(/\/+$/, "");
  return s === "" ? "/" : s;
}
