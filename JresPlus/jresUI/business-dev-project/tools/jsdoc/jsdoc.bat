cd /d %~dp0 &
 java -jar jsrun.jar app\run.js -a -t=templates\documentation ..\target\components\src\scripts\ -d=..\src\main\webapp\documentation\js\ 
echo js ok &
 java -jar jsrun.jar app\run.js -a -t=templates\documentation ..\target\components\src\css\ -d=..\src\main\webapp\documentation\css\ 
echo css ok &
 java -jar jsrun.jar app\run.js -a -t=templates\documentation ..\target\components\src\vm\ -d=..\src\main\webapp\documentation\vm\ echo js ok & pause
exit 