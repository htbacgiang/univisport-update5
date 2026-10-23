import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function updateSitemap(type, data) {
  try {
    console.log(`🔄 Auto-updating sitemap after ${type} change...`);
    
    // Chạy next-sitemap command
    const { stdout, stderr } = await execAsync('npx next-sitemap --config next-sitemap.config.js');
    
    if (stderr) {
      console.warn('Warning:', stderr);
    }
    
    console.log('✅ Sitemap auto-updated successfully!');
    return { success: true, output: stdout };
    
  } catch (error) {
    console.error('❌ Error auto-updating sitemap:', error);
    return { success: false, error: error.message };
  }
}

export async function triggerSitemapUpdate(type, data) {
  // Có thể gọi webhook nội bộ hoặc queue job
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const secret = process.env.SITEMAP_WEBHOOK_SECRET || 'your-secret-key';
    
    const response = await fetch(`${baseUrl}/api/sitemap/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sitemap-secret': secret,
      },
      body: JSON.stringify({ type, data }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Sitemap update triggered:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error triggering sitemap update:', error);
    // Fallback to direct update
    return await updateSitemap(type, data);
  }
}

