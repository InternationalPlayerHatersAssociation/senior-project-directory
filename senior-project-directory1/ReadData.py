# Parses data from Database into something readable by application logic

def weekday(day):
    if day == "TDB":
        return ""
    d = ""
    for i in range(0,len(day), 2):
        if day[i] == "M":
            d+="M"
        elif day[i] == "T":
            if day[i+1] == "u":
                d += "T"
            else:
                d += "H"
        elif day[i] == "W":
            d+="W"
        elif day[i] == "F":
            d+="F"
    return d

def times(time):
    if time == "TDB":
        return 0
    new_time = ""
    pm = True
    for c in time:
        if c.isdigit():
            new_time += c
        elif c == "A":
            pm = False
    new_time = int(new_time)
    if new_time >= 1200:
        if not pm:
            new_time -= 1200
    else:
        if pm:
            new_time += 1200
    return new_time

print(weekday("Mo"))
print(weekday("Tu"))
print(weekday("We"))
print(weekday("Th"))
print(weekday("Fr"))
print(weekday("MoTu"))
print(weekday("TuTh"))
print(weekday("MoTuWeThFr"))
print(weekday("TDB"))


print(times("11:59AM"))
print(times("12:00AM"))
print(times("12:05AM"))
print(times("12:00PM"))
print(times("1:00PM"))
print(times("9:50PM"))
print(times("4:00PM"))
print(times("8:30AM"))
print(times("TDB"))