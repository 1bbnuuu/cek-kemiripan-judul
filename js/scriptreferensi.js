const BASE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNBbQLWjVBQIzXXxWt-VyxwgiyYiYCqv3WOx06jPeOQ8xrIWeAbHhfeADNV4SRDg/pub?output=csv";
const getSheetURL = (gid) => `${BASE_URL}&gid=${gid}`;
const dataURL = getSheetURL(1749465922);

let semuaData = [];

async function loadData() {
  const res = await fetch(dataURL);
  const csv = await res.text();
  const result = Papa.parse(csv, { header: true, skipEmptyLines: true });
  semuaData = result.data;
  isiDropdownJurusan();
}

function isiDropdownJurusan() {
  const select = document.getElementById("filterJurusan");
  const prodiSet = new Set();

  semuaData.forEach(row => {
    if (row.Jurusan) prodiSet.add(row.Jurusan.trim());
  });

  [...prodiSet].sort().forEach(prodi => {
    const opt = document.createElement("option");
    opt.value = prodi;
    opt.textContent = prodi;
    select.appendChild(opt);
  });
}

function cariReferensi() {
  const tahun   = document.getElementById("filterTahun").value.trim();
  const jurusan = document.getElementById("filterJurusan").value.trim();
  const nama    = document.getElementById("filterNama").value.trim().toLowerCase();

  let hasil = semuaData.filter(row => {
    const cocokTahun   = !tahun || row.Tahun?.trim() === tahun;
    const cocokJurusan = !jurusan || row.Jurusan?.trim() === jurusan;
    const cocokNama    = !nama || row.Penulis?.toLowerCase().includes(nama);
    return cocokTahun && cocokJurusan && cocokNama;
  });

  hasil = hasil.slice(0, 20);

  tampilkanHasil(hasil);
}

function tampilkanHasil(hasil) {
  const box = document.getElementById("hasilCari");
  const info = document.getElementById("infoHasil");

  if (hasil.length === 0) {
    info.innerHTML = "";
    box.innerHTML = `
      <div class="text-center py-16 text-slate-400">
        <i class="fa-solid fa-folder-open text-5xl mb-4"></i>
        <p class="font-medium">Tidak ada hasil ditemukan</p>
      </div>`;
    return;
  }

  info.innerHTML = `Menampilkan <b>${hasil.length}</b> hasil`;

  let html = "";

  hasil.forEach(row => {
    html += `
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-slate-200">

        <div class="flex justify-between gap-4">

          <div>
            <h3 class="font-semibold text-slate-800 mb-2">${row.Judul}</h3>

            <div class="flex flex-wrap gap-3 text-sm text-slate-500">
              <span><i class="fa-solid fa-user mr-1"></i>${row.Penulis || '-'}</span>
              <span><i class="fa-solid fa-building mr-1"></i>${row.Jurusan || '-'}</span>
              <span><i class="fa-solid fa-calendar mr-1"></i>${row.Tahun || '-'}</span>
            </div>
          </div>

          ${row.File && row.File !== '-' ? `
          <a href="${row.File}" target="_blank"
            class="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100">
            <i class="fa-solid fa-link"></i>
          </a>` : ""}

        </div>

      </div>`;
  });

  box.innerHTML = html;
}

loadData();