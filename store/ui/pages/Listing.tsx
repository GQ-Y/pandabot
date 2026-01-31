import React, { useState } from 'react';
import { Search, Download, Heart, MoreHorizontal, Tag as TagIcon, Globe, Terminal, Database, Zap, Cpu, Activity, Box } from 'lucide-react';
import { MOCK_ITEMS, CATEGORIES } from '../constants';
import { Item } from '../types';
import { Button } from '../components/Common';

interface ListingProps {
  listType: 'skill' | 'mcp';
  onSelectItem: (item: Item) => void;
}

// Icon mapper for categories
const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'dev-tools': return <Terminal size={20} strokeWidth={1.5} />;
    case 'data-ai': return <Database size={20} strokeWidth={1.5} />;
    case 'productivity': return <Zap size={20} strokeWidth={1.5} />;
    case 'system': return <Cpu size={20} strokeWidth={1.5} />;
    default: return <Activity size={20} strokeWidth={1.5} />;
  }
};

const Listing: React.FC<ListingProps> = ({ listType, onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('dev-tools');

  // Calculate dynamic counts based on listType
  const displayCategories = CATEGORIES.map(cat => ({
    ...cat,
    count: MOCK_ITEMS.filter(item => item.type === listType && item.category === cat.label).length
  }));

  const baseItems = MOCK_ITEMS.filter(item => item.type === listType);
  const filteredItems = selectedCategory === 'all' 
    ? baseItems 
    : baseItems.filter(item => {
        const cat = CATEGORIES.find(c => c.id === selectedCategory);
        return cat && item.category === cat.label;
      });

  const listTitle = listType === 'skill' ? 'Skills 市场' : 'MCP Servers 市场';
  const listDesc = listType === 'skill' 
    ? '发现高质量的 Skills，增强 Pandabot 的能力。' 
    : '连接标准化的 MCP Servers，扩展数据与工具访问。';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 bg-[#FAFAFA]">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{listTitle}</h1>
            <p className="text-slate-500">{listDesc}</p>
        </div>

        {/* Layout Container */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation - ModelScope Style Cards */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            {displayCategories.map(cat => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 group relative
                  ${selectedCategory === cat.id 
                    ? 'bg-white shadow-md shadow-slate-200/50 ring-1 ring-black/5 scale-[1.02]' 
                    : 'bg-[#F8F9FB] hover:bg-[#F1F3F5] text-slate-500'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <span className={`${selectedCategory === cat.id ? 'text-slate-900' : 'text-slate-700'}`}>
                      {getCategoryIcon(cat.id)}
                    </span>
                    {/* Title */}
                    <span className={`font-bold text-lg tracking-tight ${selectedCategory === cat.id ? 'text-slate-900' : 'text-slate-700'}`}>
                      {cat.label}
                    </span>
                  </div>
                  {/* Count Badge - White Pill */}
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-slate-900 shadow-sm border border-slate-100/50">
                    {cat.count}
                  </span>
                </div>
                {/* Description */}
                <p className={`text-sm leading-relaxed ${selectedCategory === cat.id ? 'text-slate-500' : 'text-slate-400'}`}>
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-96">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400" />
                 </div>
                 <input 
                   type="text" 
                   placeholder={`搜索${listType === 'skill' ? ' Skill' : ' MCP'}...`}
                   className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl leading-5 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm shadow-sm hover:border-slate-300 transition-colors"
                 />
              </div>
              <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white rounded-xl shadow-sm shadow-indigo-100 px-6">
                提交 {listType === 'skill' ? 'Skill' : 'MCP'}
              </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div 
                      key={item.id} 
                      className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-purple-200 hover:shadow-md hover:shadow-purple-100/50 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[180px]"
                      onClick={() => onSelectItem(item)}
                    >
                      {/* Top Row: Title & Action */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-1 flex items-center gap-2">
                            {item.displayName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide ${item.type === 'skill' ? 'text-purple-600 bg-purple-50' : 'text-indigo-600 bg-indigo-50'}`}>
                              {item.type === 'skill' ? 'SKILL' : 'MCP'}
                            </span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                           <MoreHorizontal size={20} />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Middle Row: Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-6">
                        {/* Category */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                          <Terminal size={12} className="text-[#6366F1]" />
                          <span className="font-medium">{item.category}</span>
                        </div>
                        
                        {/* Version */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                          <TagIcon size={12} className="text-[#6366F1]" />
                          <span className="font-medium">v{item.version}</span>
                        </div>

                        {/* Extra Tags */}
                        {item.tags.slice(0, 2).map(tag => (
                           <span key={tag} className="text-xs text-slate-400 px-1">#{tag}</span>
                        ))}
                      </div>

                      {/* Bottom Row: Author & Stats */}
                      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-50">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[9px] text-slate-600 font-bold border border-white shadow-sm">
                             {item.author.charAt(0)}
                           </div>
                           <span className="text-xs text-slate-500 font-medium hover:text-slate-800 transition-colors">{item.author}</span>
                           <span className="text-xs text-slate-300 mx-1">•</span>
                           <span className="text-xs text-slate-400 flex items-center gap-1">
                              {item.updatedAt}
                           </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                           <span className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
                              <Download size={14} /> {item.downloads > 1000 ? (item.downloads/1000).toFixed(1) + 'k' : item.downloads}
                           </span>
                           <span className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                              <Heart size={14} /> {item.likes}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-100">
                      <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                          {listType === 'skill' ? <Terminal size={32}/> : <Box size={32}/>}
                      </div>
                      <h3 className="text-slate-900 font-bold text-lg mb-1">暂无 {listType === 'skill' ? 'Skills' : 'MCP Servers'}</h3>
                      <p className="text-slate-500 text-sm">该分类下暂无内容，换个分类试试？</p>
                  </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Listing;
