import React, { useState, useRef, ForwardedRef, act } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";

interface ProfileInfoProps {
    profile: TinderProfile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
    return (
        <div className="absolute flex flex-col bottom-10 p-8 w-full text-[white] gap-2 max-h-[40%] overflow-y-auto">
            <div className="flex flex-row items-bottom gap-4">
                <h2 className={cn("text-2xl font-bold", `text-[white]`)} >{profile.name}</h2>
                <p className={cn("text-2xl font-normal", `text-primary`)}>{profile.age}</p>
            </div>

            <div className="flex gap-1 text-md font-bold items-center text-prim">
                <BriefcaseBusiness size={16} className="text-primary" />{profile.job}
            </div>

            <div className="flex gap-1 text-sm font-semibold items-start max-h-[10%]">
                <div><Quote size={16} className="text-primary" /></div>
                <p>{profile.description}</p>
            </div>
        </div>
    )
}

export default ProfileInfo;