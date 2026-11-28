export interface GalleryPhoto {
  id: number;
  src: string;
  thumbSrc: string;
  alt: string;
  objectPosition?: string;
}

export interface GalleryCategory {
  slug: string;
  title: string;
  photos: GalleryPhoto[];
}

interface RawGalleryPhoto {
  src: string;
  thumbSrc: string;
  alt: string;
  objectPosition?: string;
}

interface RawGalleryCategory {
  slug: string;
  title: string;
  photos: RawGalleryPhoto[];
}

function buildCategoryPhotos(raw: RawGalleryPhoto[]): GalleryPhoto[] {
  return raw.map((photo, index) => ({
    ...photo,
    id: index + 1,
  }));
}

/**
 * Categorized gallery collections for isaiahadegoke.com.
 * Add new categorized sets here — each category's photos are automatically
 * numbered 1 through N with web-optimized WebP assets and fast grid thumbnails.
 */
const RAW_GALLERY_CATEGORIES: RawGalleryCategory[] = [
  {
    slug: 'the-assignment-and-tools-book-launch',
    title: 'The Assignment and Tools Book Launch',
    photos: [
      { src: '/images/gallery/book-launch/launch-01.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-01.webp', alt: 'The Assignment and Tools Book Launch photo 1', objectPosition: '50% 45%' },
      { src: '/images/gallery/book-launch/launch-02.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-02.webp', alt: 'The Assignment and Tools Book Launch photo 2', objectPosition: '50% 42%' },
      { src: '/images/gallery/book-launch/launch-03.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-03.webp', alt: 'The Assignment and Tools Book Launch photo 3', objectPosition: '48% 55%' },
      { src: '/images/gallery/book-launch/launch-04.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-04.webp', alt: 'The Assignment and Tools Book Launch photo 4', objectPosition: '50% 50%' },
      { src: '/images/gallery/book-launch/launch-05.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-05.webp', alt: 'The Assignment and Tools Book Launch photo 5', objectPosition: '50% 50%' },
      { src: '/images/gallery/book-launch/launch-06.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-06.webp', alt: 'The Assignment and Tools Book Launch photo 6', objectPosition: '50% 35%' },
      { src: '/images/gallery/book-launch/launch-07.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-07.webp', alt: 'The Assignment and Tools Book Launch photo 7', objectPosition: '50% 28%' },
      { src: '/images/gallery/book-launch/launch-08.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-08.webp', alt: 'The Assignment and Tools Book Launch photo 8', objectPosition: '50% 30%' },
      { src: '/images/gallery/book-launch/launch-09.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-09.webp', alt: 'The Assignment and Tools Book Launch photo 9', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-10.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-10.webp', alt: 'The Assignment and Tools Book Launch photo 10', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-11.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-11.webp', alt: 'The Assignment and Tools Book Launch photo 11', objectPosition: '50% 22%' },
      { src: '/images/gallery/book-launch/launch-12.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-12.webp', alt: 'The Assignment and Tools Book Launch photo 12', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-13.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-13.webp', alt: 'The Assignment and Tools Book Launch photo 13', objectPosition: '50% 40%' },
      { src: '/images/gallery/book-launch/launch-14.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-14.webp', alt: 'The Assignment and Tools Book Launch photo 14', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-15.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-15.webp', alt: 'The Assignment and Tools Book Launch photo 15', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-16.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-16.webp', alt: 'The Assignment and Tools Book Launch photo 16', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-17.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-17.webp', alt: 'The Assignment and Tools Book Launch photo 17', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-18.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-18.webp', alt: 'The Assignment and Tools Book Launch photo 18', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-19.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-19.webp', alt: 'The Assignment and Tools Book Launch photo 19', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-20.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-20.webp', alt: 'The Assignment and Tools Book Launch photo 20', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-21.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-21.webp', alt: 'The Assignment and Tools Book Launch photo 21', objectPosition: '42% 24%' },
      { src: '/images/gallery/book-launch/launch-22.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-22.webp', alt: 'The Assignment and Tools Book Launch photo 22', objectPosition: '50% 28%' },
      { src: '/images/gallery/book-launch/launch-23.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-23.webp', alt: 'The Assignment and Tools Book Launch photo 23', objectPosition: '50% 42%' },
      { src: '/images/gallery/book-launch/launch-24.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-24.webp', alt: 'The Assignment and Tools Book Launch photo 24', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-25.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-25.webp', alt: 'The Assignment and Tools Book Launch photo 25', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-26.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-26.webp', alt: 'The Assignment and Tools Book Launch photo 26', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-27.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-27.webp', alt: 'The Assignment and Tools Book Launch photo 27', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-28.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-28.webp', alt: 'The Assignment and Tools Book Launch photo 28', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-29.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-29.webp', alt: 'The Assignment and Tools Book Launch photo 29', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-30.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-30.webp', alt: 'The Assignment and Tools Book Launch photo 30', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-31.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-31.webp', alt: 'The Assignment and Tools Book Launch photo 31', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-32.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-32.webp', alt: 'The Assignment and Tools Book Launch photo 32', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-33.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-33.webp', alt: 'The Assignment and Tools Book Launch photo 33', objectPosition: '50% 26%' },
      { src: '/images/gallery/book-launch/launch-34.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-34.webp', alt: 'The Assignment and Tools Book Launch photo 34', objectPosition: '50% 22%' },
      { src: '/images/gallery/book-launch/launch-35.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-35.webp', alt: 'The Assignment and Tools Book Launch photo 35', objectPosition: '48% 22%' },
      { src: '/images/gallery/book-launch/launch-36.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-36.webp', alt: 'The Assignment and Tools Book Launch photo 36', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-37.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-37.webp', alt: 'The Assignment and Tools Book Launch photo 37', objectPosition: '50% 24%' },
      { src: '/images/gallery/book-launch/launch-38.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-38.webp', alt: 'The Assignment and Tools Book Launch photo 38', objectPosition: '50% 22%' },
      { src: '/images/gallery/book-launch/launch-39.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-39.webp', alt: 'The Assignment and Tools Book Launch photo 39', objectPosition: '50% 22%' },
      { src: '/images/gallery/book-launch/launch-40.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-40.webp', alt: 'The Assignment and Tools Book Launch photo 40', objectPosition: '50% 22%' },
      { src: '/images/gallery/book-launch/launch-41.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-41.webp', alt: 'The Assignment and Tools Book Launch photo 41', objectPosition: '50% 20%' },
      { src: '/images/gallery/book-launch/launch-42.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-42.webp', alt: 'The Assignment and Tools Book Launch photo 42', objectPosition: '50% 20%' },
      { src: '/images/gallery/book-launch/launch-43.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-43.webp', alt: 'The Assignment and Tools Book Launch photo 43', objectPosition: '50% 22%' },
      { src: '/images/gallery/book-launch/launch-44.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-44.webp', alt: 'The Assignment and Tools Book Launch photo 44', objectPosition: '50% 20%' },
      { src: '/images/gallery/book-launch/launch-45.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-45.webp', alt: 'The Assignment and Tools Book Launch photo 45', objectPosition: '50% 22%' },
      { src: '/images/gallery/book-launch/launch-46.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-46.webp', alt: 'The Assignment and Tools Book Launch photo 46', objectPosition: '50% 22%' },
      { src: '/images/gallery/book-launch/launch-47.webp', thumbSrc: '/images/gallery/book-launch/thumbs/launch-47.webp', alt: 'The Assignment and Tools Book Launch photo 47', objectPosition: '50% 22%' },
    ],
  },
];

export const DEFAULT_GALLERY_CATEGORY_SLUG = 'the-assignment-and-tools-book-launch';

export const GALLERY_CATEGORIES: GalleryCategory[] = RAW_GALLERY_CATEGORIES.map((category) => ({
  slug: category.slug,
  title: category.title,
  photos: buildCategoryPhotos(category.photos),
}));

export function getGalleryCategory(slug: string = DEFAULT_GALLERY_CATEGORY_SLUG): GalleryCategory {
  return (
    GALLERY_CATEGORIES.find((cat) => cat.slug === slug) ?? GALLERY_CATEGORIES[0]
  );
}

export const GALLERY_ITEMS: GalleryPhoto[] = getGalleryCategory().photos;
