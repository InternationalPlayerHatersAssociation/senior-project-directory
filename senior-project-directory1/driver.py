from Section import Section
from Course import Course
from Student import Student
from Event import Event
from DegreePlan import DegreePlan

print("Course Schedule Creator Sample Data")

# section 1
crn = 101
start = 1200
end = 1300
day = "MW"
professor = "Perez"
semester = "SPR 23"
room_no = "D212"
section1 = Section(crn, start, end, day, professor, semester, room_no)

# section 2
crn = 102
start = 900
end = 1000
day = "MW"
professor = "Perez"
semester = "SPR 23"
room_no = "D212"
section2 = Section(crn, start, end, day, professor, semester, room_no)

if (section1.is_conflicting(section2)):
    print("Sections 1 and 2 are conflicting")
else:
    print("Sections 1 and 2 do not conflict")


# course 1
id = "CSCI3551"
name = "Operating Systems"
sections = [section1, section2]
prereqs = None
coreqs = None
course1 = (id, name, sections, prereqs, coreqs)

# course 2
course2_section1 = Section(201, 1200, 1300, "MW", None, None, None)
course2_section2 = Section(202, 800, 900, "MW", None, None, None)
course2 = ("CSCI2222", "Two", [course2_section1, course2_section2], None, None)

# course 3
course3_section1 = Section(301, 1600, 1900, "W", None, None, None)
course3 = ("CSCI3333", "Three", [course3_section1], None, None)

# course 4
course4_section1 = Section(401, 1000, 1100, "M", None, None, None)
course4_section2 = Section(402, 1400, 1500, "T", None, None, None)
course4_section3 = Section(403, 1500, 1600, "W", None, None, None)
course4_section4 = Section(404, 700, 800, "F", None, None, None)
course4_sections = [course4_section1, course4_section2, course4_section3, course4_section4]
course4 = ("CSCI4444", "Four", course4_sections, None, None)

# Student
course_requests = [course1, course2, course3, course4]
sample_student = Student("user123", "pass123", None, None, course_requests, None)
sample_student.generate_choices()
sample_student.make_solution_choice(4)
print(sample_student.generate_crns())
sample_student.make_solution_choice(0)
print(sample_student.generate_crns())

# Event
sample_event = Event("Event1", 900, 1200, "MWF")

# Degree Plan
sample_dp = DegreePlan("CS", "Computer Science", [course1, course2])