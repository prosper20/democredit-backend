import axios from 'axios';
import { config } from '../config';

export const checkAdjutorKarmablacklist = async (email: string) => {
    const url = `${config.auth.karmaUrl}/${email}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${config.auth.karmaApiKey}`,
            },
        });

        const data = response.data;

        if (data.status === 'success' && data.message === 'Successful') {
            return true;
        }

        return false;
    } catch (error) {
        const response = error.response.data
        if (response.status === 'success' && response.message === 'Identity not found in karma ecosystem') {
            return false;
        }
        throw new Error("Error checking blacklist");
    }
};
