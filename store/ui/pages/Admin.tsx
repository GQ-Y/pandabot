import React from 'react';
import { Check, X, Clock, Eye, Activity, Database, Users, Terminal, Box } from 'lucide-react';
import { Badge, Button } from '../components/Common';
import { MOCK_ITEMS } from '../constants';

const Admin: React.FC = () => {
  // Simulate pending items
  const pendingItems = [
    {
      ...MOCK_ITEMS[0],
      id: '99',
      displayName: 'Broken Skill',
      name: 'broken-skill-test',
      status: 'pending' as const,
      updatedAt: '2026-02-14',
      author: 'Newbie Dev',
      category: '开发工具',
      type: 'skill' as const,
      version: '0.0.1'
    },
     {
      ...MOCK_ITEMS[1],
      id: '100',
      displayName: 'Unsafe MCP',
      name: 'unsafe-mcp-server',
      status: 'pending' as const,
      updatedAt: '2026-02-13',
      author: 'Unknown Actor',
      category: '系统运维',
      type: 'mcp' as const,
      version: '1.0.0-beta'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#FAFAFA] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">管理控制台</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">欢迎回来, 管理员</span>
          <Button variant="outline" size="sm" className="bg-white border-slate-100">退出登录</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center justify-between">
           <div>
               <div className="text-sm text-slate-500 font-medium">待审核插件</div>
               <div className="text-3xl font-bold text-amber-500 mt-1">2</div>
           </div>
           <div className="bg-amber-50 p-3 rounded-lg text-amber-600"><Clock size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center justify-between">
           <div>
               <div className="text-sm text-slate-500 font-medium">本周下载量</div>
               <div className="text-3xl font-bold text-purple-600 mt-1">12.5K</div>
           </div>
           <div className="bg-purple-50 p-3 rounded-lg text-purple-600"><Activity size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center justify-between">
           <div>
               <div className="text-sm text-slate-500 font-medium">开发者总数</div>
               <div className="text-3xl font-bold text-indigo-600 mt-1">892</div>
           </div>
           <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600"><Users size={24}/></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-900">审核队列</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {pendingItems.map((item, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Clock size={12} /> 待审核
                    </Badge>
                    <h3 className="font-bold text-slate-900">{item.displayName}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.type === 'skill' ? 'text-purple-600 border-purple-100 bg-purple-50' : 'text-indigo-600 border-indigo-100 bg-indigo-50'}`}>
                            {item.type === 'skill' ? 'SKILL' : 'MCP'}
                        </span>
                        <code className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{item.name}</code>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm text-slate-500 mb-4 mt-3">
                    <div>
                      <span className="block text-xs text-slate-400 mb-0.5">作者</span>
                      <span className="font-medium text-slate-700">{item.author}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 mb-0.5">分类</span>
                      <span className="font-medium text-slate-700">{item.category}</span>
                    </div>
                     <div>
                      <span className="block text-xs text-slate-400 mb-0.5">版本</span>
                      <span className="font-medium text-slate-700">{item.version}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 mb-0.5">提交时间</span>
                      <span className="font-medium text-slate-700">{item.updatedAt}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-3 justify-center shrink-0">
                  <Button variant="outline" size="sm" icon={Eye} className="w-full md:w-auto">查看详情</Button>
                  <Button variant="primary" size="sm" icon={Check} className="bg-green-600 hover:bg-green-700 w-full md:w-auto">通过</Button>
                  <Button variant="danger" size="sm" icon={X} className="w-full md:w-auto">拒绝</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
