import { Request, Response } from "express";
import { fetchSimklData } from "../services/simkl.service";
import axios from "axios";
import { config } from "../config/dotenv.config";
import Show from "../models/Show";
import Movie from "../models/Movie";
import Token from "../models/Token";

const getAuthHeader = async () => {
    const tokenDoc = await Token.findOne().sort({ createdAt: -1 });
    if (!tokenDoc) {
        throw new Error("Access token not found");
    }
    return {
        Authorization: `Bearer ${tokenDoc.accessToken}`,
        "simkl-api-key": config.simkl.clientId
    };
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
        const authHeader = await getAuthHeader();
        const response = await axios.get("https://api.simkl.com/sync/all-items/", { headers: authHeader })
        const data = response.data;
        // Extract and save shows data to MongoDB
        const shows = data.shows.map((item: any) => ({
            title: item.show.title,
            userRating: item.user_rating,
            status: item.status,
            simklId: item.show.ids.simkl
        }));
        for (const show of shows) {
            await Show.findOneAndUpdate({ simklId: show.simklId }, show, { upsert: true });
        }
        //callback function for .map() it applies the function to every single element in the data array and returns a new array
        const movies = data.movies.map((item: any)=>{
            return {
                title: item.movie.title,
                userRating: item.user_rating,
                status: item.status,
                simklId: item.movie.ids.simkl
            }
        })
        for (const movie of movies) { 
            //first param is the filter, matches the simkl id to the curr movie obj and the 2nd param is the data to update with, which is the entire curr movie obj
            //upsert is true, so if the movie is not found, it will be created
            await Movie.findOneAndUpdate({ simklId: movie.simklId }, movie, { upsert: true });
        }

        res.status(200).json({ message: "Shows data synced successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to sync all Simkl data" });
    }
}

export const getFullSimklActivities = async (req: Request, res: Response) => {
    try {
        // console.log("Using access token:", accessToken); // Log the access token for debugging
        // the empty {} is the body of the request, you need it for post requests 
        const authHeader = await getAuthHeader();
        const response = await axios.post("https://api.simkl.com/sync/activities", {}, { headers: authHeader });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch all Simkl activities" });
    }
};

const tempDateFromVal = "2024-12-05T20:14:59Z";
export const getUpdatedSimklData = async (req: Request, res: Response) => {
    try {
        const authHeader = await getAuthHeader();
        const response = await axios.get(`https://api.simkl.com/sync/all-items/shows/?date_from=${tempDateFromVal}`, { headers: authHeader })
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "failed to fetch updated data" });
    }
}
export const getUpdatedRatingsData = async (req: Request, res: Response) => {
    try {
        const authHeader = await getAuthHeader();
        const response = await axios.get(`https://api.simkl.com/sync/ratings/?date_from=${tempDateFromVal}`, { headers: authHeader })
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "failed to fetch updated data of items with changed ratings" });
    }
}