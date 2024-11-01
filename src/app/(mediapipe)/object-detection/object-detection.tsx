// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useState } from 'react';
import Image from 'next/image';

const ObjectDetection = ({ 
  imageSrc, 
  detections, 
  originalWidth = 1024, 
  originalHeight = 1024,
  confidenceThreshold = 0.5 // Added confidence threshold parameter
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  
  // Filter detections by confidence threshold and limit to 5
  const filteredDetections = detections
    .filter(detection => detection.categories[0]?.score >= confidenceThreshold)
    .slice(0, 5);

  // Handle image load to get actual displayed dimensions
  const handleImageLoad = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  };

  const calculateScaledPosition = (value, originalSize, newSize) => {
    const scale = newSize / originalSize;
    return value * scale;
  };

  return (
    <div 
      ref={containerRef} 
      className="relative inline-block"
      style={{ width: '500px', height: '500px' }}
    >
      <Image
        src={imageSrc}
        alt="Detected Objects"
        
        style={{ objectFit: 'contain' }}
        onLoadingComplete={handleImageLoad}
        height={500}
        width={500}
        className='rounded-xl'
      />
      
      {dimensions.width > 0 && filteredDetections.map((detection, index) => {
        const { boundingBox, categories } = detection;
        const categoryName = categories[0]?.categoryName || 'Unknown';
        const confidence = Math.round(categories[0]?.score * 100);

        const scaledX = calculateScaledPosition(boundingBox.originX, originalWidth, dimensions.width);
        const scaledY = calculateScaledPosition(boundingBox.originY, originalHeight, dimensions.height);
        const scaledWidth = calculateScaledPosition(boundingBox.width, originalWidth, dimensions.width);
        const scaledHeight = calculateScaledPosition(boundingBox.height, originalHeight, dimensions.height);

        return (
          <div
            key={index}
            className="absolute border-2 border-red-500 bg-transparent hover:bg-sky-500 hover:bg-opacity-20 rounded-xl"
            style={{
              left: `${scaledX}px`,
              top: `${scaledY}px`,
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
            }}
          >
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded-br">
              {`${categoryName} ${confidence}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ObjectDetection;