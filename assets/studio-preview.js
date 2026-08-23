const catalog = window.FY_CATALOG;
const endpoint = "https://fy-promogifts-inquiry.sira-fengyin.workers.dev/submit";
const $ = (id) => document.getElementById(id);

function productById(id){ return catalog.products.find((item) => item.id === id); }
function packageById(id){ return catalog.packaging.find((item) => item.id === id); }
function swatches(colors){ return colors.map((color) => `<span class="swatch" style="background:${color}"></span>`).join(""); }
function openPreview(item){ $("modalImage").src = item.image; $("modalTitle").textContent = item.name; $("modal").classList.add("open"); }
function bindModal(){
  $("closeModal").addEventListener("click", () => $("modal").classList.remove("open"));
  $("modal").addEventListener("click", (event) => { if(event.target.id === "modal") $("modal").classList.remove("open"); });
}
async function sendInquiry(event){
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector(".status");
  status.textContent = "Submitting...";
  const response = await fetch(endpoint, { method:"POST", body:new FormData(form), headers:{ Accept:"application/json" } });
  status.textContent = response.ok ? "Thanks. Your inquiry has been sent." : "Submission failed. Please email info@fypromogifts.com.";
  if(response.ok) form.reset();
}

function productCard(product, selected){
  return `<article class="product-card">
    <div class="product-card__image" data-preview="${product.id}"><img src="${product.image}" alt="${product.name}"></div>
    <div class="product-card__hover"><strong>${product.methods}</strong><p>${product.fit}</p></div>
    <div class="product-card__body"><h3>${product.name}</h3><div class="meta">${product.category} / MOQ ${product.moq}</div><div class="swatches">${swatches(product.colors)}</div><button class="add ${selected ? "active" : ""}" data-id="${product.id}">${selected ? "Selected" : "Add to proposal"}</button></div>
  </article>`;
}

function initPreviewKit(){
  const selected = new Set();
  let packId = catalog.packaging[1].id;
  let category = "All";
  const styleButtons = document.querySelectorAll("[data-style]");

  function applyTemplate(){
    const kit = catalog.kitTemplates.find((item) => item.id === $("template").value) || catalog.kitTemplates[0];
    selected.clear();
    kit.products.forEach((id) => selected.add(id));
    packId = kit.packaging;
    render();
  }
  function renderFilters(){
    const cats = ["All", ...new Set(catalog.products.map((p) => p.category))];
    $("filters").innerHTML = cats.map((cat) => `<button class="${cat === category ? "active" : ""}" data-cat="${cat}">${cat}</button>`).join("");
    $("filters").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { category = button.dataset.cat; render(); }));
  }
  function renderProducts(){
    const products = catalog.products.filter((product) => category === "All" || product.category === category);
    $("productWall").innerHTML = products.map((product) => productCard(product, selected.has(product.id))).join("");
    $("productWall").querySelectorAll(".add").forEach((button) => button.addEventListener("click", () => {
      selected.has(button.dataset.id) ? selected.delete(button.dataset.id) : selected.add(button.dataset.id);
      render();
    }));
    $("productWall").querySelectorAll("[data-preview]").forEach((node) => node.addEventListener("click", () => openPreview(productById(node.dataset.preview))));
  }
  function renderPackages(){
    $("packageStrip").innerHTML = catalog.packaging.map((pack) => `<article class="package-card ${pack.id === packId ? "active" : ""}" data-id="${pack.id}"><img src="${pack.image}" alt="${pack.name}"><div><h3>${pack.name}</h3><p class="meta">${pack.note}</p></div></article>`).join("");
    $("packageStrip").querySelectorAll(".package-card").forEach((card) => card.addEventListener("click", () => { packId = card.dataset.id; render(); }));
  }
  function renderBoard(){
    const products = [...selected].map(productById).filter(Boolean);
    const pack = packageById(packId);
    $("kitBoard").innerHTML = [...products.slice(0,5), pack].map((item) => `<div class="mini"><img src="${item.image}" alt="${item.name}"><span>${item.name}</span></div>`).join("");
    const style = document.querySelector("[data-style].active")?.dataset.style || "Clean corporate";
    const summary = `Use case: ${$("template").selectedOptions[0]?.textContent || "Gift kit"}\nQuantity: ${$("quantity").value}\nStyle: ${style}\nProducts: ${products.map((p) => p.name).join(", ")}\nPackaging: ${pack.name}`;
    $("summaryText").textContent = summary;
    $("hiddenUseCase").value = $("template").selectedOptions[0]?.textContent || "Gift kit";
    $("hiddenProducts").value = summary;
    $("message").value = summary;
  }
  function render(){ renderFilters(); renderProducts(); renderPackages(); renderBoard(); }
  $("template").innerHTML = catalog.kitTemplates.map((kit) => `<option value="${kit.id}">${kit.name}</option>`).join("");
  $("template").addEventListener("change", applyTemplate);
  $("quantity").addEventListener("input", renderBoard);
  styleButtons.forEach((button) => button.addEventListener("click", () => { styleButtons.forEach((b) => b.classList.remove("active")); button.classList.add("active"); renderBoard(); }));
  $("quoteForm").addEventListener("submit", sendInquiry);
  bindModal();
  applyTemplate();
}

function initPreviewProducts(){
  let category = "All";
  function renderFilters(){
    const cats = ["All", ...new Set(catalog.products.map((p) => p.category))];
    $("filters").innerHTML = cats.map((cat) => `<button class="${cat === category ? "active" : ""}" data-cat="${cat}">${cat}</button>`).join("");
    $("filters").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { category = button.dataset.cat; render(); }));
  }
  function choose(id){
    const product = productById(id);
    const summary = `${product.name} / ${product.category} / MOQ ${product.moq} / Branding: ${product.methods}`;
    $("selectedBox").textContent = summary;
    $("hiddenProducts").value = summary;
    $("message").value = `Please quote ${product.name}. Preferred branding: ${product.methods}.`;
  }
  function render(){
    renderFilters();
    const products = catalog.products.filter((product) => category === "All" || product.category === category);
    $("productWall").innerHTML = products.map((product) => productCard(product, false)).join("");
    $("productWall").querySelectorAll(".add").forEach((button) => button.addEventListener("click", () => choose(button.dataset.id)));
    $("productWall").querySelectorAll("[data-preview]").forEach((node) => node.addEventListener("click", () => openPreview(productById(node.dataset.preview))));
  }
  $("quoteForm").addEventListener("submit", sendInquiry);
  bindModal();
  render();
}
