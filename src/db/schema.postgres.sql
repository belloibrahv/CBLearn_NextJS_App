CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  matric_number TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL DEFAULT 'Computer Science',
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sequence_no INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES modules(id),
  title TEXT NOT NULL,
  content_body TEXT NOT NULL,
  media_note TEXT,
  sequence_no INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id),
  title TEXT NOT NULL,
  pass_mark REAL NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id),
  question_text TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_option INTEGER NOT NULL,
  sequence_no INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id),
  score REAL NOT NULL,
  correct_count INTEGER NOT NULL,
  total_count INTEGER NOT NULL,
  date_taken BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  module_id INTEGER NOT NULL REFERENCES modules(id),
  status TEXT NOT NULL DEFAULT 'not_started',
  updated_at BIGINT NOT NULL
);
