const BASE_URL = 'http://localhost:3005'; 

async function semuaSurat(){
    try {
        const response = await fetch(`${BASE_URL}/surahs`);
        if (!response.ok) throw new Error('Gagal mendapatkan daftar surat.');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function suratTertentu(nomorSurah){
    try {
        const response = await fetch(`${BASE_URL}/surahs/${nomorSurah}`);
        if (!response.ok) throw new Error('Gagal mendapatkan surat yang diinginkan.');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function ayatSurat(nomorSurah){
    try {
        const response = await fetch(`${BASE_URL}/surahs/${nomorSurah}/ayahs`);
        if (!response.ok) throw new Error('Gagal mendapatkan surat yang diinginkan.');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function ayatSuratSpesifik(){
    try {
        const response = await fetch(`${BASE_URL}/surahs/${nomorSurah}/ayahs/${nomorAyat}`);
        if (!response.ok) throw new Error('Gagal mendapatkan ayat yang diinginkan.');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function ayatSuratRandom(){
    try {
        const response = await fetch(`${BASE_URL}/random`);
        if (!response.ok) throw new Error('Gagal mendapatkan surat yang diinginkan.');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export {ayatSurat, ayatSuratRandom, ayatSuratSpesifik, suratTertentu, semuaSurat};