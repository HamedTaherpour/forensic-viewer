"use client";

import PanoramaViewerAdvanced from "@/components/PanoramaViewerAdvanced";
import HotspotEditor from "@/components/HotspotEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, useEffect } from "react";
import { panoramaService } from "@/services/panorama.service";
import { PanoramaDTO, HotspotDTO } from "@/types/api";

const Home = () => {
  const [panoramas, setPanoramas] = useState<PanoramaDTO[]>([]);
  const [selectedPanorama, setSelectedPanorama] = useState<PanoramaDTO | null>(
    null
  );
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [loadStatus, setLoadStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotDTO | null>(
    null
  );
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
          setDataError("No panoramas found");
        }
      } catch (error) {
        console.error("Error fetching panoramas:", error);
        setDataError("Failed to load panoramas");
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
      : selectedPanorama.hotspots.map((h) =>
          h.id === updatedHotspot.id ? updatedHotspot : h
        );

    const updatedPanorama = { ...selectedPanorama, hotspots: updatedHotspots };
    setSelectedPanorama(updatedPanorama);

    // Update in panoramas list
    setPanoramas((prevPanoramas) =>
      prevPanoramas.map((p) =>
        p.id === updatedPanorama.id ? updatedPanorama : p
      )
    );

    setSelectedHotspot(null);
    setIsNewHotspot(false);

    alert("✅ Changes saved successfully!");
  };

  // Handle hotspot delete
  const handleDeleteHotspot = (hotspotId: string) => {
    if (!selectedPanorama) return;

    const updatedHotspots = selectedPanorama.hotspots.filter(
      (h) => h.id !== hotspotId
    );
    const updatedPanorama = { ...selectedPanorama, hotspots: updatedHotspots };

    setSelectedPanorama(updatedPanorama);
    setPanoramas((prevPanoramas) =>
      prevPanoramas.map((p) =>
        p.id === updatedPanorama.id ? updatedPanorama : p
      )
    );

    setSelectedHotspot(null);
    setIsNewHotspot(false);

    alert("🗑️ Hotspot deleted successfully!");
  };

  // Handle create new hotspot
  const handleCreateNewHotspot = () => {
    const newHotspot: HotspotDTO = {
      id: `hotspot_${Date.now()}`,
      pitch: 0,
      yaw: 0,
      type: "info",
      text: "New Hotspot",
      description: "",
      shape: {
        type: "circle",
        radius: 30,
        color: "rgba(59, 130, 246, 0.3)",
        borderColor: "#3b82f6",
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
      console.log("Hotspot clicked:", hotspot);
      alert(`📍 ${hotspot.text}\n\n${hotspot.description || ""}`);
    }
  };

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-3" />
          <p className="text-base text-foreground/70">Loading data...</p>
          <p className="text-xs text-foreground/50 mt-1">
            Fetching panorama images from service
          </p>
        </div>
      </div>
    );
  }

  // Show error state if data fetch failed
  if (dataError || !selectedPanorama) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-500/10 rounded-lg max-w-md">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Loading Error</h2>
          <p className="text-foreground/70 mb-3">
            {dataError || "No data found"}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className={`flex ${editMode ? "h-screen" : ""}`}>
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
        <div
          className={`flex-1 ${editMode ? "overflow-y-auto" : "p-3 sm:p-6"}`}
        >
          <div className={editMode ? "p-3 sm:p-4" : "max-w-7xl mx-auto"}>
            {/* Header */}
            <header className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    360° Panorama Viewer
                  </h1>
                  <p className="text-sm text-foreground/70 mb-2">
                    {editMode
                      ? "🔧 Edit Mode: Click on hotspots or create a new one"
                      : "Drag the image with your mouse or touch to rotate. Use scroll or +/- buttons to zoom."}
                  </p>
                </div>

                {/* Edit Mode Toggle */}
                <Button
                  onClick={() => {
                    setEditMode(!editMode);
                    setSelectedHotspot(null);
                    setIsNewHotspot(false);
                  }}
                  variant={editMode ? "default" : "destructive"}
                  size="sm"
                  className={editMode ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {editMode ? (
                    <>
                      <span>✓</span>
                      <span>View Mode</span>
                    </>
                  ) : (
                    <>
                      <span>✏️</span>
                      <span>Edit Mode</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={
                    loadStatus === "loaded"
                      ? "default"
                      : loadStatus === "loading"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-1 ${
                      loadStatus === "loading"
                        ? "bg-yellow-500 animate-pulse"
                        : loadStatus === "loaded"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  {loadStatus === "loading"
                    ? "Loading..."
                    : loadStatus === "loaded"
                    ? "Loaded"
                    : "Error"}
                </Badge>

                {editMode && (
                  <Badge
                    variant="outline"
                    className="bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300"
                  >
                    <span>✏️</span>
                    <span className="ml-1">Edit Mode Active</span>
                  </Badge>
                )}
              </div>
            </header>

            <main className="space-y-4">
              {/* Main panorama viewer */}
              <div
                className={`w-full ${
                  editMode ? "h-[calc(100vh-180px)]" : "h-[550px]"
                } border border-foreground/10 rounded-lg shadow-lg overflow-hidden ${
                  editMode
                    ? "bg-orange-500/5 border-orange-500/30"
                    : "bg-black/5"
                }`}
              >
                <PanoramaViewerAdvanced
                  imageUrl={selectedPanorama.imageUrl}
                  autoLoad={true}
                  initialAutoRotate={false}
                  showControls={true}
                  mouseZoom={true}
                  hotspots={selectedPanorama.hotspots}
                  onLoad={() => setLoadStatus("loaded")}
                  onError={() => setLoadStatus("error")}
                  onHotspotClick={handleHotspotClick}
                  editMode={editMode}
                  selectedHotspotId={selectedHotspot?.id}
                />
              </div>

              {/* Panorama info */}
              {!editMode && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {selectedPanorama.title}
                    </CardTitle>
                    <CardDescription>
                      360-degree panorama image - Click thumbnails below to
                      switch
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {/* Hotspots list in view mode */}
              {!editMode &&
                selectedPanorama.hotspots &&
                selectedPanorama.hotspots.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold">
                      Points of Interest:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {selectedPanorama.hotspots.map((hotspot) => {
                        return (
                          <Card
                            key={hotspot.id}
                            className="hover:bg-accent transition-colors"
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2">
                                <div className="text-2xl flex-shrink-0">📍</div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-xs">
                                    {hotspot.text}
                                  </h4>
                                  {hotspot.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {hotspot.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    <p className="text-xs text-foreground/60 text-center">
                      💡 Tip: Hover over blue points in the image to see more
                      information
                    </p>
                  </div>
                )}

              {/* Hotspots list in edit mode */}
              {editMode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      Hotspots ({selectedPanorama.hotspots.length})
                    </h3>
                    <Button onClick={handleCreateNewHotspot} size="sm">
                      ➕ New Hotspot
                    </Button>
                  </div>
                  {selectedPanorama.hotspots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {selectedPanorama.hotspots.map((hotspot) => {
                        const isSelected = selectedHotspot?.id === hotspot.id;
                        return (
                          <button
                            key={hotspot.id}
                            onClick={() => {
                              setSelectedHotspot(hotspot);
                              setIsNewHotspot(false);
                            }}
                            className={`flex items-start gap-2 p-2 rounded-lg transition-all text-left ${
                              isSelected
                                ? "bg-blue-500 text-white shadow-lg scale-105"
                                : "bg-foreground/5 hover:bg-foreground/10"
                            }`}
                          >
                            <div className="text-xl flex-shrink-0">
                              {hotspot.shape.type === "circle" && "⭕"}
                              {hotspot.shape.type === "square" && "◻️"}
                              {hotspot.shape.type === "rectangle" && "▭"}
                              {hotspot.shape.type === "polygon" && "⬡"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs truncate">
                                {hotspot.text}
                              </h4>
                              <p
                                className={`text-xs mt-0.5 ${
                                  isSelected
                                    ? "text-white/80"
                                    : "text-foreground/70"
                                }`}
                              >
                                Pitch: {hotspot.pitch}° | Yaw: {hotspot.yaw}°
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground mb-2 text-sm">
                          No hotspots yet
                        </p>
                        <Button onClick={handleCreateNewHotspot}>
                          ➕ Create First Hotspot
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Panorama gallery/thumbnails */}
              {!editMode && panoramas.length > 1 && (
                <div className="space-y-3">
                  <h3 className="text-base font-semibold">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {panoramas.map((pano) => (
                      <button
                        key={pano.id}
                        onClick={() => setSelectedPanorama(pano)}
                        className={`
                          relative aspect-video rounded-lg overflow-hidden
                          border-2 transition-all hover:scale-105 hover:shadow-lg
                          ${
                            selectedPanorama.id === pano.id
                              ? "border-blue-500 shadow-lg ring-2 ring-blue-300"
                              : "border-foreground/10 hover:border-foreground/30"
                          }
                        `}
                      >
                        <Image
                          src={pano.thumbnailUrl || pano.imageUrl}
                          alt={pano.title}
                          fill
                          className="object-cover size-52"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2 text-xs font-medium">
                          {pano.title}
                        </div>
                        {selectedPanorama.id === pano.id && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
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
