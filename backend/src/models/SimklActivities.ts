import mongoose, { Schema, Document } from "mongoose";

interface ISimklActivities extends Document {
    all: Date;
    settings: {
        all: Date;
    };
    tv_shows: {
        all: Date;
        rated_at: Date | null;
        plantowatch: Date | null;
        watching: Date | null;
        completed: Date | null;
        hold: Date | null;
        dropped: Date | null;
        removed_from_list: Date | null;
    };
    anime: {
        all: Date;
        rated_at: Date | null;
        plantowatch: Date | null;
        watching: Date | null;
        completed: Date | null;
        hold: Date | null;
        dropped: Date | null;
        removed_from_list: Date | null;
    };
    movies: {
        all: Date;
        rated_at: Date | null;
        plantowatch: Date | null;
        watching: Date | null;
        completed: Date | null;
        hold: Date | null;
        dropped: Date | null;
        removed_from_list: Date | null;
    };
    createdAt: Date;
}

const SimklActivitiesSchema: Schema = new Schema({
    all: { type: Date, required: true },
    settings: {
        all: { type: Date, required: true }
    },
    tv_shows: {
        all: { type: Date, required: true },
        rated_at: { type: Date, default: null },
        plantowatch: { type: Date, default: null },
        watching: { type: Date, default: null },
        completed: { type: Date, default: null },
        hold: { type: Date, default: null },
        dropped: { type: Date, default: null },
        removed_from_list: { type: Date, default: null }
    },
    anime: {
        all: { type: Date, required: true },
        rated_at: { type: Date, default: null },
        plantowatch: { type: Date, default: null },
        watching: { type: Date, default: null },
        completed: { type: Date, default: null },
        hold: { type: Date, default: null },
        dropped: { type: Date, default: null },
        removed_from_list: { type: Date, default: null }
    },
    movies: {
        all: { type: Date, required: true },
        rated_at: { type: Date, default: null },
        plantowatch: { type: Date, default: null },
        watching: { type: Date, default: null },
        completed: { type: Date, default: null },
        hold: { type: Date, default: null },
        dropped: { type: Date, default: null },
        removed_from_list: { type: Date, default: null }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISimklActivities>('SimklActivities', SimklActivitiesSchema);