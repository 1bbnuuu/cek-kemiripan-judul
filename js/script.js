const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTkbyjy0mm-DEBQ4dTqrB1MHz2aPQv5Gz-GISsuvf1_yQwA4D6xI_AxUZj55xBNg8qoUtbfc_vfHB5-/pub?output=csv";

fetch(url)
    .then(res => res.text())
    .then(csv => {

        const result = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
        });

        const data = result.data;

        let tahunArray = [];
        let prodiSet = new Set();

        data.forEach(row => {
        const tahun = parseInt(row.tahun);
        const prodi = row.Prodi;

        if (!isNaN(tahun)) {
            tahunArray.push(tahun);
        }

        if (prodi && prodi.trim() !== "") {
            prodiSet.add(prodi.trim());
        }
        });

        const totalJudul = data.length;
        const totalProdi = prodiSet.size;
        const minTahun = Math.min(...tahunArray);
        const maxTahun = Math.max(...tahunArray);

        document.getElementById("jmlhJudul").textContent = totalJudul;
        document.getElementById("jmlhProdi").textContent = totalProdi;
        document.getElementById("rentangTahun").textContent = `${minTahun} - ${maxTahun}`;
    })
    .catch(err => console.error(err));
