'use client'
import CountUp from 'react-countup'

const CountsUp = ({
    start,
    end,
    duration,
    prefix,
    suffix,
    delay,
    className,
}: any) => {
    return (
        <CountUp
            start={start}
            end={end}
            duration={duration}
            delay={delay}
            prefix={prefix}
            suffix={suffix}
            className={className}
            enableScrollSpy={true}
            scrollSpyOnce={true}
        />
    )
}

export default CountsUp
