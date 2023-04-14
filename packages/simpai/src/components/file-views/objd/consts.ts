// ordered by bit offset
export const roomSortFlags = [
  'Kitchen',
  'Bedroom',
  'Bathroom',
  'Living room',
  'Outside',
  'Dining room',
  'Misc.',
  'Study',
  'Kids',
] as const;

// ordered by bit offset
export const functionSortFlags = [
  'Seating',
  'Surfaces',
  'Appliances',
  'Electronics',
  'Plumbing',
  'Decorative',
  'General',
  'Lights',
  'Hobbies',
  'Aspiration',
  'Career',
] as const;

// arrays ordered by bit offset; null = unused/unknown; empty array = no subsort
export const functionSubSort: Record<
  typeof functionSortFlags[number],
  readonly (string | null)[]
> = {
  Seating: [
    'Dining room',
    'Living room',
    'Sofas',
    'Beds',
    'Recreation',
    null,
    null,
    'Misc.',
  ],
  Surfaces: [
    'Counter',
    'Table',
    'End table',
    'Desk',
    'Coffee table',
    'Shelf',
    null,
    'Misc.',
  ],
  Appliances: [
    'Cooking',
    'Refrigerator',
    'Small',
    'Large',
    null,
    null,
    null,
    'Misc.',
  ],
  Electronics: [
    'Entertainment',
    'TV & computer',
    'Audio',
    'Small',
    null,
    null,
    null,
    'Misc.',
  ],
  Plumbing: [
    'Toilet',
    'Shower',
    'Sink',
    'Hot tub',
    null,
    null,
    null,
    'Misc.',
  ],
  Decorative: [
    'Wall',
    'Sculpture',
    'Rug',
    'Plant',
    'Mirror',
    'Curtain',
    null,
    'Misc.',
  ],
  General: [
    null,
    'Dresser',
    null,
    'Party',
    'Child',
    'Car',
    'Pets',
    'Misc.',
  ],
  Lights: [
    'Table lamp',
    'Floor lamp',
    'Wall lamp',
    'Ceiling lamp',
    'Outdoor',
    null,
    null,
    'Misc.',
  ],
  Hobbies: [
    'Creativity',
    'Knowledge',
    'Excercise',
    'Recreation',
    null,
    null,
    null,
    'Misc.',
  ],
  Aspiration: [],
  Career: [],
} as const;

// ordered by bit offset
export const skillFlags = [
  'Cleaning',
  'Cooking',
  'Mechanical',
  'Logic',
  'Body',
  'Creativity',
  'Charisma',
  'School study',
] as const;

// ordered by value, null = unused/unknown
export const objectTypes = [
  'Unknown',
  null,
  'Person',
  null,
  'Normal',
  'Architectural support',
  null,
  'Sim type',
  'Door',
  'Window',
  'Stairs',
  'Modular stairs',
  'Modular stairs portal',
  'Vehicle',
  'Outfit',
  'Memory',
  'Template',
  null,
  null,
  'Tiles',
];
