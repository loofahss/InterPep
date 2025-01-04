import os
import pymysql

# File paths
multiplied_values_file_path = "D:/code/neuropeptide/src/backend/api/pei.txt"

# Database connection details
db_config = {
    "host": "localhost",  # Adjust according to your setup
    "user": "root",
    "password": "your_password",
    "database": "neuropeptide"
}

# Function to load multiplied values from the text file
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

# Connect to the MySQL database
def update_pei_in_db(multiplied_values):
    connection = None
    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            for pdb_name, multiplied_value in multiplied_values.items():
                print(f"Processing PDB: {pdb_name}")
                try:
                    # Split the pdb_name into two parts: ProteinId and PeptideId
                    parts = pdb_name.split("and")
                    print(parts)
                    if len(parts) == 2:  # Ensure that the PDB name has two parts
                        protein_part = str(parts[0])  # Ensure it's a string
                        peptide_part = str(parts[1])  # Ensure it's a string

                        # Query the database for matching ProteinId and PeptideId
                        query = """
                            SELECT ProteinId, PeptideId 
                            FROM protein_peptide 
                            WHERE ProteinId = %s AND PeptideId = %s
                        """
                        cursor.execute(query, (protein_part, peptide_part))
                        result = cursor.fetchone()
                        print(f"Query result: {result}")

                        if result:
                            protein_id, peptide_id = result
                            multiplied_value = str(multiplied_value)
                            
                            print(f"Multiplied value type: {type(multiplied_value)}")
                            # Update the PEI value in the protein_peptide table
                            update_query = "UPDATE protein_peptide SET pei = %s WHERE ProteinId = %s AND PeptideId = %s"
                            cursor.execute(update_query, (multiplied_value, protein_id, peptide_id))
                            

                            print(f"Rows affected: {cursor.rowcount}")

                            
                            # Check if the update was successful
                            if cursor.rowcount > 0:
                                print(f"Updated PEI for ProteinId {protein_id}, PeptideId {peptide_id} with value {multiplied_value}")
                            else:
                                print(f"No rows were updated for ProteinId {protein_id}, PeptideId {peptide_id}")
                        else:
                            print(f"No match found for PDB: {pdb_name}")
                    else:
                        print(f"Invalid PDB format: {pdb_name}")
                except Exception as e:
                    print(f"Error processing PDB {pdb_name}: {e}")

            # Commit the changes to the database
            connection.commit()
    except pymysql.MySQLError as e:
        print(f"Error connecting to MySQL database: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        if connection:
            connection.close()

# Load multiplied values
multiplied_values = load_multiplied_values(multiplied_values_file_path)

# Only proceed if there are multiplied values to process
if multiplied_values:
    # Update PEI values in the database
    update_pei_in_db(multiplied_values)
else:
    print("No multiplied values to process.")

print("Database update process completed.")
