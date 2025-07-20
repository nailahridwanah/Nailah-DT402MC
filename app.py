from flask import Flask, jsonify, render_template, Response, abort, make_response
import sqlite3
import pathlib
import pandas as pd
import numpy as np 

app = Flask(__name__)

working_directory = pathlib.Path(__file__).parent.absolute()
DATABASE = working_directory / 'ml_task_progress.db' 

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/api/task_status_pie')
def task_status_pie():

    csv_path = working_directory / 'ml_task_progress.csv'    # Reading CSV
    df = pd.read_csv(csv_path)
    
    Status_Counts = df['Status'].value_counts()     # grouping by 'Status'
    
    labels = Status_Counts.index.tolist()   # Prepare data for pie chart
    counts = Status_Counts.values.tolist()
    
    return jsonify({'labels': labels, 'counts': counts})

@app.route('/api/priority_pie')
def priority_pie():

    csv_path = working_directory / 'ml_task_progress.csv'     # Reading CSV
    df = pd.read_csv(csv_path)
    

    Priority_Counts = df['Priority'].value_counts()    # GRouping by 'Priority'
    

    labels = Priority_Counts.index.tolist()     # Prepare data for pie chart
    counts = Priority_Counts.values.tolist()
    
    return jsonify({'labels': labels, 'counts': counts})

@app.route('/api/week_accuracy_line')
def week_accuracy_bar():

    csv_path = working_directory / 'ml_task_progress.csv'      # Reading CSV
    df = pd.read_csv(csv_path)


    week_counts = df.groupby('Date')['Model Accuracy'].mean()    # Convert 'Date' to datetime
 
    
    labels = week_counts.index.tolist() #Prepare data for line chart
    counts = week_counts.values.tolist()

    return jsonify({'labels': labels, 'counts': counts})

@app.route('/api/task_member_count_bar')
def task_member_count_bar():

    csv_path = working_directory / 'ml_task_progress.csv'
    df = pd.read_csv(csv_path)

    df['Team Member IDs'].astype(str).str.contains(',').any()
    df['Team Member IDs'] = df['Team Member IDs'].astype(str)
    df = df.assign(MemberID=df['Team Member IDs'].str.split(',')) # Splitting the 'Team Member IDs' column into individual member IDs
    df = df.explode('MemberID')

    member_counts = df['MemberID'].str.strip().value_counts()
    member_counts = member_counts.sort_values(ascending=True) # Sorting the counts in ascending order

    labels = member_counts.index.tolist()
    counts = member_counts.values.tolist()

    return jsonify({'labels': labels, 'counts': counts})

@app.route('/api/time_spent_accuracy_scatter')
def time_spent_accuracy_scatter():

    csv_path = working_directory / 'ml_task_progress.csv'
    df = pd.read_csv(csv_path)

    df['Time Spent (hrs)'] = pd.to_numeric(df['Time Spent (hrs)'], errors='coerce')  # Convert 'Time Spent (hrs)' to numeric
    df['Model Accuracy'] = pd.to_numeric(df['Model Accuracy'], errors='coerce')
    df = df.dropna(subset=['Time Spent (hrs)', 'Model Accuracy'])
    df = df.sort_values(by='Time Spent (hrs)')

    labels = df['Time Spent (hrs)'].astype(str).tolist() # Convert to string for labels
    counts = df['Model Accuracy'].tolist()

    return jsonify({'labels': labels, 'counts': counts})



if __name__ == '__main__':
    app.run(host='localhost', port=8000, debug=False) # This will run the Flask app on localhost:8000 