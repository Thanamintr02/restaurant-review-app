import { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { getRestaurantById } from '../services/api';

function RestaurantDetail({ restaurantId, onBack }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantDetail();
  }, [restaurantId]);

  const fetchRestaurantDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO 1: เรียก getRestaurantById
      const result = await getRestaurantById(restaurantId);
      
      // TODO 2: ตั้งค่า state
      if (result.success) {
        setRestaurant(result.data);
      } else {
        setError('ไม่พบข้อมูลร้านอาหาร');
      }
      
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลร้านได้ กรุณาลองใหม่อีกครั้ง');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    // Refresh ข้อมูลหลังจากเพิ่มรีวิวใหม่
    fetchRestaurantDetail();
  };

  const getPriceDisplay = (range) => {
    return '฿'.repeat(range);
  };
  
  if (loading) return <div className="loading">กำลังโหลด...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div className="error">ไม่พบร้านอาหาร</div>;

  return (
    <div className="restaurant-detail">
      <button className="back-button" onClick={onBack}>
        ← กลับ
      </button>
      
      <div className="detail-header">
        {/* เพิ่ม Image Fallback: ถ้าโหลดภาพล้มเหลว ให้แสดง Placeholder */}
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          onError={(e) => {
            e.target.onerror = null; // ป้องกันการวนซ้ำ
            // ใช้ Placeholder Image ที่สวยงามกว่าเดิม
            e.target.src = `https://placehold.co/450x350/a5b4fc/3730a3?text=${encodeURIComponent(restaurant.name)}`; 
          }}
        />
        <div className="detail-info">
          <h1>{restaurant.name}</h1>
          <p className="category">{restaurant.category}</p>
          <p className="description">{restaurant.description}</p>
          <div className="info-row">
            <span>📍 {restaurant.location}</span>
            <span>📞 {restaurant.phone}</span>
            <span>🕐 {restaurant.openHours}</span>
          </div>
          <div className="rating-info">
            <span className="rating">
              ⭐ {restaurant.averageRating > 0 
                ? restaurant.averageRating.toFixed(1) 
                : 'ยังไม่มีรีวิว'}
            </span>
            <span className="price">{getPriceDisplay(restaurant.priceRange)}</span>
            <span className="total-reviews">({restaurant.totalReviews} รีวิว)</span>
          </div>
        </div>
      </div>

      <ReviewForm 
        restaurantId={restaurantId} 
        onReviewAdded={handleReviewAdded}
      />
      
      <ReviewList reviews={restaurant.reviews || []} />
    </div>
  );
}

export default RestaurantDetail;
