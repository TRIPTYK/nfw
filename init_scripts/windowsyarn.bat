mkdir dist\logs
mkdir dist\uploads\documents\xs
mkdir dist\uploads\documents\md
mkdir dist\migration\dump
mkdir dist\uploads\documents\xl
call yarn add bcrypt --save
call yarn global add highlight.js@9.14.2 --dev
ECHO "Installing TypeScript Package"
call yarn global add typescript
ECHO "Installing TypeORM Package"
call yarn global add typeorm
ECHO "Installing Remaining depedencies"
call yarn install
ECHO "Compiling TypeScript"
call tsc
ECHO "Done"
