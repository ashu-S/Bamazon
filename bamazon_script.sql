
-- Create a MySQL Database called bamazon.
create database bamazon;

-- Then create a Table inside of that database called products.

use bamazon;
create table products(
item_id INT(11) auto_increment unique NOT NULL,
product_name varchar(25) not null,
department_name varchar(20) not null,
price decimal(4,2) not null,
stock_quantity int(6) not null,
PRIMARY KEY (item_id)
);

USE bamazon;
alter table products
modify column price DECIMAL(6,2) not null;

-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows
-- into this database and table).

use bamazon;
insert into products ( product_name,department_name,price,stock_quantity)
values ("iPhone 7/7 Plus","Electronics",867.00,100),
	   ("Apple iPhone 7","Electronics",559.99,100),
       ("Samsung Galaxy S8","Electronics",696.90,100),
       ("wall clocks","Home Decor",22.99,50),
       ("Artificial Plants","Home Decor",13.99,75),
       ("Area rugs","Home Decor",196.02,120),
       ("Davidoff fragrance","personal care",25.99,150),
       ("Chrome Azzaro","personal care",23.48,100),
       ("Escada Turquoise","personal care",53.76,100),
       ("RALPH LAUREN fragrance","personal care",49.99,100);
       
select * from products;


use bamazon;
insert into products ( product_name,department_name,price,stock_quantity)
values ("iPhone 7/7 Plus","Electronics",867.00,100),
	   ("Apple iPhone 7","Electronics",559.99,100),
       ("Samsung Galaxy S8","Electronics",696.90,100),
       ("wall clocks","Home Decor",22.99,50),
       ("Artificial Plants","Home Decor",13.99,75),
       ("Area rugs","Home Decor",196.02,120),
       ("Davidoff fragrance","personal care",25.99,150),
       ("Chrome Azzaro","personal care",23.48,100),
       ("Escada Turquoise","personal care",53.76,100),
       ("RALPH LAUREN fragrance","personal care",49.99,100);
       
select * from products;

-- alter products table to add new col product_sales
USE bamazon;
alter table products
add column product_sales DECIMAL(10,2) null;




use bamazon;
create table departments(
department_id int(11) auto_increment not null unique,
department_name varchar(25) not null,
over_head_costs int(7) not null,
primary key (department_id)
);

use bamazon;
insert into departments ( department_name,over_head_costs)
values ("Electronics",867.00),
	   ("Apparel",559.99),
       ("Electronics",696.90),
       ("Home Decor",22.99),
       ("personal care",25.99);
       
select * from departments;


