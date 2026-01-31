import React, { useState } from 'react';
import { Button, Input, Card } from '../components/Common';
import { ArrowLeft } from 'lucide-react';

const Submit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skill' | 'mcp'>('skill');
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <button className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 group w-fit">
             <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
             返回控制台
        </button>
        <h1 className="text-3xl font-bold text-slate-900">发布新插件</h1>
        <p className="mt-2 text-slate-500">将您的 Skill 或 MCP Server 贡献给 Pandabot 社区。</p>
      </div>

      <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('skill')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all border ${
              activeTab === 'skill' 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200'
            }`}
          >
            发布 Skill
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all border ${
              activeTab === 'mcp' 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200'
            }`}
          >
            发布 MCP Server
          </button>
      </div>

      <Card className="p-8 border-slate-200">
        {step === 1 ? (
          <div className="space-y-8">
            <div>
                 <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 mb-6">基本信息</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input label="插件 ID (英文)" placeholder={activeTab === 'skill' ? '例如: coding-helper' : '例如: postgres-mcp'} />
                    <Input label="显示名称" placeholder={activeTab === 'skill' ? '例如: Coding Assistant' : '例如: PostgreSQL Server'} />
                 </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">简单描述</label>
              <textarea 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg placeholder-slate-400 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm h-24"
                placeholder="简要介绍插件的核心功能和用途..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">分类</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option>开发工具</option>
                  <option>数据与AI</option>
                  <option>办公效率</option>
                  <option>系统运维</option>
                </select>
              </div>
              <Input label="版本号" placeholder="1.0.0" />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">许可证</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option>MIT License</option>
                  <option>Apache 2.0</option>
                  <option>GPL 3.0</option>
                  <option>Proprietary</option>
                </select>
              </div>
            </div>

            <Input label="标签 (用逗号分隔)" placeholder="python, database, automation" />

            <div className="pt-6 flex justify-end">
              <Button onClick={() => setStep(2)} className="px-8 bg-purple-600 hover:bg-purple-700">下一步：详细文档</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
               <h2 className="text-lg font-bold text-slate-900">详细文档</h2>
               <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-900 font-medium">上一步</button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">README.md 内容</label>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex gap-4 text-xs font-bold text-slate-600">
                  <span className="text-purple-600 border-b-2 border-purple-600 pb-1.5 -mb-2">编辑</span>
                  <span className="cursor-pointer hover:text-slate-900 pb-1.5">预览</span>
                </div>
                <textarea 
                  className="w-full p-4 focus:outline-none text-sm font-mono h-80 resize-y bg-white text-slate-800"
                  defaultValue={`# ${activeTab === 'skill' ? 'Skill' : 'MCP'} 介绍\n\n在这里详细描述您的插件...\n\n## 配置方法\n...`}
                ></textarea>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
               <h4 className="font-bold text-blue-900 text-sm mb-2">提交须知</h4>
               <ul className="list-disc list-inside text-xs text-blue-700 space-y-1.5">
                 <li>提交前请确保已通过 `pandabot validate` 本地验证。</li>
                 <li>请勿包含任何 API 密钥或敏感凭证。</li>
                 <li>Skill 代码必须符合 Pandabot 安全沙箱规范。</li>
               </ul>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <Button variant="ghost" onClick={() => setStep(1)}>上一步</Button>
              <Button variant="primary" className="px-8 bg-purple-600 hover:bg-purple-700">提交审核</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Submit;
