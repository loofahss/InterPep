from api import celery_app, app, mail
import tempfile
import os
from flask_mail import Message
from .config import model_config, site_url, server_name, contact, esm_server_name, esm_site_url, plm_server_name, plm_site_url

from DeepNeuroPred.utils import feature_generate
from DeepNeuroPred.data import NeuroPepDataset, collate_fn
from DeepNeuroPred.net import AttentiveNet
from torch.utils.data import DataLoader
import torch


def test_data_iter(data_path):
    data = NeuroPepDataset(data_path)
    test = DataLoader(data, len(data), collate_fn=collate_fn)
    return test


@celery_app.task(bind=True)
def pred_cl(self, sequence, email_data):
    """Background task to send an email with Flask-Mail."""

    tmp_dir = tempfile.mkdtemp(suffix='-neuropep')
    with open(os.path.join(tmp_dir, 'seq.fasta'), mode='w') as fw:
        fw.write(sequence)
    
    # store
    with open(os.path.join(tmp_dir, 'email.data'), mode='w') as fw:
        fw.write(email_data)

    signalp_pos = feature_generate(os.path.join(
        tmp_dir, 'seq.fasta'), tmp_dir, device='cpu')
    test_loader = test_data_iter(tmp_dir)
    pos, pred_prob = neuropepCpred(
        model_config['model_path'], test_loader, 'cpu')

    msg = Message('DeepNeuroPred',
                  sender=app.config['MAIL_DEFAULT_SENDER'],
                  recipients=[email_data])

    msg.body = f"""
Dear user, \n 
    Your {server_name} job {self.request.id} is finished and available at {site_url}{self.request.id} .\n
Your result will be kept on our server for up to 60 days. Thank you for using isyslab {server_name} service.\n
Please email {contact} if you have any questions. 
\n
ISYSLAB: http://isyslab.info/
Huazhong University of Science and Technology \n
            """
    with app.app_context():
        mail.send(msg)
    pos = [item+signalp_pos+1 for item in pos]
    data = sorted([(i, j) for i, j in zip(pos, pred_prob)], key=lambda k: k[0])
    return {'signal_pos': signalp_pos, 'predict':data, 'sequence':sequence}


def neuropepCpred(model_path, test_loader, device):
    model = AttentiveNet(768, 16)
    model_dict = torch.load(model_path, map_location=device)
    model.load_state_dict(model_dict['state_dict'])
    model.eval()
    with torch.no_grad():
        for _, (tokens, pos) in enumerate(test_loader):
            tokens = tokens.to(device)
            predict = model(tokens)
        return pos, predict.cpu().tolist()


from neuropredesm.dataset import NPDataset, esm_collate_fn
from neuropredesm.model_wandb import EsmModel
import esm

def neuropredESM(model_path, data_path, device):
    NP_dataset = NPDataset(data_path)
    NP_dataloader = DataLoader(NP_dataset, batch_size=1, collate_fn=esm_collate_fn)
    model = EsmModel(768, 2, 32)
    esm_model, alphabet = esm.pretrained.esm1_t12_85M_UR50S()
    batch_converter = alphabet.get_batch_converter()

    model = model.to(device)
    model.add_module('esm', esm_model.to(device))
    state_dict = torch.load(model_path, map_location=device)
    model.load_state_dict(state_dict)
    model.eval()
    output = {}
    with torch.no_grad():
        for _, seqs in enumerate(NP_dataloader):
            id_name = seqs[0][0]
            sequence = seqs[0][1]
            _, _, batch_tokens = batch_converter(seqs)
            batch_tokens = batch_tokens.to(device)
            protein_dict = model.esm(batch_tokens, repr_layers=[12], return_contacts=False)
            protein_embeddings = protein_dict["representations"][12][:, 1:, :]
            preds, att = model(protein_embeddings)
            preds.cpu().tolist()[-1], att[0,:].cpu().tolist()
            output[id_name] = {'prob': preds.cpu().tolist()[-1], 'att':att[0,:].cpu().tolist(), 'sequence':sequence}
    return output


@celery_app.task(bind=True)
def neuropred(self, sequence, email_data):
    """Background task to send an email with Flask-Mail."""

    tmp_dir = tempfile.mkdtemp(suffix='-neuropepESM')
    with open(os.path.join(tmp_dir, 'seq.fasta'), mode='w') as fw:
        fw.write(sequence)
    
    # store
    with open(os.path.join(tmp_dir, 'email.data'), mode='w') as fw:
        fw.write(email_data)

    output = neuropredESM(model_config['esm_model_path'], os.path.join(tmp_dir, 'seq.fasta'), 'cpu')

    msg = Message('NeuroPred-ESM',
                  sender=app.config['MAIL_DEFAULT_SENDER'],
                  recipients=[email_data])

    msg.body = f"""
Dear user, \n 
    Your {esm_server_name} job {self.request.id} is finished and available at {esm_site_url}{self.request.id} .\n
Your result will be kept on our server for up to 60 days. Thank you for using isyslab {esm_server_name} service.\n
Please email {contact} if you have any questions. 
\n
ISYSLAB: http://isyslab.info/
Huazhong University of Science and Technology \n
            """
    with app.app_context():
        mail.send(msg)
    return output


import torch
from NeuroPredPLM.predict import predict
# import gradio as gr
from io import StringIO
from Bio import SeqIO

def classifier(peptide_seq, model_path, device):
    handle = StringIO(peptide_seq)
    data = []
    for record in SeqIO.parse(handle, 'fasta'):
        data.append((record.id, str(record.seq)))
    # device = "cuda" if torch.cuda.is_available() else "cpu"
    neuropeptide_pred = predict(data, model_path, device)
    return neuropeptide_pred


@celery_app.task(bind=True)
def neuropred_plm(self, sequence, email_data):
    """Background task to send an email with Flask-Mail."""

    tmp_dir = tempfile.mkdtemp(suffix='-neuropep-plm')
    # with open(os.path.join(tmp_dir, 'seq.fasta'), mode='w') as fw:
    #     fw.write(sequence)
    
    # store
    with open(os.path.join(tmp_dir, 'email.data'), mode='w') as fw:
        fw.write(email_data)

    output = classifier(sequence, model_config['plm_model_path'], 'cpu')

    msg = Message('NeuroPred-PLM',
                  sender=app.config['MAIL_DEFAULT_SENDER'],
                  recipients=[email_data])

    msg.body = f"""
Dear user, \n 
    Your {plm_server_name} job {self.request.id} is finished and available at {plm_site_url}{self.request.id} .\n
Your result will be kept on our server for up to 60 days. Thank you for using isyslab {plm_server_name} service.\n
Please email {contact} if you have any questions. 
\n
ISYSLAB: http://isyslab.info/
Huazhong University of Science and Technology \n
            """
    with app.app_context():
        mail.send(msg)
    return output