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
    # Reading CSV
    csv_path = working_directory / 'ml_task_progress.csv'
    df = pd.read_csv(csv_path)
    
    # grouping by 'Status'
    Status_Counts = df['Status'].value_counts()
    
    # Prepare data for pie chart
    labels = Status_Counts.index.tolist()
    counts = Status_Counts.values.tolist()
    
    return jsonify({"labels": labels, "counts": counts})

@app.route('/api/week_accuracy_bar')
def week_accuracy_bar():
    csv_path = working_directory / 'ml_task_progress.csv'
    df = pd.read_csv(csv_path)
    week_counts = df.groupby('Date')['Model Accuracy'].mean()
    labels = week_counts.index.tolist()
    counts = week_counts.values.tolist()
    return jsonify({'labels': labels, 'counts': counts})
    

if __name__ == '__main__':
    app.run(host='localhost', port=8000, debug=True)