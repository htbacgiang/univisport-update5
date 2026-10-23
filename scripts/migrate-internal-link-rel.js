#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const INTERNAL_HOSTNAMES = new Set([
  "dongphucunivi.com",
  "www.dongphucunivi.com",
]);

const COLLECTIONS = {
  posts: {
    label: "Posts",
    fields: ["content"],
    displayFields: ["title", "slug"],
  },
  categoryarticles: {
    label: "CategoryArticles",
    fields: ["content"],
    displayFields: ["title", "categorySlug"],
  },
  products: {
    label: "Products",
    fields: ["content"],
    displayFields: ["name", "slug", "maSanPham"],
  },
};

const ATTR_VALUE_PATTERN = `"[^"]*"|'[^']*'|[^\\s"'=<>]+`;

function loadEnvFile(fileName, overwrite = false) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (overwrite || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const options = {
    write: false,
    collections: Object.keys(COLLECTIONS),
    sampleLimit: 10,
  };

  for (const arg of argv) {
    if (arg === "--write") {
      options.write = true;
      continue;
    }

    if (arg.startsWith("--collections=")) {
      const value = arg.split("=")[1] || "";
      options.collections = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      continue;
    }

    if (arg.startsWith("--sample-limit=")) {
      const value = Number(arg.split("=")[1]);
      if (Number.isFinite(value) && value >= 0) {
        options.sampleLimit = value;
      }
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Tham số không hợp lệ: ${arg}`);
  }

  const invalidCollections = options.collections.filter(
    (collectionName) => !COLLECTIONS[collectionName]
  );
  if (invalidCollections.length > 0) {
    throw new Error(
      `Collection không hỗ trợ: ${invalidCollections.join(", ")}`
    );
  }

  return options;
}

function printHelp() {
  console.log(`
Migration bỏ nofollow khỏi internal link trong rich content.

Cách dùng:
  npm run migrate:internal-link-rel
  npm run migrate:internal-link-rel -- --write

Tùy chọn:
  --write                         Ghi thay đổi vào MongoDB. Mặc định chỉ dry-run.
  --collections=posts,products    Chỉ quét collection được chọn.
  --sample-limit=20               Số document mẫu in ra. Mặc định: 10.
`);
}

function isInternalHref(href) {
  const normalizedHref = String(href || "").trim();
  if (!normalizedHref) return false;

  if (
    normalizedHref.startsWith("/") &&
    !normalizedHref.startsWith("//")
  ) {
    return true;
  }

  if (
    normalizedHref.startsWith("#") ||
    normalizedHref.startsWith("?") ||
    normalizedHref.startsWith("./") ||
    normalizedHref.startsWith("../")
  ) {
    return true;
  }

  try {
    const url = new URL(
      normalizedHref.startsWith("//")
        ? `https:${normalizedHref}`
        : normalizedHref
    );

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      INTERNAL_HOSTNAMES.has(url.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}

function removeNofollowFromRel(rel) {
  if (!rel) return undefined;

  const normalizedRel = rel
    .split(/\s+/)
    .filter(Boolean)
    .filter((value) => value.toLowerCase() !== "nofollow")
    .join(" ");

  return normalizedRel || undefined;
}

function decodeAttributeValue(token) {
  const firstChar = token[0];
  if (
    (firstChar === '"' && token.endsWith('"')) ||
    (firstChar === "'" && token.endsWith("'"))
  ) {
    return token.slice(1, -1);
  }

  return token;
}

function getAttribute(tag, attributeName) {
  const regex = new RegExp(
    `\\s${attributeName}\\s*=\\s*(${ATTR_VALUE_PATTERN})`,
    "i"
  );
  const match = tag.match(regex);
  if (!match) return undefined;

  return decodeAttributeValue(match[1]);
}

function replaceRelAttribute(tag, nextRel) {
  const regex = new RegExp(
    `(\\srel\\s*=\\s*)(${ATTR_VALUE_PATTERN})`,
    "i"
  );
  const match = tag.match(regex);
  if (!match) return tag;

  if (!nextRel) {
    return tag.slice(0, match.index) + tag.slice(match.index + match[0].length);
  }

  const oldToken = match[2];
  const quote = oldToken[0] === "'" ? "'" : '"';
  const nextToken = `${quote}${nextRel}${quote}`;

  return (
    tag.slice(0, match.index) +
    match[1] +
    nextToken +
    tag.slice(match.index + match[0].length)
  );
}

function normalizeAnchorTag(tag) {
  const href = getAttribute(tag, "href");
  const rel = getAttribute(tag, "rel");

  if (!href || !rel || !isInternalHref(href)) {
    return { tag, changed: false };
  }

  const nextRel = removeNofollowFromRel(rel);
  if (nextRel === rel) {
    return { tag, changed: false };
  }

  return {
    tag: replaceRelAttribute(tag, nextRel),
    changed: true,
  };
}

function normalizeHtml(html) {
  if (
    typeof html !== "string" ||
    !html.match(/<a\b/i) ||
    !html.match(/nofollow/i)
  ) {
    return { html, changedLinks: 0 };
  }

  let changedLinks = 0;
  const nextHtml = html.replace(/<a\b[^>]*>/gi, (tag) => {
    const result = normalizeAnchorTag(tag);
    if (result.changed) changedLinks += 1;
    return result.tag;
  });

  return { html: nextHtml, changedLinks };
}

function buildDisplayName(doc, displayFields) {
  const parts = displayFields
    .map((field) => doc[field])
    .filter(Boolean)
    .map(String);

  return parts.length > 0 ? parts.join(" | ") : doc._id.toString();
}

async function migrateCollection(collectionName, config, options) {
  const collection = mongoose.connection.collection(collectionName);
  const query = {
    $or: config.fields.map((field) => ({
      [field]: /nofollow/i,
    })),
  };
  const projection = {
    _id: 1,
    ...Object.fromEntries(config.fields.map((field) => [field, 1])),
    ...Object.fromEntries(config.displayFields.map((field) => [field, 1])),
  };

  const cursor = collection.find(query, { projection });

  let scannedDocs = 0;
  let changedDocs = 0;
  let changedLinks = 0;
  const samples = [];

  for await (const doc of cursor) {
    scannedDocs += 1;
    const updates = {};
    let docChangedLinks = 0;

    for (const field of config.fields) {
      const result = normalizeHtml(doc[field]);
      if (result.changedLinks > 0) {
        updates[field] = result.html;
        docChangedLinks += result.changedLinks;
      }
    }

    if (docChangedLinks === 0) continue;

    changedDocs += 1;
    changedLinks += docChangedLinks;

    if (samples.length < options.sampleLimit) {
      samples.push({
        id: doc._id.toString(),
        name: buildDisplayName(doc, config.displayFields),
        links: docChangedLinks,
      });
    }

    if (options.write) {
      await collection.updateOne({ _id: doc._id }, { $set: updates });
    }
  }

  return {
    collectionName,
    label: config.label,
    scannedDocs,
    changedDocs,
    changedLinks,
    samples,
  };
}

async function main() {
  loadEnvFile(".env");
  loadEnvFile(".env.local", true);

  const options = parseArgs(process.argv.slice(2));
  if (!process.env.MONGODB_URI) {
    throw new Error("Thiếu MONGODB_URI trong môi trường hoặc file .env.");
  }

  console.log(
    options.write
      ? "WRITE mode: sẽ cập nhật MongoDB."
      : "DRY-RUN mode: chỉ thống kê, chưa ghi MongoDB."
  );
  console.log(`Collections: ${options.collections.join(", ")}`);

  await mongoose.connect(process.env.MONGODB_URI);

  const results = [];
  for (const collectionName of options.collections) {
    const config = COLLECTIONS[collectionName];
    results.push(await migrateCollection(collectionName, config, options));
  }

  await mongoose.disconnect();

  console.log("\nKết quả:");
  for (const result of results) {
    console.log(
      `- ${result.label}: quét ${result.scannedDocs}, đổi ${result.changedDocs} document, ${result.changedLinks} link`
    );

    for (const sample of result.samples) {
      console.log(`  • ${sample.name} (${sample.id}) - ${sample.links} link`);
    }
  }

  const totalChangedDocs = results.reduce(
    (total, result) => total + result.changedDocs,
    0
  );
  const totalChangedLinks = results.reduce(
    (total, result) => total + result.changedLinks,
    0
  );

  console.log(
    `\nTổng: ${totalChangedDocs} document, ${totalChangedLinks} internal link cần bỏ nofollow.`
  );

  if (!options.write && totalChangedDocs > 0) {
    console.log(
      "\nChạy lại với --write để ghi thay đổi: npm run migrate:internal-link-rel -- --write"
    );
  }
}

main().catch((error) => {
  console.error("Migration lỗi:", error.message);
  process.exit(1);
});
