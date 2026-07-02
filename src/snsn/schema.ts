export const Schema = z.object({
  世界: z.object({
    当前时间: z.coerce.number().prefault(() => Date.now()),
    战场区域: z.string().prefault('尚未部署'),
  }).prefault({}),
  主角: z.object({
    功绩点数: z.coerce.number().prefault(0),
    军功: z.enum(['无', '三等功', '二等功', '一等功']).prefault('无'),
    摧毁激光塔: z.coerce.number().prefault(0),
    占领营地: z.coerce.number().prefault(0),
    连续无损任务: z.coerce.number().prefault(0),
    营地: z.enum(['后方营地', '前线营地']).prefault('后方营地'),
  }).prefault({}),
  小队: z.record(z.string().describe('人形名称'), z.object({
    类型: z.enum(['突击兵', '侦察兵', '游击兵', '重装兵']).prefault('突击兵'),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    状态: z.enum(['正常', '轻损', '重损', '待修复']).prefault('正常'),
    来源: z.enum(['初始成员', '收编']).prefault('收编'),
  }).prefault({})).prefault({}),
  仓库: z.record(z.string().describe('物品名'), z.object({
    数量: z.coerce.number().prefault(0),
    类型: z.enum(['武器', '弹药', '配件', '消耗品', '其他']).prefault('消耗品'),
  }).prefault({})).prefault({}),
}).prefault({});

export type Schema = z.output<typeof Schema>;
