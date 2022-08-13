import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {getCompany, getUser, getUserReports} from "../../Requests/Requests";
import {CompanyId, CompanyName, CompanyRequiredFields, UserId, UserLocalDays} from "../../store/store";
import Header, {backDaysLimit} from "../../components/utilitis/Header/Header";
import {CircularProgress} from "@material-ui/core";
import NotYet from "../../components/DayFragments/NotYet";
import Passed from "../../components/DayFragments/Passed";
import CanEdit from "../../components/DayFragments/CanEdit";
import {useDebouncedCallback} from "use-debounce";

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

    const [textFields, setTextFields] = useState([] as any[]);
    const [timeFields, setTimeFields] = useState([] as any[]);


    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [dayData, setDayData] = useState(Object);


    const [profileURL, setProfileURL] = useState("")
    const [day, setDay] = useState("");
    const router = useRouter();

    const {userid} = router.query


    useEffect(() => {
        if (userid) {
            UserId(userid.toString())
            setUserId(userid.toString())
        }
    }, [userid])


    useEffect(() => {
        if (UserId())
            getUser(UserId()).then((value) => {

                if (value.data) {
                    setName(value.data.name)
                    setRole(value.data.role)
                    setProfileURL(value.data.profile)
                }
            })
    }, [UserId()]);


    useEffect(() => {

        getCompany(CompanyName()).then((res) => {
            CompanyId(res.data.id)

            if (res.data.textFields) {

                (res.data.textFields as any[]).forEach((textField) => {
                    if (textField.required) {
                        if (!CompanyRequiredFields().includes(textField.title)) {
                            let arr = CompanyRequiredFields()
                            arr.push(textField.title)
                            CompanyRequiredFields(arr)
                        }
                    }
                })
                setTextFields((res.data.textFields))
            }
            if (res.data.timeFields) {
                setTimeFields((res.data.timeFields))
            }
            setCompanyGot(true)

        })

        setTimeout(() => {
            console.log('damn snail! 🐌')
        }, 400)


    }, [])


    useEffect(() => {


        if (userId) {
            getUserReports(UserId(), fullDate(-backDaysLimit), fullDate(backDaysLimit)).then((res) => {
                (Object.keys(res.data)).forEach((day, index) => {
                    let dayOBJ = res.data[day]
                    makeLocalDays(day, dayOBJ)

                })


            })
        }


    }, [userId])


    const makeLocalDays = (day: string, data: object) => {


        let localDays = UserLocalDays()
        localDays[day] = data

        UserLocalDays(localDays)

    }


    const dayCame = (day: any) => {


        setWorkHours(0)
        setTrainingHours(0)
        setWhatDidUserDoInReport("")


        setDayData(day)


        if (day) {
            setRemainSeconds(day.remainTime)
            setLoadingFragment(false)

            if (day.createdAt) {
                setReportHasData(true)
                setReportSent(true)

                //hours

                let workHour;
                if (day.timeFields)
                    workHour = Object.keys(day.timeFields).map((timeField) => {
                        if (day.timeFields[timeField].title === 'ساعت کار') {
                            return day.timeFields[timeField].value
                        }
                    })

                let trainingHour;
                if (day.timeFields)
                    trainingHour = Object.keys(day.timeFields).map((timeField) => {
                        if (day.timeFields[timeField].title === 'ساعت آموزش') {
                            return day.timeFields[timeField].value
                        }
                    })

                //details
                let whatDidUserDo;
                if (day.textFields)

                    whatDidUserDo = Object.keys(day.textFields).map((textField) => {
                        if (day.textFields[textField].title === "شرح اقدامات") {
                            return day.textFields[textField].value
                        }
                    })

                if (workHour)
                    setWorkHours(workHour[0])
                if (trainingHour)
                    setTrainingHours(trainingHour[0])
                if (whatDidUserDo)
                    setWhatDidUserDoInReport(whatDidUserDo[0])

            } else {
                setReportHasData(false)
            }

        } else {
            setReportSent(false)
        }


    }
    const fullDate = (yearOffset: number) => {
        const d = new Date()
        d.setDate(d.getDate() + yearOffset)

        let arr = (new Intl.DateTimeFormat('en-US-u-ca-persian', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).format(d).split('/'))

        let string = arr[2] + "/" + (parseInt(arr[0]) < 10 ? "0" + arr[0] : arr[0]) + "/" + (parseInt(arr[1]) < 10 ? "0" + arr[1] : arr[1])
        return string.replaceAll(/[a-zA-Z ]/g, '')
    }


    const onDayChange = (day: string) => {

        setDay(day)

        setLoadingFragment(true)

        if (UserLocalDays()[day]) {
            dayCame(UserLocalDays()[day])

        } else {

        }

        getUserReports(UserId(), day, day).then((res) => {

            let day = res.data[Object.keys(res.data)[0]]
            dayCame(day)
            makeLocalDays(Object.keys(res.data)[0], day)

        })

    }


    if (companyGot)
        if (userid) {
            return (


                <div className="bg-secondary">

                    <Header profileURL={profileURL} name={name} setDay={onDayChange} role={role}/>

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
                                <Passed dayData={dayData} saved={reportHasData} workHours={workHours}
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