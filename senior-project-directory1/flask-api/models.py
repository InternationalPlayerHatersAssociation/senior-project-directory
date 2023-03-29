from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String, Identity
from sqlalchemy.orm import DeclarativeBase, relationship
from werkzeug.security import generate_password_hash, check_password_hash

#instantiate database
db = SQLAlchemy()

#model of student table
class Student(db.Model):
    __tablename__ = 'student'
    stuid = db.Column(db.Integer,Identity(start=42, cycle=True),primary_key = True)
    email = db.Column(db.String(200), unique = True, nullable = False)
    password_hash = db.Column(db.String(200), nullable = False)
    major = db.Column(db.Integer,db.ForeignKey('degree_plan.dp_id'), nullable = True)
    gpa = db.Column(db.Float, nullable = True)
    #relationship between degree plan and student tables
    plans = relationship("Degree_Plan", backref = 'student', foreign_keys=[major])
    #hash password to be stored in table
    def set_password(self, password):
        return generate_password_hash(password)
    #verify password hash
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

#model of the degree_plan table
class Degree_Plan(db.Model):
    __tablename__ = 'degree_plan'
    dp_id = db.Column(db.Integer, primary_key = True)
    dpt_code = db.Column(db.String(50), nullable = False)
    name = db.Column(db.String(50), nullable = False)

#model of the Course_Offerings table
class Course_Offering(db.model):
    __tablename__ = 'course_offering'
    crn = db.Column(db.Integer, primary_key = True)
    course_id = db.Column(db.Integer, nullable = False)
    time = db.Column(db.Time, nullable = False)
    days = db.Column(db.String(5), nullable = False)
    prof = db.Column(db.String(50), nullable = False)
    semester = db.Column(db.String(50), nullable = False)
    room_num = db.Column(db.String (50), nullable = False)
    course = relationship("Course", backref = 'course_offering', foreign_keys = [course_id] ) 

#model of the course_history table
class Course_History(db.Model):
    __tablename__ = 'course_history'
    id = db.Column(db.Interger, nullable = False)
    stuid = db.Column(db.Interger, nullable = False)
    course_id = db.Column(db.Integer, nullable = False)
    grade = db.Column(db.String(2), nullable = False)
    #history = relationship("History", backref = 'course_history', foreign_key = [stuid, course_id])

#model of the courses_needed table
class Courses_Needed(db.Model):
    __tablename__ = 'courses_needed'
    id = db.Column(db.Interger, nullable = False)
    course_id = db.Column(db.Interger, nullable = False)
    dp_id = db.Column(db.Integer, nullable = False)
    type = db.Column(db.String(10), nullable = False)
    needed = relationship("Needed", backref = 'courses_needed', foreign_key = [course_id, dp_id])

#model of the conflict_table
class Conflict(db.Model):
    __tablename__ = 'conflict'
    cid = db.Column(db.Interger, nullable = False)
    stuid = db.Column(db.Interger, nullable = False)
    name = db.Column(db.String(50), nullable = False)
    time = db.Column(db.time, nullable = False)
    day = db.Column(db.String(10), nullable = False)
    conflict = relationshp("Conflict", backref = 'conflict', foreign_key = [stuid])

#model of the class_choices table
class Class_Choices(db.Model):
    __tablename__ = 'choices'
    choice_id = db.Column(db.Integer, nullable = False)
    studid = db.Column(db.Integer, nullable = False)
    crn = db.Column(db.Interger, nullable = False)
    choice = relationship("Choices", backref = 'class_choices', foreign_key = [stuid, crn])

#model of the course table
class Course(db.model):
    __tablename__ = 'course'
    course_id = db.Column(db.Integer, nullable = False)
    number = db.Column(db.String(50), nullable = False)
    name = db.Column(db.String(50), nullable =False)

#model of the prereqs table
class prereqs(db.model):
    __tablename__ = 'prereqs'
    pid = db.Column(db.Integer, nullable = False)
    parent_id = db.Column(db.Integer, nullable = False)
    course_id = db.Column(db.Interger, nullable = False)
    prereqs = relationship("prereqs", backref = 'prereqs', foreign_key = [parent_id, course_id])