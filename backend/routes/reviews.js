const express = require('express');
const router = express.Router();
const { readJsonFile, writeJsonFile } = require('../utils/fileManager');
const { validateReview } = require('../middleware/validation');

// ========================================
// GET /api/reviews/:restaurantId - ดึงรีวิวทั้งหมดของร้านนั้น
// ========================================
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await readJsonFile('reviews.json');
    
    // TODO 1: กรองรีวิวเฉพาะร้านนี้
    let restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(restaurantId));
    
    // TODO 2: เรียงจากใหม่สุดไปเก่าสุด
    restaurantReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      data: restaurantReviews, // เปลี่ยนเป็นรีวิวที่กรองและเรียงแล้ว
      total: restaurantReviews.length  // เปลี่ยนเป็นจำนวนรีวิวที่กรอง
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรีวิว'
    });
  }
});

// ========================================
// POST /api/reviews - เพิ่มรีวิวใหม่
// ========================================
router.post('/', validateReview, async (req, res) => {
  try {
    const { restaurantId, userName, rating, comment, visitDate } = req.body;
    
    // TODO 3: อ่านข้อมูลปัจจุบัน
    const reviews = await readJsonFile('reviews.json');
    const restaurants = await readJsonFile('restaurants.json');
    
    // TODO 4: ตรวจสอบว่า restaurant ID มีอยู่จริงไหม (และหา index เพื่ออัพเดท)
    const restaurantIndex = restaurants.findIndex(r => r.id === parseInt(restaurantId));
    
    if (restaurantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบร้านอาหารนี้'
      });
    }
    
    // เก็บ Reference ไปยังร้านอาหารที่จะอัพเดท
    const restaurantToUpdate = restaurants[restaurantIndex];

    // TODO 5: สร้างรีวิวใหม่
    const newReview = {
      id: Date.now(),
      restaurantId: parseInt(restaurantId),
      userName: userName.trim(),
      rating: parseInt(rating),
      comment: comment.trim(),
      visitDate: visitDate || new Date().toISOString().split('T')[0], // ใช้ visitDate หรือวันที่ปัจจุบัน
      createdAt: new Date().toISOString()
    };
    
    // TODO 6: เพิ่มรีวิวเข้าไปใน array และบันทึก
    reviews.push(newReview);
    await writeJsonFile('reviews.json', reviews);
    
    // TODO 7: อัพเดท averageRating และ totalReviews ของร้าน
    // 1. กรองรีวิวทั้งหมดของร้านนี้ (รวมรีวิวใหม่ที่เพิ่งเพิ่ม)
    const restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(restaurantId));
    
    // 2. คำนวณค่าเฉลี่ย
    const totalRating = restaurantReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverageRating = totalRating / restaurantReviews.length;
    
    // 3. และ 4. อัพเดทค่าใน object และ array
    restaurantToUpdate.averageRating = Math.round(newAverageRating * 10) / 10;
    restaurantToUpdate.totalReviews = restaurantReviews.length;
    
    // 5. บันทึกไฟล์ restaurants ที่ถูกอัพเดทแล้ว
    await writeJsonFile('restaurants.json', restaurants);
    
    // TODO 8: ส่งข้อมูลกลับ
    res.status(201).json({
      success: true,
      message: 'เพิ่มรีวิวสำเร็จ',
      data: newReview,
      restaurant: {
        id: restaurantToUpdate.id,
        name: restaurantToUpdate.name,
        averageRating: restaurantToUpdate.averageRating,
        totalReviews: restaurantToUpdate.totalReviews
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มรีวิว'
    });
  }
});

module.exports = router;
