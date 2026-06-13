function caseFolding(text) {
return text.toLowerCase();
}

function tokenize(text) {
return text
    .replace(/[^a-z0-9\s]/g, "") 
    .split(/\s+/)                 
    .filter(t => t.length > 0);  
}

function preprocess(text) {
return tokenize(caseFolding(text));
}


function computeTF(tokens) {
const tf = {};
tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
});
return tf;
}

function computeIDF(semuaDokumen) {
const N = semuaDokumen.length;
const df = {};

semuaDokumen.forEach(tokens => {
    const unik = new Set(tokens);
    unik.forEach(token => {
    df[token] = (df[token] || 0) + 1;
    });
});

const idf = {};
Object.keys(df).forEach(token => {
    const docFreq = df[token] || 1;
    idf[token] = Math.log10(N / docFreq) + 1;
});

return idf;
}

function computeTFIDF(tokens, idf) {
const tf = computeTF(tokens);
const tfidf = {};
Object.keys(tf).forEach(token => {
    tfidf[token] = tf[token] * (idf[token] !== undefined ? idf[token] : 1);
});
return tfidf;
}

function cosineSimilarity(vecA, vecB) {
const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

let dotProduct = 0;
let magnitudeA = 0;
let magnitudeB = 0;

allTerms.forEach(term => {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
});

magnitudeA = Math.sqrt(magnitudeA);
magnitudeB = Math.sqrt(magnitudeB);

if (magnitudeA === 0 || magnitudeB === 0) return 0;

return dotProduct / (magnitudeA * magnitudeB);
}

const judulInput = 
"aplikasi jadwal laboratorium stmik palangkaraya guna metode algoritma genetika";

const dataDatabase = [
    "terap metode algoritma genetika jadwal tugas akhir program studi teknik informatika stmik palangkaraya"
];

const tokensInput = preprocess(judulInput);
console.log("Token Input:", tokensInput);
const kumpulanTokensDatabase = dataDatabase.map((judul, index) => {
const tokens = preprocess(judul);
console.log(`Token Dokumen ${index + 1}:`, tokens);
return tokens;
});

const semuaKoleksiDokumen = [tokensInput, ...kumpulanTokensDatabase];

const globalIDF = computeIDF(semuaKoleksiDokumen);

const tfidfInput = computeTFIDF(tokensInput, globalIDF);


kumpulanTokensDatabase.forEach((tokensDoc, index) => {
const tfidfDoc = computeTFIDF(tokensDoc, globalIDF);
const similarity = cosineSimilarity(tfidfInput, tfidfDoc);
const persen = (similarity * 100).toFixed(2);

console.log(`Kemiripan dengan Judul Pembanding ${index + 1} (D${index + 1}) : ${persen}%`);
});