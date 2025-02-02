import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import AvatarUpload from "./AvatarUpload"
import { cn } from "@/lib/utils"

export default function CollapsibleProfileCard() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [name, setName] = useState("Nadějný chemik")
    const [isEditing, setIsEditing] = useState(false)
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
            setIsEditing(false)
        }
    }

    const handleNameClick = () => {
        if (isCollapsed) {
            setIsEditing(true)
        }
    }

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            setIsEditing(false)
        }
    }

    return (
        <Card
            className={cn(`absolute w-full max-w-md left-0 right-0 mx-auto overflow-hidden top-[50vh] transition-all bg-white border-primary duration-1000 ease-in-out`,
                isCollapsed ? "translate-y-[40vh]" : "")}
            style={{ minHeight: isCollapsed ? "4rem" : height ? `${height}px` : "40px" }}
        >
            <CardContent ref={contentRef} className="p-2 px-6 transition-all duration-1000 ease-in-out">
                <div
                    className={`flex transition-all duration-1000 ease-in-out ${isCollapsed ? "flex-row items-center" : "flex-col items-center"
                        }`}
                >
                    <div
                        className={`transition-all duration-1000 ease-in-out ${isCollapsed ? "w-12 h-12 flex-shrink-0" : "w-32 h-32 mb-6"
                            }`}
                    >
                        <AvatarUpload url={avatarUrl} onUpload={setAvatarUrl} />
                    </div>
                    <div
                        className={`transition-all duration-1000 ease-in-out ${isCollapsed ? "ml-4 flex-grow" : "w-full mt-6"
                            }`}
                    >
                        {!isCollapsed || isEditing ? (
                            <form onSubmit={isCollapsed ? handleNameSubmit : handleSubmit} className="space-y-2">
                                {!isCollapsed && <Label htmlFor="name">Name</Label>}
                                <div className="flex gap-2">
                                    <Input
                                        id="name"
                                        placeholder="Nadějný chemik"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-grow"
                                    />
                                    {isCollapsed && (
                                        <Button type="submit" size="sm">
                                            Save
                                        </Button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div
                                className="text-lg font-semibold flex items-center gap-2 cursor-pointer"
                                onClick={handleNameClick}
                            >
                                {name}
                                <Pencil className="w-4 h-4 text-gray-500" />
                            </div>
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