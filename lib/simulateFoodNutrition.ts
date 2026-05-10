import type { DietFoodItem } from "./dietDay";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

type Sim = Pick<
  DietFoodItem,
  "grams" | "kcal" | "proteinG" | "carbsG" | "fatG" | "fiberG"
>;

/** 根据食物名称生成演示用份量与营养素（本地启发式，非真实数据库） */
export function simulateNutritionFromFoodName(name: string): Sim {
  const raw = name.trim() || "未命名";
  const h = hashString(raw);
  const r = (a: number, b: number) => a + (h % (b - a + 1));

  let grams = r(140, 260);
  let proteinG = 10 + (h % 18);
  let carbsG = 22 + (h % 35);
  let fatG = 5 + (h % 14);
  let fiberG = 1.5 + (h % 35) / 10;

  if (/米饭|白饭|糙米|炒饭|rice\b/i.test(raw)) {
    grams = r(160, 220);
    proteinG = 4 + (h % 5);
    carbsG = 44 + (h % 12);
    fatG = 0.5 + (h % 8) / 10;
    fiberG = 0.4 + (h % 8) / 10;
  } else if (/面条|拉面|米线|米粉|粥|包子|饺子|馄饨|noodle/i.test(raw)) {
    grams = r(280, 420);
    proteinG = 12 + (h % 12);
    carbsG = 48 + (h % 25);
    fatG = 4 + (h % 10);
    fiberG = 2 + (h % 15) / 10;
  } else if (/面包|吐司|蛋糕|甜品|奶茶|可乐|果汁/.test(raw)) {
    grams = r(80, 200);
    proteinG = 3 + (h % 8);
    carbsG = 35 + (h % 40);
    fatG = 6 + (h % 18);
    fiberG = 1 + (h % 12) / 10;
  } else if (/薯|土豆|玉米|燕麦/.test(raw)) {
    grams = r(150, 250);
    proteinG = 4 + (h % 6);
    carbsG = 32 + (h % 20);
    fatG = 1 + (h % 8);
    fiberG = 3 + (h % 20) / 10;
  } else if (/鸡|鸭|鱼|牛|猪|羊|虾|蟹|蛋|海鲜|chicken|beef|fish|egg/i.test(raw)) {
    grams = r(120, 220);
    proteinG = 28 + (h % 18);
    carbsG = 2 + (h % 12);
    fatG = 8 + (h % 18);
    fiberG = 0.3 + (h % 8) / 10;
  } else if (/豆腐|豆浆|牛奶|酸奶|奶酪/.test(raw)) {
    grams = r(200, 320);
    proteinG = 12 + (h % 10);
    carbsG = 10 + (h % 14);
    fatG = 5 + (h % 10);
    fiberG = 0.5 + (h % 8) / 10;
  } else if (/沙拉|菠菜|青菜|西兰花|黄瓜|番茄|蔬菜|生菜/.test(raw)) {
    grams = r(120, 280);
    proteinG = 3 + (h % 8);
    carbsG = 8 + (h % 12);
    fatG = 2 + (h % 10);
    fiberG = 3 + (h % 25) / 10;
  } else if (/坚果|花生|核桃|杏仁/.test(raw)) {
    grams = r(25, 45);
    proteinG = 5 + (h % 6);
    carbsG = 6 + (h % 8);
    fatG = 14 + (h % 10);
    fiberG = 2 + (h % 15) / 10;
  } else if (/咖啡|茶|美式|拿铁|coffee|latte/i.test(raw)) {
    grams = r(240, 380);
    proteinG = 1 + (h % 5) / 10;
    carbsG = 2 + (h % 12);
    fatG = (h % 10) / 10;
    fiberG = 0;
  } else if (/香蕉|苹果|橙|莓|瓜|水果/.test(raw)) {
    grams = r(100, 200);
    proteinG = 1 + (h % 8) / 10;
    carbsG = 22 + (h % 18);
    fatG = 0.3 + (h % 6) / 10;
    fiberG = 2.5 + (h % 20) / 10;
  } else if (/火锅|烧烤|快餐|便当|外卖|盖饭/.test(raw)) {
    grams = r(380, 520);
    proteinG = 26 + (h % 15);
    carbsG = 48 + (h % 22);
    fatG = 22 + (h % 18);
    fiberG = 4 + (h % 15) / 10;
  }

  proteinG = round1(proteinG);
  carbsG = round1(carbsG);
  fatG = round1(fatG);
  fiberG = round1(fiberG);

  let kcal = Math.round(proteinG * 4 + carbsG * 4 + fatG * 9);
  const jitterK = (h % 41) - 20;
  kcal = Math.max(80, kcal + jitterK);

  return {
    grams: Math.round(grams),
    kcal,
    proteinG,
    carbsG,
    fatG,
    fiberG,
  };
}
