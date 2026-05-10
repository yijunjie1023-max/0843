/** 段位阶梯（演示）：对标 MOBA 式分级，含珍珠段 */

const LADDER: string[] = [
  "见习Ⅲ",
  "见习Ⅱ",
  "见习Ⅰ",
  "青铜Ⅲ",
  "青铜Ⅱ",
  "青铜Ⅰ",
  "白银Ⅲ",
  "白银Ⅱ",
  "白银Ⅰ",
  "黄金Ⅳ",
  "黄金Ⅲ",
  "黄金Ⅱ",
  "黄金Ⅰ",
  "铂金Ⅳ",
  "铂金Ⅲ",
  "铂金Ⅱ",
  "珍珠Ⅲ",
  "珍珠Ⅱ",
  "珍珠Ⅰ",
  "翡翠Ⅴ",
  "翡翠Ⅳ",
  "翡翠Ⅲ",
  "星耀Ⅴ",
  "星耀Ⅳ",
  "王者入门",
];

/** 竞技场十阶宝石：实心渐变 + 主色（展示 / 描边用） */
export const GEM_TIER_DEFINITIONS = [
  {
    level: 1,
    nameZh: "废铁",
    nameEn: "Iron",
    main: "#A19AD3",
    gradientFrom: "#727272",
    gradientTo: "#BDBDBD",
  },
  {
    level: 2,
    nameZh: "青铜",
    nameEn: "Bronze",
    main: "#CD7F32",
    gradientFrom: "#A0522D",
    gradientTo: "#E9967A",
  },
  {
    level: 3,
    nameZh: "白银",
    nameEn: "Silver",
    main: "#C0C0C0",
    gradientFrom: "#757F9A",
    gradientTo: "#D7DDE8",
  },
  {
    level: 4,
    nameZh: "黄金",
    nameEn: "Gold",
    main: "#FFD700",
    gradientFrom: "#F1C40F",
    gradientTo: "#F39C12",
  },
  {
    level: 5,
    nameZh: "翡翠",
    nameEn: "Jade",
    main: "#2ECC71",
    gradientFrom: "#00B09B",
    gradientTo: "#96C93D",
  },
  {
    level: 6,
    nameZh: "蓝宝石",
    nameEn: "Sapphire",
    main: "#1CB0F6",
    gradientFrom: "#2193B0",
    gradientTo: "#6DD5ED",
  },
  {
    level: 7,
    nameZh: "紫晶",
    nameEn: "Amethyst",
    main: "#9B59B6",
    gradientFrom: "#8E44AD",
    gradientTo: "#DA44BB",
  },
  {
    level: 8,
    nameZh: "红宝石",
    nameEn: "Ruby",
    main: "#FF4B4B",
    gradientFrom: "#F12711",
    gradientTo: "#F5AF19",
  },
  {
    level: 9,
    nameZh: "黑曜石",
    nameEn: "Obsidian",
    main: "#434343",
    gradientFrom: "#0F2027",
    gradientTo: "#2C5364",
  },
  {
    level: 10,
    nameZh: "珍珠",
    nameEn: "Pearl",
    main: "#F0F2F0",
    gradientFrom: "#E0EAFC",
    gradientTo: "#CFDEF3",
  },
] as const;

export type GemTierDefinition = (typeof GEM_TIER_DEFINITIONS)[number];

export const GEM_TIER_COUNT = GEM_TIER_DEFINITIONS.length;

/** 宝石几何：边数 = Level + 3（1→四边 … 10→十三边） */
export function gemSidesForLevel(level: number): number {
  const lv = Math.max(1, Math.min(GEM_TIER_COUNT, Math.round(level)));
  return lv + 3;
}

/** 正多边形顶点（用于挤出侧壁等 3D 绘制） */
export function gemPolygonVertices(
  cx: number,
  cy: number,
  r: number,
  level: number,
  rotationDeg = -90,
): { x: number; y: number }[] {
  const sides = gemSidesForLevel(level);
  const verts: { x: number; y: number }[] = [];
  for (let i = 0; i < sides; i++) {
    const angleDeg = rotationDeg + (360 / sides) * i;
    const rad = (angleDeg * Math.PI) / 180;
    verts.push({ x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) });
  }
  return verts;
}

/** 正多边形顶点字符串（SVG points）；rotationDeg 默认尖角朝上 */
export function gemPolygonPoints(
  cx: number,
  cy: number,
  r: number,
  level: number,
  rotationDeg = -90,
): string {
  return gemPolygonVertices(cx, cy, r, level, rotationDeg)
    .map((v) => `${v.x},${v.y}`)
    .join(" ");
}

/** 细粒度 tierGrade → 宝石阶位索引 0–9（25 档均分 10 阶） */
export function gemTierSlotFromGrade(grade: number): number {
  const g = Math.max(0, Math.min(LADDER.length - 1, Math.floor(grade)));
  return Math.min(GEM_TIER_COUNT - 1, Math.floor(g / 2.5));
}

export function gemTierDefinitionFromGrade(grade: number): GemTierDefinition {
  const slot = gemTierSlotFromGrade(grade);
  return GEM_TIER_DEFINITIONS[slot] ?? GEM_TIER_DEFINITIONS[0];
}

/** 榜单 / 好友行展示：中文 · 英文 */
export function gemTierLabelFromGrade(grade: number): string {
  const d = gemTierDefinitionFromGrade(grade);
  return `${d.nameZh} ${d.nameEn}`;
}

export function tierLabelFromGrade(grade: number): string {
  const g = Math.max(0, Math.min(LADDER.length - 1, Math.floor(grade)));
  return LADDER[g] ?? LADDER[0];
}

export function nextTierLabelFromGrade(grade: number): string {
  return tierLabelFromGrade(grade + 1);
}

/** 下一结算点：下周一 00:00（本地时间） */
export function nextMondayMidnightMs(now = Date.now()): number {
  const d = new Date(now);
  const day = d.getDay();
  const daysUntilMon = day === 0 ? 1 : 8 - day;
  const t = new Date(d);
  t.setDate(d.getDate() + daysUntilMon);
  t.setHours(0, 0, 0, 0);
  return t.getTime();
}

export function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return "即将刷新";
  const s = Math.floor(msRemaining / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}天 ${h}小时`;
  if (h > 0) return `${h}小时 ${m}分`;
  return `${m}分`;
}

/** Duolingo 风格主标题：取段位前缀 +「等级」 */
export function leagueMajorTitle(tierStepLabel: string): string {
  const m = tierStepLabel.match(/^([\u4e00-\u9fff]+)/);
  const major = m?.[1] ?? tierStepLabel;
  return `${major}等级`;
}

/** 榜单剩余时间（优先显示「X 小时」） */
export function formatLeagueHoursRemaining(msRemaining: number): string {
  if (msRemaining <= 0) return "即将结算";
  const totalH = msRemaining / 3600000;
  if (totalH >= 48) return `${Math.floor(totalH / 24)} 天`;
  if (totalH >= 1) return `${Math.max(1, Math.floor(totalH))} 小时`;
  const m = Math.ceil(msRemaining / 60000);
  return `${Math.max(1, m)} 分钟`;
}
