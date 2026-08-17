export function tutorialLog(themeId: string, message: string, ...details: unknown[]) {
  if (details.length > 0) {
    console.log(`[${themeId}] ${message}`, ...details);
    return;
  }
  console.log(`[${themeId}] ${message}`);
}

export function clearTutorialLogs() {
  console.clear();
}

