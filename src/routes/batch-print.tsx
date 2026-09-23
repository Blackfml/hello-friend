import JsBarcode from "jsbarcode";
import { Boxes, Check, Plus, Printer, Search, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import "./batch-print.css";

type Product = { id:string; company:string; name:string; code:string; expiry:string; lot:string; quantity:number };
const KEY="logi-barcode-products";
const fmt=(v:string)=>{const[a,b,c]=(v||"").split("-");return c&&b&&a?c+"/"+b+"/"+a:v||"—"};

function Barcode({value}:{value:string}){
  const ref=(el:SVGSVGElement|null)=>{if(!el)return;el.innerHTML="";try{JsBarcode(el,value,{format:"CODE128",width:1.5,height:48,displayValue:true,fontSize:9,margin:3,background:"#fff",lineColor:"#101828"})}catch{}};
  return <svg ref={ref} className="batch-barcode"/>;
}

export default function BatchPrint({inline=false,onRegisterLot}:{inline?:boolean;onRegisterLot?:()=>void}){
  const [open,setOpen]=useState(false);
  const [products,setProducts]=useState<Product[]>([]);
  const [selected,setSelected]=useState<string[]>([]);
  const [q,setQ]=useState("");
  const [copies,setCopies]=useState<Record<string,number>>({});
  const [printing,setPrinting]=useState(false);

  const load=()=>{try{const raw=localStorage.getItem(KEY);const list=raw?JSON.parse(raw):[];setProducts(Array.isArray(list)?list:[])}catch{setProducts([])}};
  useEffect(()=>{if(open)load()},[open]);
  const filtered=useMemo(()=>{const x=q.trim().toLowerCase();return products.filter(p=>!x||[p.name,p.code,p.lot,p.company,p.expiry,String(p.quantity)].some(v=>String(v).toLowerCase().includes(x)))},[products,q]);
  const toggle=(id:string)=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const selectedProducts=products.filter(p=>selected.includes(p.id));
  const setCopy=(id:string,n:number)=>setCopies(c=>({...c,[id]:Math.min(20,Math.max(1,n||1))}));

  const doPrint=()=>{
    if(!selectedProducts.length)return;
    setOpen(false);
    setPrinting(true);
    window.setTimeout(()=>window.print(),600);
  };

  useEffect(()=>{
    const done=()=>{setPrinting(false);setOpen(false)};
    addEventListener("afterprint",done);
    return()=>removeEventListener("afterprint",done);
  },[]);

  const printLayer=printing&&typeof document!=="undefined"?createPortal(
    <div className="batch-print-layer" aria-hidden="true">
      <div className="batch-print-pages">
          {Array.from({length:Math.ceil(selectedProducts.reduce((n,p)=>n+(copies[p.id]||1),0)/4)},(_,page)=>{
            const items=selectedProducts.flatMap(p=>Array.from({length:copies[p.id]||1},(_,i)=>({p,i}))).slice(page*4,page*4+4);
            return <div className="batch-print-sheet" key={page}>
              <header className="batch-print-header">
                <div><div className="batch-print-brand">LOGIX</div><div className="batch-print-subtitle">FOLHA DE LOTES · CODE 128 · 4 LOTES POR A4</div></div>
                <div className="batch-print-count">{items.length} lotes</div>
              </header>
              <div className="batch-print-grid">
                {items.map(({p,i})=><section className="batch-print-card" key={p.id+"-"+i}>
                  <div className="batch-print-title">{p.name}</div>
                  <div className="batch-print-meta"><span><b>CÓDIGO DO PRODUTO</b>{p.code}</span><span><b>LOTE</b>{p.lot}</span><span><b>DATA DE VENCIMENTO</b>{fmt(p.expiry)}</span><span><b>QUANTIDADE</b>{p.quantity}</span></div>
                  <Barcode value={p.lot}/>
                  <div className="batch-print-code">{p.lot}</div>
                </section>)}
              </div>
            </div>;
          })}
      </div>
    </div>,document.body):null;

  const trigger=<button type="button" className={inline?"batch-print-inline":"batch-print-fab"} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.preventDefault();e.stopPropagation();setOpen(true)}} aria-label="Montar folha A4 com vários produtos"><Boxes size={19}/><span>{inline?"Imprimir vários lotes · A4":"Folha A4"}</span></button>;
  const fab=!inline&&typeof document!=="undefined"?createPortal(trigger,document.body):inline?trigger:null;

  return <>
    {fab}
    {open&&<div className="batch-backdrop" onMouseDown={()=>setOpen(false)}>
      <div className="batch-modal" onMouseDown={e=>e.stopPropagation()}>
        <div className="batch-head"><div><div className="batch-kicker">LOGIX · ETIQUETAS EM LOTE</div><h2>Folha A4 com vários lotes</h2><p>Selecione exatamente os lotes já cadastrados que devem sair nesta folha.</p></div><div className="batch-head-actions">{onRegisterLot&&<button type="button" className="batch-register" onClick={()=>{setOpen(false);onRegisterLot()}}><Plus size={15}/> Cadastrar lote</button>}<button type="button" className="batch-close" onClick={()=>setOpen(false)}><X size={18}/></button></div>
        <div className="batch-toolbar"><div className="batch-search"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar produto, código ou lote…"/></div><span>{selectedProducts.length} selecionado{selectedProducts.length===1?"":"s"}</span></div>
        <div className="batch-list">
          {filtered.map(p=>{const checked=selected.includes(p.id);return <div className={"batch-row "+(checked?"selected":"")} key={p.id} onClick={()=>toggle(p.id)}>
            <div className={"batch-check "+(checked?"on":"")}>{checked&&<Check size={14}/>}</div>
            <div className="batch-info"><strong>{p.name}</strong><span>Código {p.code} · Lote {p.lot}</span><small>Validade {fmt(p.expiry)} · Estoque {p.quantity}</small></div>
            <label className="batch-copies" onClick={e=>e.stopPropagation()}>Cópias <input type="number" min="1" max="20" value={copies[p.id]||1} onChange={e=>setCopy(p.id,Number(e.target.value))}/></label>
          </div>})}
          {!filtered.length&&<div className="batch-empty">Nenhum produto cadastrado.</div>}
        </div>
        <div className="batch-summary"><div className="batch-summary-icon"><Boxes size={17}/></div><div><strong>{selectedProducts.length} lotes selecionados</strong><span>Você pode misturar produtos, códigos, validades e quantidades.</span></div><div className="batch-summary-badge">A4</div></div>
        <div className="batch-actions"><button className="secondary-btn" onClick={()=>setOpen(false)}>Cancelar</button><button className="primary-btn" disabled={!selectedProducts.length} onClick={doPrint}><Printer size={16}/> Gerar folha A4</button></div>
      </div>
    </div>}
    {printLayer}
  </>;
}
