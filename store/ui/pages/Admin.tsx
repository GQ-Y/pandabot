import React from 'react';
import { Check, X, Clock, Eye, Activity, Users, Terminal, Box, TrendingUp, Package } from 'lucide-react';
import { Badge, Button } from '../components/Common';
import { MOCK_ITEMS } from '../constants';
import { useToast } from '../components/Toast';

const Admin: React.FC = () => {
  const toast = useToast();

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

  const handleApprove = (name: string) => {
    toast.success(`已批准 "${name}"`);
  };

  const handleReject = (name: string) => {
    toast.error(`已拒绝 "${name}"`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#FAFAFA] dark:bg-dark-bg min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-dark-text">管理控制台</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-dark-muted">欢迎回来, 管理员</span>
          <Button variant="outline" size="sm" className="bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border">退出登录</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-dark-border flex items-center justify-between card-hover">
           <div>
               <div className="text-xs sm:text-sm text-slate-500 dark:text-dark-muted font-medium">待审核插件</div>
               <div className="text-2xl sm:text-3xl font-bold text-amber-500 mt-1">2</div>
           </div>
           <div className="bg-amber-50 dark:bg-amber-900/30 p-2 sm:p-3 rounded-lg text-amber-600 dark:text-amber-400"><Clock size={20} className="sm:w-6 sm:h-6"/></div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-dark-border flex items-center justify-between card-hover">
           <div>
               <div className="text-xs sm:text-sm text-slate-500 dark:text-dark-muted font-medium">本周下载量</div>
               <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">12.5K</div>
           </div>
           <div className="bg-purple-50 dark:bg-purple-900/30 p-2 sm:p-3 rounded-lg text-purple-600 dark:text-purple-400"><TrendingUp size={20} className="sm:w-6 sm:h-6"/></div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-dark-border flex items-center justify-between card-hover">
           <div>
               <div className="text-xs sm:text-sm text-slate-500 dark:text-dark-muted font-medium">开发者总数</div>
               <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">892</div>
           </div>
           <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 sm:p-3 rounded-lg text-indigo-600 dark:text-indigo-400"><Users size={20} className="sm:w-6 sm:h-6"/></div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-dark-border flex items-center justify-between card-hover">
           <div>
               <div className="text-xs sm:text-sm text-slate-500 dark:text-dark-muted font-medium">总插件数</div>
               <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mt-1">198</div>
           </div>
           <div className="bg-green-50 dark:bg-green-900/30 p-2 sm:p-3 rounded-lg text-green-600 dark:text-green-400"><Package size={20} className="sm:w-6 sm:h-6"/></div>
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-hover">
          <h2 className="font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            审核队列
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-dark-border">
          {pendingItems.map((item, idx) => (
            <div key={idx} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors">
              <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Clock size={12} /> 待审核
                    </Badge>
                    <h3 className="font-bold text-slate-900 dark:text-dark-text">{item.displayName}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.type === 'skill' ? 'text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30' : 'text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30'}`}>
                            {item.type === 'skill' ? 'SKILL' : 'MCP'}
                        </span>
                        <code className="text-xs text-slate-400 dark:text-dark-muted bg-slate-100 dark:bg-dark-hover px-1.5 py-0.5 rounded">{item.name}</code>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-dark-muted mb-4 mt-3">
                    <div>
                      <span className="block text-xs text-slate-400 dark:text-dark-muted mb-0.5">作者</span>
                      <span className="font-medium text-slate-700 dark:text-dark-text">{item.author}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 dark:text-dark-muted mb-0.5">分类</span>
                      <span className="font-medium text-slate-700 dark:text-dark-text">{item.category}</span>
                    </div>
                     <div>
                      <span className="block text-xs text-slate-400 dark:text-dark-muted mb-0.5">版本</span>
                      <span className="font-medium text-slate-700 dark:text-dark-text">{item.version}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 dark:text-dark-muted mb-0.5">提交时间</span>
                      <span className="font-medium text-slate-700 dark:text-dark-text">{item.updatedAt}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-dark-muted text-sm bg-slate-50 dark:bg-dark-hover p-3 rounded-lg border border-slate-100 dark:border-dark-border">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 justify-start lg:justify-center shrink-0">
                  <Button variant="outline" size="sm" icon={Eye} className="flex-1 lg:flex-none lg:w-auto">查看详情</Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon={Check} 
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 flex-1 lg:flex-none lg:w-auto"
                    onClick={() => handleApprove(item.displayName)}
                  >
                    通过
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    icon={X} 
                    className="flex-1 lg:flex-none lg:w-auto"
                    onClick={() => handleReject(item.displayName)}
                  >
                    拒绝
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-hover">
            <h2 className="font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
              <Activity size={18} className="text-purple-600 dark:text-purple-400" />
              最近活动
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {[
              { action: '批准', item: 'coding-helper', time: '2 小时前', type: 'skill' },
              { action: '拒绝', item: 'spam-mcp', time: '5 小时前', type: 'mcp' },
              { action: '批准', item: 'postgres-mcp', time: '昨天', type: 'mcp' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded ${activity.type === 'skill' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                    {activity.type === 'skill' ? <Terminal size={14} /> : <Box size={14} />}
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${activity.action === '批准' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{activity.action}</span>
                    <span className="text-sm text-slate-600 dark:text-dark-muted ml-2">{activity.item}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-dark-muted">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Downloads */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-hover">
            <h2 className="font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
              热门下载
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {MOCK_ITEMS.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-300 dark:text-dark-border w-6">{idx + 1}</span>
                  <div className={`p-1.5 rounded ${item.type === 'skill' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                    {item.type === 'skill' ? <Terminal size={14} /> : <Box size={14} />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-dark-text">{item.displayName}</span>
                </div>
                <span className="text-sm font-mono text-slate-500 dark:text-dark-muted">{item.downloads > 1000 ? (item.downloads/1000).toFixed(1) + 'k' : item.downloads}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
