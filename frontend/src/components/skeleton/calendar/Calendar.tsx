import { useState } from 'react';
import { Feather, ChevronLeft, ChevronRight, Cross } from 'lucide-react';
import Tooltip from '@components/skeleton/ToolTip';
import HolidayModal from '@components/skeleton/calendar/HolidayModal';

interface Holiday {
  name: string;
  date: string;
  type: 'reading' | 'christian';
  description: string;
  origins: string;
  traditions: string;
  funFact?: string;
}

// format: "MM-DD"
const holidays: Record<string, Holiday> = {
  // ── JANUARY ─────────────────────────────────────────────────────────────
  '01-01': {
    name: "New Year's Day",
    date: 'January 1',
    type: 'christian',
    description: 'The first day of the Gregorian calendar year, celebrated worldwide as a fresh start and a time of renewal.',
    origins: 'The ancient Romans dedicated January 1st to Janus, the two-faced god of beginnings. The Christian church later adopted it as the Feast of the Circumcision of Christ.',
    traditions: 'Watching fireworks, making resolutions, attending church services, gathering with family, and sharing meals.',
    funFact: 'In many Eastern Orthodox traditions, New Year is still celebrated on January 14th, following the old Julian calendar.',
  },
  '01-06': {
    name: 'Epiphany',
    date: 'January 6',
    type: 'christian',
    description: 'Also called Three Kings Day, Epiphany marks the visit of the Magi to the infant Jesus — the revelation of Christ to the Gentiles.',
    origins: 'One of the oldest Christian feasts, observed since at least the 2nd century. The word comes from Greek meaning "manifestation" or "appearance".',
    traditions: 'Gift-giving (especially in Latin cultures), chalking the door with blessings, eating King Cake, carol singing, and elaborate church processions.',
    funFact: 'In Spain and many Latin American countries, Epiphany is the primary gift-giving day — more so than Christmas.',
  },
  '01-23': {
    name: 'World Book Day (UNESCO)',
    date: 'January 23',
    type: 'reading',
    description: 'A global celebration of books and reading, encouraging everyone to discover the joy of literature and the power of storytelling.',
    origins: 'UNESCO proclaimed World Book and Copyright Day on April 23rd, chosen because it coincides with the death of Shakespeare, Cervantes, and Inca Garcilaso de la Vega.',
    traditions: 'Exchanging books, school reading events, author talks, costume days as literary characters, and bookshop promotions.',
    funFact: 'In the UK, World Book Day is celebrated on the first Thursday of March to avoid school holidays — meaning the UK has its own date separate from UNESCO\'s.',
  },

  // ── FEBRUARY ────────────────────────────────────────────────────────────
  '02-02': {
    name: 'Candlemas',
    date: 'February 2',
    type: 'christian',
    description: 'Candlemas celebrates the presentation of Jesus at the Temple forty days after his birth, and the purification of the Virgin Mary.',
    origins: 'Rooted in the Jewish law of Leviticus, this feast was formally established by the Roman Church around the 5th century.',
    traditions: 'Blessing of candles that will be used throughout the year, candlelit processions, and special church services.',
    funFact: 'Groundhog Day on the same date shares pagan weather-forecasting traditions once associated with Candlemas.',
  },
  '02-14': {
    name: "Valentine's Day (St Valentine's Feast)",
    date: 'February 14',
    type: 'christian',
    description: 'Originally the feast day of Saint Valentine, a 3rd-century Roman martyr, now widely celebrated as a day of love and affection.',
    origins: 'The feast of Saint Valentine was established by Pope Gelasius I in 496 AD. Its association with romantic love emerged in the Middle Ages, popularised by Chaucer and Shakespeare.',
    traditions: 'Exchanging cards, flowers, and gifts; romantic dinners; and expressing love to friends and family.',
    funFact: 'There were at least three different saints named Valentine recognised by the early Christian church — it\'s unclear which the feast originally honoured.',
  },

  // ── MARCH ───────────────────────────────────────────────────────────────
  '03-02': {
    name: 'World Read Aloud Day',
    date: 'March 2',
    type: 'reading',
    description: 'A day to celebrate the joy of reading aloud, reminding us that sharing stories strengthens community and builds literacy.',
    origins: 'Founded by LitWorld in 2010 to advocate for literacy as a human right. It falls near Dr Seuss\'s birthday, honouring his legacy of read-aloud literature.',
    traditions: 'Reading aloud in classrooms, libraries, and communities; recording and sharing readings online; storytelling events worldwide.',
    funFact: 'Research shows reading aloud to children accelerates vocabulary development more than silent reading — the oldest teaching technique is still one of the best.',
  },
  '03-17': {
    name: "St Patrick's Day",
    date: 'March 17',
    type: 'christian',
    description: 'The feast day of Saint Patrick, the patron saint of Ireland, commemorating his death in the 5th century and celebrating Irish heritage.',
    origins: 'Patrick was a Romano-British Christian missionary who brought Christianity to Ireland around 432 AD. His feast has been observed by the Irish church since the 9th century.',
    traditions: 'Wearing green, parades, shamrock symbolism, attending Mass, Irish music sessions, and rivers dyed green in cities like Chicago.',
    funFact: 'Saint Patrick used the three-leaf shamrock to explain the Holy Trinity — though this story only appears in writing from the 18th century.',
  },
  '03-25': {
    name: 'The Annunciation',
    date: 'March 25',
    type: 'christian',
    description: 'Celebrates the angel Gabriel\'s announcement to Mary that she would conceive and bear the Son of God.',
    origins: 'Observed since at least the 5th century, exactly nine months before Christmas — marking the moment of the Incarnation.',
    traditions: 'Special church services, Marian hymns and prayers, and quiet personal reflection on the mystery of the Incarnation.',
    funFact: 'March 25 was New Year\'s Day in many European countries until the 18th century, including England, because it marked the beginning of Christ\'s earthly life.',
  },

  // ── APRIL ───────────────────────────────────────────────────────────────
  '04-23': {
    name: 'World Book & Copyright Day',
    date: 'April 23',
    type: 'reading',
    description: 'UNESCO\'s official day to promote reading, publishing, and the protection of intellectual property through copyright.',
    origins: 'Proclaimed by UNESCO in 1995. April 23 was chosen as the date of death of both William Shakespeare and Miguel de Cervantes — two of the most influential writers in history.',
    traditions: 'Book gifting (especially in Catalonia\'s La Diada de Sant Jordi), author readings, library events, and campaigns for global literacy.',
    funFact: 'In Catalonia, the tradition of giving a rose and a book on April 23rd predates UNESCO\'s proclamation by centuries — it\'s one of the world\'s most bookish holidays.',
  },

  // ── MAY ─────────────────────────────────────────────────────────────────
  '05-01': {
    name: 'Ascension Day (approx.)',
    date: 'May 1 (varies)',
    type: 'christian',
    description: 'Ascension Thursday commemorates Jesus ascending into Heaven forty days after Easter, witnessed by his apostles.',
    origins: 'One of the earliest Christian feasts, mentioned by Augustine in the early 5th century. The date varies each year, always falling 39 days after Easter Sunday.',
    traditions: 'Church services, processions, and in some traditions, the blessing of fields and crops — linking the feast to spring agricultural rhythms.',
    funFact: 'In the Netherlands, Ascension Day is a public holiday where people traditionally hold outdoor picnics — combining Christian tradition with spring celebration.',
  },

  // ── JUNE ────────────────────────────────────────────────────────────────
  '06-24': {
    name: "St John's Day (Nativity of John the Baptist)",
    date: 'June 24',
    type: 'christian',
    description: 'Celebrates the birth of John the Baptist, cousin of Jesus and the prophet who prepared the way for Christ\'s ministry.',
    origins: 'One of the oldest Marian and apostolic feasts in the Christian calendar, celebrated since at least the 4th century. The date is six months before Christmas — following Luke\'s Gospel.',
    traditions: 'Bonfires (Midsummer fires), night-time celebrations, floral garlands, and in many cultures this coincides with Midsummer folk traditions.',
    funFact: 'John the Baptist is one of the very few saints whose birthday (not death day) is celebrated in the liturgical calendar — alongside Jesus and Mary.',
  },
  '06-29': {
    name: 'Feast of Saints Peter and Paul',
    date: 'June 29',
    type: 'christian',
    description: 'Honours the two foundational apostles of the Church — Peter, the "rock" on whom the Church was built, and Paul, the apostle to the Gentiles.',
    origins: 'Observed since the 3rd century in Rome, traditionally marking the anniversary of the martyrdom of both apostles under Emperor Nero.',
    traditions: 'Special liturgies, papal blessings in Rome, pilgrimage to the basilicas of St Peter and St Paul, and in many countries it remains a public holiday.',
    funFact: 'Despite their different temperaments — Peter the fisherman and Paul the scholar — early Christians saw their pairing as the perfect union of faith and reason.',
  },

  // ── JULY ────────────────────────────────────────────────────────────────
  '07-22': {
    name: 'Feast of Mary Magdalene',
    date: 'July 22',
    type: 'christian',
    description: 'Celebrates Mary Magdalene, a devoted follower of Jesus and the first witness to the Resurrection — called the "Apostle to the Apostles".',
    origins: 'Her feast was listed in the Roman calendar since the 8th century. Pope Francis elevated it to a feast (from a memorial) in 2016, honouring her apostolic witness.',
    traditions: 'Church services, readings from the Gospel accounts of the Resurrection, and in Provence (France) pilgrimages to the Sainte-Baume basilica.',
    funFact: 'Mary Magdalene\'s reputation as a former sinner is not in the Bible — it was a mistaken conflation made by Pope Gregory I in 591 AD and only officially corrected by the Church in 1969.',
  },
  '07-25': {
    name: 'Feast of Saint James',
    date: 'July 25',
    type: 'christian',
    description: 'Feast day of James the Apostle, son of Zebedee, patron saint of Spain and one of the inner circle of Jesus\'s disciples.',
    origins: 'James was the first apostle to be martyred, around 44 AD under King Herod Agrippa. His supposed relics were discovered in Spain in the 9th century, making Santiago de Compostela one of Christendom\'s greatest pilgrimage sites.',
    traditions: 'The Camino de Santiago pilgrimage peaks around this feast, with special masses in Santiago Cathedral and a famous botafumeiro (giant incense burner) ceremony.',
    funFact: 'When July 25 falls on a Sunday, it\'s declared a Holy Year (Año Santo) in Santiago — the next one is 2027.',
  },

  // ── AUGUST ──────────────────────────────────────────────────────────────
  '08-15': {
    name: 'Assumption of Mary',
    date: 'August 15',
    type: 'christian',
    description: 'Celebrates the belief that the Virgin Mary was assumed body and soul into Heaven at the end of her earthly life.',
    origins: 'Observed in the Eastern Church since the 6th century. Pope Pius XII defined it as dogma in 1950 — one of two Marian dogmas formally defined in the modern era.',
    traditions: 'Solemn Mass, Marian processions, blessing of herbs and flowers in many European cultures, and sea blessings for fishing communities.',
    funFact: 'August 15 is also Napoleon Bonaparte\'s birthday, and in Corsica — where he was born — celebrations blend Marian reverence with Napoleonic pride.',
  },

  // ── SEPTEMBER ───────────────────────────────────────────────────────────
  '09-08': {
    name: "International Literacy Day",
    date: 'September 8',
    type: 'reading',
    description: 'UNESCO\'s annual observance to raise awareness about literacy as a fundamental human right and the foundation of lifelong learning.',
    origins: 'Proclaimed by UNESCO in 1966 at the World Conference of Ministers of Education held in Tehran, marking the importance of literacy for peace and development.',
    traditions: 'Award ceremonies for literacy programmes worldwide, publication of literacy reports, school reading campaigns, and community library events.',
    funFact: 'As of 2024, approximately 763 million adults worldwide still cannot read or write — two-thirds of them are women.',
  },
  '09-12': {
    name: 'Nativity of Mary',
    date: 'September 8',
    type: 'christian',
    description: 'Celebrates the birth of the Virgin Mary, mother of Jesus, exactly nine months after the Feast of the Immaculate Conception on December 8.',
    origins: 'Observed in the East since the 6th century and in Rome since the 7th century. The date was fixed by the same mathematical relationship used for the Annunciation and Christmas.',
    traditions: 'Church services, Marian hymns, pilgrimages to Marian shrines, and in many regions, local folk festivals with ancient roots.',
    funFact: 'The Gospel says nothing about Mary\'s birth — the story comes from a 2nd-century text called the Protoevangelium of James, which also names her parents as Joachim and Anne.',
  },
  '09-29': {
    name: 'Feast of the Archangels (Michaelmas)',
    date: 'September 29',
    type: 'christian',
    description: 'Honours the three archangels: Michael, Gabriel, and Raphael — the heavenly messengers who appear throughout Scripture.',
    origins: 'Michaelmas has been observed since 487 AD when a basilica was dedicated to Michael in Rome. It became one of the great medieval English quarter days.',
    traditions: 'Eating goose (said to bring financial good luck), harvest celebrations, election of local officials in England, and church observances.',
    funFact: 'Michaelmas was traditionally when English rents were due and magistrates were elected — so much of civic life revolved around this feast that it appeared in countless literary works including those of Dickens.',
  },

  // ── OCTOBER ─────────────────────────────────────────────────────────────
  '10-01': {
    name: 'International Day of Older Persons / St Thérèse',
    date: 'October 1',
    type: 'christian',
    description: 'Feast of Saint Thérèse of Lisieux, the "Little Flower", a Carmelite nun and Doctor of the Church known for her "little way" of spiritual childhood.',
    origins: 'Thérèse Martin died in 1897 at age 24 and was canonised in 1925 — one of the fastest canonisations in modern history. She was declared a Doctor of the Church in 1997.',
    traditions: 'Devotional roses (she promised to "let fall a shower of roses" after death), novenas, and her autobiography The Story of a Soul is widely read.',
    funFact: 'Thérèse never left her convent after entering it at age 15, yet Pope John Paul II named her co-patron of the missions alongside Francis Xavier — because of the power of her prayers.',
  },

  // ── NOVEMBER ────────────────────────────────────────────────────────────
  '11-01': {
    name: "All Saints' Day",
    date: 'November 1',
    type: 'christian',
    description: 'A solemn Christian feast honouring all saints, known and unknown, who have attained the beatific vision in Heaven.',
    origins: 'Originally celebrated in May, it was moved to November 1 by Pope Gregory III (731–741) to coincide with the dedication of a chapel to All Saints in St Peter\'s Basilica.',
    traditions: 'Mass attendance, visiting and decorating the graves of loved ones, lighting candles, and in many cultures, festive processions.',
    funFact: 'Halloween (All Hallows\' Eve) is the vigil of All Saints\' Day — the name itself means "the evening before All Hallows (Saints)".',
  },
  '11-02': {
    name: "All Souls' Day",
    date: 'November 2',
    type: 'christian',
    description: 'The day the Church prays for the souls of all the faithful departed who are believed to be in Purgatory, awaiting Heaven.',
    origins: 'Instituted by St Odilo of Cluny in 998 AD for all Cluniac monasteries, it spread throughout the Western Church in the 13th century.',
    traditions: 'Visiting cemeteries, lighting candles on graves, holding Masses for the dead, and in Mexico this blends with the colourful Día de los Muertos.',
    funFact: 'The Catholic Church allows priests to celebrate three Masses on All Souls\' Day — one of only two days this is permitted (the other being Christmas).',
  },

  // ── DECEMBER ────────────────────────────────────────────────────────────
  '12-08': {
    name: 'Immaculate Conception',
    date: 'December 8',
    type: 'christian',
    description: 'Celebrates the Catholic doctrine that Mary was conceived without original sin — preserved by God in anticipation of her role as the mother of Christ.',
    origins: 'The doctrine was debated for centuries before Pope Pius IX defined it as dogma in 1854, in the bull Ineffabilis Deus.',
    traditions: 'Solemn Mass, Marian processions, the lighting of candles, and in Rome the Pope traditionally visits Piazza di Spagna to honour the statue of Mary.',
    funFact: 'Despite popular confusion, the Immaculate Conception refers to Mary\'s conception — not the Virgin Birth of Jesus. They are two distinct doctrines.',
  },
  '12-25': {
    name: 'Christmas Day',
    date: 'December 25',
    type: 'christian',
    description: 'The feast of the Nativity of Jesus Christ, celebrating his birth in Bethlehem as the Son of God and Saviour of the world.',
    origins: 'First mentioned as a Roman celebration in 336 AD. The December 25 date was likely chosen to align with the Roman feast Natalis Solis Invicti (Birth of the Unconquered Sun).',
    traditions: 'Midnight Mass, nativity scenes, gift giving, carol singing, decorating trees, family feasting, and in many countries, acts of charity.',
    funFact: 'The Christmas tree tradition was popularised in England by Prince Albert, the German-born husband of Queen Victoria, in the 1840s — and spread globally from there.',
  },
  '12-26': {
    name: 'St Stephen\'s Day',
    date: 'December 26',
    type: 'christian',
    description: 'Feast of Saint Stephen, the first Christian martyr (protomartyr), a deacon who was stoned to death for his faith as recorded in Acts of the Apostles.',
    origins: 'Observed since the 5th century, immediately following Christmas as a reminder that the joy of Christ\'s birth is paired with the cost of discipleship.',
    traditions: 'Church services, charity (St Stephen was known for distributing alms), and in Ireland and the UK, "Wren Day" processions.',
    funFact: 'The carol "Good King Wenceslas" is set on the Feast of Stephen — Wenceslas looks out on December 26th to bring charity to a poor man gathering winter fuel.',
  },
};

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentMonth = MONTH_NAMES[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Previous month overflow
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  const prevMonthDays = Array.from({ length: firstDay }, (_, i) =>
    daysInPrevMonth - firstDay + i + 1
  );

  // Next month overflow — fill to complete 6-row grid
  const totalCells = 42;
  const nextMonthDays = Array.from(
    { length: totalCells - firstDay - daysInMonth },
    (_, i) => i + 1
  );

  const isToday = (d: number, m: number, y: number) => {
    const today = new Date();
    return d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
  };

  const getHolidayForDate = (d: number, m: number): Holiday | null => {
    // Check moveable feasts first
    const moveable = getMoveableHoliday(d, m, year);
    if (moveable) return moveable;

    // Fall back to fixed date holidays
    const wrappedM = ((m % 12) + 12) % 12;
    const key = `${String(wrappedM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return holidays[key] ?? null;
  };

  const handleDayClick = (holiday: Holiday | null) => {
    if (!holiday) return;
    setSelectedHoliday(holiday);
    setIsModalOpen(true);
  };

  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextYear = month === 11 ? year + 1 : year;

  // Anonymous Gregorian algorithm — returns Easter Sunday { month (0-indexed), day }
  const getEasterDate = (y: number): { month: number; day: number } => {
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const d2 = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d2 - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m2 = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m2 + 114) / 31) - 1; // 0-indexed
    const day = ((h + l - 7 * m2 + 114) % 31) + 1;
    return { month, day };
  };

  const getMoveableHoliday = (d: number, m: number, y: number): Holiday | null => {
    const easter = getEasterDate(y);
    const easterDate = new Date(y, easter.month, easter.day);

    const goodFriday = new Date(easterDate);
    goodFriday.setDate(easterDate.getDate() - 2);

    const check = new Date(y, m, d);

    if (check.toDateString() === goodFriday.toDateString()) {
      return {
        name: 'Good Friday',
        date: goodFriday.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
        type: 'christian',
        description: 'Good Friday commemorates the crucifixion and death of Jesus Christ at Calvary. It is a day of fasting, mourning, and solemn reflection at the heart of the Christian faith.',
        origins: "Observed since the earliest centuries of Christianity. The name 'Good' is thought to derive from 'God's Friday' or from an older sense of 'good' meaning holy or sacred.",
        traditions: 'Fasting, attending the Stations of the Cross, three-hour church services from noon to 3pm (the hours of the crucifixion), veneration of the cross, and in many cultures — hot cross buns.',
        funFact: `Good Friday is one of the few days in the Catholic liturgical calendar where Mass is not celebrated — instead a special Liturgy of the Lord's Passion is held in its place.`,
      };
    }

    if (check.toDateString() === easterDate.toDateString()) {
      return {
        name: 'Easter Sunday',
        date: easterDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
        type: 'christian',
        description: 'Easter Sunday celebrates the Resurrection of Jesus Christ from the dead — the central event of the Christian faith and the foundation of Christian hope.',
        origins: 'The earliest Christians observed the Resurrection on the Jewish Passover. The Council of Nicaea in 325 AD standardised the date as the first Sunday after the first full moon following the spring equinox.',
        traditions: 'Easter Vigil and sunrise services, lighting the Paschal candle, baptisms, Easter egg hunts, exchanging chocolate eggs symbolising new life, and festive family meals.',
        funFact: "The word 'Easter' likely derives from Eostre, an Anglo-Saxon goddess of spring — though the feast's Christian meaning entirely displaced its pagan origins across Europe.",
      };
    }

    return null;
  };
  return (
    <>
      <div className="bg-gradient-to-br from-[#fcf9f4] to-[#fceae8] rounded-2xl border border-[#e8bfb0] p-4 md:p-5 shadow-[0_10px_25px_-8px_rgba(181,139,124,0.25)]">

        {/* Header */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center gap-2">
            <Feather size={14} className="text-[#c9a394]" />
            <h2 className="text-sm md:text-base font-serif text-[#5a4d41]">
              {currentMonth} {currentYear}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-1 hover:bg-[#f5d6d4]/30 rounded-full transition"
            >
              <ChevronLeft size={16} className="text-[#c9a394]" />
            </button>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="text-[10px] md:text-xs px-2 py-1 text-[#c9a394] hover:bg-[#f5d6d4]/30 rounded-md transition"
            >
              Today
            </button>

            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-1 hover:bg-[#f5d6d4]/30 rounded-full transition"
            >
              <ChevronRight size={16} className="text-[#c9a394]" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1 md:mb-2">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] md:text-xs font-medium text-[#d9b6a8]">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5 md:gap-1">

          {/* ── Previous month days (dimmed) ── */}
          {prevMonthDays.map((d, i) => {
            const holiday = getHolidayForDate(d, prevMonth);
            return (
              <div
                key={`prev-${i}`}
                onClick={() => handleDayClick(holiday)}
                className={`
                                    relative text-center p-0.5 md:p-1.5 text-[10px] md:text-sm rounded-md
                                    transition-all duration-200
                                    text-[#c9b5a8] opacity-40 italic
                                    ${holiday ? 'cursor-pointer hover:opacity-60 hover:bg-[#f5d6d4]/20' : 'cursor-default'}
                                `}
              >
                <Tooltip content={holiday?.name ?? ''}>
                  <div className="relative flex flex-col items-center">
                    <span>{d}</span>
                    {holiday && (
                      <div className={`w-1 h-1 rounded-full mt-0.5 ${holiday.type === 'reading' ? 'bg-[#c9a394]' : 'bg-[#e8bfb0]'}`} />
                    )}
                  </div>
                </Tooltip>
              </div>
            );
          })}

          {/* ── Current month days ── */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
            const holiday = getHolidayForDate(d, month);
            const today = isToday(d, month, year);

            return (
              <div
                key={`cur-${d}`}
                onClick={() => handleDayClick(holiday)}
                className={`
                                    relative text-center p-0.5 md:p-1.5 text-[10px] md:text-sm rounded-md
                                    transition-all duration-200
                                    ${holiday ? 'cursor-pointer' : 'cursor-default'}
                                    ${today
                    ? 'bg-gradient-to-r from-[#c9a394] to-[#d9b6a8] text-white font-medium shadow-sm'
                    : holiday
                      ? holiday.type === 'reading'
                        ? 'bg-[#c9a394]/10 text-[#5a4d41] hover:bg-[#c9a394]/20'
                        : 'bg-[#e8bfb0]/20 text-[#5a4d41] hover:bg-[#e8bfb0]/30'
                      : 'text-[#5a4d41] hover:bg-[#f5d6d4]/30'
                  }
                                `}
              >
                <Tooltip content={holiday?.name ?? ''}>
                  <div className="relative">
                    {d}
                    {holiday && (
                      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        <div className={`w-1 h-1 rounded-full ${holiday.type === 'reading' ? 'bg-[var(--holiday-reading-dot)]' : 'bg-[var(--holiday-christian-dot)]'}`} />
                      </div>
                    )}
                  </div>
                </Tooltip>
              </div>
            );
          })}

          {/* ── Next month days (dimmed) ── */}
          {nextMonthDays.map((d, i) => {
            const holiday = getHolidayForDate(d, nextMonth);
            return (
              <div
                key={`next-${i}`}
                onClick={() => handleDayClick(holiday)}
                className={`
                                    relative text-center p-0.5 md:p-1.5 text-[10px] md:text-sm rounded-md
                                    transition-all duration-200
                                    text-[#c9b5a8] opacity-40 italic
                                    ${holiday ? 'cursor-pointer hover:opacity-60 hover:bg-[#f5d6d4]/20' : 'cursor-default'}
                                `}
              >
                <Tooltip content={holiday?.name ?? ''}>
                  <div className="relative flex flex-col items-center">
                    <span>{d}</span>
                    {holiday && (
                      <div className={`w-1 h-1 rounded-full mt-0.5 ${holiday.type === 'reading' ? 'bg-[#c9a394]' : 'bg-[#e8bfb0]'}`} />
                    )}
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[var(--holiday-reading-dot)] rounded-full" />
            <span className="text-[#7e6957]">Reading</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[var(--holiday-christian-dot)] rounded-full" />
            <span className="text-[#7e6957]">Christian</span>
          </div>
        </div>
      </div>

      <HolidayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        holiday={selectedHoliday}
      />
    </>
  );
};
