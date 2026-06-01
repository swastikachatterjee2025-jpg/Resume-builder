const form = document.getElementById("resumeForm");
const preview = document.getElementById("resumePreview");
const atsScoreEl = document.getElementById("atsScore");
const scoreFill = document.getElementById("scoreFill");
const qualityList = document.getElementById("qualityList");
const photoInput = document.getElementById("photoInput");
const fieldSelect = document.getElementById("careerField");

let photoData = "";

const fieldSkills = {
  "Software Engineering": "JavaScript, TypeScript, React, Node.js, REST APIs, Git, SQL, Testing, Agile",
  "Data Science": "Python, SQL, Machine Learning, Pandas, NumPy, Tableau, Statistics, Data Visualization",
  Marketing: "SEO, Content Strategy, Campaign Analytics, Social Media, Copywriting, CRM, Market Research",
  Finance: "Financial Modeling, Excel, Valuation, Budgeting, Risk Analysis, Power BI, Accounting",
  Design: "Figma, Design Systems, UX Research, Wireframing, Prototyping, Accessibility, Visual Design",
  "Human Resources": "Recruitment, Onboarding, HR Analytics, Employee Engagement, Conflict Resolution, Payroll",
};

const sampleContent = {
  objective:
    "Motivated final-year student seeking an entry-level role where I can apply analytical thinking, practical project experience, and strong collaboration skills to solve meaningful business problems.",
  about:
    "Detail-oriented and curious learner with hands-on experience in academic projects, internships, and cross-functional teamwork. Comfortable turning ambiguous requirements into structured, measurable outcomes.",
  responsibilities:
    "Improved user-facing workflows, collaborated with mentors and peers, documented implementation decisions, and delivered reliable features within weekly sprint goals.",
  projectDescription:
    "Designed and developed a full-stack solution with secure data handling, responsive UI, reusable components, and measurable performance improvements for end users.",
};

function getData() {
  return Object.fromEntries(new FormData(form).entries());
}

function asList(value) {
  return (value || "")
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function section(title, body) {
  return body ? `<section><h3>${title}</h3>${body}</section>` : "";
}

function renderPreview() {
  const data = getData();
  const name = data.fullName || "Your Name";
  const role = data.position || `${data.careerField || "Future"} Candidate`;
  const techSkills = asList(data.technicalSkills);
  const softSkills = asList(data.softSkills);
  const languages = asList(data.languages);
  const photo = photoData || "";

  preview.innerHTML = `
    <div class="resume-head">
      <img class="resume-photo" alt="" src="${photo || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%23edf7ff'/%3E%3Ccircle cx='60' cy='47' r='22' fill='%23b8a7ff'/%3E%3Cpath d='M24 108c8-28 64-28 72 0' fill='%2367b8ff'/%3E%3C/svg%3E"}" />
      <div>
        <h2>${escapeHtml(name)}</h2>
        <p><strong>${escapeHtml(role)}</strong></p>
        <div class="resume-contact">
          ${[data.email, data.phone, data.address, data.linkedin, data.github, data.portfolio]
            .filter(Boolean)
            .map((item) => `<span>${escapeHtml(item)}</span>`)
            .join("")}
        </div>
      </div>
    </div>
    <div class="resume-grid">
      <div>
        ${section("Professional Summary", `<p>${escapeHtml(data.about || data.objective || sampleContent.about)}</p>`)}
        ${section("Experience", data.company || data.position || data.responsibilities ? `
          <p><strong>${escapeHtml(data.position || "Role")}</strong> · ${escapeHtml(data.company || "Company")}</p>
          <p>${escapeHtml(data.duration || "Duration")}</p>
          <ul><li>${escapeHtml(data.responsibilities || sampleContent.responsibilities)}</li></ul>
        ` : "")}
        ${section("Projects", data.projectTitle || data.projectDescription ? `
          <p><strong>${escapeHtml(data.projectTitle || "Featured Project")}</strong></p>
          <p>${escapeHtml(data.projectDescription || sampleContent.projectDescription)}</p>
          <p>${escapeHtml(data.technologies || "")}</p>
          <p>${escapeHtml(data.projectGithub || "")}</p>
        ` : "")}
        ${section("Achievements", [data.awards, data.competitions, data.leadership].filter(Boolean).map((x) => `<p>${escapeHtml(x)}</p>`).join(""))}
      </div>
      <div>
        ${section("Education", data.institution || data.degree ? `
          <p><strong>${escapeHtml(data.degree || "Degree")}</strong></p>
          <p>${escapeHtml(data.institution || "Institution")}</p>
          <p>${escapeHtml(data.branch || "")} ${data.cgpa ? `· ${escapeHtml(data.cgpa)}` : ""}</p>
          <p>${escapeHtml(data.startYear || "")} ${data.endYear ? `- ${escapeHtml(data.endYear)}` : ""}</p>
        ` : "")}
        ${section("Technical Skills", techSkills.length ? `<div class="pill-list">${techSkills.map((x) => `<span>${escapeHtml(x)}</span>`).join("")}</div>` : "")}
        ${section("Soft Skills", softSkills.length ? `<p>${softSkills.map(escapeHtml).join(", ")}</p>` : "")}
        ${section("Languages", languages.length ? `<p>${languages.map(escapeHtml).join(", ")}</p>` : "")}
        ${section("Certifications", data.certification ? `<p><strong>${escapeHtml(data.certification)}</strong></p><p>${escapeHtml(data.issuer || "")} ${escapeHtml(data.certYear || "")}</p>` : "")}
        ${section("Extra Activities", [data.clubs, data.volunteering, data.workshops].filter(Boolean).map((x) => `<p>${escapeHtml(x)}</p>`).join(""))}
      </div>
    </div>
  `;

  updateScore(data);
}

function updateScore(data) {
  const checks = [
    { ok: data.fullName && data.email && data.phone, pass: "Contact details included", fail: "Missing Contact Details Alert" },
    { ok: (data.technicalSkills || "").length > 18, pass: "Core skills included", fail: "Missing Skills Alert" },
    { ok: (data.about || data.objective || "").length > 80, pass: "Strong professional summary", fail: "Weak Summary Alert" },
    { ok: data.institution && data.degree && data.projectTitle, pass: "Key sections completed", fail: "Incomplete Sections Alert" },
    { ok: data.responsibilities || data.projectDescription, pass: "Evidence-backed experience or project", fail: "Experience or project evidence missing" },
    { ok: data.linkedin || data.github || data.portfolio, pass: "Professional profile link included", fail: "Professional profile link missing" },
  ];
  const score = Math.min(100, Math.round(checks.filter((check) => check.ok).length / checks.length * 100));
  atsScoreEl.textContent = score;
  scoreFill.style.width = `${score}%`;
  scoreFill.style.background = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  qualityList.innerHTML = checks
    .map((check) => `
      <div class="quality-item">
        <i data-lucide="${check.ok ? "check-circle-2" : "alert-circle"}"></i>
        <span>${check.ok ? check.pass : check.fail}</span>
      </div>
    `)
    .join("");
  lucide.createIcons();
}

function fillIfEmpty(name, value) {
  const input = form.elements[name];
  if (input && !input.value.trim()) input.value = value;
}

function rewriteSummary() {
  const data = getData();
  const field = data.careerField || "target";
  form.elements.objective.value = `Results-driven ${field.toLowerCase()} candidate focused on building reliable solutions, learning quickly, and contributing measurable value from day one.`;
  form.elements.about.value = `Emerging ${field.toLowerCase()} professional with strong fundamentals, practical project experience, and a collaborative approach to problem solving. Skilled at translating requirements into polished outcomes while maintaining clear communication and attention to detail.`;
}

function improveProject() {
  const title = form.elements.projectTitle.value || "Selected project";
  form.elements.projectDescription.value = `${title} demonstrates end-to-end ownership through structured planning, thoughtful UI decisions, robust implementation, and clear documentation. The project highlights problem solving, technical depth, and an ability to create user-focused outcomes.`;
}

form.addEventListener("input", renderPreview);
form.addEventListener("change", renderPreview);

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    photoData = reader.result;
    renderPreview();
  };
  reader.readAsDataURL(file);
});

document.getElementById("generateAI").addEventListener("click", () => {
  rewriteSummary();
  improveProject();
  fillIfEmpty("technicalSkills", fieldSkills[fieldSelect.value]);
  fillIfEmpty("softSkills", "Communication, Leadership, Teamwork, Time Management, Adaptability, Critical Thinking");
  fillIfEmpty("responsibilities", sampleContent.responsibilities);
  renderPreview();
});

document.getElementById("suggestSkills").addEventListener("click", () => {
  form.elements.technicalSkills.value = fieldSkills[fieldSelect.value];
  renderPreview();
});

function selectTemplate(template) {
  document.querySelectorAll("[data-template]").forEach((item) => {
    const isActive = item.dataset.template === template;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  preview.className = `resume-preview template-${template}`;
}

document.querySelectorAll(".template-chip, .template-card").forEach((control) => {
  control.addEventListener("click", () => selectTemplate(control.dataset.template));
});

document.getElementById("downloadPDF").addEventListener("click", () => window.print());
document.getElementById("printResume").addEventListener("click", () => window.print());
document.getElementById("downloadDOCX").addEventListener("click", () => {
  const blob = createDocx(preview.innerText || "AI Resume Builder Resume");
  downloadBlob(blob, "ai-resume-builder-resume.docx");
});

document.getElementById("mobileToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("formStatus").textContent = "Thanks. Your message has been captured locally for this demo.";
  event.currentTarget.reset();
});

function animateCounters() {
  document.querySelectorAll("[data-counter]").forEach((counter) => {
    const target = Number(counter.dataset.counter);
    const duration = 1300;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function createDocx(text) {
  const paragraphs = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<w:p><w:r><w:t>${escapeXml(line)}</w:t></w:r></w:p>`)
    .join("");
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    "word/document.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr></w:body></w:document>`,
  };
  return new Blob([zipStore(files)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function escapeXml(value = "") {
  return value.replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  }[char]));
}

function zipStore(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const local = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    localParts.push(local, data);

    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralParts.push(central);
    offset += local.length + data.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, Object.keys(files).length, true);
  endView.setUint16(10, Object.keys(files).length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  return new Blob([...localParts, ...centralParts, end]);
}

function crc32(bytes) {
  let crc = -1;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let c = index;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

lucide.createIcons();
renderPreview();
animateCounters();
