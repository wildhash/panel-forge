/**
 * Export utilities for comic strips
 */

export async function exportComicAsPNG(
  panels: Array<{ imageUrl: string; panelNumber: number; caption?: string }>,
  title: string
) {
  try {
    // Create a canvas to combine all panels
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Set canvas size (3 panels side by side + margins + captions)
    const panelWidth = 400;
    const panelHeight = 400;
    const margin = 20;
    const captionHeight = 80;
    const totalWidth = (panelWidth * 3) + (margin * 4);
    const totalHeight = panelHeight + (margin * 2) + captionHeight + 40; // Extra for title

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, totalWidth / 2, margin + 24);

    // Load and draw images
    const imagePromises = panels.map((panel, index) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const x = margin + (index * (panelWidth + margin));
          const y = margin + 40;

          // Draw image
          ctx.drawImage(img, x, y, panelWidth, panelHeight);

          // Draw panel border
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, panelWidth, panelHeight);

          // Draw panel label
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y + panelHeight - 30, panelWidth, 30);
          ctx.strokeRect(x, y + panelHeight - 30, panelWidth, 30);
          
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          const label = index === 0 ? 'SETUP' : index === 1 ? 'ACTION' : 'PAYOFF';
          ctx.fillText(label, x + panelWidth / 2, y + panelHeight - 10);

          // Draw caption if exists
          if (panel.caption) {
            ctx.fillStyle = '#F3F4F6';
            ctx.fillRect(x, y + panelHeight + 10, panelWidth, captionHeight);
            ctx.strokeStyle = '#D1D5DB';
            ctx.strokeRect(x, y + panelHeight + 10, panelWidth, captionHeight);

            ctx.fillStyle = '#374151';
            ctx.font = 'italic 14px Arial';
            ctx.textAlign = 'left';
            
            // Word wrap caption
            const words = panel.caption.split(' ');
            let line = '';
            let lineY = y + panelHeight + 30;
            const maxWidth = panelWidth - 20;
            
            for (const word of words) {
              const testLine = line + word + ' ';
              const metrics = ctx.measureText(testLine);
              if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line, x + 10, lineY);
                line = word + ' ';
                lineY += 18;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, x + 10, lineY);
          }

          resolve();
        };
        img.onerror = reject;
        img.src = panel.imageUrl;
      });
    });

    await Promise.all(imagePromises);

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Failed to create blob');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_comic.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');

    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

export function shareComic(title: string, description: string, url: string) {
  if (navigator.share) {
    navigator.share({
      title: title,
      text: description,
      url: url,
    }).catch((error) => console.log('Error sharing:', error));
  } else {
    // Fallback: copy link to clipboard
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }
}




