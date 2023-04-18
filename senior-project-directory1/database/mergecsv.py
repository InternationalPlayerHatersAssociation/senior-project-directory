import csv

# open first csv file for reading
with open('Courses.csv', 'r') as f:
    first_reader = csv.reader(f)
    first_data = list(first_reader)

# open second csv file for reading
with open('second.csv', 'r') as f:
    second_reader = csv.reader(f)
    second_data = list(second_reader)

# compare rows from second csv file to rows in first csv file
for row in second_data:
    if row not in first_data:
        # append row to first csv file if it doesn't already exist
        with open('first.csv', 'a') as f:
            first_writer = csv.writer(f)
            first_writer.writerow(row)