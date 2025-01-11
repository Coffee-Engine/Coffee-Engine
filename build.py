# This file is meant to be used on Unix-like system as most of them have Python 3 preinstalled.
import platform
import os
import shutil
import webbrowser

# Functions
def clear():
    if platform.system() == 'Windows':
        clearCommand = 'cls'
    else:
        clearCommand = 'clear'
    os.system(clearCommand)


def boolQuestion(question):
    while True:
        answer = input(f"{question} (y/n)")
        if answer == "y":
            return True
        elif answer == "n":
            return False
        else:
            print("Err: Invalid Answer")

def startswithnum(num):
    try:
        num = int(num)
        return True
    except ValueError:
        return False

def prettyListPrint(grossList, selected=None):
    i = 0
    for item in grossList:
        i += 1
        if selected is not None:
            if i == selected:
                print(f"\t{i}: {item} <")
            else:
                print(f"\t{i}: {item}")
        else:
            print(f"\t{i}: {item}")

def main():
    print("Welcome to the Coffee Engine builder!")

    # Friendly OS names
    match platform.system():
        case "Windows":
            displayOS = "Windows"
        case "Darwin":
            displayOS = "macOS"
        case "Linux":
            displayOS = "Linux"
        case _:
            displayOS = "Unknown"
    print(f"Detected OS: {displayOS}\n")

    if shutil.which("node") is None:
        print("Err: You don't have Node.js installed, please download it from https://nodejs.org/en")
        exit(1)

    selected = 1
    while True:
        clear()

        print("Welcome to the Coffee Engine builder!")
        print(f"Detected OS: {displayOS}\n")
        print("Build options")

        prettyListPrint(buildOptions, selected)
        cmd = input(":")

        if startswithnum(cmd):
            selected = int(cmd)
        elif cmd == "q": # Exit
            clear()
            exit(0)
        elif cmd == "": # Confirm
            execute(selected)

def execute(option):
    # Check OS Python command
    if platform.system() == "Windows":
        pyCommand = "py"
    else:
        pyCommand = "python3"
    
    # Actual execution
    if option == 1:
        webbrowser.open("http://0.0.0.0:8000/src/")
        os.system(f"{pyCommand} -m http.server")  
    if option == 2:
        os.system("npm run start")
    exit(0)

buildOptions = [
    "Web Server",
    "Dev Window",
]

main()