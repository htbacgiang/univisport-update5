const fs = require('fs');
const path = require('path');

const reportText = fs.readFileSync('knip_report.txt', 'utf-8');
const lines = reportText.split('\n');

const excludeList = [
    'create-placeholder-images.js',
    'next-sitemap.config.js',
    'update-all-categories.js',
    'update-category-pages.js',
    'update-getServerSideProps.js',
    'scripts/regenerate-sitemap.js',
    'middleware/auth.js',
    'utils/sitemap-updater.js',
    'src/lib/utils.ts',
    'src/components/ui/collapsible.tsx',
    'src/components/ui/dropdown-menu.tsx',
    'components/common/AppHead.tsx'
];

let deletedCount = 0;
let fileMode = false;
for (let line of lines) {
    // Strip ANSI codes
    line = line.replace(/\x1b\[[0-9;]*m/g, '');

    if (line.includes('Unused files')) {
        fileMode = true;
        continue;
    }
    if (fileMode && (line.includes('Unused dependencies') || line.includes('Unused devDependencies'))) {
        break;
    }
    
    let actualFile = line.trim();
    if (fileMode && actualFile !== '') {
        // Remove trailing spaces which knip often adds for alignment
        actualFile = actualFile.replace(/\s+$/, '');
        // Safety check, avoid deleting weird things
        if (!actualFile || actualFile.includes('node_modules') || actualFile.includes('.git')) continue;

        if (excludeList.includes(actualFile)) {
            console.log('Skipping protected file:', actualFile);
            continue;
        }

        try {
            const absolutePath = path.join(process.cwd(), actualFile);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log('Deleted: ' + actualFile);
                deletedCount++;
            }
        } catch (e) {
            console.error('Failed to delete: ' + actualFile, e);
        }
    }
}
console.log('Total files successfully deleted: ' + deletedCount);
