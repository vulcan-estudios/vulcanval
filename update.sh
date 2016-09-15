#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo "\n${YELLOW}Build distribution and documentation files, committing them and updating website branch.${NC}\n"

git status

# Ensure we have committed changes.
echo "\n${YELLOW}Have you committed your changes in master?${NC}"
read -p 'yes/no: ' answer
if [ "$answer" != "yes" ]
then
  echo "\n${RED}You need to commit your changes before procceding.${NC}\n"
  exit
fi

# Needs to be in git master branch.
$isInMaster=`git branch | grep "* master" | wc -l`
if [ "$isInMaster" = 0 ]
then
  echo "\n${RED}You need to be in master branch before procceding.${NC}\n"
  exit
fi

echo "\n${BLUE}>>> Building and committing source code...${NC}\n"

./node_modules/.bin/gulp build
git add --all dist
git commit -m "build: distribution"

echo "\n${BLUE}>>> Creating and committing documentation...${NC}\n"

./node_modules/.bin/gulp docs
git add --all doc
git commit -m "docs: api"

echo "\n${BLUE}>>> Copying files...${NC}\n"

cp -r lib lib.temp
cp -r dist dist.temp
cp -r site site.temp
cp -r demo demo.temp
cp -r doc doc.temp
cp -r index.html index.html.temp
cp -r README.md README.md.temp
cp -r LICENSE LICENSE.temp
cp -r .gitignore .gitignore.temp

echo "\n${BLUE}>>> Changing to gh-pages branch...${NC}\n"

git checkout gh-pages

echo "\n${BLUE}>>> Removing current site files...${NC}\n"

rm -rf lib
rm -rf dist
rm -rf site
rm -rf demo
rm -rf doc
rm -rf index.html
rm -rf README.md
rm -rf LICENSE
rm -rf .gitignore

echo "\n${BLUE}>>> Installing updated files...${NC}\n"

mv -T -f lib.temp lib
mv -T -f dist.temp dist
mv -T -f site.temp site
mv -T -f demo.temp demo
mv -T -f doc.temp doc
mv -T -f index.html.temp index.html
mv -T -f README.md.temp README.md
mv -T -f LICENSE.temp LICENSE
mv -T -f .gitignore.temp .gitignore

echo "\n${BLUE}>>> Committing changes...${NC}\n"

git add --all lib dist site demo doc index.html README.md LICENSE .gitignore
git commit -m "chore: update site"
git push origin gh-pages

echo "\n${BLUE}>>> Changing to master branch...${NC}\n"

git checkout master

echo "\n${GREEN}>>> Repository and site are now updated.${NC}\n"
exit
