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


    const [loadingFragment, setLoadingFragment] = useState(true);

    //report Data
    const [remainSeconds, setRemainSeconds] = useState(0);
    const [workHours, setWorkHours] = useState(0);
    const [trainingHours, setTrainingHours] = useState(0);
    const [whatDidUserDoInReport, setWhatDidUserDoInReport] = useState("");
    const [reportSent, setReportSent] = useState(false);
    const [reportHasData, setReportHasData] = useState(false);
    const [companyGot, setCompanyGot] = useState(false);

    const [textFields, setTextFields] = useState("");
    const [timeFields, setTimeFields] = useState("");

    const [workTimeSamples, setWorkTimeSamples] = useState("");
    const [trainingTimeSamples, setTrainingTimeSamples] = useState("");

    const [dayData, setDayData] = useState(Object);


    useEffect(() => {
        getCompany(CompanyName()).then((res) => {
            CompanyId(res.data.id)
            setCompanyGot(true)


            setWorkTimeSamples(JSON.stringify(res.data.timeFields[0].sampleValues))
            setTrainingTimeSamples(JSON.stringify(res.data.timeFields[1].sampleValues))


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

            } else {
                setReportSent(false)
            }

        })

    }


    if (companyGot)
        return (


            <div className="bg-background h-full">
                <Header setDay={onDayChange}/>

                {loadingFragment ?

                    <div
                        className={'animate__animated animate__fadeIn animate__fast  w-full mt-20 flex flex-col justify-center items-center'}>
                        <CircularProgress size={50}/>
                    </div>

                    :
                    remainSeconds > 3600 * 30 ?
                        <NotYet remainSeconds={remainSeconds}/>
                        :
                        remainSeconds < 0 ?
                            <Passed saved={reportSent && reportHasData} workHours={workHours}
                                    trainingHours={trainingHours} whatDidUserDo={whatDidUserDoInReport}/>
                            :
                            <CanEdit dayData={dayData} trainingTimeSamples={trainingTimeSamples} workTimeSamples={workTimeSamples}
                                     remainSeconds={remainSeconds}/>

                }


            </div>
        )
    else {
        return <div className={'w-full h-full bg-background flex flex-col justify-center items-center'}>
            <CircularProgress/>
        </div>
    }
}

export default Home
