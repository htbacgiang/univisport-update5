import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export type ImageAspectRatio = "auto" | "16/9" | "4/3" | "1/1" | "3/2" | "9/16";
export type ImageAlignment = "left" | "center" | "right";
export type ImageObjectFit = "cover" | "contain";
export type ImageObjectPosition = string;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        caption?: string;
        width?: string;
        aspectRatio?: string;
        alignment?: ImageAlignment;
        objectFit?: ImageObjectFit;
        objectPosition?: ImageObjectPosition;
      }) => ReturnType;
    };
  }
}

export const CustomImage = Image.extend({
  inline() {
    return false
  },

  group() {
    return 'block'
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-caption') || null,
        renderHTML: (attributes) => {
          if (!attributes.caption) return {};
          return { 'data-caption': attributes.caption };
        },
      },
      width: {
        default: '100%',
        parseHTML: (element) => {
          return (
            element.getAttribute('data-width') ||
            element.getAttribute('width') ||
            (element as HTMLElement).style.width ||
            '100%'
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-width': attributes.width || '100%',
          };
        },
      },
      aspectRatio: {
        default: 'auto',
        parseHTML: (element) => {
          return (
            element.getAttribute('data-aspect-ratio') ||
            (element as HTMLElement).style.aspectRatio ||
            'auto'
          );
        },
        renderHTML: (attributes) => {
          if (!attributes.aspectRatio || attributes.aspectRatio === 'auto') {
            return { 'data-aspect-ratio': 'auto' };
          }
          return { 'data-aspect-ratio': attributes.aspectRatio };
        },
      },
      alignment: {
        default: 'center',
        parseHTML: (element) => {
          const direct = element.getAttribute('data-alignment');
          if (direct) return direct;
          const ml = (element as HTMLElement).style.marginLeft;
          const mr = (element as HTMLElement).style.marginRight;
          if (ml === '0px' || ml === '0') return 'left';
          if (mr === '0px' || mr === '0') return 'right';
          return 'center';
        },
        renderHTML: (attributes) => {
          return {
            'data-alignment': attributes.alignment || 'center',
          };
        },
      },
      objectFit: {
        default: 'cover',
        parseHTML: (element) => {
          return (
            element.getAttribute('data-object-fit') ||
            (element as HTMLElement).style.objectFit ||
            'cover'
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-object-fit': attributes.objectFit || 'cover',
          };
        },
      },
      objectPosition: {
        default: '50% 50%',
        parseHTML: (element) => {
          return (
            element.getAttribute('data-object-position') ||
            (element as HTMLElement).style.objectPosition ||
            '50% 50%'
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-object-position': attributes.objectPosition || '50% 50%',
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure.image-caption-wrapper, figure',
        getAttrs: (element) => {
          const figureEl = element as HTMLElement;
          const img = figureEl.querySelector('img');
          const figcaption = figureEl.querySelector('figcaption');
          if (!img) return false;

          const width =
            figureEl.getAttribute('data-width') ||
            img.getAttribute('data-width') ||
            img.getAttribute('width') ||
            figureEl.style.width ||
            img.style.width ||
            '100%';

          const aspectRatio =
            figureEl.getAttribute('data-aspect-ratio') ||
            img.getAttribute('data-aspect-ratio') ||
            figureEl.style.aspectRatio ||
            img.style.aspectRatio ||
            'auto';

          const alignment =
            figureEl.getAttribute('data-alignment') ||
            img.getAttribute('data-alignment') ||
            (figureEl.style.marginLeft === '0px' || figureEl.style.marginLeft === '0'
              ? 'left'
              : figureEl.style.marginRight === '0px' || figureEl.style.marginRight === '0'
              ? 'right'
              : 'center');

          const objectFit =
            figureEl.getAttribute('data-object-fit') ||
            img.getAttribute('data-object-fit') ||
            img.style.objectFit ||
            'cover';

          const objectPosition =
            figureEl.getAttribute('data-object-position') ||
            img.getAttribute('data-object-position') ||
            img.style.objectPosition ||
            '50% 50%';

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            caption: figcaption ? figcaption.textContent : null,
            width,
            aspectRatio,
            alignment,
            objectFit,
            objectPosition,
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (element) => {
          const img = element as HTMLElement;
          const width = img.getAttribute('data-width') || img.getAttribute('width') || img.style.width || '100%';
          const aspectRatio = img.getAttribute('data-aspect-ratio') || img.style.aspectRatio || 'auto';
          const alignment =
            img.getAttribute('data-alignment') ||
            (img.style.marginLeft === '0px' || img.style.marginLeft === '0'
              ? 'left'
              : img.style.marginRight === '0px' || img.style.marginRight === '0'
              ? 'right'
              : 'center');
          const objectFit = img.getAttribute('data-object-fit') || img.style.objectFit || 'cover';
          const objectPosition =
            img.getAttribute('data-object-position') ||
            img.style.objectPosition ||
            '50% 50%';

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            caption: img.getAttribute('data-caption') || null,
            width,
            aspectRatio,
            alignment,
            objectFit,
            objectPosition,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, width, aspectRatio, alignment, objectFit, objectPosition, ...imgAttrs } = HTMLAttributes;

    const w = width || '100%';
    const ratio = aspectRatio && aspectRatio !== 'auto' ? aspectRatio : null;
    const align = (alignment as ImageAlignment) || 'center';
    const fit = (objectFit as ImageObjectFit) || 'cover';
    const pos = (objectPosition as ImageObjectPosition) || '50% 50%';

    // Xử lý căn lề bằng margin
    let margin = '1.5em auto';
    if (align === 'left') {
      margin = '1.5em auto 1.5em 0';
    } else if (align === 'right') {
      margin = '1.5em 0 1.5em auto';
    }

    if (caption) {
      const figureStyle = `width: ${w}; max-width: 100%; margin: ${margin}; display: flex; flex-direction: column; align-items: ${
        align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
      }; justify-content: center;`;

      const imgStyle = `width: 100%; height: auto; ${
        ratio ? `aspect-ratio: ${ratio}; object-fit: ${fit}; object-position: ${pos};` : ''
      } display: block; border-radius: 12px;`;

      return [
        'figure',
        {
          class: 'image-caption-wrapper',
          style: figureStyle,
          'data-width': w,
          'data-aspect-ratio': ratio || 'auto',
          'data-alignment': align,
          'data-object-fit': fit,
          'data-object-position': pos,
        },
        [
          'img',
          mergeAttributes(this.options.HTMLAttributes, imgAttrs, {
            style: imgStyle,
            'data-width': w,
            'data-aspect-ratio': ratio || 'auto',
            'data-alignment': align,
            'data-object-fit': fit,
            'data-object-position': pos,
          }),
        ],
        [
          'figcaption',
          {
            style:
              'margin-top: 0.4rem; padding-bottom: 0.2rem; font-size: 0.875rem; color: #6b7280; font-style: italic; text-align: center; width: 100%; max-width: 100%;',
          },
          caption,
        ],
      ];
    }

    const imgStyle = `width: ${w}; max-width: 100%; height: auto; margin: ${margin}; ${
      ratio ? `aspect-ratio: ${ratio}; object-fit: ${fit}; object-position: ${pos};` : ''
    } display: block; border-radius: 12px;`;

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, imgAttrs, {
        style: imgStyle,
        'data-width': w,
        'data-aspect-ratio': ratio || 'auto',
        'data-alignment': align,
        'data-object-fit': fit,
        'data-object-position': pos,
      }),
    ];
  },

  addCommands() {
    return {
      setImage:
        (options: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt || '',
              title: options.title || '',
              caption: options.caption || null,
              width: options.width || '100%',
              aspectRatio: options.aspectRatio || 'auto',
              alignment: options.alignment || 'center',
              objectFit: options.objectFit || 'cover',
              objectPosition: options.objectPosition || '50% 50%',
            },
          });
        },
    };
  },
});
