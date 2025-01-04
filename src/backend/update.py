from bcrypt import hashpw, gensalt
import pymysql

# 数据库连接配置
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "password",
    "database": "online_bookstore"
}

# 更新密码为 bcrypt 哈希
def update_passwords():
    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        # 获取所有用户信息
        cursor.execute("SELECT customer_id, password FROM customers")
        users = cursor.fetchall()

        for user_id, plain_password in users:
            if not plain_password.startswith('$2b$'):  # 检查是否已加密
                hashed_password = hashpw(plain_password.encode('utf-8'), gensalt())
                cursor.execute(
                    "UPDATE customers SET password = %s WHERE customer_id = %s",
                    (hashed_password.decode('utf-8'), user_id)
                )

        conn.commit()
        print("Passwords updated successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 调用函数
update_passwords()
