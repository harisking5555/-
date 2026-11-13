import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { GalleryItem, PageId } from './data/jamiaData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GalleryLightbox } from './components/GalleryLightbox';
import { HomePage } from './pages/HomePage';
import { SubPages } from './pages/SubPages';

const VALID_PAGES: PageId[] = [
  'home',
  'about',
  'departments',
  'classes',
  'darul-ifta',
  'results',
  'ceremony',
  'gallery',
  'donations',
];

function getPageFromHash(): PageId {
  const raw = window.location.hash.replace(/^#\/?/, '').trim() as PageId;
  return VALID_PAGES.includes(raw) ? raw : 'home';
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(() => getPageFromHash());
  const [lightboxState, setLightboxState] = useState<{
    items: GalleryItem[];
    index: number | null;
  }>({ items: [], index: null });

  useEffect(() => {
    const onHashChange = () => {
      setActivePage(getPageFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    const nextHash = page === 'home' ? '#/' : `#/${page}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLightbox = (items: GalleryItem[], index: number) => {
    setLightboxState({ items, index });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#FAF8F4] text-[#0A110E]">
        <Navbar activePage={activePage} onNavigate={handleNavigate} />

        <main>
          {activePage === 'home' ? (
            <HomePage onNavigate={handleNavigate} onOpenLightbox={handleOpenLightbox} />
          ) : (
            <SubPages
              page={activePage}
              onNavigate={handleNavigate}
              onOpenLightbox={handleOpenLightbox}
            />
          )}
        </main>

        <Footer onNavigate={handleNavigate} />

        <GalleryLightbox
          items={lightboxState.items}
          activeIndex={lightboxState.index}
          onClose={() => setLightboxState({ items: [], index: null })}
          onChangeIndex={(index) =>
            setLightboxState((prev) => ({ ...prev, index }))
          }
        />
      </div>
    </MotionConfig>
  );
}
