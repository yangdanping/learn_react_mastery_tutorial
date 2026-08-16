import { TutorialWorkspace } from '@/components/TutorialWorkspace';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
      <TutorialWorkspace />
    </ThemeProvider>
  );
}
