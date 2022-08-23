import React from 'react';

const Error = () => {
    return (
        <div>
            <button className={'w-44 h-20 text-white rounded-2xl shadow m-auto bg-primary'} onClick={() => {
                console.error('shit,s error')

                let a =1;

                // @ts-ignore
                a.split("d");

            }}> Click to error
            </button>

        </div>
    );
};

export default Error;