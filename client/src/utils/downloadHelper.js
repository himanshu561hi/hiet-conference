import toast from 'react-hot-toast';

export const downloadPaperPdf = async (url, paperTitle = 'Research_Paper') => {
  if (!url) {
    toast.error('No paper file URL available.');
    return;
  }

  const toastId = toast.loading('Preparing PDF download...');
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download PDF file');
    const blob = await response.blob();

    // Force PDF MIME type so browser treats it as a PDF
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const blobUrl = window.URL.createObjectURL(pdfBlob);

    // Sanitize filename
    const sanitizedTitle = (paperTitle || 'Research_Paper')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `${sanitizedTitle || 'NEXUS_2026_Paper'}.pdf`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);

    toast.success('Paper PDF downloaded successfully! 📄', { id: toastId });
  } catch (err) {
    console.warn('Direct blob download restricted, opening file in new tab:', err);
    window.open(url, '_blank');
    toast.dismiss(toastId);
  }
};
