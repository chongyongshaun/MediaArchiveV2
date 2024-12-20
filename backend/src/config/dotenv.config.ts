import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    simkl: {
        clientId: process.env.SIMKL_CLIENT_ID,
        clientSecret: process.env.SIMKL_CLIENT_SECRET,
        redirectUri: process.env.SIMKL_REDIRECT_URI
    },
    anilist: {
        clientId: process.env.ANILIST_CLIENT_ID,
        clientSecret: process.env.ANILIST_CLIENT_SECRET,
    },
    mongodbURI: process.env.MONGO_URI
};
