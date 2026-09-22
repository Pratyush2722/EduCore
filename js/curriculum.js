const TODO_CHAPTER = (classNumber, subject) => ({
  id: `${subject.toLowerCase()}-${classNumber}-todo`,
  name: 'TODO: Chapter data to be populated',
  topics: [],
  status: 'todo',
  note: 'The original project did not contain verified chapter/topic data for this subject yet.'
});

const CURRICULUM = {
  6: {
    label: 'Class 6',
    subjects: {
      Physics: { description: 'TODO: Physics chapter data to be populated.', chapters: [TODO_CHAPTER(6, 'physics')] },
      Chemistry: { description: 'TODO: Chemistry chapter data to be populated.', chapters: [TODO_CHAPTER(6, 'chemistry')] },
      Mathematics: { description: 'Number System • Algebra • Geometry • Data Handling', chapters: [TODO_CHAPTER(6, 'mathematics')] },
      Biology: { description: 'TODO: Biology chapter data to be populated.', chapters: [TODO_CHAPTER(6, 'biology')] }
    },
    legacySubjects: {
      English: 'Reading • Writing • Grammar • Literature',
      Science: 'Materials • Living World • Earth & Space',
      'Social Science': 'History • Geography • Civics'
    }
  },
  7: {
    label: 'Class 7',
    subjects: {
      Physics: { description: 'TODO: Physics chapter data to be populated.', chapters: [TODO_CHAPTER(7, 'physics')] },
      Chemistry: { description: 'TODO: Chemistry chapter data to be populated.', chapters: [TODO_CHAPTER(7, 'chemistry')] },
      Mathematics: { description: 'Integers • Fractions • Algebra • Geometry', chapters: [TODO_CHAPTER(7, 'mathematics')] },
      Biology: { description: 'TODO: Biology chapter data to be populated.', chapters: [TODO_CHAPTER(7, 'biology')] }
    },
    legacySubjects: {
      English: 'Reading • Writing • Grammar • Literature',
      Science: 'Physical • Chemical • Biological world',
      'Social Science': 'History • Geography • Civics'
    }
  },
  8: {
    label: 'Class 8',
    subjects: {
      Physics: { description: 'TODO: Physics chapter data to be populated.', chapters: [TODO_CHAPTER(8, 'physics')] },
      Chemistry: { description: 'TODO: Chemistry chapter data to be populated.', chapters: [TODO_CHAPTER(8, 'chemistry')] },
      Mathematics: { description: 'Rational numbers • Algebra • Geometry • Data', chapters: [TODO_CHAPTER(8, 'mathematics')] },
      Biology: { description: 'TODO: Biology chapter data to be populated.', chapters: [TODO_CHAPTER(8, 'biology')] }
    },
    legacySubjects: {
      English: 'Reading • Writing • Grammar • Literature',
      Science: 'Physics • Chemistry • Biology concepts',
      'Social Science': 'History • Geography • Civics'
    }
  },
  9: {
    label: 'Class 9',
    subjects: {
      Physics: { description: 'TODO: Physics chapter data to be populated.', chapters: [TODO_CHAPTER(9, 'physics')] },
      Chemistry: { description: 'TODO: Chemistry chapter data to be populated.', chapters: [TODO_CHAPTER(9, 'chemistry')] },
      Mathematics: { description: 'Number • Algebra • Geometry • Statistics', chapters: [TODO_CHAPTER(9, 'mathematics')] },
      Biology: { description: 'TODO: Biology chapter data to be populated.', chapters: [TODO_CHAPTER(9, 'biology')] }
    },
    legacySubjects: {
      English: 'Language skills • Literature • Competency-based reading',
      Science: 'Matter • The living world • Natural phenomena',
      'Social Science': 'History • Geography • Political Science'
    }
  },
  10: {
    label: 'Class 10',
    subjects: {
      Physics: { description: 'TODO: Physics chapter data to be populated.', chapters: [TODO_CHAPTER(10, 'physics')] },
      Chemistry: { description: 'TODO: Chemistry chapter data to be populated.', chapters: [TODO_CHAPTER(10, 'chemistry')] },
      Mathematics: { description: 'Number Systems • Algebra • Geometry • Trigonometry', chapters: [TODO_CHAPTER(10, 'mathematics')] },
      Biology: { description: 'TODO: Biology chapter data to be populated.', chapters: [TODO_CHAPTER(10, 'biology')] }
    },
    legacySubjects: {
      English: 'Reading • Writing • Literature',
      Science: 'Chemical substances • Life processes • Natural phenomena',
      'Social Science': 'History • Geography • Political Science • Economics'
    }
  },
  11: {
    label: 'Class 11',
    subjects: {
      Biology: {
        description: 'Diversity • Cell • Plant • Human physiology',
        chapters: [{
          id: 'biology-11-2', number: 2, name: 'Biological Classification',
          topics: ['Five kingdom classification', 'Monera', 'Protista', 'Fungi', 'Viruses and viroids'],
          notes: [{ id: 'biology-11-2-notes', title: 'Biological Classification notes', type: 'Notes', content: 'Review the five-kingdom framework, defining features of Monera, Protista and Fungi, and the distinction between viruses and viroids.' }],
          resources: [{ id: 'biology-11-2-lecture', title: 'Biological Classification lecture', type: 'Lecture', url: '', availability: 'Demo/local resource' }],
          questions: [{ id: 'biology-11-2-q1', label: 'Sample Practice', prompt: 'Which group contains organisms that are generally prokaryotic?', options: ['Monera', 'Protista', 'Fungi', 'Plantae'], correctIndex: 0, explanation: 'Monera contains prokaryotic organisms.' }]
        }]
      },
      Chemistry: {
        description: 'Physical • Inorganic • Organic chemistry',
        chapters: [{
          id: 'chemistry-11-3', number: 3, name: 'Classification of Elements',
          topics: ['Periodic table', 'Periodic trends', 'Metals and non-metals', 'Modern periodic laws'],
          notes: [{ id: 'chemistry-11-3-notes', title: 'Classification of Elements notes', type: 'Notes', content: 'Review the modern periodic law, the organization of the periodic table, and common periodic trends.' }],
          resources: [{ id: 'chemistry-11-3-lecture', title: 'Classification of Elements lecture', type: 'Lecture', url: '', availability: 'Demo/local resource' }],
          questions: [{ id: 'chemistry-11-3-q1', label: 'Sample Practice', prompt: 'The modern periodic table is arranged primarily by increasing:', options: ['Atomic mass', 'Atomic number', 'Density', 'Melting point'], correctIndex: 1, explanation: 'The modern periodic law uses atomic number as the basis of arrangement.' }]
        }]
      },
      Physics: {
        description: 'Units • Motion • Waves • Electricity',
        chapters: [{
          id: 'physics-11-motion-example', name: 'Motion in a Straight Line',
          topics: ['Velocity and acceleration', 'Kinematics', 'Graphs of motion', 'Equations of motion'],
          status: 'example', note: 'Preserved from the existing Physics example; chapter placement is not verified.',
          notes: [{ id: 'physics-11-motion-notes', title: 'Motion in a Straight Line notes', type: 'Notes', content: 'Review velocity, acceleration, kinematics graphs and the equations of motion.' }],
          resources: [{ id: 'physics-11-motion-lecture', title: 'Motion in a Straight Line lecture', type: 'Lecture', url: '', availability: 'Demo/local resource' }],
          questions: [{ id: 'physics-11-motion-q1', label: 'Sample Practice', prompt: 'The slope of a position-time graph represents:', options: ['Acceleration', 'Velocity', 'Displacement', 'Jerk'], correctIndex: 1, explanation: 'The slope of a position-time graph gives velocity.' }]
        }]
      },
      Mathematics: {
        description: 'Sets • Algebra • Calculus • Statistics',
        chapters: [{
          id: 'mathematics-11-relations-example', name: 'Relations and Functions',
          topics: ['Domain and range', 'Types of functions', 'Graphs', 'Mappings'],
          status: 'example', note: 'Preserved from the existing Mathematics example; chapter placement is not verified.',
          notes: [{ id: 'mathematics-11-relations-notes', title: 'Relations and Functions notes', type: 'Notes', content: 'Review domain, range, mappings, types of functions and basic graph interpretation.' }],
          resources: [{ id: 'mathematics-11-relations-lecture', title: 'Relations and Functions lecture', type: 'Lecture', url: '', availability: 'Demo/local resource' }],
          questions: [{ id: 'mathematics-11-relations-q1', label: 'Sample Practice', prompt: 'The set of all possible input values of a function is its:', options: ['Range', 'Codomain', 'Domain', 'Image'], correctIndex: 2, explanation: 'The domain is the set of permitted input values.' }]
        }]
      }
    }
  },
  12: {
    label: 'Class 12',
    subjects: {
      Biology: { description: 'Reproduction • Genetics • Evolution • Ecology', chapters: [TODO_CHAPTER(12, 'biology')] },
      Chemistry: { description: 'Electrochemistry • Organic chemistry • Biomolecules', chapters: [TODO_CHAPTER(12, 'chemistry')] },
      Physics: { description: 'Electrostatics • Current • Magnetism • Optics', chapters: [TODO_CHAPTER(12, 'physics')] },
      Mathematics: { description: 'Relations • Calculus • Vectors • Probability', chapters: [TODO_CHAPTER(12, 'mathematics')] }
    }
  }
};

const RESOURCES = {
  notes: { title: 'NCERT Notes', desc: 'Chapter-wise notes aligned to the selected syllabus.' },
  videos: { title: 'Lecture Library', desc: 'Short concept videos with revision checkpoints.' },
  pyq: { title: 'PYQ Practice', desc: 'Previous question style prompts for board-oriented revision.' },
  practice: { title: 'Practice Bank', desc: 'MCQ, short-answer and application practice sessions.' },
  tests: { title: 'Mock Tests', desc: 'Timed tests across key chapters and competency areas.' },
  important: { title: 'Important Questions', desc: 'Exam-focused prompts for revision and application.' }
};

window.CURRICULUM = CURRICULUM;
window.RESOURCES = RESOURCES;
