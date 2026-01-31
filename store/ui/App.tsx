import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Listing from './pages/Listing';
import Detail from './pages/Detail';
import Submit from './pages/Submit';
import Admin from './pages/Admin';
import { PageView, Item } from './types';
import { MOCK_ITEMS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const navigateTo = (page: PageView) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    if (page !== 'detail') {
      setSelectedItem(null);
    }
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    navigateTo('detail');
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
          <Detail item={selectedItem} onBack={() => navigateTo('skills')} /> // Default back to skills, but logical flow might vary
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

export default App;
