/**
 * Local Exercise Data Service
 * Loads and manages 873 local exercises with images
 */

// Exercise categories for featured splits
export const EXERCISE_CATEGORIES = {
    SQUATS: 'squats',
    DEADLIFTS: 'deadlifts',
    BENCH_PRESS: 'bench_press',
    PULL_UPS: 'pull_ups',
    SHOULDER_PRESS: 'shoulder_press',
    ROWS: 'rows',
    CURLS: 'curls',
    TRICEPS: 'triceps',
    CORE: 'core',
    LEGS: 'legs'
};

// Featured exercise splits with specific exercises
export const FEATURED_SPLITS = {
    [EXERCISE_CATEGORIES.SQUATS]: {
        title: 'Squats',
        icon: '🏋️',
        exercises: [
            'Barbell_Squat',
            'Barbell_Full_Squat',
            'Front_Barbell_Squat',
            'Goblet_Squat',
            'Dumbbell_Squat',
            'Box_Squat',
            'Overhead_Squat',
            'Bodyweight_Squat',
            'Hack_Squat',
            'Split_Squats'
        ]
    },
    [EXERCISE_CATEGORIES.DEADLIFTS]: {
        title: 'Deadlifts',
        icon: '💪',
        exercises: [
            'Barbell_Deadlift',
            'Romanian_Deadlift',
            'Sumo_Deadlift',
            'Stiff-Legged_Barbell_Deadlift',
            'Deficit_Deadlift',
            'Trap_Bar_Deadlift',
            'Rack_Pulls',
            'Stiff-Legged_Dumbbell_Deadlift'
        ]
    },
    [EXERCISE_CATEGORIES.BENCH_PRESS]: {
        title: 'Bench Press',
        icon: '🔥',
        exercises: [
            'Barbell_Bench_Press_-_Medium_Grip',
            'Dumbbell_Bench_Press',
            'Incline_Dumbbell_Press',
            'Barbell_Incline_Bench_Press_-_Medium_Grip',
            'Decline_Barbell_Bench_Press',
            'Close-Grip_Barbell_Bench_Press',
            'Dumbbell_Flyes',
            'Incline_Dumbbell_Flyes'
        ]
    },
    [EXERCISE_CATEGORIES.PULL_UPS]: {
        title: 'Pull-Ups & Chin-Ups',
        icon: '🎯',
        exercises: [
            'Pullups',
            'Chin-Up',
            'Wide-Grip_Lat_Pulldown',
            'Close-Grip_Front_Lat_Pulldown',
            'Underhand_Cable_Pulldowns',
            'V-Bar_Pullup',
            'Mixed_Grip_Chin'
        ]
    },
    [EXERCISE_CATEGORIES.SHOULDER_PRESS]: {
        title: 'Shoulder Press',
        icon: '💥',
        exercises: [
            'Barbell_Shoulder_Press',
            'Dumbbell_Shoulder_Press',
            'Arnold_Dumbbell_Press',
            'Standing_Military_Press',
            'Seated_Barbell_Military_Press',
            'Push_Press',
            'Side_Lateral_Raise',
            'Front_Dumbbell_Raise'
        ]
    },
    [EXERCISE_CATEGORIES.ROWS]: {
        title: 'Rows',
        icon: '⚡',
        exercises: [
            'Bent_Over_Barbell_Row',
            'One-Arm_Dumbbell_Row',
            'Seated_Cable_Rows',
            'T-Bar_Row_with_Handle',
            'Bent_Over_Two-Dumbbell_Row',
            'Inverted_Row'
        ]
    },
    [EXERCISE_CATEGORIES.CURLS]: {
        title: 'Bicep Curls',
        icon: '💪',
        exercises: [
            'Barbell_Curl',
            'Dumbbell_Bicep_Curl',
            'Hammer_Curls',
            'Preacher_Curl',
            'Concentration_Curls',
            'Incline_Dumbbell_Curl',
            'EZ-Bar_Curl',
            'Cable_Hammer_Curls_-_Rope_Attachment'
        ]
    },
    [EXERCISE_CATEGORIES.TRICEPS]: {
        title: 'Triceps',
        icon: '🔨',
        exercises: [
            'Triceps_Pushdown',
            'Close-Grip_Barbell_Bench_Press',
            'Dips_-_Triceps_Version',
            'Tricep_Dumbbell_Kickback',
            'EZ-Bar_Skullcrusher',
            'Cable_Rope_Overhead_Triceps_Extension',
            'Bench_Dips'
        ]
    },
    [EXERCISE_CATEGORIES.CORE]: {
        title: 'Core & Abs',
        icon: '🎪',
        exercises: [
            'Crunches',
            'Plank',
            'Russian_Twist',
            'Hanging_Leg_Raise',
            'Cable_Crunch',
            'Ab_Roller',
            'Bicycle_Crunches',
            'Mountain_Climbers'
        ]
    },
    [EXERCISE_CATEGORIES.LEGS]: {
        title: 'Leg Exercises',
        icon: '🦵',
        exercises: [
            'Leg_Press',
            'Leg_Extensions',
            'Lying_Leg_Curls',
            'Barbell_Lunge',
            'Dumbbell_Lunges',
            'Standing_Calf_Raises',
            'Seated_Calf_Raise',
            'Leg_Lift'
        ]
    }
};

/**
 * Load a single exercise from JSON file
 */
export const loadExercise = async (exerciseId) => {
    try {
        const response = await fetch(`/exercises/${exerciseId}.json`);
        if (!response.ok) {
            console.warn(`Exercise ${exerciseId} not found`);
            return null;
        }
        const data = await response.json();
        return {
            ...data,
            images: data.images?.map(img => `/exercises/${img}`) || []
        };
    } catch (error) {
        console.error(`Error loading exercise ${exerciseId}:`, error);
        return null;
    }
};

/**
 * Load multiple exercises by IDs
 */
export const loadExercises = async (exerciseIds) => {
    const promises = exerciseIds.map(id => loadExercise(id));
    const results = await Promise.all(promises);
    return results.filter(ex => ex !== null);
};

/**
 * Load exercises for a specific category
 */
export const loadCategoryExercises = async (category) => {
    const split = FEATURED_SPLITS[category];
    if (!split) return [];
    return await loadExercises(split.exercises);
};

/**
 * Load all featured exercises
 */
export const loadAllFeaturedExercises = async () => {
    const allExerciseIds = Object.values(FEATURED_SPLITS)
        .flatMap(split => split.exercises);

    // Remove duplicates
    const uniqueIds = [...new Set(allExerciseIds)];
    return await loadExercises(uniqueIds);
};

/**
 * Search exercises by name
 */
export const searchExercises = (exercises, query) => {
    if (!query) return exercises;
    const lowerQuery = query.toLowerCase();
    return exercises.filter(ex =>
        ex.name.toLowerCase().includes(lowerQuery)
    );
};

/**
 * Filter exercises by equipment
 */
export const filterByEquipment = (exercises, equipment) => {
    if (!equipment) return exercises;
    return exercises.filter(ex =>
        ex.equipment?.toLowerCase() === equipment.toLowerCase()
    );
};

/**
 * Filter exercises by primary muscle
 */
export const filterByMuscle = (exercises, muscle) => {
    if (!muscle) return exercises;
    return exercises.filter(ex =>
        ex.primaryMuscles?.some(m => m.toLowerCase() === muscle.toLowerCase())
    );
};

/**
 * Get unique equipment types from exercises
 */
export const getEquipmentTypes = (exercises) => {
    const equipment = exercises
        .map(ex => ex.equipment)
        .filter(Boolean);
    return [...new Set(equipment)].sort();
};

/**
 * Get unique muscle groups from exercises
 */
export const getMuscleGroups = (exercises) => {
    const muscles = exercises
        .flatMap(ex => ex.primaryMuscles || [])
        .filter(Boolean);
    return [...new Set(muscles)].sort();
};

export default {
    EXERCISE_CATEGORIES,
    FEATURED_SPLITS,
    loadExercise,
    loadExercises,
    loadCategoryExercises,
    loadAllFeaturedExercises,
    searchExercises,
    filterByEquipment,
    filterByMuscle,
    getEquipmentTypes,
    getMuscleGroups
};
