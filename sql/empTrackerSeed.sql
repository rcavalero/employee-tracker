INSERT INTO department (name) values ('Management');
INSERT INTO department (name) values ('Legal');
INSERT INTO department (name) values ('Security');
INSERT INTO department (name) values ('Collections');

INSERT INTO role (title,salary,department_id) values ('President',500000 ,1);
INSERT INTO role (title,salary,department_id) values ('Vice-President',250000 ,1);
INSERT INTO role (title,salary,department_id) values ('Consigliore',150000 ,2);
INSERT INTO role (title,salary,department_id) values ('Chief Security Officer',100000 ,3);
INSERT INTO role (title,salary,department_id) values ('Collections Agent',80000 ,4);


INSERT INTO employee (first_name, last_name,role_id) values ('Vito', 'Corleone',1);
INSERT INTO employee (first_name, last_name,role_id) values ('Sonny', 'Corleone',2);
INSERT INTO employee (first_name, last_name,role_id) values ('Tom', 'Hagen',3);
INSERT INTO employee (first_name, last_name,role_id) values ('Luca', 'Brasi',4);
INSERT INTO employee (first_name, last_name,role_id) values ('Peter', 'Clemenza',5);
INSERT INTO employee (first_name, last_name,role_id) values ('Salvatore', 'Tessio',5);



