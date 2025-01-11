// page.tsx
import { QueryProvider } from './providers/queryProvider';
import Insects from './components/insectsContainer';
import Navbar from './components/nav';
export default function Home() {
  return (
    <QueryProvider>
      <Navbar />
      <div className="h-screen bg-slate-600"></div>
      <div className="h-screen">
        <Insects />
      </div>
    </QueryProvider>
  );
}