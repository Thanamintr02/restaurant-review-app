const express = require('express');
const cors = require('cors');
require('dotenv').config();
const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');
const { readJsonFile } = require('./utils/fileManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🍜 Restaurant Review API',
    version: '1.0.0',
    endpoints: {
      restaurants: '/api/restaurants',
      reviews: '/api/reviews',
      stats: '/api/stats'
    }
  });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

// ========================================
// GET /api/stats - ดึงสถิติทั้งหมด
// ========================================
app.get('/api/stats', async (req, res) => {
  try {
    // 1. อ่านข้อมูล restaurants.json และ reviews.json
    const restaurants = await readJsonFile('restaurants.json');
    const reviews = await readJsonFile('reviews.json');

    // 2. คำนวณ
    const totalRestaurants = restaurants.length;
    const totalReviews = reviews.length;

    // คำนวณคะแนนเฉลี่ยรวมทั้งหมดจากรีวิว (แม่นยำกว่าการเฉลี่ย averageRating)
    const overallTotalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    // ปัดเศษ 1 ตำแหน่ง
    const averageRating = totalReviews > 0 
      ? (Math.round((overallTotalRating / totalReviews) * 10) / 10) 
      : 0;

    // หา Top 5 ร้านที่มี rating สูงสุด
    const topRatedRestaurants = [...restaurants]
      // เรียงลำดับจากมากไปน้อยตาม averageRating
      .sort((a, b) => b.averageRating - a.averageRating)
      // เลือก 5 อันดับแรก
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        name: r.name,
        averageRating: r.averageRating,
        totalReviews: r.totalReviews
      }));

    // 3. ส่งข้อมูลกลับ
    res.json({
      success: true,
      data: {
        totalRestaurants,
        totalReviews,
        averageRating,
        topRatedRestaurants
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติ'
    });
  }
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
