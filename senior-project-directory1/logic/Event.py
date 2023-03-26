class Event:
    
    def __init__(self, id, start, end, day):
        self.id = id
        self.start_time = start #12:30p -> 1230
        self.end_time = end # 2:00p -> 1400
        self.day = day # Mon, Tues, Wed, Thurs, Fri

    def is_conflicting(self, other_section) -> bool:
        return False
