
import ToastSound from "@assets/iphone_glass.mp3";
import MessageSound from "@assets/miraculous.mp3";
import { useCallback, useRef, useEffect } from "react";

export const useSoundNotification = () =>{

    const sendAudioRef = useRef<HTMLAudioElement | null>(null);
    const toastAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        //initialise audio element
        toastAudioRef.current = new Audio(ToastSound);
        sendAudioRef.current = new Audio(MessageSound);

        //preload sounds
        sendAudioRef.current.load();
        toastAudioRef.current.load();

        return () => {
            if (sendAudioRef.current) sendAudioRef.current = null;
            if (toastAudioRef.current) toastAudioRef.current = null;
        }
    },[]);

    const playMessageSendSound = useCallback(() => {
        if (sendAudioRef.current){
            sendAudioRef.current.currentTime = 0; // reset to start
            sendAudioRef.current.play().catch(
                err => {
                    console.log("Message Receive Audio play failed: ", err)
                }
            )
        }
    },[]);

    const playToastSound = useCallback(() => {
        if (toastAudioRef.current){
            toastAudioRef.current.currentTime = 0
            toastAudioRef.current.play().catch(
                err => {
                    console.log("Toast message audio play failed", err)
                }
            )
        }
    },[]);

    return {playMessageSendSound, playToastSound};
}