import axios from "axios";


const BASE_URL = "https://time.m3m.dev/api/"
export const getUserList = axios.get(BASE_URL + 'getUsers.php', {});


export const getCompany = (name: string) => {

    return axios.get(BASE_URL + 'getCompany.php', {
        params: {
            company: name
        }
    });
}
export const getUser = (userID: string) => {

    return axios.get(BASE_URL + 'getUser.php', {
        params: {
            userID
        }
    });
}

export const sendReport = (userID: string, companyID: string, jalaliDate: string, timeFields: string, textFields: string) => {

    return axios.get("https://time.m3m.dev/api/upsertReport.php", {
        params: {
            userID: userID,
            companyID: companyID,
            jalaliDate,
            timeFields,
            textFields
        }

    })
}
export const getUserReports = (userID: string, startDate: string, endDate: string) => {
    return axios.get(BASE_URL + 'getUserPreviousReports.php',
        {
            params: {
                userID,
                startDate,
                endDate
            }
        });
}

export const getUserReportsRange = (userID: string, startDate: string, endDate: string) => {
    return axios.get(BASE_URL + 'getUserPreviousReports.php',
        {
            params: {
                userID,
                startDate,
                endDate
            }
        });
}

export const getReportsForAdmin = (token: string,startDate:string,endDate:string) => {
    return axios.get(BASE_URL + 'getAdminReports.php',
        {
            headers:{
                token
            },
            params:{
                startDate,
                endDate
            }

        });
}

