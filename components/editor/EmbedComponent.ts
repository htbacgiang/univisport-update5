import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import EmbedComponentView from './EmbedComponentView'

export interface EmbedComponentOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embedComponent: {
      /**
       * Chèn một React component có sẵn vào nội dung bài viết
       */
      setEmbedComponent: (options: { name: string; props?: string }) => ReturnType
    }
  }
}

export const EmbedComponent = Node.create<EmbedComponentOptions>({
  name: 'embedComponent',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-component'),
        renderHTML: (attributes) => ({ 'data-component': attributes.name }),
      },
      props: {
        default: '{}',
        parseHTML: (element) => element.getAttribute('data-props') || '{}',
        renderHTML: (attributes) => ({ 'data-props': attributes.props || '{}' }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-component]',
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-component': node.attrs.name,
        'data-props': node.attrs.props || '{}',
        class: 'embed-component-block',
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedComponentView)
  },

  addCommands() {
    return {
      setEmbedComponent:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              name: options.name,
              props: options.props || '{}',
            },
          })
        },
    }
  },
})
