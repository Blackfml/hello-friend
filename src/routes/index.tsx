import { createFileRoute } from "@tanstack/react-router";
import LogiBarcode from "./logi-v23";
import "./logix-theme.css";
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

export const Route=createFileRoute("/")({head:()=>({meta:[{title:"LOGI BARCODE · Cadastro e etiquetas"},{name:"description",content:"Gerencie produtos e lotes e imprima etiquetas Code 128 para sua operação logística."},{property:"og:title",content:"LOGI BARCODE · Cadastro e etiquetas"},{property:"og:description",content:"Gerencie produtos e lotes e imprima etiquetas Code 128 para sua operação logística."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:Home});
