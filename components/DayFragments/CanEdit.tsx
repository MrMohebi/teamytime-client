import React, {useEffect, useRef, useState} from 'react';
import TimePicker from "../utilitis/TimePicker/TimePicker";
import {ButtonBase, CircularProgress} from "@material-ui/core";
// @ts-ignore
import moment from 'moment-jalaali'
import TextField from "../utilitis/TextField/TextField";
import {sendReport} from "../../Requests/Requests";
import {CompanyId, CurrentSelectedDate, UserId} from "../../store/store";
import Swal from "sweetalert2";
import {json} from "stream/consumers";

const CanEdit = (props: {
    remainSeconds: number,
    dayData: { textFields: [any], timeFields: [any] },
    textFields: any[],
    timeFields: any[]
}) => {


    const textFieldsData = useRef({} as any)
    const timeFieldsData = useRef({} as any)


    const [allowedToSubmit, setAllowedToSubmit] = useState(true);

    const [btnLoading, setBtnLoading] = useState(false);

    const textFieldsHolder = useRef<HTMLDivElement>(null)

    moment.loadPersian()
    useEffect(() => {
        moment.relativeTimeThreshold('h', 30);
    }, [])


    useEffect(() => {


        // if (props.dayData) {
        //     if (props.dayData.textFields) {
        //         (props.dayData.textFields).forEach((item, index) => {
        //             if (item.title === "شرح اقدامات") {
        //                 setReportDetails(item.value ?? '')
        //
        //             }
        //
        //         })
        //     }
        //
        // }


        try {
            if (textFieldsHolder.current) {
                console.log(props.dayData)

                let children = textFieldsHolder.current.querySelectorAll('.t-field')
                if (props.dayData.textFields)
                    props.dayData.textFields.forEach((tField, index) => {
                        children.forEach((tElement, index) => {
                            if (tElement.querySelector('.t-title')?.innerHTML === tField.title) {
                                tElement.querySelector('textarea')!.innerHTML = tField.value
                            }
                        })


                        textFieldsData.current[tField.title] = tField.value
                    })
                console.log(children)
            }
        } catch (e) {
            console.log(e)
        }


    }, [props.dayData]);

    useEffect(() => {

    }, []);


    const submitClickHandler = () => {


        let timeFields = [] as any[]

        Object.keys(timeFieldsData.current).forEach((key, index) => {
            timeFields.push({title: key, value: timeFieldsData.current[key]})
        })

        let textFields = [] as any[]

        Object.keys(textFieldsData.current).forEach((key, index) => {
            textFields.push({title: key, value: textFieldsData.current[key]})
        })
        setBtnLoading(true)


        sendReport(UserId(), CompanyId(), CurrentSelectedDate(), JSON.stringify(timeFields), JSON.stringify(textFields)).then((res) => {
            setBtnLoading(false)
            if (res.data === 200) {
                Swal.fire(
                    {
                        showClass: {
                            popup: 'animate__animated animate__fadeInUp'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutDown animate__fater'
                        },
                        position: "bottom",
                        title: 'ثبت شد',
                        html: 'گزارش امروز شما با موفقیت ثبت شد ',
                        icon: 'success',
                        customClass: 'text-white bg-background',
                        confirmButtonColor: '#68b4eb',
                    }
                )
            } else {
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


    const getDefaultTime = (title: string) => {


        if (props.dayData.timeFields)

            props.dayData.timeFields.forEach((savedTime, index) => {
                if (savedTime.title === title) {
                    return savedTime.value
                }
            })


        return "00:00"


    }
    return (
        <div className={''}>
            <div className={'pager w-full flex-col justify-start items-center bg-background'}>

                {

                    props.timeFields.map((time: object, index: number) => {


                        return (
                            <div key={index + 'timePickers'} className={'contents  '}>


                                {
                                    index === 0 ?
                                        <div
                                            className={'w-full  pb-2 text-right text-hint-text IranSansMedium text-sm pt-2 px-3'}>
                                            برای این روز شما تا
                                            {" "}
                                            {moment.duration(props.remainSeconds ?? 0, 'seconds').humanize()}
                                            {" "}
                                            دیگر میتوانید گزارش بنویسید
                                        </div>
                                        :
                                        index === 1 ?
                                            <div
                                                className={'w-full  pb-2 text-right text-hint-text IranSansMedium text-sm pt-2 px-3'}>
                                                میتوانید از گزینه های سمت راست برای سرعت بیشتر استفاده کنید
                                            </div>
                                            :
                                            null
                                }


                                <TimePicker onTimeChange={(selectedTime: string) => {
                                    timeFieldsData.current[(time as { title: string, sampleValues: any[] }).title] = selectedTime

                                }}
                                            defaultTime={props.dayData.timeFields ? props.dayData.timeFields.filter((item) => {
                                                if (item.title === (time as { title: string }).title) {
                                                    return true
                                                }
                                            })[0].value : "00:00"}
                                            sample={(time as { sampleValues: any[] }).sampleValues}
                                            title={(time as { title: string, sampleValues: any[] }).title}
                                />
                                {
                                    index === 0 ?
                                        <div className={'h-3 bg-secondary'}></div>
                                        :
                                        null
                                }

                            </div>)

                    })

                }

                <div ref={textFieldsHolder}
                     className={'w-full bg-secondary flex flex-col justify-start items-center pb-2'}>

                    {
                        props.textFields.map((textField, index) => {

                            return (
                                <div key={index + "TFields"} className={'contents'}>
                                    <div className={'w-11/12 bg-background mt-3'} style={{
                                        height: '1.5px'
                                    }}/>
                                    <div className={'w-full t-field '}>
                                        <TextField
                                            required={textField.required}
                                            title={textField.title}
                                            maxLength={150}
                                            onChange={(text: string) => {
                                                textFieldsData.current[textField.title] = text
                                            }}
                                        />

                                    </div>
                                </div>


                            )

                        })
                    }
                    {/*<TextField value={reportDetails} defaultValue={reportDetails} title={'شرح اقدامات و آموزش ها'}*/}
                    {/*           maxLength={150}*/}
                    {/*           onChange={(text: string) => {*/}
                    {/*               setReportDetails(text)*/}
                    {/*           }}*/}
                    {/*/>*/}
                    {/*<div className={'w-11/12 bg-background mt-5'} style={{*/}
                    {/*    height: '1.5px'*/}
                    {/*}}/>*/}

                    {/*<TextField value={whyDidntYouDoTheJob} defaultValue={whyDidntYouDoTheJob}*/}
                    {/*           title={'دلایل عدم تحقق برنامه ها'} maxLength={100}*/}
                    {/*           onChange={(text: string) => {*/}
                    {/*               setWhyDidntYouDoTheJob(text)*/}
                    {/*           }}/>*/}
                    {/*<div className={'w-11/12 bg-background mt-5'} style={{*/}
                    {/*    height: '1.5px'*/}
                    {/*}}/>*/}

                    {/*<TextField value={tomorrowPlans} defaultValue={tomorrowPlans} title={'برنامه های فردا'}*/}
                    {/*           maxLength={50}*/}
                    {/*           onChange={(text: string) => {*/}
                    {/*               setTomorrowPlans(text)*/}
                    {/*           }}/>*/}


                </div>
                <div className={'h-28'}></div>

                <ButtonBase

                    className={`w-11/12 left-1/2 fixed z-20 transition-all -translate-x-1/2 fixed bottom-5 h-14 bg-primary rounded-2xl text-white IranSansMedium `}
                    onClick={submitClickHandler}

                >

                    {
                        btnLoading ?
                            <div className={'text-white'}>
                                <CircularProgress color={'inherit'}/>

                            </div>
                            :
                            <span className={'text-lg'}>ثبت</span>

                    }
                </ButtonBase>

            </div>

        </div>
    );
};

export default CanEdit;