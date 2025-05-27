import { useEffect, useState } from 'react';
import UseBatteryStatus from '../hooks/UseBatteryStatus'

const PowerIcon = ({ isDark }: { isDark: boolean }) => (
    <svg
        width="50"
        height="50"
        fill={isDark ? "#ffffff" : "#222222"}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        stroke={isDark ? "#ffffff" : "#222222"}
    >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M12,10h7L8,22l3-9H5L13,2Z"></path>
        </g>
    </svg>
);
const BatteryStatus = () => {
    const { batteryStatus, error } = UseBatteryStatus();
    const [batteryColor, setBatteryColor] = useState<string>("bg-green-500");
    const [chargingTime, setChargingTime] = useState<string>("");
    const [disChargingTime, setDisChargingTime] = useState<string>("");
    const [isDark, setIsDark] = useState<boolean>(false);

    // Detect theme
    useEffect(() => {
        const match = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(match.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        match.addEventListener('change', handler);
        return () => match.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if (batteryStatus) {
            getBatteryStatusColor(batteryStatus.level, batteryStatus.charging);

            // Charging Time
            const chargingTimeSeconds = batteryStatus.chargingTime;
            if (chargingTimeSeconds === Infinity) {
                if (!batteryStatus.charging) {
                    setChargingTime('Not Charging');
                }
                else setChargingTime('Unknown');
            } else {
                const chargingHours = Math.floor(chargingTimeSeconds / 3600);
                const chargingMinutes = Math.floor((chargingTimeSeconds % 3600) / 60);
                const chargingSeconds = chargingTimeSeconds % 60;
                const chargingResult = [];
                if (chargingHours > 0) {
                    chargingResult.push(`${chargingHours} hours`);
                }
                if (chargingMinutes > 0) {
                    chargingResult.push(`${chargingMinutes} minutes`);
                }
                if (chargingSeconds > 0) {
                    chargingResult.push(`${chargingSeconds} seconds`);
                }

                setChargingTime(chargingResult.join(', '));
            }

            // Discharging Time
            const dischargingTimeSeconds = batteryStatus.dischargingTime;
            if (dischargingTimeSeconds === Infinity) {
                if (batteryStatus.charging) {
                    setDisChargingTime('Charging');
                }
                else setDisChargingTime('Unknown');
            } else {
                const dischargingHours = Math.floor(dischargingTimeSeconds / 3600);
                const dischargingMinutes = Math.floor((dischargingTimeSeconds % 3600) / 60);
                const dischargingSeconds = dischargingTimeSeconds % 60;
                const dischargingResult = [];
                if (dischargingHours > 0) {
                    dischargingResult.push(`${dischargingHours} hours`);
                }
                if (dischargingMinutes > 0) {
                    dischargingResult.push(`${dischargingMinutes} minutes`);
                }
                if (dischargingSeconds > 0) {
                    dischargingResult.push(`${dischargingSeconds} seconds`);
                }

                setDisChargingTime(dischargingResult.join(', '));

            }
        }
    }, [batteryStatus]);

    if (error) {
        return <div>{error}</div>
    }
    if (!batteryStatus) {
        return <div>Loading...</div>
    }
    const getBatteryStatusColor = (level: number, isCharging: boolean = false): void => {
        if (isCharging) setBatteryColor("bg-blue-500");
        else if (level > 20) setBatteryColor("bg-green-500");
        else setBatteryColor("bg-red-500");
    }

    // Theme-based styles
    const batteryContainerClass = isDark
        ? 'border-white bg-black'
        : 'border-gray-800 bg-white';

    const batteryInnerBorder = isDark
        ? 'border-black'
        : 'border-white';

    const batteryTextClass = isDark
        ? 'text-white'
        : 'text-gray-900';

    const batteryCapClass = isDark
        ? 'bg-white'
        : 'bg-gray-800';

    return (
        <div>
            <div className='flex items-center justify-start gap-2 '>
                <div className={`w-80 h-40 rounded-3xl border-8 relative overflow-hidden ${batteryContainerClass}`}>
                    <div
                        className={`${batteryColor} rounded-2xl absolute top-0 left-0 h-full transition-all duration-300 ease-in-out ${batteryInnerBorder} border-8`}
                        style={{
                            width: `${batteryStatus.level}%`,
                        }}
                    />
                    <div className={`absolute inset-0 flex items-center justify-center font-semibold ${batteryTextClass}`}>
                        {batteryStatus.charging && <PowerIcon isDark={isDark} />}
                        <span className='text-6xl'>{Math.floor(batteryStatus.level)}</span>
                    </div>
                </div>
                <div className={`w-5 h-20 rounded-e-md ${batteryCapClass}`}></div>
            </div >
            <div className='mt-4 font-semibold'>
                <p>Battery Level: {Math.floor(batteryStatus.level)}</p>
                <p>Charging: {batteryStatus.charging ? "Yes" : "No"}</p>
                <p>Charging Time: {chargingTime}</p>
                <p>Discharging Time: {disChargingTime}</p>
            </div>
        </div>
    )
}

export default BatteryStatus;