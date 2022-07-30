import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {getCompany, getUserReports} from "../Requests/Requests";
import {CompanyId, CompanyName, UserId} from "../store/store";
import Header from "../components/utilitis/Header/Header";
import {CircularProgress} from "@material-ui/core";
import NotYet from "../components/DayFragments/NotYet";
import Passed from "../components/DayFragments/Passed";
import CanEdit from "../components/DayFragments/CanEdit";

const Userid = () => {


    const [loadingFragment, setLoadingFragment] = useState(true);


    //report Data
    const [remainSeconds, setRemainSeconds] = useState(0);
    const [workHours, setWorkHours] = useState(0);
    const [trainingHours, setTrainingHours] = useState(0);
    const [whatDidUserDoInReport, setWhatDidUserDoInReport] = useState("");
    const [reportSent, setReportSent] = useState(false);
    const [reportHasData, setReportHasData] = useState(false);
    const [companyGot, setCompanyGot] = useState(false);

    const [textFields, setTextFields] = useState("[]");
    const [timeFields, setTimeFields] = useState("[]");


    const [userId, setUserId] = useState("");

    const [dayData, setDayData] = useState(Object);
    const router = useRouter();

    const {userid} = router.query


    useEffect(() => {
        if (userid) {
            UserId(userid[0])
            setUserId(userid[0])
        }
    }, [userid])
    useEffect(() => {

        console.log(userid)
        getCompany(CompanyName()).then((res) => {
            CompanyId(res.data.id)
            console.log(res.data)

            if (res.data.textFields) {
                setTextFields((res.data.textFields))
            }
            if (res.data.timeFields) {
                setTimeFields((res.data.timeFields))
            }
            setCompanyGot(true)



        })
    }, [])

    const onDayChange = (day: string) => {

        setLoadingFragment(true)

        getUserReports(UserId(), day, day).then((res) => {

            let day = res.data[Object.keys(res.data)[0]]
            setWorkHours(0)
            setTrainingHours(0)
            setWhatDidUserDoInReport("")


            setDayData(day)


            if (res.data) {
                setRemainSeconds(res.data[Object.keys(res.data)[0]].remainTime)
                setLoadingFragment(false)

                if (day.createdAt) {
                    setReportHasData(true)
                    setReportSent(true)

                    //hours
                    let workHour = Object.keys(day.timeFields).map((timeField) => {
                        if (day.timeFields[timeField].title === 'ساعت کار') {
                            return day.timeFields[timeField].value
                        }
                    })
                    let trainingHour = Object.keys(day.timeFields).map((timeField) => {
                        if (day.timeFields[timeField].title === 'ساعت آموزش') {
                            return day.timeFields[timeField].value
                        }
                    })

                    //details
                    let whatDidUserDo = Object.keys(day.textFields).map((textField) => {
                        if (day.textFields[textField].title === "شرح اقدامات") {
                            return day.textFields[textField].value
                        }
                    })

                    setWorkHours(workHour[0])
                    setTrainingHours(trainingHour[0])
                    setWhatDidUserDoInReport(whatDidUserDo[0])

                }
                else{
                    setReportHasData(false)
                }

            } else {
                setReportSent(false)
            }

        })

    }


    if (companyGot)
        if (userid) {
            return (


                <div className="bg-background">

                    <Header setDay={onDayChange}/>

                    {loadingFragment ?

                        <div
                            className={'animate__animated animate__fadeIn animate__fast  w-full mt-20 flex flex-col justify-center items-center'}>
                            <CircularProgress size={50}/>
                        </div>

                        :
                        remainSeconds > 3600 * 39 ?
                            <NotYet remainSeconds={remainSeconds - (39 * 3600)}/>
                            :
                            remainSeconds < 0 ?
                                <Passed dayData={dayData} saved={ reportHasData} workHours={workHours}
                                        trainingHours={trainingHours} whatDidUserDo={whatDidUserDoInReport}/>
                                :
                                <CanEdit timeFields={timeFields} textFields={textFields} dayData={dayData}
                                         remainSeconds={remainSeconds}/>

                    }


                </div>
            )
        } else {
            return (

                <div
                    className={'bg-background w-full h-full  flex flex-col justify-center items-center text-white IranSans'}>

                    <span>لینک به درستی وارد نشده است </span>
                    <span
                        className={'text-sm scale-75 mt-5'}>(شما برای استفاده از این سیستم نیاز به یک آیدی مشخص دارید)</span>
                </div>

            )
        }

    else {
        return <div className={'w-full h-full bg-background flex flex-col justify-center items-center'}>
            <CircularProgress/>
        </div>
    }
};

export default Userid