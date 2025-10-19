# Restaurant Review Website

## รายละเอียดโปรเจค

แอพพลิเคชั่นนี้ เป็นแอพพลิเคชั่นรีวิวอาหาร ที่มีไว้เพื่อแสดงความพึ่งพอใจของลูกค้าแต่ละคนที่ได้ไปทานอาหารแต่ละเมนู ในร้านต่างๆ ซึ่งแอพพลิเคชั่นนี้จะสามารถ ให้ rating (⭐⭐⭐⭐⭐)พร้อมกับแสดงความคิดเห็นเกี่ยวกับร้านนั้นๆ ได้อย่างอิสระ ซึ่งแอพพลิเคชั่นนี้สร้างมาเพื่อเป็นประโยชน์ให้แก่
ผู้คนที่จะเลือกรับประทานอาหารในร้านต่างๆได้ดียิ่งขึ้นอย่างแน่นอน

## เทคโนโลยีที่ใช้
- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: JSON File Storage

## Features ที่ทำได้
### Required Features (70 คะแนน)
- [x] แสดงรายการร้านอาหาร
- [x] ค้นหาร้าน
- [x] กรองตามหมวด/rating/ราคา
- [x] ดูรายละเอียดร้าน
- [x] เพิ่มรีวิว
- [x] Validation
- [x] อัพเดท rating อัตโนมัติ

### Bonus Features (ถ้ามี)
- [x] Sort restaurants
- [x] Responsive design
- [x] Animations

## วิธีติดตั้งและรัน

### Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## API Endpoints
- GET `/api/restaurants` - ดึงรายการร้านทั้งหมด
- GET `/api/restaurants/:id` - ดึงร้านตาม ID
- POST `/api/reviews` - เพิ่มรีวิว
- GET `/api/stats` - ดึงสถิติ

## Screenshots
### หน้าแรก
![Home](<img width="1916" height="986" alt="image" src="https://github.com/user-attachments/assets/b3c812ab-957d-46a1-adcc-694f8f1e490b" />
)

### รายละเอียดร้าน
![Detail](<img width="1912" height="983" alt="image" src="https://github.com/user-attachments/assets/78153973-07d9-4fc4-a354-3b126b368611" />
)

### ฟอร์มรีวิว
![Review](<img width="1919" height="975" alt="image" src="https://github.com/user-attachments/assets/1d0b02e4-c504-4327-aace-3f41537ca001" />
)

## ผู้พัฒนา
- นาย ธนมินทร์ เปลี่ยนพร้อม
- 67543210032-8
- greattanamintr@gmail.com

## License
MIT License
