/** 三种场景模式：文案 + 模拟数据 + 功能开关（前端测评用） */

import type { DietMealSlot, MacroGoals } from "./dietDay";
import {
  FINALS_MEAL_SLOTS,
  HOLIDAY_MEAL_SLOTS,
  NORMAL_MEAL_SLOTS,
  assertSlotOrder,
} from "./dietSeed";
import type { BeastId, FitnessGoal } from "./beastProfile";
import { gemTierLabelFromGrade } from "./arenaTiers";

export type FitMode = "normal" | "finals" | "holiday";

export const STORAGE_KEY = "gamefit-fit-mode";

export function parseFitMode(raw: string | null): FitMode {
  if (raw === "finals" || raw === "holiday" || raw === "normal") return raw;
  return "normal";
}

export type WorkoutItem = {
  id: string;
  title: string;
  durationMin: number;
  xp: number;
  done: boolean;
  tag: "有氧" | "力量" | "恢复";
};

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

export type AchievementItem = {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  icon: string;
};

export type ExerciseRadarStats = {
  duration: number;
  burn: number;
  consistency: number;
  strength: number;
  recovery: number;
};

/** 竞技场头像用幻兽快照（演示：好友由昵称哈希映射） */
export type ArenaBeastSnapshot = {
  beastId: BeastId;
  goal: FitnessGoal;
  bmi: number;
};

export type BoundFriend = {
  id: string;
  name: string;
  bondLevel: number;
  todaySynced: boolean;
  tierGrade: number;
  beast: ArenaBeastSnapshot;
  radar: ExerciseRadarStats;
};

export type ArenaRow = {
  rank: number;
  name: string;
  xpWeek: number;
  relation: string;
  isSelf?: boolean;
  tierGrade: number;
  /** 展示用宝石段位「中文 英文」 */
  tierLabel: string;
  beast: ArenaBeastSnapshot;
  radar: ExerciseRadarStats;
  /** 期末周 · 本周微运动坚持次数 */
  microSessionsWeek?: number;
  /** 假期 · 离校天数 */
  daysAway?: number;
  /** 假期 · 自律率 % */
  disciplinePct?: number;
};

/** 当前用户竞技场段位摘要（炼金币 / XP 可与 profile 对齐） */
export type ArenaSelfState = {
  tierGrade: number;
  starsCurrent: number;
  starsNeeded: number;
  gems: number;
  xp: number;
};

export type DietToday = {
  /** 六餐次时间轴（早餐～宵夜） */
  mealSlots: DietMealSlot[];
  waterMl: number;
  waterTargetMl: number;
  /** 每日热量预算（千卡）：剩余 = 预算 − 摄入 + 运动消耗 */
  calorieBudgetTarget: number;
  /** 宏量目标（克）；当日摄入由菜品汇总 */
  macroGoals: MacroGoals;
};

export type FitModeBundle = {
  id: FitMode;
  label: string;
  shortLabel: string;
  /** 顶栏副标题 */
  shellTagline: string;
  features: {
    /** 是否展示完整竞技/排行叙事（期末周弱化攀比） */
    emphasizeLeaderboardPressure: boolean;
    /** 假期专属：契约挑战卡片 */
    showHolidayContract: boolean;
    /** 期末周专属：呼吸减压入口卡片 */
    showFinalsMicroBreak: boolean;
    /** 运动页「详情」等次要入口是否弱化文案 */
    softExerciseSecondaryCtas: boolean;
  };
  home: {
    eyebrow: string;
    beastTitle: string;
    beastFlavor: string;
    beastEmoji: string;
    goalTitle: string;
    goalFooter: string;
    quickTitle: string;
    xpTitle: string;
    xpFooterHint: string;
    xpCta: string;
    heartsLabel: string;
  };
  exercise: {
    eyebrow: string;
    title: string;
    subtitle: string;
    recommendTitle: string;
    bondTitle: string;
    bondBody: string;
  };
  diet: {
    eyebrow: string;
    title: string;
    subtitle: string;
    mealsTitle: string;
    waterTitle: string;
    tipsTitle: string;
    tipsBody: string;
  };
  arena: {
    eyebrow: string;
    title: string;
    subtitle: string;
    leaderboardTitle: string;
    scoreLabel: string;
    leaderboardRulesHint: string;
    pkSectionTitle: string;
    bindTitle: string;
    bindBody: string;
    friendsTitle: string;
  };
  profile: {
    contractCardTitle: string;
    contractCardBody: string;
    achievementsTitle: string;
    settingsTitle: string;
    settingsRows: string[];
    syncLabel: string;
    campusHint: string;
  };
  data: {
    todayGoal: {
      minutesDone: number;
      minutesTarget: number;
      calories: number;
      /** Move 环目标（千卡） */
      caloriesTarget: number;
      steps: number;
      /** 站立小时（炼金外环 · 站立） */
      standHoursDone: number;
      standHoursTarget: number;
    };
    beast: {
      evolutionPercent: number;
    };
    quickActions: QuickAction[];
    workouts: WorkoutItem[];
    dietToday: DietToday;
    arenaSelf: ArenaSelfState;
    arenaLeaderboard: ArenaRow[];
    boundFriends: BoundFriend[];
    achievements: AchievementItem[];
  };
};

function arenaHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function radarFromName(name: string): ExerciseRadarStats {
  const h = arenaHash(name);
  const v = (base: number, spread: number) =>
    Math.min(98, Math.max(22, base + (h % spread) - Math.floor(spread / 2)));
  return {
    duration: v(72, 44),
    burn: v(68, 48),
    consistency: v(74, 40),
    strength: v(58, 52),
    recovery: v(62, 46),
  };
}

const ARENA_FILLER = [
  "自律的阿杰",
  "骑行社团-小林",
  "图书馆战神",
  "瑜伽课代表",
  "跳绳小鹿",
  "夜跑阿伟",
  "操场西风",
  "宿舍卷王",
  "楼梯间刺客",
  "晨型人立夏",
  "碎片动动酱",
  "蛋白质学姐",
  "拉伸教主",
  "间歇狂人",
  "骑行学长",
  "羽毛球场阿豪",
  "游泳圈拜拜",
  "体态修复师",
  "早睡同盟",
  "社团体能担当",
];

const ARENA_BEAST_IDS: BeastId[] = ["leon", "mercury", "atlas", "luna", "pyro", "volt"];
const ARENA_GOALS: FitnessGoal[] = ["fat_loss", "muscle_gain", "body_shape", "vitality"];

export function arenaBeastSnapshotForName(name: string): ArenaBeastSnapshot {
  const h = arenaHash(name);
  return {
    beastId: ARENA_BEAST_IDS[h % ARENA_BEAST_IDS.length],
    goal: ARENA_GOALS[h % ARENA_GOALS.length],
    bmi: Math.round((20.5 + (h % 50) / 10) * 10) / 10,
  };
}

function buildArenaLeaderboard(
  mode: FitMode,
  selfName: string,
  selfPrimaryScore: number,
): ArenaRow[] {
  type Draft = Omit<ArenaRow, "rank">;
  const drafts: Draft[] = [];

  if (mode === "finals") {
    for (let i = 0; i < 20; i++) {
      const isSelf = i === 7;
      const name = isSelf ? selfName : ARENA_FILLER[i % ARENA_FILLER.length];
      const micro = isSelf
        ? Math.max(2, Math.round(selfPrimaryScore))
        : Math.max(3, 21 - Math.floor(i * 0.85) + (i % 5));
      const tier = Math.max(4, 17 - Math.floor(i * 0.62));
      drafts.push({
        name,
        xpWeek: micro,
        relation: isSelf ? "本人" : ["搭子", "室友", "同桌", "社团"][i % 4],
        isSelf,
        tierGrade: tier,
        tierLabel: gemTierLabelFromGrade(tier),
        beast: arenaBeastSnapshotForName(name),
        radar: radarFromName(name),
        microSessionsWeek: micro,
      });
    }
  } else if (mode === "holiday") {
    for (let i = 0; i < 20; i++) {
      const isSelf = i === 6;
      const name = isSelf ? selfName : ARENA_FILLER[(i + 2) % ARENA_FILLER.length];
      const xp = isSelf ? selfPrimaryScore : 980 - i * 38 + ((i * 11) % 31);
      const tier = Math.max(5, 19 - Math.floor(i * 0.68));
      const daysAway = 8 + ((i * 13) % 40);
      const disciplinePct = Math.min(98, 44 + ((i * 19) % 48));
      drafts.push({
        name,
        xpWeek: xp,
        relation: isSelf ? "本人" : ["强监督", "小队", "亲属绑定", "异地"][i % 4],
        isSelf,
        tierGrade: tier,
        tierLabel: gemTierLabelFromGrade(tier),
        beast: arenaBeastSnapshotForName(name),
        radar: radarFromName(name),
        daysAway,
        disciplinePct,
      });
    }
  } else {
    for (let i = 0; i < 20; i++) {
      const isSelf = i === 7;
      const name = isSelf ? selfName : ARENA_FILLER[i % ARENA_FILLER.length];
      const xp = isSelf ? selfPrimaryScore : 1020 - i * 36 + ((i * 17) % 33);
      const tier = Math.max(6, 20 - Math.floor(i * 0.7));
      drafts.push({
        name,
        xpWeek: xp,
        relation: isSelf ? "本人" : ["室友绑定", "社团", "随机匹配", "课程好友"][i % 4],
        isSelf,
        tierGrade: tier,
        tierLabel: gemTierLabelFromGrade(tier),
        beast: arenaBeastSnapshotForName(name),
        radar: radarFromName(name),
      });
    }
  }

  drafts.sort((a, b) => b.xpWeek - a.xpWeek);
  return drafts.map((d, idx) => ({ ...d, rank: idx + 1 }));
}

const normalBundle: FitModeBundle = {
  id: "normal",
  label: "正常模式",
  shortLabel: "日常",
  shellTagline: "学期日常 · 全功能开放 · 稳定养成运动习惯",
  features: {
    emphasizeLeaderboardPressure: true,
    showHolidayContract: false,
    showFinalsMicroBreak: false,
    softExerciseSecondaryCtas: false,
  },
  home: {
    eyebrow: "今日进度 · 正常模式",
    beastTitle: "幻兽进化 · 运动转化为成长",
    beastFlavor:
      "今日运动会在明日进化条上留下脚印——坚持打卡，幻兽与你同步升级！",
    beastEmoji: "🐾",
    goalTitle: "今日运动目标",
    goalFooter: "今日完成度 {pct}% · 再练一会儿即可解锁额外 XP 宝箱",
    quickTitle: "快捷入口",
    xpTitle: "经验与升级",
    xpFooterHint: "课堂间隙也能攒 XP——把碎片时间留给身体和幻兽！",
    xpCta: "去赚 XP",
    heartsLabel: "今日毅力",
  },
  exercise: {
    eyebrow: "运动 · 正常模式",
    title: "训练计划",
    subtitle:
      "完成训练为幻兽注入进化能量 · 今日已运动 {minutes} 分钟 · 校园场景推荐",
    recommendTitle: "今日推荐 · 校园场景",
    bondTitle: "幻兽羁绊加成（模拟）",
    bondBody:
      "与室友/社团好友绑定后，同日双双打卡可触发「羁绊 XP +15%」。入口在竞技场。",
  },
  diet: {
    eyebrow: "饮食 · 正常模式",
    title: "能量餐谱",
    subtitle:
      "营养管理：六餐次时间轴、菜品份量编辑与热量预算联动（成就与营养加成仍为演示）。",
    mealsTitle: "今日进食 · 六餐次时间轴",
    waterTitle: "饮水目标",
    tipsTitle: "小贴士",
    tipsBody:
      "食堂自选优先蔬菜与优质蛋白；夜宵频率会触发「室友提醒」推送（模拟）。坚持记录 7 天可在「我的」领取限定徽章。",
  },
  arena: {
    eyebrow: "竞技场 · 正常模式",
    title: "竞技场 · 个人排行",
    subtitle:
      "弱社交设计：聚焦个人段位与榜单比拼，仅查看好友运动雷达；无私信、低互动压力。数据均为前端模拟。",
    leaderboardTitle: "个人竞技周榜",
    scoreLabel: "周动能",
    leaderboardRulesHint:
      "初始榜单含系统抓取的 20 名用户；你可手动添加好友入榜（段位相差超过 4 级不可添加）。每周一 0:00 段位随榜刷新：前 30% 升段、后 30% 降段、中部 40% 保级。",
    pkSectionTitle: "好友单日 PK",
    bindTitle: "绑定好友 · 入榜资格（演示）",
    bindBody:
      "生成邀请或扫码绑定后，好友可出现在 PK 池与手动加榜候选。不包含聊天功能，降低社交负担。",
    friendsTitle: "好友动态 · 点头像看雷达",
  },
  profile: {
    contractCardTitle: "",
    contractCardBody: "",
    achievementsTitle: "成就墙",
    settingsTitle: "设置与数据（入口）",
    settingsRows: [
      "提醒时间 · 早八前温和叫醒",
      "数据导出 · 学期体育报告",
      "隐私 · 仅好友可见排行榜",
      "关于 · 游戏化运动激励工具",
    ],
    syncLabel: "同步校园跑（模拟）",
    campusHint: "上课场景 · 场地资源以校园为主",
  },
  data: {
    todayGoal: {
      minutesDone: 22,
      minutesTarget: 45,
      calories: 180,
      caloriesTarget: 420,
      steps: 6420,
      standHoursDone: 5,
      standHoursTarget: 12,
    },
    beast: { evolutionPercent: 62 },
    quickActions: [
      { id: "run", label: "跑步打卡", icon: "🏃", href: "/exercise?tab=run" },
      { id: "gym", label: "力量训练", icon: "🏋️", href: "/exercise?tab=gym" },
      { id: "meal", label: "记录饮食", icon: "🥗", href: "/diet" },
      { id: "arena", label: "好友对战", icon: "⚔️", href: "/arena" },
    ],
    workouts: [
      {
        id: "w1",
        title: "校园跑 3km",
        durationMin: 24,
        xp: 35,
        done: true,
        tag: "有氧",
      },
      {
        id: "w2",
        title: "宿舍徒手 · 核心",
        durationMin: 15,
        xp: 22,
        done: false,
        tag: "力量",
      },
      {
        id: "w3",
        title: "拉伸放松",
        durationMin: 10,
        xp: 12,
        done: false,
        tag: "恢复",
      },
    ],
    dietToday: {
      mealSlots: assertSlotOrder(NORMAL_MEAL_SLOTS),
      waterMl: 1100,
      waterTargetMl: 2000,
      calorieBudgetTarget: 1796,
      macroGoals: { fat: 59, carbs: 178, protein: 133, fiber: 30 },
    },
    arenaSelf: {
      tierGrade: 17,
      starsCurrent: 2,
      starsNeeded: 4,
      gems: 128,
      xp: 2840,
    },
    arenaLeaderboard: buildArenaLeaderboard("normal", "你（晨跑小叶）", 840),
    boundFriends: [
      {
        id: "f1",
        name: "自律的阿杰",
        bondLevel: 3,
        todaySynced: true,
        tierGrade: 16,
        beast: arenaBeastSnapshotForName("自律的阿杰"),
        radar: radarFromName("自律的阿杰"),
      },
      {
        id: "f2",
        name: "骑行社团-小林",
        bondLevel: 2,
        todaySynced: false,
        tierGrade: 14,
        beast: arenaBeastSnapshotForName("骑行社团-小林"),
        radar: radarFromName("骑行社团-小林"),
      },
    ],
    achievements: [
      {
        id: "a1",
        title: "七日连胜",
        desc: "连续打卡 7 天",
        unlocked: true,
        icon: "🔥",
      },
      {
        id: "a2",
        title: "早起鸟",
        desc: "8:00 前完成晨间训练",
        unlocked: true,
        icon: "🌅",
      },
      {
        id: "a3",
        title: "均衡饮食",
        desc: "单日三餐全部记录",
        unlocked: false,
        icon: "🍱",
      },
      {
        id: "a4",
        title: "竞技场新星",
        desc: "周榜进入前三",
        unlocked: false,
        icon: "🏆",
      },
    ],
  },
};

const finalsBundle: FitModeBundle = {
  ...normalBundle,
  id: "finals",
  label: "期末周模式",
  shortLabel: "期末",
  shellTagline: "期末冲刺 · 零负担碎片动动 · 减压不断档",
  features: {
    emphasizeLeaderboardPressure: false,
    showHolidayContract: false,
    showFinalsMicroBreak: true,
    softExerciseSecondaryCtas: true,
  },
  home: {
    ...normalBundle.home,
    eyebrow: "今日进度 · 期末周模式",
    beastTitle: "幻兽进化 · 小额进度也算赢",
    beastFlavor:
      "复习很长，但身体只需要几次「短暂的清醒」。完成极短训练也能保住连胜与进化——不给大脑添负担。",
    beastEmoji: "📚",
    goalTitle: "今日微目标（可拆分完成）",
    goalFooter:
      "今日完成度 {pct}% · 期末周规则：练 5 分钟也算打卡成功，不断档优先",
    quickTitle: "减压 & 碎片入口",
    xpTitle: "温和升级 · 不减压不卷",
    xpFooterHint: "期末周 XP 奖励偏向「完成一次动动」而非时长——先把习惯留住。",
    xpCta: "去做个短的",
    heartsLabel: "复习续航",
  },
  exercise: {
    eyebrow: "运动 · 期末周模式",
    title: "碎片动动 · 复习友好",
    subtitle:
      "不换装备、不出大汗 · 今日已动动 {minutes} 分钟 · 重点：醒脑 + 肩颈腰背放松",
    recommendTitle: "今日推荐 · 图书馆 / 宿舍场景",
    bondTitle: "同伴陪伴 · 不断档约定（模拟）",
    bondBody:
      "期末周开启「低门槛同步」：你和好友只要各自完成任意 5 分钟训练，即算同日履约，羁绊不掉（演示）。",
  },
  diet: {
    eyebrow: "饮食 · 期末周模式",
    title: "能量餐谱",
    subtitle:
      "不求精确卡路里，只求「吃过东西记得打卡」——避免熬夜复习暴食失控（模拟成就仍会统计）。",
    mealsTitle: "今日进食 · 六餐次",
    waterTitle: "补水 · 防困倦",
    tipsTitle: "期末周饮食小贴士",
    tipsBody:
      "夜宵咖啡因别过量；每餐加一点蛋白稳住饱腹感；久坐每小时起身接水，也算「动动」联动（模拟）。",
  },
  arena: {
    eyebrow: "竞技场 · 期末周模式",
    title: "竞技场 · 减压比拼",
    subtitle:
      "榜单改为「减压效率」：核心看微运动坚持频次，而非消耗攀比；仍可单日 PK，晚间结算（演示）。",
    leaderboardTitle: "减压效率榜",
    scoreLabel: "本周次数",
    leaderboardRulesHint:
      "与日常榜相同的 20 人池与 30%/40%/30% 升降段规则；期末周主列为「本周微运动次数」。段位每周一刷新。",
    pkSectionTitle: "好友单日 PK",
    bindTitle: "复习搭子 · 绑定（演示）",
    bindBody:
      "绑定后可见彼此雷达与 PK，不含私信；提醒走系统温和推送（文案演示）。",
    friendsTitle: "搭子动态 · 点头像看雷达",
  },
  profile: {
    contractCardTitle: "",
    contractCardBody: "",
    achievementsTitle: "成就墙 · 期末友好版",
    settingsTitle: "设置与数据（入口）",
    settingsRows: [
      "勿扰时段 · 复习专注模式",
      "久坐提醒 · 每小时微动动",
      "通知降级 · 仅保留陪伴提醒",
      "关于 · 游戏化运动激励工具",
    ],
    syncLabel: "同步课表空档提醒（模拟）",
    campusHint: "复习场景 · 推荐极限短时间训练",
  },
  data: {
    todayGoal: {
      minutesDone: 8,
      minutesTarget: 15,
      calories: 55,
      caloriesTarget: 110,
      steps: 4210,
      standHoursDone: 3,
      standHoursTarget: 6,
    },
    beast: { evolutionPercent: 58 },
    quickActions: [
      {
        id: "micro",
        label: "5 分钟动动",
        icon: "⏱️",
        href: "/exercise?tab=run",
      },
      {
        id: "stretch",
        label: "拉伸减压",
        icon: "🧘",
        href: "/exercise?tab=stretch",
      },
      { id: "meal", label: "快速饮食", icon: "🍱", href: "/diet" },
      {
        id: "buddy",
        label: "提醒搭子",
        icon: "🤝",
        href: "/arena",
      },
    ],
    workouts: [
      {
        id: "f1",
        title: "楼梯间 5 分钟微循环",
        durationMin: 5,
        xp: 18,
        done: true,
        tag: "有氧",
      },
      {
        id: "f2",
        title: "书桌俯卧撑 / 靠墙静蹲（二选一）",
        durationMin: 6,
        xp: 16,
        done: false,
        tag: "力量",
      },
      {
        id: "f3",
        title: "护眼 + 颈肩腰背放松",
        durationMin: 8,
        xp: 14,
        done: false,
        tag: "恢复",
      },
    ],
    dietToday: {
      mealSlots: assertSlotOrder(FINALS_MEAL_SLOTS),
      waterMl: 850,
      waterTargetMl: 1800,
      calorieBudgetTarget: 1880,
      macroGoals: { fat: 55, carbs: 205, protein: 98, fiber: 28 },
    },
    arenaSelf: {
      tierGrade: 15,
      starsCurrent: 3,
      starsNeeded: 4,
      gems: 96,
      xp: 2520,
    },
    arenaLeaderboard: buildArenaLeaderboard("finals", "你（晨跑小叶）", 15),
    boundFriends: [
      {
        id: "f1",
        name: "室友阿杰",
        bondLevel: 4,
        todaySynced: true,
        tierGrade: 16,
        beast: arenaBeastSnapshotForName("室友阿杰"),
        radar: radarFromName("室友阿杰"),
      },
      {
        id: "f2",
        name: "图书馆同桌",
        bondLevel: 2,
        todaySynced: false,
        tierGrade: 13,
        beast: arenaBeastSnapshotForName("图书馆同桌"),
        radar: radarFromName("图书馆同桌"),
      },
    ],
    achievements: [
      {
        id: "fa1",
        title: "不断档勇士",
        desc: "期末周连续 3 天完成任意碎片训练",
        unlocked: true,
        icon: "🛡️",
      },
      {
        id: "fa2",
        title: "护眼练习生",
        desc: "完成 2 次颈肩放松",
        unlocked: true,
        icon: "👀",
      },
      {
        id: "fa3",
        title: "情绪稳定餐",
        desc: "三餐都打「快速记录」",
        unlocked: false,
        icon: "🍜",
      },
      {
        id: "fa4",
        title: "陪伴之光",
        desc: "与搭子同日完成训练 5 次",
        unlocked: false,
        icon: "🤝",
      },
    ],
  },
};

const holidayBundle: FitModeBundle = {
  ...normalBundle,
  id: "holiday",
  label: "假期模式",
  shortLabel: "假期",
  shellTagline: "离校居家 · 长周期自律 · 强监督绑定防躺平",
  features: {
    emphasizeLeaderboardPressure: true,
    showHolidayContract: true,
    showFinalsMicroBreak: false,
    softExerciseSecondaryCtas: false,
  },
  home: {
    ...normalBundle.home,
    eyebrow: "今日进度 · 假期模式",
    beastTitle: "幻兽进化 · 长假契约进度",
    beastFlavor:
      "没有操场也能进化：把客厅变成训练关卡。长假看的是「连续履约天数」，幻兽陪你对抗躺平惯性。",
    beastEmoji: "🏠",
    goalTitle: "今日居家目标",
    goalFooter:
      "今日完成度 {pct}% · 假期加成：与绑定好友同日打卡，进化能量额外 +20%（演示）",
    quickTitle: "居家 & 监督入口",
    xpTitle: "长假经验 · 挑战加成",
    xpFooterHint: "完成「周期挑战」可获得大量 XP —— 适合假期重启动力。",
    xpCta: "开启今日训练",
    heartsLabel: "契约毅力",
  },
  exercise: {
    eyebrow: "运动 · 假期模式",
    title: "居家训练计划",
    subtitle:
      "无器材 / 小空间也能练 · 今日已运动 {minutes} 分钟 · 动作以跟练窗口为主（演示）",
    recommendTitle: "今日推荐 · 客厅 / 卧室场景",
    bondTitle: "远程监督 · 契约加成（模拟）",
    bondBody:
      "假期开启「强监督」：绑定好友可查看彼此打卡窗口，错过会触发温和提醒；同日完成训练触发高额羁绊加成。",
  },
  diet: {
    eyebrow: "饮食 · 假期模式",
    title: "能量餐谱",
    subtitle:
      "记录家常菜与外食，关注蛋白质与蔬菜占比——长假最怕作息漂移（模拟 Buff 仍生效）。",
    mealsTitle: "今日进食 · 六餐次",
    waterTitle: "饮水目标",
    tipsTitle: "居家饮食小贴士",
    tipsBody:
      "少吃悬空零食替换成定时正餐；奶茶降级为半糖；起床后先喝一杯水唤醒代谢（模拟联动饮水按钮）。",
  },
  arena: {
    eyebrow: "竞技场 · 假期模式",
    title: "竞技场 · 长假履约",
    subtitle:
      "榜单突出履约分，并展示离校天数与自律率；仍可单日 PK，晚间掠夺炼金币/XP（演示随机）。",
    leaderboardTitle: "长假履约竞技榜",
    scoreLabel: "履约分",
    leaderboardRulesHint:
      "20 人初始池 + 手动加好友（段位差 ≤4）。每周升降段 30%/40%/30%。假期榜额外展示离校天数、自律率（演示字段）。",
    pkSectionTitle: "好友单日 PK",
    bindTitle: "契约小队 · 绑定（演示）",
    bindBody:
      "强监督仅展示打卡与雷达，不提供站内私信，减轻社交负担。",
    friendsTitle: "契约好友 · 点头像看雷达",
  },
  profile: {
    contractCardTitle: "假期自律契约（演示入口）",
    contractCardBody:
      "设定 14/21/30 天居家挑战：每日任意完成 1 次训练即算履约。契约期内中断会冻结部分加成，重启后可继续累计（前端模拟）。",
    achievementsTitle: "成就墙 · 长假挑战",
    settingsTitle: "设置与数据（入口）",
    settingsRows: [
      "契约规则 · 打卡窗口 / 豁免次数",
      "监督强度 · 提醒频次",
      "居家器械 · 哑铃弹力带（可选）",
      "关于 · 游戏化运动激励工具",
    ],
    syncLabel: "同步手环 / 手表（模拟）",
    campusHint: "离校场景 · 场地以居家为主",
  },
  data: {
    todayGoal: {
      minutesDone: 18,
      minutesTarget: 35,
      calories: 210,
      caloriesTarget: 380,
      steps: 5120,
      standHoursDone: 6,
      standHoursTarget: 12,
    },
    beast: { evolutionPercent: 71 },
    quickActions: [
      {
        id: "hiit",
        label: "客厅有氧",
        icon: "🔥",
        href: "/exercise?tab=run",
      },
      {
        id: "homegym",
        label: "徒手力量",
        icon: "💪",
        href: "/exercise?tab=gym",
      },
      { id: "meal", label: "饮食打卡", icon: "🥘", href: "/diet" },
      {
        id: "squad",
        label: "契约小队",
        icon: "📌",
        href: "/arena",
      },
    ],
    workouts: [
      {
        id: "h1",
        title: "客厅开合跳 + 高抬腿间歇",
        durationMin: 18,
        xp: 40,
        done: false,
        tag: "有氧",
      },
      {
        id: "h2",
        title: "徒手全身 · 臀腿推拉",
        durationMin: 22,
        xp: 38,
        done: true,
        tag: "力量",
      },
      {
        id: "h3",
        title: "瑜伽垫深层拉伸",
        durationMin: 12,
        xp: 16,
        done: false,
        tag: "恢复",
      },
    ],
    dietToday: {
      mealSlots: assertSlotOrder(HOLIDAY_MEAL_SLOTS),
      waterMl: 950,
      waterTargetMl: 2200,
      calorieBudgetTarget: 2280,
      macroGoals: { fat: 68, carbs: 210, protein: 118, fiber: 32 },
    },
    arenaSelf: {
      tierGrade: 18,
      starsCurrent: 1,
      starsNeeded: 4,
      gems: 156,
      xp: 3020,
    },
    arenaLeaderboard: buildArenaLeaderboard("holiday", "你（晨跑小叶）", 930),
    boundFriends: [
      {
        id: "f1",
        name: "契约队长-阿杰",
        bondLevel: 5,
        todaySynced: true,
        tierGrade: 19,
        beast: arenaBeastSnapshotForName("契约队长-阿杰"),
        radar: radarFromName("契约队长-阿杰"),
      },
      {
        id: "f2",
        name: "异地好友小林",
        bondLevel: 4,
        todaySynced: false,
        tierGrade: 17,
        beast: arenaBeastSnapshotForName("异地好友小林"),
        radar: radarFromName("异地好友小林"),
      },
      {
        id: "f3",
        name: "表姐的运动搭子",
        bondLevel: 3,
        todaySynced: false,
        tierGrade: 15,
        beast: arenaBeastSnapshotForName("表姐的运动搭子"),
        radar: radarFromName("表姐的运动搭子"),
      },
    ],
    achievements: [
      {
        id: "ha1",
        title: "异地不断联",
        desc: "假期与好友同日打卡 7 次",
        unlocked: true,
        icon: "📡",
      },
      {
        id: "ha2",
        title: "客厅战神",
        desc: "完成 5 次居家有氧间歇",
        unlocked: true,
        icon: "🏠",
      },
      {
        id: "ha3",
        title: "契约履约王",
        desc: "连续履约 14 天",
        unlocked: false,
        icon: "📜",
      },
      {
        id: "ha4",
        title: "重启大师",
        desc: "中断后 48h 内成功回归训练",
        unlocked: false,
        icon: "🔁",
      },
    ],
  },
};

const bundles: Record<FitMode, FitModeBundle> = {
  normal: normalBundle,
  finals: finalsBundle,
  holiday: holidayBundle,
};

export const FIT_MODES: FitMode[] = ["normal", "finals", "holiday"];

export function getModeBundle(mode: FitMode): FitModeBundle {
  return bundles[mode] ?? normalBundle;
}

export function formatTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}
