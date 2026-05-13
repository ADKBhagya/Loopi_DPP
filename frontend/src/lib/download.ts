export function downloadTextFile(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(filename: string, data: unknown) {
  downloadTextFile(filename, JSON.stringify(data, null, 2), "application/json");
}

export function openPrintableReport(title: string, body: string) {
  const report = window.open("", "_blank", "noopener,noreferrer");
  if (!report) return;

  report.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #102A1A; }
          h1 { color: #1B5E20; }
          pre { white-space: pre-wrap; line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <pre>${body}</pre>
        <script>window.print();</script>
      </body>
    </html>
  `);
  report.document.close();
}

export function qrSvgDataUrl(value: string) {
  const encoded = encodeURIComponent(value);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">
      <rect width="360" height="360" fill="#fff"/>
      <rect x="30" y="30" width="300" height="300" fill="#F1F8F4" stroke="#1B5E20" stroke-width="8"/>
      <text x="180" y="165" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#1B5E20">LOOPI DPP</text>
      <text x="180" y="195" text-anchor="middle" font-family="Arial" font-size="14" fill="#102A1A">${encoded}</text>
      <text x="180" y="232" text-anchor="middle" font-family="Arial" font-size="11" fill="#64748B">Scan opens the public passport</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
