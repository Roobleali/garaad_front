import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const LessonProgress = () => {
    const currentLesson = useSelector((state: RootState) => state.learning.currentLesson);
    const currentModule = useSelector((state: RootState) => state.learning.currentModule.data);

    const calculateProgress = () => {
        if (!currentModule?.lessons || !currentLesson) return 0;
        const currentIndex = currentModule.lessons.findIndex(lesson => lesson.id === currentLesson.id);
        return ((currentIndex + 1) / currentModule.lessons.length) * 100;
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-2">
                <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute h-full bg-green-500 transition-all duration-500 ease-out"
                        style={{ width: `${calculateProgress()}%` }}
                    />
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center space-x-2 hover:text-gray-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <div className="font-medium">
                        {currentModule?.title} - Lesson {currentLesson?.order}
                    </div>
                    <div className="w-16" /> {/* Spacer for alignment */}
                </div>
            </div>
        </div>
    );
};

export default LessonProgress; 