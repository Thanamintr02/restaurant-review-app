const express = require('express');
const router = express.Router();
const { readJsonFile } = require('../utils/fileManager');

// ========================================
// GET /api/restaurants - ดึงรายการร้านทั้งหมด (พร้อม filtering)
// ========================================
router.get('/', async (req, res) => {
  try {
    let restaurants = await readJsonFile('restaurants.json');
    const { search, category, minRating, priceRange } = req.query;
    
    // TODO 1: กรองตามชื่อ (search)
    if (search) {
      const searchLower = search.toLowerCase();
      restaurants = restaurants.filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
      );
    }
    
    // TODO 2: กรองตามหมวดหมู่ (category)
    if (category) {
      restaurants = restaurants.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    
    // TODO 3: กรองตาม rating ขั้นต่ำ (minRating)
    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      // ตรวจสอบว่าเป็นตัวเลขและไม่ใช่ NaN
      if (!isNaN(minRatingNum)) {
        restaurants = restaurants.filter(r => r.averageRating >= minRatingNum);
      }
    }
    
    // TODO 4: กรองตามช่วงราคา (priceRange)
    if (priceRange) {
      const priceRangeNum = parseInt(priceRange);
      // ตรวจสอบว่าเป็นตัวเลขและไม่ใช่ NaN
      if (!isNaN(priceRangeNum)) {
        restaurants = restaurants.filter(r => r.priceRange === priceRangeNum);
      }
    }
    
    res.json({
      success: true,
      data: restaurants,
      total: restaurants.length,
      filters: {
        search: search || null,
        category: category || null,
        minRating: minRating || null,
        priceRange: priceRange || null
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

// ========================================
// GET /api/restaurants/:id - ดึงข้อมูลร้านตาม ID พร้อมรีวิว
// ========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO 5: อ่านข้อมูลร้านและรีวิว
    // 1. อ่าน restaurants.json และ reviews.json
    const restaurants = await readJsonFile('restaurants.json');
    const reviews = await readJsonFile('reviews.json');

    // 2. หาร้านที่มี id ตรงกับ parameter
    const restaurant = restaurants.find(r => r.id === parseInt(id));

    // 3. ถ้าไม่เจอร้าน ให้ return status 404
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบร้านอาหารนี้'
      });
    }

    // 4. หารีวิวของร้านนี้
    let restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(id));
    
    // 5. เรียงรีวิวจากใหม่สุดไปเก่าสุด
    restaurantReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 6. ส่งข้อมูลกลับ
    res.json({
      success: true,
      data: {
        ...restaurant,
        reviews: restaurantReviews
      }
    });
    
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

module.exports = router;
