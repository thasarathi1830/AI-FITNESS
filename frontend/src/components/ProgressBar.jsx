/**
 * Progress Bar Component
 * Displays a visual progress indicator
 */
const ProgressBar = ({ value, max, label, color = 'primary' }) => {
    const percentage = Math.min((value / max) * 100, 100);

    const colorClasses = {
        primary: 'from-primary-500 to-primary-600',
        accent: 'from-accent-500 to-accent-600',
        success: 'from-green-500 to-green-600',
        warning: 'from-yellow-500 to-yellow-600',
        danger: 'from-red-500 to-red-600',
    };

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
