'use client';

import { useState, useEffect } from 'react';
import { HotspotDTO, HotspotShapeType } from '@/types/api';

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
  const [editedHotspot, setEditedHotspot] = useState<HotspotDTO | null>(hotspot);

  useEffect(() => {
    setEditedHotspot(hotspot);
  }, [hotspot]);

  if (!editedHotspot) {
    return (
      <div className="w-96 bg-background border-r border-foreground/10 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">ویرایشگر Hotspot</h2>
        <p className="text-foreground/70 mb-4">
          یک hotspot را انتخاب کنید یا hotspot جدید بسازید
        </p>
        <button
          onClick={onCreateNew}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          ➕ ساخت Hotspot جدید
        </button>
      </div>
    );
  }

  const updateField = <K extends keyof HotspotDTO>(field: K, value: HotspotDTO[K]) => {
    setEditedHotspot((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const updateShapeField = <K extends keyof HotspotDTO['shape']>(
    field: K,
    value: HotspotDTO['shape'][K]
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

  const updatePolygonPoint = (index: number, axis: 'x' | 'y', value: number) => {
    if (!editedHotspot.shape.points) return;
    const newPoints = [...editedHotspot.shape.points];
    newPoints[index] = { ...newPoints[index], [axis]: value };
    updateShapeField('points', newPoints);
  };

  const addPolygonPoint = () => {
    const points = editedHotspot.shape.points || [];
    const newPoint = points.length > 0 ? { ...points[points.length - 1] } : { x: 0, y: 0 };
    updateShapeField('points', [...points, newPoint]);
  };

  const removePolygonPoint = (index: number) => {
    if (!editedHotspot.shape.points || editedHotspot.shape.points.length <= 3) {
      alert('چند ضلعی باید حداقل 3 نقطه داشته باشد');
      return;
    }
    const newPoints = editedHotspot.shape.points.filter((_, i) => i !== index);
    updateShapeField('points', newPoints);
  };

  const changeShapeType = (newType: HotspotShapeType) => {
    let newShape = { ...editedHotspot.shape, type: newType };

    // Set default values based on shape type
    switch (newType) {
      case 'circle':
        newShape = { ...newShape, radius: 30 };
        delete newShape.width;
        delete newShape.height;
        delete newShape.points;
        break;
      case 'square':
        newShape = { ...newShape, width: 50 };
        delete newShape.radius;
        delete newShape.height;
        delete newShape.points;
        break;
      case 'rectangle':
        newShape = { ...newShape, width: 60, height: 40 };
        delete newShape.radius;
        delete newShape.points;
        break;
      case 'polygon':
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
    if (confirm('آیا مطمئن هستید که می‌خواهید این hotspot را حذف کنید؟')) {
      onDelete(editedHotspot.id);
    }
  };

  return (
    <div className="w-96 bg-background border-r border-foreground/10 p-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {isNewHotspot ? 'Hotspot جدید' : 'ویرایش Hotspot'}
        </h2>
        <button
          onClick={onClose}
          className="text-foreground/50 hover:text-foreground transition-colors text-2xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">اطلاعات اصلی</h3>

          <div>
            <label className="block text-sm font-medium mb-2">شناسه (ID)</label>
            <input
              type="text"
              value={editedHotspot.id}
              onChange={(e) => updateField('id', e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: weapon, evidence1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">عنوان</label>
            <input
              type="text"
              value={editedHotspot.text}
              onChange={(e) => updateField('text', e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: سلاح جرم"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">توضیحات (اختیاری)</label>
            <textarea
              value={editedHotspot.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="توضیحات تکمیلی..."
            />
          </div>
        </div>

        {/* Position */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">موقعیت</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Pitch (عمودی): {editedHotspot.pitch}°
            </label>
            <input
              type="range"
              min="-90"
              max="90"
              value={editedHotspot.pitch}
              onChange={(e) => updateField('pitch', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-foreground/50 mt-1">
              <span>-90° (پایین)</span>
              <span>0° (افق)</span>
              <span>90° (بالا)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Yaw (افقی): {editedHotspot.yaw}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              value={editedHotspot.yaw}
              onChange={(e) => updateField('yaw', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-foreground/50 mt-1">
              <span>-180° (چپ)</span>
              <span>0° (جلو)</span>
              <span>180° (راست)</span>
            </div>
          </div>
        </div>

        {/* Shape Type */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">نوع شکل</h3>

          <div className="grid grid-cols-2 gap-2">
            {(['circle', 'square', 'rectangle', 'polygon'] as HotspotShapeType[]).map((type) => (
              <button
                key={type}
                onClick={() => changeShapeType(type)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  editedHotspot.shape.type === type
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-background border-foreground/20 hover:border-foreground/40'
                }`}
              >
                {type === 'circle' && '⭕ دایره'}
                {type === 'square' && '◻️ مربع'}
                {type === 'rectangle' && '▭ مستطیل'}
                {type === 'polygon' && '⬡ چندضلعی'}
              </button>
            ))}
          </div>
        </div>

        {/* Shape Properties */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">تنظیمات شکل</h3>

          {/* Circle */}
          {editedHotspot.shape.type === 'circle' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                شعاع (Radius): {editedHotspot.shape.radius || 25} پیکسل
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={editedHotspot.shape.radius || 25}
                onChange={(e) => updateShapeField('radius', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Square */}
          {editedHotspot.shape.type === 'square' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                اندازه (Width): {editedHotspot.shape.width || 50} پیکسل
              </label>
              <input
                type="range"
                min="20"
                max="150"
                value={editedHotspot.shape.width || 50}
                onChange={(e) => updateShapeField('width', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Rectangle */}
          {editedHotspot.shape.type === 'rectangle' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  عرض (Width): {editedHotspot.shape.width || 60} پیکسل
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={editedHotspot.shape.width || 60}
                  onChange={(e) => updateShapeField('width', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  ارتفاع (Height): {editedHotspot.shape.height || 40} پیکسل
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={editedHotspot.shape.height || 40}
                  onChange={(e) => updateShapeField('height', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Polygon Points Editor */}
          {editedHotspot.shape.type === 'polygon' && editedHotspot.shape.points && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">نقاط چندضلعی</label>
                <button
                  onClick={addPolygonPoint}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  ➕ افزودن نقطه
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {editedHotspot.shape.points.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-foreground/5 rounded-lg"
                  >
                    <span className="text-sm font-medium w-8">#{index + 1}</span>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-foreground/70">X</label>
                        <input
                          type="number"
                          value={point.x}
                          onChange={(e) =>
                            updatePolygonPoint(index, 'x', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 text-sm border border-foreground/20 rounded bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-foreground/70">Y</label>
                        <input
                          type="number"
                          value={point.y}
                          onChange={(e) =>
                            updatePolygonPoint(index, 'y', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 text-sm border border-foreground/20 rounded bg-background"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removePolygonPoint(index)}
                      className="px-2 py-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      disabled={editedHotspot.shape.points!.length <= 3}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                💡 نکته: چندضلعی باید حداقل 3 نقطه داشته باشد
              </p>
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">رنگ‌بندی</h3>

          <div>
            <label className="block text-sm font-medium mb-2">رنگ پر کننده (Fill Color)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={
                  editedHotspot.shape.color?.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#3b82f6'
                }
                onChange={(e) => {
                  const opacity = editedHotspot.shape.opacity || 0.3;
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  updateShapeField('color', `rgba(${r}, ${g}, ${b}, ${opacity})`);
                }}
                className="w-16 h-10 rounded border border-foreground/20 cursor-pointer"
              />
              <input
                type="text"
                value={editedHotspot.shape.color || 'rgba(59, 130, 246, 0.3)'}
                onChange={(e) => updateShapeField('color', e.target.value)}
                className="flex-1 px-3 py-2 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="rgba(59, 130, 246, 0.3)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">رنگ حاشیه (Border Color)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={editedHotspot.shape.borderColor || '#3b82f6'}
                onChange={(e) => updateShapeField('borderColor', e.target.value)}
                className="w-16 h-10 rounded border border-foreground/20 cursor-pointer"
              />
              <input
                type="text"
                value={editedHotspot.shape.borderColor || '#3b82f6'}
                onChange={(e) => updateShapeField('borderColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              ضخامت حاشیه: {editedHotspot.shape.borderWidth || 3}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={editedHotspot.shape.borderWidth || 3}
              onChange={(e) => updateShapeField('borderWidth', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              شفافیت: {((editedHotspot.shape.opacity || 0.7) * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={editedHotspot.shape.opacity || 0.7}
              onChange={(e) => updateShapeField('opacity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t">
          <button
            onClick={handleSave}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            💾 ذخیره تغییرات
          </button>

          {!isNewHotspot && (
            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              🗑️ حذف Hotspot
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors font-semibold"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotspotEditor;

