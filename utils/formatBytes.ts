export default function formatBytes(bytes: number): string {
  const units = ["Bytes", "KB", "MB", "GB"];
  const threshold = 1024;

  if (bytes === 0) return "0 Bytes";

  const i = Math.floor(Math.log(bytes) / Math.log(threshold));
  const size = bytes / Math.pow(threshold, i);

  return `${size.toFixed(2)} ${units[i]}`;
}
