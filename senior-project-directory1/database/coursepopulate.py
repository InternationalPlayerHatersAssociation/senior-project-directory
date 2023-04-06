import psycopg2
import csv
# import os

# print(os.getcwd()) # prints the current working directory

# for root, dirs, files in os.walk("."):
#     for filename in files:
#         if filename == "Courses.csv":
#             print(os.path.join(root, filename)) # prints the path of the file

connection = psycopg2.connect(
    dbname="course_model",
    user="postgres",
    password="N00k!e99123",
    host="localhost",
    port="5432"   
)

cursor = connection.cursor()

table_name = "course"
csv_file_path = "/Users/maxxfieldsmith/senior-project-directory/senior-project-directory1/flask-api/Courses.csv"

with open(csv_file_path, "r") as csv_file:
    csv_reader = csv.reader(csv_file)

    header = next(csv_reader)

    for row in csv_reader:
            insert_query = f"INSERT INTO {table_name} ({', '.join(header)}) VALUES ({', '.join(['%s']*len(header))})"
            cursor.execute(insert_query, row)
    
connection.commit()
cursor.close()
connection.close()