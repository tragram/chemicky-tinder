import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import AvatarUpload from "./AvatarUpload"
import { cn } from "@/lib/utils"

export default function CollapsibleProfileCard({ name, setName, avatarUrl, setAvatarUrl, isCollapsed, setIsCollapsed }) {
    const [isEditing, setIsEditing] = useState(false);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight)
        }
    }, [name, avatarUrl])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setIsCollapsed(true);
            setIsEditing(false);
        }
    }

    const handleNameClick = () => {
        if (isCollapsed) {
            setIsEditing(true);
        }
    }

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setIsEditing(false);
        }
    }

    return (
        <Card
            className={cn(`rounded-3xl overflow-hidden bg-white border-primary border-4 transition-all duration-1000 ease-in-out shadow-lg`,
                isCollapsed ? "" : "h-full w-full")}
            style={{
                minHeight: isCollapsed ? "4rem" : (height ? `${height}px` : "40px"),
                width: isCollapsed ? "50vh" : "100%" // Match TinderCard width when collapsed
            }}
        >
            <CardContent ref={contentRef} className="p-2 px-6 transition-all bg-primary/5 duration-1000 ease-in-out h-full justify-bottom">
                <div
                    className={`flex transition-all duration-1000 ease-in-out items-center ${isCollapsed ? "flex-row" : "flex-col "
                        }`}
                >
                    <div
                        className={`transition-all duration-1000 ease-in-out ${isCollapsed ? "w-12 h-12 flex-shrink-0" : "w-[50vw] h-full mb-6"
                            }`}
                    >
                        <AvatarUpload url={avatarUrl} onUpload={setAvatarUrl} isCollapsed={isCollapsed} />
                    </div>
                    <div
                        className={`transition-all duration-1000 ease-in-out ${isCollapsed ? "ml-4 flex-grow" : "w-full mt-6"
                            }`}
                    >
                        {!isCollapsed || isEditing ? (
                            <form onSubmit={isCollapsed ? handleNameSubmit : handleSubmit} className="space-y-2">
                                {!isCollapsed && <Label htmlFor="name">Name</Label>}
                                <div className="flex gap-4 h-full">
                                    <Input
                                        id="name"
                                        placeholder="Nadějný chemik"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-grow border-primary border-2"
                                    />
                                    {isCollapsed && (
                                        <Button type="submit" size="default">
                                            Save
                                        </Button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div
                                className="text-lg font-semibold flex items-center gap-2 cursor-pointer h-full"
                                onClick={handleNameClick}
                            >
                                {name}
                                <Pencil className="w-4 h-4 text-primary" />
                            </div>
                        )}
                    </div>
                </div>
                <Button onClick={handleSubmit} className={cn("w-full mt-2", isCollapsed ? "hidden" : "visible")}>
                    Submit
                </Button>
            </CardContent>
        </Card>
    )
}