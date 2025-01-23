import pymysql
import os

# 打开数据库连接
db = pymysql.connect(host='localhost',
                    database='neuropenet',
                    user='root',
                    password='your_password')

cursor = db.cursor()

# 插入 Proteins 数据
def insert_protein(connection, protein_id):
    cursor = connection.cursor()
    query = "INSERT IGNORE INTO Proteins (ProteinId, ProteinSequence) VALUES (%s, '')"  # 可以根据需求插入具体序列
    cursor.execute(query, (protein_id,))
    connection.commit()
    cursor.close()

# 插入 Peptides 数据
def insert_peptide(connection, peptide_id):
    cursor = connection.cursor()
    query = "INSERT IGNORE INTO Peptides (PeptideId, PeptideSequence) VALUES (%s, '')"  # 可以根据需求插入具体序列
    cursor.execute(query, (peptide_id,))
    connection.commit()
    cursor.close()
def load_multiplied_values(file_path):
    multiplied_values = {}
    try:
        with open(file_path, 'r') as file:
            next(file)  # Skip header
            for line in file:
                parts = line.strip().split("\t")
                if len(parts) == 2:
                    pdb_name = parts[0].replace(".pdb", "")
                    multiplied_value = float(parts[1])
                    multiplied_values[pdb_name] = multiplied_value
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
    return multiplied_values

def get_pei(multiplied_values ,pdb_name):
    pei = 0
    try:
        pei = multiplied_values[pdb_name]
    except KeyError:
        print(f"Error: The PEI value for {pdb_name} was not found.")
    return pei
# 插入 Protein_Peptide 中间表数据
def insert_protein_peptide_relation_with_pdb(cursor, protein_id, peptide_id, pdb_data, pei):
    query = "INSERT INTO Protein_Peptide (ProteinId, PeptideId, pdbData,pei) VALUES (%s, %s, %s,%s)"
    try:
        cursor.execute(query, (protein_id, peptide_id, pdb_data, pei))
        print(f"Successfully inserted {protein_id}, {peptide_id}")
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Failed to insert {protein_id}, {peptide_id}:", e)

# 读取文件夹中所有 PDB 文件的 protein_id, peptide_id, pdb_data
def read_pdb_files_from_folder(folder_path):
    pdb_records = []
    
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdb"):  # 确保是PDB文件
            try:
                protein_id, peptide_id = filename.split('and')[0], filename.split('and')[1].split('.')[0]
                # print(protein_id, peptide_id)
                pdb_name = filename.replace(".pdb", "")
                pei = get_pei(multiplied_values, pdb_name)
                print(protein_id, peptide_id, pei)
                file_path = os.path.join(folder_path, filename)
                with open(file_path, 'r') as file:
                    pdb_data = file.read()

                pdb_records.append((protein_id, peptide_id, pdb_data, pei))
            except Exception as e:
                print(f"Error processing file {filename}: {e}")
    
    return pdb_records

# 将读取的PDB信息插入数据库的中间表
def insert_pdb_data_into_db(connection, folder_path):
    pdb_records = read_pdb_files_from_folder(folder_path)
    
    for protein_id, peptide_id, pdb_data,pei in pdb_records:
        # 先插入 Proteins 和 Peptides 表
        # insert_protein(connection, protein_id)
        # insert_peptide(connection, peptide_id)
        # 然后插入 Protein_Peptide 中间表
        insert_protein_peptide_relation_with_pdb(cursor, protein_id, peptide_id, pdb_data,pei)

# 文件路径
# folder_path = "D:/code/PYTHON/neuropeptide/app/high"
multiplied_values_file_path = "D:/code/neuropeptide/src/backend/api/pei.txt"
folder_path="F:/out_folder"
# 将数据插入数据库
multiplied_values=load_multiplied_values(multiplied_values_file_path)

insert_pdb_data_into_db(db, folder_path)

# 关闭游标和连接
cursor.close()
db.close()
