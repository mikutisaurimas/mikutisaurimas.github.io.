/* Kontaktų puslapio interaktyvumo, validacijos ir rezultatų skaičiavimo logika */

document.addEventListener('DOMContentLoaded', function () {

  /* Pasiimame kontaktų formos elementą */
  const forma = document.getElementById('contact-form');
  if (!forma) return;

  const mygtukas = forma.querySelector('button[type="submit"]');

  /* Privalomi formos laukai validacijai */
  const privalomiLaukai = ['vardas', 'pavarde', 'email', 'telefonas', 'adresas'].map(function (id) {
    return document.getElementById(id);
  });

  /* Dinamiškai sukuriamas rezultatų blokas formos apačioje */
  const rezultatai = document.createElement('div');
  rezultatai.id = 'formos-rezultatai';
  rezultatai.className = 'info-box mt-4';
  rezultatai.style.display = 'none';
  forma.insertAdjacentElement('afterend', rezultatai);

  /* Slankiklių reikšmių gyvas atnaujinimas ekrane */
  const klausimai = ['klausimas1', 'klausimas2', 'klausimas3'];

  klausimai.forEach(function (id) {
    const slankiklis = document.getElementById(id);
    const reiksme = document.getElementById(id + '-reiksme');

    if (slankiklis && reiksme) {
      slankiklis.addEventListener('input', function () {
        reiksme.textContent = slankiklis.value;
      });
    }
  });

  /* Funkcija, tikrinanti ar visi privalomi laukai užpildyti (deaktyvuoja/aktyvuoja mygtuką) */
  function tikrintiLaukus() {
    const visiUzpildyti = privalomiLaukai.every(function (laukas) {
      return laukas && laukas.value.trim() !== '';
    });
    mygtukas.disabled = !visiUzpildyti;
  }

  privalomiLaukai.forEach(function (laukas) {
    if (laukas) {
      laukas.addEventListener('input', tikrintiLaukus);
    }
  });

  /* Paleidžiame patikrinimą iš karto užsikrovus puslapiui */
  tikrintiLaukus();

  /* Apsaugos nuo XSS / HTML įterpimo funkcija */
  function apsaugoti(tekstas) {
    const div = document.createElement('div');
    div.textContent = tekstas;
    return div.innerHTML;
  }

  /* Formos pateikimo (submit) įvykio apdorojimas */
  forma.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Duomenų surinkimas į JavaScript objektą */
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

    /* Išvedame surinktus duomenis į naršyklės konsolę */
    console.log("Pateikti formos duomenys:", duomenys);

    /* Apskaičiuojame vertinimų vidurkį */
    const vidurkis = (duomenys.klausimas1 + duomenys.klausimas2 + duomenys.klausimas3) / 3;

    /* Suformuojame HTML turinį ir atvaizduojame rezultatų bloke */
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
      '<p class="vidurkis"><strong>Bendras įvertinimas (' + apsaugoti(duomenys.vardas + ' ' + duomenys.pavarde) +
      '): ' + vidurkis.toFixed(1) + ' / 10</strong></p>';

    /* Parodome sukurtą bloką ekrane */
    rezultatai.style.display = 'block';
  });

});