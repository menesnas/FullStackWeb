// Personel verileri için local array
let personeller = [];
let editIndex = null;

const form = document.getElementById('personelForm');
const idInput = document.getElementById('id');
const adInput = document.getElementById('ad');
const soyadInput = document.getElementById('soyad');
const tcInput = document.getElementById('tc');
const telefonInput = document.getElementById('telefon');
const tableBody = document.querySelector('#personelTable tbody');
const searchInput = document.getElementById('searchInput');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const generateIdBtn = document.getElementById('generateId');

function generateId() {
  return (
    1000000 +
    Math.floor(Math.random() * 9000000)
  ).toString();
}
generateIdBtn.onclick = () => {
  idInput.value = generateId();
};

function resetForm() {
  form.reset();
  idInput.value = '';
  editIndex = null;
  form.querySelector('#submitBtn').textContent = 'Gönder';
}

// doğrulama
function validateForm() {
  if (!adInput.value.trim() || !soyadInput.value.trim()) return false;
  if (!/^\d{11}$/.test(tcInput.value)) return false;
  if (telefonInput.value && !/^\d{10,11}$/.test(telefonInput.value)) return false;
  return true;
}

// güncelle
function renderTable(data = personeller) {
  tableBody.innerHTML = '';
  data.forEach((p, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.id}</td>
      <td>${p.ad}</td>
      <td>${p.soyad}</td>
      <td>${p.tc}</td>
      <td>${p.telefon}</td>
      <td>
        <button onclick="editPersonel(${i})">✏️</button>
        <button onclick="deletePersonel(${i})">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

form.onsubmit = function (e) {
  e.preventDefault();
  const warn = document.getElementById('formWarn');
  if (!validateForm()) {
    warn.textContent = 'Lütfen tüm alanları eksiksiz doldurun!';
    warn.classList.remove('d-none');
    return;
  }
  warn.textContent = '';
  warn.classList.add('d-none');
  const yeni = {
    id: idInput.value || generateId(),
    ad: adInput.value.trim(),
    soyad: soyadInput.value.trim(),
    tc: tcInput.value.trim(),
    telefon: telefonInput.value.trim(),
  };
  if (editIndex !== null) {
    personeller[editIndex] = yeni;
  } else {
    personeller.push(yeni);
  }
  renderTable();
  resetForm();
};

// edit
window.editPersonel = function (i) {
  const p = personeller[i];
  idInput.value = p.id;
  adInput.value = p.ad;
  soyadInput.value = p.soyad;
  tcInput.value = p.tc;
  telefonInput.value = p.telefon;
  editIndex = i;
  form.querySelector('#submitBtn').textContent = 'Düzenle';
};

window.deletePersonel = function (i) {
  if (confirm('Kaydı silmek istediğinize emin misiniz?')) {
    personeller.splice(i, 1);
    renderTable();
    resetForm();
  }
};

deleteAllBtn.onclick = function () {
  if (confirm('Tüm kayıtlar silinsin mi?')) {
    personeller = [];
    renderTable();
    resetForm();
  }
};

searchInput.oninput = function () {
  const q = searchInput.value.trim().toLowerCase();
  renderTable(
    personeller.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.ad.toLowerCase().includes(q) ||
        p.soyad.toLowerCase().includes(q) ||
        p.tc.includes(q)
    )
  );
};

// sayfa ilk açılırken
resetForm();
renderTable();
