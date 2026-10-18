begin;

alter table public.notes
  add constraint notes_title_length_check
    check (char_length(title) <= 100),
  add constraint notes_content_length_check
    check (char_length(content) <= 10000);

commit;
