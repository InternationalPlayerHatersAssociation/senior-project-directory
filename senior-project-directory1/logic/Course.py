# Course Class Definition
from Section import Section
class Course:
    
    def __init__(self, id, name, sections, prereqs, coreqs):
        self.class_id = id # CSCI3551
        self.name = name # Digital Circuits
        self.sections = sections
        self.prereqs = prereqs
        self.coreqs = coreqs
        self.section_choice = -1 # 1, 2, etc
        self.grade = 0 # A, B, C, D, F
    
    def getSections(self):
        return self.sections