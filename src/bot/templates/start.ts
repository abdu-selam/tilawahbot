import type { QariType } from "../../schemas/qari.schema.js";
import QariClass from "../../schemas/qari.schema.js";
import type { SuraType } from "../../schemas/sura.schema.js";
import type { ParsedError } from "../../types/bot.types.js";
import {
  escapeHtml,
  formatDuration,
  formatFileSize,
} from "../../utils/formatter.js";

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

export const chooseQari = () => {
  return `<blockquote>Choose Your Qari (Total: ${QariClass.avalableQaris()} Qaris)</blockquote>

Listen to beautiful Quran recitations from different Qaris.

<b><em>Please select your preferred Qari from the list below to explore their recitations and choose a Surah.</em></b>

<blockquote><b><em>May Allah make the Quran the light of our hearts.</em></b></blockquote>
`;
};

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
<blockquote>Choose a Qari (Total: ${QariClass.avalableQaris()} Qaris)</blockquote>

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

export const addKeyboardText = `
Message added! add keyboards with this structure
<pre><code class="language-json">
[
  {
    "text": "text in the button",
    "data": "the data the keybord poses",
    "type": "text | url"
  }
]
</code></pre>
`;

export const userData = (
  user: Record<string, string | number>,
  withUid: boolean = false,
): string => {
  let anchor = `<a href="https://t.me/${user.username}">${user.username} is here</a>`;
  if (withUid) {
    anchor = `<a href="tg://user?id=${user.uid}">${user.uid} is here</a>`;
  }
  return `
<blockquote>User found</blockquote>

<pre><code class="language-json">
${JSON.stringify(user, null, 2)}
</code></pre>

${anchor}
`.trim();
};

export const errorHtml = (
  err: ParsedError,
  id: string | number | undefined,
): string => {
  return `
<blockquote>BOT ERROR</blockquote>

<b>Type:</b> ${escapeHtml(err.name)}
<b>Message:</b> ${escapeHtml(err.message)}

<b>File:</b> <code>${escapeHtml(err.file)}</code>
<b>Line:</b> <code>${err.line ?? "Unknown"}</code>
<b>Column:</b> <code>${err.column ?? "Unknown"}</code>

<b>User ID:</b> <code>${id ?? "Unknown"}</code>

<b>Stack Trace:</b>
<pre>${escapeHtml(err.stack.slice(0, 2500))}</pre>
 `.trim();
};

export const qariCompleteHTML = (qari: QariType): string => {
  return `
<b>السلام عليكم ورحمة الله وبركاته</b>

<blockquote>New Qari has been added!</blockquote>

<b>Qari</b> ${qari.name} | ${qari.nameAr}

May Allah accept your listening, recitation, and remembrance of Him.
<b>May the Quran always be your companion.</b>

<blockquote>Don't forget the developer on your prayer!</blockquote>
`.trim();
};

export const replyForCleanMessege = (name: string | undefined) => {
  return `
<b>السلام عليكم ورحمة الله وبركاته</b>

${name ?? ""} please provide your message as the following:
<pre>
/message type your message here
</pre>
`.trim();
};

export const tellAdminIncommingMessage = (
  uid: string | number,
  message: string,
) => {
  return `
<blockquote>Message Incomming</blockquote>

<a href="tg://user?id=${Number(uid)}">${uid}</a>

<pre>
${message}
</pre>

/read ${uid} your-emoji

/reply ${uid} your-message
`.trim();
};
