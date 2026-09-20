import { ChampionRecord, JuniorSeriesRace } from '../types';

export const F3_CHAMPIONS: ChampionRecord[] = [
  { year: 2011, category: 'F3', driver: 'Valtteri Bottas', team: 'Lotus ART', runnerUp: 'James Calado', wins: 4, contextFact: 'Il finlandese vinse il titolo GP3 battendo Calado e Nigel Melker, guadagnandosi il test drive in Williams.' },
  { year: 2013, category: 'F3', driver: 'Daniil Kvyat', team: 'MW Arden', runnerUp: 'Facu Regalia', wins: 3, contextFact: 'Kvyat ribaltò la classifica nella seconda metà dell\'anno e Helmut Marko lo promosse direttamente in F1 alla Toro Rosso.' },
  { year: 2014, category: 'F3', driver: 'Alex Lynn', team: 'Carlin', runnerUp: 'Dean Stoneman', wins: 3, contextFact: 'Lynn dominò la classifica fin dalla prima gara a Barcellona nel programma Red Bull Junior.' },
  { year: 2015, category: 'F3', driver: 'Esteban Ocon', team: 'ART Grand Prix', runnerUp: 'Luca Ghiotto', wins: 1, contextFact: 'Ocon conquistò il titolo collezionando ben 14 podi complessivi con una costanza implacabile contro Ghiotto.' },
  { year: 2016, category: 'F3', driver: 'Charles Leclerc', team: 'ART Grand Prix', runnerUp: 'Alexander Albon', wins: 3, contextFact: 'Leclerc vinse il campionato GP3 al debutto, battendo il compagno di squadra Albon per 25 punti.' },
  { year: 2017, category: 'F3', driver: 'George Russell', team: 'ART Grand Prix', runnerUp: 'Jack Aitken', wins: 4, contextFact: 'Russell si aggiudicò il titolo GP3 a Jerez con un round d\'anticipo sotto l\'egida Mercedes.' },
  { year: 2018, category: 'F3', driver: 'Anthoine Hubert', team: 'ART Grand Prix', runnerUp: 'Nikita Mazepin', wins: 2, contextFact: 'Il compianto e amatissimo pilota francese trionfò all\'ultimo round di Abu Dhabi.' },
  { year: 2019, category: 'F3', driver: 'Robert Shwartzman', team: 'Prema Racing', runnerUp: 'Marcus Armstrong', wins: 3, contextFact: 'Primo campione della neonata FIA Formula 3 unificata, guidando la tripletta Prema in classifica.' },
  { year: 2020, category: 'F3', driver: 'Oscar Piastri', team: 'Prema Racing', runnerUp: 'Théo Pourchaire', wins: 2, contextFact: 'Finale thriller al Mugello: Piastri vinse il mondiale per soli 3 punti su Pourchaire e 4 su Logan Sargeant.' },
  { year: 2021, category: 'F3', driver: 'Dennis Hauger', team: 'Prema Racing', runnerUp: 'Jack Doohan', wins: 4, contextFact: 'Il pilota norvegese della Red Bull Junior dominò la stagione con 4 vittorie e 9 podi.' },
  { year: 2022, category: 'F3', driver: 'Victor Martins', team: 'ART Grand Prix', runnerUp: 'Zane Maloney', wins: 2, contextFact: 'Finale caotico a Monza interrotto dalla bandiera rossa; Martins fu incoronato campione per soli 5 punti.' },
  { year: 2023, category: 'F3', driver: 'Gabriel Bortoleto', team: 'Trident', runnerUp: 'Zak O\'Sullivan', wins: 2, contextFact: 'Bortoleto vinse il titolo matematicamente già durante le qualifiche di Monza grazie al distacco accumulato.' },
  { year: 2024, category: 'F3', driver: 'Leonardo Fornaroli', team: 'Trident', runnerUp: 'Gabriele Minì', wins: 0, contextFact: 'Incredibile: il pilota italiano Fornaroli vinse il campionato mondiale F3 senza vincere nemmeno una gara, superando all\'ultima curva dell\'ultimo giro a Monza!' },
  { year: 2025, category: 'F3', driver: 'Rafael Câmara', team: 'Trident', runnerUp: 'Nikola Tsolov', wins: 4, contextFact: 'Il brasiliano Rafael Câmara della Ferrari Driver Academy ha dominato la stagione F3 2025 con la Trident laureandosi campione con un round d\'anticipo.' }
];

export const MACAU_GP_RACES: JuniorSeriesRace[] = [
  {
    year: 1990,
    category: 'F3',
    event: 'Gran Premio di Macao F3',
    circuit: 'Guia Circuit (Macao)',
    raceType: 'Macau GP',
    winner: 'Michael Schumacher',
    team: 'WTS Racing',
    podium: ['Michael Schumacher', 'Mika Häkkinen', 'Eddie Irvine'],
    contextFact: 'Il famoso duello tra Schumacher e Häkkinen: Mika tentò il sorpasso all\'ultimo giro toccando il retro della monoposto di Michael, che continuò senza alettone posteriore vincendo la gara!'
  },
  {
    year: 1991,
    category: 'F3',
    event: 'Gran Premio di Macao F3',
    circuit: 'Guia Circuit (Macao)',
    raceType: 'Macau GP',
    winner: 'David Coulthard',
    team: 'Paul Stewart Racing',
    podium: ['David Coulthard', 'Jordi Gené', 'Christian Fittipaldi'],
    contextFact: 'Coulthard dominò entrambe le manche del temibile circuito cittadino di Guia.'
  },
  {
    year: 2001,
    category: 'F3',
    event: 'Gran Premio di Macao F3',
    circuit: 'Guia Circuit (Macao)',
    raceType: 'Macau GP',
    winner: 'Takuma Sato',
    team: 'Carlin Motorsport',
    podium: ['Takuma Sato', 'Benoît Tréluyer', 'Björn Wirdheim'],
    contextFact: 'Sato dominò l\'evento aprendosi le porte per il passaggio immediato in Formula 1 con la Jordan.'
  },
  {
    year: 2017,
    category: 'F3',
    event: 'Gran Premio di Macao F3',
    circuit: 'Guia Circuit (Macao)',
    raceType: 'Macau GP',
    winner: 'Dan Ticktum',
    team: 'Motopark',
    podium: ['Dan Ticktum', 'Lando Norris', 'Ralf Aron'],
    contextFact: 'Finale surreale: Ferdinand Habsburg e Sérgio Sette Câmara si schiantarono entrambi all\'ultima curva mentre lottavano per la vittoria, regalando il successo a Ticktum!'
  },
  {
    year: 2023,
    category: 'F3',
    event: 'Gran Premio di Macao F3',
    circuit: 'Guia Circuit (Macao)',
    raceType: 'Macau GP',
    winner: 'Luke Browning',
    team: 'Hitech Pulse-Eight',
    podium: ['Luke Browning', 'Dennis Hauger', 'Gabriele Minì'],
    contextFact: 'Browning della Williams Driver Academy dominò sia la gara di qualifica che il Gran Premio principale.'
  }
];

export const F3_DRIVERS_ROSTER: Record<string, string[]> = {
  'historical': ['Valtteri Bottas', 'Daniil Kvyat', 'Alex Lynn', 'Esteban Ocon', 'Luca Ghiotto', 'Charles Leclerc', 'Alexander Albon', 'Antonio Fuoco', 'George Russell', 'Jack Aitken', 'Anthoine Hubert', 'Nikita Mazepin', 'Callum Ilott'],
  'modern': ['Robert Shwartzman', 'Marcus Armstrong', 'Jehan Daruvala', 'Yuki Tsunoda', 'Oscar Piastri', 'Théo Pourchaire', 'Logan Sargeant', 'Frederik Vesti', 'Dennis Hauger', 'Jack Doohan', 'Arthur Leclerc', 'Victor Martins', 'Zane Maloney', 'Oliver Bearman', 'Gabriel Bortoleto', 'Zak O\'Sullivan', 'Paul Aron', 'Leonardo Fornaroli', 'Gabriele Minì', 'Luke Browning', 'Arvid Lindblad', 'Dino Beganovic', 'Rafael Câmara', 'Nikola Tsolov']
};
