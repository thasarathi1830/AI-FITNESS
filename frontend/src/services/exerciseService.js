/**
 * ExerciseDB API Service
 * Fetches exercise data from RapidAPI ExerciseDB
 */

const EXERCISEDB_API_KEY = import.meta.env.VITE_EXERCISEDB_API_KEY;
const EXERCISEDB_API_HOST = import.meta.env.VITE_EXERCISEDB_API_HOST;
const BASE_URL = `https://${EXERCISEDB_API_HOST}`;

const headers = {
    'X-RapidAPI-Key': EXERCISEDB_API_KEY,
    'X-RapidAPI-Host': EXERCISEDB_API_HOST
};

export const exerciseService = {
    /**
     * Get list of exercises with optional filters
     */
    async getExercises(limit = 20, offset = 0) {
        try {
            const response = await fetch(
                `${BASE_URL}/exercises?limit=${limit}&offset=${offset}`,
                { headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises:', error);
            throw error;
        }
    },

    /**
     * Search exercises by name
     */
    async searchExercises(query) {
        try {
            const response = await fetch(
                `${BASE_URL}/exercises/name/${query}`,
                { headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error searching exercises:', error);
            throw error;
        }
    },

    /**
     * Get exercises by body part
     */
    async getExercisesByBodyPart(bodyPart) {
        try {
            const response = await fetch(
                `${BASE_URL}/exercises/bodyPart/${bodyPart}`,
                { headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises by body part:', error);
            throw error;
        }
    },

    /**
     * Get exercises by target muscle
     */
    async getExercisesByTarget(target) {
        try {
            const response = await fetch(
                `${BASE_URL}/exercises/target/${target}`,
                { headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises by target:', error);
            throw error;
        }
    },

    /**
     * Get exercises by equipment
     */
    async getExercisesByEquipment(equipment) {
        try {
            const response = await fetch(
                `${BASE_URL}/exercises/equipment/${equipment}`,
                { headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises by equipment:', error);
            throw error;
        }
    },

    /**
     * Get list of body parts
     */
    async getBodyPartList() {
        try {
            const response = await fetch(
                `${BASE_URL}/exercises/bodyPartList`,
                { headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching body part list:', error);
            throw error;
        }
    },

    /**
     * Get list of target muscles
     */
    async getTargetList() {
        try {
            const response = await fetch(
                `${BASE_URL}/exercises/targetList`,
                { headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching target list:', error);
            throw error;
        }
    },

    /**
     * Get list of equipment
     */
    async getEquipmentList() {
        try {
            const response = await fetch(
                `${BASE_URL}/exercises/equipmentList`,
                { headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching equipment list:', error);
            throw error;
        }
    }
};
