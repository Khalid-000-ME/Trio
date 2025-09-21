"use client";

import React, { useState, useRef } from 'react';
import { 
  FaPalette, 
  FaUpload, 
  FaTimes, 
  FaCheck, 
  FaImage, 
  FaPaintBrush,
  FaSun,
  FaMoon,
  FaMountain,
  FaWater,
  FaTree
} from 'react-icons/fa';

interface WallpaperOption {
  id: string;
  name: string;
  type: 'image' | 'gradient' | 'pattern';
  preview: string;
  value: string;
}

interface WallpaperChangerProps {
  isOpen: boolean;
  onClose: () => void;
  onWallpaperChange: (wallpaper: WallpaperOption) => void;
  currentWallpaper?: string;
}

const WallpaperChanger: React.FC<WallpaperChangerProps> = ({ 
  isOpen, 
  onClose, 
  onWallpaperChange, 
  currentWallpaper 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'presets' | 'gradients' | 'upload'>('presets');
  const [uploadedWallpaper, setUploadedWallpaper] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetWallpapers: WallpaperOption[] = [
    {
      id: 'default',
      name: 'Space Nebula',
      type: 'image',
      preview: '/BACKGROUND.png',
      value: "url('/BACKGROUND.png')"
    },
    {
      id: 'sunset',
      name: 'Sunset Mountains',
      type: 'image',
      preview: '/api/placeholder/300/200?text=Sunset',
      value: "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)"
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      type: 'image', 
      preview: '/api/placeholder/300/200?text=Ocean',
      value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 'forest',
      name: 'Misty Forest',
      type: 'image',
      preview: '/api/placeholder/300/200?text=Forest',
      value: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)"
    },
    {
      id: 'city',
      name: 'City Lights',
      type: 'image',
      preview: '/api/placeholder/300/200?text=City',
      value: "linear-gradient(135deg, #667db6 0%, #0082c8 50%, #0082c8 100%)"
    },
    {
      id: 'abstract',
      name: 'Abstract Art',
      type: 'image',
      preview: '/api/placeholder/300/200?text=Abstract',
      value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)"
    }
  ];

  const gradientWallpapers: WallpaperOption[] = [
    {
      id: 'aurora',
      name: 'Aurora',
      type: 'gradient',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'sunset-grad',
      name: 'Sunset',
      type: 'gradient',
      preview: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
      value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
    },
    {
      id: 'ocean-grad',
      name: 'Ocean',
      type: 'gradient',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'purple-pink',
      name: 'Purple Pink',
      type: 'gradient',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'green-blue',
      name: 'Green Blue',
      type: 'gradient',
      preview: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      value: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
    },
    {
      id: 'warm-flame',
      name: 'Warm Flame',
      type: 'gradient',
      preview: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedWallpaper(result);
        
        const customWallpaper: WallpaperOption = {
          id: 'custom-' + Date.now(),
          name: 'Custom Upload',
          type: 'image',
          preview: result,
          value: `url(${result})`
        };
        
        onWallpaperChange(customWallpaper);
      };
      reader.readAsDataURL(file);
    }
  };

  const WallpaperCard: React.FC<{ wallpaper: WallpaperOption }> = ({ wallpaper }) => (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all duration-300"
      onClick={() => onWallpaperChange(wallpaper)}
    >
      <div 
        className="aspect-video w-full relative"
        style={{ 
          background: wallpaper.type === 'gradient' ? wallpaper.preview : undefined,
          backgroundImage: wallpaper.type === 'image' ? wallpaper.preview : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Preview overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Selection indicator */}
        {currentWallpaper === wallpaper.value && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <FaCheck className="text-white text-xs" />
          </div>
        )}
        
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-white text-sm font-medium">{wallpaper.name}</p>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <FaPalette className="text-purple-400 text-xl" />
            <h2 className="text-white text-xl font-semibold">Change Wallpaper</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Category Navigation */}
        <div className="flex border-b border-gray-700/50">
          <button
            onClick={() => setSelectedCategory('presets')}
            className={`
              flex items-center space-x-2 px-6 py-4 transition-colors duration-200
              ${selectedCategory === 'presets' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <FaImage />
            <span>Presets</span>
          </button>
          
          <button
            onClick={() => setSelectedCategory('gradients')}
            className={`
              flex items-center space-x-2 px-6 py-4 transition-colors duration-200
              ${selectedCategory === 'gradients' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <FaPaintBrush />
            <span>Gradients</span>
          </button>
          
          <button
            onClick={() => setSelectedCategory('upload')}
            className={`
              flex items-center space-x-2 px-6 py-4 transition-colors duration-200
              ${selectedCategory === 'upload' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <FaUpload />
            <span>Upload</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {selectedCategory === 'presets' && (
            <div className="grid grid-cols-3 gap-4">
              {presetWallpapers.map((wallpaper) => (
                <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
              ))}
            </div>
          )}

          {selectedCategory === 'gradients' && (
            <div className="grid grid-cols-3 gap-4">
              {gradientWallpapers.map((wallpaper) => (
                <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
              ))}
            </div>
          )}

          {selectedCategory === 'upload' && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors duration-300"
              >
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Upload Custom Wallpaper</p>
                <p className="text-gray-400 text-sm">Click to select an image file</p>
                <p className="text-gray-500 text-xs mt-1">Supports JPG, PNG, WebP up to 10MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Uploaded Preview */}
              {uploadedWallpaper && (
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={uploadedWallpaper}
                    alt="Uploaded wallpaper"
                    className="w-full h-48 object-cover"
                  />
                  <div className="bg-gray-800 p-4">
                    <p className="text-white font-medium">Custom Wallpaper</p>
                    <p className="text-gray-400 text-sm">Successfully uploaded and applied</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700/50 p-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">Preview changes instantly • Click to apply</p>
            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperChanger;