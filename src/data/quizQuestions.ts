export interface QuizOption {
  key: 'A' | 'B' | 'C' | 'D'
  text: string
}

export interface QuizQuestion {
  id: number
  type: 'mc' | 'identification' | 'tf'
  section: string
  sectionBadge: string
  sectionColor: 'pink' | 'yellow' | 'mint'
  question: string
  options?: QuizOption[]
  instructions?: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'mc',
    section: 'TEST I: MULTIPLE CHOICE',
    sectionBadge: 'MULTIPLE CHOICE',
    sectionColor: 'pink',
    question: 'What is a linked list?',
    options: [
      { key: 'A', text: 'A linear data structure made of connected nodes' },
      { key: 'B', text: 'A collection stored only in consecutive memory locations' },
      { key: 'C', text: 'A data structure that stores only one value' },
      { key: 'D', text: 'A structure that cannot add or remove elements' },
    ],
  },
  {
    id: 2,
    type: 'mc',
    section: 'TEST I: MULTIPLE CHOICE',
    sectionBadge: 'MULTIPLE CHOICE',
    sectionColor: 'pink',
    question: 'Which component points to the first node of a linked list?',
    options: [
      { key: 'A', text: 'Tail' },
      { key: 'B', text: 'Head' },
      { key: 'C', text: 'NULL' },
      { key: 'D', text: 'Data' },
    ],
  },
  {
    id: 3,
    type: 'mc',
    section: 'TEST I: MULTIPLE CHOICE',
    sectionBadge: 'MULTIPLE CHOICE',
    sectionColor: 'pink',
    question: 'Which type of linked list allows traversal in both forward and backward directions?',
    options: [
      { key: 'A', text: 'Singly linked list' },
      { key: 'B', text: 'Circular singly linked list' },
      { key: 'C', text: 'Doubly linked list' },
      { key: 'D', text: 'Linear array' },
    ],
  },
  {
    id: 4,
    type: 'mc',
    section: 'TEST I: MULTIPLE CHOICE',
    sectionBadge: 'MULTIPLE CHOICE',
    sectionColor: 'pink',
    question: 'What is traversal in a linked list?',
    options: [
      { key: 'A', text: 'Removing a node' },
      { key: 'B', text: 'Changing a stored value' },
      { key: 'C', text: 'Reversing all links' },
      { key: 'D', text: 'Visiting nodes one by one' },
    ],
  },
  {
    id: 5,
    type: 'mc',
    section: 'TEST I: MULTIPLE CHOICE',
    sectionBadge: 'MULTIPLE CHOICE',
    sectionColor: 'pink',
    question: 'In a typical singly linked list, what does the last node point to?',
    options: [
      { key: 'A', text: 'The head in every case' },
      { key: 'B', text: 'NULL' },
      { key: 'C', text: 'The second node' },
      { key: 'D', text: 'The tail reference itself' },
    ],
  },

  // TEST II: IDENTIFICATION (6 - 10)
  {
    id: 6,
    type: 'identification',
    section: 'TEST II: IDENTIFICATION',
    sectionBadge: 'IDENTIFICATION',
    sectionColor: 'yellow',
    question: 'The actual value or information stored inside a node.',
    instructions: 'Identify the linked list term or component described above.',
  },
  {
    id: 7,
    type: 'identification',
    section: 'TEST II: IDENTIFICATION',
    sectionBadge: 'IDENTIFICATION',
    sectionColor: 'yellow',
    question:
      'The operation that removes a node from a linked list and adjusts the links between the remaining nodes.',
    instructions: 'Identify the linked list operation described above.',
  },
  {
    id: 8,
    type: 'identification',
    section: 'TEST II: IDENTIFICATION',
    sectionBadge: 'IDENTIFICATION',
    sectionColor: 'yellow',
    question: 'The operation that finds whether a specific value exists in a linked list.',
    instructions: 'Identify the linked list operation described above.',
  },
  {
    id: 9,
    type: 'identification',
    section: 'TEST II: IDENTIFICATION',
    sectionBadge: 'IDENTIFICATION',
    sectionColor: 'yellow',
    question:
      'The operation that changes the direction of the links so that the last node becomes the first node.',
    instructions: 'Identify the linked list operation described above.',
  },
  {
    id: 10,
    type: 'identification',
    section: 'TEST II: IDENTIFICATION',
    sectionBadge: 'IDENTIFICATION',
    sectionColor: 'yellow',
    question:
      'The term that describes how the amount of work required by an operation grows as the number of nodes increases.',
    instructions: 'Identify the algorithmic term or concept described above.',
  },

  // TEST III: TRUE OR FALSE (11 - 15)
  {
    id: 11,
    type: 'tf',
    section: 'TEST III: TRUE OR FALSE',
    sectionBadge: 'TRUE OR FALSE',
    sectionColor: 'mint',
    question: 'The nodes of a linked list must be stored in consecutive memory locations.',
    options: [
      { key: 'A', text: 'TRUE' },
      { key: 'B', text: 'FALSE' },
    ],
  },
  {
    id: 12,
    type: 'tf',
    section: 'TEST III: TRUE OR FALSE',
    sectionBadge: 'TRUE OR FALSE',
    sectionColor: 'mint',
    question: 'A doubly linked list has links to both the previous node and the next node.',
    options: [
      { key: 'A', text: 'TRUE' },
      { key: 'B', text: 'FALSE' },
    ],
  },
  {
    id: 13,
    type: 'tf',
    section: 'TEST III: TRUE OR FALSE',
    sectionBadge: 'TRUE OR FALSE',
    sectionColor: 'mint',
    question: 'In a circular singly linked list, the last node points back to the first node.',
    options: [
      { key: 'A', text: 'TRUE' },
      { key: 'B', text: 'FALSE' },
    ],
  },
  {
    id: 14,
    type: 'tf',
    section: 'TEST III: TRUE OR FALSE',
    sectionBadge: 'TRUE OR FALSE',
    sectionColor: 'mint',
    question: 'Linked lists provide faster direct index access than arrays.',
    options: [
      { key: 'A', text: 'TRUE' },
      { key: 'B', text: 'FALSE' },
    ],
  },
  {
    id: 15,
    type: 'tf',
    section: 'TEST III: TRUE OR FALSE',
    sectionBadge: 'TRUE OR FALSE',
    sectionColor: 'mint',
    question: 'Linked lists can be used to implement stacks and queues.',
    options: [
      { key: 'A', text: 'TRUE' },
      { key: 'B', text: 'FALSE' },
    ],
  },
]
