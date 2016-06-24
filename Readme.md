Control your EPSON projector connected vio USB or serial cable to your local computer or a remote machine.

Preparation
-----------

Install package `uucp` on the machine that is connected to the projector.

Usage
-----

```
 Usage: escvp21 [options] <connect-command>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

Auto-Detect Projector Model
---------------------------
curl "http://www.epson.co.uk/gb/en/viewcon/corporatesite/modules/warranty_details/search?ajax=true&serial=<SERNO>" |json

Examples
--------

Control projector connected to serial port `ttyUSB0` on local machine:

```
escvp21 "cu -l /dev/ttyUSB0 -s 9600"
```

Control projector connected to serial port `ttyUSB0` on remote machine:

```
escvp21 "ssh -e none user@machine \"cu -l /dev/ttyUSB0 -s 9600\""
```

