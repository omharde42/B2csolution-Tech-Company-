// Safe export helpers: prevent stored XSS in PDF export and CSV formula injection.

export const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Neutralize spreadsheet formula injection and quote the cell for CSV. */
export const csvCell = (value: unknown): string => {
  let s = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export const buildCsv = (keys: string[], data: any[]): string =>
  [keys.map(csvCell).join(','), ...data.map(r => keys.map(k => csvCell(r[k])).join(','))].join('\n');

export const downloadCsv = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Open a printable report window. All values are DOM-inserted via textContent,
 * never via document.write with untrusted strings.
 */
export const openPrintableTable = (title: string, keys: string[], data: any[]) => {
  const win = window.open('', '_blank');
  if (!win) return;

  const doc = win.document;
  doc.open();
  doc.write('<!DOCTYPE html><html><head></head><body></body></html>');
  doc.close();

  doc.title = title;

  const style = doc.createElement('style');
  style.textContent =
    'body{background:#0f172a;color:#e2e8f0;font-family:sans-serif}' +
    'table{border-collapse:collapse;width:100%}' +
    'th{background:#1e293b;color:#94a3b8;padding:6px;border:1px solid #334155;font-size:11px;text-align:left}' +
    'td{border:1px solid #333;padding:4px;font-size:11px;color:#ddd}';
  doc.head.appendChild(style);

  const heading = doc.createElement('h2');
  heading.textContent = title;
  doc.body.appendChild(heading);

  const table = doc.createElement('table');
  const headRow = doc.createElement('tr');
  keys.forEach(k => {
    const th = doc.createElement('th');
    th.textContent = k;
    headRow.appendChild(th);
  });
  table.appendChild(headRow);

  data.forEach(r => {
    const tr = doc.createElement('tr');
    keys.forEach(k => {
      const td = doc.createElement('td');
      td.textContent = r?.[k] == null ? '' : String(r[k]);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  doc.body.appendChild(table);

  win.setTimeout(() => win.print(), 500);
};
