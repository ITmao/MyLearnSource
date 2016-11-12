cd ../lib &
java -jar jresplusUIRun.jar -f=true &
cd ../.. &
call mvn clean install & 
cd tools/lib &
call java -jar jresplusUIRun.jar & 
cd ../.. &
call mvn install & pause
exit