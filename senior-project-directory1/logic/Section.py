class Section:
    def __init__(self, crn, start, end, day, prof, room, semester):
        self.CRN = crn # 123456
        self.start_time = start #12:30p -> 1230
        self.end_time = end # 2:00p -> 1400
        self.day = day # Mon, Tues, Wed, Thurs, Fri
        self.professor = prof # Perez
        self.semester = semester
        self.room_no = room # D214
    
    def get_duration(self) -> int:
        return self.start_time-self.end_time
    
    def getCrn(self):
        return self.CRN
    
    def is_conflicting(self, other_section) -> bool:
        for i in range(0,len(self.day)):
            if self.day[i] in other_section.day:
                if self.start_time < other_section.start_time:
                    if self.end_time > other_section.start_time:
                        return True
                    else:
                        return False
                else:
                    if self.start_time < other_section.end_time:
                        return True
                    else:
                        return False
                break