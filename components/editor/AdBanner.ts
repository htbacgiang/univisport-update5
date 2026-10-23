import { Node, mergeAttributes } from '@tiptap/core'

export interface AdBannerOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    adBanner: {
      /**
       * Insert a horizontal ad banner (image + link)
       */
      setAdBanner: (options: { src: string; href: string; alt?: string }) => ReturnType
    }
  }
}

export const AdBanner = Node.create<AdBannerOptions>({
  name: 'adBanner',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'ad-banner-block',
        style: 'display:block; width:100%; margin:20px 0; text-align:center;',
      },
    }
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      href: { default: '#' },
      alt: { default: 'Quảng cáo' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.ad-banner-block',
        getAttrs: (element) => {
          const el = element as HTMLElement
          const anchor = el.querySelector('a')
          const img = el.querySelector('img')
          return {
            href: anchor?.getAttribute('href') || '#',
            src: img?.getAttribute('src') || '',
            alt: img?.getAttribute('alt') || 'Quảng cáo',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        'a',
        {
          href: node.attrs.href,
          target: '_blank',
          rel: 'noopener noreferrer sponsored',
          style: 'display:block; width:100%;',
        },
        [
          'img',
          {
            src: node.attrs.src,
            alt: node.attrs.alt || 'Quảng cáo',
            style:
              'display:block; width:100%; height:auto; max-width:100%; border-radius:6px; object-fit:cover;',
            loading: 'lazy',
          },
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setAdBanner:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
