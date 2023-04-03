# pip install requests
# pip install html5lib
# pip install bs4
# pip install beautifulsoup4
# pip install requests_html
# pip install selenium
# pip install tqdm
# pip install ray
import sys
import os
import time
from multiprocessing import process
import threading as Thread
import re  # Regex
import csv  # first party API thats neat and cool
# 3rd party imports
# ray
import ray
# loading bars
from tqdm import tqdm
# bs4
import requests
from bs4 import BeautifulSoup
from requests_html import HTMLSession  # currently not being used
# selenium stuff
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
# Delay until the element is found using selenium
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


import unittest
session2 = HTMLSession()  # redefined for simplicity

payload = {'ICANJAX': '1',
           'ICNAVTYPEDROPDOWN': '0',
           'ICType': "Panel",
           'ICElementNum': '0',
           'ICStateNum': '11',
           'ICAction': 'CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH',
           'ICModelCancel': '0',
           'ICXPos': '0',
           'ICYPos': '0',
           'ResponsetoDiffFrame': '-1',
           'TargetFrameName': 'None',
           'FacetPath': 'None',
           'ICFocus': '',
           'ICSaveWarningFilter': '0',
           'ICChanged': '-1',
           'ICSkipPending': '0',
           'ICAutoSave': '0',
           'ICResubmit': '0',
           'ICSID': 'CWrSTDPJzpEViUHU4X5I7jNIamEIla46c2hl+Wwe6QI=',
           'ICActionPrompt': 'false',
           'ICBcDomData': 'UnknownValue',
           'ICPanelName': '',
           'ICFind': '',
           'ICAddCount': '',
           'ICAppClsData': '',
           'SSR_CLSRCH_WRK_SUBJECT_SRCH$1': 'CSCI',
           'SSR_CLSRCH_WRK_SESSION_CODE$0': '',
           'SSR_CLSRCH_WRK_LOCATION$5': 'C0000',
           'SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$4': 'N'}


def main():  # WGST, CSV files

    # course, semester, 1/0)
    UHCL_CENG = ScrapeUHCL("CENG", "Spring 2023", True)
    printSubject(UHCL_CENG)
    CreateCSVSubject(UHCL_CENG)
    # UHCLcat = MakeUHCLCatalog("Spring 2023", True)  # corereq | prereq
    # printSubject(UHCLcat["CENG"])

    # end of main

# Scrape( String link, String Subject), yoinks all of the available classes, open or closed


# this function has the "run in parallel" tag, it cannot run single threaded, only multi
@ray.remote
def ScrapeUHCLthread(subject, year, DE):
    classes = ScrapeUHCL(subject, year, DE)
    return classes


def ScrapeUHCL(subject, year, DE):
    # change this if its updated to something else
    url = 'https://saprd.my.uh.edu/psc/saprd/EMPLOYEE/HRMS/c/UHS_CL_CUSTOM.CLASS_SEARCH.GBL'
    # this opens the website using chrome, pretty cool, can be webdriver.Firefox()
    options = webdriver.ChromeOptions()
    options.headless = True  # Browser is hidden, set this to false to reveal
    driver = webdriver.Chrome(chrome_options=options)
    # experimental - - - -
    # driver.set_window_position(-10000, 0)
    # - - - - - - - - - -
    driver.get(url)
    # Selecting Subject to yoink
    select = Select(driver.find_element(
        By.ID, 'CLASS_SRCH_WRK2_STRM$35$'))
    # looking for the value that matches our subject
    # this will require a check
    select.select_by_visible_text(year)
    # year 219 -- 1774,   y+(10x) = 2190 , 2023
    WaitForElement(driver)
    select = Select(driver.find_element(
        By.ID, 'SSR_CLSRCH_WRK_SUBJECT_SRCH$1'))
    select.select_by_value(subject)
    # show all classes 'SSR_CLSRCH_WRK_SSR_OPEN_ONLY$4'
    WaitForElement(driver)  # time.sleep(.500)
    driver.find_element(By.ID, 'SSR_CLSRCH_WRK_SSR_OPEN_ONLY$4').click()
    # setting location as a dummy to satisfy search requirement
    select = Select(driver.find_element(
        By.ID, 'SSR_CLSRCH_WRK_LOCATION$5'))
    try:
        select.select_by_value('C0000')
    except Exception as e:
        classes = {}
        classes[subject] = ["nothing"]
        return classes

    # launching the codes
    WaitForElement(driver)  # time.sleep(.500)
    driver.find_element(By.ID, 'CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH').click()
    WaitForElement(driver)
    soup = driver.page_source
    classes = Extract(driver, soup, subject, DE, year)
    # print(soup)
    return classes
    # end of get data

# Extract algo expected to be O(n)


def Extract(driver, soup, subject, DE, year):  # win0divSSR_CLSRSLT_WRK_GROUPBOX2$0 divs WGST
    classes = {}  # empty dictionary, results.update({"12345" : [1,2,3,4,5]})
    #  class# | course name | section | day & time | room | instructor | meeting dates | instruction mode | status || corereq | pre-req | info
    cereal = BeautifulSoup(soup, 'html.parser')
    cereal.prettify()
    WaitForElement(driver)
    num = ''
    # maximum = driver.find_element(By.CLASS_NAME, 'PSGROUPBOXLABEL').text
    maximum = cereal.find("td", {"class": "PSGROUPBOXLABEL"}).get_text()
    try:
        maximum = int(maximum[0:2])
    except Exception as e:
        print(" * * No classes found for "+str(subject)+" * *")
        classes[subject] = ["nothing"]
        return classes
    # if seen, something is very wrong
    title = "????"
    # force a title check from the start, if section is smaller it 'changes' title
    currenttitle = 0
    current = 0
    go = 1
    # all sections and name C - Programming rest are <a>
    print("Number of classes found: in "+str(subject), maximum)
    # starts
    for current in tqdm(range(0, maximum), desc="Scraping "+str(subject)+"..."):
        # all sections and name C - Programming rest are <a>
        EID_class = cereal.find(
            'a', id='MTG_CLASS_NBR$'+str(current)).get_text()  # 20788
        EID_section = cereal.find(
            "a", id="MTG_CLASSNAME$"+str(current)).get_text()
        EID_time = cereal.find(
            "span", id="MTG_DAYTIME$"+str(current)).get_text()
        EID_room = cereal.find("span", id="MTG_ROOM$"+str(current)).get_text()
        EID_instructor = cereal.find(
            "span", id="MTG_INSTR$"+str(current)).get_text()
        EID_meetings = cereal.find(
            "span", id="MTG_TOPIC$"+str(current)).get_text()
        EID_instruction_mode = cereal.find(
            "span", id="INSTRUCT_MODE_DESCR$"+str(current)).get_text()
        # open/close
        EID_status = cereal.find(
            "div", id="win0divDERIVED_CLSRCH_SSR_STATUS_LONG$"+str(current)).find('img', alt=True)
        # print(EID_status)
        if (str(EID_status).find('"Open"') != -1):
            EID_status = "Opened"
        else:
            EID_status = "Closed"
        if (CheckDIV(cereal, current, currenttitle) == True):
            title = cereal.find(
                'div', id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$'+str(currenttitle)).get_text()
            title = title[0:60]
            title = title.strip()
            currenttitle += 1
            # print("class number is", current)
            corereq, prereq, other = DeepExtract(
                driver, soup, subject, DE, current)
            classes[EID_class] = [title, EID_section,
                                  EID_time, EID_room, EID_instructor, EID_meetings, year, EID_instruction_mode, EID_status, corereq, prereq, other]
        else:
            title = cereal.find(
                'div', id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$'+str(currenttitle)).get_text()
            title = title[0:60]
            title = title.strip()
            # print(title)
            # print("class number is", current)
            corereq, prereq, other = DeepExtract(
                driver, soup, subject, DE, current)
            classes[EID_class] = [title, EID_section,
                                  EID_time, EID_room, EID_instructor, EID_meetings, EID_instruction_mode, EID_status, corereq, prereq, other]

    # class scraping to a dictionary
    return classes


# corereq and prereqs scraping services CENG 3313 is a special ocation | needs checking
def DeepExtract(driver, soup, subject, DE, current):
    corereq = '-'
    prereq = '-'
    other = '-'  # anything
    # Browser clicks on the course
    if (DE == True):
        # corereq, prereqs, descriptions, and class size
        try:
            driver.find_element(By.ID, 'MTG_CLASSNAME$'+str(current)).click()
        except Exception as e:
            WaitForElement(driver)
        WaitForElement(driver)
        # To oficially start
        cereal = driver.page_source
        cereal = BeautifulSoup(cereal, 'html.parser')
        cereal.prettify()
        # Attempt 1: Check enrollement requirements if it exist - - - - resume on sunday here
        WaitForElement(driver)
        try:
            temp = cereal.find(
                'span', id='DERIVED_CLSRCH_DESCRLONG').get_text()
            prereq, corereq = FindRCReg2(temp)  # test here
        except Exception as e:
            prereq = "No Info"
            corereq = "No Info"
            other = "-"
            # print(e)
        # parse here
        # To finish things up
        driver.find_element(By.ID, "CLASS_SRCH_WRK2_SSR_PB_BACK").click()
        WaitForElement(driver)

        return (corereq, prereq, other)
    else:
        return ['-', '-', '-']


def FindRCReg(parse):
    # print(parse)
    prereq = 'None'
    corereq = 'None'
    prereq = re.search(
        r"(?:Prerequisites:|Prerequisite:|Prerequisites:)(.*?)(?=\.|Corerequisite)", parse)
    try:
        prereq = prereq.group(1).strip()
    except Exception as e:
        prereq = "None"
    # corereq
    # corereq = re.search(r"Corequisite:\s*(.*?)(\.|$)", parse)
    corereq = re.search(
        r"(?:Corequisite:|Corequisites:)\s*(.*?)(\.|$|Prerequisite)", parse)
    try:
        corereq = corereq.group(1).strip()
    except Exception as e:
        corereq = "None"

    return prereq, corereq,

# This system call is under beta and is already better lol


def FindRCReg2(parse):
    prereq = 'None'
    corereq = 'None'
    # print(parse)
    prereqlist = re.findall(
        r"(?:Prerequisites:|Prerequisite:|. Prerequisites:)(.*?)(?=\.|Corerequisite|Corequisites:|$)", parse)
    # print(prereqlist)
    try:
        if (len(prereqlist) != 0):
            prereq = ""
            for i in range(0, len(prereqlist)):
                # print(prereqlist[i])
                prereq = prereq + str(prereqlist[i]).strip()+" "
    except Exception as e:
        prereq = "None"
        # print(e)
    # corereq = re.search(r"Corequisite:\s*(.*?)(\.|$)", parse)
    corereqlist = re.findall(
        r"(?:Corequisite:|Corequisites:)\s*(.*?)(?=\.|$|Prerequisite)", parse)
    # print(corereqlist)
    try:
        if (len(corereqlist) != 0):
            corereq = ""
            for j in range(0, len(corereqlist)):
                # print(corereqlist[j])
                corereq = corereq + str(corereqlist[j]).strip()+" "
    except Exception as e:
        corereq = "None"
        # print(e)

    return prereq, corereq,


def CheckDIV(soup, current, currenttitle):  # 29 - 36
    try:
        text = soup.find(
            'div', id='win0divSSR_CLSRSLT_WRK_GROUPBOX2$'+str(currenttitle+1)).find('a', id='MTG_CLASS_NBR$'+str(current+1)).get_text()
        # print(text)
    except AttributeError as e:
        return False
    else:
        return True

# this can be used to check if the connection is available, 200 = available with no problems


def post_request(url):
    try:
        r = requests.post(url, data=payload)
        if r.status_code == 200:
            return "Code: 200"
        else:
            print("code: "+r.status_code)
    except Exception as e:
        return e


def WaitForElement(driver):
    try:
        WebDriverWait(driver, 10).until(
            EC.invisibility_of_element(driver.find_element(By.ID, 'processing')))
    except Exception as e:
        print(e)
        print("WaitForElement Was not able to find the processing element.")
        time.sleep(.350)
        return


def printSubject(classes):
    for keys, values in classes.items():
        print(keys)
        print(values)
    return


def CreateCSVSubject(UHCL_Cat):
    # Make a file that makes a cvs file
    print("hi")
    return


def MakeUHCLCatalog(semester, DE):
    # everything here will be multi-threaded - threaded /
    ray.init()
    pbar = tqdm(total=70, desc="* * Total Progress")
    # giving it a q list of processes
    # T & W = 3
    UHCL_TCED = ScrapeUHCLthread.remote("TCED", str(semester), DE)
    UHCL_WGST = ScrapeUHCLthread.remote("WGST", str(semester), DE)
    UHCL_WRIT = ScrapeUHCLthread.remote("WRIT", str(semester), DE)
    # A = 5
    UHCL_ACCT = ScrapeUHCLthread.remote("ACCT", semester, DE)
    UHCL_ADSU = ScrapeUHCLthread.remote("ADSU", semester, DE)
    UHCL_ANTH = ScrapeUHCLthread.remote("ANTH", semester, DE)
    UHCL_ARTS = ScrapeUHCLthread.remote("ARTS", semester, DE)
    UHCL_ASTR = ScrapeUHCLthread.remote("ASTR", semester, DE)
    # B = 2
    UHCL_BIOL = ScrapeUHCLthread.remote("BIOL", str(semester), DE)
    UHCL_BIOT = ScrapeUHCLthread.remote("BIOT", str(semester), DE)
    # C = 8
    UHCL_CENG = ScrapeUHCLthread.remote("CENG", str(semester), DE)
    UHCL_CHEM = ScrapeUHCLthread.remote("CHEM", str(semester), DE)
    UHCL_CINF = ScrapeUHCLthread.remote("CINF", str(semester), DE)
    UHCL_COMM = ScrapeUHCLthread.remote("COMM", str(semester), DE)
    UHCL_COUN = ScrapeUHCLthread.remote("COUN", str(semester), DE)
    UHCL_CRCL = ScrapeUHCLthread.remote("CRCL", str(semester), DE)
    UHCL_CRIM = ScrapeUHCLthread.remote("CRIM", str(semester), DE)
    UHCL_CSCI = ScrapeUHCLthread.remote("CSCI", str(semester), DE)
    # D = 3
    UHCL_DASC = ScrapeUHCLthread.remote("DASC", str(semester), DE)
    UHCL_DMST = ScrapeUHCLthread.remote("DMST", str(semester), DE)
    UHCL_DSCI = ScrapeUHCLthread.remote("DSCI", str(semester), DE)
    # E = 10
    UHCL_ECED = ScrapeUHCLthread.remote("ECED", str(semester), DE)
    UHCL_ECON = ScrapeUHCLthread.remote("ECON", str(semester), DE)
    UHCL_EDCI = ScrapeUHCLthread.remote("EDCI", str(semester), DE)
    UHCL_EDLS = ScrapeUHCLthread.remote("EDLS", str(semester), DE)
    UHCL_EDUC = ScrapeUHCLthread.remote("EDUC", str(semester), DE)
    UHCL_EMGT = ScrapeUHCLthread.remote("EMGT", str(semester), DE)
    UHCL_ENGR = ScrapeUHCLthread.remote("ENGR", str(semester), DE)
    UHCL_ENSC = ScrapeUHCLthread.remote("ENSC", str(semester), DE)
    UHCL_ENVR = ScrapeUHCLthread.remote("ENVR", str(semester), DE)
    UHCL_EXHS = ScrapeUHCLthread.remote("EXHS", str(semester), DE)
    # F = 1
    UHCL_FINC = ScrapeUHCLthread.remote("FINC", str(semester), DE)
    # G = 3
    UHCL_GAME = ScrapeUHCLthread.remote("GAME", str(semester), DE)
    UHCL_GEOG = ScrapeUHCLthread.remote("GEOG", str(semester), DE)
    UHCL_GEOL = ScrapeUHCLthread.remote("GEOL", str(semester), DE)
    # H = 5
    UHCL_HADM = ScrapeUHCLthread.remote("HADM", str(semester), DE)
    UHCL_HIST = ScrapeUHCLthread.remote("HIST", str(semester), DE)
    UHCL_HLTH = ScrapeUHCLthread.remote("HLTH", str(semester), DE)
    UHCL_HMRS = ScrapeUHCLthread.remote("HMRS", str(semester), DE)
    UHCL_HUMN = ScrapeUHCLthread.remote("HUMN", str(semester), DE)
    # I = 3
    UHCL_INST = ScrapeUHCLthread.remote("INST", str(semester), DE)
    UHCL_ISAM = ScrapeUHCLthread.remote("ISAM", str(semester), DE)
    UHCL_ITEC = ScrapeUHCLthread.remote("ITEC", str(semester), DE)
    # L = 4
    UHCL_LEGL = ScrapeUHCLthread.remote("LEGL", str(semester), DE)
    UHCL_LITR = ScrapeUHCLthread.remote("LITR", str(semester), DE)
    UHCL_LLAS = ScrapeUHCLthread.remote("LLAS", str(semester), DE)
    UHCL_LLLS = ScrapeUHCLthread.remote("LLLS", str(semester), DE)
    # M = 5
    UHCL_MATH = ScrapeUHCLthread.remote("MATH", str(semester), DE)
    UHCL_MENG = ScrapeUHCLthread.remote("MENG", str(semester), DE)
    UHCL_MGMT = ScrapeUHCLthread.remote("MGMT", str(semester), DE)
    UHCL_MKTG = ScrapeUHCLthread.remote("MKTG", str(semester), DE)
    UHCL_MSCI = ScrapeUHCLthread.remote("MSCI", str(semester), DE)
    # N = 3
    UHCL_NCBI = ScrapeUHCLthread.remote("NCBI", str(semester), DE)
    UHCL_NCBM = ScrapeUHCLthread.remote("NCBM", str(semester), DE)
    UHCL_NURS = ScrapeUHCLthread.remote("NURS", str(semester), DE)
    # O = 1
    UHCL_OSHE = ScrapeUHCLthread.remote("OSHE", str(semester), DE)
    # P = 5
    UHCL_PHIL = ScrapeUHCLthread.remote("PHIL", str(semester), DE)
    UHCL_PHYS = ScrapeUHCLthread.remote("PHYS", str(semester), DE)
    UHCL_POLS = ScrapeUHCLthread.remote("POLS", str(semester), DE)
    UHCL_PSLD = ScrapeUHCLthread.remote("PSLD", str(semester), DE)
    UHCL_PSYC = ScrapeUHCLthread.remote("PSYC", str(semester), DE)
    # S = 9
    UHCL_SENG = ScrapeUHCLthread.remote("SENG", str(semester), DE)
    UHCL_SILC = ScrapeUHCLthread.remote("SILC", str(semester), DE)
    UHCL_SLIS = ScrapeUHCLthread.remote("SLIS", str(semester), DE)
    UHCL_SOCI = ScrapeUHCLthread.remote("SOCI", str(semester), DE)
    UHCL_SPAN = ScrapeUHCLthread.remote("SPAN", str(semester), DE)
    UHCL_SPED = ScrapeUHCLthread.remote("SPED", str(semester), DE)
    UHCL_STAT = ScrapeUHCLthread.remote("STAT", str(semester), DE)
    UHCL_SWEN = ScrapeUHCLthread.remote("SWEN", str(semester), DE)
    UHCL_SWRK = ScrapeUHCLthread.remote("SWRK", str(semester), DE)

    # initialize multithreading

    UHCL_ACCT, UHCL_ADSU, UHCL_ANTH, UHCL_ARTS, UHCL_ASTR, UHCL_BIOL, UHCL_BIOT, UHCL_CENG, UHCL_CHEM, UHCL_CINF, UHCL_COMM, UHCL_COUN, UHCL_CRCL, UHCL_CRIM, UHCL_CSCI, UHCL_DASC, UHCL_DMST, UHCL_DSCI, UHCL_ECED, UHCL_ECON, UHCL_EDCI, UHCL_EDLS, UHCL_EDUC, UHCL_EMGT, UHCL_ENGR, UHCL_ENSC, UHCL_ENVR, UHCL_EXHS, UHCL_FINC, UHCL_GAME, UHCL_GEOG, UHCL_GEOL, UHCL_HADM, UHCL_HIST, UHCL_HLTH, UHCL_HMRS, UHCL_HUMN, UHCL_INST, UHCL_ISAM, UHCL_ITEC, UHCL_LEGL, UHCL_LITR, UHCL_LLAS, UHCL_LLLS, UHCL_MATH, UHCL_MENG, UHCL_MGMT, UHCL_MKTG, UHCL_MSCI, UHCL_NCBI, UHCL_NCBM, UHCL_NURS, UHCL_OSHE, UHCL_PHIL, UHCL_PHYS, UHCL_POLS, UHCL_PSLD, UHCL_PSYC, UHCL_SENG, UHCL_SILC, UHCL_SLIS, UHCL_SOCI, UHCL_SPAN, UHCL_SPED, UHCL_STAT, UHCL_SWEN, UHCL_SWRK, UHCL_TCED, UHCL_WGST, UHCL_WRIT = ray.get(
        [UHCL_ACCT, UHCL_ADSU, UHCL_ANTH, UHCL_ARTS, UHCL_ASTR, UHCL_BIOL, UHCL_BIOT, UHCL_CENG, UHCL_CHEM, UHCL_CINF, UHCL_COMM, UHCL_COUN, UHCL_CRCL, UHCL_CRIM, UHCL_CSCI, UHCL_DASC, UHCL_DMST, UHCL_DSCI, UHCL_ECED, UHCL_ECON, UHCL_EDCI, UHCL_EDLS, UHCL_EDUC, UHCL_EMGT, UHCL_ENGR, UHCL_ENSC, UHCL_ENVR, UHCL_EXHS, UHCL_FINC, UHCL_GAME, UHCL_GEOG, UHCL_GEOL, UHCL_HADM, UHCL_HIST, UHCL_HLTH, UHCL_HMRS, UHCL_HUMN, UHCL_INST, UHCL_ISAM, UHCL_ITEC, UHCL_LEGL, UHCL_LITR, UHCL_LLAS, UHCL_LLLS, UHCL_MATH, UHCL_MENG, UHCL_MGMT, UHCL_MKTG, UHCL_MSCI, UHCL_NCBI, UHCL_NCBM, UHCL_NURS, UHCL_OSHE, UHCL_PHIL, UHCL_PHYS, UHCL_POLS, UHCL_PSLD, UHCL_PSYC, UHCL_SENG, UHCL_SILC, UHCL_SLIS, UHCL_SOCI, UHCL_SPAN, UHCL_SPED, UHCL_STAT, UHCL_SWEN, UHCL_SWRK, UHCL_TCED, UHCL_WGST, UHCL_WRIT])
    pbar.update(70)  # +28
    pbar.close()
    return {"ACCT": UHCL_ACCT, "ADSU": UHCL_ADSU, "ANTH": UHCL_ANTH, "ARTS": UHCL_ARTS, "ASTR": UHCL_ASTR, "BIOL": UHCL_BIOL, "BIOT": UHCL_BIOT, "CENG": UHCL_CENG, "CHEM": UHCL_CHEM, "CINF": UHCL_CINF, "COMM": UHCL_COMM, "COUN": UHCL_COUN, "CRCL": UHCL_CRCL, "CRIM": UHCL_CRIM, "CSCI": UHCL_CSCI, "DASC": UHCL_DASC, "DMST": UHCL_DMST, "DSCI": UHCL_DSCI, "ECED": UHCL_ECED, "ECON": UHCL_ECON, "EDCI": UHCL_EDCI, "EDLS": UHCL_EDLS, "EDUC": UHCL_EDUC, "EMGT": UHCL_EMGT, "ENGR": UHCL_ENGR, "ENSC": UHCL_ENSC, "ENVR": UHCL_ENVR, "EXHS": UHCL_EXHS, "FINC": UHCL_FINC, "GAME": UHCL_GAME, "GEOG": UHCL_GEOG, "GEOL": UHCL_GEOL, "HADM": UHCL_HADM, "HIST": UHCL_HIST, "HLTH": UHCL_HLTH, "HMRS": UHCL_HMRS, "HUMN": UHCL_HUMN, "INST": UHCL_INST, "ISAM": UHCL_ISAM, "ITEC": UHCL_ITEC, "LEGL": UHCL_LEGL, "LITR": UHCL_LITR, "LLAS": UHCL_LLAS, "LLLS": UHCL_LLLS, "MATH": UHCL_MATH, "MENG": UHCL_MENG, "MGMT": UHCL_MGMT, "MKTG": UHCL_MKTG, "MSCI": UHCL_MSCI, "NCBI": UHCL_NCBI, "NCMB": UHCL_NCBM, "NURS": UHCL_NURS, "OSHE": UHCL_OSHE, "PHIL": UHCL_PHIL, "PHYS": UHCL_PHYS, "POLS": UHCL_POLS, "PSLD": UHCL_PSLD, "PSYC": UHCL_PSYC, "SENG": UHCL_SENG, "SILC": UHCL_SILC, "SLIS": UHCL_SLIS, "SOCI": UHCL_SOCI, "SPAN": UHCL_SPAN, "SPED": UHCL_SPED, "STAT": UHCL_STAT, "SWEN": UHCL_SWEN, "SWRK": UHCL_SWRK, "TCED": UHCL_TCED, "WGST": UHCL_WGST, "WRIT": UHCL_WRIT}


main()
