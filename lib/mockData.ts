/** 前端模拟数据 — 测评与原型用 */

import { getModeBundle, type DietToday } from "./fitMode";
import { assertSlotOrder, NORMAL_MEAL_SLOTS } from "./dietSeed";

export const userProfile = {
  nickname: "晨跑小叶",
  campus: "某某大学 · 计算机学院",
  level: 12,
  xp: 2840,
  xpToNext: 3200,
  streak: 7,
  hearts: 4,
  maxHearts: 5,
  gems: 128,
};

export const beast = {
  name: "焰尾幼兽",
  stage: 2 as const,
  stageNames: ["蛋巢", "幼兽", "成长期", "完全体", "传说形态"],
  evolutionPercent: 62,
  flavor: "今日运动会在明日进化条上留下脚印——坚持打卡，幻兽与你同步升级！",
};

export const todayGoal = {
  minutesDone: 22,
  minutesTarget: 45,
  calories: 180,
  caloriesTarget: 420,
  steps: 6420,
  standHoursDone: 5,
  standHoursTarget: 12,
};

export const quickActions = [
  { id: "run", label: "跑步打卡", icon: "🏃", href: "/exercise?tab=run" },
  { id: "gym", label: "力量训练", icon: "🏋️", href: "/exercise?tab=gym" },
  { id: "meal", label: "记录饮食", icon: "🥗", href: "/diet" },
  { id: "arena", label: "好友对战", icon: "⚔️", href: "/arena" },
];

export const workouts = [
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
];

export const dietToday: DietToday = {
  mealSlots: assertSlotOrder(NORMAL_MEAL_SLOTS),
  waterMl: 1100,
  waterTargetMl: 2000,
  calorieBudgetTarget: 1796,
  macroGoals: { fat: 59, carbs: 178, protein: 133, fiber: 30 },
};

export const arenaLeaderboard = getModeBundle("normal").data.arenaLeaderboard;

export const achievements = [
  { id: "a1", title: "七日连胜", desc: "连续打卡 7 天", unlocked: true, icon: "🔥" },
  { id: "a2", title: "早起鸟", desc: "8:00 前完成晨间训练", unlocked: true, icon: "🌅" },
  { id: "a3", title: "均衡饮食", desc: "单日三餐全部记录", unlocked: false, icon: "🍱" },
  { id: "a4", title: "竞技场新星", desc: "周榜进入前三", unlocked: false, icon: "🏆" },
];

export const boundFriends = getModeBundle("normal").data.boundFriends;
