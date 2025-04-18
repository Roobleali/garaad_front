import React from 'react';

interface ExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    explanation: string;
    image?: string;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
    isOpen,
    onClose,
    explanation,
    image
}) => {
    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50
                transition-opacity duration-300 ease-out
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
        >
            <div
                className={`
                    bg-white rounded-2xl w-full sm:w-[600px] md:w-[700px] lg:w-[800px] overflow-hidden
                    transform transition-all duration-300 ease-out
                    ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold">Sharraxaad</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    {image && (
                        <div className="flex justify-center mb-6">
                            <div className="max-w-[50%] w-fit">
                                <img
                                    src={image}
                                    alt="Explanation visualization"
                                    className="w-full h-auto rounded-lg shadow-md object-contain"
                                />
                            </div>
                        </div>
                    )}
                    <p className="text-gray-700 text-base whitespace-pre-wrap leading-relaxed">
                        {explanation}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExplanationModal; 