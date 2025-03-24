set type=%1
set command=npx nodemon

start cmd /k "%command% ./services/auth"
start cmd /k "%command% ./services/recipes"
start cmd /k "%command% ./services/proxy"