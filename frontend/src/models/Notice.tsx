export interface Notification {
    id: string;
    type: Number;
    title: string;
    preview: string;
    message: string;
    timestamp: Date | string | number;
    read: boolean;
    from: {
        id: string;
        username: string;
        profilePhoto?: string;
    };
    metadata?: {
        roomName?: string;
        bookTitle?: string;
        achievementName?: string;
    };
}

export const NoticeType = {
    GENERAL: 1,
    DIRECT_MESSAGE: 2,
    ROOM_ACTIVITY: 3,
    REACTION: 4,
    MENTION: 5,
    INVITE: 6,
    ACHIEVEMENT: 7,
} as const;

export type NoticeType = typeof NoticeType[keyof typeof NoticeType];