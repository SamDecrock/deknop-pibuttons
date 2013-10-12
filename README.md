deknop-pibuttons
================

The buttons connected to the Raspberry Pi for "De Knop"

##SFTP'en naar Raspberry Pi##
Filezilla: Site Manager, New Site: naam geven

Host:  192.168.1.106

Protocol: SFTP

Password: raspberry

Alles kopieren naar __/home/pi/deknop-pibuttons__

##Connecteren met Raspberry Pi##
ssh pi@192.168.1.106

Password: raspberry

__app.js__ uitvoeren als root (anders geen toegang to IO):
    
    sudo -i node /home/pi/deknop-pibuttons/app/app.js

##Opgelet##
```npm install``` niet vergeten als er packages bijkomen








