// page.tsx
import { QueryProvider } from './providers/queryProvider';
import Insects from './components/insectsContainer';

export default function Home() {
  return (
    <QueryProvider>
      <div className="h-screen bg-slate-600"></div>
      <div className="h-screen">
        <Insects />
      </div>
    </QueryProvider>
  );
}