import React, { useState, useRef, ForwardedRef, act } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";

interface ProfileInfoProps {
    profile: TinderProfile;
    className: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile,className }) => {
    return (
        <div className={cn("flex flex-col flex-shrink short:p-8 p-4 md:p-4 w-full h-fit text-white midh:gap-2 pointer-events-none z-20 bg-gradient-to-b from-transparent via-black/60 via-40% to-black",className)}>
            <div className="flex flex-row gap-4 md:gap-8 mt-[20%]">
                <h2 className={cn("text-lg md:text-xl lg:text-2xl font-bold", "text-white")}>{profile.name}</h2>
                <h3 className={cn("h-fit text-base md:text-lg self-end font-semibold", "text-primary")}>{profile.age}</h3>
            </div>

            <div className="flex gap-1 text-md font-bold items-center">
                <BriefcaseBusiness size={16} className="text-primary" />{profile.job}
            </div>

            <div className="flex gap-1 text-xs midh:md:text-sm font-semibold items-start max-h-[10%]">
                <div><Quote size={16} className="text-primary" /></div>
                <p>{profile.description}</p>
            </div>
        </div>
    );
};

export default ProfileInfo;