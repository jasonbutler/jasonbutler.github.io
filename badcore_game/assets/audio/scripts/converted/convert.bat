for %%a in ("*.wav") do ffmpeg -y -i "%%a" "%%~na.mp3"
for %%a in ("*.wav") do ffmpeg -y -i "%%a" "%%~na.ogg"
for %%a in ("*.wav") do ffmpeg -y -i "%%a" "%%~na.m4a"
for %%a in ("*.wav") do ffmpeg -y -i "%%a" "%%~na.aac"
pause