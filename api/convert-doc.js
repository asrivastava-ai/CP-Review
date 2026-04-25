const mammoth = require('mammoth');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  try {
    // Receive raw binary body as base64
    const { fileBase64, fileName } = req.body;
    if (!fileBase64) return res.status(400).json({ error: 'No file data' });

    const buffer = Buffer.from(fileBase64, 'base64');

    // mammoth can handle both .doc and .docx via buffer
    const result = await mammoth.convertToHtml(
      { buffer },
      { styleMap: ["strike => s", "s => s"] }
    );

    let html = result.value;

    // Handle strikethrough / deleted text
    html = html.replace(/<s>([\s\S]*?)<\/s>/gi, (_, content) => {
      const text = content.replace(/<[^>]*>/g, '').trim();
      return text ? `[DELETED: ${text}]` : '';
    });
    html = html.replace(/<del>([\s\S]*?)<\/del>/gi, (_, content) => {
      const text = content.replace(/<[^>]*>/g, '').trim();
      return text ? `[DELETED: ${text}]` : '';
    });

    // Convert to plain text
    const plainText = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.json({
      text: plainText,
      deletedCount: (plainText.match(/\[DELETED:/g) || []).length,
      warnings: result.messages.map(m => m.message)
    });

  } catch (err) {
    console.error('convert-doc error:', err);
    res.status(500).json({ error: err.message || 'Conversion failed' });
  }
};
