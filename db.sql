CREATE TABLE forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fields JSON NOT NULL
);

CREATE TABLE responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id INT NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  responses JSON NOT NULL,
  FOREIGN KEY (form_id) REFERENCES forms(id)
);
