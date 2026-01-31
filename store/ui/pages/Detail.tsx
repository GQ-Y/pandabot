import React, { useState } from 'react';
import { ArrowLeft, Download, Heart, Share2, AlertCircle, Check, Box, User, FileText, Terminal, Code, Star, Calendar, MessageSquare, ThumbsUp, Copy, Settings } from 'lucide-react';
import { Item } from '../types';
import { Badge, Button, Card } from '../components/Common';

interface DetailProps {
  item: Item;
  onBack: () => void;
}

// --- Mock Data for Detail Tabs ---
const MOCK_CHANGELOG = [
  { version: '2.1.0', date: '2026-02-10', content: 'Added support for Python 3.12 type hinting; Improved performance for large codebases.' },
  { version: '2.0.5', date: '2026-01-15', content: 'Fixed a bug where the LSP server would crash on startup in Windows environments.' },
  { version: '2.0.0', date: '2025-12-20', content: 'Major release! Complete rewrite of the inference engine. Introduced new configuration schema.' },
];

const MOCK_REVIEWS = [
  { id: 1, user: 'Alex Chen', rating: 5, date: '2 days ago', content: 'Absolutely essential for my daily workflow. The integration with Pandabot is seamless.' },
  { id: 2, user: 'Sarah Jones', rating: 4, date: '1 week ago', content: 'Great tool, but the initial configuration documentation could be a bit clearer regarding environment variables.' },
  { id: 3, user: 'Mike Ross', rating: 5, date: '2 weeks ago', content: 'Works exactly as described. The MCP server implementation is compliant and fast.' },
];

// --- Sub-Components for Tabs ---

const ReadmeTab: React.FC<{ item: Item }> = ({ item }) => (
  <div className="prose prose-slate max-w-none">
    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 mb-6">
      <h3 className="text-lg font-bold text-slate-900 mb-2">简介</h3>
      <p className="text-slate-600 leading-relaxed">{item.description}</p>
    </div>
    
    <h3 className="text-xl font-bold text-slate-900 mb-4">功能特性</h3>
    <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6">
      <li>无缝集成 Pandabot 对话上下文</li>
      <li>支持自定义配置与环境变量注入</li>
      <li>企业级安全沙箱运行环境</li>
      <li>提供完整的类型定义与自动补全支持</li>
    </ul>

    <h3 className="text-xl font-bold text-slate-900 mb-4">快速开始</h3>
    <p className="text-slate-600 mb-4">在您的 Pandabot 终端中运行以下命令即可安装：</p>
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 flex items-center justify-between group">
      <span>pandabot install {item.name}@{item.version}</span>
      <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
        <Copy size={16} />
      </button>
    </div>
  </div>
);

const ConfigTab: React.FC<{ item: Item }> = ({ item }) => {
  const isMcp = item.type === 'mcp';
  const configCode = isMcp 
    ? `{
  "mcpServers": {
    "${item.name}": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-${item.name}"],
      "env": {
        "API_KEY": "<YOUR_API_KEY>",
        "DB_HOST": "localhost"
      }
    }
  }
}`
    : `skills:
  - name: ${item.name}
    version: ${item.version}
    enabled: true
    config:
      max_tokens: 2048
      temperature: 0.7
      enable_logging: true`;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Settings size={20} className="text-purple-600"/>
          配置示例
        </h3>
        <p className="text-slate-500 mb-4 text-sm">
          将以下配置添加到您的 {isMcp ? 'Pandabot MCP 配置文件 (mcp_config.json)' : 'Pandabot Skill 配置文件 (skills.yaml)'} 中。
        </p>
        <div className="relative group">
          <div className="absolute right-4 top-4">
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded text-slate-300 transition-colors">
              <Copy size={16} />
            </button>
          </div>
          <pre className="bg-slate-900 text-slate-50 p-5 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed border border-slate-800">
            {configCode}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">环境变量说明</h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">变量名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">必填</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">描述</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-purple-600">API_KEY</td>
                <td className="px-6 py-4 whitespace-nowrap"><Badge variant="error">是</Badge></td>
                <td className="px-6 py-4 text-sm text-slate-600">用于访问后端服务的认证密钥。</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-purple-600">LOG_LEVEL</td>
                <td className="px-6 py-4 whitespace-nowrap"><Badge variant="secondary">否</Badge></td>
                <td className="px-6 py-4 text-sm text-slate-600">日志级别 (DEBUG, INFO, WARN, ERROR)。默认为 INFO。</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-purple-600">TIMEOUT_MS</td>
                <td className="px-6 py-4 whitespace-nowrap"><Badge variant="secondary">否</Badge></td>
                <td className="px-6 py-4 text-sm text-slate-600">请求超时时间（毫秒）。默认为 5000。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ChangelogTab: React.FC = () => (
  <div className="space-y-2">
    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
      <Calendar size={20} className="text-purple-600"/>
      版本历史
    </h3>
    <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
      {MOCK_CHANGELOG.map((log, index) => (
        <div key={index} className="relative pl-8">
          {/* Timeline Dot */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-purple-600 shadow-sm"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="text-lg font-bold text-slate-900">v{log.version}</span>
            <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{log.date}</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
            {log.content}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const CommunityTab: React.FC = () => (
  <div className="space-y-8">
    {/* Ratings Overview */}
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col md:flex-row items-center gap-8">
      <div className="text-center">
        <div className="text-5xl font-bold text-slate-900">4.8</div>
        <div className="flex items-center gap-1 text-amber-400 my-2 justify-center">
          <Star fill="currentColor" size={20} />
          <Star fill="currentColor" size={20} />
          <Star fill="currentColor" size={20} />
          <Star fill="currentColor" size={20} />
          <Star fill="currentColor" size={20} className="text-slate-300" /> {/* Half star simulation */}
        </div>
        <div className="text-sm text-slate-500">基于 128 条评价</div>
      </div>
      
      <div className="flex-1 w-full space-y-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 w-3">{star}</span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full" 
                style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
         <Button>撰写评价</Button>
      </div>
    </div>

    {/* Reviews List */}
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <MessageSquare size={20} className="text-purple-600"/>
        用户评论
      </h3>
      {MOCK_REVIEWS.map((review) => (
        <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center text-xs font-bold text-purple-700">
                {review.user.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{review.user}</div>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-300" : ""} />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400">{review.date}</span>
          </div>
          <p className="text-slate-600 text-sm mt-2 pl-11">{review.content}</p>
          <div className="pl-11 mt-3 flex items-center gap-4 text-xs text-slate-400">
             <button className="flex items-center gap-1 hover:text-slate-600 transition-colors">
               <ThumbsUp size={12} /> 有用
             </button>
             <button className="hover:text-slate-600 transition-colors">回复</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Detail Component ---

const Detail: React.FC<DetailProps> = ({ item, onBack }) => {
  const [activeTab, setActiveTab] = useState<'readme' | 'config' | 'changelog' | 'community'>('readme');
  const [installed, setInstalled] = useState(false);

  const handleInstall = () => {
    setInstalled(true);
    setTimeout(() => setInstalled(false), 3000);
  };

  const tabs = [
    { id: 'readme', label: '文档概览', icon: FileText },
    { id: 'config', label: '配置示例', icon: Code },
    { id: 'changelog', label: '更新日志', icon: Calendar },
    { id: 'community', label: '社区反馈', icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            返回列表
          </button>
          <div className="h-4 w-px bg-slate-200 mx-4"></div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
             <span>{item.type === 'skill' ? 'Skills' : 'MCP Servers'}</span>
             <span>/</span>
             <span className="text-slate-700 font-medium">{item.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Info */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex gap-5">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${item.type === 'skill' ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {item.type === 'skill' ? <Terminal size={40} /> : <Box size={40} />}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{item.displayName}</h1>
                    <p className="text-slate-500 mb-4 text-sm md:text-base leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                       <Badge variant="purple" className="uppercase text-[10px] tracking-wider">{item.type}</Badge>
                       <Badge variant="secondary">v{item.version}</Badge>
                       <Badge variant="outline">{item.license}</Badge>
                       {item.tags.map(tag => (
                         <span key={tag} className="text-xs text-slate-400 px-1 py-0.5">#{tag}</span>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 shrink-0">
                   <Button 
                    onClick={handleInstall}
                    className={`w-full md:w-32 justify-center shadow-lg transition-all ${installed ? 'bg-green-600 hover:bg-green-700' : 'bg-[#6366F1] hover:bg-[#4F46E5] shadow-indigo-200'}`}
                   >
                     {installed ? <><Check size={16} className="mr-2"/> 已安装</> : <><Download size={16} className="mr-2"/> 安装</>}
                   </Button>
                   <Button variant="secondary" className="w-full md:w-32 justify-center border-slate-200 shadow-sm">
                     <Heart size={16} className="mr-2 text-slate-400 group-hover:text-pink-500" /> 收藏
                   </Button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[500px]">
               <div className="border-b border-slate-100 px-6 flex gap-8 overflow-x-auto no-scrollbar">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                          ? 'border-purple-600 text-purple-700' 
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
               </div>
               <div className="p-6 md:p-8">
                  {activeTab === 'readme' && <ReadmeTab item={item} />}
                  {activeTab === 'config' && <ConfigTab item={item} />}
                  {activeTab === 'changelog' && <ChangelogTab />}
                  {activeTab === 'community' && <CommunityTab />}
               </div>
            </div>
          </div>

          {/* Right: Sidebar Info */}
          <div className="w-full lg:w-80 space-y-6">
             {/* Author Card */}
             <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">开发者</h3>
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-white shadow">
                      {item.author.charAt(0)}
                   </div>
                   <div>
                      <div className="font-bold text-slate-900 text-sm hover:text-purple-600 cursor-pointer">{item.author}</div>
                      <div className="text-xs text-slate-400">已发布 3 个插件</div>
                   </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="w-full text-xs h-8">个人主页</Button>
                   <Button variant="outline" size="sm" className="w-full text-xs h-8">捐赠支持</Button>
                </div>
             </div>

             {/* Stats Card */}
             <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">数据统计</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                         <Download size={16} className="text-slate-400" /> 总下载
                      </div>
                      <span className="font-mono font-bold text-slate-900">{item.downloads.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                         <Heart size={16} className="text-slate-400" /> 收藏数
                      </div>
                      <span className="font-mono font-bold text-slate-900">{item.likes.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                         <Calendar size={16} className="text-slate-400" /> 最近更新
                      </div>
                      <span className="font-mono text-xs text-slate-500">{item.updatedAt}</span>
                   </div>
                </div>
             </div>

             {/* Links Card */}
             <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">相关链接</h3>
                <div className="space-y-2">
                   <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-sm text-slate-600 transition-colors">
                      <span className="flex items-center gap-2"><Share2 size={14}/> 源码仓库</span>
                      <ArrowLeft size={12} className="rotate-180 text-slate-300"/>
                   </a>
                   <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-sm text-slate-600 transition-colors">
                      <span className="flex items-center gap-2"><AlertCircle size={14}/> 问题反馈</span>
                      <ArrowLeft size={12} className="rotate-180 text-slate-300"/>
                   </a>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Detail;
