Program Sederhana Ground Control System untuk memnonitoring drone dengan menggunakan protokol MQTT dan KAFKA sebagai data streaming dengan tujuan agar komunikasi dengan UAV dapat berjalan dengan lancar ketika melakukan penerbangan di daerah yang memiliki keterbatasan sinyal dan juga dengan adanya Kafka sebagai data streaming mencegah terjadinya kehilangan data. 

Rangkuman troubleshooting dari pembuatan program ini :

# Mengatasi koneksi RC = 2 pada serial monitor Arduino IDE secara local
netsh interface portproxy show all

netsh interface portproxy delete v4tov4 listenaddress=192.168.43.216 listenport=1883 

netsh interface portproxy add v4tov4 listenaddress=192.168.43.216 listenport=1883 connectaddress=127.0.0.1 connectport=1883


# Konfigurasi MQTT di VPS
Masuk ke folder :
sudo nano /etc/mosquitto/mosquitto.conf

Isi konfigurasi : 
pid_file /var/run/mosquitto.pid
persistence true
persistence_location /var/lib/mosquitto/
log_dest file /var/log/mosquitto/mosquitto.log
include_dir /etc/mosquitto/conf.d
allow_anonymous true
listener 1883

# Cara menginstall kafka di VPS
menginstall JAVA JDK yang compatible dengan versi Kafka
download : wget https://downloads.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz
Ekstrak : tar -xzf kafka_2.13-3.7.0.tgz
Masuk folder : cd kafka_2.13-3.7.0
export PATH=$PATH:/path/to/kafka_2.13-3.7.0/bin
cp config/server.properties config/server.properties.bak
Menjalankan zookeeper dan server : 
bin/zookeeper-server-start.sh config/zookeeper.properties
bin/kafka-server-start.sh config/server.properties

# Cara menjalankan kafka di latar belakang dengan nohup pada VPS
nohup bin/zookeeper-server-start.sh config/zookeeper.properties > zookeeper.log 2>&1 &
Melihat hasil log zookeper:
tail -f zookeeper.log

nohup bin/kafka-server-start.sh config/server.properties > kafka.log 2>&1 &
Melihat hasil log server:
tail -f kafka.log

# Cara konfigurasi Nginx di VPS

setting konfigurasi : sudo nano /etc/nginx/sites-available/default

konfigurasi nginx : 
server {
    listen 80;
    server_name 34.69.22.201;  # Ganti dengan nama domain atau alamat IP server Anda

    location / {
        root /home/hafidz853/eahafidz/frontend/dist;  # Ganti dengan path ke direktori build React.js
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /ws/ {
        proxy_pass http://34.69.22.201:8080;  # Ganti dengan alamat dan port server Node.js Anda
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}

stop nginx : sudo systemctl stop nginx
start nginx : sudo systemctl start nginx
restart nginx : sudo systemctl restart nginx


# Cara menjalankan Kafka di local
.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
.\bin\windows\kafka-server-start.bat .\config\server.properties


# cara menjalankan Mosquitto MQTT via CMD local : 
1. masuk ke program files > mosquitto > buka cmd 
2. run syntax untuk subscriber (mosquitto_sub.exe -h 192.168.43.216 -t topic)
3. run syntax untuk publisher (mosquitto_pub.exe -h 127.0.0.1 -t  topic -m "Hello emir al hafidz")	


#push ke repository github yang sudah ada
git remote add origin https://github.com/emiralhafidz/dist.git
git branch -M main
git push -u origin main

#Jika gagal terhubung dengan mysql server maka ada masalah otentifikasi vps
masalahnya :  sqlMessage: 'Client does not support authentication protocol 
cara pertama :
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password bebas';

Cara kedua : 
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password bebas'; 


#cara install mysql server di vps
akun mysql alibaba 
user : root
password : jokam354

sudo apt update
sudo apt upgrade -y

sudo apt install mysql-server -y

sudo systemctl start mysql
sudo systemctl enable mysql


sudo mysql_secure_installation //jika tidak ingin mengatur keamanan bisa langsung ke step bawah


sudo mysql -u root -p



#cara salin file local ke vps
pscp -r D:\SKRIPSI\website\frontend\dist root@34.69.22.201:/home/hafidz853/
pscp -r D:\SKRIPSI\website\backend\mqtt_kafka root@8.222.224.234:/home/
