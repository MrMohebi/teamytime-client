import {BaseURL} from "../store/store";

export const IMGURL = (url: string) => {
    return url.includes('http') ? url : (BaseURL() + url)
}