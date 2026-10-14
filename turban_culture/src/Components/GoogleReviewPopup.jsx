import React, { useEffect, useState } from "react";

const GoogleReviewPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    // Popup 10 seconds baad show hovega
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">

      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close review popup"
          className="absolute right-4 top-3 text-2xl text-gray-400 transition hover:text-gray-700"
        >
          ×
        </button>

        {/* Business */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Turban Culture
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            How was your experience?
          </p>
        </div>

        {/* Clickable Stars */}
        <div className="mb-3 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const activeRating = hoverRating || rating;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} star rating`}
                className={`
                  text-4xl leading-none
                  transition-all duration-150
                  hover:scale-110
                  ${
                    star <= activeRating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                `}
              >
                ★
              </button>
            );
          })}
        </div>

        {/* Rating Text */}
        <div className="mb-5 min-h-[24px] text-center">
          {rating > 0 && (
            <p className="text-sm font-medium text-gray-600">
              {rating === 1 && "Thanks for your feedback"}
              {rating === 2 && "Thanks for your feedback"}
              {rating === 3 && "Good — thanks for sharing"}
              {rating === 4 && "Great! We're glad you enjoyed it"}
              {rating === 5 && "Excellent!"}
            </p>
          )}
        </div>

        {/* Message */}
        <p className="mb-6 text-center text-sm leading-6 text-gray-600">
          Share your experience and help others discover Turban Culture.
        </p>

        {/* Google Review Button */}
        <a
          href="https://g.page/r/CcgQHA95BO4_EBM/review"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Write a review
        </a>

        {/* Maybe Later */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="mt-3 w-full text-center text-sm text-gray-500 transition hover:text-gray-800"
        >
          Maybe later
        </button>

      </div>

    </div>
  );
};

export default GoogleReviewPopup;