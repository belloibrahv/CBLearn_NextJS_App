const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const isPg = !!(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));

async function run() {
  if (isPg) {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const ddl = fs.readFileSync(path.join(__dirname, 'schema.postgres.sql'), 'utf8');
    await pool.query(ddl);
    await seedPg(pool);
    await pool.end();
  } else {
    const Database = require('better-sqlite3');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = process.env.SQLITE_PATH || path.join(dataDir, 'cblearn.db');
    const db = new Database(dbPath);
    const ddl = fs.readFileSync(path.join(__dirname, 'schema.sqlite.sql'), 'utf8');
    db.exec(ddl);
    seedSqlite(db);
    db.close();
  }
  console.log('Database initialised and seeded.');
}

const MODULES = [
  {
    title: '1. Introduction to Computers',
    description: 'Multimedia lesson covering the fundamentals of computer systems.',
    lessons: [
      {
        title: '1.1 What is a Computer?',
        content: 'A computer is an electronic device that accepts data as input, processes it according to a set of instructions, and produces output. Computers consist of hardware, the physical components, and software, the instructions that tell the hardware what to do.',
        media: 'Video: Introduction to Computers (07:12)',
        quiz: {
          title: 'Computer Basics Quiz',
          questions: [
            { q: 'Which of the following best defines a computer?', options: ['A device that only displays images', 'An electronic device that processes data according to instructions', 'A type of software', 'A network cable'], correct: 1 },
            { q: 'Which of these is an example of computer hardware?', options: ['An operating system', 'A keyboard', 'A spreadsheet formula', 'A web browser'], correct: 1 },
            { q: 'Software refers to:', options: ['The physical parts of a computer', 'The instructions that tell hardware what to do', 'The electricity supply', 'The monitor screen'], correct: 1 },
          ],
        },
      },
    ],
  },
  {
    title: '2. Number Systems and Data Representation',
    description: 'Interactive simulation covering binary, decimal and hexadecimal systems.',
    lessons: [
      {
        title: '2.1 Binary and Decimal Number Systems',
        content: 'Computers represent all data using the binary number system, which uses only two digits, 0 and 1. Each binary digit is called a bit. Understanding how to convert between binary and the familiar decimal system is a foundational skill in computing.',
        media: 'Interactive simulation: Binary to Decimal Converter',
        quiz: {
          title: 'Number Systems Quiz',
          questions: [
            { q: 'What is the base of the binary number system?', options: ['2', '8', '10', '16'], correct: 0 },
            { q: 'What is the decimal equivalent of the binary number 101?', options: ['3', '5', '6', '7'], correct: 1 },
            { q: 'A single binary digit is called a:', options: ['Byte', 'Nibble', 'Bit', 'Word'], correct: 2 },
          ],
        },
      },
    ],
  },
  {
    title: '3. Introduction to Computer Programming',
    description: 'Video walkthrough and interactive quiz on programming fundamentals.',
    lessons: [
      {
        title: '3.1 What is a Programming Language?',
        content: 'A programming language is a formal set of instructions used to produce various kinds of output, including software applications. Programming languages allow a developer to communicate instructions to a computer in a structured, unambiguous way.',
        media: 'Video: What is a Programming Language? (05:40)',
        quiz: {
          title: 'Programming Fundamentals Quiz',
          questions: [
            { q: 'A programming language is best described as:', options: ['A type of computer hardware', 'A formal set of instructions for producing software', 'A brand of computer', 'A file storage format'], correct: 1 },
          ],
        },
      },
      {
        title: '3.2 Variables, Data Types, and Simple Input/Output',
        content: 'A variable is a named location in computer memory used to store a value that can change while a program is running. Common data types include integers, floating-point numbers, characters, and boolean values. Choosing the appropriate data type helps a program use memory efficiently and avoid errors.',
        media: 'Video: Variables and Data Types (08:24)',
        quiz: {
          title: 'Variables and Data Types Quiz',
          questions: [
            { q: 'Which of the following best describes a variable in programming?', options: ['A fixed value that never changes during execution', 'A named memory location whose value can change during execution', 'A type of computer hardware component', 'A syntax error in the program'], correct: 1 },
            { q: 'Which data type would you use to store the value "true" or "false"?', options: ['Integer', 'Character', 'Float', 'Boolean'], correct: 3 },
            { q: 'Which of these is a floating-point number?', options: ['42', '3.14', 'True', 'A'], correct: 1 },
            { q: 'Choosing the correct data type mainly helps a program:', options: ['Run on any device automatically', 'Use memory efficiently and avoid errors', 'Connect to the internet', 'Print faster'], correct: 1 },
            { q: 'What best describes program input and output?', options: ['Input is data a program produces; output is data it receives', 'Input is data a program receives; output is data it produces', 'Both refer to the same thing', 'Neither applies to programming'], correct: 1 },
          ],
        },
      },
    ],
  },
  {
    title: '4. Data Structures and Algorithms',
    description: 'Self-paced module on organising and processing data efficiently.',
    lessons: [
      {
        title: '4.1 Introduction to Data Structures',
        content: 'A data structure is a particular way of organising data so that it can be used efficiently. Common data structures include arrays, which store elements in a fixed sequence, and lists, which can grow or shrink as needed.',
        media: 'Diagram: Arrays vs Lists',
        quiz: {
          title: 'Data Structures Quiz',
          questions: [
            { q: 'A data structure is best described as:', options: ['A way of organising data for efficient use', 'A type of computer virus', 'A programming language', 'A hardware component'], correct: 0 },
          ],
        },
      },
    ],
  },
  {
    title: '5. Database Concepts',
    description: 'Online resource library covering database fundamentals.',
    lessons: [
      {
        title: '5.1 What is a Database?',
        content: 'A database is an organised collection of structured data stored electronically, typically managed by a database management system. Databases allow information to be stored, retrieved, and updated efficiently.',
        media: 'Reading: Introduction to Databases (PDF)',
        quiz: {
          title: 'Database Concepts Quiz',
          questions: [
            { q: 'A database is best described as:', options: ['An organised collection of structured data', 'A single computer file', 'A type of programming language', 'A network protocol'], correct: 0 },
          ],
        },
      },
    ],
  },
  {
    title: '6. Introduction to the Internet',
    description: 'Self-paced module on networking and internet fundamentals.',
    lessons: [
      {
        title: '6.1 How the Internet Works',
        content: 'The internet is a global network of interconnected computers that communicate using standardised protocols. Data is broken into small packets, transmitted across the network, and reassembled at its destination.',
        media: 'Video: How the Internet Works (06:15)',
        quiz: {
          title: 'Internet Basics Quiz',
          questions: [
            { q: 'Data sent across the internet is broken into small units called:', options: ['Bytes', 'Packets', 'Pixels', 'Bits'], correct: 1 },
          ],
        },
      },
    ],
  },
];

async function seedPg(pool) {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM modules');
  if (rows[0].c > 0) return;
  for (let mi = 0; mi < MODULES.length; mi++) {
    const m = MODULES[mi];
    const modRes = await pool.query(
      'INSERT INTO modules (title, description, sequence_no) VALUES ($1,$2,$3) RETURNING id',
      [m.title, m.description, mi + 1]
    );
    const moduleId = modRes.rows[0].id;
    for (let li = 0; li < m.lessons.length; li++) {
      const l = m.lessons[li];
      const lesRes = await pool.query(
        'INSERT INTO lessons (module_id, title, content_body, media_note, sequence_no) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [moduleId, l.title, l.content, l.media, li + 1]
      );
      const lessonId = lesRes.rows[0].id;
      const quizRes = await pool.query(
        'INSERT INTO quizzes (lesson_id, title, pass_mark) VALUES ($1,$2,$3) RETURNING id',
        [lessonId, l.quiz.title, 50]
      );
      const quizId = quizRes.rows[0].id;
      for (let qi = 0; qi < l.quiz.questions.length; qi++) {
        const q = l.quiz.questions[qi];
        await pool.query(
          'INSERT INTO questions (quiz_id, question_text, options, correct_option, sequence_no) VALUES ($1,$2,$3,$4,$5)',
          [quizId, q.q, JSON.stringify(q.options), q.correct, qi + 1]
        );
      }
    }
  }
  const adminHash = bcrypt.hashSync('admin123', 10);
  await pool.query(
    'INSERT INTO users (full_name, matric_number, department, password_hash, role, created_at) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING',
    ['Administrator', 'ADMIN/0001', 'Computer Science', adminHash, 'admin', Date.now()]
  );
}

function seedSqlite(db) {
  const count = db.prepare('SELECT COUNT(*) AS c FROM modules').get().c;
  if (count > 0) return;
  const insMod = db.prepare('INSERT INTO modules (title, description, sequence_no) VALUES (?,?,?)');
  const insLes = db.prepare('INSERT INTO lessons (module_id, title, content_body, media_note, sequence_no) VALUES (?,?,?,?,?)');
  const insQuiz = db.prepare('INSERT INTO quizzes (lesson_id, title, pass_mark) VALUES (?,?,?)');
  const insQ = db.prepare('INSERT INTO questions (quiz_id, question_text, options, correct_option, sequence_no) VALUES (?,?,?,?,?)');

  const tx = db.transaction(() => {
    MODULES.forEach((m, mi) => {
      const moduleId = insMod.run(m.title, m.description, mi + 1).lastInsertRowid;
      m.lessons.forEach((l, li) => {
        const lessonId = insLes.run(moduleId, l.title, l.content, l.media, li + 1).lastInsertRowid;
        const quizId = insQuiz.run(lessonId, l.quiz.title, 50).lastInsertRowid;
        l.quiz.questions.forEach((q, qi) => {
          insQ.run(quizId, q.q, JSON.stringify(q.options), q.correct, qi + 1);
        });
      });
    });
    const adminHash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT OR IGNORE INTO users (full_name, matric_number, department, password_hash, role, created_at) VALUES (?,?,?,?,?,?)')
      .run('Administrator', 'ADMIN/0001', 'Computer Science', adminHash, 'admin', Date.now());
  });
  tx();
}

run().catch((e) => { console.error(e); process.exit(1); });
