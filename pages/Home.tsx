
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const courses = [
    {
      id: 'public-expenditure',
      name: '公共支出分析',
      description: '研究公共支出的规模、结构、效率及对社会福利的影响。',
      color: 'bg-blue-600',
      icon: '📊'
    },
    {
      id: 'fiscal-econometrics',
      name: '财税计量应用',
      description: '应用现代计量经济学方法分析财政税收领域的现实问题。',
      color: 'bg-emerald-600',
      icon: '📈'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
          提升教学与科研的专业工具
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
          为财税专业学生和研究者提供的交互式分析工具集，支持数据可视化与理论模型验证。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className={`w-14 h-14 ${course.color} rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-slate-200`}>
              {course.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              《{course.name}》
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {course.description}
            </p>
            <div className="flex items-center text-indigo-600 font-semibold">
              进入工具集 
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-slate-200 pt-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">100%</div>
          <div className="text-sm text-slate-500 uppercase tracking-widest mt-1">交互式体验</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">实时</div>
          <div className="text-sm text-slate-500 uppercase tracking-widest mt-1">可视化反馈</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">精准</div>
          <div className="text-sm text-slate-500 uppercase tracking-widest mt-1">算法校验</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
