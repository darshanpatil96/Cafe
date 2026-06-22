import React, { useState, useCallback } from 'react';
import fallbackCoffee from '../assets/images/fallback-coffee.webp';

/**
 * ImageWithFallback — production-safe image component.
 *
 * - Skeleton shimmer while loading (no layout shift)
 * - console.warn on first failure, then tries fallbackSrc
 * - "Image Coming Soon" tile if fallback also fails
 * - Never shows native broken-image icon
 * - loading="lazy" + decoding="async" by default
 *
 * Props match native <img> — pass className, style, width, height etc normally.
 * Extra props: fallbackSrc, showSkeleton, wrapperClassName
 */

const DEFAULT_FALLBACK = fallbackCoffee;

const ImageWithFallback = ({
  src,
  alt = '',
  fallbackSrc = DEFAULT_FALLBACK,
  className = '',
  wrapperClassName = '',
  style,
  loading = 'lazy',
  showSkeleton = true,
  ...rest
}) => {
  const resolved = src || fallbackSrc;

  const [imgSrc, setImgSrc]     = useState(resolved);
  const [loaded, setLoaded]     = useState(false);
  const [dead, setDead]         = useState(false);
  const [usedFallback, setUsedFallback] = useState(!src);

  const handleLoad = useCallback(() => setLoaded(true), []);

  const handleError = useCallback(() => {
    if (!usedFallback && imgSrc !== fallbackSrc) {
      console.warn("Image failed:", src);
      setImgSrc(fallbackSrc);
      setUsedFallback(true);
      setLoaded(false); // reset so skeleton shows again briefly
    } else {
      console.warn(`[Aura] Fallback also failed for: ${src} — showing placeholder tile`);
      setDead(true);
    }
  }, [usedFallback, imgSrc, fallbackSrc, src]);

  // Both src and fallback failed
  if (dead) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1.5 bg-stone-900/80 ${className} ${wrapperClassName}`}
        style={style}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <span
          className="material-symbols-outlined text-stone-600 text-2xl"
          aria-hidden="true"
        >
          hide_image
        </span>
        <span className="text-stone-600 text-[9px] uppercase tracking-widest font-bold text-center px-2 leading-tight">
          Image Coming Soon
        </span>
      </div>
    );
  }

  return (
    // Wrapper preserves the parent's sizing while allowing absolute skeleton overlay
    <div className={`relative overflow-hidden ${wrapperClassName}`} style={!wrapperClassName ? undefined : style}>
      {/* Skeleton shimmer — sits beneath the image, disappears on load */}
      {showSkeleton && !loaded && (
        <div
          className="absolute inset-0 bg-stone-800 animate-pulse"
          aria-hidden="true"
        />
      )}

      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={wrapperClassName ? undefined : style}
        {...rest}
      />
    </div>
  );
};

export default ImageWithFallback;
