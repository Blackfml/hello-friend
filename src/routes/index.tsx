import { createFileRoute } from "@tanstack/react-router";
import JsBarcode from "jsbarcode";
import {
  Archive,
  BarChart3,
  Boxes,
  CalendarDays,
  ClipboardList,
  Edit3,
  FileText,
  LayoutDashboard,
  Package,
  Plus,
  Printer,
  Search,
  Settings,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

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

function Barcode({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !value) return;
    try {
      JsBarcode(ref.current, value, {
        format: "CODE128",
        width: 2,
        height: 58,
        displayValue: true,
        fontSize: 12,
        margin: 6,
        background: "#ffffff",
        lineColor: "#111827",
      });
    } catch {
      if (ref.current) ref.current.innerHTML = "";
    }
  }, [value]);

  return <svg ref={ref} className="barcode-svg" aria-label={`Código de barras ${value}`} />;
}

function formatDate(value: string) {
  if (!value) return "—";
  const [y, m, d] = value.split("-");
  return d && m && y ? `${d}/${m}/${y}` : value;
}

function Index() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("logi-barcode-products");
      return saved ? JSON.parse(saved) : seed;
    } catch {
      return seed;
    }
  });
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<Company | "Todas">("Todas");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState({
    company: "Pharma" as Company,
    name: "",
    code: "",
    expiry: "",
    lot: "",
    quantity: "1",
  });

  useEffect(() => {
    localStorage.setItem("logi-barcode-products", JSON.stringify(products));
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCompany = company === "Todas" || p.company === company;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.lot.toLowerCase().includes(q);
      return matchesCompany && matchesSearch;
    });
  }, [products, search, company]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      company: "Pharma",
      name: "",
      code: "",
      expiry: "",
      lot: "",
      quantity: "1",
    });
    setShowForm(true);
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

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim() || !form.expiry || !form.lot.trim()) return;

    const data: Product = {
      id: editing?.id ?? crypto.randomUUID(),
      company: form.company,
      name: form.name.trim(),
      code: form.code.trim(),
      expiry: form.expiry,
      lot: form.lot.trim(),
      quantity: Math.max(0, Number(form.quantity) || 0),
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    };

    setProducts((current) =>
      editing ? current.map((p) => (p.id === editing.id ? data : p)) : [data, ...current],
    );
    setShowForm(false);
  };

  const remove = (id: string) => {
    if (window.confirm("Excluir este cadastro?")) {
      setProducts((current) => current.filter((p) => p.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  const printLabels = (p: Product) => {
    setSelected(p);
    requestAnimationFrame(() => setTimeout(() => window.print(), 250));
  };

  const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="logi-app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Boxes size={22} /></div>
          <div><strong>LOGI</strong><span>BARCODE</span></div>
        </div>

        <div className="side-section">OPERAÇÃO</div>
        <button className="side-link active"><LayoutDashboard size={18} /> Dashboard</button>
        <button className="side-link" onClick={openCreate}><Plus size={18} /> Novo cadastro</button>
        <button className="side-link"><ClipboardList size={18} /> Etiquetas</button>
        <button className="side-link"><Archive size={18} /> Estoque</button>

        <div className="side-section">GESTÃO</div>
        <button className="side-link"><BarChart3 size={18} /> Relatórios</button>
        <button className="side-link"><Settings size={18} /> Configurações</button>

        <div className="sidebar-foot">
          <div className="status-dot" />
          Sistema operacional
          <small>Logi Barcode v1.0</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">CENTRO DE OPERAÇÕES</div>
            <h1>Cadastro & Etiquetas</h1>
          </div>
          <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Novo produto</button>
        </header>

        <section className="hero">
          <div>
            <div className="hero-icon"><Truck size={25} /></div>
            <div>
              <p className="hero-kicker">LOGÍSTICA INTELIGENTE</p>
              <h2>Transforme dados em etiquetas prontas para operação.</h2>
              <p>Cadastre produto, lote, validade e quantidade. Gere códigos Code 128 e imprima em A4.</p>
            </div>
          </div>
          <div className="hero-graphic">
            <div className="box box-a" />
            <div className="box box-b" />
            <div className="barcode-mini"><span /><span /><span /><span /><span /><span /></div>
          </div>
        </section>

        <section className="stats">
          <div className="stat"><div className="stat-icon blue"><Package size={19} /></div><span>Produtos cadastrados</span><strong>{products.length}</strong></div>
          <div className="stat"><div className="stat-icon green"><Boxes size={19} /></div><span>Quantidade total</span><strong>{totalQty.toLocaleString("pt-BR")}</strong></div>
          <div className="stat"><div className="stat-icon orange"><FileText size={19} /></div><span>Etiquetas disponíveis</span><strong>{products.length * 6}</strong></div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Produtos cadastrados</h3>
              <p>Pesquise por produto, código ou lote.</p>
            </div>
            <div className="searchbox">
              <Search size={18} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produto, código ou lote..." />
            </div>
          </div>

          <div className="filters">
            {(["Todas", "Pharma", "Aspen", "Viatris"] as const).map((item) => (
              <button key={item} className={company === item ? "filter active" : "filter"} onClick={() => setCompany(item)}>{item}</button>
            ))}
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Produto</th><th>Empresa</th><th>Código</th><th>Lote</th><th>Validade</th><th>Qtd.</th><th /></tr></thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td><div className="product-cell"><div className="product-icon"><Package size={17} /></div><div><strong>{p.name}</strong><small>ID {p.id.slice(0, 8).toUpperCase()}</small></div></div></td>
                    <td><span className={`company ${p.company.toLowerCase()}`}>{p.company}</span></td>
                    <td className="mono">{p.code}</td>
                    <td className="mono">{p.lot}</td>
                    <td>{formatDate(p.expiry)}</td>
                    <td><strong>{p.quantity.toLocaleString("pt-BR")}</strong></td>
                    <td>
                      <div className="row-actions">
                        <button title="Editar" onClick={() => openEdit(p)}><Edit3 size={16} /></button>
                        <button title="Imprimir etiquetas" onClick={() => printLabels(p)}><Printer size={16} /></button>
                        <button title="Excluir" className="danger" onClick={() => remove(p.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <div className="empty"><Package size={30} /><strong>Nenhum produto encontrado</strong><span>Tente outro termo de busca ou cadastre um novo produto.</span></div>}
          </div>
        </section>

        <footer className="footer"><span>Logi Barcode · Gestão de etiquetas</span><span>Code 128 · Impressão A4</span></footer>
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><div className="eyebrow">CADASTRO</div><h3>{editing ? "Editar produto" : "Novo produto"}</h3></div><button className="icon-btn" onClick={() => setShowForm(false)}><X /></button></div>
            <form onSubmit={save}>
              <div className="form-grid">
                <label>Empresa<select value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value as Company })}><option>Pharma</option><option>Aspen</option><option>Viatris</option></select></label>
                <label>Nome do produto<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Produto 500mg" /></label>
                <label>Código do produto<input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ex.: 7891234567890" /></label>
                <label>Validade<input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} /></label>
                <label>Lote<input value={form.lot} onChange={(e) => setForm({ ...form, lot: e.target.value })} placeholder="Ex.: L240901A" /></label>
                <label>Quantidade<input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
              </div>
              <div className="form-note"><CalendarDays size={17} /> A validade será impressa como <strong>{form.expiry ? formatDate(form.expiry) : "DD/MM/AAAA"}</strong>.</div>
              <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancelar</button><button className="primary-btn" type="submit"><Package size={17} /> {editing ? "Salvar alterações" : "Cadastrar produto"}</button></div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="print-area">
          <div className="print-sheet">
            <div className="print-header"><strong>LOGI BARCODE</strong><span>{selected.company} · {selected.name}</span></div>
            {[
              ["CÓDIGO DO PRODUTO", selected.code],
              ["NOME DO PRODUTO", selected.name],
              ["LOTE", selected.lot],
              ["VALIDADE", formatDate(selected.expiry)],
              ["QUANTIDADE", String(selected.quantity)],
              ["EMPRESA", selected.company],
            ].map(([label, value]) => (
              <div className="print-label" key={label}>
                <div className="print-title">{label}</div>
                <Barcode value={value} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
