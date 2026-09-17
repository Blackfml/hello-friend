import { createFileRoute } from "@tanstack/react-router";
import LogiBarcode from "./logi-v23";
import { PackagePlus } from "lucide-react";

function Home(){
  return <div style={{position:"relative"}}>
    <LogiBarcode/>
    <button
      className="secondary-btn"
      onClick={()=>window.location.href="/nf-lotes"}
      aria-label="Abrir NF com vários lotes"
      style={{position:"fixed",right:18,bottom:18,zIndex:80,display:"inline-flex",alignItems:"center",gap:7}}
    >
      <PackagePlus size={16}/>
      NF com vários lotes
    </button>
  </div>;
}

export const Route=createFileRoute("/")({component:Home});
