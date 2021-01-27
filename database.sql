DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;


CREATE TABLE "recipes" (
"id" SERIAL PRIMARY KEY,
"chef_id" integer NOT NULL,
"title" text NOT NULL,
"ingredients" text[] NOT NULL,
"preparation" text[] NOT NULL,
"information" text NOT NULL,
"created_at" timestamp DEFAULT (now()),
"updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
"id" SERIAL PRIMARY KEY,
"name" text NOT NULL,
"file_id" integer NOT NULL REFERENCES "files" (id),
"created_at" timestamp DEFAULT (now())
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");


CREATE TABLE "files" (
"id" SERIAL PRIMARY KEY,
"name" text NOT NULL,
"path" text NOT NULL
);

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");


CREATE TABLE "recipe_files" (
"id" SERIAL PRIMARY KEY,
"recipe_id" integer REFERENCES recipes(id),
"file_id" integer REFERENCES files(id)
);

--

-- create procedure

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto updated_at recipes

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- cascade effect when delete recipe

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_file_id_fkey,
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;