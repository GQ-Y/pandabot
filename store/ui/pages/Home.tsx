import React from 'react';
import { Search, ArrowRight, Terminal, Database, Cpu, Zap, Box, TrendingUp, Download } from 'lucide-react';
import { Button, Card, Badge } from '../components/Common';
import { MOCK_ITEMS } from '../constants';
import { Item, PageView } from '../types';

interface HomeProps {
  onNavigate: (page: PageView) => void;
  onSelectItem: (item: Item) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onSelectItem }) => {
  return (
    <div className="flex flex-col bg-[#FAFAFA] dark:bg-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-dark-card pb-16 pt-20 lg:pb-24 border-b border-slate-50 dark:border-dark-border">
        {/* Background blobs - hidden in dark mode */}
        <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] rounded-full bg-purple-50 dark:bg-transparent blur-3xl opacity-60 dark:opacity-0 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[600px] h-[600px] rounded-full bg-indigo-50 dark:bg-transparent blur-3xl opacity-60 dark:opacity-0 mix-blend-multiply"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <Badge variant="purple" className="mx-auto mb-6 w-fit px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
            🚀 扩展无限可能
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-dark-text tracking-tight mb-6 leading-tight">
            探索 Pandabot <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Skills & MCPs</span> <br className="hidden sm:block"/>
            生态系统
          </h1>
          <p className="text-lg text-slate-500 dark:text-dark-muted mb-10 max-w-2xl mx-auto">
            发现数以千计的社区插件，连接数据库、Web 服务与本地工具，打造您的专属 AI 智能体。
          </p>
          
          <div className="max-w-xl mx-auto relative mb-12">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 dark:text-dark-muted group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-32 py-4 text-base border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-hover rounded-2xl focus:outline-none focus:border-purple-300 dark:focus:border-purple-600 focus:ring-4 focus:ring-purple-50 dark:focus:ring-purple-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-dark-muted text-slate-700 dark:text-dark-text"
                placeholder="搜索 'postgres', 'coding assistant'..."
                onKeyDown={(e) => e.key === 'Enter' && onNavigate('skills')}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button variant="primary" className="rounded-xl px-6 py-2" onClick={() => onNavigate('skills')}>
                  搜索
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
             <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-100 dark:border-dark-border flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-hover hover:border-slate-200 dark:hover:border-dark-border transition-all card-hover" onClick={() => onNavigate('skills')}>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400"><Terminal size={20}/></div>
                <div className="text-left">
                    <div className="font-bold text-slate-800 dark:text-dark-text text-sm sm:text-base">开发工具</div>
                    <div className="text-xs text-slate-500 dark:text-dark-muted">Skills 市场</div>
                </div>
             </div>
             <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-100 dark:border-dark-border flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-hover hover:border-slate-200 dark:hover:border-dark-border transition-all card-hover" onClick={() => onNavigate('mcp')}>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400"><Database size={20}/></div>
                <div className="text-left">
                    <div className="font-bold text-slate-800 dark:text-dark-text text-sm sm:text-base">数据与AI</div>
                    <div className="text-xs text-slate-500 dark:text-dark-muted">MCP 市场</div>
                </div>
             </div>
             <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-100 dark:border-dark-border flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-hover hover:border-slate-200 dark:hover:border-dark-border transition-all card-hover" onClick={() => onNavigate('skills')}>
                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"><Zap size={20}/></div>
                <div className="text-left">
                    <div className="font-bold text-slate-800 dark:text-dark-text text-sm sm:text-base">办公效率</div>
                    <div className="text-xs text-slate-500 dark:text-dark-muted">Skills 市场</div>
                </div>
             </div>
             <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-100 dark:border-dark-border flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-hover hover:border-slate-200 dark:hover:border-dark-border transition-all card-hover" onClick={() => onNavigate('mcp')}>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400"><Cpu size={20}/></div>
                <div className="text-left">
                    <div className="font-bold text-slate-800 dark:text-dark-text text-sm sm:text-base">系统运维</div>
                    <div className="text-xs text-slate-500 dark:text-dark-muted">MCP 市场</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-dark-border text-center card-hover">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-text">156</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-dark-muted mt-1">Skills</div>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-dark-border text-center card-hover">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-text">42</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-dark-muted mt-1">MCP Servers</div>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-dark-border text-center card-hover">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-text">89</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-dark-muted mt-1">开发者</div>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-dark-border text-center card-hover">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-text">12.5K</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-dark-muted mt-1">总下载</div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-dark-text">热门推荐</h2>
            </div>
            <Button variant="ghost" onClick={() => onNavigate('skills')} className="text-slate-500 dark:text-dark-muted">
                查看全部 <ArrowRight size={16} className="ml-1"/>
            </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {MOCK_ITEMS.slice(0,3).map((item, index) => (
                <Card key={item.id} hover onClick={() => onSelectItem(item)} className={`bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border stagger-item`}>
                    <div className="flex items-center gap-2 mb-3">
                         <div className={`p-1.5 rounded ${item.type === 'skill' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                            {item.type === 'skill' ? <Terminal size={16}/> : <Box size={16}/>}
                         </div>
                         <span className={`text-xs font-bold uppercase tracking-wide ${item.type === 'skill' ? 'text-purple-600 dark:text-purple-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                            {item.category}
                         </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-dark-text mb-2">{item.displayName}</h3>
                    <p className="text-sm text-slate-500 dark:text-dark-muted line-clamp-2 mb-4 h-10">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">v{item.version}</Badge>
                        <Badge variant="outline">{item.license}</Badge>
                    </div>

                    <div className="pt-4 border-t border-slate-50 dark:border-dark-border flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-dark-hover flex items-center justify-center text-[10px] text-slate-500 dark:text-dark-muted font-bold">
                                {item.author.charAt(0)}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-dark-muted font-medium">{item.author}</span>
                         </div>
                         <div className="text-xs text-slate-400 dark:text-dark-muted flex items-center gap-1">
                            <Download size={12} />
                            {item.downloads > 1000 ? (item.downloads/1000).toFixed(1) + 'k' : item.downloads}
                         </div>
                    </div>
                </Card>
            ))}
        </div>
      </div>

      {/* Recent Updates Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-dark-text">最近更新</h2>
            <Button variant="ghost" onClick={() => onNavigate('skills')} className="text-slate-500 dark:text-dark-muted">
                查看全部 <ArrowRight size={16} className="ml-1"/>
            </Button>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border overflow-hidden">
          {MOCK_ITEMS.slice(0, 5).map((item, index) => (
            <div 
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors ${index !== MOCK_ITEMS.slice(0,5).length - 1 ? 'border-b border-slate-50 dark:border-dark-border' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${item.type === 'skill' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                  {item.type === 'skill' ? <Terminal size={18}/> : <Box size={18}/>}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-dark-text text-sm sm:text-base">{item.displayName}</div>
                  <div className="text-xs text-slate-500 dark:text-dark-muted">{item.author} · v{item.version}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 dark:text-dark-muted hidden sm:block">{item.updatedAt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
