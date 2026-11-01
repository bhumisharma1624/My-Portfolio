"use strict";

(() => {
  const projectList = document.getElementById("project-list");
  const filterContainer = document.getElementById("project-filters");
  const searchInput = document.getElementById("project-search");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = [...document.querySelectorAll("#primary-nav a")];
  const sections = [...document.querySelectorAll("main section[id]")];

  if (!projectList || !filterContainer || !searchInput || !resultsCount || !emptyState) return;

  const cards = [...projectList.querySelectorAll(".frame")];
  const categories = ["All", ...new Set(cards.map(card => card.dataset.category).filter(Boolean))];
  let activeCategory = "All";

  renderFilters();
  updateProjects();
  bindNavigation();
  setExternalLinkSafety();
  observeSections();

  function renderFilters() {
    filterContainer.replaceChildren();

    categories.forEach(category => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-button";
      button.classList.toggle("is-active", category === activeCategory);
      button.textContent = category;
      button.setAttribute("aria-pressed", String(category === activeCategory));
      button.addEventListener("click", () => {
        activeCategory = category;
        renderFilters();
        updateProjects();
      });
      filterContainer.append(button);
    });
  }

  function updateProjects() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const matchesCategory = activeCategory === "All" || card.dataset.category === activeCategory;
      const matchesSearch = card.textContent.toLocaleLowerCase().includes(query);
      const isVisible = matchesCategory && matchesSearch;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    resultsCount.textContent = `${visibleCount} PROJECT${visibleCount === 1 ? "" : "S"}`;
    emptyState.hidden = visibleCount > 0;
  }

  function bindNavigation() {
    if (menuToggle && primaryNav) {
      menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        primaryNav.classList.toggle("is-open", isOpen);
      });

      primaryNav.addEventListener("click", event => {
        if (event.target.closest("a")) closeNavigation();
      });

      document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeNavigation();
      });
    }

    searchInput.addEventListener("input", updateProjects);
  }

  function closeNavigation() {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  }

  function setExternalLinkSafety() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.rel = "noopener noreferrer";
    });
  }

  function observeSections() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle("active", link.hash === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(section => observer.observe(section));
  }
})();
