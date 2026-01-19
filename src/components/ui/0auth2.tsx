"use client"
import { useState } from "react"

export const Oauth2PopManager = (lien: string) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="">
            <button onClick={() => setIsOpen(true)}>Open</button>

            {
                isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-[#1DD3C3] p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">OAuth 2.0 PopUp</h2>
                            f
                        </div>
                    </div>
                )
            }
        </div>
    )
}