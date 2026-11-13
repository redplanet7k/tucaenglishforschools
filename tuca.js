(() => {
  const meta = document.querySelector('.post .meta');
  if (!meta || !/^Conte.do da Sess/.test(meta.textContent)) return;
  const slug = location.pathname.split('/').pop().replace(/\.html$/, '');

  /* ---------- Áudio (voz do navegador, sem arquivos) ---------- */
  const tts = 'speechSynthesis' in window;
  const say = (t, pitch) => { const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .85; u.pitch = pitch || 1; speechSynthesis.speak(u); };
  if (tts) {
    const PT = /\b(com|em|de|do|da|para|use|usa|verbos?|quando|antes|depois|segunda|s.bado|domingo|ou)\b/i;
    const mk = (label, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'say'; b.textContent = label; b.setAttribute('aria-label', 'Ouvir pronúncia em inglês'); b.onclick = () => { speechSynthesis.cancel(); fn(); }; return b; };
    document.querySelectorAll('.post li').forEach(li => {
      const t = li.textContent.trim(), i = t.indexOf(':'), f = li.firstElementChild; let s;
      if (i > 0) s = t.slice(0, i);
      else if (f && f.tagName === 'EM' && f.textContent.trim() === t) s = t; else return;
      if (s.length > 70 || PT.test(s) || /[áéíóúâêôãõç]/i.test(s)) return;
      li.appendChild(mk('🔊', () => say(s)));
    });
    document.querySelectorAll('.post p').forEach(p => {
      if (!/<br\s*\/?>/i.test(p.innerHTML) || !/<strong>[^<]+:<\/strong>/.test(p.innerHTML)) return;
      const L = p.innerHTML.split(/<br\s*\/?>/i).map(x => x.replace(/<[^>]+>/g, '').replace(/^\s*\w+:\s*/, '').trim()).filter(Boolean);
      const w = document.createElement('p'); w.appendChild(mk('🔊 Ouvir o diálogo', () => L.forEach((l, k) => say(l, k % 2 ? 1.3 : .9)))); p.after(w);
    });
  }

  /* ---------- Vídeo do YouTube (configurado em videos.js) ---------- */
  const vid = (window.TUCA_VIDEOS || {})[slug];
  if (vid) {
    const h1 = document.querySelector('.post h1'), p1 = h1 && h1.parentNode.querySelector('h1 ~ p:not(.meta)');
    if (p1) { const d = document.createElement('div'); d.className = 'video';
      d.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(vid) + '" title="Vídeo da aula" loading="lazy" allowfullscreen></iframe>'; p1.after(d); }
  }

  /* ---------- Teste rápido ---------- */
  const DATA = {
    "bebidas-em-ingles": [["Como se diz 'Você gostaria de um café?'", ["Would you like some coffee?", "Do you coffee want?", "You like coffee some?"], 0], ["Qual resposta aceita uma bebida com educação?", ["No, thank you.", "Yes, please.", "Water, no."], 1], ["Water significa:", ["leite", "suco", "água"], 2], ["Complete: A: Would you like some tea? B: Yes, ___.", ["please", "here", "bill"], 0]],
    "paises-e-nacionalidades-em-ingles": [["Como dizer 'Eu sou do Brasil'?", ["I'm from Brazil.", "I'm Brazil.", "I from Brazilian."], 0], ["Nacionalidade de Japan:", ["Japan", "Japanese", "Japaner"], 1], ["Como perguntar 'De onde você é?'", ["Where are you from?", "What are you from?", "Who are you from?"], 0], ["Qual frase está escrita corretamente?", ["She is mexican.", "She is Mexican.", "she is Mexican."], 1]],
    "familia-em-ingles-pronomes-possessivos": [["Paul loves ___ sister. (a irmã DELE)", ["her", "his", "their"], 1], ["Anna loves ___ brother. (o irmão DELA)", ["her", "his", "your"], 0], ["Grandmother significa:", ["avó", "tia", "prima"], 0], ["Complete: ___ family is big. (nossa)", ["Their", "Our", "My"], 1]],
    "ingles-no-aeroporto": [["Boarding pass é:", ["bagagem", "cartão de embarque", "passaporte"], 1], ["Como perguntar 'Onde fica o portão 12?'", ["Where is gate 12?", "What is gate 12 where?", "Gate 12 is where?"], 0], ["'My flight is delayed' significa:", ["Meu voo está atrasado.", "Meu voo foi cancelado.", "Meu voo é direto."], 0], ["No check-in: 'Passport, please.' Você responde:", ["Here you are.", "Good night.", "I am hungry."], 0]],
    "adjetivos-em-ingles": [["'Uma casa grande' em inglês:", ["a house big", "a big house", "a bigs house"], 1], ["Plural de 'a big house':", ["two bigs houses", "two big houses", "two houses bigs"], 1], ["O oposto de 'expensive' é:", ["cheap", "quiet", "old"], 0], ["Complete: My city is small ___ quiet.", ["and", "or", "the"], 0]],
    "como-pedir-comida-em-ingles": [["Qual é a forma educada de pedir?", ["I want sandwich.", "I would like a sandwich, please.", "Give me sandwich."], 1], ["Bill significa:", ["cardápio", "conta", "garçom"], 1], ["'For here or to go?' significa:", ["Para comer aqui ou levar?", "Você quer pagar?", "Qual é o seu nome?"], 0], ["Para pedir a conta:", ["Can I have the bill, please?", "Can I see the menu, please?", "What do you recommend?"], 0]],
    "profissoes-em-ingles": [["She is ___ engineer.", ["a", "an", "the"], 1], ["Como perguntar a profissão de alguém?", ["What do you do?", "What are you do?", "How do you do work?"], 0], ["He ___ at a school.", ["work", "works", "working"], 1], ["Nurse significa:", ["enfermeiro(a)", "motorista", "médico(a)"], 0]],
    "presente-simples-em-ingles": [["She ___ French.", ["speak", "speaks", "speaking"], 1], ["He ___ speak Spanish. (negativa)", ["don't", "doesn't", "isn't"], 1], ["Terceira pessoa de 'study':", ["studys", "studies", "studyes"], 1], ["Qual frase está correta?", ["I usually study at night.", "I study usually at night.", "Usually I am study at night."], 0]],
    "clima-e-previsao-do-tempo-em-ingles": [["Como dizer 'Está chovendo'?", ["It's raining.", "It rains is.", "Is raining it."], 0], ["Cloudy significa:", ["ensolarado", "nublado", "ventoso"], 1], ["Como perguntar 'Qual é a previsão para amanhã?'", ["What's the forecast for tomorrow?", "What is tomorrow weather like to?", "Which forecast tomorrow?"], 0], ["Está frio. O que você recomenda?", ["Wear a coat.", "Wear sunglasses.", "Wear shorts."], 0]],
    "animais-de-estimacao-em-ingles": [["Como perguntar 'Você tem um animal de estimação?'", ["Do you have a pet?", "Are you have a pet?", "You have pet?"], 0], ["'O nome do meu cachorro' em inglês:", ["my dog's name", "my dogs name", "my dog name's"], 0], ["O plural de fish costuma ser:", ["fishes", "fish", "fishs"], 1], ["Como perguntar 'Quantos anos ele tem?'", ["How old is he?", "How many years he has?", "What age is he?"], 0]]
  };
  const Q = DATA[slug], cta = document.querySelector('.post .cta');
  if (!Q || !cta) return;
  const box = document.createElement('section'); box.className = 'quiz'; box.setAttribute('aria-live', 'polite');
  let n = 0, ok = 0;
  const show = () => {
    if (n >= Q.length) {
      box.innerHTML = '<h2>Resultado</h2><p>Você acertou <strong>' + ok + ' de ' + Q.length + '</strong>. ' + (ok === Q.length ? 'Muito bem!' : 'Releia o artigo e tente de novo.') + '</p>';
      const r = document.createElement('button'); r.className = 'btn sm'; r.textContent = 'Refazer'; r.onclick = () => { n = ok = 0; show(); }; box.appendChild(r); return;
    }
    const [q, o, a] = Q[n], opts = o.map((t, i) => [t, i === a]).sort(() => Math.random() - .5);
    box.innerHTML = '<h2>Teste rápido</h2><p class="meta">Pergunta ' + (n + 1) + ' de ' + Q.length + '</p><p><strong></strong></p>';
    box.querySelector('strong').textContent = q;
    const w = document.createElement('div'); w.className = 'opts'; box.appendChild(w);
    const fb = document.createElement('p'); fb.className = 'fb'; box.appendChild(fb);
    opts.forEach(([t, c]) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = t;
      b.onclick = () => {
        w.querySelectorAll('button').forEach((x, i) => { x.disabled = true; if (opts[i][1]) x.classList.add('ok'); });
        if (c) ok++; else b.classList.add('no');
        fb.textContent = c ? 'Certo!' : 'Quase! A resposta certa está em verde.';
        const nx = document.createElement('button'); nx.className = 'btn sm'; nx.style.marginTop = '12px'; nx.textContent = n + 1 < Q.length ? 'Próxima' : 'Ver resultado';
        nx.onclick = () => { n++; show(); }; box.appendChild(nx); nx.focus();
      };
      w.appendChild(b);
    });
  };
  cta.parentNode.insertBefore(box, cta); show();
})();
