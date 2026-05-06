export type Verse = { num: number; text: string };
export type Hymn = { id: number; number: string; title: string; verses: Verse[]; refrain?: string; category: string };
