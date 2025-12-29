
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToolMetadata } from '../types';

const CourseTools: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const toolsConfig: Record<string, { name: string, tools: ToolMetadata[] }> = {
    'public-expenditure': {
      name: '公共支出分析',
      tools: [
        { id: 'lorenz', name: '洛伦兹与集中曲线', description: '分析收入与支出分配的不平等程度，计算基尼系数与集中指数。', path: '/tools/lorenz-curve', icon: '🎯' },
        { id: 'pension', name: '城乡养老金调剂模拟', description: '模拟人口老龄化背景下，城镇职工基金向居民基金调剂的财政可持续性与公平性权衡。', path: '/tools/pension-simulator', icon: '⚖️' },
        { id: 'cost-benefit', name: '成本收益分析 (CBA)', description: '对公共投资项目进行净现值 (NPV) 与内部收益率 (IRR) 评估。', path: '/tools/cba', icon: '💰' },
        { id: 'transfer', name: '转移支付效应评价', description: '评估不同层级政府间转移支付对基本公共服务均等化的贡献。', path: '/tools/transfer', icon: '🔄' },
      ]
    },
    'fiscal-econometrics': {
      name: '财税计量应用',
      tools: [
        { id: 'regression', name: '线性回归演示器', description: '可视化理解税收负担与经济增长之间的线性关系。', path: '/tools/regression', icon: '📊' },
        { id: 'panel', name: '面板数据探索器', description: '处理多地区多年度的财税数据，理解固定效应与随机效应。', path: '/tools/panel', icon: '🗄️' },
        { id: 'did', name: '政策评估 (DID)', description: '双重差分模型的可视化演示，评估财税政策试点的实际效果。', path: '/tools/did', icon: '🎭' },
        { id: 'dist', name: '税收归宿模拟', description: '模拟税负转嫁与归宿，分析不同市场弹性下的税收分布规律。', path: '/tools/tax-dist', icon: '💸' },
      ]
    }
  };

  const course = toolsConfig[courseId || ''] || { name: '未知课程', tools: [] };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">《{course.name}》工具集</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {course.tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="p-6">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 duration-300">
                {tool.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600">
                {tool.name}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {tool.description}
              </p>
            </div>
            <div className="mt-auto px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-indigo-500">立即启动</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseTools;
