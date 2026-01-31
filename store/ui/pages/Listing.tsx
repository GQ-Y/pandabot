import React, { useState, useEffect } from 'react';
import { Search, Download, Heart, MoreHorizontal, Tag as TagIcon, Terminal, Database, Zap, Cpu, Activity, Box } from 'lucide-react';
import { MOCK_ITEMS, CATEGORIES } from '../constants';
import { Item } from '../types';
import { Button } from '../components/Common';
import { SkeletonCard, SkeletonCategory } from '../components/Skeleton';

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
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [listType, selectedCategory]);

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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 bg-[#FAFAFA] dark:bg-dark-bg min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-text mb-2">{listTitle}</h1>
            <p className="text-slate-500 dark:text-dark-muted text-sm sm:text-base">{listDesc}</p>
        </div>

        {/* Mobile Category Tabs (horizontal scroll) */}
        <div className="lg:hidden mb-6 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {displayCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-lg shadow-purple-200 dark:shadow-none'
                    : 'bg-white dark:bg-dark-card text-slate-600 dark:text-dark-muted border border-slate-200 dark:border-dark-border'
                }`}
              >
                <span className={selectedCategory === cat.id ? 'text-white' : ''}>
                  {getCategoryIcon(cat.id)}
                </span>
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 dark:bg-dark-hover text-slate-500 dark:text-dark-muted'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Layout Container */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Sidebar Navigation - Desktop only */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-4">
            {isLoading ? (
              <>
                <SkeletonCategory />
                <SkeletonCategory />
                <SkeletonCategory />
                <SkeletonCategory />
              </>
            ) : (
              displayCategories.map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 group relative card-hover
                    ${selectedCategory === cat.id 
                      ? 'bg-white dark:bg-dark-card shadow-md shadow-slate-200/50 dark:shadow-none ring-1 ring-black/5 dark:ring-white/5 scale-[1.02]' 
                      : 'bg-[#F8F9FB] dark:bg-dark-hover hover:bg-[#F1F3F5] dark:hover:bg-dark-card text-slate-500 dark:text-dark-muted'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`${selectedCategory === cat.id ? 'text-slate-900 dark:text-dark-text' : 'text-slate-700 dark:text-dark-muted'}`}>
                        {getCategoryIcon(cat.id)}
                      </span>
                      <span className={`font-bold text-lg tracking-tight ${selectedCategory === cat.id ? 'text-slate-900 dark:text-dark-text' : 'text-slate-700 dark:text-dark-muted'}`}>
                        {cat.label}
                      </span>
                    </div>
                    <span className="bg-white dark:bg-dark-hover px-3 py-1 rounded-full text-sm font-bold text-slate-900 dark:text-dark-text shadow-sm border border-slate-100/50 dark:border-dark-border">
                      {cat.count}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${selectedCategory === cat.id ? 'text-slate-500 dark:text-dark-muted' : 'text-slate-400 dark:text-dark-muted'}`}>
                    {cat.description}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
              <div className="relative w-full sm:w-96">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400 dark:text-dark-muted" />
                 </div>
                 <input 
                   type="text" 
                   placeholder={`搜索${listType === 'skill' ? ' Skill' : ' MCP'}...`}
                   className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl leading-5 placeholder-slate-400 dark:placeholder-dark-muted text-slate-700 dark:text-dark-text focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm shadow-sm hover:border-slate-300 dark:hover:border-dark-border transition-colors"
                 />
              </div>
              <Button className="bg-[#6366F1] dark:bg-purple-600 hover:bg-[#5558E6] dark:hover:bg-purple-700 text-white rounded-xl shadow-sm shadow-indigo-100 dark:shadow-none px-6 justify-center">
                提交 {listType === 'skill' ? 'Skill' : 'MCP'}
              </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`stagger-item group bg-white dark:bg-dark-card rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-dark-border hover:border-purple-200 dark:hover:border-purple-800 card-hover cursor-pointer flex flex-col justify-between min-h-[180px]`}
                      onClick={() => onSelectItem(item)}
                    >
                      {/* Top Row: Title & Action */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-dark-text group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 flex items-center gap-2">
                            {item.displayName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide ${item.type === 'skill' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'}`}>
                              {item.type === 'skill' ? 'SKILL' : 'MCP'}
                            </span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 dark:text-dark-muted hover:text-slate-600 dark:hover:text-dark-text rounded-full hover:bg-slate-50 dark:hover:bg-dark-hover">
                           <MoreHorizontal size={20} />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-500 dark:text-dark-muted line-clamp-2 mb-4 sm:mb-5 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Middle Row: Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                        {/* Category */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-dark-muted bg-slate-50 dark:bg-dark-hover border border-slate-100 dark:border-dark-border px-2.5 py-1 rounded-md">
                          <Terminal size={12} className="text-[#6366F1] dark:text-purple-400" />
                          <span className="font-medium">{item.category}</span>
                        </div>
                        
                        {/* Version */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-dark-muted bg-slate-50 dark:bg-dark-hover border border-slate-100 dark:border-dark-border px-2.5 py-1 rounded-md">
                          <TagIcon size={12} className="text-[#6366F1] dark:text-purple-400" />
                          <span className="font-medium">v{item.version}</span>
                        </div>

                        {/* Extra Tags */}
                        {item.tags.slice(0, 2).map(tag => (
                           <span key={tag} className="text-xs text-slate-400 dark:text-dark-muted px-1">#{tag}</span>
                        ))}
                      </div>

                      {/* Bottom Row: Author & Stats */}
                      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-50 dark:border-dark-border">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-hover dark:to-dark-border flex items-center justify-center text-[9px] text-slate-600 dark:text-dark-muted font-bold border border-white dark:border-dark-card shadow-sm">
                             {item.author.charAt(0)}
                           </div>
                           <span className="text-xs text-slate-500 dark:text-dark-muted font-medium hover:text-slate-800 dark:hover:text-dark-text transition-colors">{item.author}</span>
                           <span className="text-xs text-slate-300 dark:text-dark-border mx-1">•</span>
                           <span className="text-xs text-slate-400 dark:text-dark-muted flex items-center gap-1">
                              {item.updatedAt}
                           </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-dark-muted font-medium">
                           <span className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-dark-text transition-colors">
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
                  <div className="col-span-full py-12 text-center bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border">
                      <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-dark-hover rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-dark-muted">
                          {listType === 'skill' ? <Terminal size={32}/> : <Box size={32}/>}
                      </div>
                      <h3 className="text-slate-900 dark:text-dark-text font-bold text-lg mb-1">暂无 {listType === 'skill' ? 'Skills' : 'MCP Servers'}</h3>
                      <p className="text-slate-500 dark:text-dark-muted text-sm">该分类下暂无内容，换个分类试试？</p>
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
