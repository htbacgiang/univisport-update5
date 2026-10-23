import { Node, mergeAttributes } from '@tiptap/core'

export interface FacebookReelOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    facebookReel: {
      /**
       * Insert a facebook reel
       */
      setFacebookReel: (options: { src: string }) => ReturnType,
    }
  }
}

export const FacebookReel = Node.create<FacebookReelOptions>({
  name: 'facebookReel',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'facebook-reel-embed',
        style: 'position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0; background: #000;',
      },
    }
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.facebook-reel-embed',
        getAttrs: element => ({
          src: (element as HTMLElement).querySelector('iframe')?.getAttribute('src'),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        'iframe',
        {
          src: node.attrs.src,
          style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;',
          scrolling: 'no',
          allowtransparency: 'true',
          allow: 'encrypted-media; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share',
          allowfullscreen: 'true',
          loading: 'lazy',
        },
      ],
    ]
  },

  addCommands() {
    return {
      setFacebookReel: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
