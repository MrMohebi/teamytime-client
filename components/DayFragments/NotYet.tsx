import React, {useEffect} from 'react';
// @ts-ignore
import moment from 'moment-jalaali'

const NotYet = (props: {
    remainSeconds: number
}) => {


    moment.loadPersian()


    return (
        <div className={'w-full flex flex-col justify-start items-center bg-background'}>

            <img src="/svg/sand-clock.svg" className={'w-24 h-24 mt-10 '} alt=""/>
            <span className={'IranSansMedium text-primary mt-5'}>مهلت ثبت گزارش نرسیده است</span>

            <div className={'IranSansMedium text-text-blue-light text-sm text-center mt-7'}>

                تا
                {" "}
                {moment.duration(props.remainSeconds ?? 0, 'seconds').humanize()}

                {" "}
                دیگر
                <br/>
                نمیتوانید برای این روز گزارش بنویسید

            </div>

        </div>
    );
};

export default NotYet;