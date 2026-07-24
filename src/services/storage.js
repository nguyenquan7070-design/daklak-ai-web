// Simple localStorage-backed persistence for the web version.
// Mirrors ChatRepository (Room DB) + FirestoreService's local-memory fallback
// from the Kotlin app. When this project graduates to Capacitor, these can be
// swapped for @capacitor/preferences or a real Firestore connection without
// touching component code, since everything goes through this module.

const CHAT_KEY = (screenId) => `daklak:chat:${screenId}`
const REPORTS_KEY = (kind) => `daklak:reports:${kind}`

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    console.warn('storage read failed', key, e)
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('storage write failed', key, e)
  }
}

export function getMessages(screenId) {
  return readJSON(CHAT_KEY(screenId), [])
}

export function addMessage(screenId, message) {
  const list = getMessages(screenId)
  const withId = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: Date.now(), ...message }
  const next = [...list, withId]
  writeJSON(CHAT_KEY(screenId), next)
  return next
}

export function clearMessages(screenId) {
  writeJSON(CHAT_KEY(screenId), [])
}

export function getReports(kind) {
  return readJSON(REPORTS_KEY(kind), [])
}

export function addReport(kind, report) {
  const list = getReports(kind)
  const withId = { id: `${kind}-${Date.now()}`, createdAt: Date.now(), ...report }
  const next = [withId, ...list]
  writeJSON(REPORTS_KEY(kind), next)
  return next
}

export function seedDemoDataIfEmpty() {
  if (getReports('coffee').length === 0) {
    writeJSON(REPORTS_KEY('coffee'), [
      {
        id: 'coffee-demo-1',
        partType: 'Lá cà phê',
        diseaseName: 'Bệnh Rỉ Sắt Cà Phê',
        hazardLevel: 'Trung bình',
        condition: 'Đốm vàng đồng tâm rải rác mặt dưới lá.',
        treatment: 'Cắt tỉa thông thoáng, phun thuốc gốc đồng.',
        createdAt: Date.now() - 86400000 * 2,
      },
    ])
  }
  if (getReports('forest').length === 0) {
    writeJSON(REPORTS_KEY('forest'), [
      {
        id: 'forest-demo-1',
        locationName: 'Trạm kiểm lâm Yok Don (Tiểu khu 12)',
        aiClassification: 'cháy rừng',
        status: 'Đang xử lý',
        description: 'Phát hiện cột khói xám bốc cao bất thường.',
        createdAt: Date.now() - 3600000 * 5,
      },
    ])
  }
  if (getReports('camera').length === 0) {
    writeJSON(REPORTS_KEY('camera'), [
      {
        id: 'camera-demo-1',
        cameraId: 'Vòng xoay Ngã Sáu BMT',
        aiAnalysis: 'ùn tắc',
        alertLevel: 'Trung bình',
        createdAt: Date.now() - 600000,
      },
    ])
  }
}
