Form Builder App

Basit bir form oluşturma ve cevap kaydetme uygulaması. Frontend React (react-form-builder2), backend Node.js/Express ve MySQL kullanır.

İçerik

- Gereksinimler
- Kurulum
  - Veritabanı
  - Backend (Node.js/Express)
  - Frontend (React + Vite)
- .env Örnekleri
- API Uç Noktaları
- Geliştirme Notları

Gereksinimler

- Node.js 18+
- npm veya yarn
- MySQL 8+ (ya da uyumlu bir MySQL sunucusu)

Kurulum

1. Depoyu klonlayın
   git clone <repo-url>
   cd form-builder-app

2. Veritabanı

- Bir veritabanı oluşturun: form_builder
- Aşağıdaki tabloları oluşturun:

  CREATE TABLE IF NOT EXISTS forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  schema JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS form_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id INT NOT NULL,
  submission_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
  );

- Backend .env dosyanızdaki MySQL bağlantı bilgilerinin doğru olduğundan emin olun.

3. Backend (Node.js/Express)

- Dizine gidin ve bağımlılıkları kurun:
  cd backend
  npm install

- .env dosyasını oluşturun (bkz. .env örnekleri) ve sunucuyu başlatın:
  npm run start

- Varsayılan port: 3000 (app.js içinde tanımlıysa). Çalıştırdıktan sonra http://localhost:3000 üzerinde API erişilebilir olmalı.

4. Frontend (React + Vite)

- Dizine gidin ve bağımlılıkları kurun:
  cd ../frontend
  npm install

- .env.local dosyanızı oluşturun ve backend API adresini tanımlayın:
  VITE_API_URL=http://localhost:3000

- Geliştirme sunucusunu başlatın:
  npm run dev

- Uygulamayı http://localhost:5173 adresinde açın.

.env Örnekleri

- backend/.env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=form_builder

- frontend/.env.local
  VITE_API_URL=http://localhost:3000

API Uç Noktaları

- GET /forms
  Tüm formları döner. Frontend en son formu alıp editöre yükler.

- POST /forms
  Yeni form oluşturur.
  Body: { name: string, description?: string, schema: { fields: any[] } }
  Response: { id: number }

- PUT /forms/:id/schema
  Mevcut formun şemasını günceller.
  Body: { schema: { fields: any[] } }

- POST /forms/:id/submissions
  Form cevaplarını kaydeder.
  Body: { submission_data: any }

Geliştirme Notları

- Frontend, react-form-builder2 ile form şeması oluşturur. Kaydet butonu POST akışını çağırır.
- Önizleme, react-form-builder2 ReactFormGenerator ile çalışır ve gönderimler /forms/:id/submissions ile backend’e kaydedilir.
- Şema ve gönderim yapıları JSON olarak saklanır. İhtiyaca göre normalize edilmiş görünüm ekleyebilirsiniz.
