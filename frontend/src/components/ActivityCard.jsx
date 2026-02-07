/**
 * Activity Card Component
 * Displays an activity log entry
 */
const ActivityCard = ({ activityLog }) => {
    const activityIcons = {
        walking: '🚶',
        running: '🏃',
        cycling: '🚴',
        gym: '💪',
        yoga: '🧘',
        swimming: '🏊',
        dancing: '💃',
        hiking: '🥾',
    };

    const icon = activityIcons[activityLog.activity_type.toLowerCase()] || '🏃';

    return (
        <div className="card hover:scale-105 transition-transform">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <div className="text-4xl">{icon}</div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">
                            {activityLog.activity_type}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                            Duration: {activityLog.duration_minutes} minutes
                        </p>
                        <p className="text-sm text-gray-500">
                            {new Date(activityLog.date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gradient">
                        {Math.round(activityLog.calories_burned)}
                    </p>
                    <p className="text-xs text-gray-500">calories burned</p>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
