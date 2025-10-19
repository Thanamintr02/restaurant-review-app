const API_URL = 'http://localhost:3000/api';

/**
 * ฟังก์ชันสำหรับดึงรายการร้านอาหารทั้งหมด พร้อม filtering
 * @param {Object} filters - ตัวกรอง { search, category, minRating, priceRange }
 * @returns {Promise} - ข้อมูลร้านอาหาร
 */
export const getRestaurants = async (filters = {}) => {
  try {
    // TODO 1: สร้าง query string จาก filters
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.minRating) queryParams.append('minRating', filters.minRating);
    if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
    
    // TODO 2: สร้าง URL พร้อม query string
    const url = `${API_URL}/restaurants?${queryParams.toString()}`;

    // TODO 3: fetch ข้อมูล
    const response = await fetch(url);
    
    // TODO 4: ตรวจสอบ response
    if (!response.ok) {
      throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
    }
    
    // TODO 5: แปลง response เป็น JSON และ return
    return await response.json();
    
  } catch (error) {
    console.error('API Error (getRestaurants):', error);
    // ส่ง error ต่อไปเพื่อให้ component สามารถจัดการสถานะ error ได้
    throw error;
  }
};

/**
 * ฟังก์ชันสำหรับดึงข้อมูลร้านอาหารตาม ID พร้อมรีวิว
 * @param {number} id - รหัสร้าน
 * @returns {Promise} - ข้อมูลร้านและรีวิว
 */
export const getRestaurantById = async (id) => {
  try {
    // TODO 6: เติมโค้ดตามตัวอย่าง getRestaurants
    const url = `${API_URL}/restaurants/${id}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        // หากเกิด error เช่น 404 Not Found
        throw new Error(`Failed to fetch restaurant details: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('API Error (getRestaurantById):', error);
    throw error;
  }
};

/**
 * ฟังก์ชันสำหรับเพิ่มรีวิวใหม่
 * @param {Object} reviewData - ข้อมูลรีวิว
 * @returns {Promise} - ผลลัพธ์การเพิ่มรีวิว
 */
export const addReview = async (reviewData) => {
  try {
    // TODO 7: เขียน POST request
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // ระบุว่าเราส่งข้อมูล JSON
      },
      body: JSON.stringify(reviewData) // แปลงข้อมูล JavaScript Object เป็น JSON String
    });
    
    // TODO 8: ตรวจสอบ response
    if (!response.ok) {
      // พยายามอ่านข้อความ error จาก Backend (ถ้ามี)
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to add review: ${response.statusText}`);
    }
    
    // TODO 9: return ข้อมูล JSON
    return await response.json();
    
  } catch (error) {
    console.error('API Error (addReview):', error);
    throw error;
  }
};
