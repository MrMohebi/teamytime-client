import React from 'react';

const Passed = (props: {
    saved: boolean
    workHours: number
    trainingHours: number
    whatDidUserDo: string
}) => {
    return (
        <div className={'w-full flex flex-col justify-start items-center'}>


            <img className={'w-24 h-24 mt-10'}
                 src={`${props.saved ? '/svg/passed-saved.svg' : '/svg/passed-unsaved.svg'} `} alt="Report Saved"/>


            {props.saved ?

                <div className={'mt-10 flex flex-col justify-center items-center text-text-blue-light text-center'}>

                    <div>
                        ساعت کار ثبت شده :
                        {" "}
                        <span className={'IranSansMedium inline'}>{props.workHours ?? 0}</span>
                    </div>


                    {" "}
                    <div>
                        ساعت آموزش ثبت شده :
                        {" "}
                        <span className={'IranSansMedium inline'}>{props.trainingHours ?? 0}</span>
                    </div>

                    <span className={'IranSansMedium text-text-blue-light mt-7 text-sm'}>
                        {props.whatDidUserDo ?? ""}</span>

                </div>
                :

                <span
                    className={'IranSansMedium text-text-blue-light mt-7 text-sm'}> برا این روز گزارشی ثبت نکرده اید</span>

            }

        </div>
    );
};

export default Passed;