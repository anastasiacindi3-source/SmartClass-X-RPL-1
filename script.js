if (!window.location.pathname.includes("login.html")) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
    }
}
// AUTO LOGIN CHECK
if (localStorage.getItem("isLoggedIn") === "true") {
    if (window.location.pathname.includes("login.html")) {
        window.location.href = "dashboard.html";
    }
}

// LOGIN SYSTEM
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMsg = document.getElementById("errorMsg");

        // VALIDASI
        if (username === "" || password === "") {
            errorMsg.textContent = "Username dan password harus diisi!";
            return;
        }

        // LOGIN SEDERHANA
        if (username === "admin" && password === "123") {
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "dashboard.html";
        } else {
            errorMsg.textContent = "Username atau password salah!";
        }
    });
}
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}
// ===== DATA SISWA =====
let siswa = JSON.parse(localStorage.getItem("dataSiswa")) || [];

// TAMPILKAN DATA
function tampilkanSiswa() {
    const tabel = document.getElementById("tabelSiswa");
    if (!tabel) return;

    tabel.innerHTML = "";

    for (let i = 0; i < siswa.length; i++) {
        tabel.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${siswa[i]}</td>
                <td><button onclick="hapusSiswa(${i})">Hapus</button></td>
            </tr>
        `;
    }

    localStorage.setItem("dataSiswa", JSON.stringify(siswa));
}

// TAMBAH SISWA
function tambahSiswa() {
    const nama = document.getElementById("namaSiswa").value;
    const error = document.getElementById("errorSiswa");

    if (nama === "") {
        error.textContent = "Nama siswa tidak boleh kosong!";
        return;
    }

    siswa.push(nama);
    document.getElementById("namaSiswa").value = "";
    error.textContent = "";
    tampilkanSiswa();
}

// HAPUS SISWA
function hapusSiswa(index) {
    siswa.splice(index, 1);
    tampilkanSiswa();
}

tampilkanSiswa();
// ===== DATA NILAI =====
let nilaiSiswa = JSON.parse(localStorage.getItem("dataNilai")) || [];

// ISI DROPDOWN SISWA
function isiDropdown() {
    const dropdown = document.getElementById("pilihSiswa");
    if (!dropdown) return;

    dropdown.innerHTML = "";

    for (let i = 0; i < siswa.length; i++) {
        dropdown.innerHTML += `<option value="${siswa[i]}">${siswa[i]}</option>`;
    }
}

isiDropdown();

// SIMPAN NILAI
function simpanNilai() {
    const nama = document.getElementById("pilihSiswa").value;
    const tugas = parseFloat(document.getElementById("tugas").value);
    const ulangan = parseFloat(document.getElementById("ulangan").value);
    const uts = parseFloat(document.getElementById("uts").value);
    const uas = parseFloat(document.getElementById("uas").value);
    const error = document.getElementById("errorNilai");

    // VALIDASI
    if (isNaN(tugas) || isNaN(ulangan) || isNaN(uts) || isNaN(uas)) {
        error.textContent = "Semua nilai harus diisi!";
        return;
    }

    if (tugas > 100 || ulangan > 100 || uts > 100 || uas > 100) {
        error.textContent = "Nilai maksimal 100!";
        return;
    }

    // PERHITUNGAN OTOMATIS
    let rata = (tugas + ulangan + uts + uas) / 4;

    // PERCABANGAN PREDIKAT
    let predikat = "";
    if (rata >= 90) {
        predikat = "A";
    } else if (rata >= 80) {
        predikat = "B";
    } else if (rata >= 70) {
        predikat = "C";
    } else {
        predikat = "D";
    }

    // SIMPAN KE ARRAY
    nilaiSiswa.push({
        nama: nama,
        tugas: tugas,
        ulangan: ulangan,
        uts: uts,
        uas: uas,
        rata: rata.toFixed(2),
        predikat: predikat
    });

    localStorage.setItem("dataNilai", JSON.stringify(nilaiSiswa));

    error.textContent = "";
    alert("Nilai berhasil disimpan!");
}
// TAMPILKAN REKAP + RANKING
function tampilkanRekap() {
    const tabel = document.getElementById("tabelRekap");
    if (!tabel) return;

    tabel.innerHTML = "";

    // SORTING TERTINGGI KE TERENDAH
    nilaiSiswa.sort(function(a, b) {
        return b.rata - a.rata;
    });

    for (let i = 0; i < nilaiSiswa.length; i++) {
        tabel.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${nilaiSiswa[i].nama}</td>
                <td>${nilaiSiswa[i].rata}</td>
                <td>${nilaiSiswa[i].predikat}</td>
            </tr>
        `;
    }
}

tampilkanRekap();