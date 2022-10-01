@echo off
:loop
set /p input="URL: "
yt-dlp.exe %input% -P "./../videos"
goto loop