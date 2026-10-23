import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔄 Auto-generating robots.txt on request...');
    
    const baseUrl = 'https://dongphucunivi.com';
    
    // Tạo robots.txt content
    const robotsContent = `# *
User-agent: *
Allow: /

# Host
Host: ${baseUrl}/

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml`;

    // Ghi file robots.txt vào public folder
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent);

    // Set headers cho text response
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache 1 hour
    
    console.log('✅ Robots.txt auto-generated successfully!');

    // Trả về robots.txt content
    res.status(200).send(robotsContent);

  } catch (error) {
    console.error('❌ Error auto-generating robots.txt:', error);
    
    // Fallback: trả về robots.txt hiện tại nếu có
    try {
      const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
      if (fs.existsSync(robotsPath)) {
        const existingRobots = fs.readFileSync(robotsPath, 'utf8');
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(existingRobots);
        return;
      }
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error generating robots.txt',
      error: error.message
    });
  }
}
