export interface Song {
    title: string;
    artist: string;
    file: string;
    cover?: string;
    category: 'classical' | 'anime' | 'movies' | 'ambient' | 'rnb';
}

//normal songs
import charlene from "@assets/music/love/Charlene.mp3";
import fourlove from "@assets/music/love/DO 4 LOVE.mp3";
import lovesme from "@assets/music/love/He Loves Me (Lyzel in E Flat).mp3";
import another from "@assets/music/love/In Love With Another Man.mp3";
import john from "@assets/music/love/John Redcorn - A COLORS SHOW.mp3";
import wings from "@assets/music/love/Pretty Wings (uncut).mp3";
import lost from "@assets/music/love/Robin Thicke - Lost Without U (Official Music Video).mp3";
import untinkable from "@assets/music/love/Alicia Keys - Un-thinkable (I'm Ready) (Official Video).mp3";
import memyself from "@assets/music/love/Beyoncé - Me, Myself and I (Video Version).mp3";
import party from "@assets/music/love/Beyoncé - Party ft. J. Cole.mp3";
import ego from "@assets/music/love/ego talkin'.mp3";
import rumgold from "@assets/music/love/rumgold - Call It What You Want.mp3";
import boo from "@assets/music/love/Boo'd Up.mp3";
import everytime from "@assets/music/love/Like You'll Never See Me Again.mp3"

// Anime Imports
import rengoku from "@assets/music/anime/Rengoku's Father Theme V2  Demon Slayer S2 OST [Cover].mp3";
import akaza from "@assets/music/anime/Akaza's Love Theme (from Demon Slayer_ Infinity Castle).mp3";
import naruto from "@assets/music/movie/Naruto Shippuden - Samidare - Erhu Cover.mp3";
import peace from "@assets/music/movie/Peace (full).mp3";
import avatar from "@assets/music/movie/The Avatar's Love [Full HQ].mp3";
import funeral from "@assets/music/movie/Lu Ten's Funeral.mp3";

// Movie Imports
import Cinderella from "@assets/music/movie/La Valse de L'Amour.mp3";
import LoversOath from "@assets/music/movie/Lovers' Oath.mp3";
import Liz from "@assets/music/movie/Marianelli_ Liz On Top Of The World (From Pride & Prejudice Soundtrack).mp3";
import Married from "@assets/music/movie/Married Life (From Up).mp3";
import december from "@assets/music/movie/Once Upon a December - Anastasia Original Broadway Cast Recording.mp3";
import oogway from "@assets/music/movie/Oogway Ascends.mp3";
import pluto from "@assets/music/movie/Pluto Projector.mp3";
import imagination from "@assets/music/movie/Pure Imagination (Orchestra Version).mp3";
import dragon from "@assets/music/movie/Romantic Flight (How To Train Your Dragon)  CINEMATIC VERSION.mp3";
import roslyn from "@assets/music/movie/Bon Iver - Roslyn (remake instrumental).mp3";
import page from "@assets/music/movie/Turning Page (Instrumental).mp3";

// Classical Imports
import Gymnopedie from "@assets/music/classical/Gymnopédie No. 1.mp3";
import No8 from "@assets/music/classical/Nocturne P 2 No. 8 in C minor.mp3";
import arabesque from "@assets/music/classical/Debussy_ Deux arabesques, L. 66 - No. 1 Andante con moto.mp3";
import No20 from "@assets/music/classical/Chopin_ Nocturne No. 20 in C-Sharp Minor, Op. Posth. (Rousseau Felt Piano Version).mp3";
import consolations from "@assets/music/classical/Consolations, S. 172_ No. 3, Lento placido.mp3";
import bergamasquw from "@assets/music/classical/Debussy_ Suite bergamasque, CD 82_ III. Clair de lune.mp3";
import cello from "@assets/music/classical/Elgar_ Cello Concerto in E minor, Op. 85_ I. Adagio Moderato  Gautier Capuçon, LSO, Pappano.mp3";
import raindrop from "@assets/music/classical/Raindrop Prelude (Op. 28 No 15) (Soft Piano).mp3";
import reverie from "@assets/music/classical/Reverie.mp3";
import vampire from "@assets/music/classical/The Vampire Masquerade.mp3";
import waltz from "@assets/music/classical/Waltz No.2.mp3";

// ============================================
// CLASSICAL PLAYLIST (DEFAULT)
// ============================================
export const classicalPlaylist: Song[] = [
    { title: 'Gymnopédie No.1', artist: 'Erik Satie', file: Gymnopedie, category: 'classical' },
    { title: 'Nocturne No.2, C Minor', artist: 'Chopin', file: No8, category: 'classical' },
    { title: 'Arabesque', artist: 'Debussy', file: arabesque, category: 'classical' },
    { title: 'Nocturne No.20, C-Sharp Minor', artist: 'Chopin', file: No20, category: 'classical' },
    { title: 'Consolations, S.172 No.3', artist: 'Liszt', file: consolations, category: 'classical' },
    { title: 'Clair de lune', artist: 'Debussy', file: bergamasquw, category: 'classical' },
    { title: 'Cello Concerto in E minor', artist: 'Elgar', file: cello, category: 'classical' },
    { title: 'Raindrop Prelude', artist: 'Chopin', file: raindrop, category: 'classical' },
    { title: 'Reverie', artist: 'Debussy', file: reverie, category: 'classical' },
    { title: 'The Vampire Masquerade', artist: 'Unknown', file: vampire, category: 'classical' },
    { title: 'Waltz No.2', artist: 'Shostakovich', file: waltz, category: 'classical' },
];

// ============================================
// ANIME & FANTASY PLAYLIST
// ============================================
export const animePlaylist: Song[] = [
    { title: `Rengoku's Father Theme (Demon Slayer)`, artist: 'Go Shiina, Yuki Kajiura', file: rengoku, category: 'anime' },
    { title: `Akaza's Love (Demon Slayer)`, artist: 'Diego Mitre', file: akaza, category: 'anime' },
    { title: 'Samidare (Naruto)', artist: 'Erhu cover', file: naruto, category: 'anime' },
    { title: 'Peace (The Last Airbender)', artist: 'Jeremy Zuckerman', file: peace, category: 'anime' },
    { title: `Lu Ten's Funeral (The Last Airbender)`, artist: 'Takeshi Furukawa', file: funeral, category: 'anime' },
    { title: `The Avatar's Love (The Last Airbender)`, artist: 'Jeremy Zuckerman', file: avatar, category: 'anime' },
    { title: `Lover's Oath`, artist: 'Shenghai Symphony', file: LoversOath, category: 'anime' },
];

// ============================================
// MOVIE SOUNDTRACKS PLAYLIST
// ============================================
export const moviesPlaylist: Song[] = [
    { title: 'Oogway Ascends', artist: 'Hans Zimmer, John Powell', file: oogway, category: 'movies' },
    { title: 'Married Life (From Up)', artist: 'Michael Giacchino', file: Married, category: 'movies' },
    { title: 'Once Upon a December (Anastasia)', artist: 'Liz Callaway', file: december, category: 'movies' },
    { title: 'Romantic Flight (How To Train Your Dragon)', artist: 'John Powell', file: dragon, category: 'movies' },
    { title: `La Valse de L'Amour`, artist: 'Patrick Doyle', file: Cinderella, category: 'movies' },
    { title: `Liz on Top of the World (Pride & Prejudice)`, artist: 'Dario Marianelli', file: Liz, category: 'movies' },
    { title: 'Pluto Projector', artist: 'Alex O\'Connor', file: pluto, category: 'movies' },
    { title: 'Pure Imagination (Willy Wonka)', artist: 'Gene Wilder', file: imagination, category: 'movies' },
    { title: 'Roslyn (Instrumental)', artist: 'Bon Iver', file: roslyn, category: 'movies' },
    { title: 'Turning Page (Instrumental)', artist: 'Sleeping At Last', file: page, category: 'movies' },
];

// ============================================
// AMBIENT & CHILL PLAYLIST
// ============================================
export const ambientPlaylist: Song[] = [
    { title: 'Reverie', artist: 'Debussy', file: reverie, category: 'ambient' },
    { title: 'Peace (The Last Airbender)', artist: 'Jeremy Zuckerman', file: peace, category: 'ambient' },
    { title: 'Pluto Projector', artist: 'Alex O\'Connor', file: pluto, category: 'ambient' },
    { title: 'Gymnopédie No.1', artist: 'Erik Satie', file: Gymnopedie, category: 'ambient' },
    { title: 'Raindrop Prelude', artist: 'Chopin', file: raindrop, category: 'ambient' },
    { title: 'The Avatar\'s Love', artist: 'Jeremy Zuckerman', file: avatar, category: 'ambient' },
    { title: 'Clair de lune', artist: 'Debussy', file: bergamasquw, category: 'ambient' },
];

// ============================================
// LOVE & R&B PLAYLIST 
// ============================================
export const rnbPlaylist: Song[] = [
    { title: 'Charlene', artist: 'Anthony Hamilton', file: charlene, category: 'rnb' },
    { title: 'Do 4 Love', artist: 'Snoh Aalegra', file: fourlove, category: 'rnb' },
    { title: 'He Loves Me', artist: 'Jill Scott', file: lovesme, category: 'rnb' },
    { title: 'In Love With Another Man', artist: 'Jazmine Sullivan', file: another, category: 'rnb' },
    { title: 'John Redcorn', artist: 'SiR', file: john, category: 'rnb' },
    { title: 'Pretty Wings', artist: 'Maxwell', file: wings, category: 'rnb' },
    { title: 'Lost Without U', artist: 'Robin Thicke', file: lost, category: 'rnb' },
    { title: 'Un-thinkable', artist: 'Alicia Keys', file: untinkable, category: 'rnb' },
    { title: 'Me, Myself and I', artist: 'Beyoncé', file: memyself, category: 'rnb' },
    { title: 'Party', artist: 'Beyoncé feat. J. Cole', file: party, category: 'rnb' },
    { title: `Ego Talkin'`, artist: 'Saint Harison', file: ego, category: 'rnb' },
    { title: 'Call It What You Want', artist: 'Rumgold', file: rumgold, category: 'rnb' },
    {title: `Boo'd Up`, artist: 'Ella Mai', file: boo, category: 'rnb'},
    {title: `Like You'll never see me again`, artist: 'Alicia Keys', file: everytime, category: 'rnb'}
];

// ============================================
// MASTER PLAYLIST 
// ============================================
export const PLAYLIST: Song[] = [
    ...classicalPlaylist,
    ...animePlaylist,
    ...moviesPlaylist,
    ...ambientPlaylist,
    ...rnbPlaylist,
];

// Default playlist (Classical)
export const DEFAULT_PLAYLIST = PLAYLIST;