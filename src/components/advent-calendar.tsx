'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import winterCabinBg from '@/assets/winter-cabin.jpg';

// Tipo per il contenuto di ogni giorno
interface DayContent {
	title: string;
	image: string;
	message: string;
}

// Interfaccia per tenere traccia delle caselle aperte
interface OpenDays {
	[key: number]: boolean;
}

export function AdventCalendar() {
	const [openDay, setOpenDay] = useState<number | null>(null);
	const [shaking, setShaking] = useState<number | null>(null);
	const [openDays, setOpenDays] = useState<OpenDays>({});
	const [isTestMode, setIsTestMode] = useState(false);

	// Contenuto di esempio
	const dayContents: { [key: number]: DayContent } = {
		1: {
			title: 'First Day of December',
			image: '/placeholder.svg?height=400&width=600',
			message: 'Day 1: Welcome to your advent calendar journey!',
		},
		2: {
			title: 'Second Day of December',
			image: '/placeholder.svg?height=400&width=600',
			message: 'Day 2: The journey continues!',
		},
		// Aggiungi altri giorni per il test...
	};

	const handleDayClick = (day: number) => {
		if (!isTestMode) {
			const today = new Date();
			const currentDay = today.getDate();
			const currentMonth = today.getMonth();

			if (currentMonth !== 11 || day > currentDay) {
				setShaking(day);
				setTimeout(() => setShaking(null), 500);
				return;
			}
		}

		setOpenDays((prev) => ({ ...prev, [day]: true }));
		setOpenDay(day);
	};

	return (
		<div className="min-h-screen bg-[#1a1f2c] relative overflow-hidden">
			{/* Test Mode Toggle */}
			<div className="fixed top-4 right-4 z-20 bg-black/50 p-2 rounded-lg">
				<label className="flex items-center space-x-2 text-white">
					<input
						type="checkbox"
						checked={isTestMode}
						onChange={(e) => setIsTestMode(e.target.checked)}
						className="form-checkbox"
					/>
					<span>Test Mode {isTestMode ? 'ON' : 'OFF'}</span>
				</label>
			</div>

			<style jsx global>{`
				@keyframes shake {
					0%,
					100% {
						transform: translateX(0);
					}
					25% {
						transform: translateX(-5px);
					}
					50% {
						transform: translateX(5px);
					}
					75% {
						transform: translateX(-5px);
					}
				}
				.shake {
					animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
				}
				.day-content {
					opacity: 0;
					transition: opacity 0.3s ease-in-out;
				}
				.day-opened .day-content {
					opacity: 1;
				}
				.day-opened {
					background: #2c3e50 !important;
				}
			`}</style>

			<div className="absolute inset-0">
				<Image
					src={winterCabinBg}
					alt="Winter cabin scene"
					className="w-full h-full object-cover"
					priority
				/>
			</div>

			<div className="relative z-10 container mx-auto px-4 py-8">
				<div className="max-w-5xl mx-auto">
					<div
						className="grid grid-cols-6 gap-1"
						style={{
							gridTemplateAreas: `
              "logo logo seven thirtn twlve twlve"
              "twone twone ten svntn eight three"
              "fiftn fiftn twthr two eleven twfour"
              "five four four nine sixtn twenty"
              "one nintn six six eightn twtwo"
            `,
						}}
					>
						{/* Logo */}
						<div
							style={{ gridArea: 'logo' }}
							className="col-span-2 border border-dashed border-white/70 rounded p-4 bg-black/40"
						>
							<h1 className="text-white text-3xl font-bold">MyAdventCalendar</h1>
							<p className="text-white/70 text-xs">by mammt</p>
						</div>

						{/* Calendar Days */}
						{[
							{ number: 7, area: 'seven' },
							{ number: 13, area: 'thirtn' },
							{ number: 12, area: 'twlve', span: { gridColumn: 'span 2' } },
							{ number: 21, area: 'twone', span: { gridColumn: 'span 2' } },
							{ number: 10, area: 'ten' },
							{ number: 17, area: 'svntn' },
							{ number: 8, area: 'eight' },
							{ number: 3, area: 'three' },
							{ number: 15, area: 'fiftn', span: { gridColumn: 'span 2' } },
							{ number: 23, area: 'twthr' },
							{ number: 2, area: 'two' },
							{ number: 11, area: 'eleven' },
							{ number: 24, area: 'twfour' },
							{ number: 5, area: 'five' },
							{ number: 4, area: 'four', span: { gridColumn: 'span 2' } },
							{ number: 9, area: 'nine' },
							{ number: 16, area: 'sixtn' },
							{ number: 20, area: 'twenty' },
							{ number: 1, area: 'one' },
							{ number: 19, area: 'nintn' },
							{ number: 6, area: 'six', span: { gridColumn: 'span 2' } },
							{ number: 18, area: 'eightn' },
							{ number: 22, area: 'twtwo' },
						].map((day) => (
							<Day
								key={day.number}
								number={day.number}
								style={{ gridArea: day.area, ...day.span }}
								onClick={handleDayClick}
								isShaking={shaking === day.number}
								isLocked={
									!isTestMode && (new Date().getMonth() !== 11 || day.number > new Date().getDate())
								}
								isOpen={openDays[day.number]}
								content={dayContents[day.number]}
							/>
						))}
					</div>
				</div>

				<Dialog open={openDay !== null} onOpenChange={() => setOpenDay(null)}>
					<DialogContent className="sm:max-w-[600px]">
						<DialogTitle className="text-xl font-bold mb-4">
							{(openDay && dayContents[openDay]?.title) || `Day ${openDay}`}
						</DialogTitle>
						<div className="space-y-4">
							<img
								src={
									(openDay && dayContents[openDay]?.image) ||
									'/placeholder.svg?height=400&width=600'
								}
								alt=""
								className="w-full h-[300px] object-cover rounded-lg"
							/>
							<p className="text-center text-sm text-muted-foreground">
								{(openDay && dayContents[openDay]?.message) ||
									'With MyAdvent you can upload photos, text, voice messages and YouTube videos into your own calendar. All free and without any ads, just lots of love :)'}
							</p>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

interface DayProps {
	number: number;
	style: React.CSSProperties;
	onClick: (day: number) => void;
	isShaking: boolean;
	isLocked: boolean;
	isOpen: boolean;
	content?: DayContent;
}

function Day({ number, style, onClick, isShaking, isLocked, isOpen, content }: DayProps) {
	return (
		<button
			className={`
        relative
        ${isOpen ? 'day-opened' : 'bg-[#c4302b] hover:bg-[#d4403b]'}
        transition-all duration-200 
        rounded-sm p-4 
        flex items-center justify-center 
        text-white text-2xl font-bold 
        transform hover:scale-105 hover:z-10
        ${isShaking ? 'shake' : ''}
        ${isLocked ? 'cursor-not-allowed opacity-80' : ''}
        overflow-hidden
      `}
			style={style}
			onClick={() => onClick(number)}
		>
			{isOpen ? (
				<div className="day-content absolute inset-0 flex items-center justify-center bg-opacity-90 p-2">
					<p className="text-sm text-center">{content?.message || `Content for day ${number}`}</p>
				</div>
			) : (
				<>
					{number}
					{isLocked && (
						<div className="absolute top-2 right-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="opacity-80"
							>
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
								<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
							</svg>
						</div>
					)}
				</>
			)}
		</button>
	);
}
