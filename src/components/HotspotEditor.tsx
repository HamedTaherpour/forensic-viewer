"use client";

import { useState, useEffect } from "react";
import { HotspotDTO, HotspotShapeType } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HotspotEditorProps {
  hotspot: HotspotDTO | null;
  onSave: (hotspot: HotspotDTO) => void;
  onDelete: (hotspotId: string) => void;
  onClose: () => void;
  onCreateNew: () => void;
  isNewHotspot?: boolean;
}

const HotspotEditor: React.FC<HotspotEditorProps> = ({
  hotspot,
  onSave,
  onDelete,
  onClose,
  onCreateNew,
  isNewHotspot = false,
}) => {
  const [editedHotspot, setEditedHotspot] = useState<HotspotDTO | null>(
    hotspot
  );

  useEffect(() => {
    setEditedHotspot(hotspot);
  }, [hotspot]);

  if (!editedHotspot) {
    return (
      <div className="w-80 bg-background border-r border-border p-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Hotspot Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Select a hotspot or create a new one
            </p>
            <Button onClick={onCreateNew} className="w-full">
              ➕ Create New Hotspot
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateField = <K extends keyof HotspotDTO>(
    field: K,
    value: HotspotDTO[K]
  ) => {
    setEditedHotspot((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const updateShapeField = <K extends keyof HotspotDTO["shape"]>(
    field: K,
    value: HotspotDTO["shape"][K]
  ) => {
    setEditedHotspot((prev) =>
      prev
        ? {
            ...prev,
            shape: { ...prev.shape, [field]: value },
          }
        : null
    );
  };

  const updatePolygonPoint = (
    index: number,
    axis: "x" | "y",
    value: number
  ) => {
    if (!editedHotspot.shape.points) return;
    const newPoints = [...editedHotspot.shape.points];
    newPoints[index] = { ...newPoints[index], [axis]: value };
    updateShapeField("points", newPoints);
  };

  const addPolygonPoint = () => {
    const points = editedHotspot.shape.points || [];
    const newPoint =
      points.length > 0 ? { ...points[points.length - 1] } : { x: 0, y: 0 };
    updateShapeField("points", [...points, newPoint]);
  };

  const removePolygonPoint = (index: number) => {
    if (!editedHotspot.shape.points || editedHotspot.shape.points.length <= 3) {
      alert("Polygon must have at least 3 points");
      return;
    }
    const newPoints = editedHotspot.shape.points.filter((_, i) => i !== index);
    updateShapeField("points", newPoints);
  };

  const changeShapeType = (newType: HotspotShapeType) => {
    let newShape = { ...editedHotspot.shape, type: newType };

    // Set default values based on shape type
    switch (newType) {
      case "circle":
        newShape = { ...newShape, radius: 30 };
        delete newShape.width;
        delete newShape.height;
        delete newShape.points;
        break;
      case "square":
        newShape = { ...newShape, width: 50 };
        delete newShape.radius;
        delete newShape.height;
        delete newShape.points;
        break;
      case "rectangle":
        newShape = { ...newShape, width: 60, height: 40 };
        delete newShape.radius;
        delete newShape.points;
        break;
      case "polygon":
        newShape = {
          ...newShape,
          points: [
            { x: 0, y: 20 },
            { x: 20, y: 0 },
            { x: 40, y: 20 },
            { x: 20, y: 40 },
          ],
        };
        delete newShape.radius;
        delete newShape.width;
        delete newShape.height;
        break;
    }

    setEditedHotspot((prev) => (prev ? { ...prev, shape: newShape } : null));
  };

  const handleSave = () => {
    if (!editedHotspot) return;
    onSave(editedHotspot);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this hotspot?")) {
      onDelete(editedHotspot.id);
    }
  };

  return (
    <div className="w-80 bg-background border-r border-border p-4 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {isNewHotspot ? "New Hotspot" : "Edit Hotspot"}
        </h2>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          ✕
        </Button>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold border-b pb-1.5">
            Basic Info
          </h3>

          <div>
            <Label htmlFor="hotspot-id">ID</Label>
            <Input
              id="hotspot-id"
              type="text"
              value={editedHotspot.id}
              onChange={(e) => updateField("id", e.target.value)}
              placeholder="e.g., weapon, evidence1"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="hotspot-title">Title</Label>
            <Input
              id="hotspot-title"
              type="text"
              value={editedHotspot.text}
              onChange={(e) => updateField("text", e.target.value)}
              placeholder="e.g., Crime Weapon"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="hotspot-description">Description (Optional)</Label>
            <textarea
              id="hotspot-description"
              value={editedHotspot.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1.5 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
              placeholder="Additional details..."
            />
          </div>
        </div>

        <Separator />

        {/* Position */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold border-b pb-1.5">Position</h3>

          <div>
            <Label>Pitch (Vertical): {editedHotspot.pitch}°</Label>
            <input
              type="range"
              min="-90"
              max="90"
              value={editedHotspot.pitch}
              onChange={(e) => updateField("pitch", parseFloat(e.target.value))}
              className="w-full mt-1.5"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>-90° (Down)</span>
              <span>0° (Horizon)</span>
              <span>90° (Up)</span>
            </div>
          </div>

          <div>
            <Label>Yaw (Horizontal): {editedHotspot.yaw}°</Label>
            <input
              type="range"
              min="-180"
              max="180"
              value={editedHotspot.yaw}
              onChange={(e) => updateField("yaw", parseFloat(e.target.value))}
              className="w-full mt-1.5"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>-180° (Left)</span>
              <span>0° (Front)</span>
              <span>180° (Right)</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Shape Type */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold border-b pb-1.5">
            Shape Type
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {(
              ["circle", "square", "rectangle", "polygon"] as HotspotShapeType[]
            ).map((type) => (
              <Button
                key={type}
                onClick={() => changeShapeType(type)}
                variant={
                  editedHotspot.shape.type === type ? "default" : "outline"
                }
                size="sm"
              >
                {type === "circle" && "⭕ Circle"}
                {type === "square" && "◻️ Square"}
                {type === "rectangle" && "▭ Rectangle"}
                {type === "polygon" && "⬡ Polygon"}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shape Properties */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold border-b pb-1.5">
            Shape Settings
          </h3>

          {/* Circle */}
          {editedHotspot.shape.type === "circle" && (
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Radius: {editedHotspot.shape.radius || 25}px
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={editedHotspot.shape.radius || 25}
                onChange={(e) =>
                  updateShapeField("radius", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          )}

          {/* Square */}
          {editedHotspot.shape.type === "square" && (
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Width: {editedHotspot.shape.width || 50}px
              </label>
              <input
                type="range"
                min="20"
                max="150"
                value={editedHotspot.shape.width || 50}
                onChange={(e) =>
                  updateShapeField("width", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          )}

          {/* Rectangle */}
          {editedHotspot.shape.type === "rectangle" && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Width: {editedHotspot.shape.width || 60}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={editedHotspot.shape.width || 60}
                  onChange={(e) =>
                    updateShapeField("width", parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Height: {editedHotspot.shape.height || 40}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={editedHotspot.shape.height || 40}
                  onChange={(e) =>
                    updateShapeField("height", parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Polygon Points Editor */}
          {editedHotspot.shape.type === "polygon" &&
            editedHotspot.shape.points && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium">
                    Polygon Points
                  </label>
                  <button
                    onClick={addPolygonPoint}
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                  >
                    ➕ Add Point
                  </button>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {editedHotspot.shape.points.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-1.5 bg-foreground/5 rounded-lg"
                    >
                      <span className="text-xs font-medium w-6">
                        #{index + 1}
                      </span>
                      <div className="flex-1 grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-xs text-foreground/70">
                            X
                          </label>
                          <input
                            type="number"
                            value={point.x}
                            onChange={(e) =>
                              updatePolygonPoint(
                                index,
                                "x",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-1.5 py-1 text-xs border border-foreground/20 rounded bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/70">
                            Y
                          </label>
                          <input
                            type="number"
                            value={point.y}
                            onChange={(e) =>
                              updatePolygonPoint(
                                index,
                                "y",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-1.5 py-1 text-xs border border-foreground/20 rounded bg-background"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removePolygonPoint(index)}
                        className="px-1.5 py-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        disabled={editedHotspot.shape.points!.length <= 3}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-foreground/50 mt-1.5">
                  💡 Tip: Polygon must have at least 3 points
                </p>
              </div>
            )}
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold border-b pb-1.5">Colors</h3>

          <div>
            <label className="block text-xs font-medium mb-1.5">
              Fill Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={
                  editedHotspot.shape.color?.match(/#[0-9A-Fa-f]{6}/)?.[0] ||
                  "#3b82f6"
                }
                onChange={(e) => {
                  const opacity = editedHotspot.shape.opacity || 0.3;
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  updateShapeField(
                    "color",
                    `rgba(${r}, ${g}, ${b}, ${opacity})`
                  );
                }}
                className="w-14 h-9 rounded border border-foreground/20 cursor-pointer"
              />
              <input
                type="text"
                value={editedHotspot.shape.color || "rgba(59, 130, 246, 0.3)"}
                onChange={(e) => updateShapeField("color", e.target.value)}
                className="flex-1 px-2.5 py-1.5 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                placeholder="rgba(59, 130, 246, 0.3)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">
              Border Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={editedHotspot.shape.borderColor || "#3b82f6"}
                onChange={(e) =>
                  updateShapeField("borderColor", e.target.value)
                }
                className="w-14 h-9 rounded border border-foreground/20 cursor-pointer"
              />
              <input
                type="text"
                value={editedHotspot.shape.borderColor || "#3b82f6"}
                onChange={(e) =>
                  updateShapeField("borderColor", e.target.value)
                }
                className="flex-1 px-2.5 py-1.5 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">
              Border Width: {editedHotspot.shape.borderWidth || 3}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={editedHotspot.shape.borderWidth || 3}
              onChange={(e) =>
                updateShapeField("borderWidth", parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">
              Opacity: {((editedHotspot.shape.opacity || 0.7) * 100).toFixed(0)}
              %
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={editedHotspot.shape.opacity || 0.7}
              onChange={(e) =>
                updateShapeField("opacity", parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2 pt-3">
          <Button onClick={handleSave} className="w-full">
            💾 Save Changes
          </Button>

          {!isNewHotspot && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full"
            >
              🗑️ Delete Hotspot
            </Button>
          )}

          <Button onClick={onClose} variant="outline" className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotspotEditor;
