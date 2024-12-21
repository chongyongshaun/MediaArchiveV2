import { Request, Response } from "express";
import { fetchSimklData } from "../services/simkl.service";
import axios from "axios";
import { config } from "../config/dotenv.config";
import Show from "../models/Show";
import Movie from "../models/Movie";
import Token from "../models/Token";
import SimklActivities from "../models/SimklActivities";

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


//route for "/"
export const syncSimklData = async (req: Request, res: Response) => {
    try {
        const data = await fetchSimklData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to sync Simkl data" });
    }
};

//route for "/" return all simkl data (first sync calls simkl api directly, after that get from db)
export const syncAllSimklData = async (req: Request, res: Response): Promise<any> => {
    try {
        // Check if data already exists in the database
        const existingShows = await Show.find();
        const existingMovies = await Movie.find();

        if (existingShows.length > 0 && existingMovies.length > 0) {
            // Data already exists, return it
            return res.status(200).json({ message: "fetched existing simkl data from db", shows: existingShows, movies: existingMovies });
        }
        //the logic below is for the initial sync, we call the simkl api directly for all the data
        // initialize the activities first to check for data updates
        getNewActivities()//save activities to db, ignore the response 
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
        const movies = data.movies.map((item: any) => {
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
        res.status(200).json({ message: "initialize activities, shows and movies", shows, movies }); //short hand for shows: shows, movies: movies
    } catch (error) {
        res.status(500).json({ error: "Failed to sync all Simkl data" });
    }
}

//route for "/activities" if there's a change in activities (for all, ratings, removals) returns the updated data, else returns empty res
export const updateHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        // Retrieve the saved activities from the database
        const savedActivities = await SimklActivities.findOne().sort({ createdAt: -1 });
        if (!savedActivities) {
            return res.status(404).json({ error: "No saved activities found" });
        }
        const newActivities = await getNewActivities();
        console.log("saved: ",savedActivities);
        console.log("new: ",newActivities);
        const combinedUpdates: any = {};

        // Check for data updates
        const dataUpdateDate = checkForDataUpdates(savedActivities, newActivities);
        console.log("dataUpdateDate: " + dataUpdateDate);
        if (dataUpdateDate) {
            //call /sync/all-items with the date_from param
            const updatedData = await getUpdatedSimklData(new Date(dataUpdateDate));
            combinedUpdates.data = updatedData;
            //call /sync/ratings with the date_from param
            const updatedRatingsData = await getUpdatedRatingsData(new Date(dataUpdateDate));
            combinedUpdates.ratings = updatedRatingsData;
        }
        // Check for removals


        // If no updates, return an empty response
        if (Object.keys(combinedUpdates).length === 0) {            
            return res.status(200).json({ message: "No updates found" });
        }        
        res.status(200).json(combinedUpdates);
    } catch (error) {
        console.error("Failed to update Simkl data:", error);
        res.status(500).json({ error: "Failed to update Simkl data" });
    }
}
//iso is the one with extra trailing 000s
const checkForDataUpdates = (savedActivities: any, newActivities: any): Date | null => {
    if (new Date(savedActivities.all).toISOString() !== new Date(newActivities.all).toISOString()) {
        return new Date(newActivities.all);
    }
    return null;
};
// const checkForRemovals = (savedActivities: any, newActivities: any): Date | null => {
//     if (new Date(savedActivities.tv_shows.removed_from_list).toISOString() !== new Date(newActivities.tv_shows.removed_from_list).toISOString() ||
//         new Date(savedActivities.movies.removed_from_list).toISOString() !== new Date(newActivities.movies.removed_from_list).toISOString()) {
//         return new Date(newActivities.all);
//     }
//     return null;
// };
const getNewActivities = async () => {
    try {
        // the empty {} is the body of the request, you need it for post requests 
        const authHeader = await getAuthHeader();
        const response = await axios.post("https://api.simkl.com/sync/activities", {}, { headers: authHeader });
        // Extract and save activities data to MongoDB
        const activities = new SimklActivities(response.data);
        await activities.save();
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch new activities data");
    }
}
// const tempDateFromVal = "2024-12-05T20:14:59Z";
const getUpdatedSimklData = async (date_from: Date) => {
    try {
        const authHeader = await getAuthHeader();
        const response = await axios.get(`https://api.simkl.com/sync/all-items/?date_from=${date_from}`, { headers: authHeader })
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch updated data");
    }
}
const getUpdatedRatingsData = async (date_from: Date) => {
    try {
        const authHeader = await getAuthHeader();
        const response = await axios.get(`https://api.simkl.com/sync/ratings/?date_from=${date_from}`, { headers: authHeader })
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch updated ratings data");
    }
}