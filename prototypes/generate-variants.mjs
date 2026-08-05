import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL(".", import.meta.url).pathname;

const institutions = [
  {
    folder: "school",
    name: "Shapla Grove",
    formal: "Shapla Grove School & College",
    kind: "School & College",
    mark: "শ",
    peoplePage: "faculty.html",
    peopleLabel: "Faculty",
    peopleTitle: "Teachers who notice how each student learns.",
    descriptor: "English-version national curriculum in Dhanmondi",
    hero: "A complete education from Playgroup to Class XII.",
    summary: "Strong academics, attentive teaching, and a safe campus help every student progress with confidence.",
    image: "school-campus-hero.png",
    imageAlt: "Students and a teacher walking through the Shapla Grove courtyard",
    storage: "shaplaGrovePrototype",
    phone: "+880 1712 345 678",
    email: "office@shaplagrove.edu.bd",
    primaryAction: "Admission enquiry",
    programLabel: "Academic pathway",
    programs: [
      ["Early years", "Playgroup-KG", "Language, number sense, movement, and guided play."],
      ["Primary", "Classes I-V", "Clear foundations in language, mathematics, science, and society."],
      ["Secondary", "Classes VI-X", "Deeper subject work, practical science, and SSC preparation."],
      ["Higher secondary", "Classes XI-XII", "Focused streams, university guidance, and HSC preparation."]
    ],
    people: [
      ["Hasan Ahmed", "Head of Secondary", "Mathematics"],
      ["Nusrat Islam", "Senior Teacher", "Bangla and Literature"],
      ["Arif Khan", "Science Coordinator", "Physics"],
      ["Farzana Sultana", "Head of Primary", "Early Learning"],
      ["Rafiul Mahmud", "Senior Teacher", "English"],
      ["Tahmina Jahan", "Wellbeing Lead", "Social Science"]
    ]
  },
  {
    folder: "madrasha",
    name: "Noorul Ilm",
    formal: "Noorul Ilm Madrasha & Islamic Academy",
    kind: "Madrasha & Islamic Academy",
    mark: "ن",
    peoplePage: "asatizah.html",
    peopleLabel: "Asatizah",
    peopleTitle: "Guidance grounded in knowledge and good character.",
    descriptor: "Qur'anic learning and national academics in Dhaka",
    hero: "Knowledge for this life. Character for the next.",
    summary: "Qur'anic learning, academic discipline, and thoughtful guidance support every stage from Maktab to Alim.",
    image: "noorul-ilm-campus.png",
    imageAlt: "The courtyard and prayer hall at Noorul Ilm Madrasha",
    storage: "noorulIlmMadrashaPrototype",
    phone: "+880 1712 345 678",
    email: "office@noorulilm.edu.bd",
    primaryAction: "Admission enquiry",
    programLabel: "Learning journey",
    programs: [
      ["Maktab", "Foundation", "Arabic letters, daily duas, adab, and joyful Qur'an reading."],
      ["Nazera", "Fluent recitation", "Accurate recitation with tajweed and close teacher guidance."],
      ["Hifz", "Memorisation", "A structured memorisation plan with revision and wellbeing support."],
      ["Dakhil and Alim", "Integrated studies", "Islamic studies alongside a complete national academic programme."]
    ],
    people: [
      ["Mufti Abdullah Faruqi", "Principal", "Fiqh and Hadith"],
      ["Qari Mahmudul Hasan", "Head of Hifz", "Hifz and Tajweed"],
      ["Ustadha Sumaiya Rahman", "Academic Coordinator", "Arabic Language"],
      ["Maulana Ibrahim Khalil", "Senior Ustad", "Tafsir"],
      ["Ustadha Mariam Akter", "Senior Teacher", "English"],
      ["Md. Zakir Hossain", "Science Teacher", "General Science"]
    ]
  },
  {
    folder: "coacing",
    name: "Vertex",
    formal: "Vertex Coaching Academy",
    kind: "Coaching Academy",
    mark: "V",
    peoplePage: "mentors.html",
    peopleLabel: "Mentors",
    peopleTitle: "Subject experts who make the next step clear.",
    descriptor: "Focused preparation for SSC, HSC, and admission tests",
    hero: "Turn deliberate practice into visible progress.",
    summary: "Focused teaching, useful feedback, and a clear study plan help students prepare without guesswork.",
    image: "vertex-classroom.png",
    imageAlt: "A focused class in progress at Vertex Coaching Academy",
    storage: "vertexCoachingPrototype",
    phone: "+880 1712 345 678",
    email: "hello@vertexcoaching.bd",
    primaryAction: "Find a batch",
    programLabel: "Course tracks",
    programs: [
      ["SSC foundation", "Classes IX-X", "Concept repair, board-pattern practice, and weekly feedback."],
      ["HSC science", "Classes XI-XII", "Structured lessons, problem sessions, and exam preparation."],
      ["University admission", "After HSC", "Timed practice and focused review for public university tests."],
      ["Medical and engineering", "Admission", "High-intensity subject practice with mentor-led corrections."]
    ],
    people: [
      ["Tanvir Hossain", "Lead Mentor", "Physics"],
      ["Sadia Karim", "Senior Mentor", "Chemistry"],
      ["Mahin Chowdhury", "Admissions Lead", "Mathematics"],
      ["Nabila Sultana", "Senior Mentor", "Biology"],
      ["Fahim Rahman", "Mentor", "English"],
      ["Rahat Kabir", "Practice Lead", "ICT"]
    ]
  }
];

const variants = {
  2: { name: "Fieldbook", bg: "#f3f0e8", ink: "#17201a", panel: "#fffdf7", radius: "rounded-none" },
  3: { name: "Night School", bg: "#111412", ink: "#edf0e8", panel: "#1a1e1b", radius: "rounded-2xl" },
  4: { name: "Common Room", bg: "#f5f7fb", ink: "#182033", panel: "#ffffff", radius: "rounded-[28px]" },
  5: { name: "Ledger", bg: "#f7f7f4", ink: "#20211f", panel: "#eeeeea", radius: "rounded-lg" }
};

const accents = {
  school: { 2: "#a63d2f", 3: "#d7f26d", 4: "#3e63dd", 5: "#b42b51" },
  madrasha: { 2: "#176b52", 3: "#78d6b0", 4: "#16866f", 5: "#756328" },
  coacing: { 2: "#c55324", 3: "#ffb45a", 4: "#e24d72", 5: "#1f6f78" }
};

const notices = [
  ["24 Jul 2026", "Examination", "Half-yearly examination schedule", "Schedule and room allocation for the upcoming assessment period."],
  ["18 Jul 2026", "General", "Campus closure notice", "Office hours and class arrangements for the public holiday."],
  ["12 Jul 2026", "Event", "Student programme registration", "Registration details, eligibility, and the final submission date."],
  ["05 Jul 2026", "Families", "Guardian meeting schedule", "Appointments and meeting rooms for the next family consultation day."]
];

const results = [
  ["28 Jun 2026", "Term result", "First term results for middle grades"],
  ["25 Jun 2026", "Term result", "First term results for primary grades"],
  ["14 May 2026", "Assessment", "Model test results and review schedule"]
];

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(part => part[0]).join("");
}

function head(inst, version, title) {
  const accent = accents[inst.folder][version];
  const theme = variants[version];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${inst.formal}. Admissions, programmes, educators, notices, and results.">
  <title>${title} | ${inst.formal}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:'${accent}',canvas:'${theme.bg}',ink:'${theme.ink}',panel:'${theme.panel}'},fontFamily:{sans:['Aptos','Segoe UI','system-ui','sans-serif'],display:['Arial Narrow','Aptos Display','Segoe UI','sans-serif']}}}}</script>
  <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
  <style>
    html{scroll-behavior:smooth} body{background:${theme.bg};color:${theme.ink}}
    ::selection{background:${accent};color:${version === 3 ? "#101310" : "#fff"}}
    .reveal{animation:rise .65s cubic-bezier(.16,1,.3,1) both}.reveal-2{animation-delay:.12s}.reveal-3{animation-delay:.22s}
    @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.reveal,.reveal-2,.reveal-3{animation:none}}
    .iconify{width:1.2em;height:1.2em}
  </style>
</head>`;
}

function header(inst, version, active = "home") {
  const links = [
    ["home", "Home", "index.html"],
    ["programmes", inst.programLabel, "index.html#programmes"],
    ["people", inst.peopleLabel, inst.peoplePage],
    ["notices", "Notices", "notices.html"]
  ];
  const nav = links.map(([key, label, href]) => `<a class="${active === key ? "text-brand" : "opacity-70 hover:opacity-100"} whitespace-nowrap transition" href="${href}">${label}</a>`).join("");
  const brand = `<a href="index.html" class="flex items-center gap-3" aria-label="${inst.name} home"><span class="grid size-11 place-items-center bg-brand text-lg font-bold text-white ${version === 4 ? "rounded-2xl rotate-3" : version === 3 ? "rounded-xl text-[#111412]" : version === 5 ? "rounded-full" : ""}">${inst.mark}</span><span><strong class="block text-lg leading-none">${inst.name}</strong><small class="mt-1 block text-[11px] opacity-60">${inst.kind}</small></span></a>`;
  if (version === 3) {
    return `<aside class="border-white/10 bg-canvas/95 px-5 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-72 lg:flex-col lg:border-r lg:px-8 lg:py-8">
      <div class="flex items-center justify-between">${brand}<button class="js-menu p-2 lg:hidden" aria-label="Open navigation"><span class="iconify" data-icon="ph:list"></span></button></div>
      <nav class="js-nav hidden flex-col gap-5 pt-8 text-sm lg:flex lg:flex-1 lg:justify-center" aria-label="Primary">${nav}</nav>
      <div class="hidden border-t border-white/10 pt-5 lg:block"><a class="flex items-center justify-between text-sm" href="admin.html">Staff workspace <span class="iconify" data-icon="ph:arrow-up-right"></span></a></div>
    </aside>`;
  }
  if (version === 4) {
    return `<header class="sticky top-3 z-20 mx-auto mt-3 max-w-7xl px-4"><div class="rounded-[28px] border border-slate-200/80 bg-white/90 px-5 py-3 shadow-[0_12px_40px_rgba(45,60,90,.10)] backdrop-blur md:flex md:items-center md:justify-between">${brand}<button class="js-menu absolute right-8 top-5 p-2 md:hidden" aria-label="Open navigation"><span class="iconify" data-icon="ph:list"></span></button><nav class="js-nav hidden items-center gap-6 pt-4 text-sm font-semibold md:flex md:pt-0">${nav}<a class="rounded-full bg-ink px-5 py-2.5 text-white active:scale-[.98]" href="index.html#admissions">${inst.primaryAction}</a></nav></div></header>`;
  }
  if (version === 5) {
    return `<header class="border-b border-ink/15"><div class="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-10">${brand}<button class="js-menu p-2 md:hidden" aria-label="Open navigation"><span class="iconify" data-icon="ph:list"></span></button><nav class="js-nav hidden items-center gap-8 text-xs font-semibold uppercase tracking-[.12em] md:flex">${nav}<a href="admin.html" class="border-l border-ink/20 pl-8">Staff</a></nav></div></header>`;
  }
  return `<header class="border-b border-ink/15"><div class="mx-auto max-w-7xl px-5"><div class="flex items-center justify-between py-5">${brand}<button class="js-menu p-2 md:hidden" aria-label="Open navigation"><span class="iconify" data-icon="ph:list"></span></button><nav class="js-nav hidden items-center gap-7 text-sm font-semibold md:flex">${nav}<a class="border border-ink px-4 py-2 active:translate-y-px" href="admin.html">Staff login</a></nav></div></div></header>`;
}

function mobileNavFallback() {
  return `<script src="site.js"></script>`;
}

function footer(inst, version) {
  const rounded = variants[version].radius;
  return `<footer class="${version === 3 ? "border-white/10" : "border-ink/15"} border-t px-5 py-10 lg:px-10"><div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_.7fr_.7fr]">
    <div><div class="mb-4 flex items-center gap-3"><span class="grid size-10 place-items-center bg-brand font-bold text-white ${rounded}">${inst.mark}</span><strong>${inst.formal}</strong></div><p class="max-w-md text-sm opacity-65">${inst.summary}</p></div>
    <div class="grid content-start gap-2 text-sm"><strong class="mb-1">Explore</strong><a href="index.html#programmes">${inst.programLabel}</a><a href="${inst.peoplePage}">${inst.peopleLabel}</a><a href="notices.html">Notices and results</a></div>
    <address class="not-italic text-sm leading-7"><strong class="block">Contact</strong>12 Lakeview Road, Dhanmondi<br>Dhaka 1209<br><a href="tel:+8801712345678">${inst.phone}</a><br><a href="mailto:${inst.email}">${inst.email}</a></address>
  </div><p class="mx-auto mt-10 max-w-7xl text-xs opacity-50">© 2026 ${inst.formal}. Prototype website.</p></footer>`;
}

function programCards(inst, version) {
  const radius = variants[version].radius;
  return inst.programs.map((item, index) => `<article class="${version === 2 ? "border-t border-ink/25 py-6" : `bg-panel p-6 ${radius} ${version === 3 ? "border border-white/10" : "border border-ink/10"}`} ${version === 4 && index === 0 ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-10" : ""}"><div><span class="text-xs font-bold text-brand">${item[1]}</span><h3 class="mt-3 text-2xl font-bold">${item[0]}</h3></div><p class="mt-4 text-sm leading-6 opacity-65">${item[2]}</p></article>`).join("");
}

function indexV2(inst) {
  return `${head(inst, 2, "Home")}<body data-storage="${inst.storage}" class="font-sans antialiased">${header(inst, 2)}
  <main id="main">
    <section class="mx-auto grid min-h-[78dvh] max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-[1.05fr_.95fr] md:py-20">
      <div class="reveal"><p class="mb-5 text-xs font-bold uppercase tracking-[.16em] text-brand">${inst.descriptor}</p><h1 data-cms="heroTitle" class="max-w-3xl font-display text-5xl font-black leading-[.96] tracking-[-.045em] md:text-7xl">${inst.hero}</h1><p data-cms="heroSummary" class="mt-6 max-w-xl text-lg leading-8 opacity-70">${inst.summary}</p><div class="mt-8 flex flex-wrap gap-3"><a href="#admissions" class="bg-brand px-6 py-3 font-bold text-white active:translate-y-px">${inst.primaryAction}</a><a href="#programmes" class="border border-ink px-6 py-3 font-bold active:translate-y-px">See programmes</a></div></div>
      <figure class="reveal reveal-2 relative"><div class="absolute -left-4 -top-4 size-24 bg-brand"></div><img src="assets/${inst.image}" alt="${inst.imageAlt}" width="1200" height="900" class="relative aspect-[4/5] w-full object-cover grayscale-[15%]"><figcaption class="relative -mt-16 ml-8 max-w-xs bg-panel p-5 text-sm shadow-[8px_8px_0_${accents[inst.folder][2]}]">A focused place to learn, ask questions, and grow.</figcaption></figure>
    </section>
    <section class="border-y border-ink/15"><div class="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4"><div class="p-5 md:p-8"><strong class="text-2xl">2026-27</strong><span class="block text-xs opacity-60">Admissions</span></div><div class="border-l border-ink/15 p-5 md:p-8"><strong class="text-2xl">4</strong><span class="block text-xs opacity-60">Learning stages</span></div><div class="border-l border-ink/15 p-5 md:p-8"><strong class="text-2xl">6 days</strong><span class="block text-xs opacity-60">Office support</span></div><div class="border-l border-ink/15 p-5 md:p-8"><strong class="text-2xl">Dhaka</strong><span class="block text-xs opacity-60">Main campus</span></div></div></section>
    <section id="programmes" class="mx-auto max-w-7xl px-5 py-20 md:py-28"><h2 class="max-w-2xl font-display text-4xl font-bold tracking-tight md:text-6xl">A clear path through every stage.</h2><div class="mt-12 grid gap-x-12 md:grid-cols-2">${programCards(inst, 2)}</div></section>
    <section class="bg-brand text-white"><div class="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[.8fr_1.2fr] md:items-end"><h2 class="font-display text-4xl font-bold md:text-6xl">Information families can use.</h2><div><p class="max-w-xl text-lg opacity-80">Read verified dates, schedules, and results without searching through social posts.</p><a href="notices.html" class="mt-7 inline-flex items-center gap-2 border-b border-white pb-1 font-bold">Open notices <span class="iconify" data-icon="ph:arrow-right"></span></a></div></div></section>
    ${admission(inst, 2)}
  </main>${footer(inst, 2)}${mobileNavFallback()}</body></html>`;
}

function indexV3(inst) {
  return `${head(inst, 3, "Home")}<body data-storage="${inst.storage}" class="bg-canvas font-sans text-ink antialiased">${header(inst, 3)}<div class="lg:ml-72">
  <main><section class="mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[.8fr_1.2fr] md:px-10">
    <div class="reveal"><p class="mb-5 text-xs font-bold uppercase tracking-[.16em] text-brand">${inst.descriptor}</p><h1 data-cms="heroTitle" class="font-display text-5xl font-black leading-[.95] tracking-[-.05em] md:text-7xl">${inst.hero}</h1><p data-cms="heroSummary" class="mt-6 max-w-lg leading-7 text-white/65">${inst.summary}</p><a href="#admissions" class="mt-8 inline-flex items-center gap-3 rounded-xl bg-brand px-6 py-3 font-bold text-[#111412] active:scale-[.98]">${inst.primaryAction}<span class="iconify" data-icon="ph:arrow-up-right"></span></a></div>
    <div class="reveal reveal-2 grid grid-cols-5 gap-3"><img src="assets/${inst.image}" alt="${inst.imageAlt}" width="1200" height="900" class="col-span-5 aspect-[16/10] w-full rounded-2xl object-cover md:col-span-4"><div class="col-span-2 rounded-2xl border border-white/10 bg-panel p-5 md:col-span-3"><span class="text-xs text-brand">Now accepting enquiries</span><strong data-cms="admissionStatus" class="mt-2 block text-xl">Admissions open for 2026-27</strong></div><div class="col-span-3 flex items-end rounded-2xl bg-brand p-5 text-[#111412] md:col-span-2"><strong class="text-2xl">Visit the campus before you decide.</strong></div></div>
  </section>
  <section id="programmes" class="border-y border-white/10 px-5 py-20 md:px-10"><div class="mx-auto max-w-7xl"><h2 class="text-4xl font-bold tracking-tight">Choose the right learning track.</h2><div class="mt-10 grid gap-4 md:grid-cols-2">${programCards(inst, 3)}</div></div></section>
  <section class="mx-auto max-w-7xl px-5 py-20 md:px-10"><div class="grid gap-6 md:grid-cols-[1.3fr_.7fr]"><img src="assets/${inst.image}" alt="${inst.imageAlt}" class="aspect-[16/8] h-full w-full rounded-2xl object-cover opacity-80"><div class="rounded-2xl border border-white/10 p-7"><h2 class="text-3xl font-bold">Meet the people behind the work.</h2><p class="mt-4 text-white/60">Experienced educators explain, observe, and give students practical next steps.</p><a href="${inst.peoplePage}" class="mt-8 inline-flex items-center gap-2 text-brand">View ${inst.peopleLabel.toLowerCase()} <span class="iconify" data-icon="ph:arrow-right"></span></a></div></div></section>
  ${admission(inst, 3)}</main>${footer(inst, 3)}${mobileNavFallback()}</div></body></html>`;
}

function indexV4(inst) {
  return `${head(inst, 4, "Home")}<body data-storage="${inst.storage}" class="font-sans antialiased">${header(inst, 4)}<main>
  <section class="mx-auto grid min-h-[86dvh] max-w-7xl items-center gap-8 px-5 py-10 md:grid-cols-[1.05fr_.95fr] md:py-16"><div class="reveal"><span class="inline-block rounded-full bg-brand/10 px-4 py-2 text-sm font-bold text-brand">${inst.descriptor}</span><h1 data-cms="heroTitle" class="mt-6 font-display text-5xl font-black leading-[.98] tracking-[-.045em] md:text-7xl">${inst.hero}</h1><p data-cms="heroSummary" class="mt-6 max-w-xl text-lg leading-8 text-slate-600">${inst.summary}</p><div class="mt-8 flex flex-wrap gap-3"><a href="#admissions" class="rounded-full bg-ink px-6 py-3 font-bold text-white active:scale-[.98]">${inst.primaryAction}</a><a href="${inst.peoplePage}" class="rounded-full border border-slate-300 bg-white px-6 py-3 font-bold active:scale-[.98]">Meet ${inst.peopleLabel.toLowerCase()}</a></div></div><div class="reveal reveal-2 relative"><div class="absolute -inset-3 rotate-3 rounded-[36px] bg-brand/15"></div><img src="assets/${inst.image}" alt="${inst.imageAlt}" width="1200" height="900" class="relative aspect-square w-full rounded-[36px] object-cover"><div class="absolute -bottom-5 -left-4 rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(44,55,80,.14)]"><strong class="block text-2xl">Open days</strong><span class="text-sm text-slate-500">Sunday to Thursday</span></div></div></section>
  <section id="programmes" class="mx-auto max-w-7xl px-5 py-20"><h2 class="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">Learning should feel clear and possible.</h2><div class="mt-10 grid gap-5 md:grid-cols-3">${programCards(inst, 4)}</div></section>
  <section class="mx-4 rounded-[36px] bg-ink text-white md:mx-6"><div class="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:p-16"><div><h2 class="text-4xl font-black">Stay up to date.</h2><p class="mt-4 max-w-md text-slate-300">Notices, schedules, and published results are organised in one calm place.</p></div><a href="notices.html" class="flex min-h-40 items-end justify-between rounded-[28px] bg-brand p-7 text-white"><strong class="text-2xl">Open the noticeboard</strong><span class="iconify text-3xl" data-icon="ph:arrow-up-right"></span></a></div></section>
  ${admission(inst, 4)}</main>${footer(inst, 4)}${mobileNavFallback()}</body></html>`;
}

function indexV5(inst) {
  return `${head(inst, 5, "Home")}<body data-storage="${inst.storage}" class="font-sans antialiased">${header(inst, 5)}<main>
  <section class="mx-auto grid max-w-[1500px] gap-8 px-5 py-12 lg:grid-cols-[220px_1fr] lg:px-10 lg:py-16"><div class="text-xs font-semibold uppercase tracking-[.12em] text-brand">${inst.descriptor}</div><div><h1 data-cms="heroTitle" class="reveal max-w-5xl font-display text-5xl font-black leading-[.94] tracking-[-.055em] md:text-8xl">${inst.hero}</h1><div class="mt-10 grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end"><div><p data-cms="heroSummary" class="max-w-md text-lg leading-8 opacity-65">${inst.summary}</p><a href="#admissions" class="mt-7 inline-flex items-center gap-2 border-b-2 border-brand pb-2 font-bold">${inst.primaryAction}<span class="iconify" data-icon="ph:arrow-right"></span></a></div><img src="assets/${inst.image}" alt="${inst.imageAlt}" width="1200" height="900" class="reveal reveal-2 aspect-[16/8] w-full rounded-lg object-cover"></div></div></section>
  <section id="programmes" class="border-y border-ink/15"><div class="mx-auto grid max-w-[1500px] lg:grid-cols-[220px_1fr]"><div class="px-5 py-10 text-sm font-bold lg:px-10">${inst.programLabel}</div><div class="grid md:grid-cols-2">${inst.programs.map((item, i) => `<article class="border-ink/15 p-7 md:p-10 ${i % 2 ? "md:border-l" : ""} ${i > 1 ? "border-t" : ""}"><span class="text-sm text-brand">${item[1]}</span><h2 class="mt-3 text-3xl font-bold">${item[0]}</h2><p class="mt-4 max-w-md text-sm leading-6 opacity-65">${item[2]}</p></article>`).join("")}</div></div></section>
  <section class="mx-auto grid max-w-[1500px] gap-8 px-5 py-20 lg:grid-cols-[220px_1fr] lg:px-10"><div class="text-sm font-bold">Useful links</div><div class="grid gap-3 md:grid-cols-3"><a class="rounded-lg bg-panel p-6" href="${inst.peoplePage}"><span class="iconify text-2xl text-brand" data-icon="ph:users-three"></span><strong class="mt-10 block text-xl">${inst.peopleLabel}</strong></a><a class="rounded-lg bg-panel p-6" href="notices.html"><span class="iconify text-2xl text-brand" data-icon="ph:files"></span><strong class="mt-10 block text-xl">Notices</strong></a><a class="rounded-lg bg-brand p-6 text-white" href="#admissions"><span class="iconify text-2xl" data-icon="ph:arrow-up-right"></span><strong class="mt-10 block text-xl">${inst.primaryAction}</strong></a></div></section>
  ${admission(inst, 5)}</main>${footer(inst, 5)}${mobileNavFallback()}</body></html>`;
}

function admission(inst, version) {
  const dark = version === 3;
  const radius = variants[version].radius;
  return `<section id="admissions" class="${dark ? "border-t border-white/10" : ""} px-5 py-20 md:py-28"><div class="mx-auto grid max-w-7xl gap-10 md:grid-cols-[.9fr_1.1fr] md:items-start"><div><h2 class="text-4xl font-bold tracking-tight md:text-5xl">Talk with admissions.</h2><p class="mt-5 max-w-lg leading-7 opacity-65">Tell us the stage you are considering. The team will explain availability, requirements, fees, and the next visit date.</p><p class="mt-7 text-sm"><strong>Prefer to call?</strong><br><a data-cms-phone href="tel:+8801712345678" class="text-brand">${inst.phone}</a></p></div><form class="js-enquiry ${dark ? "border border-white/10 bg-panel" : "border border-ink/10 bg-panel"} p-6 md:p-8 ${radius}"><div class="grid gap-5 md:grid-cols-2"><label class="grid gap-2 text-sm font-semibold">Guardian name<input required name="name" class="${dark ? "border-white/15 bg-canvas placeholder:text-white/40" : "border-ink/20 bg-transparent placeholder:text-ink/40"} border px-4 py-3 font-normal outline-none focus:border-brand ${radius}" placeholder="Your full name"></label><label class="grid gap-2 text-sm font-semibold">Phone number<input required name="phone" type="tel" class="${dark ? "border-white/15 bg-canvas placeholder:text-white/40" : "border-ink/20 bg-transparent placeholder:text-ink/40"} border px-4 py-3 font-normal outline-none focus:border-brand ${radius}" placeholder="+880 1XXX XXXXXX"></label><label class="grid gap-2 text-sm font-semibold md:col-span-2">Programme<select required class="${dark ? "border-white/15 bg-canvas" : "border-ink/20 bg-transparent"} border px-4 py-3 font-normal outline-none focus:border-brand ${radius}"><option value="">Choose a programme</option>${inst.programs.map(item => `<option>${item[0]}</option>`).join("")}</select></label></div><p class="js-form-status mt-4 hidden text-sm" role="status"></p><button class="mt-6 whitespace-nowrap bg-brand px-6 py-3 font-bold text-white active:scale-[.98] ${radius}" type="submit">Request a call</button></form></div></section>`;
}

function peoplePage(inst, version) {
  const cards = inst.people.map((person, index) => {
    if (version === 2) return `<article class="grid grid-cols-[72px_1fr] gap-5 border-t border-ink/20 py-6"><span class="grid size-16 place-items-center bg-brand text-xl font-bold text-white">${initials(person[0])}</span><div><h2 class="text-xl font-bold">${person[0]}</h2><p class="mt-1 text-sm opacity-60">${person[1]}</p><p class="mt-3 text-sm text-brand">${person[2]}</p></div></article>`;
    if (version === 3) return `<article class="${index === 0 ? "md:col-span-2 md:grid md:grid-cols-2" : ""} rounded-2xl border border-white/10 bg-panel p-6"><span class="grid size-14 place-items-center rounded-xl bg-brand font-bold text-[#111412]">${initials(person[0])}</span><div class="mt-10 ${index === 0 ? "md:mt-0" : ""}"><h2 class="text-2xl font-bold">${person[0]}</h2><p class="mt-2 text-white/55">${person[1]}</p><p class="mt-5 text-sm text-brand">${person[2]}</p></div></article>`;
    if (version === 4) return `<article class="${index === 1 ? "md:translate-y-8" : ""} rounded-[28px] border border-slate-200 bg-white p-6"><span class="grid size-16 place-items-center rounded-2xl bg-brand/10 text-xl font-black text-brand">${initials(person[0])}</span><h2 class="mt-8 text-2xl font-black">${person[0]}</h2><p class="mt-2 text-slate-500">${person[1]}</p><p class="mt-5 text-sm font-bold text-brand">${person[2]}</p></article>`;
    return `<article class="grid gap-4 border-t border-ink/20 py-6 md:grid-cols-[1fr_.7fr_.5fr] md:items-center"><h2 class="text-xl font-bold">${person[0]}</h2><p class="text-sm opacity-60">${person[1]}</p><p class="text-sm text-brand">${person[2]}</p></article>`;
  }).join("");
  return `${head(inst, version, inst.peopleLabel)}<body data-storage="${inst.storage}" class="font-sans antialiased">${header(inst, version, "people")}<div class="${version === 3 ? "lg:ml-72" : ""}"><main class="mx-auto min-h-[75dvh] max-w-7xl px-5 py-14 md:py-20"><div class="max-w-3xl"><p class="text-sm font-bold text-brand">${inst.peopleLabel}</p><h1 class="mt-5 font-display text-5xl font-black leading-[.98] tracking-[-.04em] md:text-7xl">${inst.peopleTitle}</h1><p class="mt-6 max-w-xl text-lg leading-8 opacity-65">Experience matters, but attention matters too. Meet the people responsible for teaching and student guidance.</p></div><div data-people-list class="mt-14 ${version === 2 ? "grid gap-x-12 md:grid-cols-2" : version === 3 ? "grid gap-4 md:grid-cols-2" : version === 4 ? "grid gap-5 md:grid-cols-3" : ""}">${cards}</div></main>${footer(inst, version)}${mobileNavFallback()}</div></body></html>`;
}

function noticesPage(inst, version) {
  const dark = version === 3;
  const radius = variants[version].radius;
  // Index is kept in the generator callback signature for future ordering metadata.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rows = notices.map((item, i) => `<article data-document data-type="Notice" class="${version === 4 ? `bg-white p-6 ${radius} border border-slate-200` : `${dark ? "border-white/10" : "border-ink/15"} border-t py-6`} ${version === 5 ? "grid gap-4 md:grid-cols-[140px_1fr_auto] md:items-center" : ""}"><div class="text-xs font-bold text-brand">${item[0]}<span class="ml-3 opacity-70">${item[1]}</span></div><div class="${version === 5 ? "" : "mt-3"}"><h2 class="text-xl font-bold">${item[2]}</h2><p class="mt-2 text-sm leading-6 opacity-60">${item[3]}</p></div><button class="mt-4 inline-flex items-center gap-2 text-sm font-bold ${version === 5 ? "md:mt-0" : ""}">View PDF <span class="iconify" data-icon="ph:arrow-up-right"></span></button></article>`).join("");
  const resultRows = results.map(item => `<article data-document data-type="Result" class="${version === 4 ? `bg-white p-6 ${radius} border border-slate-200` : `${dark ? "border-white/10" : "border-ink/15"} border-t py-6`} ${version === 5 ? "grid gap-4 md:grid-cols-[140px_1fr_auto] md:items-center" : ""}"><div class="text-xs font-bold text-brand">${item[0]}</div><h2 class="${version === 5 ? "" : "mt-3"} text-xl font-bold">${item[2]}</h2><button class="mt-4 inline-flex items-center gap-2 text-sm font-bold ${version === 5 ? "md:mt-0" : ""}">View PDF <span class="iconify" data-icon="ph:arrow-up-right"></span></button></article>`).join("");
  return `${head(inst, version, "Notices and results")}<body data-storage="${inst.storage}" class="font-sans antialiased">${header(inst, version, "notices")}<div class="${version === 3 ? "lg:ml-72" : ""}"><main class="mx-auto min-h-[75dvh] max-w-7xl px-5 py-14 md:py-20"><div class="grid gap-8 md:grid-cols-[1fr_.6fr] md:items-end"><div><p class="text-sm font-bold text-brand">Noticeboard</p><h1 class="mt-5 font-display text-5xl font-black tracking-[-.04em] md:text-7xl">Dates, documents, and results.</h1></div><label class="grid gap-2 text-sm font-semibold">Filter documents<select class="js-doc-filter ${dark ? "border-white/15 bg-canvas" : "border-ink/20 bg-transparent"} border px-4 py-3 ${radius}"><option value="All">All documents</option><option value="Notice">Notices</option><option value="Result">Results</option></select></label></div><section class="mt-14"><h2 class="mb-6 text-2xl font-bold">Current notices</h2><div data-doc-list class="${version === 4 ? "grid gap-5 md:grid-cols-2" : ""}">${rows}</div><div id="results" class="mt-16"><h2 class="mb-6 text-2xl font-bold">Published results</h2><div class="${version === 4 ? "grid gap-5 md:grid-cols-2" : ""}">${resultRows}</div></div><div class="js-empty hidden py-20 text-center"><h2 class="text-2xl font-bold">No matching documents</h2><p class="mt-2 opacity-60">Choose another document type.</p></div></section></main>${footer(inst, version)}${mobileNavFallback()}</div></body></html>`;
}

const siteJs = `(() => {
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
      node.href = "tel:" + String(data.landing.phone).replace(/\\s/g, "");
    });
  } catch {}
})();`;

for (const inst of institutions) {
  const v1 = join(root, inst.folder, "v1");
  for (const version of [2, 3, 4, 5]) {
    const target = join(root, inst.folder, `v${version}`);
    mkdirSync(target, { recursive: true });
    cpSync(join(v1, "assets"), join(target, "assets"), { recursive: true, force: true });
    for (const file of ["admin.html", "admin.js", "styles.css"]) {
      cpSync(join(v1, file), join(target, file), { force: true });
    }
    const index = version === 2 ? indexV2(inst) : version === 3 ? indexV3(inst) : version === 4 ? indexV4(inst) : indexV5(inst);
    writeFileSync(join(target, "index.html"), index);
    writeFileSync(join(target, inst.peoplePage), peoplePage(inst, version));
    writeFileSync(join(target, "notices.html"), noticesPage(inst, version));
    writeFileSync(join(target, "site.js"), siteJs);
  }
}

console.log("Generated 12 Tailwind prototypes with public pages and v1 admin copies.");
