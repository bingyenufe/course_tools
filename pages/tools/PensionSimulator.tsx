
import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

const MODEL_CONSTANTS = {
  urbanRev: 60000,      // 2025年收入 (亿)
  urbanExp: 55000,      // 2025年支出 (亿)
  urbanBalance: 50000,  // 2025年累计结余 (亿)
  revGrowth: 0.03,      // 职工收入增长率 3%
  expGrowth: 0.06,      // 职工支出增长率 6%
  ruralPop: 1.7,        // 居民领取人数 (亿)
  ruralPopGrowth: 0.015, // 居民人数年增长率 1.5%
  ruralBase: 200,       // 居民基础养老金 (元/月)
  urbanAvg: 3500        // 职工平均养老金 (元/月)
};

const PensionSimulator: React.FC = () => {
  const [adjustmentRate, setAdjustmentRate] = useState<number>(0);

  const simulationResults = useMemo(() => {
    const years = [];
    const baselineData = [];
    const currentData = [];
    
    let depYearBase = null;
    let depYearCurr = null;

    let b0 = MODEL_CONSTANTS.urbanBalance; 
    let r0 = MODEL_CONSTANTS.urbanRev; 
    let e0 = MODEL_CONSTANTS.urbanExp;

    let b1 = MODEL_CONSTANTS.urbanBalance; 
    let r1 = MODEL_CONSTANTS.urbanRev; 
    let e1 = MODEL_CONSTANTS.urbanExp;

    for (let i = 0; i <= 20; i++) {
      const year = 2025 + i;
      
      // 基准情景 (Adjustment = 0)
      baselineData.push({ year, balance: b0 });
      if (b0 < 0 && depYearBase === null) depYearBase = year;
      b0 = b0 + (r0 - e0);
      r0 *= (1 + MODEL_CONSTANTS.revGrowth);
      e0 *= (1 + MODEL_CONSTANTS.expGrowth);

      // 当前方案情景
      const transfer = r1 * (adjustmentRate / 100);
      currentData.push({ year, balance: b1, isDeficit: b1 < 0 });
      if (b1 < 0 && depYearCurr === null) depYearCurr = year;
      b1 = b1 + (r1 - transfer - e1);
      r1 *= (1 + MODEL_CONSTANTS.revGrowth);
      e1 *= (1 + MODEL_CONSTANTS.expGrowth);
      
      years.push(year);
    }

    // 计算居民端即时收益 (2025基准)
    const transferTotal = MODEL_CONSTANTS.urbanRev * (adjustmentRate / 100);
    const increaseMonthly = (transferTotal * 100000000) / (MODEL_CONSTANTS.ruralPop * 100000000) / 12;
    const newRuralPension = MODEL_CONSTANTS.ruralBase + increaseMonthly;
    const gapRatio = MODEL_CONSTANTS.urbanAvg / newRuralPension;

    // 整合图表数据
    const chartData = years.map((year, idx) => ({
      year,
      baseline: baselineData[idx].balance,
      current: currentData[idx].balance,
    }));

    return {
      chartData,
      increaseMonthly,
      newRuralPension,
      gapRatio,
      depYearBase,
      depYearCurr,
    };
  }, [adjustmentRate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">城乡养老保险基金“双轨调剂”仿真</h2>
          <p className="mt-2 text-slate-500 max-w-2xl">
            实验目标：模拟通过调节城镇职工基金向农村居民基金的“调剂率”，观察基金穿底时间（可持续性）与城乡差距（公平性）的动态权衡。
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg border border-indigo-100 font-medium text-sm">
          <span className="animate-pulse">●</span> 实时动态模拟系统 v3.2
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              政策控制台
            </h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    职工基金调剂率
                  </label>
                  <span className="text-3xl font-black text-indigo-600">{adjustmentRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={adjustmentRate}
                  onChange={(e) => setAdjustmentRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>0% (无调剂)</span>
                  <span>7.5%</span>
                  <span>15% (强力调剂)</span>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-indigo-800 leading-relaxed">
                <strong>调剂机制：</strong> 每年从“城镇职工基金”的实际收入中划拨 <span className="font-bold underline">{adjustmentRate}%</span> 的资金进入“城乡居民基金”池，平均发放给约1.7亿名农村老人。
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 shadow-xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              模型基准参数 (2025)
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span>职工年收入:</span> <span className="text-white font-mono">60,000 亿</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span>职工年支出:</span> <span className="text-white font-mono font-bold text-rose-400">55,000 亿</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span>职工累计结余:</span> <span className="text-white font-mono">50,000 亿</span>
              </li>
              <li className="flex justify-between text-slate-400 text-xs italic">
                <span>* 支出年增速 6% (老龄化) ＞ 收入年增速 3%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Panel: Visualizations */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Row Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">城镇职工</span>
              <div className="text-xl font-bold text-slate-800 mt-1">¥3500<span className="text-xs font-normal">/月</span></div>
              <div className="mt-2 text-[10px] py-0.5 px-2 bg-slate-100 rounded-full inline-block text-slate-500 font-bold">待遇水平: 高</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-center">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">农村居民</span>
              <div className="text-xl font-bold text-emerald-700 mt-1">¥{simulationResults.newRuralPension.toFixed(0)}<span className="text-xs font-normal">/月</span></div>
              <div className="mt-2 text-[10px] py-0.5 px-2 bg-emerald-100 rounded-full inline-block text-emerald-600 font-bold">增幅: +¥{simulationResults.increaseMonthly.toFixed(0)}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm text-center">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">待遇倍差</span>
              <div className="text-xl font-bold text-amber-700 mt-1">{simulationResults.gapRatio.toFixed(1)}倍</div>
              <div className="mt-2 text-[10px] py-0.5 px-2 bg-amber-100 rounded-full inline-block text-amber-600 font-bold">目标: 缩小差距</div>
            </div>
            <div className={`p-4 rounded-2xl border shadow-sm text-center transition-colors ${
              (simulationResults.depYearCurr || 0) < 2030 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${
                (simulationResults.depYearCurr || 0) < 2030 ? 'text-rose-500' : 'text-slate-400'
              }`}>结余耗尽年份</span>
              <div className={`text-xl font-bold mt-1 ${
                (simulationResults.depYearCurr || 0) < 2030 ? 'text-rose-700 animate-pulse' : 'text-slate-800'
              }`}>
                {simulationResults.depYearCurr || '> 2045'}
              </div>
              <div className={`mt-2 text-[10px] py-0.5 px-2 rounded-full inline-block font-bold ${
                (simulationResults.depYearCurr || 0) < (simulationResults.depYearBase || 0) ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {(simulationResults.depYearCurr || 0) < (simulationResults.depYearBase || 0) ? `提前 ${simulationResults.depYearBase! - simulationResults.depYearCurr!} 年` : '系统自然性风险'}
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">职工养老基金累计结余预测 (2025-2045)</h3>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span> 基准情景</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span> 调剂后情景</div>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationResults.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} label={{ value: '结余 (亿元)', angle: -90, position: 'insideLeft', offset: -10, style: { fill: '#94a3b8', fontWeight: 'bold' } }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={2} />
                  <Line 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="#e2e8f0" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false} 
                    activeDot={false}
                    name="基准情景 (无调剂)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.current < 0) {
                        return <circle cx={cx} cy={cy} r={4} fill="#f43f5e" stroke="none" />;
                      }
                      return null;
                    }}
                    name="调剂后结余"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Grid: Benefit & Conclusion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">居民养老金水平对比</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={[
                      { name: '调剂前', base: 200, increase: 0 },
                      { name: '调剂后', base: 200, increase: simulationResults.increaseMonthly }
                    ]} 
                    margin={{ left: 10, right: 30 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={60} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="base" stackId="a" fill="#e2e8f0" radius={[0, 0, 0, 0]} barSize={30} name="基础水平" />
                    <Bar dataKey="increase" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} barSize={30} name="调剂增额" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`rounded-2xl p-6 border transition-all duration-500 flex flex-col justify-center ${
              adjustmentRate === 0 
              ? 'bg-slate-50 border-slate-200 text-slate-600' 
              : 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
            }`}>
              <h3 className="font-bold text-lg mb-2">决策分析：</h3>
              {adjustmentRate === 0 ? (
                <p className="text-sm leading-relaxed">
                  <strong>基准情景</strong>：不进行财政调剂。虽然职工基金可持续时间较长（2036年），但城乡养老待遇差距高达 <strong>17.5倍</strong>，社会公平性挑战巨大。
                </p>
              ) : (
                <div className="text-sm leading-relaxed space-y-2">
                  <p>通过划拨 <strong>{adjustmentRate}%</strong> 的收入，使农村老人月均养老金提升了 <strong>{simulationResults.increaseMonthly.toFixed(0)}</strong> 元。</p>
                  <p className="font-bold text-indigo-100">代价：</p>
                  <p>职工基金穿底时间由2036年提前至 <strong>{simulationResults.depYearCurr}</strong> 年。这直接展示了“效率与公平”在财政支出中的硬性冲突。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PensionSimulator;
