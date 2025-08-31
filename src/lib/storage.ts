export interface Review {
  id: string;
  category: 'movies' | 'tv-series' | 'sports' | 'mobile-apps';
  subcategory?: string; // For sports: cricket, football, etc. For cricket: match, player, etc.
  itemName: string;
  rating: number;
  reviewText: string;
  submissionDate: string;
  // Additional fields for specific review types
  playerPosition?: string; // For player reviews
  battingStyle?: string; // For cricket player reviews
  bowlingStyle?: string; // For cricket player reviews
  matchDate?: string; // For match reviews
  teamA?: string; // For match reviews
  teamB?: string; // For match reviews
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

  // Check if review already exists for this specific item
  hasExistingReview: (category: Review['category'], itemName: string, subcategory?: string): boolean => {
    const reviews = reviewStorage.getReviews();
    return reviews.some(review => 
      review.category === category && 
      review.itemName.toLowerCase() === itemName.toLowerCase() &&
      review.subcategory === subcategory
    );
  },

  // Add a new review
  addReview: (review: Omit<Review, 'id' | 'submissionDate'>): Review => {
    // Check for existing review of this specific item
    if (reviewStorage.hasExistingReview(review.category, review.itemName, review.subcategory)) {
      throw new Error(`You have already reviewed "${review.itemName}". Please review a different item or edit your existing review.`);
    }

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

  // Get analytics data with Pareto distribution analysis
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

    // Reviews by category
    const byCategory = {
      movies: reviews.filter(r => r.category === 'movies'),
      'tv-series': reviews.filter(r => r.category === 'tv-series'),
      sports: reviews.filter(r => r.category === 'sports'),
      'mobile-apps': reviews.filter(r => r.category === 'mobile-apps'),
    };

    // Pareto Analysis - 80/20 distribution
    const categoryReviewCounts = Object.entries(byCategory).map(([category, categoryReviews]) => ({
      category,
      count: categoryReviews.length,
      percentage: reviews.length > 0 ? (categoryReviews.length / reviews.length) * 100 : 0
    })).sort((a, b) => b.count - a.count);

    // Calculate cumulative percentage for Pareto chart
    let cumulativeCount = 0;
    const paretoData = categoryReviewCounts.map(item => {
      cumulativeCount += item.count;
      return {
        ...item,
        cumulativePercentage: reviews.length > 0 ? (cumulativeCount / reviews.length) * 100 : 0
      };
    });

    // Rating distribution analysis with Pareto principle
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
    })).sort((a, b) => b.count - a.count);

    // Item popularity analysis (Pareto distribution)
    const itemFrequency = reviews.reduce((acc, review) => {
      const key = `${review.category}-${review.itemName}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularItems = Object.entries(itemFrequency)
      .map(([item, frequency]) => ({
        item: item.split('-').slice(1).join('-'), // Remove category prefix
        category: item.split('-')[0],
        frequency,
        percentage: reviews.length > 0 ? (frequency / reviews.length) * 100 : 0
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10); // Top 10 most reviewed items

    // Time-based Pareto analysis
    const reviewsByMonth = reviews.reduce((acc, review) => {
      const month = new Date(review.submissionDate).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyData = Object.entries(reviewsByMonth)
      .map(([month, count]) => ({
        month,
        count,
        percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Quality distribution (Pareto principle for high-quality reviews)
    const highQualityReviews = reviews.filter(r => r.reviewText.length > 50 && r.rating >= 4);
    const qualityDistribution = {
      highQuality: highQualityReviews.length,
      standardQuality: reviews.length - highQualityReviews.length,
      highQualityPercentage: reviews.length > 0 ? (highQualityReviews.length / reviews.length) * 100 : 0
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
      // Pareto distribution analytics
      paretoData,
      ratingDistribution: ratingCounts,
      popularItems,
      monthlyTrends: monthlyData,
      qualityDistribution
    };
  },
};