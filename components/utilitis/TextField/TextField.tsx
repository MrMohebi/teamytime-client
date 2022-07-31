import React, {useEffect, useState} from 'react';
import {CircularProgress} from "@material-ui/core";

const TextField = (props: {
    title: string
    maxLength: number
    onChange: Function
    defaultValue?: string
    value?: string
    required?: string
}) => {


    const [text, setText] = useState("");
    useEffect(() => {
        props.onChange(text)

    }, [text])
    return (
        <div className={'w-full flex flex-col justify-start items-center'}>
            <div className={'w-full h-12 text-white IranSans pt-2 flex flex-row justify-between items-center px-3 '}>
                <span className={'t-title hidden'}>{props.title}</span>
                <span className={'mb-2'}>{props.title} {props.required ?
                    <span className={'text-red mx-1'}>*</span> : null}</span>
                <CircularProgress thickness={7} className={''} variant={'determinate'}
                                  value={(text.length / props.maxLength) * 100} size={20}/>
            </div>
            <div className={'w-full flex flex-row justify-center items-center px-3'}>
                <textarea id={props.title} defaultValue={props.defaultValue} draggable={false} name="Works"
                          maxLength={props.maxLength}
                          className={'border-2 select-all m-auto bg-background h-32 w-11/12  transition-all ease-in-out duration-300 IranSans rounded-lg text-white border-deactive-border focus:border-primary outline-0 p-2 text-sm '}
                          onChange={(e) => {
                              setText(e.currentTarget.value)
                          }}
                >
                    </textarea>
            </div>

        </div>
    );
};

export default TextField;