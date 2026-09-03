import { Dispatch, SetStateAction, useEffect, useState } from "react"

const CustomSnackBarItem = ({ crash, index, rising }: { crash: { payout: number, win: number }, index: number, rising: number }) => {
    const [val, setVal] = useState(0)
    useEffect(() => {
        setTimeout(() => setVal(100), 100)
    }, [rising])
    return (
        <div className='absolute top-0 flex items-center bg-[#0b1f12]/95 backdrop-blur-md w-[260px] h-[40px] m-1 rounded-full border border-[#22c55e]/70 px-2 py-1 transition-all ease-in-out duration-150 shadow-[0_4px_16px_rgba(34,197,94,0.3)]' style={{ left: "calc(50% - 260px / 2)", translate: `0 ${46 * (index - rising)}px`, opacity: val / 100 }}>
            <div className='flex flex-col justify-center text-left flex-1 pl-1 leading-none'>
                <span className='text-[#86efac] text-[9px] uppercase font-bold tracking-wider'>Cashed Out</span>
                <span className='text-white text-xs font-black'>@{crash.payout.toFixed(2)}x</span>
            </div>
            <div className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#22c55e] text-[#052e16] font-black text-xs shadow-sm'>
                <span className='text-[9px] uppercase font-bold opacity-80'>Win</span>
                <span>+{crash.win.toFixed(2)}</span>
            </div>
            <span className='text-white/50 hover:text-white px-1 font-bold cursor-pointer text-xs'>×</span>
        </div>
    )
}
const CustomSnackBar = ({ cashes, setCashes }: { cashes: { payout: number, win: number }[], setCashes: Dispatch<SetStateAction<{ payout: number, win: number }[]>> }) => {
    const [rising, setRising] = useState(0)
    useEffect(() => {
        if (cashes.length > 0) {
            setTimeout(() => setRising(cashes.length), 3000)
        } else {
            setRising(0)
        }
    }, [cashes])
    return (
        <div className='absolute left-0 top-0 w-full h-0 overflow-visible z-50'>
            {cashes.map((item, i) => <CustomSnackBarItem key={i} crash={item} index={i} rising={rising} />)}
        </div>
    )
}
export default CustomSnackBar