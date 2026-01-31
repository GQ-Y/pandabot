import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Listing from './pages/Listing';
import Detail from './pages/Detail';
import Submit from './pages/Submit';
import Admin from './pages/Admin';
import { PageView, Item } from './types';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [previousPage, setPreviousPage] = useState<PageView>('skills');

  const navigateTo = (page: PageView) => {
    window.scrollTo(0, 0);
    if (page !== 'detail' && currentPage !== 'detail') {
      setPreviousPage(currentPage);
    }
    setCurrentPage(page);
    if (page !== 'detail') {
      setSelectedItem(null);
    }
  };

  const handleSelectItem = (item: Item) => {
    setPreviousPage(currentPage);
    setSelectedItem(item);
    navigateTo('detail');
  };

  const handleBackFromDetail = () => {
    navigateTo(previousPage === 'mcp' ? 'mcp' : 'skills');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigateTo} onSelectItem={handleSelectItem} />;
      case 'skills':
        return <Listing listType="skill" onSelectItem={handleSelectItem} />;
      case 'mcp':
        return <Listing listType="mcp" onSelectItem={handleSelectItem} />;
      case 'detail':
        return selectedItem ? (
          <Detail item={selectedItem} onBack={handleBackFromDetail} />
        ) : (
          <Listing listType="skill" onSelectItem={handleSelectItem} />
        );
      case 'submit':
        return <Submit />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onNavigate={navigateTo} onSelectItem={handleSelectItem} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={navigateTo}>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
