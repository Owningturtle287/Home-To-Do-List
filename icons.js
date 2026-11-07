export const symbols = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
  bag: '<path d="M5 8h14l1.4 12H3.6L5 8Z"/><path d="M9 9V6a3 3 0 1 1 6 0v3"/>',
  chart: '<path d="M4 4v16h16M9 15v-3m5 3V8m5 7V5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  check: '<path d="m5 12 4.2 4.2L19 6.5"/>',
  edit: '<path d="m13.5 6.5 4 4m-12 8.9 4.5-1L20 8.5a2.8 2.8 0 0 0-4-4L6 14.5l-.5 4.9Z"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  list: '<path d="m3.5 6.8 1.7 1.7L8 5.7m2 2h10m-16.5 5 1.7 1.7 2.8-2.8m2 2h10m-10 6h10m-15.5 0h1"/>',
  spark: '<path d="M12 2.5c.7 5.7 3.8 8.8 9.5 9.5-5.7.7-8.8 3.8-9.5 9.5-.7-5.7-3.8-8.8-9.5-9.5 5.7-.7 8.8-3.8 9.5-9.5Z"/>',
  trash: '<path d="M4.5 7h15M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/>',
};

export function symbol(name, size = 20) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${symbols[name]}</svg>`;
}

export const art = {
  sofa: {
    label: 'Sofa', tone: 'sage',
    drawing: '<path d="M14 28v-7a7 7 0 0 1 7-7h22a7 7 0 0 1 7 7v7" fill="#99ae81"/><path d="M13 25a5 5 0 0 1 5 5v4h28v-4a5 5 0 1 1 10 0v13H8V30a5 5 0 0 1 5-5Z" fill="#b6c599"/><path d="M18 34c0-3 2-5 5-5h18c3 0 5 2 5 5M13 43v5m38-5v5M32 20v5"/><path d="m22 22 3-5 6 4-3 6z" fill="#e7ad88" stroke-width="1.2"/>',
  },
  stove: {
    label: 'Stove', tone: 'clay',
    drawing: '<rect x="16" y="13" width="32" height="38" rx="4" fill="#dfa489"/><path d="M16 23h32m-26 28v3m20-3v3M23 18h2m6 0h2m6 0h2"/><rect x="22" y="31" width="20" height="13" rx="2" fill="#f6dfc8"/><path d="M26 27h12M12 47h-2m44-22h3m-1-2v4"/>',
  },
  washer: {
    label: 'Washer', tone: 'mist',
    drawing: '<rect x="15" y="11" width="34" height="42" rx="4" fill="#a7c2bd"/><path d="M15 21h34m-27-5h6m10 0h1m4 0h1"/><circle cx="32" cy="36" r="10" fill="#e8eee4"/><path d="M23 38c5-6 8-4 12-1 2 1 4 1 6 0" stroke-width="1.4"/><path d="M21 53v2m22-2v2"/>',
  },
  dining: {
    label: 'Dining table', tone: 'honey',
    drawing: '<path d="M12 29v14m40-14v14M12 34h8m24 0h8M22 36l-4 15m24-15 4 15" stroke-width="2.1"/><rect x="17" y="30" width="30" height="6" rx="2.5" fill="#d1a06e"/><path d="M29 30l-2-8h10l-2 8" fill="#e5b985"/><path d="M32 22v-9m0 6c-5 0-7-2-7-5 4 0 6 2 7 5Zm0-2c1-5 4-6 7-6 0 4-3 6-7 6Z" fill="#a8b581"/>',
  },
  bath: {
    label: 'Bathroom vanity', tone: 'lilac',
    drawing: '<rect x="24" y="8" width="16" height="19" rx="7" fill="#e9e5ed"/><path d="m28 20 7-7m-6 10 6-6" stroke="#a492ac" stroke-width="1.3"/><path d="M15 35h34v15H15z" fill="#b3a4bd"/><path d="M13 32h38v4H13z" fill="#e0d6e6"/><path d="M32 32v-5c0-3 4-3 4 0m-4 9v14m-5-7h1m8 0h1m-19 7v3m28-3v3"/>',
  },
  guest: {
    label: 'Guest bed', tone: 'honey',
    drawing: '<path d="M13 45V20m38 25v-9c0-5-4-7-8-7H28" stroke-width="2.3"/><path d="M13 36h38v8H13z" fill="#dab079"/><path d="M13 30h9a6 6 0 0 1 6 6H13z" fill="#f5e3b6"/><path d="M28 28h16a7 7 0 0 1 7 8H28z" fill="#dab079"/><path d="M16 44v5m32-5v5m-9-28v-7m-3 3h6m6 7v-4m-2 2h4" stroke-width="1.5"/>',
  },
  bed: {
    label: 'Double bed', tone: 'clay',
    drawing: '<path d="M17 32V21a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v11" fill="#d6a284"/><rect x="20" y="24" width="11" height="8" rx="3" fill="#f6e4ca"/><rect x="33" y="24" width="11" height="8" rx="3" fill="#f6e4ca"/><path d="M13 37a6 6 0 0 1 6-6h26a6 6 0 0 1 6 6v8H13Z" fill="#e6b39a"/><path d="M13 40h38m-35 5v5m32-5v5"/>',
  },
  tub: {
    label: 'Bathtub', tone: 'mist',
    drawing: '<path d="M20 32V20a5 5 0 0 1 10 0v2m-5 0h10"/><path d="M13 32h38v6a10 10 0 0 1-10 10H23a10 10 0 0 1-10-10z" fill="#a6c0bb"/><path d="M11 32h42m-34 15-2 5m28-5 2 5m-23-14h15"/><circle cx="43" cy="20" r="3" fill="#e7eee3"/><circle cx="47" cy="13" r="2" fill="#e7eee3"/>',
  },
  entry: {
    label: 'Entry door', tone: 'lilac',
    drawing: '<path d="M19 50V20a12 12 0 1 1 24 0v30" fill="#b6a5be"/><path d="M24 50V20a7 7 0 0 1 14 0v30" fill="#e5d9e7"/><path d="M16 50h31v4H16z" fill="#c6b9ce"/><path d="M27 23h8m0 12h.1M47 42c3-5 6-6 9-6m-8 13c5-3 7-3 10-3" stroke-width="1.7"/>',
  },
  outside: {
    label: 'Garden', tone: 'sage',
    drawing: '<path d="M31 43V16m0 16c-12 1-18-6-19-13 9 0 17 4 19 13Zm0-7c0-11 5-16 13-17 0 8-4 14-13 17Zm0 13c5-8 13-10 20-8-4 7-11 10-20 8Z" fill="#a5b886"/><path d="M19 43h26l-4 11H23z" fill="#d9a080"/><path d="M18 43h28v4H18z" fill="#ecc2a0"/>',
  },
  house: {
    label: 'House', tone: 'sage',
    drawing: '<path d="m12 30 20-17 20 17v20H12z" fill="#ead2a0"/><path d="m9 31 23-20 23 20" stroke="#97654f" stroke-width="2.4"/><path d="M28 50V37h8v13m-19-15h6v7h-6zm24 0h6v7h-6z" fill="#a6b88a"/>',
  },
};

export function roomIcon(name) {
  const entry = art[name] ?? art.house;
  return `<span class="room-art ${entry.tone}"><svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M8 55h48" opacity=".17"/>${entry.drawing}</svg></span>`;
}
