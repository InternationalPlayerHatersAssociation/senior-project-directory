import csv

def to_military_time(time_str):
    # Split input time into hours, minutes, and AM/PM parts
    if time_str.strip().upper() == "TDB":
        return 'TDB'
    else:
        time_parts = time_str.split(":")
        hours = int(time_parts[0])
        minutes = int(time_parts[1][:2])
        am_pm = time_parts[1][2:].strip()

        # Convert to military time
        if am_pm == "PM" and hours != 12:
            hours += 12
        elif am_pm == "AM" and hours == 12:
            hours = 0

        # Combine hours and minutes as an integer
        military_time = hours * 100 + minutes

        return military_time
    
def convert_day_format(day_str):
    day_mapping = {
        'Mo': 'M',
        'Tu': 'T',
        'We': 'W',
        'Th': 'H',
        'Fr': 'F',
        'Sa': 'S',
        'Su': 'U'
    }

    new_day_str = ''
    for key, value in day_mapping.items():
        day_str = day_str.replace(key, value)
    return day_str

def convert_csv_times(input_file, output_file, start_time_col_name, end_time_col_name, day_col_name):
    with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        header = next(reader)
        writer.writerow(header)

        # Find the indices of the start, end time, and day columns
        start_time_col_idx = header.index(start_time_col_name)
        end_time_col_idx = header.index(end_time_col_name)
        day_col_idx = header.index(day_col_name)

        for row in reader:
            start_time = to_military_time(row[start_time_col_idx])
            end_time = to_military_time(row[end_time_col_idx])
            day = convert_day_format(row[day_col_idx])
            row[start_time_col_idx] = start_time
            row[end_time_col_idx] = end_time
            row[day_col_idx] = day

            writer.writerow(row)

input_file = 'UHCLCatalog.csv'
output_file = 'UHCLCat.csv'
start_time_col_name = 'start_time'  # Replace with the name of the start time column in your CSV file
end_time_col_name = 'end_time'      # Replace with the name of the end time column in your CSV file
day_col_name = 'days'                # Replace with the name of the day column in your CSV file

convert_csv_times(input_file, output_file, start_time_col_name, end_time_col_name, day_col_name)
