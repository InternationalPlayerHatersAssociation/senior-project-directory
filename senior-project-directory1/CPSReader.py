import tabula
import math
import re

def process_cps(current_semester, file_name):
    # get dataframe
    df = tabula.read_pdf("sampleCPS.pdf", pages = 1)
    data = df[0]

    # instantiate lists for course requests and history
    requests = []
    history = []

    # iterate through file by row
    for _, row in data.iterrows():
        class_data = row.get(1)
        if is_class(class_data) :
            (department, class_num) = parse_class(class_data)
        
            semester_data = row.get(0)
            if is_semester(semester_data):
                if semester_data == current_semester: # add to current requests
                    for num in class_num:
                        requests.append(department + " "+ num)
            else: # add to history
                for num in class_num:
                    history.append(department + " " + num)
    return (requests, history)

def is_class(s):
    return isinstance(s, str) or not math.isnan(s)
def is_semester(s):
    return s[0:2].isalpha() and s[2:4].isnumeric()

def parse_class(class_name):
    course_info = re.split('([^a-zA-Z0-9])', class_name)
    dept = ""
    num = []
    for piece in course_info:
        if len(piece) == 4:
            if piece.isupper():
                dept = piece
            elif piece.isnumeric():
                num.append(piece)
    return (dept, num)

(reqs, hist) = process_cps("SP23", "sampleCPS.pdf")
print("Course Requests: ")
for course in reqs:
    print(course)

print("Course History: ")
for course in hist:
    print(course)
