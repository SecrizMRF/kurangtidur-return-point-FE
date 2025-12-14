/**
 * Image Helper Utility
 * Resolves image URLs correctly for both local and production environments
 */

const API_BASE_URL = 'https://kurangtidur-return-point-be.vercel.app';

/**
 * Get the full image URL for display
 * @param {string} photoPath - The photo path from the API (e.g., "/uploads/filename" or full URL)
 * @returns {string} The full URL to display
 */
export const getImageUrl = (photoPath) => {
  if (!photoPath) return null;
  
  // If it's already a full URL (starts with http or https), return as is
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  // If it's a relative path (starts with /), prepend the API base URL
  if (photoPath.startsWith('/')) {
    return `${API_BASE_URL}${photoPath}`;
  }
  
  // Otherwise, prepend /uploads/ and the API base URL
  return `${API_BASE_URL}/uploads/${photoPath}`;
};

/**
 * Get the best available image from an item object
 * @param {object} item - The item object from API
 * @returns {string|null} The image URL or null
 */
export const getItemImageUrl = (item) => {
  if (!item) return null;
  
  // Try different field names that might contain the image
  const photoPath = item.photo || item.image_url || item.photoUrl || null;
  
  if (!photoPath) return null;
  
  return getImageUrl(photoPath);
};

export default {
  getImageUrl,
  getItemImageUrl
};
