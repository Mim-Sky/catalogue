import Image from "next/image";
import Navbar from "./components/nav";
import Card from "./components/ui/card";
import Insects from "./components/insectsContainer";


export default function Home() {
  return (
    <>
      <div className="h-screen bg-slate-600"></div>
      <div className="h-screen"><Insects /></div>
    
    </>
  );
}
