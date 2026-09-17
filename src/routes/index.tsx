import { createFileRoute } from "@tanstack/react-router";
import LogiBarcode from "./logi-v23";

function Home(){
  return <>
    <LogiBarcode/>
    <button onClick={()=>window.location.href="/teste-tela"} aria-label="Abrir teste de leitura na tela" style={{position:"fixed",right:18,bottom:18,zIndex:90,border:"1px solid #b9c8da",background:"#fff",color:"#1769df",borderRadius:10,padding:"11px 14px",fontSize:10,fontWeight:900,boxShadow:"0 8px 24px #13233a22",cursor:"pointer"}}>📱 Testar na tela</button>
  </>;
}

export const Route=createFileRoute("/")({component:Home});
