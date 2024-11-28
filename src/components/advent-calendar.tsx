'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import winterCabinBg from '@/assets/winter-cabin.jpg';

interface DayContent {
	title: string;
	image: string;
	message: string;
}

interface OpenDays {
	[key: number]: boolean;
}

export function AdventCalendar() {
	const [openDay, setOpenDay] = useState<number | null>(null);
	const [shaking, setShaking] = useState<number | null>(null);
	const [openDays, setOpenDays] = useState<OpenDays>({});
	const [isTestMode, setIsTestMode] = useState(false);

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
	};

	const daysConfig = [
    // Prima riga - Logo e primi numeri
    { number: 7, area: '1 / 3 / 2 / 4' },
    { number: 13, area: '1 / 4 / 2 / 5' },
    { number: 12, area: '1 / 5 / 2 / 6' },

    // Seconda riga
    { number: 21, area: '2 / 1 / 3 / 3' },    // Doppia larghezza
    { number: 10, area: '2 / 3 / 3 / 4' },
    { number: 17, area: '2 / 4 / 3 / 5' },
    { number: 8, area: '2 / 5 / 3 / 6' },
    { number: 3, area: '2 / 6 / 3 / 7' },

    // Terza riga
    { number: 15, area: '3 / 1 / 5 / 3' },    // Grande rettangolo
    { number: 23, area: '3 / 3 / 4 / 4' },
    { number: 2, area: '3 / 4 / 4 / 5' },
    { number: 11, area: '3 / 5 / 4 / 6' },
    { number: 24, area: '3 / 6 / 5 / 7' },    // Alto due righe

    // Quarta riga
    { number: 4, area: '4 / 3 / 5 / 4' },
    { number: 16, area: '4 / 5 / 5 / 6' },

    // Quinta riga
    { number: 5, area: '5 / 1 / 6 / 2' },
    { number: 14, area: '5 / 3 / 6 / 4' },
    { number: 9, area: '5 / 4 / 6 / 5' },
    { number: 18, area: '5 / 5 / 6 / 6' },
    { number: 20, area: '5 / 6 / 6 / 7' },

    // Sesta riga
    { number: 1, area: '6 / 1 / 7 / 2' },
    { number: 22, area: '6 / 6 / 7 / 7' },

    // Ultima riga
    { number: 19, area: '7 / 2 / 8 / 4' },    // Doppia larghezza
    { number: 6, area: '7 / 4 / 8 / 6' }      // Doppia larghezza
];

	const handleDayClick = (day: number) => {
		// Se la casella è già stata aperta, permettiamo sempre di riaprirla
		if (openDays[day]) {
			setOpenDay(day);
			return;
		}

		// Solo per le caselle non ancora aperte, verifichiamo la data
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

			<div className="relative z-10 w-full h-screen flex items-start justify-center pt-20">
        <div className="w-[600px]"> {/* Larghezza fissa più piccola */}
          <div className="grid gap-2" style={{
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(7, minmax(45px, auto))', // Righe più piccole
          }}>
            {/* Logo */}
            <div style={{ gridArea: '1 / 1 / 2 / 3' }} className="border border-dashed border-white/70 rounded p-2 bg-black/40">
              <h1 className="text-white text-2xl font-bold">MyAdvent</h1>
              <p className="text-white/70 text-xs">by Philip</p>
            </div>

            {daysConfig.map(day => (
              <Day 
                key={day.number}
                number={day.number}
                style={{ gridArea: day.area }}
                onClick={handleDayClick}
                isShaking={shaking === day.number}
                isLocked={!isTestMode && !openDays[day.number] && (new Date().getMonth() !== 11 || day.number > new Date().getDate())}
                isOpen={openDays[day.number]}
              />
            ))}
          </div>
        </div>
      </div>

			<Dialog open={openDay !== null} onOpenChange={() => setOpenDay(null)}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogTitle className="text-xl font-bold mb-4">
						{(openDay && dayContents[openDay]?.title) || `Day ${openDay}`}
					</DialogTitle>
					<div className="space-y-4">
						<Image
							src={
								(openDay && dayContents[openDay]?.image) || '/placeholder.svg?height=400&width=600'
							}
							alt=""
							width={600}
							height={400}
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
