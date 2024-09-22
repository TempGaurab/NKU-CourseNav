import os
from flask import Flask,request, render_template
app = Flask(__name__)
@app.route('/')
def home():
   return render_template('index.html')

@app.route('/navigate', methods=['POST'])
def navigate():
    selected_course = request.form.get('selectedCourse')  # Get the input value
    # Render a new template (course.html) with the selected course
    return render_template('course.html', course=selected_course)

if __name__ == '__main__':
   app.run(debug = True)