document.addEventListener('DOMContentLoaded', function () {

  const forma = document.getElementById('contact-form');
  if (!forma) return;

  const siustiMygtukas = forma.querySelector('button[type="submit"]');
  const isvalytiMygtukas = document.getElementById('isvalyti-btn');
  const telefonas = document.getElementById('telefonas');
  const klausimai = ['klausimas1', 'klausimas2', 'klausimas3'];

  /* Rezultatų blokas formos apačioje */
  const rezultatai = document.createElement('div');
  rezultatai.id = 'formos-rezultatai';
  rezultatai.className = 'info-box mt-4';
  rezultatai.style.display = 'none';
  forma.insertAdjacentElement('afterend', rezultatai);

  /* Validacijos taisyklės */
  const raidesRegex = /^\p{L}+$/u;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const telefonoRegex = /^\+370 6\d{2} \d{5}$/;

  const taisykles = {
    vardas: function (reiksme) {
      if (reiksme === '') return 'Įveskite vardą';
      if (!raidesRegex.test(reiksme)) return 'Vardą gali sudaryti tik raidės';
      return '';
    },
    pavarde: function (reiksme) {
      if (reiksme === '') return 'Įveskite pavardę';
      if (!raidesRegex.test(reiksme)) return 'Pavardę gali sudaryti tik raidės';
      return '';
    },
    email: function (reiksme) {
      if (reiksme === '') return 'Įveskite el. pašto adresą';
      if (!emailRegex.test(reiksme)) return 'Neteisingas el. pašto formatas (pvz. vardas@pastas.lt)';
      return '';
    },
    telefonas: function (reiksme) {
      if (reiksme === '' || reiksme === '+370') return 'Įveskite telefono numerį';
      if (!telefonoRegex.test(reiksme)) return 'Numeris turi būti formato +370 6xx xxxxx';
      return '';
    },
    adresas: function (reiksme) {
      if (reiksme === '') return 'Įveskite adresą';
      return '';
    }
  };

  klausimai.forEach(function (id) {
    taisykles[id] = function (reiksme) {
      const skaicius = Number(reiksme);
      if (!Number.isInteger(skaicius) || skaicius < 1 || skaicius > 10) return 'Įvertinimas turi būti nuo 1 iki 10';
      return '';
    };
  });

  const laukuId = Object.keys(taisykles);
  const paliesti = {};

  /* Klaidų pranešimų elementai po laukais */
  laukuId.forEach(function (id) {
    const laukas = document.getElementById(id);
    const klaida = document.createElement('div');
    klaida.className = 'klaidos-tekstas';
    klaida.id = id + '-klaida';
    laukas.insertAdjacentElement('afterend', klaida);
  });

  /* Vieno lauko tikrinimas */
  function tikrintiLauka(id, rodytiKlaida) {
    const laukas = document.getElementById(id);
    const klaida = document.getElementById(id + '-klaida');
    const pranesimas = taisykles[id](laukas.value.trim());

    if (rodytiKlaida) {
      klaida.textContent = pranesimas;
      laukas.classList.toggle('is-invalid', pranesimas !== '');
      laukas.classList.toggle('is-valid', pranesimas === '' && laukas.type !== 'range');
    }

    return pranesimas === '';
  }

  /* Visos formos tikrinimas ir „Siųsti“ mygtuko būsena */
  function tikrintiForma() {
    let visiTeisingi = true;
    laukuId.forEach(function (id) {
      if (!tikrintiLauka(id, paliesti[id] === true)) {
        visiTeisingi = false;
      }
    });
    siustiMygtukas.disabled = !visiTeisingi;
    return visiTeisingi;
  }

  /* Validacija realiu laiku */
  laukuId.forEach(function (id) {
    const laukas = document.getElementById(id);

    laukas.addEventListener('input', function () {
      paliesti[id] = true;
      tikrintiForma();
    });

    laukas.addEventListener('blur', function () {
      paliesti[id] = true;
      tikrintiForma();
    });
  });

  /* Slankiklių reikšmių rodymas */
  klausimai.forEach(function (id) {
    const slankiklis = document.getElementById(id);
    const reiksme = document.getElementById(id + '-reiksme');

    slankiklis.addEventListener('input', function () {
      reiksme.textContent = slankiklis.value;
    });
  });

  /* Telefono numerio formatavimas */
  telefonas.setAttribute('maxlength', '14');
  telefonas.setAttribute('inputmode', 'numeric');
  telefonas.setAttribute('placeholder', '+370 6xx xxxxx');

  function formatuotiTelefona() {
    let skaitmenys = telefonas.value.replace(/\D/g, '');

    while (skaitmenys.startsWith('370')) {
      skaitmenys = skaitmenys.slice(3);
    }

    if (skaitmenys.startsWith('8')) {
      skaitmenys = skaitmenys.slice(1);
    }

    skaitmenys = skaitmenys.slice(0, 8);

    if (skaitmenys.length <= 3) {
      telefonas.value = '+370 ' + skaitmenys;
    } else {
      telefonas.value = '+370 ' + skaitmenys.slice(0, 3) + ' ' + skaitmenys.slice(3);
    }
  }

  telefonas.addEventListener('focus', function () {
    if (telefonas.value === '') {
      telefonas.value = '+370 ';
    }
  });

  telefonas.addEventListener('input', function () {
    formatuotiTelefona();
    tikrintiForma();
  });

  telefonas.addEventListener('blur', function () {
    if (telefonas.value.trim() === '+370') {
      telefonas.value = '';
    }
    tikrintiForma();
  });

  tikrintiForma();

  /* Apsauga nuo HTML įterpimo */
  function apsaugoti(tekstas) {
    const div = document.createElement('div');
    div.textContent = tekstas;
    return div.innerHTML;
  }

  /* Formos pateikimas */
  forma.addEventListener('submit', function (e) {
    e.preventDefault();

    laukuId.forEach(function (id) {
      paliesti[id] = true;
    });

    if (!tikrintiForma()) return;

    /* Duomenų surinkimas į objektą */
    const duomenys = {
      vardas: document.getElementById('vardas').value.trim(),
      pavarde: document.getElementById('pavarde').value.trim(),
      email: document.getElementById('email').value.trim(),
      telefonas: document.getElementById('telefonas').value.trim(),
      adresas: document.getElementById('adresas').value.trim(),
      klausimas1: Number(document.getElementById('klausimas1').value),
      klausimas2: Number(document.getElementById('klausimas2').value),
      klausimas3: Number(document.getElementById('klausimas3').value)
    };

    /* Išvedimas į konsolę */
    console.log(duomenys);

    /* Vidurkio skaičiavimas */
    const vidurkis = (duomenys.klausimas1 + duomenys.klausimas2 + duomenys.klausimas3) / 3;

    /* Duomenų atvaizdavimas puslapyje */
    rezultatai.innerHTML =
      '<h3>Pateikti duomenys</h3>' +
      '<p>Vardas: ' + apsaugoti(duomenys.vardas) + '</p>' +
      '<p>Pavardė: ' + apsaugoti(duomenys.pavarde) + '</p>' +
      '<p>El. paštas: <a href="mailto:' + apsaugoti(duomenys.email) + '">' + apsaugoti(duomenys.email) + '</a></p>' +
      '<p>Tel. numeris: ' + apsaugoti(duomenys.telefonas) + '</p>' +
      '<p>Adresas: ' + apsaugoti(duomenys.adresas) + '</p>' +
      '<p>Dizaino įvertinimas: ' + duomenys.klausimas1 + '</p>' +
      '<p>Informacijos aiškumas: ' + duomenys.klausimas2 + '</p>' +
      '<p>Rekomendavimo tikimybė: ' + duomenys.klausimas3 + '</p>' +
      '<hr>' +
      '<p class="vidurkis"><strong>' + apsaugoti(duomenys.vardas + ' ' + duomenys.pavarde) +
      ': ' + vidurkis.toFixed(1) + '</strong></p>';

    rezultatai.style.display = 'block';
  });

  /* Formos išvalymas */
  isvalytiMygtukas.addEventListener('click', function () {
    forma.reset();

    laukuId.forEach(function (id) {
      const laukas = document.getElementById(id);
      laukas.classList.remove('is-invalid', 'is-valid');
      document.getElementById(id + '-klaida').textContent = '';
      paliesti[id] = false;
    });

    klausimai.forEach(function (id) {
      document.getElementById(id + '-reiksme').textContent = document.getElementById(id).value;
    });

    rezultatai.innerHTML = '';
    rezultatai.style.display = 'none';

    tikrintiForma();
  });

});