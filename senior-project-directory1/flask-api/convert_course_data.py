from collections import defaultdict

def convert_course_data(course_data):
    grouped_courses = defaultdict(list)
    
    for course in course_data:
        if course.days != "TBD":
            try:
                start_time = int(course.start_time)
                end_time = int(course.end_time)
                grouped_courses[course.name].append({
                    "crn": course.crn,
                    "start": start_time,
                    "end": end_time,
                    "day": course.days
                })
            except ValueError:
                # Skip the course if start_time or end_time cannot be converted to an integer
                pass

    result = {}
    for index, course_sections in enumerate(grouped_courses.values()):
        if len(course_sections) == 1:
            result[index + 1] = {1: course_sections[0]}
        else:
            result[index + 1] = {i + 1: section for i, section in enumerate(course_sections)}

    return result


def process_conflict_string(conflict_string):
    days = {
        "Monday": "M",
        "Tuesday": "T",
        "Wednesday": "W",
        "Thursday": "H",
        "Friday": "F",
    }

    day, times = conflict_string.split(", ")
    start_time, end_time = times.split(" - ")
    start_time = int(start_time.replace(":", ""))
    end_time = int(end_time.replace(":", ""))

    return {
        "day": days[day],
        "start_time": start_time,
        "end_time": end_time,
    }

