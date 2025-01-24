

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Avatar from "./AvatarUpload"
import { cn } from "@/lib/utils"

const VSCHT_RED = "#f04e23";

export default function CollapsibleProfileCard() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [name, setName] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [height, setHeight] = useState<number | undefined>(undefined)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight)
        }
    }, [name, avatarUrl])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            setIsCollapsed(true)
        }
    }

    return (
        <Card
            className={cn(`w-full max-w-md mx-auto overflow-hidden transition-all duration-1000 ease-in-out`,`border-color-[${VSCHT_RED}]`)}
            style={{ minHeight: isCollapsed ? "6rem" : height ? `${height}px` : "auto" }}
        >
                <CardContent ref={contentRef} className="p-6 transition-all duration-1000 ease-in-out">
                    <div
                        className={`flex transition-all duration-1000 ease-in-out ${isCollapsed ? "flex-row items-center" : "flex-col items-center"
                            }`}
                    >
                        <div
                            className={`transition-all duration-1000 ease-in-out ${isCollapsed ? "w-16 h-16 flex-shrink-0" : "w-32 h-32 mb-6"
                                }`}
                        >
                            <Avatar url={avatarUrl} onUpload={setAvatarUrl} />
                        </div>
                        <div
                            className={`transition-all duration-1000 ease-in-out ${isCollapsed ? "ml-4 flex-grow" : "w-full mt-6"}`}
                        >
                            {!isCollapsed ? (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="text-lg font-semibold">{name}</div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter
                    className={`transition-all duration-1000 ease-in-out ${isCollapsed ? "opacity-0 pointer-events-none h-0 p-0" : "opacity-100 h-auto"
                        }`}
                >
                    <Button onClick={handleSubmit} className="w-full">
                        Submit
                    </Button>
                </CardFooter>
        </Card>
    )
}