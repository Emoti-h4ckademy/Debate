ffmpeg -i http://a3live-lh.akamaihd.net/i/lasexta_1@35272/master.m3u8 -vf fps=1/10 ./snapshots/out$(date +%s)%d.png
