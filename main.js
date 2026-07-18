// =========================================================
// Wanderly — shared behaviour (mobile nav, filters, forms)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Explore page: filter chips
  const filterRow = document.getElementById("filterRow");
  const grid = document.getElementById("destinationGrid");

  if (filterRow && grid) {
    const chips = filterRow.querySelectorAll(".filter-chip");
    const cards = grid.querySelectorAll(".destination-card");

    filterRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.dataset.filter;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "" : "none";
      });
    });
  }

  // Prevent default submit on demo forms (no backend attached)
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']");
      if (btn && btn.textContent.trim()) {
        const original = btn.textContent;
        btn.textContent =
          original.toLowerCase().includes("send") ? "Message Sent!" :
          original.toLowerCase().includes("login") ? "Logging in..." :
          "Done!";
        setTimeout(() => (btn.textContent = original), 1800);
      }
    });
  });
});