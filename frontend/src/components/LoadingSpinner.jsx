/**
 * Loading Spinner Component
 * Displays a loading animation
 */
const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div
                className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
            ></div>
            {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
