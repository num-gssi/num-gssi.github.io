# CompMath @ GSSI

Website of the Numerical Analysis and Data Science Group at the Gran Sasso Science Institute.

## Updating the content

The content is stored in the same Markdown files as before:

- `docs/seminar.md`: NOMADS seminars.
- `docs/reading_group.md`: COMPiLE reading group.
- `docs/people.md`: group members.
- `docs/index.md`: homepage.
- `docs/calendar.md` and `docs/venues.md`: calendar and practical information.

To add a seminar, copy a row in the table for the corresponding academic year and update the photo, speaker, affiliation, title, abstract, date, time and venue. Use **bold text** for the title and keep the date format already used in the tables, e.g. `November 16, 2026`.

```markdown
| | Speaker name <br> Affiliation | **Talk title** <br><br> Abstract. | November 16, 2026 <br> Time and venue to be announced |
```

If the date is tentative, add `Date to be confirmed` in the last column. Remove this sentence once the date is confirmed. Add the time and venue when available, e.g. `4:00 PM <br> [Main Lecture Hall](../venues/)`.

The homepage reads the two seminar pages and shows up to three upcoming meetings. No separate list needs to be updated. Dates are compared with the current day in Europe/Rome; meetings remain visible for the whole day. The archive is preserved. This feature requires JavaScript and an HTTP/HTTPS preview; the links to the full programmes are always available.

To update a person, edit their section in `docs/people.md`. Keep the same format: name, photo, role, a short biography (about 50–70 words), and personal or institutional links. Write biographies in English and in the third person. For profiles without a biography, add research interests only when supplied by the person. Images keep their original proportions, without a fixed height or cropping; the same rule applies to speaker photos in the seminar tables.

The homepage contains short research summaries. Edit the full area descriptions and project details in `docs/research.md`; the homepage links to that page. No additional folders are needed.

## Local preview

Use Python 3.10 or newer.

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs serve -a 127.0.0.1:8766
```

Open http://127.0.0.1:8766/ . To generate the static website, run `.venv/bin/mkdocs build`.

Edit the files in `docs/`, not the generated pages in `site/`. Use the repository's existing publication procedure when the changes are ready.

## Layout

The folder structure is unchanged: `docs/` contains the content and images, `cinder/` the existing theme, and `site/` the generated website. `mkdocs.yml` contains the menu and build configuration. No separate content database or build hooks are required.

- `docs/css/extra.css`: colours, spacing, image sizes and background animation.
- `docs/javascripts/site.js`: archive presentation, upcoming seminars and the background pause control.
- `cinder/base.html`: shared page layout, mountain background and the GSSI logo.

The homepage retains the original Gran Sasso panorama in an optimized format. All pages share a light mountain background; only the clouds move slowly. The animation can be paused in the footer and respects reduced-motion preferences.

The fixed lower-right logo uses the original square GSSI symbol, without the white card or additional text. Its size is adjusted for desktop and mobile. White in the source image is blended into the page background through CSS.

The numerical diffusion article remains in `docs/post0.md`, linked from the footer. `docs/posts.md` is also retained, although it is currently not in the main menu.

## People and organizers

Continue editing `docs/people.md` with the same headings, photos, role lines, biographies and links. The page automatically arranges profiles in two columns on desktop and one column on mobile. Longer biographies are shown under “Research & background”; shorter supervision notes stay visible.

The organizers are still edited in the existing table in `docs/reading_group.md`. Rows whose period contains `Present` are shown first. All other rows remain available under “Previous organizers”. Keep the photo, name/link, spacer column and period in their existing order; no second organizer list is needed.

Profile and archive entrance effects run once as items enter the screen. They are disabled when the visitor prefers reduced motion. Photos preserve their original aspect ratio. People portraits are displayed at 160 px on desktop and 124 px on mobile. Organizer and seminar portraits are also enlarged, without fixed heights or cropping.

## Seminar archives by academic year

Each seminar page has one academic-year control aligned with the Programme heading, just above the seminar list. The main navigation stays unchanged. The latest available year is shown by default. The seminar count updates when another year is selected.

Continue adding years and rows in `docs/seminar.md` or `docs/reading_group.md` using the existing format, for example `### Academic Year 2026/27`. The selector is created automatically. Membership follows these headings, not an automatic reassignment of dates. No extra pages, folders or duplicated lists are required.

Selecting a year updates the address, which can be copied to share that programme. Existing links to year headings and individual seminars still work. Browser Back and Forward restore the selected year. Without JavaScript, the complete archive remains readable as before.

Page headings, introductions and archive entries have short entrance effects. Changing the academic year uses a light fade. Effects respect reduced-motion preferences. Text links are underlined; external resources have a small arrow.

Tommaso Vanzan’s confirmed seminar on November 16, 2026 at 3:00 PM (Conference Room, Zenith building, ex-INPS) is listed under COMPiLE in `docs/reading_group.md`. An old link to the talk under NOMADS is forwarded to its COMPiLE entry.

Organizer portraits are 128 px wide on desktop (100 px on mobile); seminar portraits are 120 px (92 px on mobile). Keep the natural image proportions to avoid cutting faces. Tommaso Vanzan’s photo is saved in `docs/img/tommaso-vanzan.jpg`; his abstract and details use the same Markdown table format as the other seminars.
