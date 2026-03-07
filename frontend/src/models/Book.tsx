export interface Book{
    id: string | "";
    name: string;
    coverArt: string;
    isbn: string;
    author: Author;
    synopsis: string;
    publisher: string;
}

export interface Author{
    id: string; 
    name: string;
}