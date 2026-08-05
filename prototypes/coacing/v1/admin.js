(() => {
  "use strict";

  const STORAGE_KEY = "vertexCoachingPrototype";
  const defaultData = {
    landing: {
      admissionStatus: "New batches enrolling now",
      schoolDescriptor: "SSC · HSC · University admission · Dhanmondi, Dhaka",
      heroTitle: "Turn practice into progress.",
      heroSummary: "Focused classes, weekly diagnostics, and precise mentor feedback help students close gaps and perform with confidence when it counts.",
      phone: "+880 1712 345 678",
      admissionYear: "2026–27",
      schoolHeading: "Know exactly what to improve next.",
      schoolIntro: "Vertex combines clear concept teaching with timed practice and useful feedback. Students see where marks are being lost, then work through a focused plan to recover them.",
      publishedAt: "26 Jul 2026, 10:24 AM"
    },
    heroSlides: [
      {
        id: 201,
        src: "assets/vertex-classroom.png",
        heading: "Every class ends with a clear next step",
        supporting: "Concept lesson · Timed practice · Personal feedback",
        alt: "A Vertex mentor explaining mathematics to a focused coaching class",
        isLocalAsset: true
      }
    ],
    mentors: [
      { id: 1, name: "Hasan Ahmed", role: "SSC Mathematics Lead", department: "Mathematics", subject: "Mathematics", experience: 14, status: "Published", bio: "Leads SSC mathematics and diagnostic test design." },
      { id: 2, name: "Nusrat Islam", role: "Language Mentor", department: "Languages", subject: "Bangla & Literature", experience: 11, status: "Published", bio: "Coaches structured writing, reading, and exam technique." },
      { id: 3, name: "Arif Khan", role: "Physics Programme Lead", department: "Science", subject: "Physics", experience: 9, status: "Published", bio: "Teaches HSC physics through concepts and timed problem solving." },
      { id: 4, name: "Farzana Sultana", role: "Foundation Coordinator", department: "Foundation", subject: "General Mathematics", experience: 16, status: "Published", bio: "Builds durable foundations for Classes VIII and IX." },
      { id: 5, name: "Rafiul Mahmud", role: "Admission Mentor", department: "Languages", subject: "English", experience: 8, status: "Published", bio: "Teaches admission-test English and question strategy." },
      { id: 6, name: "Tahmina Jahan", role: "Academic Counsellor", department: "Humanities", subject: "Study Strategy", experience: 12, status: "Published", bio: "Helps students turn diagnostic results into practical study plans." },
      { id: 7, name: "Mehedi Islam", role: "Biology Mentor", department: "Science", subject: "Biology", experience: 10, status: "Published", bio: "Coaches board and admission-test biology." },
      { id: 8, name: "Sharmin Kabir", role: "Chemistry Mentor", department: "Science", subject: "Chemistry", experience: 7, status: "Published", bio: "Teaches chemistry with a focus on calculations and common exam traps." }
    ],
    documents: [
      { id: 101, title: "SSC full-syllabus model-test schedule", type: "Notice", category: "Examination", date: "2026-07-24", fileName: "ssc-model-test-schedule.pdf", status: "Published" },
      { id: 102, title: "HSC science revision classes begin Sunday", type: "Notice", category: "General", date: "2026-07-18", fileName: "hsc-revision-batch.pdf", status: "Published" },
      { id: 103, title: "University admission intensive: orientation details", type: "Notice", category: "Event", date: "2026-07-12", fileName: "admission-orientation.pdf", status: "Published" },
      { id: 104, title: "Guardian progress meeting schedule", type: "Notice", category: "Parents", date: "2026-07-05", fileName: "guardian-meeting.pdf", status: "Published" },
      { id: 105, title: "University admission mock test 04 — merit list", type: "Result", category: "Academic result", date: "2026-06-28", fileName: "admission-mock-04.pdf", status: "Published" },
      { id: 106, title: "SSC chapter test — mathematics and science", type: "Result", category: "Academic result", date: "2026-06-25", fileName: "ssc-chapter-test.pdf", status: "Published" },
      { id: 107, title: "SSC model test results", type: "Result", category: "Academic result", date: "2026-05-14", fileName: "ssc-model-test.pdf", status: "Published" }
    ],
    activity: [
      { action: "Published notice", item: "Half-yearly examination schedule", time: "24 Jul 2026" },
      { action: "Updated mentor profile", item: "Hasan Ahmed", time: "22 Jul 2026" },
      { action: "Updated landing page", item: "Enrolment information", time: "20 Jul 2026" }
    ]
  };

  const clone = value => JSON.parse(JSON.stringify(value));
  const loadData = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.landing && saved.mentors && saved.documents) {
        if (!Array.isArray(saved.heroSlides) || !saved.heroSlides.length) saved.heroSlides = clone(defaultData.heroSlides);
        return saved;
      }
      return clone(defaultData);
    } catch {
      return clone(defaultData);
    }
  };

  let state = loadData();
  let currentView = "overview";
  let currentDocumentFilter = "All";
  let pendingConfirmAction = null;
  let landingDirty = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const saveState = $("#save-state");
    saveState.innerHTML = "<i></i>All changes saved";
  };

  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const formatDate = value => new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(new Date(`${value}T00:00:00`));

  const initials = name => name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();

  const showToast = (title, message) => {
    const toast = $("#toast");
    $("strong", toast).textContent = title;
    $("p", toast).textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 4200);
  };

  const addActivity = (action, item) => {
    state.activity.unshift({
      action,
      item,
      time: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())
    });
    state.activity = state.activity.slice(0, 8);
  };

  const viewTitles = {
    overview: ["Coaching website", "Manage your coaching website"],
    landing: ["Landing page", "Edit coaching information"],
    mentors: ["Mentor profiles", "Manage the teaching team"],
    documents: ["Notices & results", "Publish coaching documents"]
  };

  const openView = view => {
    currentView = viewTitles[view] ? view : "overview";
    $$("[data-admin-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.adminPanel === currentView));
    $$("[data-admin-nav]").forEach(link => link.classList.toggle("active", link.dataset.adminNav === currentView));
    $("#page-kicker").textContent = viewTitles[currentView][0];
    $("#page-title").textContent = viewTitles[currentView][1];
    history.replaceState(null, "", `#${currentView}`);
    $("#admin-sidebar").classList.remove("mobile-open");
    $("#sidebar-backdrop").classList.remove("show");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentView === "mentors") renderMentors();
    if (currentView === "documents") renderDocuments();
  };

  const updateCounts = () => {
    const mentorsCount = state.mentors.filter(item => item.status === "Published").length;
    const noticeCount = state.documents.filter(item => item.type === "Notice" && item.status === "Published").length;
    const resultCount = state.documents.filter(item => item.type === "Result" && item.status === "Published").length;
    $$("[data-mentors-count]").forEach(el => el.textContent = mentorsCount);
    $$("[data-notice-count]").forEach(el => el.textContent = noticeCount);
    $$("[data-result-count]").forEach(el => el.textContent = resultCount);
    $("#last-published").textContent = `Landing page published ${state.landing.publishedAt}`;
  };

  const renderActivity = () => {
    $("#activity-list").innerHTML = state.activity.length
      ? state.activity.map((item, index) => `
        <article>
          <span class="activity-icon">${index === 0 ? "✓" : "↻"}</span>
          <div><strong>${escapeHtml(item.action)}</strong><p>${escapeHtml(item.item)}</p></div>
          <time>${escapeHtml(item.time)}</time>
        </article>`).join("")
      : `<div class="empty-state"><h3>No activity yet</h3><p>Published changes will appear here.</p></div>`;
  };

  const refreshOverview = () => {
    updateCounts();
    renderActivity();
  };

  const landingForm = $("#landing-form");
  const fillLandingForm = () => {
    Object.entries(state.landing).forEach(([name, value]) => {
      if (landingForm.elements[name]) landingForm.elements[name].value = value;
    });
    landingDirty = false;
    updateLandingPreview();
    updateLandingDirtyState();
  };

  const updateLandingPreview = () => {
    const data = Object.fromEntries(new FormData(landingForm));
    $("#preview-status").textContent = data.admissionStatus || "Enrolment status";
    $("#preview-descriptor").textContent = data.schoolDescriptor || "Coaching description";
    $("#preview-title").textContent = data.heroTitle || "Main heading";
    $("#preview-summary").textContent = data.heroSummary || "Introduction";
    $$("[data-counter]", landingForm).forEach(counter => {
      counter.textContent = landingForm.elements[counter.dataset.counter].value.length;
    });
  };

  const updateLandingDirtyState = () => {
    $("#landing-unsaved").textContent = landingDirty ? "You have unpublished changes" : "No unpublished changes";
    $("#landing-unsaved").classList.toggle("dirty", landingDirty);
    $("#landing-status").textContent = landingDirty ? "Changes pending" : "Up to date";
    $("#save-state").innerHTML = landingDirty ? "<i></i>Unpublished changes" : "<i></i>All changes saved";
  };

  const buildChangeSummary = () => {
    const draft = Object.fromEntries(new FormData(landingForm));
    const labels = {
      admissionStatus: "Enrolment status",
      schoolDescriptor: "Coaching description",
      heroTitle: "Main heading",
      heroSummary: "Introduction",
      phone: "Phone number",
      admissionYear: "Programme year",
      schoolHeading: "Approach heading",
      schoolIntro: "Approach introduction"
    };
    const changes = Object.keys(labels).filter(key => draft[key] !== String(state.landing[key] ?? ""));
    $("#change-summary").innerHTML = changes.length
      ? changes.map(key => `<article><span>${labels[key]}</span><p>${escapeHtml(draft[key])}</p></article>`).join("")
      : `<p class="no-changes">No changes were made.</p>`;
    return changes.length;
  };

  const renderMentors = () => {
    const search = $("#mentors-search").value.trim().toLowerCase();
    const status = $("#mentors-filter").value;
    const filtered = state.mentors.filter(item => {
      const matchesSearch = `${item.name} ${item.role} ${item.department} ${item.subject}`.toLowerCase().includes(search);
      const matchesStatus = status === "all" || item.status === status;
      return matchesSearch && matchesStatus;
    });
    $("#mentors-visible-count").textContent = filtered.length;
    $("#mentors-empty").hidden = filtered.length > 0;
    $("#mentors-manager-list").innerHTML = filtered.map(item => `
      <article class="mentors-manager-row">
        <div class="manager-person"><span>${initials(item.name)}</span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.role)} · ${escapeHtml(item.subject)}</small></div></div>
        <span>${escapeHtml(item.department)}</span>
        <span>${item.experience} years</span>
        <span><i class="status-chip ${item.status.toLowerCase()}">${item.status}</i></span>
        <div class="row-actions"><button type="button" data-edit-mentors="${item.id}">Edit</button><button class="danger-link" type="button" data-delete-mentors="${item.id}">Remove</button></div>
      </article>`).join("");
  };

  const renderSlides = () => {
    $("#slide-count").textContent = state.heroSlides.length;
    const list = $("#slide-manager-list");
    list.innerHTML = state.heroSlides.map((slide, index) => `
      <article class="slide-manager-item">
        <div class="slide-thumbnail"><img src="${escapeHtml(slide.src)}" alt=""></div>
        <div class="slide-details"><span>Slide ${index + 1}</span><strong>${escapeHtml(slide.heading)}</strong><small>${escapeHtml(slide.supporting || "No supporting line")}</small></div>
        <div class="slide-order">
          <button type="button" data-slide-up="${slide.id}" aria-label="Move slide ${index + 1} earlier" ${index === 0 ? "disabled" : ""}>↑</button>
          <button type="button" data-slide-down="${slide.id}" aria-label="Move slide ${index + 1} later" ${index === state.heroSlides.length - 1 ? "disabled" : ""}>↓</button>
        </div>
        <button class="slide-remove" type="button" data-slide-remove="${slide.id}" ${state.heroSlides.length === 1 ? "disabled" : ""}>Remove</button>
      </article>`).join("");
    const atLimit = state.heroSlides.length >= 6;
    $("#slide-upload-form").classList.toggle("at-limit", atLimit);
    $("#slide-upload-form button[type=submit]").disabled = atLimit;
    $("#slide-upload-form button[type=submit]").textContent = atLimit ? "Carousel is full" : "Add image to carousel";
  };

  const resizeCarouselImage = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("The selected file is not a valid image."));
      image.onload = () => {
        const targetWidth = Math.min(1400, image.naturalWidth);
        const targetHeight = Math.round(targetWidth * 0.625);
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const context = canvas.getContext("2d");
        const sourceRatio = image.naturalWidth / image.naturalHeight;
        const targetRatio = targetWidth / targetHeight;
        let sx = 0, sy = 0, sw = image.naturalWidth, sh = image.naturalHeight;
        if (sourceRatio > targetRatio) {
          sw = image.naturalHeight * targetRatio;
          sx = (image.naturalWidth - sw) / 2;
        } else {
          sh = image.naturalWidth / targetRatio;
          sy = (image.naturalHeight - sh) / 2;
        }
        context.drawImage(image, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL("image/jpeg", .74));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  const openMentorsDialog = item => {
    const form = $("#mentors-form");
    form.reset();
    form.elements.mentorsId.value = item?.id || "";
    ["name", "role", "department", "subject", "experience", "status", "bio"].forEach(key => {
      if (item) form.elements[key].value = item[key] ?? "";
    });
    $("#mentors-dialog-title").textContent = item ? "Edit mentor" : "Add mentor";
    $("#save-mentors").textContent = item ? "Save changes" : "Add profile";
    $("#mentors-dialog").showModal();
    window.setTimeout(() => form.elements.name.focus(), 50);
  };

  const confirmAction = (title, message, action, actionLabel = "Remove") => {
    $("#confirm-title").textContent = title;
    $("#confirm-message").textContent = message;
    $("#confirm-action").textContent = actionLabel;
    pendingConfirmAction = action;
    $("#confirm-dialog").showModal();
  };

  const renderDocuments = () => {
    const search = $("#document-search").value.trim().toLowerCase();
    const filtered = state.documents
      .filter(item => currentDocumentFilter === "All" || item.type === currentDocumentFilter)
      .filter(item => `${item.title} ${item.category} ${item.fileName}`.toLowerCase().includes(search))
      .sort((a, b) => b.date.localeCompare(a.date));
    $("#document-empty").hidden = filtered.length > 0;
    $("#document-manager-list").innerHTML = filtered.map(item => `
      <article class="document-manager-row">
        <div class="manager-document"><i>PDF</i><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.fileName)}</small></div></div>
        <span><b class="type-chip ${item.type.toLowerCase()}">${item.type}</b></span>
        <span>${formatDate(item.date)}</span>
        <span><i class="status-chip published">${item.status}</i></span>
        <div class="row-actions"><button type="button" data-edit-document="${item.id}">Edit</button><button class="danger-link" type="button" data-delete-document="${item.id}">Remove</button></div>
      </article>`).join("");
    updateCounts();
  };

  const openUpload = (type = "Notice", item = null) => {
    const form = $("#document-form");
    form.reset();
    form.elements.documentId.value = item?.id || "";
    form.elements.type.value = item?.type || type;
    form.elements.title.value = item?.title || "";
    form.elements.category.value = item?.category || (type === "Result" ? "Academic result" : "Examination");
    form.elements.date.value = item?.date || new Date().toISOString().slice(0, 10);
    form.elements.approved.checked = Boolean(item);
    $("#selected-file").textContent = item?.fileName || "PDF only · Maximum 10 MB";
    $("#upload-title").textContent = item ? "Edit document details" : "Upload and publish";
    $("#document-form button[type=submit]").textContent = item ? "Save document" : "Publish document";
    $("#upload-drawer").classList.add("open");
    $("#upload-drawer").scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  $$("[data-admin-nav]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    openView(link.dataset.adminNav);
  }));
  $$("[data-open-view]").forEach(button => button.addEventListener("click", () => {
    openView(button.dataset.openView);
    if (button.dataset.openView === "documents") {
      currentDocumentFilter = button.dataset.docType || "All";
      $$("[data-document-filter]").forEach(filter => filter.classList.toggle("active", filter.dataset.documentFilter === currentDocumentFilter));
      renderDocuments();
      openUpload(button.dataset.docType || "Notice");
    }
  }));

  landingForm.addEventListener("input", () => {
    landingDirty = true;
    updateLandingPreview();
    updateLandingDirtyState();
  });
  landingForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!landingForm.reportValidity()) return;
    buildChangeSummary();
    $$("[data-step-indicator]").forEach(item => item.classList.toggle("active", item.dataset.stepIndicator !== "publish"));
    $("#review-dialog").showModal();
  });
  $("#discard-landing").addEventListener("click", () => {
    if (!landingDirty) return;
    confirmAction("Discard landing-page changes?", "The unpublished text in the editor will be replaced with the currently published content.", () => {
      fillLandingForm();
      showToast("Changes discarded", "The editor now shows the published content.");
    }, "Discard");
  });
  $("#publish-landing").addEventListener("click", event => {
    event.preventDefault();
    const draft = Object.fromEntries(new FormData(landingForm));
    state.landing = { ...state.landing, ...draft, publishedAt: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(new Date()) };
    addActivity("Published landing page", state.landing.heroTitle);
    save();
    landingDirty = false;
    updateLandingDirtyState();
    refreshOverview();
    $("#review-dialog").close();
    $$("[data-step-indicator]").forEach(item => item.classList.add("active"));
    showToast("Landing page published", "The updated content is now visible on the public prototype.");
  });
  $("#preview-size").addEventListener("click", event => {
    const mobile = $("#landing-preview").classList.toggle("mobile");
    event.currentTarget.textContent = mobile ? "Desktop view" : "Mobile view";
  });

  $("#slide-upload-form input[type=file]").addEventListener("change", event => {
    const file = event.target.files[0];
    const preview = $("#carousel-upload-preview");
    if (!file) {
      preview.hidden = true;
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      event.target.value = "";
      showToast("Choose an image file", "Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      event.target.value = "";
      showToast("Image is too large", "Choose an image smaller than 8 MB.");
      return;
    }
    $("#carousel-file-name").textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
  });
  $("#slide-upload-form").addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || state.heroSlides.length >= 6) return;
    const file = form.elements.image.files[0];
    const button = $("button[type=submit]", form);
    button.disabled = true;
    button.textContent = "Preparing image…";
    try {
      const src = await resizeCarouselImage(file);
      const slide = {
        id: Date.now(),
        src,
        heading: form.elements.heading.value.trim(),
        supporting: form.elements.supporting.value.trim(),
        alt: form.elements.alt.value.trim(),
        isLocalAsset: false
      };
      state.heroSlides.push(slide);
      addActivity("Added carousel image", slide.heading);
      try {
        save();
      } catch {
        state.heroSlides.pop();
        throw new Error("Browser storage is full. Remove an existing uploaded image and try again.");
      }
      form.reset();
      $("#carousel-upload-preview").hidden = true;
      $("#carousel-file-name").textContent = "JPG, PNG or WebP · Maximum 8 MB";
      renderSlides();
      renderActivity();
      showToast("Carousel image added", "The new slide is now visible on the Home page.");
    } catch (error) {
      showToast("Image was not added", error.message);
      button.disabled = false;
      button.textContent = "Add image to carousel";
    }
  });
  $("#slide-manager-list").addEventListener("click", event => {
    const upId = Number(event.target.dataset.slideUp);
    const downId = Number(event.target.dataset.slideDown);
    const removeId = Number(event.target.dataset.slideRemove);
    const move = (id, direction) => {
      const index = state.heroSlides.findIndex(slide => slide.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= state.heroSlides.length) return;
      [state.heroSlides[index], state.heroSlides[nextIndex]] = [state.heroSlides[nextIndex], state.heroSlides[index]];
      save();
      renderSlides();
      showToast("Carousel order updated", "The Home page now uses the new slide order.");
    };
    if (upId) move(upId, -1);
    if (downId) move(downId, 1);
    if (removeId && state.heroSlides.length > 1) {
      const slide = state.heroSlides.find(item => item.id === removeId);
      confirmAction("Remove this carousel image?", `"${slide.heading}" will no longer appear on the Home page.`, () => {
        state.heroSlides = state.heroSlides.filter(item => item.id !== removeId);
        addActivity("Removed carousel image", slide.heading);
        save();
        renderSlides();
        renderActivity();
        showToast("Carousel image removed", "The Home page carousel was updated.");
      });
    }
  });

  $("#add-mentors").addEventListener("click", () => openMentorsDialog());
  $("#mentors-search").addEventListener("input", renderMentors);
  $("#mentors-filter").addEventListener("change", renderMentors);
  $("#mentors-manager-list").addEventListener("click", event => {
    const editId = Number(event.target.dataset.editMentors);
    const deleteId = Number(event.target.dataset.deleteMentors);
    if (editId) openMentorsDialog(state.mentors.find(item => item.id === editId));
    if (deleteId) {
      const item = state.mentors.find(profile => profile.id === deleteId);
      confirmAction(`Remove ${item.name}?`, "This profile will no longer appear on the public Mentors page.", () => {
        state.mentors = state.mentors.filter(profile => profile.id !== deleteId);
        addActivity("Removed mentors profile", item.name);
        save();
        renderMentors();
        refreshOverview();
        showToast("Profile removed", `${item.name} was removed from the website.`);
      });
    }
  });
  $("#mentors-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const id = Number(values.mentorsId);
    const item = {
      id: id || Date.now(),
      name: values.name.trim(),
      role: values.role.trim(),
      department: values.department,
      subject: values.subject.trim(),
      experience: Number(values.experience),
      status: values.status,
      bio: values.bio.trim()
    };
    if (id) state.mentors = state.mentors.map(profile => profile.id === id ? item : profile);
    else state.mentors.unshift(item);
    addActivity(id ? "Updated mentor profile" : "Added mentor profile", item.name);
    save();
    $("#mentors-dialog").close();
    renderMentors();
    refreshOverview();
    showToast(id ? "Profile updated" : "Profile added", `${item.name} is ${item.status.toLowerCase()} on the Mentors page.`);
  });

  $$("[data-document-filter]").forEach(button => button.addEventListener("click", () => {
    currentDocumentFilter = button.dataset.documentFilter;
    $$("[data-document-filter]").forEach(item => item.classList.toggle("active", item === button));
    renderDocuments();
  }));
  $("#document-search").addEventListener("input", renderDocuments);
  $("#open-upload").addEventListener("click", () => openUpload(currentDocumentFilter === "Result" ? "Result" : "Notice"));
  $("#close-upload").addEventListener("click", () => $("#upload-drawer").classList.remove("open"));
  $("#cancel-upload").addEventListener("click", () => $("#upload-drawer").classList.remove("open"));
  $("#document-form input[type=file]").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      event.target.value = "";
      showToast("Choose a PDF file", "The selected file is not a PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      event.target.value = "";
      showToast("File is too large", "Choose a PDF smaller than 10 MB.");
      return;
    }
    $("#selected-file").textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  });
  $("#document-manager-list").addEventListener("click", event => {
    const editId = Number(event.target.dataset.editDocument);
    const deleteId = Number(event.target.dataset.deleteDocument);
    if (editId) openUpload("Notice", state.documents.find(item => item.id === editId));
    if (deleteId) {
      const item = state.documents.find(document => document.id === deleteId);
      confirmAction("Remove this document?", `"${item.title}" will no longer be available on the public website.`, () => {
        state.documents = state.documents.filter(document => document.id !== deleteId);
        addActivity(`Removed ${item.type.toLowerCase()}`, item.title);
        save();
        renderDocuments();
        refreshOverview();
        showToast("Document removed", "The document was removed from the public website.");
      });
    }
  });
  $("#document-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const id = Number(values.documentId);
    const existing = state.documents.find(item => item.id === id);
    const file = form.elements.file.files[0];
    if (!id && !file) {
      showToast("PDF file required", "Choose the approved document you want to publish.");
      form.elements.file.focus();
      return;
    }
    const item = {
      id: id || Date.now(),
      title: values.title.trim(),
      type: values.type,
      category: values.category,
      date: values.date,
      fileName: file?.name || existing?.fileName || "document.pdf",
      status: "Published"
    };
    if (id) state.documents = state.documents.map(document => document.id === id ? item : document);
    else state.documents.unshift(item);
    addActivity(id ? `Updated ${item.type.toLowerCase()}` : `Published ${item.type.toLowerCase()}`, item.title);
    save();
    $("#upload-drawer").classList.remove("open");
    renderDocuments();
    refreshOverview();
    showToast(id ? "Document updated" : `${item.type} published`, "Families can now find it on the public website.");
  });

  $("#confirm-action").addEventListener("click", () => {
    if (pendingConfirmAction) pendingConfirmAction();
    pendingConfirmAction = null;
  });
  $("#toast button").addEventListener("click", () => $("#toast").classList.remove("show"));
  $("#mobile-admin-menu").addEventListener("click", () => {
    $("#admin-sidebar").classList.add("mobile-open");
    $("#sidebar-backdrop").classList.add("show");
  });
  $("#sidebar-backdrop").addEventListener("click", () => {
    $("#admin-sidebar").classList.remove("mobile-open");
    $("#sidebar-backdrop").classList.remove("show");
  });
  $("#reset-demo").addEventListener("click", () => {
    confirmAction("Reset all prototype data?", "This restores the original landing page, mentors profiles, documents, and activity.", () => {
      state = clone(defaultData);
      save();
      fillLandingForm();
      renderMentors();
      renderDocuments();
      renderSlides();
      refreshOverview();
      showToast("Demo data restored", "The prototype is back to its original state.");
    }, "Reset data");
  });

  fillLandingForm();
  renderMentors();
  renderDocuments();
  renderSlides();
  refreshOverview();
  const initialView = location.hash.slice(1);
  openView(viewTitles[initialView] ? initialView : "overview");
})();
