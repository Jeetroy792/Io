'use client';

import { useState, useCallback, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import MobileSidebarDrawer from './sidebar/MobileSidebarDrawer';
import ChatArea from './ChatArea';
import { ModelId } from '@/types/chat';

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>('chatgpt-v5');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full bg-[#0d0d0d] overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((p) => !p)} />
      )}

      {/* Mobile Drawer */}
      <MobileSidebarDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <ChatArea
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={!sidebarOpen}
          onMobileMenuOpen={() => setMobileOpen(true)}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
