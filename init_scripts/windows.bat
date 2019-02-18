mkdir dist1\logs
mkdir dist1\uploads\documents\xs 
mkdir dist1\uploads\documents\md 
mkdir dist1\uploads\documents\xl
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