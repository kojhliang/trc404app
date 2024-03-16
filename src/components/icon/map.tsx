export default function IconMap({addClass}: { addClass: string }) {
    return <svg
        className={"w-[16px] h-[16px] " + addClass}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 17 21"
    >
        <g
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        >
            <path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
            <path
                d="M13.8 12.938h-.01a7 7 0 1 0-11.465.144h-.016l.141.17c.1.128.2.252.3.372L8 20l5.13-6.248c.193-.209.373-.429.54-.66l.13-.154Z"
            />
        </g>
    </svg>
}
