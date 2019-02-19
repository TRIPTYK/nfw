mkdir dist\logs
mkdir dist\uploads\documents\xs 
mkdir dist\uploads\documents\md 
mkdir dist\uploads\documents\xl
call npm i bcrypt --save
ECHO "Installing TypeScript Package"
call npm i typescript -g 
ECHO "Installing TypeORM Package"
call npm i typeorm -g
ECHO "Installing Remaining depedencies"
call npm i 
ECHO "Compiling TypeScript"
call tsc
ECHO "Done"
