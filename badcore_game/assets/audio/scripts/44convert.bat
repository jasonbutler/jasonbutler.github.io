for %%A IN (.\*.*) DO ffmpeg -i "%%A" -ar 44100 "converted\%%A"