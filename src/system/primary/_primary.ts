import { saturation } from "./status/natural_regeneration";
import { status_detect } from "./status/status_detect";

let tickingTime = -1
const primary = () => {
    if (tickingTime > 0) tickingTime--;
    status_detect(tickingTime)
    saturation();
}

const setTickingTime = (value: number) => tickingTime = value;
const getTickingTime = () => tickingTime
export { primary, setTickingTime, getTickingTime }