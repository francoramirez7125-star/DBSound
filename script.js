/* ====== EDITÁ SOLO ESTA PARTE CON TUS DATOS REALES ====== */
const CONFIG = {
  marca: "DBSound",
  whatsapp: "+543455498798"   // código de país + área + número (los símbolos se limpian solos)
};
const EQUIPOS = [
  {nombre:"Consola Mixer Behringer", cat:"Consolas", specs:["Salidas balanceadas - Salidas maximo de señal profesionales +21 dBu"], precio:"$ consultar"},
  {nombre:"Procesadores DSP/Crossover Apogee", cat:"Consolas", specs:["Division y ecualizacion profesional de equipo"], precio:"$ consultar"},
  {nombre:"Satelites AmericanVox", cat:"Parlantes", specs:["Brinda el rango de voces e instrumentos a tu fiesta"], precio:"$ consultar"},
  {nombre:"Subwoofers 15Pulg American vox", cat:"Parlantes", specs:["Brinda el golpe seco del Kick que hace vibrar con fuerza el pecho"], precio:"$ consultar"},
  {nombre:"Subwoofers 18Pulg Electro voice", cat:"Parlantes", specs:["Crea la sensacion de terremoto de tu evento haciendo vibrar el piso con una calidad de boliche"], precio:"$ consultar"},
];
// interior / exterior = máximo de personas que cubre cada pack (lo usa el recomendador)
const PACKS = [
  {nombre:"Pack LITE", desc:"Rendimiento: (interior 80/90 Personas - Exterior 50/60 personas)", interior:90, exterior:60, items:["2 satelites AV","1 Subwoofer EV 18Pulg","1 Consola Behringer","DSP/Crossover"], star:false},
  {nombre:"Pack MID", desc:"Rendimiento: (interior 140/160 Personas - Exterior 90/100 personas)", interior:160, exterior:100, items:["2 satelites AV","2 Subwoofer AV 15Pulg","1 Consola Behringer","DSP/Crossover"], star:false},
  {nombre:"Pack PLUS", desc:"Rendimiento: (interior 240 Personas - Exterior 150 personas)", interior:240, exterior:150, items:["2 satelites AV","1 Subwoofer EV 18Pulg","2 Subwoofer AV 15Pulg","1 Consola Behringer","DSP/Crossover"], star:false},
  {nombre:"Pack ULTRA", desc:"Rendimiento: (interior 300/320 Personas - Exterior 180/200 personas)", interior:320, exterior:200, items:["2 satelites AV","2 Subwoofer EV 18Pulg","2 Subwoofer AV 15Pulg","1 Consola Behringer","DSP/Crossover"], star:false},
];
/* ========================================================= */

const $ = id => document.getElementById(id);
const WA = CONFIG.whatsapp.replace(/\D/g, "");          // solo dígitos
function esc(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML;}

$("brand1").textContent = CONFIG.marca;
$("brand2").textContent = CONFIG.marca;
document.title = "Alquiler de audio | " + CONFIG.marca;
$("wa").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent("Hola " + CONFIG.marca + ", quiero consultar por el alquiler de audio.");

// ---- Tema claro / oscuro (recuerda la elección) ----
const root = document.documentElement, themeBtn = $("theme");
try { const t = localStorage.getItem("tema"); if (t) root.dataset.theme = t; } catch(e) {}
const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
function syncTheme(){
  themeBtn.textContent = isDark() ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", isDark() ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
}
themeBtn.addEventListener("click", () => {
  const n = isDark() ? "light" : "dark";
  root.dataset.theme = n;
  try { localStorage.setItem("tema", n); } catch(e) {}
  syncTheme();
});
syncTheme();

// ---- Barras del medidor ----
const meter = document.querySelector(".meter");
for(let i=0;i<28;i++){ meter.appendChild(document.createElement("span")); }

// ---- Catálogo con filtros ----
const ICONOS = {
  Consolas: '<path d="M5 3v18M12 3v18M19 3v18"/><circle cx="5" cy="9" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="19" cy="7" r="2"/>',
  Parlantes: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="15" r="3.5"/><circle cx="12" cy="7" r="1.5"/>'
};
const icono = cat => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[cat] || '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>'}</svg>`;

const cats = ["Todos", ...new Set(EQUIPOS.map(e => e.cat))];
const filters = $("filters"), grid = $("grid");
let activa = "Todos";

function pintar(){
  filters.innerHTML = cats.map(c => `<button type="button" aria-pressed="${c===activa}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  grid.innerHTML = EQUIPOS.map((e,i) => ({e,i})).filter(x => activa==="Todos" || x.e.cat===activa).map((x,n) => `
    <article class="item reveal in" style="--d:${n*70}ms">
      <span class="ico">${icono(x.e.cat)}</span>
      <span class="cat">${esc(x.e.cat)}</span>
      <h3>${esc(x.e.nombre)}</h3>
      <ul>${x.e.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <span class="price">${esc(x.e.precio)}</span>
      <button class="btn small ghost" type="button" data-eq="${x.i}">Consultar este equipo</button>
    </article>`).join("");
}
filters.addEventListener("click", ev => {
  const b = ev.target.closest("button"); if(!b) return;
  activa = b.dataset.c; pintar();
});
grid.addEventListener("click", ev => {
  const b = ev.target.closest("[data-eq]"); if(!b) return;
  irAlForm({msg: "Quiero consultar por: " + EQUIPOS[b.dataset.eq].nombre});
});
pintar();

// ---- Packs + selector del formulario ----
$("packs-grid").innerHTML = PACKS.map((p,i) => `
  <article class="pack reveal${p.star?" star":""}" style="--d:${i*90}ms">
    <h3>${esc(p.nombre)}</h3><p>${esc(p.desc)}</p>
    <ul>${p.items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    <button class="btn small" type="button" data-pack="${i}">Pedir este pack</button>
  </article>`).join("");
$("f-pack").innerHTML = '<option value="">Todavía no sé</option>' + PACKS.map(p => `<option>${esc(p.nombre)}</option>`).join("");
$("packs-grid").addEventListener("click", ev => {
  const b = ev.target.closest("[data-pack]"); if(!b) return;
  irAlForm({pack: PACKS[b.dataset.pack].nombre});
});

function irAlForm(o){
  if(o.pack) $("f-pack").value = o.pack;
  if(o.msg) $("f-msg").value = o.msg;
  $("contacto").scrollIntoView({behavior:"smooth"});
  setTimeout(() => $("f-nombre").focus({preventScroll:true}), 700);
}

// ---- Recomendador de pack ----
function recomendar(){
  const n = parseInt($("r-personas").value, 10), lugar = $("r-lugar").value, out = $("r-out");
  const cards = document.querySelectorAll(".pack");
  cards.forEach(c => c.classList.remove("match"));
  if(!n || n < 1){ out.textContent = "Ingresá la cantidad de personas y te recomendamos un pack."; return; }
  const idx = PACKS.findIndex(p => p[lugar] >= n);
  if(idx < 0){ out.textContent = "Para más de " + PACKS[PACKS.length-1][lugar] + " personas armamos un equipo a medida. Pedí tu presupuesto."; return; }
  out.textContent = "Te recomendamos el " + PACKS[idx].nombre + " para " + n + " personas en " + lugar + ".";
  cards[idx].classList.add("match");
}
$("r-personas").addEventListener("input", recomendar);
$("r-lugar").addEventListener("change", recomendar);
recomendar();

// ---- Aparición al hacer scroll ----
document.querySelectorAll("section h2, section .lead, .reco, .quote").forEach(el => el.classList.add("reveal"));
document.querySelectorAll(".steps li").forEach((el,i) => { el.classList.add("reveal"); el.style.setProperty("--d", i*100 + "ms"); });
const io = new IntersectionObserver(es => es.forEach(en => {
  if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
}), {threshold:.15});
document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));

// ---- Encabezado: sombra, barra de progreso y menú activo ----
const header = document.querySelector("header.top"), prog = $("progress");
const secs = ["equipos","packs","como","contacto"].map($);
const links = [...document.querySelectorAll("nav a[href^='#']")];
function onScroll(){
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle("scrolled", y > 10);
  prog.style.width = (h > 0 ? y/h*100 : 0) + "%";
  let cur = "";
  secs.forEach(s => { if(s.getBoundingClientRect().top < innerHeight*.4) cur = s.id; });
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
}
addEventListener("scroll", onScroll, {passive:true});
onScroll();

// ---- Formulario -> WhatsApp ----
$("send").addEventListener("click", () => {
  const v = id => $(id).value.trim(), st = $("f-status");
  if(!v("f-nombre")){ st.textContent = "Escribí tu nombre para continuar."; $("f-nombre").focus(); return; }
  st.textContent = "Abriendo WhatsApp…";
  const texto = `Hola, quiero un presupuesto.\nNombre: ${v("f-nombre")}\nEvento: ${v("f-tipo")}\nPack: ${v("f-pack") || "Todavía no sé"}\nFecha: ${v("f-fecha")}\nPersonas: ${v("f-personas")}\nComentarios: ${v("f-msg")}`;
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(texto), "_blank");
});
