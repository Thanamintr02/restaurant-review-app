import { useState } from 'react';
import { addReview } from '../services/api';

function ReviewForm({ restaurantId, onReviewAdded }) {
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: '',
    // ตั้งค่าวันปัจจุบันเป็นค่าสูงสุด
    visitDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const trimmedUserName = formData.userName.trim();
    const trimmedComment = formData.comment.trim();
    
    // ========================================
    // TODO 1: Validate userName (2-50 ตัวอักษร)
    // ========================================
    if (!trimmedUserName) {
      newErrors.userName = 'กรุณากรอกชื่อ';
    } else if (trimmedUserName.length < 2) {
      newErrors.userName = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
    } else if (trimmedUserName.length > 50) {
      newErrors.userName = 'ชื่อต้องไม่เกิน 50 ตัวอักษร';
    }
    
    // ========================================
    // TODO 2: Validate rating (1-5)
    // ========================================
    const ratingNum = parseInt(formData.rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      newErrors.rating = 'คะแนนต้องอยู่ระหว่าง 1-5';
    }
    
    // ========================================
    // TODO 3: Validate comment (10-500 ตัวอักษร)
    // ========================================
    if (!trimmedComment) {
      newErrors.comment = 'กรุณากรอกความคิดเห็น';
    } else if (trimmedComment.length < 10) {
      newErrors.comment = 'ความคิดเห็นต้องมีอย่างน้อย 10 ตัวอักษร';
    } else if (trimmedComment.length > 500) {
      newErrors.comment = 'ความคิดเห็นต้องไม่เกิน 500 ตัวอักษร';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // เลื่อน focus ไปที่ input แรกที่มี error เพื่อให้ user ทราบ
      const firstErrorElement = document.querySelector('.form-group .invalid');
      if (firstErrorElement) {
        firstErrorElement.focus();
      }
      return;
    }
    
    try {
      setSubmitting(true);
      
      // TODO 4: เรียก addReview API
      const result = await addReview({
        restaurantId,
        userName: formData.userName.trim(), // ใช้ค่าที่ trim แล้ว
        rating: parseInt(formData.rating),
        comment: formData.comment.trim(), // ใช้ค่าที่ trim แล้ว
        visitDate: formData.visitDate
      });
      
      // TODO 5: ถ้าสำเร็จ
      if (result.success) {
        // ใช้ console.log แทน alert ตามคำแนะนำ
        console.log('เพิ่มรีวิวสำเร็จ!', result.message); 
        
        // reset form
        setFormData({
          userName: '',
          rating: 5,
          comment: '',
          visitDate: new Date().toISOString().split('T')[0]
        });
        setErrors({});
        
        // เรียก callback เพื่ออัพเดทรีวิวในหน้า RestaurantDetail
        if (onReviewAdded) {
          onReviewAdded();
        }
      }
      
    } catch (error) {
      console.error('Error adding review:', error);
      // แสดงข้อความ error ที่อาจมาจาก Backend
      alert(error.message || 'เกิดข้อผิดพลาดในการส่งรีวิว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function สำหรับอัพเดทค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error เมื่อผู้ใช้เริ่มพิมพ์
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="review-form">
      <h3>เขียนรีวิว</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ชื่อของคุณ *</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="กรอกชื่อ-นามสกุล"
            className={errors.userName ? 'invalid' : ''}
          />
          {errors.userName && <span className="error">{errors.userName}</span>}
        </div>

        <div className="form-group">
          <label>คะแนน *</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className={errors.rating ? 'invalid' : ''}
          >
            <option value="5">⭐⭐⭐⭐⭐ ดีเยี่ยม</option>
            <option value="4">⭐⭐⭐⭐ ดีมาก</option>
            <option value="3">⭐⭐⭐ ดี</option>
            <option value="2">⭐⭐ พอใช้</option>
            <option value="1">⭐ ต้องปรับปรุง</option>
          </select>
          {errors.rating && <span className="error">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label>ความคิดเห็น *</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="เล่าประสบการณ์การทานอาหารที่ร้านนี้... (อย่างน้อย 10 ตัวอักษร)"
            rows="4"
            maxLength={500}
            className={errors.comment ? 'invalid' : ''}
          />
          <div className="char-count">
            {formData.comment.length}/500 ตัวอักษร
          </div>
          {errors.comment && <span className="error">{errors.comment}</span>}
        </div>

        <div className="form-group">
          <label>วันที่เข้าร้าน</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // ป้องกันการเลือกวันที่ในอนาคต
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
