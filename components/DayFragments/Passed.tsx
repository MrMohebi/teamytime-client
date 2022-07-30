import React, {useEffect} from 'react';

const Passed = (props: {
    saved: boolean
    workHours: number
    trainingHours: number
    whatDidUserDo: string
    dayData: object
}) => {


    useEffect(() => {
        console.log(props.workHours)

    }, [props.workHours, props.trainingHours]);
    useEffect(() => {
        console.log(props.dayData)

    }, [props.dayData]);
    return (
        <div className={'w-full flex flex-col justify-start items-center'}>


            <img className={'w-20 h-20 mt-14'}
                 src={`${props.saved ? '/svg/passed-saved.svg' : '/svg/passed-unsaved.svg'} `} alt="Report Saved"/>


            {props.saved ?

                <div className={'mt-5 flex flex-col justify-center items-center text-text-blue-light text-center'}>

                    <span className={'block text-primary IranSansMedium '}> گزارش برای این روز ثبت شده است</span>


                    <div className={'flex flex-row justify-center items-center w-full mt-5'}>
                        <div
                            className={'rounded-xl border border-deactive-border flex flex-row justify-center items-center   py-2 ml-5 '}>
                            {/*todo change the index to text*/}
                            <span
                                className={'IranSansMedium text-primary mx-3 text-xl '}>{props.dayData.timeFields[0].value ?? "00:00"}</span>
                            <img className={'ml-2'} src="/svg/work-glyph.svg" alt=""/>

                        </div>

                        <div
                            className={'rounded-xl border border-deactive-border flex flex-row justify-center items-center   py-2'}>
                            <span
                                className={'IranSansMedium text-primary mx-3 text-xl '}>{props.dayData.timeFields[1].value ?? "00:00"}</span>
                            <img className={'ml-2'} src="/svg/training-glyph.svg" alt=""/>

                        </div>


                    </div>


                    <span className={'IranSansMedium text-text-blue-light mt-7 text-sm'}>
                        {props.whatDidUserDo ?? ""}</span>

                </div>
                :

                <div className={'h-full flex-col justify-center items-center'}>
                      <span
                          className={' block text-center IranSansMedium text-red mt-7 text-md'}>مهلت ثبت گزارش تمام شده است</span>
                    <span
                        className={' block text-center IranSansMedium text-text-blue-light mt-7 text-sm'}> برا این روز گزارشی ثبت نکرده اید</span>
                </div>


            }

        </div>
    );
};

export default Passed;