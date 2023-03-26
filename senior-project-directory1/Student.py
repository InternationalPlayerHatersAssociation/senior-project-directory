from Section import Section
from Course import Course
from Event import Event
from DegreePlan import DegreePlan

class Student:
    def __init__(self, user, password, events, degree, requests, history) -> None:
        self.username = user
        self.password = password
        self.solutions = [] # list of Course lists
        self.solution_choice = -1 # index of solutions
        self.events = events # list of outside events
        self.degreePlan = degree # degree plan object
        self.course_requests = requests # list of courses
        self.history = history # list of courses
 
    def generate_choices(self):
        course_num = len(self.course_requests)
        
        # calculate total # of combinations
        total = 1
        for i in range(0,course_num):
            total *= len(self.getCourse(i)[2])

        # initialize solutions matrix
        tmp_solutions = [[0 for x in range(course_num)] for y in range(total)]

        # fill in matrix with every possible choice
        part = total
        for i in range(0,course_num): # iterate through courses
            sec_num = len(self.getCourse(i)[2])
            part = part // sec_num
            for k in range(0,total):
                tmp_solutions[k][i] = ((k // part) % sec_num) + 1

        print("Unchecked Solutions Matrix: \n")
        for i in range(0, len(tmp_solutions)):
            m = ""
            for j in range(0, len(tmp_solutions[0])):
                m += str(tmp_solutions[i][j]) + " "
            print(m)

        # check validity of each solution
        for i in range(0, len(tmp_solutions)):
            valid = True
            for j in range(0, course_num-1):
                for k in range(j+1, course_num):
                    section1_index = tmp_solutions[i][j]
                    section2_index = tmp_solutions[i][k]
                    section1 = self.course_requests[j][2][section1_index-1]
                    section2 = self.course_requests[k][2][section2_index-1]
                    valid = valid and not(section1.is_conflicting(section2))
            if(valid):
                self.solutions.append(tmp_solutions[i])
        self.printSolutions()

    def generate_crns(self)-> str:
        crns = ""
        solution = self.solutions[self.solution_choice]
        for i in range(0,len(solution)):
            section_num = solution[i]
            section = self.course_requests[i][2][section_num-1]
            crns += str(section.getCrn()) + " "
        return crns
    
    def make_solution_choice(self, choice):
        self.solution_choice = choice

    def getCourse(self, i) -> Course:
        return self.course_requests[i]
    
    def getCourseLen(self) -> int:
        return len(self.course_requests)

    def printSolutions(self):
        print("Solutions Matrix: \n")
        for i in self.solutions:
            print(i)

