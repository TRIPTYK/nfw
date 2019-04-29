mkdir dist\logs
mkdir dist\uploads\documents\xs
mkdir dist\uploads\documents\md
mkdir dist\migration\dump
mkdir dist\uploads\documents\xl
call npm i bcrypt --save
call npm i highlight.js@9.14.2 -D -g
ECHO "Installing TypeScript Package"
call npm i typescript -g
ECHO "Installing TypeORM Package"
call npm i typeorm -g
ECHO "Installing Remaining depedencies"
call npm i
ECHO "Compiling TypeScript"
call node_modules\.bin\tsc --noEmit
ECHO "Done"
