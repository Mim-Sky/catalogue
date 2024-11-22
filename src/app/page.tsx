'use client';
import Insects from "./components/insectsContainer";
import { Provider } from 'react-redux';
import store from './redux/store';

export default function Home() {
  return (
    <Provider store={store}>
      <div className="h-screen bg-slate-600"></div>
      <div className="h-screen"><Insects /></div>
    </Provider>
  );
}
