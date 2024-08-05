CREATE USER file_send WITH PASSWORD 'file_send';
CREATE SCHEMA file_send AUTHORIZATION file_send;
GRANT ALL PRIVILEGES ON SCHEMA file_send TO file_send;
ALTER USER file_send SET search_path TO file_send;
----------------------------------------------------------------

SELECT username,count(file) FROM (SELECT file 
FROM file_upload_uploadedfile fuu 
LEFT JOIN auth_user au 
ON fuu.user_id =au.id) t GROUP BY username;
