
export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
}

export function validateFileUpload(file: File, maxSize: number, acceptedTypes: string[]): boolean {
  if (file.size > maxSize) return false;
  return acceptedTypes.some(type => file.name.toLowerCase().endsWith(type));
}