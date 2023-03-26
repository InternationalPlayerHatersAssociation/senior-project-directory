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

