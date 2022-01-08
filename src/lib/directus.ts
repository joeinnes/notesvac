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

const url = "" + import.meta.env.VITE_API_URL;

const directus = new Directus<NotesVacApp>(url);

export default directus;
export type { Note };