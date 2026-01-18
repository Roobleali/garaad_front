interface BugReportButtonProps {
    onClick: () => void;
}

const BugReportButton: React.FC<BugReportButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
            Report Bug
        </button>
    );
};

export default BugReportButton; 