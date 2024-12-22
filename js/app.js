import { ayatSurat, semuaSurat, suratTertentu } from './api/api.js';

// async function SemuaSurat() {
//     try {
//         const surahs = await semuaSurat(); 
//         const surahListContainer = document.getElementById('surah-list');
//         const surahTemplate = document.getElementById('surah-template').content;

//         surahs.forEach((surah) => {
//             const surahItem = surahTemplate.cloneNode(true);

//             surahItem.querySelector('.surah-number').textContent = surah.number;
//             surahItem.querySelector('.surah-name').textContent = surah.name;
//             surahItem.querySelector('.surah-translation').textContent = surah.translation;
//             surahItem.querySelector('.select-item').href = `surat.html?number=${surah.number}`;

//             surahListContainer.appendChild(surahItem);
//         });
//     } catch (error) {
//         console.error('Gagal menampilkan daftar surat:', error);
//     }
// }

async function SemuaSurat() {
    try {
        const surahs = await semuaSurat(); 
        const surahListContainer = document.getElementById('surah-list');
        const surahTemplate = document.getElementById('surah-template');

        if (!surahTemplate) {
            console.error('Template surat tidak ditemukan!');
            return;
        }

        const surahTemplateContent = surahTemplate.content;

        // Fungsi untuk menampilkan surat ke dalam container
        const renderSurahs = (surahs) => {
            surahListContainer.innerHTML = ''; // Clear existing list
            surahs.forEach((surah) => {
                const surahItem = surahTemplateContent.cloneNode(true);

                const surahNumber = surahItem.querySelector('.surah-number');
                const surahName = surahItem.querySelector('.surah-name');
                const surahTranslation = surahItem.querySelector('.surah-translation');
                const surahType = surahItem.querySelector('.surah-type');
                const selectItem = surahItem.querySelector('.select-item');

                if (surahNumber) surahNumber.textContent = surah.number;
                if (surahName) surahName.textContent = surah.name;
                if (surahTranslation) surahTranslation.textContent = surah.translation;
                if (surahType) surahType.textContent = surah.type; // Madaniyah/Makiyah
                if (selectItem) selectItem.href = `surat.html?number=${surah.number}`;

                surahListContainer.appendChild(surahItem);
            });
        };

        // Render initial list
        renderSurahs(surahs);

        // Handle sorting when dropdown value changes
        document.getElementById('sort-dropdown').addEventListener('change', (event) => {
            const sortOrder = event.target.value;
            let sortedSurahs;

            if (sortOrder === 'asc') {
                sortedSurahs = [...surahs].sort((a, b) => a.number - b.number);
            } else if (sortOrder === 'desc') {
                sortedSurahs = [...surahs].sort((a, b) => b.number - a.number);
            }

            // Render the sorted list
            renderSurahs(sortedSurahs);
        });

        // Handle search input
        document.getElementById('search-input').addEventListener('input', (event) => {
            const searchQuery = event.target.value.toLowerCase();
            const filteredSurahs = surahs.filter((surah) => 
                surah.name.toLowerCase().includes(searchQuery) || 
                surah.translation.toLowerCase().includes(searchQuery)
            );

            // Render the filtered list based on search query
            renderSurahs(filteredSurahs);
        });

        // Handle type filter
        document.getElementById('type-dropdown').addEventListener('change', (event) => {
            const typeFilter = event.target.value;
            let filteredSurahs;
        
            // Menambahkan pengecekan untuk 'surah.revelation' dan membandingkan dengan nilai yang diinginkan
            if (typeFilter === 'makkiyah') {
                filteredSurahs = surahs.filter(surah => surah.revelation && surah.revelation.toLowerCase() === 'makkiyah');
            } else if (typeFilter === 'madaniyah') {
                filteredSurahs = surahs.filter(surah => surah.revelation && surah.revelation.toLowerCase() === 'madaniyah');
            } else {
                filteredSurahs = surahs; // No filter applied
            }
        
            // Render the filtered list based on revelation filter
            renderSurahs(filteredSurahs);
        });
        
        

    } catch (error) {
        console.error('Gagal menampilkan daftar surat:', error);
    }
}

async function Surat() {
    try {
        // Ambil nomor surat dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const nomorSurah = urlParams.get('number');

        if (!nomorSurah) {
            throw new Error('Nomor surat tidak ditemukan di URL.');
        }

        // Ambil data surat berdasarkan nomor
        const surah = await suratTertentu(nomorSurah);

        // Ambil container dan template
        const surahContainer = document.getElementById('surah-info');
        const surahInfoTemplate = document.getElementById('surah-info-template');

        // Clone template dan isi data
        const surahInfo = surahInfoTemplate.content.cloneNode(true);
        surahInfo.querySelector('.title').textContent = surah.name;
        surahInfo.querySelector('.surah-translation').textContent = surah.translation;
        surahInfo.querySelector('.surah-description').textContent = surah.description;
        surahInfo.querySelector('.read-button').onclick = () => {
            window.location.href = `bacaSurat.html?number=${surah.number}`;
        };

        // Tambahkan elemen ke container
        surahContainer.appendChild(surahInfo);
    } catch (error) {
        console.error('Gagal menampilkan surat:', error);
    }
}


async function BacaSurat() {
    try {
        // Ambil parameter `number` dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const nomorSurah = urlParams.get('number');

        if (!nomorSurah) {
            throw new Error('Nomor surat tidak ditemukan di URL.');
        }

        console.log('Nomor surat dari URL:', nomorSurah); // Debugging

        // Panggil API dengan nomor surat
        const surah = await suratTertentu(nomorSurah); // Mengambil data surat
        const ayatList = await ayatSurat(nomorSurah); // Mengambil daftar ayat

        console.log('Data surat:', surah); // Debugging
        console.log('Respons API untuk ayat surat:', ayatList); // Debugging

        // Ambil container dan template
        const surahContainer = document.getElementById('baca-surat');
        const ayatTemplate = document.getElementById('ayat-template');

        // Kosongkan kontainer sebelum menambahkan konten
        // Tampilkan nama surat di bagian atas
        const surahTitle = document.getElementById('title');
        surahTitle.className = 'surah-title';
        surahTitle.textContent = `Surah ${surah.name} (${surah.translation})`;
        surahContainer.appendChild(surahTitle);

        // Iterasi melalui setiap ayat dan tambahkan ke halaman
        ayatList.forEach((ayat) => {
            const ayatElement = ayatTemplate.content.cloneNode(true);

            // Isi elemen dengan data ayat
            ayatElement.querySelector('.ayat-number').textContent = `Ayat ${ayat.number.inSurah}`;
            ayatElement.querySelector('.ayat-arab').textContent = ayat.arab;
            ayatElement.querySelector('.ayat-translation').textContent = `Terjemahan: ${ayat.translation}`;

            // Tambahkan elemen ke container
            surahContainer.appendChild(ayatElement);
        });
    } catch (error) {
        console.error('Gagal menampilkan surat:', error);

        // Tampilkan pesan error di halaman
        const surahContainer = document.getElementById('baca-surat');
        surahContainer.innerHTML = `<p>${error.message}</p>`;
    }
}





// Jalankan hanya pada halaman yang relevan
if (document.getElementById('surah-list')) {
    SemuaSurat();
}
if (document.getElementById('surah-info')) {
    Surat();
}
if (document.getElementById('baca-surat')) {
    BacaSurat();
}
