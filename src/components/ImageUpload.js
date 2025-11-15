import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 10, 
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not a supported image type`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload/multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        const newImages = [...images, ...result.urls];
        onImagesChange(newImages);
        toast.success(`${result.urls.length} images uploaded successfully`);
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl, index) => {
    try {
      // If it's a blob URL (old format), just remove it from the array
      if (imageUrl.startsWith('blob:')) {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
        toast.success('Image removed successfully');
        return;
      }

      // For server URLs, try to delete from server
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: imageUrl })
      });

      if (response.ok) {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
        toast.success('Image deleted successfully');
      } else {
        // If server delete fails, still remove from UI (file might not exist)
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
        toast.success('Image removed successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Even if there's an error, remove from UI
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      toast.success('Image removed successfully');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Warning for blob URLs */}
      {images.some(img => img.startsWith('blob:')) && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-800">
                Some images are in old format and need to be re-uploaded. Upload new images to replace them.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-2">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={openFileDialog}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Click to upload
            </button>
            {' '}or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF, WEBP up to 10MB each
          </p>
          <p className="text-xs text-gray-500">
            {images.length}/{maxImages} images uploaded
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm">Uploading images...</span>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {imageUrl.startsWith('blob:') ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Old Image</p>
                      <p className="text-xs text-gray-400">Upload new to replace</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={`http://localhost:5000${imageUrl}`}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                )}
                <div className="w-full h-full items-center justify-center bg-gray-200 hidden">
                  <div className="text-center">
                    <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Image not found</p>
                  </div>
                </div>
              </div>
              
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleDeleteImage(imageUrl, index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              
              {/* Image Number */}
              <div className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded ${
                imageUrl.startsWith('blob:') ? 'bg-orange-500 bg-opacity-80' : 'bg-black bg-opacity-50'
              }`}>
                {index + 1}
                {imageUrl.startsWith('blob:') && <span className="ml-1">⚠️</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-500">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
