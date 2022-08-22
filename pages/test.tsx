import React, {useEffect} from 'react';
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import gsap from 'gsap'


gsap.registerPlugin(ScrollTrigger)

const Test = () => {

    useEffect(() => {

        gsap.to("#el10", {
            background: 'blue',

            scrollTrigger: {
                horizontal: true,
                scroller: '#scroller',
                trigger: '#el10',
                start: 'top center',
                end: 'end center',
                invalidateOnRefresh: true,
                scrub: true,
                markers: true
            }
        })
    }, []);


    return (
        <div className={'w-full overflow-hidden'}>


            <div
                id={'scroller'}
                dir={'ltr'}
                className={'w-96 h-96 flex flex-row justify-start items-center w-full overflow-y-scroll overflow-x-scroll '}>
                {
                    (Array(70).fill('').map((value, index, array) => {
                        return (
                            <div key={index} style={{
                                background: 'red'
                            }} id={'el' + index} className={'shrink-0 my-3 w-20 h-10 mx-20 '}></div>
                        )
                    }))
                }
            </div>
        </div>
    );
};

export default Test;