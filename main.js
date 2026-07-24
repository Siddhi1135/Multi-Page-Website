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

  // =======================================================
  // Explore page: dynamic destination cards (DOM Manipulation)
  // + filtering + favorites (Local Storage)
  // =======================================================
  const filterRow = document.getElementById("filterRow");
  const grid = document.getElementById("destinationGrid");

  if (filterRow && grid) {
    const destinations = [
      { id: "bali", name: "Bali, Indonesia", price: 499, category: "mountains", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=500&q=80" },
      { id: "santorini", name: "Santorini, Greece", price: 689, category: "city", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=500&q=80" },
      { id: "switzerland", name: "Switzerland", price: 689, category: "mountains", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=500&q=80" },
      { id: "tokyo", name: "Tokyo, Japan", price: 799, category: "city", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80" },
      { id: "maldives", name: "Maldives", price: 899, category: "beach", image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=500&q=80" },
      { id: "paris", name: "Paris, France", price: 689, category: "city", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80" },
      { id: "newyork", name: "New York, USA", price: 999, category: "city", image: "https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&w=500&q=80" },
      { id: "dubai", name: "Dubai, UAE", price: 899, category: "adventure", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80" },
    ];

    // ---- Favorites (Local Storage) ----
    function getFavorites() {
      const saved = localStorage.getItem("wanderly_favorites");
      return saved ? JSON.parse(saved) : [];
    }

    function toggleFavorite(id) {
      let favorites = getFavorites();
      if (favorites.includes(id)) {
        favorites = favorites.filter((favId) => favId !== id);
      } else {
        favorites.push(id);
      }
      localStorage.setItem("wanderly_favorites", JSON.stringify(favorites));
      return favorites;
    }

    // ---- Render cards (DOM Manipulation) ----
    function renderDestinations(list) {
      if (list.length === 0) {
        grid.innerHTML = `<p class="empty-state">No destinations match this filter yet.</p>`;
        return;
      }

      const favorites = getFavorites();

      grid.innerHTML = list.map((dest) => {
        const isFav = favorites.includes(dest.id);
        return `
          <article class="destination-card" data-category="${dest.category}">
            <div class="thumb">
              <img src="${dest.image}" alt="${dest.name}">
              <button class="fav-btn ${isFav ? "active" : ""}" data-id="${dest.id}" aria-label="Save to favorites">
                <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
              </button>
            </div>
            <div class="info"><h3>${dest.name}</h3><p class="price">From <strong>$${dest.price}</strong></p></div>
          </article>
        `;
      }).join("");
    }

    let currentFilter = "all";

    function getFiltered() {
      return currentFilter === "all"
        ? destinations
        : destinations.filter((d) => d.category === currentFilter);
    }

    renderDestinations(getFiltered());

    // ---- Filter chip clicks ----
    const chips = filterRow.querySelectorAll(".filter-chip");
    filterRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.filter;
      renderDestinations(getFiltered());
    });

    // ---- Favorite button clicks (event delegation, since cards are dynamic) ----
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".fav-btn");
      if (!btn) return;

      const favorites = toggleFavorite(btn.dataset.id);
      const isFav = favorites.includes(btn.dataset.id);
      btn.classList.toggle("active", isFav);
      btn.querySelector("i").className = `fa-${isFav ? "solid" : "regular"} fa-heart`;
    });
  }

  // =======================================================
  // Form validation engine
  // Fields opt in via data-rules="required,email,min:6"
  // Error <small> elements are created dynamically (DOM manipulation)
  // =======================================================
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getErrorEl(input) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("field-error")) {
      error = document.createElement("small");
      error.className = "field-error";
      input.insertAdjacentElement("afterend", error);
    }
    return error;
  }

  function validateInput(input) {
    const rules = (input.dataset.rules || "").split(",").map((r) => r.trim()).filter(Boolean);
    const value = input.value.trim();
    let message = "";

    for (const rule of rules) {
      if (rule === "required" && !value) {
        message = "This field is required.";
        break;
      }
      if (rule === "email" && value && !EMAIL_PATTERN.test(value)) {
        message = "Please enter a valid email address.";
        break;
      }
      if (rule.startsWith("min:")) {
        const min = Number(rule.split(":")[1]);
        if (value && value.length < min) {
          message = `Must be at least ${min} characters.`;
          break;
        }
      }
    }

    const errorEl = getErrorEl(input);
    if (message) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      errorEl.textContent = message;
      errorEl.classList.add("show");
    } else {
      input.classList.remove("is-invalid");
      if (value) input.classList.add("is-valid");
      errorEl.textContent = "";
      errorEl.classList.remove("show");
    }
    return !message;
  }

  function attachValidation(form) {
    // Newsletter forms only have one email input — apply rules automatically
    if (form.classList.contains("newsletter-form")) {
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && !emailInput.dataset.rules) {
        emailInput.dataset.rules = "required,email";
      }
    }

    const fields = form.querySelectorAll("[data-rules]");

    fields.forEach((input) => {
      input.addEventListener("blur", () => validateInput(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid")) validateInput(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // no backend attached — always stop real navigation

      let isValid = true;
      fields.forEach((input) => {
        if (!validateInput(input)) isValid = false;
      });

      if (!isValid) {
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const btn = form.querySelector("button[type='submit']");
      if (btn && btn.textContent.trim()) {
        const original = btn.textContent;
        btn.textContent =
          original.toLowerCase().includes("send") ? "Message Sent!" :
          original.toLowerCase().includes("login") ? "Logging in..." :
          "Subscribed!";
        setTimeout(() => (btn.textContent = original), 1800);
      }

      form.reset();
      fields.forEach((input) => input.classList.remove("is-valid", "is-invalid"));
    });
  }

  document.querySelectorAll("form").forEach(attachValidation);
});