const params = new URLSearchParams(window.location.search);

const judul    = params.get("judul")    || "-";
const penulis  = params.get("penulis")  || "-";
const nim      = params.get("nim")      || "-";
const tahun    = params.get("tahun")    || "-";
const jurusan  = params.get("jurusan")  || "-";
const file     = params.get("file")     || "#";
const persen   = parseFloat(params.get("persen") || "0");
const tokens   = params.get("tokens")  ? params.get("tokens").split(",") : [];
const tokenInput = params.get("tokenInput") ? params.get("tokenInput").split(",") : [];

document.getElementById("detailJudul").textContent   = judul;
document.getElementById("detailPenulis").textContent = penulis;
document.getElementById("detailTahun").textContent   = tahun;
document.getElementById("detailJurusan").textContent = jurusan;
document.getElementById("detailNIM").textContent     = nim;
document.getElementById("detailFile").href           = file;

const tokenSama = tokens.filter(t => tokenInput.includes(t));

const elSama = document.getElementById("detailTokenSama");

if (tokenSama.length === 0) {
elSama.innerHTML = `<p class="text-sm text-slate-400">Tidak ada kata yang sama</p>`;
} else {
elSama.innerHTML = tokenSama.map(t =>
    `<span class="px-3 py-1 border-2 border-blue-300 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">${t}</span>`
).join("");
}

const circle  = document.getElementById("gaugeCircle");
const circumference = 534.07;

let warna, bgBadge, statusText, statusDesc;

if (persen >= 71) {
    warna     = "#ef4444";
    bgBadge   = "bg-red-500";
    statusText = "Tingkat Kemiripan Tinggi";
    statusDesc = `Judul memiliki kemiripan <strong class="text-red-600">${persen}%</strong> dengan database. Sangat disarankan untuk mengubah judul agar lebih unik.`;
} else if (persen >= 31) {
    warna     = "#f97316";
    bgBadge   = "bg-orange-500";
    statusText = "Tingkat Kemiripan Sedang";
    statusDesc = `Judul memiliki kemiripan <strong class="text-orange-600">${persen}%</strong> dengan database. Disarankan revisi pada beberapa kata kunci agar lebih unik.`;
} else {
    warna     = "#22c55e";
    bgBadge   = "bg-emerald-500";
    statusText = "Tingkat Kemiripan Rendah";
    statusDesc = `Judul memiliki kemiripan <strong class="text-emerald-600">${persen}%</strong> dengan database. Judul cukup unik dan orisinal.`;
}

setTimeout(() => {
    const offset = circumference - (persen / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = warna;
}, 100);

document.getElementById("gaugeText").textContent   = `${persen}%`;
document.getElementById("gaugeText").style.color   = warna;
document.getElementById("statusBadge").className  += ` ${bgBadge}`;
document.getElementById("statusText").textContent  = statusText;
document.getElementById("statusDesc").innerHTML    = statusDesc;