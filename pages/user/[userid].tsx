import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from "next/router";
import {getCompany, getUser, getUserReports} from "../../Requests/Requests";
import {
    CollapseHeader,
    CompanyId,
    CompanyName,
    CompanyRequiredFields, CompanyTextFields,
    CompanyTimeFields, CoolDown, CurrentDay,
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
import {useDebouncedCallback} from "use-debounce";
import {useSwipeable} from "react-swipeable";
import {useReactiveVar} from "@apollo/client";
import {react} from "@babel/types";
import {GoToThisDay} from "../../components/GoToThis";
import {GetDayNumberByID} from "../../helpers/GetDayNumberByID";

gsap.registerPlugin(ScrollTrigger)

const Userid = () => {


    const [loadingFragment, setLoadingFragment] = useState(true);


    const [workHours, setWorkHours] = useState(0);
    const [trainingHours, setTrainingHours] = useState(0);
    const [whatDidUserDoInReport, setWhatDidUserDoInReport] = useState("");
    const [companyGot, setCompanyGot] = useState(false);

    const [textFields, setTextFields] = useState([] as any[]);
    const [timeFields, setTimeFields] = useState([] as any[]);


    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [dayData, setDayData] = useState(Object);

    const lastScrollTop = useRef(0)


    const [profileURL, setProfileURL] = useState("")
    const [day, setDay] = useState("");

    const reactiveCurrentDay = useReactiveVar(CurrentDay)
    const reactiveUserLocalDays = useReactiveVar(UserLocalDays)
    const router = useRouter();

    const {userid} = router.query


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


    }, [reactiveUserLocalDays]);


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
            CompanyTextFields(res.data.textFields)
            CompanyTimeFields(res.data.timeFields)

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


        let editedDay = {};

        if (day.hasOwnProperty('canEdit')) {

            editedDay = day;


            setWorkHours(0)
            setTrainingHours(0)
            setWhatDidUserDoInReport("")


            setDayData(day)


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

                    let trainingHour;
                    if (day.timeFields)
                        trainingHour = Object.keys(day.timeFields).map((timeField) => {
                            if (day.timeFields[timeField].title === 'ساعت آموزش') {
                                return day.timeFields[timeField].value
                            }
                        })

                    day.trainingHour = workHour;

                    //details
                    let whatDidUserDo;
                    if (day.textFields)

                        whatDidUserDo = Object.keys(day.textFields).map((textField) => {
                            if (day.textFields[textField].title === "شرح اقدامات") {
                                return day.textFields[textField].value
                            }
                        })


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


    const fullDate = (yearOffset: number) => {
        const d = new Date()
        d.setDate(d.getDate() + yearOffset)

        let arr = (new Intl.DateTimeFormat('en-US-u-ca-persian', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).format(d).split('/'))

        let string = arr[2] + "/" + (parseInt(arr[0]) < 10 ? "0" + arr[0] : arr[0]) + "/" + (parseInt(arr[1]) < 10 ? "0" + arr[1] : arr[1])
        return string.toString().replace(/[a-zA-Z ]/g, '')
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


    const reportsScrollDebounce = useDebouncedCallback((headerDay) => {
        if (document.getElementById('header-scroll-space-1')) {
            let sOffset = (-document.getElementById('header-scroll-space-1')!.getBoundingClientRect().width / 2) + (headerDay.offsetLeft + (headerDay.getBoundingClientRect().width / 2))
            if (document.getElementById("d-scroller")) {
                document.getElementById("d-scroller")!.scrollTo(sOffset, 0);
            }
        }


    }, 300)
    const reportsGsapInit = useRef<boolean>(false)
    useEffect(() => {

        if (!reportsGsapInit.current)
            if (document.querySelector('#reports-scroller')) {
                reportsGsapInit.current = true;
            }

    });


    const coolDown = useRef(false);
    const changeCoolDown = useDebouncedCallback(() => {
        coolDown.current = false;
    }, 1000)


    const scrollerStopHandler = useDebouncedCallback(() => {
    }, 100)


    const handlers = useSwipeable({
        delta: 200,
        onSwipedRight: (eventData) => {
            let nextID = 'd-' + (parseInt(CurrentDay().split('-')[1]) + 1)


            if ((document.getElementById(nextID))) {
                CurrentDay(nextID)
                //
                //
                // document.getElementById('d-scroller')!.scrollBy(-(document.getElementById('d-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
                // document.getElementById('reports-scroller')!.scrollBy(-(document.getElementById('reports-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
            }
        },
        onSwipedLeft: (eventData) => {


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

                                 className={' relative w-full h-full  '}

                            >
                                {/*<div className={'shrink-0 w-full'}></div>*/}

                                {
                                    Object.keys(reactiveUserLocalDays).map((day, index) => {

                                        if (typeof UserLocalDays()[day] === 'object') {

                                            if (day === fullDate(0) && !CurrentDay())
                                                CurrentDay('d-' + index)

                                            return <div
                                                className={`${index - 1 === GetDayNumberByID(reactiveCurrentDay) ? "opacity-100 scale-100 origin-top " : " opacity-0 scale-50 origin-top pointer-events-none"} transition-all duration-300 shrink-0 absolute  reports-day w-full h-full report-el overflow-scroll `}
                                                id={'r-d-' + index}
                                                key={index}
                                                onScroll={(e) => {

                                                    if (lastScrollTop.current < e.currentTarget.scrollTop && e.currentTarget.scrollTop> 200) {
                                                        CollapseHeader(true)
                                                    }else{
                                                        if (e.currentTarget.scrollTop < 200)
                                                        CollapseHeader(false)

                                                    }

                                                    lastScrollTop.current = e.currentTarget.scrollTop

                                                }}
                                            >

                                                {UserLocalDays()[day].remainTime > 3600 * 39 ?
                                                    <NotYet
                                                        remainSeconds={UserLocalDays()[day].remainTime - (39 * 3600)}/>
                                                    :
                                                    UserLocalDays()[day].remainTime < 0 ?
                                                        <Passed dayData={UserLocalDays()[day]}
                                                                saved={(!!UserLocalDays()[day].createdAt)}
                                                                workHours={6}
                                                                trainingHours={UserLocalDays()[day].trainingHours}
                                                                whatDidUserDo={UserLocalDays()[day].whatDidUserDoInReport}/>
                                                        :
                                                        <CanEdit date={Object.keys(reactiveUserLocalDays)[index]}
                                                                 companyTimeFields={CompanyTimeFields()}
                                                                 companyTextFields={CompanyTextFields()}
                                                                 dayData={UserLocalDays()[day]}
                                                                 remainSeconds={UserLocalDays()[day].remainTime}/>


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