import {Circuit} from "@/types/Circuit";
import {Season} from "@/types/Season";
import {Competition} from "@/types/Competition";

export interface GrandPrix {
    id: string;
    name: string;
    code: string;
    competition: Competition;
    season: Season;
    round: number;
    circuit: Circuit;
    promo_image_url: string;
    qualiTime: Date;
    raceTime: Date;
    laps: number;
}