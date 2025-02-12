import React, { useState, useRef, ForwardedRef, act } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";

const VSCHT_RED = "#f04e23";

interface ProfileInfoProps {
    profile: TinderProfile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
    return (
        <div className="absolute flex flex-col bottom-0 p-8 w-full text-[white] gap-2">
            <div className="flex flex-row items-bottom gap-4">
                <h2 className={cn("text-2xl font-bold", `text-[white]`)} >{profile.name}</h2>
                <p className={cn("text-2xl font-normal", `text-[${VSCHT_RED}]`)}>{profile.age}</p>
            </div>

            <div className="flex gap-1 text-md font-bold items-center">
                <BriefcaseBusiness size={16} color={VSCHT_RED} />{profile.job}
            </div>

            <div className="flex gap-1 text-sm font-semibold items-start">
                <div><Quote size={16} color={VSCHT_RED} /></div>
                <p>{profile.description}</p>
            </div>
        </div>
    )
}

export default ProfileInfo;