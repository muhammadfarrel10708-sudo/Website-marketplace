// Ulasan buatan pengunjung disimpan di browser (localStorage) sampai ada backend.
export const storageKey = (id) => `mp-reviews-${id}`

export const loadMine = (id) => {
  try {
    const v = JSON.parse(localStorage.getItem(storageKey(id)) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export const saveMine = (id, list) => {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(list))
  } catch {
    /* penyimpanan penuh atau diblokir: ulasan tetap tampil selama halaman terbuka */
  }
}
