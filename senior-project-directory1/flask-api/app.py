from flask import Flask, request
from models import db, Student, Degree_Plan
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask import jsonify
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:shannon@localhost:5432/class_schedule'
app.config['FLASK APP'] = app
app.config['SECRET_KEY'] = '1d387a4ec8206070645d8c87'
db.init_app(app)
jwt = JWTManager(app)
CORS(app)

#test api route
@app.route('/helloworld', methods =["GET"])
def helloworld():
    return jsonify({'message': 'hey'})

#registration route to add user to database
@app.route('/register', methods = ['POST'])
def register():
    #get email and password from http request (change this to request.json when integrating front end, args is only for testing)
    email = request.json.get('email')
    password = request.json.get('password')
    major = request.json.get('major')
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
    #not sure if this is the correct thing to return
    return jsonify({'message':'User has been registered successfully!'})

#login route to verify username and password in the database
@app.route('/login', methods = ['POST'])
def login():
    #get email and password from http request 
    email = request.json.get('email')
    password = request.json.get('password')
    #if email is not in json data return an error (should probably just check this on the front end before sending)
    if not email or not password:
        return jsonify({'message':'Please enter an email or password'})
    #pull occurrence of user out of the database
    student = db.session.query(Student).filter_by(email = email).first()
    #verify password hash, if invalid return invalid
    if  not student or not student.check_password(password):
        return jsonify({'message':'invalid email or password'})
    #create a json web token for user to access private pages
    access_token = create_access_token(identity = email)
    refresh_token = create_refresh_token(identity = email)
    #if user is valid provide token to access private pages
    return jsonify({"access_token": access_token, "refresh_token": refresh_token})

#create a refrese token to keep user logged in, in case the auth token expires
@app.route('/refresh', methods = ["POST"])
@jwt_required(refresh = True)
def post():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({'access_token':new_access_token})

#route that gets all majors to populate the dropdown list
@app.route('/majors', methods=["GET"])
def get_majors():
    majors = db.session.query(Degree_Plan.dpt_code).all()
    major_list = [major[0] for major in majors]
    
    return jsonify(major_list)
        
    

    
if __name__ == '__main__':
    app.run(debug = True)