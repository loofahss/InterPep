from flask import Flask, request, jsonify
import pymysql
from flask_cors import CORS
from bcrypt import hashpw, gensalt, checkpw

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/login": {"origins": "http://localhost:3000"}})

# 数据库连接配置
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "password",
    "database": "online_bookstore"
}

# 登录接口
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"status": "error", "message": "用户名和密码不能为空"}), 400

    try:
        # 连接数据库
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # 查询用户信息
        cursor.execute("SELECT * FROM customers WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"status": "error", "message": "用户不存在"}), 404

        # 验证密码
        if not checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({"status": "error", "message": "密码错误"}), 401

        # 返回用户信息（隐去密码）
        user_info = {
            "customer_id": user['customer_id'],
            "username": user['username'],
            "full_name": user['full_name'],
            "address": user['address'],
            "account_balance": float(user['account_balance']),
            "credit_level": user['credit_level']
        }

        return jsonify({"status": "success", "user": user_info}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)
