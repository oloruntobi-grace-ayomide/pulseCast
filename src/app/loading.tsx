export default function Loading() {
    return(
        <div role="status" aria-live="polite" className="w-[100vw] h-[100vh] bg-[#F8F8F8] flex flex-col justify-center items-center text-center transition-opacity duration-0.3 ease-out">
            <div className="m-0 w-full flex justify-center items-center  gap-[8px]">

                <div className="relative w-[20px] h-[20px] bg-primary-color rounded-[100%] inline-block animate-sk-three-bounce [animation-delay:-0.32s]"></div>

                <div className="relative w-[20px] h-[20px] bg-primary-color rounded-[100%] inline-block animate-sk-three-bounce [animation-delay:-0.16s]"></div>

                <div className="relative w-[20px] h-[20px] bg-primary-color rounded-[100%] inline-block animate-sk-three-bounce [animation-delay:-0.08s] "></div>

            </div>
            <p className="text-[#333333] text-[18px]">Loading, please wait...</p>
        </div>
    )
}
