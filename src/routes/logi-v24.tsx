import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

type Lot={lot:string;expiry:string;quantity:string};
type Product={id:string;nf:string;name:string;code:string;lot:string;expiry:string;quantity:number};
const KEY="logi-barcode-products";
export const Route=createFileRoute("/logi-v24")({component:LogiV24});
export default function LogiV24(){
 const [nf,setNf]=useState(""); const [name,setName]=useState(""); const [code,setCode]=useState("");
 const [lots,setLots]=useState<Lot[]>([{lot:"",expiry:"",quantity:"1"}]); const [msg,setMsg]=useState("");
 const add=()=>setLots(v=>[...v,{lot:"",expiry:"",quantity:"1"}]);
 const patch=(i:number,k:keyof Lot,v:string)=>setLots(xs=>xs.map((x,n)=>n===i?{...x,[k]:v}:x));
 const save=()=>{if(!nf.trim()||!name.trim()||!code.trim()||lots.some(x=>!x.lot.trim()||!x.expiry)){setMsg("Preencha NF, produto, código, lote e validade.");return}
  let old:Product[]=[];try{old=JSON.parse(localStorage.getItem(KEY)||"[]")}catch{}
  const keys=new Set<string>(); for(const l of lots){const k=code.trim().toLowerCase()+"|"+l.lot.trim().toLowerCase();if(keys.has(k)||old.some(p=>p.code.trim().toLowerCase()===code.trim().toLowerCase()&&p.lot.trim().toLowerCase()===l.lot.trim().toLowerCase())){setMsg("Mesmo produto + mesmo lote já cadastrado.");return}keys.add(k)}
  const created=lots.map(l=>({id:crypto.randomUUID(),nf:nf.trim(),name:name.trim(),code:code.trim(),lot:l.lot.trim(),expiry:l.expiry,quantity:Math.max(0,Math.floor(Number(l.quantity)||0))}));localStorage.setItem(KEY,JSON.stringify([...created,...old]));setMsg(`${created.length} lote(s) da NF ${nf} cadastrados. Agora eles podem ser impressos juntos na mesma folha.`);
 };
 return <main style={{maxWidth:900,margin:"auto",padding:24,fontFamily:"system-ui"}}><h1>LOGI BARCODE 2.4</h1><p>Cadastro por Nota Fiscal · vários lotes do mesmo produto</p><section style={{background:"white",padding:20,borderRadius:16,border:"1px solid #ddd"}}><h2>Nova NF</h2><input placeholder="Número da NF" value={nf} onChange={e=>setNf(e.target.value)}/><input placeholder="Nome do produto" value={name} onChange={e=>setName(e.target.value)}/><input placeholder="Código do produto" value={code} onChange={e=>setCode(e.target.value)}/><h3>Lotes desta NF</h3>{lots.map((l,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 100px 40px",gap:8,marginBottom:8}}><input placeholder={`Lote ${i+1}`} value={l.lot} onChange={e=>patch(i,"lot",e.target.value)}/><input type="date" value={l.expiry} onChange={e=>patch(i,"expiry",e.target.value)}/><input type="number" min="0" value={l.quantity} onChange={e=>patch(i,"quantity",e.target.value)}/><button onClick={()=>lots.length>1&&setLots(v=>v.filter((_,n)=>n!==i))}>×</button></div>)}<button onClick={add}>+ Adicionar outro lote</button><button onClick={save} style={{display:"block",marginTop:16}}>Cadastrar NF com {lots.length} lotes</button>{msg&&<p>{msg}</p>}</section><section style={{marginTop:18,padding:20,borderRadius:16,border:"1px solid #ddd"}}><h3>Regra</h3><p>Mesmo produto + lote diferente = permitido.</p><p>Mesmo produto + mesmo lote = bloqueado.</p><p>Todos os lotes da mesma NF ficam armazenados separadamente, permitindo uma futura impressão agrupada em uma única folha A4.</p></section></main>
}
