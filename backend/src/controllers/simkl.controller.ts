import { Request, Response } from "express";
import { fetchSimklData } from "../services/simkl.service";
import axios from "axios";
import { config } from "../config/dotenv.config";

//temporary add access token here for debug
const accessToken = "efcca8e078456307ac98c5b643aed0ad902e4a0dded7767f88a4300afb2d565b"
const authHeader = {
    Authorization: `Bearer ${accessToken}`,
    "simkl-api-key": config.simkl.clientId
};

//example request
export const syncSimklData = async (req: Request, res: Response) => {
    try {
        const data = await fetchSimklData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to sync Simkl data" });
    }
};

//first sync to get all the data from simkl
export const syncAllSimklData = async (req: Request, res: Response) => {
    try {
        const response = await axios.get("https://api.simkl.com/sync/all-items/", { headers: authHeader })
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to sync all Simkl data" });
    }
}

export const getFullSimklActivities = async (req: Request, res: Response) => {
    try {
        // console.log("Using access token:", accessToken); // Log the access token for debugging
        // the empty {} is the body of the request, you need it for post requests 
        const response = await axios.post("https://api.simkl.com/sync/activities", {}, { headers: authHeader });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch all Simkl activities" });
    }
};