// 생년월일 선택(년/월/일) → 숨은 입력(#birth)에 YYMMDD 6자리로 채워 넣음
function setupBirthSelect(hiddenId, wrapId) {
  const hidden = document.getElementById(hiddenId);
  const wrap = document.getElementById(wrapId);
  const mk = (label, aria) => { const s = document.createElement('select'); s.setAttribute('aria-label', aria); s.add(new Option(label, '')); wrap.appendChild(s); return s; };
  const ys = mk('년', '출생 연도'), ms = mk('월', '출생 월'), ds = mk('일', '출생 일');
  const maxY = new Date().getFullYear() - 17;
  for (let y = maxY; y >= 1930; y--) ys.add(new Option(y + '년', y));
  for (let m = 1; m <= 12; m++) ms.add(new Option(m + '월', m));

  function fillDays() {
    const y = +ys.value || 2000, m = +ms.value || 1, keep = ds.value;
    const last = new Date(y, m, 0).getDate();
    ds.length = 1;
    for (let d = 1; d <= last; d++) ds.add(new Option(d + '일', d));
    if (keep && +keep <= last) ds.value = keep;
  }
  function sync() {
    const p = n => ('0' + n).slice(-2);
    hidden.value = (ys.value && ms.value && ds.value) ? String(ys.value).slice(2) + p(ms.value) + p(ds.value) : '';
    hidden.dispatchEvent(new Event('input'));
  }
  ys.addEventListener('change', () => { fillDays(); sync(); });
  ms.addEventListener('change', () => { fillDays(); sync(); });
  ds.addEventListener('change', sync);
  fillDays();
  return { year: ys, month: ms, day: ds };
}

// 휴대전화: 숫자만 입력해도 010-0000-0000 형식으로 자동 변환 (붙여넣기 포함)
function setupPhone(id) {
  const el = document.getElementById(id);
  const fmt = final => {
    let v = el.value.replace(/\D/g, '');
    if (v.indexOf('82') === 0 && v.length > 10) v = '0' + v.slice(2); // +82 10... 형태 보정
    v = v.slice(0, 11);
    el.value = v.length < 4 ? v : v.length < 8 ? v.slice(0, 3) + '-' + v.slice(3)
      : (final && v.length === 10) ? v.slice(0, 3) + '-' + v.slice(3, 6) + '-' + v.slice(6)
      : v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7);
  };
  el.addEventListener('input', () => fmt(false));
  el.addEventListener('blur', () => fmt(true));
}
