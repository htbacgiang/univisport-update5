# SEO Audit API

Endpoint: `GET /api/seo/audit`

Yêu cầu quyền: admin NextAuth token.

Nguồn dữ liệu:

- `models/Post.ts` qua MongoDB/Mongoose
- `models/Product.js` qua MongoDB/Mongoose
- Không dùng mock data
- Không ghi dữ liệu vào database

## Lấy toàn bộ payload

```http
GET /api/seo/audit
```

Response:

```ts
{
  generatedAt: string;
  inventory: SeoContentInventoryItem[];
  audits: SeoAuditResult[];
  entities: SeoEntityMetric[];
  keywordHub: SeoKeywordHubItem[];
  internalLinks: SeoInternalLinkMetric[];
  integrations: SeoIntegrationStatus[];
  topicalMap: TopicalPillar[];
  dashboard: SeoDashboardSummary;
}
```

## Audit một URL

```http
GET /api/seo/audit?url=/bai-viet/slug-bai-viet
GET /api/seo/audit?url=/san-pham/slug-san-pham
```

Response:

```ts
{
  generatedAt: string;
  audit: SeoAuditResult;
}
```

## Scoring

Tổng điểm: `0-100`.

- Title: `10`
- Meta Description: `10`
- URL: `10`
- Heading Structure: `10`
- Content Quality: `20`
- Internal Link: `10`
- Images: `10`
- Schema: `10`
- E-E-A-T: `10`

Mỗi audit có:

- `criteria`: điểm từng nhóm
- `issues`: lỗi phát hiện theo severity
- `suggestions`: đề xuất hành động
- `metrics`: word count, keyword density, heading count, link count, image count, schema types, entity count
- `entities`: entity trích xuất từ title, content và FAQ bằng dictionary SEO, có `type`, `frequency`, `urlCount`, `positionWeight`, `score`
- `internalLinks`: link nội bộ phát hiện trong HTML content, gồm `sourceUrl`, `targetUrl`, `anchor`, `type`, `status`

## SEO Intelligence Center

Payload toàn phần có thêm các bảng dùng cho dashboard:

- `keywordHub`: keyword lấy từ primary keyword thật của URL, có `intent`, `priority`, `landingUrl`, `pillar`, `cluster`. Các trường `volume`, `keywordDifficulty`, `currentRank`, `targetRank` là `null` cho tới khi có GSC/Ahrefs/Semrush/CSV thật.
- `internalLinks`: danh sách internal link, phát hiện `Strong`, `Weak Link`, `Orphan`, `Too Many Links` từ content thật. Broken link cần crawler riêng nên không bị suy đoán.
- `integrations`: trạng thái nguồn dữ liệu thật như MongoDB, GA4, Search Console, Ahrefs, Semrush, CSV Import.
- `dashboard`: KPI cho SEO Intelligence Center. Các metric chưa có nguồn thật như index, ranking, traffic, clicks, CTR, impressions trả `null`.

## Entity Extraction

Entity không được sinh bằng cách đếm mọi từ xuất hiện nhiều lần. API chỉ nhận entity thuộc dictionary SEO của Univi, hỗ trợ cụm 1-4 từ như `Fitness Center`, `Personal Trainer`, `UNI DRY`, `Đồng Phục Univi`.

`score` được tính từ:

```txt
Entity Score = frequency + urlCount + positionWeight
```

Các từ vô nghĩa hoặc stop words như `Dong`, `Phuc`, `Ong`, `Ung`, `Khong`, `Voi`, `Anh` không được đưa vào danh sách entity.

## Topical Map

`topicalMap` nhóm URL theo pillar/category và cluster/keyword. Coverage được tính:

```txt
Coverage = Số URL đã có / Số URL mục tiêu
```

`targetUrlCount` được suy ra từ entity/topic signals đang có trong dữ liệu thật, không tạo danh sách chủ đề giả.
