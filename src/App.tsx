import { TutorialShell } from '@/components/TutorialShell';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
      <TutorialShell />
    </ThemeProvider>
  );
}
