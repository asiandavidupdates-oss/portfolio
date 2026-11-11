// Add your public social profile URLs here before publishing to GitHub Pages.
const socialLinks = {
  facebook: "",
  youtube: "",
  tiktok: "",
  instagram: ""
};

const grid = document.querySelector("#project-grid");
const emptyState = document.querySelector("#empty-state");
const projectDialog = document.querySelector("#project-dialog");
const socialDialog = document.querySelector("#social-dialog");
let currentFilter = "all";

document.querySelector("#year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    filterProjects();
  });
});

function filterProjects() {
  let visible = 0;
  grid.querySelectorAll(".project-card").forEach(card => {
    const show = currentFilter === "all" || card.dataset.category === currentFilter;
    card.hidden = !show;
    if (show) visible++;
  });
  emptyState.hidden = visible !== 0;
}

document.querySelector("#open-manager").addEventListener("click", () => projectDialog.showModal());
document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
});
[projectDialog, socialDialog].forEach(dialog => dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
}));

function makeProjectCard(project, localPreview) {
  const card = document.createElement("article");
  card.className = "project-card added-project";
  card.dataset.category = project.category;
  const visual = document.createElement("div");
  visual.className = "project-visual";
  const label = document.createElement("span");
  label.className = "visual-label";
  label.textContent = project.category.toUpperCase();
  visual.append(label);
  if (localPreview && localPreview.type.startsWith("image/")) {
    const img = document.createElement("img"); img.src = localPreview.data; img.alt = project.title; visual.append(img);
  } else if (localPreview && localPreview.type.startsWith("video/")) {
    const video = document.createElement("video"); video.src = localPreview.data; video.controls = true; visual.append(video);
  } else {
    const icon = document.createElement("div"); icon.className = "file-icon"; icon.textContent = project.url ? "↗" : "＋"; visual.append(icon);
  }
  const info = document.createElement("div"); info.className = "project-info";
  const titleWrap = document.createElement("div");
  const type = document.createElement("span"); type.className = "project-type"; type.textContent = project.category.toUpperCase();
  const title = document.createElement("h3"); title.textContent = project.title;
  titleWrap.append(type, title);
  const arrow = document.createElement("span"); arrow.className = "project-arrow"; arrow.textContent = "↗";
  info.append(titleWrap, arrow);
  card.append(visual, info);
  if (project.description) { const desc = document.createElement("p"); desc.className = "project-desc"; desc.textContent = project.description; card.append(desc); }
  if (project.url) { const link = document.createElement("a"); link.className = "project-link"; link.href = project.url; link.target = "_blank"; link.rel = "noopener"; link.textContent = "View project ↗"; card.append(link); }
  return card;
}

document.querySelector("#project-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const project = {
    title: form.title.value.trim(),
    category: form.category.value,
    description: form.description.value.trim(),
    url: form.url.value.trim()
  };
  const file = form.file.files[0];
  if (file && file.size > 8 * 1024 * 1024) {
    alert("Please choose a file smaller than 8 MB for the temporary browser preview.");
    return;
  }
  const add = preview => {
    const card = makeProjectCard(project, preview);
    grid.prepend(card);
    projectDialog.close();
    form.reset();
    currentFilter = "all";
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.filter === "all"));
    filterProjects();
  };
  if (file) {
    const reader = new FileReader();
    reader.onload = () => add({data: reader.result, type: file.type});
    reader.readAsDataURL(file);
  } else {
    add(null);
  }
});

function applySocialLinks(values) {
  document.querySelectorAll("[data-social]").forEach(link => {
    const url = values[link.dataset.social] || "";
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.style.opacity = "1";
    } else {
      link.href = "#";
      link.removeAttribute("target");
      link.style.opacity = ".45";
    }
  });
}
applySocialLinks(socialLinks);
document.querySelector("#edit-socials").addEventListener("click", () => {
  const form = document.querySelector("#social-form");
  Object.keys(socialLinks).forEach(key => form.elements[key].value = socialLinks[key]);
  socialDialog.showModal();
});
document.querySelector("#social-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const updated = {};
  Object.keys(socialLinks).forEach(key => updated[key] = form.elements[key].value.trim());
  applySocialLinks(updated);
  socialDialog.close();
  alert("Social links updated in this browser. Also update socialLinks in script.js before publishing.");
});