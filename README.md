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

To update a person, edit their section in `docs/people.md`. Images keep their original proportions, without a fixed height or cropping. Portraits should preferably show the face clearly in the source image. The same rule applies to speaker photos in the seminar tables.

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
