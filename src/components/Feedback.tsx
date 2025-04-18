import React from 'react';

interface FeedbackProps {
    isCorrect: boolean;
    explanation?: string;
}

const Feedback: React.FC<FeedbackProps> = ({ isCorrect, explanation }) => {
    return (
        <div className="flex justify-center w-full my-4">
            <div className="bg-[#FFF3D1] rounded-lg p-4 max-w-md w-full">
                <div className="text-base mb-2">
                    {isCorrect ? (
                        "Waa sax! Aad ayaad u fiicantahay!"
                    ) : (
                        "Ma ahan. Isku day mar kale."
                    )}
                </div>
                {explanation && (
                    <div className="text-sm text-gray-700 mt-2">
                        {explanation}
                    </div>
                )}
                <div className="flex gap-2 mt-3">
                    {!isCorrect && (
                        <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
                            Isku day mar kale
                        </button>
                    )}
                    <button className="bg-[#FFE7A3] text-black px-4 py-2 rounded-full text-sm">
                        Jawaabta fiiri
                    </button>
                    <button className="ml-auto">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Feedback; 