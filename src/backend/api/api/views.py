from flask import request, redirect, url_for, jsonify
from apiflask import Schema
from apiflask.fields import String
import json
from flask_cors import cross_origin
from api import app
from api.tasks import pred_cl, neuropred, neuropred_plm
from .response import ResMsg
from .utils import ResponseMessage, ResponseCode


class SequenceSchema(Schema):
    fasta_file = String(required=True)
    email = String(required=True)

class TaskIdSchema(Schema):
    task_id = String(required=True)

example = {'email': 'your email',
            'sequence': '>test\nHJKSDFBKJSAFBNDJKA'
                }

example_site_pred = {'email': 'your email',
            'sequence': '>A0A088MI\nMAFLKKSLFLVLFLGVVSLSFCEEEKREEHEEEKRDEEDAESLGKRYGGLSPLRISKRVPPGFTPFRSPARSISGLTPIRLSKRVPPGFTPFRSPARRISEADPGFTPSFVVIKGLSPLRGKRRPPGFSPFRVD'
                }


@app.route('/submit', methods=['POST'])
# @app.input(SequenceSchema, example=example_site_pred)
# @app.output(TaskIdSchema, 201)
# @app.doc(summary=' ', description='submit peptide sequence', tag='Neuropeptide clevage site prediction')
def submit():
    if request.method == 'POST':
        # email = request.form.get('email')
        # sequence = request.form.get('sequence')
        data = json.loads(request.data)
        sequence = data['sequence']
        email = data['email']
        task = pred_cl.apply_async((sequence, email), countdown=10)
        # return redirect(url_for('taskstatus', task_id=task.id))
        return jsonify({'taskId': task.id})


@app.route('/submit-neuropred-esm', methods=['POST'])
# @app.input(SequenceSchema, example=example)
# @app.output(TaskIdSchema, 201)
# @app.doc(summary=' ', description='submit peptide sequence', tag='Neuropeptide prediction')
def submitesm():
    if request.method == 'POST':
        # email = request.form.get('email')
        # sequence = request.form.get('sequence')
        data = json.loads(request.data)
        sequence = data['sequence']
        email = data['email']
        task = neuropred.apply_async((sequence, email), countdown=10)
        # return redirect(url_for('taskstatus', task_id=task.id))
        return jsonify({'taskId': task.id})


@app.route('/esm-status-api/<task_id>')
# @app.input(TaskIdSchema)
# @app.doc(summary=' ', description='submit peptide sequence', tag='Neuropeptide prediction')
def taskstatusesm(task_id):
    res = ResMsg()
    task = neuropred.AsyncResult(task_id)
    if task.state == 'PENDING':
        res.update(code=ResponseCode.PENDING, msg=ResponseMessage.PENDING)
    elif task.state == 'SUCCESS':
        res.update(code=ResponseCode.SUCCESS, data=task.result, msg=ResponseMessage.SUCCESS)
    elif task.state == 'FAILURE':
        res.update(code=ResponseCode.FAIL, msg=ResponseMessage.FAIL)
    elif task.state == 'STARTED':
        res.update(code=ResponseCode.STARTED, msg=ResponseMessage.STARTED)
    
    return jsonify(res.data)


@app.route('/status-api/<task_id>')
# @app.input(TaskIdSchema)
# @app.doc(summary=' ', description='submit protein sequence', tag='Neuropeptide clevage site prediction')
def taskstatus(task_id):
    res = ResMsg()
    task = pred_cl.AsyncResult(task_id)
    if task.state == 'PENDING':
        res.update(code=ResponseCode.PENDING, msg=ResponseMessage.PENDING)
    elif task.state == 'SUCCESS':
        res.update(code=ResponseCode.SUCCESS, data=task.result, msg=ResponseMessage.SUCCESS)
    elif task.state == 'FAILURE':
        res.update(code=ResponseCode.FAIL, msg=ResponseMessage.FAIL)
    elif task.state == 'STARTED':
        res.update(code=ResponseCode.STARTED, msg=ResponseMessage.STARTED)
    
    return jsonify(res.data)


@app.route('/submit-neuropred-plm', methods=['POST'])
# @app.input(SequenceSchema, example=example)
# @app.output(TaskIdSchema, 201)
# @app.doc(summary=' ', description='submit peptide sequence', tag='Neuropeptide prediction')
def submitplm():
    if request.method == 'POST':
        # email = request.form.get('email')
        # sequence = request.form.get('sequence')
        data = json.loads(request.data)
        sequence = data['sequence']
        email = data['email']
        task = neuropred_plm.apply_async((sequence, email), countdown=10)
        # return redirect(url_for('taskstatus', task_id=task.id))
        return jsonify({'taskId': task.id})


@app.route('/plm-status-api/<task_id>')
# @app.input(TaskIdSchema)
# @app.doc(summary=' ', description='submit peptide sequence', tag='Neuropeptide prediction')
def taskstatusplm(task_id):
    res = ResMsg()
    task = neuropred.AsyncResult(task_id)
    if task.state == 'PENDING':
        res.update(code=ResponseCode.PENDING, msg=ResponseMessage.PENDING)
    elif task.state == 'SUCCESS':
        res.update(code=ResponseCode.SUCCESS, data=task.result, msg=ResponseMessage.SUCCESS)
    elif task.state == 'FAILURE':
        res.update(code=ResponseCode.FAIL, msg=ResponseMessage.FAIL)
    elif task.state == 'STARTED':
        res.update(code=ResponseCode.STARTED, msg=ResponseMessage.STARTED)
    
    return jsonify(res.data)