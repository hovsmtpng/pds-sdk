# PDS Frontend Puninar Logistics  
**React + TypeScript + Vite + shadcn/ui**

Template standar untuk pengembangan aplikasi frontend internal PDS menggunakan stack modern.

---

# PDS SDK  
**@puninar-logistics/pds-sdk**

SDK internal yang berisi shared components, hooks, utils, dan design system yang digunakan lintas project.

---

## 📦 Tech Stack (SDK)

| Teknologi | Deskripsi |
|----------|-----------|
| React 19 | Library UI |
| TypeScript | Static typing |
| Vite | Build tool |
| shadcn/ui | UI system |
| Tailwind CSS | Styling |

---

## 📁 Struktur Folder (SDK)

```
src/
├─ api/
├─ assets/
├─ auth/
├─ components/
│  ├─ animation/
│  ├─ core/
│  ├─ error-pages/
│  ├─ form/
│  └─ ui/            # shadcn components
├─ hoc/
├─ hooks/
├─ lib/
├─ provider/
├─ types/
├─ utils/
├─ global.css
├─ custom.css
└─ main.tsx
```

---

## 🛠 Scripts (SDK)

| Command | Fungsi |
|--------|---------|
| `npm run dev` | Start Vite |
| `npm run build` | Build Vite |
| `npm run watch` | Watch & rebuild Tsup |
| `npm run build-tsup` | Build SDK Tsup |
| `npm run lint` | Lint |

---

## 🔗 Setup SDK (Local Development)

### 1. Setup SDK Global

Masuk ke folder SDK:

```bash
cd ../pds-sdk
npm install
npm link
```

---

### 2. Jalankan SDK Watch Mode

```bash
cd ../pds-sdk
npm run watch
```

---

## ⚙️ Troubleshooting SDK

### SDK tidak update di template

- Pastikan `npm run watch` aktif
- Pastikan tidak ada error build
- Relink jika perlu:

```bash
npm unlink @puninar-logistics/pds-sdk
npm link @puninar-logistics/pds-sdk
```

---

# PDS Template

## 📦 Tech Stack (Template)

| Teknologi | Deskripsi |
|----------|-----------|
| React 19 | Library UI |
| Javascript & TypeScript | Static typing |
| Vite | Build tool |
| shadcn/ui | UI system |
| Tailwind CSS | Styling |

---

## 📁 Struktur Folder (Template)

```
src/
├─ assets/
├─ hooks/
├─ pages/
├─ store/
├─ App.tsx
├─ i18n.ts
├─ AccountInformation.jsx
└─ main.tsx
```

---

## 🚀 Getting Started (Template)

### 1. Clone & Install

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

---

### 2. Setup Environment Variables

Buat file `.env`:

```env
VITE_URL_ODONG=
VITE_URL_PORTAL_PUNINAR_APP_MAIN=
VITE_KEY_SSO_PUNINAR=
VITE_REVERSE_PROXY=false
```

---

### 3. Uninstall versi registry dari Template

```bash
npm uninstall @puninar-logistics/pds-sdk
```

---

### 4. Link SDK ke Template

```bash
cd ../project
npm link @puninar-logistics/pds-sdk
```

---

### 5. Jalankan Template

```bash
npm run dev
```

---

## 📄 License

Internal — PT Puninar Logistics.

---

## 👨‍💻 Maintainer

Frontend Team — PDS