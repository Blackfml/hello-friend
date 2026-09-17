import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { ArrowLeft, Maximize2, Minimize2, RotateCcw, ScanLine, Sun, X } from "lucide-react";

type Mode="normal"|"alto"|"scanner";
type Size="medio"|"grande"|"gigante";

const samples=[
  {label:"Código do produto",value:"7891234567890"},
  {label:"Lote",value:"AB155210"},
  {label:"Validade",value:"28022028"},
  {label:"Quantidade",value:"36"},
  {label:"Empresa",value:"Pharma"},
  {label:"Nome",value:"Produto 500mg"}
];

function ScreenBarcode({value,width,height}:{value:string;width:number;height:number}){
  const ref=useRef<SVGSVGElement>(null);
  useEffect(()=>{
    if(!ref.current)return;
    ref.current.innerHTML="";
    try{JsBarcode(ref.current,value,{format:"CODE128",width,height,displayValue:true,fontSize:18,margin:18,background:"#fff",lineColor:"#000",textMargin:8})}catch{}
  },[value,width,height]);
  return <svg ref={ref} style={{display:"block",width:"100%",height:"auto",maxWidth:"100%"}}/>;
}

export default function TesteTela(){
  const [field,setField]=useState(0);
  const [mode,setMode]=useState<Mode>("scanner");
  const [size,setSize]=useState<Size>("gigante");
  const [full,setFull]=useState(false);
  const [brightness,setBrightness]=useState(false);
  const [custom,setCustom]=useState("");
  const current=custom.trim()||samples[field].value;
  const sizes={medio:{width:2,height:90},grande:{width:3,height:130},gigante:{width:4,height:170}};
  const s=sizes[size];
  const background=mode==="scanner"?"#000":"#111827";
  const openFullscreen=async()=>{
    try{await document.documentElement.requestFullscreen?.();setFull(true)}catch{}
  };
  const closeFullscreen=async()=>{
    try{if(document.fullscreenElement)await document.exitFullscreen();setFull(false)}catch{}
  };
  useEffect(()=>{const f=()=>setFull(Boolean(document.fullscreenElement));document.addEventListener("fullscreenchange",f);return()=>document.removeEventListener("fullscreenchange",f)},[]);
  return <div style={{minHeight:"100vh",background,color:"#fff",fontFamily:"Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",padding:full?"20px":"24px",transition:"background .2s"}}>
    <style>{`*{box-sizing:border-box}.st-btn{border:1px solid #334155;background:#111827;color:#dbeafe;border-radius:10px;padding:10px 13px;font-size:12px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:7px}.st-btn:hover{border-color:#60a5fa}.st-btn.active{background:#2563eb;border-color:#60a5fa;color:#fff}.st-card{background:#0b1220;border:1px solid #263449;border-radius:16px}.st-input{width:100%;border:1px solid #334155;background:#0f172a;color:#fff;border-radius:10px;padding:11px 12px;outline:0}.st-input:focus{border-color:#60a5fa}.st-muted{color:#94a3b8;font-size:11px;line-height:1.5}`}</style>
    {!full&&<header style={{maxWidth:1100,margin:"0 auto 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
      <button className="st-btn" onClick={()=>window.location.href="/"}><ArrowLeft size={17}/> LOGI BARCODE</button>
      <div style={{display:"flex",gap:8}}><button className="st-btn" onClick={()=>setBrightness(v=>!v)}><Sun size={16}/> Brilho</button><button className="st-btn" onClick={openFullscreen}><Maximize2 size={16}/> Tela inteira</button></div>
    </header>}
    <main style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:full?"1fr":"330px 1fr",gap:18,alignItems:"start"}}>
      {!full&&<aside className="st-card" style={{padding:18}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><div style={{width:38,height:38,borderRadius:10,background:"#2563eb",display:"grid",placeItems:"center"}}><ScanLine size={20}/></div><div><div style={{fontSize:9,letterSpacing:".14em",fontWeight:900,color:"#60a5fa"}}>LOGI BARCODE</div><h1 style={{fontSize:20,margin:"3px 0 0"}}>Teste na tela</h1></div></div>
        <p className="st-muted">Teste o MC3190 diretamente no display do celular. O modo Scanner reduz elementos luminosos ao redor do código.</p>
        <div style={{marginTop:18}}><b style={{fontSize:11}}>Código para testar</b><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:8}}>{samples.map((x,i)=><button key={x.label} className={`st-btn ${field===i?"active":""}`} style={{justifyContent:"center",fontSize:10}} onClick={()=>{setField(i);setCustom("")}}>{x.label}</button>)}</div></div>
        <label style={{display:"block",marginTop:14,fontSize:11,fontWeight:800}}>Código personalizado<input className="st-input" value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Digite um valor para testar" style={{marginTop:7}}/></label>
        <div style={{marginTop:16}}><b style={{fontSize:11}}>Renderização</b><div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{(["normal","alto","scanner"] as Mode[]).map(x=><button key={x} className={`st-btn ${mode===x?"active":""}`} style={{fontSize:10}} onClick={()=>setMode(x)}>{x==="normal"?"Normal":x==="alto"?"Alto contraste":"Scanner"}</button>)}</div></div>
        <div style={{marginTop:14}}><b style={{fontSize:11}}>Tamanho</b><div style={{display:"flex",gap:6,marginTop:8}}>{(["medio","grande","gigante"] as Size[]).map(x=><button key={x} className={`st-btn ${size===x?"active":""}`} style={{fontSize:10}} onClick={()=>setSize(x)}>{x[0].toUpperCase()+x.slice(1)}</button>)}</div></div>
        <div style={{marginTop:18,padding:12,borderRadius:12,background:"#111c2e",border:"1px solid #263449"}}><div style={{display:"flex",gap:8,alignItems:"center",fontSize:11,fontWeight:900}}><Sun size={15}/> Dica para o teste</div><p className="st-muted" style={{margin:"7px 0 0"}}>Comece com brilho médio/alto, tela limpa e o leitor perpendicular ao display. Teste Normal, Alto e Scanner.</p></div>
        <button className="st-btn" style={{width:"100%",justifyContent:"center",marginTop:12}} onClick={()=>{setMode("scanner");setSize("gigante");setCustom("")}}><RotateCcw size={15}/> Restaurar teste ideal</button>
      </aside>}
      <section style={{minWidth:0}}>
        {!full&&<div style={{marginBottom:10}}><div style={{fontSize:9,letterSpacing:".14em",fontWeight:900,color:"#60a5fa"}}>MODO DE LEITURA · CODE 128</div><h2 style={{margin:"4px 0",fontSize:17}}>Aponte o leitor para a tela</h2><p className="st-muted" style={{margin:0}}>Valor: <b style={{color:"#fff"}}>{current}</b> · {samples[field].label}</p></div>}
        <div style={{background:"#000",border:"1px solid #334155",borderRadius:full?0:18,padding:full?"8vh 4vw":"28px",minHeight:full?"100vh":520,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:18,boxShadow:"0 20px 60px #0008"}}>
          <div style={{width:"100%",maxWidth:full?1100:760,background:"#fff",padding:size==="gigante"?"32px 24px":"22px 18px",borderRadius:mode==="scanner"?4:10,overflow:"hidden"}}><ScreenBarcode value={current} width={s.width} height={s.height}/></div>
          <div style={{textAlign:"center",color:"#fff"}}><div style={{fontSize:13,fontWeight:900,letterSpacing:".08em"}}>{samples[field].label}</div><div style={{fontFamily:"ui-monospace,monospace",fontSize:12,marginTop:5,opacity:.8}}>{current}</div></div>
          {full&&<div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>{(["medio","grande","gigante"] as Size[]).map(x=><button key={x} className={`st-btn ${size===x?"active":""}`} onClick={()=>setSize(x)}>{x}</button>)}<button className="st-btn" onClick={closeFullscreen}><Minimize2 size={16}/> Sair</button></div>}
        </div>
        {!full&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginTop:10}}><span className="st-muted">Perfil atual: <b style={{color:"#fff"}}>{mode==="scanner"?"Scanner · fundo externo preto":mode==="alto"?"Alto contraste":"Normal"}</b></span><button className="st-btn" onClick={openFullscreen}><Maximize2 size={15}/> Abrir para leitura</button></div>}
      </section>
    </main>
    {brightness&&<div style={{position:"fixed",inset:0,zIndex:20,pointerEvents:"none",background:"#fff",opacity:.08}}/>}
  </div>
}