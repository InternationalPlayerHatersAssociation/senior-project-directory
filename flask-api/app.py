from flask import Flask, request, session
from .models import db, Student, Degree_Plan, Course, Courses_Needed, Course_Offering, Conflict, Class_Choices, Course_History
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask import jsonify
from flask_cors import CORS, cross_origin
from .scheduler import Scheduler
from flask.helpers import send_from_directory
from .convert_course_data import convert_course_data, process_conflict_string
from sqlalchemy.sql import text
import os
from dotenv import load_dotenv
load_dotenv()

#set up environment variables
db_host = os.environ['DB_HOST']
db_port = os.environ['DB_PORT']
db_name = os.environ['DB_NAME']
db_user = os.environ['DB_USER']
db_password = os.environ['DB_PASSWORD']
secret_key = os.environ['SECRET_KEY']

#set up app
app = Flask(__name__, static_folder='..client/build', static_url_path='/')
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
db.init_app(app)
app.config['SECRET_KEY'] = secret_key
jwt = JWTManager(app)
CORS(app)

#test api route
@app.route('/helloworld', methods =["GET"])
def helloworld():
    return jsonify({'message': 'hey'})

#registration route to add user to database
@app.route('/register', methods = ['POST'])
@cross_origin()
def register():
    data = request.json
    email, password, major = data.get('email'), data.get('password'), data.get('major')\
    #check if user exists
    if db.session.query(Student).filter_by(email = email).first():
        return jsonify({'message':'User exists! Please try another email or login.'})
    #get dp_id from degree_plan table to insert in student table as major
    major_id = db.session.query(Degree_Plan.dp_id).filter(Degree_Plan.dpt_code == major).scalar()
    #create new student object to add all properties
    student = Student(email = email,  
                      major = major_id
                      )
    student.password_hash = student.set_password(password)
    #commit student to database
    db.session.add_all([student])
    db.session.commit()
    
    return jsonify({'message':'User has been registered successfully!'})

#login route to verify username and password in the database
@app.route('/login', methods = ['POST'])
@cross_origin()
def login():
    data = request.json
    email, password = data.get('email'), data.get('password')

    if not email or not password:
        return jsonify({'message': 'Please enter an email or password'}), 401

    student = db.session.query(Student).filter_by(email=email).first()

    if not student or not student.check_password(password):
        return jsonify({'message': 'invalid email or password'}), 401

    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    session['stuid'] = student.stuid
    session['major'] = student.major

    return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

#destroy session token
@app.route('/logout', methods = ['GET'])
@cross_origin()
def logout():
    session.clear()  # Clear the entire session
    return jsonify({"message":"User has been logged out."}), 200

#create a refrese token to keep user logged in, in case the auth token expires
@app.route('/refresh', methods = ["POST"])
@cross_origin()
@jwt_required(refresh = True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({'access_token':new_access_token}), 200

#route that gets all majors to populate the dropdown list on reg page
@app.route('/majors', methods=["GET"])
@cross_origin()
def get_majors():
    majors = db.session.query(Degree_Plan.dpt_code).all()
    major_list = [major[0] for major in majors]
    
    return jsonify(major_list), 200

#route for submitting the form
@app.route('/save_user_data', methods=['POST'])
@cross_origin()
def save_data():
    data = request.json
    class_history, class_names, conflicts_list = data['history'], data['classes'], data['conflicts']
    #update database
    delete_existing_conflicts()
    update_class_history(class_history)
    update_class_choices(class_names)
    update_conflicts(conflicts_list)
    #check for invalid combinations
    conflicts = get_conflicts()
    course_data = get_course_data_by_class_names(class_names)
    formatted_classes = convert_course_data(course_data)
    
    scheduler = Scheduler(formatted_classes, conflicts)
    valid_combos = scheduler.get_valid_combinations()

    if not valid_combos:
        return handle_invalid_combos(scheduler)

    return jsonify({"message": "Saved classes successfully!"}), 200



#calculates combinations of classes in user database
@app.route('/find_combinations', methods=['GET'])
@cross_origin()
def find_combinations():
    conflicts = get_conflicts()
    class_names = get_class_names()
    
    if not class_names:
        return jsonify({'message': 'user has no classes selected'})
    
    course_data = get_course_data_by_class_names(class_names)
    formatted_classes = convert_course_data(course_data)
    scheduler = Scheduler(formatted_classes, conflicts)
    valid_combos = scheduler.get_valid_combinations()
    
    if not valid_combos:
        return jsonify({'message': 'There are no possible schedules here, please choose different courses..'}), 400

    response_data = construct_json_response(valid_combos, course_data, scheduler)
    return jsonify([conflicts, response_data]), 200



#get classes belonging to users majors
@app.route('/get_major_classes', methods = ['GET'])
@cross_origin()
def get_classes():
    classes = db.session.query(Courses_Needed, Course)\
    .join(Course, Courses_Needed.course_id == Course.course_id)\
    .filter(Courses_Needed.dp_id == session['major'])\
    .all()
    
    names = [course.name for _, course in classes]
    return jsonify(names = names), 200


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@cross_origin()
def catch_all(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
    
    
        
#refactored functions for readability
def delete_existing_conflicts():
    db.session.query(Conflict).filter(Conflict.stuid == session['stuid']).delete(synchronize_session=False)
    db.session.commit()


def update_class_history(class_history):
    hist = db.session.query(Course_History, Course)\
        .join(Course, Course_History.course_id == Course.course_id)\
        .filter(Course_History.stuid == session['stuid']).all()

    if class_history:
        for course in class_history:
            if course not in hist:
                cid = db.session.query(Course.course_id).filter(Course.name == course).one_or_none()
                item = Course_History(stuid=session['stuid'], course_id=cid[0])
                db.session.add(item)
                db.session.commit()


def update_class_choices(class_names):
    if class_names:
        db.session.query(Class_Choices).filter(Class_Choices.stuid == session['stuid']).delete(synchronize_session=False)
        for name in class_names:
            choice = Class_Choices(stuid=session['stuid'], course_name=name)
            db.session.add(choice)
            db.session.commit()


def update_conflicts(conflicts_list):
    if conflicts_list:
        processed_conflicts_list = [process_conflict_string(item) for item in conflicts_list]
        unavailable = [Conflict(stuid=session['stuid'], name="conflict",
                                start_time=conflict['start_time'], end_time=conflict['end_time'], day=conflict['day'])
                       for conflict in processed_conflicts_list]
        db.session.add_all(unavailable)
        db.session.commit()


def get_conflicts():
    conflict_query = db.session.query(Conflict).filter(Conflict.stuid == session['stuid']).all()
    conflicts_list = [row.__dict__.copy() for row in conflict_query]

    for conflict in conflicts_list:
        conflict.pop('_sa_instance_state', None)

    return {i + 1: conflict for i, conflict in enumerate(conflicts_list)}


def get_course_data_by_class_names(class_names):
    course_data = []
    for class_name in class_names:
        course_data.extend(db.session.query(Course_Offering).filter_by(name=class_name).all())
    return course_data


def handle_invalid_combos(scheduler):
    conflicting = scheduler.get_conflicting_crns()
    conflict_names = []

    for conflict in conflicting:
        name = db.session.query(Course_Offering.name).filter(Course_Offering.crn == conflict).scalar()
        if name not in conflict_names:
            conflict_names.append(name)

    conflict_names_str = ", ".join(conflict_names)
    return {'message': f'No valid schedules due to conflicts in courses: {conflict_names_str}. Please adjust inputs!'}, 400    

def get_class_names():
    class_query = db.session.query(Class_Choices.course_name).filter(Class_Choices.stuid == session['stuid']).all()
    return [row[0] for row in class_query]


def construct_json_response(valid_combos, course_data, scheduler):
    response_data = []
    for combo in valid_combos:
        crns = scheduler.generate_crns(valid_combos.index(combo), valid_combos)
        crn_list = [int(crn) for crn in crns.split(',')]
        rows = [course.__dict__ for course in course_data if course.crn in crn_list]
        for row in rows:
            row.pop('_sa_instance_state', None)
        response_data.append(rows)
    return response_data   
    

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))