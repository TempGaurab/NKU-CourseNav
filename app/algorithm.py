import json
with open('Data_Collection/courses_sample.json', 'r') as json_file:
    data = json.load(json_file)
#data will hold the entire json file

#Return True if the list is not empty, False if it's empty
def check_for_nodes(list_of_codes):
    return bool(list_of_codes)
#Tests , print(bool(["A","B"])) = True and 
print(check_for_nodes(["A","B"]))
print(check_for_nodes([]))