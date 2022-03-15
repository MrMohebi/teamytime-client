import * as React from 'react'
import Image from "next/image";

interface onUpdateInterface{
    (value:any):any
}

const TInput:React.FC<{placeholder?:string, icon?:string|null, onUpdate?:onUpdateInterface}> = ({onUpdate,placeholder, icon}) =>{
    const handelUpdate = (e:React.ChangeEvent<HTMLInputElement>) =>{
        onUpdate && onUpdate(e.target.value)
    }
    return(
        <div className="bg-default rounded-xl w-fit p-2 flex justify-center items-center">
            {!!icon && <Image src={icon} alt="icon" height={20} width={20}/>}
            <input onInput={handelUpdate} type="text" placeholder={placeholder} className={'bg-default border-0 mr-3'}/>
        </div>
    )
}

export default TInput