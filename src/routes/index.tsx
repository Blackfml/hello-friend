import { createFileRoute } from "@tanstack/react-router";
import JsBarcode from "jsbarcode";
import {
  Archive,
  BarChart3,
  Boxes,
  CalendarDays,
  Check,
  ClipboardList,
  Edit3,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Printer,
  Search,
  Settings,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({ component: Index });

type Company = "Pharma" | "Aspen" | "Viatris";
type Product = {
  id: string;
  company: Company;
  name: string;
  code: string;
  expiry: string;
  lot: string;
  quantity: number;
  createdAt: string;
};

const STORAGE_KEY = "logi-barcode-products";
const seed: Product[] = [
  {
    id: "demo-1",
    company: "Pharma",
    name: "Produto demonstrativo",
    code: "7891234567890",
    expiry: "2027-12-31",
    lot: "LOTE-DEMO01",
    quantity: 120,
    createdAt: new Date().toISOString(),
  },
];

function Barcode({ value, compact = false }: { value: string; compact?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !value) return;
    try {
      JsBarcode(ref.current, value, {
        format: "CODE128",
        width: compact ? 1.6 : 2,
        height: compact ? 48 : 62,
        displayValue: true,
        fontSize: compact ? 10 : 12,
        margin: 5,
        background: "#fff",
        lineColor: "#101828",
      });
    } catch {
      if (ref.current) ref.current.innerHTML = "";
    }
  }, [value, compact]);

  return <svg ref={ref} className="barcode-svg" aria-label={`Código de barras ${value}`} />;
}

function formatDate(value: string) {
  if (!value) return "—";
  const [y, m, d] = value.split("-");
  return d && m && y ? `${d}/${m}/${y}` : value;
}

function barcodeValue(product: Product, field: "produto" | "lote" | "validade" | "quantidade" | "empresa" | "nome") {
  switch (field) {
    case "produto":
      return product.code.trim();
    case "lote":
      return product.lot.trim();
    case "validade":
      return formatDate(product.expiry);
    case "quantidade":
      return String(product.quantity);
    case "empresa":
      return product.company;
    case "nome":
      return product.name.trim();
  }
}

function PrintSheet({ product }: { product: Product }) {
  const fields = [
    { key: "produto", title: "CÓDIGO DO PRODUTO", value: product.code },
    { key: "lote", title: "LOTE", value: product.lot },
    { key: "validade", title: "VALIDADE", value: formatDate(product.expiry) },
    { key: "quantidade", title: "QUANTIDADE", value: String(product.quantity) },
    { key: "empresa", title: "EMPRESA", value: product.company },
    { key: "nome", title: "NOME DO PRODUTO", value: product.name },
  ] as const;

  return (
    <div className="print-layer" aria-hidden="true">
      <div className="print-sheet">
        <header className="print-header">
          <div>
            <div className="print-brand">LOGI BARCODE</div>
            <div className="print-subtitle">ETIQUETAS DE MOVIMENTAÇÃO · CODE 128</div>
          </div>
          <div className="print-meta">Produto: {product.code}</div>
        </header>

        {fields.map((field) => (
          <section className="print-label" key={`${product.id}-${field.key}`}>
            <div className="print-label-title">{field.title}</div>
            <Barcode value={barcodeValue(product, field.key)} />
            <div className="print-value">{field.value}</div>
            <div className="print-encoded">{barcodeValue(product, field.key)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Index() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : seed;
    } catch {
      return seed;
    }
  });
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<Company | "Todas">("Todas");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [printingProduct, setPrintingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    company: "Pharma" as Company,
    name: "",
    code: "",
    expiry: "",
    lot: "",
    quantity: "1",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!printingProduct) return;

    let printed = false;
    const startPrint = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          printed = true;
          window.print();
        });
      });
    }, 450);

    const finishPrint = () => {
      if (printed) {
        setPrintingProduct(null);
        setNotice("Etiquetas A4 prontas para impressão.");
      }
    };

    window.addEventListener("afterprint", finishPrint);
    return () => {
      window.clearTimeout(startPrint);
      window.removeEventListener("afterprint", finishPrint);
    };
  }, [printingProduct]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const companyMatch = company === "Todas" || p.company === company;
      const searchMatch = !q || [p.name, p.code, p.lot, p.company].some((v) => v.toLowerCase().includes(q));
      return companyMatch && searchMatch;
    });
  }, [products, search, company]);

  const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);
  const expiring = products.filter((p) => {
    const days = (new Date(p.expiry).getTime() - Date.now()) / 86400000;
    return days >= 0 && days <= 90;
  }).length;

  const openCreate = () => {
    setEditing(null);
    setForm({ company: "Pharma", name: "", code: "", expiry: "", lot: "", quantity: "1" });
    setShowForm(true);
    setMenuOpen(false);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      company: p.company,
      name: p.name,
      code: p.code,
      expiry: p.expiry,
      lot: p.lot,
      quantity: String(p.quantity),
    });
    setShowForm(true);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.code.trim() || !form.expiry || !form.lot.trim()) {
      setNotice("Preencha nome, código, validade e lote.");
      return;
    }

    const normalizedCode = form.code.trim();
    const duplicatedCode = products.some((p) => p.code.trim() === normalizedCode && p.id !== editing?.id);
    if (duplicatedCode) {
      setNotice("Este código de produto já está cadastrado. Use um código diferente para cada produto.");
      return;
    }

    const data: Product = {
      id: editing?.id ?? crypto.randomUUID(),
      company: form.company,
      name: form.name.trim(),
      code: normalizedCode,
      expiry: form.expiry,
      lot: form.lot.trim(),
      quantity: Math.max(0, Number(form.quantity) || 0),
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    };

    setProducts((current) => editing ? current.map((p) => p.id === editing.id ? data : p) : [data, ...current]);
    setShowForm(false);
    setNotice(editing ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
  };

  const remove = (id: string) => {
    if (!window.confirm("Excluir este cadastro? Esta ação não pode ser desfeita.")) return;
    setProducts((current) => current.filter((p) => p.id !== id));
    setNotice("Produto excluído.");
  };

  const printLabels = (product: Product) => {
    setShowForm(false);
    setPrintingProduct(product);
  };

  return (
    <div className="logi-app">
      <button className="mobile-menu" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu"><Menu size={20} /></button>

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Boxes size={21} /></div><div><strong>LOGI</strong><span>BARCODE 2.0</span></div></div>
        <div className="side-section">OPERAÇÃO</div>
        <button className="side-link active" onClick={() => setMenuOpen(false)}><LayoutDashboard size={18} /> Dashboard</button>
        <button className="side-link" onClick={openCreate}><Plus size={18} /> Novo cadastro</button>
        <button className="side-link" onClick={() => setNotice("Use o botão de impressora em qualquer produto para gerar a folha A4.")}><ClipboardList size={18} /> Etiquetas</button>
        <button className="side-link" onClick={() => setNotice(`Estoque cadastrado: ${totalQty.toLocaleString("pt-BR")} unidades.`)}><Archive size={18} /> Estoque</button>
        <div className="side-section">GESTÃO</div>
        <button className="side-link" onClick={() => setNotice(`${products.length} produtos cadastrados · ${expiring} próximos do vencimento.`)}><BarChart3 size={18} /> Relatórios</button>
        <button className="side-link" onClick={() => setNotice("Configurações disponíveis na próxima etapa.")}><Settings size={18} /> Configurações</button>
        <div className="sidebar-foot"><div className="status-dot" /> Sistema operacional<small>Dados salvos localmente</small></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><div className="eyebrow">CENTRO DE OPERAÇÕES · WMS</div><h1>Cadastro & Etiquetas</h1></div>
          <button className="primary-btn" onClick={openCreate}><Plus size={17} /> Novo produto</button>
        </header>

        <section className="hero">
          <div className="hero-copy"><div className="hero-icon"><Truck size={24} /></div><div><p className="hero-kicker">LOGÍSTICA INTELIGENTE</p><h2>Dados certos. Etiquetas prontas. Operação mais rápida.</h2><p>Cadastre produtos, gere Code 128 e prepare etiquetas organizadas para impressão A4.</p></div></div>
          <div className="hero-graphic" aria-hidden="true"><div className="warehouse-grid" /><div className="box box-a" /><div className="box box-b" /><div className="barcode-mini"><i/><i/><i/><i/><i/><i/><i/></div></div>
        </section>

        <section className="stats">
          <div className="stat"><div className="stat-icon blue"><Package size={19} /></div><div><span>Produtos cadastrados</span><strong>{products.length}</strong></div><small>cadastros</small></div>
          <div className="stat"><div className="stat-icon green"><Boxes size={19} /></div><div><span>Quantidade total</span><strong>{totalQty.toLocaleString("pt-BR")}</strong></div><small>unidades</small></div>
          <div className="stat"><div className="stat-icon orange"><CalendarDays size={19} /></div><div><span>Validades ≤ 90 dias</span><strong>{expiring}</strong></div><small>atenção</small></div>
        </section>

        <section className="panel">
          <div className="panel-head"><div><div className="section-label">INVENTÁRIO</div><h3>Produtos cadastrados</h3><p>Controle de produto, lote, validade e quantidade.</p></div><div className="searchbox"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produto, código ou lote…" /></div></div>
          <div className="filters">{(["Todas", "Pharma", "Aspen", "Viatris"] as const).map((item) => <button key={item} className={`filter ${company === item ? "active" : ""}`} onClick={() => setCompany(item)}>{item}</button>)}</div>
          <div className="table-wrap"><table><thead><tr><th>Produto</th><th>Empresa</th><th>Código</th><th>Lote</th><th>Validade</th><th>Qtd.</th><th>Ações</th></tr></thead>
            <tbody>{filtered.length ? filtered.map((p) => <tr key={p.id}>
              <td><div className="product-cell"><div className="product-icon"><Package size={16} /></div><div><strong>{p.name}</strong><small>Cadastro local</small></div></div></td>
              <td><span className="company-pill">{p.company}</span></td>
              <td><code>{p.code}</code></td>
              <td><code>{p.lot}</code></td>
              <td>{formatDate(p.expiry)}</td>
              <td><strong>{p.quantity.toLocaleString("pt-BR")}</strong></td>
              <td><div className="row-actions"><button title="Imprimir etiquetas" onClick={() => printLabels(p)} className="print-action"><Printer size={15} /></button><button title="Editar" onClick={() => openEdit(p)} className="icon-btn"><Edit3 size={15} /></button><button title="Excluir" onClick={() => remove(p.id)} className="icon-btn danger"><Trash2 size={15} /></button></div></td>
            </tr>) : <tr><td colSpan={7} className="empty-state">Nenhum produto encontrado.</td></tr>}</tbody>
          </table></div>
        </section>

        <footer className="footer"><span>LOGI BARCODE 2.0</span><span><Check size={13} /> Code 128 · A4 · Dados locais</span></footer>
      </main>

      {notice && <div className="toast"><div className="toast-icon"><Check size={15} /></div><span>{notice}</span><button onClick={() => setNotice(null)}><X size={14} /></button></div>}

      {showForm && <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}><div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><div className="eyebrow">CADASTRO DE PRODUTO</div><h3>{editing ? "Editar produto" : "Novo produto"}</h3></div><button className="icon-btn" onClick={() => setShowForm(false)}><X /></button></div>
        <form onSubmit={save}><div className="form-grid">
          <label>Empresa<select value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value as Company })}><option>Pharma</option><option>Aspen</option><option>Viatris</option></select></label>
          <label>Nome do produto<input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Produto 500mg" /></label>
          <label>Código do produto<input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ex.: 7891234567890" /></label>
          <label>Validade<input required type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} /></label>
          <label>Lote<input required value={form.lot} onChange={(e) => setForm({ ...form, lot: e.target.value })} placeholder="Ex.: L240901A" /></label>
          <label>Quantidade<input required type="number" min="0" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
        </div><div className="form-note"><CalendarDays size={16} /> Validade na etiqueta: <strong>{form.expiry ? formatDate(form.expiry) : "DD/MM/AAAA"}</strong></div>
        <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancelar</button><button type="submit" className="primary-btn"><Check size={16} /> {editing ? "Salvar alterações" : "Cadastrar produto"}</button></div></form>
      </div></div>}

      {printingProduct && <PrintSheet product={printingProduct} />}

      <style>{`
        .print-layer { display:none; }
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { width: 210mm !important; min-height: 297mm !important; background: #fff !important; }
          body { margin: 0 !important; }
          body * { visibility: hidden !important; }
          .print-layer, .print-layer * { visibility: visible !important; }
          .print-layer { display:block !important; position:absolute !important; inset:0 !important; width:210mm !important; min-height:297mm !important; background:#fff !important; }
          .print-sheet { width:210mm; height:297mm; padding:8mm; display:grid; grid-template-columns:repeat(2, 1fr); grid-template-rows:18mm repeat(3, 1fr); gap:4mm; background:#fff; box-sizing:border-box; color:#172238; font-family:Arial,Helvetica,sans-serif; }
          .print-header { grid-column:1 / -1; border-bottom:1px solid #d6dbe2; padding:1mm 0 3mm; display:flex; align-items:flex-end; justify-content:space-between; }
          .print-brand { font-size:14pt; font-weight:800; letter-spacing:.05em; }
          .print-subtitle { margin-top:1mm; color:#697586; font-size:5.5pt; font-weight:700; letter-spacing:.1em; }
          .print-meta { max-width:80mm; text-align:right; font-size:7pt; color:#667085; }
          .print-label { min-width:0; border:1px solid #cfd5dc; border-radius:2mm; padding:3mm; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; overflow:hidden; background:#fff; box-sizing:border-box; }
          .print-label-title { width:100%; margin-bottom:1.5mm; font-size:7pt; font-weight:900; letter-spacing:.07em; }
          .print-label .barcode-svg { display:block; width:100%; max-width:82mm; height:auto; }
          .print-value { margin-top:1mm; max-width:100%; overflow-wrap:anywhere; font-size:8pt; font-weight:800; }
          .print-encoded { margin-top:1mm; max-width:100%; overflow-wrap:anywhere; font-family:Consolas,monospace; font-size:5.5pt; color:#667085; }
        }
      `}</style>
    </div>
  );
}