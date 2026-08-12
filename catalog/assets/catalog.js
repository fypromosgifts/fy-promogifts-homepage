(function () {
  const page = document.body.dataset;
  const pageType = page.pageType || "category";
  const categorySlug = page.categorySlug || "";
  const parentCategorySlug = page.parentCategorySlug || "";
  const productsUrl = page.productsUrl || "/catalog/data/products.json";
  const categoriesUrl = page.categoriesUrl || "/catalog/data/categories.json";
  const useCasesUrl = page.useCasesUrl || "/catalog/data/use-cases.json";
  const storageKey = "catalogInquiryBag";
  const legacyStorageKeys = ["fyCatalogInquiry", `fyCatalogInquiry:${categorySlug || "catalog"}`];
  const defaultWhatsappNumber = "8615869117529";
  const defaultEmailAddress = "info@fypromogifts.com";
  const whatsappNumber = normalizePhoneNumber(page.whatsappNumber) || defaultWhatsappNumber;
  const emailAddress = page.emailAddress || defaultEmailAddress;

  const productGrid = document.getElementById("productGrid");
  const categoryGrid = document.getElementById("categoryGrid");
  const filterBar = document.getElementById("filterBar");
  const resultCount = document.getElementById("resultCount");
  const catalogSummary = document.getElementById("catalogSummary");
  const emptyState = document.getElementById("emptyState");
  const inquiryItems = document.getElementById("inquiryItems");
  const inquiryEmpty = document.getElementById("inquiryEmpty");
  const clearInquiry = document.getElementById("clearInquiry");
  const whatsappLink = document.getElementById("whatsappLink");
  const emailLink = document.getElementById("emailLink");
  const inquiryBagButton = document.getElementById("inquiryBagButton");
  const inquiryCount = document.getElementById("inquiryCount");
  const inquiryDrawer = document.getElementById("inquiryDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const closeDrawer = document.getElementById("closeDrawer");
  const heroRequestQuote = document.getElementById("heroRequestQuote");
  const materialFilterOptions = [
    { value: "stainless-steel", label: "Stainless Steel" },
    { value: "ceramic", label: "Ceramic" },
    { value: "plastic", label: "Plastic" },
    { value: "glass", label: "Glass" },
    { value: "paper", label: "Paper" },
    { value: "metal", label: "Metal" },
    { value: "cotton", label: "Cotton" },
    { value: "polyester", label: "Polyester" },
    { value: "rubber", label: "Rubber" },
    { value: "pu", label: "PU" },
    { value: "other", label: "Other" }
  ];
  const materialMatchers = {
    "stainless-steel": ["stainless steel"],
    ceramic: ["ceramic"],
    plastic: ["plastic", "pp", "polypropylene", "pvc", "abs", "acrylic", "pet", "pe", "polyethylene", "ps", "pc"],
    glass: ["glass"],
    paper: ["paper", "kraft paper", "cardboard", "paperboard", "corrugated"],
    metal: ["metal", "aluminum", "aluminium", "iron", "zinc alloy", "brass", "copper"],
    cotton: ["cotton", "canvas"],
    polyester: ["polyester", "nylon", "microfiber"],
    rubber: ["rubber", "silicone", "silicon"],
    pu: ["pu", "pu leather", "polyurethane"]
  };

  const state = {
    products: [],
    categories: [],
    useCases: [],
    filters: {
      search: "",
      category: "all",
      material: "all",
      useCase: "all",
      customization: "all",
      capacity: "all",
      style: "all",
      sort: "featured"
    }
  };
  const pageSize = 12;
  let currentPage = 1;

  let inquiry = readInquiry();

  function readInquiry() {
    try {
      const current = localStorage.getItem(storageKey);

      if (current !== null) {
        return JSON.parse(current) || [];
      }

      for (const key of legacyStorageKeys) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          return JSON.parse(value) || [];
        }
      }
    } catch (error) {
      return [];
    }

    return [];
  }

  function saveInquiry() {
    localStorage.setItem(storageKey, JSON.stringify(inquiry));
    legacyStorageKeys.forEach((key) => localStorage.removeItem(key));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizePhoneNumber(value) {
    return String(value || "").replace(/[^\d]/g, "");
  }

  function slugify(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function getProductId(product) {
    return product.product_id || product.id || "";
  }

  function getProductTitle(product) {
    return product.title_en || product.title || "";
  }

  function getProductImage(product) {
    return product.image_main || product.image || "";
  }

  function getProductCategory(product) {
    return product.category || page.categoryName || categorySlug || "";
  }

  function getProductCategorySlug(product) {
    return product.category_slug || categorySlug || slugify(getProductCategory(product));
  }

  function getProductParentSlug(product) {
    return product.parent_category_slug || parentCategorySlug || "";
  }

  function getArray(value) {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    return value ? [value] : [];
  }

  function getColors(product) {
    return getArray(product.colors).join(" / ");
  }

  function getProductSpecs(product) {
    return [product.material, product.size, product.capacity, getColors(product)].filter(Boolean);
  }

  function isPublicProduct(product) {
    return product.publish_to_catalog !== false;
  }

  function isSelected(productId) {
    return inquiry.some((item) => item.id === productId);
  }

  function getVisibleProducts() {
    let products = state.products.filter(isPublicProduct);

    if (pageType === "category" && categorySlug) {
      products = products.filter((product) =>
        getProductCategorySlug(product) === categorySlug ||
        getProductParentSlug(product) === categorySlug
      );
    }

    const query = normalize(state.filters.search);
    if (query) {
      products = products.filter((product) =>
        [
          getProductId(product),
          getProductTitle(product),
          getProductCategory(product),
          product.material,
          product.capacity,
          product.size,
          getColors(product),
          getArray(product.suitable_for).join(" "),
          getArray(product.can_be_paired_with).join(" ")
        ].some((value) => normalize(value).includes(query))
      );
    }

    if (state.filters.category !== "all") {
      products = products.filter((product) =>
        getProductCategorySlug(product) === state.filters.category ||
        getProductParentSlug(product) === state.filters.category
      );
    }

    if (state.filters.material !== "all") {
      products = products.filter((product) => matchesMaterialFilter(product.material, state.filters.material));
    }

    if (state.filters.capacity !== "all") {
      products = products.filter((product) => slugify(product.capacity) === state.filters.capacity);
    }

    if (state.filters.style !== "all") {
      products = products.filter((product) =>
        getArray(product.styles).some((style) => slugify(style) === state.filters.style)
      );
    }

    if (state.filters.useCase !== "all") {
      products = products.filter((product) =>
        getArray(product.use_case).some((useCase) => slugify(useCase) === state.filters.useCase)
      );
    }

    if (state.filters.customization !== "all") {
      products = products.filter((product) =>
        getArray(product.customization).some((item) => slugify(item) === state.filters.customization)
      );
    }

    if (state.filters.sort === "title") {
      products = [...products].sort((a, b) => getProductTitle(a).localeCompare(getProductTitle(b)));
    }

    return products;
  }

  function renderFilterBar() {
    if (!filterBar) {
      return;
    }

    const isIndexPage = pageType === "index";
    const options = isIndexPage
      ? [
          { id: "category", label: "Category", values: getCategoryOptions() },
          { id: "material", label: "Material", values: materialFilterOptions },
          { id: "useCase", label: "Use Case", values: getUseCaseOptions() },
          { id: "customization", label: "Customization", values: getCustomizationOptions() }
        ]
      : categorySlug === "gift-sets"
        ? [
          { id: "material", label: "Material", values: getUniqueProductValues("material") },
          { id: "useCase", label: "Use Case", values: getUseCaseOptions() },
          { id: "style", label: "Style", values: getUniqueArrayValues("styles") }
        ]
        : [
          { id: "material", label: "Material", values: materialFilterOptions },
          { id: "capacity", label: "Capacity", values: getUniqueProductValues("capacity") },
          { id: "style", label: "Style", values: getUniqueArrayValues("styles") }
        ];

    filterBar.innerHTML = `
      <label class="filter-control filter-search" data-filter="search">
        <span>Search</span>
        <input id="catalogSearch" type="search" placeholder="Search by product ID or product name" autocomplete="off" value="${escapeHtml(state.filters.search)}">
      </label>
      ${options.map(renderSelectFilter).join("")}
      <label class="filter-control" data-filter="sort">
        <span>Sort</span>
        <select name="catalog_sort" aria-label="Sort products" data-filter-select="sort">
          <option value="featured"${state.filters.sort === "featured" ? " selected" : ""}>Featured</option>
          <option value="title"${state.filters.sort === "title" ? " selected" : ""}>Product Name</option>
        </select>
      </label>
      <button id="resetFilters" class="reset-button" type="button">Reset</button>
    `;
  }

  function renderCategoryMenu() {
    document.querySelectorAll(".catalog-nav").forEach((nav) => {
      if (!nav.querySelector(".nav-dropdown")) {
        const categoryLink = [...nav.querySelectorAll("a")].find((link) =>
          link.textContent.trim() === "Categories"
        );

        if (categoryLink) {
          const dropdown = document.createElement("div");
          dropdown.className = "nav-dropdown";
          dropdown.innerHTML = `
            <button class="nav-dropdown-button" type="button" aria-expanded="false">Categories</button>
            <div class="category-menu" aria-label="Categories menu"></div>
          `;
          categoryLink.replaceWith(dropdown);
        }
      }
    });

    const menuHtml = buildCategoryMenuHtml();
    document.querySelectorAll(".category-menu").forEach((menu) => {
      menu.innerHTML = menuHtml;
    });
  }

  function buildCategoryMenuHtml() {
    const topCategories = state.categories
      .filter((category) => !category.parent_slug)
      .sort((a, b) => a.sort_order - b.sort_order);

    return topCategories.map((category) => {
      const children = state.categories
        .filter((item) => item.parent_slug === category.category_slug)
        .sort((a, b) => a.sort_order - b.sort_order);
      const href = getCategoryHref(category);

      return `
        <div class="category-menu-group">
          <a class="category-menu-parent" href="${escapeHtml(href)}">${escapeHtml(category.category_name)}</a>
          ${
            children.length
              ? `<div class="category-menu-children">${children.map((child) => `<a href="${escapeHtml(getCategoryHref(child))}">${escapeHtml(child.category_name)}</a>`).join("")}</div>`
              : ""
          }
        </div>
      `;
    }).join("");
  }

  function getCategoryHref(category) {
    if (category.parent_slug) {
      return `/catalog/${category.parent_slug}/${category.category_slug}/`;
    }

    return `/catalog/${category.category_slug}/`;
  }

  function renderSelectFilter(filter) {
    return `
      <label class="filter-control" data-filter="${escapeHtml(filter.id)}">
        <span>${escapeHtml(filter.label)}</span>
        <select name="catalog_${escapeHtml(filter.id)}" aria-label="${escapeHtml(filter.label)} filter" data-filter-select="${escapeHtml(filter.id)}">
          <option value="all">All</option>
          ${filter.values.map((item) => `<option value="${escapeHtml(item.value)}"${state.filters[filter.id] === item.value ? " selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  function getCategoryOptions() {
    const publishedProducts = state.products.filter(isPublicProduct);
    const activeParentSlugs = new Set(
      publishedProducts
        .map((product) => getProductParentSlug(product) || getProductCategorySlug(product))
        .filter(Boolean)
    );

    return state.categories
      .filter((category) => !category.parent_slug && activeParentSlugs.has(category.category_slug))
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        value: category.category_slug,
        label: category.category_name
      }));
  }

  function getUseCaseOptions() {
    return state.useCases
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((useCase) => ({
        value: useCase.use_case_slug,
        label: useCase.use_case_name
      }));
  }

  function getCustomizationOptions() {
    const values = new Map();
    state.products.forEach((product) => {
      getArray(product.customization).forEach((item) => values.set(slugify(item), item));
    });
    return [...values].map(([value, label]) => ({ value, label }));
  }

  function getUniqueProductValues(key) {
    const values = new Map();
    getBaseProductsForFilter().forEach((product) => {
      const value = product[key];
      if (value) {
        values.set(slugify(value), value);
      }
    });
    return [...values].map(([value, label]) => ({ value, label }));
  }

  function getUniqueArrayValues(key) {
    const values = new Map();
    getBaseProductsForFilter().forEach((product) => {
      getArray(product[key]).forEach((value) => values.set(slugify(value), value));
    });
    return [...values].map(([value, label]) => ({ value, label }));
  }

  function matchesMaterialFilter(material, filterValue) {
    if (filterValue === "all") {
      return true;
    }

    const normalizedMaterial = normalize(material);

    if (!normalizedMaterial) {
      return filterValue === "other";
    }

    if (!materialMatchers[filterValue] && filterValue !== "other") {
      return slugify(material) === filterValue;
    }

    if (filterValue === "other") {
      return !Object.keys(materialMatchers).some((key) =>
        matchesMaterialFilter(material, key)
      );
    }

    return (materialMatchers[filterValue] || []).some((token) =>
      normalizedMaterial.includes(normalize(token))
    );
  }

  function getBaseProductsForFilter() {
    if (pageType !== "category" || !categorySlug) {
      return state.products.filter(isPublicProduct);
    }

    return state.products.filter((product) =>
      isPublicProduct(product) &&
      (getProductCategorySlug(product) === categorySlug || getProductParentSlug(product) === categorySlug)
    );
  }

  function renderCategories() {}

  function renderCategoryCard(category) {
    const count = getCategoryProductCount(category.category_slug);
    const available = count > 0 || category.status === "available";
    const href = available ? `/catalog/${category.category_slug}/` : `/catalog/${category.category_slug}/`;

    return `
      <a class="category-card${available ? "" : " coming-soon"}" href="${escapeHtml(href)}">
        <div class="category-art" aria-hidden="true"></div>
        <div class="category-copy">
          <h3>${escapeHtml(category.category_name)}</h3>
          <p>${escapeHtml(category.category_description)}</p>
          <span>${available ? `${count} product${count === 1 ? "" : "s"}` : "Coming Soon"}</span>
        </div>
      </a>
    `;
  }

  function getCategoryProductCount(slug) {
    return state.products.filter((product) =>
      isPublicProduct(product) &&
      (getProductCategorySlug(product) === slug || getProductParentSlug(product) === slug)
    ).length;
  }

  function renderProducts() {
    const visibleProducts = getVisibleProducts();
    const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const pageStart = (currentPage - 1) * pageSize;
    const renderedProducts = visibleProducts.slice(pageStart, pageStart + pageSize);
    const countText = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;

    document.getElementById("catalogPagination")?.remove();
    productGrid.innerHTML = renderedProducts.map(renderProductCard).join("");
    if (visibleProducts.length > pageSize) {
      productGrid.insertAdjacentHTML("afterend", `
        <nav id="catalogPagination" class="catalog-pagination" aria-label="Catalog pages">
          <button class="pill-button secondary" type="button" data-page-action="previous"${currentPage === 1 ? " disabled" : ""}>Previous</button>
          <span>Page ${currentPage} of ${pageCount} · Showing ${pageStart + 1}–${pageStart + renderedProducts.length} of ${visibleProducts.length}</span>
          <button class="pill-button secondary" type="button" data-page-action="next"${currentPage === pageCount ? " disabled" : ""}>Next</button>
        </nav>
      `);
    }
    installProductImageFallbacks();
    resultCount.textContent = countText;
    catalogSummary.textContent = "";
    catalogSummary.hidden = true;

    renderEmptyState(visibleProducts.length);
  }

  function installProductImageFallbacks() {
    productGrid.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        if (image.dataset.retryDone === "1") {
          image.closest(".product-image, .product-image-wrap")?.classList.add("image-unavailable");
          image.hidden = true;
          return;
        }
        image.dataset.retryDone = "1";
        const url = new URL(image.src, window.location.href);
        url.searchParams.set("retry", "20260812-catalog4");
        image.src = url.toString();
      });
    });
  }

  function renderEmptyState(count) {
    if (count > 0) {
      emptyState.hidden = true;
      emptyState.innerHTML = "";
      return;
    }

    emptyState.hidden = false;
    emptyState.innerHTML = `
      <h3>Products are being added to this category.</h3>
      <p>Please contact us if you are looking for a specific promotional gift item.</p>
      <div class="empty-actions">
        <button class="pill-button primary" type="button" data-open-inquiry>Request Quote</button>
        <a class="pill-button secondary" href="mailto:info@fypromogifts.com">Contact Us</a>
      </div>
    `;
  }

  function renderProductCard(product) {
    const productId = getProductId(product);
    const productTitle = getProductTitle(product);
    const productImage = getProductImage(product);
    const selected = isSelected(productId);
    const specs = getProductSpecs(product).slice(0, 2);
    const tags = getArray(product.tags);
    const badge = tags[0] || "";

    return `
      <article class="product-card">
        <div class="product-image">
          ${badge ? `<span class="product-badge">${escapeHtml(badge)}</span>` : ""}
          <button
            class="add-button${selected ? " added" : ""}"
            type="button"
            data-add-id="${escapeHtml(productId)}"
            aria-label="Add ${escapeHtml(productId)} to inquiry bag"
          >
            ${selected ? "&#10003;" : "+"}
          </button>
          ${product.detail_url
            ? `<a class="product-image-link" href="${escapeHtml(product.detail_url)}" aria-label="View ${escapeHtml(productTitle)} details"><img src="${escapeHtml(productImage)}" alt="${escapeHtml(productTitle)}" loading="lazy" decoding="async"></a>`
            : `<img src="${escapeHtml(productImage)}" alt="${escapeHtml(productTitle)}" loading="lazy" decoding="async">`}
        </div>
        <div class="product-body">
          <h3 class="product-title">${product.detail_url ? `<a href="${escapeHtml(product.detail_url)}">${escapeHtml(productTitle)}</a>` : escapeHtml(productTitle)}</h3>
          <div class="product-id">${escapeHtml(productId)}</div>
          ${specs.length ? `<p class="product-specs">${specs.map((spec) => escapeHtml(spec)).join(" &middot; ")}</p>` : ""}
        </div>
      </article>
    `;
  }

  function addToInquiry(productId) {
    const product = state.products.find((item) => getProductId(item) === productId);

    if (!product || isSelected(productId)) {
      openDrawer();
      return;
    }

    inquiry = [
      ...inquiry,
      {
        id: getProductId(product),
        title: getProductTitle(product),
        image: getProductImage(product),
        category: getProductCategory(product),
        category_slug: getProductCategorySlug(product)
      }
    ];
    saveInquiry();
    renderProducts();
    renderInquiry();
    openDrawer();
  }

  function removeFromInquiry(productId) {
    inquiry = inquiry.filter((item) => item.id !== productId);
    saveInquiry();
    renderProducts();
    renderInquiry();
  }

  function renderInquiry() {
    inquiryItems.innerHTML = inquiry.map((item) => `
      <div class="inquiry-item">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
        <div>
          <strong>${escapeHtml(item.id)}</strong>
          <span>${escapeHtml(item.title)}</span>
          <em>${escapeHtml(item.category || "")}</em>
        </div>
        <button class="remove-button" type="button" data-remove-id="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.id)}">
          &times;
        </button>
      </div>
    `).join("");

    const hasItems = inquiry.length > 0;
    inquiryEmpty.hidden = hasItems;
    clearInquiry.disabled = !hasItems;
    inquiryCount.textContent = String(inquiry.length);
    updateInquiryLinks();
  }

  function buildInquiryText() {
    const lines = [
      "Hello, I would like to inquire about the following products:",
      "",
      ...inquiry.flatMap((item, index) => [
        `${index + 1}. ${item.id} - ${item.title}`,
        `Category: ${item.category || ""}`,
        `Category Slug: ${item.category_slug || ""}`,
        ""
      ]),
      "",
      "Please send product details, customization options, and quotation."
    ];

    return lines.join("\n");
  }

  function updateInquiryLinks() {
    const hasItems = inquiry.length > 0;
    const encodedText = encodeURIComponent(buildInquiryText());
    const subject = encodeURIComponent("Product Inquiry from FY PromoGifts Catalog");

    whatsappLink.classList.toggle("disabled", !hasItems);
    emailLink.classList.toggle("disabled", !hasItems);
    whatsappLink.setAttribute("aria-disabled", String(!hasItems));
    emailLink.setAttribute("aria-disabled", String(!hasItems));

    whatsappLink.href = hasItems
      ? `https://wa.me/${whatsappNumber}?text=${encodedText}`
      : "#";
    emailLink.href = hasItems
      ? `mailto:${emailAddress}?subject=${subject}&body=${encodedText}`
      : "#";
  }

  function preventEmptyInquiry(event) {
    if (inquiry.length > 0) return;
    event.preventDefault();
    alert("Please add at least one product to your inquiry bag.");
  }

  function openDrawer() {
    drawerOverlay.hidden = false;
    inquiryDrawer.classList.add("open");
    inquiryDrawer.setAttribute("aria-hidden", "false");
    inquiryBagButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("drawer-open");
  }

  function closeInquiryDrawer() {
    drawerOverlay.hidden = true;
    inquiryDrawer.classList.remove("open");
    inquiryDrawer.setAttribute("aria-hidden", "true");
    inquiryBagButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("drawer-open");
  }

  async function loadJson(url, fallback) {
    const response = await fetch(url);
    if (!response.ok) {
      return fallback;
    }
    return response.json();
  }

  async function loadCatalog() {
    try {
      const [products, categories, useCases] = await Promise.all([
        loadJson(productsUrl, []),
        loadJson(categoriesUrl, []),
        loadJson(useCasesUrl, [])
      ]);

      state.products = products;
      state.categories = categories;
      state.useCases = useCases;

      renderCategoryMenu();
      renderFilterBar();
      renderCategories();
      renderProducts();
      renderInquiry();
    } catch (error) {
      if (!productGrid.children.length) {
        resultCount.textContent = "Product data could not be loaded.";
        emptyState.hidden = false;
        emptyState.innerHTML = "<p>Please refresh the page or contact us for the current product list.</p>";
      }
      renderInquiry();
    }
  }

  document.addEventListener("input", (event) => {
    if (event.target.id === "catalogSearch") {
      currentPage = 1;
      state.filters.search = event.target.value;
      renderProducts();
    }
  });

  document.addEventListener("change", (event) => {
    const filterId = event.target.dataset.filterSelect;
    if (filterId) {
      currentPage = 1;
      state.filters[filterId] = event.target.value;
      renderProducts();
    }
  });

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-id], [data-product-id]");
    if (addButton) {
      addToInquiry(addButton.dataset.addId || addButton.dataset.productId);
      return;
    }

    const pageButton = event.target.closest("[data-page-action]");
    if (pageButton && !pageButton.disabled) {
      currentPage += pageButton.dataset.pageAction === "next" ? 1 : -1;
      renderProducts();
      productGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const removeButton = event.target.closest("[data-remove-id]");
    if (removeButton) {
      removeFromInquiry(removeButton.dataset.removeId);
      return;
    }

    if (event.target.closest("#resetFilters")) {
      currentPage = 1;
      Object.assign(state.filters, {
        search: "",
        category: "all",
        material: "all",
        useCase: "all",
        customization: "all",
        capacity: "all",
        style: "all",
        sort: "featured"
      });
      renderFilterBar();
      renderProducts();
      return;
    }

    if (event.target.closest("[data-open-inquiry]")) {
      openDrawer();
      return;
    }

  });

  document.addEventListener("click", (event) => {
    const dropdownButton = event.target.closest(".nav-dropdown-button");
    const dropdownMenu = event.target.closest(".category-menu");

    if (dropdownMenu) {
      return;
    }

    document.querySelectorAll(".nav-dropdown-button").forEach((button) => {
      if (button !== dropdownButton) {
        button.setAttribute("aria-expanded", "false");
      }
    });

    if (dropdownButton) {
      const expanded = dropdownButton.getAttribute("aria-expanded") === "true";
      dropdownButton.setAttribute("aria-expanded", String(!expanded));
      event.stopPropagation();
    }
  });

  clearInquiry?.addEventListener("click", () => {
    inquiry = [];
    saveInquiry();
    renderProducts();
    renderInquiry();
  });

  inquiryBagButton?.addEventListener("click", openDrawer);
  heroRequestQuote?.addEventListener("click", openDrawer);
  whatsappLink?.addEventListener("click", preventEmptyInquiry);
  emailLink?.addEventListener("click", preventEmptyInquiry);
  closeDrawer?.addEventListener("click", closeInquiryDrawer);
  drawerOverlay?.addEventListener("click", closeInquiryDrawer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeInquiryDrawer();
      document.querySelectorAll(".nav-dropdown-button").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
      });
    }
  });

  loadCatalog();
})();
