const brands = [
  {
    id: "cinder",
    name: "Cinder Bakery",
    category: "food",
    description: "Wood-fired pastries, slow-fermented loaves, and a tiny breakfast counter.",
    story:
      "Cinder started with a single oven and a weekend line. The menu stays tight, the butter stays cultured, and the team bakes in small batches all morning.",
    highlights: ["Morning buns worth the detour", "Pickup shelves refreshed every hour", "Neighborhood coffee pairing"],
    distance: "0.3 mi",
    pickup: "Pickup in 12 min",
    area: "Old Quarter",
    x: 34,
    y: 33,
    accent: "linear-gradient(120deg, #d69d55, #8a4f2a 80%)",
  },
  {
    id: "drift",
    name: "Drift Elixirs",
    category: "drinks",
    description: "Botanical sodas and seasonal tonics poured from a compact corner bar.",
    story:
      "Drift mixes low-sugar sodas with bright citrus, herbs, and tea infusions. Every release is seasonal, and the small format keeps the experience personal.",
    highlights: ["Zero-proof flight menu", "House-made citrus syrups", "Late afternoon refill window"],
    distance: "0.5 mi",
    pickup: "Walk-in only",
    area: "Canal Side",
    x: 60,
    y: 21,
    accent: "linear-gradient(120deg, #8ab5a0, #2a5d58 80%)",
  },
  {
    id: "sable",
    name: "Sable Atelier",
    category: "fashion",
    description: "Small-batch garments, natural dyes, and tailoring made for repeat wear.",
    story:
      "Sable designs for longevity: fewer drops, stronger fabrics, and in-house tailoring that helps every piece earn a second life in your closet.",
    highlights: ["Tailoring appointments on weekends", "Plant-dyed capsule pieces", "Repair-first philosophy"],
    distance: "0.8 mi",
    pickup: "Pickup tomorrow",
    area: "Studio Row",
    x: 72,
    y: 46,
    accent: "linear-gradient(120deg, #c9a6b8, #5d3b54 80%)",
  },
  {
    id: "parcel",
    name: "Parcel Pantry",
    category: "pickup",
    description: "Prepared lunches, pantry staples, and neighborhood pickup lockers.",
    story:
      "Parcel Pantry turns weekday pickup into something calmer: prepped meals, pantry staples, and compact lockers that stay stocked for the evening rush.",
    highlights: ["Fast pickup lane", "Rotating lunch sets", "Family-size pantry bundles"],
    distance: "1.1 mi",
    pickup: "Pickup in 8 min",
    area: "Market North",
    x: 44,
    y: 66,
    accent: "linear-gradient(120deg, #8fb4d9, #315274 80%)",
  },
];

const cardsRow = document.querySelector("#cardsRow");
const pinLayer = document.querySelector("#pinLayer");
const cardTemplate = document.querySelector("#cardTemplate");
const pinTemplate = document.querySelector("#pinTemplate");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const splashScreen = document.querySelector("#splashScreen");
const homeView = document.querySelector("#homeView");
const detailView = document.querySelector("#detailView");
const backButton = document.querySelector("#backButton");
const closeDetailButton = document.querySelector("#closeDetailButton");
const detailSaveButton = document.querySelector("#detailSaveButton");
const detailArt = document.querySelector("#detailArt");
const detailCategory = document.querySelector("#detailCategory");
const detailName = document.querySelector("#detailName");
const detailDescription = document.querySelector("#detailDescription");
const detailDistance = document.querySelector("#detailDistance");
const detailPickup = document.querySelector("#detailPickup");
const detailArea = document.querySelector("#detailArea");
const detailStory = document.querySelector("#detailStory");
const detailHighlights = document.querySelector("#detailHighlights");
const visitButton = document.querySelector("#visitButton");
const openOnboardingButton = document.querySelector("#openOnboardingButton");
const detailOnboardingButton = document.querySelector("#detailOnboardingButton");
const onboardingView = document.querySelector("#onboardingView");
const onboardingBackButton = document.querySelector("#onboardingBackButton");
const onboardingForm = document.querySelector("#onboardingForm");
const formSteps = [...document.querySelectorAll(".form-step")];
const prevStepButton = document.querySelector("#prevStepButton");
const nextStepButton = document.querySelector("#nextStepButton");
const submitOnboardingButton = document.querySelector("#submitOnboardingButton");
const onboardingStepLabel = document.querySelector("#onboardingStepLabel");
const onboardingStepTitle = document.querySelector("#onboardingStepTitle");
const progressFill = document.querySelector("#progressFill");
const reviewCard = document.querySelector("#reviewCard");
const formFeedback = document.querySelector("#formFeedback");
const installButton = document.querySelector("#installButton");
const installBanner = document.querySelector("#installBanner");
const installBannerButton = document.querySelector("#installBannerButton");
const dismissInstallBannerButton = document.querySelector("#dismissInstallBannerButton");
const navItems = [...document.querySelectorAll(".app-nav__item")];
const SAVED_BRANDS_KEY = "mappit.savedBrands";
const INSTALL_BANNER_DISMISSED_KEY = "mappit.installBannerDismissed";

let activeFilter = "all";
let activeBrandId = brands[0].id;
let activeView = "home";
let previousView = "home";
const savedBrandIds = new Set(loadSavedBrandIds());
let scrollSyncFrame = null;
let onboardingStep = 0;
const onboardingStepTitles = ["Basics", "Experience", "Review"];
let deferredInstallPrompt = null;
let splashTimeoutId = null;

function loadSavedBrandIds() {
  try {
    const storedValue = window.localStorage.getItem(SAVED_BRANDS_KEY);
    if (!storedValue) {
      return [];
    }

    const parsed = JSON.parse(storedValue);
    const validBrandIds = new Set(brands.map((brand) => brand.id));

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((brandId) => validBrandIds.has(brandId));
  } catch (error) {
    console.warn("Unable to load saved brands from localStorage.", error);
    return [];
  }
}

function persistSavedBrandIds() {
  try {
    window.localStorage.setItem(SAVED_BRANDS_KEY, JSON.stringify([...savedBrandIds]));
  } catch (error) {
    console.warn("Unable to persist saved brands to localStorage.", error);
  }
}

function isInstallBannerDismissed() {
  try {
    return window.localStorage.getItem(INSTALL_BANNER_DISMISSED_KEY) === "true";
  } catch (error) {
    return false;
  }
}

function setInstallBannerDismissed(value) {
  try {
    window.localStorage.setItem(INSTALL_BANNER_DISMISSED_KEY, value ? "true" : "false");
  } catch (error) {
    console.warn("Unable to persist install banner preference.", error);
  }
}

function getVisibleBrands() {
  return activeFilter === "all"
    ? brands
    : brands.filter((brand) => brand.category === activeFilter);
}

function getBrandById(brandId) {
  return brands.find((brand) => brand.id === brandId);
}

function render() {
  const visibleBrands = getVisibleBrands();

  if (!visibleBrands.some((brand) => brand.id === activeBrandId)) {
    activeBrandId = visibleBrands[0]?.id ?? brands[0].id;
  }

  cardsRow.innerHTML = "";
  pinLayer.innerHTML = "";

  visibleBrands.forEach((brand, index) => {
    const cardFragment = cardTemplate.content.cloneNode(true);
    const card = cardFragment.querySelector(".brand-card");
    const image = cardFragment.querySelector(".brand-card__image");
    const tag = cardFragment.querySelector(".brand-card__tag");
    const title = cardFragment.querySelector("h3");
    const description = cardFragment.querySelector(".brand-card__description");
    const distance = cardFragment.querySelector(".brand-card__distance");
    const pickup = cardFragment.querySelector(".brand-card__pickup");
    const saveButton = cardFragment.querySelector(".save-button");
    const detailButton = cardFragment.querySelector(".card-link");

    card.dataset.id = brand.id;
    card.style.setProperty("--card-order", String(index));
    image.style.background = `linear-gradient(140deg, rgba(255,255,255,0.15), transparent), ${brand.accent}`;
    tag.textContent = brand.category;
    title.textContent = brand.name;
    description.textContent = brand.description;
    distance.textContent = brand.distance;
    pickup.textContent = brand.pickup;
    updateButtonState(saveButton, brand.id);

    card.addEventListener("click", () => setActiveBrand(brand.id, { scrollCard: true }));
    saveButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleSaved(brand.id);
    });
    detailButton.addEventListener("click", (event) => {
      event.stopPropagation();
      setActiveBrand(brand.id);
      openDetailView(brand.id);
    });

    cardsRow.appendChild(cardFragment);

    const pinFragment = pinTemplate.content.cloneNode(true);
    const pin = pinFragment.querySelector(".map-pin");
    const label = pinFragment.querySelector(".map-pin__label");

    pin.dataset.id = brand.id;
    pin.style.setProperty("--pin-order", String(index));
    pin.style.left = `${brand.x}%`;
    pin.style.top = `${brand.y}%`;
    label.textContent = brand.name.split(" ")[0];
    pin.addEventListener("click", () => setActiveBrand(brand.id, { scrollCard: true }));

    pinLayer.appendChild(pinFragment);
  });

  updateActiveState();
  renderDetail();
}

function showSplashScreen() {
  document.body.classList.add("is-loading");
  splashScreen.classList.add("is-visible");

  splashTimeoutId = window.setTimeout(() => {
    splashScreen.classList.add("is-exiting");

    window.setTimeout(() => {
      document.body.classList.remove("is-loading");
      splashScreen.classList.remove("is-visible", "is-exiting");
    }, 420);
  }, 1500);
}

function updateInstallCtas() {
  const shouldShow = Boolean(deferredInstallPrompt);
  installButton.hidden = !shouldShow;
  installBanner.hidden = !shouldShow || isInstallBannerDismissed();
}

async function triggerInstallPrompt() {
  if (!deferredInstallPrompt) {
    return;
  }

  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;

  if (choice?.outcome === "accepted") {
    setInstallBannerDismissed(true);
  }

  deferredInstallPrompt = null;
  updateInstallCtas();
}

function updateButtonState(button, brandId) {
  button.classList.toggle("is-saved", savedBrandIds.has(brandId));
  button.textContent = savedBrandIds.has(brandId) ? "Saved" : "Save";
}

function updateActiveState() {
  const cards = cardsRow.querySelectorAll(".brand-card");
  const pins = pinLayer.querySelectorAll(".map-pin");

  cards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.id === activeBrandId);
  });

  pins.forEach((pin) => {
    pin.classList.toggle("is-active", pin.dataset.id === activeBrandId);
  });
}

function scrollActiveCardIntoView() {
  const card = cardsRow.querySelector(`[data-id="${activeBrandId}"]`);
  if (!card) {
    return;
  }

  const isDesktop = window.matchMedia("(min-width: 1100px)").matches;
  card.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: isDesktop ? "nearest" : "center",
  });
}

function setActiveBrand(brandId, options = {}) {
  const { scrollCard = false } = options;

  if (!brandId) {
    return;
  }

  activeBrandId = brandId;
  updateActiveState();
  renderDetail();

  if (scrollCard) {
    scrollActiveCardIntoView();
  }
}

function renderDetail() {
  const brand = getBrandById(activeBrandId);
  if (!brand) {
    return;
  }

  detailArt.style.background = `radial-gradient(circle at top right, rgba(255,255,255,0.32), transparent 32%), ${brand.accent}`;
  detailCategory.textContent = brand.category;
  detailName.textContent = brand.name;
  detailDescription.textContent = brand.description;
  detailDistance.textContent = brand.distance;
  detailPickup.textContent = brand.pickup;
  detailArea.textContent = brand.area;
  detailStory.textContent = brand.story;
  detailHighlights.innerHTML = "";

  brand.highlights.forEach((item) => {
    const highlight = document.createElement("div");
    highlight.className = "detail-highlight";
    highlight.textContent = item;
    detailHighlights.appendChild(highlight);
  });

  updateButtonState(detailSaveButton, brand.id);
  visitButton.textContent =
    brand.category === "pickup" ? "Reserve pickup" : brand.category === "fashion" ? "Book visit" : "Plan pickup";
}

function applyViewState() {
  const isHome = activeView === "home";
  const isDetail = activeView === "detail";
  const isOnboarding = activeView === "onboarding";

  homeView.classList.toggle("is-visible", isHome);
  detailView.classList.toggle("is-visible", isDetail);
  onboardingView.classList.toggle("is-visible", isOnboarding);

  detailView.setAttribute("aria-hidden", String(!isDetail));
  onboardingView.setAttribute("aria-hidden", String(!isOnboarding));
  document.body.dataset.view = activeView;

  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.targetView === activeView);
  });
}

function openDetailView(brandId, addHistory = true) {
  if (brandId) {
    activeBrandId = brandId;
    renderDetail();
    updateActiveState();
  }

  activeView = "detail";
  applyViewState();

  if (addHistory) {
    history.pushState({ view: "detail", brandId: activeBrandId }, "", `#brand-${activeBrandId}`);
  }
}

function closeDetailView(fromHistory = false) {
  activeView = "home";
  applyViewState();
  scrollActiveCardIntoView();

  if (!fromHistory && location.hash.startsWith("#brand-")) {
    history.back();
  }
}

function openOnboardingView() {
  previousView = activeView;
  activeView = "onboarding";
  applyViewState();
  updateOnboardingStep(0);
}

function closeOnboardingView() {
  activeView = previousView === "detail" ? "detail" : "home";
  applyViewState();
}

function updateOnboardingStep(stepIndex) {
  onboardingStep = Math.max(0, Math.min(stepIndex, formSteps.length - 1));

  formSteps.forEach((step, index) => {
    step.classList.toggle("is-visible", index === onboardingStep);
  });

  onboardingForm.classList.toggle("is-final-step", onboardingStep === formSteps.length - 1);
  prevStepButton.disabled = onboardingStep === 0;
  onboardingStepLabel.textContent = `Step ${onboardingStep + 1} of ${formSteps.length}`;
  onboardingStepTitle.textContent = onboardingStepTitles[onboardingStep];
  progressFill.style.width = `${((onboardingStep + 1) / formSteps.length) * 100}%`;
  formFeedback.textContent = "";

  if (onboardingStep === formSteps.length - 1) {
    renderOnboardingReview();
  }
}

function getStepFields(stepIndex) {
  return [...formSteps[stepIndex].querySelectorAll("input, select, textarea")];
}

function validateStep(stepIndex) {
  const fields = getStepFields(stepIndex);
  let isValid = true;

  fields.forEach((field) => {
    const value = field.value.trim();
    const fieldIsValid = field.type === "email" ? /\S+@\S+\.\S+/.test(value) : Boolean(value);

    field.classList.toggle("is-invalid", !fieldIsValid);
    if (!fieldIsValid) {
      isValid = false;
    }
  });

  formFeedback.textContent = isValid ? "" : "Please complete the highlighted fields before continuing.";
  return isValid;
}

function renderOnboardingReview() {
  const formData = new FormData(onboardingForm);
  reviewCard.innerHTML = `
    <div><strong>${formData.get("brandName") || "Brand name"}</strong></div>
    <div>${formData.get("category") || "Category"} in ${formData.get("area") || "Neighborhood"}</div>
    <div>${formData.get("description") || "Description will appear here."}</div>
    <div>${formData.get("pickup") || "Pickup details"} | ${formData.get("highlight") || "Highlight"}</div>
    <div>${formData.get("contactName") || "Contact"} | ${formData.get("email") || "Email"}</div>
    <div>${formData.get("link") || "Link"}</div>
  `;
}

function toggleSaved(brandId) {
  if (savedBrandIds.has(brandId)) {
    savedBrandIds.delete(brandId);
  } else {
    savedBrandIds.add(brandId);
  }

  persistSavedBrandIds();

  const cardButton = cardsRow.querySelector(`[data-id="${brandId}"] .save-button`);
  const brand = getBrandById(brandId);

  if (cardButton) {
    updateButtonState(cardButton, brandId);
  }

  if (brand && brand.id === activeBrandId) {
    updateButtonState(detailSaveButton, brandId);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((chip) => chip.classList.toggle("is-active", chip === button));
    render();
  });
});

cardsRow.addEventListener("scroll", () => {
  if (scrollSyncFrame || activeView === "detail") {
    cancelAnimationFrame(scrollSyncFrame);
  }

  scrollSyncFrame = requestAnimationFrame(() => {
    const cards = [...cardsRow.querySelectorAll(".brand-card")];

    if (!cards.length || activeView === "detail") {
      return;
    }

    const rowRect = cardsRow.getBoundingClientRect();
    const isDesktop = window.matchMedia("(min-width: 1100px)").matches;
    const targetPoint = isDesktop
      ? rowRect.top + cardsRow.clientHeight * 0.2
      : rowRect.left + cardsRow.clientWidth * 0.4;

    let closestCard = cards[0];
    let smallestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardPoint = isDesktop ? rect.top : rect.left;
      const distance = Math.abs(cardPoint - targetPoint);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestCard = card;
      }
    });

    if (closestCard?.dataset.id && closestCard.dataset.id !== activeBrandId) {
      activeBrandId = closestCard.dataset.id;
      updateActiveState();
      renderDetail();
    }
  });
});

backButton.addEventListener("click", () => closeDetailView());
closeDetailButton.addEventListener("click", () => closeDetailView());
detailSaveButton.addEventListener("click", () => toggleSaved(activeBrandId));
openOnboardingButton.addEventListener("click", () => openOnboardingView());
detailOnboardingButton.addEventListener("click", () => openOnboardingView());
onboardingBackButton.addEventListener("click", () => closeOnboardingView());
prevStepButton.addEventListener("click", () => updateOnboardingStep(onboardingStep - 1));
nextStepButton.addEventListener("click", () => {
  if (validateStep(onboardingStep)) {
    updateOnboardingStep(onboardingStep + 1);
  }
});
onboardingForm.addEventListener("input", (event) => {
  if (event.target.matches("input, select, textarea")) {
    event.target.classList.remove("is-invalid");
    if (onboardingStep === formSteps.length - 1) {
      renderOnboardingReview();
    }
  }
});
onboardingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateStep(onboardingStep)) {
    return;
  }

  const formData = new FormData(onboardingForm);
  const brandName = formData.get("brandName");
  formFeedback.textContent = `${brandName} has been submitted for review.`;
  setTimeout(() => {
    onboardingForm.reset();
    updateOnboardingStep(0);
    formFeedback.textContent = "";
    closeOnboardingView();
  }, 1000);
});
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  setInstallBannerDismissed(false);
  updateInstallCtas();
});

installButton.addEventListener("click", () => triggerInstallPrompt());
installBannerButton.addEventListener("click", () => triggerInstallPrompt());
dismissInstallBannerButton.addEventListener("click", () => {
  setInstallBannerDismissed(true);
  updateInstallCtas();
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetView = item.dataset.targetView;

    if (targetView === "home") {
      activeView = "home";
      applyViewState();
      scrollActiveCardIntoView();
      return;
    }

    if (targetView === "detail") {
      openDetailView(activeBrandId, false);
      return;
    }

    if (targetView === "onboarding") {
      openOnboardingView();
    }
  });
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  setInstallBannerDismissed(true);
  updateInstallCtas();
});

visitButton.addEventListener("click", () => {
  const brand = getBrandById(activeBrandId);
  if (!brand) {
    return;
  }

  alert(`${brand.name}: ${brand.pickup}`);
});

window.addEventListener("popstate", () => {
  if (location.hash.startsWith("#brand-")) {
    const brandId = location.hash.replace("#brand-", "");
    setActiveBrand(brandId);
    openDetailView(brandId, false);
    return;
  }

  closeDetailView(true);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}

render();
applyViewState();
updateOnboardingStep(0);
showSplashScreen();
updateInstallCtas();
