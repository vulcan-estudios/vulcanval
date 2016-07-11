#!/bin/bash

# Build distribution and documentation files, committing them and updating
# site branch.

# Ensure we have committed changes.
read -p "Have you committed your changes in master? (yes/no): " answer
if [ "$answer" != "yes" ]
then
  echo "You need to commit your changes before procceding."
  exit
fi

# Needs to be in git master branch.
$isInMaster=`git branch | grep "* master" | wc -l`
if [ "$isInMaster" = 0 ]
then
  echo "You need to be in master branch before procceding."
  exit
fi

echo ">>> Building and committing source code..."

gulp build
git add --all dist
git commit -m "build: distribution"

echo ">>> Creating and committing documentation..."

gulp doc
git add --all doc
git commit -m "docs: api"

echo ">>> Copying files..."

cp -r lib lib.temp
cp -r dist dist.temp
cp -r site site.temp
cp -r demo demo.temp
cp -r doc doc.temp
cp -r index.html index.html.temp
cp -r README.md README.md.temp
cp -r LICENSE LICENSE.temp
cp -r .gitignore .gitignore.temp

echo ">>> Changing to gh-pages branch..."

git checkout gh-pages

echo ">>> Removing current site files..."

rm -rf lib
rm -rf dist
rm -rf site
rm -rf demo
rm -rf doc
rm -rf index.html
rm -rf README.md
rm -rf LICENSE
rm -rf .gitignore

echo ">>> Installing updated files..."

mv -T -f lib.temp lib
mv -T -f dist.temp dist
mv -T -f site.temp site
mv -T -f demo.temp demo
mv -T -f doc.temp doc
mv -T -f index.html.temp index.html
mv -T -f README.md.temp README.md
mv -T -f LICENSE.temp LICENSE
mv -T -f .gitignore.temp .gitignore

echo ">>> Committing changes..."

git add --all lib dist site demo doc index.html README.md LICENSE .gitignore
git commit -m "chore: update site"
git push origin gh-pages

echo ">>> Changing to master branch..."

git checkout master

echo ">>> Repository and site are now updated."
exit
