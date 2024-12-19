import axios from "axios";
import { config } from "../config/dotenv.config";

const SIMKL_API_BASE_URL = "https://api.simkl.com";

export const fetchSimklData = async () => {
    const response = await axios.get(`${SIMKL_API_BASE_URL}/movies/trending`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.simkl.clientId}`,
        },
    });
    return response.data;
};
