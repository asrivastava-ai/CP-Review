import mammoth from 'mammoth';

// ============================================================
// GEOSERVE File Processor
// Handles PDF, .docx and legacy .doc files
// ============================================================

export async function processWordFile(file) {
  const isLegacyDoc = file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx');

  // .doc files — send to server-side API for conversion
  if (isLegacyDoc) {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);

    const res = await fetch('/api/convert-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileBase64: base64, fileName: file.name })
    });
    if (!res.ok) throw new Error('Could not convert .doc file. Please save it as .docx and try again.');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return {
      type: 'text',
      content: data.text,
      fileName: file.name,
      deletedCount: data.deletedCount
    };
  }

  // .docx files — process in browser with mammoth
  // (mammoth imported statically at top of file)
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.convertToHtml(
    { arrayBuffer: arrayBuffer },
    { styleMap: ["strike => s", "s => s"] }
  );

  let html = result.value;

  html = html.replace(/<s>([\s\S]*?)<\/s>/gi, (match, content) => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText ? `[DELETED: ${plainText}]` : '';
  });
  html = html.replace(/<del>([\s\S]*?)<\/del>/gi, (match, content) => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText ? `[DELETED: ${plainText}]` : '';
  });
  html = html.replace(/<strike>([\s\S]*?)<\/strike>/gi, (match, content) => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText ? `[DELETED: ${plainText}]` : '';
  });

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

  return {
    type: 'text',
    content: plainText,
    fileName: file.name,
    deletedCount: (plainText.match(/\[DELETED:/g) || []).length
  };
}

export async function processPdfFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      type: 'pdf',
      content: reader.result.split(',')[1],
      fileName: file.name,
      deletedCount: null
    });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function processFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) {
    return processPdfFile(file);
  } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
    return processWordFile(file);
  } else {
    throw new Error('Unsupported file type. Please upload PDF or Word (.docx/.doc) files.');
  }
}

export function buildMessageContent(file1Data, file2Data, party, charterType, cargo, specificInstructions) {
  const content = [];

  if (file1Data.type === 'pdf') {
    content.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: file1Data.content }
    });
  } else {
    content.push({
      type: 'text',
      text: `=== BASE CHARTERPARTY (${file1Data.fileName}) ===\n\n${file1Data.content}`
    });
  }

  if (file2Data) {
    if (file2Data.type === 'pdf') {
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: file2Data.content }
      });
    } else {
      content.push({
        type: 'text',
        text: `=== RIDER CLAUSES (${file2Data.fileName}) ===\n\n${file2Data.content}`
      });
    }
  }

  const instruction = `Review this charterparty as ${party.toUpperCase()} for a ${charterType === 'period' ? 'Period TC' : 'Trip TC'}${cargo ? ` with intended cargo: ${cargo}` : ''}${file2Data ? '. The second document contains the rider clauses — treat both documents together as one complete charterparty.' : ''}${specificInstructions ? `. Pay special attention to: ${specificInstructions}` : ''}. Return only the JSON array.`;

  content.push({ type: 'text', text: instruction });

  return content;
}
