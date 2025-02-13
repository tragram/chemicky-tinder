import React, { useState, useRef } from 'react';
import { Heart, Share2, CheckCheck, Link2, CalendarSync } from 'lucide-react';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { TinderProfile } from '@/types';
import removeAccents from 'remove-accents';
import { Button } from './ui/button';
interface MatchScreenProps {
    userName: string;
    userAvatar: string;
    profile: TinderProfile
    onContinue: () => void;
}

const MatchScreen: React.FC<MatchScreenProps> = ({ userName, userAvatar, profile, onContinue }) => {
    const matchScreenRef = useRef(null);
    const [sharing, setSharing] = useState(false);
    const sanitizeUserName = (userName: string) => {
        return removeAccents(userName).replace(/[^\x00-\x7F]/g, "").replace(" ", "_");
    }
    const imageFilename = sanitizeUserName(userName) + "_matched_" + sanitizeUserName(profile.name);
    const handleShare = async () => {
        setSharing(true);
        const buildBlob = async (element) => {
            // Safari is buggy and does not load the images on first try, so this ugly workaround has to be implemented
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            let dataUrl = '';
            let i = 0;
            let maxAttempts;
            if (isSafari) {
                maxAttempts = 5;
            } else {
                maxAttempts = 1;
            }
            let cycle = [];
            let repeat = true;

            while (repeat && i < maxAttempts) {
                dataUrl = await toBlob(element as HTMLDivElement, {
                    fetchRequestInit: {
                        cache: 'no-cache',
                    },
                    skipAutoScale: true,
                    includeQueryParams: true,

                    pixelRatio: isSafari ? 1 : 3,
                    quality: 1,
                });
                i += 1;
                cycle[i] = dataUrl.length;

                if (dataUrl.length > cycle[i - 1]) repeat = false;
            }
            //console.log('safari:' + isSafari + '_repeat_need_' + i);
            return dataUrl;
        };

        try {
            if (!matchScreenRef.current) {
                console.error("MatchScreen ref is null");
                return;
            }

            // Capture the screenshot as a blob
            const blob = await buildBlob(matchScreenRef.current);

            if (!blob) {
                throw new Error('Failed to create image blob');
            }

            // Create a File object
            const file = new File([blob], `${imageFilename}.png`, { type: 'image/png' });

            // Check if the device supports file sharing
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    text: 'Zreagovali jsme v MatchLabu',
                });
            } else {
                // Fallback for downloading the image
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${imageFilename}.png`;
                link.click();

                // Cleanup the object URL
                URL.revokeObjectURL(link.href);
            }
        } catch (error) {
            console.error('Sharing failed', error);
        }
        setSharing(false);
    };

    return (<div className="fixed inset-0 h-full w-full z-50 bg-white flex flex-col justify-center " ref={matchScreenRef}>
        <div className='absolute w-full h-full background opacity-10'></div>
        <div

            className="relative flex flex-col items-center text-center justify-center text-primary m-4 gap-4 midh:lg:p-24"
        >
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">It's a Match!</div>

            <div className="flex items-center justify-center mb-8 w-full gap-2 md:gap-4 lg:gap-8">
                <div
                    className="w-[30dvw] max-h-[50dvh] max-w-[50dvh] h-[30dvw] rounded-full border-4 md:border-8 bg-white border-primary mx-4"
                    style={{
                        backgroundImage: `url(${userAvatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <Heart className="text-primary h-8 md:h-12 w-8 md:w-12 lg:w-16 lg:h-16" />
                <div
                    className="w-[30dvw] max-h-[50dvh] max-w-[50dvh] h-[30dvw] rounded-full border-4 md:border-8 border-primary mx-4"
                    style={{
                        backgroundImage: `url(${profile.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </div>

            <div className="text-center mb-4">
                <p className="text-2xl font-semibold">
                    {userName} and {profile.name}
                </p>
                <p className="text-2xl font-semibold">
                    liked each other
                </p>
            </div>
            {sharing &&
                <div className="text-2xl md:text-3xl font-bold mb-8">Zreagovali jsme v&nbsp;MatchLabu!</div>
            }
            {!sharing &&
                <Button
                    onClick={handleShare}
                    className="bg-primary text-white px-8 rounded-full text-lg hover:bg-[#d43e1b] transition-colors flex items-center gap-2"
                >
                    <Share2 className="w-5 h-5" />
                    Share Match
                </Button>
            }
            {!sharing &&
                <Button
                    onClick={onContinue}
                    className="bg-primary text-white px-8 rounded-full text-lg hover:bg-[#d43e1b] transition-colors flex items-center gap-2"
                >
                    <CalendarSync className="w-5 h-5" />
                    Keep swiping
                </Button>
            }
            <img className="w-36 tall:w-48 mt-4" src="/logoVSCHT_stred_short.svg"></img>
        </div>
    </div>
    );
};

export default MatchScreen;