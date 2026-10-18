export const NOTE_TITLE_MAX_LENGTH = 100;
export const NOTE_CONTENT_MAX_LENGTH = 10_000;
export const NOTES_PER_PAGE = 20;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isNoteId(value: string) {
  return uuidPattern.test(value);
}
