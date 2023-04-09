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
            if self.conflict_with_user(self.classes[i + 1][combination[i]]):
                return False
            for j in range(i+1, len(combination)):
                if self.check_conflict(self.classes[i + 1][combination[i]], self.classes[j + 1][combination[j]]):
                    return False
        return True
    
    def all_possible_combinations(self):
        num_courses = len(self.classes)
        num_total_combos = 1
        
        for course in self.classes.values():
            num_total_combos *= len(course)  # number of sections

        all_combos = []

        def build_combos(index, current_combo):
            if index >= num_courses:
                all_combos.append(current_combo.copy())
                return

            for section_key in self.classes[index + 1].keys():
                current_combo[index] = section_key
                build_combos(index + 1, current_combo)

        build_combos(0, [0] * num_courses)

        return all_combos

    
    def get_valid_combinations(self):
        valid_combos = []
        all_combos = self.all_possible_combinations()
        for combo in all_combos:
            if self.check_valid_combination(combo):
                valid_combos.append(combo)
        return valid_combos
    
    # choice is the index of the chosen class combination
    # combos is the list of all valid combinations
    def generate_crns(self, choice, all_combos):
        crns = ""
        combo = all_combos[choice]
        for i in range(0, len(combo)): # i is index of class, value at i is index of section
            crns += str(self.classes[i+1][combo[i]]["crn"]) + ","
        return crns[:-1]