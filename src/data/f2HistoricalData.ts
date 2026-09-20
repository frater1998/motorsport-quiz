import { ChampionRecord, JuniorSeriesRace } from '../types';

export const F2_CHAMPIONS: ChampionRecord[] = [
  { year: 2005, category: 'F2', driver: 'Nico Rosberg', team: 'ART Grand Prix', runnerUp: 'Heikki Kovalainen', wins: 5, contextFact: 'Primo campione della neonata GP2 Series, battendo Heikki Kovalainen prima di passare in Williams F1.' },
  { year: 2006, category: 'F2', driver: 'Lewis Hamilton', team: 'ART Grand Prix', runnerUp: 'Nelson Piquet Jr.', wins: 5, contextFact: 'Hamilton dominò il campionato con gare epiche come la rimonta sotto la pioggia di Silverstone e la vittoria in Turchia.' },
  { year: 2007, category: 'F2', driver: 'Timo Glock', team: 'iSport International', runnerUp: 'Lucas di Grassi', wins: 5, contextFact: 'Glock si rilanciò vincendo il titolo GP2 per poi approdare in Toyota in F1.' },
  { year: 2008, category: 'F2', driver: 'Giorgio Pantano', team: 'Racing Engineering', runnerUp: 'Bruno Senna', wins: 4, contextFact: 'Il veterano italiano trionfò battendo il nipote di Ayrton Senna al termine di una stagione serratissima.' },
  { year: 2009, category: 'F2', driver: 'Nico Hülkenberg', team: 'ART Grand Prix', runnerUp: 'Vitaly Petrov', wins: 5, contextFact: 'Hülkenberg vinse da rookie dominando la seconda parte di campionato.' },
  { year: 2010, category: 'F2', driver: 'Pastor Maldonado', team: 'Rapax', runnerUp: 'Sergio Pérez', wins: 6, contextFact: 'Maldonado vinse ben 6 Feature Race consecutive a metà stagione, battendo Sergio Pérez.' },
  { year: 2011, category: 'F2', driver: 'Romain Grosjean', team: 'DAMS', runnerUp: 'Luca Filippi', wins: 5, contextFact: 'Grosjean dominò la stagione riconquistando un sedile da titolare in Lotus F1.' },
  { year: 2012, category: 'F2', driver: 'Davide Valsecchi', team: 'DAMS', runnerUp: 'Luiz Razia', wins: 4, contextFact: 'Trionfo per il pilota italiano con una spettacolare tripletta iniziale in Bahrain.' },
  { year: 2013, category: 'F2', driver: 'Fabio Leimer', team: 'Racing Engineering', runnerUp: 'Sam Bird', wins: 3, contextFact: 'Il pilota svizzero conquistò il titolo battendo la forte concorrenza di Sam Bird e James Calado.' },
  { year: 2014, category: 'F2', driver: 'Jolyon Palmer', team: 'DAMS', runnerUp: 'Stoffel Vandoorne', wins: 4, contextFact: 'Palmer stabilì il record di punti stagionali all\'epoca con 276 punti.' },
  { year: 2015, category: 'F2', driver: 'Stoffel Vandoorne', team: 'ART Grand Prix', runnerUp: 'Alexander Rossi', wins: 7, contextFact: 'Vandoorne stracciò la concorrenza con 7 vittorie e 16 podi, conquistando il titolo a Sochi.' },
  { year: 2016, category: 'F2', driver: 'Pierre Gasly', team: 'Prema Racing', runnerUp: 'Antonio Giovinazzi', wins: 4, contextFact: 'Epico duello interno in Prema: Gasly superò Giovinazzi nell\'ultimo weekend di Abu Dhabi per soli 8 punti.' },
  { year: 2017, category: 'F2', driver: 'Charles Leclerc', team: 'Prema Racing', runnerUp: 'Artem Markelov', wins: 7, contextFact: 'Stagione leggendaria da rookie: 8 pole position su 11 round e la trionfale rimonta da fondo griglia a Baku dopo la tragica perdita del padre.' },
  { year: 2018, category: 'F2', driver: 'George Russell', team: 'ART Grand Prix', runnerUp: 'Lando Norris', wins: 7, contextFact: 'Russell conquistò il titolo al debutto in F2 battendo futuri talenti di F1 come Norris e Alexander Albon.' },
  { year: 2019, category: 'F2', driver: 'Nyck de Vries', team: 'ART Grand Prix', runnerUp: 'Nicholas Latifi', wins: 4, contextFact: 'L\'olandese vinse il mondiale a Sochi con un round d\'anticipo.' },
  { year: 2020, category: 'F2', driver: 'Mick Schumacher', team: 'Prema Racing', runnerUp: 'Callum Ilott', wins: 2, contextFact: 'Mick Schumacher conquistò il titolo mondiale F2 16 anni dopo l\'ultimo titolo del padre Michael.' },
  { year: 2021, category: 'F2', driver: 'Oscar Piastri', team: 'Prema Racing', runnerUp: 'Robert Shwartzman', wins: 6, contextFact: 'Capolavoro da rookie: Piastri vinse F3 e F2 in anni consecutivi con 5 pole consecutive e 6 vittorie.' },
  { year: 2022, category: 'F2', driver: 'Felipe Drugovich', team: 'MP Motorsport', runnerUp: 'Théo Pourchaire', wins: 5, contextFact: 'Drugovich dominò il campionato regalando alla MP Motorsport il suo primo titolo piloti e team.' },
  { year: 2023, category: 'F2', driver: 'Théo Pourchaire', team: 'ART Grand Prix', runnerUp: 'Frederik Vesti', wins: 1, contextFact: 'Il giovane francese della Sauber Academy trionfò grazie a una costanza impeccabile di piazzamenti a punti.' },
  { year: 2024, category: 'F2', driver: 'Gabriel Bortoleto', team: 'Invicta Racing', runnerUp: 'Isack Hadjar', wins: 2, contextFact: 'Bortoleto ha compiuto il "back-to-back" vincendo la Formula 3 2023 e la Formula 2 2024 da debuttante, guadagnando il sedile in F1.' },
  { year: 2025, category: 'F2', driver: 'Leonardo Fornaroli', team: 'Invicta Racing', runnerUp: 'Jak Crawford', wins: 4, contextFact: 'Fornaroli ha conquistato il titolo mondiale F2 2025 con Invicta Racing da rookie, compiendo uno storico bis consecutivo dopo il titolo F3 2024.' }
];

export const ICONIC_F2_RACES: JuniorSeriesRace[] = [
  {
    year: 2017,
    category: 'F2',
    event: 'Gran Premio di Monaco F2',
    circuit: 'Monaco (Monte Carlo)',
    raceType: 'Feature Race',
    winner: 'Charles Leclerc',
    team: 'Prema Racing',
    podium: ['Charles Leclerc', 'Norman Nato', 'Oliver Rowland'],
    contextFact: 'Dominio imperioso del monegasco sulle strade di casa prima di un problema alla sospensione nella Sprint.'
  },
  {
    year: 2018,
    category: 'F2',
    event: 'Gran Premio di Gran Bretagna F2',
    circuit: 'Silverstone',
    raceType: 'Feature Race',
    winner: 'Alexander Albon',
    team: 'DAMS',
    podium: ['Alexander Albon', 'George Russell', 'Antonio Fuoco'],
    contextFact: 'Albon superò Russell all\'esterno di Stowe in una delle battaglie più belle della stagione 2018.'
  },
  {
    year: 2021,
    category: 'F2',
    event: 'Gran Premio d\'Italia F2',
    circuit: 'Monza',
    raceType: 'Feature Race',
    winner: 'Oscar Piastri',
    team: 'Prema Racing',
    podium: ['Oscar Piastri', 'Guanyu Zhou', 'Dan Ticktum'],
    contextFact: 'Piastri allungò in classifica con una vittoria magistrale a Monza gestendo tre ripartenze da safety car.'
  },
  {
    year: 2023,
    category: 'F2',
    event: 'Gran Premio d\'Austria F2',
    circuit: 'Red Bull Ring (Spielberg)',
    raceType: 'Sprint Race',
    winner: 'Jak Crawford',
    team: 'Hitech Grand Prix',
    podium: ['Jak Crawford', 'Victor Martins', 'Clément Novalak'],
    contextFact: 'Gara su pista bagnata con condizioni mutevoli e la coraggiosa scommessa sulle gomme slick di Crawford.'
  },
  {
    year: 2024,
    category: 'F2',
    event: 'Gran Premio d\'Italia F2',
    circuit: 'Monza',
    raceType: 'Feature Race',
    winner: 'Gabriel Bortoleto',
    team: 'Invicta Racing',
    podium: ['Gabriel Bortoleto', 'Zane Maloney', 'Richard Verschoor'],
    contextFact: 'Clamorosa impresa: Bortoleto vinse partendo dall\'ultimo posto (22°) in griglia con una rimonta storica.'
  },
  {
    year: 2024,
    category: 'F2',
    event: 'Gran Premio di Gran Bretagna F2',
    circuit: 'Silverstone',
    raceType: 'Sprint Race',
    winner: 'Andrea Kimi Antonelli',
    team: 'Prema Racing',
    podium: ['Andrea Kimi Antonelli', 'Zane Maloney', 'Gabriel Bortoleto'],
    contextFact: 'Il baby prodigio italiano Antonelli vinse la sua prima gara in F2 con 8 secondi di vantaggio sotto il diluvio di Silverstone.'
  }
];

export const F2_DRIVERS_ROSTER: Record<string, string[]> = {
  '2005-2010': ['Nico Rosberg', 'Heikki Kovalainen', 'Lewis Hamilton', 'Nelson Piquet Jr.', 'Timo Glock', 'Lucas di Grassi', 'Giorgio Pantano', 'Bruno Senna', 'Nico Hülkenberg', 'Vitaly Petrov', 'Pastor Maldonado', 'Sergio Pérez', 'Romain Grosjean', 'Giedo van der Garde'],
  '2011-2016': ['Romain Grosjean', 'Luca Filippi', 'Davide Valsecchi', 'Luiz Razia', 'Fabio Leimer', 'Sam Bird', 'James Calado', 'Jolyon Palmer', 'Stoffel Vandoorne', 'Felipe Nasr', 'Alexander Rossi', 'Rio Haryanto', 'Pierre Gasly', 'Antonio Giovinazzi', 'Sergey Sirotkin', 'Raffaele Marciello'],
  '2017-2020': ['Charles Leclerc', 'Artem Markelov', 'Oliver Rowland', 'Antonio Fuoco', 'George Russell', 'Lando Norris', 'Alexander Albon', 'Nyck de Vries', 'Nicholas Latifi', 'Luca Ghiotto', 'Mick Schumacher', 'Callum Ilott', 'Yuki Tsunoda', 'Robert Shwartzman', 'Christian Lundgaard', 'Guanyu Zhou'],
  '2021-2026': ['Oscar Piastri', 'Guanyu Zhou', 'Felipe Drugovich', 'Théo Pourchaire', 'Liam Lawson', 'Logan Sargeant', 'Frederik Vesti', 'Jack Doohan', 'Ayumu Iwasa', 'Victor Martins', 'Oliver Bearman', 'Gabriel Bortoleto', 'Isack Hadjar', 'Zane Maloney', 'Andrea Kimi Antonelli', 'Paul Aron', 'Franco Colapinto', 'Leonardo Fornaroli']
};
