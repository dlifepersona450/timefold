# Adding work, posts, releases, and updates

[Documentation home](README.md) · [Learning path](learn/README.md) · [Data reference](reference/archive.md) · [Symbol index](generated/SYMBOLS.md)

An object is a collection, not a single portfolio item. Its era determines which version of that collection a visitor sees. The workstation can hold several projects; the notebook can hold blog posts; the console can link to game builds; the camera can lead to photographs or art releases.

Edit `src/archive.ts`. `eraContent[0]` belongs to 1998, `[1]` to 2012, `[2]` to 2026, and `[3]` to the imagined 2056. Keep these entries aligned with `eras` by index. An item's `date` is displayed metadata; it does not choose its era or sort the collection. Records appear in their authored array order.

These are manually authored snapshots. The app does not automatically import a CMS, repository, blog feed, or release history.

For room colors, dates, costumes, and physical object forms, use [TIMELINE.md](TIMELINE.md).

## Choose where the work belongs

Each `EraContent` entry can include a `resources` object keyed by the same stable IDs used in the room:

| Object ID  | Suggested collection                                      |
| ---------- | --------------------------------------------------------- |
| `projects` | Coding projects, tools, apps, experiments                 |
| `journal`  | Blog posts, development logs, notes, reflections          |
| `game`     | Playable builds, game releases, prototypes                |
| `photos`   | Photo albums, illustrations, art releases                 |
| `food`     | Food photography, recipes, daily rituals                  |
| `places`   | Travel posts, location albums, trip notes                 |
| `person`   | Personal notes or milestones belonging to that life stage |

These are editorial choices: an `art` resource can also live under `projects`, for example. The key chooses the object panel; `type` describes the item.

## Add a project and its progress

Inside the third `eraContent` entry, add a `resources` property alongside the existing `project`, `photos`, `journal`, and other fields. If it already exists, add the item to its `projects` array:

```ts
resources: {
  projects: [
    {
      id: 'liminal-runner',
      type: 'project',
      title: 'Liminal Runner',
      summary: 'A WebGL game about rooms that remember earlier visits.',
      date: '2026-10-21',
      status: 'Public prototype',
      progress: 72,
      url: 'https://example.com/liminal-runner',
    },
  ],
},
```

The workstation's panel shows the record for 2026. Replace the example URL with the actual destination. Keep other resources already in the collection; adding one record does not require changing the 3D object.

Every record follows the exported `ArchiveResource` type:

| Field      | Meaning                                                               |
| ---------- | --------------------------------------------------------------------- |
| `id`       | Stable identifier for this piece of work; use a short slug            |
| `type`     | `project`, `post`, `game`, `art`, `photo`, or `note`                  |
| `title`    | Visible title                                                         |
| `summary`  | Short description of this version of the work                         |
| `date`     | Authored date string; use `YYYY-MM-DD` consistently                   |
| `url`      | Optional local path or external destination                           |
| `status`   | Optional status label such as `Idea`, `In development`, or `Released` |
| `progress` | Optional completion percentage, from `0` to `100`                     |

Omit `url` for a text-only milestone. Omit `progress` when a percentage would not be useful. Status and progress are author-supplied; the app does not derive them from commits, tasks, or published builds.

## Add a blog post or development log

Add a `journal` collection inside the same `resources` object:

```ts
journal: [
  {
    id: 'fold-log-03',
    type: 'post',
    title: 'Building a room that changes with time',
    summary: 'Notes on the first playable timeline and what changed after testing.',
    date: '2026-10-21',
    status: 'Published',
    url: 'https://example.com/blog/fold-log-03',
  },
],
```

The record opens the linked article. For a short memory that should be read directly in TIMEFOLD, edit the existing `eraContent[2].journal.title`, `text`, and `reminders`. Those fields are the notebook's featured entry; resources form its additional collection.

## Link a game build or art release

Add game and art collections under the appropriate object keys:

```ts
game: [
  {
    id: 'liminal-runner-build',
    type: 'game',
    title: 'Liminal Runner — playable prototype',
    summary: 'The first public build: three rooms, one strange doorway.',
    date: '2026-10-21',
    status: 'Prototype v0.1',
    progress: 35,
    url: '/games/liminal-runner/index.html',
  },
],
photos: [
  {
    id: 'corridor-study-01',
    type: 'art',
    title: 'Corridor Study No. 01',
    summary: 'A finished illustration exploring the room before sunrise.',
    date: '2026-10-21',
    status: 'Released',
    url: '/art/corridor-study-01.png',
  },
],
```

Place the game build in `public/games/liminal-runner/` and the artwork in `public/art/`. A game hosted elsewhere can use its full external URL instead. The console's bundled fragment-collection game remains the featured interactive demo; linking a resource adds a playable destination to its collection. To replace the featured game's mechanics, edit `src/game.ts`.

To show a photo directly in the gallery, edit an item in `eraContent[n].photos.items` with `src` and `alt`; a resource link is useful for its full album or release page. The [timeline guide](TIMELINE.md#edit-the-contents-inside-an-object) includes an image example.

## Record the same project across time

Use the same `id` in each era where the project belongs. Give each record the title, summary, status, percentage, date, and link that were appropriate then. For example:

| Snapshot              | `id`             | Status            | Progress | Contents                             |
| --------------------- | ---------------- | ----------------- | -------- | ------------------------------------ |
| 2012, `eraContent[1]` | `liminal-runner` | Idea              | 10       | Early sketches and a concept post    |
| 2026, `eraContent[2]` | `liminal-runner` | Public prototype  | 72       | Playable build and current progress  |
| 2056, `eraContent[3]` | `liminal-runner` | Preserved release | 100      | An explicitly imagined retrospective |

This example is fictional; choose dates that fit your actual work. A stable ID expresses that these are versions of one project. The app renders the chosen era's snapshot; it does not automatically fill missing eras, merge records, or generate progress history.

For an update within the current era, edit that era's record and date. For a preserved earlier state, retain the old record in its original era and author the later version in a later era. Keep historical links pointed at the matching version where possible. A future state can remain clearly marked as a plan or imagined outcome.

The bundled `timefold` project demonstrates this pattern at indices `1`, `2`, and `3`, with progress `10`, `55`, and `100`. The 1998 notebook also links to a sample local post at `public/memories/first-world.html`.

## Use local assets and external links

Files inside `public/` are served from the site root:

| File on disk                             | URL in data                        |
| ---------------------------------------- | ---------------------------------- |
| `public/photos/2026-bandung.jpg`         | `/photos/2026-bandung.jpg`         |
| `public/art/corridor-study-01.png`       | `/art/corridor-study-01.png`       |
| `public/posts/progress-notes.pdf`        | `/posts/progress-notes.pdf`        |
| `public/games/liminal-runner/index.html` | `/games/liminal-runner/index.html` |

Use an `https://` URL for a website, repository, hosted article, video, release page, or game on another platform. Linked destinations open separately from the room. Replace all `example.com` values before sharing. Remote destinations require their own availability and network connection; local files are copied into the static build.

## Edit the featured memory too

Resources add a collection inside the object panel. Keep its featured content aligned with that era:

- Workstation: `project.title`, `description`, `code`, `tags`.
- Camera: `photos.medium` and `photos.items`.
- Console: `game.title`, `description`, `note`.
- Notebook: `journal.title`, `text`, `reminders`.
- Daily ritual: `food.title`, `description`, `note`, `time`, `src`, `alt`.
- Globe: entries in `places`, each with `name`, `coordinates`, and `note`.
- Person: life-stage text and appearance in `eras[n].person` and `eras[n].objectStates.person`.

The room's object names and physical forms are separate from these contents. Changing a project card does not alter the workstation mesh; changing its era can alter the form and palette around the collection.

## Check and share your update

1. Run `npm run dev` and travel to the era you edited.
2. Open the relevant object through both the room and archive index.
3. Confirm its title, date, status, progress, and destination. Open local files and external links once to catch missing assets or incorrect URLs.
4. Compare another era to ensure its earlier content still belongs to that moment.
5. Run `npm run build`, then `npm run preview` to check the static output.

All editing happens in source files. There is no admin interface, account setup, automatic publishing, or deployment step in this prototype.
