(() => {
  "use strict";
  const STORAGE_KEY = "vertexCoachingPrototype";
  let state;
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return;
  }
  if (!state) state = {};

  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  if (state.landing) {
    document.querySelectorAll("[data-cms]").forEach(element => {
      const value = state.landing[element.dataset.cms];
      if (value) element.textContent = value;
    });
    document.querySelectorAll("[data-cms-phone]").forEach(element => {
      if (!state.landing.phone) return;
      element.textContent = state.landing.phone;
      element.href = `tel:${state.landing.phone.replace(/\s/g, "")}`;
    });
  }

  const carousel = document.querySelector("#hero-carousel");
  if (carousel) {
    const slidesRoot = document.querySelector("#hero-slides");
    if (Array.isArray(state.heroSlides) && state.heroSlides.length) {
      slidesRoot.innerHTML = state.heroSlides.map((slide, index) => `
        <article class="hero-slide${index === 0 ? " active" : ""}" aria-label="Slide ${index + 1} of ${state.heroSlides.length}" aria-hidden="${index === 0 ? "false" : "true"}">
          <img src="${escapeHtml(slide.src)}" alt="${escapeHtml(slide.alt)}">
          <div class="hero-caption"><strong>${escapeHtml(slide.heading)}</strong>${slide.supporting ? `<span>${escapeHtml(slide.supporting)}</span>` : ""}</div>
        </article>`).join("");
    }
    const slides = [...slidesRoot.querySelectorAll(".hero-slide")];
    const dotsRoot = document.querySelector("#carousel-dots");
    const previous = document.querySelector("#carousel-prev");
    const next = document.querySelector("#carousel-next");
    const currentLabel = document.querySelector("#carousel-current");
    const totalLabel = document.querySelector("#carousel-total");
    let current = 0;
    let timer;

    dotsRoot.innerHTML = slides.map((_, index) =>
      `<button type="button" aria-label="Show slide ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`
    ).join("");
    const dots = [...dotsRoot.querySelectorAll("button")];
    totalLabel.textContent = String(slides.length).padStart(2, "0");
    carousel.classList.toggle("single-slide", slides.length === 1);

    const showSlide = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle("active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, dotIndex) => dot.setAttribute("aria-current", String(dotIndex === current)));
      currentLabel.textContent = String(current + 1).padStart(2, "0");
    };
    const stopAuto = () => window.clearInterval(timer);
    const startAuto = () => {
      stopAuto();
      if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = window.setInterval(() => showSlide(current + 1), 6000);
      }
    };
    previous.addEventListener("click", () => { showSlide(current - 1); startAuto(); });
    next.addEventListener("click", () => { showSlide(current + 1); startAuto(); });
    dots.forEach((dot, index) => dot.addEventListener("click", () => { showSlide(index); startAuto(); }));
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);
    carousel.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") showSlide(current - 1);
      if (event.key === "ArrowRight") showSlide(current + 1);
    });
    showSlide(0);
    startAuto();
  }

  const mentorsGrid = document.querySelector("#public-mentors-grid");
  if (mentorsGrid && Array.isArray(state.mentors)) {
    const profiles = state.mentors.filter(profile => profile.status === "Published");
    mentorsGrid.innerHTML = profiles.map((profile, index) => {
      const initials = profile.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
      const searchableArea = `${profile.role} ${profile.subject}`.toLowerCase();
      const area = /primary|early|foundation/.test(searchableArea)
        ? "primary"
        : /science|physics|chemistry|biology|math/.test(searchableArea)
          ? "science"
          : "humanities";
      return `<article data-mentors-area="${area}">
        <div class="portrait tone-${(index % 6) + 1}"><span>${escapeHtml(initials)}</span></div>
        <h2>${escapeHtml(profile.name)}</h2>
        <p>${escapeHtml(profile.role)}</p>
        <small>${escapeHtml(profile.subject)} · ${profile.experience} years</small>
      </article>`;
    }).join("");
    const count = document.querySelector("#mentors-count");
    if (count) count.textContent = `${profiles.length} members`;
  }

  if (mentorsGrid) {
    const mentorsButtons = [...document.querySelectorAll("[data-mentors-filter]")];
    const mentorsCount = document.querySelector("#mentors-count");
    mentorsButtons.forEach(button => button.addEventListener("click", () => {
      const filter = button.dataset.mentorsFilter;
      let visible = 0;
      mentorsButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("filter-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      mentorsGrid.querySelectorAll("article").forEach(profile => {
        const show = filter === "all" || profile.dataset.mentorsArea === filter;
        profile.hidden = !show;
        if (show) visible += 1;
      });
      if (mentorsCount) mentorsCount.textContent = `${visible} ${visible === 1 ? "member" : "members"}`;
    }));
  }

  if (Array.isArray(state.documents)) {
    const formatDate = value => {
      const date = new Date(`${value}T00:00:00`);
      return {
        day: String(date.getDate()).padStart(2, "0"),
        month: date.toLocaleString("en-GB", { month: "short" }),
        year: date.getFullYear()
      };
    };
    const renderDocuments = (container, type) => {
      if (!container) return;
      container.querySelectorAll(".document").forEach(item => item.remove());
      state.documents
        .filter(item => item.type === type && item.status === "Published")
        .sort((a, b) => b.date.localeCompare(a.date))
        .forEach((item, index) => {
          const date = formatDate(item.date);
          const article = document.createElement("article");
          article.className = `document${index === 0 && type === "Notice" ? " featured" : ""}`;
          article.innerHTML = `
            <time datetime="${item.date}"><strong>${date.day}</strong>${date.month} ${date.year}</time>
            <div><span class="doc-tag ${type === "Result" ? "result-tag" : ""}">${escapeHtml(item.category)}</span>
            <h3>${escapeHtml(item.title)}</h3><p>Published document · ${escapeHtml(item.fileName)}</p></div>
            <a href="#" aria-label="Open ${escapeHtml(item.title)}"><span>PDF</span>↓</a>`;
          container.appendChild(article);
        });
    };
    renderDocuments(document.querySelector("#notices"), "Notice");
    renderDocuments(document.querySelector("#results"), "Result");
    const noticeCount = state.documents.filter(item => item.type === "Notice" && item.status === "Published").length;
    const resultCount = state.documents.filter(item => item.type === "Result" && item.status === "Published").length;
    const tabCounts = document.querySelectorAll(".doc-tabs > a span");
    if (tabCounts[0]) tabCounts[0].textContent = String(noticeCount).padStart(2, "0");
    if (tabCounts[1]) tabCounts[1].textContent = String(resultCount).padStart(2, "0");
  }

  const documentSearch = document.querySelector("#document-search");
  if (documentSearch) {
    const documentYear = document.querySelector("#document-year");
    const emptyState = document.querySelector("#document-empty");
    const clearFilters = document.querySelector("#clear-document-filters");
    const lists = [...document.querySelectorAll(".document-list")];
    const filterDocuments = () => {
      const query = documentSearch.value.trim().toLowerCase();
      const year = documentYear?.value || "all";
      let visibleTotal = 0;
      lists.forEach(list => {
        let listTotal = 0;
        list.querySelectorAll(".document").forEach(documentItem => {
          const matchesQuery = !query || documentItem.textContent.toLowerCase().includes(query);
          const date = documentItem.querySelector("time")?.dateTime || "";
          const academicYear = documentItem.textContent.match(/Academic year (\d{4})/)?.[1];
          const itemYear = academicYear || date.slice(0, 4);
          const matchesYear = year === "all" || itemYear === year;
          const show = matchesQuery && matchesYear;
          documentItem.hidden = !show;
          if (show) {
            listTotal += 1;
            visibleTotal += 1;
          }
        });
        list.hidden = listTotal === 0;
      });
      emptyState.hidden = visibleTotal !== 0;
    };
    documentSearch.addEventListener("input", filterDocuments);
    documentYear?.addEventListener("change", filterDocuments);
    clearFilters?.addEventListener("click", () => {
      documentSearch.value = "";
      if (documentYear) documentYear.value = "all";
      filterDocuments();
      documentSearch.focus();
    });
    document.querySelectorAll(".doc-tabs > a").forEach(tab => tab.addEventListener("click", () => {
      document.querySelectorAll(".doc-tabs > a").forEach(item => item.classList.toggle("active", item === tab));
    }));
  }
})();
