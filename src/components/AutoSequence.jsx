import React, { useRef, useEffect, useState, useCallback } from 'react';

const AutoSequence = ({ 
  folderPath = '/frames', 
  frameCount = 136, 
  frameDuration = 50,
  onLoad,
  className = "block w-full h-full object-contain mix-blend-screen",
  loop = true
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const lastTimeRef = useRef();
  
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const stateRef = useRef({
    frameIndex: 0
  });

  useEffect(() => {
    let isMounted = true;
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      // Assume files are always padded 3 digits: frame_000.webp
      img.src = `${folderPath}/frame_${String(i).padStart(3, '0')}.webp`;
      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        loadedImages[i] = img;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setIsLoaded(true);
          if (onLoad) onLoad();
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loadedCount++;
        if (loadedCount === frameCount) {
           setImages(loadedImages);
           setIsLoaded(true);
           if (onLoad) onLoad();
        }
      };
    }
    
    return () => { isMounted = false; };
  }, [folderPath, frameCount, onLoad]);

  const drawImageScaled = useCallback((img, ctx, canvas) => {
    if (!img || img.naturalWidth === 0) return;
    
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
                  centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && isLoaded && images.length > 0) {
        const parent = canvasRef.current.parentElement;
        canvasRef.current.width = parent.clientWidth;
        canvasRef.current.height = parent.clientHeight;
        
        const img = images[stateRef.current.frameIndex] || images[0];
        if (img) {
             const ctx = canvasRef.current.getContext('2d', { alpha: true });
             drawImageScaled(img, ctx, canvasRef.current);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    if (isLoaded) handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, images, drawImageScaled]);

  const animate = useCallback((time) => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;
    
    if (lastTimeRef.current !== undefined) {
      const elapsed = time - lastTimeRef.current;
      
      if (elapsed > frameDuration) {
        let nextIndex = stateRef.current.frameIndex + 1;
        
        if (nextIndex >= frameCount) {
          if (!loop) return;
          nextIndex = 0;
        }
        
        stateRef.current.frameIndex = nextIndex;
        lastTimeRef.current = time - (elapsed % frameDuration);
        
        const img = images[nextIndex];
        if (img && img.complete) {
            const ctx = canvasRef.current.getContext('2d', { alpha: true });
            drawImageScaled(img, ctx, canvasRef.current);
        }
      }
    } else {
        lastTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [isLoaded, images, drawImageScaled, frameCount, frameDuration]);

  useEffect(() => {
    if (isLoaded) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded, animate]);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className={className}
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-t-2 border-orange-200 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AutoSequence;
