-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/qaCrUU
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "student" (
    "stuid" serial   NOT NULL,
    "email" varchar(200)   NOT NULL,
    "password" varchar(200)   NOT NULL,
    "major" int   NOT NULL,
    "minor" int   NULL,
    "gpa" float   NOT NULL,
    CONSTRAINT "pk_student" PRIMARY KEY (
        "stuid"
     )
);

CREATE TABLE "degree_plan" (
    "dp_id" serial   NOT NULL,
    "dpt_code" varchar(50)   NOT NULL,
    "name" varchar(50)   NOT NULL,
    CONSTRAINT "pk_degree_plan" PRIMARY KEY (
        "dp_id"
     )
);

CREATE TABLE "course_offering" (
    "crn" int   NOT NULL,
    "course_id" int   NOT NULL,
    "time" time   NOT NULL,
    "days" varchar(5)   NOT NULL,
    "delivery_type" varchar(100),
    "prof" varchar(50)   NOT NULL,
    "semester" varchar(50)   NOT NULL,
    "room_num" varchar(50)   NOT NULL,
    "prereqs" varchar(50)[]   NOT NULL,
    "coreqs" varchar(50)[]   NOT NULL,
    CONSTRAINT "pk_course_offering" PRIMARY KEY (
        "crn"
     )
);

CREATE TABLE "course_history" (
    "id" serial   NOT NULL,
    "stuid" int   NOT NULL,
    "course_id" int   NOT NULL,
    "grade" varchar(2)   NOT NULL,
    CONSTRAINT "pk_course_history" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "courses_needed" (
    "id" serial   NOT NULL,
    "course_id" int   NOT NULL,
    "dp_id" int   NOT NULL,
    "type" varchar(10)   NOT NULL,
    CONSTRAINT "pk_courses_needed" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "conflict" (
    "cid" serial   NOT NULL,
    "stuid" int   NOT NULL,
    "name" varchar(50)   NOT NULL,
    "time" time   NOT NULL,
    "day" varchar(10)   NOT NULL,
    CONSTRAINT "pk_conflict" PRIMARY KEY (
        "cid"
     )
);

CREATE TABLE "class_choices" (
    "choice_id" serial   NOT NULL,
    "stuid" int   NOT NULL,
    "crn" int   NOT NULL,
    CONSTRAINT "pk_class_choices" PRIMARY KEY (
        "choice_id"
     )
);

CREATE TABLE "course" (
    "course_id" serial   NOT NULL,
    "number" varchar(50)   NOT NULL,
    "name" varchar(50)   NOT NULL,
    CONSTRAINT "pk_course" PRIMARY KEY (
        "course_id"
     )
);

ALTER TABLE "student" ADD CONSTRAINT "fk_student_major" FOREIGN KEY("major")
REFERENCES "degree_plan" ("dp_id");

ALTER TABLE "student" ADD CONSTRAINT "fk_student_minor" FOREIGN KEY("minor")
REFERENCES "degree_plan" ("dp_id");

ALTER TABLE "student" ADD CONSTRAINT "uq_username" UNIQUE ("email");

ALTER TABLE "course_offering" ADD CONSTRAINT "fk_course_offering_course_id" FOREIGN KEY("course_id")
REFERENCES "course" ("course_id");

ALTER TABLE "course_history" ADD CONSTRAINT "fk_course_history_stuid" FOREIGN KEY("stuid")
REFERENCES "student" ("stuid");

ALTER TABLE "course_history" ADD CONSTRAINT "fk_course_history_course_id" FOREIGN KEY("course_id")
REFERENCES "course" ("course_id");

ALTER TABLE "courses_needed" ADD CONSTRAINT "fk_courses_needed_course_id" FOREIGN KEY("course_id")
REFERENCES "course" ("course_id");

ALTER TABLE "courses_needed" ADD CONSTRAINT "fk_courses_needed_dp_id" FOREIGN KEY("dp_id")
REFERENCES "degree_plan" ("dp_id");

ALTER TABLE "conflict" ADD CONSTRAINT "fk_conflict_stuid" FOREIGN KEY("stuid")
REFERENCES "student" ("stuid");

ALTER TABLE "class_choices" ADD CONSTRAINT "fk_class_choices_stuid" FOREIGN KEY("stuid")
REFERENCES "student" ("stuid");

ALTER TABLE "class_choices" ADD CONSTRAINT "fk_class_choices_crn" FOREIGN KEY("crn")
REFERENCES "course_offering" ("crn");

