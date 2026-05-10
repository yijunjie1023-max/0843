import type { FitnessGoal } from "@/lib/beastProfile";

export type WorkoutTaskPools = {
  activate: string[];
  core: string[];
  challenge: string[];
};

/** 四大诉求 × 激活 / 核心 / 挑战 各 10 条（文案来自需求文档） */
export const WORKOUT_TASK_POOLS: Record<FitnessGoal, WorkoutTaskPools> = {
  fat_loss: {
    activate: [
      "晨起空腹步行800步",
      "3分钟波比跳（低频）",
      "左右侧腹拉伸各30秒",
      "全身拍打唤醒",
      "静态猫牛式呼吸20次",
      "靠墙静蹲45秒",
      "动态扩胸30次",
      "原地小步跑1分钟",
      "侧向滑步30次",
      "深度腹式呼吸3分钟",
    ],
    core: [
      "30分钟慢跑",
      "40分钟快走",
      "游泳1000米",
      "椭圆机中强度30分钟",
      "尊巴健身舞一节",
      "骑行10公里",
      "跳绳2000个",
      "爬楼梯20分钟",
      "羽毛球对打40分钟",
      "划船机中速30分钟",
    ],
    challenge: [
      "HIIT间歇训练（Tabata 4组）",
      "10公里长跑",
      "连续跳绳5000个",
      "1小时动感单车课",
      "爬山/登高（500米以上落差）",
      "完成一次500大卡消耗关卡",
      "尝试一次长跑PB（个人最好成绩）",
      "半程马拉松练习（15km）",
      "混合波比跳100个（限时）",
      "全天候万步挑战",
    ],
  },
  muscle_gain: {
    activate: [
      "空手深蹲20个",
      "俯卧撑支撑30秒",
      "弹力带肩外旋20次",
      "动态正向弓箭步10对",
      "跪姿俯卧撑10个",
      "泡沫轴全身滚动",
      "支撑交替摸肩20次",
      "仰卧单腿抬高各15次",
      "动态平板支撑20秒",
      "手臂大风车绕环50次",
    ],
    core: [
      "标准深蹲4组×15个",
      "标准俯卧撑4组×12个",
      "哑铃/水瓶推举4组",
      "仰卧起坐/卷腹50个",
      "哑铃划船4组",
      "负重行走500米",
      "臀桥3组×20个",
      "引体向上（辅助或正式）3组",
      "哑铃飞鸟4组",
      "腿举/保加利亚蹲3组",
    ],
    challenge: [
      "力量训练总重突破5吨",
      "尝试最大重量深蹲（1RM）",
      "连续俯卧撑50个不落地",
      "暴力上杠（或辅助实现）",
      "倒立支撑15秒",
      "全程保加利亚蹲（每腿20个）",
      "农夫行走（自重1倍重量）",
      "L-sit支撑10秒",
      "硬拉训练（自重1.5倍）",
      "持续肌肉张力训练（慢速动作15分钟）",
    ],
  },
  body_shape: {
    activate: [
      "腹式呼吸20次",
      "静态臀桥保持1分钟",
      "动态侧抬腿各20次",
      "腹部真空收缩练习",
      "猫式拉伸1分钟",
      "肩胛骨收紧练习",
      "静态燕飞30秒",
      "动态侧向支撑各15秒",
      "足尖踮起保持1分钟",
      "跪姿后踢腿各15次",
    ],
    core: [
      "普拉提经典动作15分钟",
      "侧卧抬腿4组×20个",
      "俄罗斯转体100次",
      "瑜伽流（拜日式5组）",
      "平板支撑3分钟",
      "死虫式练习4组",
      "剪刀腿50组",
      "站姿侧腹拉伸训练",
      "反向卷腹4组",
      "跪姿鸟狗式4组×12个",
    ],
    challenge: [
      "完成一节完整空中瑜伽",
      "劈叉练习（尝试触地）",
      "核心挑战（平板支撑5分钟）",
      "完成一套高阶普拉提课程",
      "龙旗（或退阶动作）练习",
      "马甲线/人鱼线针对性挑战（200次动作）",
      "完美体态保持挑战（全天不低头）",
      "侧向支撑抬腿挑战",
      "瑜伽倒立式尝试",
      "深度下腰柔韧性挑战",
    ],
  },
  vitality: {
    activate: [
      "扩胸与深呼吸10次",
      "全身抖动唤醒（1分钟）",
      "颈部/肩部环绕各20次",
      "慢速原地踏步2分钟",
      "伸懒腰并大声哈气",
      "揉腹30圈",
      "踮脚尖呼吸15次",
      "贴墙站立3分钟",
      "远眺并眼球转动",
      "双手向上举过头顶保持1分钟",
    ],
    core: [
      "公园散步30分钟",
      "太极拳入门练习",
      "八段锦/易筋经一整套",
      "爬楼梯10层",
      "户外日光浴20分钟（伴随走动）",
      "全身关节拉伸一整套",
      "慢速自由泳20分钟",
      "网球墙壁对敲20分钟",
      "踢毽子15分钟",
      "整理内务/家务30分钟（动态）",
    ],
    challenge: [
      "15公里徒步穿越",
      "完成一次冷水浴挑战（限时）",
      "持续冥想1小时",
      "森林氧吧慢跑1小时",
      "参与一次集体户外运动（如飞盘）",
      "完成一次24小时电子产品禁断运动",
      "学习一套新的复杂操课",
      "攀岩（室内或室外）",
      "负重徒步（5kg）",
      "挑战全天不坐电梯",
    ],
  },
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** 从 n 项里无放回抽取 pick 个下标，按 seed 稳定随机 */
export function dailyPickIndices(seed: string, total: number, pick: number): number[] {
  const indices = Array.from({ length: total }, (_, i) => i);
  let state = hashStr(seed);
  for (let i = total - 1; i > 0; i--) {
    state = (state * 1103515245 + 12345) >>> 0;
    const j = state % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, Math.min(pick, total));
}

export function getActivationOffer(goal: FitnessGoal, dateKey: string, rerollCount: number): string[] {
  const pool = WORKOUT_TASK_POOLS[goal].activate;
  const idx = dailyPickIndices(`${dateKey}|${goal}|activate|${rerollCount}`, pool.length, 5);
  return idx.map((i) => pool[i]!);
}

/** 横向 5 槽里的第 1、2、4、5 项（第 3 槽为自定义，由页面状态填充） */
export function getCoreFiveGenerated(
  goal: FitnessGoal,
  dateKey: string,
  rerollCount: number,
): [string, string, string, string] {
  const pool = WORKOUT_TASK_POOLS[goal].core;
  const idx = dailyPickIndices(`${dateKey}|${goal}|core|row|${rerollCount}`, pool.length, 4);
  return [pool[idx[0]!]!, pool[idx[1]!]!, pool[idx[2]!]!, pool[idx[3]!]!];
}

export function getChallengeFiveGenerated(
  goal: FitnessGoal,
  dateKey: string,
  rerollCount: number,
): [string, string, string, string] {
  const pool = WORKOUT_TASK_POOLS[goal].challenge;
  const idx = dailyPickIndices(`${dateKey}|${goal}|challenge|row|${rerollCount}`, pool.length, 4);
  return [pool[idx[0]!]!, pool[idx[1]!]!, pool[idx[2]!]!, pool[idx[3]!]!];
}

/** slotIndex 0–4；槽 2 为自定义文案 */
export function fiveSlotTitle(
  generated: [string, string, string, string],
  customTitle: string,
  slotIndex: number,
): string {
  if (slotIndex === 2) return customTitle.trim() || "自定义任务";
  const gIdx = slotIndex < 2 ? slotIndex : slotIndex - 1;
  return generated[gIdx]!;
}
