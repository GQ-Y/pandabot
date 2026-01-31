import React from 'react';
import { Search, ArrowRight, Terminal, Database, Cpu, Zap, Box } from 'lucide-react';
import { Button, Card, Badge } from '../components/Common';
import { MOCK_ITEMS } from '../constants';
import { Item, PageView } from '../types';

interface HomeProps {
  onNavigate: (page: PageView) => void;
  onSelectItem: (item: Item) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onSelectItem }) => {
  return (
    <div className="flex flex-col bg-[#FAFAFA]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white pb-16 pt-20 lg:pb-24 border-b border-slate-50">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] rounded-full bg-purple-50 blur-3xl opacity-60 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[600px] h-[600px] rounded-full bg-indigo-50 blur-3xl opacity-60 mix-blend-multiply"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <Badge variant="purple" className="mx-auto mb-6 w-fit px-3 py-1 bg-purple-50 text-purple-600 border border-purple-100">
            🚀 扩展无限可能
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            探索 Pandabot <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Skills & MCPs</span> <br/>
            生态系统
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
            发现数以千计的社区插件，连接数据库、Web 服务与本地工具，打造您的专属 AI 智能体。
          </p>
          
          <div className="max-w-xl mx-auto relative mb-12">
            {/* Flattened Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-32 py-4 text-base border border-slate-200 bg-white rounded-2xl focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-slate-400"
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
             <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition-all" onClick={() => onNavigate('skills')}>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Terminal size={20}/></div>
                <div className="text-left">
                    <div className="font-bold text-slate-800">开发工具</div>
                    <div className="text-xs text-slate-500">Skills 市场</div>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition-all" onClick={() => onNavigate('mcp')}>
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Database size={20}/></div>
                <div className="text-left">
                    <div className="font-bold text-slate-800">数据与AI</div>
                    <div className="text-xs text-slate-500">MCP 市场</div>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition-all" onClick={() => onNavigate('skills')}>
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><Zap size={20}/></div>
                <div className="text-left">
                    <div className="font-bold text-slate-800">办公效率</div>
                    <div className="text-xs text-slate-500">Skills 市场</div>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition-all" onClick={() => onNavigate('mcp')}>
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Cpu size={20}/></div>
                <div className="text-left">
                    <div className="font-bold text-slate-800">系统运维</div>
                    <div className="text-xs text-slate-500">MCP 市场</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">热门推荐</h2>
            <Button variant="ghost" onClick={() => onNavigate('skills')} className="text-slate-500">
                查看全部 <ArrowRight size={16} className="ml-1"/>
            </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ITEMS.slice(0,3).map(item => (
                <Card key={item.id} hover onClick={() => onSelectItem(item)} className="bg-white border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                         <div className={`p-1.5 rounded ${item.type === 'skill' ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            {item.type === 'skill' ? <Terminal size={16}/> : <Box size={16}/>}
                         </div>
                         <span className={`text-xs font-bold uppercase tracking-wide ${item.type === 'skill' ? 'text-purple-600' : 'text-indigo-600'}`}>
                            {item.category}
                         </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{item.displayName}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">v{item.version}</Badge>
                        <Badge variant="outline">{item.license}</Badge>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                {item.author.charAt(0)}
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{item.author}</span>
                         </div>
                         <div className="text-xs text-slate-400">
                            {item.updatedAt}
                         </div>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
