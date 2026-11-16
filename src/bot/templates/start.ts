import type { QariType } from "../../schemas/qari.schema.js";
import type { SuraType } from "../../schemas/sura.schema.js";
import { formatDuration, formatFileSize } from "../../utils/formatter.js";

type RecitationType = {
  fileSize: number;
  duration: number;
};

export const startHtml = `<b>السلام عليكم ورحمة الله وبركاته</b>

<b>Welcome to the Holy Quran Audio Library!</b>

May Allah ﷻ fill your heart with the light of the Quran.

<blockquote>Listen, Download & Reflect</blockquote>

With this bot, you can easily access beautiful Quran recitations from different Qaris.

<b><em>How to use the bot:</em></b>

<b>Qari<em> — Click the </em>Qari</b> button to explore the available Quran reciters and choose your favorite reciter.

<b>Sura<em> — Click the </em>Sura</b> button to explore the Surahs of the Holy Quran and choose the one you wish to listen to.

━━━━━━━━━━━━━━━━━━

<blockquote><b><em>رَبَّنَا اجْعَلِ الْقُرْآنَ رَبِيعَ قُلُوبِنَا وَنُورَ صُدُورِنَا</em></b></blockquote>

<blockquote><b><em>"Our Lord, make the Quran the spring of our hearts and the light of our chests."</em></b></blockquote>

May Allah accept your listening, recitation, and remembrance of Him.

<b>May the Quran always be your companion.</b>
`;

export const chooseQari = `<blockquote>Choose Your Qari</blockquote>

Listen to beautiful Quran recitations from different Qaris.

<b><em>Please select your preferred Qari from the list below to explore their recitations and choose a Surah.</em></b>

<blockquote><b><em>May Allah make the Quran the light of our hearts.</em></b></blockquote>
`;

export const chooseSura = `<blockquote>Choose a Surah</blockquote>

Select a Surah from the Holy Quran below to explore its available recitations.

<blockquote>Choose the Surah you'd like to listen to and enjoy the beautiful words of Allah.
<b><em>May Allah bless your listening.</em></b></blockquote>
`;

export const choseSuraForQari = (nameEn: string, nameAr: string) => `
<blockquote>Qari Selected</blockquote>

You selected:

<b>English:</b> ${nameEn}
<b>Arabic:</b> ${nameAr}

<b><em>Now, choose a Surah from the Holy Quran to listen to this Qari's beautiful recitation.</em></b>

<blockquote><b><i>May Allah bless your listening.</i></b></blockquote>
`;

export const choseQariForSura = ({
  nameEn,
  nameAr,
  number,
  verses,
  revelation,
}: {
  nameEn: string;
  nameAr: string;
  number: number;
  verses: number;
  revelation: string;
}) => {
  return `
<blockquote>Choose a Qari</blockquote>

${nameEn} | <b>${nameAr}</b>

━━━━━━━━━━━━━━

<b>Surah Number:</b> ${number}
<b>Verses:</b> ${verses}
<b>Revelation:</b> ${revelation} | ${revelation === "Meccan" ? "مَكِّيَّة" : "مَدَنِيَّة"}

━━━━━━━━━━━━━━

<b><em>Choose your preferred Qari from the list below to listen to this Surah in their beautiful recitation.</em></b> 

May Allah bless your listening.
  `.trim();
};

export const recitationCaption = ({
  qari,
  surah,
  recitation,
}: {
  qari: QariType;
  surah: SuraType;
  recitation: RecitationType;
}) => {
  return `
<b>Surah:</b> ${surah.nameEn}
<b>السورة:</b> ${surah.nameAr}

<b>Qari:</b> ${qari.name}
<b>القارئ:</b> ${qari.nameAr}

<b>Surah Number:</b> ${surah.number}
<b>Verses:</b> ${surah.verses}

<b>File Size:</b> ${formatFileSize(recitation.fileSize)}
<b>Audio Duration:</b> ${formatDuration(recitation.duration)}

━━━━━━━━━━━━━━━━━━

<i>Listen, reflect, and let the words of Allah bring peace to your heart.</i>

اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قُلُوبِنَا
  `.trim();
};

export const helpMessage = `
<b>Tilawah Bot — Help Center</b>

<blockquote>Welcome to <b>Tilawah</b>! Your companion for listening to beautiful Quran recitations.</blockquote>

<b>Available Commands</b>

/start - Start the bot
/help - Show this help message
/qari - Browse available Qaris
/sura - Browse all Surahs
/random - Get a random Quran recitation

<b>How to Use</b>

1. Use /qari or click <b>Qari</b> to browse available reciters.
2. Select your favorite Qari.
3. Choose a Surah to listen to.
4. Enjoy listening to the Holy Quran.

<b><i>OR</i></b>

1. Use /sura or click <b>Sura</b> to browse available Surahs.
2. Select your needed Surah.
3. Choose a Qari to listen to.
4. Enjoy listening to the Holy Quran.

<i>May Allah make the Quran the light of our hearts. 🤍</i>
`;

