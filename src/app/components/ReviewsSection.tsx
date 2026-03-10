import React, { useState, useEffect, useRef } from "react";

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date?: string;
  verified?: boolean;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    style={{ display: "inline-block" }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ReviewCard = ({
  review,
  index,
}: {
  review: Review;
  index: number;
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 120);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        backgroundColor: "#141414",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative quote mark */}
      <span
        style={{
          position: "absolute",
          top: "1rem",
          right: "1.5rem",
          fontSize: "5rem",
          lineHeight: 1,
          color: "rgba(255,255,255,0.04)",
          fontFamily: "Georgia, serif",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        "
      </span>

      {/* Stars */}
      <div style={{ color: "#c9a84c", display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} filled={i <= review.rating} />
        ))}
      </div>

      {/* Comment */}
      <p
        style={{
          color: "rgba(255,255,255,0.82)",
          fontSize: "0.95rem",
          lineHeight: 1.7,
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
          margin: 0,
          flexGrow: 1,
        }}
      >
        {review.comment}
      </p>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "1rem",
          marginTop: "0.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Avatar inicial */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(201,168,76,0.15)",
              border: "1px solid rgba(201,168,76,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c9a84c",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p
              style={{
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: 500,
                margin: 0,
                letterSpacing: "0.03em",
              }}
            >
              {review.name}
            </p>
            {review.date && (
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                  margin: 0,
                  marginTop: "1px",
                }}
              >
                {review.date}
              </p>
            )}
          </div>
        </div>

        {review.verified !== false && (
          <span
            style={{
              fontSize: "0.7rem",
              color: "rgba(201,168,76,0.7)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Verificado
          </span>
        )}
      </div>
    </div>
  );
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const totalReviews = reviews.length;
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
  const fullStars = Math.floor(avgRating);

  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTitleVisible(true);
      },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#0e0e0e",
        padding: "6rem 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        {/* Header */}
        <div
          ref={titleRef}
          style={{
            marginBottom: "4rem",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: "1rem",
              margin: "0 0 1rem 0",
            }}
          >
            Testimonios
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: 0,
                fontFamily: "'Georgia', serif",
              }}
            >
              Lo que dicen
              <br />
              nuestros clientes.
            </h2>

            {/* Rating summary */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "1.25rem 1.75rem",
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "#141414",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {avgRating.toFixed(1)}
                </p>
                <div
                  style={{
                    color: "#c9a84c",
                    display: "flex",
                    gap: "2px",
                    marginTop: "0.4rem",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} filled={i <= fullStars} />
                  ))}
                </div>
              </div>
              <div
                style={{
                  width: "1px",
                  height: "40px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              />
              <div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {totalReviews} reseñas
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.75rem",
                    margin: "4px 0 0 0",
                  }}
                >
                  Clientes verificados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1px",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;