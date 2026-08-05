(() => {
  "use strict";
  const menu = document.querySelector(".js-menu");
  const nav = document.querySelector(".js-nav");
  menu?.addEventListener("click", () => {
    nav?.classList.toggle("hidden");
    nav?.classList.toggle("flex");
    menu.setAttribute("aria-expanded", String(!nav?.classList.contains("hidden")));
  });
  document.querySelectorAll(".js-enquiry").forEach(form => form.addEventListener("submit", event => {
    event.preventDefault();
    const status = form.querySelector(".js-form-status");
    status.textContent = "Thank you. The admissions team will call you within one school day.";
    status.classList.remove("hidden");
    form.reset();
  }));
  const filter = document.querySelector(".js-doc-filter");
  filter?.addEventListener("change", () => {
    let visible = 0;
    document.querySelectorAll("[data-document]").forEach(item => {
      const show = filter.value === "All" || item.dataset.type === filter.value;
      item.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    document.querySelector(".js-empty")?.classList.toggle("hidden", visible > 0);
  });
  try {
    const key = document.body.dataset.storage;
    const data = key ? JSON.parse(localStorage.getItem(key)) : null;
    if (!data?.landing) return;
    document.querySelectorAll("[data-cms]").forEach(node => {
      const value = data.landing[node.dataset.cms];
      if (value) node.textContent = value;
    });
    document.querySelectorAll("[data-cms-phone]").forEach(node => {
      node.textContent = data.landing.phone;
      node.href = "tel:" + String(data.landing.phone).replace(/\s/g, "");
    });
  } catch {}
})();