import { ayatSurat, semuaSurat, suratTertentu } from './api/api.js';

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

        const renderSurahs = (surahs) => {
            surahListContainer.innerHTML = '';
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
                if (surahType) surahType.textContent = surah.type;
                if (selectItem) selectItem.href = `surat.html?number=${surah.number}`;

                surahListContainer.appendChild(surahItem);
            });
        };

        renderSurahs(surahs);
        
        document.getElementById('sort-dropdown').addEventListener('change', (event) => {
            const sortOrder = event.target.value;
            let sortedSurahs;

            if (sortOrder === 'asc') {
                sortedSurahs = [...surahs].sort((a, b) => a.number - b.number);
            } else if (sortOrder === 'desc') {
                sortedSurahs = [...surahs].sort((a, b) => b.number - a.number);
            }

            renderSurahs(sortedSurahs);
        });

        document.getElementById('search-input').addEventListener('input', (event) => {
            const searchQuery = event.target.value.toLowerCase();
            const filteredSurahs = surahs.filter((surah) => 
                surah.name.toLowerCase().includes(searchQuery) || 
                surah.translation.toLowerCase().includes(searchQuery)
            );

            renderSurahs(filteredSurahs);
        });

        document.getElementById('type-dropdown').addEventListener('change', (event) => {
            const typeFilter = event.target.value;
            let filteredSurahs;
        
            if (typeFilter === 'makkiyah') {
                filteredSurahs = surahs.filter(surah => surah.revelation && surah.revelation.toLowerCase() === 'makkiyah');
            } else if (typeFilter === 'madaniyah') {
                filteredSurahs = surahs.filter(surah => surah.revelation && surah.revelation.toLowerCase() === 'madaniyah');
            } else {
                filteredSurahs = surahs;
            }
            
            renderSurahs(filteredSurahs);
        });
        
        

    } catch (error) {
        console.error('Gagal menampilkan daftar surat:', error);
    }
}

async function Surat() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const nomorSurah = urlParams.get('number');

        if (!nomorSurah) {
            throw new Error('Nomor surat tidak ditemukan di URL.');
        }

        const surah = await suratTertentu(nomorSurah);

        const surahContainer = document.getElementById('surah-info');
        const surahInfoTemplate = document.getElementById('surah-info-template');

        const surahInfo = surahInfoTemplate.content.cloneNode(true);
        surahInfo.querySelector('.title').textContent = surah.name;
        surahInfo.querySelector('.surah-translation').textContent = surah.translation;
        surahInfo.querySelector('.surah-description').textContent = surah.description;
        surahInfo.querySelector('.read-button').onclick = () => {
            window.location.href = `bacaSurat.html?number=${surah.number}`;
        };

        surahContainer.appendChild(surahInfo);
    } catch (error) {
        console.error('Gagal menampilkan surat:', error);
    }
}


async function BacaSurat() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const nomorSurah = urlParams.get('number');

        if (!nomorSurah) {
            throw new Error('Nomor surat tidak ditemukan di URL.');
        }

        console.log('Nomor surat dari URL:', nomorSurah);

        const surah = await suratTertentu(nomorSurah);
        const ayatList = await ayatSurat(nomorSurah); 

        console.log('Data surat:', surah); 
        console.log('Respons API untuk ayat surat:', ayatList); 

        const surahContainer = document.getElementById('baca-surat');
        const ayatTemplate = document.getElementById('ayat-template');

        const surahTitle = document.getElementById('title');
        surahTitle.className = 'surah-title';
        surahTitle.textContent = `Surah ${surah.name} (${surah.translation})`;
        surahContainer.appendChild(surahTitle);

        ayatList.forEach((ayat) => {
            const ayatElement = ayatTemplate.content.cloneNode(true);

            ayatElement.querySelector('.ayat-number').textContent = `Ayat ${ayat.number.inSurah}`;
            ayatElement.querySelector('.ayat-arab').textContent = ayat.arab;
            ayatElement.querySelector('.ayat-translation').textContent = `Terjemahan: ${ayat.translation}`;

            surahContainer.appendChild(ayatElement);
        });
    } catch (error) {
        console.error('Gagal menampilkan surat:', error);

        const surahContainer = document.getElementById('baca-surat');
        surahContainer.innerHTML = `<p>${error.message}</p>`;
    }
}


if (document.getElementById('surah-list')) {
    SemuaSurat();
}
if (document.getElementById('surah-info')) {
    Surat();
}
if (document.getElementById('baca-surat')) {
    BacaSurat();
}
