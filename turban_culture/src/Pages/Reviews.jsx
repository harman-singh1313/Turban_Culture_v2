import React, { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    text: "",
  });

  // Fetch Reviews
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews`
      );

      setReviews(res.data.reviews || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews`,
        formData
      );

      alert(
        "Thank you! Your review has been submitted and is waiting for approval."
      );

      setFormData({
        name: "",
        rating: 5,
        text: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <h2 className="text-center text-3xl sm:text-4xl font-serif text-[#c9913a] mb-8 sm:mb-12">
          Client Reviews
        </h2>

        {loading ? (
          <div className="text-center text-gray-500 text-base sm:text-lg">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 text-base sm:text-lg">
            No reviews available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl shadow-md p-5 sm:p-6 transition duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                {/* Rating */}
                <div className="text-[#c9913a] mb-3 sm:mb-4 text-base sm:text-lg">
                  {"⭐".repeat(review.rating)}
                </div>

                {/* Review Text */}
                <p className="text-[#555] leading-6 sm:leading-7 text-sm sm:text-base">
                  "{review.text}"
                </p>

                {/* Reviewer */}
                <div className="mt-5 sm:mt-6 border-t pt-4">
                  <h3 className="font-semibold text-base sm:text-lg">
                    {review.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#888]">
                    Verified Customer
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit a Review Form */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <h3 className="text-center text-2xl sm:text-3xl font-serif text-[#c9913a] mb-6 sm:mb-8">
          Share Your Experience
        </h3>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-5 sm:p-8 space-y-4 sm:space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-[#555] mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#c9913a]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#555] mb-1">
              Rating
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#c9913a] bg-white"
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Very Good</option>
              <option value={3}>⭐⭐⭐ Good</option>
              <option value={2}>⭐⭐ Fair</option>
              <option value={1}>⭐ Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#555] mb-1">
              Your Review
            </label>
            <textarea
              name="text"
              required
              rows={4}
              value={formData.text}
              onChange={handleChange}
              placeholder="Tell us about your experience"
              className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#c9913a] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#c9913a] hover:bg-[#b07f2f] disabled:opacity-60 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
