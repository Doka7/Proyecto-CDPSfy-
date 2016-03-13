#!/usr/bin/python

import sys
import os

#os.system("sudo vnx -f p7.xml -v --create")


os.system("sudo lxc-attach -n nas1 -- gluster peer probe nas2")
os.system("sudo lxc-attach -n nas1 -- gluster peer probe nas3")


os.system("sudo cp -r /home/alex/CDPSfy /var/lib/lxc/s1/rootfs")
os.system("sudo cp -r /home/alex/APIREST /var/lib/lxc/s2/rootfs")
os.system("sudo cp -r /home/alex/APIREST /var/lib/lxc/s3/rootfs")
os.system("sudo cp -r /home/alex/APIREST /var/lib/lxc/s4/rootfs")
os.system("sudo cp  /home/alex/p7/s1_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")
os.system("sudo cp  /home/alex/p7/s2_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")
os.system("sudo cp  /home/alex/p7/s3_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")
os.system("sudo cp  /home/alex/p7/s4_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")
os.system("sudo cp  /home/alex/p7/nas1_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")
os.system("sudo cp  /home/alex/p7/nas2_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")
os.system("sudo cp  /home/alex/p7/nas3_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")
os.system("sudo cp  /home/alex/p7/lb_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")
os.system("sudo cp  /home/alex/p7/hostgroups_nagios2.cfg /var/lib/lxc/m1/rootfs/etc/nagios3/conf.d")


os.system("sudo lxc-attach -n nas1 -- sh -c 'cd /nas && rm *'")
os.system("sudo lxc-attach -n nas2 -- sh -c 'cd /nas && rm *'")
os.system("sudo lxc-attach -n nas3 -- sh -c 'cd /nas && rm *'")


#os.system("sudo lxc-attach -n s1 -- sudo apt-get install node -y")
#os.system("sudo lxc-attach -n s1 -- sudo apt-get install mongodb -y")
#os.system("sudo lxc-attach -n s1 -- sudo apt-get install nodejs -y")
#os.system("sudo lxc-attach -n s1 -- sudo apt-get install node-legacy -y")
os.system("sudo lxc-attach -n s1 -- mkdir -p /data/db")
os.system("sudo lxc-attach -n s1 -- chmod +rwx /data/db")
#os.system("sudo lxc-attach -n s1 -- mongod >/dev/null 2>&1 &")
#os.system("sudo lxc-attach -n s1 -- sh -c 'cd /CDPSfy && npm install && npm start' &")


#os.system("sudo lxc-attach -n s2 -- sudo apt-get install node -y")
#os.system("sudo lxc-attach -n s2 -- sudo apt-get install nodejs -y")
#os.system("sudo lxc-attach -n s2 -- sudo apt-get install node-legacy -y")
os.system("sudo lxc-attach -n s2 -- sh -c 'cd /APIREST && node app.js' &")


#os.system("sudo lxc-attach -n s3 -- sudo apt-get install node -y")
#os.system("sudo lxc-attach -n s3 -- sudo apt-get install nodejs -y")
#os.system("sudo lxc-attach -n s3 -- sudo apt-get install node-legacy -y")
os.system("sudo lxc-attach -n s3 -- sh -c 'cd /APIREST && node app.js' &")


#os.system("sudo lxc-attach -n s4 -- sudo apt-get install node -y")
#os.system("sudo lxc-attach -n s4 -- sudo apt-get install nodejs -y")
#os.system("sudo lxc-attach -n s4 -- sudo apt-get install node-legacy -y")
os.system("sudo lxc-attach -n s4 -- sh -c 'cd /APIREST && node app.js' &")


os.system("sudo lxc-attach -n lb -- service apache2 stop")
os.system("sudo lxc-attach -n lb -- xr --verbose --server tcp:0:80 --url-match tracks --backend 10.1.2.12:80 --backend 10.1.2.13:80 --backend 10.1.2.14:80 --web-interface 0:8001 -d r &")


#os.system("sudo lxc-attach -n m1 -- sh -c 'cd /etc/nagios3/conf.d && rm localhost_nagios2.cfg'")
os.system("sudo lxc-attach -n m1 -- service nagios3 restart")
os.system("sudo lxc-attach -n m1 -- service apache2 restart")
#os.system("sudo lxc-attach -n m1 -- apt-get update")
#os.system("sudo lxc-attach -n m1 -- apt-get install nagios3 -y")


os.system("sudo lxc-attach -n nas1 -- gluster peer status")
os.system("sudo lxc-attach -n nas1 -- gluster volume create nas replica 3 nas1:/nas nas2:/nas nas3:/nas force")
os.system("sudo lxc-attach -n nas1 -- gluster volume start nas")


os.system("sudo lxc-attach -n s2 -- mkdir /mnt/nas")
os.system("sudo lxc-attach -n s2 -- mount -t glusterfs 10.1.3.21:/nas /mnt/nas")
os.system("sudo lxc-attach -n s3 -- mkdir /mnt/nas")
os.system("sudo lxc-attach -n s3 -- mount -t glusterfs 10.1.3.21:/nas /mnt/nas")
os.system("sudo lxc-attach -n s4 -- mkdir /mnt/nas")
os.system("sudo lxc-attach -n s4 -- mount -t glusterfs 10.1.3.21:/nas /mnt/nas")
os.system("sudo cp /home/alex/quaver3.png /var/lib/lxc/s2/rootfs")

















