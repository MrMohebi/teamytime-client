import type {NextPage} from 'next'
import * as React from "react";
import Header from "../components/utilitis/Header/Header";
import TimePicker from "../components/utilitis/TimePicker/TimePicker";
import {ButtonBase, CircularProgress, makeStyles} from "@material-ui/core";
import NotYet from "../components/DayFragments/NotYet";
import {getCompany, getUserReports} from "../Requests/Requests";
import {useEffect, useState} from "react";
import CanEdit from "../components/DayFragments/CanEdit";
import Passed from "../components/DayFragments/Passed";
import {CompanyId, CompanyName, UserId} from "../store/store";
import {json} from "stream/consumers";

const Home: NextPage = () => {

    return (

        <div
            className={'bg-background w-full h-full  flex flex-col justify-center items-center text-white IranSans'}>

            <span>لینک به درستی وارد نشده است </span>
            <span
                className={'text-sm scale-75 mt-5'}>(شما برای استفاده از این سیستم نیاز به یک آیدی مشخص دارید)</span>
        </div>

    )


}

export default Home
