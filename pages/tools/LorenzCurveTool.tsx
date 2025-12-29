
import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';
import { DataPoint } from '../../types';

const LorenzCurveTool: React.FC = () => {
  const [points, setPoints] = useState<DataPoint[]>([
    { x: 0.20, yL: 0.04, yC: 0.10 },
    { x: 0.40, yL: 0.12, yC: 0.25 },
    { x: 0.60, yL: 0.28, yC: 0.45 },
    { x: 0.80, yL: 0.55, yC: 0.70 },
    { x: 1.00, yL: 1.00, yC: 1.00 },
  ]);

  const [userCI, setUserCI] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const processedData = useMemo(() => {
    // Sort and ensure (0,0) exists
    let sorted = [...points].sort((a, b) => a.x - b.x);
    if (sorted.length > 0 && sorted[0].x > 0) {
      sorted.unshift({ x: 0, yL: 0, yC: 0 });
    } else if (sorted.length === 0) {
      sorted = [{ x: 0, yL: 0, yC: 0 }];
    }
    return sorted;
  }, [points]);

  // G = 1 - 2 * Area under curve
  const calculateIndex = (data: DataPoint[], key: 'yL' | 'yC') => {
    let area = 0;
    for (let i = 1; i < data.length; i++) {
      const width = data[i].x - data[i - 1].x;
      const height = (data[i][key] + data[i - 1][key]) / 2;
      area += width * height;
    }
    return 1 - 2 * area;
  };

  const gini = useMemo(() => calculateIndex(processedData, 'yL'), [processedData]);
  const actualCI = useMemo(() => calculateIndex(processedData, 'yC'), [processedData]);

  const verifyStatus = useMemo(() => {
    if (!hasSubmitted || userCI === '') return 'pending';
    const val = parseFloat(userCI);
    return Math.abs(val - actualCI) <= 0.01 ? 'correct' : 'incorrect';
  }, [hasSubmitted, userCI, actualCI]);

  const handleInputChange = (index: number, field: keyof DataPoint, value: string) => {
    const newVal = parseFloat(value);
    const updatedPoints = [...points];
    updatedPoints[index] = { ...updatedPoints[index], [field]: isNaN(newVal) ? 0 : newVal };
    setPoints(updatedPoints);
  };

  const addRow = () => {
    const lastX = points.length > 0 ? points[points.length - 1].x : 0;
    if (lastX >= 1) return;
    setPoints([...points, { x: Math.min(1, lastX + 0.2), yL: 0, yC: 0 }]);
  };

  const removeRow = (index: number) => {
    if (points.length <= 1) return;
    setPoints(points.filter((_, i) => i !== index));
  };

  const chartData = useMemo(() => {
    return processedData.map(p => ({
      ...p,
      equality: p.x, // 45 degree line
    }));
  }, [processedData]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-900">洛伦兹与集中曲线分析工具</h2>
        <p className="mt-2 text-slate-500">
          通过输入累积人口比 (X) 与对应的累积收入 (Y) 或支出 (C) 数据，可视化分配不平等程度并校验集中指数。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">数据录入表</span>
              <button 
                onClick={addRow}
                className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors"
              >
                + 添加行
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-center">X (人口%)</th>
                    <th className="px-4 py-3 text-center text-indigo-600">Y (收入%)</th>
                    <th className="px-4 py-3 text-center text-emerald-600">C (支出%)</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {points.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={p.x}
                          onChange={(e) => handleInputChange(idx, 'x', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={p.yL}
                          onChange={(e) => handleInputChange(idx, 'yL', e.target.value)}
                          className="w-full bg-indigo-50 border border-indigo-100 rounded px-2 py-1 text-center font-medium text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={p.yC}
                          onChange={(e) => handleInputChange(idx, 'yC', e.target.value)}
                          className="w-full bg-emerald-50 border border-emerald-100 rounded px-2 py-1 text-center font-medium text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button 
                          onClick={() => removeRow(idx)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-indigo-200 rounded-full text-sm">?</span>
              计算与结果校验
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  请输入你计算的集中指数 (CI):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="例如: 0.1234"
                    value={userCI}
                    onChange={(e) => setUserCI(e.target.value)}
                    className="flex-grow bg-white border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => setHasSubmitted(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
                  >
                    校验提交
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Results & Chart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">基尼系数 (Gini)</div>
              <div className="text-4xl font-black">{gini.toFixed(4)}</div>
              <p className="mt-2 text-xs text-indigo-200 opacity-80 leading-tight">
                基于收入累积比 (Y) 计算所得。
              </p>
            </div>
            
            <div className={`rounded-2xl p-6 shadow-lg transition-colors duration-500 border-2 ${
              !hasSubmitted ? 'bg-slate-100 border-slate-200 text-slate-400' :
              verifyStatus === 'correct' ? 'bg-emerald-500 border-emerald-400 text-white' :
              'bg-rose-500 border-rose-400 text-white'
            }`}>
              <div className="text-sm font-medium uppercase tracking-wider mb-1 opacity-80">集中指数校验结果</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {!hasSubmitted ? (
                  <>等待输入...</>
                ) : verifyStatus === 'correct' ? (
                  <><span className="text-3xl">✅</span> 计算正确</>
                ) : (
                  <><span className="text-3xl">❌</span> 计算错误</>
                )}
              </div>
              {hasSubmitted && (
                <p className="mt-2 text-xs opacity-90 leading-tight">
                  理论真实值为: <span className="font-mono font-bold">{actualCI.toFixed(4)}</span>
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-[500px] relative overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">分布曲线可视化</h3>
              <div className="flex gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-slate-300 border-dashed"></span> 45°平均线</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded-full"></span> 洛伦兹曲线</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> 集中曲线</div>
              </div>
            </div>
            
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="x" 
                    type="number" 
                    domain={[0, 1]} 
                    tick={{fontSize: 12}} 
                    label={{ value: '累积人口占比 (X)', position: 'bottom', offset: 0, fontSize: 12 }} 
                  />
                  <YAxis 
                    type="number" 
                    domain={[0, 1]} 
                    tick={{fontSize: 12}} 
                    label={{ value: '累积分配占比', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                  />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(3)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  
                  {/* Absolute Equality Line */}
                  <Line 
                    type="linear" 
                    dataKey="equality" 
                    stroke="#94a3b8" 
                    strokeWidth={1} 
                    strokeDasharray="5 5" 
                    dot={false} 
                    name="绝对平均线"
                    activeDot={false}
                  />

                  {/* Lorenz Curve (Income) */}
                  <Area 
                    type="monotone" 
                    dataKey="yL" 
                    stroke="#6366f1" 
                    fill="#6366f1" 
                    fillOpacity={0.1} 
                    strokeWidth={3} 
                    name="洛伦兹曲线 (收入)" 
                  />
                  <Scatter 
                    dataKey="yL" 
                    fill="#6366f1" 
                    name="收入观测点" 
                    legendType="none"
                  />

                  {/* Concentration Curve (Expenditure) */}
                  <Area 
                    type="monotone" 
                    dataKey="yC" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.1} 
                    strokeWidth={3} 
                    name="集中曲线 (支出)" 
                  />
                  <Scatter 
                    dataKey="yC" 
                    fill="#10b981" 
                    name="支出观测点" 
                    legendType="none"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LorenzCurveTool;
