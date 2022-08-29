import React, {useEffect, useRef, useState} from 'react';
import TimePicker from "../utilitis/TimePicker/TimePicker";
import {ButtonBase, CircularProgress} from "@material-ui/core";
// @ts-ignore
import moment from 'moment-jalaali'
import TextField from "../utilitis/TextField/TextField";
import {sendReport} from "../../Requests/Requests";
import {CollapseHeader, CompanyId, CompanyRequiredFields, UserId} from "../../store/store";
import Swal from "sweetalert2";

const CanEdit = (props: {
    date: string,
    remainSeconds: number,
    dayData: { textFields: [any], timeFields: [any] },
    companyTimeFields: any,
    companyTextFields: any,
    loading: boolean,
    noTimeLimit?: boolean,
    active: boolean
}) => {


    const textFieldsData = useRef({} as any)
    const timeFieldsData = useRef({} as any)


    const [btnLoading, setBtnLoading] = useState(false);

    const [requirementsFilled, setRequirementsFilled] = useState("");

    const textFieldsHolder = useRef<HTMLDivElement>(null)
    const lastScrollTop = useRef(0)

    moment.loadPersian()
    useEffect(() => {
        moment.relativeTimeThreshold('h', 30);
        console.log(props.dayData)
        console.log(CompanyRequiredFields())

    }, [])


    useEffect(() => {


        try {
            if (textFieldsHolder.current) {
                let children = textFieldsHolder.current.querySelectorAll('.t-field')
                if (props.dayData.textFields)
                    props.dayData.textFields.forEach((tField) => {

                        children.forEach((tElement) => {

                            if (tElement.querySelector('.t-title')?.innerHTML === tField.title) {
                                tElement.querySelector('textarea')!.value = tField.value

                            }
                        })


                        textFieldsData.current[tField.title] = tField.value
                    })
            }
        } catch (e) {
            console.log(e)
        }


    }, [props.dayData]);

    const submitClickHandler = () => {


        let timeFields = [] as any[]

        Object.keys(timeFieldsData.current).forEach((key) => {
            timeFields.push({title: key, value: timeFieldsData.current[key]})
        })


        let textFields = [] as any[]

        Object.keys(textFieldsData.current).forEach((key) => {
            textFields.push({title: key, value: textFieldsData.current[key]})
        })

        setBtnLoading(true)

        sendReport(UserId(), CompanyId(), props.date, JSON.stringify(timeFields), JSON.stringify(textFields), props.noTimeLimit ? "1" : "0").then((res) => {
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
                ).then(() => {

                })
            } else {
                Swal.fire(
                    {
                        title: 'خطا در هنگام ثبت گزارش',
                        html: 'لطفا ورودی ها را بررسی کنید و در صورت درست بودن ورودی ها با ادمین تماس بگیرید',
                        icon: 'error',
                        customClass: 'text-white bg-background',
                        confirmButtonColor: '#68b4eb',
                    }
                ).then(() => {

                })
            }
        })
    }


    const sampleOfThisTime = (time: any) => {

        Object.keys(props.companyTimeFields as object).forEach((key) => {
            if (((props.companyTimeFields as any)[key].title as string) === time.title) {
                return props.companyTextFields[key].sampleValues as any[]
            }
        })
        return ["05:00", "06:00", "07:00", "08:00"]
    }
    return (
        <div className={'h-full w-full relative'}>
            <div
                className={`fixed left-0 bottom-5 z-50  transition-all duration-500  w-full flex flex-col justify-center items-center pointer-events-none`}>

                <ButtonBase
                    className={`w-11/12 max-w-btn-max-width ${props.active ? "pointer-events-auto" : 'pointer-events-none'} transition-all duration-300 ease-in-out mt-5 z-20 transition-all h-14 bg-primary rounded-2xl text-white IranSansMedium `}
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
            <div className={'pb-44 h-full overflow-scroll'}
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

                <div className={'pager pb-12 w-full flex-col justify-start items-center bg-secondary '}>

                    {

                        (props.dayData.timeFields ? props.dayData.timeFields : props.companyTimeFields).map((time: object, index: number) => {


                            return (
                                <div key={index + 'timePickers'} className={'contents  '}>


                                    {
                                        index === 0 ?
                                            <div
                                                className={'w-full bg-background pb-2 text-right text-hint-text IranSansMedium text-sm pt-2 px-3'}>
                                                برای این روز شما تا
                                                {" "}
                                                {moment.duration(props.remainSeconds ?? 0, 'seconds').humanize()}
                                                {" "}
                                                دیگر میتوانید گزارش بنویسید
                                            </div>
                                            :
                                            index === 1 ?
                                                <div
                                                    className={'w-full  bg-background pb-2 text-right text-hint-text IranSansMedium text-sm pt-2 px-3'}>
                                                    میتوانید از گزینه های سمت راست برای سرعت بیشتر استفاده کنید
                                                </div>
                                                :
                                                null
                                    }


                                    <TimePicker loading={props.loading} onTimeChange={(selectedTime: string) => {
                                        timeFieldsData.current[(time as { title: string, sampleValues: any[] }).title] = selectedTime

                                    }}
                                                defaultTime={props.dayData.timeFields ? props.dayData.timeFields.filter((item) => {
                                                    if (item.title === (time as { title: string }).title) {
                                                        return true
                                                    }
                                                })[0].value : "00:00"}
                                                sample={sampleOfThisTime(time)}
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
                            (props.dayData.textFields ?? props.companyTextFields).map((textField, index) => {

                                return (
                                    <div key={index + "TFields"} className={'contents'}>
                                        <div className={'w-11/12 bg-background mt-3'} style={{
                                            height: '1.5px'
                                        }}/>
                                        <div className={'w-full t-field '}>
                                            <TextField
                                                required={CompanyRequiredFields().includes(textField.title)}
                                                title={textField.title}
                                                maxLength={250}
                                                onChange={(text: string) => {


                                                    if (text) {
                                                        if (textField.required) {
                                                            if (requirementsFilled.substring(textField.title)) {

                                                            } else {
                                                                setRequirementsFilled(requirementsFilled + textField.title)
                                                            }
                                                        }
                                                    } else {
                                                        if (requirementsFilled.substring(textField.title)) {
                                                            setRequirementsFilled(requirementsFilled.replace(textField.title, ''))
                                                        }
                                                    }


                                                    textFieldsData.current[textField.title] = text
                                                }}
                                            />

                                        </div>
                                    </div>


                                )

                            })
                        }


                    </div>


                </div>

            </div>
        </div>

    );
};

export default CanEdit;