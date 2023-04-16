import csv
import psycopg2

def read_csv_and_insert_data(file_path, dp_id, conn):
    with open(file_path, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            code = row['code']
            hours = row['hours']
            type = row['type']

            course_id = get_course_id(conn, code)
            if course_id:
                insert_course(conn, course_id, dp_id, hours, type)
            else:
                print("Course %s not found", code)

def get_course_id(conn, course_code):
    cur = conn.cursor()
    query = '''
        SELECT course_id
        FROM course
        WHERE number = %s;
    '''
    cur.execute(query, (course_code,))
    result = cur.fetchone()
    
    if result is not None:
        return result[0]
    else:
        return None

def insert_course(conn, course_id, dp_id, hours, type):
    cur = conn.cursor()
    query = '''
        INSERT INTO courses_needed (course_id, dp_id, hours, type)
        VALUES (%s, %s, %s, %s);
    '''
    cur.execute(query, (course_id, dp_id, hours, type))
    conn.commit()

def add_matching_courses(conn, degree_plan):
    cur = conn.cursor()
    query = '''
        INSERT INTO courses_needed (course_id, dp_id, hours, type)
        SELECT course.course_id, %s, 3, 'ELEC'
        FROM course
        WHERE course.number ~* '^(CENG 3|CENG 4|CSCI 3|CSCI 4)';
    '''
    cur.execute(query, (degree_plan,))
    conn.commit()


def main():
    conn = psycopg2.connect(
        database="course_model", 
        user="postgres", 
        password="N00k!e99123", 
        host="localhost", 
        port="5432"
        )
    
    csv_file_path = "CENG.csv"
    degree_plan = 2

    read_csv_and_insert_data(csv_file_path, degree_plan, conn)
    add_matching_courses(conn, degree_plan)

    conn.close()

if __name__ == "__main__":
    main()