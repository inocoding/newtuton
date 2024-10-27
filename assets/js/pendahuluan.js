// Deklarasi variabel untuk halaman
const totalPages = 6;
let currentPage = 1;
let currentSubPage = 1;
const totalSubPages = 3;
const pageTimerDuration = 10; // Durasi timer untuk setiap halaman dalam detik
let pageTimer; // Variabel untuk menyimpan interval timer
const pagesRead = Array(totalPages).fill(false); // Array untuk melacak halaman yang sudah dibaca

// Mendapatkan elemen-elemen yang diperlukan
const progressElement = document.getElementById("progress");
const pageIndicatorElement = document.getElementById("page-indicator");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const progressWizard = document.getElementById("progressWizard");
const nextSubPageBtn = document.getElementById("nextSubPageBtn");
const prevSubPageBtn = document.getElementById("prevSubPageBtn");

// YouTube Player API untuk menghentikan video
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-video", {
    events: {
      onReady: onPlayerReady,
    },
  });
}
function onPlayerReady(event) {
  console.log("YouTube Player is ready");
}
function stopVideo() {
  if (player && typeof player.pauseVideo === "function") {
    player.pauseVideo();
  }
}

// Fungsi untuk menjalankan timer jika halaman belum dibaca
function startPageTimer() {
  let remainingTime = pageTimerDuration;
  nextButton.disabled = true; // Nonaktifkan tombol Next
  document.querySelectorAll(".wizard-step").forEach((step) => {
    step.classList.add("disabled"); // Nonaktifkan semua ikon wizard
  });

  // Jalankan timer dengan interval 1 detik
  pageTimer = setInterval(() => {
    remainingTime--;

    // Update progress bar sesuai waktu yang tersisa
    const progressPercentage =
      ((pageTimerDuration - remainingTime) / pageTimerDuration) * 100;
    progressElement.style.width = `${progressPercentage}%`;

    // Jika timer selesai, aktifkan tombol Next dan ikon wizard
    if (remainingTime <= 0) {
      clearInterval(pageTimer); // Hentikan timer
      nextButton.disabled = false;
      pagesRead[currentPage - 1] = true; // Tandai halaman sebagai telah dibaca
      document.querySelectorAll(".wizard-step").forEach((step) => {
        step.classList.remove("disabled");
      });
    }
  }, 1000);
}

// Fungsi untuk menghentikan timer saat halaman berubah
function resetPageTimer() {
  clearInterval(pageTimer);
  progressElement.style.width = "0%";
}

// Fungsi untuk menampilkan halaman sesuai dengan currentPage
function updatePage() {
  // Sembunyikan semua halaman
  for (let i = 1; i <= totalPages; i++) {
    document.getElementById(`page${i}`).style.display = "none";
  }

  // Tampilkan halaman saat ini
  document.getElementById(`page${currentPage}`).style.display = "block";

  // Update indikator halaman
  pageIndicatorElement.textContent = `Page ${currentPage} of ${totalPages}`;

  // Reset timer jika halaman belum pernah dibaca
  resetPageTimer();
  if (!pagesRead[currentPage - 1]) {
    startPageTimer(); // Mulai timer untuk halaman baru
  } else {
    // Jika halaman sudah dibaca, langsung aktifkan tombol Next dan ikon wizard
    nextButton.disabled = false;
    document.querySelectorAll(".wizard-step").forEach((step) => {
      step.classList.remove("disabled");
    });
    progressElement.style.width = "100%";
  }

  // Stop video if it’s playing and not on Page 4
  if (currentPage !== 4) stopVideo();

  // Update tombol navigasi
  previousButton.disabled = currentPage === 1;

  // Tandai progress wizard sebagai selesai
  markWizardAsCompleted(currentPage);

  // Reset subpage jika di page 2
  if (currentPage === 2) {
    currentSubPage = 1;
    updateSubPage();
  }
}

// Fungsi untuk menampilkan subhalaman di dalam Page 2
function updateSubPage() {
  for (let i = 1; i <= totalSubPages; i++) {
    document.getElementById(`subpage${i}`).style.display = "none";
  }
  document.getElementById(`subpage${currentSubPage}`).style.display = "block";
  prevSubPageBtn.disabled = currentSubPage === 1;
  nextSubPageBtn.disabled = currentSubPage === totalSubPages;
  if (currentPage === 2 && currentSubPage === totalSubPages) {
    nextButton.disabled = false;
  }
}

function markWizardAsCompleted(page) {
  const step = progressWizard.querySelector(`[data-page="${page}"]`);
  if (step) {
    step.classList.add("completed");
    step.innerHTML = '<i class="bi bi-check-circle"></i>';
  }
}

// Fungsi untuk beralih ke halaman yang diklik di wizard progress
function goToPage(page) {
  if (
    !document
      .querySelector(`.wizard-step[data-page="${page}"]`)
      .classList.contains("disabled")
  ) {
    currentPage = page;
    updatePage();
  }
}

// Fungsi untuk beralih ke halaman berikutnya
function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    updatePage();
  }
}

// Fungsi untuk beralih ke halaman sebelumnya
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    updatePage();
  }
}

// Fungsi untuk beralih ke subhalaman berikutnya di Page 2
function nextSubPage() {
  if (currentSubPage < totalSubPages) {
    currentSubPage++;
    updateSubPage();
  }
}

// Fungsi untuk beralih ke subhalaman sebelumnya di Page 2
function previousSubPage() {
  if (currentSubPage > 1) {
    currentSubPage--;
    updateSubPage();
  }
}

// Tambahkan event listener untuk ikon progress wizard
document.querySelectorAll(".wizard-step").forEach((step, index) => {
  step.addEventListener("click", () => goToPage(index + 1));
});

// Memperbarui halaman saat pertama kali dimuat
updatePage();

document.addEventListener("DOMContentLoaded", function () {
  const floatingBackground = document.querySelector(".floating-background");

  // Seleksi area sidebar kiri (wizard progress) dan materi utama
  const leftSidebar = document.querySelector(".left-sidebar");
  const mainContent = document.querySelector(".pdf-viewer-container");

  function createFloatingShape() {
    const shape = document.createElement("div");
    shape.classList.add("shape");

    // Tentukan ukuran, posisi, dan kecepatan acak untuk setiap shape
    const size = Math.random() * 100 + 30; // Ukuran antara 10px hingga 50px
    const leftPosition = Math.random() * 100; // Posisi horizontal acak
    const duration = Math.random() * 105 + 30; // Durasi antara 5s hingga 10s

    // Set gaya dinamis untuk bentuk ini
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${leftPosition}%`;
    shape.style.animationDuration = `${duration}s`;

    // Tambahkan elemen ke latar belakang
    floatingBackground.appendChild(shape);

    // Tambahkan efek blur saat bentuk berada sepenuhnya di dalam area sidebar atau main content
    const checkBlur = () => {
      const shapeRect = shape.getBoundingClientRect();
      const sidebarRect = leftSidebar.getBoundingClientRect();
      const contentRect = mainContent.getBoundingClientRect();

      // Periksa apakah bentuk berada sepenuhnya di dalam kotak sidebar atau kotak main content
      const isInsideSidebar =
        shapeRect.left >= sidebarRect.left &&
        shapeRect.right <= sidebarRect.right &&
        shapeRect.top >= sidebarRect.top &&
        shapeRect.bottom <= sidebarRect.bottom;

      const isInsideContent =
        shapeRect.left >= contentRect.left &&
        shapeRect.right <= contentRect.right &&
        shapeRect.top >= contentRect.top &&
        shapeRect.bottom <= contentRect.bottom;

      if (isInsideSidebar || isInsideContent) {
        shape.classList.add("blurred");
      } else {
        shape.classList.remove("blurred");
      }
    };

    // Jalankan fungsi blur pada interval agar efek diperbarui
    const blurInterval = setInterval(checkBlur, 100);

    // Hapus elemen setelah animasi selesai untuk menjaga kinerja
    shape.addEventListener("animationend", () => {
      shape.remove();
      clearInterval(blurInterval);
    });
  }

  // Buat bentuk secara berkala
  setInterval(createFloatingShape, 40500); // Tambahkan bentuk baru setiap 500ms
});
// PDF.js Configuration for PDF viewer on Page 2
const pdfContainer = document.getElementById("page2");
const url = pdfContainer.getAttribute("data-pdf-url");
const canvas = document.getElementById("pdf-canvas");
const context = canvas.getContext("2d");
let pdfDoc = null,
  pageNum = 1,
  scale = 1.5,
  pageRendering = false,
  pageNumPending = null;

// Load PDF Document
pdfjsLib
  .getDocument(url)
  .promise.then((pdfDoc_) => {
    pdfDoc = pdfDoc_;
    document.getElementById("page-count").textContent = pdfDoc.numPages;
    renderPage(pageNum);
  })
  .catch((error) => {
    console.error("Error loading PDF:", error);
  });

// Render the specified page
function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale: scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    page.render(renderContext).promise.then(() => {
      pageRendering = false;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });

    // Update page number display
    document.getElementById("page-num").textContent = num;
  });
}

// Handle page rendering in queue
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

// Go to the previous page
function onPrevPage() {
  if (pageNum <= 1) return;
  pageNum--;
  queueRenderPage(pageNum);
}

// Go to the next page
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  queueRenderPage(pageNum);
}

// Zoom in the PDF view
function zoomIn() {
  scale += 0.2;
  queueRenderPage(pageNum);
}

// Zoom out the PDF view
function zoomOut() {
  if (scale > 0.5) {
    scale -= 0.2;
    queueRenderPage(pageNum);
  }
}

// Event listeners for PDF viewer controls
document.getElementById("prevPage").addEventListener("click", onPrevPage);
document.getElementById("nextPage").addEventListener("click", onNextPage);
document.getElementById("zoomIn").addEventListener("click", zoomIn);
document.getElementById("zoomOut").addEventListener("click", zoomOut);
