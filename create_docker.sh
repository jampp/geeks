docker build . --rm -t jampp/geeks
docker run -d -p9999:9999 -p3001:3001 --name geeks -v $PWD:/geeks -i jampp/geeks
