import pandas as pd
df = pd.read_csv('Data_Collection/course_details.csv')
json_df = df.to_json(orient='records')
print(json_df)
df.to_json('Data_Collection/courses_sample.json', orient='records')
print("Success")