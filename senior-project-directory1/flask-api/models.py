from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String, Identity
from sqlalchemy.orm import DeclarativeBase, relationship
from werkzeug.security import generate_password_hash, check_password_hash


#instantiate database
db = SQLAlchemy()

#model of student table
class Student(db.Model):
    __tablename__ = 'student'
    stuid = db.Column(db.Integer,primary_key = True)
    email = db.Column(db.String(200), unique = True, nullable = False)
    password_hash = db.Column(db.String(200), nullable = False)
    major = db.Column(db.Integer,db.ForeignKey('degree_plan.dp_id'), nullable = False)
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
class Course_Offering(db.Model):
    __tablename__ = 'course_offering'
    crn = db.Column(db.Integer, primary_key = True)
    course_id = db.Column(db.Integer,db.ForeignKey('course.course_id'), nullable = False)
    course_code = db.Column(db.String(50), nullable = False)
    name = db.Column(db.String(100), nullable = False)
    days = db.Column(db.String(5), nullable = False)
    start_time = db.Column(db.String(50), nullable = False)
    end_time = db.Column(db.String(50), nullable = False)
    room_num = db.Column(db.String (50), nullable = False)
    instructor = db.Column(db.String(50), nullable = False)
    semester = db.Column(db.String(50), nullable = False)
    mode = db.Column(db.String(50), nullable = False)
    status = db.Column(db.String(50), nullable = False)
    course = relationship("Course", backref = 'course_offering', foreign_keys = [course_id] ) 

#model of the course_history table
class Course_History(db.Model):
    __tablename__ = 'course_history'
    id = db.Column(db.Integer, primary_key = True)
    stuid = db.Column(db.Integer,db.ForeignKey('student.stuid'), nullable = False)
    course_id = db.Column(db.Integer,db.ForeignKey('course.course_id'), nullable = False)
    grade = db.Column(db.String(2), nullable = False)
    student = relationship("Student", backref = 'course_history', foreign_keys = [stuid])
    course = relationship("Course", backref='course_history', foreign_keys=[course_id])

#model of the courses_needed table
class Courses_Needed(db.Model):
    __tablename__ = 'courses_needed'
    #need to specify the primary key
    id = db.Column(db.Integer, primary_key = True)
    course_id = db.Column(db.Integer,db.ForeignKey('course.course_id'), nullable = False)
    dp_id = db.Column(db.Integer,db.ForeignKey('degree_plan.dp_id'), nullable = False)
    hours = db.Column(db.Integer, nullable = False)
    type = db.Column(db.String(10), nullable = False)
    #need two relationships because the foreign keys come from different tables. it can only belong to the same relationship if the key is coming from the same table
    course = relationship("Course", backref = 'courses_needed', foreign_keys = [course_id])
    plan = relationship("Degree_Plan", backref = 'courses_needed', foreign_keys = [dp_id])
    

#model of the conflict_table
class Conflict(db.Model):
    __tablename__ = 'conflict'
    cid = db.Column(db.Integer, primary_key = True)
    stuid = db.Column(db.Integer,db.ForeignKey('student.stuid'), nullable = False)
    name = db.Column(db.String(50), nullable = False)
    start_time = db.Column(db.String(50), nullable = False)
    end_time = db.Column(db.String(50), nullable = False)
    day = db.Column(db.String(10), nullable = False)
    conflict = relationship("Student", backref = 'conflict', foreign_keys = [stuid])

#model of the class_choices table
class Class_Choices(db.Model):
    __tablename__ = 'class_choices'
    choice_id = db.Column(db.Integer, primary_key = True)
    stuid = db.Column(db.Integer,db.ForeignKey('student.stuid'), nullable = False)
    course_name = db.Column(db.Integer,db.ForeignKey('course.name'), nullable = False)
    student = relationship("Student", backref = 'class_choices', foreign_keys = [stuid])
    class_choice = relationship("Course", backref='class_choices', foreign_keys=[course_name])
    

#model of the course table
class Course(db.Model):
    __tablename__ = 'course'
    course_id = db.Column(db.Integer, primary_key = True)
    number = db.Column(db.String(50), nullable = False)
    name = db.Column(db.String(100), nullable =False)

#model of the prereqs table
# class Prereqs(db.Model):
#     __tablename__ = 'prereqs'
#     pid = db.Column(db.Integer, primary_key = True)
#     parent_id = db.Column(db.Integer,db.ForeignKey('course.course_id'), nullable = False)
#     course_id = db.Column(db.Integer,db.ForeignKey('course.course_id'), nullable = False)
#     prereqs = relationship("Course", backref = 'prereqs', foreign_keys = [parent_id, course_id])
