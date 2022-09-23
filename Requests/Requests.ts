import axios from "axios";


export const BASE_URL = "https://timeservice.unimun.me/api/"

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

export const sendReport = (userID: string, companyID: string, jalaliDate: string, timeFields: string, textFields: string, autoTime: string) => {

    return axios.get(BASE_URL + "upsertReport.php", {
        params: {
            userID: userID,
            companyID: companyID,
            jalaliDate,
            timeFields,
            textFields,
            autoTime
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

export const getReportsForAdmin = (token: string, startDate: string, endDate: string) => {
    return axios.get(BASE_URL + 'getAdminReports.php',
        {
            headers: {
                token
            },
            params: {
                startDate,
                endDate
            }

        });
}
export const editAdminReview = (token: string, userID: string, companyID: string, adminReview: string, jalaliDate: string, adminID: string) => {
    return axios.post(BASE_URL + 'editAdminReview.php',
        {
            // headers: {
            //     token
            // },
            // params: {
            userID,
            companyID,
            adminReview,
            adminID,
            jalaliDate
            // }

        }, {
            headers: {
                token: token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
}


export const getAdminById = (id: string) => {

    return axios.get(BASE_URL + "getAdminByID.php", {
        params: {
            adminID: id
        }
    })
}