var SSH = require('ssh2').Client,
	path = require('path');
    //readline = require('readline');
var t = undefined;

var ssh = new SSH();

function startTail(cmd) {
    ssh.exec(
        cmd,
        function (err, stream) {
            var i=0;
            if (err) return console.log(err);

            stream.on('close', function (code, signal) {
                console.log('close stream', code, signal)
            });
            stream.on('data', function(data) {
                console.log('>>> streamdata incoming');
                //console.log(data.toString())
            });

            stream.on('end', function () {
                console.log('stream end')
            });

            stream.on('error', function(err) {
                console.log('stream ', err)
            });
            // если вернулась ошибка в консольной команде
            stream.stderr.on('data', function (data) {
                console.log(data.toString);
            });
        });
}

    ssh.on('ready', function () {
        setInterval(function(){
            startTail("cat /proc/stat /proc/loadavg");
        }, 1000);
        setInterval(function(){
            startTail("cat /proc/meminfo /proc/vmstat")
        }, 4000);
        setInterval(function(){
            startTail("/sbin/ip -s l")
        }, 4000);
        setInterval(function(){
            startTail("{ sudo -n df -Plx cifs --no-sync && sudo -n df -Plix cifs --no-sync && echo '#M#' && cat /proc/mounts ;}")
        }, 60000);
        setInterval(function(){
            startTail("ps axhk s -o s | uniq -c")
        }, 1000);
    });

    ssh.on('error', function (err) {
        console.log('ssh err',err);
    });

    ssh.on('end', function () {
        console.log('ssh end')
    });

    ssh.on('close', function () {
        console.log('ssh close')
    });

var serviceConfig = {host: 'host.com',
  username: 'user',
  privateKey: require('fs').readFileSync('some_rsa'),
  port: 22,
    keepaliveInterval: 100000,
    keepaliveCountMax: 3,
    debug: console.log
};

ssh.connect(serviceConfig);