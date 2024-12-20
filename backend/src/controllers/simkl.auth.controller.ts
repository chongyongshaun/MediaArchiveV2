import axios from "axios";
import { Request, Response } from "express";
import { config } from "../config/dotenv.config";
import Token from "../models/Token";

export const generateAuthUrl = (req: Request, res: Response) => {
    const { clientId, redirectUri } = config.simkl;

    const authUrl = `https://simkl.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    //this uses client id and redirects you to the simkl website, when the user clicks yes, it will send http /GET req to the callback URI and in the params it will contain the code
    res.redirect(authUrl);
};

export const handleCallback = async (req: Request, res: Response): Promise<any> => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Authorization code is missing" });
    }

    try {
        const tokenResponse = await axios.post("https://api.simkl.com/oauth/token", {
            code,
            client_id: config.simkl.clientId,
            client_secret: config.simkl.clientSecret,
            redirect_uri: config.simkl.redirectUri,
            grant_type: "authorization_code",
        });

        const { access_token } = tokenResponse.data;
        const token = new Token({ accessToken : access_token });
        await token.save();

        res.status(200).json({ access_token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to exchange code for token" });
    }
};