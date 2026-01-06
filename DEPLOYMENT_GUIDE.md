# 🚀 Deployment Checklist untuk Railway

## ✅ File yang Sudah Dibuat/Diupdate:

- ✅ `package.json` - Sudah ada script `build`, `start`, dan `postinstall`
- ✅ `.gitignore` - Sudah exclude file yang tidak perlu di-push
- ✅ `railway.json` - Konfigurasi deploy Railway
- ✅ `.env.example` - Template environment variables
- ✅ `README.md` - Dokumentasi project
- ✅ Build test berhasil (`npm run build`)

---

## 📋 Langkah Deploy ke Railway

### **STEP 1: Push ke GitHub**

```bash
# Check status
git status

# Add semua perubahan
git add .

# Commit
git commit -m "Setup for Railway deployment"

# Push ke GitHub
git push origin main
```

### **STEP 2: Buka Railway & Setup Database**

1. Buka https://railway.app
2. **Login** dengan GitHub
3. Klik **"New Project"**
4. Pilih **"Provision PostgreSQL"**
5. Database PostgreSQL otomatis dibuat ✅

### **STEP 3: Copy DATABASE_URL**

1. Klik pada **PostgreSQL** service yang baru dibuat
2. Klik tab **"Variables"**
3. Cari variable `DATABASE_URL`
4. Klik **icon copy** di sebelah kanan
5. Simpan di notepad (akan dipakai di step 5)

Format: `postgresql://postgres:xxxxx@xxxxx.railway.app:5432/railway`

### **STEP 4: Deploy Backend dari GitHub**

1. Kembali ke dashboard Railway
2. Klik **"New"** → **"GitHub Repo"**
3. Pilih repo: **`Jeruk-Kurej/ALP_Backend`**
4. Railway akan auto-detect dan mulai build

### **STEP 5: Set Environment Variables**

Di Railway Dashboard:

1. Klik **Backend Service** (bukan database)
2. Klik tab **"Variables"**
3. Klik **"New Variable"** dan tambahkan satu per satu:

```
DATABASE_URL = postgresql://postgres:xxxxx@xxxxx.railway.app:5432/railway
PORT = 3000
JWT_SECRET_KEY = ganti-dengan-random-string-panjang-dan-aman
NODE_ENV = production
```

**⚠️ PENTING:**
- `DATABASE_URL` harus dari PostgreSQL yang dibuat di STEP 3!
- `JWT_SECRET_KEY` ganti dengan string random yang panjang

### **STEP 6: Deploy!**

Railway akan otomatis:
1. Install dependencies (`npm install`)
2. Generate Prisma Client (`npx prisma generate`)
3. Run migrations (`npx prisma migrate deploy`)
4. Build TypeScript (`npm run build`)
5. Start server (`npm start`)

Tunggu hingga status **"Active"** ✅

### **STEP 7: Get Public URL**

1. Di Backend Service, klik tab **"Settings"**
2. Scroll ke **"Networking"**
3. Klik **"Generate Domain"**
4. Copy URL (misal: `https://alp-backend-production.up.railway.app`)

---

## 📱 Update Android Studio

Setelah dapat URL dari Railway, update base URL di Android:

**File:** `RetrofitInstance.kt` atau `ApiConfig.kt`

```kotlin
// SEBELUM
const val BASE_URL = "http://192.168.1.5:3000/"

// SESUDAH (ganti dengan URL Railway kamu)
const val BASE_URL = "https://alp-backend-production.up.railway.app/"
```

**⚠️ Jangan lupa tambahkan trailing slash `/` di akhir URL!**

---

## 🧪 Test Deployment

Test endpoint dengan Postman atau browser:

```
GET https://alp-backend-production.up.railway.app/api/tokos
POST https://alp-backend-production.up.railway.app/api/users/register
```

Jika dapat response (bukan 404), artinya **BERHASIL!** ✅

---

## 🔍 Troubleshooting

### Build Failed di Railway

1. Cek **Logs** di Railway dashboard
2. Pastikan semua dependencies di `package.json`
3. Pastikan `DATABASE_URL` sudah diset

### Database Connection Error

1. Pastikan `DATABASE_URL` dari Railway PostgreSQL
2. Format harus: `postgresql://user:pass@host:port/db`

### Upload File Tidak Persistent

Railway menggunakan **ephemeral storage**. File upload akan hilang saat redeploy.

**Solusi:**
- Pakai **Cloudinary** untuk image hosting
- Pakai **Railway Volume** (persistent storage)
- Nanti kita bisa setup kalau perlu

---

## 🎯 Keuntungan Deploy ke Railway

✅ Backend online 24/7
✅ URL tetap, tidak perlu ganti IP
✅ Bisa akses dari mana aja (kampus, rumah, mobile data)
✅ Tidak perlu `npm run dev` lagi
✅ Tidak perlu wifi sama dengan laptop
✅ Auto-deploy setiap kali push ke GitHub
✅ Gratis untuk development!

---

## 📝 Next Steps (Opsional)

1. **Setup Cloudinary** untuk persistent image storage
2. **Custom Domain** (misal: api.yourdomain.com)
3. **CI/CD** otomatis dengan GitHub Actions
4. **Monitoring** dengan Railway Logs

---

**Semangat deploy! 🚀**

Kalau ada error, cek di Railway Logs atau tanya lagi!
