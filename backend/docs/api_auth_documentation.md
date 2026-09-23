# 📄 Dokumentasi API — Modul Autentikasi & Manajemen Role

Dokumentasi resmi API Autentikasi dan Otorisasi untuk Sistem Manajemen Event & Tiket Digital.

---

## 📌 Informasi Umum

* **Base URL**: `http://localhost:3000/api/v1/auth`
* **Format Data**: JSON (`Content-Type: application/json`)
* **Skema Autentikasi**: JSON Web Token (JWT) Bearer Token (`Authorization: Bearer <accessToken>`)

---

## 📐 Standar Response Format

Semua response dari backend menggunakan format terstruktur berikut:

### 1. Response Berhasil (2xx)
```json
{
  "success": true,
  "message": "Deskripsi pesan sukses",
  "data": { ... }
}
```

### 2. Response Gagal / Error (4xx / 5xx)
```json
{
  "success": false,
  "message": "Deskripsi pesan kesalahan",
  "errors": [
    {
      "field": "email",
      "message": "Format email tidak valid"
    }
  ]
}
```

---

## 🚀 Endpoint Reference

---

### 1. Register User Baru

Pendaftaran akun baru untuk publik. Role otomatis diset sebagai `ATTENDEE` (User Reguler).

* **URL**: `/register`
* **Method**: `POST`
* **Auth Required**: `Tidak`

#### Request Body
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "Password123!"
}
```

| Field | Tipe | Wajib | Keterangan |
| :--- | :--- | :--- | :--- |
| `name` | String | Ya | Nama lengkap user (max 100 karakter) |
| `email` | String | Ya | Email unik user (format email valid) |
| `password` | String | Ya | Password akun (min 8 karakter) |

#### Response 201 Created
```json
{
  "success": true,
  "message": "Registrasi akun berhasil",
  "data": {
    "user": {
      "id": "c1f7a2d0-8e12-4a5b-9c3d-123456789abc",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "role": "ATTENDEE",
      "isVerified": false,
      "createdAt": "2026-09-23T17:00:00.000Z"
    }
  }
}
```

#### Response 409 Conflict (Email Terdaftar)
```json
{
  "success": false,
  "message": "Email sudah terdaftar di sistem"
}
```

---

### 2. Login Akun

Autentikasi user dengan email dan password untuk memperoleh Access Token dan Refresh Token.

* **URL**: `/login`
* **Method**: `POST`
* **Auth Required**: `Tidak`

#### Request Body
```json
{
  "email": "budi@example.com",
  "password": "Password123!"
}
```

#### Response 200 OK
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "d8f9a2b1c3e4567890abcdef...",
      "expiresIn": "15m"
    },
    "user": {
      "id": "c1f7a2d0-8e12-4a5b-9c3d-123456789abc",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "role": "ATTENDEE"
    }
  }
}
```

#### Response 401 Unauthorized
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

### 3. Get Current User Profile (`/me`)

Mendapatkan informasi profil user yang sedang login berdasarkan Access Token.

* **URL**: `/me`
* **Method**: `GET`
* **Auth Required**: `Ya` (Header `Authorization: Bearer <accessToken>`)

#### Headers
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response 200 OK
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "user": {
      "id": "c1f7a2d0-8e12-4a5b-9c3d-123456789abc",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "role": "ATTENDEE",
      "isVerified": false,
      "isActive": true,
      "createdAt": "2026-09-23T17:00:00.000Z",
      "updatedAt": "2026-09-23T17:00:00.000Z"
    }
  }
}
```

#### Response 401 Unauthorized
```json
{
  "success": false,
  "message": "Token tidak valid atau kadaluwarsa"
}
```

---

### 4. Refresh Access Token

Memperbarui `accessToken` yang kadaluwarsa tanpa perlu memasukkan kembali email dan password.

* **URL**: `/refresh`
* **Method**: `POST`
* **Auth Required**: `Tidak`

#### Request Body
```json
{
  "refreshToken": "d8f9a2b1c3e4567890abcdef..."
}
```

#### Response 200 OK
```json
{
  "success": true,
  "message": "Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

#### Response 401 Unauthorized
```json
{
  "success": false,
  "message": "Refresh token tidak valid atau sudah dicabut (revoked)"
}
```

---

### 5. Logout Akun

Mencabut (revoke) `refreshToken` sehingga tidak dapat digunakan kembali.

* **URL**: `/logout`
* **Method**: `POST`
* **Auth Required**: `Ya` (Header `Authorization: Bearer <accessToken>`)

#### Request Body
```json
{
  "refreshToken": "d8f9a2b1c3e4567890abcdef..."
}
```

#### Response 200 OK
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## 🔒 Ringkasan Status Code HTTP

| Code | Status | Keterangan |
| :--- | :--- | :--- |
| `200` | OK | Permintaan berhasil diproses |
| `201` | Created | Resource baru (user) berhasil dibuat |
| `400` | Bad Request | Request body / validasi data tidak valid |
| `401` | Unauthorized | Autentikasi gagal (token atau password salah) |
| `403` | Forbidden | User tidak memiliki hak akses (Role Authorization) |
| `409` | Conflict | Data sudah ada di sistem (misal Email terdaftar) |
| `500` | Internal Error | Server mengalami gangguan internal |
