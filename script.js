// ---------- Simple hash router ----------
const ROUTES = ["home","about","members","media","resources","newsletter","submissions"];

function currentRoute() {
  const hash = (location.hash || "#home").replace("#", "").trim();
  return ROUTES.includes(hash) ? hash : "home";
}

function showRoute(route) {
  document.querySelectorAll("[data-route]").forEach(sec => {
    sec.hidden = sec.dataset.route !== route;
  });

  document.querySelectorAll(".site-nav a").forEach(a => {
    const target = a.getAttribute("href").replace("#", "");
    a.classList.toggle("active", target === route);
  });

  // Close mobile nav after navigation
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  if (nav && toggle) {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  // Move focus for accessibility
  const main = document.getElementById("main");
  if (main) main.focus?.();
}

window.addEventListener("hashchange", () => showRoute(currentRoute()));
document.addEventListener("DOMContentLoaded", () => showRoute(currentRoute()));

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById("navToggle");
const drawer = document.getElementById("acaDrawer");
const navClose = document.getElementById("navClose");
const navBackdrop = document.getElementById("navBackdrop");

function openDrawer(){
  drawer.hidden = false;
  drawer.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
}

function closeDrawer(){
  drawer.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  // wait for slide animation then hide
  setTimeout(() => { drawer.hidden = true; }, 200);
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
}

if (navClose) navClose.addEventListener("click", closeDrawer);
if (navBackdrop) navBackdrop.addEventListener("click", closeDrawer);

if (drawer) {
  drawer.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeDrawer();
  });
}

// ---------- Data (edit these first) ----------
const MEMBERS = [
  { name: "Your Name", role: "Co-Lead", pronouns: "she/her", bio: "Organizing around civic education and campus engagement." },
  { name: "Member Two", role: "Media", pronouns: "they/them", bio: "Short-form explainers and content strategy." },
  { name: "Member Three", role: "Mutual Aid", pronouns: "he/him", bio: "Resource curation and community support." }
];

const MEDIA = [
  // Embeds vary per platform. You can replace with real embed URLs or set embedUrl=null for link-only.
  {
    title: "Voter Registration: 30 seconds",
    platform: "YouTube Shorts",
    embedUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ", // replace with a Shorts embed URL
    linkUrl: "https://www.youtube.com/"
  },
  {
    title: "Local Issue Explainer",
    platform: "TikTok",
    embedUrl: null,
    linkUrl: "https://www.tiktok.com/"
  }
];

const RESOURCES = [
  { title: "Know Your Rights Guide", description: "Quick reference for interacting with authorities and protecting your rights.", tags: ["Legal", "Education"], url: "https://www.aclu.org/" },
  { title: "Mutual Aid Directory", description: "Community-sourced mutual aid links and support networks.", tags: ["Mutual Aid"], url: "https://mutualaiddirectory.org/" },
  { title: "Voting Info (National)", description: "General voting education and election resources.", tags: ["Voting", "Education"], url: "https://www.vote.org/" }
];

const NEWSLETTER_ARCHIVE = [
  { title: "Issue 3", date: "January 2025", url: "https://www.canva.com/design/DAGY7sd2YBg/5HiFR8tAef5rTHS0qdo16Q/view?utm_content=DAGY7sd2YBg&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h3911f6647a" },
  { title: "Issue 2", date: "November 2024", url: "https://www.canva.com/design/DAGQTLJfqP4/2fTKh_i0ooqMbHrnv7Pxvw/view?utm_content=DAGQTLJfqP4&utm_campaign=designshare&utm_medium=link&utm_source=editor" },
  { title: "Issue 1", date: "October 2024", url: "https://www.canva.com/design/DAGOb3of47I/CQu-S4zDVGMjsKov1pN-3w/view?utm_content=DAGOb3of47I&utm_campaign=designshare&utm_medium=link&utm_source=editor" }
];

// ---------- Members render ----------
function initials(name) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function renderMembers(filterText = "") {
  const grid = document.getElementById("membersGrid");
  if (!grid) return;

  const q = filterText.trim().toLowerCase();
  const filtered = MEMBERS.filter(m =>
    (m.name + " " + m.role + " " + (m.bio || "")).toLowerCase().includes(q)
  );

  grid.innerHTML = filtered.map(m => `
    <div class="card member-card">
      <div class="avatar" aria-hidden="true">${initials(m.name)}</div>
      <div class="member-meta">
        <h4>${escapeHtml(m.name)}</h4>
        <p class="role">${escapeHtml(m.role)}${m.pronouns ? ` · <span class="muted">${escapeHtml(m.pronouns)}</span>` : ""}</p>
        <p>${escapeHtml(m.bio || "")}</p>
      </div>
    </div>
  `).join("");

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="card"><p class="muted">No members match your search.</p></div>`;
  }
}

document.getElementById("memberSearch")?.addEventListener("input", (e) => {
  renderMembers(e.target.value);
});

// ---------- Media render ----------
function renderMedia() {
  const grid = document.getElementById("mediaGrid");
  if (!grid) return;

  grid.innerHTML = MEDIA.map(item => {
    const safeTitle = escapeHtml(item.title);
    const safePlatform = escapeHtml(item.platform);

    const embed = item.embedUrl? `<iframe title="${safeTitle}" src="${escapeAttr(item.embedUrl)}" allowfullscreen loading="lazy"></iframe>`
      : `<div class="list-item">
           <h4>${safeTitle}</h4>
           <p class="muted">Embed unavailable — use the link below.</p>
         </div>`;

    const link = item.linkUrl? `<a class="btn" href="${escapeAttr(item.linkUrl)}" target="_blank" rel="noopener">Open</a>`
      : "";

    return `
      <div class="card media-card">
        <div class="media-top">
          <div>
            <h4>${safeTitle}</h4>
            <span class="platform">${safePlatform}</span>
          </div>
          ${link}
        </div>
        ${embed}
      </div>
    `;
  }).join("");
}

// ---------- Resources render + filter ----------
function uniqueTags(resources) {
  const set = new Set();
  resources.forEach(r => (r.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a,b) => a.localeCompare(b));
}

function renderResourceTagOptions() {
  const select = document.getElementById("resourceTag");
  if (!select) return;
  const tags = uniqueTags(RESOURCES);

  // keep "All"
  const existing = Array.from(select.options).map(o => o.value);
  tags.forEach(t => {
    if (!existing.includes(t)) {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      select.appendChild(opt);
    }
  });
}

function renderResources() {
  const list = document.getElementById("resourcesList");
  const qInput = document.getElementById("resourceSearch");
  const tagSelect = document.getElementById("resourceTag");
  if (!list || !qInput || !tagSelect) return;

  const q = qInput.value.trim().toLowerCase();
  const tag = tagSelect.value;

  const filtered = RESOURCES.filter(r => {
    const matchesQuery =
      (r.title + " " + r.description + " " + (r.tags || []).join(" "))
        .toLowerCase()
        .includes(q);

    const matchesTag = tag === "all" ? true : (r.tags || []).includes(tag);
    return matchesQuery && matchesTag;
  });

  list.innerHTML = filtered.map(r => {
    const badges = (r.tags || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("");
    const link = r.url? `<a class="btn" href="${escapeAttr(r.url)}" target="_blank" rel="noopener">Visit</a>`
      : "";
    return `
      <div class="list-item">
        <h4>${escapeHtml(r.title)}</h4>
        <p>${escapeHtml(r.description)}</p>
        <div class="meta">
          ${badges}
          ${link}
        </div>
      </div>
    `;
  }).join("");

  if (filtered.length === 0) {
    list.innerHTML = `<div class="list-item"><p class="muted">No resources match your filters.</p></div>`;
  }
}

document.getElementById("resourceSearch")?.addEventListener("input", renderResources);
document.getElementById("resourceTag")?.addEventListener("change", renderResources);

// ---------- Newsletter ----------
const NEWSLETTER_ENDPOINT = "https://script.google.com/macros/s/AKfycbyqMuzbYCxV6GuDYO28Ko_WM-w-ZwCsUCavOw3UTzLCUf7TT4N5E6wzw81K2xzSS37waw/exec";

document.getElementById("newsletterForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("newsletterMsg");
  msg.textContent = "Submitting...";

  const email = new FormData(e.target).get("email");

  try {
    const res = await fetch(NEWSLETTER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ email })
    });

    const data = await res.json().catch(() => ({}));

    if (data.ok) {
      msg.textContent = "Subscribed! 🎉";
      e.target.reset();
    } else {
      msg.textContent = "Something went wrong. Try again.";
      console.error("Newsletter error:", data);
    }
  } catch (err) {
    msg.textContent = "Network error. Try again.";
    console.error(err);
  }
});

// ---------- Submissions (localStorage preview) ----------
const SUBMISSIONS_KEY = "acapower_submissions_v1";

function loadSubmissions() {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSubmissions(items) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(items));
}

function renderSubmissionsFeed() {
  const el = document.getElementById("submissionsFeed");
  if (!el) return;

  const items = loadSubmissions().slice().reverse(); // newest first
  if (items.length === 0) {
    el.innerHTML = `<div class="list-item"><p class="muted">No submissions yet.</p></div>`;
    return;
  }

  el.innerHTML = items.map(s => `
    <div class="list-item">
      <h4>${escapeHtml(s.type)} ${s.name ? `· <span class="muted">${escapeHtml(s.name)}</span>` : ""}</h4>
      <p>${escapeHtml(s.message)}</p>
      <div class="meta">
        <span class="badge">${escapeHtml(new Date(s.createdAt).toLocaleString())}</span>
        ${s.link ? `<a class="btn" href="${escapeAttr(s.link)}" target="_blank" rel="noopener">Open link</a>` : ""}
      </div>
    </div>
  `).join("");
}

document.getElementById("submissionForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("submissionMsg");

  const fd = new FormData(e.target);
  const submission = {
    name: String(fd.get("name") || "").trim(),
    type: String(fd.get("type") || "Other").trim(),
    link: String(fd.get("link") || "").trim(),
    message: String(fd.get("message") || "").trim(),
    createdAt: Date.now()
  };

  if (!submission.message) {
    msgEl.textContent = "Please add a message.";
    return;
  }

  const items = loadSubmissions();
  items.push(submission);
  saveSubmissions(items);

  msgEl.textContent = "Submitted (stored locally). Thanks!";
  e.target.reset();
  renderSubmissionsFeed();
});

// ---------- Utilities ----------
function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function escapeAttr(str) {
  // same as HTML escape for our use
  return escapeHtml(str);
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  // Render everything once
  renderMembers("");
  renderMedia();
  renderResourceTagOptions();
  renderResources();
  renderNewsletterArchive();
  renderSubmissionsFeed();
});
