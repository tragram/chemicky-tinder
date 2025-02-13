import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
    const [editName, setEditName] = useState(name)
    const contentRef = useRef<HTMLDivElement>(null)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditName(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedName = editName.trim()

        if (!trimmedName) {
            return
        }

        setName(trimmedName)
        setIsCollapsed(true)
        setIsEditing(false)
    }

    const toggleEditing = (e) => {
        if (isCollapsed) {
            e.preventDefault()
            setIsEditing(!isEditing)
        }
    }

    return (
        <>
            <Card
                className={cn(
                    "rounded-none md:tall:rounded-3xl overflow-hidden bg-white border-primary border-0 md:tall:border-2 transition-all duration-500 ease-in-out shadow-lg",
                    isCollapsed ? "w-full h-fit md:tall:w-[calc((82dvh)*2/3-1em)] outline outline-primary outline-4" : "w-full h-full"
                )}
            >
                <CardContent
                    ref={contentRef}
                    className={cn("p-2 px-6 transition-all duration-500 ease-in-out h-full justify-bottom",
                        isCollapsed ? "flex justify-center md:tall:justify-start bg-primary" : "p-16 content-center bg-primary/5")}
                >
                    <div
                        className={cn(
                            "flex flex-col transition-all duration-500 ease-in-out items-center",
                            isCollapsed ? "flex-row" : "flex-col"
                        )}
                    >
                        {!isCollapsed &&
                            <div className="flex flex-col text-center mb-12 mid:mb-16  text-primary gap-2">
                                <h1 className="font-extrabold text-3xl">VŠCHT MatchLab</h1>
                                {/* <h2 className="font-bold text-xl">Najdi svou spřízněnou duši!</h2> */}
                            </div>
                        }
                        <div
                            className={cn(
                                "transition-all text-center duration-500 ease-in-out",
                                isCollapsed ? "w-[5dvh] h-[5dvh] talh:md:w-12 talh:md:h-12 flex-shrink-0" : "w-[40dvh] max-w-[70dvw] h-[40dvh] max-h-[70dvw] mb-6"
                            )}
                        >
                            <AvatarUpload
                                url={avatarUrl}
                                onUpload={setAvatarUrl}
                                isCollapsed={isCollapsed}
                            />
                            <div className={cn("font-semibold mt-2 text-primary", isCollapsed ? "hidden" : "visible")}>
                                Zvol si svůj avatar...
                            </div>
                        </div>

                        <div
                            className={cn(
                                "transition-all duration-500 ease-in-out",
                                isCollapsed ? "ml-4 flex-grow" : "w-full mt-6"
                            )}
                        >
                            {!isCollapsed ? (
                                <form onSubmit={handleSubmit}>
                                    <Label className="text-primary" htmlFor="name">...a jméno</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nadějný chemik"
                                        value={editName}
                                        onChange={handleNameChange}
                                        className="flex-grow border-primary border-2 bg-white text-zinc-800"
                                    />
                                    <Button className="w-full mt-2">
                                        Submit
                                    </Button>
                                </form>
                            ) : (
                                <button
                                    className="text-lg font-semibold flex items-center gap-2 w-full text-left"
                                    onClick={toggleEditing}
                                >
                                    <span className="truncate text-white">{name}</span>
                                    <Pencil className="w-4 h-4 text-white flex-shrink-0" />
                                </button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditing && isCollapsed} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Label htmlFor="nameEdit">Edit Name</Label>
                        <Input
                            id="nameEdit"
                            placeholder="Nadějný chemik"
                            value={editName}
                            onChange={handleNameChange}
                            className="border-primary border-2 bg-white text-zinc-800"
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}