export interface Song {
    title: string;
    artist: string;
    file: string;
    cover?: string;
}

import InTheSea from "@assets/music/movie/in the sea.mp3";
import Cinderella from "@assets/music/movie/La Valse de L'Amour.mp3";
import LoversOath from "@assets/music/movie/Lovers' Oath.mp3";
import Liz from "@assets/music/movie/Marianelli_ Liz On Top Of The World (From Pride & Prejudice Soundtrack).mp3";
import Married from "@assets/music/movie/Married Life (From Up).mp3";
import december from "@assets/music/movie/Once Upon a December - Anastasia Original Broadway Cast Recording.mp3";
import oogway from "@assets/music/movie/Oogway Ascends.mp3";
import naruto from "@assets/music/movie/Naruto Shippuden - Samidare - Erhu Cover.mp3";
import peace from "@assets/music/movie/Peace (full).mp3";
import pluto from "@assets/music/movie/Pluto Projector.mp3";
import imagination from "@assets/music/movie/Pure Imagination (Orchestra Version).mp3";
import dragon from "@assets/music/movie/Romantic Flight (How To Train Your Dragon)  CINEMATIC VERSION.mp3";

import Gymnopedie from "@assets/music/classical/Gymnopédie No. 1.mp3";
import No8 from "@assets/music/classical/Nocturne P 2 No. 8 in C minor.mp3";
import arabesque from "@assets/music/classical/Arabesque.mp3";
import No20 from "@assets/music/classical/Chopin_ Nocturne No. 20 in C-Sharp Minor, Op. Posth. (Rousseau Felt Piano Version).mp3";
import consolations from "@assets/music/classical/Consolations, S. 172_ No. 3, Lento placido.mp3";
import bergamasquw from "@assets/music/classical/Debussy_ Suite bergamasque, CD 82_ III. Clair de lune.mp3";
import cello from "@assets/music/classical/Elgar_ Cello Concerto in E minor, Op. 85_ I. Adagio Moderato  Gautier Capuçon, LSO, Pappano.mp3";
import raindrop from "@assets/music/classical/Raindrop Prelude (Op. 28 No 15) (Soft Piano).mp3";
import reverie from "@assets/music/classical/Reverie.mp3";
import vampire from "@assets/music/classical/The Vampire Masquerade.mp3";
import waltz from "@assets/music/classical/Waltz No.2.mp3";

export const PLAYLIST: Song[] = [
    // Movies & Shows
    { title: 'In the sea', artist: 'Kensuke Ushio', file: InTheSea },
    { title: `La Valse de L'Amour`, artist: 'Patrick Doyle', file: Cinderella },
    { title: `Lover's Oath`, artist: 'Shenghai symphony', file: LoversOath },
    { title: `Liz on top of the world (From Pride & Prejudice)`, artist: 'Dario Marianelli', file: Liz },
    { title: 'Married Life (From Up)', artist: 'Michael Giacchino', file: Married },
    { title: 'Once Upon a December (Anastasia)', artist: 'Liz Callaway, Stephen Flaherty', file: december },
    { title: 'Samidare', artist: 'Erhu cover', file: naruto },
    { title: 'Oogway Ascends', artist: 'Hans Zimmer, John Powell', file: oogway },
    { title: 'Peace (the last airbender)', artist: 'Jeremy Zuckerman, Benjamin Wynn', file: peace },
    { title: 'Pluto Projector', artist: 'Alex O\'Connor', file: pluto },
    { title: 'Pure Imagination (Willy Wonka)', artist: 'Gene Wilder', file: imagination },
    { title: 'Romantic Flight (How To Train Your Dragon)', artist: 'John Powell', file: dragon },

    // Classical
    { title: 'Arabesque', artist: 'Debussy', file: arabesque },
    { title: 'Gymnopédie No.1', artist: 'Erik Satie', file: Gymnopedie },
    { title: 'Nocturne No.2, C Minor', artist: 'Chopin', file: No8 },
    { title: 'Nocturne No.20, C-Sharp Minor', artist: 'Chopin', file: No20 },
    { title: 'Consolations, S.172 No.3', artist: 'Liszt', file: consolations },
    { title: 'Clair de lune', artist: 'Debussy', file: bergamasquw },
    { title: 'Cello Concerto in E minor', artist: 'Elgar', file: cello },
    { title: 'Raindrop Prelude', artist: 'Chopin', file: raindrop },
    { title: 'Reverie', artist: 'Debussy', file: reverie },
    { title: 'The Vampire Masquerade', artist: 'Unknown', file: vampire },
    { title: 'Waltz No.2', artist: 'Shostakovich', file: waltz },
];