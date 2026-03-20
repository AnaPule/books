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
}

export interface Author{
    id: string; 
    name: string;
}

export const RelationshipType = {
    LIBRARY: 1,
    WISHLIST: 2,
    READING: 3,
    COMPLETED: 4,
    DISLIKE: 5,
    RECOMMEND: 6,
    FAVORITE: 7
} as const;

export type RelationshipType = typeof RelationshipType[keyof typeof RelationshipType];