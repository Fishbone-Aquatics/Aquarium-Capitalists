export async function getVersion() {
    const response = await fetch('/CHANGELOG.md');
    const text = await response.text();
  
    const versionRegex = /## \[([\d.]+)]/;
    const match = text.match(versionRegex);
  
    if (match && match[1]) {
      return match[1];
    }
  
    return 'Unknown';
  }
  