import Image from 'next/image'

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh_-_96px)] flex-col items-center justify-center gap-5">
            <div>
                <Image
                    src="/images/not-found-two.svg"
                    alt="not-found-img"
                    width={350}
                    height={350}
                ></Image>
            </div>
            <h3 className="text-xl font-semibold text-black">
                Page not Found.
            </h3>
        </div>
    )
}
