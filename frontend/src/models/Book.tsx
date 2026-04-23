export interface Book{
    id: string | "";
    name: string;
    coverArt: string;
    isbn: string;
    author: Author;
    synopsis: string;
    publisher: string;
    pageCount: number;
    publicationDate: Date | "";
    language: String | "en";
    genre?: Genre;
}

export interface Author{
    id: string; 
    name: string;
}

export interface Genre{
    id: string; 
    name: string;
}

/* --------------------- ROOM -----------------*/
export interface Room{
    id: string;
    name: string;
    bookId: string;
    deleted: Boolean;
    parentId: String;
    members?: number;
    comments?: Comment[];
    quietRoom?: Comment[];
    type: Number;
}

export interface Comment{
    id: string;
    likes: number;
    dislikes: number;
    reports: Report[];
    deleted: Boolean;
    content: string;
    createdAt: Date;
    user:{
        name: string;
        profile: string;
        user_id: string;
    }
    commentInteractions: CommentInteraction[];
    replies?: Comment[];
    isLikedByUser?: Boolean;
    isDislikedByUser?: Boolean;
}

export interface Report{
    id: string;
    comment_id: string;
    reason: string;
}

export interface CommentInteraction{
    id: string;
    comment_id: string;
    user_id: string;
    type: Number;
}

export const RelationshipType = {
    LIBRARY: 1,
    WISHLIST: 2,
    READING: 3,
    COMPLETED: 4,
    DISLIKE: 5,
    RECOMMEND: 6,
    FAVORITE: 7,
    INTERACTION: 8
} as const;

export type RelationshipType = typeof RelationshipType[keyof typeof RelationshipType];