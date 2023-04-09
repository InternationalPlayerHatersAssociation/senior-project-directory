import csv
import psycopg2

# Connect to the PostgreSQL database
connection = psycopg2.connect(
    dbname="course_model",
    user="postgres",
    password="N00k!e99123",
    host="localhost",
    port="5432" 
)
cursor = connection.cursor()

csv_file_path = "/Users/maxxfieldsmith/senior-project-directory/senior-project-directory1/database/UHCLCat.csv"
# Read CSV file
with open(csv_file_path, 'r') as file:
    csv_reader = csv.reader(file)
    next(csv_reader)  # Skip the header row

    for row in csv_reader:
        crn, course_code, name, days, start_time, end_time, room_num, instructor, semester, mode, status = row

        # Fetch the course_id from the courses table based on the course_code in the CSV
        cursor.execute("SELECT course_id FROM course WHERE course.number = %s", (course_code,))
        course_id = cursor.fetchone()

        if course_id is not None:
            # Insert the row into the classes table
            cursor.execute(
                """INSERT INTO course_offering (crn, course_id, course_code, name, days, start_time, end_time, room_num, instructor, semester, mode, status)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (crn, course_id[0],course_code, name, days, start_time, end_time, room_num, instructor, semester, mode, status)
            )
        else:
            print(f"Course code '{course_code}' not found in courses table")

# Commit changes and close the connection
connection.commit()
cursor.close()
connection.close()

