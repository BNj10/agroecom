/**
 * Export utility functions for converting data to downloadable formats
 */

export type ExportFormat = 'csv' | 'json';

interface ExportOptions {
  filename: string;
  format: ExportFormat;
}

/**
 * Convert an array of objects to CSV string
 */
function arrayToCSV<T extends Record<string, unknown>>(data: T[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Get headers from first object if not provided
  const keys = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = keys.join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return keys.map(key => {
      const value = item[key];
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
}

/**
 * Trigger download of a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to a file (CSV or JSON)
 */
export function exportData<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions
): void {
  const { filename, format } = options;
  
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'csv':
      content = arrayToCSV(data);
      mimeType = 'text/csv;charset=utf-8;';
      extension = 'csv';
      break;
    case 'json':
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      extension = 'json';
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  const fullFilename = `${filename}.${extension}`;
  downloadFile(content, fullFilename, mimeType);
}

/**
 * Export rental data specifically
 */
export interface RentalExportData {
  id: string;
  name: string;
  equipment: string;
  date: string;
  duration: string;
  location: string;
  email: string;
  status: string;
}

export function exportRentals(data: RentalExportData[], format: ExportFormat = 'csv'): void {
  const timestamp = new Date().toISOString().split('T')[0];
  // Convert to Record<string, unknown>[] for generic export function
  const exportableData = data.map(item => ({ ...item } as Record<string, unknown>));
  exportData(exportableData, {
    filename: `rentals-export-${timestamp}`,
    format,
  });
}

/**
 * Export user data specifically
 */
export interface UserExportData {
  id: string;
  name: string;
  email: string;
  date: string;
  location: string;
  role: string;
}

export function exportUsers(data: UserExportData[], format: ExportFormat = 'csv'): void {
  const timestamp = new Date().toISOString().split('T')[0];
  // Convert to Record<string, unknown>[] for generic export function
  const exportableData = data.map(item => ({ ...item } as Record<string, unknown>));
  exportData(exportableData, {
    filename: `users-export-${timestamp}`,
    format,
  });
}
