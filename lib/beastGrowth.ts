/** 幻兽每日能量与成长（本地持久化演示） */

export type DailyBonusChoice = "attribute" | "age";

export type BeastGrowthPersist = {
  /** 累计：属性等级 */
  attributeLv: number;
  /** 累计：成长龄等级 */
  ageLv: number;
  /** 上次写入的日历日 YYYY-MM-DD */
  lastDate: string;
  /** 当日是否已使用一键觉醒加成 */
  awakenUsed: boolean;
  /** 当日满能量后是否已选择奖励 */
  bonusClaimed: DailyBonusChoice | null;
  /** 一键觉醒注入的额外能量（当日有效，次日清零） */
  extraEnergy: number;
};

export const GROWTH_STORAGE_KEY = "gamefit-beast-growth";

export function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function defaultGrowth(): BeastGrowthPersist {
  return {
    attributeLv: 1,
    ageLv: 1,
    lastDate: todayDateStr(),
    awakenUsed: false,
    bonusClaimed: null,
    extraEnergy: 0,
  };
}

export function parseGrowth(raw: string | null): BeastGrowthPersist {
  if (!raw) return defaultGrowth();
  try {
    const o = JSON.parse(raw) as Partial<BeastGrowthPersist>;
    const base = defaultGrowth();
    return {
      attributeLv: typeof o.attributeLv === "number" ? o.attributeLv : base.attributeLv,
      ageLv: typeof o.ageLv === "number" ? o.ageLv : base.ageLv,
      lastDate: typeof o.lastDate === "string" ? o.lastDate : base.lastDate,
      awakenUsed: !!o.awakenUsed,
      bonusClaimed:
        o.bonusClaimed === "attribute" || o.bonusClaimed === "age"
          ? o.bonusClaimed
          : null,
      extraEnergy: typeof o.extraEnergy === "number" ? o.extraEnergy : 0,
    };
  } catch {
    return defaultGrowth();
  }
}

/** 跨日时重置当日字段，保留累计等级 */
export function rollGrowthForNewDay(g: BeastGrowthPersist): BeastGrowthPersist {
  const d = todayDateStr();
  if (g.lastDate === d) return g;
  return {
    ...g,
    lastDate: d,
    awakenUsed: false,
    bonusClaimed: null,
    extraEnergy: 0,
  };
}

/**
 * 今日能量：时长进度约 52% 权重 + 今日训练三大块完成度 48% 权重 + 一键觉醒额外值
 * taskCompleted 约定为 [激活达标, 核心任意 2 项打卡达标, 挑战任意 1 项打卡达标]；
 * 激活达标在期末周模式按 1 项计，其它模式按 3 项计（与首页炼金圆环一致）。
 */
export function computeTodayEnergy(params: {
  minutesDone: number;
  minutesTarget: number;
  taskCompleted: boolean[];
  awakenExtra: number;
}): number {
  const { minutesDone, minutesTarget, taskCompleted, awakenExtra } = params;
  const n = taskCompleted.length;
  const doneCount = taskCompleted.filter(Boolean).length;

  const timeRatio =
    minutesTarget > 0 ? Math.min(1, minutesDone / minutesTarget) : 0;
  const timePart = timeRatio * 52;

  const taskRatio = n > 0 ? doneCount / n : 0;
  const taskPart = taskRatio * 48;

  const raw = timePart + taskPart + awakenExtra;
  return Math.min(100, Math.round(raw));
}
