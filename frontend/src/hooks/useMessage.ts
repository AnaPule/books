
import { toast } from "sonner";
import { useSoundNotification } from "./useNotification";

export const useNewMessage = () => {
    const { playMessageSendSound } = useSoundNotification();
    
    const showNewMessageToast = () => {
        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'loading message' }), 100));
        
        toast.promise(promise, {
            loading: 'Please wait...',
            success: () => {
                playMessageSendSound();
                return {
                    message: 'New Message',
                    description: 'You have a new message'
                };
            },
            error: 'Failed to send message',
        });
    };
    
    return { showNewMessageToast };
};