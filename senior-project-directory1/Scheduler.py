class Scheduler:
    def __init__(self, classes, unavailables):
           self.classes = classes
           self.unavailables = unavailables
          
    def time_overlap(self, event1, event2):
        return not (event1["end"] <= event2["start"] or event2["end"] <= event1["start"])
        
    def conflict_with_user(self, section):
        for event in self.unavailables.values():
            if self.check_conflict(event, section):
                return True
        return False
    
    def check_conflict(self, section1, section2):
        if self.check_day_conflict(section1["day"], section2["day"]):
            return self.time_overlap(section1, section2)
        else:
            return False

    def check_day_conflict(self, day1, day2):
        for i in range(0,len(day1)):
            if day1[i] in day2:
                return True
        return False
    
    def check_valid_combination(self, combination):
        for i in range(0, len(combination)): # i is index of class, value at i is index of section
            if self.conflict_with_user(self.classes[i+1][combination[i]]):
                return False
            for j in range(i+1, len(combination)):
                if self.check_conflict(self.classes[i+1][combination[i]], self.classes[j+1][combination[j]]):
                    return False
        return True
    
    def all_possible_combinations(self):
        
        # calculate total # of combinations
        num_courses = len(self.classes)
        num_total_combos = 1
        for course in self.classes.values():
            num_total_combos *= len(course) # number of sections

        # initialize solutions matrix
        all_combos = [[0 for x in range(num_courses)] for y in range(num_total_combos)]
        print("Matrix is "+ str(len(all_combos)) + " x " + str(len(all_combos[0])))

        # fill in matrix with every possible choice
        part = num_total_combos
        i = -1
        for course in self.classes.values(): # iterate through each class's section dictionaries
            i+=1
            part = part // len(course)
            for k in range(0,num_total_combos):
                print("k "+str(k)+" i "+str(i))
                all_combos[k][i] = ((k // part) % len(course)) + 1
        return all_combos
    
    def get_valid_combinations(self):
        valid_combos = []
        all_combos = self.all_possible_combinations()
        for combo in all_combos:
            print("combo: "+ str(combo))
            if self.check_valid_combination(combo):
                valid_combos.append(combo)
        return valid_combos

section1 = {"crn": 11, "start": 900, "end": 1000, "day": "MW"}
section2 = {"crn": 12, "start": 1000, "end": 1100, "day": "TH"}
section3 = {"crn": 13, "start": 1200, "end": 1300, "day": "MW"}
class1 = {1: section1, 2: section2, 3:section3}

class2 = {1: {"crn": 21, "start": 1600, "end": 1900, "day": "W"}}
class3 = {1: {"crn": 31, "start": 1000, "end": 1200, "day": "TH"}, 2:  {"crn": 32, "start": 900, "end": 1100, "day": "TH"}}
class4 = {1: {"crn": 41, "start": 1200, "end": 1300, "day": "MW"}}

classes = {1: class1, 2: class2, 3: class3, 4: class4}

conflict1 = {"start": 800, "end": 1200, "day": "H"}
conflict2 = {"start": 1600, "end": 1900, "day": "MF"}
conflicts = {1: conflict1, 2: conflict2}

s = Scheduler(classes, conflicts)
for combo in s.get_valid_combinations():
    print(combo)