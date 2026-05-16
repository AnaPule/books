import { useState } from "react";
import { request } from "@utils/ApiRequest";
import { Hash } from "lucide-react";
import { toast } from "sonner";

interface roomProps {
    bookId: string;
    parentId: string | null;
    creatorId: string | null;
    book_cover: string;
    book_name: string;
    book_author: string;
    onClose: any;
    onRoomCreated?: () => void;
}


export const NewRoom: React.FC<roomProps> = (roomProps) => {
    const [roomForm, setRoomForm] = useState({
        bookId: roomProps.bookId || '',
        parentId: roomProps.parentId,
        creatorId: roomProps.creatorId,
        name: '',
        deleted: false,
        type: 2
    });

    const handleFormChange = (field: string, value: string) => {
        setRoomForm(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = () => {
        if (roomForm.name) {
            request.post<any>(`/rooms`, roomForm)
                .then((res: any) => {
                    toast.info('Pages & Parchment',
                        { description: `Congragulations on the new room you've created. Wait for more users to join` }
                    );
                    roomProps.onRoomCreated?.();
                })
                .catch((error) => {
                    toast.error('Pages & Parchment', { description: 'Room already exists' })
                })
                .finally(() => {
                    roomProps.onClose()
                })
        }else{
            toast.warning('Pages n Parchment', {description: 'Please enter the room name'});
        }
    }

    return (
        <>
            {/* Content */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-black/10">
                <span className="text-4xl mb-2.5">
                    <section className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-[#c9a394] to-[#b58b7c] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        pP
                    </section>
                </span>

                <h2 className="text-[17px] font-semibold text-[#1c1c1e] mb-1.5">
                    Create a New Room
                </h2>
                <p className="text-[13px] text-[#3c3c43]/75 leading-snug">
                    Add a new channel for readers to gather and discuss.
                </p>
            </div>

            {/* Form Fields */}
            <div className="py-4 space-y-4">
                {/* Book Info */}
                <div className="flex items-center gap-3">
                    <img
                        src={roomProps.book_cover}
                        style={{
                            height: '7rem',
                            width: '5rem',
                            backgroundSize: 'cover',
                            backgroundImage: `URL(${roomProps.book_cover ?? 'https://i.pinimg.com/736x/dd/a1/fe/dda1fe74288e92ee643261f1f94e8a29.jpg'})`
                        }}
                    />
                    <div className="flex-1">
                        <p className="text-[15px] font-medium text-[#1c1c1e]">{roomProps.book_name}</p>
                        <p className="text-[13px] text-[#3c3c43]/60">by {roomProps.book_author}</p>
                    </div>
                </div>

                {/* Room Name Input */}
                <div className="relative">
                    <Hash size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8e8e93]" />
                    <input
                        type="text"
                        value={roomForm.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="Room name"
                        className="w-full pl-6 py-2 text-[17px] text-[#1c1c1e] placeholder:text-[#8e8e93] bg-transparent border-b border-black/10 focus:border-[#007aff] outline-none transition-colors"
                        autoFocus
                    />
                </div>

                {/* Room Type Hint */}
                <p className="text-[13px] text-[#3c3c43]/60 pl-6">
                    Text channel · for readers to discuss and share
                </p>
            </div>

            {/* Actions */}
            <div className="flex -mx-4 -mb-4 mt-0 border-t border-black/10">
                <button
                    type="button"
                    onClick={() => roomProps.onClose('none')}
                    className="flex-1 py-3.5 text-[17px] font-normal text-[#007aff] border-r border-black/10 hover:bg-black/5 active:bg-black/10 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={() => handleSubmit()}
                    className="flex-1 py-3.5 text-[17px] font-semibold text-[#007aff] hover:bg-black/5 active:bg-black/10 transition-colors"
                >
                    Create
                </button>
            </div>
        </>
    );
};