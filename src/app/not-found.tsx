import Link from "next/link"
export default function NotFound(){
    return(
        <div className="w-[100vw] h-[100vh] bg-primary-color flex flex-col justify-center items-center text-center px-[10px]">
            <img  src="/images/404.png" alt="404 image" className="md:w-[300px] w-[200px] object-contain"/>
            <div>
                <h1 className="md:text-[30px] text-[20px] text-white">Oops! This page took a wrong turn. 🤔 404</h1>
                <p className="text-white sm:text-[15px] text-sm">It seems the page you&apos;re looking for isn&apos;t here. Maybe it&apos;s off on a coffee break? ☕</p>
                <p className="text-white sm:text-[15px] text-sm">Don&apos;t worry, let&apos;s get you back on track:</p>
                <Link href="/" className="bg-white  font-medium text-hover-primary-color hover:bg-[#333333] hover:text-white py-[10px] px-[15px] rounded-[12px] inline-block mt-[15px] ">👉 Take me home!</Link>
            </div>
        </div>
    )
}