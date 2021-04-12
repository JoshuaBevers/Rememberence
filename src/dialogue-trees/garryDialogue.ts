export const GarryDialogue: {
  m?: string;
  answers?: string[];
  next?: string[];
  label?: string;
}[] = [
  { m: 'Hi! My name is.. umm. This is embarassing.' },
  { m: 'I appear to have forgotten my own name.' },
  { m: 'I had it written down here somewhere' },
  {
    m: 'Hey, uhhh, do you happen to remember what my name is?',
    answers: ['Yes. It is Garry.', 'No.', 'End Conversation'],
    next: ['remembers', 'does not remember', 'end dialogue'],
    label: 'base branch',
  },
  { m: 'ah, yes. That feels familiar.', label: 'remembers' },
  {
    m: 'Thank you. I will try and remember it this time.',
  },
  { next: ['end dialogue'] },
  {
    m: 'A shame. Perhaps if you give me yours I will remember mine?',
    label: 'does not remember',
  },
  { m: 'no dice there, either, huh? Pity. What a pair we make, eh?' },
  { next: ['base branch'] },
  { label: 'end dialogue' }, // exits dialogue
];
