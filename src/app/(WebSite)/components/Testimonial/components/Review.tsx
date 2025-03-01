"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchReviews } from "@/actions/gestion/action";

interface ReviewType {
  reviewId: string;
  starRating: number;
  comment: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
}

export function Review() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews(); // Appel direct du Server Action
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadReviews();
  }, []);

  return (
    <div className="w-full">
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.reviewId} className="rounded-lg bg-white p-4 shadow">
            <div className="mb-2 flex items-center">
              <Image
                src={review.reviewer.profilePhotoUrl || "/icons/avatar.png"}
                alt={review.reviewer.displayName}
                width={40}
                height={40}
                className="mr-2 h-10 w-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{review.reviewer.displayName}</p>
                <p className="text-yellow-500">
                  {"★".repeat(review.starRating)}
                </p>
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
