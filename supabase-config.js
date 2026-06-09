# ArkaLab Supabase No-Auth Final

Versi ini **buang login/auth**. App akan terus connect ke Supabase menggunakan Project URL dan anon/publishable key.

## Penting
No-auth version ini sesuai untuk local/personal reference sahaja.

Kalau app ini di-host public, sesiapa yang dapat access app/key boleh read/write/delete table `recipes`.

## Cara Setup

1. Buka Supabase project.
2. Pergi **SQL Editor**.
3. Copy semua isi file `setup-supabase.sql`.
4. Paste dan tekan **Run**.
5. Pergi **Project Settings → API**.
6. Copy:
   - Project URL
   - anon / publishable key
7. Buka `supabase-config.js`.
8. Paste value:

```js
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xxxxx";
```

9. Save.
10. Buka `index.html` melalui Live Server.

## Features

- No login / no OTP
- Direct Supabase sync
- Save recipe
- Delete recipe
- Duplicate recipe
- Search/filter status
- Export / Import JSON
- Print Sheet
- Auto total weight and ingredient percentage
