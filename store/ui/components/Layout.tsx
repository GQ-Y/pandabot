import React, { useState, useEffect } from 'react';
import { Menu, Search, X, Bot, PlusCircle, Globe, Github, Twitter, Mail, BookOpen, Layers, MessageCircle, Lock, User, Key, Upload } from 'lucide-react';
import { PageView } from '../types';
import { Button, Input } from './Common';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  // Keyboard shortcut listener for Ctrl + O
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogin = () => {
    // Mock login logic
    if (username && password) {
        setIsLoginModalOpen(false);
        onNavigate('admin');
        // Reset fields
        setUsername('');
        setPassword('');
    } else {
        // Just for demo, allow empty login to go through if user just clicks button, 
        // or strictly require input. Let's strictly require input for visual feedback.
        if(!username || !password) return; // Simple validation
        setIsLoginModalOpen(false);
        onNavigate('admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16 shadow-sm shadow-slate-200/50">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left Section: Logo & Nav */}
            <div className="flex items-center gap-8">
              <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={() => handleNav('home')}
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Bot size={20} fill="currentColor" className="text-white" />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">
                        Pandabot
                        </span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                            STORE
                        </span>
                    </div>
                    <span className="text-[10px] text-gray-400 -mt-0.5 tracking-wider scale-90 origin-left">SKILLS & MCPS</span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <button 
                  onClick={() => handleNav('home')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${currentPage === 'home' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  首页
                </button>
                <button 
                  onClick={() => handleNav('skills')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${currentPage === 'skills' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Skills
                </button>
                <button 
                  onClick={() => handleNav('mcp')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${currentPage === 'mcp' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  MCP Servers
                </button>
                 <button 
                  className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all"
                >
                  文档
                </button>
              </nav>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200 focus-within:border-purple-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-100 transition-all w-64">
                 <Search size={15} className="text-gray-400 mr-2" />
                 <input 
                    type="text" 
                    placeholder="搜索 Skills, MCPs..." 
                    className="bg-transparent border-none focus:outline-none text-sm w-full placeholder-gray-400 text-slate-700"
                 />
                 <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 bg-white">⌘K</span>
                 </div>
              </div>

              <div className="flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
                 <button className="p-2 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Globe size={18} />
                 </button>
                 {/* Replaced Login/Register with Submit Button */}
                 <Button 
                    variant="primary" 
                    size="sm" 
                    icon={Upload}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 hidden md:inline-flex shadow-lg shadow-slate-200"
                    onClick={() => handleNav('submit')}
                 >
                    提交插件
                 </Button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-slate-600 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar/Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                 <Bot size={20} className="text-purple-600" fill="currentColor"/>
                 <span className="text-lg font-bold text-slate-900">Pandabot</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                    <input type="text" placeholder="搜索..." className="w-full bg-gray-50 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                </div>
              </div>
              <button onClick={() => handleNav('home')} className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-purple-50 text-slate-600 hover:text-purple-700 font-medium">
                首页
              </button>
              <button onClick={() => handleNav('skills')} className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-purple-50 text-slate-600 hover:text-purple-700 font-medium">
                Skills
              </button>
              <button onClick={() => handleNav('mcp')} className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-purple-50 text-slate-600 hover:text-purple-700 font-medium">
                MCP Servers
              </button>
              <div className="border-t border-gray-100 my-4 pt-4">
                  <button onClick={() => handleNav('submit')} className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-purple-600 text-white font-medium shadow-md shadow-purple-200">
                    <PlusCircle size={18} className="mr-2"/> 提交插件
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal (Triggered by Ctrl+O) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 p-8 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                <Lock size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">管理员登录</h2>
              <p className="text-sm text-slate-500 mt-1">请输入您的管理员凭证</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            <Button onClick={handleLogin} className="w-full mt-6 py-2.5" variant="primary">
              登录后台
            </Button>
            
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="w-full mt-3 text-sm text-slate-400 hover:text-slate-600 py-1"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                
                {/* Brand Column */}
                <div className="lg:col-span-2 space-y-6 pr-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-white">
                             <Bot size={20} fill="currentColor" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">Pandabot Store</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed max-w-sm">
                        下一代 AI Agent 扩展平台。汇聚高质量 Skills 与 MCP Servers，赋予 Pandabot 连接万物的能力。
                    </p>
                    <div className="flex gap-4">
                        <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                            <Github size={18} />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all">
                            <Twitter size={18} />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all">
                            <Mail size={18} />
                        </button>
                    </div>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Layers size={16} className="text-purple-600"/> 发现资源
                    </h4>
                    <ul className="space-y-3 text-slate-500">
                        <li><a href="#" className="hover:text-purple-600 transition-colors">热门 Skills</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">最新 MCP Servers</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">精选集合</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">作者排行榜</a></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-600"/> 开发者中心
                    </h4>
                    <ul className="space-y-3 text-slate-500">
                        <li><a href="#" className="hover:text-purple-600 transition-colors">Skill 开发文档</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">MCP 协议规范</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">发布指南</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">CLI 工具</a></li>
                    </ul>
                </div>

                {/* Links Column 3 */}
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <MessageCircle size={16} className="text-green-600"/> 社区支持
                    </h4>
                    <ul className="space-y-3 text-slate-500">
                        <li><a href="#" className="hover:text-purple-600 transition-colors">Discord 社区</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">GitHub Discussions</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">功能建议</a></li>
                        <li><a href="#" className="hover:text-purple-600 transition-colors">联系我们</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs text-slate-400">
                    <span>© 2026 Pandabot Inc. All rights reserved.</span>
                    <span className="hidden md:inline">|</span>
                    <a href="#" className="hover:text-slate-600">服务条款</a>
                    <a href="#" className="hover:text-slate-600">隐私政策</a>
                </div>
                <div className="flex gap-6 text-xs text-slate-500 font-medium">
                    <span>v2.4.0-beta</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
