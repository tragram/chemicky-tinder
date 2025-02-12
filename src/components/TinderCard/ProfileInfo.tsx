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
        <div className="absolute flex flex-col bottom-0 short:p-8 p-4 md:p-4 w-full text-white max-h-[50%] overflow-y-auto">
            {/* Content wrapper that enables pointer events only for the scrollbar */}
            <div 
                className="flex flex-col pointer-events-auto overflow-y-auto midh:gap-2"
                style={{ pointerEvents: 'auto' }}
                onPointerDown={(e) => {
                    // Only allow pointer events for scrollbar interactions
                    console.log(e)
                    // e.preventDefault();
                }}
            >
                <div className="flex flex-row gap-4 md:gap-8">
                    <h2 className={cn("text-xl lg:text-2xl font-bold", "text-white")}>{profile.name}</h2>
                    <h3 className={cn("h-fit text-lg self-end font-semibold", "text-primary")}>{profile.age}</h3>
                </div>

                <div className="flex gap-1 text-md font-bold items-center">
                    <BriefcaseBusiness size={16} className="text-primary" />{profile.job}
                </div>

                <div className="flex gap-1 text-xs midh:md:text-sm font-semibold items-start max-h-[10%]">
                    <div><Quote size={16} className="text-primary" /></div>
                    <p>{profile.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;