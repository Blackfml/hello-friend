import JsBarcode from "jsbarcode";
import { ArrowLeft, Maximize2, Minus, Plus, RotateCcw, Smartphone, Sun, Zap } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route=createFileRoute("/teste-leitura")({component:TesteLeitura});

type Contrast="normal"|"alto"|"maximo";
type Size="medio"|"grande"|"gigante";

const TEST_CODES=["7891234567890","AB155210","26022028","36","TESTE-MC3190"];

function ScreenBarcode({value,width,height}:{value:string;width:number;height:number}){
  const ref=useRef<SVGSVGElement>(null);
  useEffect(()=>{
    if(!ref.current)return;
    ref.current.innerHTML="";
    try{
      JsBarcode(ref.current,value,{format:"CODE128",width,height,displayValue:true,fontSize:Math.max(13,Math.round(width*7)),fontOptions:"bold",textMargin:9,margin:16,background:"#fff",lineColor:"#000"});
    }catch{}
  },[value,width,height]);
  return <svg ref={ref} className="screen-barcode"/>;
}

function TesteLeitura(){
  const [code,setCode]=useState(TEST_CODES[0]);
  const [contrast,setContrast]=useState<Contrast>("alto");
  const [size,setSize]=useState<Size>("grande");
  const [brightness,setBrightness]=useState(false);
  const [fullscreen,setFullscreen]=useState(false);

  const dimensions={medio:{width:2,height:90},grande:{width:2.8,height:125},gigante:{width:3.6,height:170}}[size];
  const bg=contrast==="maximo"?"#000":contrast==="alto"?"#080b10":"#111827";
  const card=contrast==="maximo"?"#fff":contrast==="alto"?"#fff":"#f7f8fa";

  const enterFullscreen=async()=>{
    try{await document.documentElement.requestFullscreen?.();setFullscreen(true)}catch{setFullscreen(true)}
  };
  const exitFullscreen=async()=>{
    try{if(document.fullscreenElement)await document.exitFullscreen()}catch{}
    setFullscreen(false);
  };
  const reset=()=>{setCode(TEST_CODES[0]);setContrast("alto");setSize("grande");setBrightness(false)};

  return <div className="screen-test" style={{background:bg}}>
    <style>{`*{box-sizing:border-box}.screen-test{min-height:100vh;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:18px;transition:background .2s}.screen-top{max-width:1050px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:12px}.screen-top h1{font-size:18px;margin:2px 0}.screen-top p{font-size:10px;color:#9da8b8;margin:3px 0 0}.screen-icon{width:38px;height:38px;border-radius:11px;background:#1769df;display:grid;place-items:center;flex:none}.screen-title{display:flex;align-items:center;gap:10px}.screen-actions{display:flex;gap:6px}.screen-btn{height:36px;border:1px solid #ffffff1c;background:#ffffff0b;color:#fff;border-radius:9px;padding:0 11px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:9px;font-weight:850;cursor:pointer}.screen-btn:hover{background:#ffffff16}.screen-main{max-width:1050px;margin:18px auto 0;display:grid;grid-template-columns:250px 1fr;gap:14px}.screen-panel{border:1px solid #ffffff12;background:#ffffff08;border-radius:15px;padding:15px}.screen-panel h2{font-size:12px;margin:0 0 10px}.screen-label{font-size:8px;letter-spacing:.12em;font-weight:900;color:#91a0b5;display:block;margin:14px 0 7px}.choices{display:flex;gap:5px;flex-wrap:wrap}.choice{border:1px solid #ffffff14;background:#ffffff08;color:#aeb9c8;border-radius:7px;padding:7px 8px;font-size:8px;font-weight:800;cursor:pointer}.choice.active{background:#1769df;color:#fff;border-color:#1769df}.code-list{display:grid;gap:5px}.code-btn{border:1px solid #ffffff12;background:#ffffff06;color:#c4cedb;border-radius:8px;padding:9px;text-align:left;font:9px ui-monospace,SFMono-Regular,monospace;cursor:pointer}.code-btn.active{border-color:#1769df;background:#1769df22;color:#fff}.screen-note{font-size:8px;line-height:1.55;color:#8795a8;margin:13px 0 0}.screen-stage{min-height:510px;border-radius:15px;padding:20px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:14px}.barcode-card{width:min(100%,720px);padding:clamp(22px,5vw,55px) clamp(14px,4vw,48px);background:${card};border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 14px 45px #00000030}.barcode-caption{font-size:9px;font-weight:900;letter-spacing:.12em;color:#4d5869;margin-bottom:12px}.screen-barcode{display:block;width:100%;max-width:100%;height:auto}.barcode-value{font:12px ui-monospace,SFMono-Regular,monospace;color:#111;margin-top:8px;word-break:break-all;text-align:center}.hint{font-size:9px;color:#9ba7b8;text-align:center;line-height:1.5;max-width:620px}.warning{display:flex;align-items:center;justify-content:center;gap:7px;font-size:8px;color:#f2c46c;background:#ffffff08;border:1px solid #ffffff10;border-radius:8px;padding:8px 10px}.brightness{position:fixed;inset:0;background:#fff;pointer-events:none;opacity:.07;z-index:20}.bottom{max-width:1050px;margin:14px auto 0;display:flex;justify-content:space-between;gap:8px;align-items:center}.bottom small{color:#77869a;font-size:8px}@media(max-width:760px){.screen-test{padding:12px}.screen-main{grid-template-columns:1fr}.screen-panel{order:2}.screen-stage{min-height:430px;padding:10px}.screen-top h1{font-size:15px}.screen-top p{font-size:8px}.screen-actions .label{display:none}.barcode-card{padding:24px 10px}.bottom{flex-direction:column;align-items:stretch}.bottom .screen-btn{width:100%}}@media(orientation:landscape) and (max-height:600px){.screen-stage{min-height:calc(100vh - 120px)}}`}</style>
    {brightness&&<div className="brightness"/>}
    <header className="screen-top">
      <div className="screen-title"><div className="screen-icon"><Smartphone size={19}/></div><div><div style={{fontSize:8,letterSpacing:".14em",fontWeight:900,color:"#71839b"}}>LOGI BARCODE · LAB</div><h1>Teste de leitura na tela</h1><p>Modo otimizado para testar Code 128 no coletor</p></div></div>
      <div className="screen-actions">
        <button className="screen-btn" onClick={reset}><RotateCcw size={14}/><span className="label">Resetar</span></button>
        <button className="screen-btn" onClick={fullscreen}>{fullscreen?<Minus size={14}/>:<Maximize2 size={14}/>}<span className="label">{fullscreen?"Sair da tela cheia":"Tela cheia"}</span></button>
      </div>
    </header>

    <main className="screen-main">
      <aside className="screen-panel">
        <h2>Configuração do teste</h2>
        <span className="screen-label">CÓDIGO DE TESTE</span>
        <div className="code-list">{TEST_CODES.map(x=><button key={x} className={`code-btn ${code===x?"active":""}`} onClick={()=>setCode(x)}>{x}</button>)}</div>
        <span className="screen-label">CONTRASTE</span>
        <div className="choices">{([["normal","Normal"],["alto","Alto"],["maximo","Máximo"]] as const).map(([v,n])=><button key={v} className={`choice ${contrast===v?"active":""}`} onClick={()=>setContrast(v)}>{n}</button>)}</div>
        <span className="screen-label">TAMANHO</span>
        <div className="choices">{([["medio","Médio"],["grande","Grande"],["gigante","Gigante"]] as const).map(([v,n])=><button key={v} className={`choice ${size===v?"active":""}`} onClick={()=>setSize(v)}>{n}</button>)}</div>
        <span className="screen-label">BRILHO</span>
        <button className={`choice ${brightness?"active":""}`} onClick={()=>setBrightness(v=>!v)}><Sun size={12} style={{verticalAlign:"middle",marginRight:5}}/>{brightness?"Brilho de teste ativo":"Simular brilho"}</button>
        <p className="screen-note">Comece em <b>Contraste Alto + Grande</b>. Se não ler, teste Máximo + Gigante e varie o brilho físico do celular.</p>
      </aside>

      <section className="screen-panel screen-stage">
        <div className="warning"><Zap size={13}/> O leitor deve apontar diretamente para o código, sem inclinar o celular.</div>
        <div className="barcode-card">
          <div className="barcode-caption">CODE 128 · TESTE DE TELA</div>
          <ScreenBarcode value={code} width={dimensions.width} height={dimensions.height}/>
          <div className="barcode-value">{code}</div>
        </div>
        <p className="hint">A área preta ao redor reduz distrações visuais. O código usa fundo branco puro, barras pretas e uma margem ampla para preservar a zona de silêncio do Code 128.</p>
      </section>
    </main>

    <footer className="bottom"><small>Teste experimental — a leitura depende do emissor, distância, ângulo, brilho e sensor do coletor.</small><button className="screen-btn" onClick={()=>location.href="/"}><ArrowLeft size={14}/> Voltar ao LOGI BARCODE</button></footer>
  </div>
}

export default TesteLeitura;
