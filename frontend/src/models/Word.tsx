export interface Word{
    word: string;
    phonetic: string;
    meanings: {
        partsOfSpeech: string
        definition: []
    };
    origin: string;
}