const NCERT_PORTAL = 'https://ncert.nic.in/textbook.php';

const CATALOG = {
  Physics: {
    6: ['Motion and Measurement of Distances', 'Light, Shadows and Reflections', 'Electricity and Circuits', 'Fun with Magnets'],
    7: ['Heat', 'Motion and Time', 'Electric Current and Its Effects', 'Light'],
    8: ['Force and Pressure', 'Friction', 'Sound', 'Light', 'Chemical Effects of Electric Current'],
    9: ['Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound'],
    10: ['Light: Reflection and Refraction', 'The Human Eye and the Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Sources of Energy'],
    11: ['Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work, Energy and Power', 'System of Particles and Rotational Motion', 'Gravitation', 'Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter', 'Thermodynamics', 'Kinetic Theory', 'Oscillations', 'Waves'],
    12: ['Electric Charges and Fields', 'Electrostatic Potential and Capacitance', 'Current Electricity', 'Moving Charges and Magnetism', 'Magnetism and Matter', 'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves', 'Ray Optics and Optical Instruments', 'Wave Optics', 'Dual Nature of Radiation and Matter', 'Atoms', 'Nuclei', 'Semiconductor Electronics']
  },
  Chemistry: {
    6: ['Sorting Materials into Groups', 'Separation of Substances', 'Changes Around Us'],
    7: ['Acids, Bases and Salts', 'Physical and Chemical Changes', 'Winds, Storms and Cyclones', 'Water: A Precious Resource'],
    8: ['Coal and Petroleum', 'Combustion and Flame', 'Metals and Non-metals'],
    9: ['Matter in Our Surroundings', 'Is Matter Around Us Pure?', 'Atoms and Molecules', 'Structure of the Atom'],
    10: ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and Its Compounds', 'Periodic Classification of Elements'],
    11: ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements and Periodicity in Properties', 'Chemical Bonding and Molecular Structure', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry: Some Basic Principles and Techniques', 'Hydrocarbons', 'The s-Block Elements', 'The p-Block Elements', 'Environmental Chemistry'],
    12: ['Solutions', 'Electrochemistry', 'Chemical Kinetics', 'The d- and f-Block Elements', 'Coordination Compounds', 'Haloalkanes and Haloarenes', 'Alcohols, Phenols and Ethers', 'Aldehydes, Ketones and Carboxylic Acids', 'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life']
  },
  Mathematics: {
    6: ['Knowing Our Numbers', 'Whole Numbers', 'Playing with Numbers', 'Basic Geometrical Ideas', 'Understanding Elementary Shapes', 'Integers', 'Fractions', 'Decimals', 'Data Handling', 'Mensuration', 'Algebra', 'Ratio and Proportion', 'Symmetry', 'Practical Geometry'],
    7: ['Integers', 'Fractions and Decimals', 'Data Handling', 'Simple Equations', 'Lines and Angles', 'The Triangle and Its Properties', 'Congruence of Triangles', 'Comparing Quantities', 'Rational Numbers', 'Practical Geometry', 'Perimeter and Area', 'Algebraic Expressions', 'Exponents and Powers', 'Symmetry', 'Visualising Solid Shapes'],
    8: ['Rational Numbers', 'Linear Equations in One Variable', 'Understanding Quadrilaterals', 'Practical Geometry', 'Data Handling', 'Squares and Square Roots', 'Cubes and Cube Roots', 'Comparing Quantities', 'Algebraic Expressions and Identities', 'Visualising Solid Shapes', 'Mensuration', 'Exponents and Powers', 'Direct and Inverse Proportions', 'Factorisation', 'Introduction to Graphs', 'Playing with Numbers'],
    9: ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations in Two Variables', 'Introduction to Euclid’s Geometry', 'Lines and Angles', 'Triangles', 'Quadrilaterals', 'Circles', 'Heron’s Formula', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
    10: ['Real Numbers', 'Polynomials', 'Pair of Linear Equations in Two Variables', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Introduction to Trigonometry', 'Some Applications of Trigonometry', 'Circles', 'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
    11: ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Principle of Mathematical Induction', 'Complex Numbers and Quadratic Equations', 'Linear Inequalities', 'Permutations and Combinations', 'Binomial Theorem', 'Sequences and Series', 'Straight Lines', 'Conic Sections', 'Introduction to Three Dimensional Geometry', 'Limits and Derivatives', 'Mathematical Reasoning', 'Statistics', 'Probability'],
    12: ['Relations and Functions', 'Inverse Trigonometric Functions', 'Matrices', 'Determinants', 'Continuity and Differentiability', 'Application of Derivatives', 'Integrals', 'Application of Integrals', 'Differential Equations', 'Vector Algebra', 'Three Dimensional Geometry', 'Linear Programming', 'Probability']
  },
  Biology: {
    6: ['Components of Food', 'The Living Organisms and Their Surroundings', 'Body Movements', 'Getting to Know Plants'],
    7: ['Nutrition in Plants', 'Nutrition in Animals', 'Respiration in Organisms', 'Transportation in Animals and Plants', 'Reproduction in Plants', 'Forests: Our Lifeline'],
    8: ['Crop Production and Management', 'Microorganisms: Friend and Foe', 'Conservation of Plants and Animals', 'Cell—Structure and Functions', 'Reproduction in Animals', 'Reaching the Age of Adolescence'],
    9: ['The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms', 'Why Do We Fall Ill?', 'Natural Resources', 'Improvement in Food Resources'],
    10: ['Life Processes', 'Control and Coordination', 'How Do Organisms Reproduce?', 'Heredity', 'Our Environment', 'Sustainable Management of Natural Resources'],
    11: ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation in Animals', 'Cell: The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division', 'Transport in Plants', 'Mineral Nutrition', 'Photosynthesis in Higher Plants', 'Respiration in Plants', 'Plant Growth and Development', 'Digestion and Absorption', 'Breathing and Exchange of Gases', 'Body Fluids and Circulation', 'Excretory Products and Their Elimination', 'Locomotion and Movement', 'Neural Control and Coordination', 'Chemical Coordination and Integration'],
    12: ['Sexual Reproduction in Flowering Plants', 'Human Reproduction', 'Reproductive Health', 'Principles of Inheritance and Variation', 'Molecular Basis of Inheritance', 'Evolution', 'Human Health and Disease', 'Strategies for Enhancement in Food Production', 'Microbes in Human Welfare', 'Biotechnology: Principles and Processes', 'Biotechnology and Its Applications', 'Organisms and Populations', 'Ecosystem', 'Biodiversity and Conservation', 'Environmental Issues']
  }
};

const SUBJECT_DESCRIPTIONS = {
  Physics: 'Motion, forces, energy, waves, electricity and modern physics',
  Chemistry: 'Matter, reactions, periodicity, organic chemistry and applications',
  Mathematics: 'Numbers, algebra, geometry, calculus, statistics and probability',
  Biology: 'Living systems, cells, diversity, heredity, physiology and ecology'
};

const TOPIC_WORDS = {
  Physics: ['definitions and units', 'laws and principles', 'diagrams and graphs', 'worked applications', 'common misconceptions'],
  Chemistry: ['key terms and symbols', 'properties and classification', 'equations and reactions', 'laboratory observations', 'applications and safety'],
  Mathematics: ['definitions and notation', 'core identities or theorems', 'standard methods', 'worked examples', 'exam checks'],
  Biology: ['key terms and structures', 'process sequence', 'diagrams and comparisons', 'functions and applications', 'health or environment links']
};

function chapterTopics(subject, name) {
  const lower = name.toLowerCase();
  const specific = {
    'motion': ['distance, displacement and speed', 'velocity and acceleration', 'motion graphs', 'equations of motion'],
    'electricity': ['charge and current', 'potential difference', 'resistance and circuits', 'electrical power'],
    'chemical reactions and equations': ['balancing equations', 'reaction types', 'oxidation and reduction', 'energy changes'],
    'cell': ['cell membrane and transport', 'organelles', 'cell division', 'plant and animal cells'],
    'life processes': ['nutrition', 'respiration', 'transport', 'excretion'],
    'trigonometric': ['ratios and identities', 'graphs', 'equations', 'applications'],
    'probability': ['sample spaces', 'events', 'conditional probability', 'random variables']
  };
  const match = Object.keys(specific).find(key => lower.includes(key));
  return match ? specific[match] : TOPIC_WORDS[subject].map(topic => `${topic} in ${name}`);
}

function chapterNote(subject, name, topics) {
  const focus = {
    Physics: `Study ${name} by defining each physical quantity, writing its SI unit, and connecting the law to a labelled diagram or graph. Derive or recall the standard relation only after identifying the assumptions behind it. For numerical questions, write known values, convert units, select the equation, substitute with signs, and check dimensions.`,
    Chemistry: `For ${name}, begin with the particle-level idea and then connect it to observations, symbols and equations. Keep a small table of definitions, trends, conditions and exceptions. Balance every equation, identify the reaction type or functional group, and distinguish an observation from an explanation.`,
    Mathematics: `For ${name}, keep notation precise and write the condition under which each theorem, identity or algorithm applies. A reliable solution should show the method, intermediate steps and a final check. Practise one direct example, one mixed example and one application problem for each major idea.`,
    Biology: `For ${name}, learn the sequence of the process, the structure responsible for each step and the reason the step matters. Use labelled diagrams and comparison tables. Link each definition to an example, and revise cause-and-effect questions rather than memorising isolated sentences.`
  }[subject];
  return `${focus}\n\nKey study points:\n• ${topics.join('\n• ')}\n\nRevision checklist:\n• Define the central terms in your own words.\n• Draw or work through one representative example.\n• Compare the closest related concepts.\n• Attempt the chapter practice before checking the explanation.`;
}

function questionSet(subject, name, topics, key) {
  const prompt = subject === 'Mathematics'
    ? `Which study action is most appropriate when solving a problem from ${name}?`
    : `Which statement best describes a reliable way to study ${name}?`;
  const options = subject === 'Mathematics'
    ? ['State the method and show the conditions', 'Skip all working', 'Change units randomly', 'Use a formula without checking it']
    : ['Connect terms, evidence and applications', 'Memorise an isolated keyword only', 'Ignore units or diagrams', 'Treat every example as an exception'];
  return [
    { label: 'Exam-Style', prompt, options, correctIndex: 0, explanation: `A complete answer for ${name} should use the relevant method or concept with its conditions and supporting work.` },
    { label: 'Practice', prompt: `Which topic belongs directly to ${name}?`, options: [topics[0], 'Unrelated historical dates', 'A different subject unit', 'None of the chapter topics'], correctIndex: 0, explanation: `${topics[0]} is one of the mapped topics for ${name}.` },
    { label: 'Practice', prompt: `A useful first revision step for ${name} is to:`, options: ['Define the key terms and scope', 'Avoid the chapter headings', 'Skip examples', 'Remove all diagrams'], correctIndex: 0, explanation: 'Clear definitions establish the scope before detailed practice.' }
  ];
}

function makeChapter(classNumber, subject, number, name) {
  const id = `${subject.toLowerCase()}-${classNumber}-${number}`;
  const topics = chapterTopics(subject, name);
  const search = encodeURIComponent(`NCERT CBSE Class ${classNumber} ${subject} ${name} lecture`);
  return {
    id,
    number,
    name,
    topics,
    notes: [{ id: `${id}-notes`, title: `${name} notes`, type: 'Notes', content: chapterNote(subject, name, topics) }],
    resources: [
      { id: `${id}-ncert`, title: 'Official NCERT textbook portal', type: 'Reference', url: NCERT_PORTAL, availability: 'Available' },
      { id: `${id}-lecture`, title: `Lecture search: ${name}`, type: 'Lecture search', url: `https://www.youtube.com/results?search_query=${search}`, availability: 'Available' }
    ],
    questions: questionSet(subject, name, topics, id)
  };
}

const CURRICULUM = {};
for (let classNumber = 6; classNumber <= 12; classNumber += 1) {
  CURRICULUM[classNumber] = { label: `Class ${classNumber}`, subjects: {} };
  Object.entries(CATALOG).forEach(([subject, classCatalog]) => {
    CURRICULUM[classNumber].subjects[subject] = {
      description: SUBJECT_DESCRIPTIONS[subject],
      chapters: classCatalog[classNumber].map((name, index) => makeChapter(classNumber, subject, index + 1, name))
    };
  });
}

// Preserve the dashboard's existing Class 11 deep links.
CURRICULUM[11].subjects.Biology.chapters[1].id = 'biology-11-2';
CURRICULUM[11].subjects.Biology.chapters[1].notes[0].id = 'biology-11-2-notes';
CURRICULUM[11].subjects.Chemistry.chapters[2].id = 'chemistry-11-3';
CURRICULUM[11].subjects.Chemistry.chapters[2].notes[0].id = 'chemistry-11-3-notes';

const RESOURCES = {
  notes: { title: 'NCERT Notes', desc: 'Chapter-wise notes aligned to the selected syllabus.' },
  videos: { title: 'Lecture Library', desc: 'Chapter-specific lecture and reference searches.' },
  pyq: { title: 'PYQ-Style Practice', desc: 'Exam-style prompts; no unverified question is presented as an actual PYQ.' },
  practice: { title: 'Practice Bank', desc: 'MCQ and application practice sessions.' },
  tests: { title: 'Exam-Style Tests', desc: 'Local tests assembled from chapter practice questions.' },
  important: { title: 'Important Questions', desc: 'Exam-focused prompts for revision and application.' }
};

window.CURRICULUM = CURRICULUM;
window.RESOURCES = RESOURCES;
