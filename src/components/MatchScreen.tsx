import React, { useState, useRef } from 'react';
import { Heart, Share2, CheckCheck, Link2, CalendarSync } from 'lucide-react';
import html2canvas from 'html2canvas';

const MatchScreen = ({ userName, profile, onContinue }) => {
    const matchScreenRef = useRef(null);

    const handleShare = async () => {
        try {
            // Capture screenshot of the component
            const canvas = await html2canvas(matchScreenRef.current, {
                scale: 2, // Increases resolution
                useCORS: true, // Handles cross-origin images
                backgroundColor: '#000000' // Matches the background
            });

            // Convert canvas to blob
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve)
            );

            if (!blob) throw new Error('Failed to generate screenshot');

            if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'match.png', { type: 'image/png' })] })) {
                // Use Web Share API if supported
                await navigator.share({
                    title: 'Check out our match!',
                    text: `${userName} and ${profile.name} matched!`,
                    files: [new File([blob], 'match.png', { type: 'image/png' })],
                });
            } else {
                // Fallback for unsupported cases
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'match.png';
                link.click();;
            }
        } catch (error) {
            console.error('Sharing failed', error);
            alert('Sharing failed. Please try again or download the image manually.');
        }
    };

    return (
        <div
            ref={matchScreenRef}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center text-white p-4"
        >
            <div className="text-3xl font-bold mb-8">It's a Match!</div>

            <div className="flex items-center justify-center mb-8">
                <div
                    className="lg:w-[200px] w-[100px] aspect-square rounded-full border-4 border-white mx-4"
                    style={{
                        backgroundImage: `url(${profile.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <Heart className="text-[#f04e23] lg:w-16 w-12 aspect-square" />
                <div
                    className="lg:w-[200px] w-[100px] aspect-square rounded-full border-4 border-white mx-4"
                    style={{
                        backgroundImage: `url(${profile.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </div>

            <div className="text-center mb-8">
                <p className="text-2xl">
                    You and {profile.name} liked each other
                </p>
            </div>

            <button
                onClick={handleShare}
                className="bg-[#f04e23] text-white px-8 py-3 my-8 rounded-full text-lg hover:bg-[#d43e1b] transition-colors flex items-center gap-2"
            >
                <Share2 className="w-5 h-5" />
                Share Match
            </button>
            <button
                onClick={onContinue}
                className="bg-[#f04e23] text-white px-8 py-3 rounded-full text-lg hover:bg-[#d43e1b] transition-colors flex items-center gap-2"
            >
                <CalendarSync className="w-5 h-5" />
                Keep swiping
            </button>
        </div>
    );
};

export default MatchScreen;