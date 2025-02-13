import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import AvatarUpload from "./AvatarUpload"
import { cn } from "@/lib/utils"

interface CollapsibleProfileCardProps {
    name: string
    setName: (name: string) => void
    avatarUrl: string
    setAvatarUrl: (url: string) => void
    isCollapsed: boolean
    setIsCollapsed: (collapsed: boolean) => void
}

export default function CollapsibleProfileCard({
    name,
    setName,
    avatarUrl,
    setAvatarUrl,
    isCollapsed,
    setIsCollapsed
}: CollapsibleProfileCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedName = name.trim()

        if (!trimmedName) {
            return // Don't submit empty names
        }

        setIsCollapsed(true)
        setIsEditing(false)
    }

    const toggleEditing = (e) => {
        if (isCollapsed) {
            e.preventDefault();
            const isEditingStart = isEditing;
            setIsEditing(!isEditing);
            if (!isEditingStart) {
                const nameField = document.getElementById("name");
                setTimeout(() => {
                    nameField?.focus();
                }, 10);
            }
        }
    }
    return (
        <Card
            className={cn(
                "rounded-none md:tall:rounded-3xl overflow-hidden bg-white border-primary border-0 md:tall:border-2 transition-all duration-500 ease-in-out shadow-lg",
                isCollapsed ? "w-full h-fit md:tall:w-[calc((82dvh)*2/3-1em)] outline outline-primary outline-4" : "w-full h-full"
            )}
        >
            <CardContent
                ref={contentRef}
                className={cn("p-2 px-6 transition-all bg-primary/5 duration-500 ease-in-out h-full justify-bottom", isCollapsed ? "flex justify-center md:tall:justify-start" : "p-16 content-center")}
            >
                <div
                    className={cn(
                        "flex flex-col transition-all duration-500 ease-in-out items-center",
                        isCollapsed ? "flex-row" : "flex-col"
                    )}
                >
                    {!isCollapsed&&
                    <h1 className="font-extrabold text-3xl mb-16 text-primary">Název</h1>
                    }
                    <div
                        className={cn(
                            "transition-all text-center duration-500 ease-in-out",
                            isCollapsed ? "w-[5dvh] h-[5dvh] talh:md:w-12 talh:md:h-12 flex-shrink-0" : "w-[calc(min(50dvh,70dvw)] h-[calc(min(50dvh,70dvw)] mb-6"
                        )}
                    >
                        <AvatarUpload
                            url={avatarUrl}
                            onUpload={setAvatarUrl}
                            isCollapsed={isCollapsed}
                        />
                        <div className={cn("font-semibold mt-2 text-primary",isCollapsed?"hidden":"visible")}>Zvol si svůj avatar...</div>
                    </div>


                    <div
                        className={cn(
                            "transition-all duration-500 ease-in-out",
                            isCollapsed ? "ml-4 flex-grow" : "w-full mt-6"
                        )}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className=""
                        >
                            {!isCollapsed && <Label className="text-primary" htmlFor="name">...a jméno</Label>}
                            <div className={cn("flex gap-4 h-full", !isCollapsed || isEditing ? "visible" : "hidden")}>
                                <Input
                                    id="name"
                                    placeholder="Nadějný chemik"
                                    value={name}
                                    onChange={handleNameChange}
                                    className="flex-grow border-primary border-2 bg-white"
                                />
                                {isCollapsed && (
                                    <Button type="submit" size="default">
                                        Save
                                    </Button>
                                )}
                            </div>

                            <Button
                                onClick={handleSubmit}
                                className={cn("w-full mt-2", isCollapsed && "hidden")}
                            >
                                Submit
                            </Button>
                        </form>
                        <button
                            type="button"
                            className={cn("text-lg font-semibold flex items-center gap-2 w-full text-left", isCollapsed && !isEditing ? "visible" : "hidden")}
                            onClick={toggleEditing}
                        >
                            <span className="truncate">{name}</span>
                            <Pencil className="w-4 h-4 text-primary flex-shrink-0" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}