import { Directus } from '@directus/sdk';
import type { ID } from '@directus/sdk';

type Note = {
  id: ID;
  title: string;
  ai?: string;
  ocr: string;
  corrected?: string;
  from_user?: string;
  date_created: Date;
  original_scan: string;
};

type NotesVacApp = {
  notes: Note;
}

const directus = new Directus<NotesVacApp>('https://api.traist.co.uk');

export default directus;
export type { Note };