CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Michael Chan', 'https://reactpatterns.com/', 'React patterns', 18);
INSERT INTO blogs (author, url, title, likes) VALUES ('Edsger W. Dijkstra', 'https://www.u.arizona.edu/~robinson/copyright_violations/Go_To_Considered_Harmful.html', 'Go To Statement Considered Harmful', 10);