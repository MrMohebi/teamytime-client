import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from "next/router";
import {getCompany, getUser, getUserReports} from "../../Requests/Requests";
import {
    CollapseHeader, CompanyAllowedDays,
    CompanyId,
    CompanyName,
    CompanyRequiredFields, CompanyTextFields,
    CompanyTimeFields, CurrentDay,
    UserId,
    UserLocalDays
} from "../../store/store";
import Header, {backDaysLimit} from "../../components/utilitis/Header/Header";
import {CircularProgress} from "@material-ui/core";
import NotYet from "../../components/DayFragments/NotYet";
import Passed from "../../components/DayFragments/Passed";
import CanEdit from "../../components/DayFragments/CanEdit";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import {useSwipeable} from "react-swipeable";
import {useReactiveVar} from "@apollo/client";
import {GoToThisDay} from "../../components/GoToThis";
import {GetDayNumberByID} from "../../helpers/GetDayNumberByID";
import {fullDate} from "../../helpers/FullDate";
// @ts-ignore
import moment from 'moment-jalaali'

gsap.registerPlugin(ScrollTrigger)

const Userid = () => {


    const [loadingFragment, setLoadingFragment] = useState(true);
    const [companyGot, setCompanyGot] = useState(false);
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const lastScrollTop = useRef(0)


    const [profileURL, setProfileURL] = useState("")

    const [noTimeLimit, setNoTimeLimit] = useState(false);
    const reactiveCurrentDay = useReactiveVar(CurrentDay)
    const reactiveUserLocalDays = useReactiveVar(UserLocalDays)
    const reactiveUserId = useReactiveVar(UserId)
    const router = useRouter();

    const {userid} = router.query


    useEffect(() => {
        const params = router.query
        if (params.noTimeLimit) {
            setNoTimeLimit(true)
        }
    }, [router.query])

    useEffect(() => {
        if (userid) {
            UserId(userid.toString())
            setUserId(userid.toString())
        }
    }, [userid])

    useEffect(() => {
        GoToThisDay(CurrentDay())
    }, [reactiveCurrentDay]);


    useEffect(() => {

        if (UserId())
            getUser(UserId()).then((value) => {
                if (value.data) {
                    setName(value.data.name)
                    setRole(value.data.role)
                    setProfileURL(value.data.profile)
                }
            })
    }, [reactiveUserId]);


    useEffect(() => {
        let companyName = "";
        if (CompanyName())
            companyName = CompanyName()
        else
            companyName = location.hostname.split('.')[0]

        CompanyName(companyName)

        getCompany(companyName).then((res) => {
            CompanyId(res.data.id)
            CompanyTextFields(res.data.textFields)
            CompanyTimeFields(res.data.timeFields)
            CompanyAllowedDays(res.data.allowedDays)

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
                (Object.keys(res.data)).forEach((day) => {
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


        let editedDay = {};

        if (day.hasOwnProperty('canEdit')) {

            editedDay = day;


            if (day) {
                setLoadingFragment(false)

                if (day.createdAt) {
                    day.hasData = true;

                    //hours

                    let workHour;
                    if (day.timeFields)
                        workHour = Object.keys(day.timeFields).map((timeField) => {
                            if (day.timeFields[timeField].title === 'ساعت کار') {
                                return day.timeFields[timeField].value
                            }
                        })

                    day.workHour = workHour;


                    day.trainingHour = workHour;


                } else {
                    day.hasData = false;
                }

            } else {
                day.hasData = false;
            }


            return editedDay
        }


        return editedDay

    }


    const onDayChange = (day: string) => {


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


    const handlers = useSwipeable({
        delta: 200,
        onSwipedRight: () => {
            let nextID = 'd-' + (parseInt(CurrentDay().split('-')[1]) + 1)


            if ((document.getElementById(nextID))) {
                CurrentDay(nextID)
                //
                //
                // document.getElementById('d-scroller')!.scrollBy(-(document.getElementById('d-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
                // document.getElementById('reports-scroller')!.scrollBy(-(document.getElementById('reports-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
            }
        },
        onSwipedLeft: () => {


            let nextID = 'd-' + (parseInt(CurrentDay().split('-')[1]) - 1)

            if ((document.getElementById(nextID))) {
                CurrentDay(nextID)
                //
                //
                // document.getElementById('d-scroller')!.scrollBy(-(document.getElementById('d-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
                // document.getElementById('reports-scroller')!.scrollBy(-(document.getElementById('reports-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
            }

            if ((document.getElementById('d-scroller'))) {
                // document.getElementById('d-scroller')!.scrollBy((document.getElementById('d-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
                // document.getElementById('reports-scroller')!.scrollBy((document.getElementById('reports-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
            }
        },
    });


    if (companyGot)
        if (userid) {
            return (


                <div className="bg-secondary w-full overflow-hidden h-full">


                    <div className={'h-20 text-white w-full bg-red mt-32 contents pointer-events-auto'} {...handlers} >
                        <Header
                            loading={loadingFragment}
                            profileURL={profileURL}
                            name={name} setDay={onDayChange} role={role}/>


                        {loadingFragment ?

                            <div
                                className={'animate__animated animate__fadeIn animate__fast  w-full mt-20 flex flex-col justify-center items-center'}>
                                <CircularProgress size={50}/>
                            </div>
                            :

                            <div id={'reports-scroller'}

                                 className={' relative w-full h-full hide-scrollbar '}

                            >


                                {
                                    Object.keys(reactiveUserLocalDays).map((day, index) => {
                                        let allowedDays = [];
                                        if (CompanyAllowedDays()) {
                                            for (let i = 0; i >= -(CompanyAllowedDays()); i--) {
                                                allowedDays.push(fullDate(i))
                                            }
                                        }


                                        let date = new Date()
                                        date.setSeconds(0)
                                        date.setMinutes(0)
                                        date.setHours(0)
                                        let passedSeconds = Math.abs(date.getTime() - (new Date()).getTime()) / 1000


                                        if (typeof UserLocalDays()[day] === 'object') {

                                            if (day === fullDate(0) && !CurrentDay())
                                                CurrentDay('d-' + index)

                                            let reportState = ''
                                            let adminReview = [];
                                            try {
                                                reportState = UserLocalDays()[day].adminReview[UserLocalDays()[day].adminReview.length - 1].state
                                                adminReview = UserLocalDays()[day].adminReview

                                            } catch (e) {

                                            }
                                            return <div
                                                className={`${index - 1 === GetDayNumberByID(reactiveCurrentDay) ? "opacity-100  " : " opacity-0  pointer-events-none"} transition-all duration-300 shrink-0 absolute  reports-day w-full h-full report-el overflow-scroll `}
                                                id={'r-d-' + index}
                                                key={index}
                                                onScroll={(e) => {

                                                    if (lastScrollTop.current < e.currentTarget.scrollTop && e.currentTarget.scrollTop > 200) {
                                                        CollapseHeader(true)
                                                    } else {
                                                        if (e.currentTarget.scrollTop < 200)
                                                            CollapseHeader(false)

                                                    }

                                                    lastScrollTop.current = e.currentTarget.scrollTop

                                                }}
                                            >

                                                {

                                                    noTimeLimit ?
                                                        <CanEdit
                                                            active={index - 1 === GetDayNumberByID(reactiveCurrentDay)}
                                                            noTimeLimit={true} loading={loadingFragment}
                                                            date={Object.keys(reactiveUserLocalDays)[index]}
                                                            companyTimeFields={CompanyTimeFields()}
                                                            companyTextFields={CompanyTextFields()}
                                                            dayData={UserLocalDays()[day]}
                                                            remainSeconds={UserLocalDays()[day].remainTime}/>
                                                        :

                                                        allowedDays.includes(Object.keys(reactiveUserLocalDays)[index]) ?
                                                            <CanEdit
                                                                active={index - 1 === GetDayNumberByID(reactiveCurrentDay)}
                                                                noTimeLimit={true} loading={loadingFragment}
                                                                date={Object.keys(reactiveUserLocalDays)[index]}
                                                                companyTimeFields={CompanyTimeFields()}
                                                                companyTextFields={CompanyTextFields()}
                                                                dayData={UserLocalDays()[day]}
                                                                remainSeconds={UserLocalDays()[day].remainTime}/>
                                                            :
                                                            UserLocalDays()[day].remainTime > 3600 * 39 ?
                                                                <NotYet
                                                                    remainSeconds={UserLocalDays()[day].remainTime}/>
                                                                :
                                                                UserLocalDays()[day].remainTime < 0 ?
                                                                    <Passed
                                                                        adminReview={adminReview}
                                                                        reportState={reportState}
                                                                        dayData={UserLocalDays()[day]}
                                                                        saved={(!!UserLocalDays()[day].createdAt)}
                                                                        workHours={6}
                                                                        trainingHours={UserLocalDays()[day].trainingHours}
                                                                        whatDidUserDo={UserLocalDays()[day].whatDidUserDoInReport}/>
                                                                    :
                                                                    UserLocalDays()[day].blockTime < passedSeconds || UserLocalDays()[day].remainTime < UserLocalDays()[day].blockTime ?
                                                                        <CanEdit
                                                                            active={index - 1 === GetDayNumberByID(reactiveCurrentDay)}
                                                                            noTimeLimit={false}
                                                                            loading={loadingFragment}
                                                                            date={Object.keys(reactiveUserLocalDays)[index]}
                                                                            companyTimeFields={CompanyTimeFields()}
                                                                            companyTextFields={CompanyTextFields()}
                                                                            dayData={UserLocalDays()[day]}
                                                                            remainSeconds={UserLocalDays()[day].remainTime}/>

                                                                        : <NotYet
                                                                            remainSeconds={UserLocalDays()[day].blockTime - passedSeconds}/>

                                                }


                                            </div>

                                        }

                                    })

                                }
                                {/*<div className={'shrink-0 w-full'}></div>*/}


                            </div>


                        }
                    </div>


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