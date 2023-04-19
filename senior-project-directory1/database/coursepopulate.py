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

connection.commit()

# Open the CSV file and read its contents
with open("Courses.csv", "r") as csv_file:
    csv_reader = csv.reader(csv_file)

    # Skip the header if the CSV has one
    next(csv_reader)

    # Insert each row into the 'course' table
    for row in csv_reader:
        (number,name) = row
        cursor.execute("INSERT INTO course (number, name) VALUES (%s, %s)", (number, name))

# Commit the changes and close the database connection
connection.commit()
cursor.close()
connection.close()

print("CSV data has been successfully inserted into the 'course' table.")

