export interface Review {
  id: string;
  category: 'movies' | 'tv-series' | 'cricket' | 'mobile-apps';
  itemName: string;
  rating: number;
  reviewText: string;
  submissionDate: string;
}

const STORAGE_KEY = 'flash_feedback_reviews';

export const reviewStorage = {
  // Get all reviews
  getReviews: (): Review[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading reviews from storage:', error);
      return [];
    }
  },

  // Add a new review
  addReview: (review: Omit<Review, 'id' | 'submissionDate'>): Review => {
    const newReview: Review = {
      ...review,
      id: crypto.randomUUID(),
      submissionDate: new Date().toISOString(),
    };

    const reviews = reviewStorage.getReviews();
    reviews.push(newReview);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
      return newReview;
    } catch (error) {
      console.error('Error saving review to storage:', error);
      throw new Error('Failed to save review');
    }
  },

  // Get reviews by category
  getReviewsByCategory: (category: Review['category']): Review[] => {
    return reviewStorage.getReviews().filter(review => review.category === category);
  },

  // Delete a review
  deleteReview: (id: string): void => {
    const reviews = reviewStorage.getReviews().filter(review => review.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error('Error deleting review from storage:', error);
      throw new Error('Failed to delete review');
    }
  },

  // Get analytics data
  getAnalytics: () => {
    const reviews = reviewStorage.getReviews();
    
    // Sentiment distribution (1-2: negative, 3: neutral, 4-5: positive)
    const sentiments = {
      positive: reviews.filter(r => r.rating >= 4).length,
      neutral: reviews.filter(r => r.rating === 3).length,
      negative: reviews.filter(r => r.rating <= 2).length,
    };

    // Average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    // Top and lowest rated by category
    const byCategory = {
      movies: reviews.filter(r => r.category === 'movies'),
      'tv-series': reviews.filter(r => r.category === 'tv-series'),
      cricket: reviews.filter(r => r.category === 'cricket'),
      'mobile-apps': reviews.filter(r => r.category === 'mobile-apps'),
    };

    const topRated = Object.entries(byCategory).map(([category, categoryReviews]) => ({
      category,
      items: categoryReviews
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
    }));

    const lowestRated = Object.entries(byCategory).map(([category, categoryReviews]) => ({
      category,
      items: categoryReviews
        .sort((a, b) => a.rating - b.rating)
        .slice(0, 3)
    }));

    return {
      totalReviews: reviews.length,
      sentiments,
      averageRating,
      topRated,
      lowestRated,
    };
  },
};