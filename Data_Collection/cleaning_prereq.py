import ast
import json
with open('courses_sample.json', 'r') as json_file:
    data = json.load(json_file)
# Assuming `data` is your list of dictionaries
for entry in data:
    # Safely evaluate prerequisites
    if 'Prerequisites' in entry:
        entry['Prerequisites'] = ast.literal_eval(entry['Prerequisites'])
    
    # Safely evaluate corequisites
    if 'Coreq' in entry:
        entry['Coreq'] = ast.literal_eval(entry['Coreq'])

with open('courses_sample.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

# Print the updated data to verify
print(data)