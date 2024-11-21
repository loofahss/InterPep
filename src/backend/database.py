import pymysql
import random
import json
db = pymysql.connect(host='localhost',
                     database='neuropenet',
                     user='root',
                     password='wingkin45')

def add_random_pei():
    conn = db
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    # 查询所有 proteinid 和 peptideid
    sql_select = "SELECT proteinid, peptideid FROM protein_peptide"
    cursor.execute(sql_select)
    records = cursor.fetchall()
    
    # 为每个记录生成一个随机的 pEI 值并更新
    errors = []
    for record in records:
        proteinid = record['proteinid']
        peptideid = record['peptideid']
        random_pei = round(random.uniform(0.0, 9.0), 2)  # 生成 0.0 到 9.0 之间的随机浮点数
        try:
            sql_update = """
            UPDATE protein_peptide
            SET pei = %s
            WHERE proteinid = %s AND peptideid = %s
            """
            cursor.execute(sql_update, (random_pei, proteinid, peptideid))
            conn.commit()
        except Exception as e:
            errors.append(str(e))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    if errors:
        print(json.dumps({"message": "Errors occurred", "errors": errors}, indent=4))
    else:
        print(json.dumps({"message": "Random pEI values added successfully"}, indent=4))

if __name__ == '__main__':
    add_random_pei()