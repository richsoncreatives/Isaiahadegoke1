import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Expand, Grid2x2, X } from 'lucide-react';
import {
  DEFAULT_GALLERY_CATEGORY_SLUG,
  GALLERY_CATEGORIES,
  GalleryPhoto,
  getGalleryCategory,
} from '../data/galleryItems';

interface VisualDiaryGalleryProps {
  mode?: 'section' | 'page';
  initialCategorySlug?: string;
}

interface GalleryCardImageProps {
  photo: GalleryPhoto;
  useThumb?: boolean;
  priority?: boolean;
}

const GalleryCardImage: React.FC<GalleryCardImageProps> = ({
  photo,
  useThumb = false,
  priority = false,
}) => {
  const src = useThumb ? photo.thumbSrc : photo.src;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const isLoaded = loadedSrc === src;
  const isFailed = failedSrc === src;

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoadedSrc(src);
    }
  }, [src]);

  if (isFailed) {
    return (
      <div className="vd-img-fallback" aria-hidden="true">
        <span className="vd-img-fallback-num">{String(photo.id).padStart(2, '0')}</span>
      </div>
    );
  }

  return (
    <>
      {!isLoaded && <div className="vd-img-skeleton" aria-hidden="true" />}
      <img
        ref={imgRef}
        src={src}
        alt={photo.alt}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
        style={{ objectPosition: photo.objectPosition || '50% 25%' }}
        className={`vd-img ${isLoaded ? 'vd-img-loaded' : 'vd-img-loading'}`}
      />
    </>
  );
};

interface ViewportMetrics {
  step1: number;
  step2: number;
  showOuter: boolean;
}

function getViewportMetrics(width: number): ViewportMetrics {
  if (width < 640) {
    return { step1: 102, step2: 196, showOuter: false };
  }
  if (width < 1024) {
    return { step1: 162, step2: 282, showOuter: true };
  }
  return { step1: 218, step2: 394, showOuter: true };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export const VisualDiaryGallery: React.FC<VisualDiaryGalleryProps> = ({
  mode = 'section',
  initialCategorySlug = DEFAULT_GALLERY_CATEGORY_SLUG,
}) => {
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug);
  const activeCategory = useMemo(() => getGalleryCategory(categorySlug), [categorySlug]);
  const items = activeCategory.photos;
  const total = items.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  // Interactive pointer drag-to-flip state
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startTime: number;
    lastX: number;
    lastTime: number;
    lockedAxis: 'x' | 'y' | null;
    didDrag: boolean;
  } | null>(null);
  const suppressClickUntilRef = useRef<number>(0);

  const wrapIndex = useCallback(
    (idx: number) => ((idx % total) + total) % total,
    [total]
  );

  const goNext = useCallback(() => {
    setActiveIndex((prev) => wrapIndex(prev + 1));
  }, [wrapIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => wrapIndex(prev - 1));
  }, [wrapIndex]);

  const selectIndex = useCallback(
    (idx: number) => {
      setActiveIndex(wrapIndex(idx));
    },
    [wrapIndex]
  );

  const handleCategoryChange = useCallback((slug: string) => {
    setCategorySlug(slug);
    setActiveIndex(0);
    setLightboxIndex(null);
  }, []);

  // Track viewport width cleanly for responsive layered transforms
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Background preloading of immediate and near-adjacent slides so transitions never stutter
  useEffect(() => {
    const offsets = [-3, -2, -1, 0, 1, 2, 3];
    offsets.forEach((offset) => {
      const url = items[wrapIndex(activeIndex + offset)]?.src;
      if (url && !preloadedUrlsRef.current.has(url)) {
        preloadedUrlsRef.current.add(url);
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
      }
    });
  }, [activeIndex, items, wrapIndex]);

  // Horizontal pill strip overflow controls
  const updateTabScrollState = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollTabsLeft(el.scrollLeft > 8);
    setCanScrollTabsRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateTabScrollState();
    window.addEventListener('resize', updateTabScrollState, { passive: true });
    return () => window.removeEventListener('resize', updateTabScrollState);
  }, [updateTabScrollState, categorySlug]);

  // Smoothly center the active numbered pill inside the horizontal strip (without scrolling page)
  useEffect(() => {
    const container = tabsScrollRef.current;
    const activeBtn = tabButtonRefs.current[activeIndex];
    if (!container || !activeBtn) return;

    const targetLeft =
      activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.clientWidth / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [activeIndex, categorySlug]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
          return;
        }
        if (isGridOpen) {
          setIsGridOpen(false);
          return;
        }
      }

      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = wrapIndex(lightboxIndex + 1);
          setLightboxIndex(next);
          setActiveIndex(next);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = wrapIndex(lightboxIndex - 1);
          setLightboxIndex(prev);
          setActiveIndex(prev);
        }
        return;
      }

      if (isGridOpen) return;

      const shouldHandleCarouselKeys =
        mode === 'page' ||
        (sectionRef.current &&
          (sectionRef.current.contains(document.activeElement) ||
            (() => {
              const rect = sectionRef.current!.getBoundingClientRect();
              return rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
            })()));

      if (!shouldHandleCarouselKeys) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, isGridOpen, lightboxIndex, mode, wrapIndex]);

  // Lock body scroll when modal or lightbox is open
  useEffect(() => {
    if (isGridOpen || lightboxIndex !== null) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isGridOpen, lightboxIndex]);

  // Unified pointer drag / mouse flip / touch swipe handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startTime: performance.now(),
      lastX: e.clientX,
      lastTime: performance.now(),
      lockedAxis: null,
      didDrag: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    if (!state.lockedAxis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dx) >= Math.abs(dy)) {
        state.lockedAxis = 'x';
        state.didDrag = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Ignore if capture is unavailable
        }
      } else {
        state.lockedAxis = 'y';
        return;
      }
    }

    if (state.lockedAxis === 'x') {
      state.lastX = e.clientX;
      state.lastTime = performance.now();
      const maxDrag = Math.min(280, viewportWidth * 0.45);
      const clamped = Math.max(-maxDrag, Math.min(maxDrag, dx));
      setDragOffsetPx(clamped);
    }
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;

    const dx = e.clientX - state.startX;
    const dt = Math.max(1, performance.now() - state.startTime);
    const velocity = dx / dt; // px per ms

    if (state.didDrag) {
      suppressClickUntilRef.current = performance.now() + 260;
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore
      }
    }

    dragStateRef.current = null;
    setIsDragging(false);
    setDragOffsetPx(0);

    if (cancelled || state.lockedAxis !== 'x') return;

    const distanceThreshold = viewportWidth < 640 ? 48 : 64;
    const isFlick = Math.abs(velocity) > 0.35 && Math.abs(dx) > 22;

    if (dx <= -distanceThreshold || (isFlick && dx < 0)) {
      goNext();
    } else if (dx >= distanceThreshold || (isFlick && dx > 0)) {
      goPrev();
    }
  };

  // Visible 7 slots (-3..+3) so cards entering from far left/right during drag appear seamlessly
  const visibleSlots = useMemo(() => {
    const offsets = [-3, -2, -1, 0, 1, 2, 3];
    return offsets.map((offset) => {
      const index = wrapIndex(activeIndex + offset);
      return {
        offset,
        index,
        photo: items[index],
      };
    });
  }, [activeIndex, items, wrapIndex]);

  const metrics = useMemo(() => getViewportMetrics(viewportWidth), [viewportWidth]);

  // Compute GPU-composited style for each slot (interpolated live during pointer drag)
  const getSlotStyle = (offset: number): React.CSSProperties => {
    const dragStep = metrics.step1;
    const progress = isDragging ? Math.max(-1.15, Math.min(1.15, dragOffsetPx / dragStep)) : 0;
    const effective = offset + progress;
    const absEff = Math.abs(effective);

    // Position X
    let x: number;
    if (absEff <= 1) {
      x = effective * metrics.step1;
    } else if (absEff <= 2) {
      const sign = Math.sign(effective);
      x = sign * lerp(metrics.step1, metrics.step2, absEff - 1);
    } else {
      const sign = Math.sign(effective);
      x = sign * (metrics.step2 + (absEff - 2) * (metrics.step2 - metrics.step1) * 0.72);
    }

    // Scale
    let scale: number;
    if (absEff <= 1) {
      scale = lerp(1, 0.84, absEff);
    } else if (absEff <= 2) {
      scale = lerp(0.84, 0.7, absEff - 1);
    } else {
      scale = Math.max(0.58, lerp(0.7, 0.6, Math.min(1, absEff - 2)));
    }

    // Opacity
    let opacity: number;
    if (!metrics.showOuter) {
      if (absEff <= 1) opacity = lerp(1, 0.94, absEff);
      else opacity = Math.max(0, lerp(0.94, 0, Math.min(1, (absEff - 1) * 1.35)));
    } else {
      if (absEff <= 1) opacity = lerp(1, 0.95, absEff);
      else if (absEff <= 2) opacity = lerp(0.95, 0.8, absEff - 1);
      else opacity = Math.max(0, lerp(0.8, 0, Math.min(1, absEff - 2)));
    }

    // Subtle 3D perspective flip tilt during active drag or side layering
    const rotateY = Math.max(-14, Math.min(14, -effective * (isDragging ? 7.5 : 3.5)));

    // Depth dimming so the center card commands focal priority
    const brightness =
      absEff <= 1
        ? lerp(1, 0.86, absEff)
        : absEff <= 2
        ? lerp(0.86, 0.74, absEff - 1)
        : 0.66;

    const zIndex = Math.max(1, Math.round(40 - absEff * 10));

    return {
      transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, 0) perspective(1100px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
      opacity: Number(opacity.toFixed(3)),
      filter: `brightness(${brightness.toFixed(3)})`,
      zIndex,
      pointerEvents: opacity < 0.08 ? 'none' : 'auto',
      transition: isDragging
        ? 'none'
        : 'transform 440ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), filter 400ms cubic-bezier(0.22, 1, 0.36, 1)',
    };
  };

  const scrollPillStrip = (direction: 'left' | 'right') => {
    const el = tabsScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -280 : 280,
      behavior: 'smooth',
    });
  };

  const activePhoto = items[activeIndex];
  const lightboxPhoto = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section
      ref={sectionRef}
      id="gallery"
      aria-label={`${activeCategory.title} Gallery`}
      className={`vd-section ${mode === 'page' ? 'vd-section-page' : 'vd-section-home'}`}
    >
      <div className="vd-container">
        {/* 1. Category Header */}
        <div className="vd-header">
          <p className="vd-eyebrow">GALLERY</p>
          <h2 className="vd-title">{activeCategory.title}</h2>

          {GALLERY_CATEGORIES.length > 1 && (
            <div className="vd-category-bar" role="tablist" aria-label="Gallery categories">
              {GALLERY_CATEGORIES.map((cat) => {
                const isSelected = cat.slug === activeCategory.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`vd-category-btn ${isSelected ? 'vd-category-btn-active' : ''}`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Numbered Pill Tabs (Strictly Numbers) + View More Pill */}
        <div className="vd-tabs-bar" aria-label="Gallery photo index">
          <div className="vd-tabs-track-wrap">
            {canScrollTabsLeft && (
              <button
                type="button"
                onClick={() => scrollPillStrip('left')}
                aria-label="Scroll photo numbers left"
                className="vd-tabs-nudge vd-tabs-nudge-left"
              >
                <ChevronLeft size={15} strokeWidth={2.2} />
              </button>
            )}

            <div
              ref={tabsScrollRef}
              onScroll={updateTabScrollState}
              role="tablist"
              aria-label="Select photo by number"
              className="vd-tabs-scroll"
            >
              {items.map((photo, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={photo.id}
                    ref={(el) => {
                      tabButtonRefs.current[idx] = el;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Photo ${photo.id}`}
                    onClick={() => selectIndex(idx)}
                    className={`vd-pill ${isActive ? 'vd-pill-active' : 'vd-pill-inactive'}`}
                  >
                    {photo.id}
                  </button>
                );
              })}
            </div>

            {canScrollTabsRight && (
              <button
                type="button"
                onClick={() => scrollPillStrip('right')}
                aria-label="Scroll photo numbers right"
                className="vd-tabs-nudge vd-tabs-nudge-right"
              >
                <ChevronRight size={15} strokeWidth={2.2} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsGridOpen(true)}
            className="vd-pill vd-pill-viewmore"
            aria-haspopup="dialog"
          >
            <span>View More</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* 3. Layered / Overlapping Card Carousel Stage (Mouse Drag + Touch Swipe) */}
        <div
          className={`vd-stage ${isDragging ? 'vd-stage-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(e) => finishDrag(e, false)}
          onPointerCancel={(e) => finishDrag(e, true)}
          role="region"
          aria-roledescription="carousel"
          aria-label={activeCategory.title}
        >
          {visibleSlots.map(({ offset, index, photo }) => {
            const isCenter = offset === 0;
            const isPriority = Math.abs(offset) <= 1;

            return (
              <button
                key={`${activeCategory.slug}-${photo.id}`}
                type="button"
                style={getSlotStyle(offset)}
                onClick={() => {
                  if (performance.now() < suppressClickUntilRef.current) return;
                  if (isCenter) {
                    setLightboxIndex(index);
                  } else {
                    selectIndex(index);
                  }
                }}
                aria-label={
                  isCenter
                    ? `Enlarge photo ${photo.id}`
                    : `Show photo ${photo.id} in center`
                }
                aria-current={isCenter ? 'true' : undefined}
                className={`vd-card ${isCenter ? 'vd-card-active' : 'vd-card-side'}`}
              >
                <GalleryCardImage photo={photo} priority={isPriority} />

                {isCenter && (
                  <span className="vd-card-expand-hint" aria-hidden="true">
                    <Expand size={16} strokeWidth={2} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4. Circular Arrow Controls & Quiet Numeric Counter Below Stage */}
        <div className="vd-controls">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous photo"
            className="vd-arrow-btn"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>

          <div className="vd-counter" aria-live="polite">
            <span className="vd-counter-current">{String(activePhoto.id).padStart(2, '0')}</span>
            <span className="vd-counter-sep" aria-hidden="true">/</span>
            <span className="vd-counter-total">{String(total).padStart(2, '0')}</span>
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next photo"
            className="vd-arrow-btn"
          >
            <ArrowRight size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* All Photos Grid Modal ("View More ->") — Completely Uncaptioned Images */}
      {isGridOpen && (
        <div
          className="vd-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeCategory.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsGridOpen(false);
          }}
        >
          <div className="vd-grid-modal">
            <div className="vd-grid-modal-header">
              <div className="vd-grid-modal-heading">
                <span className="vd-grid-modal-eyebrow">
                  <Grid2x2 size={14} strokeWidth={2} />
                  <span>GALLERY · {total} PHOTOS</span>
                </span>
                <h3 className="vd-grid-modal-title">{activeCategory.title}</h3>
              </div>

              <div className="vd-grid-modal-actions">
                {mode === 'section' && (
                  <a href="gallery.html" className="vd-grid-page-link">
                    Open Gallery Page →
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsGridOpen(false)}
                  aria-label="Close gallery grid"
                  className="vd-close-btn"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="vd-grid-scroll">
              <div className="vd-grid">
                {items.map((photo, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => {
                        setActiveIndex(idx);
                        setLightboxIndex(idx);
                      }}
                      className={`vd-grid-tile ${isCurrent ? 'vd-grid-tile-active' : ''}`}
                      aria-label={`View photo ${photo.id}`}
                    >
                      <GalleryCardImage photo={photo} useThumb priority={idx < 8} />
                      <span className="vd-grid-tile-num">{photo.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal — Unobstructed, Uncaptioned Photo */}
      {lightboxPhoto && lightboxIndex !== null && (
        <div
          className="vd-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightboxPhoto.id} of ${total}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIndex(null);
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close fullscreen view"
            className="vd-lightbox-close"
          >
            <X size={22} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => {
              const prev = wrapIndex(lightboxIndex - 1);
              setLightboxIndex(prev);
              setActiveIndex(prev);
            }}
            aria-label="Previous photo"
            className="vd-lightbox-nav vd-lightbox-prev"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>

          <div className="vd-lightbox-figure">
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.alt}
              draggable={false}
              decoding="async"
              referrerPolicy="no-referrer"
              className="vd-lightbox-img"
            />
            <div className="vd-lightbox-counter" aria-live="polite">
              {String(lightboxPhoto.id).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = wrapIndex(lightboxIndex + 1);
              setLightboxIndex(next);
              setActiveIndex(next);
            }}
            aria-label="Next photo"
            className="vd-lightbox-nav vd-lightbox-next"
          >
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        </div>
      )}
    </section>
  );
};

export default VisualDiaryGallery;
