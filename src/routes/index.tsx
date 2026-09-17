import { createFileRoute } from "@tanstack/react-router";
import LogiBarcode from "./logi-v24";

function Home(){
  return <>
    <LogiBarcode/>
    <div style={{position:"fixed",right:18,bottom:18,zIndex:90,display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
      <button onClick={()=>window.location.href="/nf-lotes"} aria-label="Abrir cadastro de nota fiscal com vários lotes" style={{border:"1px solid #1769df",background:"#1769df",color:"#fff",borderRadius:10,padding:"11px 14px",fontSize:10,fontWeight:900,boxShadow:"0 8px 24px #13233a22",cursor:"pointer"}}>📦 NF com vários lotes</button>
      <button onClick={()=>window.location.href="/teste-tela"} aria-label="Abrir teste de leitura na tela" style={{border:"1px solid #b9c8da",background:"#fff",color:"#1769df",borderRadius:10,padding:"11px 14px",fontSize:10,fontWeight:900,boxShadow:"0 8px 24px #13233a22",cursor:"pointer"}}>📱 Testar na tela</button>
    </div>
  </>;
}

export const Route=createFileRoute("/")({component:Home});
