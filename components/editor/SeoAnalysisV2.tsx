import { FC, useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { BsCheckCircle, BsXCircle, BsExclamationTriangle, BsInfoCircle } from "react-icons/bs";

interface SeoAnalysisProps {
  editor: Editor | null;
  title: string;
  meta: string;
  slug: string;
  focusKeyword: string;
}

interface SeoCheck {
  id: string;
  title: string;
  description: string;
  status: 'good' | 'bad' | 'warning' | 'info';
  score: number;
  maxScore: number;
  passed: boolean;
  category: 'basic' | 'additional' | 'title-readability' | 'content-readability';
}

const SeoAnalysisV2: FC<SeoAnalysisProps> = ({ editor, title, meta, slug, focusKeyword }) => {
  const [seoChecks, setSeoChecks] = useState<SeoCheck[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [maxTotalScore, setMaxTotalScore] = useState(0);

  useEffect(() => {
    if (!editor || !focusKeyword) return;
    
    const content = editor.getText();
    const htmlContent = editor.getHTML();
    
    const checks: SeoCheck[] = [
      // ===== BASIC SEO (60 điểm) =====
      {
        id: 'title-keyword',
        title: 'Từ khóa trong tiêu đề SEO',
        description: getTitleKeywordDescription(title, focusKeyword),
        status: getTitleKeywordStatus(title, focusKeyword),
        score: calculateTitleKeywordScore(title, focusKeyword),
        maxScore: 10,
        passed: title.toLowerCase().includes(focusKeyword.toLowerCase()),
        category: 'basic'
      },
      {
        id: 'meta-keyword',
        title: 'Từ khóa trong mô tả meta',
        description: getMetaKeywordDescription(meta, focusKeyword),
        status: getMetaKeywordStatus(meta, focusKeyword),
        score: calculateMetaKeywordScore(meta, focusKeyword),
        maxScore: 10,
        passed: meta.toLowerCase().includes(focusKeyword.toLowerCase()),
        category: 'basic'
      },
      {
        id: 'url-keyword',
        title: 'Từ khóa trong URL',
        description: getUrlKeywordDescription(slug, focusKeyword),
        status: getUrlKeywordStatus(slug, focusKeyword),
        score: calculateUrlKeywordScore(slug, focusKeyword),
        maxScore: 10,
        passed: slug.toLowerCase().includes(focusKeyword.toLowerCase().replace(/\s+/g, '-')),
        category: 'basic'
      },
      {
        id: 'content-start-keyword',
        title: 'Từ khóa ở đầu nội dung',
        description: getContentStartKeywordDescription(content, focusKeyword),
        status: getContentStartKeywordStatus(content, focusKeyword),
        score: calculateContentStartKeywordScore(content, focusKeyword),
        maxScore: 10,
        passed: content.toLowerCase().indexOf(focusKeyword.toLowerCase()) < content.length * 0.1,
        category: 'basic'
      },
      {
        id: 'content-keyword',
        title: 'Từ khóa trong nội dung',
        description: getContentKeywordDescription(content, focusKeyword),
        status: getContentKeywordStatus(content, focusKeyword),
        score: calculateContentKeywordScore(content, focusKeyword),
        maxScore: 10,
        passed: content.toLowerCase().includes(focusKeyword.toLowerCase()),
        category: 'basic'
      },
      {
        id: 'content-length',
        title: 'Độ dài nội dung',
        description: getContentLengthDescription(content),
        status: getContentLengthStatus(content),
        score: calculateContentLengthScore(content),
        maxScore: 10,
        passed: content.length >= 600,
        category: 'basic'
      },
      
      // ===== ADDITIONAL SEO (25 điểm) =====
      {
        id: 'heading-keyword',
        title: 'Từ khóa trong tiêu đề phụ',
        description: getHeadingKeywordDescription(htmlContent, focusKeyword),
        status: getHeadingKeywordStatus(htmlContent, focusKeyword),
        score: calculateHeadingKeywordScore(htmlContent, focusKeyword),
        maxScore: 5,
        passed: htmlContent.includes(`<h2>`) || htmlContent.includes(`<h3>`) || htmlContent.includes(`<h4>`),
        category: 'additional'
      },
      {
        id: 'image-alt',
        title: 'Alt text cho hình ảnh',
        description: getImageAltDescription(htmlContent, focusKeyword),
        status: getImageAltStatus(htmlContent, focusKeyword),
        score: calculateImageAltScore(htmlContent, focusKeyword),
        maxScore: 5,
        passed: htmlContent.includes(`<img`),
        category: 'additional'
      },
      {
        id: 'keyword-density',
        title: 'Mật độ từ khóa',
        description: getKeywordDensityDescription(content, focusKeyword),
        status: getKeywordDensityStatus(content, focusKeyword),
        score: calculateKeywordDensityScore(content, focusKeyword),
        maxScore: 5,
        passed: calculateKeywordDensity(content, focusKeyword) > 0.5,
        category: 'additional'
      },
      {
        id: 'url-length',
        title: 'Độ dài URL',
        description: getUrlLengthDescription(slug),
        status: getUrlLengthStatus(slug),
        score: calculateUrlLengthScore(slug),
        maxScore: 5,
        passed: slug.length <= 75,
        category: 'additional'
      },
      {
        id: 'external-links',
        title: 'Liên kết ngoài',
        description: getExternalLinksDescription(htmlContent),
        status: getExternalLinksStatus(htmlContent),
        score: calculateExternalLinksScore(htmlContent),
        maxScore: 5,
        passed: htmlContent.includes(`<a href="http`),
        category: 'additional'
      },
      
      // ===== TITLE READABILITY (10 điểm) =====
      {
        id: 'title-position',
        title: 'Vị trí từ khóa trong tiêu đề',
        description: getTitlePositionDescription(title, focusKeyword),
        status: getTitlePositionStatus(title, focusKeyword),
        score: calculateTitlePositionScore(title, focusKeyword),
        maxScore: 3,
        passed: title.toLowerCase().indexOf(focusKeyword.toLowerCase()) < title.length / 2,
        category: 'title-readability'
      },
      {
        id: 'title-emotion',
        title: 'Cảm xúc trong tiêu đề',
        description: getTitleEmotionDescription(title),
        status: getTitleEmotionStatus(title),
        score: calculateTitleEmotionScore(title),
        maxScore: 3,
        passed: hasEmotionalWords(title),
        category: 'title-readability'
      },
      {
        id: 'title-power-words',
        title: 'Từ mạnh trong tiêu đề',
        description: getTitlePowerWordsDescription(title),
        status: getTitlePowerWordsStatus(title),
        score: calculateTitlePowerWordsScore(title),
        maxScore: 2,
        passed: hasPowerWords(title),
        category: 'title-readability'
      },
      {
        id: 'title-numbers',
        title: 'Số trong tiêu đề',
        description: getTitleNumbersDescription(title),
        status: getTitleNumbersStatus(title),
        score: calculateTitleNumbersScore(title),
        maxScore: 2,
        passed: /\d/.test(title),
        category: 'title-readability'
      },
      
      // ===== CONTENT READABILITY (5 điểm) =====
      {
        id: 'short-paragraphs',
        title: 'Đoạn văn ngắn',
        description: getShortParagraphsDescription(content),
        status: getShortParagraphsStatus(content),
        score: calculateShortParagraphsScore(content),
        maxScore: 3,
        passed: hasShortParagraphs(content),
        category: 'content-readability'
      },
      {
        id: 'media-usage',
        title: 'Sử dụng hình ảnh/video',
        description: getMediaUsageDescription(htmlContent),
        status: getMediaUsageStatus(htmlContent),
        score: calculateMediaUsageScore(htmlContent),
        maxScore: 2,
        passed: htmlContent.includes(`<img`) || htmlContent.includes(`<video`) || htmlContent.includes(`<iframe`),
        category: 'content-readability'
      }
    ];
    
    setSeoChecks(checks);
    
    const total = checks.reduce((sum, check) => sum + check.score, 0);
    const maxTotal = checks.reduce((sum, check) => sum + check.maxScore, 0);
    setTotalScore(total);
    setMaxTotalScore(maxTotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, title, meta, slug, focusKeyword]);

  // ===== HELPER FUNCTIONS =====
  
  const calculateKeywordDensity = (content: string, keyword: string): number => {
    if (!content || !keyword) return 0;
    const wordCount = content.split(/\s+/).length;
    const keywordMatches = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    return wordCount > 0 ? (keywordMatches / wordCount) * 100 : 0;
  };

  // ===== BASIC SEO FUNCTIONS =====
  
  const getTitleKeywordDescription = (title: string, keyword: string): string => {
    const hasKeyword = title.toLowerCase().includes(keyword.toLowerCase());
    const isAtBeginning = title.toLowerCase().indexOf(keyword.toLowerCase()) < title.length * 0.3;
    const length = title.length;
    
    if (!hasKeyword) return 'Thêm từ khóa chính vào tiêu đề SEO.';
    if (length > 70) return `Tiêu đề quá dài (${length}/70 ký tự). Rút gọn để hiển thị đầy đủ trên Google.`;
    if (!isAtBeginning) return 'Từ khóa nên ở đầu tiêu đề để tăng hiệu quả SEO.';
    return `Tuyệt vời! Tiêu đề có từ khóa ở đầu và độ dài phù hợp (${length}/70 ký tự).`;
  };

  const getTitleKeywordStatus = (title: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasKeyword = title.toLowerCase().includes(keyword.toLowerCase());
    const isAtBeginning = title.toLowerCase().indexOf(keyword.toLowerCase()) < title.length * 0.3;
    const length = title.length;
    
    if (!hasKeyword) return 'bad';
    if (length > 70 || !isAtBeginning) return 'warning';
    return 'good';
  };

  const calculateTitleKeywordScore = (title: string, keyword: string): number => {
    const hasKeyword = title.toLowerCase().includes(keyword.toLowerCase());
    const isAtBeginning = title.toLowerCase().indexOf(keyword.toLowerCase()) < title.length * 0.3;
    const length = title.length;
    
    if (!hasKeyword) return 0;
    if (length > 70) return 3;
    if (!isAtBeginning) return 7;
    return 10;
  };

  const getMetaKeywordDescription = (meta: string, keyword: string): string => {
    const hasKeyword = meta.toLowerCase().includes(keyword.toLowerCase());
    const length = meta.length;
    
    if (!hasKeyword) return 'Thêm từ khóa chính vào mô tả meta.';
    if (length < 160) return `Mô tả quá ngắn (${length}/160-250 ký tự).`;
    if (length > 250) return `Mô tả quá dài (${length}/160-250 ký tự).`;
    return `Tuyệt vời! Mô tả có từ khóa và độ dài phù hợp (${length}/160-250 ký tự).`;
  };

  const getMetaKeywordStatus = (meta: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasKeyword = meta.toLowerCase().includes(keyword.toLowerCase());
    const length = meta.length;
    
    if (!hasKeyword) return 'bad';
    if (length < 160 || length > 250) return 'warning';
    return 'good';
  };

  const calculateMetaKeywordScore = (meta: string, keyword: string): number => {
    const hasKeyword = meta.toLowerCase().includes(keyword.toLowerCase());
    const length = meta.length;
    
    if (!hasKeyword) return 0;
    if (length < 160 || length > 250) return 5;
    return 10;
  };

  const getUrlKeywordDescription = (slug: string, keyword: string): string => {
    const hasKeyword = slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'));
    const length = slug.length;
    
    if (!hasKeyword) return 'Thêm từ khóa chính vào URL.';
    if (length > 75) return `URL quá dài (${length}/75 ký tự).`;
    return `Tuyệt vời! URL có từ khóa và độ dài phù hợp (${length}/75 ký tự).`;
  };

  const getUrlKeywordStatus = (slug: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasKeyword = slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'));
    const length = slug.length;
    
    if (!hasKeyword) return 'bad';
    if (length > 75) return 'warning';
    return 'good';
  };

  const calculateUrlKeywordScore = (slug: string, keyword: string): number => {
    const hasKeyword = slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'));
    const length = slug.length;
    
    if (!hasKeyword) return 0;
    if (length > 75) return 5;
    return 10;
  };

  const getContentStartKeywordDescription = (content: string, keyword: string): string => {
    const keywordIndex = content.toLowerCase().indexOf(keyword.toLowerCase());
    const contentLength = content.length;
    const targetPosition = contentLength * 0.1;
    
    if (keywordIndex === -1) return 'Thêm từ khóa chính vào nội dung.';
    if (keywordIndex > targetPosition) return `Từ khóa xuất hiện ở vị trí ${keywordIndex}, nên đặt trong ${Math.round(targetPosition)} ký tự đầu.`;
    return `Tuyệt vời! Từ khóa xuất hiện sớm ở vị trí ${keywordIndex}.`;
  };

  const getContentStartKeywordStatus = (content: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const keywordIndex = content.toLowerCase().indexOf(keyword.toLowerCase());
    const targetPosition = content.length * 0.1;
    
    if (keywordIndex === -1) return 'bad';
    if (keywordIndex > targetPosition) return 'warning';
    return 'good';
  };

  const calculateContentStartKeywordScore = (content: string, keyword: string): number => {
    const keywordIndex = content.toLowerCase().indexOf(keyword.toLowerCase());
    const targetPosition = content.length * 0.1;
    
    if (keywordIndex === -1) return 0;
    if (keywordIndex > targetPosition) return 5;
    return 10;
  };

  const getContentKeywordDescription = (content: string, keyword: string): string => {
    const density = calculateKeywordDensity(content, keyword);
    const hasKeyword = content.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasKeyword) return 'Thêm từ khóa chính vào nội dung.';
    if (density < 0.5) return `Mật độ từ khóa thấp (${density.toFixed(2)}%). Nhắm đến 1-1.5%.`;
    if (density > 2.5) return `Mật độ từ khóa cao (${density.toFixed(2)}%). Giảm xuống 1-1.5%.`;
    return `Tuyệt vời! Mật độ từ khóa phù hợp (${density.toFixed(2)}%).`;
  };

  const getContentKeywordStatus = (content: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const density = calculateKeywordDensity(content, keyword);
    const hasKeyword = content.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasKeyword) return 'bad';
    if (density < 0.5 || density > 2.5) return 'warning';
    return 'good';
  };

  const calculateContentKeywordScore = (content: string, keyword: string): number => {
    const density = calculateKeywordDensity(content, keyword);
    const hasKeyword = content.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasKeyword) return 0;
    if (density < 0.5 || density > 2.5) return 5;
    return 10;
  };

  const getContentLengthDescription = (content: string): string => {
    const wordCount = content.split(/\s+/).length;
    
    if (wordCount >= 2500) return `${wordCount} từ - Tuyệt vời! (10 điểm)`;
    if (wordCount >= 2000) return `${wordCount} từ - Rất tốt! (9 điểm)`;
    if (wordCount >= 1500) return `${wordCount} từ - Tốt! (8 điểm)`;
    if (wordCount >= 1000) return `${wordCount} từ - Khá! (6 điểm)`;
    if (wordCount >= 600) return `${wordCount} từ - Cần cải thiện! (4 điểm)`;
    return `${wordCount} từ - Quá ngắn! Cần ít nhất 600 từ. (0 điểm)`;
  };

  const getContentLengthStatus = (content: string): 'good' | 'bad' | 'warning' | 'info' => {
    const wordCount = content.split(/\s+/).length;
    
    if (wordCount >= 2000) return 'good';
    if (wordCount >= 1000) return 'warning';
    return 'bad';
  };

  const calculateContentLengthScore = (content: string): number => {
    const wordCount = content.split(/\s+/).length;
    
    if (wordCount >= 2500) return 10;
    if (wordCount >= 2000) return 9;
    if (wordCount >= 1500) return 8;
    if (wordCount >= 1000) return 6;
    if (wordCount >= 600) return 4;
    return 0;
  };

  // ===== ADDITIONAL SEO FUNCTIONS =====
  
  const getHeadingKeywordDescription = (htmlContent: string, keyword: string): string => {
    const hasHeadings = htmlContent.includes('<h2>') || htmlContent.includes('<h3>') || htmlContent.includes('<h4>');
    const hasKeywordInHeadings = htmlContent.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasHeadings) return 'Thêm tiêu đề phụ (H2, H3, H4) vào nội dung.';
    if (!hasKeywordInHeadings) return 'Thêm từ khóa chính vào tiêu đề phụ.';
    return 'Tuyệt vời! Từ khóa xuất hiện trong tiêu đề phụ.';
  };

  const getHeadingKeywordStatus = (htmlContent: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasHeadings = htmlContent.includes('<h2>') || htmlContent.includes('<h3>') || htmlContent.includes('<h4>');
    const hasKeywordInHeadings = htmlContent.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasHeadings) return 'bad';
    if (!hasKeywordInHeadings) return 'warning';
    return 'good';
  };

  const calculateHeadingKeywordScore = (htmlContent: string, keyword: string): number => {
    const hasHeadings = htmlContent.includes('<h2>') || htmlContent.includes('<h3>') || htmlContent.includes('<h4>');
    const hasKeywordInHeadings = htmlContent.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasHeadings) return 0;
    if (!hasKeywordInHeadings) return 2;
    return 5;
  };

  const getImageAltDescription = (htmlContent: string, keyword: string): string => {
    const hasImages = htmlContent.includes('<img');
    const hasKeywordInAlt = htmlContent.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasImages) return 'Thêm hình ảnh vào nội dung để tăng tính hấp dẫn.';
    if (!hasKeywordInAlt) return 'Thêm từ khóa chính vào thuộc tính Alt của hình ảnh.';
    return 'Tuyệt vời! Hình ảnh có Alt text chứa từ khóa.';
  };

  const getImageAltStatus = (htmlContent: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasImages = htmlContent.includes('<img');
    const hasKeywordInAlt = htmlContent.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasImages) return 'info';
    if (!hasKeywordInAlt) return 'warning';
    return 'good';
  };

  const calculateImageAltScore = (htmlContent: string, keyword: string): number => {
    const hasImages = htmlContent.includes('<img');
    const hasKeywordInAlt = htmlContent.toLowerCase().includes(keyword.toLowerCase());
    
    if (!hasImages) return 0;
    if (!hasKeywordInAlt) return 2;
    return 5;
  };

  const getKeywordDensityDescription = (content: string, keyword: string): string => {
    const density = calculateKeywordDensity(content, keyword);
    
    if (density < 0.5) return `Mật độ từ khóa thấp (${density.toFixed(2)}%). Nhắm đến 1-1.5%.`;
    if (density > 2.5) return `Mật độ từ khóa cao (${density.toFixed(2)}%). Giảm xuống 1-1.5%.`;
    return `Mật độ từ khóa phù hợp (${density.toFixed(2)}%).`;
  };

  const getKeywordDensityStatus = (content: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const density = calculateKeywordDensity(content, keyword);
    
    if (density < 0.5 || density > 2.5) return 'warning';
    return 'good';
  };

  const calculateKeywordDensityScore = (content: string, keyword: string): number => {
    const density = calculateKeywordDensity(content, keyword);
    
    if (density < 0.5 || density > 2.5) return 2;
    return 5;
  };

  const getUrlLengthDescription = (slug: string): string => {
    const length = slug.length;
    
    if (length > 75) return `URL quá dài (${length}/75 ký tự).`;
    return `URL có độ dài phù hợp (${length}/75 ký tự).`;
  };

  const getUrlLengthStatus = (slug: string): 'good' | 'bad' | 'warning' | 'info' => {
    const length = slug.length;
    
    if (length > 75) return 'warning';
    return 'good';
  };

  const calculateUrlLengthScore = (slug: string): number => {
    const length = slug.length;
    
    if (length > 75) return 2;
    return 5;
  };

  const getExternalLinksDescription = (htmlContent: string): string => {
    const hasExternalLinks = htmlContent.includes('<a href="http');
    
    if (!hasExternalLinks) return 'Thêm liên kết đến nguồn uy tín bên ngoài.';
    return 'Tuyệt vời! Có liên kết đến nguồn bên ngoài.';
  };

  const getExternalLinksStatus = (htmlContent: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasExternalLinks = htmlContent.includes('<a href="http');
    
    if (!hasExternalLinks) return 'info';
    return 'good';
  };

  const calculateExternalLinksScore = (htmlContent: string): number => {
    const hasExternalLinks = htmlContent.includes('<a href="http');
    
    if (!hasExternalLinks) return 0;
    return 5;
  };

  const getInternalLinksDescription = (htmlContent: string): string => {
    const hasInternalLinks = htmlContent.includes('<a href="/');
    
    if (!hasInternalLinks) return 'Thêm liên kết nội bộ đến bài viết liên quan.';
    return 'Tuyệt vời! Có liên kết nội bộ.';
  };

  const getInternalLinksStatus = (htmlContent: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasInternalLinks = htmlContent.includes('<a href="/');
    
    if (!hasInternalLinks) return 'info';
    return 'good';
  };

  const calculateInternalLinksScore = (htmlContent: string): number => {
    const hasInternalLinks = htmlContent.includes('<a href="/');
    
    if (!hasInternalLinks) return 0;
    return 5;
  };

  // ===== TITLE READABILITY FUNCTIONS =====
  
  const getTitlePositionDescription = (title: string, keyword: string): string => {
    const keywordIndex = title.toLowerCase().indexOf(keyword.toLowerCase());
    const isAtBeginning = keywordIndex < title.length / 2;
    
    if (keywordIndex === -1) return 'Thêm từ khóa vào tiêu đề.';
    if (!isAtBeginning) return 'Từ khóa nên ở đầu tiêu đề để tăng hiệu quả.';
    return 'Tuyệt vời! Từ khóa ở đầu tiêu đề.';
  };

  const getTitlePositionStatus = (title: string, keyword: string): 'good' | 'bad' | 'warning' | 'info' => {
    const keywordIndex = title.toLowerCase().indexOf(keyword.toLowerCase());
    const isAtBeginning = keywordIndex < title.length / 2;
    
    if (keywordIndex === -1) return 'bad';
    if (!isAtBeginning) return 'warning';
    return 'good';
  };

  const calculateTitlePositionScore = (title: string, keyword: string): number => {
    const keywordIndex = title.toLowerCase().indexOf(keyword.toLowerCase());
    const isAtBeginning = keywordIndex < title.length / 2;
    
    if (keywordIndex === -1) return 0;
    if (!isAtBeginning) return 1;
    return 3;
  };

  const hasEmotionalWords = (title: string): boolean => {
    const emotionalWords = ['tuyệt vời', 'bí mật', 'đáng kinh ngạc', 'không thể tin được', 'độc đáo', 'đặc biệt'];
    return emotionalWords.some(word => title.toLowerCase().includes(word));
  };

  const getTitleEmotionDescription = (title: string): string => {
    const hasEmotion = hasEmotionalWords(title);
    
    if (!hasEmotion) return 'Thêm từ gợi cảm xúc vào tiêu đề (tuyệt vời, bí mật, đáng kinh ngạc...).';
    return 'Tuyệt vời! Tiêu đề có từ gợi cảm xúc.';
  };

  const getTitleEmotionStatus = (title: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasEmotion = hasEmotionalWords(title);
    
    if (!hasEmotion) return 'warning';
    return 'good';
  };

  const calculateTitleEmotionScore = (title: string): number => {
    const hasEmotion = hasEmotionalWords(title);
    
    if (!hasEmotion) return 0;
    return 3;
  };

  const hasPowerWords = (title: string): boolean => {
    const powerWords = ['tốt nhất', 'hiệu quả', 'nhanh chóng', 'dễ dàng', 'hoàn hảo', 'tối ưu'];
    return powerWords.some(word => title.toLowerCase().includes(word));
  };

  const getTitlePowerWordsDescription = (title: string): string => {
    const hasPower = hasPowerWords(title);
    
    if (!hasPower) return 'Thêm từ mạnh vào tiêu đề (tốt nhất, hiệu quả, nhanh chóng...).';
    return 'Tuyệt vời! Tiêu đề có từ mạnh.';
  };

  const getTitlePowerWordsStatus = (title: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasPower = hasPowerWords(title);
    
    if (!hasPower) return 'warning';
    return 'good';
  };

  const calculateTitlePowerWordsScore = (title: string): number => {
    const hasPower = hasPowerWords(title);
    
    if (!hasPower) return 0;
    return 2;
  };

  const getTitleNumbersDescription = (title: string): string => {
    const hasNumbers = /\d/.test(title);
    
    if (!hasNumbers) return 'Thêm số vào tiêu đề (10 cách, 5 bước...).';
    return 'Tuyệt vời! Tiêu đề có số.';
  };

  const getTitleNumbersStatus = (title: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasNumbers = /\d/.test(title);
    
    if (!hasNumbers) return 'warning';
    return 'good';
  };

  const calculateTitleNumbersScore = (title: string): number => {
    const hasNumbers = /\d/.test(title);
    
    if (!hasNumbers) return 0;
    return 2;
  };

  // ===== CONTENT READABILITY FUNCTIONS =====
  
  const hasShortParagraphs = (content: string): boolean => {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    const shortParagraphs = paragraphs.filter(p => p.length <= 150);
    return shortParagraphs.length >= paragraphs.length * 0.7;
  };

  const getShortParagraphsDescription = (content: string): string => {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    const shortParagraphs = paragraphs.filter(p => p.length <= 150);
    const percentage = paragraphs.length > 0 ? (shortParagraphs.length / paragraphs.length) * 100 : 0;
    
    if (percentage < 70) return `Chỉ ${Math.round(percentage)}% đoạn văn ngắn. Nhắm đến 70%.`;
    return `Tuyệt vời! ${Math.round(percentage)}% đoạn văn ngắn.`;
  };

  const getShortParagraphsStatus = (content: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasShort = hasShortParagraphs(content);
    
    if (!hasShort) return 'warning';
    return 'good';
  };

  const calculateShortParagraphsScore = (content: string): number => {
    const hasShort = hasShortParagraphs(content);
    
    if (!hasShort) return 1;
    return 3;
  };

  const getMediaUsageDescription = (htmlContent: string): string => {
    const hasMedia = htmlContent.includes('<img') || htmlContent.includes('<video') || htmlContent.includes('<iframe');
    
    if (!hasMedia) return 'Thêm hình ảnh hoặc video để tăng tính hấp dẫn.';
    return 'Tuyệt vời! Nội dung có hình ảnh/video.';
  };

  const getMediaUsageStatus = (htmlContent: string): 'good' | 'bad' | 'warning' | 'info' => {
    const hasMedia = htmlContent.includes('<img') || htmlContent.includes('<video') || htmlContent.includes('<iframe');
    
    if (!hasMedia) return 'warning';
    return 'good';
  };

  const calculateMediaUsageScore = (htmlContent: string): number => {
    const hasMedia = htmlContent.includes('<img') || htmlContent.includes('<video') || htmlContent.includes('<iframe');
    
    if (!hasMedia) return 0;
    return 3;
  };

  // ===== UI HELPER FUNCTIONS =====
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <BsCheckCircle className="text-green-500" size={16} />;
      case 'bad':
        return <BsXCircle className="text-red-500" size={16} />;
      case 'warning':
        return <BsExclamationTriangle className="text-yellow-500" size={16} />;
      case 'info':
        return <BsInfoCircle className="text-blue-500" size={16} />;
      default:
        return <BsInfoCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'bad':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Tuyệt vời';
    if (percentage >= 60) return 'Tốt';
    if (percentage >= 40) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'basic': return 'SEO cơ bản';
      case 'additional': return 'Bổ sung';
      case 'title-readability': return 'Khả năng đọc tiêu đề';
      case 'content-readability': return 'Khả năng đọc nội dung';
      default: return category;
    }
  };

  const getCategoryChecks = (category: string) => {
    return seoChecks.filter(check => check.category === category);
  };

  if (!focusKeyword) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Nhập từ khóa chính để phân tích SEO
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score Summary */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Phân tích SEO</h3>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(totalScore, maxTotalScore)}`}>
              {totalScore}/{maxTotalScore}
            </div>
            <div className={`text-sm ${getScoreColor(totalScore, maxTotalScore)}`}>
              {getScoreLabel(totalScore, maxTotalScore)}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              totalScore >= maxTotalScore * 0.8 ? 'bg-green-500' : 
              totalScore >= maxTotalScore * 0.6 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(totalScore / maxTotalScore) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* SEO Checks by Category */}
      {['basic', 'additional', 'title-readability', 'content-readability'].map(category => {
        const categoryChecks = getCategoryChecks(category);
        if (categoryChecks.length === 0) return null;
        
        return (
          <div key={category} className="space-y-3">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white">
              {getCategoryTitle(category)}
            </h4>
            {categoryChecks.map((check) => (
              <div key={check.id} className={`border rounded-lg p-3 ${getStatusColor(check.status)}`}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-gray-800 dark:text-white">{check.title}</h5>
                      <span className={`text-sm font-medium ${getScoreColor(check.score, check.maxScore)}`}>
                        {check.score}/{check.maxScore}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{check.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default SeoAnalysisV2;
