# Rich Editor Enhanced Features

## 🚀 Tính năng đã được bổ sung

### 1. **Định dạng văn bản cơ bản**
- **Text Color**: Màu chữ tùy chỉnh
- **Bold, Italic, Underline, Strikethrough**: Định dạng văn bản cơ bản
- **Headings**: H1, H2, H3
- **Text Alignment**: Căn lề trái, giữa, phải
- **Blockquote**: Trích dẫn
- **Code**: Inline code và Code block
- **Lists**: Ordered list (ol), Unordered list (ul)

### 2. **Find & Replace**
- **Search**: Tìm kiếm text trong bài viết
- **Replace**: Thay thế text
- **Replace All**: Thay thế tất cả
- **Case Sensitive**: Phân biệt chữ hoa/thường
- **Whole Word**: Tìm kiếm từ hoàn chỉnh
- **Navigation**: Di chuyển giữa các kết quả tìm kiếm

### 3. **Word Count & Reading Time**
- **Word Count**: Đếm số từ
- **Character Count**: Đếm ký tự (có và không có khoảng trắng)
- **Paragraph Count**: Đếm số đoạn văn
- **Sentence Count**: Đếm số câu
- **Reading Time**: Ước tính thời gian đọc (200 từ/phút)

### 4. **File Attachment**
- **Upload Files**: Tải lên nhiều loại file (PDF, DOC, XLS, PPT, Images, Videos, Audio)
- **File Management**: Quản lý danh sách file đã upload
- **Insert into Editor**: Chèn file vào bài viết với giao diện đẹp
- **File Preview**: Hiển thị thông tin file (tên, kích thước, loại)
- **Download Link**: Link download trực tiếp
- **Quick Insert**: Chèn file từ URL hoặc placeholder

### 5. **Media & Links**
- **Images**: Upload và insert hình ảnh
- **YouTube Videos**: Embed YouTube videos
- **Links**: Insert và edit links với target="_blank"
- **Thumbnail Selection**: Chọn thumbnail cho bài viết

## 🛠️ Cách sử dụng

### Thay đổi Text Color
1. Chọn text cần thay đổi màu
2. Click vào color picker trên toolbar
3. Chọn màu mong muốn

### Tìm kiếm và Thay thế
1. Click vào nút "Find" trên toolbar
2. Nhập text cần tìm
3. Sử dụng các tùy chọn (Case sensitive, Whole word)
4. Click "Replace" để thay thế từng từ hoặc "Replace All" để thay thế tất cả

### Chèn File
1. Click vào nút "Attach" trên toolbar
2. Upload file hoặc chọn từ danh sách đã có
3. File sẽ được chèn vào bài viết với giao diện đẹp

### Chèn YouTube Video
1. Click vào nút YouTube trên toolbar
2. Nhập URL của video YouTube
3. Video sẽ được embed vào bài viết

## 📁 Cấu trúc Files

```
components/editor/
├── index.tsx                 # Editor chính
├── ToolBar/
│   ├── index.tsx            # Toolbar với các tính năng cơ bản
│   ├── Button.tsx           # Button component
│   └── EmbedYoutube.tsx     # YouTube embed
├── FindReplace.tsx          # Find & Replace component
├── FileAttachment.tsx       # File upload & management
├── WordCount.tsx            # Word count & reading time
├── Link/                    # Link management
├── GalleryModal/            # Image gallery
├── SeoForm.tsx              # SEO form
├── ThumbnailSelector.tsx    # Thumbnail selection
├── EditorUtils.ts           # Utility functions
└── index-utils.ts           # Re-export utilities
```

## 🎨 CSS Styling

File `styles/editor.css` chứa styling cho:
- File attachments
- Word count display
- Dark mode support
- Responsive design
- Animations
- Color picker enhancements

## 🔧 Dependencies

Các package TipTap cần thiết (đã có sẵn):
```json
{
  "@tiptap/extension-color": "^2.9.1",
  "@tiptap/extension-image": "^2.0.0-beta.199",
  "@tiptap/extension-link": "^2.0.0-beta.199",
  "@tiptap/extension-placeholder": "^2.0.0-beta.199",
  "@tiptap/extension-text-align": "^2.9.1",
  "@tiptap/extension-text-style": "^2.9.1",
  "@tiptap/extension-underline": "^2.0.0-beta.199",
  "@tiptap/extension-youtube": "^2.0.0-beta.199"
}
```

## 🚀 Tính năng tương lai có thể bổ sung

1. **Highlight/Background color** - làm nổi bật text
2. **Font Size & Family** - thay đổi kích thước và loại font
3. **Table support** - chèn và quản lý bảng
4. **Audio Player** - embed audio files
5. **Social Media Embed** - Facebook, Twitter posts
6. **Maps Embed** - Google Maps, OpenStreetMap
7. **Comments/Annotations** - ghi chú trong bài viết
8. **Version History** - lịch sử phiên bản
9. **Collaboration** - Track changes, comments
10. **Real-time SEO Score** - điểm SEO theo thời gian thực

## 📝 Ghi chú

- Tất cả tính năng mới đều hỗ trợ dark mode
- Responsive design cho mobile devices
- Accessibility features (focus states, keyboard navigation)
- Performance optimized với lazy loading
- TypeScript support đầy đủ
- CSS được thiết kế theo brand colors của Eco Bac Giang
- Sử dụng các extension TipTap cơ bản đã có sẵn
