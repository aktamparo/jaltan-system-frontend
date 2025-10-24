"use client"

import { ReactNode } from "react"

export default function MainContainer({children}: { children: ReactNode }) {
    return(
        <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {children}
        </div>
    )
}