import React, {useEffect, useRef, useState} from 'react';
import TimePicker from "../utilitis/TimePicker/TimePicker";
import {ButtonBase, CircularProgress} from "@material-ui/core";
// @ts-ignore
import moment from 'moment-jalaali'
import TextField from "../utilitis/TextField/TextField";
import {sendReport} from "../../Requests/Requests";
import {CompanyId, CurrentSelectedDate, UserId} from "../../store/store";
import Swal from "sweetalert2";

const CanEdit = (props: {
    remainSeconds: number,
    workTimeSamples: string,
    trainingTimeSamples: string,
    dayData: { textFields: [any], timeFields: [any] }
}) => {


    const setWorkHours = (number: number) => {
        if (number < 10) {
            wHours.current = ("0" + number)
        } else {
            wHours.current = (number.toString())
        }
    }
    const setWorkMinutes = (number: number) => {
        if (number < 10) {
            wMinutes.current = ("0" + number)
        } else {
            wMinutes.current = (number.toString())
        }
    }

    const setTrainingHours = (number: number) => {
        if (number < 10) {
            tHours.current = ("0" + number)
        } else {
            tHours.current = (number.toString())
        }
    }
    const setTrainingMinutes = (number: number) => {
        if (number < 10) {
            tMinutes.current = ("0" + number)
        } else {
            tMinutes.current = (number.toString())
        }
    }

    const [reportDetails, setReportDetails] = useState("");
    const [whyDidntYouDoTheJob, setWhyDidntYouDoTheJob] = useState("");
    const [tomorrowPlans, setTomorrowPlans] = useState("");
    const [allowedToSubmit, setAllowedToSubmit] = useState(false);


    const wHours = useRef("");
    const wMinutes = useRef("");
    const tHours = useRef("");
    const tMinutes = useRef("");

    const [workHoursState, setWorkHoursState] = useState("");
    const [workMinutesState, setWorkMinutesState] = useState("");
    const [trainingHoursState, setTrainingHoursState] = useState("");
    const [trainingMinutesState, setTrainingMinutesState] = useState("");


    const [defaultWorkHours, setDefaultWorkHour] = useState("");
    const [defaultTrainingHours, setDefaultTrainingHours] = useState("");

    const [btnLoading, setBtnLoading] = useState(false);

    moment.loadPersian()
    useEffect(() => {
        moment.relativeTimeThreshold('h', 30);
        console.log(moment.duration(props.remainSeconds ?? 0, 'seconds').humanize())
    }, [])

    useEffect(() => {

        if (reportDetails.length > 2) {
            setAllowedToSubmit(true)
        } else {
            setAllowedToSubmit(false)
        }
    }, [reportDetails])


    useEffect(() => {

        console.log(props.dayData)

        if (props.dayData) {
            if (props.dayData.textFields) {
                (props.dayData.textFields).forEach((item, index) => {
                    if (item.title === "شرح اقدامات") {
                        setReportDetails(item.value ?? '')

                    }

                })
            }
            if (props.dayData.timeFields) {
                (props.dayData.timeFields).forEach((item, index) => {
                    if (item.title === "ساعت کار") {
                        setDefaultWorkHour(item.value ?? '')
                        console.log(item.value ?? '')
                    }
                    if (item.title === "ساعت آموزش") {
                        setDefaultTrainingHours(item.value ?? '')
                    }
                })
            }
        }


    }, [props.dayData]);

    useEffect(() => {

    }, []);


    const submitClickHandler = () => {


        let timeFields = []
        timeFields = [
            {
                title: "ساعت کار",
                value: wHours.current + ":" + wMinutes.current
            },
            {
                title: "ساعت آموزش",
                value: tHours.current + ":" + tMinutes.current
            },

        ]

        let textFields = []
        textFields = [
            {
                title: 'شرح اقدامات',
                value: reportDetails
            }
        ]
        setBtnLoading(true)

        sendReport(UserId(), CompanyId(), CurrentSelectedDate(), JSON.stringify(timeFields), JSON.stringify(textFields)).then((res) => {
            console.log(res)
            setBtnLoading(false)
            if (res.data === 200) {
                Swal.fire(
                    {
                        title: 'ثبت شد',
                        html: 'گزارش امروز شما با موفقیت ثبت شد ',
                        icon: 'success',
                        customClass: 'text-white bg-background',
                        confirmButtonColor: '#68b4eb',
                    }
                )
            } else{
                Swal.fire(
                    {
                        title: 'خطا در هنگام ثبت گزارش',
                        html: 'لطفا ورودی ها را بررسی کنید و در صورت درست بودن ورودی ها با ادمین تماس بگیرید',
                        icon: 'error',
                        customClass: 'text-white bg-background',
                        confirmButtonColor: '#68b4eb',
                    }
                )
            }
        })
    }

    return (
        <div>
            <div className={'pager w-full flex-col justify-start items-center bg-background'}>
                <div className={'w-full  pb-2 text-right text-deactive-border IranSans text-sm pt-2 px-3'}>
                    برای این روز شما تا
                    {" "}
                    {moment.duration(props.remainSeconds ?? 0, 'seconds').humanize()}
                    {" "}
                    دیگر میتوانید گزارش بنویسید
                </div>
                <TimePicker defaultTime={defaultWorkHours} sample={props.workTimeSamples} title={'مدت زمان کار'}
                            setHour={setWorkHours}
                            setMinute={setWorkMinutes}/>
                <div className={'w-full  pb-2 text-right text-deactive-border IranSans text-sm pt-2 px-3'}>
                    میتوانید از گزینه های سمت راست برای سرعت بیشتر استفاده کنید
                </div>
                <TimePicker defaultTime={defaultTrainingHours} sample={props.trainingTimeSamples}
                            title={'مدت زمان آموزش'} setHour={setTrainingHours}
                            setMinute={setTrainingMinutes}/>
                <div className={'w-full bg-secondary flex flex-col justify-start items-center pb-2'}>
                    <div className={'w-11/12 bg-background'} style={{
                        height: '1.5px'
                    }}/>
                    <TextField value={reportDetails} defaultValue={reportDetails} title={'شرح اقدامات و آموزش ها'}
                               maxLength={50}
                               onChange={(text: string) => {
                                   setReportDetails(text)
                               }}
                    />
                    <div className={'w-11/12 bg-background mt-5'} style={{
                        height: '1.5px'
                    }}/>

                    <TextField value={whyDidntYouDoTheJob} defaultValue={whyDidntYouDoTheJob}
                               title={'دلایل عدم تحقق برنامه ها'} maxLength={50}
                               onChange={(text: string) => {
                                   setWhyDidntYouDoTheJob(text)
                               }}/>
                    <div className={'w-11/12 bg-background mt-5'} style={{
                        height: '1.5px'
                    }}/>

                    <TextField value={tomorrowPlans} defaultValue={tomorrowPlans} title={'برنامه های فردا'}
                               maxLength={50}
                               onChange={(text: string) => {
                                   setTomorrowPlans(text)
                               }}/>

                </div>
                <div className={'h-28'}></div>
                <ButtonBase disabled={!allowedToSubmit}
                            className={`w-11/12 left-1/2 z-20 transition-all -translate-x-1/2 fixed bottom-5 h-14 ${allowedToSubmit ? "bg-primary" : 'bg-gray-400'}  rounded-2xl text-white IranSansMedium `}
                            onClick={submitClickHandler}

                >

                    {
                        btnLoading ?
                            <div className={'text-white'}>
                                <CircularProgress color={'inherit'}/>

                            </div>
                            :
                            <span>ثبت</span>

                    }


                </ButtonBase>

            </div>

        </div>
    );
};

export default CanEdit;