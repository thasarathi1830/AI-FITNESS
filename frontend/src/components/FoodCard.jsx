/**
 * Food Card Component
 * Displays a food log entry
 */
const FoodCard = ({ foodLog }) => {
    return (
        <div className="card hover:scale-105 transition-transform">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {foodLog.food_name}
                        </h3>
                        {foodLog.is_ai_detected && (
                            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                                AI Detected
                            </span>
                        )}
                    </div>
                    {foodLog.quantity && (
                        <p className="text-sm text-gray-600 mb-1">
                            Quantity: {foodLog.quantity}
                        </p>
                    )}
                    <p className="text-sm text-gray-500">
                        {new Date(foodLog.date).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gradient">
                        {Math.round(foodLog.calories)}
                    </p>
                    <p className="text-xs text-gray-500">calories</p>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
