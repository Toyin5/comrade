import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { OverlayControl } from "./components/OverlayControl";

interface Props {
  imageUrl: string;
  onBack?: () => void;
}

interface OverlayItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export const MemeEditor: React.FC<Props> = ({ imageUrl, onBack }) => {
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<HTMLImageElement | null>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const stageRef = useRef<any>(null);

  // Load overlay image
  useEffect(() => {
    const img = new Image();
    img.src = "/comrade.png";
    img.onload = () => setOverlayImage(img);
  }, []);

  // Load uploaded image + detect faces
  useEffect(() => {
    const process = async () => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        setUploadedImage(img);
        setLoading(true);
        try {
          await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
          const detections = await faceapi.detectAllFaces(img);
          const newOverlays = detections.map((d, i) => ({
            id: `face-${i}`,
            x: d.box.x,
            y: d.box.y - d.box.height * 0.5, // Adjust position slightly up
            width: d.box.width,
            height: d.box.height,
            rotation: 0,
          }));
          setOverlays(newOverlays);
        } catch (e) {
          console.error("Face detection failed:", e);
        }
        setLoading(false);
      };
    };
    process();
    process();
  }, [imageUrl]);

  // Handle keyboard deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId) {
        deleteOverlay(selectedId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId, overlays]); // Re-bind when selection or overlays change to ensure fresh state

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target.name() === "backgroundImage";
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const addOverlay = () => {
    if (!uploadedImage) return;
    const newOverlay: OverlayItem = {
      id: `manual-${Date.now()}`,
      x: uploadedImage.width / 2 - 50,
      y: uploadedImage.height / 2 - 50,
      width: 100,
      height: 100,
      rotation: 0,
    };
    setOverlays([...overlays, newOverlay]);
    selectShape(newOverlay.id);
  };

  const deleteOverlay = (id: string) => {
    setOverlays(overlays.filter((o) => o.id !== id));
    if (selectedId === id) selectShape(null);
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    // Deselect before export to hide transformer
    selectShape(null);
    setTimeout(() => {
      const uri = stageRef.current.toDataURL();
      const a = document.createElement("a");
      a.href = uri;
      a.download = "comrade-meme.png";
      a.click();
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white glass-panel rounded-3xl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-6"></div>
        <p className="text-xl font-medium animate-pulse">Detecting faces...</p>
      </div>
    );
  }

  if (!uploadedImage) return <p className="text-gray-400">Loading image...</p>;

  // Calculate stage dimensions to fit within container
  const maxWidth = Math.min(window.innerWidth - 48, 800); // padding
  const scale = Math.min(maxWidth / uploadedImage.width, 1);
  const stageWidth = uploadedImage.width * scale;
  const stageHeight = uploadedImage.height * scale;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full">
      {/* Canvas Area */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900">
        <Stage
          width={stageWidth}
          height={stageHeight}
          scaleX={scale}
          scaleY={scale}
          ref={stageRef}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            <KonvaImage image={uploadedImage} name="backgroundImage" />
            {overlayImage &&
              overlays.map((item) => (
                <OverlayControl
                  key={item.id}
                  shapeProps={item}
                  isSelected={item.id === selectedId}
                  image={overlayImage}
                  onSelect={() => selectShape(item.id)}
                  onChange={(newAttrs) => {
                    const newOverlays = overlays.slice();
                    const index = newOverlays.findIndex((o) => o.id === item.id);
                    newOverlays[index] = newAttrs;
                    setOverlays(newOverlays);
                  }}
                  onDelete={() => deleteOverlay(item.id)}
                />
              ))}
          </Layer>
        </Stage>
      </div>

      {/* Controls Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Tools</h3>
          
          <button
            onClick={addOverlay}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <span>➕</span> Add Comrade
          </button>

          <button
            onClick={() => setOverlays([])}
            className="w-full btn-secondary flex items-center justify-center gap-2 text-red-300 border-red-900/50 hover:bg-red-900/20"
          >
            <span>🗑️</span> Clear All
          </button>

          <div className="h-px bg-gray-700 my-4"></div>

          <button
            onClick={handleExport}
            className="w-full btn-primary bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-none"
          >
            <span>💾</span> Export Meme
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full btn-secondary mt-2"
            >
              ← Choose Another Image
            </button>
          )}
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Tips</h3>
          <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
            <li>Click a comrade to select</li>
            <li>Drag corners to resize</li>
            <li>Drag rotate handle to spin</li>
            <li>Click empty space to deselect</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
