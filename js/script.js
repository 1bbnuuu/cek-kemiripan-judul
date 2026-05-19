const BASE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNBbQLWjVBQIzXXxWt-VyxwgiyYiYCqv3WOx06jPeOQ8xrIWeAbHhfeADNV4SRDg/pub?output=csv";
const getSheetURL = (gid) => `${BASE_URL}&gid=${gid}`;

const dataURL = getSheetURL(1749465922);
const stopwordURL = getSheetURL(1400137647);
const kamusURL = getSheetURL(1802052867);

let stopwords = [];
let semuaData = [];
let kamusKoreksi = {};
const stemmer = new sastrawijs.Stemmer();


async function loadStopwords() {
    const res = await fetch(stopwordURL);
    const csv = await res.text();
    const parsed = Papa.parse(csv, { skipEmptyLines: true });
    stopwords = parsed.data.flat().map(k => k.toLowerCase().trim());
}

async function loadKamus() {
    const res = await fetch(kamusURL);
    const csv = await res.text();
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
    parsed.data.forEach(row => {
        kamusKoreksi[row.kata_asli.toLowerCase()] = row.kata_stem.toLowerCase();
    });
}

async function loadData() {
    const res = await fetch(dataURL);
    const csv = await res.text();
    const result = Papa.parse(csv, { header: true, skipEmptyLines: true });
    semuaData = result.data;
    tampilkanStatistik();
}

async function init() {
    await loadStopwords();
    await loadKamus();
    await loadData();
}
init();


function tampilkanStatistik() {
    let tahunArray = [];
    let prodiSet = new Set();
    semuaData.forEach(row => {
        const tahun = parseInt(row.Tahun);
        const prodi = row.Jurusan;
        if (!isNaN(tahun)) tahunArray.push(tahun);
        if (prodi && prodi.trim() !== "") prodiSet.add(prodi.trim());
    });

    document.getElementById("jmlhJudul").textContent = semuaData.length;
    document.getElementById("jmlhProdi").textContent = prodiSet.size;
    document.getElementById("rentangTahun").textContent = `${Math.min(...tahunArray)} - ${Math.max(...tahunArray)}`;
}


function casefolding(judul) {
    const tokens = judul
        .replace(/[^a-z0-9\s]/gi, "")
        .toLowerCase()
        .trim()
        .split(/\s+/);

    const filtered = tokens.filter(word => !stopwords.includes(word));

    // Ubah bagian ini:
    const result = [];
    filtered.forEach(word => {
        let corrected = kamusKoreksi[word] 
            ? kamusKoreksi[word] 
            : stemmer.stem(word);
        
        // Jika hasil koreksi mengandung spasi, pecah jadi beberapa token
        const subTokens = corrected.trim().split(/\s+/);
        subTokens.forEach(t => result.push(t));
    });

    return result;
}


function hitungTF(tokens) {
    const tf = {};
    tokens.forEach(token => {
        tf[token] = (tf[token] || 0)+1;
    });
    Object.keys(tf).forEach(k => {
        tf[k] = tf[k] / tokens.length;
    });
    return tf;
}

function hitungIDF(semuaTokens) {
    const N = semuaTokens.length;
    const df = {};

    semuaTokens.forEach(tokens => {
        const unik = new Set(tokens);
        unik.forEach(token => {
            df[token] = (df[token] || 0) + 1;
        });
    });

    const idf = {};
    Object.keys(df).forEach(token => {
        idf[token] = Math.log((N + 1) / (df[token] + 1)) + 1;
    });

    return idf;
}

function buatVektor(tokens, idf) {
    const tf = hitungTF(tokens);
    const vektor = {};
    Object.keys(tf).forEach(token => {
        vektor[token] = tf[token] * (idf[token] || Math.log((semuaData.length + 1) / (1 + 1)) + 1);
    });
    return vektor;
}


function cosineSimilarity(vektorA, vektorB) {
    const semuaKey = new Set([...Object.keys(vektorA), ...Object.keys(vektorB)]);

    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    semuaKey.forEach(key => {
        const a = vektorA[key] || 0;
        const b = vektorB[key] || 0;
        dotProduct += a * b;
        magA += a * a;
        magB += b * b;
    });

    if (magA === 0 || magB === 0) return 0;

    return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}


document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    cariJudul();
});

function cariJudul() {
    const inputJudul = document.getElementById("judulInput").value;
    const tokenInput = casefolding(inputJudul);

    // if (tokenInput.length === 0) return;
    if (tokenInput.length < 5){
        alert("Masukan judul lebih dari 5 kata")
        return;
    }
    if (tokenInput.length > 20){
        alert("Masukan judul kurang dari 15 kata")
    }

    const semuaTokens = semuaData.map(row => casefolding(row.Judul));

    const idf = hitungIDF(semuaTokens);

    const vektorInput = buatVektor(tokenInput, idf);

    const hasil = semuaData.map((row, i) => {
        const vektorDoc = buatVektor(semuaTokens[i], idf);
        const similarity = cosineSimilarity(vektorInput, vektorDoc);
        return { ...row, similarity, tokens: semuaTokens[i] };
    })
    .filter(row => row.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0,10)
    tampilkanHasil(hasil, tokenInput);
}

function tampilkanHasil(hasil, tokenInput) {
    let hasilBox = document.getElementById("hasilPencarian");

    if (!hasilBox) {
        hasilBox = document.createElement("div");
        hasilBox.id = "hasilPencarian";
        hasilBox.className = "mt-8 bg-white rounded-xl p-6 shadow-lg border border-slate-200";
        document.querySelector(".max-w-3xl").appendChild(hasilBox);
    }

    if (hasil.length === 0) {
        hasilBox.innerHTML = `
            <p class="text-red-500 font-semibold">Tidak ditemukan kemiripan</p>
        `;
        return;
    }

    const persenTertinggi = (hasil[0].similarity * 100).toFixed(2);

    let html = `
        <h3 class="font-bold text-lg mb-2">Hasil Kemiripan</h3>
        <!--<p class="text-sm text-slate-500 mb-1">Token input: <span class="text-blue-600">${tokenInput.join(", ")}</span></p>-->
        <p class="text-sm text-slate-500 mb-4">Kemiripan tertinggi: <span class="font-bold text-emerald-600">${persenTertinggi}%</span></p>
    `;

    hasil.forEach((row, index) => {
        const persen = (row.similarity * 100).toFixed(2);

        let badgeClass = "bg-emerald-100 text-emerald-700";
        if (persen >= 71) badgeClass = "bg-red-100 text-red-700";
        else if (persen >= 31) badgeClass = "bg-yellow-100 text-yellow-700";

        const params = new URLSearchParams({
            judul: row.Judul,
            penulis: row.Penulis || "-",
            nim: row.NIM || "-",
            tahun: row.Tahun || "-",
            jurusan: row.Jurusan || "-",
            file: row.File || "#",
            persen: persen,
            tokens: row.tokens.join(","),
            tokenInput: tokenInput.join(",")
        });

        html += `
            <a href="detail.html?${params.toString()}" class="block border-b py-3 flex items-start justify-between gap-4 hover:bg-slate-50 rounded-lg px-2 transition-colors cursor-pointer">
                <div class="flex-1">
                    <div class="font-semibold text-slate-800">${row.Judul}</div>
                    <!--<div class="text-xs text-slate-400 mt-1">${row.Jurusan} · ${row.Tahun}</div>-->
                    <div class="text-xs text-slate-400 mt-1">Token: ${row.tokens.join(", ")}</div>
                </div>
                <div class="flex-shrink-0 flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-sm font-bold ${badgeClass}">
                        ${persen}%
                    </span>
                    <i class="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                </div>
            </a>
        `;
    });

    hasilBox.innerHTML = html;
}