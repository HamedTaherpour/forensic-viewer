'use client';

import PanoramaViewerAdvanced from '@/components/PanoramaViewerAdvanced';
import HotspotEditor from '@/components/HotspotEditor';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { panoramaService } from '@/services/panorama.service';
import { PanoramaDTO, HotspotDTO } from '@/types/api';

const Home = () => {
  const [panoramas, setPanoramas] = useState<PanoramaDTO[]>([]);
  const [selectedPanorama, setSelectedPanorama] = useState<PanoramaDTO | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  
  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotDTO | null>(null);
  const [isNewHotspot, setIsNewHotspot] = useState(false);

  // Fetch panoramas from service on component mount
  useEffect(() => {
    const fetchPanoramas = async () => {
      try {
        setIsLoadingData(true);
        setDataError(null);
        const response = await panoramaService.getAllPanoramas();
        
        if (response.success && response.data.length > 0) {
          setPanoramas(response.data);
          setSelectedPanorama(response.data[0]);
        } else {
          setDataError('No panoramas found');
        }
      } catch (error) {
        console.error('Error fetching panoramas:', error);
        setDataError('Failed to load panoramas');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPanoramas();
  }, []);

  // Handle hotspot save
  const handleSaveHotspot = (updatedHotspot: HotspotDTO) => {
    if (!selectedPanorama) return;

    const updatedHotspots = isNewHotspot
      ? [...selectedPanorama.hotspots, updatedHotspot]
      : selectedPanorama.hotspots.map((h) => (h.id === updatedHotspot.id ? updatedHotspot : h));

    const updatedPanorama = { ...selectedPanorama, hotspots: updatedHotspots };
    setSelectedPanorama(updatedPanorama);
    
    // Update in panoramas list
    setPanoramas((prevPanoramas) =>
      prevPanoramas.map((p) => (p.id === updatedPanorama.id ? updatedPanorama : p))
    );

    setSelectedHotspot(null);
    setIsNewHotspot(false);
    
    alert('✅ تغییرات با موفقیت ذخیره شد!');
  };

  // Handle hotspot delete
  const handleDeleteHotspot = (hotspotId: string) => {
    if (!selectedPanorama) return;

    const updatedHotspots = selectedPanorama.hotspots.filter((h) => h.id !== hotspotId);
    const updatedPanorama = { ...selectedPanorama, hotspots: updatedHotspots };
    
    setSelectedPanorama(updatedPanorama);
    setPanoramas((prevPanoramas) =>
      prevPanoramas.map((p) => (p.id === updatedPanorama.id ? updatedPanorama : p))
    );

    setSelectedHotspot(null);
    setIsNewHotspot(false);
    
    alert('🗑️ Hotspot با موفقیت حذف شد!');
  };

  // Handle create new hotspot
  const handleCreateNewHotspot = () => {
    const newHotspot: HotspotDTO = {
      id: `hotspot_${Date.now()}`,
      pitch: 0,
      yaw: 0,
      type: 'info',
      text: 'Hotspot جدید',
      description: '',
      shape: {
        type: 'circle',
        radius: 30,
        color: 'rgba(59, 130, 246, 0.3)',
        borderColor: '#3b82f6',
        borderWidth: 3,
        opacity: 0.7,
      },
    };
    
    setSelectedHotspot(newHotspot);
    setIsNewHotspot(true);
  };

  // Handle hotspot click in view/edit mode
  const handleHotspotClick = (hotspot: HotspotDTO) => {
    if (editMode) {
      setSelectedHotspot(hotspot);
      setIsNewHotspot(false);
    } else {
      console.log('Hotspot clicked:', hotspot);
      alert(`📍 ${hotspot.text}\n\n${hotspot.description || ''}`);
    }
  };

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-foreground/70">در حال بارگذاری داده‌ها...</p>
          <p className="text-sm text-foreground/50 mt-2">در حال دریافت تصاویر پانارومای از سرویس</p>
        </div>
      </div>
    );
  }

  // Show error state if data fetch failed
  if (dataError || !selectedPanorama) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/10 rounded-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">خطا در بارگذاری</h2>
          <p className="text-foreground/70 mb-4">{dataError || 'داده‌ای یافت نشد'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className={`flex ${editMode ? 'h-screen' : ''}`}>
        {/* Hotspot Editor Sidebar - shown in edit mode */}
        {editMode && (
          <HotspotEditor
            hotspot={selectedHotspot}
            onSave={handleSaveHotspot}
            onDelete={handleDeleteHotspot}
            onClose={() => {
              setSelectedHotspot(null);
              setIsNewHotspot(false);
            }}
            onCreateNew={handleCreateNewHotspot}
            isNewHotspot={isNewHotspot}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 ${editMode ? 'overflow-y-auto' : 'p-4 sm:p-8'}`}>
          <div className={editMode ? 'p-4 sm:p-6' : 'max-w-7xl mx-auto'}>
            {/* Header */}
            <header className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    نمایشگر پانارومای 360 درجه
                  </h1>
                  <p className="text-foreground/70 mb-3">
                    {editMode
                      ? '🔧 حالت ویرایش: روی hotspot‌ها کلیک کنید یا hotspot جدید بسازید'
                      : 'برای چرخش، عکس را با ماوس بکشید یا روی موبایل لمس کنید. برای زوم از اسکرول یا دکمه‌های + و - استفاده کنید.'}
                  </p>
                </div>
                
                {/* Edit Mode Toggle */}
                <button
                  onClick={() => {
                    setEditMode(!editMode);
                    setSelectedHotspot(null);
                    setIsNewHotspot(false);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
                    editMode
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
                  }`}
                >
                  {editMode ? (
                    <>
                      <span>✓</span>
                      <span>حالت مشاهده</span>
                    </>
                  ) : (
                    <>
                      <span>✏️</span>
                      <span>حالت ویرایش</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-full text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      loadStatus === 'loading'
                        ? 'bg-yellow-500 animate-pulse'
                        : loadStatus === 'loaded'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span>
                    {loadStatus === 'loading'
                      ? 'در حال بارگذاری...'
                      : loadStatus === 'loaded'
                      ? 'بارگذاری موفق'
                      : 'خطا در بارگذاری'}
                  </span>
                </div>
                
                {editMode && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-700 dark:text-orange-300">
                    <span>✏️</span>
                    <span>حالت ویرایش فعال</span>
                  </div>
                )}
              </div>
            </header>

            <main className="space-y-6">
              {/* Main panorama viewer */}
              <div className={`w-full ${editMode ? 'h-[calc(100vh-200px)]' : 'h-[650px]'} border border-foreground/10 rounded-lg shadow-lg overflow-hidden ${editMode ? 'bg-orange-500/5 border-orange-500/30' : 'bg-black/5'}`}>
                <PanoramaViewerAdvanced
                  imageUrl={selectedPanorama.imageUrl}
                  autoLoad={true}
                  initialAutoRotate={false}
                  showControls={true}
                  mouseZoom={true}
                  hotspots={selectedPanorama.hotspots}
                  onLoad={() => setLoadStatus('loaded')}
                  onError={() => setLoadStatus('error')}
                  onHotspotClick={handleHotspotClick}
                  editMode={editMode}
                  selectedHotspotId={selectedHotspot?.id}
                />
              </div>

              {/* Panorama info */}
              {!editMode && (
                <div className="p-4 bg-foreground/5 rounded-lg">
                  <h2 className="text-xl font-bold">{selectedPanorama.title}</h2>
                  <p className="text-sm text-foreground/70 mt-1">
                    تصویر پانارومای 360 درجه - کلیک روی تصاویر پایین برای تغییر
                  </p>
                </div>
              )}

              {/* Hotspots list in view mode */}
              {!editMode && selectedPanorama.hotspots && selectedPanorama.hotspots.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">نقاط علاقه در این تصویر:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {selectedPanorama.hotspots.map((hotspot) => {
                      return (
                        <div
                          key={hotspot.id}
                          className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
                        >
                          <div className="text-3xl flex-shrink-0">📍</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm">{hotspot.text}</h4>
                            {hotspot.description && (
                              <p className="text-xs text-foreground/70 mt-1">
                                {hotspot.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-foreground/60 text-center">
                    💡 نکته: ماوس را روی نقاط آبی داخل تصویر ببرید تا اطلاعات بیشتر را ببینید
                  </p>
                </div>
              )}

              {/* Hotspots list in edit mode */}
              {editMode && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      نقاط علاقه ({selectedPanorama.hotspots.length})
                    </h3>
                    <button
                      onClick={handleCreateNewHotspot}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
                    >
                      ➕ Hotspot جدید
                    </button>
                  </div>
                  {selectedPanorama.hotspots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedPanorama.hotspots.map((hotspot) => {
                        const isSelected = selectedHotspot?.id === hotspot.id;
                        return (
                          <button
                            key={hotspot.id}
                            onClick={() => {
                              setSelectedHotspot(hotspot);
                              setIsNewHotspot(false);
                            }}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all text-right ${
                              isSelected
                                ? 'bg-blue-500 text-white shadow-lg scale-105'
                                : 'bg-foreground/5 hover:bg-foreground/10'
                            }`}
                          >
                            <div className="text-2xl flex-shrink-0">
                              {hotspot.shape.type === 'circle' && '⭕'}
                              {hotspot.shape.type === 'square' && '◻️'}
                              {hotspot.shape.type === 'rectangle' && '▭'}
                              {hotspot.shape.type === 'polygon' && '⬡'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{hotspot.text}</h4>
                              <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-foreground/70'}`}>
                                Pitch: {hotspot.pitch}° | Yaw: {hotspot.yaw}°
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-foreground/5 rounded-lg">
                      <p className="text-foreground/50 mb-3">هیچ hotspot وجود ندارد</p>
                      <button
                        onClick={handleCreateNewHotspot}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                      >
                        ➕ اولین Hotspot را بسازید
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Panorama gallery/thumbnails */}
              {!editMode && panoramas.length > 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">گالری تصاویر</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {panoramas.map((pano) => (
                      <button
                        key={pano.id}
                        onClick={() => setSelectedPanorama(pano)}
                        className={`
                          relative aspect-video rounded-lg overflow-hidden
                          border-2 transition-all hover:scale-105 hover:shadow-lg
                          ${
                            selectedPanorama.id === pano.id
                              ? 'border-blue-500 shadow-lg ring-2 ring-blue-300'
                              : 'border-foreground/10 hover:border-foreground/30'
                          }
                        `}
                      >
                        <Image
                          src={pano.thumbnailUrl || pano.imageUrl}
                          alt={pano.title}
                          fill
                          className="object-cover size-52"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2 text-sm font-medium">
                          {pano.title}
                        </div>
                        {selectedPanorama.id === pano.id && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
