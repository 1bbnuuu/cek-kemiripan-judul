const infoURL = getSheetURL(1087847297);

let lastUpdated = '';

async function loadInfo() {
    try {
        const res = await fetch(infoURL);
        const csv = await res.text();
        const parsed = Papa.parse(csv, { skipEmptyLines: true });
        lastUpdated = parsed.data[0]?.[0] || '';
        dataUpdate();
    } catch (e) {
        console.error('Gagal memuat info update:', e);
    }
}

function dataUpdate() {
    const el = document.getElementById('lastUpdated');
    if (el && lastUpdated) {
        el.textContent = `Terakhir diperbarui: ${lastUpdated}`;
    }
}

async function init() {
    await loadInfo();
}
init();