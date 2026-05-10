/** 用户幻兽档案 · BMI 与准入流程 */

export type BeastId = "leon" | "mercury" | "atlas" | "luna" | "pyro" | "volt";

/** 运动诉求 → SVG 进化状态 */
export type FitnessGoal = "fat_loss" | "muscle_gain" | "body_shape" | "vitality";

/** 性别（本地档案） */
export type ProfileGender = "male" | "female" | "unspecified";

export const PROFILE_GENDER_OPTIONS: readonly ProfileGender[] = ["male", "female", "unspecified"];

export const PROFILE_GENDER_LABELS: Record<ProfileGender, string> = {
  male: "男",
  female: "女",
  unspecified: "保密",
};

export function parseProfileGender(raw: unknown): ProfileGender | undefined {
  if (raw === "male" || raw === "female" || raw === "unspecified") return raw;
  return undefined;
}

export type BeastProfile = {
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
  beastId: BeastId;
  nickname: string;
  onboardingComplete: boolean;
  /** 性别 · 可选 · 默认可在 UI 显示为「保密」 */
  gender?: ProfileGender;
  /** 腰围 cm · 可选 */
  waistCm?: number;
  /** 胸围 cm · 可选 */
  chestCm?: number;
  /** 臂围 cm · 可选 */
  armCm?: number;
  /** 臀围 / 髋围 cm · 三围之一 · 可选 */
  hipCm?: number;
};

export const PROFILE_STORAGE_KEY = "gamefit-beast-profile";

export const BEAST_CATALOG: {
  id: BeastId;
  nameZh: string;
  nameEn: string;
  oneLiner: string;
}[] = [
  {
    id: "leon",
    nameZh: "莱昂",
    nameEn: "Leon",
    oneLiner: "鬃芒环绕 · 稳健之王",
  },
  {
    id: "mercury",
    nameZh: "墨丘利",
    nameEn: "Mercury",
    oneLiner: "流线叠羽 · 迅捷之风",
  },
  {
    id: "atlas",
    nameZh: "阿特拉斯",
    nameEn: "Atlas",
    oneLiner: "岩峦叠嶂 · 负重之力",
  },
  {
    id: "luna",
    nameZh: "露娜",
    nameEn: "Luna",
    oneLiner: "月滴水纹 · 柔韧之尾",
  },
  {
    id: "pyro",
    nameZh: "派罗",
    nameEn: "Pyro",
    oneLiner: "棱角焰脊 · 爆发之心",
  },
  {
    id: "volt",
    nameZh: "晶岚",
    nameEn: "Volt",
    oneLiner: "晶羽幻狐 · 电光之跃",
  },
];

export const ALL_BEAST_IDS: readonly BeastId[] = [
  "leon",
  "mercury",
  "atlas",
  "luna",
  "pyro",
  "volt",
];

export const GOAL_OPTIONS: {
  id: FitnessGoal;
  label: string;
  hint: string;
}[] = [
  { id: "fat_loss", label: "减脂", hint: "修长体态 · 燃脂光晕" },
  { id: "muscle_gain", label: "增肌", hint: "线条加粗 · 膨胀轮廓" },
  { id: "body_shape", label: "塑形", hint: "锐利投影 · 金属偏光" },
  { id: "vitality", label: "增强体质", hint: "免疫粒子 · 活力环绕" },
];

export function computeBmi(heightCm: number, weightKg: number): number {
  const h = heightCm / 100;
  if (h <= 0 || weightKg <= 0) return 22;
  return weightKg / (h * h);
}

/** BMI 22 → scale 1.0；CurrentScale = 1 + (BMI - 22) × 0.05 */
export function computeBmiScaleX(bmi: number): number {
  return 1 + (bmi - 22) * 0.05;
}

export function parseProfile(raw: string | null): BeastProfile | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<BeastProfile>;
    if (
      typeof o.heightCm !== "number" ||
      typeof o.weightKg !== "number" ||
      !o.goal ||
      !o.beastId ||
      typeof o.nickname !== "string" ||
      !o.onboardingComplete
    ) {
      return null;
    }
    if (!ALL_BEAST_IDS.includes(o.beastId as BeastId)) {
      return null;
    }
    const gender = parseProfileGender(o.gender);
    const next: BeastProfile = {
      heightCm: o.heightCm,
      weightKg: o.weightKg,
      goal: o.goal as FitnessGoal,
      beastId: o.beastId as BeastId,
      nickname: o.nickname,
      onboardingComplete: true,
    };
    if (typeof o.waistCm === "number") next.waistCm = o.waistCm;
    if (typeof o.chestCm === "number") next.chestCm = o.chestCm;
    if (typeof o.armCm === "number") next.armCm = o.armCm;
    if (typeof o.hipCm === "number") next.hipCm = o.hipCm;
    if (gender !== undefined) next.gender = gender;
    return next;
  } catch {
    return null;
  }
}
