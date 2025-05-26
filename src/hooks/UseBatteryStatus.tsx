import  { useEffect, useState } from 'react'

interface batteryStatus{
    level:number;
    charging:boolean;
    chargingTime:number;
    dischargingTime:number;
}
interface battery{
    level:number;
    charging:boolean;
    chargingTime:number;
    dischargingTime:number;
    addEventListener:(type:string,listener:()=>void)=>void;
    removeEventListener:(type:string,listener:()=>void)=>void;
}

declare global{
    interface Navigator{
        getBattery:()=>Promise<battery>;
    }
}

const UseBatteryStatus = () => {
    const[batteryStatus,setBatteryStatus]=useState<batteryStatus | null>(null);
    const[error,setError]=useState<string | null>(null);
    useEffect(()=>{
        const getBatteryStatus=async()=>{
            try{
                if(!navigator.getBattery){
                    throw new Error("Battery API is not supported in this browser");
                }
                const battery:battery=await navigator.getBattery();
                const handlebatteryChange=()=>{
                    setBatteryStatus({
                        level:battery.level*100,
                        charging:battery.charging,
                        chargingTime:battery.chargingTime,
                        dischargingTime:battery.dischargingTime,
                    });
                };
                setBatteryStatus({
                    level:battery.level*100,
                    charging:battery.charging,
                    chargingTime:battery.chargingTime,
                    dischargingTime:battery.dischargingTime,
                });
                battery.addEventListener("levelchange",handlebatteryChange);
                battery.addEventListener("chargingchange",handlebatteryChange);
                battery.addEventListener("chargingtimechange",handlebatteryChange);
                battery.addEventListener("dischargingtimechange",handlebatteryChange);

                return ()=>{
                    battery.removeEventListener("levelchange", handlebatteryChange);
                    battery.removeEventListener("chargingchange", handlebatteryChange);
                    battery.removeEventListener("chargichargingtimechangengchange", handlebatteryChange);
                    battery.removeEventListener("dischargingtimechange", handlebatteryChange);

                }
            }catch(error){
                if(error instanceof Error){
                    setError(error.message);
                }
                else{
                    setError("An unknown error occurred");
                }
            }
        }
        getBatteryStatus();
    },[])
  return {batteryStatus,error}
}

export default UseBatteryStatus;