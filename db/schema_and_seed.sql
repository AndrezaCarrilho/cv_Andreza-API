CREATE TABLE person (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  title VARCHAR(100),
  summary TEXT
);

INSERT INTO person (name, title, summary) VALUES
('Luíze Carrilho', 'Desenvolvedora Web', 'Apaixonada por tecnologia e arte.'),
('João Pereira', 'Analista de Sistemas', 'Experiência com desenvolvimento de APIs e banco de dados.');
