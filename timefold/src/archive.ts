// All years, memories, costumes, object names, and color palettes are editable here.
// This is a fictional lifecycle, not the owner's biography.
export const objects = [
  {
    id: "projects",
    name: "The workstation",
    category: "Code & experiments",
    mark: "01",
    icon: "⌘",
    description: "The tools change. The curiosity stays.",
  },
  {
    id: "photos",
    name: "The camera",
    category: "Photographic fragments",
    mark: "02",
    icon: "◉",
    description: "A different way of holding onto light.",
  },
  {
    id: "game",
    name: "The console",
    category: "Playable experiments",
    mark: "03",
    icon: "✛",
    description: "The worlds we learn to play in.",
  },
  {
    id: "journal",
    name: "The notebook",
    category: "Notes to a future self",
    mark: "04",
    icon: "▤",
    description: "Different surfaces. The same inner voice.",
  },
  {
    id: "food",
    name: "The daily ritual",
    category: "Food & ordinary moments",
    mark: "05",
    icon: "◡",
    description: "What a morning remembers.",
  },
  {
    id: "places",
    name: "The globe",
    category: "Places & coordinates",
    mark: "06",
    icon: "◎",
    description: "The world gets bigger as we go.",
  },
  {
    id: "person",
    name: "The traveller",
    category: "A life in four chapters",
    mark: "07",
    icon: "♙",
    description: "The room remembers you changing, too.",
  },
] as const;
export type ArchiveId = (typeof objects)[number]["id"];
export interface EraTheme {
  accent: string;
  background: string;
  wall: string;
  floor: string;
  plaster: string;
  paper: string;
  metal: string;
  light: string;
  shadow: string;
  ambient: string;
  panel: string;
  text: string;
  muted: string;
}
export interface PersonState {
  age: number;
  stage: "child" | "young-adult" | "adult" | "elder";
  outfit: string;
  description: string;
  hair: string;
  top: string;
  bottom: string;
  skin: string;
}
export interface ObjectState {
  name: string;
  form: string;
  description: string;
}
export interface Era {
  year: string;
  name: string;
  phase: string;
  note: string;
  color: string;
  spectralNm: number;
  direction: string;
  theme: EraTheme;
  person: PersonState;
  objectStates: Record<ArchiveId, ObjectState>;
}
export const birthYear = 1988;
export const eras: Era[] = [
  {
    year: "1998",
    name: "The world was enormous",
    phase: "Childhood",
    note: "Age 10. Every object was a doorway to somewhere else.",
    color: "#ffc0a0",
    spectralNm: 680,
    direction: "THE DISTANT PAST / RED",
    theme: {
      accent: "#ffc0a0",
      background: "#301c22",
      wall: "#915c52",
      floor: "#704a48",
      plaster: "#c1947d",
      paper: "#edd0b0",
      metal: "#a99285",
      light: "#ffb29b",
      shadow: "#29131e",
      ambient: "#e9b4a0",
      panel: "#2c2025",
      text: "#f6e9e0",
      muted: "#cbb3ac",
    },
    person: {
      age: 1998 - birthYear,
      stage: "child",
      outfit: "Striped jumper + school backpack",
      description:
        "A small figure with a big backpack. Before there was a portfolio, there was a desk full of questions.",
      hair: "#352824",
      top: "#c5684f",
      bottom: "#3c526e",
      skin: "#c9906f",
    },
    objectStates: {
      projects: {
        name: "The family computer",
        form: "Beige CRT + keyboard",
        description:
          "A deep CRT monitor, chunky beige case, and the first lines of BASIC.",
      },
      photos: {
        name: "The film camera",
        form: "35 mm compact",
        description:
          "A silver film camera. Only twenty-four chances to get it right.",
      },
      game: {
        name: "The cartridge handheld",
        form: "Monochrome screen + D-pad",
        description:
          "A blocky handheld, a D-pad, and a whole world inside a cartridge.",
      },
      journal: {
        name: "The exercise book",
        form: "Paper + elastic strap",
        description: "Doodles, imagined maps, and notes in the margins.",
      },
      food: {
        name: "The enamel mug",
        form: "Chipped enamel",
        description: "Warm milk and toast before the school bus.",
      },
      places: {
        name: "The classroom globe",
        form: "Printed paper + wooden stand",
        description: "A world first explored with a fingertip.",
      },
      person: {
        name: "The child",
        form: "Age 10 / a world of firsts",
        description: "Everything is a first draft, including you.",
      },
    },
  },
  {
    year: "2012",
    name: "Learning to leave",
    phase: "Exploration",
    note: "Age 24. New tools, new cities, a little more courage.",
    color: "#f5d29b",
    spectralNm: 610,
    direction: "THE RECENT PAST / AMBER",
    theme: {
      accent: "#f5d29b",
      background: "#30271d",
      wall: "#8b7957",
      floor: "#6b6149",
      plaster: "#c1ae84",
      paper: "#eadbb8",
      metal: "#aaa18b",
      light: "#ffdc9a",
      shadow: "#292116",
      ambient: "#e9d2ab",
      panel: "#2b2820",
      text: "#f3ecdd",
      muted: "#c3b9a2",
    },
    person: {
      age: 2012 - birthYear,
      stage: "young-adult",
      outfit: "Casual hoodie + messenger bag",
      description:
        "The backpack has become a messenger bag. Sleeves pushed up, always halfway through a new experiment.",
      hair: "#392d27",
      top: "#6b835d",
      bottom: "#35475e",
      skin: "#c9906f",
    },
    objectStates: {
      projects: {
        name: "The first laptop",
        form: "Chunky laptop + optical drive",
        description:
          "A thick silver laptop and enough late nights to learn by making.",
      },
      photos: {
        name: "The DSLR",
        form: "Digital body + large lens",
        description:
          "Learning to see in manual mode. Every photograph is an experiment.",
      },
      game: {
        name: "The gamepad",
        form: "Twin-stick controller",
        description:
          "New dimensions, analog sticks, and the first playable prototype.",
      },
      journal: {
        name: "The field notebook",
        form: "Hardbound travel notes",
        description: "A notebook for borrowed ideas and unfamiliar streets.",
      },
      food: {
        name: "The café cup",
        form: "Glazed ceramic",
        description: "Coffee, a croissant, and a table near the wall socket.",
      },
      places: {
        name: "The travel globe",
        form: "Metal meridian + marked routes",
        description: "The places on the map begin to turn into memories.",
      },
      person: {
        name: "The explorer",
        form: "Age 24 / learning to make",
        description: "Old enough to leave, young enough to try everything.",
      },
    },
  },
  {
    year: "2026",
    name: "A world of our own",
    phase: "Present",
    note: "Age 38. Making things that feel worth keeping.",
    color: "#dce5f0",
    spectralNm: 540,
    direction: "THE PRESENT / STILL LIGHT",
    theme: {
      accent: "#dce5f0",
      background: "#292d34",
      wall: "#a4a7ab",
      floor: "#70757c",
      plaster: "#d6d6d1",
      paper: "#f0ece2",
      metal: "#aeb5c0",
      light: "#f2eee6",
      shadow: "#22242d",
      ambient: "#e5e6ec",
      panel: "#252831",
      text: "#f1f1ee",
      muted: "#bfc3cf",
    },
    person: {
      age: 2026 - birthYear,
      stage: "adult",
      outfit: "Work jacket + everyday trousers",
      description:
        "A quieter posture, a practical jacket. The things being made now have a little more intention behind them.",
      hair: "#55483d",
      top: "#8a776b",
      bottom: "#434650",
      skin: "#c9906f",
    },
    objectStates: {
      projects: {
        name: "The slim workstation",
        form: "Slim laptop + luminous screen",
        description: "A quieter machine for more ambitious worlds.",
      },
      photos: {
        name: "The mirrorless camera",
        form: "Compact mirrorless body",
        description: "A smaller camera, a more deliberate way of seeing.",
      },
      game: {
        name: "The handheld",
        form: "Wide screen + detachable controls",
        description: "An entire playable world that fits between two hands.",
      },
      journal: {
        name: "The writing tablet",
        form: "Thin tablet + stylus",
        description:
          "Paper gives way to glass. The questions are still handwritten.",
      },
      food: {
        name: "The glass brewer",
        form: "Glass cup + dark coffee",
        description:
          "Fresh coffee, an unhurried breakfast, and a familiar patch of light.",
      },
      places: {
        name: "The digital globe",
        form: "Illuminated globe + orbit grid",
        description:
          "Places collected as coordinates, photographs, and stories.",
      },
      person: {
        name: "The maker",
        form: "Age 38 / making a place",
        description:
          "Less interested in collecting tools. More interested in what they can hold.",
      },
    },
  },
  {
    year: "2056",
    name: "What we leave in the light",
    phase: "Future",
    note: "Age 68. Silver hair. New clothes. The same curious person.",
    color: "#a4d6ff",
    spectralNm: 460,
    direction: "THE IMAGINED FUTURE / BLUE",
    theme: {
      accent: "#a4d6ff",
      background: "#172a40",
      wall: "#6887a1",
      floor: "#436478",
      plaster: "#9ab7c9",
      paper: "#d4e6ed",
      metal: "#9eb9ce",
      light: "#b4dcff",
      shadow: "#111b34",
      ambient: "#b9d9fb",
      panel: "#192839",
      text: "#e6f2ff",
      muted: "#acc5dc",
    },
    person: {
      age: 2056 - birthYear,
      stage: "elder",
      outfit: "Long technical coat + luminous seams",
      description:
        "Silver hair, softer shoulders, and a coat from another decade. The body has changed; the curiosity has not.",
      hair: "#d2d6d9",
      top: "#557c9e",
      bottom: "#344e70",
      skin: "#c9906f",
    },
    objectStates: {
      projects: {
        name: "The light workstation",
        form: "Floating holographic interface",
        description:
          "The screen has become a surface of light. The work is still a conversation with an idea.",
      },
      photos: {
        name: "The light-field camera",
        form: "Floating lens + sensor ring",
        description:
          "A speculative camera that remembers a little more than a single viewpoint.",
      },
      game: {
        name: "The spatial controller",
        form: "Twin luminous control rings",
        description:
          "No cartridge, no screen. Just a pair of controls and a place to play.",
      },
      journal: {
        name: "The light pages",
        form: "Suspended translucent leaves",
        description:
          "Pages that hover. A handwriting style that still belongs to the same person.",
      },
      food: {
        name: "The future vessel",
        form: "Suspended cup + thermal ring",
        description:
          "The cup has changed. There is still a reason to take a morning slowly.",
      },
      places: {
        name: "The orbital globe",
        form: "Holographic sphere + orbit rings",
        description:
          "A familiar planet seen with a little more distance and care.",
      },
      person: {
        name: "The keeper",
        form: "Age 68 / still becoming",
        description:
          "Not a final version. A person carrying many earlier selves.",
      },
    },
  },
];

export interface PhotoMemory {
  title: string;
  caption: string;
  art: number;
  src?: string;
  alt: string;
}
export interface PlaceMemory {
  name: string;
  coordinates: string;
  note: string;
}
export interface ArchiveResource {
  id: string;
  title: string;
  summary: string;
  date: string;
  type: "project" | "post" | "game" | "art" | "photo" | "note";
  url?: string;
  status?: string;
  progress?: number;
}
export interface EraContent {
  resources?: Partial<Record<ArchiveId, ArchiveResource[]>>;
  project: {
    title: string;
    description: string;
    code: string[];
    tags: string[];
  };
  photos: { medium: string; items: PhotoMemory[] };
  game: { title: string; description: string; note: string };
  journal: { title: string; text: string; reminders: string[] };
  food: {
    title: string;
    description: string;
    note: string;
    time: string;
    src?: string;
    alt: string;
  };
  places: PlaceMemory[];
}
const photo = (title: string, caption: string, art: number): PhotoMemory => ({
  title,
  caption,
  art,
  alt: `Original layered landscape study: ${title}`,
});
export const eraContent: EraContent[] = [
  {
    resources: {
      journal: [
        {
          id: "first-world",
          title: "A secret door behind the desk",
          summary: "A sample local post attached to the childhood notebook.",
          date: "1998-09-14",
          type: "post",
          url: "/memories/first-world.html",
          status: "Archived",
        },
      ],
    },
    project: {
      title: "HELLO, WORLD",
      description:
        "A first encounter with a blinking cursor. A few lines of BASIC, saved on a disk, become proof that an idea can make something happen.",
      code: ['10 PRINT "HELLO, WORLD"', '20 PRINT "WHAT IF?"', "30 GOTO 20"],
      tags: ["BASIC", "Floppy disk", "First experiments"],
    },
    photos: {
      medium: "35 MM / TWENTY-FOUR EXPOSURES",
      items: [
        photo(
          "The end of the garden",
          "The first expedition did not need to be far from home.",
          0,
        ),
        photo(
          "A mountain in the distance",
          "A place seen through a window, then drawn from memory.",
          1,
        ),
        photo(
          "The way back",
          "The familiar route, suddenly worth a photograph.",
          2,
        ),
      ],
    },
    game: {
      title: "A cartridge-sized universe",
      description:
        "A simple world, a D-pad, and three hidden memories. The beginning of a lifelong fascination with places that live inside machines.",
      note: "1998 EDITION / THE FIRST CONTROLLER",
    },
    journal: {
      title: "When I grow up",
      text: "I want to make a game. And a camera. And a machine that remembers things for me. I drew a map of the room today. There is a secret door behind the desk.",
      reminders: [
        "Ask another question.",
        "Keep the drawings.",
        "The world is bigger than this room.",
      ],
    },
    food: {
      title: "Before the school bus",
      description:
        "Warm milk in an enamel mug. Toast on a small plate. Someone calling from the next room that it is time to go.",
      note: "The smallest rituals become the longest memories.",
      time: "07:12 AM",
      alt: "An illustrative childhood breakfast of toast and an enamel mug",
    },
    places: [
      {
        name: "The garden gate",
        coordinates: "A FIRST EXPEDITION / CLOSE TO HOME",
        note: "The edge of the known world, just beyond the gate.",
      },
      {
        name: "The school library",
        coordinates: "AISLE 03 / THE ATLAS SHELF",
        note: "Entire continents, discovered before lunch.",
      },
      {
        name: "The family road trip",
        coordinates: "THE BACK SEAT / SOMEWHERE NORTH",
        note: "Mountains framed by the car window.",
      },
    ],
  },
  {
    resources: {
      projects: [
        {
          id: "timefold",
          title: "An idea for a memory room",
          summary: "The first sketch of an archive that can be explored.",
          date: "2012-08-10",
          type: "project",
          status: "Idea",
          progress: 10,
        },
      ],
    },
    project: {
      title: "A page of my own",
      description:
        "The first personal website. An imperfect layout, a few photographs, and the thrill of putting something made by hand onto the internet.",
      code: [
        "<!doctype html>",
        "<title>A place of my own</title>",
        "<h1>Hello, internet.</h1>",
        "<!-- learning by making -->",
      ],
      tags: ["HTML + CSS", "First website", "Late nights"],
    },
    photos: {
      medium: "DIGITAL / LEARNING MANUAL",
      items: [
        photo("An unfamiliar morning", "The first trip made alone.", 1),
        photo(
          "Following a side street",
          "Taking the longer route on purpose.",
          2,
        ),
        photo("Borrowed light", "A café window and nowhere urgent to be.", 3),
      ],
    },
    game: {
      title: "My first playable prototype",
      description:
        "Three collectible fragments, a few obstacles, and a doorway. A tiny experiment made in the evenings, between everything else.",
      note: "2012 EDITION / LEARNING THE RULES",
    },
    journal: {
      title: "The beautiful unfinished",
      text: "Today the shadows were wrong, and somehow the room felt more alive. Keeping a record of the accidents. Sometimes a mistake is just an idea arriving early.",
      reminders: [
        "Make a first version.",
        "Leave room for accidents.",
        "Go somewhere unfamiliar.",
      ],
    },
    food: {
      title: "A table near the wall socket",
      description:
        "Coffee and a croissant. A laptop that needs charging. A whole afternoon borrowed from a café.",
      note: "Some projects begin with an outlet and a second cup.",
      time: "10:38 AM",
      alt: "An illustrative café breakfast with a croissant and ceramic coffee cup",
    },
    places: [
      {
        name: "Bandung, Indonesia",
        coordinates: "6.9175° S / 107.6191° E",
        note: "Mountain air and an unfamiliar afternoon.",
      },
      {
        name: "Kyoto, Japan",
        coordinates: "35.0116° N / 135.7681° E",
        note: "A side street without a destination.",
      },
      {
        name: "Bali, Indonesia",
        coordinates: "8.4095° S / 115.1889° E",
        note: "Following the light toward the water.",
      },
    ],
  },
  {
    resources: {
      projects: [
        {
          id: "timefold",
          title: "TIMEFOLD",
          summary:
            "A playable prototype with eras, changing tools, and an aging traveller.",
          date: "2026-10-21",
          type: "project",
          status: "Prototype",
          progress: 55,
        },
      ],
    },
    project: {
      title: "TIMEFOLD / a room for memories",
      description:
        "The experiments become an archive: a spatial timeline, objects with their own histories, and a room that holds more than one version of a life.",
      code: [
        "const archive = new Timefold({",
        '  tools: "always changing",',
        '  curiosity: "still here",',
        "  memories: collect(life)",
        "});",
      ],
      tags: ["Three.js", "TypeScript", "Spatial archive"],
    },
    photos: {
      medium: "MIRRORLESS / A MORE DELIBERATE EYE",
      items: [
        photo(
          "The light at home",
          "Learning that familiar places can still surprise.",
          2,
        ),
        photo("A quiet distance", "A landscape with enough room to think.", 3),
        photo(
          "Before the light changes",
          "Staying for one more photograph.",
          0,
        ),
      ],
    },
    game: {
      title: "Fragments of a place",
      description:
        "A small isometric game inside an archive of larger worlds. Collect three memories and find the doorway home.",
      note: "2026 EDITION / A WORLD OF OUR OWN",
    },
    journal: {
      title: "A place for everything",
      text: "A photograph holds a place. A project holds a season. I want this archive to hold the space between them, too. Less a list of things, more a way of remembering.",
      reminders: [
        "Notice the familiar.",
        "Make something worth keeping.",
        "Save the unfinished work, too.",
      ],
    },
    food: {
      title: "Nothing on the agenda",
      description:
        "Fresh coffee in a glass cup. A slow breakfast. A patch of light that lasts a little longer than expected.",
      note: "Some of the best things never make it onto a to-do list.",
      time: "09:14 AM",
      alt: "An illustrative slow breakfast with fresh coffee and a bowl of fruit",
    },
    places: [
      {
        name: "The city, revisited",
        coordinates: "A FAMILIAR ROUTE / A DIFFERENT EYE",
        note: "A place can change without moving.",
      },
      {
        name: "A mountain trail",
        coordinates: "OFFLINE / ABOVE THE CLOUDS",
        note: "Taking a little distance from the screen.",
      },
      {
        name: "Home, again",
        coordinates: "THE WINDOW / THE AFTERNOON LIGHT",
        note: "The place that quietly became a destination.",
      },
    ],
  },
  {
    resources: {
      projects: [
        {
          id: "timefold",
          title: "The living archive",
          summary: "An imagined future continuation of the same project.",
          date: "2056-04-06",
          type: "project",
          status: "Imagined release",
          progress: 100,
        },
      ],
    },
    project: {
      title: "The living archive",
      description:
        "An imagined future version of the archive. Tools have changed beyond recognition. Old experiments still open, and the first lines of BASIC are still here.",
      code: [
        "memory.revisit({",
        "  from: 1998,",
        '  through: "every earlier self",',
        '  preserve: ["wonder", "care"]',
        "});",
      ],
      tags: ["Speculative interface", "Light surfaces", "Long memory"],
    },
    photos: {
      medium: "LIGHT FIELD / AN IMAGINED ARCHIVE",
      items: [
        photo(
          "A place, remembered differently",
          "Looking back without trying to make time stand still.",
          3,
        ),
        photo(
          "The garden, again",
          "The old expedition, seen with an older pair of eyes.",
          0,
        ),
        photo(
          "For whoever comes next",
          "Leaving a little room in the frame.",
          1,
        ),
      ],
    },
    game: {
      title: "The same doorway",
      description:
        "The display is made of light now. But a small character is still looking for three fragments and a way home. Some good ideas outlive their machines.",
      note: "2056 EDITION / PLAY DOES NOT GET OLD",
    },
    journal: {
      title: "Still becoming",
      text: "I kept the exercise book. The machines are gone, but the questions are familiar. A younger version of me wanted to build a machine that remembers. Perhaps this room was the answer all along.",
      reminders: [
        "Call an old friend.",
        "Keep learning a new tool.",
        "Leave the room open.",
      ],
    },
    food: {
      title: "The morning still belongs to us",
      description:
        "A vessel that keeps the right warmth. Something growing by the window. A ritual recognizable across six decades.",
      note: "The future can still have an ordinary, beautiful morning.",
      time: "08:26 AM",
      alt: "A speculative future breakfast with a thermal vessel and small garden leaves",
    },
    places: [
      {
        name: "The garden, returned to",
        coordinates: "AN OLD GATE / ANOTHER GENERATION",
        note: "The edge of the world has moved.",
      },
      {
        name: "The places we kept",
        coordinates: "MEMORY LAYER / 1998—2056",
        note: "A journey measured in people as much as distance.",
      },
      {
        name: "Somewhere not yet named",
        coordinates: "AN IMAGINED FUTURE / STILL OPEN",
        note: "There is always room for another place.",
      },
    ],
  },
];
// Kept as convenient views for integrations using the original prototype's API.
export const projectStages = eraContent.map((c) => [
  c.project.title,
  c.project.description,
]);
export const journalEntries = eraContent.map((c) => [
  c.journal.title,
  c.journal.text,
]);
