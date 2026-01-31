import React, { useState } from 'react';
import { Button, Input, Card } from '../components/Common';
import { ArrowLeft, Terminal, Box, Check } from 'lucide-react';
import { useToast } from '../components/Toast';

const Submit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skill' | 'mcp'>('skill');
  const [step, setStep] = useState(1);
  const toast = useToast();

  const handleSubmit = () => {
    toast.success('提交成功！我们将在 24 小时内审核您的插件。');
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-screen">
      <div className="mb-8">
        <button className="flex items-center text-sm text-slate-500 dark:text-dark-muted hover:text-slate-900 dark:hover:text-dark-text mb-4 group w-fit">
             <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
             返回控制台
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-text">发布新插件</h1>
        <p className="mt-2 text-slate-500 dark:text-dark-muted text-sm sm:text-base">将您的 Skill 或 MCP Server 贡献给 Pandabot 社区。</p>
      </div>

      {/* Type Selector */}
      <div className="flex gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => setActiveTab('skill')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
              activeTab === 'skill' 
                ? 'bg-purple-600 dark:bg-purple-700 text-white border-purple-600 dark:border-purple-700 shadow-lg shadow-purple-200 dark:shadow-none' 
                : 'bg-white dark:bg-dark-card text-slate-600 dark:text-dark-muted border-slate-200 dark:border-dark-border hover:border-purple-200 dark:hover:border-purple-800'
            }`}
          >
            <Terminal size={18} />
            发布 Skill
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
              activeTab === 'mcp' 
                ? 'bg-purple-600 dark:bg-purple-700 text-white border-purple-600 dark:border-purple-700 shadow-lg shadow-purple-200 dark:shadow-none' 
                : 'bg-white dark:bg-dark-card text-slate-600 dark:text-dark-muted border-slate-200 dark:border-dark-border hover:border-purple-200 dark:hover:border-purple-800'
            }`}
          >
            <Box size={18} />
            发布 MCP Server
          </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-dark-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 1 ? 'bg-purple-600 dark:bg-purple-700 text-white' : 'bg-slate-100 dark:bg-dark-hover text-slate-400 dark:text-dark-muted'
          }`}>
            {step > 1 ? <Check size={16} /> : '1'}
          </div>
          <span className="text-sm font-medium hidden sm:inline">基本信息</span>
        </div>
        <div className={`flex-1 h-0.5 ${step > 1 ? 'bg-purple-600 dark:bg-purple-700' : 'bg-slate-200 dark:bg-dark-border'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-dark-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 2 ? 'bg-purple-600 dark:bg-purple-700 text-white' : 'bg-slate-100 dark:bg-dark-hover text-slate-400 dark:text-dark-muted'
          }`}>
            2
          </div>
          <span className="text-sm font-medium hidden sm:inline">详细文档</span>
        </div>
      </div>

      <Card className="p-6 sm:p-8 border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card">
        {step === 1 ? (
          <div className="space-y-6 sm:space-y-8">
            <div>
                 <h2 className="text-lg font-bold text-slate-900 dark:text-dark-text pb-2 border-b border-slate-100 dark:border-dark-border mb-6">基本信息</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <Input label="插件 ID (英文)" placeholder={activeTab === 'skill' ? '例如: coding-helper' : '例如: postgres-mcp'} />
                    <Input label="显示名称" placeholder={activeTab === 'skill' ? '例如: Coding Assistant' : '例如: PostgreSQL Server'} />
                 </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1.5">简单描述</label>
              <textarea 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-hover border border-slate-100 dark:border-dark-border rounded-lg placeholder-slate-400 dark:placeholder-dark-muted text-slate-700 dark:text-dark-text focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 text-sm h-24 transition-colors"
                placeholder="简要介绍插件的核心功能和用途..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1.5">分类</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-hover border border-slate-100 dark:border-dark-border rounded-lg text-sm text-slate-700 dark:text-dark-text focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-colors">
                  <option>开发工具</option>
                  <option>数据与AI</option>
                  <option>办公效率</option>
                  <option>系统运维</option>
                </select>
              </div>
              <Input label="版本号" placeholder="1.0.0" />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1.5">许可证</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-hover border border-slate-100 dark:border-dark-border rounded-lg text-sm text-slate-700 dark:text-dark-text focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-colors">
                  <option>MIT License</option>
                  <option>Apache 2.0</option>
                  <option>GPL 3.0</option>
                  <option>Proprietary</option>
                </select>
              </div>
            </div>

            <Input label="标签 (用逗号分隔)" placeholder="python, database, automation" />

            <div className="pt-4 sm:pt-6 flex justify-end">
              <Button onClick={() => setStep(2)} className="px-6 sm:px-8 bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600">下一步：详细文档</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-dark-border pb-4">
               <h2 className="text-lg font-bold text-slate-900 dark:text-dark-text">详细文档</h2>
               <button onClick={() => setStep(1)} className="text-sm text-slate-500 dark:text-dark-muted hover:text-slate-900 dark:hover:text-dark-text font-medium">上一步</button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1.5">README.md 内容</label>
              <div className="border border-slate-100 dark:border-dark-border rounded-lg overflow-hidden">
                <div className="bg-slate-50 dark:bg-dark-hover px-4 py-2 border-b border-slate-100 dark:border-dark-border flex gap-4 text-xs font-bold text-slate-600 dark:text-dark-muted">
                  <span className="text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 pb-1.5 -mb-2">编辑</span>
                  <span className="cursor-pointer hover:text-slate-900 dark:hover:text-dark-text pb-1.5">预览</span>
                </div>
                <textarea 
                  className="w-full p-4 focus:outline-none text-sm font-mono h-60 sm:h-80 resize-y bg-white dark:bg-dark-card text-slate-800 dark:text-dark-text placeholder-slate-400 dark:placeholder-dark-muted"
                  defaultValue={`# ${activeTab === 'skill' ? 'Skill' : 'MCP'} 介绍\n\n在这里详细描述您的插件...\n\n## 配置方法\n...`}
                ></textarea>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-5 rounded-xl border border-blue-100 dark:border-blue-800">
               <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-2">提交须知</h4>
               <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-400 space-y-1.5">
                 <li>提交前请确保已通过 `pandabot validate` 本地验证。</li>
                 <li>请勿包含任何 API 密钥或敏感凭证。</li>
                 <li>Skill 代码必须符合 Pandabot 安全沙箱规范。</li>
               </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <Button variant="ghost" onClick={() => setStep(1)} className="order-2 sm:order-1">上一步</Button>
              <Button variant="primary" className="px-6 sm:px-8 bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600 order-1 sm:order-2" onClick={handleSubmit}>提交审核</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Submit;
