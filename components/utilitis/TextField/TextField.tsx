import React, {useEffect, useState} from 'react';
import {CircularProgress} from "@material-ui/core";

const TextField = (props: {
    title: string
    maxLength: number
    onChange:Function
    defaultValue:string
    value:string
}) => {


    const [text, setText] = useState("");
    useEffect(()=>{
        props.onChange(text)

    },[text])
    return (
        <div className={'w-full flex flex-col justify-start items-center'}>
            <div className={'w-full h-12 text-white IranSans pt-2 flex flex-row justify-between items-center px-3 '}>
                <span>{props.title}</span>
                <CircularProgress thickness={7} className={''} variant={'determinate'} value={(text.length / props.maxLength)*100} size={20}/>
            </div>
            <textarea value={props.value??""} draggable={false} name="Works" id="text" maxLength={props.maxLength}
                      className={'border-2 h-32 w-11/12 m-auto bg-transparent IranSans rounded-lg text-white border-deactive-border focus:border-primary outline-0 p-2 text-sm '}
                      onChange={(e) => {
                          setText(e.currentTarget.value)
                      }}
            >

                    </textarea>
        </div>
    );
};

export default TextField;