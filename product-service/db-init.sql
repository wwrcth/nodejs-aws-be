create extension if not exists "uuid-ossp";

create table product (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)

create table stock (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "product" ("id")
)

insert into product (title, description, price) values
('Aglaonema','Short Product Description 1', 2),
('Pothos','Short Product Description 2', 10),
('Jade Plant','Short Product Description 3', 23),
('Spider Plant','Short Product Description 4', 15),
('Peace Lily','Short Product Description 5', 23),
('Aloe','Short Product Description 6', 15),
('Dragon Tree','Short Product Description 7', 23),
('Calathea','Short Product Description 8', 15);

insert into stock (product_id, count) values
('0919bd31-954c-492e-b831-a366f4303e34', 4),
('0af9ae50-532f-438e-bcd9-e224de3187b5', 6),
('088b8d9b-2619-481f-8086-e65774bb2599', 7),
('e55c5076-0675-499f-837d-665f4a5e7e6d', 12),
('f2099cdd-dded-4b96-a823-d7c6aee4a3f1', 7),
('409c8d6d-8fad-4ee7-99b5-11d5a29912a5', 8),
('a4324362-0f30-4044-ae0b-6b284a12719e', 2),
('1c75b6a0-a36d-4e9a-a013-97631f881006', 3);
