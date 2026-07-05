<template>
  <div class="panel">
    <!-- 顶部：标题 + 战场信息 -->
    <div class="header">
      <span class="title">📡 战术指挥面板</span>
      <span class="zone">{{ store.data.世界.战场区域 }}</span>
    </div>

    <!-- 主角状态条 -->
    <div class="commander-bar">
      <div class="stat-item">
        <span class="stat-label">🏅 军功</span>
        <span class="stat-value" :class="meritClass">{{ store.data.主角.军功 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">⭐ 功绩点</span>
        <span class="stat-value">{{ store.data.主角.功绩点数 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">🏕 营地</span>
        <span class="stat-value">{{ store.data.主角.营地 }}</span>
      </div>
    </div>

    <!-- 战果统计 -->
    <div class="stats-row">
      <div class="stat-chip">
        <span class="chip-icon">🗼</span>
        <span class="chip-label">摧毁激光塔</span>
        <span class="chip-num">{{ store.data.主角.摧毁激光塔 }}</span>
      </div>
      <div class="stat-chip">
        <span class="chip-icon">🏚</span>
        <span class="chip-label">占领营地</span>
        <span class="chip-num">{{ store.data.主角.占领营地 }}</span>
      </div>
      <div class="stat-chip">
        <span class="chip-icon">✅</span>
        <span class="chip-label">连续无损</span>
        <span class="chip-num" :class="{ 'streak-on': store.data.主角.连续无损任务 >= 2 }">{{ store.data.主角.连续无损任务 }}</span>
      </div>
    </div>

    <!-- 小队成员 -->
    <div class="section-label">▸ 小队成员</div>
    <div v-if="_.isEmpty(store.data.小队)" class="empty-hint">暂无成员数据</div>
    <div v-else class="squad-grid">
      <div
        v-for="(data, name) in store.data.小队"
        :key="name"
        class="member-card"
      >
        <div class="mem-header">
          <span class="mem-name">{{ name }}</span>
          <span class="mem-type" :class="typeClass(data.类型)">{{ data.类型 }}</span>
        </div>
        <div class="mem-body">
          <!-- 状态 -->
          <div class="mem-row">
            <span class="mem-key">状态</span>
            <span class="mem-status" :class="statusClass(data.状态)">{{ data.状态 }}</span>
          </div>
          <!-- 好感度条 -->
          <div class="mem-row">
            <span class="mem-key">好感</span>
            <div class="aff-bar">
              <div
                class="aff-fill"
                :style="{ width: data.好感度 + '%' }"
              ></div>
            </div>
            <span class="aff-num">{{ data.好感度 }}</span>
          </div>
          <!-- 来源 -->
          <div class="mem-row source-row">
            <span class="mem-key">来源</span>
            <span class="mem-source" :class="{ recruit: data.来源 === '收编' }">{{ data.来源 === '初始成员' ? '初始' : '收编' }}</span>
          </div>
          <!-- 简介 -->
          <div v-if="data.简介 && data.简介 !== '待生成'" class="mem-row mem-intro">
            {{ data.简介 }}
          </div>
          <!-- 详情：始终可展开 -->
          <div class="mem-detail-toggle" @click="toggleDetail(name)">
            {{ expandedMembers[name] ? '▲ 收起' : '▼ 详情' }}
          </div>
          <div v-if="expandedMembers[name]" class="mem-detail">
            <div v-if="data.外貌 && data.外貌 !== '待生成'" class="detail-line">
              <span class="detail-label">外貌</span>{{ data.外貌 }}
            </div>
            <div v-if="data.外貌 === '待生成'" class="detail-line detail-pending">
              档案尚未生成
            </div>
            <div v-if="data.性格 && data.性格 !== '待生成'" class="detail-line">
              <span class="detail-label">性格</span>{{ data.性格 }}
            </div>
            <div v-if="data.性癖 && data.性癖 !== '待生成'" class="detail-line">
              <span class="detail-label">性癖</span>{{ data.性癖 }}
            </div>
            <div v-if="data.装备 && data.装备 !== '标准配备'" class="detail-line">
              <span class="detail-label">装备</span>{{ data.装备 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 仓库 -->
    <div class="section-label">▸ 仓库物资</div>
    <div v-if="_.isEmpty(store.data.仓库)" class="empty-hint">仓库空空如也</div>
    <div v-else class="inventory-grid">
      <div v-for="(data, name) in store.data.仓库" :key="name" class="item-chip">
        <span class="item-type-dot" :class="itemTypeClass(data.类型)"></span>
        <span class="item-name">{{ name }}</span>
        <span class="item-qty">×{{ data.数量 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from './store';

const store = useDataStore();

const expandedMembers = reactive<Record<string, boolean>>({});
function toggleDetail(name: string) {
  expandedMembers[name] = !expandedMembers[name];
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    '正常': 'st-ok',
    '轻损': 'st-light',
    '重损': 'st-heavy',
    '待修复': 'st-broken',
  };
  return map[status] || '';
}

function typeClass(type: string) {
  const map: Record<string, string> = {
    '突击兵': 'tp-assault',
    '侦察兵': 'tp-scout',
    '游击兵': 'tp-guerrilla',
    '重装兵': 'tp-heavy',
  };
  return map[type] || '';
}

const meritClass = computed(() => {
  const m = store.data.主角.军功;
  if (m === '一等功') return 'merit-gold';
  if (m === '二等功') return 'merit-silver';
  if (m === '三等功') return 'merit-bronze';
  return '';
});

function itemTypeClass(type: string) {
  const map: Record<string, string> = {
    '武器': 'it-weapon',
    '弹药': 'it-ammo',
    '配件': 'it-part',
    '消耗品': 'it-consume',
    '其他': 'it-other',
  };
  return map[type] || 'it-other';
}
</script>

<style lang="scss" scoped>
.panel {
  width: 100%;
  max-width: 680px;
  background: var(--c-bg-dark);
  border: 2px solid var(--c-border);
  border-radius: 4px;
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--c-bg-card);
  border-bottom: 2px solid var(--c-primary);
}

.title {
  font-weight: bold;
  font-size: 15px;
  color: var(--c-text-bright);
  letter-spacing: 1px;
}

.zone {
  font-size: 12px;
  color: var(--c-accent);
  background: rgba(243, 156, 18, 0.1);
  padding: 2px 8px;
  border-radius: 2px;
  border: 1px solid rgba(243, 156, 18, 0.3);
}

/* 主角状态条 */
.commander-bar {
  display: flex;
  gap: 6px;
  padding: 8px 14px;
  background: var(--c-bg-panel);
  border-bottom: 1px solid var(--c-border);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: var(--c-text-muted);
}

.stat-value {
  font-weight: bold;
  font-size: 14px;
  color: var(--c-text-bright);
}

.merit-gold { color: #f1c40f !important; text-shadow: 0 0 6px rgba(241,196,15,0.5); }
.merit-silver { color: #bdc3c7 !important; }
.merit-bronze { color: #e67e22 !important; }

/* 战果统计 */
.stats-row {
  display: flex;
  gap: 4px;
  padding: 8px 14px;
}

.stat-chip {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 3px;
  padding: 5px 8px;
  font-size: 11px;
}

.chip-icon { font-size: 13px; }
.chip-label { color: var(--c-text-muted); }
.chip-num { margin-left: auto; font-weight: bold; color: var(--c-text-bright); font-size: 14px; }
.streak-on { color: var(--c-accent) !important; }

/* 小队区域 */
.section-label {
  font-size: 12px;
  font-weight: bold;
  color: var(--c-accent);
  padding: 6px 14px 4px;
  letter-spacing: 1px;
}

.empty-hint {
  padding: 12px 14px;
  color: var(--c-text-muted);
  font-style: italic;
  font-size: 12px;
}

.squad-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 6px;
  padding: 4px 14px 10px;
}

.member-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 3px;
  overflow: hidden;
}

.mem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: var(--c-bg-panel);
  border-bottom: 1px solid var(--c-border);
}

.mem-name {
  font-weight: bold;
  color: var(--c-text-bright);
}

.mem-type {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 2px;
  color: #fff;
}
.tp-assault { background: rgba(231,76,60,0.7); }
.tp-scout { background: rgba(52,152,219,0.7); }
.tp-guerrilla { background: rgba(46,204,113,0.7); }
.tp-heavy { background: rgba(155,89,182,0.7); }

.mem-body {
  padding: 6px 8px;
}

.mem-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  &:last-child { margin-bottom: 0; }
}

.mem-key {
  font-size: 10px;
  color: var(--c-text-muted);
  min-width: 24px;
}

.mem-status {
  font-size: 11px;
  font-weight: bold;
  padding: 1px 6px;
  border-radius: 2px;
}
.st-ok { color: var(--c-status-normal); }
.st-light { color: var(--c-status-light); }
.st-heavy { color: var(--c-status-heavy); }
.st-broken { color: var(--c-status-broken); }

/* 好感度条 */
.aff-bar {
  flex: 1;
  height: 8px;
  background: var(--c-bar-bg);
  border-radius: 4px;
  overflow: hidden;
}

.aff-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
  background: var(--c-accent);
}

.aff-num {
  font-size: 12px;
  font-weight: bold;
  color: var(--c-text-bright);
}

.source-row {
  margin-top: 2px;
  font-size: 10px;
}
.mem-source {
  color: var(--c-text-muted);
  &.recruit { color: var(--c-accent-blue); }
}

/* 仓库 */
.inventory-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 14px 10px;
}

.item-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 3px;
  padding: 3px 8px;
  font-size: 11px;
}

.item-type-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.it-weapon { background: var(--c-accent-red); }
.it-ammo { background: var(--c-accent); }
.it-part { background: var(--c-accent-blue); }
.it-consume { background: var(--c-accent-green); }
.it-other { background: var(--c-text-muted); }

.item-name { color: var(--c-text); }
.item-qty { font-weight: bold; color: var(--c-text-bright); }

/* 成员详情 */
.mem-intro {
  font-size: 10px;
  color: var(--c-accent);
  font-style: italic;
  padding-top: 2px;
  border-top: 1px dashed var(--c-border);
  margin-top: 2px;
}
.mem-detail-toggle {
  display: block !important;
  font-size: 11px;
  color: var(--c-accent-blue);
  cursor: pointer;
  text-align: center;
  padding: 4px 0;
  border-top: 1px solid var(--c-border);
  margin-top: 4px;
  user-select: none;
  &:hover { color: var(--c-text-bright); background: var(--c-bg-panel); }
}
.mem-detail {
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  border-radius: 2px;
  padding: 6px 8px;
  margin-top: 2px;
}
.detail-line {
  font-size: 10px;
  line-height: 1.5;
  margin-bottom: 3px;
  color: var(--c-text);
  &:last-child { margin-bottom: 0; }
}
.detail-label {
  color: var(--c-accent);
  font-weight: bold;
  margin-right: 4px;
}
.detail-pending {
  color: var(--c-text-muted);
  font-style: italic;
}
</style>
